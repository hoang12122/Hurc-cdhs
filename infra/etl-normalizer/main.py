import json
import os
import threading
import time
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

import psycopg2
from kafka import KafkaConsumer, KafkaProducer
from psycopg2.extras import execute_values

from contract import ContractError, normalize_event
from registry import contract_checksum, register_schema_contract

KAFKA_BROKERS = [value.strip() for value in os.getenv("KAFKA_BROKERS", "redpanda:9092").split(",") if value.strip()]
RAW_TOPICS = [value.strip() for value in os.getenv(
    "ETL_SOURCE_TOPICS", "iot.telemetry.raw,iot.telemetry.replay"
).split(",") if value.strip()]
NORMALIZED_TOPIC = os.getenv("ETL_NORMALIZED_TOPIC", "iot.telemetry.normalized")
DEAD_LETTER_TOPIC = os.getenv("ETL_DEAD_LETTER_TOPIC", "iot.telemetry.dead-letter")
CONSUMER_GROUP = os.getenv("ETL_CONSUMER_GROUP", "hurc-etl-normalizer-v2")
DATABASE_URL = os.getenv(
    "TIMESCALE_DATABASE_URL",
    "postgresql://postgres:change-me@timescaledb:5432/hurc_telemetry",
)
HEALTH_PORT = int(os.getenv("HEALTH_PORT", "8082"))
MAX_PAYLOAD_BYTES = min(2 * 1024 * 1024, max(16 * 1024, int(os.getenv("EVENT_MAX_PAYLOAD_BYTES", str(512 * 1024)))))
MAX_FUTURE_SECONDS = min(3600, max(0, int(os.getenv("ETL_MAX_FUTURE_SECONDS", "300"))))
MAX_CLOCK_SKEW_MS = min(3_600_000, max(1000, int(os.getenv("ETL_MAX_CLOCK_SKEW_MS", "120000"))))
WATERMARK_DELAY_SECONDS = min(86400, max(0, int(os.getenv("ETL_WATERMARK_DELAY_SECONDS", "300"))))
MAX_BATCH_SIZE = min(2000, max(1, int(os.getenv("ETL_COMMIT_BATCH_SIZE", "500"))))
MAX_CONSUMER_LAG = max(0, int(os.getenv("ETL_MAX_CONSUMER_LAG", "10000")))
STALE_AFTER_SECONDS = max(10, int(os.getenv("ETL_STALE_AFTER_SECONDS", "120")))
CONTRACT_PATH = Path(os.getenv("ETL_CONTRACT_PATH", "/app/contracts/telemetry-v1.schema.json"))
SCHEMA_REGISTRY_URL = os.getenv("SCHEMA_REGISTRY_URL", "http://redpanda:8081")
SCHEMA_SUBJECT = os.getenv("ETL_SCHEMA_SUBJECT", "hurc.telemetry-value")
SCHEMA_REQUIRED = os.getenv("ETL_SCHEMA_REGISTRY_REQUIRED", "false").lower() == "true"

