import gc
import io
import os
import time
from pathlib import Path
from typing import Dict, List, Optional, Tuple

os.environ.setdefault("HF_HUB_OFFLINE", "1")
os.environ.setdefault("TRANSFORMERS_OFFLINE", "1")
os.environ.setdefault("HF_DATASETS_OFFLINE", "1")
os.environ.setdefault("TOKENIZERS_PARALLELISM", "false")

import psutil
import torch
import uvicorn
from fastapi import Depends, FastAPI, File, Header, HTTPException, UploadFile
from PIL import Image, UnidentifiedImageError
from pydantic import BaseModel, Field, field_validator
from transformers import AutoModelForCausalLM, AutoProcessor, AutoTokenizer, BitsAndBytesConfig
from ultralytics import YOLO

from transcribe import transcribe as whisper_transcribe

PORT = int(os.getenv("AI_SERVER_PORT", "3002"))
BIND_HOST = os.getenv("AI_BIND_HOST", "0.0.0.0")
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
MAX_MODELS = max(1, min(int(os.getenv("AI_MAX_LOADED_MODELS", "1")), 2))
MAX_MESSAGES = 64
MAX_MESSAGE_CHARS = 32_000
MAX_PROMPT_CHARS = 120_000
MAX_OUTPUT_TOKENS = 4_096
MAX_UPLOAD_BYTES = max(1_048_576, min(int(os.getenv("AI_MAX_UPLOAD_BYTES", "10485760")), 25_165_824))
SERVICE_TOKEN = os.getenv("LOCAL_AI_SERVICE_TOKEN", "")
MODELS: Dict[str, Tuple[object, object]] = {}
Image.MAX_IMAGE_PIXELS = int(os.getenv("AI_MAX_IMAGE_PIXELS", "40000000"))


def parse_model_allowlist(raw_value: str) -> Dict[str, Path]:
    models: Dict[str, Path] = {}
    for item in raw_value.split(","):
        if not item.strip() or "=" not in item:
            continue
        alias, raw_path = item.split("=", 1)
        alias = alias.strip()
        model_path = Path(raw_path.strip()).expanduser().resolve()
        if alias and alias.replace("-", "").replace("_", "").isalnum():
            models[alias] = model_path
    return models


ALLOWED_LANGUAGE_MODELS = parse_model_allowlist(
    os.getenv(
        "LOCAL_LANGUAGE_MODELS",
        "gemma-4-e2b=/models/gemma-4-e2b,orthrus-qwen3-8b=/models/orthrus-qwen3-8b",
    )
)
YOLO_MODEL_PATH = Path(os.getenv("LOCAL_YOLO_MODEL_PATH", "/models/yolov8n.pt")).expanduser().resolve()


async def require_internal_token(authorization: Optional[str] = Header(default=None)) -> None:
    if not SERVICE_TOKEN:
        return
    if authorization != f"Bearer {SERVICE_TOKEN}":
        raise HTTPException(status_code=401, detail="Unauthorized local AI request.")


def ensure_local_model(alias: str) -> Path:
    model_path = ALLOWED_LANGUAGE_MODELS.get(alias)
    if model_path is None:
        raise HTTPException(status_code=400, detail="Requested model is not in the local allowlist.")
    if not model_path.exists() or not model_path.is_dir():
        raise HTTPException(status_code=503, detail="Approved local model is not mounted.")
    return model_path


def unload_models_if_needed(incoming_alias: str) -> None:
    if incoming_alias in MODELS or len(MODELS) < MAX_MODELS:
        return
    for old_alias in list(MODELS.keys()):
        del MODELS[old_alias]
    gc.collect()
    if DEVICE == "cuda":
        torch.cuda.empty_cache()


def load_language_model(alias: str):
    if alias in MODELS:
        return MODELS[alias]
    model_path = ensure_local_model(alias)
    unload_models_if_needed(alias)

    processor = None
    try:
        processor = AutoProcessor.from_pretrained(
            str(model_path),
            local_files_only=True,
            trust_remote_code=False,
        )
    except Exception:
        processor = AutoTokenizer.from_pretrained(
            str(model_path),
            local_files_only=True,
            trust_remote_code=False,
        )

    quantization = BitsAndBytesConfig(
        load_in_4bit=True,
        bnb_4bit_compute_dtype=torch.bfloat16,
        bnb_4bit_quant_type="nf4",
        bnb_4bit_use_double_quant=True,
    ) if DEVICE == "cuda" else None

    model = AutoModelForCausalLM.from_pretrained(
        str(model_path),
        local_files_only=True,
        trust_remote_code=False,
        quantization_config=quantization,
        torch_dtype=torch.bfloat16 if DEVICE == "cuda" else torch.float32,
        device_map="auto" if DEVICE == "cuda" else None,
        low_cpu_mem_usage=True,
    )
    MODELS[alias] = (processor, model)
    return MODELS[alias]


def load_yolo_model():
    alias = "yolo-local"
    if alias in MODELS:
        return MODELS[alias][1]
    if not YOLO_MODEL_PATH.exists() or not YOLO_MODEL_PATH.is_file():
        raise HTTPException(status_code=503, detail="Approved local YOLO model is not mounted.")
    unload_models_if_needed(alias)
    model = YOLO(str(YOLO_MODEL_PATH))
    MODELS[alias] = (None, model)
    return model


