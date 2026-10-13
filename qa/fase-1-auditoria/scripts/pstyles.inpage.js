(() => {
  const parse = c => (c.match(/[\d.]+/g) || []).map(Number);
  const lum = ([r, g, b]) => { const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }; return .2126 * f(r) + .7152 * f(g) + .0722 * f(b); };
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return +((Math.max(x, y) + .05) / (Math.min(x, y) + .05)).toFixed(2); };
  const bgOf = el => { let e = el; while (e) { const s = getComputedStyle(e); const c = parse(s.backgroundColor); if (c.length === 3 || (c.length === 4 && c[3] > 0.9)) return { c: c.slice(0, 3) }; if (s.backgroundImage !== 'none') return { img: (s.backgroundImage.match(/[\w-]+\.(webp|png)/) || ['gradiente'])[0] }; e = e.parentElement; } return { c: [255, 255, 255] }; };
  return [...document.querySelectorAll('p.elementor-heading-title, p.elementor-heading-title span, .elementor-widget-text-editor p, h2 span[style]')].map(el => {
    const s = getComputedStyle(el); const bg = bgOf(el); const fg = parse(s.color);
    return { t: el.innerText.trim().replace(/\s+/g, ' ').slice(0, 40), size: s.fontSize, weight: s.fontWeight, style: s.fontStyle, color: s.color, bg: bg.img ? 'img:' + bg.img : 'rgb(' + bg.c.join(',') + ')', ratio: bg.c ? ratio(fg, bg.c) : null, align: s.textAlign };
  });
})()
