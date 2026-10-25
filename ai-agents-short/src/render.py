#!/usr/bin/env python3
"""Frame-accurate renderer for the AI Agents explainer short.

    python3 src/render.py                 # full render -> output/*.mp4
    python3 src/render.py --stills 1.0 13 # PNG stills at given seconds
    python3 src/render.py --sheet         # contact sheet of key moments

Frames are composited with Pillow/NumPy and piped as raw RGB into ffmpeg
(libx264, yuv420p, 30 fps). See README.md for details.
"""
import argparse
import math
import os
import subprocess
import sys
from functools import lru_cache
from multiprocessing import Pool

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

sys.path.insert(0, os.path.dirname(__file__))
from timeline import (CUES, DURATION, FPS, H, INTER, NAVY, OFF, OSWALD, SCENES, W, YELLOW)  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG_DIR = os.path.join(ROOT, "assets", "images")
FONT_DIR = os.path.join(ROOT, "assets", "fonts")
OUT_DIR = os.path.join(ROOT, "output")
SRC_W, SRC_H = 941, 1672
K = 1.6  # pre-upscale factor so punch-ins stay sharp


# ---------------------------------------------------------------- easing
def clamp(x, a=0.0, b=1.0):
    return max(a, min(b, x))


EASE = {
    "linear": lambda t: t,
    "outCubic": lambda t: 1 - (1 - t) ** 3,
    "inCubic": lambda t: t ** 3,
    "inOutCubic": lambda t: 4 * t ** 3 if t < 0.5 else 1 - (-2 * t + 2) ** 3 / 2,
    "inOutSine": lambda t: -(math.cos(math.pi * t) - 1) / 2,
}


def out_back(t, s=1.6):
    t -= 1
    return 1 + (s + 1) * t ** 3 + s * t ** 2


# ---------------------------------------------------------------- assets
@lru_cache(None)
def font(name, size):
    return ImageFont.truetype(os.path.join(FONT_DIR, name), size)


@lru_cache(None)
def base_image(name):
    im = Image.open(os.path.join(IMG_DIR, name)).convert("RGB")
    # cover-fit to 9:16 at K x output resolution, Lanczos once
    return im.resize((int(W * K), int(H * K)), Image.LANCZOS)


