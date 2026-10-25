#!/usr/bin/env python3
"""Procedural score, sound design and final mix, all derived from timeline.py.

    python3 src/audio.py        # -> audio/music.wav, audio/sfx.wav, audio/vo.wav, audio/mix.wav

Everything here is synthesised from scratch (oscillators + filtered noise),
so the music and effects are original and royalty-free by construction.
Voiceover lines are read from audio/vo/cue_XX.wav (see src/voiceover.py) and
placed at their subtitle in-points; the music is side-chain ducked under them.
"""
import os
import sys
import wave

import numpy as np
from scipy.signal import butter, fftconvolve, sosfilt

sys.path.insert(0, os.path.dirname(__file__))
from timeline import CUES, DURATION, SCENES  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AUDIO = os.path.join(ROOT, "audio")
SR = 48000
N = int(DURATION * SR)
rng = np.random.default_rng(2026)


# ---------------------------------------------------------------- dsp helpers
def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], "bandpass", fs=SR, output="sos"), x)


def lp(x, fc, order=2):
    return sosfilt(butter(order, fc, "lowpass", fs=SR, output="sos"), x)


def hp(x, fc, order=2):
    return sosfilt(butter(order, fc, "highpass", fs=SR, output="sos"), x)


def noise(sec):
    return rng.standard_normal(int(sec * SR))


def tvec(sec):
    return np.arange(int(sec * SR)) / SR


def decay(sec, tau):
    return np.exp(-tvec(sec) / tau)


def adsr(sec, a=0.01, r=0.1):
    n = int(sec * SR)
    e = np.ones(n)
    na, nr = max(1, int(a * SR)), max(1, int(r * SR))
    e[:na] = np.linspace(0, 1, na)
    e[-nr:] *= np.linspace(1, 0, nr)
    return e


def add(buf, sig, t, gain=1.0, pan=0.0):
    """Mix mono `sig` into stereo `buf` at time t (equal-power pan, -1..1)."""
    i = int(t * SR)
    if i >= len(buf) or i + len(sig) <= 0:
        return
    s = sig[max(0, -i):]
    i = max(0, i)
    s = s[:len(buf) - i]
    ang = (pan + 1) * np.pi / 4
    buf[i:i + len(s), 0] += s * gain * np.cos(ang)
    buf[i:i + len(s), 1] += s * gain * np.sin(ang)


def db(x):
    return 10 ** (x / 20)


def reverb(buf, sec=1.8, wet=0.25):
    ir_n = int(sec * SR)
    out = buf.copy()
    for ch in range(2):
        ir = rng.standard_normal(ir_n) * np.exp(-np.arange(ir_n) / (sec * SR / 6.9))
        ir = lp(ir, 5000)
        ir[: int(0.012 * SR)] = 0  # pre-delay
        ir /= np.sqrt(np.sum(ir ** 2))
        out[:, ch] += wet * fftconvolve(buf[:, ch], ir)[: len(buf)]
    return out


def mtof(m):
    return 440.0 * 2 ** ((m - 69) / 12)


# ---------------------------------------------------------------- instruments
def kick(gain=1.0):
    t = tvec(0.45)
    f = 45 + 85 * np.exp(-t / 0.03)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.16)
    click = hp(noise(0.45), 3000) * np.exp(-t / 0.004) * 0.25
    return np.tanh(1.6 * (body + click)) * gain


def snare(gain=1.0):
    t = tvec(0.35)
    tone = np.sin(2 * np.pi * 190 * t) * np.exp(-t / 0.05) * 0.5
    nz = bp(noise(0.35), 1200, 7000) * np.exp(-t / 0.09)
    return (tone + nz) * gain


def clap(gain=1.0):
    t = tvec(0.3)
    env = np.zeros_like(t)
    for d in (0, 0.011, 0.022):
        env += (t >= d) * np.exp(-np.clip(t - d, 0, None) / (0.006 if d < 0.02 else 0.08))
    return bp(noise(0.3), 900, 5000) * env * gain


def hat(gain=1.0, open_=False):
    t = tvec(0.25)
    return hp(noise(0.25), 7500) * np.exp(-t / (0.09 if open_ else 0.025)) * gain


def bass(m, sec, gain=1.0):
    t = tvec(sec)
    f = mtof(m)
    s = np.sin(2 * np.pi * f * t) + 0.25 * np.sin(4 * np.pi * f * t)
    return np.tanh(1.3 * s) * adsr(sec, 0.008, 0.08) * gain


