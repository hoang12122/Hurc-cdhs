import json
import os
import re
import struct
import threading
import time
import uuid
from datetime import datetime, timezone
from pathlib import Path

import httpx
import paho.mqtt.client as mqtt
import yaml
from asyncua.sync import Client as OpcUaClient
from fastapi import FastAPI
from pymodbus.client import ModbusTcpClient

CONFIG_PATH = Path(os.getenv("SCADA_CONFIG_PATH", "/config/scada.yaml"))
ENABLED = os.getenv("SCADA_GATEWAY_ENABLED", "false").lower() == "true"
HEALTH_PORT = int(os.getenv("HEALTH_PORT", "8091"))
MAX_SOURCES = min(100, max(1, int(os.getenv("SCADA_MAX_SOURCES", "20"))))
MAX_POINTS_PER_SOURCE = min(5000, max(1, int(os.getenv("SCADA_MAX_POINTS_PER_SOURCE", "500"))))
ENV_PATTERN = re.compile(r"\$\{([A-Z0-9_]+)\}")
LOCK = threading.RLock()
app = FastAPI(title="HURC Read-only SCADA Gateway", version="1.0.0")

STATS = {
    "status": "disabled" if not ENABLED else "starting",
    "enabled": ENABLED,
    "readOnly": True,
    "sources": {},
    "published": 0,
    "errors": 0,
    "lastPublishedAt": None,
    "lastError": None,
}


def now_iso():
    return datetime.now(timezone.utc).isoformat()


def expand_env(value):
    if isinstance(value, str):
        return ENV_PATTERN.sub(lambda match: os.getenv(match.group(1), ""), value)
    if isinstance(value, list):
        return [expand_env(item) for item in value]
    if isinstance(value, dict):
        return {key: expand_env(item) for key, item in value.items()}
    return value


def load_config():
    path = CONFIG_PATH if CONFIG_PATH.exists() else Path("/app/config.example.yaml")
    config = expand_env(yaml.safe_load(path.read_text("utf-8")) or {})
    gateway = config.get("gateway") or {}
    if gateway.get("read_only") is not True:
        raise RuntimeError("SCADA gateway requires gateway.read_only=true")
    sources = config.get("sources") or []
    if not isinstance(sources, list) or len(sources) > MAX_SOURCES:
        raise RuntimeError(f"sources must be a list with at most {MAX_SOURCES} entries")
    for source in sources:
        if source.get("write") or source.get("commands"):
            raise RuntimeError(f"source {source.get('id')} contains prohibited write configuration")
        points = source.get("points") or []
        if not isinstance(points, list) or len(points) > MAX_POINTS_PER_SOURCE:
            raise RuntimeError(f"source {source.get('id')} exceeds point limit")
    return config


CONFIG = load_config()
GATEWAY = CONFIG.get("gateway") or {}
MQTT_CONFIG = CONFIG.get("mqtt") or {}


def update_source(source_id, **values):
    with LOCK:
        current = STATS["sources"].setdefault(source_id, {"status": "starting", "reads": 0, "errors": 0})
        current.update(values)


def increment_source(source_id, key):
    with LOCK:
        current = STATS["sources"].setdefault(source_id, {"status": "starting", "reads": 0, "errors": 0})
        current[key] = current.get(key, 0) + 1


def dotted_value(payload, path):
    value = payload
    for segment in str(path or "").split("."):
        if not segment:
            continue
        if isinstance(value, dict):
            value = value.get(segment)
        elif isinstance(value, list) and segment.isdigit():
            index = int(segment)
            value = value[index] if index < len(value) else None
        else:
            return None
    return value


def quality_status(raw):
    text = str(raw or "unknown").strip().lower()
    if text in ("good", "ok", "healthy", "normal", "192"):
        return "good"
    if text in ("bad", "error", "failed", "0"):
        return "error"
    if text in ("uncertain", "warning", "stale"):
        return "warning"
    return "unknown"


