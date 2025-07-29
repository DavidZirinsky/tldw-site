import json
from unittest.mock import patch

from src.app import stream_process


def test_status_endpoint(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "tldw"}


def test_summarize_endpoint_missing_url(client):
    response = client.get("/sum")
    assert response.status_code == 422


def test_summarize_endpoint_empty_url(client):
    response = client.get("/sum?url=")
    assert response.status_code == 400


@patch("src.app.summarizer.stream_summary")
def test_summarize_endpoint_valid_url(mock_stream_summary, client):
    mock_stream_summary.return_value = iter([b"Test summary chunk"])

    response = client.get("/sum?url=https://youtube.com/watch?v=test123")

    assert response.status_code == 200
    assert response.headers["content-type"] == "text/plain; charset=utf-8"


@patch("src.app.summarizer.stream_summary")
def test_stream_process_valid_youtube_url(mock_stream_summary):
    mock_stream_summary.return_value = iter([b"Summary chunk 1", b"Summary chunk 2"])

    youtube_url = "https://youtube.com/watch?v=test123"
    generator = stream_process(youtube_url)
    chunks = list(generator)

    assert b"Starting process..." in chunks[0]
    assert b"Processing URL: https://www.youtube.com/watch?v=test123" in chunks[1]
    assert b"Summary chunk 1" in chunks
    assert b"Summary chunk 2" in chunks
    assert b"--- End of summary ---" in chunks[-1]


@patch("src.app.summarizer.stream_summary")
def test_stream_process_valid_mobile_youtube_url(mock_stream_summary):
    mock_stream_summary.return_value = iter([b"Summary chunk 1", b"Summary chunk 2"])

    youtube_url = (
        "https://m.youtube.com/watch?si=Jss4-zsna5StOA0O&v=vyRnVq2-UWU&feature=youtu.be"
    )
    generator = stream_process(youtube_url)
    chunks = list(generator)

    assert b"Starting process..." in chunks[0]
    assert b"Processing URL: https://www.youtube.com/watch?v=vyRnVq2-UWU" in chunks[1]
    assert b"Summary chunk 1" in chunks
    assert b"Summary chunk 2" in chunks
    assert b"--- End of summary ---" in chunks[-1]


def test_stream_process_invalid_youtube_url():
    invalid_url = "https://invalid-url.com"
    generator = stream_process(invalid_url)
    chunks = list(generator)

    assert b"Starting process..." in chunks[0]
    error_chunk = None
    for chunk in chunks:
        if b"Invalid YouTube URL" in chunk:
            error_chunk = chunk
            break

    assert error_chunk is not None
    error_data = json.loads(error_chunk.decode("utf-8"))
    assert error_data["error"] == "Invalid YouTube URL"


@patch("src.app.summarizer.stream_summary")
def test_stream_process_youtu_be_url(mock_stream_summary):
    mock_stream_summary.return_value = iter([b"Summary chunk"])

    youtube_url = "https://youtu.be/test456"
    generator = stream_process(youtube_url)
    chunks = list(generator)

    assert b"Processing URL: https://youtu.be/test456" in chunks[1]
    mock_stream_summary.assert_called_once_with(youtube_url=youtube_url)


@patch("src.app.summarizer.stream_summary")
def test_stream_process_exception_handling(mock_stream_summary):
    mock_stream_summary.side_effect = Exception("Test exception")

    youtube_url = "https://youtube.com/watch?v=test123"
    generator = stream_process(youtube_url)
    chunks = list(generator)

    error_chunk = None
    for chunk in chunks:
        try:
            data = json.loads(chunk.decode("utf-8"))
            if "error" in data and "Test exception" in data["error"]:
                error_chunk = chunk
                break
        except json.JSONDecodeError:
            continue

    assert error_chunk is not None