STATS = {
    "status": "starting",
    "received": 0,
    "normalized": 0,
    "invalid": 0,
    "lateEvents": 0,
    "qualityWarnings": 0,
    "publishFailures": 0,
    "commits": 0,
    "consumerLag": 0,
    "lastBatchSize": 0,
    "lastBatchLatencyMs": 0,
    "schemaRegistered": False,
    "contractChecksum": None,
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


def snapshot():
    with STATS_LOCK:
        return dict(STATS)


def utc_now_iso():
    return datetime.now(timezone.utc).isoformat()


class DataQualityStore:
    def __init__(self):
        self.connection = None

    def connect(self):
        if self.connection is not None and not self.connection.closed:
            return
        self.connection = psycopg2.connect(DATABASE_URL)
        self.connection.autocommit = False

    def register_contract(self):
        checksum = contract_checksum(CONTRACT_PATH)
        self.connect()
        with self.connection:
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
        return checksum

    def record_many(self, records):
        if not records:
            return
        self.connect()
        values = []
        for message, code, severity, detail, event_id in records:
            values.append((
                event_id,
                message.topic,
                message.partition,
                message.offset,
                code[:80],
                severity,
                detail[:2000],
                len(message.value),
                message.value[:65536].decode("utf-8", errors="replace"),
            ))
        try:
            with self.connection:
                with self.connection.cursor() as cursor:
                    execute_values(
                        cursor,
                        """
                        INSERT INTO etl_data_quality_event(
                          event_id, topic, partition_id, offset_id, code,
                          severity, detail, payload_size, payload_excerpt
                        ) VALUES %s
                        ON CONFLICT (topic, partition_id, offset_id, code) DO NOTHING
                        """,
                        values,
                    )
        except Exception:
            if self.connection is not None:
                self.connection.close()
            self.connection = None
            raise


QUALITY_STORE = DataQualityStore()


def create_producer():
    return KafkaProducer(
        bootstrap_servers=KAFKA_BROKERS,
        acks="all",
        retries=20,
        linger_ms=20,
        compression_type="gzip",
        enable_idempotence=True,
        max_in_flight_requests_per_connection=5,
        value_serializer=lambda value: json.dumps(value, ensure_ascii=False, separators=(",", ":")).encode("utf-8"),
        key_serializer=lambda value: str(value).encode("utf-8"),
    )


def create_consumer():
    return KafkaConsumer(
        *RAW_TOPICS,
        bootstrap_servers=KAFKA_BROKERS,
        group_id=CONSUMER_GROUP,
        enable_auto_commit=False,
        auto_offset_reset="earliest",
        isolation_level="read_committed",
        max_poll_records=MAX_BATCH_SIZE,
        session_timeout_ms=30000,
        max_poll_interval_ms=300000,
        consumer_timeout_ms=1000,
    )


def decode_event(message):
    try:
        event = json.loads(message.value.decode("utf-8"))
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
        "source": {"topic": message.topic, "partition": message.partition, "offset": message.offset},
        "failure": {"code": code, "detail": detail[:2000]},
        "payloadSize": len(message.value),
        "payloadExcerpt": message.value[:65536].decode("utf-8", errors="replace"),
    }


def prepare_message(message):
    event = None
    try:
        event = decode_event(message)
        normalized = normalize_event(
            event,
            max_payload_bytes=MAX_PAYLOAD_BYTES,
            max_future_seconds=MAX_FUTURE_SECONDS,
            max_clock_skew_ms=MAX_CLOCK_SKEW_MS,
            watermark_delay_seconds=WATERMARK_DELAY_SECONDS,
        )
        normalized["source_topic"] = message.topic
        normalized["source_partition"] = message.partition
        normalized["source_offset"] = message.offset
        records = []
        if normalized["quality_flags"] or normalized["quality_score"] < 80:
            records.append((
                message,
                "QUALITY_WARNING",
                "WARNING",
                ",".join(normalized["quality_flags"]) or normalized["quality_status"],
                normalized["event_id"],
            ))
        return NORMALIZED_TOPIC, normalized["event_id"], normalized, records, normalized["late_event"] == 1
    except ContractError as error:
        envelope = dead_letter_envelope(message, error.code, str(error), event)
        record = (message, error.code, "ERROR", str(error), envelope["eventId"])
        return DEAD_LETTER_TOPIC, envelope["eventId"], envelope, [record], False


def calculate_lag(consumer):
    assignments = consumer.assignment()
    if not assignments:
        return 0
    end_offsets = consumer.end_offsets(assignments)
    return sum(max(0, end_offsets[item] - consumer.position(item)) for item in assignments)


