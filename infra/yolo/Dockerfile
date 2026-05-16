# syntax=docker/dockerfile:1

# Stage 1: Builder
FROM ubuntu:24.04 AS builder
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt --break-system-packages

# Pre-bake YOLOv8 Nano model for offline deployment
RUN python3 -c "from ultralytics import YOLO; YOLO('yolov8n.pt')"

# Stage 2: Final
FROM ubuntu:24.04
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    curl \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from=builder /usr/local/lib/python3.12/dist-packages /usr/local/lib/python3.12/dist-packages
COPY --from=builder /root/.config/Ultralytics/yolov8n.pt /app/models/yolov8n.pt
COPY main.py .

EXPOSE 5005
ENV YOLO_MODEL_PATH=/app/models/yolov8n.pt

# Healthcheck dependency
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

CMD ["python3", "main.py"]
