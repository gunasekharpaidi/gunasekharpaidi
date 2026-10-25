"""Single source of truth for the edit: scenes, camera moves, on-screen text,
marker strokes, transitions and subtitle cues.

Times inside a scene are LOCAL seconds (0 = the scene's start, i.e. the
midpoint of the transition into it). Subtitle cues use GLOBAL seconds.
Image-space points are pixel coordinates in the 941x1672 source images.
"""

W, H, FPS, DURATION = 1080, 1920, 30, 60.0

# Palette
NAVY = (11, 16, 38)
OFF = (242, 236, 224)
YELLOW = (246, 228, 0)
COBALT = (30, 62, 245)

ANTON = "Anton-Regular.woff"
OSWALD = "Oswald-Bold.woff"
INTER = "Inter-Bold.otf"


def T(text, x, y, t_in, size=120, color=OFF, font=ANTON, anim="slide", rot=0.0, t_out=None):
    """Plain headline text (shadowed)."""
    return dict(kind="text", text=text, x=x, y=y, t_in=t_in, t_out=t_out, size=size,
                fg=color, font=font, anim=anim, rot=rot)


def S(text, x, y, t_in, size=120, fg=NAVY, bg=YELLOW, font=ANTON, anim="slide", rot=-1.5,
      t_out=None, seed=1, pad=(26, 14)):
    """Text on a torn paper strip."""
    return dict(kind="strip", text=text, x=x, y=y, t_in=t_in, t_out=t_out, size=size, fg=fg,
                bg=bg, font=font, anim=anim, rot=rot, seed=seed, pad=pad)


def L(text, u, v, t_in, size=34, t_out=None):
    """Small navy label pinned to an image-space point (center-top), follows the camera."""
    return dict(kind="label", text=text, u=u, v=v, t_in=t_in, t_out=t_out, size=size, anim="pop")


def ellipse(cx, cy, rx, ry, turns=1.12, start=-100, n=40):
    import math
    pts = []
    for i in range(n + 1):
        a = math.radians(start) + 2 * math.pi * turns * i / n
        k = 1 + 0.06 * (i / n)  # second lap slightly wider, like a hand-drawn loop
        pts.append((cx + rx * k * math.cos(a), cy + ry * k * math.sin(a)))
    return pts


def M(points, t0, dur, color=YELLOW, width=11, space="img", arrow=False):
    """Animated marker stroke."""
    return dict(points=points, t0=t0, dur=dur, color=color, width=width, space=space, arrow=arrow)


