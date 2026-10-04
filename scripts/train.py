#!/usr/bin/env python3
"""LoRA fine-tune Gemma 4 E2B on BRACOL for rust yes or no, then score val and test.

Run from the repo root:
  .venv/bin/python scripts/train.py --detail 140 --epochs 3
  .venv/bin/python scripts/train.py --grid --fractions 10,25,50,100 --seeds 0,1,2
Each run writes runs/<name>/ with the adapter, train_log.csv, scores and metrics.json.
A run that already has metrics.json is skipped unless you pass --force.
"""
import argparse
import csv
import json
import math
import random
import time

import torch
from peft import LoraConfig, get_peft_model
from torch.utils.data import DataLoader, Dataset
from transformers import get_cosine_schedule_with_warmup

from rust_common import (LORA_TARGETS, RUNS, balanced, collate, empty_cache, encode, evaluate_run, load_model, pick_device,
                         read_manifest, to_device, train_rows)


class Photos(Dataset):
    def __init__(self, processor, rows):
        self.processor, self.rows = processor, rows

    def __len__(self):
        return len(self.rows)

    def __getitem__(self, i):
        return encode(self.processor, self.rows[i], True)


def training_rows(manifest, args, fraction, seed):
    rows = train_rows(manifest, fraction, seed) if fraction else []
    if args.synthetic_manifest:
        synthetic = [r for r in read_manifest(args.synthetic_manifest) if r.get("split", "train") == "train"]
        random.Random(seed).shuffle(synthetic)
        rows = rows + synthetic[: args.synthetic_photos or len(synthetic)]
    return balanced(rows, args.limit_train, seed) if args.limit_train else rows


