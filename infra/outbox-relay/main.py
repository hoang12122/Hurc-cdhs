import json
import os
import socket
import threading
import time
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

import psycopg2
from kafka import KafkaProducer

DATABASE_URL = os.getenv(
    "OPS_DATABASE_URL",
    "postgresql://postgres:change-me@postgres:5432/hurc_ops",
)
KAFKA_BROKERS = [item.strip() for item in os.getenv("KAFKA_BROKERS", "redpanda:9092").split(",") if item.strip()]
EVENT_TOPIC = os.getenv("OUTBOX_EVENT_TOPIC", "ops.domain-events")
DEAD_LETTER_TOPIC = os.getenv("OUTBOX_DEAD_LETTER_TOPIC", "ops.domain-events.dead-letter")
BATCH_SIZE = min(500, max(1, int(os.getenv("OUTBOX_BATCH_SIZE", "100"))))
POLL_INTERVAL_SECONDS = max(0.2, float(os.getenv("OUTBOX_POLL_INTERVAL_SECONDS", "1")))
LOCK_TIMEOUT_SECONDS = min(3600, max(30, int(os.getenv("OUTBOX_LOCK_TIMEOUT_SECONDS", "300"))))
MAX_ATTEMPTS = min(100, max(1, int(os.getenv("OUTBOX_MAX_ATTEMPTS", "12"))))
HEALTH_PORT = int(os.getenv("HEALTH_PORT", "8081"))
WORKER_ID = os.getenv("OUTBOX_WORKER_ID", f"{socket.gethostname()}-{os.getpid()}")

STATS = {
    "status": "starting",
    "workerId": WORKER_ID,
    "claimed": 0,
    "published": 0,
    "failed": 0,
    "deadLettered": 0,
    "lastPublishedAt": None,
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


def connect_database():
    while True:
        try:
            connection = psycopg2.connect(DATABASE_URL)
            connection.autocommit = False
            update_stats(status="healthy", lastError=None)
            return connection
        except Exception as error:
            update_stats(status="degraded", lastError=f"database: {error}")
            time.sleep(5)


def connect_producer():
    while True:
        try:
            producer = KafkaProducer(
                bootstrap_servers=KAFKA_BROKERS,
                acks="all",
                retries=10,
                linger_ms=20,
                max_in_flight_requests_per_connection=1,
                value_serializer=lambda value: json.dumps(value, separators=(",", ":")).encode("utf-8"),
                key_serializer=lambda value: str(value).encode("utf-8"),
            )
            producer.bootstrap_connected()
            return producer
        except Exception as error:
            update_stats(status="degraded", lastError=f"kafka: {error}")
            time.sleep(5)


def claim_batch(connection):
    query = """
        WITH candidates AS (
          SELECT id
          FROM ops_outbox_events
          WHERE published_at IS NULL
            AND available_at <= NOW()
            AND (
              locked_at IS NULL
              OR locked_at < NOW() - (%s * INTERVAL '1 second')
            )
          ORDER BY created_at ASC
          FOR UPDATE SKIP LOCKED
          LIMIT %s
        )
        UPDATE ops_outbox_events event
        SET locked_at = NOW(), locked_by = %s
        FROM candidates
        WHERE event.id = candidates.id
        RETURNING
          event.id::text,
          event.aggregate_type,
          event.aggregate_id,
          event.event_type,
          event.schema_version,
          event.payload,
          event.headers,
          event.occurred_at,
          event.attempt_count;
    """
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(query, (LOCK_TIMEOUT_SECONDS, BATCH_SIZE, WORKER_ID))
            rows = cursor.fetchall()
    increment("claimed", len(rows))
    return rows


def event_envelope(row):
    (
        event_id,
        aggregate_type,
        aggregate_id,
        event_type,
        schema_version,
        payload,
        headers,
        occurred_at,
        attempt_count,
    ) = row
    return {
        "eventId": event_id,
        "eventType": event_type,
        "schemaVersion": schema_version,
        "occurredAt": occurred_at.astimezone(timezone.utc).isoformat(),
        "publishedAt": utc_now_iso(),
        "aggregate": {
            "type": aggregate_type,
            "id": aggregate_id,
        },
        "headers": headers or {},
        "payload": payload,
        "delivery": {
            "attempt": attempt_count + 1,
            "mode": "at-least-once",
        },
    }


def mark_published(connection, event_id, dead_letter_reason=None):
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                UPDATE ops_outbox_events
                SET published_at = NOW(),
                    locked_at = NULL,
                    locked_by = NULL,
                    last_error = %s
                WHERE id = %s::uuid AND locked_by = %s
                """,
                (dead_letter_reason, event_id, WORKER_ID),
            )


def mark_failed(connection, event_id, attempt_count, error):
    backoff_seconds = min(300, 2 ** min(attempt_count + 1, 8))
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                UPDATE ops_outbox_events
                SET attempt_count = attempt_count + 1,
                    last_error = %s,
                    available_at = NOW() + (%s * INTERVAL '1 second'),
                    locked_at = NULL,
                    locked_by = NULL
                WHERE id = %s::uuid AND locked_by = %s
                """,
                (str(error)[:2000], backoff_seconds, event_id, WORKER_ID),
            )


def publish_row(connection, producer, row):
    envelope = event_envelope(row)
    event_id = envelope["eventId"]
    attempt_count = row[-1]
    try:
        producer.send(EVENT_TOPIC, key=event_id, value=envelope).get(timeout=15)
        mark_published(connection, event_id)
        increment("published")
        update_stats(status="healthy", lastPublishedAt=utc_now_iso(), lastError=None)
    except Exception as error:
        increment("failed")
        if attempt_count + 1 >= MAX_ATTEMPTS:
            try:
                dead_letter = {
                    **envelope,
                    "deadLetteredAt": utc_now_iso(),
                    "failure": str(error)[:2000],
                }
                producer.send(DEAD_LETTER_TOPIC, key=event_id, value=dead_letter).get(timeout=15)
                mark_published(connection, event_id, f"DEAD_LETTER: {str(error)[:1800]}")
                increment("deadLettered")
                return
            except Exception as dead_letter_error:
                error = dead_letter_error
        mark_failed(connection, event_id, attempt_count, error)
        update_stats(status="degraded", lastError=str(error)[:2000])


def relay_loop():
    connection = connect_database()
    producer = connect_producer()
    while True:
        try:
            if connection.closed:
                connection = connect_database()
            rows = claim_batch(connection)
            if not rows:
                time.sleep(POLL_INTERVAL_SECONDS)
                continue
            for row in rows:
                publish_row(connection, producer, row)
        except Exception as error:
            update_stats(status="degraded", lastError=str(error)[:2000])
            try:
                connection.close()
            except Exception:
                pass
            connection = connect_database()
            time.sleep(POLL_INTERVAL_SECONDS)


class HealthHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path not in ("/health", "/ready"):
            self.send_response(404)
            self.end_headers()
            return
        with STATS_LOCK:
            body = json.dumps(STATS).encode("utf-8")
            status_code = 200 if STATS["status"] == "healthy" else 503
        self.send_response(status_code)
        self.send_header("content-type", "application/json")
        self.send_header("content-length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, *_args):
        return


def main():
    threading.Thread(target=relay_loop, daemon=True).start()
    ThreadingHTTPServer(("0.0.0.0", HEALTH_PORT), HealthHandler).serve_forever()


if __name__ == "__main__":
    main()
