CREATE TABLE IF NOT EXISTS ops_incident_memories (
  id TEXT PRIMARY KEY,
  source_type TEXT NOT NULL,
  source_id TEXT NOT NULL,
  reference_label TEXT,
  title TEXT NOT NULL,
  subsystem TEXT,
  station TEXT,
  symptom_summary TEXT NOT NULL,
  root_cause TEXT,
  corrective_action TEXT,
  preventive_action TEXT,
  lesson_learned TEXT,
  evidence_tags TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  confidence INTEGER NOT NULL DEFAULT 50,
  verification_state TEXT NOT NULL DEFAULT 'draft',
  verified_by TEXT,
  verified_at TIMESTAMP(3),
  source_updated_at TIMESTAMP(3),
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT ops_incident_memories_source_type_source_id_key UNIQUE (source_type, source_id)
);

CREATE INDEX IF NOT EXISTS ops_incident_memories_source_type_idx ON ops_incident_memories(source_type);
CREATE INDEX IF NOT EXISTS ops_incident_memories_subsystem_idx ON ops_incident_memories(subsystem);
CREATE INDEX IF NOT EXISTS ops_incident_memories_station_idx ON ops_incident_memories(station);
CREATE INDEX IF NOT EXISTS ops_incident_memories_verification_state_idx ON ops_incident_memories(verification_state);
CREATE INDEX IF NOT EXISTS ops_incident_memories_confidence_idx ON ops_incident_memories(confidence);
CREATE INDEX IF NOT EXISTS ops_incident_memories_updated_at_idx ON ops_incident_memories(updated_at);
