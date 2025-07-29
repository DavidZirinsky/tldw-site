import json
import logging
import os

import uvicorn
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from tldw import tldw

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

summarizer = tldw(openai_api_key=os.environ.get("OPENAI_API_KEY"))


def stream_process(youtube_url: str):
    """Generator function that performs the work and yields the stream."""
    try:
        yield b"Starting process...\n"

        # Very light validation - just check if it looks like a YouTube URL
        if not ("youtube.com" in youtube_url or "youtu.be" in youtube_url):
            yield json.dumps({"error": "Invalid YouTube URL"}).encode("utf-8")
            return

        # Try to clean the URL - remove mobile prefix and extra parameters that might confuse tldw
        cleaned_url = youtube_url.replace("m.youtube.com", "www.youtube.com")
        if "youtube.com/watch" in cleaned_url and "v=" in cleaned_url:
            # Extract just the essential parts
            from urllib.parse import parse_qs, urlparse

            parsed = urlparse(cleaned_url)
            video_id = parse_qs(parsed.query).get("v", [None])[0]
            if video_id:
                cleaned_url = f"https://www.youtube.com/watch?v={video_id}"

        yield f"Processing URL: {cleaned_url}\n".encode("utf-8")

        summary_chunks = summarizer.stream_summary(youtube_url=youtube_url)

        for chunk in summary_chunks:
            yield chunk

    except Exception as e:
        logging.error(f"Unexpected error: {e}")
        yield json.dumps({"error": f"There was an issue fetching that: {e}"}).encode(
            "utf-8"
        )

    yield b"\n--- End of summary ---\n"


@app.get("/")
def status():
    return {"status": "ok", "service": "tldw"}


@app.get("/sum", response_class=StreamingResponse)
def summarize(url: str = Query(..., description="YouTube video URL to summarize")):
    """
    Stream back status updates, transcript extraction, and LLM summary chunks.
    """
    # Validate URL presence
    if not url:
        raise HTTPException(status_code=400, detail="Missing `url` query parameter")

    # Wrap our generator in a StreamingResponse
    return StreamingResponse(
        stream_process(url),
        media_type="text/plain; charset=utf-8",
    )


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)
