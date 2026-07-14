import json
import os
import socket
import threading
import time
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

import psycopg2
from kafka import KafkaProducer

DATABASE_URL = os.getenv("TIMESCALE_DATABASE_URL", "postgresql://postgres:change-me@timescaledb:5432/hurc_telemetry")
BROKERS = [value.strip() for value in os.getenv("KAFKA_BROKERS", "redpanda:9092").split(",") if value.strip()]
TOPIC = os.getenv("ETL_ACCEPTED_TOPIC", "iot.telemetry.accepted")
BATCH_SIZE = min(2000, max(1, int(os.getenv("ETL_ACCEPTED_RELAY_BATCH_SIZE", "500"))))
POLL_SECONDS = max(0.1, float(os.getenv("ETL_ACCEPTED_RELAY_POLL_SECONDS", "1")))
LOCK_SECONDS = max(30, int(os.getenv("ETL_ACCEPTED_RELAY_LOCK_SECONDS", "300")))
MAX_ATTEMPTS = max(1, int(os.getenv("ETL_ACCEPTED_RELAY_MAX_ATTEMPTS", "20")))
MAX_PENDING = max(0, int(os.getenv("ETL_ACCEPTED_RELAY_MAX_PENDING", "10000")))
HEALTH_PORT = int(os.getenv("HEALTH_PORT", "8085"))
WORKER_ID = f"{socket.gethostname()}-{os.getpid()}"
STATS = {"status": "starting", "published": 0, "failed": 0, "pending": 0, "exhausted": 0, "lastPublishedAt": None, "lastError": None}
LOCK = threading.Lock()


def update(**values):
    with LOCK:
        STATS.update(values)


def increment(key):
    with LOCK:
        STATS[key] += 1


def snapshot():
    with LOCK:
        return dict(STATS)


def producer():
    return KafkaProducer(
        bootstrap_servers=BROKERS,
        acks="all",
        retries=20,
        linger_ms=10,
        compression_type="gzip",
        enable_idempotence=True,
        max_in_flight_requests_per_connection=5,
        key_serializer=lambda value: value.encode("utf-8"),
        value_serializer=lambda value: json.dumps(value, ensure_ascii=False, separators=(",", ":")).encode("utf-8"),
    )


def backlog(connection):
    with connection.cursor() as cursor:
        cursor.execute(
            """
            SELECT COUNT(*) FILTER (WHERE published_at IS NULL AND attempt_count < %s),
                   COUNT(*) FILTER (WHERE published_at IS NULL AND attempt_count >= %s)
            FROM etl_accepted_event_outbox
            """,
            (MAX_ATTEMPTS, MAX_ATTEMPTS),
        )
        pending, exhausted = cursor.fetchone()
        update(pending=int(pending), exhausted=int(exhausted))


def claim(connection):
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                WITH candidates AS (
                  SELECT event_id FROM etl_accepted_event_outbox
                  WHERE published_at IS NULL AND available_at <= NOW() AND attempt_count < %s
                    AND (locked_at IS NULL OR locked_at < NOW() - (%s * INTERVAL '1 second'))
                  ORDER BY created_at FOR UPDATE SKIP LOCKED LIMIT %s
                )
                UPDATE etl_accepted_event_outbox target
                SET locked_by = %s, locked_at = NOW(), attempt_count = attempt_count + 1
                FROM candidates WHERE target.event_id = candidates.event_id
                RETURNING target.event_id, target.payload
                """,
                (MAX_ATTEMPTS, LOCK_SECONDS, BATCH_SIZE, WORKER_ID),
            )
            return cursor.fetchall()


def mark_published(connection, event_id, metadata):
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                UPDATE etl_accepted_event_outbox
                SET published_at = NOW(), kafka_partition = %s, kafka_offset = %s,
                    locked_by = NULL, locked_at = NULL, last_error = NULL
                WHERE event_id = %s AND locked_by = %s
                """,
                (metadata.partition, metadata.offset, event_id, WORKER_ID),
            )
    increment("published")
    update(lastPublishedAt=datetime.now(timezone.utc).isoformat(), lastError=None)


def mark_failed(connection, event_id, error):
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                UPDATE etl_accepted_event_outbox
                SET available_at = NOW() + (LEAST(300, POWER(2, LEAST(attempt_count, 8))) * INTERVAL '1 second'),
                    locked_by = NULL, locked_at = NULL, last_error = %s
                WHERE event_id = %s AND locked_by = %s
                """,
                (str(error)[:2000], event_id, WORKER_ID),
            )
    increment("failed")
    update(lastError=str(error)[:2000])


def is_ready(state):
    return state["status"] == "healthy" and state["exhausted"] == 0 and (MAX_PENDING == 0 or state["pending"] <= MAX_PENDING)


class HealthHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        state = snapshot()
        if self.path not in ("/health", "/ready", "/metrics"):
            self.send_response(404); self.end_headers(); return
        if self.path == "/metrics":
            body = "\n".join([
                f"hurc_etl_accepted_published_total {state['published']}",
                f"hurc_etl_accepted_failed_total {state['failed']}",
                f"hurc_etl_accepted_pending {state['pending']}",
                f"hurc_etl_accepted_exhausted {state['exhausted']}",
                f"hurc_etl_accepted_ready {1 if is_ready(state) else 0}",
            ]).encode()
            code, content_type = 200, "text/plain; version=0.0.4"
        else:
            body = json.dumps(state).encode()
            code = 200 if self.path == "/health" or is_ready(state) else 503
            content_type = "application/json"
        self.send_response(code); self.send_header("content-type", content_type); self.send_header("content-length", str(len(body))); self.end_headers(); self.wfile.write(body)

    def log_message(self, *_args):
        return


def relay_loop():
    while True:
        connection = None
        kafka = None
        try:
            connection = psycopg2.connect(DATABASE_URL)
            connection.autocommit = False
            kafka = producer()
            update(status="healthy", lastError=None)
            while True:
                backlog(connection)
                rows = claim(connection)
                if not rows:
                    time.sleep(POLL_SECONDS)
                    continue
                for event_id, payload in rows:
                    try:
                        metadata = kafka.send(TOPIC, key=event_id, value=payload).get(timeout=30)
                        mark_published(connection, event_id, metadata)
                    except Exception as error:
                        mark_failed(connection, event_id, error)
                kafka.flush(timeout=30)
        except Exception as error:
            update(status="degraded", lastError=str(error)[:2000])
            time.sleep(5)
        finally:
            if kafka is not None: kafka.close(timeout=10)
            if connection is not None: connection.close()


def main():
    threading.Thread(target=relay_loop, daemon=True).start()
    ThreadingHTTPServer(("0.0.0.0", HEALTH_PORT), HealthHandler).serve_forever()


if __name__ == "__main__":
    main()