def event_for(source, point, reading):
    occurred_at = reading.get("timestamp") or now_iso()
    try:
        parsed = datetime.fromisoformat(str(occurred_at).replace("Z", "+00:00"))
        if parsed.tzinfo is None:
            parsed = parsed.replace(tzinfo=timezone.utc)
        occurred_at = parsed.astimezone(timezone.utc).isoformat()
    except ValueError:
        occurred_at = now_iso()
    gateway_id = str(GATEWAY.get("id") or "hurc-scada-gateway")
    return {
        "eventId": str(uuid.uuid4()),
        "eventType": "telemetry.scada.received",
        "schemaVersion": "1.0.0",
        "occurredAt": occurred_at,
        "traceId": str(uuid.uuid4()),
        "source": {
            "gatewayId": gateway_id,
            "environment": str(GATEWAY.get("environment") or "unknown"),
            "protocol": source.get("protocol"),
            "sourceId": source.get("id"),
        },
        "asset": {
            "assetId": str(point["asset_id"]),
            "line": str(point.get("line") or GATEWAY.get("line") or "unknown"),
            "station": str(point.get("station") or "unknown"),
            "subsystem": str(point.get("subsystem") or "SCADA"),
        },
        "quality": {
            "status": quality_status(reading.get("quality")),
            "duplicate": False,
            "clockSkewMs": reading.get("clock_skew_ms"),
        },
        "payload": {
            "metric": point.get("metric") or point.get("tag"),
            "value": reading.get("value"),
            "unit": point.get("unit"),
            "tag": point.get("tag"),
            "protocol": source.get("protocol"),
        },
    }


class Publisher:
    def __init__(self):
        if not ENABLED:
            raise RuntimeError("SCADA gateway is disabled")
        self.client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2, client_id=str(GATEWAY.get("id") or "hurc-scada-gateway"))
        username = MQTT_CONFIG.get("username")
        if username:
            self.client.username_pw_set(username, MQTT_CONFIG.get("password") or "")
        if MQTT_CONFIG.get("tls"):
            self.client.tls_set(ca_certs=MQTT_CONFIG.get("ca_file") or None)
        self.client.connect(str(MQTT_CONFIG.get("host") or "mqtt"), int(MQTT_CONFIG.get("port") or 1883), keepalive=60)
        self.client.loop_start()

    def publish(self, source, point, reading):
        event = event_for(source, point, reading)
        asset = event["asset"]
        topic = "/".join([
            "hurc",
            event["source"]["environment"],
            asset["line"],
            asset["station"],
            asset["subsystem"],
            asset["assetId"],
            "telemetry",
        ])
        result = self.client.publish(topic, json.dumps(event, ensure_ascii=False, separators=(",", ":")), qos=1)
        result.wait_for_publish(timeout=10)
        if result.rc != mqtt.MQTT_ERR_SUCCESS:
            raise RuntimeError(f"MQTT publish failed with code {result.rc}")
        with LOCK:
            STATS["published"] += 1
            STATS["lastPublishedAt"] = now_iso()
            STATS["status"] = "healthy"
            STATS["lastError"] = None


PUBLISHER = Publisher() if ENABLED else None


def read_rest(source, point, client):
    response = client.request(
        str(source.get("method") or "GET").upper(),
        str(source["endpoint"]),
        headers=source.get("headers") or {},
        params={"tag": point.get("tag"), **(source.get("params") or {})},
    )
    response.raise_for_status()
    payload = response.json()
    return {
        "value": dotted_value(payload, point.get("value_path") or "value"),
        "timestamp": dotted_value(payload, point.get("timestamp_path") or "timestamp"),
        "quality": dotted_value(payload, point.get("quality_path") or "quality"),
    }


def decode_registers(registers, point):
    data_type = str(point.get("data_type") or "uint16")
    byte_order = str(point.get("byte_order") or "big")
    word_order = str(point.get("word_order") or "big")
    words = list(registers)
    if word_order == "little":
        words.reverse()
    raw = b"".join(int(word).to_bytes(2, byteorder=byte_order, signed=False) for word in words)
    prefixes = {"big": ">", "little": "<"}
    prefix = prefixes.get(byte_order)
    if not prefix:
        raise ValueError(f"unsupported byte_order {byte_order}")
    formats = {"uint16": "H", "int16": "h", "uint32": "I", "int32": "i", "float32": "f", "float64": "d"}
    fmt = formats.get(data_type)
    if not fmt:
        raise ValueError(f"unsupported Modbus data_type {data_type}")
    expected = struct.calcsize(prefix + fmt)
    if len(raw) < expected:
        raise ValueError(f"Modbus point requires {expected} bytes but received {len(raw)}")
    return struct.unpack(prefix + fmt, raw[:expected])[0]


