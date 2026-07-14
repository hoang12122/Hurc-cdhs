import json
from collections import defaultdict
from datetime import datetime, timezone

import psycopg2
from psycopg2.extras import Json, execute_values

REQUIRED_FIELDS = {
    "event_id", "event_type", "schema_version", "occurred_at", "processed_at",
    "environment", "line_code", "station_code", "subsystem", "asset_id",
    "quality_score", "event_checksum", "payload_json", "raw_event", "ingest_version",
}


def validate_normalized_event(event):
    if not isinstance(event, dict):
        raise ValueError("normalized event root must be an object")
    missing = sorted(field for field in REQUIRED_FIELDS if field not in event)
    if missing:
        raise ValueError(f"normalized event is missing: {','.join(missing)}")
    checksum = str(event["event_checksum"])
    if len(checksum) != 64 or any(ch not in "0123456789abcdefABCDEF" for ch in checksum):
        raise ValueError("event_checksum must be a SHA-256 hex string")
    return event


def _json_value(value):
    return Json(json.loads(value)) if isinstance(value, str) else Json(value)


def _source(message, event):
    return (
        str(event.get("source_topic") or message.topic),
        int(event.get("source_partition", message.partition)),
        int(event.get("source_offset", message.offset)),
    )


class TimescaleBatchStore:
    def __init__(self, database_url, run_id, code_version):
        self.database_url = database_url
        self.run_id = run_id
        self.code_version = code_version
        self.connection = None

    def connect(self):
        if self.connection is not None and not self.connection.closed:
            return
        self.connection = psycopg2.connect(self.database_url)
        self.connection.autocommit = False
        with self.connection:
            with self.connection.cursor() as cursor:
                cursor.execute(
                    """
                    INSERT INTO etl_pipeline_run(
                      run_id, pipeline_name, mode, status, contract_version, code_version
                    ) VALUES (%s, 'timescale-sink', 'STREAM', 'RUNNING', '1.0.0', %s)
                    ON CONFLICT (run_id) DO NOTHING
                    """,
                    (self.run_id, self.code_version),
                )

    def close(self, status="ABORTED", error=None):
        if self.connection is None or self.connection.closed:
            return
        try:
            with self.connection:
                with self.connection.cursor() as cursor:
                    cursor.execute(
                        """
                        UPDATE etl_pipeline_run
                        SET status = %s, completed_at = NOW(), last_error = %s
                        WHERE run_id = %s
                        """,
                        (status, error, self.run_id),
                    )
        finally:
            self.connection.close()

    def _lock_event_ids(self, cursor, event_ids):
        ordered = sorted(set(event_ids))
        if not ordered:
            return
        cursor.execute(
            """
            SELECT pg_advisory_xact_lock(hashtextextended(event_id, 0))
            FROM unnest(%s::text[]) AS event_id
            ORDER BY event_id
            """,
            (ordered,),
        )

    def _existing_identities(self, cursor, event_ids):
        if not event_ids:
            return {}
        cursor.execute(
            "SELECT event_id, event_checksum FROM etl_event_identity WHERE event_id = ANY(%s) FOR UPDATE",
            (list(event_ids),),
        )
        return {event_id: checksum.strip() for event_id, checksum in cursor.fetchall()}

    def store_batch(self, messages):
        self.connect()
        prepared = []
        invalid = []
        checkpoint_by_source = {}
        for message in messages:
            checkpoint_by_source[(message.topic, message.partition)] = max(
                checkpoint_by_source.get((message.topic, message.partition), -1),
                message.offset + 1,
            )
            try:
                prepared.append((message, validate_normalized_event(json.loads(message.value.decode("utf-8")))))
            except Exception as error:
                invalid.append((message, str(error)))

        by_event_id = defaultdict(list)
        for item in prepared:
            by_event_id[item[1]["event_id"]].append(item)

        inserted = []
        duplicates = []
        conflicts = []
        identity_inserts = []
        identity_updates = []
        lineage_rows = []
        now = datetime.now(timezone.utc)

        try:
            with self.connection:
                with self.connection.cursor() as cursor:
                    self._lock_event_ids(cursor, by_event_id.keys())
                    existing = self._existing_identities(cursor, by_event_id.keys())

                    for event_id, items in by_event_id.items():
                        known_checksum = existing.get(event_id)
                        checksums = {str(event["event_checksum"]) for _message, event in items}
                        if known_checksum is None and len(checksums) > 1:
                            conflicts.extend(
                                (message, event, "different checksums in the same batch")
                                for message, event in items
                            )
                            continue

                        if known_checksum is None:
                            first_message, first_event = items[0]
                            inserted.append((first_message, first_event))
                            duplicates.extend(items[1:])
                            topic, partition, offset = _source(first_message, first_event)
                            identity_inserts.append((
                                event_id, first_event["event_checksum"], topic, partition, offset, len(items), 0,
                            ))
                        else:
                            conflict_count = 0
                            for message, event in items:
                                if str(event["event_checksum"]) == known_checksum:
                                    duplicates.append((message, event))
                                else:
                                    conflicts.append((message, event, "eventId already exists with a different checksum"))
                                    conflict_count += 1
                            identity_updates.append((len(items), conflict_count, event_id))

                    classification = {}
                    for message, event in inserted:
                        classification[(event["event_id"],) + _source(message, event)] = "timescale"
                    for message, event in duplicates:
                        classification[(event["event_id"],) + _source(message, event)] = "timescale-duplicate"
                    for message, event, _detail in conflicts:
                        classification[(event["event_id"],) + _source(message, event)] = "timescale-quarantine"
                    for message, event in prepared:
                        topic, partition, offset = _source(message, event)
                        target = classification.get((event["event_id"], topic, partition, offset), "timescale-quarantine")
                        lineage_rows.append((topic, partition, offset, event["event_id"], event["event_checksum"], target, self.run_id))

                    if identity_inserts:
                        execute_values(
                            cursor,
                            """
                            INSERT INTO etl_event_identity(
                              event_id, event_checksum, first_source_topic,
                              first_source_partition, first_source_offset, seen_count, conflict_count
                            ) VALUES %s
                            """,
                            identity_inserts,
                        )
                    for seen_count, conflict_count, event_id in identity_updates:
                        cursor.execute(
                            """
                            UPDATE etl_event_identity SET
                              seen_count = seen_count + %s,
                              conflict_count = conflict_count + %s,
                              last_seen_at = NOW()
                            WHERE event_id = %s
                            """,
                            (seen_count, conflict_count, event_id),
                        )

                    if inserted:
                        rows = []
                        for message, event in inserted:
                            topic, partition, offset = _source(message, event)
                            rows.append((
                                event["event_id"], event["event_type"], event["schema_version"],
                                event["occurred_at"], event.get("ingested_at"), event["processed_at"],
                                event["environment"], event["line_code"], event["station_code"],
                                event["subsystem"], event["asset_id"], event.get("gateway_id") or None,
                                event.get("quality_status", "unknown"), int(event["quality_score"]),
                                list(event.get("quality_flags") or []), event.get("clock_skew_ms"),
                                bool(event.get("duplicate", 0)), event.get("trace_id") or None,
                                _json_value(event["payload_json"]), _json_value(event["raw_event"]),
                                event["event_checksum"], int(event.get("payload_bytes", 0)),
                                int(event.get("processing_latency_ms", 0)), int(event.get("event_age_ms", 0)),
                                bool(event.get("late_event", 0)), int(event.get("lateness_ms", 0)),
                                topic, partition, offset, int(event["ingest_version"]),
                            ))
                        execute_values(
                            cursor,
                            """
                            INSERT INTO telemetry_event(
                              event_id, event_type, schema_version, occurred_at, ingested_at, processed_at,
                              environment, line_code, station_code, subsystem, asset_id, gateway_id,
                              quality_status, quality_score, quality_flags, clock_skew_ms, duplicate,
                              trace_id, payload, raw_event, event_checksum, payload_bytes,
                              processing_latency_ms, event_age_ms, late_event, lateness_ms,
                              source_topic, source_partition, source_offset, ingest_version
                            ) VALUES %s
                            ON CONFLICT (event_id, occurred_at) DO UPDATE SET
                              processed_at = EXCLUDED.processed_at,
                              quality_score = EXCLUDED.quality_score,
                              quality_flags = EXCLUDED.quality_flags,
                              ingest_version = GREATEST(telemetry_event.ingest_version, EXCLUDED.ingest_version)
                            """,
                            rows,
                        )

                    if lineage_rows:
                        execute_values(
                            cursor,
                            """
                            INSERT INTO etl_lineage_event(
                              source_topic, source_partition, source_offset,
                              event_id, event_checksum, target_name, run_id
                            ) VALUES %s ON CONFLICT DO NOTHING
                            """,
                            lineage_rows,
                        )

                    quality_rows = [
                        (None, message.topic, message.partition, message.offset,
                         "INVALID_NORMALIZED_EVENT", "ERROR", detail, len(message.value))
                        for message, detail in invalid
                    ] + [
                        (event["event_id"], message.topic, message.partition, message.offset,
                         "EVENT_ID_COLLISION", "ERROR", detail, len(message.value))
                        for message, event, detail in conflicts
                    ]
                    if quality_rows:
                        execute_values(
                            cursor,
                            """
                            INSERT INTO etl_data_quality_event(
                              event_id, topic, partition_id, offset_id, code,
                              severity, detail, payload_size
                            ) VALUES %s
                            ON CONFLICT (topic, partition_id, offset_id, code) DO NOTHING
                            """,
                            quality_rows,
                        )

                    for (topic, partition), offset in checkpoint_by_source.items():
                        cursor.execute(
                            """
                            INSERT INTO etl_checkpoint(
                              pipeline_name, source_topic, partition_id, committed_offset, updated_at
                            ) VALUES ('timescale-sink', %s, %s, %s, NOW())
                            ON CONFLICT (pipeline_name, source_topic, partition_id)
                            DO UPDATE SET committed_offset = GREATEST(
                              etl_checkpoint.committed_offset, EXCLUDED.committed_offset
                            ), updated_at = NOW()
                            """,
                            (topic, partition, offset),
                        )

                    cursor.execute(
                        """
                        UPDATE etl_pipeline_run SET
                          input_count = input_count + %s,
                          output_count = output_count + %s,
                          duplicate_count = duplicate_count + %s,
                          conflict_count = conflict_count + %s,
                          invalid_count = invalid_count + %s,
                          late_count = late_count + %s,
                          source_offsets = %s,
                          last_error = NULL
                        WHERE run_id = %s
                        """,
                        (
                            len(messages), len(inserted), len(duplicates), len(conflicts), len(invalid),
                            sum(1 for _message, event in inserted if bool(event.get("late_event", 0))),
                            Json({f"{topic}:{partition}": offset for (topic, partition), offset in checkpoint_by_source.items()}),
                            self.run_id,
                        ),
                    )
            return {
                "inserted": len(inserted),
                "duplicates": len(duplicates),
                "conflicts": len(conflicts),
                "invalid": len(invalid),
                "processed_at": now.isoformat(),
            }
        except Exception:
            if self.connection is not None:
                self.connection.rollback()
                self.connection.close()
            self.connection = None
            raise
