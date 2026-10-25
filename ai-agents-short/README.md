# AI Agents Explainer: 60 s vertical short

A 1080 × 1920, 30 fps, H.264 video for YouTube Shorts and Instagram Reels. It uses an underground editorial collage style built from the nine supplied images, in the order they were supplied (1 → 9).

## Folder layout

```
assets/images/   the 9 supplied images, renamed in narrative order (01_… → 09_…)
assets/fonts/    Anton (headlines), Oswald (labels), Inter (captions); all SIL OFL, see OFL-LICENSES.txt
src/timeline.py  the single source of truth: scenes, camera moves, on-screen text, strokes, transitions, captions
src/render.py    the frame renderer (Pillow + NumPy). It pipes frames to ffmpeg/libx264
src/export_timing.py  writes the timing/ and audio/ files from timeline.py
timing/          timeline.json, subtitles.srt, voiceover_script.md
audio/           vo_placeholder_guide.wav (timed placeholder track, see "Audio" below)
output/          the final MP4, plus stills/ for review frames and a contact sheet
```

## Edit structure

| # | Time | Beat | Image | Transition in | Motion |
|---|------|------|-------|---------------|--------|
| 1 | 0.0 – 6.0 | Your job is done while you sleep | 01 | none | Hook: 3 fast punch-in cuts (inbox, face, lamp), then a pull-back to the full frame. Words stamp in one at a time |
| 2 | 6.0 – 12.0 | Work tasks are multiplying | 02 | hard cut + punch | Task stamps, then a "TO-DO LIST" counter that accelerates from 12 to 148 |
| 3 | 12.0 – 19.0 | Meet the AI agent | 03 | torn-paper reveal from the bottom | Calmer pacing. Numbered labels are pinned to the envelope, calendar and document and track the camera |
| 4 | 19.0 – 25.0 | Before AI: paperwork overload | 04 | torn-paper reveal from the right | Slow tilt up the paper tower. A marker circle is drawn around the person |
| 5 | 25.0 – 31.5 | The catch: AI can make mistakes | 05 | hard cut + punch (emphasis) | A marker loop around the broken pie slice and an underline |
| 6 | 31.5 – 38.0 | Will AI take your job? | 06 | diagonal torn reveal | The question lands one word at a time |
| 7 | 38.0 – 45.0 | Humans still bring judgment & creativity | 07 | torn-paper reveal from the bottom | A marker arrow points to the photo in the hand |
| 8 | 45.0 – 51.8 | Learn. Adapt. Create. | 08 | torn-paper reveal from the right | Tilt up the stairs. Three stamps and an arrow toward the climber |
| 9 | 51.8 – 60.0 | Would you trust AI with your job? | 09 | torn reveal from the top | **1.6 s visual pause** (empty bubble, no captions), then the question stamps into the bubble |

The complete frame-accurate timing is in `timing/timeline.json`.

**Finishing layers applied to every frame:** monochrome film grain (8-frame cycle), a vignette with low-frequency paper mottling, a navy top gradient behind the headlines, a halftone fade on the coloured paper strips, and torn white fibre rims on the strips and on the transition edges.

**Safe zones:** headlines sit at y ≥ 110 and x ≤ ~960. Captions sit on a navy box (about 89% opacity) with their bottom edge at y = 1500. They are offset 30 px left of centre to keep clear of the Shorts and Reels caption block and the right-hand button rail.

## Rebuild

Requirements: Python 3.10+, Pillow, NumPy and ffmpeg with libx264.

```bash
python3 src/export_timing.py          # timing/*.json|srt|md + audio/vo_placeholder_guide.wav
python3 src/render.py --sheet         # quick contact sheet -> output/stills/contact_sheet.jpg
python3 src/render.py --stills 12.0 53.5   # individual review frames
python3 src/render.py                 # full export -> output/ai_agents_explainer_1080x1920_30fps.mp4
```

The full render takes about 2 to 4 minutes on 4 cores. Export settings: libx264, preset slow, CRF 19 capped at 16 Mbps (maxrate 16M, bufsize 32M), High profile, level 4.1, yuv420p, 30 fps CFR, `+faststart`, with an AAC 48 kHz stereo track.

To change copy or timing, edit `src/timeline.py` and re-run both scripts. The captions, SRT, VO script and placeholder track all regenerate from that file.

## Audio: what is and isn't included

- **No voiceover was supplied.** The MP4 contains a **silent** stereo AAC track, so the platforms accept it and you can add audio in their editors. The captions carry the full script.
- `audio/vo_placeholder_guide.wav` is the **timed placeholder track**. It has a soft 1 kHz tick at every line in-point and a lower 440 Hz tick at every scene cut. Use it as a click guide when recording. It is not meant to be published.
- `timing/voiceover_script.md` has every line with its in and out timecodes. 51.5 to 53.4 s is intentionally silent.
- **No music or sound-effect assets were supplied**, so none were added. The brief asks for them only if assets are available, and none were generated.

To add a recorded voiceover or final mix (48 kHz WAV, 60 s), run:

```bash
python3 src/render.py --audio path/to/mix.wav
# or remux without re-rendering:
ffmpeg -i output/ai_agents_explainer_1080x1920_30fps.mp4 -i mix.wav -map 0:v -map 1:a \
       -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart output/final_with_vo.mp4
```

Upload `timing/subtitles.srt` as closed captions only if you remove the burned-in captions. Otherwise viewers see the captions twice.
