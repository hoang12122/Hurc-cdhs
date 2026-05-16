#!/bin/bash
# HURC1 DATA BACKUP (JSON DB & LOGS)
BACKUP_FILE="./backups/data_$(date +%Y%m%d_%H%M%S).tar.gz"
mkdir -p ./backups
tar -czf "$BACKUP_FILE" data/offline logs/
echo "✅ Data and Logs archived to $BACKUP_FILE"
