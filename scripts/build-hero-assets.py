#!/usr/bin/env python3
"""
build-hero-assets.py
--------------------
Turns a raw self-introduction video into the seamless, looping hero clip used
by the site, plus the still images (portrait for the ID card, OG image).

Requires: ffmpeg + ffprobe on PATH, Python 3.9+, numpy, Pillow.

    python3 scripts/build-hero-assets.py \
        --video source/intro.mp4 \
        --photo source/portrait.png        # optional, otherwise best video frame

Outputs (into ./public by default):
    hero/hero.mp4     H.264 yuv420p  CRF 24 slow + AAC 96k  (+faststart)
    hero/hero.webm    VP9 CRF 36 + Opus 80k
    hero/poster.webp  first frame of the loop (video poster)
    portrait-bust.webp  480x600 head-to-shirt crop
    og.jpg              1200x630 social card

Loop strategy (no retiming, lips stay in sync):
    take the first D seconds (default 10 s), F = cross-fade length (0.5 s)
        A = src[F : D]   (length D-F)
        B = src[0 : F]
    output = A, with its last F seconds cross-faded into B.
    Output length is D-F. It ends on src[F-ε] and restarts at src[F],
    so the loop point is invisible and inaudible. Video uses ffmpeg xfade,
    audio is blended sample-accurately in numpy with an equal-power curve.
"""
from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT_W, OUT_H = 768, 960          # hero aspect 4:5 (matches aspect-ratio: 768/960 in CSS)
SR = 48000
PAPER = (244, 242, 238)          # --paper
INK = (13, 13, 13)
MUTE = (119, 117, 111)


# --------------------------------------------------------------------------- utils
def run(cmd: list[str], **kw) -> subprocess.CompletedProcess:
    print("  $", " ".join(str(c) for c in cmd[:6]), "…" if len(cmd) > 6 else "")
    return subprocess.run(cmd, check=True, **kw)


def probe(path: Path) -> dict:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", str(path)],
        check=True, capture_output=True, text=True,
    ).stdout
    return json.loads(out)


def read_gray_frames(video: Path, w: int, h: int, every: float, dur: float) -> np.ndarray:
    """Decode a few downscaled grayscale frames for detection."""
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-t", f"{dur}", "-i", str(video),
         "-vf", f"fps=1/{every},scale={w}:{h},format=gray", "-f", "rawvideo", "-"],
        check=True, capture_output=True,
    ).stdout
    frames = np.frombuffer(raw, np.uint8)
    return frames.reshape(-1, h, w)


