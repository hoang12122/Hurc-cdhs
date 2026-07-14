import json
import os
import socket
import time
from datetime import datetime, timezone

import psycopg2
from kafka import KafkaProducer

DATABASE_URL = os.getenv("TIMESCALE_DATABASE_URL", "postgresql://postgres:change-me@timescaledb:5432/hurc_telemetry")
BROKERS = [value.strip() for value in os.getenv("KAFKA_BROKERS", "redpanda:9092").split(",") if value.strip()]
TOPIC = os.getenv("ETL_ACCEPTED_TOPIC", "iot.telemetry.accepted")
BATCH_SIZE = min(2000, max(1, int(os.getenv("ETL_ACCEPTED_RELAY_BATCH_SIZE", "500"))))
POLL_SECONDS = max(0.1, float(os.getenv("ETL_ACCEPTED_RELAY_POLL_SECONDS", "1")))
LOCK_SECONDS = max(30, int(os.getenv("ETL_ACCEPTED_RELAY_LOCK_SECONDS", "300")))
MAX_ATTEMPTS = max(1, int(os.getenv("ETL_ACCEPTED_RELAY_MAX_ATTEMPTS", "20")))
WORKER_ID = f"{socket.gethostname()}-{os.getpid()}"


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


def claim(connection):
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                WITH candidates AS (
                  SELECT event_id
                  FROM etl_accepted_event_outbox
                  WHERE published_at IS NULL
                    AND available_at <= NOW()
                    AND attempt_count < %s
                    AND (locked_at IS NULL OR locked_at < NOW() - (%s * INTERVAL '1 second'))
                  ORDER BY created_at
                  FOR UPDATE SKIP LOCKED
                  LIMIT %s
                )
                UPDATE etl_accepted_event_outbox target
                SET locked_by = %s, locked_at = NOW(), attempt_count = attempt_count + 1
                FROM candidates
                WHERE target.event_id = candidates.event_id
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


def main():
    while True:
        connection = None
        kafka = None
        try:
            connection = psycopg2.connect(DATABASE_URL)
            connection.autocommit = False
            kafka = producer()
            while True:
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
            print(json.dumps({"time": datetime.now(timezone.utc).isoformat(), "status": "degraded", "error": str(error)[:2000]}), flush=True)
            time.sleep(5)
        finally:
            if kafka is not None:
                kafka.close(timeout=10)
            if connection is not None:
                connection.close()


if __name__ == "__main__":
    main()
