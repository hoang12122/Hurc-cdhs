CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS ops_outbox_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aggregate_type TEXT NOT NULL,
  aggregate_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  schema_version TEXT NOT NULL DEFAULT '1.0.0',
  payload JSONB NOT NULL,
  headers JSONB NOT NULL DEFAULT '{}'::jsonb,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  available_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  attempt_count INTEGER NOT NULL DEFAULT 0,
  last_error TEXT,
  locked_at TIMESTAMPTZ,
  locked_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ops_outbox_publish_idx
  ON ops_outbox_events (published_at, available_at, created_at);
CREATE INDEX IF NOT EXISTS ops_outbox_aggregate_idx
  ON ops_outbox_events (aggregate_type, aggregate_id, created_at DESC);
CREATE INDEX IF NOT EXISTS ops_outbox_lock_idx
  ON ops_outbox_events (locked_at)
  WHERE published_at IS NULL;

CREATE OR REPLACE FUNCTION ops_enqueue_dnf_outbox()
RETURNS TRIGGER AS $$
DECLARE
  row_data JSONB;
  aggregate_id_value TEXT;
  event_suffix TEXT;
  event_time TIMESTAMPTZ;
BEGIN
  IF TG_OP = 'DELETE' THEN
    row_data := to_jsonb(OLD);
    aggregate_id_value := OLD.id;
    event_suffix := 'deleted';
  ELSIF TG_OP = 'INSERT' THEN
    row_data := to_jsonb(NEW);
    aggregate_id_value := NEW.id;
    event_suffix := 'created';
  ELSE
    row_data := to_jsonb(NEW);
    aggregate_id_value := NEW.id;
    event_suffix := 'updated';
  END IF;

  event_time := COALESCE(NULLIF(row_data ->> 'updated_at', '')::timestamptz, NOW());

  INSERT INTO ops_outbox_events (
    aggregate_type,
    aggregate_id,
    event_type,
    payload,
    headers,
    occurred_at
  ) VALUES (
    'DNF',
    aggregate_id_value,
    'dnf.' || event_suffix,
    jsonb_build_object(
      'id', aggregate_id_value,
      'status', row_data ->> 'status',
      'priority', row_data ->> 'priority',
      'locationOfFailure', row_data ->> 'location_of_failure',
      'equipmentId', row_data ->> 'failed_component_equipment_lru_train_number',
      'subsystemIds', COALESCE(row_data -> 'subsystem_ids', '[]'::jsonb),
      'hazardLevelId', row_data ->> 'hazard_level_id',
      'isArchived', COALESCE(NULLIF(row_data ->> 'is_archived', '')::boolean, false),
      'updatedAt', row_data ->> 'updated_at'
    ),
    jsonb_build_object('source', 'ops-db-trigger', 'operation', TG_OP),
    event_time
  );

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION ops_enqueue_hazard_outbox()
RETURNS TRIGGER AS $$
DECLARE
  row_data JSONB;
  aggregate_id_value TEXT;
  event_suffix TEXT;
  event_time TIMESTAMPTZ;
BEGIN
  IF TG_OP = 'DELETE' THEN
    row_data := to_jsonb(OLD);
    aggregate_id_value := OLD.id;
    event_suffix := 'deleted';
  ELSIF TG_OP = 'INSERT' THEN
    row_data := to_jsonb(NEW);
    aggregate_id_value := NEW.id;
    event_suffix := 'created';
  ELSE
    row_data := to_jsonb(NEW);
    aggregate_id_value := NEW.id;
    event_suffix := 'updated';
  END IF;

  event_time := COALESCE(NULLIF(row_data ->> 'updated_at', '')::timestamptz, NOW());

  INSERT INTO ops_outbox_events (
    aggregate_type,
    aggregate_id,
    event_type,
    payload,
    headers,
    occurred_at
  ) VALUES (
    'HAZARD',
    aggregate_id_value,
    'hazard.' || event_suffix,
    jsonb_build_object(
      'id', aggregate_id_value,
      'status', row_data ->> 'status',
      'systemGroup', row_data ->> 'system_group',
      'locationIds', COALESCE(row_data -> 'location_ids', '[]'::jsonb),
      'severityId', row_data ->> 'severity_id',
      'likelihoodId', row_data ->> 'likelihood_id',
      'riskLevelId', row_data ->> 'risk_level_id',
      'linkedDnfId', row_data ->> 'linked_dnf_id',
      'isArchived', COALESCE(NULLIF(row_data ->> 'is_archived', '')::boolean, false),
      'updatedAt', row_data ->> 'updated_at'
    ),
    jsonb_build_object('source', 'ops-db-trigger', 'operation', TG_OP),
    event_time
  );

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS ops_dnf_outbox_trigger ON ops_dnf_documents;
CREATE TRIGGER ops_dnf_outbox_trigger
AFTER INSERT OR UPDATE OR DELETE ON ops_dnf_documents
FOR EACH ROW EXECUTE FUNCTION ops_enqueue_dnf_outbox();

DROP TRIGGER IF EXISTS ops_hazard_outbox_trigger ON ops_hazard_records;
CREATE TRIGGER ops_hazard_outbox_trigger
AFTER INSERT OR UPDATE OR DELETE ON ops_hazard_records
FOR EACH ROW EXECUTE FUNCTION ops_enqueue_hazard_outbox();
