import json
import os
import threading
import time
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

import paho.mqtt.client as mqtt
import psycopg2
from psycopg2.extras import Json

MQTT_HOST = os.getenv("MQTT_HOST", "mqtt")
MQTT_PORT = int(os.getenv("MQTT_PORT", "1883"))
MQTT_TOPIC = os.getenv("MQTT_TOPIC", "hurc/+/+/+/+/+/telemetry")
MQTT_CLIENT_ID = os.getenv("MQTT_CLIENT_ID", "hurc-iot-ingestor")
MQTT_MAX_PAYLOAD_BYTES = min(
    1024 * 1024,
    max(16 * 1024, int(os.getenv("MQTT_MAX_PAYLOAD_BYTES", str(256 * 1024)))),
)
DATABASE_URL = os.getenv(
    "TIMESCALE_DATABASE_URL",
    "postgresql://postgres:change-me@timescaledb:5432/hurc_telemetry",
)
HEALTH_PORT = int(os.getenv("HEALTH_PORT", "8080"))

STATS = {
    "received": 0,
    "inserted": 0,
    "duplicates": 0,
    "dead_letters": 0,
    "last_error": None,
    "connected": False,
}
STATS_LOCK = threading.Lock()


def update_stats(**values):
    with STATS_LOCK:
        STATS.update(values)


def increment(key):
    with STATS_LOCK:
        STATS[key] += 1


def parse_iso_datetime(value):
    if not isinstance(value, str) or not value.strip():
        raise ValueError("occurredAt must be a non-empty ISO-8601 string")
    normalized = value.replace("Z", "+00:00")
    parsed = datetime.fromisoformat(normalized)
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=timezone.utc)
    return parsed.astimezone(timezone.utc)


def parse_topic(topic):
    parts = topic.split("/")
    if len(parts) != 7 or parts[0] != "hurc" or parts[-1] != "telemetry":
        raise ValueError("topic does not match hurc/<env>/<line>/<station>/<subsystem>/<asset>/telemetry")
    return {
        "environment": parts[1],
        "line_code": parts[2],
        "station_code": parts[3],
        "subsystem": parts[4],
        "asset_id": parts[5],
    }


