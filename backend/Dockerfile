FROM python:3.12.0-slim-bullseye

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    jq \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy application code
COPY . .

RUN rm -rf /root/.cache

# make file system read only
RUN chmod a-w /app

# Create a group with GID 1000 and a non-root user, so kubernetes can enforce this as well
RUN groupadd -g 1000 appuser && \
    useradd -u 1000 -g appuser -s /bin/bash -m appuser

# Change ownership of the application files to the non-root user
RUN chown -R appuser:appuser /app

# Switch to the non-root user
USER appuser

ENV PORT=${PORT:-8080}

# Use the PORT environment variable set by Heroku
CMD uvicorn src.app:app --host 0.0.0.0 --port $PORT