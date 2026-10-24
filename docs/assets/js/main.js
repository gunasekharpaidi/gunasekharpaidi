/* ==========================================================================
   Page behaviour: renders work grid, hero collage, services and case
   studies from window.PROJECTS, and wires navigation, contact and forms.
   ========================================================================== */
(function () {
  const K = window.ArtKit;
  const CFG = window.SITE_CONFIG || {};
  const PROJECTS = window.PROJECTS;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const isPlaceholder = (v) => !v || /^\[.*\]$/.test(v.trim());
  const bySlug = (slug) => PROJECTS.find((p) => p.slug === slug);

  K.mountDefs();

  /* Visual for a plate or cover: real image if provided, otherwise vector art */
  const visual = (item, alt) => (item.img ? `<img src="${esc(item.img)}" alt="${esc(alt || '')}" loading="lazy">` : item.art());

  /* ---------------- Services ---------------- */
  const SERVICES = [
    { group: 'Build the brand', items: [
      ['Brand Identity & Logo Design', 'A distinctive logo and brand foundation that makes your business instantly recognisable and easier to trust.', 'ferro'],
      ['Visual Identity Systems', 'Colour, type, layout and rules that keep every touchpoint consistent, whoever is creating it.', 'northbeam'],
      ['Typography & Poster Design', 'Expressive, type-led work that carries a message on its own, for events, launches and culture.', 'letters-loud']
    ] },
    { group: 'Make it tangible', items: [
      ['Packaging Design', 'Packaging that earns attention on the shelf, explains the product clearly and is ready for production.', 'aurel'],
      ['Print Design & Marketing Collateral', 'Brochures, menus, stationery and point-of-sale material with print-ready files and finish specifications.', 'saffron'],
      ['Editorial & Publication Design', 'Magazines, reports and brand books with clear grids and pacing that make long content enjoyable to read.', 'forma']
    ] },
    { group: 'Get seen', items: [
      ['Social Media & Digital Campaigns', 'Cohesive campaign systems for feeds, stories and reels that build anticipation and stay on brand.', 'volta'],
      ['Advertising & Marketing Creatives', 'Key visuals and ad sets that communicate one idea quickly, from billboard to banner.', 'ripple'],
      ['Art Direction & Campaign Design', 'A single creative idea, directed across photography, layout and every format in the media plan.', 'kairo']
    ] },
    { group: 'Sell & persuade', items: [
      ['Website Visual Design & Landing Pages', 'Clear, attractive page design that guides visitors to one next step. Delivered as developer-ready files.', 'terra'],
      ['E-commerce & Product Graphics', 'Product imagery layouts, banners and listing graphics that help customers choose and buy with confidence.', 'linne'],
      ['Presentation & Pitch Deck Design', 'Decks and templates that make your story easy to follow and your team look its best in the room.', 'northbeam']
    ] }
  ];
  $('#service-groups').innerHTML = SERVICES.map((g) => `
    <div class="service-group">
      <h3 class="service-group-title">${g.group}</h3>
      <ul>${g.items.map(([t, d, slug]) => `
        <li class="service">
          <h4>${t}</h4>
          <p>${d}</p>
          <a class="service-link" href="#work-${slug}">See related work: ${esc(bySlug(slug).title)}</a>
        </li>`).join('')}</ul>
    </div>`).join('');

  /* ---------------- Hero collage ---------------- */
  const collage = ['ferro', 'aurel', 'letters-loud', 'volta', 'ondine'];
  $('#hero-collage').innerHTML = collage.map((slug, i) => {
    const p = bySlug(slug);
    return `<a class="tile tile-${i}" href="#work-${slug}" aria-label="${esc(p.title)}: ${esc(p.category)}">${visual({ art: p.cover, img: p.coverImg }, p.title)}<span class="tile-label"><b>${p.no}</b> ${esc(p.category)}</span></a>`;
  }).join('');

  /* ---------------- Work grid ---------------- */
  const SPANS = [7, 5, 7, 5, 6, 6, 8, 4, 4, 8, 7, 5]; // one row = 12 columns
  const groups = ['All', ...new Set(PROJECTS.map((p) => p.group))];
  $('#filters').innerHTML = groups.map((g, i) => {
    const n = g === 'All' ? PROJECTS.length : PROJECTS.filter((p) => p.group === g).length;
    return `<button type="button" class="chip" aria-pressed="${i === 0}" data-filter="${g}">${g} <span>${n}</span></button>`;
  }).join('');
  $('#work-grid').innerHTML = PROJECTS.map((p, i) => `
    <article class="card" data-group="${p.group}" data-span="${SPANS[i]}" style="--span:${SPANS[i]}">
      <a class="card-link" href="#work-${p.slug}">
        <div class="card-media">${visual({ art: p.cover, img: p.coverImg }, p.title)}<span class="card-view" aria-hidden="true">View case study →</span></div>
        <div class="card-info">
          <span class="card-no">${p.no}</span>
          <div>
            <h3 class="card-title">${esc(p.title)}</h3>
            <p class="card-cat">${esc(p.category)} <span class="dot">·</span> <span class="card-tag">${p.tag}</span></p>
          </div>
        </div>
        <p class="card-desc">${esc(p.summary)}</p>
      </a>
    </article>`).join('');
  $('#filters').addEventListener('click', (e) => {
    const b = e.target.closest('.chip'); if (!b) return;
    $$('.chip').forEach((c) => c.setAttribute('aria-pressed', c === b));
    const f = b.dataset.filter;
    let shown = 0;
    $$('.card').forEach((c) => { const on = f === 'All' || c.dataset.group === f; c.hidden = !on; if (on) shown++; });
    $('#work-grid').classList.toggle('is-filtered', f !== 'All');
    $('#work-count').textContent = `(${shown})`;
  });

  /* ---------------- Case study ---------------- */
  const swatchText = (hex) => (K.lum(hex) > 0.4 ? '#141414' : '#ffffff');
  const markSvg = (p, fg, bg, vb = '-160 -160 320 320') => `<svg viewBox="${vb}" role="img" aria-label="${esc(p.title)} mark">${p.mark(fg, bg)}</svg>`;
  const logoSvg = (p, fg, bg) => `<svg viewBox="-340 -190 680 380" role="img" aria-label="${esc(p.title)} logo">${p.logo(fg, bg)}</svg>`;
  const fontStyle = (f) => `font-family:'${K.F[f.f]}',sans-serif;font-weight:${f.w};font-stretch:${f.st}%`;

  function moodboard(p) {
    const [c1, c2, c3, c4, c5] = p.palette.map((c) => c.hex);
    let tex = '';
    for (let j = 0; j < 4; j++) for (let i = 0; i < 4; i++) tex += K.G(`translate(${-120 + i * 80 + (j % 2) * 40},${-120 + j * 80}) scale(.2)`, p.mark(p.paper, p.ink));
    return `<div class="mood">
      <div class="mood-tile m-a" style="background:${p.accent}">${markSvg(p, swatchText(p.accent) === '#ffffff' ? '#fff' : p.ink, p.accent)}</div>
      <div class="mood-tile m-b" style="background:${p.paper};color:${swatchText(p.paper)}"><span class="mood-word">${esc(p.mood[0])}</span></div>
      <div class="mood-tile m-c crop">${p.cover()}</div>
      <div class="mood-tile m-d" style="background:${p.ink}"><svg viewBox="-160 -160 320 320" aria-hidden="true">${tex}</svg></div>
      <div class="mood-tile m-e" style="background:${p.ink};color:${swatchText(p.ink)}"><span class="mood-word">${esc(p.mood[1])}</span></div>
      <div class="mood-tile m-f strip">${p.palette.map((c) => `<i style="background:${c.hex}"></i>`).join('')}</div>
      <div class="mood-tile m-g" style="background:${c4 || p.paper};color:${swatchText(c4 || p.paper)}"><span class="mood-aa" style="${fontStyle(p.fonts[0])}">Aa</span></div>
      <div class="mood-tile m-h" style="background:${c3 || p.paper};color:${swatchText(c3 || p.paper)}"><span class="mood-word">${esc(p.mood[2])}</span><span class="mood-word small">${esc(p.mood[3])}</span></div>
    </div>`;
  }

  function identity(p) {
    const lightBg = '#F6F4EF';
    const panels = p.logo
      ? `<figure class="id-panel id-wide" style="background:${lightBg}">${logoSvg(p, p.ink, lightBg)}<figcaption>Primary lockup</figcaption></figure>
         <figure class="id-panel" style="background:${p.ink}">${logoSvg(p, p.paper, p.ink)}<figcaption style="color:${swatchText(p.ink)}">Reversed</figcaption></figure>
         <figure class="id-panel" style="background:${p.accent}">${markSvg(p, swatchText(p.accent) === '#ffffff' ? '#fff' : p.ink, p.accent)}<figcaption style="color:${swatchText(p.accent)}">Mark on brand colour</figcaption></figure>
         <figure class="id-panel" style="background:${lightBg}"><svg viewBox="-160 -160 320 320" aria-hidden="true">
            ${[40, 80, 120].map((r) => `<circle r="${r}" fill="none" stroke="${p.accent}" stroke-width="1" stroke-dasharray="3 4"/>`).join('')}
            <line x1="-150" y1="0" x2="150" y2="0" stroke="${p.accent}" stroke-width="1"/><line x1="0" y1="-150" x2="0" y2="150" stroke="${p.accent}" stroke-width="1"/>
            <rect x="-120" y="-120" width="240" height="240" fill="none" stroke="${p.accent}" stroke-width="1"/>
            <g opacity=".85">${p.mark(p.ink, lightBg)}</g></svg><figcaption>Construction &amp; clear space</figcaption></figure>`
      : `<figure class="id-panel id-wide" style="background:${p.ink}"><svg viewBox="0 0 680 380" aria-hidden="true">${['Width', 'Voice', 'Scale', 'Space'].map((w, i) => K.T(40, 90 + i * 85, w, { s: 76, w: 900, st: 62 + i * 21, fill: i === 1 ? p.accent : p.paper })).join('')}</svg><figcaption style="color:#fff">Variables explored across the series</figcaption></figure>
         <figure class="id-panel" style="background:${p.accent}">${markSvg(p, '#fff')}<figcaption style="color:#fff">Contrast pairing</figcaption></figure>
         <figure class="id-panel" style="background:${p.paper}"><svg viewBox="-160 -160 320 320" aria-hidden="true">${[62, 84, 104, 125].map((st, i) => K.T(-120 + i * 74, 60, 'R', { s: 170, w: 900, st, fill: i === 3 ? p.accent : p.ink, a: 'middle' })).join('')}</svg><figcaption>Width axis, 62 to 125</figcaption></figure>
         <figure class="id-panel" style="background:#fff"><svg viewBox="-160 -160 320 320" aria-hidden="true"><g style="mix-blend-mode:multiply"><circle cx="-40" cy="-20" r="90" fill="${p.palette[1].hex}"/><circle cx="40" cy="-20" r="90" fill="${p.palette[0].hex}"/><circle cx="0" cy="50" r="90" fill="${p.palette[2].hex}"/></g></svg><figcaption>Riso overprint test</figcaption></figure>`;
    const specimens = p.fonts.map((f) => `
      <div class="specimen">
        <span class="spec-aa" style="${fontStyle(f)}">Aa</span>
        <div>
          <p class="spec-name">${esc(f.name)}</p>
          <p class="spec-role">${esc(f.role)}</p>
          <p class="spec-glyphs" style="${fontStyle(f)}">ABCDEFGHIJKLMNOPQRSTUVWXYZ<br>abcdefghijklmnopqrstuvwxyz 0123456789</p>
        </div>
      </div>`).join('');
    return `<div class="id-grid">${panels}</div><div class="specimens">${specimens}</div>`;
  }

  function paletteHtml(p) {
    return `<div class="palette">${p.palette.map((c, i) => {
      const [r, g, b] = K.rgb(c.hex); const [cc, m, y, k] = K.cmyk(c.hex);
      return `<div class="swatch${i === 0 ? ' swatch-lead' : ''}" style="background:${c.hex};color:${swatchText(c.hex)}">
        <span class="sw-name">${esc(c.name)}</span>
        <dl><dt>HEX</dt><dd>${c.hex.toUpperCase()}</dd><dt>RGB</dt><dd>${r} ${g} ${b}</dd><dt>CMYK</dt><dd>${cc} ${m} ${y} ${k}</dd></dl>
      </div>`;
    }).join('')}</div>`;
  }

  function renderCase(p) {
    const i = PROJECTS.indexOf(p);
    const next = PROJECTS[(i + 1) % PROJECTS.length], prev = PROJECTS[(i - 1 + PROJECTS.length) % PROJECTS.length];
    $('#case-pos').innerHTML = `<b>${p.no}</b> / ${String(PROJECTS.length).padStart(2, '0')} <span>${esc(p.title)}</span>`;
    $('#case-prev').href = `#work-${prev.slug}`;
    $('#case-next').href = `#work-${next.slug}`;
    $('#case-body').innerHTML = `
    <article class="cs" style="--p-accent:${p.accent}">
      <header class="wrap cs-hero">
        <p class="eyebrow"><span>${p.no}</span> ${esc(p.category)} <span class="pill">${p.tag}</span></p>
        <h1 class="cs-title" id="case-title">${esc(p.title)}</h1>
        <p class="cs-summary">${esc(p.summary)}</p>
      </header>
      <figure class="wrap cs-cover"><div class="frame">${visual({ art: p.cover, img: p.coverImg }, p.title)}</div></figure>

      <div class="wrap">
        <dl class="cs-meta">
          <div><dt>Discipline</dt><dd>${esc(p.category)}</dd></div>
          <div><dt>Project type</dt><dd>${p.tag}. ${p.tag === 'Concept Project' ? 'Fictional brand' : 'Personal study'}</dd></div>
          <div><dt>Role</dt><dd>Concept, design &amp; art direction</dd></div>
          <div><dt>Deliverables</dt><dd>${p.deliverables.map(esc).join(', ')}</dd></div>
        </dl>

        <section class="cs-row">
          <h2 class="cs-h">Overview</h2>
          <div class="cs-text"><p class="lede">${esc(p.overview)}</p></div>
        </section>
        <section class="cs-row cs-two">
          <div><h2 class="cs-h">The brief &amp; challenge</h2><p>${esc(p.challenge)}</p></div>
          <div><h2 class="cs-h">Target audience</h2><p>${esc(p.audience)}</p></div>
        </section>
        <section class="cs-row">
          <h2 class="cs-h">Creative direction</h2>
          <div class="cs-text"><p class="lede">${esc(p.direction)}</p></div>
        </section>

        <section class="cs-block">
          <h2 class="cs-h">Moodboard &amp; visual exploration</h2>
          ${moodboard(p)}
        </section>

        <section class="cs-block">
          <h2 class="cs-h">${p.logo ? 'Logo &amp; typography' : 'Typography'}</h2>
          ${identity(p)}
        </section>

        <section class="cs-block">
          <h2 class="cs-h">Colour palette</h2>
          ${paletteHtml(p)}
        </section>

        <section class="cs-block">
          <h2 class="cs-h">Design system &amp; applications</h2>
          <div class="plates">
            ${p.plates.map((pl) => `<figure class="plate plate-${pl.size}"><div class="frame">${visual(pl, pl.cap)}</div><figcaption>${esc(pl.cap)}</figcaption></figure>`).join('')}
          </div>
        </section>

        <section class="cs-block">
          <h2 class="cs-h">Design decisions</h2>
          <div class="decisions">
            ${p.decisions.map((d) => `<div class="decision"><h3>${esc(d.h)}</h3><p>${esc(d.p)}</p></div>`).join('')}
          </div>
        </section>

        <aside class="cs-cta">
          <p>Need a ${esc(p.category.toLowerCase())} project like this?</p>
          <a class="btn btn-primary" href="#contact" data-close-to="contact">Let’s Work Together <span aria-hidden="true">→</span></a>
        </aside>

        <a class="cs-next" href="#work-${next.slug}">
          <span class="label">Next project · ${next.no}</span>
          <span class="cs-next-title">${esc(next.title)}</span>
          <span class="cs-next-cat">${esc(next.category)} →</span>
          <span class="cs-next-media">${next.cover()}</span>
        </a>
      </div>
    </article>`;
  }

  /* ---------------- Routing (plain #work-slug anchors) ---------------- */
  const caseEl = $('#case');
  let lastFocus = null, lastSlug = null;
  function openCase(slug) {
    const p = bySlug(slug); if (!p) return;
    if (caseEl.hidden) lastFocus = document.activeElement;
    renderCase(p);
    lastSlug = slug;
    caseEl.hidden = false;
    document.documentElement.classList.add('case-open');
    caseEl.scrollTop = 0;
    $('.case-back', caseEl).focus({ preventScroll: true });
  }
  function closeCase(target) {
    if (caseEl.hidden) return;
    caseEl.hidden = true;
    document.documentElement.classList.remove('case-open');
    const dest = target ? document.getElementById(target) : document.querySelector(`.card-link[href="#work-${lastSlug}"]`);
    try { history.replaceState(null, '', target ? `#${target}` : '#work'); } catch (e) { /* ignore */ }
    if (dest) dest.scrollIntoView({ block: target ? 'start' : 'center' });
    const f = target ? null : dest || lastFocus;
    if (f && f.focus) f.focus({ preventScroll: true });
  }
  function route() {
    const h = decodeURIComponent(location.hash.slice(1));
    if (h.startsWith('work-')) openCase(h.slice(5));
    else if (!caseEl.hidden) closeCase(h || null);
  }
  window.addEventListener('hashchange', route);
  caseEl.addEventListener('click', (e) => {
    const c = e.target.closest('[data-close]');
    if (c) { e.preventDefault(); closeCase(); return; }
    const t = e.target.closest('[data-close-to]');
    if (t) { e.preventDefault(); closeCase(t.dataset.closeTo); }
  });
  document.addEventListener('keydown', (e) => {
    if (caseEl.hidden) return;
    if (e.key === 'Escape') closeCase();
    if (e.key === 'Tab') { // keep focus inside the dialog
      const f = $$('a[href],button:not([disabled])', caseEl).filter((el) => el.offsetParent !== null);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });
  route();

  /* ---------------- Header & menu ---------------- */
  const header = $('#site-header');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const toggle = $('#menu-toggle');
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', open);
    header.classList.toggle('menu-open', open);
  });
  $('#nav').addEventListener('click', (e) => { if (e.target.closest('a')) { toggle.setAttribute('aria-expanded', 'false'); header.classList.remove('menu-open'); } });

  /* ---------------- Contact details from config ---------------- */
  $$('[data-config]').forEach((el) => {
    const key = el.dataset.config, val = CFG[key] || '';
    if (isPlaceholder(val)) { el.innerHTML = `<span class="placeholder" title="Edit in assets/js/config.js">${esc(val || `[YOUR ${key.toUpperCase()}]`)}</span>`; return; }
    const href = key === 'email' ? `mailto:${val}` : val;
    const text = key === 'email' ? val : val.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
    el.innerHTML = `<a href="${esc(href)}"${key === 'email' ? '' : ' target="_blank" rel="noopener"'}>${esc(text)}</a>`;
  });
  if (CFG.portrait) {
    const img = new Image();
    img.alt = 'Portrait of Guna Sekhar';
    img.onload = () => { const ph = $('.portrait-placeholder'); ph.replaceWith(img); };
    img.src = CFG.portrait;
  }

  const copyStatus = $('#copy-status');
  $('#copy-email').addEventListener('click', () => {
    if (isPlaceholder(CFG.email)) { copyStatus.textContent = 'Add your email address in assets/js/config.js first.'; return; }
    const done = () => (copyStatus.textContent = 'Email address copied.');
    const fallback = () => { const r = document.createRange(); r.selectNodeContents($('.email-value')); const s = getSelection(); s.removeAllRanges(); s.addRange(r); copyStatus.textContent = 'Selected. Press Ctrl+C or ⌘C to copy.'; };
    try { navigator.clipboard.writeText(CFG.email).then(done, fallback); } catch (e) { fallback(); }
  });

  /* ---------------- Inquiry form → prefilled email ---------------- */
  const form = $('#inquiry'), status = $('#form-status');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const missing = $$('[required]', form).filter((el) => !el.value.trim() || (el.type === 'email' && !/^\S+@\S+\.\S+$/.test(el.value)));
    $$('.field', form).forEach((f) => f.classList.remove('invalid'));
    if (missing.length) {
      missing.forEach((el) => el.closest('.field').classList.add('invalid'));
      status.textContent = 'Please add your name, a valid email and a few words about the project.';
      missing[0].focus();
      return;
    }
    const d = Object.fromEntries(new FormData(form));
    if (isPlaceholder(CFG.email)) { status.textContent = 'This form needs an email address in assets/js/config.js before it can open your email app.'; return; }
    const body = `Name: ${d.name}\nEmail: ${d.email}\nCompany: ${d.company || '-'}\nProject type: ${d.type}\n\n${d.message}`;
    window.location.href = `mailto:${CFG.email}?subject=${encodeURIComponent(`Project inquiry: ${d.type}`)}&body=${encodeURIComponent(body)}`;
    status.textContent = `Your email app should open with this message ready to send. If it doesn’t, email ${CFG.email} directly.`;
  });

  $('#year').textContent = new Date().getFullYear();
})();