def pad(notes, sec, bright=0.6, gain=1.0):
    t = tvec(sec)
    out = np.zeros_like(t)
    for m in notes:
        for det in (-0.07, 0.07):
            f = mtof(m + det)
            for h in range(1, 7):
                out += (1 / h ** (2.2 - bright)) * np.sin(2 * np.pi * f * h * t + rng.uniform(0, 6.28))
    out = lp(out, 900 + 2600 * bright)
    return out / (len(notes) * 4) * adsr(sec, 0.45, 0.7) * gain


def keys(m, sec=0.9, gain=1.0):
    t = tvec(sec)
    f = mtof(m)
    s = np.sin(2 * np.pi * f * t) * np.exp(-t / 0.6) + 0.35 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t / 0.12)
    s *= 1 + 0.15 * np.sin(2 * np.pi * 5 * t)  # tremolo
    return s * adsr(sec, 0.004, 0.2) * gain


# ---------------------------------------------------------------- score
BPM = 120
BEAT = 60 / BPM
BAR = 4 * BEAT
CH = {  # (bass midi, voicing)
    "Dm9": (38, [65, 69, 72, 76]), "Bbmaj9": (46, [62, 65, 69, 72]), "Gm9": (43, [58, 62, 65, 69]),
    "A7": (45, [61, 64, 67, 71]), "Asus": (45, [62, 64, 67, 69]), "C69": (48, [64, 67, 69, 74]),
    "Fmaj9": (41, [57, 60, 64, 67]),
}
# section: (start, end, progression, drums, energy)
SECTIONS = [
    (0.0, 6.0, ["Dm9", "Bbmaj9"], "full", 0.8),
    (6.0, 12.0, ["Dm9", "Bbmaj9", "Gm9"], "full", 1.0),
    (12.0, 25.0, ["Dm9", "Bbmaj9", "Gm9", "Asus"], "half", 0.6),
    (25.0, 31.5, ["Asus", "A7"], "tension", 0.55),
    (31.5, 38.0, ["Gm9", "Dm9"], "sparse", 0.35),
    (38.0, 45.0, ["Bbmaj9", "C69", "Dm9", "Fmaj9"], "half", 0.75),
    (45.0, 51.5, ["Bbmaj9", "C69", "Dm9", "Dm9"], "full", 1.0),
    (53.4, 60.0, ["Dm9"], "outro", 0.4),
]


