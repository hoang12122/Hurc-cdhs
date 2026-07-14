import json
import os
import signal
import socket
import threading
import time
import uuid
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

import psycopg2
from psycopg2.extras import Json
from kafka import KafkaConsumer, KafkaProducer, TopicPartition

BROKERS = [item.strip() for item in os.getenv("KAFKA_BROKERS", "redpanda:9092").split(",") if item.strip()]
DATABASE_URL = os.getenv(
    "TIMESCALE_DATABASE_URL",
    "postgresql://postgres:change-me@timescaledb:5432/hurc_telemetry",
)
ALLOWED_SOURCE_TOPICS = set(item.strip() for item in os.getenv(
    "ETL_REPLAY_ALLOWED_SOURCES", "iot.telemetry.raw"
).split(",") if item.strip())
ALLOWED_TARGET_TOPICS = set(item.strip() for item in os.getenv(
    "ETL_REPLAY_ALLOWED_TARGETS", "iot.telemetry.replay"
).split(",") if item.strip())
POLL_SECONDS = max(2, int(os.getenv("ETL_REPLAY_POLL_SECONDS", "10")))
MAX_RECORDS = max(1, int(os.getenv("ETL_REPLAY_MAX_RECORDS", "1000000")))
BATCH_SIZE = min(2000, max(1, int(os.getenv("ETL_REPLAY_BATCH_SIZE", "500"))))
LEASE_SECONDS = max(60, int(os.getenv("ETL_REPLAY_LEASE_SECONDS", "300")))
HEARTBEAT_SECONDS = max(10, min(LEASE_SECONDS // 2, int(os.getenv("ETL_REPLAY_HEARTBEAT_SECONDS", "30"))))
MAX_ATTEMPTS = max(1, int(os.getenv("ETL_REPLAY_MAX_ATTEMPTS", "3")))
HEALTH_PORT = int(os.getenv("HEALTH_PORT", "8084"))
WORKER_ID = os.getenv("ETL_REPLAY_WORKER_ID") or f"{socket.gethostname()}:{uuid.uuid4()}"
STOP_EVENT = threading.Event()

STATS = {
    "status": "starting",
    "workerId": WORKER_ID,
    "activeRequestId": None,
    "activeAttempt": None,
    "completed": 0,
    "failed": 0,
    "leaseRecoveries": 0,
    "replayed": 0,
    "lastError": None,
    "lastCompletedAt": None,
}
STATS_LOCK = threading.Lock()


def update_stats(**values):
    with STATS_LOCK:
        STATS.update(values)


def increment(key, value=1):
    with STATS_LOCK:
        STATS[key] += value


def snapshot():
    with STATS_LOCK:
        return dict(STATS)


def create_producer():
    return KafkaProducer(
        bootstrap_servers=BROKERS,
        acks="all",
        retries=20,
        enable_idempotence=True,
        max_in_flight_requests_per_connection=5,
        compression_type="gzip",
        value_serializer=lambda value: json.dumps(
            value, ensure_ascii=False, separators=(",", ":")
        ).encode("utf-8"),
    )


def audit(cursor, request_id, action, replayed_count=0, detail=None):
    cursor.execute(
        """
        INSERT INTO etl_replay_audit(
          request_id, action, worker_id, replayed_count, detail
        ) VALUES (%s, %s, %s, %s, %s)
        """,
        (request_id, action, WORKER_ID, replayed_count, detail),
    )


def expire_invalid_or_exhausted(connection):
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                UPDATE etl_replay_request
                SET status = 'FAILED', completed_at = NOW(),
                    last_error = 'Replay approval violates dual-control policy.'
                WHERE status = 'APPROVED'
                  AND approved_by IS NOT NULL
                  AND approved_by = requested_by
                RETURNING id, replayed_count
                """
            )
            for request_id, count in cursor.fetchall():
                audit(cursor, request_id, "FAILED", count, "requester and approver must be different")

            cursor.execute(
                """
                UPDATE etl_replay_request
                SET status = 'FAILED', completed_at = NOW(),
                    last_error = 'Replay lease expired and maximum attempts were exhausted.'
                WHERE status = 'RUNNING'
                  AND heartbeat_at < NOW() - (%s * INTERVAL '1 second')
                  AND attempt_count >= %s
                RETURNING id, replayed_count
                """,
                (LEASE_SECONDS, MAX_ATTEMPTS),
            )
            for request_id, count in cursor.fetchall():
                audit(cursor, request_id, "LEASE_EXPIRED", count, "maximum attempts exhausted")


def claim_request(connection):
    expire_invalid_or_exhausted(connection)
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT id, source_topic, target_topic, from_timestamp, to_timestamp,
                       checkpoint_offsets, source_end_offsets, replayed_count,
                       attempt_count, status
                FROM etl_replay_request
                WHERE (
                    status = 'APPROVED'
                    AND approved_by IS NOT NULL
                    AND approved_by <> requested_by
                ) OR (
                    status = 'RUNNING'
                    AND approved_by IS NOT NULL
                    AND approved_by <> requested_by
                    AND heartbeat_at < NOW() - (%s * INTERVAL '1 second')
                    AND attempt_count < %s
                )
                ORDER BY requested_at
                FOR UPDATE SKIP LOCKED
                LIMIT 1
                """,
                (LEASE_SECONDS, MAX_ATTEMPTS),
            )
            row = cursor.fetchone()
            if row is None:
                return None
            recovered = row[9] == "RUNNING"
            cursor.execute(
                """
                UPDATE etl_replay_request
                SET status = 'RUNNING', worker_id = %s, heartbeat_at = NOW(),
                    attempt_count = attempt_count + 1,
                    started_at = COALESCE(started_at, NOW()), last_error = NULL
                WHERE id = %s
                RETURNING attempt_count
                """,
                (WORKER_ID, row[0]),
            )
            attempt = cursor.fetchone()[0]
            audit(cursor, row[0], "CLAIMED", row[7], "recovered stale lease" if recovered else "approved request")
            if recovered:
                increment("leaseRecoveries")
            return {
                "id": str(row[0]),
                "source": row[1],
                "target": row[2],
                "from": row[3],
                "to": row[4],
                "checkpoints": dict(row[5] or {}),
                "endOffsets": dict(row[6] or {}),
                "replayedCount": int(row[7] or 0),
                "attempt": int(attempt),
            }


def update_progress(connection, request_id, replayed_count, checkpoints, end_offsets, detail):
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                UPDATE etl_replay_request
                SET heartbeat_at = NOW(),
                    replayed_count = GREATEST(replayed_count, %s),
                    checkpoint_offsets = %s,
                    source_end_offsets = %s
                WHERE id = %s AND status = 'RUNNING' AND worker_id = %s
                """,
                (replayed_count, Json(checkpoints), Json(end_offsets), request_id, WORKER_ID),
            )
            if cursor.rowcount != 1:
                raise RuntimeError("replay lease was lost")
            audit(cursor, request_id, "HEARTBEAT", replayed_count, detail)


def finish_request(connection, request_id, status, count, error=None):
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                UPDATE etl_replay_request
                SET status = %s, replayed_count = GREATEST(replayed_count, %s),
                    completed_at = NOW(), heartbeat_at = NOW(), last_error = %s
                WHERE id = %s AND status = 'RUNNING' AND worker_id = %s
                """,
                (status, count, error, request_id, WORKER_ID),
            )
            if cursor.rowcount != 1:
                raise RuntimeError("replay lease was lost before completion")
            audit(cursor, request_id, status, count, error)