class Message(BaseModel):
    role: str = Field(pattern="^(system|user|assistant|tool)$")
    content: str = Field(min_length=1, max_length=MAX_MESSAGE_CHARS)


class ChatCompletionRequest(BaseModel):
    model: str = Field(min_length=1, max_length=80)
    messages: List[Message] = Field(min_length=1, max_length=MAX_MESSAGES)
    temperature: float = Field(default=0.2, ge=0, le=1)
    max_tokens: int = Field(default=1024, ge=1, le=MAX_OUTPUT_TOKENS)

    @field_validator("messages")
    @classmethod
    def validate_total_prompt_size(cls, messages: List[Message]) -> List[Message]:
        if sum(len(message.content) for message in messages) > MAX_PROMPT_CHARS:
            raise ValueError("Total prompt is too large.")
        return messages


app = FastAPI(
    title="HURC Local AI Spine",
    docs_url=None,
    redoc_url=None,
    openapi_url=None,
)


@app.get("/health", dependencies=[Depends(require_internal_token)])
async def health():
    return {
        "status": "online",
        "mode": "local-offline-only",
        "device": DEVICE,
        "loaded_model_count": len(MODELS),
    }


@app.get("/v1/models", dependencies=[Depends(require_internal_token)])
async def list_models():
    now = int(time.time())
    return {
        "object": "list",
        "data": [
            {"id": alias, "object": "model", "created": now, "owned_by": "hurc-local"}
            for alias in sorted(ALLOWED_LANGUAGE_MODELS)
        ] + [{"id": "yolo-local", "object": "model", "created": now, "owned_by": "hurc-local"}],
    }


@app.post("/v1/chat/completions", dependencies=[Depends(require_internal_token)])
async def chat_completions(request: ChatCompletionRequest):
    try:
        processor, model = load_language_model(request.model)
        formatted_messages = [
            {"role": message.role, "content": message.content}
            for message in request.messages
        ]
        text = processor.apply_chat_template(
            formatted_messages,
            tokenize=False,
            add_generation_prompt=True,
        )
        inputs = processor(text=text, return_tensors="pt").to(model.device)
        input_length = inputs["input_ids"].shape[-1]
        with torch.inference_mode():
            outputs = model.generate(
                **inputs,
                max_new_tokens=request.max_tokens,
                temperature=request.temperature,
                do_sample=request.temperature > 0,
            )
        response_text = processor.decode(outputs[0][input_length:], skip_special_tokens=True)
        return {
            "id": f"local-{int(time.time())}",
            "object": "chat.completion",
            "created": int(time.time()),
            "model": request.model,
            "choices": [{
                "index": 0,
                "message": {"role": "assistant", "content": response_text},
                "finish_reason": "stop",
            }],
        }
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Local inference failed.")


async def read_bounded_upload(file: UploadFile) -> bytes:
    content = await file.read(MAX_UPLOAD_BYTES + 1)
    if len(content) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="Uploaded file exceeds the local AI limit.")
    return content


@app.post("/detect", dependencies=[Depends(require_internal_token)])
async def detect(file: UploadFile = File(...)):
    if file.content_type not in {"image/jpeg", "image/png", "image/webp"}:
        raise HTTPException(status_code=415, detail="Unsupported image type.")
    try:
        content = await read_bounded_upload(file)
        image = Image.open(io.BytesIO(content))
        image.verify()
        image = Image.open(io.BytesIO(content)).convert("RGB")
        model = load_yolo_model()
        detections = []
        for result in model(image, verbose=False):
            for box in result.boxes:
                detections.append({
                    "box": box.xyxy[0].tolist(),
                    "label": model.names[int(box.cls[0])],
                    "confidence": float(box.conf[0]),
                    "class_id": int(box.cls[0]),
                })
        return {"detections": detections, "count": len(detections)}
    except HTTPException:
        raise
    except (UnidentifiedImageError, Image.DecompressionBombError):
        raise HTTPException(status_code=400, detail="Invalid or unsafe image.")
    except Exception:
        raise HTTPException(status_code=500, detail="Local image detection failed.")


@app.post("/api/ai/transcribe", dependencies=[Depends(require_internal_token)])
async def api_transcribe(file: UploadFile = File(...)):
    if file.content_type not in {"audio/wav", "audio/mpeg", "audio/mp4", "audio/x-m4a", "audio/ogg"}:
        raise HTTPException(status_code=415, detail="Unsupported audio type.")
    try:
        content = await read_bounded_upload(file)
        return {"text": whisper_transcribe(content)}
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Local transcription failed.")


if __name__ == "__main__":
    print(f"[AI SERVER] local-only startup on {BIND_HOST}:{PORT}; device={DEVICE}; models={len(ALLOWED_LANGUAGE_MODELS)}")
    print(f"[AI SERVER] free_ram_gb={psutil.virtual_memory().available / (1024 ** 3):.2f}")
    uvicorn.run(app, host=BIND_HOST, port=PORT, access_log=False)
