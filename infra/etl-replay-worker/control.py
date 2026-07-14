from psycopg2.extras import Json
import psycopg2

from config import DATABASE_URL, LEASE_SECONDS, MAX_ATTEMPTS, WORKER_ID


class ReplayControl:
    def __init__(self):
        self.connection = None

    def connect(self):
        if self.connection is not None and not self.connection.closed:
            return
        self.connection = psycopg2.connect(DATABASE_URL)
        self.connection.autocommit = False

    def reset(self):
        if self.connection is not None and not self.connection.closed:
            self.connection.close()
        self.connection = None

    def _audit(self, cursor, request_id, action, replayed_count=0, detail=None):
        cursor.execute(
            """
            INSERT INTO etl_replay_audit(
              request_id, action, worker_id, replayed_count, detail
            ) VALUES (%s, %s, %s, %s, %s)
            """,
            (request_id, action, WORKER_ID, replayed_count, detail),
        )

    def _expire_invalid_or_exhausted(self):
        self.connect()
        with self.connection:
            with self.connection.cursor() as cursor:
                cursor.execute(
                    """
                    UPDATE etl_replay_request
                    SET status = 'FAILED', completed_at = NOW(),
                        last_error = 'Replay approval violates dual-control policy.'
                    WHERE status = 'APPROVED'
                      AND approved_by IS NOT NULL
                      AND approved_by = requested_by
                    RETURNING id, replayed_count
                    """
                )
                for request_id, count in cursor.fetchall():
                    self._audit(cursor, request_id, "FAILED", count, "requester and approver must be different")

                cursor.execute(
                    """
                    UPDATE etl_replay_request
                    SET status = 'FAILED', completed_at = NOW(),
                        last_error = 'Replay lease expired and maximum attempts were exhausted.'
                    WHERE status = 'RUNNING'
                      AND COALESCE(heartbeat_at, started_at, requested_at)
                          < NOW() - (%s * INTERVAL '1 second')
                      AND attempt_count >= %s
                    RETURNING id, replayed_count
                    """,
                    (LEASE_SECONDS, MAX_ATTEMPTS),
                )
                for request_id, count in cursor.fetchall():
                    self._audit(cursor, request_id, "LEASE_EXPIRED", count, "maximum attempts exhausted")

    def claim(self):
        self._expire_invalid_or_exhausted()
        with self.connection:
            with self.connection.cursor() as cursor:
                cursor.execute(
                    """
                    SELECT id, source_topic, target_topic, from_timestamp, to_timestamp,
                           checkpoint_offsets, source_end_offsets, replayed_count,
                           attempt_count, status
                    FROM etl_replay_request
                    WHERE (
                        status = 'APPROVED'
                        AND approved_by IS NOT NULL
                        AND approved_by <> requested_by
                    ) OR (
                        status = 'RUNNING'
                        AND approved_by IS NOT NULL
                        AND approved_by <> requested_by
                        AND COALESCE(heartbeat_at, started_at, requested_at)
                            < NOW() - (%s * INTERVAL '1 second')
                        AND attempt_count < %s
                    )
                    ORDER BY requested_at
                    FOR UPDATE SKIP LOCKED
                    LIMIT 1
                    """,
                    (LEASE_SECONDS, MAX_ATTEMPTS),
                )
                row = cursor.fetchone()
                if row is None:
                    return None
                recovered = row[9] == "RUNNING"
                cursor.execute(
                    """
                    UPDATE etl_replay_request
                    SET status = 'RUNNING', worker_id = %s, heartbeat_at = NOW(),
                        attempt_count = attempt_count + 1,
                        started_at = COALESCE(started_at, NOW()), last_error = NULL
                    WHERE id = %s
                    RETURNING attempt_count
                    """,
                    (WORKER_ID, row[0]),
                )
                attempt = cursor.fetchone()[0]
                self._audit(
                    cursor,
                    row[0],
                    "CLAIMED",
                    row[7],
                    "recovered stale lease" if recovered else "approved request",
                )
                return {
                    "id": str(row[0]),
                    "source": row[1],
                    "target": row[2],
                    "from": row[3],
                    "to": row[4],
                    "checkpoints": dict(row[5] or {}),
                    "endOffsets": dict(row[6] or {}),
                    "replayedCount": int(row[7] or 0),
                    "attempt": int(attempt),
                    "recovered": recovered,
                }

    def progress(self, request_id, replayed_count, checkpoints, end_offsets, audit_detail=None):
        self.connect()
        with self.connection:
            with self.connection.cursor() as cursor:
                cursor.execute(
                    """
                    UPDATE etl_replay_request
                    SET heartbeat_at = NOW(),
                        replayed_count = GREATEST(replayed_count, %s),
                        checkpoint_offsets = %s,
                        source_end_offsets = %s
                    WHERE id = %s AND status = 'RUNNING' AND worker_id = %s
                    """,
                    (replayed_count, Json(checkpoints), Json(end_offsets), request_id, WORKER_ID),
                )
                if cursor.rowcount != 1:
                    raise RuntimeError("replay lease was lost")
                if audit_detail:
                    self._audit(cursor, request_id, "HEARTBEAT", replayed_count, audit_detail)

    def finish(self, request_id, status, count, error=None):
        self.connect()
        with self.connection:
            with self.connection.cursor() as cursor:
                cursor.execute(
                    """
                    UPDATE etl_replay_request
                    SET status = %s, replayed_count = GREATEST(replayed_count, %s),
                        completed_at = NOW(), heartbeat_at = NOW(), last_error = %s
                    WHERE id = %s AND status = 'RUNNING' AND worker_id = %s
                    """,
                    (status, count, error, request_id, WORKER_ID),
                )
                if cursor.rowcount != 1:
                    raise RuntimeError("replay lease was lost before completion")
                self._audit(cursor, request_id, status, count, error)

    def release(self, request_id, count):
        self.connect()
        with self.connection:
            with self.connection.cursor() as cursor:
                cursor.execute(
                    """
                    UPDATE etl_replay_request
                    SET status = 'APPROVED', worker_id = NULL, heartbeat_at = NULL,
                        replayed_count = GREATEST(replayed_count, %s),
                        last_error = 'Worker stopped; request remains resumable.'
                    WHERE id = %s AND status = 'RUNNING' AND worker_id = %s
                    """,
                    (count, request_id, WORKER_ID),
                )
                if cursor.rowcount == 1:
                    self._audit(cursor, request_id, "HEARTBEAT", count, "lease released for graceful shutdown")
