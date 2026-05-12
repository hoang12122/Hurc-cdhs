#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE hurc_auth;
    CREATE DATABASE hurc_ops;
    CREATE DATABASE hurc_ai;
    CREATE DATABASE hurc_metro;
EOSQL
