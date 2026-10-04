#!/usr/bin/env python3
"""Make the spoken Swahili for Kagua Jani with Meta MMS-TTS, then shrink each clip to a small MP3.

  .venv/bin/python presentation/demo/tools/make_voice.py presentation/demo/public/voice
One short clip per message, with the main point first. A farmer pays for data, so each clip is about 20 KB.
The words come from src/strings.json, the same file the page is built from, so sound and text match. No native speaker has checked them yet.
Needs ffmpeg. The model facebook/mms-tts-swh is CC-BY-NC 4.0.
"""
import json
import os
import shutil
import subprocess
import sys
import tempfile
import wave
from pathlib import Path

os.environ.setdefault("HF_DEACTIVATE_ASYNC_LOAD", "1")
import numpy as np
import torch
from transformers import AutoTokenizer, VitsModel

SRC = Path(__file__).resolve().parent.parent / "src" / "strings.json"


def phrases():
    """Short clip: the answer alone (plays when the answer opens, under 3 seconds). Full clip: the answer and the next step (plays on tap)."""
    sw = json.loads(SRC.read_text(encoding="utf-8"))["sw"]
    out = {"intro": sw["introVoice"]}
    for key in ("rust", "no_rust", "not_sure"):
        out[key] = f"{sw['verdict'][key]}."
        out[f"{key}_full"] = f"{sw['verdict'][key]}. {sw['next'][key]}"
    return out


# Cut the silence at both ends, even out the loudness, then mono 16 kHz at 32 kbit/s (speech does not need more).
FFMPEG_FILTER = ("silenceremove=start_periods=1:start_threshold=-45dB,areverse,"
                 "silenceremove=start_periods=1:start_threshold=-45dB,areverse,loudnorm=I=-16:TP=-1.5:LRA=7")


def main():
    if not shutil.which("ffmpeg"):
        sys.exit("ffmpeg is needed to make the MP3 files")
    out = Path(sys.argv[1])
    out.mkdir(parents=True, exist_ok=True)
    torch.set_num_threads(3)
    tok = AutoTokenizer.from_pretrained("facebook/mms-tts-swh")
    model = VitsModel.from_pretrained("facebook/mms-tts-swh")
    model.speaking_rate = 0.92
    rate = model.config.sampling_rate
    with tempfile.TemporaryDirectory() as tmp:
        for name, text in phrases().items():
            torch.manual_seed(555)
            with torch.no_grad():
                wav = model(**tok(text, return_tensors="pt")).waveform[0].numpy()
            pcm = (np.clip(wav, -1, 1) * 32767).astype("<i2")
            raw = Path(tmp) / f"{name}.wav"
            with wave.open(str(raw), "wb") as w:
                w.setnchannels(1)
                w.setsampwidth(2)
                w.setframerate(rate)
                w.writeframes(pcm.tobytes())
            mp3 = out / f"{name}.mp3"
            subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(raw), "-af", FFMPEG_FILTER,
                            "-ac", "1", "-ar", "16000", "-codec:a", "libmp3lame", "-b:a", "32k", str(mp3)], check=True)
            print(f"{name}: {len(pcm) / rate:.1f} s raw, {mp3.stat().st_size / 1000:.0f} KB mp3", flush=True)


if __name__ == "__main__":
    main()