@lru_cache(None)
def finish_maps():
    """Vignette * low-frequency paper mottling, plus a bank of mono grain frames."""
    rng = np.random.default_rng(7)
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    r = np.sqrt(((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2) / math.sqrt(2)
    vignette = 1 - 0.30 * r ** 2.2
    small = rng.normal(0, 1, (H // 40, W // 40)).astype(np.float32)
    mott = np.asarray(Image.fromarray(small).resize((W, H), Image.BICUBIC), np.float32)
    tex = (vignette * (1 + 0.022 * mott)).astype(np.float32)[..., None]
    grains = [rng.normal(0, 6.5, (H, W)).astype(np.float32)[..., None] for _ in range(8)]
    return tex, grains


@lru_cache(None)
def top_gradient():
    a = np.zeros((H, W), np.float32)
    ys = np.arange(H, dtype=np.float32)
    col = np.clip(1 - ys / 1000, 0, 1) ** 1.6 * 0.62
    a[:] = col[:, None]
    rgba = np.zeros((H, W, 4), np.uint8)
    rgba[..., :3] = NAVY
    rgba[..., 3] = (a * 255).astype(np.uint8)
    return Image.fromarray(rgba, "RGBA")


def jag_profile(n, seed, amp, steps=(110, 28, 7), weights=(1.0, 0.35, 0.14)):
    rng = np.random.default_rng(seed)
    out = np.zeros(n, np.float32)
    for st, wgt in zip(steps, weights):
        k = n // st + 3
        pts = rng.uniform(-1, 1, k)
        out += wgt * amp * np.interp(np.arange(n) / st, np.arange(k), pts)
    return out


# ---------------------------------------------------------------- paper + text layers
def paper_fill(w, h, color, seed, halftone=True):
    rng = np.random.default_rng(seed)
    noise = rng.normal(0, 1, (h, w)).astype(np.float32)
    fib = np.asarray(Image.fromarray(rng.normal(0, 1, (max(h // 6, 2), max(w // 6, 2))).astype(np.float32))
                     .resize((w, h), Image.BICUBIC), np.float32)
    shade = 1 + 0.035 * noise + 0.04 * fib
    arr = np.clip(np.array(color, np.float32)[None, None] * shade[..., None], 0, 255)
    if halftone:  # restrained halftone, fading in toward one corner
        yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
        sp = 9.0
        gx, gy = (xx % sp) - sp / 2, (yy % sp) - sp / 2
        rad = np.clip((xx / max(w, 1)) * 1.4 - 0.55, 0, 1) * 2.4
        dots = (gx ** 2 + gy ** 2) < rad ** 2
        arr[dots] *= 0.84
    return arr.astype(np.uint8)


def torn_mask(w, h, m, seed, amp=5):
    tw, th = w + 2 * m, h + 2 * m
    top = jag_profile(w + 1, seed, amp)
    bot = jag_profile(w + 1, seed + 1, amp)
    lef = jag_profile(h + 1, seed + 2, amp * 0.5, steps=(40, 9))
    rig = jag_profile(h + 1, seed + 3, amp * 0.5, steps=(40, 9))
    poly = [(m + x, m + top[x]) for x in range(0, w + 1, 4)]
    poly += [(m + w + rig[y], m + y) for y in range(0, h + 1, 4)]
    poly += [(m + x, m + h + bot[x]) for x in range(w, -1, -4)]
    poly += [(m + lef[y], m + y) for y in range(h, -1, -4)]
    mask = Image.new("L", (tw * 2, th * 2), 0)
    ImageDraw.Draw(mask).polygon([(x * 2, y * 2) for x, y in poly], fill=255)
    return mask.resize((tw, th), Image.LANCZOS)


def add_shadow(layer, offset=(5, 8), blur=7, opacity=0.5):
    a = layer.getchannel("A")
    sh = Image.new("RGBA", layer.size, NAVY + (0,))
    sh.putalpha(a.point(lambda v: int(v * opacity)))
    sh = sh.filter(ImageFilter.GaussianBlur(blur))
    out = Image.new("RGBA", layer.size, (0, 0, 0, 0))
    out.alpha_composite(sh, offset)
    out.alpha_composite(layer)
    return out


@lru_cache(None)
def text_layer(text, fname, size, fg, shadow=True):
    f = font(fname, size)
    l, t, r, b = f.getbbox(text)
    m = 24
    im = Image.new("RGBA", (r - l + 2 * m, b - t + 2 * m), (0, 0, 0, 0))
    ImageDraw.Draw(im).text((m - l, m - t), text, font=f, fill=fg)
    if shadow and fg != NAVY:
        im = add_shadow(im, offset=(3, 5), blur=6, opacity=0.65)
    return im, m


@lru_cache(None)
def strip_layer(text, fname, size, fg, bg, seed, pad):
    f = font(fname, size)
    l, t, r, b = f.getbbox(text)
    px, py = pad
    w, h, m = r - l + 2 * px, b - t + 2 * py, 26
    mask = torn_mask(w, h, m, seed)
    paper = Image.fromarray(paper_fill(w + 2 * m, h + 2 * m, bg, seed, halftone=bg != OFF), "RGB")
    # light fibrous rim where the paper was torn
    inner = mask.filter(ImageFilter.MinFilter(5))
    rim = Image.eval(Image.fromarray(np.clip(np.asarray(mask, np.int16) - np.asarray(inner, np.int16), 0, 255)
                                     .astype(np.uint8)), lambda v: v)
    paper.paste(Image.new("RGB", paper.size, (250, 247, 238)), (0, 0), rim)
    layer = paper.convert("RGBA")
    layer.putalpha(mask)
    ImageDraw.Draw(layer).text((m + px - l, m + py - t), text, font=f, fill=fg)
    return add_shadow(layer), m


@lru_cache(None)
def label_layer(text, size):
    f = font(OSWALD, size)
    l, t, r, b = f.getbbox(text)
    px, py, m = 16, 9, 18
    w, h = r - l + 2 * px, b - t + 2 * py
    im = Image.new("RGBA", (w + 2 * m, h + 2 * m), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rectangle((m, m, m + w, m + h), fill=NAVY + (235,))
    d.rectangle((m, m, m + 5, m + h), fill=YELLOW)
    num, rest = text.split("  ", 1)
    d.text((m + px - l + 4, m + py - t), num, font=f, fill=YELLOW)
    d.text((m + px - l + 4 + f.getlength(num + "  "), m + py - t), rest, font=f, fill=OFF)
    return add_shadow(im, offset=(3, 5), blur=5, opacity=0.5), m


# ---------------------------------------------------------------- camera
def camera(scene, tl):
    segs = scene["camera"]
    if tl <= segs[0][0]:
        return segs[0][2]
    for t0, t1, a, b, ease in segs:
        if t0 <= tl < t1:
            p = EASE[ease]((tl - t0) / (t1 - t0))
            return tuple(a[i] + (b[i] - a[i]) * p for i in range(3))
    return segs[-1][3]


def view_box(scene, tl):
    z, cx, cy = camera(scene, tl)
    bw, bh = W * K, H * K
    cw, ch = bw / z, bh / z
    x0 = clamp(cx * bw - cw / 2, 0, bw - cw)
    y0 = clamp(cy * bh - ch / 2, 0, bh - ch)
    return x0, y0, cw, ch


def img_to_canvas(box, px, py):
    x0, y0, cw, ch = box
    return ((px / SRC_W) * W * K - x0) / cw * W, ((py / SRC_H) * H * K - y0) / ch * H


# ---------------------------------------------------------------- animation
def anim_state(el, tl):
    t_in, t_out = el["t_in"], el.get("t_out")
    if tl < t_in:
        return None
    a_out = 1.0
    if t_out is not None:
        if tl >= t_out + 0.12:
            return None
        a_out = 1 - clamp((tl - t_out) / 0.12)
    dt = tl - t_in
    kind = el.get("anim", "slide")
    if kind == "stamp":
        p = clamp(dt / 0.24)
        return dict(a=clamp(dt / 0.06) * a_out, s=1.32 - 0.32 * out_back(p), r=6 * (1 - EASE["outCubic"](p)), dx=0, dy=0)
    if kind == "pop":
        p = clamp(dt / 0.32)
        return dict(a=clamp(dt / 0.14) * a_out, s=0.82 + 0.18 * out_back(p), r=0, dx=0, dy=0)
    p = clamp(dt / 0.5)
    return dict(a=clamp(dt / 0.28) * a_out, s=1.0, r=0, dx=0, dy=46 * (1 - EASE["outCubic"](p)))


def place(frame, layer, margin, x, y, st, rot, center_x=False):
    """Composite `layer` whose content top-left (ignoring margin) sits at x,y."""
    lw, lh = layer.size
    cx = (x if center_x else x - margin + lw / 2) + st["dx"]
    cy = y - margin + lh / 2 + st["dy"]
    im = layer
    if abs(st["s"] - 1) > 1e-3:
        im = im.resize((max(1, round(lw * st["s"])), max(1, round(lh * st["s"]))), Image.BICUBIC)
    angle = rot + st["r"]
    if abs(angle) > 0.05:
        im = im.rotate(angle, Image.BICUBIC, expand=True)
    if st["a"] < 0.999:
        im = im.copy()
        im.putalpha(im.getchannel("A").point(lambda v, a=st["a"]: int(v * a)))
    frame.alpha_composite(im, (int(round(cx - im.width / 2)), int(round(cy - im.height / 2))))


# ---------------------------------------------------------------- marker strokes
def catmull(points, n=14):
    if len(points) < 3:
        return points
    pts = [points[0]] + list(points) + [points[-1]]
    out = []
    for i in range(1, len(pts) - 2):
        p0, p1, p2, p3 = pts[i - 1], pts[i], pts[i + 1], pts[i + 2]
        for j in range(n):
            t = j / n
            out.append(tuple(0.5 * ((2 * p1[k]) + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t * t
                                    + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t ** 3) for k in range(2)))
    out.append(points[-1])
    return out


def draw_stroke(frame, st, box, tl):
    p = clamp((tl - st["t0"]) / st["dur"])
    if p <= 0:
        return
    p = EASE["inOutCubic"](p)
    if st["space"] == "img":
        pts = [img_to_canvas(box, x, y) for x, y in st["points"]]
    else:
        pts = st["points"]
    path = catmull(pts)
    seg = [math.dist(path[i], path[i + 1]) for i in range(len(path) - 1)]
    total, target, acc, out = sum(seg), sum(seg) * p, 0.0, [path[0]]
    for i, s in enumerate(seg):
        if acc + s >= target:
            f = (target - acc) / s if s else 0
            out.append((path[i][0] + (path[i + 1][0] - path[i][0]) * f, path[i][1] + (path[i + 1][1] - path[i][1]) * f))
            break
        acc += s
        out.append(path[i + 1])
    ss, wdt = 3, st["width"]
    xs, ys = [q[0] for q in out], [q[1] for q in out]
    pad = wdt * 2 + 50
    bx0, by0 = int(min(xs) - pad), int(min(ys) - pad)
    bx1, by1 = int(max(xs) + pad), int(max(ys) + pad)
    lay = Image.new("RGBA", ((bx1 - bx0) * ss, (by1 - by0) * ss), (0, 0, 0, 0))
    d = ImageDraw.Draw(lay)
    sp = [((x - bx0) * ss, (y - by0) * ss) for x, y in out]
    col = st["color"] + (238,)
    r = wdt * ss / 2
    for i in range(len(sp) - 1):  # tapered marker: slightly thinner at the start
        k = 0.7 + 0.3 * min(1, i / 6)
        d.line([sp[i], sp[i + 1]], fill=col, width=int(wdt * ss * k))
        d.ellipse((sp[i + 1][0] - r * k, sp[i + 1][1] - r * k, sp[i + 1][0] + r * k, sp[i + 1][1] + r * k), fill=col)
    if st["arrow"] and p > 0.92 and len(sp) > 2:
        q = clamp((p - 0.92) / 0.08)
        (ax, ay), (bx, by) = sp[-3], sp[-1]
        ang = math.atan2(by - ay, bx - ax)
        ln = 38 * ss * q
        for da in (2.55, -2.55):
            ex, ey = bx + ln * math.cos(ang + da), by + ln * math.sin(ang + da)
            d.line([(bx, by), (ex, ey)], fill=col, width=int(wdt * ss))
            d.ellipse((ex - r, ey - r, ex + r, ey + r), fill=col)
    lay = lay.resize((bx1 - bx0, by1 - by0), Image.LANCZOS)
    frame.alpha_composite(lay, (bx0, by0))


# ---------------------------------------------------------------- scenes
def render_scene(i, t):
    sc = SCENES[i]
    tl = t - sc["start"]
    box = view_box(sc, tl)
    x0, y0, cw, ch = box
    bg = base_image(sc["image"]).resize((W, H), Image.BICUBIC, box=(x0, y0, x0 + cw, y0 + ch))
    frame = bg.convert("RGBA")
    if i != 8:  # final bubble is light paper; no top gradient there
        frame.alpha_composite(top_gradient())
    for st in sc["strokes"]:
        draw_stroke(frame, st, box, tl)
    drift = sc.get("drift", 0) * max(tl, 0)  # foreground paper layer drifts against the camera: parallax
    for el in sc["elements"]:
        stt = anim_state(el, tl)
        if stt is None:
            continue
        stt["dy"] += drift
        cxm = sc.get("center_x", False)
        if el["kind"] == "text":
            lay, m = text_layer(el["text"], el["font"], el["size"], el["fg"])
            place(frame, lay, m, el["x"], el["y"], stt, el["rot"], cxm)
        elif el["kind"] == "strip":
            lay, m = strip_layer(el["text"], el["font"], el["size"], el["fg"], el["bg"], el["seed"], el["pad"])
            place(frame, lay, m, el["x"], el["y"], stt, el["rot"], cxm)
        elif el["kind"] == "counter":
            p = EASE["inCubic"](clamp((tl - el["t0"]) / (el["t1"] - el["t0"])))
            n = int(round(el["n0"] + (el["n1"] - el["n0"]) * p))
            lay, m = strip_layer(el["label"].format(n=n), OSWALD, el["size"], OFF, (30, 62, 245), el["seed"], (22, 12))
            place(frame, lay, m, el["x"], el["y"], stt, el["rot"])
        elif el["kind"] == "label":
            lay, m = label_layer(el["text"], el["size"])
            px, py = img_to_canvas(box, el["u"] * SRC_W, el["v"] * SRC_H)
            stt["dy"] -= drift
            place(frame, lay, m, px, py, stt, 0, center_x=True)
    return frame.convert("RGB")


@lru_cache(None)
def transition_field(i):
    """Signed coordinate F(x,y) incl. torn jag; region F < pos shows the incoming scene."""
    tr = SCENES[i]["transition"]
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    d = tr["dir"]
    if d == "up":      # incoming rises from the bottom
        f, tan, n = -yy, xx, W
    elif d == "down":
        f, tan, n = yy, xx, W
    elif d == "left":  # incoming enters from the right
        f, tan, n = -xx, yy, H
    else:              # diagonal, bottom-right -> top-left
        f, tan, n = -(xx * 0.45 + yy * 0.89), xx * 0.89 - yy * 0.45, int(W + H)
    tan = tan - tan.min()
    jag = jag_profile(n + 2, 100 + i, 30)
    band = 10 + np.abs(jag_profile(n + 2, 200 + i, 18, steps=(60, 11, 4)))
    ti = np.clip(tan.astype(np.int32), 0, n + 1)
    return (f + jag[ti]).astype(np.float32), band[ti].astype(np.float32), (f.min(), f.max())


def shift(arr, dx, dy):
    if not dx and not dy:
        return arr
    out = np.empty_like(arr)
    ys = np.clip(np.arange(H) - dy, 0, H - 1)
    xs = np.clip(np.arange(W) - dx, 0, W - 1)
    out[:] = arr[ys][:, xs]
    return out


def tear(a_img, b_img, i, p):
    tr = SCENES[i]["transition"]
    F, band, (fmin, fmax) = transition_field(i)
    e = EASE["inOutCubic"](p)
    pos = (fmin - 60) + (fmax - fmin + 140) * e
    a = np.asarray(a_img, np.float32)
    s = int(round(tr.get("slide", 0) * (1 - e)))
    d = tr["dir"]
    dx, dy = {"up": (0, s), "down": (0, -s), "left": (s, 0)}.get(d, (int(s * 0.45), int(s * 0.89)))
    b = shift(np.asarray(b_img, np.float32), dx, dy)
    dist = F - pos  # <0 incoming, 0..band torn paper rim, >band outgoing
    shadow = np.clip(1 + dist / 34, 0, 1)  # outgoing sheet casts a shadow on the incoming scene
    b_sh = b * (1 - 0.5 * shadow[..., None])
    _, grains = finish_maps()
    rim = np.array(OFF, np.float32) * (0.93 + 0.07 * grains[3][..., 0:1] / 6.5)
    out = np.where((dist < 0)[..., None], b_sh, np.where((dist < band)[..., None], rim, a))
    edge = np.clip(1 - np.abs(dist) / 1.5, 0, 1)[..., None]  # 1px anti-alias at the tear
    out = out * (1 - edge * 0.5) + b_sh * edge * 0.5
    return Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))


# ---------------------------------------------------------------- subtitles
def parse_rich(text):
    words, hl = [], False
    for tok in text.split(" "):
        start = tok.startswith("*")
        if start:
            hl = True
            tok = tok[1:]
        end = tok.endswith("*")
        if end:
            tok = tok[:-1]
        words.append((tok, hl))
        if end:
            hl = False
    return words


@lru_cache(None)
def subtitle_layer(text):
    f = font(INTER, 46)
    words = parse_rich(text)
    space = f.getlength(" ")

    def wrap(maxw):
        lines, cur, curw = [], [], 0
        for w_, h_ in words:
            ww = f.getlength(w_)
            if cur and curw + space + ww > maxw:
                lines.append((cur, curw))
                cur, curw = [], 0
            curw += (space if cur else 0) + ww
            cur.append((w_, h_, ww))
        lines.append((cur, curw))
        return lines

    # balanced wrap: narrowest width that keeps the line count (no orphan words)
    lines = wrap(780)
    for mw in range(780, 300, -10):
        if len(wrap(mw)) > len(lines):
            break
        lines = wrap(mw)
    lh, px, py = 62, 30, 20
    bw = int(max(lw for _, lw in lines) + 2 * px)
    bh = int(len(lines) * lh + 2 * py - 6)
    im = Image.new("RGBA", (bw, bh), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((0, 0, bw - 1, bh - 1), radius=12, fill=NAVY + (228,))
    for li, (ws, lw) in enumerate(lines):
        x = (bw - lw) / 2
        y = py + li * lh - 2
        for w_, h_, ww in ws:
            d.text((x, y), w_, font=f, fill=YELLOW if h_ else OFF)
            x += ww + space
    return im


def draw_subtitles(frame, t):
    for t0, t1, text in CUES:
        if t0 <= t < t1:
            a = clamp((t - t0) / 0.15) * clamp((t1 - t) / 0.12)
            dy = 14 * (1 - EASE["outCubic"](clamp((t - t0) / 0.25)))
            lay = subtitle_layer(text)
            if a < 0.999:
                lay = lay.copy()
                lay.putalpha(lay.getchannel("A").point(lambda v: int(v * a)))
            # bottom edge at y=1500: clear of Shorts/Reels caption + button UI; slightly left of centre (right rail)
            frame.alpha_composite(lay, (int(510 - lay.width / 2), int(1500 - lay.height + dy)))


# ---------------------------------------------------------------- frame
def scene_index(t):
    idx = 0
    for i, sc in enumerate(SCENES):
        if t >= sc["start"]:
            idx = i
    return idx


def render_frame(fi):
    t = fi / FPS
    i = scene_index(t)
    img = None
    # transition into scene i (or i+1) in progress?
    for j in (i, i + 1):
        if 0 < j < len(SCENES):
            tr = SCENES[j]["transition"]
            if tr["type"] == "tear":
                t0 = SCENES[j]["start"] - tr["dur"] / 2
                if t0 <= t < t0 + tr["dur"]:
                    img = tear(render_scene(j - 1, t), render_scene(j, t), j, (t - t0) / tr["dur"])
    if img is None:
        img = render_scene(i, t)
    frame = img.convert("RGBA")
    draw_subtitles(frame, t)
    tex, grains = finish_maps()
    arr = np.asarray(frame.convert("RGB"), np.float32) * tex + grains[fi % len(grains)]
    return np.clip(arr, 0, 255).astype(np.uint8)


def frame_bytes(fi):
    return render_frame(fi).tobytes()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--stills", nargs="*", type=float)
    ap.add_argument("--sheet", action="store_true")
    ap.add_argument("--out", default=os.path.join(OUT_DIR, "ai_agents_explainer_1080x1920_30fps.mp4"))
    ap.add_argument("--audio", default=None, help="optional voiceover/mix wav to mux instead of silence")
    ap.add_argument("--workers", type=int, default=os.cpu_count())
    args = ap.parse_args()

    if args.stills is not None:
        os.makedirs(os.path.join(OUT_DIR, "stills"), exist_ok=True)
        for s in args.stills:
            p = os.path.join(OUT_DIR, "stills", f"t{s:05.2f}.png")
            Image.fromarray(render_frame(int(round(s * FPS)))).save(p)
            print(p)
        return
    if args.sheet:
        times = [0.4, 1.2, 1.9, 3.5, 7.5, 10.5, 12.0, 16.5, 19.0, 23.0, 25.3, 29.5,
                 31.5, 35.0, 41.0, 49.0, 52.6, 57.5]
        th = [Image.fromarray(render_frame(int(s * FPS))).resize((270, 480), Image.LANCZOS) for s in times]
        sheet = Image.new("RGB", (270 * 6, 480 * 3), NAVY)
        for k, im in enumerate(th):
            sheet.paste(im, ((k % 6) * 270, (k // 6) * 480))
        p = os.path.join(OUT_DIR, "stills", "contact_sheet.jpg")
        sheet.save(p, quality=88)
        print(p)
        return

    n = int(DURATION * FPS)
    audio_in = (["-i", args.audio] if args.audio else
                ["-f", "lavfi", "-t", str(DURATION), "-i", "anullsrc=channel_layout=stereo:sample_rate=48000"])
    cmd = ["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}",
           "-r", str(FPS), "-i", "-", *audio_in,
           "-map", "0:v", "-map", "1:a", "-c:v", "libx264", "-preset", "slow", "-crf", "19", "-maxrate", "16M", "-bufsize", "32M",
           "-profile:v", "high", "-level", "4.1", "-pix_fmt", "yuv420p", "-r", str(FPS),
           "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-t", str(DURATION),
           "-movflags", "+faststart", args.out]
    ff = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    with Pool(args.workers) as pool:
        for k, b in enumerate(pool.imap(frame_bytes, range(n), chunksize=6)):
            ff.stdin.write(b)
            if k % 150 == 0:
                print(f"frame {k}/{n}", flush=True)
    ff.stdin.close()
    if ff.wait() != 0:
        sys.exit("ffmpeg failed")
    print("wrote", args.out)


if __name__ == "__main__":
    main()
