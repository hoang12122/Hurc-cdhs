#!/bin/bash
# HURC1 BRUTAL BACKUP (10-Decade Data Safety)

BACKUP_DIR="./backups/$(date +%Y-%m-%d_%H-%M-%S)"
mkdir -p "$BACKUP_DIR"

echo "🛡️ Starting Hurc1CRM Backup..."

# 1. Backup JSON DB
if [ -f "data/offline/db.json" ]; then
    cp "data/offline/db.json" "$BACKUP_DIR/db.json"
    cp "data/offline/db.json.sha256" "$BACKUP_DIR/db.json.sha256"
    echo "✅ JSON DB backed up."
fi

# 2. Backup Postgres (via Docker)
if docker ps | grep -q hurc_postgres; then
    docker exec hurc_postgres pg_dumpall -U postgres > "$BACKUP_DIR/full_dump.sql"
    echo "✅ PostgreSQL dumped."
fi

# 3. Backup Logs
if [ -d "logs" ]; then
    tar -czf "$BACKUP_DIR/logs_bundle.tar.gz" logs/
    echo "✅ Logs archived."
fi

# 4. Generate Checksum for Backup Bundle
cd "$BACKUP_DIR" && sha256sum * > manifest.sha256

echo "🚀 Backup completed at: $BACKUP_DIR"
