/* SAVORÉ — Phase 2 clickable prototype (vanilla JS; becomes React components in Phase 4) */
(() => {
  'use strict';

  /* ---------- Helpers ---------- */
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const ICONS = {
    plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
    minus: '<path d="M5 12h14"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    trash: '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
    pencil: '<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>',
    flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    bag: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
    utensils: '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    arrowLeft: '<path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>',
    alert: '<circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  };
  const icon = (n, cls = '') => `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n]}</svg>`;
  const inr = (n) => '₹' + Math.round(n).toLocaleString('en-IN');
  const inr2 = (n) => '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const dishById = (id) => DISHES.find((d) => d.id === id);
  const catById = (id) => CATEGORIES.find((c) => c.id === id);
  const img = (key, w) => UNSPLASH(IMAGES[key], w);
  const SPICE = ['None', 'Mild', 'Medium', 'Hot'];

  const dietIcon = (diet, decorative = false) => {
    const veg = diet === 'veg';
    const c = veg ? '#2F7A35' : '#8A3A1C';
    const a11y = decorative ? 'aria-hidden="true"' : `role="img" aria-label="${veg ? 'Vegetarian' : 'Non-vegetarian'}"`;
    const mark = veg ? `<circle cx="8" cy="8" r="3.6" fill="${c}"/>` : `<path d="M8 4.2 11.8 11.4H4.2Z" fill="${c}"/>`;
    return `<svg class="diet" viewBox="0 0 16 16" ${a11y}><rect x=".75" y=".75" width="14.5" height="14.5" rx="2.5" fill="#fff" stroke="${c}" stroke-width="1.5"/>${mark}</svg>`;
  };
  const spiceIcons = (lvl, decorative = false) => {
    if (!lvl) return '';
    const a11y = decorative ? 'aria-hidden="true"' : `role="img" aria-label="Spice: ${SPICE[lvl].toLowerCase()}"`;
    return `<span class="spice" ${a11y}>${[1, 2, 3].map((i) => icon('flame', i <= lvl ? 'on' : '')).join('')}</span>`;
  };

  /* ---------- Cart state (persisted) ---------- */
  const STORE = 'savore-proto-v1';
  let cart = [];
  let orderMode = 'dine';
  try {
    const saved = JSON.parse(localStorage.getItem(STORE) || '{}');
    if (Array.isArray(saved.cart)) cart = saved.cart.filter((l) => dishById(l.dishId) && l.qty > 0);
    if (saved.mode === 'takeaway') orderMode = 'takeaway';
  } catch (e) { /* storage unavailable — fine for a prototype */ }
  const persist = () => { try { localStorage.setItem(STORE, JSON.stringify({ cart, mode: orderMode })); } catch (e) { /* ignore */ } };

  const defaultSel = (dish) => {
    const sel = {};
    dish.groups.forEach((g) => { sel[g.id] = g.type === 'multi' ? [] : [g.type === 'spice' ? Math.max(0, (g.def || 1) - 1) : 0]; });
    return sel;
  };
  const unitPrice = (dish, sel) => dish.groups.reduce((p, g) => p + (sel[g.id] || []).reduce((s, i) => s + g.choices[i][1], 0), dish.price);
  const keyOf = (dishId, sel, note) => `${dishId}|${JSON.stringify(sel)}|${note || ''}`;
  const summaryOf = (dish, sel) => dish.groups.flatMap((g) => (sel[g.id] || []).map((i) => {
    const label = g.choices[i][0];
    if (g.type === 'spice') return `${label} spice`;
    if (g.type === 'multi') return `+ ${label}`;
    return label;
  })).join(' · ');
  const totals = () => {
    const count = cart.reduce((n, l) => n + l.qty, 0);
    const subtotal = cart.reduce((s, l) => s + unitPrice(dishById(l.dishId), l.sel) * l.qty, 0);
    const gst = Math.round(subtotal * 5) / 100; // 5%
    return { count, subtotal, gst, total: subtotal + gst };
  };

  function addToCart(dishId, sel, note, qty, editKey) {
    const key = keyOf(dishId, sel, note);
    const editIdx = editKey ? cart.findIndex((l) => l.key === editKey) : -1;
    const sameIdx = cart.findIndex((l) => l.key === key);
    if (editIdx > -1) {
      if (sameIdx > -1 && sameIdx !== editIdx) { cart[sameIdx].qty += qty; cart.splice(editIdx, 1); }
      else cart[editIdx] = { key, dishId, sel, note, qty };
    } else if (sameIdx > -1) cart[sameIdx].qty = Math.min(20, cart[sameIdx].qty + qty);
    else cart.push({ key, dishId, sel, note, qty });
    cartChanged(true);
  }

  function cartChanged(bump) {
    persist();
    const { count } = totals();
    const badge = $('#cartCount');
    badge.textContent = count;
    badge.hidden = count === 0;
    $('#cartBtn').setAttribute('aria-label', `Open your order, ${count} item${count === 1 ? '' : 's'}`);
    if (bump) { badge.classList.remove('bump'); void badge.offsetWidth; badge.classList.add('bump'); }
    renderMiniCart();
    updateInCart();
    updateCartBar();
    if (openPanelEl && openPanelEl.id === 'cartPanel') renderCartPanel();
    if (current === 'cart' && !orderConfirm) renderCartScreen();
  }

  /* ---------- Toast ---------- */
  let toastTimer;
  function toast(msg) {
    const t = $('#toast');
    t.innerHTML = icon('check') + `<span>${esc(msg)}</span>`;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
  }

  /* ---------- Panels (drawer / sheet) ---------- */
  let openPanelEl = null;
  let lastFocus = null;
  const scrim = $('#scrim');
  function openPanel(id, trigger) {
    if (openPanelEl) closePanel(false);
    const p = $('#' + id);
    lastFocus = trigger || document.activeElement;
    scrim.hidden = false;
    p.hidden = false;
    document.body.classList.add('locked');
    requestAnimationFrame(() => { scrim.classList.add('open'); p.classList.add('open'); });
    openPanelEl = p;
    setTimeout(() => { const f = p.querySelector('[data-autofocus]') || p.querySelector('button, [href], input'); if (f) f.focus({ preventScroll: true }); }, 60);
  }
  function closePanel(restore = true) {
    const p = openPanelEl;
    if (!p) return;
    openPanelEl = null;
    p.classList.remove('open');
    scrim.classList.remove('open');
    document.body.classList.remove('locked');
    setTimeout(() => { if (!p.classList.contains('open')) p.hidden = true; if (!openPanelEl) scrim.hidden = true; }, 400);
    if (restore && lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
  }
  scrim.addEventListener('click', () => closePanel());
  document.addEventListener('keydown', (e) => {
    if (!openPanelEl) return;
    if (e.key === 'Escape') { e.preventDefault(); closePanel(); return; }
    if (e.key !== 'Tab') return;
    const f = $$('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])', openPanelEl)
      .filter((el) => el.offsetParent !== null || el === document.activeElement);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  document.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) closePanel(); });

  /* ---------- Routing ---------- */
  const SCREENS = ['home', 'menu', 'cart', 'reserve'];
  const TITLES = { home: 'SAVORÉ — Good food, honestly made', menu: 'Menu — SAVORÉ', cart: 'Your order — SAVORÉ', reserve: 'Book a table — SAVORÉ' };
  let current = null;
  let pendingOpen = null;
  let pendingScroll = null;
  let firstRoute = true;

  function route() {
    let h = location.hash.slice(1) || 'home';
    let proto = h;
    if (h === 'customise') { h = 'menu'; pendingOpen = pendingOpen || 'millet-miso'; }
    if (!SCREENS.includes(h)) { h = 'home'; proto = 'home'; }
    closePanel(false);
    closeMobileNav();
    if (current === 'cart' && h !== 'cart') orderConfirm = null;
    if (current === 'reserve' && h !== 'reserve') resConfirm = null;
    if (h !== current) {
      $$('.screen').forEach((s) => { s.hidden = s.dataset.screen !== h; });
      current = h;
      if (h === 'menu') renderMenu();
      if (h === 'cart') renderCartScreen();
      if (h === 'reserve') renderReserve();
      window.scrollTo(0, 0);
      if (!firstRoute) $('#main').focus({ preventScroll: true });
    }
    firstRoute = false;
    document.title = TITLES[h];
    $$('[data-nav]').forEach((a) => (a.dataset.nav === h ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current')));
    $$('[data-proto]').forEach((a) => a.setAttribute('aria-current', String(a.dataset.proto === proto)));
    updateCartBar();
    if (pendingScroll) { const el = document.getElementById(pendingScroll); pendingScroll = null; if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 30); }
    if (pendingOpen && h === 'menu') { const id = pendingOpen; pendingOpen = null; setTimeout(() => openDish(id), 120); }
  }
  window.addEventListener('hashchange', route);

  document.addEventListener('click', (e) => {
    const sc = e.target.closest('[data-scroll]');
    if (sc) {
      e.preventDefault();
      closeMobileNav();
      if (current !== 'home') { pendingScroll = sc.dataset.scroll; location.hash = 'home'; }
      else document.getElementById(sc.dataset.scroll).scrollIntoView({ behavior: 'smooth' });
      return;
    }
    const oa = e.target.closest('[data-open-after]');
    if (oa) pendingOpen = oa.dataset.openAfter;
  });

  /* ---------- Header ---------- */
  const header = $('.site-header');
  window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 8), { passive: true });
  const menuToggle = $('#menuToggle');
  const mobileNav = $('#mobileNav');
  function closeMobileNav() { mobileNav.hidden = true; menuToggle.setAttribute('aria-expanded', 'false'); menuToggle.setAttribute('aria-label', 'Open menu'); }
  menuToggle.addEventListener('click', () => {
    const open = mobileNav.hidden;
    mobileNav.hidden = !open;
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  $('#cartBtn').addEventListener('click', (e) => { renderCartPanel(); openPanel('cartPanel', e.currentTarget); });
  $('#cbOpen').addEventListener('click', (e) => { renderCartPanel(); openPanel('cartPanel', e.currentTarget); });

  /* ---------- Home ---------- */
  $$('[data-img]').forEach((el) => {
    const key = el.dataset.img;
    el.src = img(key, key === 'hero' ? 1400 : el.closest('.pick-card') ? 200 : 1000);
  });
  $('#featureRow').innerHTML = ['millet-miso', 'lemongrass-chicken', 'kombucha-hibiscus', 'date-mousse'].map((id) => {
    const d = dishById(id);
    return `<a class="feature-card" href="#menu" data-open-after="${d.id}">
      <div class="ph"><img src="${img(d.id, 700)}" alt="" loading="lazy"></div>
      <div class="fc-body">
        <span class="eyebrow" style="font-size:.7rem">${esc(catById(d.cat).name)}</span>
        <h3>${esc(d.name)}</h3>
        <div class="fc-meta"><span>${d.kcal} kcal · ${d.protein} g protein</span><strong>${inr(d.price)}</strong></div>
      </div></a>`;
  }).join('');

  /* ---------- Menu ---------- */
  const mf = { cat: 'all', diet: 'all', tags: new Set(), q: '' };

  $('#catTabs').innerHTML = [{ id: 'all', name: 'All' }, ...CATEGORIES]
    .map((c) => `<button class="cat-tab" type="button" data-cat="${c.id}" aria-pressed="${c.id === 'all'}">${esc(c.name)}</button>`).join('');
  $('#chips').innerHTML = `<div class="seg" role="group" aria-label="Diet">
      <button type="button" data-diet="all" aria-pressed="true">All</button>
      <button type="button" data-diet="veg" aria-pressed="false">${dietIcon('veg', true)}Veg</button>
      <button type="button" data-diet="nonveg" aria-pressed="false">${dietIcon('nonveg', true)}Non-veg</button>
    </div>` + FILTERS.map((f) => `<button class="chip" type="button" data-tag="${f.id}" aria-pressed="false">${f.label}</button>`).join('');

  $('#catTabs').addEventListener('click', (e) => {
    const b = e.target.closest('[data-cat]'); if (!b) return;
    mf.cat = b.dataset.cat;
    $$('[data-cat]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    renderMenu();
  });
  $('#chips').addEventListener('click', (e) => {
    const d = e.target.closest('[data-diet]');
    if (d) { mf.diet = d.dataset.diet; $$('[data-diet]').forEach((x) => x.setAttribute('aria-pressed', String(x === d))); renderMenu(); return; }
    const t = e.target.closest('[data-tag]');
    if (t) {
      const on = !mf.tags.has(t.dataset.tag);
      on ? mf.tags.add(t.dataset.tag) : mf.tags.delete(t.dataset.tag);
      t.setAttribute('aria-pressed', String(on));
      renderMenu();
    }
  });
  const search = $('#search');
  let searchTimer;
  search.addEventListener('input', () => {
    $('#searchClear').hidden = !search.value;
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => { mf.q = search.value.trim(); renderMenu(); }, 120);
  });
  $('#searchClear').addEventListener('click', () => { search.value = ''; mf.q = ''; $('#searchClear').hidden = true; renderMenu(); search.focus(); });
  function clearFilters() {
    mf.cat = 'all'; mf.diet = 'all'; mf.tags.clear(); mf.q = ''; search.value = ''; $('#searchClear').hidden = true;
    $$('[data-cat]').forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.cat === 'all')));
    $$('[data-diet]').forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.diet === 'all')));
    $$('[data-tag]').forEach((x) => x.setAttribute('aria-pressed', 'false'));
    renderMenu();
  }
  $('#clearFilters').addEventListener('click', clearFilters);

  const qtyInCart = (id) => cart.filter((l) => l.dishId === id).reduce((n, l) => n + l.qty, 0);

  function dishCard(d) {
    const n = qtyInCart(d.id);
    const badge = d.badge === 'chef' ? '<span class="badge chef">Chef’s pick</span>' : d.badge === 'best' ? '<span class="badge best">Bestseller</span>' : '';
    const allergens = d.allergens.length ? `<b>Contains:</b> ${d.allergens.join(', ')}` : 'No major allergens';
    const custom = d.groups.length > 0;
    return `<article class="dish" aria-labelledby="dn-${d.id}">
      <div class="dish-media"><img src="${img(d.id, 700)}" alt="" loading="lazy" width="700" height="481">${badge}
        <span class="in-cart" data-incart="${d.id}" ${n ? '' : 'hidden'}>${n} in order</span></div>
      <div class="dish-body">
        <div class="dish-title">${dietIcon(d.diet)}<h3 id="dn-${d.id}"><button type="button" class="dish-name-btn" data-open="${d.id}" ${custom ? 'aria-haspopup="dialog"' : 'data-view="1" aria-haspopup="dialog"'}>${esc(d.name)}</button></h3></div>
        <p class="desc">${esc(d.desc)}</p>
        <ul class="meta"><li><strong>${d.kcal}</strong>&nbsp;kcal</li><li><strong>${d.protein} g</strong>&nbsp;protein</li>${d.spice ? `<li>${spiceIcons(d.spice)}</li>` : ''}</ul>
        <p class="allergens">${allergens}</p>
        <div class="dish-foot">
          <span class="price">${inr(d.price)}</span>
          ${custom
            ? `<button type="button" class="btn-add" data-open="${d.id}" aria-haspopup="dialog" aria-label="Customise and add ${esc(d.name)}">${icon('plus', 'icon-sm')}Add</button>`
            : `<button type="button" class="btn-add" data-quick="${d.id}" aria-label="Add ${esc(d.name)} to order">${icon('plus', 'icon-sm')}Add</button>`}
        </div>
      </div>
    </article>`;
  }

  function renderMenu() {
    const q = norm(mf.q);
    const list = DISHES.filter((d) => (mf.cat === 'all' || d.cat === mf.cat)
      && (mf.diet === 'all' || d.diet === mf.diet)
      && [...mf.tags].every((t) => d.tags[t])
      && (!q || norm(`${d.name} ${d.desc} ${catById(d.cat).name}`).includes(q)));
    const active = mf.diet !== 'all' || mf.tags.size || mf.q || mf.cat !== 'all';
    $('#clearFilters').hidden = !active;
    $('#resultCount').textContent = `${list.length} dish${list.length === 1 ? '' : 'es'}${mf.q ? ` matching “${mf.q}”` : ''}${mf.cat !== 'all' ? ` in ${catById(mf.cat).name}` : ''}`;
    const root = $('#menuList');
    if (!list.length) {
      root.innerHTML = `<div class="empty">${icon('search')}<h3>Nothing matches — yet.</h3><p>Try removing a filter or searching for an ingredient like “millet” or “paneer”.</p><button type="button" class="btn btn-outline" id="emptyClear">Clear all filters</button></div>`;
      $('#emptyClear').addEventListener('click', clearFilters);
      return;
    }
    const cats = mf.cat === 'all' ? CATEGORIES : [catById(mf.cat)];
    root.innerHTML = cats.map((c) => {
      const items = list.filter((d) => d.cat === c.id);
      if (!items.length) return '';
      return `<section class="cat-section" aria-labelledby="cat-${c.id}">
        <h2 id="cat-${c.id}">${esc(c.name)} <small>${items.length}</small></h2>
        <p class="cat-blurb">${esc(c.blurb)}</p>
        <div class="dish-grid">${items.map(dishCard).join('')}</div>
      </section>`;
    }).join('');
  }

  $('#menuList').addEventListener('click', (e) => {
    const o = e.target.closest('[data-open]');
    if (o) { openDish(o.dataset.open, { trigger: o }); return; }
    const q = e.target.closest('[data-quick]');
    if (q) {
      const d = dishById(q.dataset.quick);
      addToCart(d.id, defaultSel(d), '', 1);
      toast(`Added ${d.name}`);
    }
  });

  function updateInCart() {
    $$('[data-incart]').forEach((el) => {
      const n = qtyInCart(el.dataset.incart);
      el.hidden = !n;
      el.textContent = `${n} in order`;
    });
  }

  function renderMiniCart() {
    const { count, subtotal } = totals();
    const el = $('#miniCart');
    if (!count) {
      el.innerHTML = `<h2 id="mini-title">Your order</h2><div class="mini-empty">${icon('bag')}<p>Nothing here yet.<br>Add something good.</p></div>`;
      return;
    }
    el.innerHTML = `<h2 id="mini-title">Your order</h2>
      <p class="sub">${count} item${count === 1 ? '' : 's'} · ${orderMode === 'dine' ? 'Dine in' : 'Takeaway'}</p>
      <ul class="mini-lines">${cart.map((l) => {
        const d = dishById(l.dishId);
        const s = summaryOf(d, l.sel);
        return `<li class="mini-line"><span class="q">${l.qty}×</span><div>${esc(d.name)}${s ? `<small>${esc(s)}</small>` : ''}</div><span>${inr(unitPrice(d, l.sel) * l.qty)}</span></li>`;
      }).join('')}</ul>
      <div class="row-total"><span>Subtotal</span><span>${inr(subtotal)}</span></div>
      <a class="btn btn-primary btn-block" href="#cart">Review bill</a>
      <p class="sub" style="text-align:center;margin-top:10px">5% GST is added on the next step</p>`;
  }

  function updateCartBar() {
    const { count, subtotal } = totals();
    const show = current === 'menu' && count > 0;
    const bar = $('#cartBar');
    bar.classList.toggle('show', show);
    bar.setAttribute('aria-hidden', String(!show));
    $('#cbOpen').tabIndex = show ? 0 : -1;
    document.body.classList.toggle('has-cart-bar', show);
    $('#cbCount').textContent = `${count} item${count === 1 ? '' : 's'} · subtotal`;
    $('#cbTotal').textContent = inr(subtotal);
  }

  /* ---------- Dish customisation ---------- */
  let cz = null;
  function openDish(id, opts = {}) {
    const dish = dishById(id);
    if (!dish) return;
    cz = {
      dish,
      sel: opts.sel ? JSON.parse(JSON.stringify(opts.sel)) : defaultSel(dish),
      qty: opts.qty || 1,
      note: opts.note || '',
      editKey: opts.editKey || null,
    };
    renderDishPanel();
    openPanel('dishPanel', opts.trigger);
  }

  function groupHtml(g) {
    const sel = cz.sel[g.id] || [];
    const name = `g-${g.id}`;
    const tag = g.type === 'multi' ? '<span class="opt-tag">Optional</span>' : '<span class="opt-tag req">Required</span>';
    if (g.type === 'spice') {
      return `<fieldset class="opt-group"><legend><span>${g.label}</span>${tag}</legend>
        <div class="choices spice-seg">${g.choices.map((c, i) => `<label class="choice"><input type="radio" name="${name}" value="${i}" ${sel.includes(i) ? 'checked' : ''}>${spiceIcons(i + 1, true)}<span class="c-label">${c[0]}</span></label>`).join('')}</div></fieldset>`;
    }
    const type = g.type === 'multi' ? 'checkbox' : 'radio';
    return `<fieldset class="opt-group"><legend><span>${g.label}</span>${tag}</legend>
      <div class="choices">${g.choices.map((c, i) => `<label class="choice"><input type="${type}" name="${name}" value="${i}" ${sel.includes(i) ? 'checked' : ''}><span class="c-label">${esc(c[0])}</span><span class="c-price">${c[1] ? '+ ' + inr(c[1]) : (type === 'radio' ? 'Included' : '')}</span></label>`).join('')}</div></fieldset>`;
  }

  function renderDishPanel() {
    const d = cz.dish;
    const allergens = d.allergens.length ? `<b>Contains:</b> ${d.allergens.join(', ')}.` : 'No major allergens.';
    $('#dishPanel').innerHTML = `
      <div class="panel-body">
        <div class="cz-media"><img src="${img(d.id, 1000)}" alt="${esc(d.name)}"><button type="button" class="icon-btn" data-close aria-label="Close">${icon('x')}</button></div>
        <div class="cz-intro">
          <div class="dish-title">${dietIcon(d.diet)}<h2 id="czTitle">${esc(d.name)}</h2></div>
          <p>${esc(d.desc)}</p>
          <ul class="nutri" aria-label="Nutrition and spice">
            <li><strong>${d.kcal}</strong> kcal</li>
            <li><strong>${d.protein} g</strong> protein</li>
            ${d.vegan ? '<li>Vegan</li>' : ''}
            ${d.tags.gf ? '<li>Gluten-free</li>' : ''}
            ${d.spice ? `<li>${spiceIcons(d.spice, true)}${SPICE[d.spice]}</li>` : ''}
          </ul>
        </div>
        <div class="allergen-box">${icon('info')}<p>${allergens} Nutrition shown is for the standard recipe.</p></div>
        <form id="czForm" onsubmit="return false">
          ${d.groups.map(groupHtml).join('')}
          <div class="note-field"><label for="czNote">Note for the kitchen <span>Optional</span></label>
            <textarea id="czNote" maxlength="140" placeholder="e.g. no onions, dressing on the side">${esc(cz.note)}</textarea></div>
        </form>
      </div>
      <div class="panel-foot cz-foot">
        <div class="stepper" role="group" aria-label="Quantity">
          <button type="button" data-czqty="-1" aria-label="Decrease quantity">${icon('minus', 'icon-sm')}</button>
          <output id="czQty" aria-live="polite">${cz.qty}</output>
          <button type="button" data-czqty="1" aria-label="Increase quantity">${icon('plus', 'icon-sm')}</button>
        </div>
        <button type="button" class="btn btn-primary" id="czAdd"><span>${cz.editKey ? 'Update item' : 'Add to order'}</span><span id="czPrice"></span></button>
      </div>`;
    updateCzPrice();
  }

  function updateCzPrice() {
    const price = unitPrice(cz.dish, cz.sel) * cz.qty;
    const el = $('#czPrice');
    el.textContent = inr(price);
    $('#czQty').textContent = cz.qty;
    $('[data-czqty="-1"]').disabled = cz.qty <= 1;
    $('[data-czqty="1"]').disabled = cz.qty >= 20;
  }

  $('#dishPanel').addEventListener('change', (e) => {
    if (!cz || !e.target.name || !e.target.name.startsWith('g-')) return;
    const gid = e.target.name.slice(2);
    cz.sel[gid] = $$(`[name="g-${gid}"]:checked`, $('#dishPanel')).map((i) => +i.value);
    updateCzPrice();
  });
  $('#dishPanel').addEventListener('input', (e) => { if (e.target.id === 'czNote') cz.note = e.target.value; });
  $('#dishPanel').addEventListener('click', (e) => {
    const q = e.target.closest('[data-czqty]');
    if (q) { cz.qty = Math.min(20, Math.max(1, cz.qty + +q.dataset.czqty)); updateCzPrice(); return; }
    if (e.target.closest('#czAdd')) {
      const { dish, sel, qty, editKey } = cz;
      addToCart(dish.id, sel, cz.note.trim(), qty, editKey);
      closePanel();
      toast(editKey ? `Updated ${dish.name}` : `Added ${qty} × ${dish.name}`);
    }
  });

  /* ---------- Cart lines (shared by drawer + page) ---------- */
  function lineHtml(l, i) {
    const d = dishById(l.dishId);
    const unit = unitPrice(d, l.sel);
    const s = summaryOf(d, l.sel);
    return `<li class="line" data-i="${i}">
      <img src="${img(d.id, 240)}" alt="" loading="lazy">
      <div>
        <div class="line-top"><h3>${dietIcon(d.diet)}<span>${esc(d.name)}</span></h3><span class="line-price">${inr(unit * l.qty)}</span></div>
        ${s ? `<p class="line-opts">${esc(s)}</p>` : ''}
        ${l.note ? `<p class="line-opts">Note: “${esc(l.note)}”</p>` : ''}
        <p class="line-unit">${inr(unit)} each</p>
        <div class="line-actions">
          <div class="stepper sm" role="group" aria-label="Quantity of ${esc(d.name)}">
            <button type="button" data-act="dec" aria-label="Decrease quantity of ${esc(d.name)}" ${l.qty <= 1 ? 'disabled' : ''}>${icon('minus', 'icon-sm')}</button>
            <output aria-live="polite">${l.qty}</output>
            <button type="button" data-act="inc" aria-label="Increase quantity of ${esc(d.name)}" ${l.qty >= 20 ? 'disabled' : ''}>${icon('plus', 'icon-sm')}</button>
          </div>
          ${d.groups.length ? `<button type="button" class="text-btn" data-act="edit" aria-label="Edit ${esc(d.name)}">${icon('pencil', 'icon-sm')}Edit</button>` : ''}
          <button type="button" class="text-btn danger" data-act="remove" aria-label="Remove ${esc(d.name)}">${icon('trash', 'icon-sm')}Remove</button>
        </div>
      </div>
    </li>`;
  }

  function onLineAction(e, container) {
    const b = e.target.closest('[data-act]');
    if (!b) return;
    const i = +b.closest('[data-i]').dataset.i;
    const l = cart[i];
    if (!l) return;
    const act = b.dataset.act;
    const d = dishById(l.dishId);
    if (act === 'edit') {
      openDish(l.dishId, { sel: l.sel, qty: l.qty, note: l.note, editKey: l.key, trigger: current === 'cart' ? b : $('#cartBtn') });
      return;
    }
    if (act === 'inc') l.qty = Math.min(20, l.qty + 1);
    if (act === 'dec') l.qty = Math.max(1, l.qty - 1);
    if (act === 'remove') cart.splice(i, 1);
    cartChanged(false);
    if (act === 'remove') toast(`Removed ${d.name}`);
    // restore focus after re-render
    const root = container();
    const same = root && root.querySelector(`[data-i="${act === 'remove' ? Math.min(i, cart.length - 1) : i}"] [data-act="${act === 'remove' ? 'remove' : act}"]`);
    const fallback = root && root.querySelector('[data-i] [data-act="remove"]');
    const target = (same && !same.disabled) ? same : (root && root.querySelector(`[data-i="${i}"] [data-act="${act === 'inc' ? 'dec' : 'inc'}"]`)) || fallback;
    if (target) target.focus();
    else if (root) { const h = root.querySelector('h1, h2, h3'); if (h) { h.tabIndex = -1; h.focus(); } }
  }

  /* ---------- Cart drawer ---------- */
  function renderCartPanel() {
    const { count, subtotal } = totals();
    $('#cartPanel').innerHTML = `
      <div class="panel-head"><h2 id="cartPanelTitle">Your order${count ? ` <small style="font-family:var(--sans);font-size:.9rem;color:var(--muted)">(${count})</small>` : ''}</h2>
        <button type="button" class="icon-btn" data-close aria-label="Close your order">${icon('x')}</button></div>
      <div class="panel-body">${count
        ? `<ul class="cart-lines" id="panelLines">${cart.map(lineHtml).join('')}</ul>`
        : `<div class="drawer-empty">${icon('bag')}<h3>Your order is empty</h3><p>Good things are a tap away.</p><a class="btn btn-primary" href="#menu">Browse the menu</a></div>`}</div>
      ${count ? `<div class="panel-foot">
        <div class="foot-total"><span>Subtotal</span><span>${inr(subtotal)}</span></div>
        <p class="foot-note">5% GST is added at checkout.</p>
        <a class="btn btn-primary btn-block" href="#cart">Review bill &amp; checkout</a></div>` : ''}`;
  }
  $('#cartPanel').addEventListener('click', (e) => {
    if (e.target.closest('a[href="#menu"]') && current === 'menu') { e.preventDefault(); closePanel(); return; }
    onLineAction(e, () => $('#cartPanel'));
  });

  /* ---------- Cart page ---------- */
  let orderConfirm = null;
  let tableNo = '';
  let pickup = 'asap';

  function pickupOptions() {
    const now = new Date();
    const opts = ['<option value="asap">As soon as possible (about 20 min)</option>'];
    const t = new Date(now);
    t.setMinutes(Math.ceil((now.getMinutes() + 30) / 15) * 15, 0, 0);
    const close = new Date(now); close.setHours(22, 15, 0, 0);
    while (t <= close && opts.length < 30) {
      const label = t.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true });
      opts.push(`<option value="${label}" ${pickup === label ? 'selected' : ''}>${label}</option>`);
      t.setMinutes(t.getMinutes() + 15);
    }
    return opts.join('');
  }
  function modeExtraHtml() {
    return orderMode === 'dine'
      ? `<div class="field"><label for="tableNo">Table number <span class="opt">(optional)</span></label><input id="tableNo" inputmode="numeric" maxlength="3" placeholder="e.g. 12" value="${esc(tableNo)}"></div>`
      : `<div class="field"><label for="pickup">Pickup time</label><select id="pickup">${pickupOptions()}</select></div>`;
  }

  function renderCartScreen() {
    const root = $('#cartScreen');
    if (orderConfirm) { root.innerHTML = orderConfirmHtml(); $('#confirmTitle').focus(); return; }
    const t = totals();
    if (!t.count) {
      root.innerHTML = `<div class="container page-head"><span class="eyebrow">Checkout</span><h1>Your order</h1></div>
        <div class="container" style="padding-bottom:96px"><div class="empty">${icon('bag')}<h3>Your order is empty</h3><p>Pick a few dishes from the menu and they’ll show up here with a full bill.</p><a class="btn btn-primary" href="#menu">Browse the menu</a></div></div>`;
      return;
    }
    root.innerHTML = `
      <div class="container page-head"><span class="eyebrow">Checkout</span><h1>Your order</h1>
        <p>Check your dishes, choose dine-in or takeaway, and we’ll total it up.</p></div>
      <div class="container cart-layout">
        <div>
          <div class="card mode-switch">
            <h2 id="modeTitle">How would you like it?</h2>
            <div class="mode-opts" role="radiogroup" aria-labelledby="modeTitle">
              <label class="mode-opt"><input type="radio" name="mode" value="dine" ${orderMode === 'dine' ? 'checked' : ''}><span class="icon-wrap">${icon('utensils')}</span><span><strong>Dine in</strong><small>Served at your table</small></span></label>
              <label class="mode-opt"><input type="radio" name="mode" value="takeaway" ${orderMode === 'takeaway' ? 'checked' : ''}><span class="icon-wrap">${icon('bag')}</span><span><strong>Takeaway</strong><small>Packed for pickup</small></span></label>
            </div>
            <div class="mode-extra" id="modeExtra">${modeExtraHtml()}</div>
          </div>
          <div class="card" style="margin-top:16px">
            <h2 class="sr-only">Items</h2>
            <ul class="cart-page-lines" id="pageLines">${cart.map(lineHtml).join('')}</ul>
          </div>
          <a class="link-arrow" href="#menu" style="margin-top:20px">${icon('arrowLeft', 'icon-sm')}Add more dishes</a>
        </div>
        <aside class="card bill" aria-labelledby="billTitle">
          <h2 id="billTitle">Bill summary</h2>
          <ul class="bill-items">${cart.map((l) => { const d = dishById(l.dishId); return `<li><span>${l.qty} × ${esc(d.name)}</span><span>${inr2(unitPrice(d, l.sel) * l.qty)}</span></li>`; }).join('')}</ul>
          <dl class="bill-rows">
            <div><dt>Item total</dt><dd>${inr2(t.subtotal)}</dd></div>
            <div><dt>GST (5%)<small>CGST 2.5% + SGST 2.5%</small></dt><dd>${inr2(t.gst)}</dd></div>
          </dl>
          <div class="bill-total" id="billTotal" aria-live="polite"><span>To pay</span><strong>${inr2(t.total)}</strong></div>
          <button type="button" class="btn btn-primary btn-block" id="placeOrder">Place order · ${inr2(t.total)}</button>
          <p class="demo-note">${icon('info')}<span>Demo only — no payment is taken and no order reaches a kitchen.</span></p>
        </aside>
      </div>`;
    $('#billTotal').classList.add('flash');
  }

  $('#cartScreen').addEventListener('click', (e) => {
    if (e.target.closest('#placeOrder')) {
      const t = totals();
      orderConfirm = {
        ref: 'SAV-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
        mode: orderMode,
        detail: orderMode === 'dine' ? (tableNo ? `Table ${tableNo}` : 'Table to be assigned') : (pickup === 'asap' ? 'As soon as possible' : pickup),
        count: t.count,
        total: t.total,
      };
      cart = [];
      cartChanged(false);
      renderCartScreen();
      window.scrollTo(0, 0);
      return;
    }
    onLineAction(e, () => $('#pageLines') || $('#cartScreen'));
  });
  $('#cartScreen').addEventListener('change', (e) => {
    if (e.target.name === 'mode') {
      orderMode = e.target.value; persist(); renderMiniCart();
      $('#modeExtra').innerHTML = modeExtraHtml();
    }
    if (e.target.id === 'pickup') pickup = e.target.value;
  });
  $('#cartScreen').addEventListener('input', (e) => { if (e.target.id === 'tableNo') { e.target.value = e.target.value.replace(/\D/g, ''); tableNo = e.target.value; } });

  function orderConfirmHtml() {
    const o = orderConfirm;
    return `<div class="container confirm">
      <div class="confirm-icon">${icon('check')}</div>
      <h1 id="confirmTitle" tabindex="-1">Your order is in — almost.</h1>
      <p class="lead">This is the moment a real kitchen would fire up the stove. Here’s a summary of what you chose.</p>
      <div class="card confirm-card"><dl>
        <div><dt>Order reference</dt><dd class="ref">${o.ref}</dd></div>
        <div><dt>Order type</dt><dd>${o.mode === 'dine' ? 'Dine in' : 'Takeaway'}</dd></div>
        <div><dt>${o.mode === 'dine' ? 'Table' : 'Pickup'}</dt><dd>${esc(o.detail)}</dd></div>
        <div><dt>Items</dt><dd>${o.count}</dd></div>
        <div><dt>Total (incl. 5% GST)</dt><dd>${inr2(o.total)}</dd></div>
      </dl></div>
      <div class="demo-banner">${icon('info')}<p><strong>Portfolio demo.</strong> No order has been sent to a restaurant and no payment has been taken.</p></div>
      <div class="confirm-actions"><a class="btn btn-primary" href="#menu">Back to the menu</a><a class="btn btn-outline" href="#home">Home</a></div>
    </div>`;
  }

  /* ---------- Reservations ---------- */
  let resConfirm = null;
  const res = { date: null, time: null, guests: 2, name: '', phone: '', email: '', seat: 'none', occasion: '', notes: '' };
  let resSubmitted = false;
  const days = () => {
    const out = [];
    const t = new Date(); t.setHours(0, 0, 0, 0);
    for (let i = 0; i <= 10; i++) { const d = new Date(t); d.setDate(t.getDate() + i); out.push(d); }
    return out;
  };
  const SLOTS = (() => { const s = []; for (let m = 8 * 60; m <= 22 * 60; m += 30) s.push(m); return s; })();
  const slotLabel = (m) => { const h = Math.floor(m / 60), mm = m % 60; return `${((h + 11) % 12) + 1}:${String(mm).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`; };
  const slotDisabled = (dayIdx, m) => { if (dayIdx !== 0) return false; const n = new Date(); return m < n.getHours() * 60 + n.getMinutes() + 30; };

  function slotsHtml() {
    const groups = [['Morning', 8 * 60, 11 * 60 + 30], ['Afternoon', 12 * 60, 16 * 60 + 30], ['Evening', 17 * 60, 22 * 60]];
    const dayIdx = res.date ?? -1;
    if (dayIdx < 0) return '<p class="hint" style="margin:0">Pick a day first to see available times.</p>';
    const anyFree = SLOTS.some((m) => !slotDisabled(dayIdx, m));
    if (!anyFree) return '<p class="hint" style="margin:0">We’re fully past seating times for today — please choose another day.</p>';
    return groups.map(([label, from, to]) => {
      const ms = SLOTS.filter((m) => m >= from && m <= to);
      return `<div class="slot-group"><h3>${label}</h3><div class="slots">${ms.map((m) => {
        const dis = slotDisabled(dayIdx, m);
        return `<label class="slot"><input type="radio" name="time" value="${m}" ${res.time === m ? 'checked' : ''} ${dis ? 'disabled' : ''} aria-describedby="err-time">${slotLabel(m)}${dis ? '<span class="sr-only"> (unavailable)</span>' : ''}</label>`;
      }).join('')}</div></div>`;
    }).join('');
  }

  function renderReserve() {
    const root = $('#reserveScreen');
    if (resConfirm) { root.innerHTML = resConfirmHtml(); $('#resConfirmTitle').focus(); return; }
    const ds = days();
    root.innerHTML = `<div class="container reserve-layout">
      <div class="reserve-aside">
        <span class="eyebrow">Reservations</span>
        <h1>Book a table</h1>
        <p class="lead">Join us for a slow breakfast, a long lunch or an easy dinner. We’ll hold your table for 15 minutes.</p>
        <ul class="info-list">
          <li>${icon('clock')}<span>Open every day, 8:00 AM – 10:30 PM. Last seating at 10:00 PM.</span></li>
          <li>${icon('calendar')}<span>Book today or up to 10 days ahead.</span></li>
          <li>${icon('users')}<span>Groups of 11 or more — please call us on +91 80 0000 0000.</span></li>
          <li>${icon('pin')}<span>14, 12th Main Road, Indiranagar, Bengaluru</span></li>
        </ul>
        <div class="arch"><img src="${img('reserve', 900)}" alt="A warm, softly lit restaurant dining room with wooden tables" loading="lazy"></div>
      </div>
      <form class="card form-card" id="resForm" novalidate aria-labelledby="resFormTitle">
        <h2 id="resFormTitle" class="sr-only">Reservation details</h2>
        <div id="errSummary" tabindex="-1"></div>
        <fieldset class="form-step">
          <legend class="h"><span class="step-num" aria-hidden="true">1</span>Pick a day</legend>
          <p class="hint">Today or up to 10 days ahead.</p>
          <div class="date-row">${ds.map((d, i) => `<label class="date-chip"><input type="radio" name="date" value="${i}" id="date-${i}" ${res.date === i ? 'checked' : ''} aria-describedby="err-date">
            <span class="d-w">${i === 0 ? 'Today' : i === 1 ? 'Tmrw' : d.toLocaleDateString('en-IN', { weekday: 'short' })}</span>
            <span class="d-n">${d.getDate()}</span><span class="d-m">${d.toLocaleDateString('en-IN', { month: 'short' })}</span>
            <span class="sr-only">${d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</span></label>`).join('')}</div>
          <p class="err group-err" id="err-date"></p>
        </fieldset>
        <fieldset class="form-step">
          <legend class="h"><span class="step-num" aria-hidden="true">2</span>Choose a time</legend>
          <p class="hint">30-minute slots. Times that have passed are unavailable.</p>
          <div id="slotWrap">${slotsHtml()}</div>
          <p class="err group-err" id="err-time"></p>
        </fieldset>
        <div class="form-step">
          <h2 id="guestTitle"><span class="step-num" aria-hidden="true">3</span>Guests</h2>
          <p class="hint">Up to 10 guests can book online.</p>
          <div class="guest-row">
            <div class="stepper" role="group" aria-labelledby="guestTitle">
              <button type="button" data-guest="-1" aria-label="Fewer guests">${icon('minus', 'icon-sm')}</button>
              <output id="guestOut" aria-live="polite">${res.guests}</output>
              <button type="button" data-guest="1" aria-label="More guests">${icon('plus', 'icon-sm')}</button>
            </div>
            <span id="guestLabel">${res.guests === 1 ? 'guest' : 'guests'}</span>
            <p class="guest-note" id="guestNote" hidden>Bigger group? Call us on +91 80 0000 0000 for 11 or more.</p>
          </div>
        </div>
        <fieldset class="form-step">
          <legend class="h"><span class="step-num" aria-hidden="true">4</span>Your details</legend>
          <p class="hint">So we know who to expect.</p>
          <div class="fields two">
            <div class="field"><label for="res-name">Full name</label><input id="res-name" name="name" autocomplete="name" value="${esc(res.name)}" aria-describedby="err-name"><p class="err" id="err-name"></p></div>
            <div class="field"><label for="res-phone">Mobile number</label><div class="prefix"><span aria-hidden="true">+91</span><input id="res-phone" name="phone" type="tel" inputmode="numeric" autocomplete="tel-national" maxlength="12" value="${esc(res.phone)}" aria-describedby="err-phone"></div><p class="err" id="err-phone"></p></div>
          </div>
          <div class="fields" style="margin-top:16px">
            <div class="field"><label for="res-email">Email <span class="opt">(optional)</span></label><input id="res-email" name="email" type="email" autocomplete="email" value="${esc(res.email)}" aria-describedby="err-email"><p class="err" id="err-email"></p></div>
          </div>
        </fieldset>
        <fieldset class="form-step">
          <legend class="h"><span class="step-num" aria-hidden="true">5</span>Preferences</legend>
          <p class="hint">All optional.</p>
          <div class="seats" role="radiogroup" aria-label="Seating preference">
            ${[['indoor', 'Indoor'], ['outdoor', 'Garden patio'], ['none', 'No preference']].map(([v, l]) => `<label class="seat"><input type="radio" name="seat" value="${v}" ${res.seat === v ? 'checked' : ''}>${l}</label>`).join('')}
          </div>
          <div class="fields two" style="margin-top:16px">
            <div class="field"><label for="res-occasion">Occasion</label><select id="res-occasion" name="occasion">
              ${['', 'Birthday', 'Anniversary', 'Date night', 'Business meal', 'Family get-together'].map((o) => `<option value="${o}" ${res.occasion === o ? 'selected' : ''}>${o || 'None'}</option>`).join('')}
            </select></div>
            <div class="field"><label for="res-notes">Notes <span class="opt">(optional)</span></label><input id="res-notes" name="notes" maxlength="140" placeholder="High chair, allergies…" value="${esc(res.notes)}"></div>
          </div>
        </fieldset>
        <div class="form-submit">
          <button type="submit" class="btn btn-primary btn-block">Request table</button>
          <p class="demo-note" style="justify-content:center">${icon('info')}<span>Demo only — no real reservation is made.</span></p>
        </div>
      </form>
    </div>`;
    updateGuests();
  }

  function updateGuests() {
    $('#guestOut').textContent = res.guests;
    $('#guestLabel').textContent = res.guests === 1 ? 'guest' : 'guests';
    $('[data-guest="-1"]').disabled = res.guests <= 1;
    $('[data-guest="1"]').disabled = res.guests >= 10;
    $('#guestNote').hidden = res.guests < 10;
  }

  function validate() {
    const errs = [];
    const digits = res.phone.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '');
    if (res.date === null) errs.push(['date', 'Choose a day for your visit', 'date-0']);
    if (res.time === null) errs.push(['time', 'Choose a time slot', res.date === null ? 'date-0' : null]);
    if (res.name.trim().length < 2) errs.push(['name', 'Enter your name', 'res-name']);
    if (!/^[6-9]\d{9}$/.test(digits)) errs.push(['phone', res.phone ? 'Enter a valid 10-digit Indian mobile number' : 'Enter your mobile number', 'res-phone']);
    if (res.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(res.email.trim())) errs.push(['email', 'Enter a valid email address, or leave it blank', 'res-email']);
    ['date', 'time', 'name', 'phone', 'email'].forEach((k) => {
      const e = errs.find((x) => x[0] === k);
      const p = $('#err-' + k);
      if (p) p.innerHTML = e ? icon('alert') + esc(e[1]) : '';
      const field = { name: '#res-name', phone: '#res-phone', email: '#res-email' }[k];
      if (field) $(field).setAttribute('aria-invalid', String(!!e));
    });
    return errs;
  }

  $('#reserveScreen').addEventListener('change', (e) => {
    const t = e.target;
    if (t.name === 'date') {
      res.date = +t.value;
      if (res.time !== null && slotDisabled(res.date, res.time)) res.time = null;
      $('#slotWrap').innerHTML = slotsHtml();
    }
    if (t.name === 'time') res.time = +t.value;
    if (t.name === 'seat') res.seat = t.value;
    if (t.name === 'occasion') res.occasion = t.value;
    if (resSubmitted) validate();
  });
  $('#reserveScreen').addEventListener('input', (e) => {
    const t = e.target;
    if (['name', 'phone', 'email', 'notes'].includes(t.name)) res[t.name] = t.value;
    if (resSubmitted) validate();
  });
  $('#reserveScreen').addEventListener('click', (e) => {
    const g = e.target.closest('[data-guest]');
    if (g) { res.guests = Math.min(10, Math.max(1, res.guests + +g.dataset.guest)); updateGuests(); return; }
    const f = e.target.closest('[data-focus]');
    if (f) { e.preventDefault(); const el = document.getElementById(f.dataset.focus); if (el) { el.focus(); el.scrollIntoView({ block: 'center', behavior: 'smooth' }); } return; }
    if (e.target.closest('#newBooking')) {
      Object.assign(res, { date: null, time: null, guests: 2, name: '', phone: '', email: '', seat: 'none', occasion: '', notes: '' });
      resSubmitted = false; resConfirm = null; renderReserve(); window.scrollTo(0, 0);
    }
  });
  $('#reserveScreen').addEventListener('submit', (e) => {
    e.preventDefault();
    resSubmitted = true;
    const errs = validate();
    const sum = $('#errSummary');
    if (errs.length) {
      sum.innerHTML = `<div class="error-summary" role="alert"><h2>Please check ${errs.length === 1 ? 'one thing' : `${errs.length} things`}</h2><ul>${errs.map(([k, msg, target]) => {
        const id = target || (k === 'time' ? ($('#slotWrap input:not(:disabled)') || {}).id : null);
        return `<li>${id || k === 'time' ? `<a href="#" data-focus="${k === 'time' && !target ? 'slotWrap' : id}">${esc(msg)}</a>` : esc(msg)}</li>`;
      }).join('')}</ul></div>`;
      // give slot radios ids lazily for focus
      const firstSlot = $('#slotWrap input:not(:disabled)');
      if (firstSlot) firstSlot.id = 'slotWrap-first';
      $$('[data-focus="slotWrap"]').forEach((a) => { a.dataset.focus = firstSlot ? 'slotWrap-first' : 'date-0'; });
      sum.focus();
      sum.scrollIntoView({ block: 'center', behavior: 'smooth' });
      return;
    }
    sum.innerHTML = '';
    const d = days()[res.date];
    resConfirm = {
      ref: 'SVR-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
      first: res.name.trim().split(/\s+/)[0],
      date: d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
      time: slotLabel(res.time),
      guests: res.guests,
      seat: { indoor: 'Indoor', outdoor: 'Garden patio', none: 'No preference' }[res.seat],
      occasion: res.occasion,
      phone: '+91 ' + res.phone.replace(/\D/g, '').slice(-10),
    };
    renderReserve();
    window.scrollTo(0, 0);
  });

  function resConfirmHtml() {
    const r = resConfirm;
    return `<div class="container confirm">
      <div class="confirm-icon">${icon('check')}</div>
      <h1 id="resConfirmTitle" tabindex="-1">See you soon, ${esc(r.first)}.</h1>
      <p class="lead">Here’s your table request. If SAVORÉ were a real restaurant, we’d text you a confirmation now.</p>
      <div class="card confirm-card"><dl>
        <div><dt>Reference</dt><dd class="ref">${r.ref}</dd></div>
        <div><dt>Date</dt><dd>${r.date}</dd></div>
        <div><dt>Time</dt><dd>${r.time}</dd></div>
        <div><dt>Guests</dt><dd>${r.guests}</dd></div>
        <div><dt>Seating</dt><dd>${r.seat}</dd></div>
        ${r.occasion ? `<div><dt>Occasion</dt><dd>${esc(r.occasion)}</dd></div>` : ''}
        <div><dt>Mobile</dt><dd>${esc(r.phone)}</dd></div>
      </dl></div>
      <div class="demo-banner">${icon('info')}<p><strong>Portfolio demo.</strong> No real reservation has been made and no message will be sent.</p></div>
      <div class="confirm-actions"><button type="button" class="btn btn-primary" id="newBooking">Make another booking</button><a class="btn btn-outline" href="#menu">Browse the menu</a></div>
    </div>`;
  }

  /* ---------- Init ---------- */
  cartChanged(false);
  route();
})();
