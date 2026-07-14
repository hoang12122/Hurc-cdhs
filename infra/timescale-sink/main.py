import json
import os
import signal
import threading
import time
import uuid
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

from kafka import KafkaConsumer

from store import TimescaleBatchStore


BROKERS = [item.strip() for item in os.getenv("KAFKA_BROKERS", "redpanda:9092").split(",") if item.strip()]
TOPIC = os.getenv("ETL_NORMALIZED_TOPIC", "iot.telemetry.normalized")
GROUP_ID = os.getenv("ETL_TIMESCALE_SINK_GROUP", "hurc-timescale-sink-v1")
DATABASE_URL = os.getenv(
    "TIMESCALE_DATABASE_URL",
    "postgresql://postgres:change-me@timescaledb:5432/hurc_telemetry",
)
HEALTH_PORT = int(os.getenv("HEALTH_PORT", "8083"))
MAX_BATCH = min(2000, max(1, int(os.getenv("ETL_SINK_BATCH_SIZE", "500"))))
MAX_LAG = max(0, int(os.getenv("ETL_MAX_CONSUMER_LAG", "10000")))
STALE_SECONDS = max(10, int(os.getenv("ETL_STALE_AFTER_SECONDS", "120")))
CODE_VERSION = os.getenv("APP_COMMIT_SHA") or os.getenv("GITHUB_SHA") or "unknown"
RUN_ID = str(uuid.uuid4())
STOP_EVENT = threading.Event()

STATS = {
    "status": "starting",
    "runId": RUN_ID,
    "received": 0,
    "inserted": 0,
    "duplicates": 0,
    "conflicts": 0,
    "invalid": 0,
    "commits": 0,
    "consumerLag": 0,
    "lastProcessedAt": None,
    "lastError": None,
}
STATS_LOCK = threading.Lock()


def update_stats(**values):
    with STATS_LOCK:
        STATS.update(values)


def increment(key, value):
    with STATS_LOCK:
        STATS[key] += value


def snapshot():
    with STATS_LOCK:
        return dict(STATS)


def create_consumer():
    return KafkaConsumer(
        TOPIC,
        bootstrap_servers=BROKERS,
        group_id=GROUP_ID,
        enable_auto_commit=False,
        auto_offset_reset="earliest",
        isolation_level="read_committed",
        max_poll_records=MAX_BATCH,
        session_timeout_ms=30000,
        max_poll_interval_ms=300000,
        consumer_timeout_ms=1000,
    )


def calculate_lag(consumer):
    assignments = consumer.assignment()
    if not assignments:
        return 0
    ends = consumer.end_offsets(assignments)
    return sum(max(0, ends[partition] - consumer.position(partition)) for partition in assignments)


def is_ready(state):
    if state["status"] != "healthy" or state["consumerLag"] > MAX_LAG:
        return False
    last_processed = state.get("lastProcessedAt")
    if state["received"] == 0 or not last_processed:
        return True
    try:
        elapsed = time.time() - time.mktime(time.strptime(last_processed[:19], "%Y-%m-%dT%H:%M:%S"))
        return elapsed <= STALE_SECONDS
    except (TypeError, ValueError):
        return False


def metrics_text(state):
    names = {
        "received": "hurc_etl_sink_received_total",
        "inserted": "hurc_etl_sink_inserted_total",
        "duplicates": "hurc_etl_sink_duplicates_total",
        "conflicts": "hurc_etl_sink_conflicts_total",
        "invalid": "hurc_etl_sink_invalid_total",
        "commits": "hurc_etl_sink_commits_total",
        "consumerLag": "hurc_etl_sink_consumer_lag",
    }
    lines = [f"{metric} {int(state[key])}" for key, metric in names.items()]
    lines.append(f"hurc_etl_sink_ready {1 if is_ready(state) else 0}")
    return "\n".join(lines) + "\n"


class HealthHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        state = snapshot()
        if self.path == "/metrics":
            body = metrics_text(state).encode("utf-8")
            self.send_response(200)
            self.send_header("content-type", "text/plain; version=0.0.4")
        elif self.path in ("/health", "/ready"):
            body = json.dumps(state).encode("utf-8")
            self.send_response(200 if self.path == "/health" or is_ready(state) else 503)
            self.send_header("content-type", "application/json")
        else:
            self.send_response(404)
            self.end_headers()
            return
        self.send_header("content-length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, *_args):
        return


def processing_loop():
    store = TimescaleBatchStore(DATABASE_URL, RUN_ID, CODE_VERSION)
    while not STOP_EVENT.is_set():
        consumer = None
        try:
            consumer = create_consumer()
            update_stats(status="healthy", lastError=None)
            while not STOP_EVENT.is_set():
                polled = consumer.poll(timeout_ms=1000, max_records=MAX_BATCH)
                messages = [message for group in polled.values() for message in group]
                update_stats(consumerLag=calculate_lag(consumer))
                if not messages:
                    continue
                result = store.store_batch(messages)
                consumer.commit()
                increment("received", len(messages))
                increment("inserted", result["inserted"])
                increment("duplicates", result["duplicates"])
                increment("conflicts", result["conflicts"])
                increment("invalid", result["invalid"])
                increment("commits", 1)
                update_stats(status="healthy", lastProcessedAt=result["processed_at"], lastError=None)
        except Exception as error:
            update_stats(status="degraded", lastError=str(error)[:2000])
            time.sleep(5)
        finally:
            if consumer is not None:
                consumer.close(autocommit=False)
    store.close(status="COMPLETED")


def stop(*_args):
    STOP_EVENT.set()


def main():
    signal.signal(signal.SIGTERM, stop)
    signal.signal(signal.SIGINT, stop)
    threading.Thread(target=processing_loop, daemon=True).start()
    server = ThreadingHTTPServer(("0.0.0.0", HEALTH_PORT), HealthHandler)
    while not STOP_EVENT.is_set():
        server.handle_request()


if __name__ == "__main__":
    main()
