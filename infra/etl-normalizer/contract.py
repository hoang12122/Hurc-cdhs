import hashlib
import json
from datetime import datetime, timedelta, timezone

SUPPORTED_SCHEMA_VERSIONS = {"1.0.0"}
QUALITY_STATUSES = {"good", "warning", "error", "unknown"}


class ContractError(ValueError):
    def __init__(self, code, message):
        super().__init__(message)
        self.code = code


def utc_now():
    return datetime.now(timezone.utc)


def parse_datetime(value, field_name):
    if not isinstance(value, str) or not value.strip():
        raise ContractError("INVALID_DATETIME", f"{field_name} must be a non-empty ISO-8601 string")
    try:
        parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError as error:
        raise ContractError("INVALID_DATETIME", f"{field_name} is not a valid ISO-8601 timestamp") from error
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=timezone.utc)
    return parsed.astimezone(timezone.utc)


def parse_topic(topic):
    if not isinstance(topic, str):
        raise ContractError("INVALID_TOPIC", "_mqttTopic is required")
    parts = topic.split("/")
    if len(parts) != 7 or parts[0] != "hurc" or parts[-1] != "telemetry":
        raise ContractError(
            "INVALID_TOPIC",
            "topic must match hurc/<env>/<line>/<station>/<subsystem>/<asset>/telemetry",
        )
    values = parts[1:6]
    if any(not value or len(value) > 128 for value in values):
        raise ContractError("INVALID_TOPIC", "topic dimensions must be non-empty and <= 128 characters")
    return {
        "environment": parts[1],
        "line_code": parts[2],
        "station_code": parts[3],
        "subsystem": parts[4],
        "asset_id": parts[5],
    }