def process_batch(producer, consumer, messages):
    started = time.monotonic()
    futures = []
    quality_records = []
    normalized_count = 0
    invalid_count = 0
    late_count = 0
    warning_count = 0

    for message in messages:
        topic, key, value, records, late = prepare_message(message)
        futures.append(producer.send(topic, key=key, value=value))
        quality_records.extend(records)
        if topic == NORMALIZED_TOPIC:
            normalized_count += 1
            late_count += 1 if late else 0
            warning_count += 1 if records else 0
        else:
            invalid_count += 1

    for future in futures:
        future.get(timeout=30)
    QUALITY_STORE.record_many(quality_records)
    consumer.commit()

    increment("received", len(messages))
    increment("normalized", normalized_count)
    increment("invalid", invalid_count)
    increment("lateEvents", late_count)
    increment("qualityWarnings", warning_count)
    increment("commits", 1)
    update_stats(
        status="healthy",
        consumerLag=calculate_lag(consumer),
        lastBatchSize=len(messages),
        lastBatchLatencyMs=round((time.monotonic() - started) * 1000),
        lastProcessedAt=utc_now_iso(),
        lastError=None,
    )


def processing_loop():
    while True:
        producer = None
        consumer = None
        try:
            checksum = QUALITY_STORE.register_contract()
            registry = register_schema_contract(
                CONTRACT_PATH,
                SCHEMA_REGISTRY_URL,
                SCHEMA_SUBJECT,
                required=SCHEMA_REQUIRED,
            )
            update_stats(
                schemaRegistered=registry["registered"],
                contractChecksum=checksum,
                lastError=registry.get("reason"),
            )
            producer = create_producer()
            consumer = create_consumer()
            update_stats(status="healthy")
            while True:
                polled = consumer.poll(timeout_ms=1000, max_records=MAX_BATCH_SIZE)
                messages = [message for batch in polled.values() for message in batch]
                update_stats(consumerLag=calculate_lag(consumer))
                if messages:
                    process_batch(producer, consumer, messages)
        except Exception as error:
            increment("publishFailures")
            update_stats(status="degraded", lastError=str(error)[:2000])
            time.sleep(5)
        finally:
            if consumer is not None:
                consumer.close(autocommit=False)
            if producer is not None:
                producer.flush(timeout=10)
                producer.close(timeout=10)


def is_ready(state):
    if state["status"] != "healthy" or state["consumerLag"] > MAX_CONSUMER_LAG:
        return False
    if SCHEMA_REQUIRED and not state["schemaRegistered"]:
        return False
    last_processed = state.get("lastProcessedAt")
    if state["received"] == 0 or not last_processed:
        return True
    try:
        last = datetime.fromisoformat(last_processed.replace("Z", "+00:00"))
        return (datetime.now(timezone.utc) - last).total_seconds() <= STALE_AFTER_SECONDS
    except (TypeError, ValueError):
        return False


def metrics_text(state):
    metrics = {
        "received": "hurc_etl_received_total",
        "normalized": "hurc_etl_normalized_total",
        "invalid": "hurc_etl_invalid_total",
        "lateEvents": "hurc_etl_late_events_total",
        "qualityWarnings": "hurc_etl_quality_warnings_total",
        "publishFailures": "hurc_etl_publish_failures_total",
        "commits": "hurc_etl_commits_total",
        "consumerLag": "hurc_etl_consumer_lag",
        "lastBatchSize": "hurc_etl_last_batch_size",
        "lastBatchLatencyMs": "hurc_etl_last_batch_latency_ms",
    }
    lines = [f"{metric} {int(state[key])}" for key, metric in metrics.items()]
    lines.append(f"hurc_etl_ready {1 if is_ready(state) else 0}")
    lines.append(f"hurc_etl_schema_registered {1 if state['schemaRegistered'] else 0}")
    return "\n".join(lines) + "\n"


class HealthHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        state = snapshot()
        if self.path == "/metrics":
            body = metrics_text(state).encode("utf-8")
            status_code = 200
            content_type = "text/plain; version=0.0.4"
        elif self.path in ("/health", "/ready"):
            body = json.dumps(state).encode("utf-8")
            status_code = 200 if self.path == "/health" or is_ready(state) else 503
            content_type = "application/json"
        else:
            self.send_response(404)
            self.end_headers()
            return
        self.send_response(status_code)
        self.send_header("content-type", content_type)
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
