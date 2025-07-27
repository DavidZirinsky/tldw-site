import os
import json
import requests
from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import re
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

proxy_config = {'http': f"http://{os.environ.get('PROXY_URL')}", 'https': f"http://{os.environ.get('PROXY_URL')}"}
summarizer = tldw(openai_api_key=os.environ.get('OPENAI_API_KEY'))
                #   proxies=proxy_config)

def stream_process(youtube_url: str):
    """Generator function that performs the work and yields the stream."""
    try:
        yield b"Starting process...\n"
        
        # Extract video ID from URL
        video_id_match = re.search(r'(?:youtube\.com/watch\?v=|youtu\.be/)([^&\n?#]+)', youtube_url)
        if not video_id_match:
            yield json.dumps({"error": "Invalid YouTube URL"}).encode("utf-8")
            return
        
        video_id = video_id_match.group(1)
        yield f"Extracting video ID: {video_id}\n".encode("utf-8")

        summary_chunks = summarizer.stream_summary(youtube_url=youtube_url)

        for chunk in summary_chunks:
            yield chunk

    except Exception as e:
        print(f"Unexpected error: {e}")
        yield json.dumps({"error": f"Unexpected error: {str(e)}"}).encode("utf-8")

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

# for local dev
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)