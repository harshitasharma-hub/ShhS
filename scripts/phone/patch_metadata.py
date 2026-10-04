#!/usr/bin/env python3
"""Change two things in an unpacked LiteRT-LM file: the chat template and the sampler.

  python scripts/phone/patch_metadata.py <unpacked folder> scripts/phone/gemma4_classifier.jinja

Why: the phone runtime cannot read the chat template that ships with Gemma 4. It renders an empty prompt and the
model never runs. The template in gemma4_classifier.jinja is small enough for the runtime. Whenever a message has a
photo, it writes exactly the prompt we trained with, and ignores the text the user typed. And the file asks for
greedy sampling, so a photo gets the same answer every time.
Run it with the Python of the phone environment, because it needs the litert-lm-builder package.
"""
import sys
from pathlib import Path

from google.protobuf import text_format
from litert_lm_builder.runtime.proto import llm_metadata_pb2 as llm
from litert_lm_builder.runtime.proto import sampler_params_pb2 as sampler


def main():
    folder, template = Path(sys.argv[1]), Path(sys.argv[2])
    path = folder / "LlmMetadataProto.pbtext"
    original = folder / "LlmMetadataProto.orig.pbtext"
    if not original.exists():  # keep the first version, so running this twice gives the same result
        original.write_text(path.read_text())
    meta = llm.LlmMetadata()
    text_format.Parse(original.read_text(), meta)
    before = len(meta.jinja_prompt_template)
    meta.jinja_prompt_template = template.read_text()
    meta.sampler_params.type = sampler.SamplerParameters.Type.GREEDY
    meta.sampler_params.k = 1
    meta.sampler_params.p = 1.0
    meta.sampler_params.temperature = 1.0
    path.write_text(text_format.MessageToString(meta))
    print(f"chat template: {before} characters -> {len(meta.jinja_prompt_template)}; sampler: greedy")


if __name__ == "__main__":
    main()
