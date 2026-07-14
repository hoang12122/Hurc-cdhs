CREATE OR REPLACE FUNCTION enqueue_accepted_telemetry_event()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO etl_accepted_event_outbox(event_id, event_checksum, payload)
  VALUES (
    NEW.event_id,
    NEW.event_checksum,
    jsonb_build_object(
      'event_id', NEW.event_id,
      'event_type', NEW.event_type,
      'schema_version', NEW.schema_version,
      'occurred_at', NEW.occurred_at,
      'ingested_at', NEW.ingested_at,
      'processed_at', NEW.processed_at,
      'environment', NEW.environment,
      'line_code', NEW.line_code,
      'station_code', NEW.station_code,
      'subsystem', NEW.subsystem,
      'asset_id', NEW.asset_id,
      'gateway_id', COALESCE(NEW.gateway_id, ''),
      'quality_status', NEW.quality_status,
      'quality_score', NEW.quality_score,
      'quality_flags', NEW.quality_flags,
      'clock_skew_ms', NEW.clock_skew_ms,
      'duplicate', CASE WHEN NEW.duplicate THEN 1 ELSE 0 END,
      'trace_id', COALESCE(NEW.trace_id, ''),
      'payload_json', NEW.payload::text,
      'raw_event', NEW.raw_event::text,
      'event_checksum', NEW.event_checksum,
      'payload_bytes', NEW.payload_bytes,
      'processing_latency_ms', NEW.processing_latency_ms,
      'event_age_ms', NEW.event_age_ms,
      'late_event', CASE WHEN NEW.late_event THEN 1 ELSE 0 END,
      'lateness_ms', NEW.lateness_ms,
      'source_topic', COALESCE(NEW.source_topic, ''),
      'source_partition', COALESCE(NEW.source_partition, -1),
      'source_offset', COALESCE(NEW.source_offset, -1),
      'ingest_version', NEW.ingest_version
    )
  )
  ON CONFLICT (event_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS telemetry_event_accepted_outbox_trigger ON telemetry_event;
CREATE TRIGGER telemetry_event_accepted_outbox_trigger
AFTER INSERT ON telemetry_event
FOR EACH ROW
EXECUTE FUNCTION enqueue_accepted_telemetry_event();