def canonical_json(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def bounded_text(value, max_length):
    text = str(value or "").strip()
    return text[:max_length]


def optional_integer(value, field_name):
    if value is None:
        return None
    if isinstance(value, bool):
        raise ContractError("INVALID_QUALITY", f"{field_name} must be an integer")
    try:
        return int(value)
    except (TypeError, ValueError) as error:
        raise ContractError("INVALID_QUALITY", f"{field_name} must be an integer") from error


def optional_float(value, field_name):
    if value is None:
        return None
    if isinstance(value, bool):
        raise ContractError("INVALID_PAYLOAD", f"{field_name} must be numeric")
    try:
        parsed = float(value)
    except (TypeError, ValueError) as error:
        raise ContractError("INVALID_PAYLOAD", f"{field_name} must be numeric") from error
    if parsed != parsed or parsed in (float("inf"), float("-inf")):
        raise ContractError("INVALID_PAYLOAD", f"{field_name} must be finite")
    return parsed


def normalize_event(
    event,
    *,
    now=None,
    max_payload_bytes=512 * 1024,
    max_future_seconds=300,
    max_clock_skew_ms=120_000,
):
    if not isinstance(event, dict):
        raise ContractError("INVALID_ROOT", "event root must be a JSON object")

    processed_at = now or utc_now()
    if processed_at.tzinfo is None:
        processed_at = processed_at.replace(tzinfo=timezone.utc)
    processed_at = processed_at.astimezone(timezone.utc)

    topic = parse_topic(event.get("_mqttTopic"))
    event_id = bounded_text(event.get("eventId"), 128)
    if not event_id:
        raise ContractError("MISSING_EVENT_ID", "eventId is required")

    schema_version = bounded_text(event.get("schemaVersion"), 32)
    if schema_version not in SUPPORTED_SCHEMA_VERSIONS:
        raise ContractError("UNSUPPORTED_SCHEMA", f"schemaVersion {schema_version or '<empty>'} is not supported")

    event_type = bounded_text(event.get("eventType"), 120)
    if not event_type:
        raise ContractError("MISSING_EVENT_TYPE", "eventType is required")

    occurred_at = parse_datetime(event.get("occurredAt"), "occurredAt")
    if occurred_at > processed_at + timedelta(seconds=max_future_seconds):
        raise ContractError("FUTURE_EVENT", "occurredAt is too far in the future")

    ingested_at_value = event.get("_ingestedAt")
    ingested_at = parse_datetime(ingested_at_value, "_ingestedAt") if ingested_at_value else processed_at

    payload = event.get("payload")
    if not isinstance(payload, dict):
        raise ContractError("INVALID_PAYLOAD", "payload must be a JSON object")
    payload_json = canonical_json(payload)
    payload_bytes = len(payload_json.encode("utf-8"))
    if payload_bytes > max_payload_bytes:
        raise ContractError("PAYLOAD_TOO_LARGE", f"payload exceeds {max_payload_bytes} bytes")

    asset = event.get("asset") if isinstance(event.get("asset"), dict) else {}
    asset_id = bounded_text(asset.get("assetId"), 128)
    if not asset_id:
        raise ContractError("MISSING_ASSET", "asset.assetId is required")
    if asset_id != topic["asset_id"]:
        raise ContractError("ASSET_TOPIC_MISMATCH", "asset.assetId does not match MQTT topic")

    source = event.get("source") if isinstance(event.get("source"), dict) else {}
    quality = event.get("quality") if isinstance(event.get("quality"), dict) else {}
    quality_status = bounded_text(quality.get("status") or "unknown", 32).lower()
    if quality_status not in QUALITY_STATUSES:
        raise ContractError("INVALID_QUALITY", "quality.status is not supported")

    clock_skew_ms = optional_integer(quality.get("clockSkewMs"), "quality.clockSkewMs")
    duplicate = bool(quality.get("duplicate", False))
    anomaly_score = optional_float(payload.get("anomalyScore"), "payload.anomalyScore")

    flags = []
    score = 100
    gateway_id = bounded_text(source.get("gatewayId"), 128)
    trace_id = bounded_text(event.get("traceId"), 128)
    if not gateway_id:
        flags.append("MISSING_GATEWAY_ID")
        score -= 10
    if not trace_id:
        flags.append("MISSING_TRACE_ID")
        score -= 5
    if clock_skew_ms is None:
        flags.append("CLOCK_SKEW_UNKNOWN")
        score -= 5
    elif abs(clock_skew_ms) > max_clock_skew_ms:
        flags.append("CLOCK_SKEW_HIGH")
        score -= 20
    if duplicate:
        flags.append("SOURCE_DUPLICATE")
        score -= 15
    if quality_status == "warning":
        score -= 15
    elif quality_status == "error":
        score -= 40
    elif quality_status == "unknown":
        score -= 10

    raw_event = canonical_json(event)
    event_checksum = hashlib.sha256(raw_event.encode("utf-8")).hexdigest()
    processing_latency_ms = max(0, int((processed_at - ingested_at).total_seconds() * 1000))
    event_age_ms = int((processed_at - occurred_at).total_seconds() * 1000)

    return {
        "event_id": event_id,
        "event_type": event_type,
        "schema_version": schema_version,
        "occurred_at": occurred_at.isoformat(),
        "ingested_at": ingested_at.isoformat(),
        "processed_at": processed_at.isoformat(),
        "environment": bounded_text(source.get("environment") or topic["environment"], 64),
        "line_code": bounded_text(asset.get("line") or topic["line_code"], 64),
        "station_code": bounded_text(asset.get("station") or topic["station_code"], 64),
        "subsystem": bounded_text(asset.get("subsystem") or topic["subsystem"], 64),
        "asset_id": asset_id,
        "gateway_id": gateway_id,
        "quality_status": quality_status,
        "quality_score": max(0, min(100, score)),
        "quality_flags": flags,
        "clock_skew_ms": clock_skew_ms,
        "duplicate": 1 if duplicate else 0,
        "trace_id": trace_id,
        "payload_json": payload_json,
        "raw_event": raw_event,
        "event_checksum": event_checksum,
        "payload_bytes": payload_bytes,
        "processing_latency_ms": processing_latency_ms,
        "event_age_ms": event_age_ms,
        "anomaly_score": anomaly_score,
        "ingest_version": int(processed_at.timestamp() * 1_000_000),
    }
