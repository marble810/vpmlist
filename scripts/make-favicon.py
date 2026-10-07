#!/usr/bin/env python3
"""Generate public/favicon.ico + public/apple-touch-icon.png from public/Icon.png.

Usage
    npm run favicon
    python scripts/make-favicon.py [source.png] [--touch-size 180] [--no-repair]

Why this is a script instead of a one-liner:

1. Downscaling runs in premultiplied-alpha space. A plain
   `magick Icon.png -define icon:auto-resize=... favicon.ico` resizes RGB and
   alpha independently, so whatever colour lives in the transparent padding
   (white, black, ...) bleeds into the silhouette as a halo. This is very
   visible at 16-32 px on the site's near-black background.

2. Exports that were anti-aliased against a flat matte — where every
   semi-transparent pixel carries that matte colour, e.g. `(255,255,255,137)`
   from "export with transparent background" on a white canvas — keep the matte
   in the AA ring. Premultiplication cannot undo that (the original colour is
   gone), so `repair` rebuilds the ring colour from the nearest opaque
   neighbours. Auto-detected; `--no-repair` opts out.

3. The .ico holds BMP (32bpp + alpha) entries up to 64 px, which is what old
   Windows shell code paths expect, and PNG entries for 128/256 px, which keeps
   the file ~90 KB instead of ~370 KB. Entries are emitted in ascending order.

Only public/favicon.ico and public/apple-touch-icon.png are written; the source
Icon.png is never modified.
"""

from __future__ import annotations

import argparse
import io
import os
import struct
import sys

try:
    import numpy as np
    from PIL import Image
except ImportError as exc:  # pragma: no cover
    sys.exit(f"missing dependency: {exc.name}. Install with: pip install pillow numpy")

BMP_MAX_SIZE = 64  # sizes <= this go into the .ico as BMP, larger ones as PNG
ICO_SIZES = (16, 32, 48, 64, 128, 256)


def load_rgba(path: str) -> Image.Image:
    im = Image.open(path)
    if im.width != im.height:
        print(f"warning: {path} is {im.width}x{im.height}, not square — the icon will be stretched")
    return im.convert("RGBA")


def matte_colour(im: Image.Image) -> np.ndarray | None:
    """Return the flat matte colour of the AA ring, or None if the source is not matted.

    A matted export has a thin ring of semi-transparent pixels that all share one
    colour (the colour of the canvas it was drawn on). A genuinely soft image
    (glow, blur, gradient alpha) has a varied ring and must be left alone.
    """
    arr = np.asarray(im)
    alpha = arr[:, :, 3]
    ring = (alpha > 0) & (alpha < 255)
    n_ring = int(ring.sum())
    n_opaque = int((alpha == 255).sum())
    if n_ring == 0 or n_opaque == 0:
        return None
    if n_ring > 0.25 * n_opaque:  # lots of partial alpha => a real soft edge
        return None
    cols = arr[ring][:, :3].astype(np.float32)
    spread = float(cols.std(axis=0).max())
    if spread >= 3.0:  # ring colours differ => not a matte
        return None
    return cols.mean(axis=0)


def repair_ring(im: Image.Image, iterations: int = 24) -> Image.Image:
    """Replace the colour of every pixel that is not fully opaque with the colour of its
    nearest fully opaque neighbour, keeping the alpha channel untouched."""
    arr = np.asarray(im).astype(np.float32)
    alpha = arr[:, :, 3:4]
    rgb = arr[:, :, :3].copy()
    known = arr[:, :, 3] == 255
    rgb[~known] = 0.0
    weight = known.astype(np.float32)
    h, w = known.shape

    for _ in range(iterations):
        padded_rgb = np.pad(rgb, ((1, 1), (1, 1), (0, 0)))
        padded_w = np.pad(weight, 1)
        acc = np.zeros_like(rgb)
        acc_w = np.zeros_like(weight)
        for dy in (0, 1, 2):  # 3x3 neighbourhood, clipped (no wrap-around)
            for dx in (0, 1, 2):
                acc += padded_rgb[dy : dy + h, dx : dx + w, :]
                acc_w += padded_w[dy : dy + h, dx : dx + w]
        fill = (~known) & (acc_w > 0)
        if not fill.any():
            break
        rgb[fill] = acc[fill] / acc_w[fill][:, None]
        weight[fill] = 1.0
        known = known | fill

    out = np.dstack([np.clip(rgb + 0.5, 0, 255), alpha])
    return Image.fromarray(out.astype(np.uint8))


