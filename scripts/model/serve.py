#!/usr/bin/env python3
"""Serve a one-page web app. A phone on the same Wi-Fi sends a leaf photo and reads the answer.

  .venv/bin/python scripts/model/serve.py --run real_d140_f10_s0
Then open the address it prints on the phone (Safari: Share, then Add to Home Screen, for a full-screen app).
The model stays on this computer and the page loads nothing from the internet, so it works on a Wi-Fi network
with no internet, or on the phone's hotspot. Each photo goes to a temporary file for one request, then is deleted.
The answer rule is the one in predict.py: a score near the cut-off becomes "not sure".
"""
import argparse
import io
import json
import os
import socket
import subprocess
import tempfile
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

# Parallel weight loading can hang on this Mac (a lock inside safetensors), so load one tensor at a time.
os.environ.setdefault("HF_DEACTIVATE_ASYNC_LOAD", "1")

import torch
from PIL import Image

from predict import verdict
from rust_common import RUNS, load_model, pick_device, score_rows

PAGE = Path(__file__).with_name("serve_page.html")
MAX_BYTES = 12_000_000
LOCK = threading.Lock()  # one photo at a time on the model


def lan_address():
    """The address a phone on the same network can reach."""
    try:
        ip = subprocess.run(["ipconfig", "getifaddr", "en0"], capture_output=True, text=True, timeout=3).stdout.strip()
        if ip:
            return ip
    except (OSError, subprocess.SubprocessError):
        pass
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
            s.connect(("10.255.255.255", 1))  # no packet is sent
            return s.getsockname()[0]
    except OSError:
        return "127.0.0.1"


def make_handler(model, processor, device, dtype, calibration):
    class Handler(BaseHTTPRequestHandler):
        def log_message(self, fmt, *args):  # one short line per request, no photo data
            print(f"  {self.address_string()} {fmt % args}", flush=True)

        def reply(self, code, body, kind="application/json"):
            data = body if isinstance(body, bytes) else json.dumps(body).encode()
            self.send_response(code)
            self.send_header("Content-Type", kind)
            self.send_header("Content-Length", str(len(data)))
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            self.wfile.write(data)

        def do_GET(self):
            if self.path in ("/", "/index.html"):
                self.reply(200, PAGE.read_bytes(), "text/html; charset=utf-8")
            else:
                self.reply(404, {"error": "not found"})

        def do_POST(self):
            if self.path != "/score":
                return self.reply(404, {"error": "not found"})
            size = int(self.headers.get("Content-Length") or 0)
            if size <= 0 or size > MAX_BYTES:
                return self.reply(413, {"error": "photo missing or too large"})
            try:
                image = Image.open(io.BytesIO(self.rfile.read(size))).convert("RGB")
            except Exception:
                return self.reply(400, {"error": "not an image"})
            start = time.perf_counter()
            with LOCK, tempfile.NamedTemporaryFile(suffix=".jpg") as tmp:
                image.save(tmp, "JPEG", quality=95)
                score = score_rows(model, processor, [{"image": tmp.name}], device, dtype, batch_size=1, log_every=0)[0]
            result = {
                "score": score,
                "verdict": verdict(score, calibration["cutoff"], calibration["margin"]),
                "cutoff": calibration["cutoff"],
                "margin": calibration["margin"],
                "seconds": round(time.perf_counter() - start, 2),
            }
            print(f"  scored {result['score']:+.2f} -> {result['verdict']} in {result['seconds']}s", flush=True)
            self.reply(200, result)

    return Handler


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--run", default="real_d140_f10_s0")
    ap.add_argument("--port", type=int, default=8000)
    args = ap.parse_args()

    run = RUNS / args.run
    info = json.loads((run / "metrics.json").read_text())
    calibration = json.loads((run / "field_calibration.json").read_text())
    device, dtype = pick_device(), torch.bfloat16
    print(f"Loading {args.run} on {device}...", flush=True)
    processor, model = load_model(device, dtype)
    processor.image_processor.max_soft_tokens = info["detail"]
    from peft import PeftModel
    model = PeftModel.from_pretrained(model, str(run / "adapter"))

    warm = Image.new("RGB", (256, 256), (90, 140, 70))
    with tempfile.NamedTemporaryFile(suffix=".jpg") as tmp:  # first call is slow, so do it now
        warm.save(tmp, "JPEG")
        score_rows(model, processor, [{"image": tmp.name}], device, dtype, batch_size=1, log_every=0)

    server = ThreadingHTTPServer(("0.0.0.0", args.port), make_handler(model, processor, device, dtype, calibration))
    print(f"\nReady. On the phone, open:  http://{lan_address()}:{args.port}\n"
          f"(cut-off {calibration['cutoff']:+.2f}, not sure within {calibration['margin']:.2f} of it)\n", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")


if __name__ == "__main__":
    main()
