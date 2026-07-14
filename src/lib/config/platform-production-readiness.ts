import { CONVERGED_PLATFORM_CONFIG } from './converged-platform-profile';

export type ReadinessSeverity = 'BLOCKER' | 'WARNING';

export interface ReadinessIssue {
  code: string;
  severity: ReadinessSeverity;
  area: 'IOT' | 'DATA' | 'MLOPS' | 'LEDGER' | 'OPERATIONS';
  message: string;
  remediation: string;
}

export interface PlatformProductionReadiness {
  ready: boolean;
  score: number;
  phase: number;
  deploymentMode: string;
  commitBinding: {
    applicationCommit: string | null;
    attestedCommit: string | null;
    matched: boolean;
  };
  issues: ReadinessIssue[];
  evaluatedAt: string;
}

type Environment = Readonly<Partial<NodeJS.ProcessEnv>>;

const truthy = (value: string | undefined) => value === 'true';
const numberValue = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};
const list = (value: string | undefined) => String(value ?? '').split(',').map(item => item.trim()).filter(Boolean);
const isLatest = (value: string | undefined) => Boolean(value && (value === 'latest' || value.endsWith(':latest')));

function add(
  issues: ReadinessIssue[],
  condition: boolean,
  issue: ReadinessIssue,
) {
  if (condition) issues.push(issue);
}

