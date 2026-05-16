#!/bin/bash
# HURC1 PREFLIGHT DEPLOYMENT CHECK
# Verifies environment readiness before starting containers.

echo "🔍 Starting Hurc1CRM Preflight Checks..."

# 1. Check Docker & Compose
if ! command -v docker &> /dev/null; then
    echo "❌ Error: docker is not installed."
    exit 1
fi

if ! docker compose version &> /dev/null; then
    echo "❌ Error: docker compose is not available."
    exit 1
fi

# 2. Check .env existence
if [ ! -f .env ]; then
    echo "❌ Error: .env file missing. Please copy .env.example and fill in real values."
    exit 1
fi

# 3. Check for placeholder values
# Add keys that must not be placeholders in production
CRITICAL_KEYS=("DATABASE_URL" "AUTH_DATABASE_URL" "SESSION_SECRET" "ENCRYPTION_KEY")
for key in "${CRITICAL_KEYS[@]}"; do
    value=$(grep "^$key=" .env | cut -d '=' -f2)
    if [[ "$value" == *"placeholder"* ]] || [ -z "$value" ]; then
        echo "⚠️ Warning: $key contains a placeholder or is empty in .env"
    fi
done

# 4. Check Port Availability
PORTS=(80 443 3001)
for port in "${PORTS[@]}"; do
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        echo "❌ Error: Port $port is already in use."
        exit 1
    fi
done

# 5. Resource Check (Minimum 8GB recommended for AI stack)
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    TOTAL_MEM=$(free -m | awk '/^Mem:/{print $2}')
    if [ "$TOTAL_MEM" -lt 7500 ]; then
        echo "⚠️ Warning: Total RAM ($TOTAL_MEM MB) is less than the recommended 8GB for AI services."
    fi
fi

echo "✅ Preflight checks completed successfully!"
