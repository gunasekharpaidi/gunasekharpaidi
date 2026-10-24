/* ==========================================================================
   Renders the work grid, details mosaic, services and every case study
   into the page from window.PROJECTS. Case studies are plain sections that
   open with CSS :target, so the page also works once saved as static HTML.
   ========================================================================== */
(function () {
  const K = window.ArtKit;
  const CFG = window.SITE_CONFIG || {};
  const PROJECTS = window.PROJECTS;
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const bySlug = (slug) => PROJECTS.find((p) => p.slug === slug);
  const visual = (item, alt) => (item.img ? `<img src="${esc(item.img)}" alt="${esc(alt || '')}" loading="lazy">` : item.art());
  const onColor = (hex) => (K.lum(hex) > 0.4 ? '#141414' : '#ffffff');

  K.mountDefs();

  /* ---------- work grid ---------- */
  const SPANS = [7, 5, 7, 5, 6, 6, 8, 4, 4, 8, 7, 5]; // each row adds up to 12 columns
  $('#work-grid').innerHTML = PROJECTS.map((p, i) => `
    <a class="card" href="#work-${p.slug}" style="--span:${SPANS[i]}">
      <div class="card-media">${visual({ art: p.cover, img: p.coverImg }, p.title)}<span class="card-view">View project →</span></div>
      <div class="card-info">
        <span class="card-no">${p.no}</span>
        <h3 class="card-title">${esc(p.title)}</h3>
        <span class="card-cat">${esc(p.category)}</span>
      </div>
    </a>`).join('');

  /* ---------- ticker ---------- */
  const words = ['Brand Identity', 'Packaging', 'Campaigns', 'Editorial', 'Typography', 'Art Direction', 'Digital', 'Social'];
  $('#ticker').innerHTML = words.concat(words).map((w) => `<span>${w}</span>`).join('');

  /* ---------- details mosaic: one application from each of nine projects ---------- */
  const picks = [['aurel', 0], ['volta', 0], ['saffron', 3], ['ripple', 0], ['kairo', 0], ['letters-loud', 0], ['ondine', 0], ['ferro', 1], ['terra', 2]];
  $('#mosaic').innerHTML = picks.map(([slug, k], i) => {
    const p = bySlug(slug), pl = p.plates[k];
    return `<a class="m-item m-${i}" href="#work-${slug}">${visual(pl, pl.cap)}<span class="m-label">${esc(p.title)}</span></a>`;
  }).join('');

  /* ---------- services ---------- */
  const SERVICES = [
    ['Brand', ['Brand Identity & Logo Design', 'Visual Identity Systems', 'Typography & Poster Design']],
    ['Print & Packaging', ['Packaging Design', 'Print Design & Marketing Collateral', 'Editorial & Publication Design']],
    ['Campaigns', ['Social Media & Digital Campaigns', 'Advertising & Marketing Creatives', 'Art Direction & Campaign Design']],
    ['Digital & Sales', ['Website Visual Design & Landing Pages', 'E-commerce & Product Graphics', 'Presentation & Pitch Deck Design']]
  ];
  $('#services-list').innerHTML = SERVICES.map(([g, items]) => `
    <div class="svc"><h3>${g}</h3><ul>${items.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></div>`).join('');

  /* ---------- case studies ---------- */
  const logoSvg = (p, fg, bg) => `<svg viewBox="-340 -190 680 380" aria-hidden="true">${p.logo(fg, bg)}</svg>`;
  const markSvg = (p, fg, bg) => `<svg viewBox="-160 -160 320 320" aria-hidden="true">${p.mark(fg, bg)}</svg>`;
  function identity(p) {
    const light = '#F6F4EF', markFg = onColor(p.accent) === '#ffffff' ? '#ffffff' : p.ink;
    if (!p.logo) return `
      <div class="id-grid">
        <div class="id-panel id-wide" style="background:${p.ink}"><svg viewBox="0 0 680 380" aria-hidden="true">${['Width', 'Voice', 'Scale', 'Space'].map((w, i) => K.T(40, 90 + i * 85, w, { s: 76, w: 900, st: 62 + i * 21, fill: i === 1 ? p.accent : p.paper })).join('')}</svg></div>
        <div class="id-panel" style="background:${p.accent}">${markSvg(p, '#fff')}</div>
        <div class="id-panel" style="background:${p.paper}"><svg viewBox="-160 -160 320 320" aria-hidden="true">${[62, 84, 104, 125].map((st, i) => K.T(-120 + i * 74, 60, 'R', { s: 170, w: 900, st, fill: i === 3 ? p.accent : p.ink, a: 'middle' })).join('')}</svg></div>
        <div class="id-panel" style="background:#fff"><svg viewBox="-160 -160 320 320" aria-hidden="true"><g style="mix-blend-mode:multiply"><circle cx="-40" cy="-20" r="90" fill="${p.palette[1].hex}"/><circle cx="40" cy="-20" r="90" fill="${p.palette[0].hex}"/><circle cx="0" cy="50" r="90" fill="${p.palette[2].hex}"/></g></svg></div>
      </div>`;
    return `
      <div class="id-grid">
        <div class="id-panel id-wide" style="background:${light}">${logoSvg(p, p.ink, light)}</div>
        <div class="id-panel" style="background:${p.ink}">${logoSvg(p, p.paper, p.ink)}</div>
        <div class="id-panel" style="background:${p.accent}">${markSvg(p, markFg, p.accent)}</div>
        <div class="id-panel" style="background:${light}"><svg viewBox="-160 -160 320 320" aria-hidden="true">
          ${[40, 80, 120].map((r) => `<circle r="${r}" fill="none" stroke="${p.accent}" stroke-width="1" stroke-dasharray="3 4"/>`).join('')}
          <line x1="-150" y1="0" x2="150" y2="0" stroke="${p.accent}"/><line x1="0" y1="-150" x2="0" y2="150" stroke="${p.accent}"/>
          <rect x="-120" y="-120" width="240" height="240" fill="none" stroke="${p.accent}"/><g opacity=".85">${p.mark(p.ink, light)}</g></svg></div>
      </div>`;
  }
  const palette = (p) => `<div class="palette">${p.palette.map((c) => `<div class="swatch" style="background:${c.hex};color:${onColor(c.hex)}"><span>${esc(c.name)}</span><code>${c.hex.toUpperCase()}</code></div>`).join('')}</div>`;
  const typeRow = (p) => `<div class="type-row">${p.fonts.map((f) => `<div class="type"><span class="type-aa" style="font-family:'${K.F[f.f]}';font-weight:${f.w};font-stretch:${f.st}%">Aa</span><span class="type-name">${esc(f.name)}</span></div>`).join('')}</div>`;

  $('#cases').innerHTML = PROJECTS.map((p, i) => {
    const next = PROJECTS[(i + 1) % PROJECTS.length], prev = PROJECTS[(i - 1 + PROJECTS.length) % PROJECTS.length];
    return `
    <section class="case" id="work-${p.slug}" aria-label="${esc(p.title)} case study">
      <div class="case-bar"><div class="wrap case-bar-inner">
        <a class="case-back" href="#work">← All work</a>
        <span class="case-pos"><b>${p.no}</b> / 12</span>
        <span class="case-nav"><a href="#work-${prev.slug}" aria-label="Previous project">←</a><a href="#work-${next.slug}" aria-label="Next project">→</a><a href="#work" aria-label="Close">✕</a></span>
      </div></div>
      <div class="wrap">
        <header class="cs-hero">
          <p class="cs-kicker">${p.no} · ${esc(p.category)} <span class="pill">${p.tag}</span></p>
          <h2 class="cs-title">${esc(p.title)}</h2>
          <p class="cs-sub">${esc(p.summary)}</p>
        </header>
        <div class="frame cs-cover">${visual({ art: p.cover, img: p.coverImg }, p.title)}</div>
        <div class="cs-idea">
          <h3 class="h-label">The idea</h3>
          <p>${esc(p.direction)}</p>
        </div>
        ${identity(p)}
        ${palette(p)}
        ${typeRow(p)}
        <div class="plates">${p.plates.map((pl) => `<figure class="plate plate-${pl.size}"><div class="frame">${visual(pl, pl.cap)}</div><figcaption>${esc(pl.cap)}</figcaption></figure>`).join('')}</div>
        <ul class="deliverables">${p.deliverables.map((d) => `<li>${esc(d)}</li>`).join('')}</ul>
        <a class="cs-next" href="#work-${next.slug}">
          <span class="cs-next-text"><span class="h-label">Next project</span><span class="cs-next-title">${esc(next.title)} →</span></span>
          <span class="cs-next-media">${next.cover()}</span>
        </a>
      </div>
    </section>`;
  }).join('');

  /* ---------- contact details from config ---------- */
  document.querySelectorAll('[data-config]').forEach((el) => {
    const key = el.dataset.config, val = (CFG[key] || '').trim();
    if (!val || /^\[.*\]$/.test(val)) { el.textContent = val || `[YOUR ${key.toUpperCase()}]`; el.classList.add('placeholder'); return; }
    el.href = key === 'email' ? `mailto:${val}` : val;
    el.textContent = key === 'email' ? val : val.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
    if (key !== 'email') { el.target = '_blank'; el.rel = 'noopener'; }
  });
  if (CFG.portrait) $('#portrait').innerHTML = `<img src="${esc(CFG.portrait)}" alt="Portrait of Guna Sekhar">`;

  /* ---------- lock page scroll while a case study is open ---------- */
  const sync = () => document.documentElement.classList.toggle('case-open', /^#work-/.test(location.hash));
  window.addEventListener('hashchange', sync); sync();
})();