export function evaluatePlatformProductionReadiness(
  env: Environment = process.env,
): PlatformProductionReadiness {
  const phase = Number(env.DATA_PLATFORM_PHASE ?? CONVERGED_PLATFORM_CONFIG.phase);
  const deploymentMode = env.PLATFORM_DEPLOYMENT_MODE ?? env.NODE_ENV ?? 'development';
  const applicationCommit = env.APP_COMMIT_SHA ?? env.GITHUB_SHA ?? null;
  const attestedCommit = env.PLATFORM_ATTESTATION_COMMIT_SHA ?? null;
  const commitMatched = Boolean(
    applicationCommit
    && attestedCommit
    && applicationCommit === attestedCommit,
  );
  const issues: ReadinessIssue[] = [];

  if (phase >= 1) {
    add(issues, env.MQTT_ALLOW_ANONYMOUS !== 'false', {
      code: 'MQTT_ANONYMOUS', severity: 'BLOCKER', area: 'IOT',
      message: 'MQTT anonymous access chưa được tắt.',
      remediation: 'Đặt MQTT_ALLOW_ANONYMOUS=false và dùng danh tính riêng cho từng gateway/device.',
    });
    add(issues, !truthy(env.IOT_REQUIRE_TLS), {
      code: 'MQTT_TLS', severity: 'BLOCKER', area: 'IOT',
      message: 'Kênh IoT chưa bắt buộc TLS/mTLS.',
      remediation: 'Bật IOT_REQUIRE_TLS=true, cấp CA và certificate rotation/revocation.',
    });
    add(issues, !truthy(env.IOT_DEVICE_IDENTITY_ENFORCED), {
      code: 'DEVICE_IDENTITY', severity: 'BLOCKER', area: 'IOT',
      message: 'Chưa có bằng chứng cưỡng chế danh tính thiết bị.',
      remediation: 'Bật IOT_DEVICE_IDENTITY_ENFORCED=true sau khi ACL và device registry được nghiệm thu.',
    });
  }

  if (phase >= 2) {
    add(issues, list(env.KAFKA_BROKERS).length < 3, {
      code: 'KAFKA_QUORUM', severity: 'BLOCKER', area: 'DATA',
      message: 'Event backbone chưa có tối thiểu ba broker.',
      remediation: 'Khai báo ít nhất ba KAFKA_BROKERS trên các failure domain độc lập.',
    });
    add(issues, numberValue(env.REDPANDA_REPLICATION_FACTOR, 1) < 3, {
      code: 'KAFKA_REPLICATION', severity: 'BLOCKER', area: 'DATA',
      message: 'Replication factor của topic thấp hơn 3.',
      remediation: 'Đặt REDPANDA_REPLICATION_FACTOR=3 và xác minh min.insync.replicas.',
    });
    add(issues, numberValue(env.CLICKHOUSE_NODE_COUNT, 1) < 2, {
      code: 'CLICKHOUSE_HA', severity: 'BLOCKER', area: 'DATA',
      message: 'ClickHouse vẫn là single-node.',
      remediation: 'Triển khai replicated table và ít nhất hai node ClickHouse.',
    });
    add(issues, isLatest(env.REDPANDA_CONNECT_IMAGE) || isLatest(env.MINIO_MC_IMAGE), {
      code: 'UNPINNED_IMAGE', severity: 'BLOCKER', area: 'DATA',
      message: 'Còn image dùng tag latest.',
      remediation: 'Pin version hoặc digest cho mọi image runtime và utility.',
    });
    add(issues, !truthy(env.OUTBOX_MIGRATION_APPLIED), {
      code: 'OUTBOX_MIGRATION', severity: 'BLOCKER', area: 'DATA',
      message: 'Chưa xác nhận migration transactional outbox đã áp dụng.',
      remediation: 'Chạy migration OPS DB và đặt OUTBOX_MIGRATION_APPLIED=true sau kiểm thử rollback.',
    });
    add(issues, !truthy(env.ETL_SCHEMA_CONTRACT_VALIDATED), {
      code: 'ETL_SCHEMA_CONTRACT', severity: 'BLOCKER', area: 'DATA',
      message: 'Contract telemetry và quy trình schema evolution chưa được xác minh.',
      remediation: 'Chạy ETL contract tests, đối chiếu producer/consumer và phê duyệt schemaVersion 1.0.0.',
    });
    add(issues, !truthy(env.ETL_SCHEMA_REGISTRY_REQUIRED), {
      code: 'ETL_SCHEMA_REGISTRY', severity: 'BLOCKER', area: 'DATA',
      message: 'Runtime chưa fail-closed khi Schema Registry không khả dụng.',
      remediation: 'Đặt ETL_SCHEMA_REGISTRY_REQUIRED=true và xác minh BACKWARD_TRANSITIVE compatibility.',
    });
    add(issues, !truthy(env.ETL_CANONICAL_INGRESS_VERIFIED), {
      code: 'ETL_CANONICAL_INGRESS', severity: 'BLOCKER', area: 'DATA',
      message: 'Chưa xác nhận Phase 2–4 chỉ có một đường ingestion chuẩn.',
      remediation: 'Chứng minh legacy direct sink đã tắt và mọi telemetry đi qua Bronze → Normalizer → canonical sinks.',
    });
    add(issues, !truthy(env.ETL_EFFECTIVELY_ONCE_TESTED), {
      code: 'ETL_EFFECTIVELY_ONCE', severity: 'BLOCKER', area: 'DATA',
      message: 'Chưa kiểm thử tính effectively-once của ETL.',
      remediation: 'Kiểm thử crash/retry, same-checksum dedup, eventId collision quarantine và offset commit sau DB transaction.',
    });
    add(issues, !truthy(env.ETL_LATE_DATA_POLICY_APPROVED), {
      code: 'ETL_LATE_DATA', severity: 'BLOCKER', area: 'DATA',
      message: 'Chính sách watermark và late data chưa được phê duyệt.',
      remediation: 'Phê duyệt watermark, ngưỡng freshness, cách tái tính Gold và quy trình xử lý dữ liệu đến muộn.',
    });
    add(issues, !truthy(env.ETL_REPLAY_TESTED), {
      code: 'ETL_REPLAY', severity: 'BLOCKER', area: 'DATA',
      message: 'Chưa có bằng chứng replay Bronze sang Silver/Gold không mất hoặc nhân đôi dữ liệu.',
      remediation: 'Thực hiện replay có kiểm soát, đối chiếu checksum/count và ghi nhận RPO/RTO.',
    });
    add(issues, !truthy(env.ETL_DATA_QUALITY_SLO_APPROVED), {
      code: 'ETL_DATA_QUALITY_SLO', severity: 'BLOCKER', area: 'DATA',
      message: 'Chưa phê duyệt SLO chất lượng dữ liệu ETL.',
      remediation: 'Phê duyệt ngưỡng invalid, duplicate, freshness, completeness và consumer lag.',
    });
  }

  if (phase >= 3) {
    add(issues, !env.MLFLOW_BACKEND_STORE_URI || env.MLFLOW_BACKEND_STORE_URI.startsWith('sqlite'), {
      code: 'MLFLOW_SQLITE', severity: 'BLOCKER', area: 'MLOPS',
      message: 'MLflow backend vẫn dùng SQLite hoặc chưa khai báo.',
      remediation: 'Chuyển MLflow backend store sang PostgreSQL HA.',
    });
    add(issues, !env.MLFLOW_ARTIFACT_ROOT?.startsWith('s3://'), {
      code: 'MLFLOW_LOCAL_ARTIFACT', severity: 'BLOCKER', area: 'MLOPS',
      message: 'MLflow artifact chưa dùng object storage.',
      remediation: 'Dùng MinIO/S3, versioning và lifecycle policy cho model artifact.',
    });
    add(issues, !truthy(env.MODEL_APPROVAL_WORKFLOW_ENABLED), {
      code: 'MODEL_APPROVAL', severity: 'BLOCKER', area: 'MLOPS',
      message: 'Chưa bật workflow phê duyệt model.',
      remediation: 'Bật approval, signature, canary, drift monitor và rollback model.',
    });
  }

  if (phase >= 4) {
    add(issues, !env.BESU_NETWORK || env.BESU_NETWORK === 'dev', {
      code: 'BESU_DEV_NETWORK', severity: 'BLOCKER', area: 'LEDGER',
      message: 'Besu vẫn dùng dev network.',
      remediation: 'Dùng permissioned genesis, node identity, allowlist và endorsement policy.',
    });
    add(issues, env.LEDGER_SIGNER_MODE !== 'external', {
      code: 'LEDGER_EXTERNAL_SIGNER', severity: 'BLOCKER', area: 'LEDGER',
      message: 'Ledger chưa dùng external signer.',
      remediation: 'Đặt LEDGER_SIGNER_MODE=external và tách khóa ký khỏi ứng dụng.',
    });
    add(issues, !env.PLATFORM_KMS_PROVIDER || !env.LEDGER_EXTERNAL_SIGNER_URL, {
      code: 'KMS_HSM', severity: 'BLOCKER', area: 'LEDGER',
      message: 'Chưa cấu hình KMS/HSM hoặc signer endpoint.',
      remediation: 'Khai báo PLATFORM_KMS_PROVIDER và LEDGER_EXTERNAL_SIGNER_URL; không commit private key.',
    });
  }

  add(issues, !truthy(env.PLATFORM_CI_ACCEPTANCE_PASSED), {
    code: 'CI_ACCEPTANCE', severity: 'BLOCKER', area: 'OPERATIONS',
    message: 'Chưa có bằng chứng CI/CD acceptance gate xanh cho phiên bản đang triển khai.',
    remediation: 'Chạy workflow production readiness và gắn attestation với đúng commit SHA.',
  });
  add(issues, !commitMatched, {
    code: 'ATTESTATION_COMMIT', severity: 'BLOCKER', area: 'OPERATIONS',
    message: 'Attestation production chưa khớp với commit ứng dụng đang triển khai.',
    remediation: 'Đặt APP_COMMIT_SHA và PLATFORM_ATTESTATION_COMMIT_SHA bằng cùng SHA đã qua acceptance gate.',
  });
  add(issues, !truthy(env.PLATFORM_IMAGES_PINNED), {
    code: 'IMMUTABLE_IMAGES', severity: 'BLOCKER', area: 'OPERATIONS',
    message: 'Chưa xác nhận toàn bộ image đã pin version hoặc digest bất biến.',
    remediation: 'Pin mọi image và utility image; lưu SBOM, scan result và rollback reference.',
  });
  add(issues, !truthy(env.PLATFORM_BENCHMARK_APPROVED), {
    code: 'BENCHMARK', severity: 'BLOCKER', area: 'OPERATIONS',
    message: 'Chưa có benchmark tải được phê duyệt.',
    remediation: 'Đo throughput, p95/p99, message loss, duplicate, replay và recovery theo dữ liệu thật.',
  });
  add(issues, !truthy(env.PLATFORM_SECURITY_REVIEW_APPROVED), {
    code: 'SECURITY_REVIEW', severity: 'BLOCKER', area: 'OPERATIONS',
    message: 'Chưa có đánh giá bảo mật được phê duyệt cho phiên bản triển khai.',
    remediation: 'Hoàn thành threat model, dependency scan, CodeQL, cấu hình mạng và biên bản phê duyệt.',
  });
  add(issues, !truthy(env.PLATFORM_BACKUP_RESTORE_TESTED), {
    code: 'BACKUP_RESTORE', severity: 'BLOCKER', area: 'OPERATIONS',
    message: 'Chưa xác nhận backup/restore end-to-end.',
    remediation: 'Thực hiện restore TimescaleDB, Kafka metadata, MinIO, ClickHouse, MLflow và ledger metadata.',
  });
  add(issues, !truthy(env.PLATFORM_DR_TESTED), {
    code: 'DISASTER_RECOVERY', severity: 'BLOCKER', area: 'OPERATIONS',
    message: 'Chưa có bằng chứng diễn tập khôi phục thảm họa.',
    remediation: 'Thực hiện failover/failback, đo RPO/RTO và lưu biên bản nghiệm thu.',
  });

  const penalty = issues.reduce((sum, issue) => sum + (issue.severity === 'BLOCKER' ? 9 : 4), 0);
  const score = Math.max(0, 100 - penalty);
  return {
    ready: deploymentMode === 'production' && !issues.some(issue => issue.severity === 'BLOCKER'),
    score,
    phase,
    deploymentMode,
    commitBinding: { applicationCommit, attestedCommit, matched: commitMatched },
    issues,
    evaluatedAt: new Date().toISOString(),
  };
}
