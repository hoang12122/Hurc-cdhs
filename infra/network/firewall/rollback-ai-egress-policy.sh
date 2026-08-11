#!/usr/bin/env bash
set -euo pipefail

CHAIN="HURC1_AI_EGRESS"
AI_CIDR="${AI_CIDR:-172.30.0.0/24}"
EVIDENCE_DIR="${EVIDENCE_DIR:-./audit_reports/network-policy}"
REASON="${1:-operator-requested rollback}"
OPERATOR="${OPERATOR:-${USER:-unknown}}"
TIMESTAMP="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

if [[ ${EUID} -ne 0 ]]; then
  echo "This script must run as root" >&2
  exit 1
fi

mkdir -p "$EVIDENCE_DIR"
iptables -D FORWARD -s "$AI_CIDR" -j "$CHAIN" 2>/dev/null || true
iptables -F "$CHAIN" 2>/dev/null || true
iptables -X "$CHAIN" 2>/dev/null || true

cat > "$EVIDENCE_DIR/rollback-${TIMESTAMP//[:]/-}.json" <<EOF
{
  "schemaVersion": "1.0.0",
  "policy": "HURC1_AI_EGRESS",
  "aiCidr": "$AI_CIDR",
  "operator": "$OPERATOR",
  "timestamp": "$TIMESTAMP",
  "reason": "$REASON",
  "publicAiAccessEnabled": false,
  "result": "policy-removed-for-controlled-rollback"
}
EOF

echo "Rolled back AI egress policy without enabling public AI access"
