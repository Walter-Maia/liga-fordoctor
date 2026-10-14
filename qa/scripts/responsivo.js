// Teste de responsividade em várias resoluções: estouro, texto cortado, alvos de toque, viúvas, CTA na dobra,
// nitidez das imagens (densidade da tela) e captura da página inteira. Desde a v0.6 também: fontes abaixo de 12 px, erros
// de console, âncoras sem destino, título escondido sob o cabeçalho ao pular para uma seção, CTA fixo cobrindo o rodapé e a
// composição estática do hero (movimento reduzido: todas as etiquetas visíveis) dentro da caixa e sem sobreposição.
// Uso: node qa/scripts/com-servidor.js qa/scripts/responsivo.js   (QA_PASTA=responsivo-v0.6 para outra pasta)
const fs = require('fs');
const path = require('path');
const { launch, screenshot, sleep } = require('../fase-1-auditoria/scripts/cdp');

// servidor local (npm run preview): em file:// o navegador bloqueia o preload da fonte
const URL_ = (process.env.QA_URL || 'http://localhost:4173/') + '?intro=0';
const OUT = path.join(__dirname, '..', process.env.QA_PASTA || 'responsivo-v0.6');
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
  const decor = el => el.closest('.aneis, .ondas, .pular, .sprite, .marca-dagua, .constelacao, .liga__orbita');
  const txt = el => (el.innerText || el.getAttribute('aria-label') || '').replace(/\\s+/g, ' ').trim().slice(0, 40);
  const estouro = [...document.querySelectorAll('body *')].filter(el => !decor(el) && vis(el)).filter(el => { const r = el.getBoundingClientRect(); return r.right > W + 1 || r.left < -1; })
    .map(el => el.tagName.toLowerCase() + '.' + [...el.classList].join('.'));
  const cortado = [...document.querySelectorAll('h1, h2, h3, p, li, dd, dt, summary, label, .botao, .degrau__valor')].filter(vis).filter(el => el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).overflowX !== 'visible').map(el => txt(el));
  const largosDemais = [...document.querySelectorAll('h1, h2, h3, p, li, dd, .botao')].filter(vis).filter(el => el.getBoundingClientRect().width > W).map(el => txt(el));
  const alvos = [...document.querySelectorAll('a[href], button, input:not([type=hidden]), select, summary')].filter(vis)
    .filter(el => getComputedStyle(el).display !== 'inline').map(el => { const r = el.getBoundingClientRect(); return { t: txt(el), w: Math.round(r.width), h: Math.round(r.height) }; }).filter(o => o.w < 44 || o.h < 44);
  const linhas = el => { const g = []; const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); while (w.nextNode()) { const n = w.currentNode; const re = /\\S+/g; let m; while ((m = re.exec(n.data))) { const rg = document.createRange(); rg.setStart(n, m.index); rg.setEnd(n, m.index + m[0].length); const rr = rg.getClientRects()[0]; if (!rr) continue; const l = g.find(x => Math.abs(x.top - rr.top) < 6); if (l) l.p.push(m[0]); else g.push({ top: rr.top, p: [m[0]] }); } } return g.sort((a, b) => a.top - b.top); };
  const viuvas = [...document.querySelectorAll('.h1__frase, h2, h3, .hero__oferta, .botao')].filter(vis).map(el => { const l = linhas(el); const u = l[l.length - 1]; return l.length > 1 && u.p.length === 1 && u.p[0].length < 10 ? txt(el).slice(0, 28) + ' → ' + u.p[0] : null; }).filter(Boolean);
  const decorTexto = el => el.closest('.sprite, .so-leitor, [aria-hidden="true"]:not(.constelacao)');
  const fontesPequenas = [...new Set([...document.querySelectorAll('body *')].filter(el => vis(el) && !decorTexto(el) && [...el.childNodes].some(n => n.nodeType === 3 && n.data.trim())).filter(el => parseFloat(getComputedStyle(el).fontSize) < 12).map(el => txt(el) + ' (' + getComputedStyle(el).fontSize + ')'))];
  const ancorasQuebradas = [...document.querySelectorAll('a[href^="#"]')].map(a => a.getAttribute('href')).filter(h => h.length > 1 && !document.getElementById(h.slice(1)));
  const cta = document.querySelector('[data-cta-hero]').getBoundingClientRect();
  const imgs = [...document.querySelectorAll('img')].filter(i => i.complete && i.naturalWidth && vis(i) && !/.svg/.test(i.currentSrc || i.src)).map(i => { const r = i.getBoundingClientRect(); const nome = (i.currentSrc || i.src).split('/').pop(); const arquivo = +((nome.match(/-(\\d+)\\.(avif|webp|jpg)/) || [])[1] || 0); const precisa = Math.round(r.width * devicePixelRatio); const maior = { 'liga-kit-alfa': 991 }[nome.replace(/-\\d+\\..*/, '')] || 0; return { img: nome, exibida: Math.round(r.width), arquivo, precisa, nitida: arquivo >= precisa * 0.85, limiteDoOriginal: arquivo === maior }; });
  return { W, H, dpr: devicePixelRatio, scrollW: document.documentElement.scrollWidth, docH: document.documentElement.scrollHeight, estouro, cortado, largosDemais, alvos, viuvas, fontesPequenas, ancorasQuebradas, ctaNaDobra: cta.bottom <= H, ctaTopo: (() => { const t = document.querySelector('.botao--topo'); const r = t.getBoundingClientRect(); return vis(t) && r.bottom <= H; })(), imgs, fonte: document.fonts.check('700 20px Dosis') && [...document.fonts].some(f => f.family.replace(/"/g, '') === 'Dosis' && f.status === 'loaded') };
})()`;

const ESTATICO = `(() => {
  const c = document.querySelector('[data-constelacao]');
  const caixa = c.closest('.caixa').getBoundingClientRect();
  const ret = el => el.getBoundingClientRect();
  const cruza = (a, b) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
  const et = [...c.querySelectorAll('.etiqueta, .beneficio, .contrato')].map(el => ({ n: el.classList[el.classList.length - 1], dono: el.closest('.ancora--voce') ? 'voce' : 'colega', r: ret(el), o: +getComputedStyle(el).opacity }));
  const pes = [...c.querySelectorAll('.pessoa')].filter(p => getComputedStyle(p).display !== 'none').map(p => ({ n: p.classList[1], r: ret(p.querySelector('.aluno')) }));
  const problemas = [];
  et.forEach((a, i) => {
    if (a.o < 0.99) problemas.push(a.n + ' invisível');
    if (a.r.left < caixa.left + 4 || a.r.right > caixa.right - 4 || a.r.bottom > caixa.bottom - 4) problemas.push(a.n + ' fora da caixa');
    if (a.r.right > innerWidth || a.r.left < 0) problemas.push(a.n + ' fora da tela');
    et.slice(i + 1).forEach(b => { if (cruza(a.r, b.r) > 4) problemas.push(a.n + ' × ' + b.n); });
    pes.forEach(p => { if (!p.n.endsWith(a.dono) && cruza(a.r, p.r) > 4) problemas.push(a.n + ' × ' + p.n); });
  });
  return { largura: Math.round(ret(c).width), problemas };
})()`;

(async () => {
  const b = await launch(9358, ['--lang=pt-BR']);
  const { send, evaluate, on } = b;
  const erros = [];
  on(m => {
    if (m.method === 'Runtime.exceptionThrown') erros.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text);
    if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') erros.push(m.params.args.map(a => a.value || a.description).join(' '));
    if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error') erros.push(m.params.entry.text + ' ' + (m.params.entry.url || ''));
  });
  await send('Page.enable'); await send('Runtime.enable'); await send('Log.enable');
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
    // fim da página: o CTA fixo (celular) não pode cobrir os links do rodapé
    await evaluate('scrollTo({top:document.documentElement.scrollHeight,behavior:"instant"})'); await sleep(700);
    r.ctaCobreRodape = await evaluate(`(() => { const b = document.querySelector('[data-cta-fixo]'); if (!b || !b.classList.contains('visivel')) return false; const c = b.getBoundingClientRect(); return [...document.querySelectorAll('.rodape a, .rodape p')].some(el => { const r = el.getBoundingClientRect(); return r.bottom > c.top + 1 && r.top < c.bottom; }); })()`);
    // pular para o cadastro: o título não pode ficar debaixo do cabeçalho flutuante
    await evaluate(`scrollTo({ top: 0, behavior: 'instant' }); document.querySelector('.hero .botao[href="#cadastro"]').click()`); await sleep(1600);
    r.tituloSobCabecalho = await evaluate(`(() => { const t = document.querySelector('#h-cadastro').getBoundingClientRect(); const c = document.querySelector('.topo__barra').getBoundingClientRect(); return t.top < c.bottom; })()`);
    await evaluate('history.replaceState(null, "", location.pathname + location.search)');
    // composição estática do hero (movimento reduzido): todas as etiquetas aparecem juntas; dentro da caixa e sem se cobrir
    await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: dpr, mobile });
    await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
    await send('Page.navigate', { url: URL_ }); await sleep(1200);
    r.heroEstatico = await evaluate(ESTATICO);
    // captura da página inteira nesse estado (tudo no estado final; com movimento, o que está fora da tela fica armado),
    // em densidade 1 (arquivo menor)
    await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile });
    await sleep(400);
    await screenshot(send, path.join(OUT, 'capturas', w + 'x' + h + '.jpg'), { full: true, quality: 55 });
    await send('Emulation.setEmulatedMedia', { features: [] });
    res.push(r);
    const ok = !r.fontesPequenas.length && !r.ancorasQuebradas.length && !r.ctaCobreRodape && !r.tituloSobCabecalho && !r.heroEstatico.problemas.length && r.scrollW === w && !r.estouro.length && !r.cortado.length && !r.largosDemais.length && !r.alvos.length && (r.ctaNaDobra || r.ctaTopo) && r.imgs.every(i => i.nitida || i.limiteDoOriginal) && r.fonte;
    console.log((ok ? 'OK  ' : 'VER ') + w + 'x' + h + '@' + dpr + ' ' + nome + ' | scrollW ' + r.scrollW + ' | estouro ' + r.estouro.length + ' | cortado ' + r.cortado.length + ' | alvos<44 ' + r.alvos.length + ' | viúvas ' + JSON.stringify(r.viuvas) + ' | CTA ' + r.ctaNaDobra + (r.ctaNaDobra ? '' : ' (cabeçalho: ' + r.ctaTopo + ')') + ' | imagens nítidas ' + r.imgs.filter(i => i.nitida).length + '/' + r.imgs.length + (r.imgs.some(i => !i.nitida) ? ' ' + JSON.stringify(r.imgs.filter(i => !i.nitida)) : '') + ' | Dosis ' + r.fonte + (r.fontesPequenas.length ? ' | fontes<12 ' + JSON.stringify(r.fontesPequenas.slice(0, 4)) : '') + (r.ancorasQuebradas.length ? ' | âncoras ' + r.ancorasQuebradas : '') + (r.ctaCobreRodape ? ' | CTA cobre o rodapé' : '') + (r.tituloSobCabecalho ? ' | título sob o cabeçalho' : '') + (r.heroEstatico.problemas.length ? ' | hero ' + JSON.stringify(r.heroEstatico.problemas) : ' | hero estático ok (' + r.heroEstatico.largura + ' px)') + (r.estouro.length ? ' | ' + r.estouro.slice(0, 4).join(', ') : '') + (r.alvos.length ? ' | ' + JSON.stringify(r.alvos) : '') + (r.cortado.length ? ' | ' + JSON.stringify(r.cortado.slice(0, 3)) : ''));
  }
  fs.writeFileSync(path.join(OUT, 'resultado.json'), JSON.stringify({ telas: res, erros: [...new Set(erros)] }, null, 1));
  console.log('erros de console: ' + (erros.length ? JSON.stringify([...new Set(erros)]) : 'nenhum'));
  b.close();
})().catch(e => { console.error(e); process.exit(1); });
