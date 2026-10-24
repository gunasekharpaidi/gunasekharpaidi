/* ==========================================================================
   Projects 07–12.
   ========================================================================== */
(function () {
  const { T, TL, svg, R, C, P, G, view, grain, vignette, shadow, studio, dropRect, box, jar, tube, pump, can, paper, phone, browser, laptop, spread, shade, tint, halftone } = ArtKit;
  const PROJECTS = (window.PROJECTS = window.PROJECTS || []);

  /* ======================================================================
     07 — RIPPLE · Advertising & art direction
     ====================================================================== */
  const ri = { citrus: '#FFD43B', tang: '#FF7A1A', deep: '#0E3B2E', mint: '#BFE8D0', white: '#FFFDF7', berry: '#D9366B' };
  const riWord = (x, y, s, c, a = 'middle') => T(x, y, 'ripple', { s, w: 900, st: 112, ls: -0.03, fill: c, a });
  const rings = (cx, cy, r0, n, c, sw, gap) => Array.from({ length: n }, (_, i) => C(cx, cy, r0 + i * gap, 'none', `stroke="${c}" stroke-width="${sw}"`)).join('');
  const bubbles = (x, y, w, h, c, n = 40, seed = 3) => { let s = '', k = seed; const rnd = () => ((k = (k * 9301 + 49297) % 233280) / 233280); for (let i = 0; i < n; i++) s += C(x + rnd() * w, y + rnd() * h, 4 + rnd() * 18, 'none', `stroke="${c}" stroke-width="3"`); return s; };
  const riCanArt = (bg, fg, flavour) => rings(0, -20, 18, 4, fg, 4, 16) + riWord(0, 90, 40, fg) + T(0, 122, flavour, { f: 'mo', s: 13, w: 500, ls: 0.16, fill: fg, a: 'middle' }) + T(0, 150, 'SPARKLING WATER · 330 ML', { f: 'mo', s: 9, w: 500, ls: 0.12, fill: fg, a: 'middle', o: 0.8 });
  const riCans = (cx, y, s = 1) =>
    can({ x: cx - 190 * s, y: y - 10 * s, w: 170 * s, h: 320 * s, body: ri.citrus, art: G(`scale(${s})`, riCanArt(ri.citrus, ri.deep, 'YUZU & LIME')) }) +
    can({ x: cx + 190 * s, y: y - 10 * s, w: 170 * s, h: 320 * s, body: ri.berry, art: G(`scale(${s})`, riCanArt(ri.berry, ri.white, 'WILD BERRY')) }) +
    can({ x: cx, y: y + 20 * s, w: 190 * s, h: 360 * s, body: ri.deep, art: G(`scale(${s * 1.1})`, riCanArt(ri.deep, ri.citrus, 'BLOOD ORANGE')) });
  /* key visual in a w × h frame */
  const riKV = (w, h, bg = ri.tang, layout = 'land') => {
    let s = R(0, 0, w, h, bg) + rings(w * (layout === 'land' ? 0.68 : 0.5), h * 0.62, h * 0.12, 7, ri.citrus, h * 0.012, h * 0.075) + bubbles(0, 0, w, h * 0.6, ri.white, 26, 7);
    if (layout === 'land') {
      s += TL(w * 0.06, h * 0.3, ['Small bubbles.', 'Big mood.'], { s: h * 0.13, w: 900, st: 112, ls: -0.03, fill: ri.deep, lh: h * 0.13 });
      s += riWord(w * 0.06, h * 0.9, h * 0.07, ri.white, 'start') + G(`translate(${w * 0.68},0)`, riCans(0, h * 0.92, h / 1000));
    } else {
      s += TL(w * 0.08, h * 0.13, ['Small bubbles.', 'Big mood.'], { s: w * 0.12, w: 900, st: 112, ls: -0.03, fill: ri.deep, lh: w * 0.12 });
      s += G(`translate(${w / 2},0)`, riCans(0, h * 0.86, w / 1150)) + riWord(w / 2, h * 0.96, w * 0.07, ri.white);
    }
    return s;
  };

  PROJECTS.push({
    slug: 'ripple', no: '07', title: 'Ripple Sparkling Water', category: 'Advertising & Art Direction', group: 'Campaigns', tag: 'Concept Project',
    accent: ri.tang, ink: ri.deep, paper: ri.citrus,
    summary: 'An integrated campaign for a sparkling-water brand: one bold line, a ripple device and key visuals that adapt from billboard to bus shelter to phone.',
    deliverables: ['Campaign idea & line', 'Key visual', 'Billboard & bus shelter', 'Print advertising', 'Digital ads'],
    overview: 'Ripple is a fictional flavoured sparkling water with three flavours. The campaign introduces the brand to a market dominated by sugary soft drinks and minimalist “health” labels.',
    challenge: 'Better-for-you drinks usually look pale and polite. Ripple needed to look as fun as a soda while staying honest about being water, and the idea had to be readable in two seconds from a moving bus.',
    audience: 'Young professionals aged 22–38 cutting back on sugar who still want a drink that feels like a treat.',
    direction: 'Fizz you can see. Concentric ripples and loose bubble rings make carbonation graphic. A heavy, slightly expanded headline delivers the line “Small bubbles. Big mood.” on hot tangerine, with the cans as heroes.',
    mood: ['Carbonation', 'Summer heat', 'Big type, big colour', 'Two-second read'],
    fonts: [
      { name: 'Archivo Black, semi-expanded', role: 'Logo & headlines', f: 'ar', w: 900, st: 112 },
      { name: 'IBM Plex Mono', role: 'Flavour & legal lines', f: 'mo', w: 500, st: 100 }
    ],
    palette: [
      { name: 'Tangerine', hex: ri.tang }, { name: 'Citrus', hex: ri.citrus }, { name: 'Deep Green', hex: ri.deep }, { name: 'Wild Berry', hex: ri.berry }, { name: 'Foam', hex: ri.white }
    ],
    logo: (fg) => G('translate(0,-50)', rings(0, 0, 14, 4, fg, 5, 14)) + riWord(0, 90, 110, fg),
    mark: (fg) => rings(0, 0, 20, 5, fg, 9, 22),
    decisions: [
      { h: 'One line everywhere', p: '“Small bubbles. Big mood.” is short enough for a 6-sheet and a phone story, and it moves the brand from health claim to feeling.' },
      { h: 'Rings, not splashes', p: 'Concentric rings are a drawn, ownable device. They are cheaper to produce than liquid photography and stay consistent across every format.' },
      { h: 'Colour is the brand', p: 'A tangerine field makes Ripple recognisable from across the street before the logo is read. Flavour colours sit on the cans.' }
    ],
    cover: () => svg(1600, 1200, riKV(1600, 1200) + grain(1600, 1200, 0.25), 'Ripple key visual with three cans'),
    plates: [
      { size: 'full', cap: 'Roadside billboard, 48-sheet.', art: () => {
        let s = `<linearGradient id="risky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9FC7E8"/><stop offset="1" stop-color="#E9F1F2"/></linearGradient>` + R(0, 0, 1600, 1000, 'url(#risky)');
        s += R(0, 560, 1600, 440, '#7b8279') + P('M0,560 L380,470 L520,520 L760,440 L1000,500 L1260,430 L1600,520 L1600,600 L0,600Z', '#8c9a8d') + R(0, 820, 1600, 180, '#4a4e4f') + R(0, 900, 1600, 6, '#e8e3d6', 'opacity=".7"');
        s += R(560, 600, 26, 260, '#3a3c3e') + R(1010, 600, 26, 260, '#3a3c3e');
        s += dropRect(250, 140, 1100, 470, 0.35, 20, 20, 20) + R(240, 130, 1120, 490, '#2a2c2e') + view(250, 140, 1100, 470, 1600, 683, riKV(1600, 683));
        s += R(240, 610, 1120, 14, '#2a2c2e') + [400, 800, 1200].map((x) => R(x, 120, 40, 14, '#2a2c2e')).join('');
        return svg(1600, 1000, s + grain(1600, 1000, 0.25) + vignette(1600, 1000, 0.6), 'Ripple billboard');
      } },
      { size: 'narrow', cap: 'Bus-shelter lightbox, 6-sheet.', art: () => {
        let s = R(0, 0, 1000, 1250, '#1d2326') + R(0, 1050, 1000, 200, '#2b3135');
        s += `<ellipse cx="500" cy="560" rx="400" ry="520" fill="${ri.tang}" opacity=".35" filter="url(#gs-b40)"/>`;
        s += R(240, 120, 520, 900, '#a9b0b3') + view(260, 140, 480, 860, 1000, 1790, riKV(1000, 1790, ri.tang, 'port'));
        s += R(260, 140, 480, 860, 'url(#gs-sheen)') + R(180, 60, 640, 40, '#a9b0b3') + R(190, 100, 14, 950, '#a9b0b3') + R(796, 100, 14, 950, '#a9b0b3');
        s += R(240, 1020, 520, 40, '#c4c9cb', 'opacity=".2"');
        return svg(1000, 1250, s + grain(1000, 1250, 0.3), 'Ripple bus shelter');
      } },
      { size: 'wide', cap: 'Full-page print ad and digital story.', art: () => {
        const story = () => riKV(390, 844, ri.citrus, 'port') + R(24, 760, 342, 52, ri.deep) + T(195, 793, 'FIND A STOCKIST', { f: 'mo', s: 15, w: 600, ls: 0.16, fill: ri.white, a: 'middle' });
        return svg(1600, 1000, R(0, 0, 1600, 1000, ri.mint) +
          paper({ x: 200, y: 110, w: 600, h: 780, rot: -3, vw: 1000, vh: 1300, content: riKV(1000, 1300, ri.tang, 'port'), o: 0.3 }) +
          phone({ x: 950, y: 110, w: 340, content: story(), rot: 4 }) + grain(1600, 1000, 0.2), 'Ripple print and digital ads');
      } },
      { size: 'full', cap: 'Campaign adaptations by flavour.', art: () => {
        let s = R(0, 0, 1600, 1000, ri.white);
        [[ri.citrus, ri.deep, 'Yuzu & lime.', 'Zero sugar.'], [ri.berry, ri.white, 'Wild berry.', 'Big mood.'], [ri.deep, ri.citrus, 'Blood orange.', 'Small bubbles.']].forEach(([bg, fg, a, b], i) => {
          const x = 170 + i * 440;
          s += dropRect(x, 140, 340, 700, 0.2, 20) + R(x, 140, 340, 700, bg) + rings(x + 170, 560, 30, 5, fg, 4, 26) + bubbles(x, 140, 340, 300, fg, 10, i + 2);
          s += TL(x + 26, 220, [a, b], { s: 34, w: 900, st: 112, ls: -0.02, fill: fg, lh: 38 }) + riWord(x + 170, 800, 40, fg);
        });
        return svg(1600, 1000, s, 'Ripple flavour adaptations');
      } }
    ]
  });

  /* ======================================================================
     08 — LETTERS, LOUD · Typography & poster design
     ====================================================================== */
  const ty = { paper: '#EEEAE2', black: '#111111', verm: '#F0442C', cobalt: '#2340E0', butter: '#F4D35E' };
  const posters = [
    () => { let s = R(0, 0, 1000, 1400, ty.butter), y = 150; [100, 120, 140, 160, 180, 196].forEach((sz, i) => { y += sz * 0.86; s += T(500, y, 'LOUDER', { s: sz, w: 900, st: 62 + i * 12.6, fill: i === 5 ? ty.verm : ty.black, a: 'middle', ls: -0.03 }); }); return s + T(60, 120, 'Say it like you mean it.', { f: 'is', s: 54, w: 400, fill: ty.black }) + T(60, 1360, 'LETTERS, LOUD — 01 / WIDTH', { f: 'mo', s: 20, w: 500, fill: ty.black }); },
    () => R(0, 0, 1000, 1400, ty.verm) + TL(60, 380, ['Form', 'follows', 'feeling.'], { f: 'is', s: 300, w: 400, it: true, fill: ty.paper, lh: 280 }) + T(60, 1360, 'LETTERS, LOUD — 02 / VOICE', { f: 'mo', s: 20, w: 500, fill: ty.paper }),
    () => R(0, 0, 1000, 1400, ty.paper) + T(560, 1300, 'a', { s: 1500, w: 900, st: 100, fill: ty.cobalt, a: 'middle', ls: -0.05 }) + T(60, 110, 'a is for attention.', { f: 'is', s: 64, w: 400, fill: ty.black }) + T(60, 1360, 'LETTERS, LOUD — 03 / SCALE', { f: 'mo', s: 20, w: 500, fill: ty.black }),
    () => { let s = R(0, 0, 1000, 1400, ty.black); 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach((l, i) => { const x = 130 + (i % 5) * 185, y = 240 + Math.floor(i / 5) * 190; s += T(x, y, l, { s: 150, w: 800, st: 100, fill: l === 'Q' ? ty.verm : '#3a3a3a', a: 'middle' }); }); return s + T(60, 1360, 'FIND THE ONE THAT MATTERS.', { f: 'mo', s: 20, w: 500, fill: ty.paper }); },
    () => R(0, 0, 1000, 1400, ty.paper) + T(500, 760, 'KERN', { s: 360, w: 900, st: 125, fill: ty.cobalt, a: 'middle', ls: -0.12, o: 0.9 }) + `<g style="mix-blend-mode:multiply">${T(500, 760, 'KERN', { s: 360, w: 900, st: 125, fill: ty.verm, a: 'middle', ls: 0.12, o: 0.75 })}</g>` + T(60, 1360, 'LETTERS, LOUD — 05 / SPACE', { f: 'mo', s: 20, w: 500, fill: ty.black }),
    () => { const id = ArtKit.uid('circ'); return R(0, 0, 1000, 1400, ty.cobalt) + `<path id="${id}" d="M500,700 m-330,0 a330,330 0 1,1 660,0 a330,330 0 1,1 -660,0" fill="none"/>` + `<text font-size="64" fill="${ty.paper}" style="font-family:Archivo;font-weight:800;font-stretch:112%;letter-spacing:.12em"><textPath href="#${id}">TYPE IS A VOICE · TYPE IS A VOICE · TYPE IS A VOICE ·</textPath></text>` + T(500, 790, 'Aa', { f: 'is', s: 280, w: 400, fill: ty.butter, a: 'middle' }) + T(60, 1360, 'LETTERS, LOUD — 06 / ORBIT', { f: 'mo', s: 20, w: 500, fill: ty.paper }); }
  ];
  const tape = (x, y, rot) => `<rect x="${x}" y="${y}" width="120" height="34" fill="#f4efe2" opacity=".75" transform="rotate(${rot} ${x + 60} ${y + 17})"/>`;

  PROJECTS.push({
    slug: 'letters-loud', no: '08', title: 'Letters, Loud', category: 'Typography & Poster Design', group: 'Editorial', tag: 'Self-Initiated Project',
    accent: ty.verm, ink: ty.black, paper: ty.paper,
    summary: 'A series of six typographic posters, each testing one variable of type (width, voice, scale, rhythm, space and orbit) to see how far a letter can carry a message alone.',
    deliverables: ['Poster series (6)', 'Type experiments', 'Exhibition layout', 'Print specification'],
    overview: '“Letters, Loud” is a personal study in expressive typography. Each poster isolates one property of type and pushes it until the letterforms tell the story without images.',
    challenge: 'Self-set: no photography, no illustration, two typefaces only. Every poster had to be legible from across a room yet reward a closer look.',
    audience: 'Designers, type lovers and anyone walking past a wall of posters. The series is planned for risograph printing and a small exhibition.',
    direction: 'Constraint as a creative engine. A variable sans with a width axis from condensed to expanded, a high-contrast italic serif for contrast, and four flat inks chosen for risograph printing.',
    mood: ['Riso inks', 'Variable widths', 'Wheat-paste walls', 'One idea per sheet'],
    fonts: [
      { name: 'Archivo Variable, 62–125 wdth', role: 'Experiments & headlines', f: 'ar', w: 900, st: 100 },
      { name: 'Instrument Serif Italic', role: 'Voice & contrast', f: 'is', w: 400, st: 100 }
    ],
    palette: [
      { name: 'Riso Vermilion', hex: ty.verm }, { name: 'Riso Cobalt', hex: ty.cobalt }, { name: 'Butter', hex: ty.butter }, { name: 'Newsprint', hex: ty.paper }, { name: 'Black', hex: ty.black }
    ],
    logo: null,
    mark: (fg) => T(0, 80, 'Aa', { f: 'is', s: 260, w: 400, fill: fg, a: 'middle' }),
    decisions: [
      { h: 'One variable per poster', p: 'Limiting each piece to a single typographic property keeps the series coherent and makes every poster a clear lesson in how type creates meaning.' },
      { h: 'Inks before pixels', p: 'The palette was chosen from standard risograph drums, so the digital designs print without colour surprises.' },
      { h: 'Readable at distance', p: 'Every poster passes a five-metre test: the main word or shape is clear from across a room, and the details reward a closer look.' }
    ],
    cover: () => {
      let s = R(0, 0, 1600, 1200, '#8f8a84');
      for (let i = 0; i < 60; i++) s += R(0, i * 20, 1600, 1, '#000', `opacity="${0.03 + (i % 3) * 0.01}"`);
      [[150, 140, -2, 0], [600, 100, 1.5, 2], [1050, 150, -1, 1]].forEach(([x, y, r, k]) => (s += paper({ x, y, w: 400, h: 560, rot: r, vw: 1000, vh: 1400, content: posters[k](), o: 0.4, lift: 6 }) + tape(x + 140, y - 18, r * 3)));
      s += R(0, 860, 1600, 340, '#6f6b66') + R(0, 860, 1600, 8, '#5a5651');
      return svg(1600, 1200, s + grain(1600, 1200, 0.4) + vignette(1600, 1200), 'Typographic posters on a wall');
    },
    plates: [
      { size: 'full', cap: 'The full series of six, printed in four risograph inks.', art: () => {
        let s = R(0, 0, 1600, 1100, '#E5E0D6');
        posters.forEach((p, i) => (s += paper({ x: 130 + (i % 3) * 460, y: 60 + Math.floor(i / 3) * 520, w: 400 * 0.85, h: 560 * 0.85, vw: 1000, vh: 1400, content: p(), o: 0.2, lift: 6 })));
        return svg(1600, 1100, s + grain(1600, 1100, 0.25), 'Letters, Loud series');
      } },
      { size: 'half', cap: 'Width study: one letter across nine widths.', art: () => {
        let s = R(0, 0, 1200, 1000, ty.black);
        for (let i = 0; i < 9; i++) s += T(100 + i * 120, 620, 'R', { s: 150, w: 900, st: 62 + i * 7.9, fill: i === 8 ? ty.verm : ty.paper, a: 'middle' }) + T(100 + i * 120, 720, String(Math.round(62 + i * 7.9)), { f: 'mo', s: 16, w: 500, fill: ty.paper, a: 'middle', o: 0.6 });
        return svg(1200, 1000, s + T(60, 120, 'WDTH 62 → 125', { f: 'mo', s: 22, w: 500, fill: ty.paper, o: 0.8 }), 'Width axis study');
      } },
      { size: 'half', cap: 'Framed, in place.', art: () => svg(1200, 1000,
        R(0, 0, 1200, 1000, '#E7E2D9') + R(0, 780, 1200, 220, '#B9A88F') + R(0, 780, 1200, 8, '#9e8d74') +
        dropRect(400, 110, 400, 560, 0.35, 20, 10, 20) + R(380, 90, 440, 600, '#1a1a1a') + view(410, 120, 380, 540, 1000, 1400, posters[1]()) + R(410, 120, 380, 540, 'url(#gs-sheen)') +
        G('translate(990,780)', P('M-50,0 L-36,-140 L36,-140 L50,0Z', '#3b3631') + `<path d="M0,-140 C-40,-260 -110,-300 -160,-330 M0,-140 C30,-260 90,-310 140,-340 M0,-140 C0,-250 10,-330 0,-400" stroke="#4c5e43" stroke-width="5" fill="none"/>`) + grain(1200, 1000, 0.3), 'Framed poster on a wall') }
    ]
  });

  /* ======================================================================
     09 — NORTHBEAM · Corporate identity
     ====================================================================== */
  const nb = { night: '#0E1A2B', slate: '#3C4A5E', polar: '#E4EAF1', signal: '#F2B84B', white: '#FFFFFF', steel: '#8C98A8' };
  const nbMark = (s, c, beam = nb.signal) => G(`scale(${s})`, R(-36, -40, 18, 80, c) + R(18, -40, 18, 80, c) + P('M-36,-40 L-18,-40 L36,40 L18,40Z', beam));
  const nbWord = (x, y, s, c, a = 'start') => T(x, y, 'Northbeam', { f: 'hk', s, w: 700, ls: -0.02, fill: c, a });
  const nbLock = (x, y, s, c, beam) => G(`translate(${x},${y})`, nbMark(s / 80, c, beam) + nbWord(s * 0.62, s * 0.18, s * 0.5, c));
  const nbLetter = () => R(0, 0, 840, 1188, nb.white) + nbLock(80, 110, 70, nb.night) + T(760, 104, 'STRATEGY & ANALYTICS ADVISORY', { f: 'mo', s: 12, w: 500, ls: 0.14, fill: nb.slate, a: 'end' }) +
    T(80, 260, 'Proposal for an operations review', { f: 'hk', s: 26, w: 700, fill: nb.night }) +
    Array.from({ length: 14 }, (_, i) => R(80, 320 + i * 30, i % 5 === 4 ? 360 : 680, 7, nb.steel, 'opacity=".5"')).join('') +
    R(80, 1080, 680, 1, nb.steel) + T(80, 1120, 'northbeam.example', { f: 'mo', s: 12, w: 500, fill: nb.slate }) + R(0, 1180, 840, 8, nb.signal);
  const nbSlide = (k) => {
    if (k === 0) return R(0, 0, 1600, 900, nb.night) + P('M1000,0 L1200,0 L1600,640 L1600,900 L1400,900 L900,120Z', nb.signal, 'opacity=".95"') + nbLock(120, 140, 70, nb.white) + TL(120, 480, ['Clarity at', 'every scale'], { f: 'hk', s: 110, w: 700, ls: -0.03, fill: nb.white, lh: 112 }) + T(120, 760, 'Strategy review · Sample presentation', { f: 'mo', s: 24, w: 500, fill: nb.steel });
    if (k === 1) return R(0, 0, 1600, 900, nb.polar) + T(120, 160, '01 — Context', { f: 'mo', s: 26, w: 500, fill: nb.slate }) + TL(120, 300, ['Three questions', 'shape this review'], { f: 'hk', s: 76, w: 700, ls: -0.02, fill: nb.night, lh: 82 }) + [0, 1, 2].map((i) => R(120 + i * 460, 520, 420, 260, nb.white) + T(150 + i * 460, 580, `Q${i + 1}`, { f: 'hk', s: 40, w: 700, fill: nb.signal }) + R(150 + i * 460, 620, 340, 8, nb.steel, 'opacity=".5"') + R(150 + i * 460, 650, 260, 8, nb.steel, 'opacity=".5"')).join('');
    if (k === 2) { let s = R(0, 0, 1600, 900, nb.white) + T(120, 160, 'Sample data, for layout only', { f: 'mo', s: 22, w: 500, fill: nb.slate }) + T(120, 250, 'Chart style', { f: 'hk', s: 70, w: 700, fill: nb.night }); [3, 5, 4, 7, 6, 9].forEach((v, i) => (s += R(160 + i * 200, 800 - v * 50, 120, v * 50, i === 5 ? nb.signal : nb.slate))); return s + R(120, 800, 1360, 2, nb.night); }
    return R(0, 0, 1600, 900, nb.slate) + TL(120, 380, ['Let’s find', 'the signal.'], { f: 'hk', s: 120, w: 700, ls: -0.03, fill: nb.white, lh: 120 }) + G('translate(1340,640)', nbMark(1.4, nb.white));
  };

  PROJECTS.push({
    slug: 'northbeam', no: '09', title: 'Northbeam Advisory', category: 'Corporate Brand Identity', group: 'Branding', tag: 'Concept Project',
    accent: nb.signal, ink: nb.night, paper: nb.polar,
    summary: 'A clear, credible identity for an analytics consultancy: a beam-of-light monogram, a disciplined palette and templates the team can use without a designer.',
    deliverables: ['Logo & monogram', 'Stationery', 'Presentation templates', 'Brand guidelines', 'Reception signage'],
    overview: 'Northbeam is a fictional strategy and analytics consultancy. It needed an identity that feels senior and trustworthy in boardrooms while standing apart from the blue-gradient look of tech services.',
    challenge: 'Consulting brands are judged in documents: proposals, slides and reports made by people who are not designers. The system had to be distinctive and almost impossible to misuse.',
    audience: 'Operations directors, CFOs and founders of mid-sized businesses looking for an independent partner to make sense of their data.',
    direction: 'Signal in the dark. The N monogram is two steady columns crossed by a beam of light, a simple metaphor for finding direction in complex information. Deep night blue carries authority, and signal amber is kept for the insight on every page.',
    mood: ['Signal in the dark', 'Quiet authority', 'Ruled & structured', 'Light as insight'],
    fonts: [
      { name: 'Hanken Grotesk Bold', role: 'Wordmark & headings', f: 'hk', w: 700, st: 100 },
      { name: 'IBM Plex Mono', role: 'Data, labels & captions', f: 'mo', w: 500, st: 100 }
    ],
    palette: [
      { name: 'Night', hex: nb.night }, { name: 'Signal Amber', hex: nb.signal }, { name: 'Slate', hex: nb.slate }, { name: 'Polar', hex: nb.polar }, { name: 'Steel', hex: nb.steel }
    ],
    logo: (fg) => nbLock(-250, 0, 120, fg),
    mark: (fg) => nbMark(2.2, fg),
    decisions: [
      { h: 'Amber means insight', p: 'The signal colour is used once per page or slide, on the beam, the key figure or the key recommendation. Readers learn where to look.' },
      { h: 'Templates that protect the brand', p: 'Slide and document templates lock the grid, type sizes and colours, so consultants can build polished work quickly and consistently.' },
      { h: 'Built from simple parts', p: 'Two rectangles and a parallelogram make a mark that embosses, engraves and renders as a 16-pixel favicon without losing its shape.' }
    ],
    cover: () => svg(1600, 1200,
      R(0, 0, 1600, 1200, nb.polar) +
      paper({ x: 250, y: 120, w: 560, h: 792, rot: -4, vw: 840, vh: 1188, content: nbLetter(), o: 0.22 }) +
      paper({ x: 820, y: 560, w: 620, h: 310, rot: 6, vw: 1240, vh: 620, bg: nb.night, content: R(0, 0, 1240, 620, nb.night) + nbLock(620 - 300, 330, 120, nb.white), o: 0.3 }) +
      paper({ x: 900, y: 230, w: 340, h: 200, rot: -10, vw: 850, vh: 500, bg: nb.night, content: R(0, 0, 850, 500, nb.night) + G('translate(425,250)', nbMark(2, nb.white)), o: 0.3 }) +
      paper({ x: 1040, y: 330, w: 340, h: 200, rot: 4, vw: 850, vh: 500, content: R(0, 0, 850, 500, nb.white) + T(70, 140, 'Senior Consultant', { f: 'hk', s: 44, w: 700, fill: nb.night }) + T(70, 196, 'Strategy & Analytics', { f: 'mo', s: 26, w: 500, fill: nb.slate }) + T(70, 420, 'northbeam.example', { f: 'mo', s: 26, w: 500, fill: nb.slate }) + R(0, 480, 850, 20, nb.signal), o: 0.3 }) +
      grain(1600, 1200, 0.18), 'Northbeam stationery'),
    plates: [
      { size: 'wide', cap: 'Presentation templates: title, content, chart and close.', art: () => svg(1600, 1000,
        R(0, 0, 1600, 1000, '#D5DDE7') + laptop({ x: 330, y: 110, w: 940, content: nbSlide(0), vw: 1600, vh: 900 }) +
        [1, 2, 3].map((k, i) => dropRect(240 + i * 400, 780, 320, 180, 0.2, 8, 0, 6) + view(240 + i * 400, 780, 320, 180, 1600, 900, nbSlide(k))).join('') + grain(1600, 1000, 0.15), 'Northbeam slides') },
      { size: 'narrow', cap: 'Reception signage in brushed metal.', art: () => svg(1000, 1250,
        R(0, 0, 1000, 1250, '#2b3646') + `<ellipse cx="500" cy="300" rx="600" ry="500" fill="url(#gs-spot)" opacity=".25"/>` +
        G('translate(500,520)', `<g transform="translate(8,14)" opacity=".5" filter="url(#gs-b8)">${nbMark(3.2, '#000', '#000')}</g>` + nbMark(3.2, '#C9D1DB')) +
        T(500, 760, 'Northbeam', { f: 'hk', s: 96, w: 700, ls: -0.02, fill: '#C9D1DB', a: 'middle' }) +
        R(0, 1000, 1000, 250, '#1b2330') + R(150, 1000, 700, 6, nb.signal, 'opacity=".6"') + grain(1000, 1250, 0.3), 'Northbeam reception sign') },
      { size: 'full', cap: 'Brand guidelines: logo clear space and colour proportions.', art: () => {
        const left = R(0, 0, 1000, 1300, nb.white) + T(80, 120, '02 — Logo', { f: 'mo', s: 22, w: 500, fill: nb.slate }) + T(80, 220, 'Clear space', { f: 'hk', s: 64, w: 700, fill: nb.night }) +
          `<rect x="200" y="420" width="600" height="420" fill="none" stroke="${nb.signal}" stroke-dasharray="10 8" stroke-width="2"/>` + nbLock(290, 630, 110, nb.night) +
          T(500, 900, 'Minimum clear space = height of the N', { f: 'mo', s: 18, w: 500, fill: nb.slate, a: 'middle' });
        const right = R(0, 0, 1000, 1300, nb.polar) + T(80, 120, '03 — Colour', { f: 'mo', s: 22, w: 500, fill: nb.slate }) + T(80, 220, 'Proportion', { f: 'hk', s: 64, w: 700, fill: nb.night }) +
          R(80, 320, 840, 480, nb.night) + R(80, 800, 560, 180, nb.slate) + R(640, 800, 200, 180, nb.steel) + R(840, 800, 80, 180, nb.signal) +
          T(110, 770, 'NIGHT 60%', { f: 'mo', s: 18, w: 500, fill: nb.white }) + T(110, 950, 'SLATE 25%', { f: 'mo', s: 18, w: 500, fill: nb.white }) + T(880, 1020, 'SIGNAL 5%', { f: 'mo', s: 18, w: 500, fill: nb.night, a: 'middle' });
        return svg(1600, 900, R(0, 0, 1600, 900, nb.slate) + spread({ x: 200, y: 70, w: 1200, h: 780, left, right, pw: 1000, ph: 1300 }) + grain(1600, 900, 0.15), 'Northbeam guidelines');
      } }
    ]
  });

  /* ======================================================================
     10 — KAIRO K1 · Product launch campaign
     ====================================================================== */
  const ka = { graph: '#17181A', ember: '#FF6A14', bone: '#ECE7DE', steel: '#8D9196', ash: '#2C2E31' };
  const headphones = (cx, cy, s, c = ka.ash, accent = ka.ember) => G(`translate(${cx},${cy}) scale(${s})`,
    shadow(0, 330, 260, 30, 0.45, 20) +
    `<path d="M-210,40 C-230,-300 230,-300 210,40" fill="none" stroke="${shade(c, 0.2)}" stroke-width="44" stroke-linecap="round"/>` +
    `<path d="M-210,40 C-230,-300 230,-300 210,40" fill="none" stroke="${tint(c, 0.12)}" stroke-width="10" stroke-linecap="round" transform="translate(-6,-14)" opacity=".7"/>` +
    R(-232, 0, 30, 110, ka.steel, 'rx="10"') + R(202, 0, 30, 110, ka.steel, 'rx="10"') +
    `<rect x="-300" y="80" width="140" height="240" rx="64" fill="${c}"/><rect x="-300" y="80" width="140" height="240" rx="64" fill="url(#gs-cyl)"/>` +
    `<rect x="160" y="80" width="140" height="240" rx="64" fill="${c}"/><rect x="160" y="80" width="140" height="240" rx="64" fill="url(#gs-cyl)"/>` +
    `<rect x="-176" y="100" width="34" height="200" rx="17" fill="#0e0f10"/><rect x="142" y="100" width="34" height="200" rx="17" fill="#0e0f10"/>` +
    R(-238, 180, 16, 40, accent, 'rx="4"') + R(222, 180, 16, 40, accent, 'rx="4"'));
  const kaKV = (w, h, layout = 'land') => {
    let s = R(0, 0, w, h, ka.graph) + `<ellipse cx="${layout === 'land' ? w * 0.64 : w / 2}" cy="${h * 0.5}" rx="${h * 0.42}" ry="${h * 0.42}" fill="${ka.ember}" opacity=".9" filter="url(#gs-b40)"/>` + C(layout === 'land' ? w * 0.64 : w / 2, h * 0.5, h * 0.34, ka.ember);
    s += headphones(layout === 'land' ? w * 0.64 : w / 2, h * 0.46, h / 1000);
    if (layout === 'land') s += T(w * 0.06, h * 0.42, 'K1', { s: h * 0.32, w: 900, st: 62, ls: -0.02, fill: ka.bone }) + T(w * 0.06, h * 0.54, 'Silence, tuned.', { f: 'is', s: h * 0.08, w: 400, fill: ka.bone }) + T(w * 0.06, h * 0.9, 'KAIRO', { s: h * 0.035, w: 800, st: 125, ls: 0.3, fill: ka.steel });
    else s += T(w / 2, h * 0.16, 'Silence, tuned.', { f: 'is', s: w * 0.12, w: 400, fill: ka.bone, a: 'middle' }) + T(w / 2, h * 0.88, 'K1', { s: w * 0.26, w: 900, st: 62, fill: ka.bone, a: 'middle' }) + T(w / 2, h * 0.94, 'KAIRO', { s: w * 0.04, w: 800, st: 125, ls: 0.3, fill: ka.steel, a: 'middle' });
    return s;
  };
  const kaStory = (k) => {
    if (k === 0) return R(0, 0, 390, 844, ka.graph) + C(195, 422, 6, ka.ember) + `<circle cx="195" cy="422" r="60" fill="none" stroke="${ka.ember}" stroke-opacity=".5"/><circle cx="195" cy="422" r="130" fill="none" stroke="${ka.ember}" stroke-opacity=".25"/>` + T(195, 640, 'Listen closer.', { f: 'is', s: 40, w: 400, fill: ka.bone, a: 'middle' }) + T(195, 690, 'KAIRO · SOON', { f: 'mo', s: 13, w: 500, ls: 0.3, fill: ka.steel, a: 'middle' });
    if (k === 1) return view(0, 0, 390, 844, 390, 844, kaKV(390, 844, 'port'));
    return R(0, 0, 390, 844, ka.bone) + headphones(195, 330, 0.55, ka.graph) + T(24, 110, 'Available', { s: 52, w: 900, st: 62, fill: ka.graph }) + T(24, 160, 'now.', { f: 'is', s: 52, w: 400, fill: ka.ember }) + R(24, 720, 342, 56, ka.graph) + T(195, 755, 'SHOP K1 →', { f: 'mo', s: 16, w: 600, ls: 0.16, fill: ka.bone, a: 'middle' });
  };
  const kaPDP = () => {
    let s = R(0, 0, 1440, 900, ka.bone) + T(64, 60, 'KAIRO', { s: 22, w: 800, st: 125, ls: 0.3, fill: ka.graph }) + ['Headphones', 'Speakers', 'Support'].map((t, i) => T(600 + i * 150, 60, t, { f: 'hk', s: 17, w: 500, fill: ka.graph })).join('');
    s += R(64, 110, 760, 720, '#E2DCD1') + C(444, 470, 250, ka.ember, 'opacity=".15"') + headphones(444, 430, 0.85, ka.ash);
    s += T(880, 220, 'K1', { s: 140, w: 900, st: 62, fill: ka.graph }) + T(880, 280, 'Wireless noise-cancelling headphones', { f: 'hk', s: 22, w: 500, fill: ka.graph, o: 0.8 });
    s += T(880, 360, 'COLOUR', { f: 'mo', s: 13, w: 500, ls: 0.2, fill: ka.graph, o: 0.6 }) + [ka.ash, ka.bone, ka.ember].map((c, i) => C(900 + i * 54, 400, 18, c, `stroke="${ka.graph}" stroke-width="${i ? 1 : 3}"`)).join('');
    s += [['Adaptive ANC', 'Tunes to your room'], ['40 h', 'Battery, ANC on'], ['Multipoint', 'Two devices at once']].map(([a, b], i) => R(880, 460 + i * 80, 500, 1, ka.graph, 'opacity=".2"') + T(880, 500 + i * 80, a, { f: 'hk', s: 22, w: 700, fill: ka.graph }) + T(1380, 500 + i * 80, b, { f: 'hk', s: 17, w: 400, fill: ka.graph, a: 'end', o: 0.7 })).join('');
    s += R(880, 740, 500, 64, ka.graph) + T(1130, 780, 'Pre-order K1', { f: 'hk', s: 19, w: 700, fill: ka.bone, a: 'middle' });
    return s;
  };

  PROJECTS.push({
    slug: 'kairo', no: '10', title: 'Kairo K1 Launch', category: 'Product Launch Campaign', group: 'Campaigns', tag: 'Concept Project',
    accent: ka.ember, ink: ka.graph, paper: ka.bone, dark: true,
    summary: 'Launch creative for a premium noise-cancelling headphone: an ember halo key visual, a three-act social rollout and a product page that keeps the drama going.',
    deliverables: ['Launch key visual', 'Teaser & launch stories', 'Digital out-of-home', 'Product page design', 'Paid social'],
    overview: 'Kairo is a fictional audio brand launching its first headphone, the K1. The campaign runs from teaser to availability across social, digital screens and the product page.',
    challenge: 'Headphone launches tend to look alike: a product on black, a spec list, a gradient. K1 needed one ownable visual idea that survives tiny formats and huge screens and turns noise cancelling into something you can feel.',
    audience: 'Commuters, remote workers and audio enthusiasts aged 25–45 who research before they buy and value design as much as specification.',
    direction: 'The quiet glow. A single ember halo sits behind the product, suggesting warmth inside silence. A narrow, tall model name and a soft italic line (“Silence, tuned.”) set the tone. The rollout moves from dark to light: teaser, reveal, available now.',
    mood: ['Warm silence', 'Ember halo', 'Dark to light', 'Engineered calm'],
    fonts: [
      { name: 'Archivo Condensed Black', role: 'Model name', f: 'ar', w: 900, st: 62 },
      { name: 'Instrument Serif', role: 'Campaign line', f: 'is', w: 400, st: 100 }
    ],
    palette: [
      { name: 'Ember', hex: ka.ember }, { name: 'Graphite', hex: ka.graph }, { name: 'Bone', hex: ka.bone }, { name: 'Steel', hex: ka.steel }, { name: 'Ash', hex: ka.ash }
    ],
    logo: (fg) => T(0, 20, 'KAIRO', { s: 110, w: 800, st: 125, ls: 0.3, fill: fg, a: 'middle' }) + T(0, 84, 'SOUND, ENGINEERED CALM', { f: 'mo', s: 15, w: 500, ls: 0.3, fill: fg, a: 'middle' }),
    mark: () => C(0, 0, 110, ka.ember) + T(0, 50, 'K1', { s: 140, w: 900, st: 62, fill: ka.graph, a: 'middle' }),
    decisions: [
      { h: 'A halo you can own', p: 'The ember disc is the campaign’s signature. It reads at story size, frames the product on giant screens and can run alone in the teaser before the product appears.' },
      { h: 'Three acts, one story', p: 'Teaser (a single point of light), reveal (the full key visual) and launch (light background, clear call to action). Each act stands alone, and together they build anticipation.' },
      { h: 'Specs as a quiet list', p: 'On the product page, three features are set as a calm ruled list rather than icons and badges, so the product image keeps centre stage.' }
    ],
    cover: () => svg(1600, 1200, kaKV(1600, 1200) + grain(1600, 1200, 0.3) + vignette(1600, 1200, 0.8), 'Kairo K1 key visual'),
    plates: [
      { size: 'full', cap: 'Three-act story rollout: teaser, reveal, available now.', art: () => svg(1600, 1000,
        R(0, 0, 1600, 1000, ka.ember) + phone({ x: 290, y: 140, w: 300, content: kaStory(0), shadowO: 0.4 }) + phone({ x: 650, y: 110, w: 300, content: kaStory(1), shadowO: 0.4 }) + phone({ x: 1010, y: 140, w: 300, content: kaStory(2), shadowO: 0.4 }) + grain(1600, 1000, 0.2), 'Kairo story sequence') },
      { size: 'half', cap: 'Digital out-of-home in a station concourse.', art: () => {
        let s = R(0, 0, 1200, 1000, '#0d0e10') + R(0, 760, 1200, 240, '#17181b');
        s += `<ellipse cx="600" cy="400" rx="560" ry="340" fill="${ka.ember}" opacity=".18" filter="url(#gs-b40)"/>`;
        s += R(150, 140, 900, 520, '#000') + view(165, 155, 870, 490, 1600, 900, kaKV(1600, 900));
        s += G('translate(0,1520) scale(1,-1)', view(165, 155, 870, 490, 1600, 900, kaKV(1600, 900)), 'opacity=".12"');
        s += R(0, 760, 1200, 240, 'url(#gs-fadeB)');
        return svg(1200, 1000, s + grain(1200, 1000, 0.3), 'Kairo digital screen');
      } },
      { size: 'half', cap: 'Product page with a ruled specification list.', art: () => svg(1200, 1000, R(0, 0, 1200, 1000, ka.ash) + browser({ x: 80, y: 140, w: 1040, h: 680, content: kaPDP(), url: 'kairo.example/k1' }) + grain(1200, 1000, 0.15), 'Kairo product page') },
      { size: 'full', cap: 'Paid social set, 4:5.', art: () => {
        let s = R(0, 0, 1600, 900, ka.bone);
        const ads = [
          () => kaKV(1080, 1350, 'port'),
          () => R(0, 0, 1080, 1350, ka.bone) + headphones(540, 600, 1, ka.graph) + TL(70, 170, ['Hear the room', 'disappear.'], { f: 'is', s: 96, w: 400, fill: ka.graph, lh: 96 }) + T(70, 1280, 'KAIRO K1 · PRE-ORDER', { f: 'mo', s: 30, w: 500, ls: 0.2, fill: ka.graph }),
          () => R(0, 0, 1080, 1350, ka.ember) + T(540, 760, '40', { s: 620, w: 900, st: 62, fill: ka.graph, a: 'middle' }) + T(540, 880, 'hours of quiet', { f: 'is', s: 90, w: 400, fill: ka.graph, a: 'middle' }) + T(540, 1280, 'KAIRO K1', { f: 'mo', s: 30, w: 500, ls: 0.2, fill: ka.graph, a: 'middle' })
        ];
        ads.forEach((a, i) => (s += dropRect(170 + i * 440, 110, 380, 475, 0.2, 20) + view(170 + i * 440, 110, 380, 475, 1080, 1350, a())));
        return svg(1600, 900, s + grain(1600, 900, 0.15), 'Kairo social ads');
      } }
    ]
  });

  /* ======================================================================
     11 — TERRA CYCLES · Website & digital experience
     ====================================================================== */
  const te = { forest: '#1E3A2F', sand: '#E7DDC9', rust: '#C4572B', cream: '#F6F2E9', moss: '#7F8F5A', ink: '#151A17' };
  const teLogo = (x, y, s, c, a = 'start') => T(x, y, 'terra', { s, w: 800, st: 125, ls: -0.03, fill: c, a });
  const bike = (x, y, s, c = te.forest, acc = te.rust) => {
    const w = (cx) => `<circle cx="${cx}" cy="0" r="110" fill="none" stroke="#1b1b1b" stroke-width="16"/><circle cx="${cx}" cy="0" r="94" fill="none" stroke="#777" stroke-width="2"/>` + Array.from({ length: 12 }, (_, i) => `<line x1="${cx}" y1="0" x2="${cx + Math.cos(i * 0.5236) * 94}" y2="${Math.sin(i * 0.5236) * 94}" stroke="#999" stroke-width="1.5"/>`).join('') + C(cx, 0, 14, '#333');
    return G(`translate(${x},${y}) scale(${s})`, shadow(0, 115, 300, 14, 0.35, 8) + w(-190) + w(190) +
      `<path d="M-190,0 L-40,0 L60,-150 L-90,-150 Z M-40,0 L-110,-190 M60,-150 L190,0 M60,-150 L80,-230" fill="none" stroke="${c}" stroke-width="18" stroke-linejoin="round" stroke-linecap="round"/>` +
      R(-20, -128, 90, 40, acc, 'rx="12" transform="rotate(-56 25 -108)"') + `<path d="M-150,-196 L-70,-196" stroke="#1b1b1b" stroke-width="16" stroke-linecap="round"/><path d="M60,-236 L120,-246" stroke="#1b1b1b" stroke-width="12" stroke-linecap="round"/>` + C(-40, 0, 26, '#333'));
  };
  const hills = (w, h, y) => P(`M0,${y} C${w * 0.2},${y - h * 0.12} ${w * 0.4},${y + h * 0.02} ${w * 0.6},${y - h * 0.08} S${w * 0.9},${y - h * 0.02} ${w},${y - h * 0.1} L${w},${h} L0,${h}Z`, te.moss, 'opacity=".55"') + P(`M0,${y + h * 0.08} C${w * 0.3},${y - h * 0.02} ${w * 0.6},${y + h * 0.1} ${w},${y} L${w},${h} L0,${h}Z`, te.forest, 'opacity=".9"');
  const nav = (dark) => teLogo(64, 62, 36, dark ? te.cream : te.ink) + ['Bikes', 'Test ride', 'Stories', 'Support'].map((t, i) => T(560 + i * 140, 58, t, { f: 'hk', s: 17, w: 500, fill: dark ? te.cream : te.ink })).join('') + `<rect x="1230" y="30" width="150" height="44" fill="${te.rust}"/>` + T(1305, 59, 'Book a ride', { f: 'hk', s: 16, w: 700, fill: te.cream, a: 'middle' });
  const teHome = () => {
    let s = R(0, 0, 1440, 2400, te.cream) + R(0, 0, 1440, 900, te.sand) + C(1100, 300, 120, te.rust, 'opacity=".9"') + hills(1440, 900, 640) + nav(false);
    s += TL(64, 260, ['Ride further.', 'Arrive lighter.'], { s: 108, w: 800, st: 112, ls: -0.035, fill: te.ink, lh: 108 });
    s += T(64, 420, 'Electric bikes designed for real distances and real hills.', { f: 'hk', s: 24, w: 400, fill: te.ink, o: 0.8 });
    s += R(64, 470, 220, 60, te.ink) + T(174, 507, 'Explore bikes', { f: 'hk', s: 17, w: 700, fill: te.cream, a: 'middle' }) + T(320, 507, 'Book a test ride →', { f: 'hk', s: 17, w: 700, fill: te.ink });
    s += bike(980, 700, 1.05);
    s += T(64, 1040, 'Find your Terra', { s: 64, w: 800, st: 112, ls: -0.03, fill: te.ink });
    [['Terra Trail', 'Hills & gravel'], ['Terra City', 'Daily commute'], ['Terra Cargo', 'Kids & groceries']].forEach(([n, d], i) => { const x = 64 + i * 450; s += R(x, 1090, 420, 420, i === 1 ? te.sand : '#EDE6D8') + bike(x + 210, 1330, 0.6, [te.forest, te.rust, te.moss][i], i === 1 ? te.forest : te.rust) + T(x, 1560, n, { f: 'hk', s: 24, w: 700, fill: te.ink }) + T(x, 1592, d, { f: 'hk', s: 17, w: 400, fill: te.ink, o: 0.7 }); });
    s += R(0, 1700, 1440, 700, te.forest) + TL(64, 1860, ['Try before', 'you ride off.'], { s: 84, w: 800, st: 112, ls: -0.03, fill: te.cream, lh: 86 }) + T(64, 2040, 'Free 45-minute test rides from our partner stores.', { f: 'hk', s: 22, w: 400, fill: te.cream, o: 0.8 }) + R(64, 2090, 240, 60, te.rust) + T(184, 2127, 'Book a test ride', { f: 'hk', s: 17, w: 700, fill: te.cream, a: 'middle' }) + C(1080, 2010, 230, te.moss, 'opacity=".35"') + bike(1080, 2060, 0.8, te.sand, te.rust);
    return s;
  };
  const tePDP = () => {
    let s = R(0, 0, 1440, 900, te.cream) + nav(false) + R(64, 110, 800, 700, te.sand) + bike(464, 520, 1.05, te.rust, te.forest);
    s += T(64, 850, '1 / 6', { f: 'mo', s: 14, w: 500, fill: te.ink, o: 0.6 });
    s += T(920, 190, 'Terra City', { s: 64, w: 800, st: 112, ls: -0.03, fill: te.ink }) + T(920, 236, 'Everyday e-bike with belt drive', { f: 'hk', s: 20, w: 400, fill: te.ink, o: 0.75 });
    s += T(920, 310, 'FRAME COLOUR', { f: 'mo', s: 13, w: 500, ls: 0.2, fill: te.ink, o: 0.6 }) + [te.rust, te.forest, te.sand].map((c, i) => C(940 + i * 54, 346, 18, c, `stroke="${te.ink}" stroke-width="${i ? 1 : 3}"`)).join('');
    s += T(920, 420, 'FRAME SIZE', { f: 'mo', s: 13, w: 500, ls: 0.2, fill: te.ink, o: 0.6 }) + ['S', 'M', 'L'].map((t, i) => `<rect x="${920 + i * 80}" y="440" width="68" height="48" fill="${i === 1 ? te.ink : 'none'}" stroke="${te.ink}"/>` + T(954 + i * 80, 471, t, { f: 'hk', s: 17, w: 700, fill: i === 1 ? te.cream : te.ink, a: 'middle' })).join('');
    s += [['Range', 'Up to 120 km'], ['Motor', 'Mid-drive'], ['Weight', '19 kg']].map(([a, b], i) => R(920, 530 + i * 54, 460, 1, te.ink, 'opacity=".2"') + T(920, 565 + i * 54, a, { f: 'hk', s: 18, w: 600, fill: te.ink }) + T(1380, 565 + i * 54, b, { f: 'hk', s: 18, w: 400, fill: te.ink, a: 'end' })).join('');
    s += R(920, 720, 460, 64, te.rust) + T(1150, 760, 'Configure yours', { f: 'hk', s: 19, w: 700, fill: te.cream, a: 'middle' });
    return s;
  };
  const teMob = (k) => {
    if (k === 0) return R(0, 0, 390, 844, te.sand) + C(300, 220, 60, te.rust) + hills(390, 844, 560) + teLogo(24, 74, 28, te.ink) + R(330, 54, 36, 2, te.ink) + R(330, 64, 36, 2, te.ink) + TL(24, 170, ['Ride further.', 'Arrive lighter.'], { s: 38, w: 800, st: 112, ls: -0.03, fill: te.ink, lh: 40 }) + bike(195, 520, 0.42) + R(24, 740, 342, 56, te.ink) + T(195, 775, 'Explore bikes', { f: 'hk', s: 16, w: 700, fill: te.cream, a: 'middle' });
    if (k === 1) return R(0, 0, 390, 844, te.cream) + R(0, 0, 390, 380, te.sand) + bike(195, 240, 0.4, te.rust, te.forest) + T(24, 440, 'Terra City', { s: 34, w: 800, st: 112, fill: te.ink }) + [te.rust, te.forest, te.sand].map((c, i) => C(40 + i * 44, 490, 14, c, `stroke="${te.ink}"`)).join('') + [['Range', '120 km'], ['Weight', '19 kg']].map(([a, b], i) => R(24, 530 + i * 50, 342, 1, te.ink, 'opacity=".2"') + T(24, 562 + i * 50, a, { f: 'hk', s: 16, w: 600, fill: te.ink }) + T(366, 562 + i * 50, b, { f: 'hk', s: 16, w: 400, fill: te.ink, a: 'end' })).join('') + R(24, 740, 342, 56, te.rust) + T(195, 775, 'Configure yours', { f: 'hk', s: 16, w: 700, fill: te.cream, a: 'middle' });
    return R(0, 0, 390, 844, te.forest) + teLogo(24, 74, 28, te.cream) + TL(24, 170, ['Book a', 'test ride'], { s: 44, w: 800, st: 112, fill: te.cream, lh: 46 }) + ['Name', 'Email', 'Nearest store', 'Preferred date'].map((t, i) => T(24, 300 + i * 96, t, { f: 'hk', s: 14, w: 600, fill: te.cream, o: 0.8 }) + `<rect x="24" y="${312 + i * 96}" width="342" height="48" fill="none" stroke="${te.cream}" stroke-opacity=".5"/>`).join('') + R(24, 740, 342, 56, te.rust) + T(195, 775, 'Request my ride', { f: 'hk', s: 16, w: 700, fill: te.cream, a: 'middle' });
  };

  PROJECTS.push({
    slug: 'terra', no: '11', title: 'Terra Cycles', category: 'Website & Digital Experience', group: 'Digital', tag: 'Concept Project',
    accent: te.rust, ink: te.ink, paper: te.sand,
    summary: 'Visual design for an e-bike brand’s website: a landscape-led homepage, a product page built for confident choices and a mobile test-ride flow.',
    deliverables: ['Homepage', 'Product detail page', 'Test-ride landing page', 'Mobile layouts', 'UI style tiles'],
    overview: 'Terra is a fictional e-bike company selling direct to consumers. The site has to inspire, help people compare models, and drive them to book a free test ride.',
    challenge: 'E-bikes are a large purchase made mostly online. The design needed to feel adventurous without hiding the practical details, and to keep one clear next step on every page.',
    audience: 'Commuters and weekend riders aged 30–55, many buying their first e-bike, who need reassurance on range, fit and support before committing.',
    direction: 'Open roads, clear paths. Flat, layered landscapes and a low sun set the mood. An expanded, confident headline face gives energy, and a steady grotesk handles specs. Rust orange is reserved for the primary action: book a test ride.',
    mood: ['Low sun', 'Layered hills', 'Practical adventure', 'One clear action'],
    fonts: [
      { name: 'Archivo Expanded ExtraBold', role: 'Logo & headlines', f: 'ar', w: 800, st: 112 },
      { name: 'Hanken Grotesk', role: 'Interface & specs', f: 'hk', w: 500, st: 100 }
    ],
    palette: [
      { name: 'Rust', hex: te.rust }, { name: 'Forest', hex: te.forest }, { name: 'Sand', hex: te.sand }, { name: 'Moss', hex: te.moss }, { name: 'Trail Ink', hex: te.ink }
    ],
    logo: (fg) => teLogo(0, 30, 150, fg, 'middle') + T(0, 90, 'ELECTRIC BIKES FOR REAL DISTANCES', { f: 'mo', s: 15, w: 500, ls: 0.26, fill: fg, a: 'middle' }),
    mark: (fg) => C(0, 0, 100, 'none', `stroke="${fg}" stroke-width="16"`) + C(0, -20, 34, te.rust) + R(-100, 10, 200, 16, fg),
    decisions: [
      { h: 'One action, one colour', p: 'Rust orange appears only on “Book a test ride” and “Configure”. Wherever visitors land, the next step is obvious.' },
      { h: 'Specs without stress', p: 'Range, motor and weight sit in a ruled list beside the bike, with size and colour selectors above. Comparing models takes seconds.' },
      { h: 'Mobile-first booking', p: 'The test-ride flow is four fields on one screen with large targets, built for someone deciding on their phone.' }
    ],
    cover: () => svg(1600, 1200, R(0, 0, 1600, 1200, te.forest) + browser({ x: 130, y: 140, w: 1160, h: 760, content: teHome(), vh: 2400, url: 'terra.example' }) + phone({ x: 1170, y: 400, w: 300, content: teMob(0) }) + grain(1600, 1200, 0.15), 'Terra website homepage and mobile'),
    plates: [
      { size: 'narrow', cap: 'Full homepage, long scroll.', art: () => svg(1000, 1600, R(0, 0, 1000, 1600, te.sand) + dropRect(120, 70, 760, 1266, 0.25, 20) + view(120, 70, 760, 1266, 1440, 2400, teHome()) + grain(1000, 1600, 0.12), 'Terra full homepage') },
      { size: 'wide', cap: 'Product page: choose colour and size, scan the specs, configure.', art: () => svg(1600, 1100, R(0, 0, 1600, 1100, '#D8CDB5') + browser({ x: 110, y: 100, w: 1380, h: 900, content: tePDP(), url: 'terra.example/bikes/city' }) + grain(1600, 1100, 0.12), 'Terra product page') },
      { size: 'full', cap: 'Mobile: home, product and test-ride booking.', art: () => svg(1600, 1000, R(0, 0, 1600, 1000, te.cream) + [0, 1, 2].map((k) => phone({ x: 290 + k * 360, y: k === 1 ? 80 : 120, w: 300, content: teMob(k), shadowO: 0.25 })).join('') + grain(1600, 1000, 0.1), 'Terra mobile screens') },
      { size: 'full', cap: 'UI style tile: type, colour, buttons and form fields.', art: () => {
        let s = R(0, 0, 1600, 700, te.cream);
        s += T(100, 140, 'Aa', { s: 160, w: 800, st: 112, fill: te.ink }) + T(100, 200, 'Archivo Expanded · 800', { f: 'mo', s: 16, w: 500, fill: te.ink, o: 0.6 });
        s += T(420, 140, 'Aa', { f: 'hk', s: 160, w: 500, fill: te.ink }) + T(420, 200, 'Hanken Grotesk · 400–700', { f: 'mo', s: 16, w: 500, fill: te.ink, o: 0.6 });
        [te.rust, te.forest, te.sand, te.moss, te.ink].forEach((c, i) => (s += R(820 + i * 140, 60, 120, 160, c)));
        s += R(100, 300, 240, 64, te.rust) + T(220, 340, 'Primary', { f: 'hk', s: 18, w: 700, fill: te.cream, a: 'middle' });
        s += R(370, 300, 240, 64, te.ink) + T(490, 340, 'Secondary', { f: 'hk', s: 18, w: 700, fill: te.cream, a: 'middle' });
        s += `<rect x="640" y="300" width="240" height="64" fill="none" stroke="${te.ink}" stroke-width="2"/>` + T(760, 340, 'Tertiary', { f: 'hk', s: 18, w: 700, fill: te.ink, a: 'middle' });
        s += T(100, 450, 'Email', { f: 'hk', s: 16, w: 600, fill: te.ink }) + `<rect x="100" y="466" width="500" height="56" fill="#fff" stroke="${te.ink}" stroke-opacity=".4"/>` + T(120, 501, 'you@example.com', { f: 'hk', s: 17, w: 400, fill: te.ink, o: 0.45 });
        s += T(640, 450, 'Nearest store', { f: 'hk', s: 16, w: 600, fill: te.ink }) + `<rect x="640" y="466" width="500" height="56" fill="#fff" stroke="${te.rust}" stroke-width="2"/>` + T(660, 501, 'Select a store', { f: 'hk', s: 17, w: 400, fill: te.ink }) + P('M1110,488 l10,10 l10,-10', 'none', `stroke="${te.ink}" stroke-width="2"`);
        s += R(1200, 300, 300, 300, te.sand) + bike(1350, 470, 0.32) + T(1220, 580, 'Product card', { f: 'hk', s: 16, w: 700, fill: te.ink });
        return svg(1600, 700, s, 'Terra UI style tile');
      } }
    ]
  });

  /* ======================================================================
     12 — ONDINE · Packaging & retail experience
     ====================================================================== */
  const on = { stone: '#D8D1C6', sea: '#3E6C70', sand: '#EAE1D3', clay: '#A9705A', deep: '#203130', mist: '#F4F1EC' };
  const wave = (w, c, sw = 2.5, n = 3, gap = 9) => Array.from({ length: n }, (_, i) => `<path d="M${-w / 2},${i * gap} q${w / 8},-7 ${w / 4},0 t${w / 4},0 t${w / 4},0 t${w / 4},0" fill="none" stroke="${c}" stroke-width="${sw}" stroke-linecap="round"/>`).join('');
  const onWord = (y, s, c) => T(0, y, 'ONDINE', { f: 'hk', s, w: 300, ls: 0.5, fill: c, a: 'middle' });
  const onLabel = (name, c, bg, s = 1) => G(`scale(${s})`, G('translate(0,-46)', wave(46, c, 2.2, 3, 8)) + onWord(6, 22, c) + T(0, 36, name, { f: 'is', s: 22, w: 400, fill: c, a: 'middle', it: true }) + T(0, 58, 'BATH & BODY RITUALS', { f: 'mo', s: 7, w: 500, ls: 0.2, fill: c, a: 'middle', o: 0.75 }));
  const onFamily = (cx, y, s = 1) =>
    pump({ x: cx - 260 * s, y, w: 130 * s, h: 330 * s, body: on.sea, cap: on.deep, art: onLabel('Body wash', on.mist, on.sea, s) }) +
    jar({ x: cx - 40 * s, y, w: 190 * s, h: 170 * s, body: on.sand, lid: on.clay, art: onLabel('Salt scrub', on.deep, on.sand, s * 0.8) }) +
    tube({ x: cx + 160 * s, y, w: 110 * s, h: 290 * s, color: on.clay, cap: on.deep, art: onLabel('Hand balm', on.mist, on.clay, s * 0.85) }) +
    box({ x: cx + 260 * s, y, w: 130 * s, h: 220 * s, d: 70 * s, front: on.mist, side: '#dcd6cc', top: '#fff', art: G(`rotate(-90) scale(${s})`, onWord(8, 24, on.deep)) });

  PROJECTS.push({
    slug: 'ondine', no: '12', title: 'Ondine Bath & Body', category: 'Packaging & Retail Experience', group: 'Packaging', tag: 'Concept Project',
    accent: on.sea, ink: on.deep, paper: on.sand,
    summary: 'A colour-coded packaging family and retail presence for a wellness brand: wave mark, tactile materials and a shelf that sorts itself by ritual.',
    deliverables: ['Packaging family', 'Label system', 'Retail shelf & display', 'Shopping bag & gift set'],
    overview: 'Ondine is a fictional bath and body brand built around simple daily rituals. The project covers the core product range, gift sets and an in-store shelf for department-store concessions.',
    challenge: 'Wellness shelves are a sea of beige minimalism. Ondine needed calm, natural packaging that is still easy to navigate: customers should find wash, scrub and balm without picking up every product.',
    audience: 'Self-care shoppers aged 28–50 who buy as a treat or a gift, value natural ingredients and respond to tactile, giftable packaging.',
    direction: 'Mineral calm. A three-line wave mark and a light, widely tracked wordmark keep the brand quiet. Each ritual owns a mineral colour (sea, sand, clay), so the shelf reads as a colour-coded system from a distance.',
    mood: ['Mineral calm', 'Sea & stone', 'Daily ritual', 'Colour as wayfinding'],
    fonts: [
      { name: 'Hanken Grotesk Light, tracked', role: 'Wordmark', f: 'hk', w: 300, st: 100 },
      { name: 'Instrument Serif Italic', role: 'Product names', f: 'is', w: 400, st: 100 }
    ],
    palette: [
      { name: 'Sea Glass', hex: on.sea }, { name: 'Sand', hex: on.sand }, { name: 'Clay', hex: on.clay }, { name: 'Deep Water', hex: on.deep }, { name: 'Mist', hex: on.mist }
    ],
    logo: (fg) => G('translate(0,-80)', wave(110, fg, 5, 3, 18)) + onWord(40, 76, fg) + T(0, 92, 'BATH & BODY RITUALS', { f: 'mo', s: 15, w: 500, ls: 0.3, fill: fg, a: 'middle' }),
    mark: (fg) => G('translate(0,-30)', wave(200, fg, 10, 3, 32)),
    decisions: [
      { h: 'Colour sorts the shelf', p: 'Sea for cleansing, sand for exfoliating, clay for nourishing. Customers navigate by colour first and read labels second.' },
      { h: 'Quiet logo, loud ritual', p: 'The wordmark stays small and light. The italic product name, such as “Body wash”, does the selling.' },
      { h: 'Built to be gifted', p: 'A rigid gift box, tissue printed with the wave and a structured bag make the purchase feel considered without plastic or excess inserts.' }
    ],
    cover: () => svg(1600, 1200,
      studio(1600, 1200, on.stone, '#C8BFB2', 0.74) +
      P('M980,140 L1300,140 L1300,560 A160,160 0 0 0 980,560Z', '#fff', 'opacity=".0"') +
      `<path d="M1010,120 L1290,120 L1290,620 L1010,620Z" fill="#F7F1E6" opacity=".35" filter="url(#gs-b40)"/>` +
      box({ x: 260, y: 1010, w: 1080, h: 120, d: 90, front: '#CDC4B7', side: '#B6AC9E', top: '#E0D9CE' }) +
      onFamily(760, 890, 1.15) + grain(1600, 1200, 0.3) + vignette(1600, 1200, 0.7), 'Ondine product family on stone'),
    plates: [
      { size: 'full', cap: 'Retail shelf, sorted by ritual colour.', art: () => {
        let s = R(0, 0, 1600, 1000, '#E9E4DB') + R(260, 60, 1080, 900, '#C6A989') + R(290, 90, 1020, 860, '#F1ECE3');
        s += R(290, 90, 1020, 120, on.deep) + G('translate(800,130)', wave(60, on.mist, 2.5, 3, 9)) + G('translate(800,170)', onWord(10, 30, on.mist));
        [440, 660, 900].forEach((y) => (s += R(290, y, 1020, 18, '#B69878') + R(290, y + 18, 1020, 10, '#000', 'opacity=".08"')));
        for (let i = 0; i < 6; i++) s += pump({ x: 370 + i * 160, y: 440, w: 90, h: 190, body: on.sea, cap: on.deep, art: onLabel('Body wash', on.mist, on.sea, 0.62) });
        for (let i = 0; i < 6; i++) s += jar({ x: 370 + i * 160, y: 660, w: 130, h: 120, body: on.sand, lid: on.clay, art: onLabel('Salt scrub', on.deep, on.sand, 0.5) });
        for (let i = 0; i < 8; i++) s += tube({ x: 350 + i * 128, y: 900, w: 80, h: 200, color: on.clay, cap: on.deep, art: onLabel('Hand balm', on.mist, on.clay, 0.55) });
        return svg(1600, 1000, s + grain(1600, 1000, 0.25) + vignette(1600, 1000, 0.6), 'Ondine retail shelf');
      } },
      { size: 'half', cap: 'Gift box, printed tissue and shopping bag.', art: () => {
        let s = R(0, 0, 1200, 1000, on.sea);
        s += box({ x: 640, y: 880, w: 380, h: 560, d: 160, front: on.mist, side: '#d9d3c9', top: '#fff', art: G('translate(0,40)', G('translate(0,-50)', wave(70, on.deep, 3, 3, 11)) + onWord(10, 40, on.deep) + T(0, 50, 'BATH & BODY RITUALS', { f: 'mo', s: 10, w: 500, ls: 0.2, fill: on.deep, a: 'middle' })) });
        s += `<path d="M760,320 C760,220 900,220 900,320" fill="none" stroke="${on.deep}" stroke-width="10"/>`;
        s += box({ x: 120, y: 880, w: 440, h: 180, d: 220, front: on.clay, side: shade(on.clay, 0.2), top: tint(on.clay, 0.1), art: onWord(10, 34, on.mist) });
        s += G('translate(180,500) rotate(-6)', R(0, 0, 420, 200, on.sand) + Array.from({ length: 10 }, (_, j) => G(`translate(${(j % 5) * 90 + 40},${Math.floor(j / 5) * 90 + 50})`, wave(40, on.sea, 2, 3, 7))).join(''));
        return svg(1200, 1000, s + grain(1200, 1000, 0.25) + vignette(1200, 1000, 0.6), 'Ondine gift packaging');
      } },
      { size: 'half', cap: 'Label system: one layout, three rituals.', art: () => {
        let s = R(0, 0, 1200, 1000, on.mist);
        [[on.sea, on.mist, 'Body wash', 'CLEANSE'], [on.sand, on.deep, 'Salt scrub', 'EXFOLIATE'], [on.clay, on.mist, 'Hand balm', 'NOURISH']].forEach(([bg, fg, n, r], i) => {
          const x = 90 + i * 350;
          s += dropRect(x, 170, 320, 560, 0.15, 20) + R(x, 170, 320, 560, bg) + G(`translate(${x + 160},400)`, onLabel(n, fg, bg, 2.1)) + T(x + 160, 690, r, { f: 'mo', s: 15, w: 500, ls: 0.3, fill: fg, a: 'middle' });
          s += T(x, 790, n.toUpperCase(), { f: 'mo', s: 14, w: 500, ls: 0.2, fill: on.deep }) + T(x, 815, 'Ritual colour + italic name', { f: 'hk', s: 15, w: 400, fill: on.deep, o: 0.6 });
        });
        return svg(1200, 1000, s, 'Ondine label system');
      } }
    ]
  });
})();
