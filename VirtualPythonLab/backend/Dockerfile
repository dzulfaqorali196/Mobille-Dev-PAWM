FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Default environment variables
ENV PORT=8000
ENV ALLOWED_HOSTS=["*"]
ENV CORS_ORIGINS=["*"]
ENV COMPILER_TIMEOUT=30
ENV NODE_ENV=production

# Gunakan variable PORT dari environment
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT} 