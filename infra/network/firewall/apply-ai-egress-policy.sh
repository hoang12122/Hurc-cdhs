#!/usr/bin/env bash
set -euo pipefail

CHAIN="HURC1_AI_EGRESS"
AI_CIDR="${AI_CIDR:-172.30.0.0/24}"
APPROVED_CIDRS="${APPROVED_CIDRS:-172.16.0.0/12 10.0.0.0/8 192.168.0.0/16}"

require_root() {
  if [[ ${EUID} -ne 0 ]]; then
    echo "This script must run as root" >&2
    exit 1
  fi
}

require_root
iptables -N "$CHAIN" 2>/dev/null || true
iptables -F "$CHAIN"
iptables -A "$CHAIN" -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
for cidr in $APPROVED_CIDRS; do
  iptables -A "$CHAIN" -s "$AI_CIDR" -d "$cidr" -j ACCEPT
done
iptables -A "$CHAIN" -s "$AI_CIDR" -d 127.0.0.0/8 -j ACCEPT
iptables -A "$CHAIN" -s "$AI_CIDR" -j LOG --log-prefix "HURC1_AI_EGRESS_DROP " --log-level 6
iptables -A "$CHAIN" -s "$AI_CIDR" -j DROP
iptables -C FORWARD -s "$AI_CIDR" -j "$CHAIN" 2>/dev/null || iptables -I FORWARD 1 -s "$AI_CIDR" -j "$CHAIN"

echo "Applied deny-by-default AI egress policy for ${AI_CIDR}"