def compose():
    dry = np.zeros((N, 2))   # drums + bass
    wetb = np.zeros((N, 2))  # pads / keys -> reverb
    for s0, s1, prog, drums, en in SECTIONS:
        # chords: one per bar, aligned to the section start
        nb = int(np.ceil((s1 - s0) / BAR))
        for b in range(nb):
            t0 = s0 + b * BAR
            ln = min(BAR, s1 - t0)
            root, voicing = CH[prog[b % len(prog)]]
            add(wetb, pad(voicing, ln + 0.6, bright=0.25 + 0.5 * en, gain=0.55), t0, pan=0)
            if drums == "outro":
                add(dry, bass(root - 12 + 12, ln, 0.35), t0)
                continue
            if drums in ("full", "half"):
                for k, off in enumerate((0, 1.5, 2.5) if drums == "full" else (0, 2.75)):
                    if t0 + off * BEAT < s1:
                        add(dry, bass(root, BEAT * (1.4 if k == 0 else 0.8), 0.55 * en + 0.15), t0 + off * BEAT)
                if drums == "full" or b % 2 == 0:
                    for off, m in zip((0.5, 1.5, 2.5, 3.5), voicing[::-1]):
                        if t0 + off * BEAT < s1:
                            add(wetb, keys(m, 0.8, 0.10 * en), t0 + off * BEAT, pan=rng.uniform(-0.4, 0.4))
            elif drums == "tension":
                for e8 in range(8):
                    if t0 + e8 * BEAT / 2 < s1:
                        add(dry, bass(root, BEAT * 0.4, 0.42), t0 + e8 * BEAT / 2)
            elif drums == "sparse":
                add(dry, bass(root, BAR * 0.9, 0.3), t0)
        # drums on a 16th grid
        steps = int((s1 - s0) / (BEAT / 4))
        for st in range(steps):
            tt = s0 + st * BEAT / 4
            pos = st % 16
            swing = (BEAT / 4) * 0.14 if st % 2 else 0
            if drums == "full":
                if pos in (0, 6, 8, 11):
                    add(dry, kick(0.9), tt)
                if pos in (4, 12):
                    add(wetb, clap(0.42 * en), tt)
                    add(dry, snare(0.35 * en), tt)
                if pos % 2 == 0 or en > 0.9:
                    add(dry, hat(0.16 * (1.0 if pos % 4 == 2 else 0.6), open_=pos == 14), tt + swing, pan=0.3)
            elif drums == "half":
                if pos in (0, 10):
                    add(dry, kick(0.8), tt)
                if pos == 8:
                    add(wetb, snare(0.35 * en), tt)
                if pos % 2 == 0:
                    add(dry, hat(0.10 * (1.0 if pos % 4 == 2 else 0.55)), tt + swing, pan=0.3)
            elif drums == "tension":
                add(dry, hat(0.07 * (1.0 if pos % 4 == 0 else 0.5)), tt + swing, pan=0.35)
                if pos == 0 and (st // 16) % 2 == 0:
                    add(dry, kick(0.55), tt)
            elif drums == "sparse":
                if pos in (0, 3):
                    add(dry, kick(0.45 if pos == 0 else 0.25), tt)
            elif drums == "outro":
                if pos == 0:
                    add(dry, kick(0.35), tt)
    # snare roll into the pause
    for k in range(16):
        tt = 50.5 + k * (1.0 / 16)
        add(wetb, snare(0.08 + 0.25 * k / 15), tt)
    mus = dry + reverb(wetb, 2.2, 0.35) + wetb * 0.7
    # vinyl / paper texture bed
    crackle = np.zeros(N)
    idx = rng.integers(0, N, int(DURATION * 9))
    crackle[idx] = rng.uniform(-1, 1, len(idx))
    crackle = hp(crackle, 1500) * 0.5 + lp(rng.standard_normal(N), 400) * 0.01
    mus[:, 0] += crackle * 0.05
    mus[:, 1] += np.roll(crackle, 211) * 0.05
    # the visual pause: everything falls away 51.5 -> 53.4
    g = np.ones(N)
    a, b, c = int(51.45 * SR), int(51.75 * SR), int(53.4 * SR)
    g[a:b] = np.linspace(1, 0, b - a)
    g[b:c] = 0
    g[-int(2.0 * SR):] *= np.linspace(1, 0, int(2.0 * SR)) ** 1.5
    mus *= g[:, None]
    return mus / np.max(np.abs(mus)) * db(-6)


# ---------------------------------------------------------------- sound design
def paper_tear(sec=0.55):
    t = tvec(sec)
    imp = np.zeros(len(t))
    dens = np.sin(np.pi * t / sec) ** 0.7
    hits = rng.random(len(t)) < dens * 0.02
    imp[hits] = rng.uniform(0.3, 1, hits.sum())
    grit = fftconvolve(imp, np.exp(-np.arange(int(0.003 * SR)) / (0.0008 * SR)))[: len(t)]
    body = bp(noise(sec), 700, 6500) * dens * (0.4 + grit)
    low = bp(noise(sec), 180, 700) * dens * 0.3
    return np.tanh(body + low) * adsr(sec, 0.02, 0.12)


def whoosh(sec=0.4):
    t = tvec(sec)
    x = noise(sec)
    fc = 300 + 5000 * (t / sec) ** 2
    y, s, out = 0.0, 0.0, np.zeros(len(t))
    a = 1 - np.exp(-2 * np.pi * fc / SR)
    for i in range(len(t)):  # time-varying one-pole lowpass
        y += a[i] * (x[i] - y)
        out[i] = y
    return out * (t / sec) ** 1.5 / 0.4


def impact(gain=1.0):
    t = tvec(1.2)
    f = 38 + 60 * np.exp(-t / 0.05)
    boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.35)
    crack = bp(noise(1.2), 500, 6000) * np.exp(-t / 0.02) * 0.6
    return np.tanh(1.4 * (boom + crack)) * gain


def stamp(gain=1.0):
    t = tvec(0.25)
    f = 55 + 60 * np.exp(-t / 0.015)
    thump = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.06)
    slap = bp(noise(0.25), 900, 5500) * np.exp(-t / 0.012) * 0.7
    return (thump + slap) * gain


def swish(sec=0.35):
    t = tvec(sec)
    return bp(noise(sec), 2500, 9000) * np.sin(np.pi * t / sec) ** 2


def marker(sec):
    t = tvec(sec)
    mod = (0.5 + 0.5 * np.sin(2 * np.pi * 6.5 * t + 2 * np.sin(2 * np.pi * 1.3 * t))) ** 2
    return bp(noise(sec), 1800, 6500) * mod * adsr(sec, 0.03, 0.06)


