import json
import os
import re
import threading
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Literal

import mlflow
import yaml
from fastapi import Depends, FastAPI, File, Form, Header, HTTPException, UploadFile
from PIL import Image
from pydantic import BaseModel, Field
from ultralytics import YOLO

DATA_ROOT = Path(os.getenv("VISION_DATA_ROOT", "/data"))
MODEL_ROOT = Path(os.getenv("VISION_MODEL_ROOT", "/models"))
STATE_FILE = DATA_ROOT / "state.json"
TOKEN = os.getenv("VISION_TRAINER_TOKEN", "")
TRAINING_ENABLED = os.getenv("VISION_TRAINING_ENABLED", "false").lower() == "true"
MAX_UPLOAD_BYTES = min(32 * 1024 * 1024, max(256 * 1024, int(os.getenv("VISION_MAX_UPLOAD_BYTES", str(12 * 1024 * 1024)))))
MIN_APPROVED_PER_CLASS = min(10000, max(1, int(os.getenv("VISION_MIN_APPROVED_PER_CLASS", "20"))))
MAX_EPOCHS = min(500, max(1, int(os.getenv("VISION_MAX_EPOCHS", "200"))))
ALLOWED_BASE_MODELS = set(filter(None, os.getenv("VISION_ALLOWED_BASE_MODELS", "yolo11n.pt,yolo11s.pt,yolo11m.pt").split(",")))
ALLOWED_TYPES = {"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp"}
LOCK = threading.RLock()
app = FastAPI(title="HURC Vision Training Control Plane", version="1.0.0")


class DatasetCreate(BaseModel):
    name: str = Field(min_length=3, max_length=120)
    classes: list[str] = Field(min_length=1, max_length=200)
    description: str = Field(default="", max_length=2000)


class TrainingRequest(BaseModel):
    datasetId: str
    baseModel: str = "yolo11n.pt"
    epochs: int = Field(default=50, ge=1, le=500)
    imageSize: int = Field(default=640, ge=320, le=1280)
    batchSize: int = Field(default=8, ge=1, le=128)


class ReviewDecision(BaseModel):
    note: str = Field(default="", max_length=2000)


def now_iso():
    return datetime.now(timezone.utc).isoformat()


def normalize_mlflow_metric_name(value: str):
    normalized = re.sub(r"[^A-Za-z0-9_. /:-]", "_", value)
    return normalized or "metric"


def default_state():
    return {"datasets": {}, "samples": {}, "jobs": {}}


def load_state():
    DATA_ROOT.mkdir(parents=True, exist_ok=True)
    MODEL_ROOT.mkdir(parents=True, exist_ok=True)
    if not STATE_FILE.exists():
        return default_state()
    try:
        return json.loads(STATE_FILE.read_text("utf-8"))
    except (OSError, json.JSONDecodeError):
        return default_state()


STATE = load_state()


def save_state():
    tmp = STATE_FILE.with_suffix(".tmp")
    tmp.write_text(json.dumps(STATE, ensure_ascii=False, indent=2), "utf-8")
    tmp.replace(STATE_FILE)


def require_token(authorization: str | None = Header(default=None)):
    if len(TOKEN) < 24:
        raise HTTPException(status_code=503, detail="VISION_TRAINER_TOKEN is not safely configured")
    if authorization != f"Bearer {TOKEN}":
        raise HTTPException(status_code=401, detail="Unauthorized")


def dataset_or_404(dataset_id: str):
    dataset = STATE["datasets"].get(dataset_id)
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    return dataset


def sample_or_404(sample_id: str):
    sample = STATE["samples"].get(sample_id)
    if not sample:
        raise HTTPException(status_code=404, detail="Sample not found")
    return sample


def validate_annotations(raw: str, class_count: int):
    try:
        values = json.loads(raw)
    except json.JSONDecodeError as error:
        raise HTTPException(status_code=400, detail="annotations must be valid JSON") from error
    if not isinstance(values, list) or not values:
        raise HTTPException(status_code=400, detail="annotations must be a non-empty array")
    lines = []
    for item in values:
        if not isinstance(item, dict):
            raise HTTPException(status_code=400, detail="each annotation must be an object")
        class_id = item.get("classId")
        coords = [item.get(key) for key in ("x", "y", "width", "height")]
        if not isinstance(class_id, int) or class_id < 0 or class_id >= class_count:
            raise HTTPException(status_code=400, detail="annotation classId is outside dataset classes")
        if any(not isinstance(value, (int, float)) or value <= 0 or value > 1 for value in coords):
            raise HTTPException(status_code=400, detail="YOLO coordinates must be within (0, 1]")
        x, y, width, height = coords
        if x - width / 2 < 0 or x + width / 2 > 1 or y - height / 2 < 0 or y + height / 2 > 1:
            raise HTTPException(status_code=400, detail="bounding box exceeds image boundaries")
        lines.append(f"{class_id} {x:.8f} {y:.8f} {width:.8f} {height:.8f}")
    return lines, values


