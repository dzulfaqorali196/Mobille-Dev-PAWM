FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Default environment variables
ENV PORT=8000
ENV ALLOWED_HOSTS='["*"]'
ENV CORS_ORIGINS='["*"]'
ENV COMPILER_TIMEOUT=30

# Expose the port
EXPOSE ${PORT}

# Start the FastAPI application
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT} 