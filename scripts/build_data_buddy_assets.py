"""Build transparent animated WebP assets for the personal-site data buddy.

Usage:
    python scripts/build_data_buddy_assets.py "D:/AI-KnowledgeBase/下载/motion-bot"

The source package keeps transparent PNG frames. Action frames are sampled at
half rate and played at 24 fps so page interactions stay short and responsive.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

from PIL import Image


OUTPUT_SIZE = (256, 411)
FRAME_DURATION_MS = 42
ACTION_CROP = (26, 0, 742, 1148)


def load_frames(folder: Path, step: int = 1, crop: tuple[int, int, int, int] | None = None) -> list[Image.Image]:
    paths = sorted(folder.glob("frame_*.png"))[::step]
    if not paths:
        raise FileNotFoundError(f"No frames found in {folder}")

    frames: list[Image.Image] = []
    for path in paths:
        with Image.open(path) as source:
            frame = source.convert("RGBA")
            if crop:
                frame = frame.crop(crop)
            frames.append(frame.resize(OUTPUT_SIZE, Image.Resampling.LANCZOS))
    return frames


def save_animation(frames: list[Image.Image], destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    frames[0].save(
        destination,
        format="WEBP",
        save_all=True,
        append_images=frames[1:],
        duration=FRAME_DURATION_MS,
        loop=0,
        quality=76,
        method=4,
    )


def main() -> None:
    if len(sys.argv) != 2:
        raise SystemExit("Pass the motion-bot source folder as the only argument.")

    source_root = Path(sys.argv[1]).resolve()
    project_root = Path(__file__).resolve().parents[1]
    output_root = project_root / "public" / "bot"

    inputs = {
        "idle": (source_root / "frames" / "final" / "bot-idle-loop", 1, None),
        "nod": (source_root / "frames" / "raw" / "bot-nod", 2, ACTION_CROP),
        "work": (source_root / "frames" / "raw" / "bot-work", 2, ACTION_CROP),
    }

    manifest: dict[str, object] = {
        "type": "animated-webp-set",
        "width": OUTPUT_SIZE[0],
        "height": OUTPUT_SIZE[1],
        "frameDurationMs": FRAME_DURATION_MS,
        "transparent": True,
        "actions": {},
    }

    for action, (folder, step, crop) in inputs.items():
        frames = load_frames(folder, step=step, crop=crop)
        destination = output_root / f"bot-{action}-animated.webp"
        save_animation(frames, destination)
        manifest["actions"][action] = {
            "src": f"/bot/{destination.name}",
            "frameCount": len(frames),
            "durationMs": len(frames) * FRAME_DURATION_MS,
        }
        print(f"{action}: {len(frames)} frames -> {destination}")

        if action == "idle":
            frames[0].save(output_root / "bot-poster.webp", "WEBP", quality=86, method=6)

    (output_root / "bot-motion.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