# Camera keyframe segments: (t0, t1, (zoom, cx, cy), (zoom, cx, cy), ease)
# zoom 1.0 = full image (cover-fit); cx, cy are normalised image centre coords.
SCENES = [
    dict(  # 1 — HOOK: fast cuts
        name="Your job is done while you sleep", image="01_sleep_hook.png", start=0.0,
        transition=None, drift=-4,
        camera=[
            (0.00, 0.80, (1.95, 0.64, 0.38), (1.72, 0.64, 0.38), "outCubic"),   # inbox/calendar
            (0.80, 1.55, (1.98, 0.62, 0.65), (1.76, 0.62, 0.66), "outCubic"),   # face
            (1.55, 2.20, (1.95, 0.90, 0.64), (1.74, 0.89, 0.66), "outCubic"),   # lamp + mug
            (2.20, 2.55, (1.20, 0.50, 0.52), (1.09, 0.50, 0.52), "outCubic"),   # full frame
            (2.55, 6.40, (1.09, 0.50, 0.52), (1.02, 0.50, 0.53), "inOutSine"),
        ],
        elements=[
            T("YOUR JOB", 78, 140, 0.04, size=124, anim="stamp"),
            S("IS DONE", 70, 286, 0.80, size=118, anim="stamp", rot=-2.0, seed=11),
            T("WHILE YOU", 78, 440, 1.55, size=124, anim="stamp"),
            S("SLEEP.", 70, 586, 2.20, size=118, fg=OFF, bg=COBALT, anim="stamp", rot=1.5, seed=12),
        ],
        strokes=[],
    ),
    dict(  # 2 — tasks multiplying
        name="Work tasks are multiplying", image="02_desk_tasks.png", start=6.0,
        transition=dict(type="cut", dur=0.0), drift=-6,
        camera=[
            (0.00, 0.35, (1.16, 0.45, 0.58), (1.08, 0.45, 0.58), "outCubic"),
            (0.35, 6.40, (1.08, 0.45, 0.58), (1.00, 0.50, 0.55), "inOutSine"),
        ],
        elements=[
            T("WORK TASKS ARE", 78, 136, 0.05, size=104, anim="stamp"),
            S("MULTIPLYING.", 70, 268, 0.30, size=116, anim="stamp", rot=-1.8, seed=21),
            S("EMAILS", 84, 470, 0.15, size=44, font=OSWALD, bg=OFF, anim="stamp", rot=-3, t_out=2.85, seed=22, pad=(18, 8)),
            S("MEETINGS", 84, 548, 0.60, size=44, font=OSWALD, bg=OFF, anim="stamp", rot=2, t_out=2.85, seed=23, pad=(18, 8)),
            S("REPORTS", 84, 626, 1.05, size=44, font=OSWALD, bg=OFF, anim="stamp", rot=-2, t_out=2.85, seed=24, pad=(18, 8)),
            S("FOLLOW-UPS", 84, 704, 1.50, size=44, font=OSWALD, bg=OFF, anim="stamp", rot=1.5, t_out=2.85, seed=25, pad=(18, 8)),
            dict(kind="counter", label="TO-DO LIST: {n}", n0=12, n1=148, t0=3.0, t1=5.6, x=78, y=478,
                 size=64, t_in=3.0, t_out=None, anim="stamp", rot=-2.0, seed=26),
        ],
        strokes=[],
    ),
    dict(  # 3 — meet the agent (calmer)
        name="Meet the AI agent", image="03_ai_agent_loop.png", start=12.0,
        transition=dict(type="tear", dir="up", dur=0.55, slide=150), drift=-5,
        camera=[(0.0, 7.4, (1.06, 0.52, 0.47), (1.00, 0.50, 0.50), "inOutSine")],
        elements=[
            T("MEET THE", 78, 128, 0.35, size=110),
            S("AI AGENT.", 70, 262, 0.75, size=124, fg=OFF, bg=COBALT, rot=-1.5, seed=31),
            L("01  READS YOUR INBOX", 250 / 941, 838 / 1672, 1.7),
            L("02  BOOKS THE MEETING", 735 / 941, 683 / 1672, 2.7),
            L("03  WRITES THE REPORT", 600 / 941, 1088 / 1672, 3.7),
        ],
        strokes=[
            M([(150, 548), (205, 565), (222, 612)], 4.6, 0.55, color=YELLOW, width=10, space="canvas", arrow=False),
        ],
    ),
    dict(  # 4 — before AI
        name="Before AI: paperwork overload", image="04_paper_tower.png", start=19.0,
        transition=dict(type="tear", dir="left", dur=0.55, slide=160), drift=-4,
        camera=[(0.0, 6.4, (1.16, 0.55, 0.64), (1.06, 0.53, 0.48), "inOutSine")],
        elements=[
            T("BEFORE AI:", 82, 132, 0.35, size=60, color=YELLOW, font=OSWALD),
            T("PAPERWORK", 78, 222, 0.6, size=128),
            S("OVERLOAD.", 70, 372, 0.95, size=124, rot=-2.2, seed=41),
        ],
        strokes=[M(ellipse(372, 1085, 120, 128), 2.9, 0.9, color=YELLOW, width=10)],
    ),
    dict(  # 5 — the catch (hard cut for emphasis)
        name="The catch: AI can make mistakes", image="05_warning_mistakes.png", start=25.0,
        transition=dict(type="cut", dur=0.0), drift=-4,
        camera=[
            (0.00, 0.40, (1.13, 0.48, 0.55), (1.05, 0.48, 0.55), "outCubic"),
            (0.40, 6.9, (1.05, 0.48, 0.55), (1.00, 0.50, 0.54), "inOutSine"),
        ],
        elements=[
            T("THE CATCH:", 82, 112, 0.10, size=60, color=YELLOW, font=OSWALD, anim="stamp"),
            T("AI CAN MAKE", 78, 196, 0.35, size=120, anim="stamp"),
            S("MISTAKES.", 70, 340, 0.70, size=134, rot=-2.0, seed=51, anim="stamp"),
        ],
        strokes=[
            M(ellipse(722, 958, 118, 92, turns=1.15, start=200), 2.6, 0.85, color=YELLOW, width=11),
            M([(96, 530), (300, 541), (520, 528)], 3.7, 0.45, color=COBALT, width=12, space="canvas"),
        ],
    ),
    dict(  # 6 — will AI take your job?
        name="Will AI take your job?", image="06_question_job.png", start=31.5,
        transition=dict(type="tear", dir="diag", dur=0.6, slide=140), drift=-3,
        camera=[(0.0, 6.9, (1.00, 0.50, 0.50), (1.045, 0.50, 0.56), "inOutSine")],
        elements=[
            T("WILL", 92, 470, 0.45, size=118),
            T("AI TAKE", 92, 600, 0.85, size=118),
            T("YOUR", 92, 730, 1.25, size=118),
            S("JOB?", 84, 862, 1.70, size=128, rot=-3.0, seed=61, anim="stamp"),
        ],
        strokes=[],
    ),
    dict(  # 7 — humans still bring judgment & creativity
        name="Humans still bring judgment and creativity", image="07_human_creativity.png", start=38.0,
        transition=dict(type="tear", dir="up", dur=0.55, slide=150), drift=-5,
        camera=[(0.0, 7.4, (1.07, 0.47, 0.60), (1.00, 0.50, 0.55), "inOutSine")],
        elements=[
            T("HUMANS STILL BRING", 84, 140, 0.35, size=58, font=OSWALD, color=YELLOW),
            T("JUDGMENT", 78, 222, 0.75, size=136),
            S("+ CREATIVITY.", 70, 378, 1.25, size=110, rot=-1.8, seed=71),
        ],
        strokes=[M([(700, 548), (790, 640), (770, 760), (700, 860)], 3.0, 0.6, color=YELLOW, width=11,
                   space="canvas", arrow=True)],
    ),
    dict(  # 8 — learn. adapt. create.
        name="Learn. Adapt. Create.", image="08_learn_adapt_create.png", start=45.0,
        transition=dict(type="tear", dir="left", dur=0.55, slide=160), drift=-6,
        camera=[(0.0, 7.2, (1.12, 0.52, 0.60), (1.04, 0.50, 0.44), "inOutSine")],
        elements=[
            T("LEARN.", 80, 250, 0.45, size=150, anim="stamp"),
            T("ADAPT.", 80, 420, 1.25, size=150, anim="stamp"),
            S("CREATE.", 70, 594, 2.05, size=150, rot=-2.0, seed=81, anim="stamp"),
        ],
        strokes=[M([(120, 880), (290, 930), (450, 860), (520, 760)], 3.0, 0.65, color=YELLOW, width=11,
                   space="canvas", arrow=True)],
    ),
    dict(  # 9 — strong pause, then the question
        name="Would you trust AI with your job?", image="09_final_bubble.png", start=51.8,
        transition=dict(type="tear", dir="down", dur=0.6, slide=120), drift=0,
        camera=[(0.0, 8.4, (1.00, 0.50, 0.46), (1.025, 0.50, 0.46), "inOutSine")],
        elements=[  # nothing until 1.6 s: the visual pause
            T("WOULD YOU", 540, 490, 1.60, size=112, color=NAVY, anim="stamp", rot=-1.5),
            T("TRUST AI", 540, 618, 2.00, size=150, color=NAVY, anim="stamp", rot=-1.5),
            T("WITH YOUR", 540, 786, 2.40, size=112, color=NAVY, anim="stamp", rot=-1.5),
            S("JOB?", 540, 918, 2.85, size=150, fg=OFF, bg=COBALT, anim="stamp", rot=-3.5, seed=91),
        ],
        center_x=True,
        strokes=[],
    ),
]

