import io
import uvicorn
from fastapi import FastAPI, File, UploadFile
from PIL import Image
from ultralytics import YOLO
import numpy as np

app = FastAPI(title="HURC YOLO AI Service")

# Tải mô hình YOLOv8 Nano (nhẹ và nhanh nhất cho môi trường Docker không GPU)
model = YOLO('yolov8n.pt')

@app.get("/health")
async def health():
    return {"status": "healthy", "model": "yolov8n"}

@app.post("/detect")
async def detect(file: UploadFile = File(...)):
    # Đọc hình ảnh từ request
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")
    
    # Thực hiện inferencing
    results = model(image)
    
    detections = []
    for result in results:
        boxes = result.boxes
        for box in boxes:
            # Lấy tọa độ bounding box (x1, y1, x2, y2)
            coords = box.xyxy[0].tolist()
            # Lấy confidence score và class name
            conf = float(box.conf[0])
            cls_id = int(box.cls[0])
            label = model.names[cls_id]
            
            detections.append({
                "box": coords,
                "label": label,
                "confidence": conf,
                "class_id": cls_id
            })
    
    return {
        "detections": detections,
        "count": len(detections),
        "image_size": {
            "width": image.width,
            "height": image.height
        }
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5005)
