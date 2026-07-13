import hashlib
import json
import os
import threading
import time
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

import psycopg2
from kafka import KafkaConsumer, KafkaProducer

from contract import ContractError, normalize_event

KAFKA_BROKERS = [value.strip() for value in os.getenv("KAFKA_BROKERS", "redpanda:9092").split(",") if value.strip()]
RAW_TOPIC = os.getenv("ETL_RAW_TOPIC", "iot.telemetry.raw")
NORMALIZED_TOPIC = os.getenv("ETL_NORMALIZED_TOPIC", "iot.telemetry.normalized")
DEAD_LETTER_TOPIC = os.getenv("ETL_DEAD_LETTER_TOPIC", "iot.telemetry.dead-letter")
CONSUMER_GROUP = os.getenv("ETL_CONSUMER_GROUP", "hurc-etl-normalizer-v1")
DATABASE_URL = os.getenv(
    "TIMESCALE_DATABASE_URL",
    "postgresql://postgres:change-me@timescaledb:5432/hurc_telemetry",
)
HEALTH_PORT = int(os.getenv("HEALTH_PORT", "8082"))
MAX_PAYLOAD_BYTES = min(2 * 1024 * 1024, max(16 * 1024, int(os.getenv("EVENT_MAX_PAYLOAD_BYTES", str(512 * 1024)))))
MAX_FUTURE_SECONDS = min(3600, max(0, int(os.getenv("ETL_MAX_FUTURE_SECONDS", "300"))))
MAX_CLOCK_SKEW_MS = min(3_600_000, max(1000, int(os.getenv("ETL_MAX_CLOCK_SKEW_MS", "120000"))))
COMMIT_BATCH_SIZE = min(1000, max(1, int(os.getenv("ETL_COMMIT_BATCH_SIZE", "100"))))
COMMIT_INTERVAL_SECONDS = min(30.0, max(0.2, float(os.getenv("ETL_COMMIT_INTERVAL_SECONDS", "2"))))
CONTRACT_PATH = Path(os.getenv("ETL_CONTRACT_PATH", "/app/contracts/telemetry-v1.schema.json"))

STATS = {
    "status": "starting",
    "received": 0,
    "normalized": 0,
    "invalid": 0,
    "qualityWarnings": 0,
    "publishFailures": 0,
    "commits": 0,
    "lastProcessedAt": None,
    "lastError": None,
}
STATS_LOCK = threading.Lock()


def update_stats(**values):
    with STATS_LOCK:
        STATS.update(values)


def increment(key, amount=1):
    with STATS_LOCK:
        STATS[key] += amount


def utc_now_iso():
    return datetime.now(timezone.utc).isoformat()


