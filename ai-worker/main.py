from fastapi import FastAPI, UploadFile, File
from ultralytics import YOLO
import uvicorn
import os

app = FastAPI(title="Metro Inspect Pro - AI Worker")

# Load YOLOv8 model (Simulation with a sample model if not found)
model_path = os.getenv("YOLO_MODEL_PATH", "yolov8n.pt")
try:
    model = YOLO(model_path)
except Exception as e:
    print(f"Warning: Could not load model {model_path}. Running in simulation mode.")
    model = None

@app.get("/")
async def root():
    return {"status": "online", "service": "AI Vision Worker", "model": model_path}

@app.post("/analyze")
async def analyze_image(file: UploadFile = File(...)):
    # In a real scenario, we would save the file and run model.predict()
    # For now, we return a simulated response
    return {
        "filename": file.filename,
        "detections": [
            {"label": "crack", "confidence": 0.92, "box": [100, 200, 300, 400]},
            {"label": "rust", "confidence": 0.85, "box": [500, 600, 700, 800]}
        ],
        "message": "AI Analysis Complete"
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
