// QA da pré-visualização: capturas, estouro lateral, alvos de toque, viúvas, fontes reais, console e 404.
// Uso: node qa/scripts/qa-preview.js [url] [larguras separadas por vírgula]   (Node 22+, Edge instalado)
const fs = require('fs');
const path = require('path');
const { launch, screenshot, sleep } = require('../fase-1-auditoria/scripts/cdp');

const URL_ = process.argv[2] || 'http://localhost:4173/';
const SO = process.argv[3] ? process.argv[3].split(',').map(Number) : null;
const OUT = path.join(__dirname, '..', process.env.QA_PASTA || 'preview-v0.2', 'capturas');
fs.mkdirSync(OUT, { recursive: true });
const TAMANHOS = [[320, 568], [360, 780], [390, 844], [414, 896], [768, 1024], [820, 1180], [1024, 768], [1280, 800], [1366, 768], [1440, 900], [1920, 1080]]
  .filter(([w]) => !SO || SO.includes(w));

const VERIFICA = `(() => {
  const W = innerWidth, H = innerHeight;
  const vis = el => { const s = getComputedStyle(el), r = el.getBoundingClientRect(); return s.display !== 'none' && s.visibility !== 'hidden' && r.width > 0 && r.height > 0; };
  const txt = el => (el.innerText || el.getAttribute('aria-label') || '').replace(/\\s+/g, ' ').trim().slice(0, 50);
  const estouro = [...document.querySelectorAll('body *')].filter(el => { const r = el.getBoundingClientRect(); return vis(el) && (r.right > W + 1 || r.left < -1); })
    .filter(el => !el.closest('.pular') && !el.closest('.aneis')).map(el => el.tagName.toLowerCase() + '.' + [...el.classList].join('.') + ' R' + Math.round(el.getBoundingClientRect().right));
  const alvos = [...document.querySelectorAll('a[href], button, input:not([type=hidden]), select, summary')].filter(vis)
    .map(el => { const r = el.getBoundingClientRect(); return { t: txt(el), w: Math.round(r.width), h: Math.round(r.height), inline: getComputedStyle(el).display === 'inline' }; })
    .filter(o => (o.w < 44 || o.h < 44) && !o.inline);
  const linhas = el => { const g = []; const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); while (w.nextNode()) { const n = w.currentNode; const re = /\\S+/g; let m; while ((m = re.exec(n.data))) { const rg = document.createRange(); rg.setStart(n, m.index); rg.setEnd(n, m.index + m[0].length); const rr = rg.getClientRects()[0]; if (!rr) continue; const l = g.find(x => Math.abs(x.top - rr.top) < 6); if (l) l.p.push(m[0]); else g.push({ top: rr.top, p: [m[0]] }); } } return g.sort((a, b) => a.top - b.top); };
  const viuvas = [...document.querySelectorAll('h1 .h1__frase, h2, h3, .hero__oferta')].filter(vis).map(el => { const l = linhas(el); const u = l[l.length - 1]; return l.length > 1 && u.p.length === 1 ? txt(el).slice(0, 30) + ' → ' + u.p[0] : null; }).filter(Boolean);
  const cta = document.querySelector('[data-cta-hero]').getBoundingClientRect();
  const form = document.getElementById('cadastro').getBoundingClientRect();
  const maxLinha = Math.max(...[...document.querySelectorAll('main p, main li, main dd')].filter(vis).map(el => linhas(el).reduce((m, l) => Math.max(m, l.p.join(' ').length), 0)));
  const campos = [...document.querySelectorAll('.campo input, .campo select')].map(el => getComputedStyle(el).fontSize);
  return { W, H, scrollW: document.documentElement.scrollWidth, docH: document.documentElement.scrollHeight, estouro, alvos, viuvas, ctaNaDobra: cta.bottom <= H, ctaBottom: Math.round(cta.bottom), formTelas: +((form.top + scrollY) / H).toFixed(1), maxLinha, campos: [...new Set(campos)], h1: getComputedStyle(document.querySelector('.h1__frase')).fontSize };
})()`;

