import os
import torch
import psutil
import gc
from fastapi import FastAPI, HTTPException, File, UploadFile
from pydantic import BaseModel
from typing import List, Dict, Optional, Any
from transformers import AutoProcessor, AutoModelForCausalLM, BitsAndBytesConfig
from ultralytics import YOLO
from PIL import Image
import io
import uvicorn
import time
import traceback
from transcribe import transcribe as whisper_transcribe

# --- CONFIGURATION ---
PORT = 3002
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
MODELS = {}
MAX_MODELS = 1 # Shared Limit for Vision + Language

print(f"🚀 [AI SERVER] Starting Unified Gemma-YOLO Spine (Resource-Harden Mode)...")
print(f"🖥️ [AI SERVER] Device Detected: {DEVICE}")

def load_agent_model(model_id: str, is_vision: bool = False):
    """Load model (Gemma or YOLO) with unified LRU management"""
    global MODELS
    
    if model_id in MODELS:
        return MODELS[model_id]
    
    # 1. Clear memory for the incoming model
    if len(MODELS) >= MAX_MODELS:
        for old_id in list(MODELS.keys()):
            print(f"🧹 [AI SERVER] Unloading {old_id} to free RAM...")
            del MODELS[old_id]
        gc.collect()
        if DEVICE == "cuda":
            torch.cuda.empty_cache()
    
    try:
        if is_vision:
            print(f"👁️ [AI SERVER] Loading Vision Model: {model_id}...")
            # YOLO Nano is ultra-light but we still cache it
            model = YOLO(f"{model_id}.pt")
            MODELS[model_id] = (None, model)
        else:
            print(f"⏳ [AI SERVER] Loading Language Agent: {model_id}...")
            processor = AutoProcessor.from_pretrained(model_id)
            bnb_config = BitsAndBytesConfig(
                load_in_4bit=True,
                bnb_4bit_compute_dtype=torch.bfloat16,
                bnb_4bit_quant_type="nf4",
                bnb_4bit_use_double_quant=True,
            ) if DEVICE == "cuda" else None

            model = AutoModelForCausalLM.from_pretrained(
                model_id,
                quantization_config=bnb_config,
                torch_dtype=torch.bfloat16 if DEVICE == "cuda" else torch.float32,
                device_map="auto" if DEVICE == "cuda" else None,
                low_cpu_mem_usage=True
            )
            MODELS[model_id] = (processor, model)
            
        print(f"✅ [AI SERVER] {model_id} is ONLINE (Free RAM: {psutil.virtual_memory().available / (1024**3):.2f} GB).")
        return MODELS[model_id]
    except Exception as e:
        print(f"❌ [AI SERVER] FAILED to load {model_id}: {e}")
        return None, None

# --- API MODELS ---
class Message(BaseModel):
    role: str
    content: str

class ChatCompletionRequest(BaseModel):
    model: str
    messages: List[Message]
    temperature: Optional[float] = 0.7
    max_tokens: Optional[int] = 1024

app = FastAPI(title="HURC Gemma-Nemo Spine")

@app.get("/health")
async def health():
    return {
        "status": "online", 
        "device": DEVICE, 
        "loaded_agents": list(MODELS.keys()),
        "ram_free_gb": round(psutil.virtual_memory().available / (1024**3), 2)
    }

@app.get("/v1/models")
async def list_models():
    """OpenAI-compatible model list"""
    return {
        "object": "list",
        "data": [
            {"id": "google/gemma-4-E2B-it", "object": "model", "created": int(time.time()), "owned_by": "google"},
            {"id": "google/gemma-4-E4B-it", "object": "model", "created": int(time.time()), "owned_by": "google"},
            {"id": "yolov8n", "object": "model", "created": int(time.time()), "owned_by": "ultralytics"}
        ]
    }

@app.post("/v1/chat/completions")
async def chat_completions(request: ChatCompletionRequest):
    # Resolve which Gemma Agent to use
    processor, model = load_agent_model(request.model)
    
    if not model or not processor:
        raise HTTPException(status_code=503, detail=f"Agent Model {request.model} could not be loaded.")
    
    try:
        # 1. Format Chat History
        formatted_messages = [{"role": m.role, "content": m.content} for m in request.messages]
        
        # 2. Process input
        text = processor.apply_chat_template(
            formatted_messages,
            tokenize=False,
            add_generation_prompt=True
        )
        
        inputs = processor(text=text, return_tensors="pt").to(model.device)
        input_len = inputs["input_ids"].shape[-1]

        # 3. Generate output
        with torch.no_grad():
            outputs = model.generate(
                **inputs, 
                max_new_tokens=request.max_tokens or 1024,
                temperature=request.temperature or 0.7,
                do_sample=True if (request.temperature or 0.7) > 0 else False
            )
        
        # 4. Decode Response
        response_text = processor.decode(outputs[0][input_len:], skip_special_tokens=True)
        
        # 5. Return in OpenAI Format
        return {
            "id": f"chatcmpl-{int(time.time())}",
            "object": "chat.completion",
            "created": int(time.time()),
            "model": request.model,
            "choices": [
                {
                    "index": 0,
                    "message": {"role": "assistant", "content": response_text},
                    "finish_reason": "stop"
                }
            ]
        }
    
    except Exception as e:
        print(f"❌ [AI SERVER] INFERENCE ERROR: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/detect")
async def detect(file: UploadFile = File(...)):
    """Perform YOLO Object Detection (Part of Unified Spine)"""
    # 1. Load YOLO Agent via LRU (unload others if needed)
    _, model = load_agent_model('yolov8n', is_vision=True)
    
    if not model:
        raise HTTPException(status_code=503, detail="YOLO Vision Agent could not be loaded.")
    
    try:
        # 2. Process Image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        
        # 3. Detect
        results = model(image)
        
        detections = []
        for result in results:
            for box in result.boxes:
                detections.append({
                    "box": box.xyxy[0].tolist(),
                    "label": model.names[int(box.cls[0])],
                    "confidence": float(box.conf[0]),
                    "class_id": int(box.cls[0])
                })
        
        return {
            "detections": detections, 
            "count": len(detections),
            "image_size": {"width": image.width, "height": image.height}
        }
    except Exception as e:
        print(f"❌ [AI SERVER] DETECTION ERROR: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ai/transcribe")
async def api_transcribe(file: UploadFile = File(...)):
    """Perform Offline Speech-to-Text using Whisper"""
    try:
        contents = await file.read()
        text = whisper_transcribe(contents)
        return {"text": text}
    except Exception as e:
        print(f"❌ [AI SERVER] TRANSCRIBE ERROR: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=PORT)
