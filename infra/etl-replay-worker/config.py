import os
import socket
import uuid

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
HEARTBEAT_SECONDS = max(
    10,
    min(LEASE_SECONDS // 2, int(os.getenv("ETL_REPLAY_HEARTBEAT_SECONDS", "30"))),
)
MAX_ATTEMPTS = max(1, int(os.getenv("ETL_REPLAY_MAX_ATTEMPTS", "3")))
HEALTH_PORT = int(os.getenv("HEALTH_PORT", "8084"))
WORKER_ID = os.getenv("ETL_REPLAY_WORKER_ID") or f"{socket.gethostname()}:{uuid.uuid4()}"