# Subtitles / placeholder voiceover. *asterisks* = acid-yellow emphasis.
CUES = [
    (0.15, 2.85, "What if your work got done… *while you slept?*"),
    (2.95, 5.85, "That's the promise of *AI agents.*"),
    (6.10, 8.90, "Emails. Meetings. Reports. Follow-ups."),
    (9.00, 11.70, "Every week, the to-do list *multiplies.*"),
    (12.35, 15.40, "An AI agent doesn't just answer questions."),
    (15.50, 18.75, "It *plans, acts* and follows through — on its own."),
    (19.30, 22.00, "Before AI, every task landed on one desk."),
    (22.10, 24.80, "*Yours.* Hours of copying, filing and chasing."),
    (25.15, 28.20, "But here's the catch: AI agents *make mistakes.*"),
    (28.30, 31.20, "Wrong numbers, confident tone. *Always check the work.*"),
    (31.85, 34.60, "So… will AI *take your job?*"),
    (34.70, 37.75, "It will take *tasks.* That's not the same thing."),
    (38.30, 41.40, "AI can draft. But *judgment, taste and creativity*"),
    (41.50, 44.75, "still come from people. *From you.*"),
    (45.30, 48.40, "The people who thrive will *learn* the tools,"),
    (48.50, 51.50, "*adapt* fast, and *create* more than ever."),
    # 51.50 – 53.40: deliberate silence / visual pause
    (53.40, 56.40, "Would you trust AI with *your job?*"),
    (56.50, 59.80, "Yes or no — *tell me in the comments.*"),
]