def fit(model, processor, rows, args, seed, device, dtype, run_dir):
    """Train a fresh LoRA adapter on the rows. Saves the adapter after every epoch. Returns the model and the log."""
    torch.manual_seed(seed)
    if not args.no_checkpointing:
        model.gradient_checkpointing_enable(gradient_checkpointing_kwargs={"use_reentrant": False})
    model.config.use_cache = False
    peft_model = get_peft_model(model, LoraConfig(r=args.rank, lora_alpha=2 * args.rank, lora_dropout=0.05,
                                                   target_modules=LORA_TARGETS))
    peft_model.print_trainable_parameters()
    params = [p for p in peft_model.parameters() if p.requires_grad]
    workers = args.workers if args.workers is not None else (4 if device == "cuda" else 0)
    loader = DataLoader(Photos(processor, rows), batch_size=args.batch_size, shuffle=True,
                        generator=torch.Generator().manual_seed(seed), num_workers=workers, collate_fn=collate,
                        pin_memory=device == "cuda", persistent_workers=workers > 0)
    total = math.ceil(len(loader) / args.grad_accum) * args.epochs
    opt = torch.optim.AdamW(params, lr=args.lr, weight_decay=0.0)
    sched = get_cosine_schedule_with_warmup(opt, max(1, int(0.05 * total)), total)
    peft_model.train()
    log, losses, step, start = [], [], 0, time.perf_counter()
    for epoch in range(args.epochs):
        for i, batch in enumerate(loader):
            loss = peft_model(**to_device(batch, device, dtype)).loss
            (loss / args.grad_accum).backward()
            losses.append(loss.item())
            if (i + 1) % args.grad_accum == 0 or i == len(loader) - 1:
                torch.nn.utils.clip_grad_norm_(params, 1.0)
                opt.step()
                sched.step()
                opt.zero_grad(set_to_none=True)
                step += 1
                if step % 5 == 0 or step == total:
                    elapsed = time.perf_counter() - start
                    log.append({"step": step, "epoch": epoch + 1, "loss": sum(losses) / len(losses),
                                "lr": sched.get_last_lr()[0], "seconds": elapsed})
                    print(f"  epoch {epoch + 1}/{args.epochs} step {step}/{total} loss {log[-1]['loss']:.4f} "
                          f"elapsed {elapsed:.0f}s eta {elapsed / step * (total - step):.0f}s", flush=True)
                    losses = []
        peft_model.save_pretrained(run_dir / "adapter")
        print(f"  saved adapter after epoch {epoch + 1}", flush=True)
    return peft_model, log


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--name", help="run name. Ignored with --grid.")
    ap.add_argument("--detail", type=int, default=140, choices=(70, 140, 280, 560, 1120), help="image token budget")
    ap.add_argument("--epochs", type=int, default=3)
    ap.add_argument("--lr", type=float, default=1e-4)
    ap.add_argument("--rank", type=int, default=16, help="LoRA rank")
    ap.add_argument("--batch-size", type=int, help="photos per step. Default 4 on CUDA, 1 elsewhere.")
    ap.add_argument("--grad-accum", type=int, help="steps per update. Default makes 16 photos per update.")
    ap.add_argument("--fraction", type=int, default=100, choices=(0, 10, 25, 50, 100), help="percent of BRACOL train photos")
    ap.add_argument("--seed", type=int, default=0)
    ap.add_argument("--grid", action="store_true", help="run every fraction and seed below, reusing the loaded model")
    ap.add_argument("--fractions", default="10,25,50,100")
    ap.add_argument("--seeds", default="0,1,2")
    ap.add_argument("--synthetic-manifest", help="CSV with image, rust and split columns, for the synthetic runs")
    ap.add_argument("--synthetic-photos", type=int, default=0, help="use this many synthetic photos. 0 means all.")
    ap.add_argument("--no-checkpointing", action="store_true", help="keep activations instead of recomputing them")
    ap.add_argument("--workers", type=int)
    ap.add_argument("--limit-train", type=int, default=0, help="train on only this many photos, for a quick test")
    ap.add_argument("--limit-eval", type=int, default=0, help="score only this many photos per split, for a quick test")
    ap.add_argument("--force", action="store_true")
    args = ap.parse_args()

    device, dtype = pick_device(), torch.bfloat16
    args.batch_size = args.batch_size or (4 if device == "cuda" else 1)
    args.grad_accum = args.grad_accum or max(1, 16 // args.batch_size)
    fractions = [int(x) for x in args.fractions.split(",")] if args.grid else [args.fraction]
    seeds = [int(x) for x in args.seeds.split(",")] if args.grid else [args.seed]

    manifest = read_manifest()
    processor, model = load_model(device, dtype)
    processor.image_processor.max_soft_tokens = args.detail
    for fraction in fractions:
        for seed in seeds:
            rows = training_rows(manifest, args, fraction, seed)
            kind = ("mix" if fraction else "syn") if args.synthetic_manifest else "real"
            name = args.name if args.name and not args.grid else f"{kind}_d{args.detail}_f{fraction}_s{seed}"
            run_dir = RUNS / name
            if (run_dir / "metrics.json").exists() and not args.force:
                print(f"skip {name}: metrics.json exists", flush=True)
                continue
            print(f"=== {name}: {len(rows)} training photos, {args.epochs} epochs, device {device} ===", flush=True)
            run_dir.mkdir(parents=True, exist_ok=True)
            start = time.perf_counter()
            peft_model, log = fit(model, processor, rows, args, seed, device, dtype, run_dir)
            train_seconds = time.perf_counter() - start
            with open(run_dir / "train_log.csv", "w", newline="") as f:
                w = csv.DictWriter(f, fieldnames=["step", "epoch", "loss", "lr", "seconds"])
                w.writeheader()
                w.writerows(log)
            info = {"name": name, "detail": args.detail, "epochs": args.epochs, "lr": args.lr, "rank": args.rank,
                    "batch_size": args.batch_size, "grad_accum": args.grad_accum, "fraction": fraction, "seed": seed,
                    "train_photos": len(rows), "synthetic_manifest": args.synthetic_manifest,
                    "synthetic_photos": args.synthetic_photos, "device": device, "torch": torch.__version__,
                    "train_seconds": train_seconds}
            evaluate_run(peft_model, processor, run_dir, info, device, dtype, manifest, args.limit_eval,
                         8 if device == "cuda" else 1)
            (run_dir / "config.json").write_text(json.dumps(info, indent=1) + "\n")
            model = peft_model.unload()
            del peft_model
            empty_cache(device)


if __name__ == "__main__":
    main()
