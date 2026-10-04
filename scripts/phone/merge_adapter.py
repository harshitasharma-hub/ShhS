#!/usr/bin/env python3
"""Merge a LoRA adapter into the Gemma 4 E2B base weights, one tensor at a time.

  .venv/bin/python scripts/phone/merge_adapter.py runs/real_d140_f10_s0/adapter models/phone/real_d140_f10_s0/merged

The merged weight is W + (alpha / r) * (B @ A), computed in float32. Tensors the adapter does not touch are copied as
they are (bfloat16). The result is a sharded safetensors checkpoint that transformers can load, plus the config and
tokenizer files. Memory stays near one shard (about 3 GB), so this runs on a 24 GB Mac next to other apps.
The base model comes from models/gemma-4-E2B-it, or from the folder in the BASE_MODEL environment variable.
"""
import json
import os
import shutil
import sys
from pathlib import Path

from safetensors import safe_open
from safetensors.torch import save_file

ROOT = Path(__file__).resolve().parent.parent.parent
BASE = Path(os.environ.get("BASE_MODEL", ROOT / "models" / "gemma-4-E2B-it"))
SHARD_BYTES = 3 * 1024**3
COPY_FILES = ("config.json", "generation_config.json", "tokenizer.json", "tokenizer_config.json",
              "chat_template.jinja", "processor_config.json")


def main():
    adapter_dir, out_dir = Path(sys.argv[1]), Path(sys.argv[2])
    out_dir.mkdir(parents=True, exist_ok=True)

    cfg = json.loads((adapter_dir / "adapter_config.json").read_text())
    assert cfg["peft_type"] == "LORA" and not cfg["use_rslora"] and not cfg["use_dora"], "only plain LoRA is handled"
    scale = cfg["lora_alpha"] / cfg["r"]
    print(f"adapter {adapter_dir.parent.name}: r={cfg['r']} alpha={cfg['lora_alpha']} scale={scale}")

    adapter = safe_open(adapter_dir / "adapter_model.safetensors", "pt")
    pairs = {}
    for key in adapter.keys():
        assert key.startswith("base_model.model."), key
        name = key[len("base_model.model."):]
        if name.endswith(".lora_A.weight"):
            pairs.setdefault(name[: -len(".lora_A.weight")] + ".weight", {})["A"] = key
        elif name.endswith(".lora_B.weight"):
            pairs.setdefault(name[: -len(".lora_B.weight")] + ".weight", {})["B"] = key
        else:
            raise SystemExit(f"unexpected adapter tensor {key}")
    assert all(set(v) == {"A", "B"} for v in pairs.values())
    print(f"{len(pairs)} modules to merge")

    base = safe_open(BASE / "model.safetensors", "pt")
    base_keys = list(base.keys())
    missing = [k for k in pairs if k not in set(base_keys)]
    assert not missing, f"adapter modules not in the base checkpoint: {missing[:3]}"

    state = {"shard": {}, "size": 0, "count": 0, "total": 0, "map": {}}

    def flush():
        if not state["shard"]:
            return
        state["count"] += 1
        name = f"model-{state['count']:05d}.safetensors"
        save_file(state["shard"], out_dir / name, metadata={"format": "pt"})
        for key in state["shard"]:
            state["map"][key] = name
        state["total"] += state["size"]
        print(f"  wrote {name}: {len(state['shard'])} tensors, {state['size'] / 1e9:.2f} GB", flush=True)
        state["shard"], state["size"] = {}, 0

    merged, ratios = 0, []
    for key in base_keys:
        tensor = base.get_tensor(key)
        if key in pairs:
            a = adapter.get_tensor(pairs[key]["A"]).float()
            b = adapter.get_tensor(pairs[key]["B"]).float()
            delta = scale * (b @ a)
            assert delta.shape == tensor.shape, (key, delta.shape, tensor.shape)
            weight = tensor.float()
            ratios.append((delta.norm() / weight.norm()).item())
            tensor = (weight + delta).contiguous()  # keep float32 so the small update is not rounded away
            merged += 1
        nbytes = tensor.numel() * tensor.element_size()
        if state["shard"] and state["size"] + nbytes > SHARD_BYTES:
            flush()
        state["shard"][key] = tensor
        state["size"] += nbytes
    flush()
    assert merged == len(pairs), (merged, len(pairs))

    (out_dir / "model.safetensors.index.json").write_text(
        json.dumps({"metadata": {"total_size": state["total"]}, "weight_map": state["map"]}, indent=1))
    for name in COPY_FILES:
        shutil.copy2(BASE / name, out_dir / name)
    print(f"merged {merged} modules. The update is {sum(ratios) / len(ratios):.4f} of the weight norm on average "
          f"(largest {max(ratios):.4f}).")
    print(f"done: {out_dir}")


if __name__ == "__main__":
    main()
