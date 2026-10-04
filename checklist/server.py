#!/usr/bin/env python3
"""Tiny local checklist. Run `python3 checklist/server.py`, then open http://localhost:8765."""
import json
import os
import threading
import uuid
from datetime import date
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

HERE = os.path.dirname(os.path.abspath(__file__))
ITEMS = os.path.join(HERE, "items.json")
PORT = int(os.environ.get("PORT", "8765"))
HOSTS = {f"localhost:{PORT}", f"127.0.0.1:{PORT}"}
LOCK = threading.Lock()


def load():
    with open(ITEMS, encoding="utf-8") as f:
        return json.load(f)


def save(items):
    tmp = ITEMS + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(items, f, indent=2, ensure_ascii=False)
        f.write("\n")
    os.replace(tmp, ITEMS)


def check(items, body):
    done = body.get("done")
    for item in items:
        if item["id"] == body.get("id") and isinstance(done, bool):
            if done and not item["done"]:
                item["doneAt"] = date.today().isoformat()
            if not done:
                item.pop("doneAt", None)
            item["done"] = done
            return True
    return False


def add(items, body):
    text = str(body.get("text", "")).strip()[:120]
    if not text:
        return False
    items.append({"id": uuid.uuid4().hex[:8], "text": text, "done": False})
    return True


ACTIONS = {"/api/check": check, "/api/add": add}


class Handler(BaseHTTPRequestHandler):
    def reply(self, status, body, ctype="application/json"):
        data = body if isinstance(body, bytes) else json.dumps(body).encode()
        self.send_response(status)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(data)

    def read_items(self):
        try:
            return load()
        except (OSError, ValueError):
            self.reply(500, {"error": "items.json is missing or is not valid JSON. Fix the file, then reload."})

    def do_GET(self):
        if self.headers.get("Host") not in HOSTS:
            return self.reply(403, {"error": "Unexpected host."})
        if self.path == "/":
            with open(os.path.join(HERE, "index.html"), "rb") as f:
                return self.reply(200, f.read(), "text/html; charset=utf-8")
        if self.path == "/api/items":
            with LOCK:
                items = self.read_items()
            if items is not None:
                self.reply(200, items)
            return
        self.reply(404, {"error": "Not found."})

    def do_POST(self):
        action = ACTIONS.get(self.path)
        if self.headers.get("Host") not in HOSTS or action is None:
            return self.reply(404, {"error": "Not found."})
        if self.headers.get("Content-Type", "").split(";")[0].strip() != "application/json":
            return self.reply(415, {"error": "Send application/json."})
        try:
            size = int(self.headers.get("Content-Length", 0))
            body = json.loads(self.rfile.read(min(size, 10_000)))
            if not isinstance(body, dict):
                raise ValueError
        except ValueError:
            return self.reply(400, {"error": "Invalid JSON."})
        with LOCK:
            items = self.read_items()
            if items is None:
                return
            if not action(items, body):
                return self.reply(400, {"error": "Nothing to change."})
            save(items)
        self.reply(200, items)

    def log_message(self, *args):
        pass


if __name__ == "__main__":
    server = ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
    print(f"Checklist at http://localhost:{PORT}", flush=True)
    server.serve_forever()
