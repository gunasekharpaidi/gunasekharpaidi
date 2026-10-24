/* ==========================================================================
   Projects 01–06. Each project = content (copy, palette, type) + artwork.
   To edit copy, change the strings below. To swap a visual for a real
   image, give a plate an `img: 'assets/img/your-file.jpg'` instead of `art`.
   ========================================================================== */
(function () {
  const { T, TL, svg, R, C, P, G, view, grain, vignette, shadow, studio, dropRect, cup, pouch, bottle, box, jar, paper, phone, browser, spread, bladeSign, shade, tint, mix, halftone } = ArtKit;
  const PROJECTS = (window.PROJECTS = window.PROJECTS || []);

  /* ======================================================================
     01 — FERRO COFFEE ROASTERS · Brand identity
     ====================================================================== */
  const fe = { esp: '#2A1B13', crema: '#E9DAC4', red: '#C7381F', milk: '#F7F2EA', char: '#171311', sand: '#D9C5A8' };
  const feMark = (r, fill, cut) =>
    C(0, 0, r, fill) + `<path d="M${-r * 0.12},${-r * 0.8} C${r * 0.46},${-r * 0.3} ${-r * 0.46},${r * 0.3} ${r * 0.12},${r * 0.8}" fill="none" stroke="${cut}" stroke-width="${r * 0.17}" stroke-linecap="round"/>`;
  const feWord = (x, y, s, fill, a = 'middle') => T(x, y, 'FERRO', { s, w: 900, st: 125, ls: 0.04, fill, a });
  const feLockup = (fg, bg) => G('translate(0,-46)', feMark(58, fg, bg)) + feWord(0, 84, 76, fg) + T(0, 122, 'COFFEE ROASTERS', { f: 'mo', s: 17, w: 500, ls: 0.34, fill: fg, a: 'middle' });
  const fePouchArt = (fg, bg, roast, origin, dots) =>
    G('translate(0,-120)', feMark(44, fg, bg)) + feWord(0, -18, 62, fg) +
    T(0, 14, 'COFFEE ROASTERS', { f: 'mo', s: 12, w: 500, ls: 0.3, fill: fg, a: 'middle' }) +
    `<line x1="-120" y1="54" x2="120" y2="54" stroke="${fg}" stroke-opacity=".35" stroke-width="1.5"/>` +
    T(0, 92, roast, { s: 22, w: 800, st: 112, ls: 0.06, fill: fg, a: 'middle' }) +
    T(0, 120, origin, { f: 'mo', s: 13, w: 400, ls: 0.12, fill: fg, a: 'middle', o: 0.8 }) +
    [0, 1, 2].map((i) => C(-28 + i * 28, 160, 8, i < dots ? fg : 'none', `stroke="${fg}" stroke-width="2"`)).join('') +
    T(0, 214, 'WHOLE BEAN · 250 G', { f: 'mo', s: 11, w: 500, ls: 0.2, fill: fg, a: 'middle', o: 0.75 });

  PROJECTS.push({
    slug: 'ferro', no: '01', title: 'Ferro Coffee Roasters', category: 'Brand Identity', group: 'Branding', tag: 'Concept Project',
    accent: fe.red, ink: fe.esp, paper: fe.crema,
    summary: 'A confident identity for a small-batch roastery: one circular mark, one expanded wordmark, and a packaging system that reads roast level at a glance.',
    deliverables: ['Logo & mark', 'Typography', 'Colour system', 'Packaging', 'Takeaway cups', 'Signage', 'Stationery'],
    overview: 'Ferro is a fictional specialty roastery opening its first café-roastery. The identity needed to feel crafted without leaning on rustic coffee clichés, and to work as hard on a 250 g bag as on a shopfront.',
    challenge: 'Specialty coffee shelves are crowded with hand-drawn illustrations and kraft paper. The brief was a brand that looks premium and modern, stays recognisable at small sizes, and lets customers tell roasts apart without reading the fine print.',
    audience: 'Urban coffee drinkers aged 25–45 who care about origin and roast, plus café visitors who are new to specialty coffee and need gentle guidance.',
    direction: 'Industrial warmth. The mark is a coffee bean reduced to a circle and a single cut, the same gesture as the slot on a roaster’s drum. An expanded, heavy wordmark adds weight, while a monospaced utility face handles origin data like a roasting log.',
    mood: ['Industrial warmth', 'Roasting log', 'Iron & crema', 'Precise, not precious'],
    fonts: [
      { name: 'Archivo Expanded Black', role: 'Wordmark & headlines', f: 'ar', w: 900, st: 125 },
      { name: 'IBM Plex Mono', role: 'Origin data & labels', f: 'mo', w: 500, st: 100 }
    ],
    palette: [
      { name: 'Roast Red', hex: fe.red }, { name: 'Espresso', hex: fe.esp }, { name: 'Crema', hex: fe.crema }, { name: 'Steamed Milk', hex: fe.milk }, { name: 'Char', hex: fe.char }
    ],
    logo: (fg, bg) => feLockup(fg, bg),
    mark: (fg, bg) => feMark(80, fg, bg),
    decisions: [
      { h: 'One cut, many uses', p: 'The slit in the mark doubles as a graphic device: it becomes the seam on cup sleeves and the divider on menus, so the brand stays consistent without adding new elements.' },
      { h: 'Roast you can see', p: 'Each roast owns a bag colour and a three-dot scale. A customer can choose light, medium or dark from across the counter.' },
      { h: 'Data as decoration', p: 'Origin, process and weight are set in monospace like a roasting log. The information becomes texture and builds trust through transparency.' }
    ],
    cover: () => svg(1600, 1200,
      studio(1600, 1200, '#E6D4BA', fe.sand, 0.7) +
      G('translate(1080,440)', feMark(330, fe.red, '#E6D4BA'), 'opacity=".95"') +
      pouch({ x: 560, y: 1010, w: 340, h: 540, color: fe.esp, art: fePouchArt(fe.crema, fe.esp, 'HOUSE ESPRESSO', 'BRAZIL · COLOMBIA', 3) }) +
      cup({ x: 905, y: 1020, h: 440, body: fe.milk, sleeve: fe.red, lid: fe.char, sleeveArt: feWord(0, 16, 48, fe.milk) }) +
      cup({ x: 1165, y: 1025, h: 270, body: fe.esp, lid: fe.char, art: G('translate(0,-6)', feMark(34, fe.crema, fe.esp)) }) +
      grain(1600, 1200, 0.3) + vignette(1600, 1200), 'Ferro coffee packaging and takeaway cups'),
    plates: [
      { size: 'full', cap: 'Shopfront: fascia, striped awning and a hanging blade sign carrying the mark.', art: () => {
        let s = R(0, 0, 1600, 1000, '#E2D0B4') + R(0, 0, 1600, 230, fe.char);
        s += feWord(800, 160, 120, fe.milk);
        s += R(150, 300, 900, 560, '#2B1A12');
        s += `<radialGradient id="feglow" cx=".5" cy=".3" r=".7"><stop offset="0" stop-color="#F5B66A" stop-opacity=".55"/><stop offset="1" stop-color="#F5B66A" stop-opacity="0"/></radialGradient>`;
        s += R(150, 300, 900, 560, 'url(#feglow)');
        [330, 600, 870].forEach((x) => (s += `<line x1="${x}" y1="300" x2="${x}" y2="470" stroke="#000" stroke-width="2" opacity=".5"/>` + C(x, 488, 26, '#F8C27C') + C(x, 500, 80, '#F8C27C', 'opacity=".18" filter="url(#gs-b20)"')));
        s += R(150, 700, 900, 160, '#1c120d', 'opacity=".75"');
        s += G('translate(260,620)', feMark(44, fe.milk, '#3a2418')) + T(320, 610, 'FERRO', { s: 34, w: 900, st: 125, fill: fe.milk }) + T(320, 640, 'SPECIALTY COFFEE · ROASTED ON SITE', { f: 'mo', s: 15, w: 500, ls: 0.2, fill: fe.milk, o: 0.85 });
        s += R(150, 300, 900, 560, 'url(#gs-sheen)');
        s += `<rect x="150" y="300" width="900" height="560" fill="none" stroke="${fe.char}" stroke-width="14"/>`;
        for (let i = 0; i < 24; i++) s += R(130 + i * 39.2, 250, 39.2, 90, i % 2 ? fe.milk : fe.red);
        for (let i = 0; i < 24; i++) s += P(`M${130 + i * 39.2},340 q19.6,34 39.2,0Z`, i % 2 ? fe.milk : fe.red);
        s += R(130, 250, 940, 110, 'url(#gs-horizon)', 'opacity=".5"');
        s += dropRect(150, 360, 900, 30, 0.35, 20, 0, 0);
        s += R(1140, 300, 300, 600, fe.red) + R(1170, 330, 240, 300, '#2B1A12', 'opacity=".85"') + R(1170, 660, 240, 210, shade(fe.red, 0.15)) + C(1380, 640, 9, fe.milk);
        s += bladeSign({ cx: 1505, cy: 420, r: 72, face: fe.red, art: feMark(46, fe.milk, fe.red) });
        s += R(0, 880, 1600, 120, '#A39686') + R(0, 880, 1600, 10, '#8D8173');
        s += grain(1600, 1000, 0.3) + vignette(1600, 1000, 0.8);
        return svg(1600, 1000, s, 'Ferro shopfront signage');
      } },
      { size: 'wide', cap: 'Packaging system: three roasts, three colours, one three-dot roast scale.', art: () => svg(1600, 1000,
        studio(1600, 1000, '#F1E7D7', '#E1CFB5', 0.72) +
        pouch({ x: 400, y: 900, w: 300, h: 480, color: fe.crema, seal: '#d8c6ac', art: fePouchArt(fe.esp, fe.crema, 'LIGHT ROAST', 'ETHIOPIA · GUJI', 1) }) +
        pouch({ x: 800, y: 900, w: 300, h: 480, color: fe.red, art: fePouchArt(fe.milk, fe.red, 'MEDIUM ROAST', 'COLOMBIA · HUILA', 2) }) +
        pouch({ x: 1200, y: 900, w: 300, h: 480, color: fe.esp, art: fePouchArt(fe.crema, fe.esp, 'DARK ROAST', 'HOUSE ESPRESSO', 3) }) +
        grain(1600, 1000, 0.28) + vignette(1600, 1000, 0.8), 'Ferro coffee bag range') },
      { size: 'narrow', cap: 'Takeaway cups in three sizes share one sleeve.', art: () => svg(1000, 1250,
        studio(1000, 1250, fe.char, '#241c18', 0.72) +
        T(80, 140, 'TAKEAWAY', { f: 'mo', s: 22, w: 500, ls: 0.3, fill: fe.crema, o: 0.6 }) +
        cup({ x: 250, y: 1080, h: 280, body: fe.milk, sleeve: fe.red, lid: '#0d0b0a', sleeveArt: feWord(0, 10, 30, fe.milk) }) +
        cup({ x: 500, y: 1090, h: 370, body: fe.crema, sleeve: fe.esp, lid: '#0d0b0a', sleeveArt: feWord(0, 14, 40, fe.crema) }) +
        cup({ x: 770, y: 1100, h: 450, body: fe.red, sleeve: fe.milk, lid: '#0d0b0a', sleeveArt: feWord(0, 16, 48, fe.red) }) +
        [['8 OZ', 250], ['12 OZ', 500], ['16 OZ', 770]].map(([t, x]) => T(x, 1190, t, { f: 'mo', s: 20, w: 500, ls: 0.2, fill: fe.crema, a: 'middle', o: 0.7 })).join('') +
        grain(1000, 1250, 0.3) + vignette(1000, 1250, 0.9), 'Ferro cups in three sizes') },
      { size: 'half', cap: 'Loyalty card, business cards and stickers.', art: () => svg(1200, 1000,
        R(0, 0, 1200, 1000, fe.red) +
        paper({ x: 120, y: 140, w: 520, h: 300, rot: -8, bg: fe.milk, content: G('translate(260,140) scale(.85)', feLockup(fe.esp, fe.milk)) }) +
        paper({ x: 640, y: 120, w: 440, h: 260, rot: 6, bg: fe.esp, content:
          T(40, 70, 'Head of Roasting', { s: 26, w: 700, st: 112, fill: fe.crema }) + T(40, 104, 'Ferro Roastery & Café', { f: 'mo', s: 15, w: 400, fill: fe.crema, o: 0.75 }) +
          T(40, 196, 'Unit 4, Mill Lane', { f: 'mo', s: 15, w: 400, fill: fe.crema, o: 0.75 }) + G('translate(380,200)', feMark(28, fe.red, fe.esp)) }) +
        paper({ x: 200, y: 540, w: 640, h: 360, rot: 4, bg: fe.crema, content:
          T(40, 70, 'TEN CUPS, ONE ON US', { s: 30, w: 900, st: 125, fill: fe.esp }) + T(40, 104, 'LOYALTY CARD', { f: 'mo', s: 14, w: 500, ls: 0.3, fill: fe.esp, o: 0.7 }) +
          Array.from({ length: 10 }, (_, i) => { const x = 80 + (i % 5) * 120, y = 190 + Math.floor(i / 5) * 110; return C(x, y, 38, 'none', `stroke="${fe.esp}" stroke-width="2" stroke-dasharray="4 6"`) + (i < 4 ? G(`translate(${x},${y}) rotate(${i * 23 - 20})`, feMark(30, fe.red, fe.crema)) : ''); }).join('') }) +
        G('translate(960,720)', C(0, 6, 110, '#000', 'opacity=".25" filter="url(#gs-b8)"') + C(0, 0, 110, fe.milk) + feMark(70, fe.esp, fe.milk)) +
        G('translate(1010,520) rotate(12)', C(0, 4, 70, '#000', 'opacity=".25" filter="url(#gs-b8)"') + C(0, 0, 70, fe.esp) + feWord(0, 10, 26, fe.crema)) +
        grain(1200, 1000, 0.3) + vignette(1200, 1000, 0.6), 'Ferro stationery and loyalty card') },
      { size: 'half', cap: 'Brand pattern: the mark’s cut repeated as a wrapping and tissue print.', art: () => {
        let s = R(0, 0, 1200, 1000, fe.esp);
        for (let j = 0; j < 9; j++) for (let i = 0; i < 11; i++) s += G(`translate(${i * 120 + (j % 2) * 60},${j * 120}) rotate(${(i + j) % 2 ? 0 : 180})`, `<path d="M-6,-40 C23,-15 -23,15 6,40" fill="none" stroke="${(i * 3 + j) % 7 === 0 ? fe.red : fe.crema}" stroke-width="12" stroke-linecap="round"/>`);
        s += R(380, 380, 440, 240, fe.red) + feWord(600, 520, 80, fe.milk) + T(600, 566, 'ROASTED ON SITE', { f: 'mo', s: 16, w: 500, ls: 0.3, fill: fe.milk, a: 'middle' });
        return svg(1200, 1000, s + grain(1200, 1000, 0.3), 'Ferro brand pattern');
      } }
    ]
  });

  /* ======================================================================
     02 — AUREL · Luxury fragrance packaging
     ====================================================================== */
  const au = { onyx: '#11100E', champ: '#D8C3A0', smoke: '#8B857D', ivory: '#F2ECE2', amber: '#B5702B', fumee: '#5B4E45' };
  const auMono = (r, c, sw = 1.5) => C(0, 0, r, 'none', `stroke="${c}" stroke-width="${sw}"`) + T(0, r * 0.36, 'A', { f: 'cg', s: r * 1.15, w: 500, fill: c, a: 'middle' });
  const auWord = (y, s, c) => T(0, y, 'AUREL', { f: 'cg', s, w: 500, ls: 0.42, fill: c, a: 'middle' });
  const auLabel = (no, name, c = au.onyx, bg = au.ivory, w = 150, h = 190) =>
    R(-w / 2, -h / 2, w, h, bg) + `<rect x="${-w / 2 + 7}" y="${-h / 2 + 7}" width="${w - 14}" height="${h - 14}" fill="none" stroke="${c}" stroke-opacity=".5" stroke-width="1"/>` +
    auWord(-h / 2 + 46, w * 0.17, c) + T(0, -h / 2 + 68, 'MAISON DE PARFUM', { f: 'mo', s: w * 0.045, w: 400, ls: 0.2, fill: c, a: 'middle', o: 0.7 }) +
    T(0, 14, no, { f: 'cg', s: w * 0.2, w: 400, fill: c, a: 'middle', it: true }) + T(0, 40, name, { f: 'cg', s: w * 0.12, w: 600, ls: 0.14, fill: c, a: 'middle' }) +
    T(0, h / 2 - 22, 'EAU DE PARFUM · 50 ML', { f: 'mo', s: w * 0.042, w: 400, ls: 0.16, fill: c, a: 'middle', o: 0.75 });
  const plinth = (cx, y, w, h, c) => box({ x: cx - w / 2, y, w, h, d: 60, front: c, side: shade(c, 0.2), top: tint(c, 0.15) });

  PROJECTS.push({
    slug: 'aurel', no: '02', title: 'Aurel Parfums', category: 'Luxury Packaging', group: 'Packaging', tag: 'Concept Project',
    accent: au.champ, ink: au.onyx, paper: au.ivory, dark: true,
    summary: 'Packaging for a niche fragrance house: heavy glass, numbered scents and quiet typography that lets material and light do the work.',
    deliverables: ['Bottle & cap design', 'Labels', 'Outer cartons', 'Material specification', 'Product photography direction'],
    overview: 'Aurel is a fictional fragrance house launching three scents. The packaging had to justify a premium price before the bottle is opened, and stay calm and editorial next to louder designer brands.',
    challenge: 'Luxury fragrance often relies on gold and ornament. The aim was restraint: build a sense of value from proportion, typography and tactile finishes, then use one numbering system to tie the collection together.',
    audience: 'Fragrance enthusiasts aged 28–50 who buy niche perfume as a considered purchase and value craft, provenance and understatement.',
    direction: 'Quiet weight. A high-contrast serif set with generous tracking. A thin-ruled label that recalls apothecary cards. Each scent carries a number before a name, so the collection reads as a body of work.',
    mood: ['Quiet weight', 'Apothecary card', 'Smoke & amber', 'Light through glass'],
    fonts: [
      { name: 'Cormorant Garamond', role: 'Wordmark & scent names', f: 'cg', w: 500, st: 100 },
      { name: 'IBM Plex Mono', role: 'Regulatory & volume', f: 'mo', w: 400, st: 100 }
    ],
    palette: [
      { name: 'Onyx', hex: au.onyx }, { name: 'Champagne', hex: au.champ }, { name: 'Ivory Card', hex: au.ivory }, { name: 'Ambre', hex: au.amber }, { name: 'Fumée', hex: au.fumee }
    ],
    logo: (fg) => G('translate(0,-60)', auMono(46, fg)) + auWord(70, 64, fg) + T(0, 108, 'MAISON DE PARFUM', { f: 'mo', s: 15, w: 400, ls: 0.34, fill: fg, a: 'middle' }),
    mark: (fg) => auMono(80, fg, 2.5),
    decisions: [
      { h: 'Number before name', p: 'Nº 01, Nº 02, Nº 03 give the line a collectable, archival feel and leave room for future scents without redesigning the system.' },
      { h: 'Value through material', p: 'Soft-touch black board, a single champagne foil and a heavy glass base communicate cost by touch rather than ornament.' },
      { h: 'One label, three moods', p: 'The label stays identical while the liquid colour changes, so the juice becomes the hero of each scent.' }
    ],
    cover: () => {
      let s = R(0, 0, 1600, 1200, '#171512') + `<ellipse cx="800" cy="420" rx="620" ry="520" fill="url(#gs-spot)" opacity=".45"/>` + R(0, 900, 1600, 300, '#0d0c0b');
      s += box({ x: 300, y: 905, w: 300, h: 420, d: 120, front: '#151412', side: '#0b0a09', top: '#22201d', art: G('translate(0,-60)', auMono(40, au.champ)) + auWord(40, 40, au.champ) + T(0, 70, 'Nº 01 · AMBRE NOIR', { f: 'mo', s: 12, w: 400, ls: 0.2, fill: au.champ, a: 'middle', o: 0.8 }) });
      s += plinth(900, 960, 520, 160, '#3a352f');
      s += bottle({ x: 900, y: 780, w: 280, h: 340, glass: '#E8DFCF', liquid: au.amber, cap: au.champ, capH: 130, art: auLabel('Nº 01', 'AMBRE NOIR') });
      s += grain(1600, 1200, 0.35) + vignette(1600, 1200);
      return svg(1600, 1200, s, 'Aurel fragrance bottle on a stone plinth');
    },
    plates: [
      { size: 'full', cap: 'The collection: one label system, three liquids.', art: () => svg(1600, 1000,
        studio(1600, 1000, au.ivory, '#E2D9CB', 0.74) +
        plinth(420, 920, 300, 120, '#D9CFC0') + plinth(800, 920, 300, 200, '#CFC4B3') + plinth(1180, 920, 300, 80, '#D9CFC0') +
        bottle({ x: 420, y: 800, w: 200, h: 250, glass: '#ECE6DB', liquid: au.amber, cap: au.onyx, capH: 95, art: auLabel('Nº 01', 'AMBRE NOIR', au.onyx, au.ivory, 116, 146) }) +
        bottle({ x: 800, y: 720, w: 200, h: 250, glass: '#E6E1DA', liquid: '#8F8780', cap: au.onyx, capH: 95, art: auLabel('Nº 02', 'FUMÉE', au.onyx, au.ivory, 116, 146) }) +
        bottle({ x: 1180, y: 840, w: 200, h: 250, glass: '#F0EBE2', liquid: '#E3CFA9', cap: au.onyx, capH: 95, art: auLabel('Nº 03', 'LUMIÈRE', au.onyx, au.ivory, 116, 146) }) +
        grain(1600, 1000, 0.3) + vignette(1600, 1000, 0.7), 'Aurel fragrance collection') },
      { size: 'half', cap: 'Label typography, printed letterpress on cotton card.', art: () => {
        let s = R(0, 0, 1200, 1000, '#E9E2D6');
        s += paper({ x: 170, y: 90, w: 860, h: 820, bg: au.ivory, o: 0.18, content:
          `<rect x="30" y="30" width="800" height="760" fill="none" stroke="${au.onyx}" stroke-width="1.5"/>` +
          G('translate(430,0)', auWord(150, 84, au.onyx) + T(0, 196, 'MAISON DE PARFUM', { f: 'mo', s: 16, w: 400, ls: 0.34, fill: au.onyx, a: 'middle' }) +
            T(0, 400, 'Nº 02', { f: 'cg', s: 150, w: 400, it: true, fill: au.onyx, a: 'middle' }) +
            T(0, 480, 'FUMÉE', { f: 'cg', s: 64, w: 600, ls: 0.3, fill: au.onyx, a: 'middle' }) +
            `<line x1="-140" y1="540" x2="140" y2="540" stroke="${au.onyx}" stroke-width="1"/>` +
            T(0, 590, 'Bergamot · Pink pepper', { f: 'cg', s: 26, w: 500, it: true, fill: au.onyx, a: 'middle' }) +
            T(0, 626, 'Iris · Soft leather', { f: 'cg', s: 26, w: 500, it: true, fill: au.onyx, a: 'middle' }) +
            T(0, 662, 'Vetiver · Smoked birch', { f: 'cg', s: 26, w: 500, it: true, fill: au.onyx, a: 'middle' }) +
            T(0, 750, 'EAU DE PARFUM · 50 ML · 1.7 FL OZ', { f: 'mo', s: 14, w: 400, ls: 0.2, fill: au.onyx, a: 'middle', o: 0.7 })) });
        return svg(1200, 1000, s + grain(1200, 1000, 0.35), 'Aurel label typography');
      } },
      { size: 'half', cap: 'Soft-touch carton with champagne foil, and its bottle.', art: () => svg(1200, 1000,
        studio(1200, 1000, '#2A2621', '#1C1916', 0.75) + `<ellipse cx="600" cy="380" rx="520" ry="420" fill="url(#gs-spot)" opacity=".3"/>` +
        box({ x: 220, y: 860, w: 320, h: 460, d: 130, front: '#141311', side: '#0a0908', top: '#24211d', art: G('translate(0,-70)', auMono(44, au.champ)) + auWord(40, 44, au.champ) + T(0, 76, 'Nº 02 · FUMÉE', { f: 'mo', s: 13, w: 400, ls: 0.2, fill: au.champ, a: 'middle', o: 0.85 }) }) +
        bottle({ x: 820, y: 860, w: 250, h: 300, glass: '#E6E1DA', liquid: '#8F8780', cap: au.champ, capH: 115, art: auLabel('Nº 02', 'FUMÉE', au.onyx, au.ivory, 140, 176) }) +
        grain(1200, 1000, 0.35) + vignette(1200, 1000), 'Aurel carton and bottle') },
      { size: 'full', cap: 'Material specification: every surface is chosen for touch.', art: () => {
        let s = R(0, 0, 1600, 700, '#ECE5D9');
        const sw = [
          ['COTTON BOARD', '600 GSM · UNCOATED', au.ivory, 'ivory'], ['SOFT-TOUCH BLACK', 'LAMINATE · 450 GSM', '#141311', 'dark'],
          ['CHAMPAGNE FOIL', 'HOT STAMP · MATTE', au.champ, 'foil'], ['SMOKED GLASS', 'HEAVY BASE · 12 MM', '#8F8780', 'glass']
        ];
        sw.forEach(([a, b, c, k], i) => {
          const x = 110 + i * 350;
          s += dropRect(x, 110, 300, 380, 0.22, 20);
          s += R(x, 110, 300, 380, c);
          if (k === 'foil') s += `<linearGradient id="aufoil"><stop offset="0" stop-color="#fff" stop-opacity=".0"/><stop offset=".45" stop-color="#fff" stop-opacity=".45"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/></linearGradient>` + R(x, 110, 300, 380, 'url(#aufoil)');
          if (k === 'glass') s += R(x, 110, 300, 380, 'url(#gs-glass)');
          if (k === 'dark') s += G(`translate(${x + 150},300)`, auMono(50, au.champ));
          if (k === 'ivory') s += G(`translate(${x + 150},300)`, auMono(50, au.onyx, 1));
          s += T(x, 550, a, { f: 'mo', s: 18, w: 500, ls: 0.18, fill: au.onyx }) + T(x, 580, b, { f: 'mo', s: 15, w: 400, ls: 0.12, fill: au.onyx, o: 0.6 });
        });
        return svg(1600, 700, s + grain(1600, 700, 0.3), 'Aurel material swatches');
      } }
    ]
  });

  /* ======================================================================
     03 — LINNE HOME · E-commerce campaign
     ====================================================================== */
  const li = { linen: '#E8E0D2', sage: '#8C9A83', clay: '#B4664A', bark: '#3B3029', chalk: '#FAF7F1', oat: '#D6C8B2' };
  const liLogo = (x, y, s, c, a = 'start') => T(x, y, 'linne', { f: 'is', s, w: 400, fill: c, a, ls: -0.01 });
  const vase = (x, y, s, c, kind = 0) => {
    const d = [
      'M-.3,0 C-.48,-.3 -.44,-.62 -.16,-.76 L-.12,-.98 L.12,-.98 L.16,-.76 C.44,-.62 .48,-.3 .3,0Z',
      'M-.22,0 L-.26,-.6 C-.26,-.8 -.1,-.86 -.08,-1.1 L.08,-1.1 C.1,-.86 .26,-.8 .26,-.6 L.22,0Z',
      'M-.42,0 C-.5,-.18 -.46,-.4 -.3,-.46 L.3,-.46 C.46,-.4 .5,-.18 .42,0Z'
    ][kind];
    return shadow(x + s * 0.08, y, s * 0.4, s * 0.04, 0.35, 8) + G(`translate(${x},${y}) scale(${s})`, P(d, c) + P(d, 'url(#gs-cyl)'));
  };
  const stem = (x, y, h, c) => {
    let s = `<path d="M${x},${y} C${x + 10},${y - h * 0.4} ${x - 30},${y - h * 0.7} ${x - 10},${y - h}" fill="none" stroke="${c}" stroke-width="3"/>`;
    for (let i = 1; i < 9; i++) { const t = i / 9; const px = x - 10 * t - Math.sin(t * 3) * 14, py = y - h * t; s += `<ellipse cx="${px + (i % 2 ? 16 : -16)}" cy="${py}" rx="16" ry="6" fill="${c}" transform="rotate(${i % 2 ? -30 : 30} ${px} ${py})"/>`; }
    return s;
  };
  const linenStack = (x, y, w, cols) => cols.map((c, i) => `<rect x="${x + (i % 2) * 6}" y="${y - (i + 1) * 34}" width="${w}" height="34" rx="12" fill="${c}"/><rect x="${x + (i % 2) * 6}" y="${y - (i + 1) * 34}" width="${w}" height="34" rx="12" fill="url(#gs-soft)"/>`).join('') + shadow(x + w / 2, y + 4, w * 0.55, 8, 0.3, 8);
  /* campaign photograph: still life against a clay wall */
  const liScene = (w, h, wall = li.clay) => {
    const fy = h * 0.72;
    let s = R(0, 0, w, h, wall) + `<ellipse cx="${w * 0.7}" cy="${h * 0.25}" rx="${w * 0.5}" ry="${h * 0.5}" fill="url(#gs-spot)" opacity=".35"/>` + R(0, fy, w, h - fy, shade(wall, 0.16));
    s += box({ x: w * 0.18, y: h * 0.86, w: w * 0.58, h: h * 0.14, d: h * 0.12, front: li.linen, side: shade(li.linen, 0.15), top: tint(li.linen, 0.3) });
    s += stem(w * 0.36, h * 0.6, h * 0.42, '#5d6650');
    s += vase(w * 0.36, h * 0.72, h * 0.32, li.chalk, 1) + vase(w * 0.55, h * 0.72, h * 0.22, li.sage, 0) + vase(w * 0.68, h * 0.72, h * 0.18, li.bark, 2);
    return s + grain(w, h, 0.25);
  };
  const liHome = () => {
    let s = R(0, 0, 1440, 1800, li.chalk);
    s += liLogo(64, 66, 40, li.bark) + ['Shop', 'Collections', 'Journal', 'Stores'].map((t, i) => T(520 + i * 130, 60, t, { f: 'hk', s: 17, w: 500, fill: li.bark })).join('') + T(1300, 60, 'Bag (0)', { f: 'hk', s: 17, w: 500, fill: li.bark });
    s += R(0, 100, 1440, 1, li.oat);
    s += T(64, 200, 'NEW SEASON CAMPAIGN', { f: 'mo', s: 14, w: 500, ls: 0.22, fill: li.clay });
    s += TL(60, 330, ['The Slow', 'Season'], { f: 'is', s: 150, w: 400, fill: li.bark, lh: 140 });
    s += TL(64, 520, ['Washed linen, hand-thrown stoneware and', 'quiet objects for unhurried homes.'], { f: 'hk', s: 22, w: 400, fill: li.bark, lh: 34, o: 0.8 });
    s += `<rect x="64" y="600" width="250" height="60" fill="${li.bark}"/>` + T(189, 637, 'Shop the collection', { f: 'hk', s: 17, w: 600, fill: li.chalk, a: 'middle' });
    s += T(350, 637, 'Read the journal →', { f: 'hk', s: 17, w: 600, fill: li.bark });
    s += view(720, 130, 680, 640, 680, 640, liScene(680, 640));
    s += T(64, 870, 'Bestsellers', { f: 'is', s: 46, w: 400, fill: li.bark });
    [[li.sage, 'Fold Vase', '£48'], [li.linen, 'Linen Throw', '£96'], [li.clay, 'Ember Bowl', '£32'], [li.oat, 'Ritual Cup', '£18']].forEach(([c, n, p], i) => {
      const x = 64 + i * 334;
      s += R(x, 900, 310, 360, i % 2 ? '#EFE9DE' : li.linen);
      s += i === 1 ? linenStack(x + 70, 1210, 170, [li.oat, li.sage, li.linen, li.clay]) : vase(x + 155, 1210, i === 3 ? 160 : 230, c, i === 2 ? 2 : i === 3 ? 2 : 0);
      s += T(x, 1300, n, { f: 'hk', s: 19, w: 600, fill: li.bark }) + T(x + 310, 1300, p, { f: 'hk', s: 19, w: 500, fill: li.bark, a: 'end' });
    });
    return s;
  };
  const liMobile = () => {
    let s = R(0, 0, 390, 844, li.chalk) + liLogo(24, 70, 28, li.bark) + `<rect x="330" y="52" width="36" height="2" fill="${li.bark}"/><rect x="330" y="62" width="36" height="2" fill="${li.bark}"/>`;
    s += view(0, 96, 390, 400, 680, 640, liScene(680, 640));
    s += T(24, 540, 'NEW SEASON', { f: 'mo', s: 11, w: 500, ls: 0.22, fill: li.clay }) + TL(22, 600, ['The Slow', 'Season'], { f: 'is', s: 58, w: 400, fill: li.bark, lh: 56 });
    s += `<rect x="24" y="700" width="342" height="54" fill="${li.bark}"/>` + T(195, 733, 'Shop the collection', { f: 'hk', s: 16, w: 600, fill: li.chalk, a: 'middle' });
    return s;
  };
  const liBanner = (w, h, layout) => {
    let s = R(0, 0, w, h, li.linen);
    if (layout === 'wide') {
      s += view(w - h * 1.6, 0, h * 1.6, h, 680, 640, liScene(680, 640));
      s += liLogo(h * 0.25, h * 0.36, h * 0.2, li.bark) + T(h * 0.25, h * 0.66, 'The Slow Season', { f: 'is', s: h * 0.26, w: 400, fill: li.bark });
      s += `<rect x="${h * 0.25}" y="${h * 0.76}" width="${h * 0.9}" height="${h * 0.14}" fill="${li.bark}"/>` + T(h * 0.25 + h * 0.45, h * 0.855, 'Shop now', { f: 'hk', s: h * 0.06, w: 600, fill: li.chalk, a: 'middle' });
    } else if (layout === 'strip') {
      s += view(w - h * 2.4, 0, h * 2.4, h, 680, 640, liScene(680, 640));
      s += liLogo(20, h * 0.66, h * 0.4, li.bark) + T(140, h * 0.64, 'The Slow Season · New linen & stoneware', { f: 'hk', s: h * 0.2, w: 500, fill: li.bark });
    } else if (layout === 'tall') {
      s += view(0, h * 0.4, w, h * 0.6, 680, 640, liScene(680, 640));
      s += liLogo(w / 2, h * 0.08, w * 0.2, li.bark, 'middle') + TL(w / 2, h * 0.18, ['The', 'Slow', 'Season'], { f: 'is', s: w * 0.22, w: 400, fill: li.bark, a: 'middle', lh: w * 0.21 });
      s += `<rect x="${w * 0.15}" y="${h * 0.32}" width="${w * 0.7}" height="${w * 0.2}" fill="${li.bark}"/>` + T(w / 2, h * 0.32 + w * 0.125, 'Shop', { f: 'hk', s: w * 0.08, w: 600, fill: li.chalk, a: 'middle' });
    } else {
      s += view(0, 0, w, h * 0.62, 680, 640, liScene(680, 640));
      s += T(w * 0.07, h * 0.78, 'The Slow Season', { f: 'is', s: w * 0.1, w: 400, fill: li.bark }) + T(w * 0.07, h * 0.9, 'New linen & stoneware →', { f: 'hk', s: w * 0.045, w: 600, fill: li.bark });
      s += liLogo(w * 0.93, h * 0.9, w * 0.07, li.clay, 'end');
    }
    return s;
  };

  PROJECTS.push({
    slug: 'linne', no: '03', title: 'Linne Home — The Slow Season', category: 'E-commerce Campaign', group: 'Campaigns', tag: 'Concept Project',
    accent: li.clay, ink: li.bark, paper: li.linen,
    summary: 'A seasonal campaign for a home-goods label, built as one still-life world that adapts cleanly from homepage hero to a 160-pixel skyscraper.',
    deliverables: ['Campaign concept', 'Homepage takeover', 'Display banner suite', 'Social product ads', 'Mobile web'],
    overview: 'Linne is a fictional online store for linen and stoneware. “The Slow Season” launches the autumn collection across the website, paid display and social.',
    challenge: 'E-commerce creative has to sell product clearly at very small sizes without looking like a discount flyer. The campaign needed one memorable image language that still works when cropped to a leaderboard.',
    audience: 'Design-aware homeowners and renters aged 27–45 who shop online for considered, long-lasting objects and respond to calm, editorial imagery.',
    direction: 'Still life, warm shadow. Every asset starts from the same set-up: a clay wall, a linen plinth and three vessels. A soft serif carries the campaign line, and a single dark button keeps the call to action obvious.',
    mood: ['Still life', 'Clay & linen', 'Unhurried', 'Clear call to action'],
    fonts: [
      { name: 'Instrument Serif', role: 'Logo & campaign line', f: 'is', w: 400, st: 100 },
      { name: 'Hanken Grotesk', role: 'Interface & product copy', f: 'hk', w: 500, st: 100 }
    ],
    palette: [
      { name: 'Clay', hex: li.clay }, { name: 'Linen', hex: li.linen }, { name: 'Sage', hex: li.sage }, { name: 'Bark', hex: li.bark }, { name: 'Chalk', hex: li.chalk }
    ],
    logo: (fg) => T(0, 30, 'linne', { f: 'is', s: 150, w: 400, fill: fg, a: 'middle' }) + T(0, 84, 'HOME · EST. FOR SLOW LIVING', { f: 'mo', s: 15, w: 500, ls: 0.3, fill: fg, a: 'middle' }),
    mark: (fg) => T(0, 50, 'l', { f: 'is', s: 220, w: 400, fill: fg, a: 'middle' }),
    decisions: [
      { h: 'One set, every size', p: 'A single still-life composition is art-directed with crop zones, so the same image works as a 16:9 hero, a square ad and a skyscraper.' },
      { h: 'Calm sells, too', p: 'Instead of red sale badges, urgency comes from the campaign name and a high-contrast button. The brand stays premium while the action stays clear.' },
      { h: 'Product first on mobile', p: 'The mobile hero leads with the image and keeps the button within thumb reach. Most campaign traffic arrives from social on a phone.' }
    ],
    cover: () => svg(1600, 1200,
      R(0, 0, 1600, 1200, li.oat) + browser({ x: 150, y: 150, w: 1150, h: 760, content: liHome(), vh: 900, url: 'linne.example/the-slow-season' }) +
      ArtKit.phone({ x: 1170, y: 420, w: 300, content: liMobile() }) + grain(1600, 1200, 0.2), 'Linne campaign homepage and mobile'),
    plates: [
      { size: 'full', cap: 'Display suite: billboard, leaderboard, medium rectangle and skyscraper from one art direction.', art: () => {
        let s = R(0, 0, 1600, 1000, '#F2EDE4');
        const b = (x, y, w, h, l) => dropRect(x, y, w, h, 0.18, 8, 0, 6) + view(x, y, w, h, w, h, liBanner(w, h, l)) + T(x, y + h + 30, `${w} × ${h}`, { f: 'mo', s: 14, w: 500, fill: li.bark, o: 0.55 });
        s += b(90, 90, 970, 250, 'wide') + b(90, 420, 728, 90, 'strip') + b(90, 590, 300, 250, 'mpu') + b(440, 590, 300, 250, 'mpu') + b(1180, 90, 300, 600, 'tall');
        return svg(1600, 1000, s, 'Linne display banner suite');
      } },
      { size: 'half', cap: 'Social product ads, 1080 × 1080.', art: () => {
        let s = R(0, 0, 1200, 1000, li.sage);
        const sq = (x, y, rot, inner) => paper({ x, y, w: 460, h: 460, rot, vw: 1080, vh: 1080, content: inner, o: 0.25 });
        s += sq(100, 80, -4, R(0, 0, 1080, 1080, li.linen) + view(0, 0, 1080, 760, 680, 640, liScene(680, 640, li.sage)) + T(70, 900, 'Fold Vase, in sage', { f: 'is', s: 84, w: 400, fill: li.bark }) + T(70, 990, 'Hand-thrown stoneware · Shop now', { f: 'hk', s: 36, w: 500, fill: li.bark, o: 0.8 }));
        s += sq(640, 120, 3, R(0, 0, 1080, 1080, li.bark) + TL(80, 300, ['Linen,', 'washed', 'slow.'], { f: 'is', s: 190, w: 400, fill: li.chalk, lh: 180 }) + linenStack(640, 1000, 340, [li.oat, li.sage, li.linen, li.clay, li.chalk]) + liLogo(80, 1000, 60, li.chalk));
        s += sq(360, 470, 1, view(0, 0, 1080, 1080, 680, 640, liScene(680, 640)) + R(0, 820, 1080, 260, li.chalk) + T(70, 940, 'The Slow Season', { f: 'is', s: 90, w: 400, fill: li.bark }) + T(70, 1020, 'New collection, now online →', { f: 'hk', s: 36, w: 600, fill: li.clay }));
        return svg(1200, 1000, s + grain(1200, 1000, 0.2), 'Linne social ads');
      } },
      { size: 'half', cap: 'Mobile homepage and launch email.', art: () => {
        const email = () => R(0, 0, 390, 844, li.chalk) + liLogo(195, 60, 30, li.bark, 'middle') + view(0, 90, 390, 330, 680, 640, liScene(680, 640, li.sage)) +
          T(195, 480, 'Slow down with us', { f: 'is', s: 38, w: 400, fill: li.bark, a: 'middle' }) +
          TL(195, 520, ['Our autumn collection is here: washed', 'linen and new stoneware glazes.'], { f: 'hk', s: 14, w: 400, fill: li.bark, a: 'middle', lh: 21, o: 0.8 }) +
          `<rect x="105" y="580" width="180" height="46" fill="${li.bark}"/>` + T(195, 609, 'Explore', { f: 'hk', s: 15, w: 600, fill: li.chalk, a: 'middle' }) +
          R(24, 660, 165, 160, li.linen) + R(201, 660, 165, 160, li.oat) + vase(106, 800, 110, li.clay, 0) + linenStack(232, 800, 100, [li.sage, li.linen, li.clay]);
        return svg(1200, 1000, R(0, 0, 1200, 1000, li.linen) + ArtKit.phone({ x: 230, y: 90, w: 340, content: liMobile(), rot: -4 }) + ArtKit.phone({ x: 640, y: 120, w: 340, content: email(), rot: 3 }) + grain(1200, 1000, 0.15), 'Linne mobile and email');
      } }
    ]
  });

  /* ======================================================================
     04 — VOLTA STUDIO · Social media campaign
     ====================================================================== */
  const vo = { black: '#0C0C0D', chrome: '#C8CBD0', pink: '#FF3E8A', white: '#F5F5F2', graph: '#2A2A2D' };
  const voLogo = (x, y, s, c, a = 'start', slash = vo.pink) => `<text x="${x}" y="${y}" font-size="${s}" text-anchor="${a}" style="font-family:Syne,sans-serif;font-weight:800;letter-spacing:-.02em"><tspan fill="${c}">VOLTA</tspan><tspan fill="${slash}">/</tspan></text>`;
  const tee = (x, y, s, c) => G(`translate(${x},${y}) scale(${s})`, shadow(6, 12, 100, 120, 0.35, 20) + P('M-40,-100 C-30,-86 30,-86 40,-100 L100,-74 L124,-20 L84,-4 L80,-28 L80,104 L-80,104 L-80,-28 L-84,-4 L-124,-20 L-100,-74Z', c) + P('M-40,-100 C-30,-80 30,-80 40,-100', 'none', `stroke="#000" stroke-opacity=".25" stroke-width="3"`) + P('M-40,-100 C-30,-86 30,-86 40,-100 L100,-74 L124,-20 L84,-4 L80,-28 L80,104 L-80,104 L-80,-28 L-84,-4 L-124,-20 L-100,-74Z', 'url(#gs-soft)'));
  const scan = (w, h, c, o = 0.12, gap = 8) => { let s = ''; for (let y = 0; y < h; y += gap) s += R(0, y, w, 2, c, `opacity="${o}"`); return s; };
  const staticWord = (x, y, s, c, a = 'start') => `<text x="${x}" y="${y}" font-size="${s}" text-anchor="${a}" fill="${c}" style="font-family:Syne,sans-serif;font-weight:800;letter-spacing:-.04em">STATIC</text>`;
  /* posts drawn in a 1080 square */
  const voPost = (k) => {
    let s = '';
    if (k === 0) s = R(0, 0, 1080, 1080, vo.pink) + staticWord(540, 610, 190, vo.black, 'middle') + scan(1080, 1080, vo.black, 0.1, 10) + voLogo(60, 1010, 48, vo.black, 'start', vo.white) + T(1020, 1010, 'DROP 03', { f: 'mo', s: 30, w: 500, fill: vo.black, a: 'end' });
    if (k === 1) s = R(0, 0, 1080, 1080, vo.black) + tee(540, 560, 3.1, vo.chrome) + T(540, 600, 'STATIC', { f: 'sy', s: 86, w: 800, fill: vo.black, a: 'middle' }) + T(60, 100, 'HEAVYWEIGHT TEE · CHROME', { f: 'mo', s: 28, w: 500, fill: vo.white }) + voLogo(1020, 1010, 48, vo.white, 'end');
    if (k === 2) s = R(0, 0, 1080, 1080, vo.chrome) + TL(60, 360, ['07.11', '10:00'], { f: 'sy', s: 250, w: 800, fill: vo.black, lh: 240 }) + T(60, 900, 'SAVE THE DATE — DROP 03', { f: 'mo', s: 34, w: 500, fill: vo.black }) + R(60, 940, 960, 6, vo.pink);
    if (k === 3) s = R(0, 0, 1080, 1080, vo.white) + halftone(0, 0, 1080, 1080, 26, vo.black, 12, (u, v) => Math.max(0, 1 - Math.hypot(u - 0.5, v - 0.5) * 1.9)) + C(540, 540, 170, vo.pink) + T(540, 572, '03', { f: 'sy', s: 120, w: 800, fill: vo.black, a: 'middle' });
    if (k === 4) s = R(0, 0, 1080, 1080, vo.graph) + tee(330, 560, 2, vo.pink) + tee(760, 560, 2, vo.white) + T(60, 1010, 'TWO COLOURS. ONE CHARGE.', { f: 'mo', s: 30, w: 500, fill: vo.white });
    if (k === 5) s = R(0, 0, 1080, 1080, vo.black) + TL(60, 300, ['Wear', 'the', 'noise.'], { f: 'sy', s: 230, w: 800, fill: vo.white, lh: 220 }) + C(900, 900, 70, vo.pink) + scan(1080, 1080, vo.white, 0.05, 10);
    return s;
  };
  const voStory = (k) => {
    let s = '';
    if (k === 0) s = R(0, 0, 390, 844, vo.black) + scan(390, 844, vo.white, 0.06, 6) + `<text x="195" y="470" font-size="140" text-anchor="middle" fill="${vo.pink}" transform="rotate(-90 195 422)" style="font-family:Syne,sans-serif;font-weight:800;letter-spacing:-.04em">STATIC</text>` + voLogo(24, 800, 26, vo.white);
    if (k === 1) s = R(0, 0, 390, 844, vo.pink) + T(195, 300, '03', { f: 'sy', s: 220, w: 800, fill: vo.black, a: 'middle' }) + T(195, 360, 'DAYS TO DROP', { f: 'mo', s: 18, w: 500, fill: vo.black, a: 'middle' }) + R(40, 640, 310, 56, vo.black) + T(195, 675, 'REMIND ME', { f: 'mo', s: 16, w: 600, fill: vo.white, a: 'middle', ls: 0.2 });
    if (k === 2) s = R(0, 0, 390, 844, vo.chrome) + tee(195, 420, 1.3, vo.black) + T(24, 110, 'OUT NOW', { f: 'sy', s: 64, w: 800, fill: vo.black }) + R(24, 720, 342, 56, vo.pink) + T(195, 755, 'SHOP DROP 03 →', { f: 'mo', s: 16, w: 600, fill: vo.black, a: 'middle', ls: 0.15 });
    if (k === 3) s = R(0, 0, 390, 844, vo.white) + TL(24, 200, ['BEHIND', 'THE', 'NOISE'], { f: 'sy', s: 76, w: 800, fill: vo.black, lh: 72 }) + halftone(0, 440, 390, 404, 14, vo.pink, 6, (u, v) => v) + T(24, 800, 'REEL · 0:42', { f: 'mo', s: 14, w: 500, fill: vo.black });
    return s + R(16, 18, 358, 3, '#fff', 'opacity=".5"');
  };

  PROJECTS.push({
    slug: 'volta', no: '04', title: 'Volta Studio — Drop 03 “Static”', category: 'Social Media Campaign', group: 'Campaigns', tag: 'Concept Project',
    accent: vo.pink, ink: vo.black, paper: vo.chrome, dark: true,
    summary: 'A launch campaign for a streetwear label’s third drop: a type-led grid, countdown stories and reels covers that feel like one continuous signal.',
    deliverables: ['Campaign concept', 'Instagram grid', 'Stories & countdown', 'Reels covers', 'Launch announcement'],
    overview: 'Volta is a fictional streetwear studio releasing limited drops. “Static” is Drop 03: two heavyweight tees and a jacket, launched entirely through Instagram.',
    challenge: 'Drops live or die in the feed. The campaign had to build anticipation over two weeks, look deliberate as a 3 × 3 grid, and stay unmistakable when a single post appears out of context.',
    audience: 'Style-led 18–30 year-olds who follow small labels, screenshot release dates and expect a brand to have a distinct visual voice.',
    direction: 'Electric interference. A wide, heavy display face, scan-line textures and halftone dots suggest a broadcast signal. Pink is used like a warning light, only where the eye should land first.',
    mood: ['Broadcast signal', 'Interference', 'Loud, then quiet', 'Grid as a poster'],
    fonts: [
      { name: 'Syne ExtraBold', role: 'Logo & display', f: 'sy', w: 800, st: 100 },
      { name: 'IBM Plex Mono', role: 'Drop data & captions', f: 'mo', w: 500, st: 100 }
    ],
    palette: [
      { name: 'Signal Pink', hex: vo.pink }, { name: 'Black Noise', hex: vo.black }, { name: 'Chrome', hex: vo.chrome }, { name: 'Static White', hex: vo.white }, { name: 'Graphite', hex: vo.graph }
    ],
    logo: (fg, bg) => voLogo(0, 30, 92, fg, 'middle', bg === vo.pink ? vo.black : vo.pink) + T(0, 90, 'STUDIO · LIMITED DROPS', { f: 'mo', s: 16, w: 500, ls: 0.3, fill: fg, a: 'middle' }),
    mark: (fg, bg) => `<text x="0" y="60" font-size="170" text-anchor="middle" style="font-family:Syne,sans-serif;font-weight:800"><tspan fill="${fg}">V</tspan><tspan fill="${bg === vo.pink ? vo.black : vo.pink}">/</tspan></text>`,
    decisions: [
      { h: 'The grid is a poster', p: 'Posts were planned in sets of three so the profile reads as one composition on launch day, while each tile still works alone in the feed.' },
      { h: 'Countdown as content', p: 'Stories turn the release date into a ritual: a teaser, a three-day countdown with a reminder sticker, then “Out now” with a direct shop link.' },
      { h: 'Pink means act', p: 'Pink is reserved for the drop number and calls to action. The rest of the system stays black, chrome and white so the signal never turns into noise.' }
    ],
    cover: () => svg(1600, 1200,
      R(0, 0, 1600, 1200, vo.black) + scan(1600, 1200, vo.white, 0.04, 8) +
      `<text x="800" y="720" font-size="300" text-anchor="middle" fill="none" stroke="${vo.graph}" stroke-width="3" style="font-family:Syne,sans-serif;font-weight:800;letter-spacing:-.04em">STATIC</text>` +
      ArtKit.phone({ x: 330, y: 230, w: 290, content: voStory(0), rot: -6, shadowO: 0.6 }) +
      ArtKit.phone({ x: 655, y: 170, w: 290, content: voStory(1), shadowO: 0.6 }) +
      ArtKit.phone({ x: 980, y: 230, w: 290, content: voStory(2), rot: 6, shadowO: 0.6 }) + grain(1600, 1200, 0.25), 'Volta Instagram stories'),
    plates: [
      { size: 'full', cap: 'Launch-day grid: six posts planned as one composition.', art: () => {
        let s = R(0, 0, 1600, 1000, vo.graph);
        [0, 1, 2, 3, 4, 5].forEach((k, i) => { const x = 140 + (i % 3) * 450, y = 70 + Math.floor(i / 3) * 450; s += dropRect(x, y, 420, 420, 0.4, 20, 0, 16) + view(x, y, 420, 420, 1080, 1080, voPost(k)); });
        return svg(1600, 1000, s + grain(1600, 1000, 0.2), 'Volta Instagram grid');
      } },
      { size: 'wide', cap: 'Reels covers, 9:16.', art: () => {
        let s = R(0, 0, 1600, 1000, vo.chrome);
        [3, 0, 1, 2].forEach((k, i) => { const x = 130 + i * 350; s += dropRect(x, 140, 310, 671, 0.3, 20, 0, 18) + view(x, 140, 310, 671, 390, 844, voStory(k)); });
        return svg(1600, 1000, s + grain(1600, 1000, 0.2), 'Volta reels covers');
      } },
      { size: 'narrow', cap: 'Profile view on launch day.', art: () => {
        const prof = () => {
          let s = R(0, 0, 390, 844, '#fff') + C(60, 120, 36, vo.black) + T(60, 128, 'V/', { f: 'sy', s: 24, w: 800, fill: vo.pink, a: 'middle' });
          s += T(116, 110, 'volta.studio', { f: 'hk', s: 17, w: 700, fill: '#111' }) + T(116, 134, 'Limited drops. Drop 03 out now.', { f: 'hk', s: 13, w: 400, fill: '#444' });
          s += R(16, 170, 358, 34, '#eee', 'rx="8"') + T(195, 192, 'Follow', { f: 'hk', s: 14, w: 700, fill: '#111', a: 'middle' });
          [0, 1, 2, 3, 4, 5, 2, 0, 5].forEach((k, i) => (s += view(1 + (i % 3) * 130, 220 + Math.floor(i / 3) * 130, 128, 128, 1080, 1080, voPost(k))));
          return s;
        };
        return svg(1000, 1250, R(0, 0, 1000, 1250, vo.pink) + scan(1000, 1250, vo.black, 0.06, 10) + ArtKit.phone({ x: 280, y: 160, w: 440, content: prof(), shadowO: 0.5 }), 'Volta Instagram profile');
      } },
      { size: 'full', cap: 'Launch announcement, adapted for a wide banner.', art: () => svg(1600, 640,
        R(0, 0, 1600, 640, vo.black) + scan(1600, 640, vo.white, 0.05, 8) + staticWord(70, 390, 170, vo.white) +
        R(1150, 0, 450, 640, vo.pink) + tee(1375, 330, 1.6, vo.black) +
        T(76, 540, 'DROP 03 · 07.11 · 10:00 · VOLTA.STUDIO', { f: 'mo', s: 28, w: 500, ls: 0.12, fill: vo.chrome }) + voLogo(76, 120, 50, vo.white) + grain(1600, 640, 0.2), 'Volta launch banner') }
    ]
  });

  /* ======================================================================
     05 — SAFFRON & SALT · Food & beverage branding
     ====================================================================== */
  const sa = { saff: '#E8A23A', teal: '#0F4E4C', chili: '#B23A28', cream: '#F3E8D5', ink: '#1F1A15', leaf: '#5E7D4E' };
  const saFlower = (r, c, core) => {
    let s = '';
    for (let i = 0; i < 8; i++) s += `<ellipse cx="0" cy="${-r * 0.55}" rx="${r * 0.2}" ry="${r * 0.45}" fill="${c}" transform="rotate(${i * 45})"/>`;
    return s + C(0, 0, r * 0.22, core);
  };
  const saWord = (x, y, s, c, a = 'middle') => T(x, y, 'Saffron & Salt', { f: 'is', s, w: 400, fill: c, a });
  const saPattern = (w, h, bg, c1, c2, step = 120) => {
    let s = R(0, 0, w, h, bg);
    for (let y = 0, j = 0; y < h + step; y += step, j++) for (let x = (j % 2) * step / 2; x < w + step; x += step) s += G(`translate(${x},${y})`, saFlower(step * 0.3, c1, c2)) + C(x + step / 2, y, step * 0.05, c2);
    return s;
  };
  const saMenu = () => {
    let s = R(0, 0, 900, 1260, sa.cream) + G('translate(450,120)', saFlower(50, sa.saff, sa.chili)) + saWord(450, 250, 74, sa.ink) + T(450, 290, 'MODERN INDIAN KITCHEN', { f: 'mo', s: 15, w: 500, ls: 0.3, fill: sa.teal, a: 'middle' });
    const sec = (y, title, items) => T(90, y, title, { f: 'ar', s: 20, w: 800, st: 112, ls: 0.12, fill: sa.chili }) + R(90, y + 16, 720, 1.5, sa.ink, 'opacity=".25"') +
      items.map(([n, d, p], i) => T(90, y + 64 + i * 70, n, { f: 'is', s: 30, w: 400, fill: sa.ink }) + T(810, y + 64 + i * 70, p, { f: 'ar', s: 20, w: 600, fill: sa.ink, a: 'end' }) + T(90, y + 90 + i * 70, d, { f: 'hk', s: 15, w: 400, fill: sa.ink, o: 0.65 })).join('');
    s += sec(370, 'SMALL PLATES', [['Smoked aubergine bharta', 'Charred over coals, curd, crisp onion', '9'], ['Beetroot & coconut tikki', 'Tamarind, mint, pomegranate', '8'], ['Chilli paneer ribbons', 'Pickled shallot, curry leaf', '10']]);
    s += sec(650, 'FROM THE TANDOOR', [['Saffron chicken tikka', 'Hung yoghurt, kasuri methi', '15'], ['Malai broccoli', 'Cardamom cream, toasted almond', '12']]);
    s += sec(860, 'CURRIES & BREADS', [['Kerala fish moilee', 'Coconut, turmeric, green chilli', '17'], ['Black dal, slow cooked', 'Overnight, butter, smoke', '11'], ['Garlic & nigella naan', 'From the tandoor', '4']]);
    return s + T(450, 1210, 'Please tell us about any allergies before ordering.', { f: 'hk', s: 14, w: 400, fill: sa.ink, a: 'middle', o: 0.6 });
  };

  PROJECTS.push({
    slug: 'saffron', no: '05', title: 'Saffron & Salt', category: 'Food & Beverage Branding', group: 'Branding', tag: 'Concept Project',
    accent: sa.saff, ink: sa.ink, paper: sa.cream,
    summary: 'Identity for a modern Indian restaurant: a saffron-flower mark, a block-print pattern system and menus that make a long list of dishes easy to read.',
    deliverables: ['Logo & pattern', 'Menus', 'Takeaway packaging', 'Signage', 'Promotional posters'],
    overview: 'Saffron & Salt is a fictional restaurant serving regional Indian food with a contemporary kitchen approach. The brand covers everything from the shopfront to takeaway bags.',
    challenge: 'Indian restaurant branding often relies on ornate decoration or generic spice imagery. This brief asked for a brand that feels rooted and generous yet modern, and that stays legible on busy menus and small packaging.',
    audience: 'Diners aged 25–55 who know and love Indian food and want a more contemporary dining room, alongside curious newcomers ordering takeaway for the first time.',
    direction: 'Modern block print. The saffron crocus becomes an eight-petal stamp that repeats into pattern, like hand-block textiles. A warm serif gives hospitality, and a deep peacock teal grounds the bright saffron and chilli.',
    mood: ['Block-print textiles', 'Saffron light', 'Generous table', 'Contemporary kitchen'],
    fonts: [
      { name: 'Instrument Serif', role: 'Wordmark & dish names', f: 'is', w: 400, st: 100 },
      { name: 'Archivo Semi-Expanded', role: 'Section heads & prices', f: 'ar', w: 800, st: 112 }
    ],
    palette: [
      { name: 'Saffron', hex: sa.saff }, { name: 'Peacock Teal', hex: sa.teal }, { name: 'Chilli', hex: sa.chili }, { name: 'Rice Paper', hex: sa.cream }, { name: 'Tamarind Ink', hex: sa.ink }
    ],
    logo: (fg) => G('translate(0,-70)', saFlower(56, sa.saff, sa.chili)) + saWord(0, 60, 86, fg) + T(0, 104, 'MODERN INDIAN KITCHEN', { f: 'mo', s: 15, w: 500, ls: 0.32, fill: fg, a: 'middle' }),
    mark: () => saFlower(110, sa.saff, sa.chili),
    decisions: [
      { h: 'A stamp, not an illustration', p: 'The flower is built from eight identical petals, so it can be printed as a single-colour stamp, embossed or repeated as pattern without losing detail.' },
      { h: 'Menus read like a story', p: 'Dish names lead in serif, descriptions follow in a light sans, and prices align to one edge. Diners scan by dish, not by price.' },
      { h: 'Pattern carries the brand', p: 'On packaging, the pattern does the brand recognition and the logo stays small, so bags and boxes are instantly recognisable on a delivery driver’s seat.' }
    ],
    cover: () => {
      let s = R(0, 0, 1600, 1200, sa.teal) + `<rect width="1600" height="1200" fill="url(#gs-vig)"/>`;
      s += paper({ x: 260, y: 120, w: 600, h: 840, rot: -6, vw: 900, vh: 1260, content: saMenu(), bg: sa.cream, o: 0.4 });
      s += G('translate(1150,420)', C(10, 20, 230, '#000', 'opacity=".4" filter="url(#gs-b20)"') + C(0, 0, 230, '#f7f1e6') + C(0, 0, 190, '#ede3d2') + C(0, 0, 175, sa.chili) + C(-50, -40, 60, '#e2b35b') + C(60, 20, 50, '#f3e8d5') + C(-20, 70, 40, sa.leaf) + C(70, -70, 30, '#7c2a1d'));
      s += G('translate(1180,880) rotate(8)', dropRect(-180, -150, 360, 300, 0.4, 20) + view(-180, -150, 360, 300, 360, 300, saPattern(360, 300, sa.saff, sa.chili, sa.cream, 90)) + R(-180, -40, 360, 80, sa.cream) + saWord(0, 14, 40, sa.ink));
      s += G('translate(820,1040) rotate(-4)', C(0, 6, 90, '#000', 'opacity=".35" filter="url(#gs-b8)"') + C(0, 0, 90, sa.saff) + saFlower(50, sa.cream, sa.chili));
      return svg(1600, 1200, s + grain(1600, 1200, 0.35), 'Saffron & Salt menu, plate and packaging');
    },
    plates: [
      { size: 'narrow', cap: 'The dinner menu: serif dish names, aligned prices.', art: () => svg(1000, 1250, R(0, 0, 1000, 1250, '#D8C7AA') + paper({ x: 110, y: 70, w: 780, h: 1092, vw: 900, vh: 1260, content: saMenu(), bg: sa.cream, o: 0.3 }) + grain(1000, 1250, 0.3), 'Saffron & Salt menu') },
      { size: 'wide', cap: 'Takeaway bag, box and house chutneys.', art: () => {
        const bag = (x, y) => box({ x, y, w: 330, h: 440, d: 140, front: sa.cream, side: '#d9cdb7', top: '#e9dfcc', art: view(-165, -220, 330, 300, 330, 300, saPattern(330, 300, sa.teal, sa.saff, sa.chili, 82)) + R(-165, 80, 330, 140, sa.cream) + saWord(0, 150, 38, sa.ink) + T(0, 184, 'TAKEAWAY', { f: 'mo', s: 12, w: 500, ls: 0.3, fill: sa.teal, a: 'middle' }) }) +
          `<path d="M${x + 110},${y - 440} C${x + 110},${y - 540} ${x + 220},${y - 540} ${x + 220},${y - 440}" fill="none" stroke="${shade(sa.cream, 0.3)}" stroke-width="10"/>`;
        const jl = (name, c) => R(-70, -60, 140, 120, sa.cream) + G('translate(0,-26)', saFlower(18, c, sa.ink)) + T(0, 16, name, { f: 'is', s: 22, w: 400, fill: sa.ink, a: 'middle' }) + T(0, 42, '200 G', { f: 'mo', s: 10, w: 500, ls: 0.2, fill: sa.ink, a: 'middle', o: 0.6 });
        return svg(1600, 1000, studio(1600, 1000, '#E9DCC4', '#D8C7AA', 0.72) + bag(170, 900) +
          box({ x: 640, y: 910, w: 300, h: 150, d: 220, front: sa.saff, side: shade(sa.saff, 0.2), top: tint(sa.saff, 0.1), art: saWord(0, 12, 34, sa.ink), topArt: '' }) +
          jar({ x: 1100, y: 910, w: 170, h: 230, body: sa.chili, lid: sa.ink, art: jl('Tamarind', sa.chili) }) +
          jar({ x: 1300, y: 910, w: 170, h: 230, body: sa.leaf, lid: sa.ink, art: jl('Green chilli', sa.leaf) }) +
          jar({ x: 1200, y: 960, w: 170, h: 200, body: sa.saff, lid: sa.ink, art: jl('Mango', sa.saff) }) +
          grain(1600, 1000, 0.3) + vignette(1600, 1000, 0.7), 'Saffron & Salt takeaway packaging');
      } },
      { size: 'half', cap: 'Hand-painted wall sign and blade sign.', art: () => {
        let s = R(0, 0, 1200, 1000, sa.saff) + R(0, 0, 1200, 1000, 'url(#gs-vig)');
        for (let i = 0; i < 40; i++) s += R(0, i * 25, 1200, 1, sa.ink, 'opacity=".05"');
        s += G('translate(520,380)', G('translate(0,-150)', saFlower(90, sa.teal, sa.chili)) + saWord(0, 70, 120, sa.teal) + T(0, 130, 'MODERN INDIAN KITCHEN · OPEN DAILY', { f: 'mo', s: 20, w: 500, ls: 0.3, fill: sa.teal, a: 'middle' }));
        s += bladeSign({ cx: 1020, cy: 380, r: 110, face: sa.teal, art: saFlower(70, sa.saff, sa.cream) });
        s += R(0, 760, 1200, 240, '#6b4b2f') + R(0, 760, 1200, 12, '#4d3420');
        s += G('translate(300,980)', box({ x: -120, y: 0, w: 240, h: 340, d: 30, front: '#1f2422', side: '#121514', top: '#2a302e', art: T(0, -100, 'Today', { f: 'is', s: 46, w: 400, fill: sa.cream, a: 'middle' }) + T(0, -50, 'THALI LUNCH', { f: 'ar', s: 22, w: 800, st: 112, fill: sa.saff, a: 'middle' }) + TL(0, 0, ['Two curries, dal,', 'rice, raita, bread'], { f: 'hk', s: 18, w: 400, fill: sa.cream, a: 'middle', lh: 26 }) + G('translate(0,100)', saFlower(26, sa.saff, sa.chili)) }));
        return svg(1200, 1000, s + grain(1200, 1000, 0.35), 'Saffron & Salt signage');
      } },
      { size: 'half', cap: 'Promotional posters for a weekly supper club.', art: () => {
        const poster = (bg, fg, title, sub) => saPattern(700, 1000, bg, fg, sa.cream, 140) + R(60, 520, 580, 420, sa.cream) + TL(100, 640, title, { f: 'is', s: 92, w: 400, fill: sa.ink, lh: 88 }) + T(100, 880, sub, { f: 'mo', s: 18, w: 500, ls: 0.16, fill: sa.chili }) + G('translate(560,880)', saFlower(26, sa.saff, sa.chili));
        return svg(1200, 1000, R(0, 0, 1200, 1000, '#cfc6b8') + paper({ x: 110, y: 90, w: 470, h: 671, rot: -2, vw: 700, vh: 1000, content: poster(sa.teal, sa.saff, ['Thali', 'Thursdays'], 'EVERY THURSDAY · 6 PM'), o: 0.3 }) +
          paper({ x: 620, y: 200, w: 470, h: 671, rot: 2.5, vw: 700, vh: 1000, content: poster(sa.chili, sa.saff, ['Monsoon', 'Menu'], 'FOUR COURSES · BOOK NOW'), o: 0.3 }) + grain(1200, 1000, 0.3), 'Saffron & Salt posters');
      } }
    ]
  });

  /* ======================================================================
     06 — FORMA · Editorial design
     ====================================================================== */
  const fo = { paper: '#EFEBE4', ink: '#121212', orange: '#FF5B1F', concrete: '#B9B3AA', shadow: '#6E6A64', sky: '#C9D3D8' };
  const foMast = (x, y, s, c, a = 'start') => T(x, y, 'FORMA', { f: 'ar', s, w: 800, st: 62, ls: -0.01, fill: c, a });
  /* architectural photographs, drawn in 1000 × 1250 */
  const arch = (k) => {
    let s = '';
    if (k === 0) { // stair with raking light
      s = R(0, 0, 1000, 1250, '#cdc6bb');
      for (let i = 0; i < 12; i++) { const y = 300 + i * 80, x = 1000 - i * 80; s += R(0, y, x, 80, i % 2 ? '#b8b0a4' : '#c4bcb0') + R(x - 6, y, 1000 - x + 6, 80, '#8e877d'); }
      s += P('M0,0 L1000,0 L1000,520 L0,1250Z', '#000', 'opacity=".18"') + P('M260,0 L520,0 L0,780 L0,390Z', '#fff', 'opacity=".22"');
    }
    if (k === 1) { // colonnade arches
      s = R(0, 0, 1000, 1250, '#d9cfc1');
      for (let i = 0; i < 4; i++) { const x = 40 + i * 250; s += P(`M${x},1250 L${x},560 A90,90 0 0 1 ${x + 180},560 L${x + 180},1250Z`, '#3b3631') + P(`M${x + 180},1250 L${x + 180},560 L${x + 230},560 L${x + 230},1250Z`, '#c3b8a8'); }
      s += R(0, 0, 1000, 420, '#e7dfd3') + P('M0,1250 L1000,950 L1000,1250Z', '#000', 'opacity=".15"');
      s += P('M120,1250 L300,900 L360,900 L230,1250Z', '#f4e4c9', 'opacity=".5"');
    }
    if (k === 2) { // curved concrete wall against sky
      s = R(0, 0, 1000, 1250, fo.sky) + `<linearGradient id="focurve" x1="0" x2="1"><stop offset="0" stop-color="#8b857c"/><stop offset=".5" stop-color="#d7d1c7"/><stop offset="1" stop-color="#9a948a"/></linearGradient>`;
      s += P('M-50,1250 L-50,520 C250,360 700,360 1050,600 L1050,1250Z', 'url(#focurve)');
      for (let i = 0; i < 9; i++) s += P(`M-50,${620 + i * 70} C250,${460 + i * 70} 700,${460 + i * 70} 1050,${700 + i * 70}`, 'none', `stroke="#000" stroke-opacity=".08" stroke-width="2"`);
      s += R(0, 1100, 1000, 150, '#5c5852');
    }
    if (k === 3) { // window light on plaster wall
      s = R(0, 0, 1000, 1250, '#d6cdbf') + P('M330,250 L760,180 L800,760 L360,860Z', '#f6ead5', 'opacity=".85"') + P('M545,215 L560,810', 'none', `stroke="#d6cdbf" stroke-width="14"`) + P('M345,555 L780,470', 'none', `stroke="#d6cdbf" stroke-width="14"`) + R(0, 1050, 1000, 200, '#9b8f80');
      s += G('translate(220,1050)', P('M-60,0 L-40,-250 L40,-250 L60,0Z', '#3b3631') + C(0, -300, 70, '#55604d'));
    }
    return s + grain(1000, 1250, 0.35);
  };
  const bars = (x, y, w, n, c, lh = 22) => Array.from({ length: n }, (_, i) => R(x, y + i * lh, i === n - 1 ? w * 0.55 : w * (0.92 + ((i * 7) % 8) / 100), 8, c, 'opacity=".55"')).join('');
  const foCover = (k, issue, theme, line) => view(0, 0, 1000, 1300, 1000, 1250, arch(k)) + foMast(50, 290, 330, fo.ink) + T(950, 80, `ISSUE ${issue}`, { f: 'mo', s: 24, w: 500, fill: fo.ink, a: 'end' }) +
    R(50, 1060, 900, 2, fo.ink) + T(50, 1130, theme, { f: 'is', s: 76, w: 400, fill: fo.ink }) + T(50, 1200, line, { f: 'hk', s: 24, w: 500, fill: fo.ink }) + C(910, 1170, 30, fo.orange);
  const foOpenR = () => R(0, 0, 1000, 1300, fo.paper) + T(80, 120, 'THRESHOLDS — 02', { f: 'mo', s: 20, w: 500, ls: 0.16, fill: fo.orange }) +
    TL(76, 330, ['The', 'architecture', 'of almost'], { f: 'ar', s: 128, w: 700, st: 62, fill: fo.ink, lh: 118 }) +
    TL(80, 620, ['Doorways, stairs and colonnades: the', 'spaces we pass through are designed', 'to be felt more than seen.'], { f: 'is', s: 36, w: 400, fill: fo.ink, lh: 44 }) +
    bars(80, 820, 400, 16, fo.ink) + bars(520, 820, 400, 16, fo.ink) + T(80, 1230, 'FORMA 14', { f: 'mo', s: 16, w: 500, fill: fo.ink, o: 0.6 }) + T(920, 1230, '27', { f: 'mo', s: 16, w: 500, fill: fo.ink, a: 'end', o: 0.6 });
  const foQuoteL = () => R(0, 0, 1000, 1300, fo.paper) + bars(80, 160, 400, 30, fo.ink) + bars(520, 160, 400, 12, fo.ink) + view(520, 470, 400, 500, 1000, 1250, arch(3)) +
    T(80, 900, '“A threshold is a pause', { f: 'is', s: 46, w: 400, fill: fo.ink }) + T(80, 954, 'you can walk through.”', { f: 'is', s: 46, w: 400, fill: fo.orange }) + T(80, 1230, '28', { f: 'mo', s: 16, w: 500, fill: fo.ink, o: 0.6 });

  PROJECTS.push({
    slug: 'forma', no: '06', title: 'FORMA Quarterly', category: 'Editorial Design', group: 'Editorial', tag: 'Self-Initiated Project',
    accent: fo.orange, ink: fo.ink, paper: fo.paper,
    summary: 'Art direction and layout for an architecture quarterly: a condensed masthead, a strict 12-column grid, and spreads that let photography breathe.',
    deliverables: ['Masthead', 'Cover system', 'Editorial grid', 'Feature spreads', 'Contents & navigation'],
    overview: 'FORMA is a self-initiated magazine concept about architecture and the built environment. Issue 14, “Thresholds”, explores the in-between spaces of buildings.',
    challenge: 'Architecture magazines compete with the beauty of their own photography. The design system had to give each issue a strong identity while staying out of the way of the images.',
    audience: 'Architects, interior designers, students and design-literate readers who collect print and read slowly.',
    direction: 'Measured and spacious. A tall condensed masthead works like a building on the page. Body text sits on a strict 12-column grid with a 12 pt baseline. One orange dot marks the issue and recurs as a page-turn cue.',
    mood: ['Light & concrete', 'Measured grid', 'Slow reading', 'Space as content'],
    fonts: [
      { name: 'Archivo Condensed', role: 'Masthead & headlines', f: 'ar', w: 700, st: 62 },
      { name: 'Instrument Serif', role: 'Standfirsts & pull quotes', f: 'is', w: 400, st: 100 }
    ],
    palette: [
      { name: 'Signal Orange', hex: fo.orange }, { name: 'Print Black', hex: fo.ink }, { name: 'Uncoated Paper', hex: fo.paper }, { name: 'Concrete', hex: fo.concrete }, { name: 'Shadow', hex: fo.shadow }
    ],
    logo: (fg) => foMast(0, 60, 220, fg, 'middle') + T(0, 112, 'ARCHITECTURE · SPACE · CRAFT', { f: 'mo', s: 15, w: 500, ls: 0.3, fill: fg, a: 'middle' }),
    mark: (fg) => foMast(0, 80, 260, fg, 'middle').replace('FORMA', 'F') + C(70, 60, 22, fo.orange),
    decisions: [
      { h: 'Masthead as architecture', p: 'The condensed masthead fills the width like a façade and can sit behind the subject of each cover photograph, which gives every issue depth.' },
      { h: 'A grid you can feel', p: 'Twelve columns and a 12 pt baseline give long features a steady rhythm. Images break the grid only at chapter openings, so those moments land.' },
      { h: 'One colour, one job', p: 'Signal orange marks the issue dot, section numbers and pull-quote endings. It works as wayfinding, never as decoration.' }
    ],
    cover: () => svg(1600, 1200,
      R(0, 0, 1600, 1200, '#D9D3C9') + spread({ x: 330, y: 380, w: 1100, h: 715, left: view(0, 0, 1000, 1300, 1000, 1250, arch(0)), right: foOpenR(), pw: 1000, ph: 1300, rot: -3 }) +
      paper({ x: 150, y: 90, w: 470, h: 611, rot: -9, vw: 1000, vh: 1300, content: foCover(1, 14, 'Thresholds', 'Stairs, doors and the spaces between'), o: 0.35 }) + grain(1600, 1200, 0.25), 'FORMA magazine cover and spread'),
    plates: [
      { size: 'full', cap: 'Feature opener: full-bleed photograph against a condensed headline.', art: () => svg(1600, 1000, R(0, 0, 1600, 1000, '#E2DDD4') + spread({ x: 120, y: 90, w: 1360, h: 884, left: view(0, 0, 1000, 1300, 1000, 1250, arch(1)), right: foOpenR(), pw: 1000, ph: 1300 }) + grain(1600, 1000, 0.2), 'FORMA feature spread') },
      { size: 'half', cap: 'Three covers, one system.', art: () => {
        let s = R(0, 0, 1200, 1000, fo.ink);
        [[2, 13, 'Curves', 'Walls that bend light'], [1, 14, 'Thresholds', 'The spaces between'], [3, 15, 'Daylight', 'Designing with the sun']].forEach(([k, n, t, l], i) => (s += paper({ x: 70 + i * 360, y: 220, w: 340, h: 442, vw: 1000, vh: 1300, content: foCover(k, n, t, l), o: 0.5 })));
        return svg(1200, 1000, s + grain(1200, 1000, 0.2), 'FORMA covers');
      } },
      { size: 'half', cap: 'Grid system: 12 columns, 12 pt baseline.', art: () => {
        let s = R(0, 0, 1200, 1000, fo.paper);
        const x0 = 150, w = 900, y0 = 90, h = 820;
        s += dropRect(x0, y0, w, h, 0.15, 20) + R(x0, y0, w, h, '#fff');
        for (let i = 0; i < 12; i++) s += R(x0 + 50 + i * 68.3, y0 + 50, 56, h - 100, fo.orange, 'opacity=".09"');
        for (let y = y0 + 50; y < y0 + h - 50; y += 16) s += R(x0 + 50, y, w - 100, 0.8, fo.orange, 'opacity=".35"');
        s += T(x0 + 50, y0 + 150, 'Thresholds', { f: 'ar', s: 96, w: 700, st: 62, fill: fo.ink }) + bars(x0 + 50, y0 + 220, 260, 22, fo.ink, 16) + bars(x0 + 330, y0 + 220, 260, 22, fo.ink, 16) + view(x0 + 604, y0 + 210, 246, 360, 1000, 1250, arch(2));
        s += T(x0 + 50, y0 + h - 18, '12 COL · 16 PX GUTTER · 12 PT BASELINE', { f: 'mo', s: 13, w: 500, ls: 0.12, fill: fo.orange });
        return svg(1200, 1000, s, 'FORMA grid system');
      } },
      { size: 'full', cap: 'Pull-quote spread with an inset photograph.', art: () => svg(1600, 900, R(0, 0, 1600, 900, '#C9C2B6') + spread({ x: 260, y: 60, w: 1080, h: 702, left: foQuoteL(), right: view(0, 0, 1000, 1300, 1000, 1250, arch(2)), pw: 1000, ph: 1300 }) + grain(1600, 900, 0.2), 'FORMA pull-quote spread') }
    ]
  });
})();
