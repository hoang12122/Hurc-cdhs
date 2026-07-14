import json
import time
from datetime import datetime, timezone

from kafka import KafkaConsumer, KafkaProducer, TopicPartition

from config import (
    ALLOWED_SOURCE_TOPICS,
    ALLOWED_TARGET_TOPICS,
    BATCH_SIZE,
    BROKERS,
    HEARTBEAT_SECONDS,
    MAX_RECORDS,
)


class WorkerStopping(RuntimeError):
    pass


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
        if checkpoint < beginnings[item]:
            raise RuntimeError(
                f"REPLAY_SOURCE_EXPIRED partition={item.partition} checkpoint={checkpoint} beginning={beginnings[item]}"
            )
        starts[item] = max(timestamp_starts[item], checkpoint)

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


def validate_request(request_item):
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


def execute_replay(request_item, control, stop_event, on_published):
    validate_request(request_item)
    source = request_item["source"]
    target = request_item["target"]
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
        control.progress(
            request_item["id"], progress, checkpoints, end_offsets, "replay range frozen"
        )

        completed = set()
        while len(completed) < len(partitions):
            if stop_event.is_set():
                raise WorkerStopping("replay worker is stopping")
            now = time.monotonic()
            if now - last_heartbeat >= HEARTBEAT_SECONDS:
                checkpoints = {
                    str(item.partition): min(int(consumer.position(item)), int(ends[item]))
                    for item in partitions
                }
                control.progress(
                    request_item["id"], progress, checkpoints, end_offsets, "lease heartbeat"
                )
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
                on_published(len(futures))
                checkpoints = {
                    str(item.partition): min(int(consumer.position(item)), int(ends[item]))
                    for item in partitions
                }
                control.progress(request_item["id"], progress, checkpoints, end_offsets)
                last_heartbeat = time.monotonic()
        return progress
    finally:
        consumer.close(autocommit=False)
        if producer is not None:
            producer.flush(timeout=10)
            producer.close(timeout=10)
