import sys
import unittest
from datetime import datetime, timedelta, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from contract import ContractError, normalize_event


NOW = datetime(2026, 7, 13, 10, 0, 0, tzinfo=timezone.utc)


def valid_event():
    return {
        "eventId": "evt-001",
        "eventType": "telemetry.received",
        "schemaVersion": "1.0.0",
        "occurredAt": "2026-07-13T09:59:58Z",
        "traceId": "trace-001",
        "source": {"environment": "uat", "gatewayId": "gw-01"},
        "asset": {
            "assetId": "PSD-01",
            "line": "L1",
            "station": "BT",
            "subsystem": "PSD",
        },
        "quality": {"status": "good", "clockSkewMs": 50, "duplicate": False},
        "payload": {"temperature": 31.2, "anomalyScore": 0.12},
        "_mqttTopic": "hurc/uat/L1/BT/PSD/PSD-01/telemetry",
        "_ingestedAt": "2026-07-13T09:59:59Z",
    }


class TelemetryContractTests(unittest.TestCase):
    def test_normalizes_valid_event(self):
        result = normalize_event(valid_event(), now=NOW)
        self.assertEqual(result["event_id"], "evt-001")
        self.assertEqual(result["asset_id"], "PSD-01")
        self.assertEqual(result["quality_score"], 100)
        self.assertEqual(result["quality_flags"], [])
        self.assertEqual(result["processing_latency_ms"], 1000)
        self.assertEqual(len(result["event_checksum"]), 64)

    def test_checksum_is_deterministic(self):
        first = normalize_event(valid_event(), now=NOW)
        second = normalize_event(valid_event(), now=NOW)
        self.assertEqual(first["event_checksum"], second["event_checksum"])

    def test_rejects_asset_topic_mismatch(self):
        event = valid_event()
        event["asset"]["assetId"] = "PSD-02"
        with self.assertRaisesRegex(ContractError, "does not match MQTT topic") as context:
            normalize_event(event, now=NOW)
        self.assertEqual(context.exception.code, "ASSET_TOPIC_MISMATCH")

    def test_rejects_future_event(self):
        event = valid_event()
        event["occurredAt"] = (NOW + timedelta(minutes=10)).isoformat()
        with self.assertRaises(ContractError) as context:
            normalize_event(event, now=NOW, max_future_seconds=300)
        self.assertEqual(context.exception.code, "FUTURE_EVENT")

    def test_marks_missing_provenance_as_warning(self):
        event = valid_event()
        event.pop("traceId")
        event["source"].pop("gatewayId")
        result = normalize_event(event, now=NOW)
        self.assertIn("MISSING_TRACE_ID", result["quality_flags"])
        self.assertIn("MISSING_GATEWAY_ID", result["quality_flags"])
        self.assertLess(result["quality_score"], 100)

    def test_rejects_unsupported_schema(self):
        event = valid_event()
        event["schemaVersion"] = "2.0.0"
        with self.assertRaises(ContractError) as context:
            normalize_event(event, now=NOW)
        self.assertEqual(context.exception.code, "UNSUPPORTED_SCHEMA")


if __name__ == "__main__":
    unittest.main()
