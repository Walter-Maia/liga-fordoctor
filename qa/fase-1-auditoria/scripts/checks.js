async function (mode) {
  const W = innerWidth, H = innerHeight;
  const vis = el => { const s = getComputedStyle(el); const r = el.getBoundingClientRect(); return s.display !== 'none' && s.visibility !== 'hidden' && +s.opacity > 0.05 && r.width > 0 && r.height > 0; };
  const sel = el => { if (!el) return ''; let s = el.tagName.toLowerCase(); if (el.id) s += '#' + el.id; const c = [...el.classList].filter(x => /elementor-element-|elementor-button|elementor-field|heading|form/.test(x)).slice(0, 2); if (c.length) s += '.' + c.join('.'); return s; };
  const txt = el => (el.innerText || el.value || el.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 60);
  const out = { W, H, scrollW: document.documentElement.scrollWidth, bodyScrollW: document.body.scrollWidth, docH: document.documentElement.scrollHeight };

  // 1ª dobra: o que está visível sem rolar
  const inFold = el => { const r = el.getBoundingClientRect(); return r.top < H && r.bottom > 0 && vis(el); };
  const h1 = document.querySelector('h1');
  out.h1 = h1 ? { text: txt(h1), top: Math.round(h1.getBoundingClientRect().top), inFold: inFold(h1), opacity: getComputedStyle(h1.closest('.elementor-element') || h1).opacity, font: getComputedStyle(h1).fontFamily.split(',')[0], size: getComputedStyle(h1).fontSize, weight: getComputedStyle(h1).fontWeight, color: getComputedStyle(h1).color } : null;
  out.ctas = [...document.querySelectorAll('a.elementor-button, button[type=submit]')].map(el => { const r = el.getBoundingClientRect(); return { text: txt(el), top: Math.round(r.top + scrollY), w: Math.round(r.width), h: Math.round(r.height), inFold: inFold(el), visible: vis(el) }; });
  const form = document.querySelector('form.elementor-form');
  if (form) { const r = form.getBoundingClientRect(); out.form = { top: Math.round(r.top + scrollY), height: Math.round(r.height), inFold: inFold(form), screensDown: +((r.top + scrollY) / H).toFixed(1) }; }
  out.invisibleAnimated = [...document.querySelectorAll('.elementor-invisible')].length;
  out.hiddenInFold = [...document.querySelectorAll('h1,h2,p,.elementor-button,img')].filter(el => { const r = el.getBoundingClientRect(); return r.top < H && r.bottom > 0 && r.width > 0 && !vis(el); }).map(el => sel(el) + ' ' + txt(el)).slice(0, 10);
  out.fixedHeader = [...document.querySelectorAll('body *')].filter(el => { const p = getComputedStyle(el).position; return (p === 'fixed' || p === 'sticky') && el.getBoundingClientRect().height > 30 && vis(el); }).map(el => sel(el) + ' h=' + Math.round(el.getBoundingClientRect().height)).slice(0, 5);
  if (mode === 'fold') return out;

  // overflow horizontal: elementos visíveis que passam da largura
  out.overflow = [...document.querySelectorAll('body *')].filter(el => { const r = el.getBoundingClientRect(); return vis(el) && (r.right > W + 1 || r.left < -1) && r.width < 5000; })
    .filter(el => !el.closest('.elementor-shape')).map(el => { const r = el.getBoundingClientRect(); return `${sel(el)} L${Math.round(r.left)} R${Math.round(r.right)} "${txt(el).slice(0, 30)}"`; }).slice(0, 12);

  // alvos de toque
  out.smallTargets = [...document.querySelectorAll('a[href], button, input:not([type=hidden]), select, summary, [role=button]')].filter(vis)
    .map(el => { const r = el.getBoundingClientRect(); return { s: sel(el), t: txt(el), w: Math.round(r.width), h: Math.round(r.height) }; }).filter(o => o.w < 44 || o.h < 44);

  // títulos e parágrafos: linhas, viúvas e comprimento de linha
  const lines = el => {
    const words = []; const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) { const n = walker.currentNode; const re = /\S+/g; let m; while ((m = re.exec(n.data))) { const rg = document.createRange(); rg.setStart(n, m.index); rg.setEnd(n, m.index + m[0].length); const rr = rg.getClientRects()[0]; if (rr) words.push({ w: m[0], top: Math.round(rr.top), right: rr.right, left: rr.left }); } }
    const groups = []; for (const w of words) { const g = groups.find(g => Math.abs(g.top - w.top) < 6); if (g) { g.words.push(w.w); g.left = Math.min(g.left, w.left); g.right = Math.max(g.right, w.right); } else groups.push({ top: w.top, words: [w.w], left: w.left, right: w.right }); }
    return groups.sort((a, b) => a.top - b.top);
  };
  out.text = [...document.querySelectorAll('h1, h2, h3, .elementor-widget-text-editor p, .elementor-widget-text-editor li, .elementor-icon-list-text')].filter(vis).map(el => {
    const ls = lines(el); const st = getComputedStyle(el); const last = ls[ls.length - 1];
    const maxChars = Math.max(...ls.map(l => l.words.join(' ').length));
    return { tag: el.tagName, t: txt(el).slice(0, 50), size: st.fontSize, lh: st.lineHeight, font: st.fontFamily.split(',')[0].replace(/"/g, ''), weight: st.fontWeight, color: st.color, align: st.textAlign, transform: st.textTransform, lines: ls.length, widow: ls.length > 1 && last.words.length === 1 ? last.words[0] : null, maxChars, wrap: st.textWrap || st.textWrapStyle || '' };
  });

  // formulário: rótulos, autocomplete, fonte dos campos, validação
  out.fields = [...document.querySelectorAll('form.elementor-form input:not([type=hidden]), form.elementor-form select')].map(el => {
    const lab = el.id && document.querySelector(`label[for="${el.id}"]`); const st = getComputedStyle(el); const r = el.getBoundingClientRect();
    let v = {}; try { if (el.type === 'tel') { const old = el.value; el.value = 'abc'; v.badTel = el.validationMessage; el.value = old; } v.empty = el.validationMessage; } catch (e) {}
    return { name: el.name, type: el.type, placeholder: el.placeholder, label: lab ? txt(lab) : null, labelVisible: lab ? vis(lab) : false, ariaLabel: el.getAttribute('aria-label'), autocomplete: el.getAttribute('autocomplete'), inputmode: el.getAttribute('inputmode'), fontSize: st.fontSize, h: Math.round(r.height), w: Math.round(r.width), color: st.color, bg: st.backgroundColor, border: st.borderColor, placeholderColor: getComputedStyle(el, '::placeholder').color, validity: v, pattern: el.getAttribute('pattern'), patternValid: (() => { const p = el.getAttribute('pattern'); if (!p) return null; try { new RegExp('^(?:' + p + ')$', 'v'); return true; } catch (e) { return 'inválido com flag v: ' + e.message.slice(0, 80); } })() };
  });

  // foco visível no CTA (simulado)
  const btn = document.querySelector('a.elementor-button');
  if (btn) { btn.focus(); const s = getComputedStyle(btn); out.focusStyle = { outline: s.outlineStyle + ' ' + s.outlineWidth + ' ' + s.outlineColor, boxShadow: s.boxShadow, matchesFocusVisible: btn.matches(':focus-visible') }; btn.blur(); }

  // fontes efetivamente carregadas
  await document.fonts.ready;
  out.fontsLoaded = [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family.replace(/"/g, '') + ' ' + f.weight + ' ' + f.style);
  out.computedFonts = [...new Set([...document.querySelectorAll('body *')].filter(vis).filter(el => [...el.childNodes].some(n => n.nodeType === 3 && n.data.trim())).map(el => getComputedStyle(el).fontFamily.split(',')[0].replace(/"/g, '').trim()))];

  // imagens: tamanho natural x exibido
  out.imgs = [...document.querySelectorAll('img')].filter(vis).map(img => { const r = img.getBoundingClientRect(); return { src: (img.currentSrc || img.src).split('/').pop().slice(0, 50), natural: img.naturalWidth + 'x' + img.naturalHeight, shown: Math.round(r.width) + 'x' + Math.round(r.height), dpr: devicePixelRatio, ratioDiff: img.naturalWidth ? +(Math.abs((img.naturalWidth / img.naturalHeight) - (r.width / r.height))).toFixed(3) : null, objectFit: getComputedStyle(img).objectFit, loading: img.loading, alt: img.alt }; });
  // fundos com imagem
  out.bgImgs = [...document.querySelectorAll('.elementor-element')].filter(el => { const b = getComputedStyle(el).backgroundImage; return b && b !== 'none' && b.includes('url('); }).map(el => { const r = el.getBoundingClientRect(); return { s: sel(el), bg: getComputedStyle(el).backgroundImage.match(/[^/]+\.(webp|png|jpe?g|avif)/)?.[0], size: getComputedStyle(el).backgroundSize, box: Math.round(r.width) + 'x' + Math.round(r.height), top: Math.round(r.top + scrollY) }; });
  out.widgets = [...new Set([...document.querySelectorAll('[data-widget_type]')].map(e => e.dataset.widget_type))];
  out.animatedEls = [...document.querySelectorAll('[data-settings*="animation"]')].length;
  out.htmlClass = document.documentElement.className;
  out.lenis = !!document.documentElement.className.match(/lenis/);
  return out;
}