# --------------------------------------------------------------------------- detection
def detect_crop(video: Path, src_w: int, src_h: int, dur: float) -> tuple[int, int, int, int]:
    """
    Union bounding box of non-background pixels over sampled frames, then a
    4:5 crop that contains the full figure (head to toe) and is centred on it.
    """
    scale = 4
    w, h = src_w // scale, src_h // scale
    frames = read_gray_frames(video, w, h, every=0.5, dur=dur)
    bg = np.median(frames[:, :, : max(4, w // 20)])          # left strip = backdrop
    mask = (frames < bg - 22).any(axis=0)
    # remove isolated specks
    rows = np.where(mask.sum(axis=1) > 2)[0]
    cols = np.where(mask.sum(axis=0) > 2)[0]
    if rows.size == 0 or cols.size == 0:
        raise SystemExit("Could not detect the person — pass --crop W:H:X:Y")
    y0, y1 = rows[0] * scale, (rows[-1] + 1) * scale
    x0, x1 = cols[0] * scale, (cols[-1] + 1) * scale
    # centre on the column mass (hands/hair can make the bbox asymmetric)
    col_mass = mask.sum(axis=0).astype(float)
    cx = int(round((col_mass * np.arange(w)).sum() / col_mass.sum() * scale))
    print(f"  person bbox x:{x0}-{x1} y:{y0}-{y1}  centre-x:{cx}")

    pad = int((y1 - y0) * 0.04)
    ch = min(src_h, (y1 - y0) + 2 * pad)
    ch -= ch % 2
    cw = int(round(ch * OUT_W / OUT_H))
    cw -= cw % 2
    if cw > src_w:
        cw = src_w - src_w % 2
        ch = int(round(cw * OUT_H / OUT_W)) // 2 * 2
    x = int(np.clip(cx - cw // 2, 0, src_w - cw))
    y = int(np.clip(((y0 + y1) // 2) - ch // 2, 0, src_h - ch))
    return cw, ch, x, y


# --------------------------------------------------------------------------- audio
def decode_audio(video: Path, start: float, dur: float) -> np.ndarray:
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-ss", f"{start}", "-t", f"{dur}", "-i", str(video),
         "-vn", "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"],
        check=True, capture_output=True,
    ).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).copy()


def write_wav(path: Path, data: np.ndarray) -> None:
    import wave
    pcm = (np.clip(data, -1, 1) * 32767).astype("<i2")
    with wave.open(str(path), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


def loop_audio(video: Path, D: float, F: float) -> np.ndarray:
    full = decode_audio(video, 0, D)
    n_total = int(round(D * SR))
    if full.shape[0] < n_total:                       # pad if the stream is short
        full = np.vstack([full, np.zeros((n_total - full.shape[0], 2), np.float32)])
    full = full[:n_total]
    n = int(round(F * SR))
    A = full[n:]                                      # src[F:D]
    B = full[:n]                                      # src[0:F]
    t = np.linspace(0, 1, n, endpoint=False, dtype=np.float32)[:, None]
    fade_out = np.cos(t * np.pi / 2)                  # equal-power
    fade_in = np.sin(t * np.pi / 2)
    tail = A[-n:] * fade_out + B * fade_in
    out = np.vstack([A[:-n], tail])
    # sanity: the wrap-around sample step should be tiny (no click)
    jump = float(np.abs(out[-1] - out[0]).max())
    print(f"  audio loop: {out.shape[0] / SR:.3f}s, wrap step {jump:.4f}")
    return out


# --------------------------------------------------------------------------- stills
def best_frame(video: Path, crop: tuple[int, int, int, int], dur: float) -> Image.Image:
    """Sharpest frame (Laplacian variance) in the upper body region."""
    cw, ch, x, y = crop
    tmp = Path(tempfile.mkdtemp())
    run(["ffmpeg", "-v", "error", "-y", "-t", f"{dur}", "-i", str(video),
         "-vf", f"fps=4,crop={cw}:{ch}:{x}:{y}", str(tmp / "f_%03d.png")])
    best, best_score = None, -1.0
    for p in sorted(tmp.glob("f_*.png")):
        im = Image.open(p).convert("L")
        a = np.asarray(im, np.float32)[: im.height // 3]
        lap = a[1:-1, 1:-1] * 4 - a[:-2, 1:-1] - a[2:, 1:-1] - a[1:-1, :-2] - a[1:-1, 2:]
        score = float(lap.var())
        if score > best_score:
            best, best_score = p, score
    img = Image.open(best).convert("RGB")
    shutil.rmtree(tmp, ignore_errors=True)
    return img


def bust_crop(img: Image.Image, full_body: bool) -> Image.Image:
    """Head-to-shirt crop at 4:5 from a light-background photo or frame."""
    a = np.asarray(img.convert("L"), np.float32)
    H, W = a.shape
    bg = np.median(np.concatenate([a[:, : W // 20].ravel(), a[:, -W // 20:].ravel()]))
    mask = a < bg - 28
    rows = np.where(mask.sum(axis=1) > W * 0.01)[0]
    top = int(rows[0]) if rows.size else 0
    head_rows = mask[top: top + max(1, H // 4)]
    cols_mass = head_rows.sum(axis=0).astype(float)
    cx = int((cols_mass * np.arange(W)).sum() / max(cols_mass.sum(), 1)) if cols_mass.sum() else W // 2
    # a photo is assumed to be a bust shot; a video frame shows the full figure
    figure_h = (rows[-1] - top) if rows.size else H
    ch = int(min(H - max(0, top - H * 0.04), figure_h * (0.34 if full_body else 0.82)))
    ch = max(ch, 200)
    cw = int(ch * 0.8)
    y = int(max(0, top - ch * 0.05))
    x = int(np.clip(cx - cw // 2, 0, max(0, W - cw)))
    crop = img.crop((x, y, x + cw, y + ch))
    return crop.resize((480, 600), Image.LANCZOS)


def whiten(img: Image.Image, imax: float = 0.98) -> Image.Image:
    a = np.asarray(img, np.float32) / 255.0
    a = np.clip(a / imax, 0, 1)
    return Image.fromarray((a * 255).round().astype(np.uint8))


def make_og(portrait: Image.Image, out: Path, name: str, role: str) -> None:
    W, H = 1200, 630
    og = Image.new("RGB", (W, H), PAPER)
    # portrait panel on the right, multiplied onto paper so white disappears
    ph = H - 80
    pw = int(ph * 0.8)
    p = portrait.resize((pw, ph), Image.LANCZOS)
    pa = np.asarray(p, np.float32) / 255.0
    paper = np.array(PAPER, np.float32) / 255.0
    blended = (pa * paper * 255).round().astype(np.uint8)        # multiply blend
    card = Image.fromarray(blended)
    m = Image.new("L", (pw, ph), 0)
    ImageDraw.Draw(m).rounded_rectangle((0, 0, pw, ph), radius=28, fill=255)
    og.paste(card, (W - pw - 60, 40), m)

    d = ImageDraw.Draw(og)
    assets = Path(__file__).resolve().parent / "assets"
    try:
        bold = ImageFont.truetype(str(assets / "InterTight-Bold.woff"), 76)
        mid = ImageFont.truetype(str(assets / "InterTight-Medium.woff"), 26)
        serif = ImageFont.truetype(str(assets / "InstrumentSerif-Italic.woff"), 76)
    except OSError:
        bold = mid = serif = ImageFont.load_default()
    x = 72
    first, _, rest = name.partition(" ")
    d.text((x, 150), first, font=bold, fill=INK)
    d.text((x, 232), rest, font=serif, fill=MUTE)
    y = 360
    for line in role.split(" | ")[:3]:
        d.text((x, y), line, font=mid, fill=INK if y == 360 else MUTE)
        y += 40
    d.line((x, 540, x + 64, 540), fill=INK, width=3)
    og.save(out, "JPEG", quality=88, optimize=True, progressive=True)


# --------------------------------------------------------------------------- main
def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--video", required=True, type=Path)
    ap.add_argument("--photo", type=Path, help="optional front-facing photo for the ID card")
    ap.add_argument("--out", type=Path, default=ROOT / "public")
    ap.add_argument("--crop", help="manual crop W:H:X:Y in source pixels (skips detection)")
    ap.add_argument("--duration", type=float, default=10.0, help="seconds of source to use")
    ap.add_argument("--fade", type=float, default=0.5, help="cross-fade length in seconds")
    ap.add_argument("--name", default="Afreshia Laffintha Asmy")
    ap.add_argument("--role", default="Senior Associate | Chartered Accountant (IAI) | Financial Reporting, Tax Compliance & Internal Audit")
    args = ap.parse_args()

    for tool in ("ffmpeg", "ffprobe"):
        if not shutil.which(tool):
            sys.exit(f"{tool} not found on PATH")

    info = probe(args.video)
    v = next(s for s in info["streams"] if s["codec_type"] == "video")
    has_audio = any(s["codec_type"] == "audio" for s in info["streams"])
    src_w, src_h = int(v["width"]), int(v["height"])
    num, den = (int(x) for x in v["r_frame_rate"].split("/"))
    fps = num / den
    D = min(args.duration, float(info["format"]["duration"]))
    F = args.fade
    D = round(D * fps) / fps                                    # frame-align
    F = round(F * fps) / fps
    print(f"source {src_w}x{src_h} @ {fps:g}fps, using {D:.3f}s, fade {F:.3f}s")

    if args.crop:
        cw, ch, x, y = (int(n) for n in args.crop.split(":"))
    else:
        cw, ch, x, y = detect_crop(args.video, src_w, src_h, D)
    print(f"  crop={cw}:{ch}:{x}:{y} → scale {OUT_W}x{OUT_H}")

    hero_dir = args.out / "hero"
    hero_dir.mkdir(parents=True, exist_ok=True)
    tmp = Path(tempfile.mkdtemp())

    # ---- video: crop, whiten, seamless xfade (lossless intermediate)
    pre = (f"crop={cw}:{ch}:{x}:{y},scale={OUT_W}:{OUT_H}:flags=lanczos,"
           f"colorlevels=rimax=0.98:gimax=0.98:bimax=0.98,setsar=1,fps={fps:g},format=yuv420p")
    fc = (
        f"[0:v]{pre},split=2[s1][s2];"
        f"[s1]trim=start={F}:end={D},setpts=PTS-STARTPTS[a];"
        f"[s2]trim=start=0:end={F},setpts=PTS-STARTPTS[b];"
        f"[a][b]xfade=transition=fade:duration={F}:offset={D - 2 * F}[v]"
    )
    mid = tmp / "loop.mkv"
    run(["ffmpeg", "-v", "error", "-y", "-t", f"{D}", "-i", str(args.video),
         "-filter_complex", fc, "-map", "[v]", "-c:v", "libx264", "-qp", "0", "-preset", "ultrafast", str(mid)])

    # ---- audio: sample-accurate equal-power cross-fade in numpy
    wav = tmp / "loop.wav"
    if has_audio:
        write_wav(wav, loop_audio(args.video, D, F))
    L = D - F

    a_in = ["-i", str(wav)] if has_audio else []
    a_map = ["-map", "1:a:0"] if has_audio else []
    run(["ffmpeg", "-v", "error", "-y", "-i", str(mid), *a_in, "-map", "0:v:0", *a_map,
         "-t", f"{L}", "-c:v", "libx264", "-preset", "slow", "-crf", "24", "-pix_fmt", "yuv420p",
         "-profile:v", "high", "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart",
         str(hero_dir / "hero.mp4")])
    run(["ffmpeg", "-v", "error", "-y", "-i", str(mid), *a_in, "-map", "0:v:0", *a_map,
         "-t", f"{L}", "-c:v", "libvpx-vp9", "-crf", "36", "-b:v", "0", "-row-mt", "1",
         "-deadline", "good", "-cpu-used", "2", "-pix_fmt", "yuv420p",
         "-c:a", "libopus", "-b:a", "80k", str(hero_dir / "hero.webm")])

    # ---- poster (first frame of the loop) so the hero paints before the video decodes
    run(["ffmpeg", "-v", "error", "-y", "-i", str(mid), "-frames:v", "1",
         "-c:v", "libwebp", "-quality", "72", str(hero_dir / "poster.webp")])

    # ---- stills
    if args.photo:
        base = Image.open(args.photo).convert("RGB")
    else:
        base = best_frame(args.video, (cw, ch, x, y), D)
    base = whiten(base)
    bust = bust_crop(base, full_body=not args.photo)
    bust.save(args.out / "portrait-bust.webp", "WEBP", quality=86, method=6)
    make_og(bust, args.out / "og.jpg", args.name, args.role)

    shutil.rmtree(tmp, ignore_errors=True)
    for f in [hero_dir / "hero.mp4", hero_dir / "hero.webm", hero_dir / "poster.webp", args.out / "portrait-bust.webp", args.out / "og.jpg"]:
        print(f"  ✓ {f.relative_to(ROOT) if f.is_relative_to(ROOT) else f}  {f.stat().st_size / 1024:.0f} kB")


if __name__ == "__main__":
    main()
