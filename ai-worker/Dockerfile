# Phase 3 - Task 3.3: Containerization for AI Worker
FROM python:3.13-slim

# Cài đặt các thư viện hệ thống cần thiết cho OpenCV và YOLO
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements và cài đặt
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .

# Mặc định RabbitMQ host là 'rabbitmq' (tên service trong docker-compose)
ENV RABBITMQ_HOST=rabbitmq
ENV API_PORT=8000

EXPOSE 8000

# Chạy cả worker và api (Sử dụng script khởi động nếu cần, hoặc chạy api làm chính)
CMD ["python", "main.py"]