def timestamp_ms(value):
    if value is None:
        return None
    if value.tzinfo is None:
        value = value.replace(tzinfo=timezone.utc)
    return int(value.timestamp() * 1000)


def resolve_bounds(consumer, request_item, partitions):
    beginnings = consumer.beginning_offsets(partitions)
    current_ends = consumer.end_offsets(partitions)
    from_ms = timestamp_ms(request_item["from"])
    if from_ms is None:
        timestamp_starts = beginnings
    else:
        results = consumer.offsets_for_times({item: from_ms for item in partitions})
        timestamp_starts = {
            item: results[item].offset if results.get(item) is not None else current_ends[item]
            for item in partitions
        }

    checkpoints = request_item["checkpoints"]
    starts = {}
    for item in partitions:
        checkpoint = int(checkpoints.get(str(item.partition), timestamp_starts[item]))
        starts[item] = max(timestamp_starts[item], checkpoint)
        if checkpoint < beginnings[item]:
            raise RuntimeError(
                f"REPLAY_SOURCE_EXPIRED partition={item.partition} checkpoint={checkpoint} beginning={beginnings[item]}"
            )

    persisted_ends = request_item["endOffsets"]
    if persisted_ends:
        ends = {
            item: int(persisted_ends.get(str(item.partition), current_ends[item]))
            for item in partitions
        }
    else:
        to_ms = timestamp_ms(request_item["to"])
        if to_ms is None:
            ends = current_ends
        else:
            results = consumer.offsets_for_times({item: to_ms for item in partitions})
            ends = {
                item: results[item].offset if results.get(item) is not None else current_ends[item]
                for item in partitions
            }
    for item in partitions:
        if ends[item] > current_ends[item]:
            raise RuntimeError(
                f"REPLAY_SOURCE_EXPIRED partition={item.partition} end={ends[item]} current_end={current_ends[item]}"
            )
        if ends[item] < starts[item]:
            ends[item] = starts[item]
    return starts, ends


