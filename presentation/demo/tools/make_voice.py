"""Make the spoken answers with Meta MMS-TTS (Swahili). One short clip per answer."""
import os, sys, wave
os.environ.setdefault("HF_DEACTIVATE_ASYNC_LOAD", "1")
import numpy as np, torch
from transformers import VitsModel, AutoTokenizer

OUT = sys.argv[1]
PHRASES = {
    "rust":     "Lina kutu. Thibitisha na afisa ugani au ushirika wako kabla ya kuchukua hatua.",
    "no_rust":  "Halina kutu. Jani moja si shamba zima. Kagua majani mengine pia.",
    "not_sure": "Sina uhakika. Onyesha jani hili kwa afisa ugani au ushirika wako.",
}
torch.set_num_threads(3)
tok = AutoTokenizer.from_pretrained("facebook/mms-tts-swh")
model = VitsModel.from_pretrained("facebook/mms-tts-swh")
model.speaking_rate = 0.92
rate = model.config.sampling_rate
for name, text in PHRASES.items():
    torch.manual_seed(555)
    with torch.no_grad():
        wav = model(**tok(text, return_tensors="pt")).waveform[0].numpy()
    pcm = (np.clip(wav, -1, 1) * 32767).astype("<i2")
    with wave.open(os.path.join(OUT, name + ".wav"), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(rate); w.writeframes(pcm.tobytes())
    print(f"{name}: {len(pcm) / rate:.1f} s, peak {float(np.abs(wav).max()):.2f}", flush=True)
print("done", flush=True)