def resize_premul(im: Image.Image, size: tuple[int, int]) -> Image.Image:
    """LANCZOS resize in premultiplied-alpha space: no halo from transparent padding."""
    arr = np.asarray(im).astype(np.float32)
    alpha = arr[:, :, 3:4]
    pre = np.concatenate([arr[:, :, :3] * (alpha / 255.0), alpha], axis=2)
    step = Image.fromarray(np.clip(pre + 0.5, 0, 255).astype(np.uint8)).resize(size, Image.LANCZOS)

    arr = np.asarray(step).astype(np.float32)
    alpha = arr[:, :, 3:4]
    with np.errstate(divide="ignore", invalid="ignore"):
        rgb = np.where(alpha > 0, arr[:, :, :3] * 255.0 / np.maximum(alpha, 1e-6), 0.0)
    return Image.fromarray(np.concatenate([np.clip(rgb + 0.5, 0, 255), alpha], axis=2).astype(np.uint8))


def bmp_frame(im: Image.Image) -> bytes:
    """BITMAPINFOHEADER + 32bpp BGRA pixels + (unused) AND mask, as stored in a .ico."""
    w, h = im.size
    px = im.load()
    body = bytearray()
    for y in range(h - 1, -1, -1):  # DIB rows are bottom-up
        for x in range(w):
            r, g, b, a = px[x, y]
            body += bytes((b, g, r, a))
    body += b"\x00" * (((w + 31) // 32) * 4 * h)
    header = struct.pack("<IiiHHIIiiII", 40, w, h * 2, 1, 32, 0, len(body), 0, 0, 0, 0)
    return header + bytes(body)


def png_frame(im: Image.Image) -> bytes:
    buf = io.BytesIO()
    im.save(buf, format="PNG", optimize=True)
    return buf.getvalue()


def build_ico(frames: list[tuple[int, bytes]]) -> bytes:
    out = bytearray(struct.pack("<HHH", 0, 1, len(frames)))
    offset = 6 + 16 * len(frames)
    for size, data in frames:
        dim = 0 if size == 256 else size  # 256 is stored as 0
        out += struct.pack("<BBBBHHII", dim, dim, 0, 0, 1, 32, len(data), offset)
        offset += len(data)
    for _, data in frames:
        out += data
    return bytes(out)


def rel(path: str, root: str) -> str:
    try:
        return os.path.relpath(path, root)
    except ValueError:  # different drive (e.g. --ico on C:, repo on F:)
        return path


def main() -> int:
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("source", nargs="?", default=os.path.join(root, "public", "Icon.png"))
    ap.add_argument("--ico", default=os.path.join(root, "public", "favicon.ico"))
    ap.add_argument("--touch", default=os.path.join(root, "public", "apple-touch-icon.png"))
    ap.add_argument("--touch-size", type=int, default=180)
    ap.add_argument("--no-repair", action="store_true", help="keep the source's AA ring colours as-is")
    args = ap.parse_args()

    src = load_rgba(args.source)
    print(f"source      {rel(args.source, root)}  {src.width}x{src.height}")

    img = src
    matte = None if args.no_repair else matte_colour(src)
    if matte is not None:
        img = repair_ring(src)
        hexc = "#%02X%02X%02X" % tuple(int(round(c)) for c in matte)
        before = np.asarray(src)[:, :, :3].astype(np.int16)
        after = np.asarray(img)[:, :, :3].astype(np.int16)
        visible = np.asarray(src)[:, :, 3] > 0  # RGB under alpha 0 is never rendered
        changed = int(((before != after).any(axis=2) & visible).sum())
        if changed:
            print(f"edge repair AA ring was matted on {hexc}; recoloured {changed} px from opaque neighbours")
        else:
            print(f"edge repair AA ring is matted on {hexc}, but every ring pixel already matches its opaque")
            print("             neighbours — so the matte is OPAQUE ART (a border drawn around the shape),")
            print("             not just an anti-aliasing ring. The favicon will show that border as-is.")
    elif args.no_repair:
        print("edge repair skipped (--no-repair)")
    else:
        print("edge repair not needed (no flat matte detected)")

    frames: list[tuple[int, bytes]] = []
    for size in ICO_SIZES:
        small = resize_premul(img, (size, size))
        frames.append((size, bmp_frame(small) if size <= BMP_MAX_SIZE else png_frame(small)))

    ico = build_ico(frames)
    with open(args.ico, "wb") as fh:
        fh.write(ico)
    touch = resize_premul(img, (args.touch_size, args.touch_size))
    touch.save(args.touch, optimize=True)

    for (size, data), _ in zip(frames, ICO_SIZES):
        print(f"  {size:>3}x{size:<3} {'BMP' if size <= BMP_MAX_SIZE else 'PNG'} {len(data):>7} B")
    print(f"wrote       {rel(args.ico, root)} ({os.path.getsize(args.ico)} B)")
    print(f"wrote       {rel(args.touch, root)} ({os.path.getsize(args.touch)} B)")
    print("check       index.html links both files (rel=icon, rel=apple-touch-icon)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