class DataQualityStore:
    def __init__(self):
        self.connection = None
        self.lock = threading.Lock()

    def connect(self):
        if self.connection is not None and not self.connection.closed:
            return
        self.connection = psycopg2.connect(DATABASE_URL)
        self.connection.autocommit = True

    def register_contract(self):
        if not CONTRACT_PATH.exists():
            return
        content = CONTRACT_PATH.read_bytes()
        checksum = hashlib.sha256(content).hexdigest()
        self.connect()
        with self.connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO etl_schema_registry(schema_name, schema_version, contract_sha256, status)
                VALUES ('telemetry', '1.0.0', %s, 'ACTIVE')
                ON CONFLICT (schema_name, schema_version)
                DO UPDATE SET contract_sha256 = EXCLUDED.contract_sha256,
                              status = EXCLUDED.status,
                              registered_at = NOW()
                """,
                (checksum,),
            )

    def record(self, message, code, severity, detail, event_id=None):
        with self.lock:
            try:
                self.connect()
                excerpt = message.value[:65536].decode("utf-8", errors="replace")
                with self.connection.cursor() as cursor:
                    cursor.execute(
                        """
                        INSERT INTO etl_data_quality_event(
                          event_id, topic, partition_id, offset_id, code,
                          severity, detail, payload_size, payload_excerpt
                        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                        """,
                        (
                            event_id,
                            message.topic,
                            message.partition,
                            message.offset,
                            code[:80],
                            severity,
                            detail[:2000],
                            len(message.value),
                            excerpt,
                        ),
                    )
            except Exception as error:
                if self.connection is not None:
                    self.connection.close()
                self.connection = None
                update_stats(lastError=f"quality-store: {error}")


QUALITY_STORE = DataQualityStore()


def create_producer():
    return KafkaProducer(
        bootstrap_servers=KAFKA_BROKERS,
        acks="all",
        retries=10,
        linger_ms=20,
        compression_type="gzip",
        max_in_flight_requests_per_connection=1,
        value_serializer=lambda value: json.dumps(value, ensure_ascii=False, separators=(",", ":")).encode("utf-8"),
        key_serializer=lambda value: str(value).encode("utf-8"),
    )


def create_consumer():
    return KafkaConsumer(
        RAW_TOPIC,
        bootstrap_servers=KAFKA_BROKERS,
        group_id=CONSUMER_GROUP,
        enable_auto_commit=False,
        auto_offset_reset="earliest",
        max_poll_records=500,
        session_timeout_ms=30000,
        max_poll_interval_ms=300000,
        consumer_timeout_ms=1000,
    )


def decode_event(message):
    try:
        decoded = message.value.decode("utf-8")
        event = json.loads(decoded)
    except (UnicodeDecodeError, json.JSONDecodeError) as error:
        raise ContractError("INVALID_JSON", "raw message must be UTF-8 JSON") from error
    if not isinstance(event, dict):
        raise ContractError("INVALID_ROOT", "raw message root must be a JSON object")
    return event


def dead_letter_envelope(message, code, detail, event=None):
    event_id = event.get("eventId") if isinstance(event, dict) else None
    return {
        "eventId": str(event_id or f"{message.topic}:{message.partition}:{message.offset}"),
        "failedAt": utc_now_iso(),
        "source": {
            "topic": message.topic,
            "partition": message.partition,
            "offset": message.offset,
        },
        "failure": {
            "code": code,
            "detail": detail[:2000],
        },
        "payloadSize": len(message.value),
        "payloadExcerpt": message.value[:65536].decode("utf-8", errors="replace"),
    }


def process_message(producer, message):
    increment("received")
    event = None
    try:
        event = decode_event(message)
        normalized = normalize_event(
            event,
            max_payload_bytes=MAX_PAYLOAD_BYTES,
            max_future_seconds=MAX_FUTURE_SECONDS,
            max_clock_skew_ms=MAX_CLOCK_SKEW_MS,
        )
        producer.send(
            NORMALIZED_TOPIC,
            key=normalized["event_id"],
            value=normalized,
        ).get(timeout=15)
        increment("normalized")
        if normalized["quality_flags"] or normalized["quality_score"] < 80:
            increment("qualityWarnings")
            QUALITY_STORE.record(
                message,
                "QUALITY_WARNING",
                "WARNING",
                ",".join(normalized["quality_flags"]) or normalized["quality_status"],
                normalized["event_id"],
            )
        update_stats(status="healthy", lastProcessedAt=utc_now_iso(), lastError=None)
        return True
    except ContractError as error:
        envelope = dead_letter_envelope(message, error.code, str(error), event)
        producer.send(DEAD_LETTER_TOPIC, key=envelope["eventId"], value=envelope).get(timeout=15)
        increment("invalid")
        QUALITY_STORE.record(message, error.code, "ERROR", str(error), envelope["eventId"])
        update_stats(status="healthy", lastProcessedAt=utc_now_iso(), lastError=None)
        return True
    except Exception as error:
        increment("publishFailures")
        update_stats(status="degraded", lastError=str(error)[:2000])
        return False


def processing_loop():
    while True:
        producer = None
        consumer = None
        try:
            QUALITY_STORE.register_contract()
            producer = create_producer()
            consumer = create_consumer()
            pending = 0
            last_commit = time.monotonic()
            update_stats(status="healthy", lastError=None)
            while True:
                records = consumer.poll(timeout_ms=1000, max_records=500)
                for messages in records.values():
                    for message in messages:
                        if not process_message(producer, message):
                            raise RuntimeError("message was not durably published")
                        pending += 1
                        elapsed = time.monotonic() - last_commit
                        if pending >= COMMIT_BATCH_SIZE or elapsed >= COMMIT_INTERVAL_SECONDS:
                            consumer.commit()
                            increment("commits")
                            pending = 0
                            last_commit = time.monotonic()
                if pending and time.monotonic() - last_commit >= COMMIT_INTERVAL_SECONDS:
                    consumer.commit()
                    increment("commits")
                    pending = 0
                    last_commit = time.monotonic()
        except Exception as error:
            update_stats(status="degraded", lastError=str(error)[:2000])
            time.sleep(5)
        finally:
            if consumer is not None:
                consumer.close(autocommit=False)
            if producer is not None:
                producer.flush(timeout=10)
                producer.close(timeout=10)


class HealthHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path not in ("/health", "/ready"):
            self.send_response(404)
            self.end_headers()
            return
        with STATS_LOCK:
            snapshot = dict(STATS)
        body = json.dumps(snapshot).encode("utf-8")
        status_code = 200 if snapshot["status"] == "healthy" else 503
        self.send_response(status_code)
        self.send_header("content-type", "application/json")
        self.send_header("content-length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, *_args):
        return


def main():
    threading.Thread(target=processing_loop, daemon=True).start()
    ThreadingHTTPServer(("0.0.0.0", HEALTH_PORT), HealthHandler).serve_forever()


if __name__ == "__main__":
    main()
