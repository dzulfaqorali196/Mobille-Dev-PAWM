FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Railway akan menyediakan PORT sebagai environment variable
ENV PORT=8000

# Gunakan variable PORT dari environment
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT} 