import json
import os
import runpy
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer


phase = int(os.getenv("DATA_PLATFORM_PHASE", "0") or "0")

if phase < 2:
    runpy.run_path("/app/app.py", run_name="__main__")
else:
    payload = json.dumps({
        "status": "disabled",
        "reason": "canonical ETL pipeline owns telemetry ingestion for phase 2-4",
        "phase": phase,
    }).encode("utf-8")

    class Handler(BaseHTTPRequestHandler):
        def do_GET(self):
            if self.path not in ("/health", "/ready"):
                self.send_response(404)
                self.end_headers()
                return
            self.send_response(200)
            self.send_header("content-type", "application/json")
            self.send_header("content-length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)

        def log_message(self, *_args):
            return

    ThreadingHTTPServer(("0.0.0.0", 8080), Handler).serve_forever()
