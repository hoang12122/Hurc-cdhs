import json
import signal
import threading
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

from config import HEALTH_PORT, POLL_SECONDS, WORKER_ID
from control import ReplayControl
from replay import WorkerStopping, execute_replay

STOP_EVENT = threading.Event()
STATS_LOCK = threading.Lock()
STATS = {
    "status": "starting",
    "workerId": WORKER_ID,
    "activeRequestId": None,
    "activeAttempt": None,
    "completed": 0,
    "failed": 0,
    "leaseRecoveries": 0,
    "replayed": 0,
    "lastError": None,
    "lastCompletedAt": None,
}


def update_stats(**values):
    with STATS_LOCK:
        STATS.update(values)


def increment(key, value=1):
    with STATS_LOCK:
        STATS[key] += value


def snapshot():
    with STATS_LOCK:
        return dict(STATS)


def worker_loop():
    control = ReplayControl()
    while not STOP_EVENT.is_set():
        request_item = None
        try:
            request_item = control.claim()
            if request_item is None:
                update_stats(
                    status="healthy",
                    activeRequestId=None,
                    activeAttempt=None,
                    lastError=None,
                )
                STOP_EVENT.wait(POLL_SECONDS)
                continue

            if request_item.get("recovered"):
                increment("leaseRecoveries")
            update_stats(
                status="healthy",
                activeRequestId=request_item["id"],
                activeAttempt=request_item["attempt"],
                lastError=None,
            )
            count = execute_replay(
                request_item,
                control,
                STOP_EVENT,
                lambda amount: increment("replayed", amount),
            )
            control.finish(request_item["id"], "COMPLETED", count)
            increment("completed")
            update_stats(
                activeRequestId=None,
                activeAttempt=None,
                lastCompletedAt=datetime.now(timezone.utc).isoformat(),
            )
        except WorkerStopping:
            if request_item is not None:
                try:
                    control.release(request_item["id"], request_item["replayedCount"])
                except Exception:
                    pass
            break
        except Exception as error:
            if request_item is not None:
                try:
                    control.finish(
                        request_item["id"],
                        "FAILED",
                        request_item["replayedCount"],
                        str(error)[:2000],
                    )
                except Exception:
                    pass
            increment("failed")
            update_stats(
                status="degraded",
                activeRequestId=None,
                activeAttempt=None,
                lastError=str(error)[:2000],
            )
            control.reset()
            STOP_EVENT.wait(POLL_SECONDS)
    control.reset()


def metrics_text(state):
    values = {
        "completed": "hurc_etl_replay_completed_total",
        "failed": "hurc_etl_replay_failed_total",
        "leaseRecoveries": "hurc_etl_replay_lease_recoveries_total",
        "replayed": "hurc_etl_replay_records_total",
    }
    lines = [f"{metric} {int(state[key])}" for key, metric in values.items()]
    lines.append(f"hurc_etl_replay_active {1 if state['activeRequestId'] else 0}")
    return "\n".join(lines) + "\n"


class HealthHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        state = snapshot()
        if self.path == "/metrics":
            body = metrics_text(state).encode("utf-8")
            status = 200
            content_type = "text/plain; version=0.0.4"
        elif self.path in ("/health", "/ready"):
            body = json.dumps(state).encode("utf-8")
            status = 200 if self.path == "/health" or state["status"] == "healthy" else 503
            content_type = "application/json"
        else:
            self.send_response(404)
            self.end_headers()
            return
        self.send_response(status)
        self.send_header("content-type", content_type)
        self.send_header("content-length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, *_args):
        return


def stop(*_args):
    STOP_EVENT.set()


def main():
    signal.signal(signal.SIGTERM, stop)
    signal.signal(signal.SIGINT, stop)
    threading.Thread(target=worker_loop, daemon=True).start()
    server = ThreadingHTTPServer(("0.0.0.0", HEALTH_PORT), HealthHandler)
    server.timeout = 1
    while not STOP_EVENT.is_set():
        server.handle_request()
    server.server_close()


if __name__ == "__main__":
    main()
