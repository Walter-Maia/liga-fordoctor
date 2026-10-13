// Teste de responsividade em várias resoluções: estouro, texto cortado, alvos de toque, viúvas, CTA na dobra,
// nitidez das imagens (densidade da tela) e captura da página inteira. Uso: node qa/scripts/responsivo.js
const fs = require('fs');
const path = require('path');
const { launch, screenshot, sleep } = require('../fase-1-auditoria/scripts/cdp');

const URL_ = 'file:///' + path.resolve(__dirname, '../../preview/index.html').split(path.sep).join('/') + '?intro=0';
const OUT = path.join(__dirname, '..', 'responsivo-v0.4');
fs.mkdirSync(path.join(OUT, 'capturas'), { recursive: true });
const TELAS = [
  [280, 653, 3, 'dobrável fechado'], [320, 568, 2, 'celular pequeno'], [360, 740, 3, 'Android comum'], [375, 667, 2, 'iPhone SE'],
  [390, 844, 3, 'iPhone 14'], [414, 896, 2, 'iPhone grande'], [430, 932, 3, 'iPhone Pro Max'], [844, 390, 3, 'celular deitado'],
  [768, 1024, 2, 'iPad retrato'], [820, 1180, 2, 'iPad Air retrato'], [1024, 768, 2, 'iPad deitado'], [1180, 820, 2, 'iPad Air deitado'],
  [1280, 800, 1, 'notebook'], [1366, 768, 1, 'notebook comum'], [1440, 900, 1, 'desktop'], [1600, 900, 1, 'desktop largo'],
  [1920, 1080, 1, 'Full HD'], [2560, 1440, 1, 'QHD']
];

const VERIFICA = `(() => {
  const W = innerWidth, H = innerHeight;
  const vis = el => { const s = getComputedStyle(el), r = el.getBoundingClientRect(); return s.display !== 'none' && s.visibility !== 'hidden' && r.width > 0 && r.height > 0; };
  const decor = el => el.closest('.aneis, .ondas, .pular, .sprite');
  const txt = el => (el.innerText || el.getAttribute('aria-label') || '').replace(/\\s+/g, ' ').trim().slice(0, 40);
  const estouro = [...document.querySelectorAll('body *')].filter(el => !decor(el) && vis(el)).filter(el => { const r = el.getBoundingClientRect(); return r.right > W + 1 || r.left < -1; })
    .filter(el => !el.closest('.secao--liga .liga__fundo')).map(el => el.tagName.toLowerCase() + '.' + [...el.classList].join('.'));
  const cortado = [...document.querySelectorAll('h1, h2, h3, p, li, dd, dt, summary, label, .botao, .degrau__valor')].filter(vis).filter(el => el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).overflowX !== 'visible').map(el => txt(el));
  const largosDemais = [...document.querySelectorAll('h1, h2, h3, p, li, dd, .botao')].filter(vis).filter(el => el.getBoundingClientRect().width > W).map(el => txt(el));
  const alvos = [...document.querySelectorAll('a[href], button, input:not([type=hidden]), select, summary')].filter(vis)
    .filter(el => getComputedStyle(el).display !== 'inline').map(el => { const r = el.getBoundingClientRect(); return { t: txt(el), w: Math.round(r.width), h: Math.round(r.height) }; }).filter(o => o.w < 44 || o.h < 44);
  const linhas = el => { const g = []; const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); while (w.nextNode()) { const n = w.currentNode; const re = /\\S+/g; let m; while ((m = re.exec(n.data))) { const rg = document.createRange(); rg.setStart(n, m.index); rg.setEnd(n, m.index + m[0].length); const rr = rg.getClientRects()[0]; if (!rr) continue; const l = g.find(x => Math.abs(x.top - rr.top) < 6); if (l) l.p.push(m[0]); else g.push({ top: rr.top, p: [m[0]] }); } } return g.sort((a, b) => a.top - b.top); };
  const viuvas = [...document.querySelectorAll('.h1__frase, h2, h3, .hero__oferta, .botao')].filter(vis).map(el => { const l = linhas(el); const u = l[l.length - 1]; return l.length > 1 && u.p.length === 1 && u.p[0].length < 10 ? txt(el).slice(0, 28) + ' → ' + u.p[0] : null; }).filter(Boolean);
  const cta = document.querySelector('[data-cta-hero]').getBoundingClientRect();
  const imgs = [...document.querySelectorAll('img')].filter(i => i.complete && i.naturalWidth && vis(i) && !/.svg/.test(i.currentSrc || i.src)).map(i => { const r = i.getBoundingClientRect(); const nome = (i.currentSrc || i.src).split('/').pop(); const arquivo = +((nome.match(/-(d+).(avif|webp|jpg)/) || [])[1] || 0); const precisa = Math.round(r.width * devicePixelRatio); const maior = { 'liga-kit-alfa': 991, 'liga-fundo-mobile': 668, 'liga-fundo': 1920 }[nome.replace(/-d+..*/, '')] || 0; return { img: nome, exibida: Math.round(r.width), arquivo, precisa, nitida: arquivo >= precisa * 0.85, limiteDoOriginal: arquivo === maior }; });
  return { W, H, dpr: devicePixelRatio, scrollW: document.documentElement.scrollWidth, docH: document.documentElement.scrollHeight, estouro, cortado, largosDemais, alvos, viuvas, ctaNaDobra: cta.bottom <= H, ctaTopo: (() => { const t = document.querySelector('.botao--topo'); const r = t.getBoundingClientRect(); return vis(t) && r.bottom <= H; })(), imgs, fonte: document.fonts.check('700 20px Dosis') && [...document.fonts].some(f => f.family.replace(/"/g, '') === 'Dosis' && f.status === 'loaded') };
})()`;