def tick():
    t = tvec(0.02)
    return np.sin(2 * np.pi * 3200 * t) * np.exp(-t / 0.003)


def pop():
    t = tvec(0.08)
    return np.sin(2 * np.pi * (900 + 600 * np.exp(-t / 0.01)) * t) * np.exp(-t / 0.02)


def design():
    from render import EASE, clamp  # reuse the exact animation curves
    sfx = np.zeros((N, 2))
    for i, sc in enumerate(SCENES):
        st = sc["start"]
        tr = sc["transition"]
        if tr and tr["type"] == "tear":
            pan = {"left": 0.5, "up": 0.0, "down": 0.0}.get(tr["dir"], 0.3)
            add(sfx, paper_tear(tr["dur"] + 0.1), st - tr["dur"] / 2, db(-15), pan)
        elif tr and tr["type"] == "cut":
            add(sfx, whoosh(0.35), st - 0.35, db(-20))
            add(sfx, impact(), st, db(-14 if i == 4 else -19))
        for el in sc["elements"]:
            t_in = st + el["t_in"]
            if el["kind"] == "label":
                add(sfx, pop(), t_in, db(-27), 0.2)
            elif el.get("anim") == "stamp":
                big = el["kind"] == "strip"
                add(sfx, stamp(), t_in + 0.02, db(-17 if big else -21), rng.uniform(-0.2, 0.2))
            else:
                add(sfx, swish(), t_in, db(-29), -0.2)
            if el["kind"] == "counter":  # ticks follow the on-screen count
                last = el["n0"]
                for k in range(int((el["t1"] - el["t0"]) * 60)):
                    tl = el["t0"] + k / 60
                    n = int(round(el["n0"] + (el["n1"] - el["n0"]) * EASE["inCubic"](clamp((tl - el["t0"]) / (el["t1"] - el["t0"])))))
                    if n // 4 != last // 4:
                        add(sfx, tick(), st + tl, db(-30), 0.3)
                    last = n
        for s in sc["strokes"]:
            add(sfx, marker(s["dur"]), st + s["t0"], db(-28), 0.15)
    # final "JOB?" lands harder
    add(sfx, impact(), SCENES[-1]["start"] + SCENES[-1]["elements"][-1]["t_in"], db(-18))
    return sfx


# ---------------------------------------------------------------- voiceover + mix
def read_wav(path):
    with wave.open(path) as w:
        sr, ch, sw = w.getframerate(), w.getnchannels(), w.getsampwidth()
        x = np.frombuffer(w.readframes(w.getnframes()), {2: np.int16, 4: np.int32}[sw]).astype(np.float64)
        x /= 2 ** (8 * sw - 1)
    if ch > 1:
        x = x.reshape(-1, ch).mean(1)
    if sr != SR:
        x = np.interp(np.arange(int(len(x) * SR / sr)) * sr / SR, np.arange(len(x)), x)
    return x


def voiceover():
    vo = np.zeros((N, 2))
    found = 0
    for k, (t0, t1, _) in enumerate(CUES, 1):
        p = os.path.join(AUDIO, "vo", f"cue_{k:02d}.wav")
        if not os.path.exists(p):
            continue
        x = read_wav(p)
        x = hp(x, 80)
        x = x / (np.max(np.abs(x)) + 1e-9) * db(-3)
        add(vo, x, t0, 1.0)
        found += 1
    return vo, found


def write_wav(path, x):
    x = np.clip(x, -1, 1)
    with wave.open(path, "w") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((x * 32767).astype("<i2").tobytes())


def main():
    music = compose()
    sfx = design()
    vo, found = voiceover()
    # side-chain duck: smoothed VO envelope pulls the music down ~9 dB under speech
    env = np.abs(vo).mean(1)
    win = int(0.25 * SR)
    env = np.convolve(env, np.ones(win) / win, "same")
    env = np.clip(env / (env.max() + 1e-9) * 3, 0, 1)
    duck = 1 - (1 - db(-9)) * env
    mix = music * db(-7) * duck[:, None] + sfx * db(-2) + vo
    mix /= max(1.0, np.max(np.abs(mix)) / db(-1))
    for name, x in (("music", music), ("sfx", sfx), ("vo", vo), ("mix", mix)):
        write_wav(os.path.join(AUDIO, f"{name}.wav"), x)
    print(f"music/sfx/vo/mix written; {found}/{len(CUES)} VO lines placed")


if __name__ == "__main__":
    main()
