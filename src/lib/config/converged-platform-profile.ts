export type DataPlatformPhase = 0 | 1 | 2 | 3 | 4;

type PlatformEnvironment = Readonly<Partial<NodeJS.ProcessEnv>>;

export interface ConvergedPlatformConfig {
  version: string;
  phase: DataPlatformPhase;
  environment: string;
  features: {
    iot: boolean;
    eventBackbone: boolean;
    lakehouse: boolean;
    mlops: boolean;
    evidenceLedger: boolean;
  };
  endpoints: {
    mqttUrl: string;
    timescaleUrl: string;
    kafkaBrokers: string[];
    schemaRegistryUrl: string;
    minioUrl: string;
    clickhouseUrl: string;
    etlNormalizerUrl: string;
    etlTimescaleSinkUrl: string;
    etlReplayWorkerUrl: string;
    mlflowUrl: string;
    besuRpcUrl: string;
    ledgerGatewayUrl: string;
  };
  limits: {
    mqttPayloadBytes: number;
    eventPayloadBytes: number;
    ingestionPerSecond: number;
    deadLetterRetentionDays: number;
    rawRetentionDays: number;
    etlFutureSkewSeconds: number;
    etlClockSkewMs: number;
    etlWatermarkDelaySeconds: number;
    etlMaxConsumerLag: number;
  };
  security: {
    requireTls: boolean;
    requireDeviceIdentity: boolean;
    ledgerWriteEnabled: boolean;
    ledgerSignerMode: 'disabled' | 'external' | 'local-dev';
  };
}

function integer(
  env: PlatformEnvironment,
  key: string,
  fallback: number,
  min: number,
  max: number,
): number {
  const parsed = Number(env[key]);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, Math.round(parsed)));
}

function booleanValue(value: string | undefined, fallback: boolean): boolean {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return fallback;
}

function phaseValue(value: string | undefined): DataPlatformPhase {
  const parsed = Number(value ?? 0);
  if (!Number.isFinite(parsed)) return 0;
  return Math.min(4, Math.max(0, Math.round(parsed))) as DataPlatformPhase;
}

function stringList(value: string | undefined, fallback: string[]): string[] {
  const entries = String(value ?? '')
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);
  return entries.length > 0 ? entries : fallback;
}

export function resolveConvergedPlatformConfig(
  env: PlatformEnvironment = process.env,
  nodeEnv: string | undefined = process.env.NODE_ENV,
): ConvergedPlatformConfig {
  const phase = phaseValue(env.DATA_PLATFORM_PHASE);
  const production = nodeEnv === 'production';
  const signerMode = (env.LEDGER_SIGNER_MODE ?? 'disabled') as ConvergedPlatformConfig['security']['ledgerSignerMode'];

  if (!['disabled', 'external', 'local-dev'].includes(signerMode)) {
    throw new Error('LEDGER_SIGNER_MODE must be disabled, external or local-dev.');
  }
  if (production && signerMode === 'local-dev') {
    throw new Error('local-dev ledger signer is blocked in production.');
  }
  if (production && phase >= 4 && booleanValue(env.LEDGER_WRITE_ENABLED, false) && signerMode !== 'external') {
    throw new Error('Production ledger writes require LEDGER_SIGNER_MODE=external.');
  }

  const iot = phase >= 1 && booleanValue(env.IOT_RUNTIME_ENABLED, true);
  const eventBackbone = iot && phase >= 2 && booleanValue(env.EVENT_BACKBONE_ENABLED, true);
  const lakehouse = eventBackbone && booleanValue(env.LAKEHOUSE_RUNTIME_ENABLED, true);
  const mlops = lakehouse && phase >= 3 && booleanValue(env.MLOPS_RUNTIME_ENABLED, true);
  const evidenceLedger = phase >= 4 && booleanValue(env.EVIDENCE_LEDGER_ENABLED, true);

  return {
    version: '2026-07-14.1',
    phase,
    environment: nodeEnv ?? 'development',
    features: { iot, eventBackbone, lakehouse, mlops, evidenceLedger },
    endpoints: {
      mqttUrl: env.MQTT_URL ?? 'mqtt://mqtt:1883',
      timescaleUrl: env.TIMESCALE_DATABASE_URL ?? 'postgresql://postgres:change-me@timescaledb:5432/hurc_telemetry',
      kafkaBrokers: stringList(env.KAFKA_BROKERS, ['redpanda:9092']),
      schemaRegistryUrl: env.SCHEMA_REGISTRY_URL ?? 'http://redpanda:8081',
      minioUrl: env.MINIO_ENDPOINT ?? 'http://minio:9000',
      clickhouseUrl: env.CLICKHOUSE_URL ?? 'http://clickhouse:8123',
      etlNormalizerUrl: env.ETL_NORMALIZER_URL ?? 'http://etl-normalizer:8082',
      etlTimescaleSinkUrl: env.ETL_TIMESCALE_SINK_URL ?? 'http://timescale-sink:8083',
      etlReplayWorkerUrl: env.ETL_REPLAY_WORKER_URL ?? 'http://etl-replay-worker:8084',
      mlflowUrl: env.MLFLOW_TRACKING_URI ?? 'http://mlflow:5000',
      besuRpcUrl: env.BESU_RPC_URL ?? 'http://besu:8545',
      ledgerGatewayUrl: env.LEDGER_GATEWAY_URL ?? 'http://evidence-ledger:8787',
    },
    limits: {
      mqttPayloadBytes: integer(env, 'MQTT_MAX_PAYLOAD_BYTES', 256 * 1024, 16 * 1024, 1024 * 1024),
      eventPayloadBytes: integer(env, 'EVENT_MAX_PAYLOAD_BYTES', 512 * 1024, 16 * 1024, 2 * 1024 * 1024),
      ingestionPerSecond: integer(env, 'INGESTION_RATE_PER_SECOND', phase >= 2 ? 5_000 : 100, 1, 50_000),
      deadLetterRetentionDays: integer(env, 'DEAD_LETTER_RETENTION_DAYS', 30, 1, 365),
      rawRetentionDays: integer(env, 'RAW_RETENTION_DAYS', phase >= 2 ? 365 : 90, 7, 3_650),
      etlFutureSkewSeconds: integer(env, 'ETL_MAX_FUTURE_SECONDS', 300, 0, 3_600),
      etlClockSkewMs: integer(env, 'ETL_MAX_CLOCK_SKEW_MS', 120_000, 1_000, 3_600_000),
      etlWatermarkDelaySeconds: integer(env, 'ETL_WATERMARK_DELAY_SECONDS', 300, 0, 86_400),
      etlMaxConsumerLag: integer(env, 'ETL_MAX_CONSUMER_LAG', 10_000, 0, 10_000_000),
    },
    security: {
      requireTls: production || booleanValue(env.IOT_REQUIRE_TLS, false),
      requireDeviceIdentity: true,
      ledgerWriteEnabled: evidenceLedger && booleanValue(env.LEDGER_WRITE_ENABLED, false),
      ledgerSignerMode: signerMode,
    },
  };
}

export const CONVERGED_PLATFORM_CONFIG = Object.freeze(resolveConvergedPlatformConfig());

export function getConvergedPlatformSnapshot(): ConvergedPlatformConfig {
  return JSON.parse(JSON.stringify(CONVERGED_PLATFORM_CONFIG)) as ConvergedPlatformConfig;
}
