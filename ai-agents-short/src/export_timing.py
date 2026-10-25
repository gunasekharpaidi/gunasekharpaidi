#!/usr/bin/env python3
"""Export timing artefacts from timeline.py:

    timing/timeline.json         scenes, transitions, on-screen text, cues
    timing/subtitles.srt         burned-in captions as a sidecar (for platform CC)
    timing/voiceover_script.md   read-along VO script with timecodes
    audio/vo_placeholder_guide.wav  timed placeholder track (soft cue ticks)
"""
import json
import math
import os
import struct
import sys
import wave

sys.path.insert(0, os.path.dirname(__file__))
from timeline import CUES, DURATION, FPS, SCENES  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def plain(text):
    return text.replace("*", "")


def tc(t, sep=","):
    ms = int(round(t * 1000))
    return f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d}{sep}{ms % 1000:03d}"


def main():
    os.makedirs(os.path.join(ROOT, "timing"), exist_ok=True)
    os.makedirs(os.path.join(ROOT, "audio"), exist_ok=True)

    scenes = []
    for i, sc in enumerate(SCENES):
        end = SCENES[i + 1]["start"] if i + 1 < len(SCENES) else DURATION
        scenes.append(dict(
            index=i + 1, beat=sc["name"], image=f"assets/images/{sc['image']}",
            start=sc["start"], end=end, frames=[round(sc["start"] * FPS), round(end * FPS) - 1],
            transition_in=sc["transition"],
            on_screen_text=[dict(text=e.get("text", e.get("label")), appears_at=round(sc["start"] + e["t_in"], 2))
                            for e in sc["elements"]],
        ))
    cues = [dict(start=a, end=b, text=plain(t)) for a, b, t in CUES]
    with open(os.path.join(ROOT, "timing", "timeline.json"), "w") as f:
        json.dump(dict(width=1080, height=1920, fps=FPS, duration=DURATION, scenes=scenes, subtitles=cues),
                  f, indent=2, ensure_ascii=False)

    with open(os.path.join(ROOT, "timing", "subtitles.srt"), "w") as f:
        for k, (a, b, t) in enumerate(CUES, 1):
            f.write(f"{k}\n{tc(a)} --> {tc(b)}\n{plain(t)}\n\n")

    with open(os.path.join(ROOT, "timing", "voiceover_script.md"), "w") as f:
        f.write("# Voiceover script — AI Agents explainer (60 s)\n\n"
                "Placeholder read. Record to these timecodes; each line must finish before its out-point.\n"
                "51.5–53.4 s is a deliberate silence (visual pause before the final question).\n\n"
                "| In | Out | Beat | Line |\n|---|---|---|---|\n")
        for a, b, t in CUES:
            beat = max((s for s in scenes if s["start"] <= a), key=lambda s: s["start"])["index"]
            f.write(f"| {a:05.2f} | {b:05.2f} | {beat} | {plain(t)} |\n")

    # Placeholder guide: a soft 1 kHz tick at every cue in-point, a lower tick at scene starts.
    sr = 48000
    n = int(DURATION * sr)
    buf = [0.0] * n

    def tick(t, freq, amp, dur=0.06):
        s0 = int(t * sr)
        for k in range(int(dur * sr)):
            if s0 + k < n:
                env = math.sin(math.pi * k / (dur * sr))
                buf[s0 + k] += amp * env * math.sin(2 * math.pi * freq * k / sr)

    for a, _, _ in CUES:
        tick(a, 1000, 0.12)
    for sc in SCENES:
        tick(sc["start"], 440, 0.10, 0.09)
    with wave.open(os.path.join(ROOT, "audio", "vo_placeholder_guide.wav"), "w") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(sr)
        w.writeframes(b"".join(struct.pack("<h", int(max(-1, min(1, v)) * 32767)) for v in buf))
    print("timing + placeholder audio written")


if __name__ == "__main__":
    main()
