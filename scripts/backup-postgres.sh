#!/bin/bash
# HURC1 POSTGRES BACKUP
BACKUP_FILE="./backups/postgres_$(date +%Y%m%d_%H%M%S).sql"
mkdir -p ./backups
if docker ps | grep -q hurc_postgres; then
    docker exec hurc_postgres pg_dumpall -U postgres > "$BACKUP_FILE"
    echo "✅ Postgres dumped to $BACKUP_FILE"
else
    echo "❌ Postgres container not running."
fi