def approved_samples(dataset_id: str):
    return [sample for sample in STATE["samples"].values() if sample["datasetId"] == dataset_id and sample["status"] == "APPROVED"]


def build_dataset_yaml(dataset):
    dataset_dir = DATA_ROOT / "datasets" / dataset["id"]
    for split in ("train", "val", "test"):
        (dataset_dir / "images" / split).mkdir(parents=True, exist_ok=True)
        (dataset_dir / "labels" / split).mkdir(parents=True, exist_ok=True)
    yaml_path = dataset_dir / "dataset.yaml"
    yaml_path.write_text(yaml.safe_dump({
        "path": str(dataset_dir),
        "train": "images/train",
        "val": "images/val",
        "test": "images/test",
        "names": {index: value for index, value in enumerate(dataset["classes"])},
    }, allow_unicode=True, sort_keys=False), "utf-8")
    return yaml_path


def assert_training_ready(dataset):
    samples = approved_samples(dataset["id"])
    counts = {index: 0 for index in range(len(dataset["classes"]))}
    split_counts = {"train": 0, "val": 0, "test": 0}
    for sample in samples:
        split_counts[sample["split"]] += 1
        for annotation in sample["annotations"]:
            counts[annotation["classId"]] += 1
    missing = [dataset["classes"][index] for index, count in counts.items() if count < MIN_APPROVED_PER_CLASS]
    if missing:
        raise HTTPException(status_code=409, detail=f"Not enough approved labels for classes: {', '.join(missing)}")
    if split_counts["train"] == 0 or split_counts["val"] == 0:
        raise HTTPException(status_code=409, detail="Approved train and validation samples are required")


def run_training(job_id: str):
    with LOCK:
        job = STATE["jobs"][job_id]
        job["status"] = "RUNNING"
        job["startedAt"] = now_iso()
        save_state()
    try:
        dataset = STATE["datasets"][job["datasetId"]]
        yaml_path = build_dataset_yaml(dataset)
        mlflow.set_tracking_uri(os.getenv("MLFLOW_TRACKING_URI", "http://mlflow:5000"))
        mlflow.set_experiment("hurc-vision-defect-detection")
        with mlflow.start_run(run_name=job_id):
            mlflow.log_params({key: job[key] for key in ("datasetId", "baseModel", "epochs", "imageSize", "batchSize")})
            result = YOLO(job["baseModel"]).train(
                data=str(yaml_path),
                epochs=job["epochs"],
                imgsz=job["imageSize"],
                batch=job["batchSize"],
                project=str(MODEL_ROOT),
                name=job_id,
                exist_ok=False,
            )
            best_path = Path(result.save_dir) / "weights" / "best.pt"
            mlflow.log_artifact(str(best_path), artifact_path="model")
            metrics = {normalize_mlflow_metric_name(key): float(value) for key, value in getattr(result, "results_dict", {}).items() if isinstance(value, (int, float))}
            if metrics:
                mlflow.log_metrics(metrics)
        with LOCK:
            job.update({"status": "SUCCEEDED_REVIEW_REQUIRED", "completedAt": now_iso(), "modelPath": str(best_path), "metrics": metrics})
            save_state()
    except Exception as error:
        with LOCK:
            STATE["jobs"][job_id].update({"status": "FAILED", "completedAt": now_iso(), "error": str(error)[:4000]})
            save_state()


@app.get("/health")
def health():
    return {"status": "healthy", "trainingEnabled": TRAINING_ENABLED, "datasets": len(STATE["datasets"]), "jobs": len(STATE["jobs"])}


@app.post("/datasets", dependencies=[Depends(require_token)])
def create_dataset(request: DatasetCreate):
    classes = [value.strip() for value in request.classes]
    if any(not value for value in classes) or len(set(classes)) != len(classes):
        raise HTTPException(status_code=400, detail="classes must be non-empty and unique")
    dataset_id = f"vds-{uuid.uuid4().hex[:12]}"
    dataset = {"id": dataset_id, "name": request.name, "description": request.description, "classes": classes, "createdAt": now_iso(), "status": "COLLECTING"}
    with LOCK:
        STATE["datasets"][dataset_id] = dataset
        save_state()
    build_dataset_yaml(dataset)
    return dataset


