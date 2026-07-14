import sys
import unittest
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from types import ModuleType

sys.path.insert(0, str(Path(__file__).parent))


@dataclass(frozen=True)
class TopicPartition:
    topic: str
    partition: int


fake_kafka = ModuleType("kafka")
fake_kafka.TopicPartition = TopicPartition
fake_kafka.KafkaConsumer = object
fake_kafka.KafkaProducer = object
sys.modules["kafka"] = fake_kafka

from replay import resolve_bounds, validate_request


class OffsetAndTimestamp:
    def __init__(self, offset, timestamp):
        self.offset = offset
        self.timestamp = timestamp


class FakeConsumer:
    def __init__(self, beginnings, ends, timestamp_offsets=None):
        self.beginnings = beginnings
        self.ends = ends
        self.timestamp_offsets = timestamp_offsets or {}

    def beginning_offsets(self, partitions):
        return {item: self.beginnings[item.partition] for item in partitions}

    def end_offsets(self, partitions):
        return {item: self.ends[item.partition] for item in partitions}

    def offsets_for_times(self, requests):
        return {
            item: self.timestamp_offsets.get((item.partition, timestamp))
            for item, timestamp in requests.items()
        }


class ReplayPolicyTests(unittest.TestCase):
    def request(self, **overrides):
        value = {
            "id": "request-1",
            "source": "iot.telemetry.raw",
            "target": "iot.telemetry.replay",
            "from": None,
            "to": None,
            "checkpoints": {},
            "endOffsets": {},
            "replayedCount": 0,
            "attempt": 1,
        }
        value.update(overrides)
        return value

    def test_accepts_allowlisted_distinct_topics(self):
        validate_request(self.request())

    def test_rejects_same_source_and_target(self):
        with self.assertRaisesRegex(ValueError, "must be different"):
            validate_request(self.request(target="iot.telemetry.raw"))

    def test_rejects_unapproved_source_topic(self):
        with self.assertRaisesRegex(ValueError, "source topic is not allowed"):
            validate_request(self.request(source="other.raw"))

    def test_rejects_unapproved_target_topic(self):
        with self.assertRaisesRegex(ValueError, "target topic is not allowed"):
            validate_request(self.request(target="other.replay"))

    def test_rejects_invalid_time_window(self):
        timestamp = datetime(2026, 7, 1, tzinfo=timezone.utc)
        with self.assertRaisesRegex(ValueError, "earlier than"):
            validate_request(self.request(**{"from": timestamp, "to": timestamp}))

    def test_resumes_from_persisted_checkpoints_and_frozen_ends(self):
        partitions = [TopicPartition("iot.telemetry.raw", 0), TopicPartition("iot.telemetry.raw", 1)]
        consumer = FakeConsumer({0: 10, 1: 20}, {0: 100, 1: 200})
        starts, ends = resolve_bounds(
            consumer,
            self.request(
                checkpoints={"0": 50, "1": 70},
                endOffsets={"0": 90, "1": 150},
            ),
            partitions,
        )
        self.assertEqual(starts[partitions[0]], 50)
        self.assertEqual(starts[partitions[1]], 70)
        self.assertEqual(ends[partitions[0]], 90)
        self.assertEqual(ends[partitions[1]], 150)

    def test_rejects_checkpoint_removed_by_retention(self):
        partition = TopicPartition("iot.telemetry.raw", 0)
        consumer = FakeConsumer({0: 50}, {0: 100})
        with self.assertRaisesRegex(RuntimeError, "REPLAY_SOURCE_EXPIRED"):
            resolve_bounds(
                consumer,
                self.request(checkpoints={"0": 40}, endOffsets={"0": 90}),
                [partition],
            )

    def test_rejects_frozen_end_removed_or_unavailable(self):
        partition = TopicPartition("iot.telemetry.raw", 0)
        consumer = FakeConsumer({0: 10}, {0: 80})
        with self.assertRaisesRegex(RuntimeError, "REPLAY_SOURCE_EXPIRED"):
            resolve_bounds(
                consumer,
                self.request(checkpoints={"0": 20}, endOffsets={"0": 90}),
                [partition],
            )

    def test_uses_timestamp_offsets_for_new_request(self):
        partition = TopicPartition("iot.telemetry.raw", 0)
        start = datetime(2026, 7, 1, 0, 0, tzinfo=timezone.utc)
        end = datetime(2026, 7, 1, 1, 0, tzinfo=timezone.utc)
        consumer = FakeConsumer(
            {0: 10},
            {0: 100},
            {
                (0, int(start.timestamp() * 1000)): OffsetAndTimestamp(25, int(start.timestamp() * 1000)),
                (0, int(end.timestamp() * 1000)): OffsetAndTimestamp(75, int(end.timestamp() * 1000)),
            },
        )
        starts, ends = resolve_bounds(
            consumer,
            self.request(**{"from": start, "to": end}),
            [partition],
        )
        self.assertEqual(starts[partition], 25)
        self.assertEqual(ends[partition], 75)


if __name__ == "__main__":
    unittest.main()