def modbus_address(tag):
    parts = str(tag).split(":")
    if len(parts) < 2:
        raise ValueError("Modbus tag must be area:address[:count]")
    return parts[0], int(parts[1]), int(parts[2]) if len(parts) > 2 else 1


def read_modbus(source, point, client):
    area, address, count = modbus_address(point["tag"])
    kwargs = {"address": address, "count": count, "device_id": int(source.get("unit_id") or 1)}
    readers = {
        "holding": client.read_holding_registers,
        "input": client.read_input_registers,
        "coil": client.read_coils,
        "discrete": client.read_discrete_inputs,
    }
    if area not in readers:
        raise ValueError(f"unsupported Modbus area {area}")
    response = readers[area](**kwargs)
    if response.isError():
        raise RuntimeError(str(response))
    if area in ("coil", "discrete"):
        return {"value": bool(response.bits[0]), "timestamp": now_iso(), "quality": "good"}
    return {"value": decode_registers(response.registers, point), "timestamp": now_iso(), "quality": "good"}


def source_loop(source):
    if not ENABLED or PUBLISHER is None:
        return
    source_id = str(source.get("id") or uuid.uuid4())
    protocol = str(source.get("protocol") or "").lower()
    interval = max(1.0, float(source.get("poll_interval_seconds") or GATEWAY.get("publish_interval_seconds") or 5))
    update_source(source_id, status="starting", protocol=protocol)
    while True:
        client = None
        try:
            if protocol == "rest":
                client = httpx.Client(timeout=min(30, max(2, float(source.get("timeout_seconds") or 5))), verify=bool(source.get("tls_verify", True)))
            elif protocol == "opcua":
                client = OpcUaClient(str(source["endpoint"]), timeout=min(30, max(2, float(source.get("timeout_seconds") or 5))))
                client.connect()
            elif protocol == "modbus_tcp":
                client = ModbusTcpClient(str(source["host"]), port=int(source.get("port") or 502), timeout=min(30, max(2, float(source.get("timeout_seconds") or 5))))
                if not client.connect():
                    raise RuntimeError("Modbus TCP connection failed")
            else:
                raise RuntimeError(f"unsupported protocol {protocol}; use rest, opcua or modbus_tcp")

            update_source(source_id, status="healthy", lastError=None)
            while True:
                for point in source.get("points") or []:
                    if protocol == "rest":
                        reading = read_rest(source, point, client)
                    elif protocol == "opcua":
                        node = client.get_node(str(point["tag"]))
                        reading = {"value": node.read_value(), "timestamp": now_iso(), "quality": "good"}
                    else:
                        reading = read_modbus(source, point, client)
                    PUBLISHER.publish(source, point, reading)
                    increment_source(source_id, "reads")
                    update_source(source_id, lastReadAt=now_iso())
                time.sleep(interval)
        except Exception as error:
            increment_source(source_id, "errors")
            update_source(source_id, status="degraded", lastError=str(error)[:1000])
            with LOCK:
                STATS["errors"] += 1
                STATS["status"] = "degraded"
                STATS["lastError"] = str(error)[:1000]
            time.sleep(min(30, interval * 2))
        finally:
            try:
                if protocol == "opcua" and client:
                    client.disconnect()
                elif client:
                    client.close()
            except Exception:
                pass


@app.on_event("startup")
def startup():
    if not ENABLED:
        return
    for source in CONFIG.get("sources") or []:
        threading.Thread(target=source_loop, args=(source,), daemon=True).start()


@app.get("/health")
def health():
    with LOCK:
        return json.loads(json.dumps(STATS))


@app.get("/capabilities")
def capabilities():
    return {
        "enabled": ENABLED,
        "mode": "read-only",
        "nativeProtocols": ["opcua", "modbus_tcp", "rest"],
        "vendorBridge": ["F-SCADA REST API", "vendor gateway to REST/MQTT"],
        "writeCommands": False,
        "normalizedSchemaVersion": "1.0.0",
    }