@app.get("/datasets", dependencies=[Depends(require_token)])
def list_datasets():
    return list(STATE["datasets"].values())


@app.post("/datasets/{dataset_id}/samples", dependencies=[Depends(require_token)])
async def add_sample(
    dataset_id: str,
    image: UploadFile = File(...),
    annotations: str = Form(...),
    split: Literal["train", "val", "test"] = Form("train"),
    source: str = Form("manual"),
):
    dataset = dataset_or_404(dataset_id)
    extension = ALLOWED_TYPES.get(image.content_type or "")
    if not extension:
        raise HTTPException(status_code=415, detail="Use JPEG, PNG or WEBP")
    content = await image.read(MAX_UPLOAD_BYTES + 1)
    if len(content) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="Image exceeds configured size limit")
    lines, annotation_values = validate_annotations(annotations, len(dataset["classes"]))
    sample_id = f"vs-{uuid.uuid4().hex}"
    dataset_dir = DATA_ROOT / "datasets" / dataset_id
    image_path = dataset_dir / "images" / split / f"{sample_id}{extension}"
    label_path = dataset_dir / "labels" / split / f"{sample_id}.txt"
    try:
        image_path.parent.mkdir(parents=True, exist_ok=True)
        label_path.parent.mkdir(parents=True, exist_ok=True)
        image_path.write_bytes(content)
        with Image.open(image_path) as opened:
            opened.verify()
        label_path.write_text("\n".join(lines) + "\n", "utf-8")
    except Exception as error:
        image_path.unlink(missing_ok=True)
        label_path.unlink(missing_ok=True)
        raise HTTPException(status_code=400, detail="Invalid or corrupted image") from error
    sample = {"id": sample_id, "datasetId": dataset_id, "split": split, "source": source[:120], "imagePath": str(image_path), "labelPath": str(label_path), "annotations": annotation_values, "status": "PENDING_REVIEW", "createdAt": now_iso()}
    with LOCK:
        STATE["samples"][sample_id] = sample
        save_state()
    return sample


@app.post("/samples/{sample_id}/approve", dependencies=[Depends(require_token)])
def approve_sample(sample_id: str, decision: ReviewDecision):
    sample = sample_or_404(sample_id)
    with LOCK:
        sample.update({"status": "APPROVED", "reviewedAt": now_iso(), "reviewNote": decision.note})
        save_state()
    return sample


@app.post("/samples/{sample_id}/reject", dependencies=[Depends(require_token)])
def reject_sample(sample_id: str, decision: ReviewDecision):
    sample = sample_or_404(sample_id)
    with LOCK:
        sample.update({"status": "REJECTED", "reviewedAt": now_iso(), "reviewNote": decision.note})
        save_state()
    return sample


@app.post("/training/jobs", dependencies=[Depends(require_token)])
def create_training_job(request: TrainingRequest):
    if not TRAINING_ENABLED:
        raise HTTPException(status_code=409, detail="Training is disabled by policy")
    dataset = dataset_or_404(request.datasetId)
    assert_training_ready(dataset)
    if request.baseModel not in ALLOWED_BASE_MODELS:
        raise HTTPException(status_code=400, detail="Base model is not allow-listed")
    if request.epochs > MAX_EPOCHS:
        raise HTTPException(status_code=400, detail=f"epochs exceeds policy limit {MAX_EPOCHS}")
    if any(job["status"] in ("QUEUED", "RUNNING") for job in STATE["jobs"].values()):
        raise HTTPException(status_code=409, detail="Another training job is active")
    job_id = f"vtj-{uuid.uuid4().hex[:12]}"
    job = {"id": job_id, **request.model_dump(), "status": "QUEUED", "createdAt": now_iso(), "approval": "PENDING"}
    with LOCK:
        STATE["jobs"][job_id] = job
        save_state()
    threading.Thread(target=run_training, args=(job_id,), daemon=True).start()
    return job


@app.get("/training/jobs/{job_id}", dependencies=[Depends(require_token)])
def get_training_job(job_id: str):
    job = STATE["jobs"].get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Training job not found")
    return job


@app.post("/training/jobs/{job_id}/approve", dependencies=[Depends(require_token)])
def approve_training_job(job_id: str, decision: ReviewDecision):
    job = STATE["jobs"].get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Training job not found")
    if job["status"] != "SUCCEEDED_REVIEW_REQUIRED":
        raise HTTPException(status_code=409, detail="Only a completed model can be approved")
    with LOCK:
        job.update({"status": "APPROVED_NOT_DEPLOYED", "approval": "APPROVED", "approvedAt": now_iso(), "approvalNote": decision.note})
        save_state()
    return job
