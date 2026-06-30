import io
import os
import uvicorn
from fastapi import FastAPI, File, UploadFile, HTTPException, Query
from PIL import Image, UnidentifiedImageError
from ultralytics import YOLO

app = FastAPI(title="HURC YOLO AI Service")

MODEL_PATH = os.getenv("YOLO_MODEL_PATH", "yolov8n.pt")
MAX_IMAGE_BYTES = int(os.getenv("YOLO_MAX_IMAGE_BYTES", str(8 * 1024 * 1024)))
SUPPORTED_TYPES = {"image/jpeg", "image/png", "image/webp"}

model = YOLO(MODEL_PATH)

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "model": os.path.basename(MODEL_PATH),
        "max_image_bytes": MAX_IMAGE_BYTES,
    }

@app.post("/detect")
async def detect(
    file: UploadFile = File(...),
    conf: float = Query(0.35, ge=0.05, le=0.95),
    iou: float = Query(0.45, ge=0.10, le=0.90),
    max_det: int = Query(50, ge=1, le=200),
):
    if file.content_type not in SUPPORTED_TYPES:
        raise HTTPException(status_code=415, detail="Unsupported image type")

    contents = await file.read()
    if len(contents) > MAX_IMAGE_BYTES:
        raise HTTPException(status_code=413, detail="Image is too large")

    try:
        image = Image.open(io.BytesIO(contents)).convert("RGB")
    except UnidentifiedImageError:
        raise HTTPException(status_code=400, detail="Invalid image file")

    results = model(image, conf=conf, iou=iou, max_det=max_det, verbose=False)

    detections = []
    for result in results:
        for box in result.boxes:
            cls_id = int(box.cls[0])
            detections.append({
                "box": [float(v) for v in box.xyxy[0].tolist()],
                "label": model.names.get(cls_id, str(cls_id)),
                "confidence": float(box.conf[0]),
                "class_id": cls_id,
            })

    return {
        "detections": detections,
        "count": len(detections),
        "image_size": {
            "width": image.width,
            "height": image.height,
        },
        "inference": {
            "model": os.path.basename(MODEL_PATH),
            "conf": conf,
            "iou": iou,
            "max_det": max_det,
        },
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5005)