def replay(request_item, connection):
    source = request_item["source"]
    target = request_item["target"]
    if source not in ALLOWED_SOURCE_TOPICS:
        raise ValueError(f"source topic is not allowed: {source}")
    if target not in ALLOWED_TARGET_TOPICS:
        raise ValueError(f"target topic is not allowed: {target}")
    if source == target:
        raise ValueError("source and target topics must be different")
    if request_item["from"] and request_item["to"] and request_item["from"] >= request_item["to"]:
        raise ValueError("from_timestamp must be earlier than to_timestamp")

    consumer = KafkaConsumer(
        bootstrap_servers=BROKERS,
        enable_auto_commit=False,
        auto_offset_reset="earliest",
        isolation_level="read_committed",
        consumer_timeout_ms=1000,
    )
    producer = None
    progress = request_item["replayedCount"]
    last_heartbeat = 0.0
    try:
        producer = create_producer()
        partition_ids = consumer.partitions_for_topic(source)
        if not partition_ids:
            raise RuntimeError(f"source topic has no partitions: {source}")
        partitions = [TopicPartition(source, partition) for partition in sorted(partition_ids)]
        consumer.assign(partitions)
        starts, ends = resolve_bounds(consumer, request_item, partitions)
        end_offsets = {str(item.partition): int(ends[item]) for item in partitions}
        for item in partitions:
            consumer.seek(item, starts[item])
        checkpoints = {str(item.partition): int(starts[item]) for item in partitions}
        update_progress(connection, request_item["id"], progress, checkpoints, end_offsets, "replay range frozen")

        completed = set()
        while len(completed) < len(partitions) and not STOP_EVENT.is_set():
            now = time.monotonic()
            if now - last_heartbeat >= HEARTBEAT_SECONDS:
                checkpoints = {
                    str(item.partition): min(int(consumer.position(item)), int(ends[item]))
                    for item in partitions
                }
                update_progress(connection, request_item["id"], progress, checkpoints, end_offsets, "lease heartbeat")
                last_heartbeat = now

            records = consumer.poll(timeout_ms=1000, max_records=BATCH_SIZE)
            futures = []
            for item in partitions:
                if consumer.position(item) >= ends[item]:
                    completed.add(item)
            for batch in records.values():
                for message in batch:
                    item = TopicPartition(message.topic, message.partition)
                    if message.offset >= ends[item]:
                        completed.add(item)
                        continue
                    if progress + len(futures) + 1 > MAX_RECORDS:
                        raise RuntimeError(f"replay exceeds ETL_REPLAY_MAX_RECORDS={MAX_RECORDS}")
                    try:
                        event = json.loads(message.value.decode("utf-8"))
                    except (UnicodeDecodeError, json.JSONDecodeError) as error:
                        raise RuntimeError(
                            f"invalid Bronze JSON at {message.topic}:{message.partition}:{message.offset}"
                        ) from error
                    if not isinstance(event, dict):
                        raise RuntimeError(
                            f"invalid Bronze root at {message.topic}:{message.partition}:{message.offset}"
                        )
                    event["_replay"] = {
                        "requestId": request_item["id"],
                        "sourceTopic": message.topic,
                        "sourcePartition": message.partition,
                        "sourceOffset": message.offset,
                        "replayedAt": datetime.now(timezone.utc).isoformat(),
                    }
                    key = message.key or str(event.get("eventId", "")).encode("utf-8")
                    futures.append(producer.send(target, key=key, value=event))
            for future in futures:
                future.get(timeout=30)
            progress += len(futures)
            if futures:
                increment("replayed", len(futures))
                checkpoints = {
                    str(item.partition): min(int(consumer.position(item)), int(ends[item]))
                    for item in partitions
                }
                update_progress(connection, request_item["id"], progress, checkpoints, end_offsets, "batch published")
                last_heartbeat = time.monotonic()

        if STOP_EVENT.is_set():
            raise RuntimeError("replay worker is stopping")
        return progress
    finally:
        consumer.close(autocommit=False)
        if producer is not None:
            producer.flush(timeout=10)
            producer.close(timeout=10)


