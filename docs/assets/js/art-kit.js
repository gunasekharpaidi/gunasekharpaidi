/* ==========================================================================
   Art kit — vector mockup primitives used to render every project visual.
   Every function returns an SVG string. Shared filters/gradients live in
   one hidden <svg> injected by ArtKit.mountDefs() and are referenced by id.
   ========================================================================== */
(function () {
  let _id = 0;
  const uid = (p = 'u') => `${p}${(++_id).toString(36)}`;

  /* ---------- colour helpers ---------- */
  const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const toHex = (a) => '#' + a.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
  const mix = (a, b, t) => { const A = rgb(a), B = rgb(b); return toHex(A.map((v, i) => v + (B[i] - v) * t)); };
  const shade = (c, t) => mix(c, '#000000', t);
  const tint = (c, t) => mix(c, '#ffffff', t);
  const cmyk = (h) => {
    const [r, g, b] = rgb(h).map((v) => v / 255);
    const k = 1 - Math.max(r, g, b);
    if (k === 1) return [0, 0, 0, 100];
    return [r, g, b].map((v) => Math.round(((1 - v - k) / (1 - k)) * 100)).concat(Math.round(k * 100));
  };
  const lum = (h) => { const [r, g, b] = rgb(h).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };

  /* ---------- type ---------- */
  const F = {
    ar: 'Archivo', is: 'Instrument Serif', mo: 'IBM Plex Mono',
    hk: 'Hanken Grotesk', cg: 'Cormorant Garamond', sy: 'Syne'
  };
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  /* T(x, y, text, {f, s, w, st, fill, a, ls, it, o, tr}) */
  function T(x, y, str, o = {}) {
    const f = F[o.f || 'ar'];
    const style = `font-family:'${f}',sans-serif;font-weight:${o.w || 600};font-stretch:${o.st || 100}%;letter-spacing:${o.ls || 0}em;${o.it ? 'font-style:italic;' : ''}`;
    return `<text x="${x}" y="${y}" font-size="${o.s || 32}" fill="${o.fill || '#111'}" text-anchor="${o.a || 'start'}"${o.o != null ? ` opacity="${o.o}"` : ''}${o.tr ? ` transform="${o.tr}"` : ''} style="${style}">${esc(str)}</text>`;
  }
  /* multi-line text, lh = line height in px */
  const TL = (x, y, lines, o = {}) => lines.map((l, i) => T(x, y + i * (o.lh || (o.s || 32) * 1.2), l, o)).join('');

  /* ---------- wrappers ---------- */
  const svg = (w, h, body, label = '') =>
    `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(label)}">${body}</svg>`;
  const R = (x, y, w, h, fill, extra = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" ${extra}/>`;
  const C = (cx, cy, r, fill, extra = '') => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" ${extra}/>`;
  const P = (d, fill, extra = '') => `<path d="${d}" fill="${fill}" ${extra}/>`;
  const G = (tr, inner, extra = '') => `<g transform="${tr}" ${extra}>${inner}</g>`;
  /* nested viewport — content is drawn in its own coordinate space and clipped */
  const view = (x, y, w, h, vw, vh, content, rx = 0, align = 'xMidYMid') => {
    const inner = `<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="0 0 ${vw} ${vh}" preserveAspectRatio="${align} slice">${content}</svg>`;
    if (!rx) return inner;
    const id = uid('clip');
    return `<clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}"/></clipPath><g clip-path="url(#${id})">${inner}</g>`;
  };

  /* ---------- scene helpers ---------- */
  const grain = (w, h, o = 0.35) => `<rect width="${w}" height="${h}" filter="url(#gs-grain)" opacity="${o}" style="pointer-events:none"/>`;
  const vignette = (w, h, o = 1) => `<rect width="${w}" height="${h}" fill="url(#gs-vig)" opacity="${o}" style="pointer-events:none"/>`;
  const shadow = (cx, cy, rx, ry, o = 0.32, b = 20) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#000" opacity="${o}" filter="url(#gs-b${b})"/>`;
  /* studio backdrop: wall + floor with soft horizon */
  const studio = (w, h, wall, floor, horizon = 0.72) =>
    R(0, 0, w, h, wall) + R(0, h * horizon, w, h * (1 - horizon), floor) +
    `<rect x="0" y="${h * horizon - 60}" width="${w}" height="120" fill="url(#gs-horizon)" opacity=".5"/>`;
  /* soft cast shadow for flat-laid paper (offset blurred rect) */
  const dropRect = (x, y, w, h, o = 0.28, b = 20, dx = 0, dy = 14) => `<rect x="${x + dx}" y="${y + dy}" width="${w}" height="${h}" fill="#000" opacity="${o}" filter="url(#gs-b${b})"/>`;

  /* ---------- objects ---------- */

  /* Takeaway cup. x = centre, y = base */
  function cup({ x, y, h, body = '#fff', sleeve, lid = '#1d1d1d', art = '', sleeveArt = '' }) {
    const wt = h * 0.74, wb = h * 0.55, top = y - h;
    const L = (t) => (wt + (wb - wt) * t) / 2;
    const yy = (t) => top + h * t;
    const band = (a, b) => `M${x - L(a)},${yy(a)} L${x + L(a)},${yy(a)} L${x + L(b)},${yy(b)} Q${x},${yy(b) + h * 0.03} ${x - L(b)},${yy(b)}Z`;
    const bodyD = `M${x - L(0)},${top} L${x + L(0)},${top} L${x + L(1)},${y} Q${x},${y + h * 0.035} ${x - L(1)},${y}Z`;
    let s = shadow(x + h * 0.06, y + h * 0.02, wb * 0.75, h * 0.045, 0.38, 8) + shadow(x + h * 0.2, y + h * 0.03, wb * 1.1, h * 0.07, 0.18, 20);
    s += P(bodyD, body);
    if (sleeve) s += P(band(0.3, 0.74), sleeve);
    s += G(`translate(${x},${yy(0.52)})`, sleeveArt || art);
    s += P(bodyD, 'url(#gs-cyl)');
    // lid
    const lw = wt + h * 0.06;
    s += `<rect x="${x - lw / 2}" y="${top - h * 0.055}" width="${lw}" height="${h * 0.07}" rx="${h * 0.025}" fill="${lid}"/>`;
    s += P(`M${x - lw / 2 + h * 0.03},${top - h * 0.05} L${x - L(0) * 0.78},${top - h * 0.12} L${x + L(0) * 0.78},${top - h * 0.12} L${x + lw / 2 - h * 0.03},${top - h * 0.05}Z`, lid);
    s += `<rect x="${x - lw / 2}" y="${top - h * 0.12}" width="${lw}" height="${h * 0.14}" fill="url(#gs-cyl)" opacity=".8"/>`;
    s += `<rect x="${x + L(0) * 0.2}" y="${top - h * 0.115}" width="${h * 0.09}" height="${h * 0.012}" rx="${h * 0.006}" fill="#000" opacity=".45"/>`;
    return s;
  }

  /* Stand-up pouch. x = centre, y = base */
  function pouch({ x, y, w, h, color, seal, art = '' }) {
    const top = y - h;
    let s = shadow(x + w * 0.08, y, w * 0.62, h * 0.035, 0.4, 8) + shadow(x + w * 0.3, y + 6, w * 0.9, h * 0.06, 0.18, 20);
    const d = `M${x - w / 2},${top + 6} L${x + w / 2},${top + 6} L${x + w / 2 + w * 0.025},${y - h * 0.08} Q${x + w / 2 + w * 0.02},${y} ${x + w / 2 - w * 0.06},${y} L${x - w / 2 + w * 0.06},${y} Q${x - w / 2 - w * 0.02},${y} ${x - w / 2 - w * 0.025},${y - h * 0.08}Z`;
    s += P(d, color);
    s += `<rect x="${x - w / 2}" y="${top}" width="${w}" height="${h * 0.075}" fill="${seal || shade(color, 0.18)}"/>`;
    for (let i = 0; i < 26; i++) s += `<rect x="${x - w / 2 + (w / 26) * i + 2}" y="${top + 4}" width="${w / 26 - 5}" height="${h * 0.06}" fill="#000" opacity=".08"/>`;
    s += C(x + w * 0.3, top + h * 0.15, w * 0.035, shade(color, 0.25)) + C(x + w * 0.3, top + h * 0.15, w * 0.015, shade(color, 0.45));
    s += G(`translate(${x},${top + h * 0.5})`, art);
    s += P(d, 'url(#gs-soft)');
    return s;
  }

  /* Fragrance / serum bottle. x = centre, y = base */
  function bottle({ x, y, w, h, glass = '#e9e4da', liquid = '#c88a3a', cap = '#111', capH, art = '', neck = true }) {
    const top = y - h, ch = capH || h * 0.32;
    let s = shadow(x + w * 0.1, y + 2, w * 0.6, h * 0.04, 0.45, 8) + shadow(x + w * 0.4, y + 10, w * 0.9, h * 0.07, 0.2, 20);
    s += `<rect x="${x - w / 2}" y="${top}" width="${w}" height="${h}" rx="${w * 0.07}" fill="${glass}" opacity=".92"/>`;
    s += `<rect x="${x - w / 2 + w * 0.06}" y="${top + h * 0.12}" width="${w * 0.88}" height="${h * 0.8}" rx="${w * 0.04}" fill="${liquid}"/>`;
    s += `<rect x="${x - w / 2 + w * 0.06}" y="${top + h * 0.12}" width="${w * 0.88}" height="${h * 0.8}" rx="${w * 0.04}" fill="url(#gs-glass)"/>`;
    s += `<rect x="${x - w / 2}" y="${y - h * 0.09}" width="${w}" height="${h * 0.09}" rx="${w * 0.05}" fill="#fff" opacity=".22"/>`;
    s += `<rect x="${x - w / 2 + w * 0.08}" y="${top + h * 0.06}" width="${w * 0.07}" height="${h * 0.86}" rx="${w * 0.035}" fill="#fff" opacity=".35"/>`;
    s += G(`translate(${x},${top + h * 0.55})`, art);
    if (neck) s += `<rect x="${x - w * 0.12}" y="${top - h * 0.06}" width="${w * 0.24}" height="${h * 0.08}" fill="${shade(glass, 0.25)}"/>`;
    s += `<rect x="${x - w * 0.3}" y="${top - h * 0.06 - ch}" width="${w * 0.6}" height="${ch}" rx="${w * 0.03}" fill="${cap}"/>`;
    s += `<rect x="${x - w * 0.3}" y="${top - h * 0.06 - ch}" width="${w * 0.6}" height="${ch}" rx="${w * 0.03}" fill="url(#gs-cyl)"/>`;
    return s;
  }

  /* Box in two-point-ish oblique projection. x,y = bottom-left of front face */
  function box({ x, y, w, h, d, front, side, top, art = '', sideArt = '', topArt = '' }) {
    const dx = d * 0.62, dy = d * 0.36;
    let s = shadow(x + w / 2 + dx * 0.6, y + 4, w * 0.62 + dx * 0.5, 22, 0.4, 8) + shadow(x + w / 2 + dx, y + 18, w * 0.8 + dx, 40, 0.18, 20);
    s += P(`M${x + w},${y} L${x + w + dx},${y - dy} L${x + w + dx},${y - h - dy} L${x + w},${y - h}Z`, side || shade(front, 0.28));
    s += sideArt;
    s += P(`M${x},${y - h} L${x + dx},${y - h - dy} L${x + w + dx},${y - h - dy} L${x + w},${y - h}Z`, top || tint(front, 0.12));
    s += topArt;
    s += R(x, y - h, w, h, front);
    s += G(`translate(${x + w / 2},${y - h / 2})`, art);
    s += R(x, y - h, w, h, 'url(#gs-soft)');
    return s;
  }

  /* Cylinder jar with lid. x = centre, y = base */
  function jar({ x, y, w, h, body, lid, lidH, art = '' }) {
    const lh = lidH || h * 0.28, e = w * 0.12, top = y - h;
    let s = shadow(x + w * 0.1, y + 2, w * 0.58, e * 0.8, 0.4, 8) + shadow(x + w * 0.35, y + 12, w * 0.85, e * 1.4, 0.18, 20);
    s += P(`M${x - w / 2},${top + lh} L${x - w / 2},${y} A${w / 2},${e} 0 0 0 ${x + w / 2},${y} L${x + w / 2},${top + lh}Z`, body);
    s += G(`translate(${x},${top + lh + (h - lh) / 2})`, art);
    s += P(`M${x - w / 2},${top + lh} L${x - w / 2},${y} A${w / 2},${e} 0 0 0 ${x + w / 2},${y} L${x + w / 2},${top + lh}Z`, 'url(#gs-cyl)');
    s += P(`M${x - w / 2 - 2},${top + e} L${x - w / 2 - 2},${top + lh} A${w / 2 + 2},${e} 0 0 0 ${x + w / 2 + 2},${top + lh} L${x + w / 2 + 2},${top + e}Z`, lid);
    s += P(`M${x - w / 2 - 2},${top + e} L${x - w / 2 - 2},${top + lh} A${w / 2 + 2},${e} 0 0 0 ${x + w / 2 + 2},${top + lh} L${x + w / 2 + 2},${top + e}Z`, 'url(#gs-cyl)');
    s += `<ellipse cx="${x}" cy="${top + e}" rx="${w / 2 + 2}" ry="${e}" fill="${tint(lid, 0.12)}"/>`;
    return s;
  }

  /* Squeeze tube standing on its cap. x = centre, y = base */
  function tube({ x, y, w, h, color, cap, art = '' }) {
    const chh = h * 0.13, top = y - h;
    let s = shadow(x + w * 0.1, y + 2, w * 0.5, 10, 0.4, 8) + shadow(x + w * 0.3, y + 10, w * 0.8, 24, 0.16, 20);
    s += `<rect x="${x - w * 0.3}" y="${y - chh}" width="${w * 0.6}" height="${chh}" rx="${w * 0.06}" fill="${cap}"/>`;
    s += `<rect x="${x - w * 0.3}" y="${y - chh}" width="${w * 0.6}" height="${chh}" rx="${w * 0.06}" fill="url(#gs-cyl)"/>`;
    const d = `M${x - w * 0.36},${y - chh} L${x - w / 2},${top + h * 0.08} L${x + w / 2},${top + h * 0.08} L${x + w * 0.36},${y - chh}Z`;
    s += P(d, color);
    s += `<rect x="${x - w / 2}" y="${top}" width="${w}" height="${h * 0.085}" fill="${shade(color, 0.08)}"/>`;
    for (let i = 0; i < 14; i++) s += `<rect x="${x - w / 2 + i * (w / 14)}" y="${top + 3}" width="${w / 28}" height="${h * 0.07}" fill="#000" opacity=".07"/>`;
    s += G(`translate(${x},${top + h * 0.42})`, art);
    s += P(d, 'url(#gs-cyl)');
    return s;
  }

  /* Pump bottle. x = centre, y = base */
  function pump({ x, y, w, h, body, cap, art = '' }) {
    const top = y - h;
    let s = shadow(x + w * 0.1, y + 2, w * 0.55, 12, 0.4, 8) + shadow(x + w * 0.35, y + 10, w * 0.85, 26, 0.16, 20);
    s += `<rect x="${x - w / 2}" y="${top}" width="${w}" height="${h}" rx="${w * 0.22}" fill="${body}"/>`;
    s += G(`translate(${x},${top + h * 0.55})`, art);
    s += `<rect x="${x - w / 2}" y="${top}" width="${w}" height="${h}" rx="${w * 0.22}" fill="url(#gs-cyl)"/>`;
    s += `<rect x="${x - w * 0.18}" y="${top - h * 0.1}" width="${w * 0.36}" height="${h * 0.1}" fill="${cap}"/>`;
    s += `<rect x="${x - w * 0.06}" y="${top - h * 0.22}" width="${w * 0.12}" height="${h * 0.12}" fill="${cap}"/>`;
    s += `<rect x="${x - w * 0.06}" y="${top - h * 0.25}" width="${w * 0.42}" height="${h * 0.05}" rx="${h * 0.02}" fill="${cap}"/>`;
    s += `<rect x="${x - w * 0.18}" y="${top - h * 0.25}" width="${w * 0.36}" height="${h * 0.25}" fill="url(#gs-cyl)" opacity=".7"/>`;
    return s;
  }

  /* Drinks can. x = centre, y = base */
  function can({ x, y, w, h, body, art = '', rim = '#cfd3d6' }) {
    const e = w * 0.1, top = y - h;
    let s = shadow(x + w * 0.1, y + 2, w * 0.55, e, 0.4, 8) + shadow(x + w * 0.4, y + 12, w * 0.9, e * 1.8, 0.18, 20);
    const d = `M${x - w / 2},${top + h * 0.06} L${x - w / 2},${y - h * 0.04} Q${x - w / 2},${y} ${x - w * 0.4},${y} A${w * 0.4},${e * 0.8} 0 0 0 ${x + w * 0.4},${y} Q${x + w / 2},${y} ${x + w / 2},${y - h * 0.04} L${x + w / 2},${top + h * 0.06}Z`;
    s += P(d, body);
    s += G(`translate(${x},${top + h * 0.52})`, art);
    s += P(d, 'url(#gs-cyl)');
    s += P(`M${x - w / 2},${top + h * 0.06} L${x - w * 0.42},${top + e * 0.4} L${x + w * 0.42},${top + e * 0.4} L${x + w / 2},${top + h * 0.06}Z`, rim);
    s += `<ellipse cx="${x}" cy="${top + e * 0.4}" rx="${w * 0.42}" ry="${e * 0.8}" fill="${tint(rim, 0.2)}"/>`;
    s += `<ellipse cx="${x}" cy="${top + e * 0.4}" rx="${w * 0.36}" ry="${e * 0.62}" fill="${shade(rim, 0.08)}"/>`;
    s += `<rect x="${x - w / 2}" y="${top}" width="${w}" height="${h * 0.08}" fill="url(#gs-cyl)" opacity=".8"/>`;
    return s;
  }

  /* Paper/print object, flat or rotated. content drawn in vw×vh space */
  function paper({ x, y, w, h, rot = 0, vw, vh, content, bg = '#fff', o = 0.28, lift = 14 }) {
    const id = uid('p');
    const cx = x + w / 2, cy = y + h / 2;
    return G(`rotate(${rot} ${cx} ${cy})`,
      dropRect(x, y, w, h, o, 20, lift * 0.3, lift) + dropRect(x, y, w, h, o * 0.7, 4, 0, 2) +
      R(x, y, w, h, bg) + view(x, y, w, h, vw || w, vh || h, content) +
      `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#gs-paper)"/>`, `data-k="${id}"`);
  }

  /* Phone. x,y = top-left, w = width; content in vw×vh (default 390×844) */
  function phone({ x, y, w, content, vw = 390, vh = 844, frame = '#141416', rot = 0, shadowO = 0.35 }) {
    const h = w * (vh / vw) + w * 0.07, b = w * 0.035, r = w * 0.15;
    const cx = x + w / 2, cy = y + h / 2;
    let s = dropRect(x + w * 0.04, y + w * 0.08, w, h, shadowO, 40, w * 0.08, w * 0.1);
    s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${frame}"/>`;
    s += `<rect x="${x + 1.5}" y="${y + 1.5}" width="${w - 3}" height="${h - 3}" rx="${r - 1}" fill="none" stroke="#fff" stroke-opacity=".14" stroke-width="2"/>`;
    s += view(x + b, y + b, w - 2 * b, h - 2 * b, vw, vh, content, r - b, 'xMidYMin');
    s += `<rect x="${cx - w * 0.14}" y="${y + b + w * 0.03}" width="${w * 0.28}" height="${w * 0.075}" rx="${w * 0.04}" fill="#000"/>`;
    s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="url(#gs-sheen)" style="pointer-events:none"/>`;
    return rot ? G(`rotate(${rot} ${cx} ${cy})`, s) : s;
  }

  /* Desktop browser window. content in vw×vh, default 1440×900 */
  function browser({ x, y, w, h, content, vw = 1440, vh = 900, dark = false, url = '' }) {
    const bar = w * 0.035;
    let s = dropRect(x, y, w, h, 0.3, 40, 0, 30);
    s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${w * 0.008}" fill="${dark ? '#1c1c1f' : '#f4f4f2'}"/>`;
    [0, 1, 2].forEach((i) => (s += C(x + bar * 0.6 + i * bar * 0.45, y + bar / 2, bar * 0.12, ['#ff5f57', '#febc2e', '#28c840'][i])));
    s += `<rect x="${x + w * 0.32}" y="${y + bar * 0.22}" width="${w * 0.36}" height="${bar * 0.56}" rx="${bar * 0.28}" fill="${dark ? '#2a2a2e' : '#e4e4e0'}"/>`;
    if (url) s += T(x + w / 2, y + bar * 0.62, url, { f: 'mo', s: bar * 0.3, w: 400, fill: dark ? '#9a9aa0' : '#77777c', a: 'middle' });
    s += view(x, y + bar, w, h - bar, vw, vh, content, 0, 'xMidYMin');
    return s;
  }

  /* Laptop. x,y = top-left of lid; w = lid width */
  function laptop({ x, y, w, content, vw = 1440, vh = 900 }) {
    const h = w * (vh / vw) + w * 0.05, b = w * 0.025;
    let s = shadow(x + w / 2, y + h + w * 0.03, w * 0.62, w * 0.03, 0.4, 20);
    s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${w * 0.025}" fill="#18181b"/>`;
    s += view(x + b, y + b, w - 2 * b, h - 2 * b - w * 0.012, vw, vh, content);
    s += P(`M${x - w * 0.08},${y + h} L${x + w * 1.08},${y + h} L${x + w * 1.04},${y + h + w * 0.035} L${x - w * 0.04},${y + h + w * 0.035}Z`, '#c9cacd');
    s += `<rect x="${x + w * 0.42}" y="${y + h}" width="${w * 0.16}" height="${w * 0.01}" rx="${w * 0.005}" fill="#a3a4a8"/>`;
    s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${w * 0.025}" fill="url(#gs-sheen)"/>`;
    return s;
  }

  /* Open magazine spread. content for each page in pw×ph */
  function spread({ x, y, w, h, left, right, pw, ph, rot = 0 }) {
    const hw = w / 2;
    let s = dropRect(x, y, w, h, 0.32, 20, 0, 20);
    s += R(x, y, w, h, '#fff');
    s += view(x, y, hw, h, pw, ph, left) + view(x + hw, y, hw, h, pw, ph, right);
    s += `<rect x="${x}" y="${y}" width="${hw}" height="${h}" fill="url(#gs-gutL)"/>`;
    s += `<rect x="${x + hw}" y="${y}" width="${hw}" height="${h}" fill="url(#gs-gutR)"/>`;
    return rot ? G(`rotate(${rot} ${x + hw} ${y + h / 2})`, s) : s;
  }

  /* Hanging blade sign (circle). cx, cy = centre */
  function bladeSign({ cx, cy, r, face, art, bracket = '#1a1a1a' }) {
    let s = `<rect x="${cx - r * 1.5}" y="${cy - r - r * 0.36}" width="${r * 2.1}" height="${r * 0.08}" fill="${bracket}"/>`;
    s += `<rect x="${cx - r * 1.5}" y="${cy - r * 1.6}" width="${r * 0.08}" height="${r * 0.6}" fill="${bracket}"/>`;
    s += `<line x1="${cx - r * 0.5}" y1="${cy - r * 1.28}" x2="${cx - r * 0.42}" y2="${cy - r * 0.9}" stroke="${bracket}" stroke-width="${r * 0.03}"/>`;
    s += `<line x1="${cx + r * 0.5}" y1="${cy - r * 1.28}" x2="${cx + r * 0.42}" y2="${cy - r * 0.9}" stroke="${bracket}" stroke-width="${r * 0.03}"/>`;
    s += C(cx + r * 0.08, cy + r * 0.12, r, '#000', 'opacity=".25" filter="url(#gs-b20)"');
    s += C(cx, cy, r, face) + G(`translate(${cx},${cy})`, art) + C(cx, cy, r, 'url(#gs-dome)');
    return s;
  }

  /* Halftone dot field inside a rect (decorative print texture) */
  function halftone(x, y, w, h, step, color, maxR, fn) {
    let s = '';
    for (let j = 0; j * step < h; j++) for (let i = 0; i * step < w; i++) {
      const px = x + i * step + (j % 2 ? step / 2 : 0), py = y + j * step;
      const r = maxR * fn(i * step / w, j * step / h);
      if (r > 0.3) s += C(px.toFixed(1), py.toFixed(1), r.toFixed(2), color);
    }
    return s;
  }

  /* Shared defs, mounted once per document */
  function mountDefs() {
    if (document.getElementById('gs-defs')) return;
    const d = document.createElement('div');
    d.innerHTML = `<svg id="gs-defs" width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
      <filter id="gs-b4" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="4"/></filter>
      <filter id="gs-b8" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="8"/></filter>
      <filter id="gs-b20" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="20"/></filter>
      <filter id="gs-b40" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="40"/></filter>
      <filter id="gs-grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .6 0"/></filter>
      <radialGradient id="gs-vig" cx=".5" cy=".42" r=".75"><stop offset="0" stop-color="#fff" stop-opacity=".14"/><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".28"/></radialGradient>
      <radialGradient id="gs-spot" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
      <radialGradient id="gs-dome" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".25"/></radialGradient>
      <linearGradient id="gs-horizon" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset=".5" stop-color="#000" stop-opacity=".12"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>
      <linearGradient id="gs-cyl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".32"/><stop offset=".14" stop-color="#fff" stop-opacity=".1"/><stop offset=".3" stop-color="#fff" stop-opacity=".26"/><stop offset=".42" stop-color="#fff" stop-opacity="0"/><stop offset=".78" stop-color="#000" stop-opacity=".08"/><stop offset="1" stop-color="#000" stop-opacity=".38"/></linearGradient>
      <linearGradient id="gs-soft" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".14"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".16"/></linearGradient>
      <linearGradient id="gs-glass" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".25"/><stop offset=".25" stop-color="#fff" stop-opacity=".18"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></linearGradient>
      <linearGradient id="gs-paper" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".08"/><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".07"/></linearGradient>
      <linearGradient id="gs-sheen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".1"/><stop offset=".35" stop-color="#fff" stop-opacity="0"/></linearGradient>
      <linearGradient id="gs-gutL" x1="0" y1="0" x2="1" y2="0"><stop offset=".82" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></linearGradient>
      <linearGradient id="gs-gutR" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".16"/><stop offset=".12" stop-color="#000" stop-opacity="0"/></linearGradient>
      <linearGradient id="gs-fadeB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></linearGradient>
    </defs></svg>`;
    document.body.prepend(d.firstElementChild);
  }

  window.ArtKit = {
    uid, rgb, mix, shade, tint, cmyk, lum, F, T, TL, svg, R, C, P, G, view, grain, vignette, shadow, studio, dropRect,
    cup, pouch, bottle, box, jar, tube, pump, can, paper, phone, browser, laptop, spread, bladeSign, halftone, mountDefs
  };
})();