(async () => {
  const b = await launch(9358, ['--lang=pt-BR']);
  const { send, evaluate } = b;
  await send('Page.enable'); await send('Runtime.enable');
  const res = [];
  for (const [w, h, dpr, nome] of TELAS) {
    const mobile = w < 1024 || (w === 1024 && h === 768) || (w === 1180 && h === 820);
    await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: dpr, mobile });
    await send('Emulation.setTouchEmulationEnabled', mobile ? { enabled: true, maxTouchPoints: 5 } : { enabled: false });
    await send('Page.navigate', { url: 'about:blank' }); await sleep(150);
    await send('Page.navigate', { url: URL_ }); await sleep(1500);
    const altura = await evaluate('document.documentElement.scrollHeight');
    for (let y = 0; y <= altura; y += Math.round(h * 0.7)) { await evaluate('scrollTo({top:' + y + ',behavior:"instant"})'); await sleep(220); }
    await sleep(2200);
    await evaluate('scrollTo({top:0,behavior:"instant"})'); await sleep(500);
    const r = await evaluate(VERIFICA);
    r.nome = nome;
    // captura da página inteira em densidade 1 (arquivo menor)
    await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile });
    await sleep(400);
    await screenshot(send, path.join(OUT, 'capturas', w + 'x' + h + '.jpg'), { full: true, quality: 55 });
    res.push(r);
    const ok = r.scrollW === w && !r.estouro.length && !r.cortado.length && !r.largosDemais.length && !r.alvos.length && (r.ctaNaDobra || r.ctaTopo) && r.imgs.every(i => i.nitida || i.limiteDoOriginal) && r.fonte;
    console.log((ok ? 'OK  ' : 'VER ') + w + 'x' + h + '@' + dpr + ' ' + nome + ' | scrollW ' + r.scrollW + ' | estouro ' + r.estouro.length + ' | cortado ' + r.cortado.length + ' | alvos<44 ' + r.alvos.length + ' | viúvas ' + JSON.stringify(r.viuvas) + ' | CTA ' + r.ctaNaDobra + (r.ctaNaDobra ? '' : ' (cabeçalho: ' + r.ctaTopo + ')') + ' | imagens nítidas ' + r.imgs.filter(i => i.nitida).length + '/' + r.imgs.length + (r.imgs.some(i => !i.nitida) ? ' ' + JSON.stringify(r.imgs.filter(i => !i.nitida)) : '') + ' | Dosis ' + r.fonte + (r.estouro.length ? ' | ' + r.estouro.slice(0, 4).join(', ') : '') + (r.alvos.length ? ' | ' + JSON.stringify(r.alvos) : '') + (r.cortado.length ? ' | ' + JSON.stringify(r.cortado.slice(0, 3)) : ''));
  }
  fs.writeFileSync(path.join(OUT, 'resultado.json'), JSON.stringify(res, null, 1));
  b.close();
})().catch(e => { console.error(e); process.exit(1); });