def worker_loop():
    while not STOP_EVENT.is_set():
        connection = None
        request_item = None
        try:
            connection = psycopg2.connect(DATABASE_URL)
            connection.autocommit = False
            request_item = claim_request(connection)
            if request_item is None:
                update_stats(status="healthy", activeRequestId=None, activeAttempt=None, lastError=None)
                STOP_EVENT.wait(POLL_SECONDS)
                continue
            update_stats(
                status="healthy",
                activeRequestId=request_item["id"],
                activeAttempt=request_item["attempt"],
                lastError=None,
            )
            count = replay(request_item, connection)
            finish_request(connection, request_item["id"], "COMPLETED", count)
            increment("completed")
            update_stats(
                activeRequestId=None,
                activeAttempt=None,
                lastCompletedAt=datetime.now(timezone.utc).isoformat(),
            )
        except Exception as error:
            if connection is not None and request_item is not None:
                try:
                    finish_request(
                        connection,
                        request_item["id"],
                        "FAILED",
                        request_item["replayedCount"],
                        str(error)[:2000],
                    )
                except Exception:
                    pass
            increment("failed")
            update_stats(
                status="degraded",
                activeRequestId=None,
                activeAttempt=None,
                lastError=str(error)[:2000],
            )
            STOP_EVENT.wait(POLL_SECONDS)
        finally:
            if connection is not None:
                connection.close()


def metrics_text(state):
    values = {
        "completed": "hurc_etl_replay_completed_total",
        "failed": "hurc_etl_replay_failed_total",
        "leaseRecoveries": "hurc_etl_replay_lease_recoveries_total",
        "replayed": "hurc_etl_replay_records_total",
    }
    lines = [f"{metric} {int(state[key])}" for key, metric in values.items()]
    lines.append(f"hurc_etl_replay_active {1 if state['activeRequestId'] else 0}")
    return "\n".join(lines) + "\n"


class HealthHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        state = snapshot()
        if self.path == "/metrics":
            body = metrics_text(state).encode("utf-8")
            status = 200
            content_type = "text/plain; version=0.0.4"
        elif self.path in ("/health", "/ready"):
            body = json.dumps(state).encode("utf-8")
            status = 200 if self.path == "/health" or state["status"] == "healthy" else 503
            content_type = "application/json"
        else:
            self.send_response(404)
            self.end_headers()
            return
        self.send_response(status)
        self.send_header("content-type", content_type)
        self.send_header("content-length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, *_args):
        return


def stop(*_args):
    STOP_EVENT.set()


def main():
    signal.signal(signal.SIGTERM, stop)
    signal.signal(signal.SIGINT, stop)
    threading.Thread(target=worker_loop, daemon=True).start()
    server = ThreadingHTTPServer(("0.0.0.0", HEALTH_PORT), HealthHandler)
    server.timeout = 1
    while not STOP_EVENT.is_set():
        server.handle_request()
    server.server_close()


if __name__ == "__main__":
    main()
