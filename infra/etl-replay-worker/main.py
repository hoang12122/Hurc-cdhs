import json
import os
import threading
import time
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

import psycopg2
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
MAX_RECORDS = min(2000, max(1, int(os.getenv("ETL_REPLAY_BATCH_SIZE", "500"))))
HEALTH_PORT = int(os.getenv("HEALTH_PORT", "8084"))

STATS = {
    "status": "starting",
    "activeRequestId": None,
    "completed": 0,
    "failed": 0,
    "replayed": 0,
    "lastError": None,
    "lastCompletedAt": None,
}
LOCK = threading.Lock()


def update_stats(**values):
    with LOCK:
        STATS.update(values)


def increment(key, value=1):
    with LOCK:
        STATS[key] += value


def snapshot():
    with LOCK:
        return dict(STATS)


def create_producer():
    return KafkaProducer(
        bootstrap_servers=BROKERS,
        acks="all",
        retries=20,
        enable_idempotence=True,
        max_in_flight_requests_per_connection=5,
        compression_type="gzip",
        value_serializer=lambda value: json.dumps(value, ensure_ascii=False, separators=(",", ":")).encode("utf-8"),
    )


def claim_request(connection):
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT id, source_topic, target_topic, from_timestamp, to_timestamp
                FROM etl_replay_request
                WHERE status = 'APPROVED' AND approved_by IS NOT NULL
                ORDER BY requested_at
                FOR UPDATE SKIP LOCKED
                LIMIT 1
                """
            )
            row = cursor.fetchone()
            if row is None:
                return None
            cursor.execute(
                """
                UPDATE etl_replay_request
                SET status = 'RUNNING', started_at = NOW(), last_error = NULL
                WHERE id = %s
                """,
                (row[0],),
            )
            return {
                "id": str(row[0]),
                "source": row[1],
                "target": row[2],
                "from": row[3],
                "to": row[4],
            }


def update_request(connection, request_id, status, count, error=None):
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                UPDATE etl_replay_request
                SET status = %s,
                    replayed_count = %s,
                    completed_at = CASE WHEN %s IN ('COMPLETED', 'FAILED') THEN NOW() ELSE completed_at END,
                    last_error = %s
                WHERE id = %s
                """,
                (status, count, status, error, request_id),
            )


def timestamp_ms(value):
    if value is None:
        return None
    if value.tzinfo is None:
        value = value.replace(tzinfo=timezone.utc)
    return int(value.timestamp() * 1000)


def replay(request_item):
    source = request_item["source"]
    target = request_item["target"]
    if source not in ALLOWED_SOURCE_TOPICS:
        raise ValueError(f"source topic is not allowed: {source}")
    if target not in ALLOWED_TARGET_TOPICS:
        raise ValueError(f"target topic is not allowed: {target}")

    consumer = KafkaConsumer(
        bootstrap_servers=BROKERS,
        enable_auto_commit=False,
        auto_offset_reset="earliest",
        isolation_level="read_committed",
        consumer_timeout_ms=1000,
    )
    producer = create_producer()
    replayed = 0
    try:
        partitions = consumer.partitions_for_topic(source)
        if not partitions:
            raise RuntimeError(f"source topic has no partitions: {source}")
        topic_partitions = [TopicPartition(source, partition) for partition in sorted(partitions)]
        consumer.assign(topic_partitions)

        from_ms = timestamp_ms(request_item["from"])
        if from_ms is None:
            consumer.seek_to_beginning(*topic_partitions)
        else:
            starts = consumer.offsets_for_times({item: from_ms for item in topic_partitions})
            for item in topic_partitions:
                result = starts.get(item)
                if result is None:
                    consumer.seek_to_end(item)
                else:
                    consumer.seek(item, result.offset)

        to_ms = timestamp_ms(request_item["to"])
        if to_ms is None:
            stop_offsets = consumer.end_offsets(topic_partitions)
        else:
            results = consumer.offsets_for_times({item: to_ms for item in topic_partitions})
            ends = consumer.end_offsets(topic_partitions)
            stop_offsets = {
                item: results[item].offset if results.get(item) is not None else ends[item]
                for item in topic_partitions
            }

        completed = set()
        while len(completed) < len(topic_partitions):
            records = consumer.poll(timeout_ms=1000, max_records=MAX_RECORDS)
            futures = []
            for item in topic_partitions:
                if consumer.position(item) >= stop_offsets[item]:
                    completed.add(item)
            for batch in records.values():
                for message in batch:
                    item = TopicPartition(message.topic, message.partition)
                    if message.offset >= stop_offsets[item]:
                        completed.add(item)
                        continue
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
            replayed += len(futures)
            if futures:
                increment("replayed", len(futures))
        return replayed
    finally:
        consumer.close(autocommit=False)
        producer.flush(timeout=10)
        producer.close(timeout=10)


def worker_loop():
    while True:
        connection = None
        request_item = None
        try:
            connection = psycopg2.connect(DATABASE_URL)
            connection.autocommit = False
            request_item = claim_request(connection)
            if request_item is None:
                update_stats(status="healthy", activeRequestId=None, lastError=None)
                time.sleep(POLL_SECONDS)
                continue
            update_stats(status="healthy", activeRequestId=request_item["id"], lastError=None)
            count = replay(request_item)
            update_request(connection, request_item["id"], "COMPLETED", count)
            increment("completed")
            update_stats(activeRequestId=None, lastCompletedAt=datetime.now(timezone.utc).isoformat())
        except Exception as error:
            if connection is not None and request_item is not None:
                try:
                    update_request(connection, request_item["id"], "FAILED", 0, str(error)[:2000])
                except Exception:
                    pass
            increment("failed")
            update_stats(status="degraded", activeRequestId=None, lastError=str(error)[:2000])
            time.sleep(POLL_SECONDS)
        finally:
            if connection is not None:
                connection.close()


class HealthHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path not in ("/health", "/ready"):
            self.send_response(404)
            self.end_headers()
            return
        state = snapshot()
        body = json.dumps(state).encode("utf-8")
        status = 200 if self.path == "/health" or state["status"] == "healthy" else 503
        self.send_response(status)
        self.send_header("content-type", "application/json")
        self.send_header("content-length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, *_args):
        return


def main():
    threading.Thread(target=worker_loop, daemon=True).start()
    ThreadingHTTPServer(("0.0.0.0", HEALTH_PORT), HealthHandler).serve_forever()


if __name__ == "__main__":
    main()