def validate_event(topic, payload_bytes):
    if len(payload_bytes) > MQTT_MAX_PAYLOAD_BYTES:
        raise ValueError(f"payload exceeds {MQTT_MAX_PAYLOAD_BYTES} bytes")

    topic_data = parse_topic(topic)
    try:
        event = json.loads(payload_bytes.decode("utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError) as error:
        raise ValueError("payload must be UTF-8 JSON") from error

    if not isinstance(event, dict):
        raise ValueError("event root must be a JSON object")

    event_id = str(event.get("eventId", "")).strip()
    if not event_id or len(event_id) > 128:
        raise ValueError("eventId is required and must not exceed 128 characters")

    occurred_at = parse_iso_datetime(event.get("occurredAt"))
    payload = event.get("payload")
    if not isinstance(payload, dict):
        raise ValueError("payload field must be a JSON object")

    asset = event.get("asset") if isinstance(event.get("asset"), dict) else {}
    event_asset_id = str(asset.get("assetId", topic_data["asset_id"]))
    if event_asset_id != topic_data["asset_id"]:
        raise ValueError("asset.assetId does not match MQTT topic")

    source = event.get("source") if isinstance(event.get("source"), dict) else {}
    quality = event.get("quality") if isinstance(event.get("quality"), dict) else {}

    return {
        **topic_data,
        "event_id": event_id,
        "event_type": str(event.get("eventType", "telemetry.received"))[:120],
        "schema_version": str(event.get("schemaVersion", "1.0.0"))[:32],
        "occurred_at": occurred_at,
        "gateway_id": str(source.get("gatewayId", ""))[:128] or None,
        "quality_status": str(quality.get("status", "unknown"))[:32],
        "clock_skew_ms": quality.get("clockSkewMs"),
        "duplicate": bool(quality.get("duplicate", False)),
        "trace_id": str(event.get("traceId", ""))[:128] or None,
        "payload": payload,
        "raw_event": event,
    }


class TelemetryStore:
    def __init__(self):
        self.connection = None
        self.lock = threading.Lock()

    def connect(self):
        while True:
            try:
                self.connection = psycopg2.connect(DATABASE_URL)
                self.connection.autocommit = False
                print("[iot-ingestor] connected to TimescaleDB", flush=True)
                return
            except Exception as error:
                update_stats(last_error=f"database connection: {error}")
                print(f"[iot-ingestor] database unavailable: {error}", flush=True)
                time.sleep(5)

    def ensure_connection(self):
        if self.connection is None or self.connection.closed:
            self.connect()

    def insert_event(self, event):
        with self.lock:
            self.ensure_connection()
            try:
                with self.connection:
                    with self.connection.cursor() as cursor:
                        cursor.execute(
                            "INSERT INTO telemetry_event_dedup(event_id) VALUES (%s) "
                            "ON CONFLICT (event_id) DO NOTHING RETURNING event_id",
                            (event["event_id"],),
                        )
                        if cursor.fetchone() is None:
                            return False
                        cursor.execute(
                            """
                            INSERT INTO telemetry_event (
                              event_id, event_type, schema_version, occurred_at,
                              environment, line_code, station_code, subsystem,
                              asset_id, gateway_id, quality_status, clock_skew_ms,
                              duplicate, trace_id, payload, raw_event
                            ) VALUES (
                              %(event_id)s, %(event_type)s, %(schema_version)s, %(occurred_at)s,
                              %(environment)s, %(line_code)s, %(station_code)s, %(subsystem)s,
                              %(asset_id)s, %(gateway_id)s, %(quality_status)s, %(clock_skew_ms)s,
                              %(duplicate)s, %(trace_id)s, %(payload)s, %(raw_event)s
                            )
                            """,
                            {
                                **event,
                                "payload": Json(event["payload"]),
                                "raw_event": Json(event["raw_event"]),
                            },
                        )
                return True
            except Exception:
                self.connection.rollback()
                self.connection.close()
                raise

    def dead_letter(self, topic, payload_bytes, reason):
        with self.lock:
            self.ensure_connection()
            text = payload_bytes[:65536].decode("utf-8", errors="replace")
            try:
                with self.connection:
                    with self.connection.cursor() as cursor:
                        cursor.execute(
                            "INSERT INTO telemetry_dead_letter(topic, reason, payload_size, payload_text) "
                            "VALUES (%s, %s, %s, %s)",
                            (topic, str(reason)[:1000], len(payload_bytes), text),
                        )
            except Exception:
                self.connection.rollback()
                self.connection.close()
                raise


STORE = TelemetryStore()


class HealthHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path not in ("/health", "/ready"):
            self.send_response(404)
            self.end_headers()
            return
        with STATS_LOCK:
            body = json.dumps(STATS).encode("utf-8")
        status = 200 if STATS["connected"] and STORE.connection and not STORE.connection.closed else 503
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, *_args):
        return


def start_health_server():
    server = ThreadingHTTPServer(("0.0.0.0", HEALTH_PORT), HealthHandler)
    server.serve_forever()


def on_connect(client, _userdata, _flags, reason_code, _properties):
    if reason_code == 0:
        client.subscribe(MQTT_TOPIC, qos=1)
        update_stats(connected=True, last_error=None)
        print(f"[iot-ingestor] subscribed to {MQTT_TOPIC}", flush=True)
    else:
        update_stats(connected=False, last_error=f"MQTT connect code {reason_code}")


def on_disconnect(_client, _userdata, _flags, reason_code, _properties):
    update_stats(connected=False, last_error=f"MQTT disconnected: {reason_code}")


def on_message(_client, _userdata, message):
    increment("received")
    try:
        event = validate_event(message.topic, message.payload)
        if STORE.insert_event(event):
            increment("inserted")
        else:
            increment("duplicates")
    except Exception as error:
        update_stats(last_error=str(error))
        increment("dead_letters")
        try:
            STORE.dead_letter(message.topic, message.payload, error)
        except Exception as store_error:
            update_stats(last_error=f"dead-letter failure: {store_error}")


def main():
    threading.Thread(target=start_health_server, daemon=True).start()
    STORE.connect()

    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2, client_id=MQTT_CLIENT_ID)
    username = os.getenv("MQTT_USERNAME")
    if username:
        client.username_pw_set(username, os.getenv("MQTT_PASSWORD", ""))
    if os.getenv("MQTT_TLS", "false").lower() == "true":
        client.tls_set(ca_certs=os.getenv("MQTT_CA_FILE"))

    client.on_connect = on_connect
    client.on_disconnect = on_disconnect
    client.on_message = on_message
    client.reconnect_delay_set(min_delay=1, max_delay=30)
    client.connect(MQTT_HOST, MQTT_PORT, keepalive=60)
    client.loop_forever(retry_first_connection=True)


if __name__ == "__main__":
    main()