(async () => {
  const b = await launch(9340, ['--lang=pt-BR']);
  const { send, on, evaluate } = b;
  let log = []; const rede = {};
  on(m => {
    if (m.method === 'Runtime.consoleAPICalled') log.push(m.params.type + ': ' + m.params.args.map(a => a.value ?? a.description).join(' ').slice(0, 160));
    if (m.method === 'Runtime.exceptionThrown') log.push('exceção: ' + (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text).slice(0, 200));
    if (m.method === 'Log.entryAdded' && m.params.entry.level !== 'verbose') log.push('log-' + m.params.entry.level + ': ' + m.params.entry.text.slice(0, 160));
    if (m.method === 'Network.responseReceived') rede[m.params.requestId] = { url: m.params.response.url, status: m.params.response.status, tipo: m.params.type, bytes: 0 };
    if (m.method === 'Network.loadingFinished' && rede[m.params.requestId]) rede[m.params.requestId].bytes = m.params.encodedDataLength;
  });
  await send('Page.enable'); await send('Runtime.enable'); await send('Log.enable'); await send('Network.enable'); await send('DOM.enable'); await send('CSS.enable');
  await send('Network.setCacheDisabled', { cacheDisabled: true });
  const resultados = [];
  for (const [w, h] of TAMANHOS) {
    log = []; for (const k of Object.keys(rede)) delete rede[k];
    const mobile = w < 1024;
    await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile });
    await send('Emulation.setTouchEmulationEnabled', mobile ? { enabled: true, maxTouchPoints: 5 } : { enabled: false });
    await send('Page.navigate', { url: 'about:blank' }); await sleep(200);
    await send('Page.navigate', { url: URL_ }); await sleep(2200);
    await screenshot(send, path.join(OUT, w + '-dobra.jpg'), { quality: 72 });
    const H = await evaluate('document.documentElement.scrollHeight');
    for (let y = 0; y <= H; y += Math.round(h * 0.6)) { await evaluate('scrollTo({top:' + y + ',behavior:"instant"})'); await sleep(260); }
    await sleep(1800);
    await evaluate('scrollTo({top:0,behavior:"instant"})'); await sleep(700);
    const r = await evaluate(VERIFICA);
    await screenshot(send, path.join(OUT, w + '-pagina-inteira.jpg'), { full: true, quality: 62 });
    const doc = await send('DOM.getDocument', { depth: -1 });
    const fontes = {};
    for (const s of ['.h1__frase', '.hero__oferta', 'h2', '.campo label']) {
      const n = await send('DOM.querySelector', { nodeId: doc.root.nodeId, selector: s });
      if (n.nodeId) { const pf = await send('CSS.getPlatformFontsForNode', { nodeId: n.nodeId }); fontes[s] = pf.fonts.map(f => f.familyName + (f.isCustomFont ? ' (web)' : ' (sistema)')).join(', '); }
    }
    const req = Object.values(rede);
    r.requisicoes = req.length;
    r.kb = Math.round(req.reduce((s, x) => s + x.bytes, 0) / 1024);
    r.erros404 = req.filter(x => x.status >= 400).map(x => x.status + ' ' + x.url);
    r.imagens = req.filter(x => x.tipo === 'Image').map(x => Math.round(x.bytes / 1024) + 'KB ' + x.url.split('/').pop());
    r.fontes = fontes; r.console = log.slice(0, 10);
    resultados.push(r);
    console.log(JSON.stringify(r));
  }
  fs.writeFileSync(path.join(OUT, '..', SO ? 'qa-' + SO.join('_') + '.json' : 'qa.json'), JSON.stringify(resultados, null, 1));
  b.close();
})().catch(e => { console.error(e); process.exit(1); });
