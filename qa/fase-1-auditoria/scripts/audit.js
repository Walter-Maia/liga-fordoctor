// Auditoria de telas: capturas + verificações de DOM por largura (Edge headless via CDP)
const fs = require('fs'); const path = require('path');
const { launch, screenshot, sleep } = require('./cdp');

const URL_ = process.argv[2] || 'https://fordoctor.com.br/liga-fordoctor/';
const OUT = path.join(__dirname, 'shots'); fs.mkdirSync(OUT, { recursive: true });
const ONLY = process.argv[3] ? process.argv[3].split(',').map(Number) : null;
const SIZES = [[320, 568], [360, 780], [390, 844], [414, 896], [768, 1024], [820, 1180], [1024, 768], [1280, 800], [1366, 768], [1440, 900], [1920, 1080]]
  .filter(([w]) => !ONLY || ONLY.includes(w));
const MOBILE_UA = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36';
const DESK_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36';

const CHECKS = fs.readFileSync(path.join(__dirname, 'checks.js'), 'utf8');

(async () => {
  const b = await launch(9333, ['--lang=pt-BR']);
  const { send, on, evaluate } = b;
  let log = [], net = {};
  on(m => {
    if (m.method === 'Runtime.consoleAPICalled') log.push({ t: m.params.type, s: m.params.args.map(a => a.value ?? a.description ?? a.type).join(' ').slice(0, 200) });
    if (m.method === 'Runtime.exceptionThrown') log.push({ t: 'exception', s: (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text).slice(0, 300) });
    if (m.method === 'Log.entryAdded') log.push({ t: 'log-' + m.params.entry.level, s: (m.params.entry.text + ' ' + (m.params.entry.url || '')).slice(0, 300) });
    if (m.method === 'Network.responseReceived') { const r = m.params.response; net[m.params.requestId] = { url: r.url, status: r.status, type: m.params.type, mime: r.mimeType, bytes: 0 }; }
    if (m.method === 'Network.loadingFinished' && net[m.params.requestId]) net[m.params.requestId].bytes = m.params.encodedDataLength;
    if (m.method === 'Network.loadingFailed') net[m.params.requestId] = { ...(net[m.params.requestId] || {}), failed: m.params.errorText, type: m.params.type };
  });
  await send('Page.enable'); await send('Runtime.enable'); await send('Log.enable'); await send('Network.enable');
  await send('Network.setCacheDisabled', { cacheDisabled: true });
  const results = [];
  for (const [w, h] of SIZES) {
    log = []; net = {};
    const mobile = w < 1024;
    await send('Network.setUserAgentOverride', { userAgent: mobile ? MOBILE_UA : DESK_UA, acceptLanguage: 'pt-BR' });
    await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile });
    await send('Emulation.setTouchEmulationEnabled', mobile ? { enabled: true, maxTouchPoints: 5 } : { enabled: false });
    await send('Page.navigate', { url: 'about:blank' }); await sleep(300);
    await send('Page.navigate', { url: URL_ });
    await sleep(4500);
    // 1ª dobra antes de qualquer interação (WP Rocket ainda atrasando o JS)
    await screenshot(send, path.join(OUT, `${w}-dobra-sem-interacao.jpg`));
    const before = await evaluate(`(${CHECKS})('fold')`);
    // simula interação para liberar scripts atrasados
    if (mobile) { await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 5, y: h - 5 }] }); await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [{ x: 5, y: h - 5 }] }).catch(() => {}); await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 12, y: 12 }); }
    else await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 10, y: 10 });
    await sleep(2500);
    // rola a página inteira para disparar animações de entrada
    const H = await evaluate('document.documentElement.scrollHeight');
    for (let y = 0; y <= H; y += Math.round(h * 0.6)) { await evaluate(`window.scrollTo(0, ${y})`); await sleep(250); }
    await sleep(1500);
    await evaluate('window.scrollTo(0, 0)'); await sleep(1200);
    await screenshot(send, path.join(OUT, `${w}-dobra.jpg`));
    const after = await evaluate(`(${CHECKS})('full')`);
    await screenshot(send, path.join(OUT, `${w}-pagina-inteira.jpg`), { full: true, quality: 60 });
    const reqs = Object.values(net);
    const byType = {};
    for (const r of reqs) { const t = r.type || 'Other'; byType[t] = byType[t] || { n: 0, kb: 0 }; byType[t].n++; byType[t].kb += (r.bytes || 0) / 1024; }
    Object.values(byType).forEach(v => v.kb = Math.round(v.kb));
    results.push({ w, h, mobile, before, after, byType, totalKB: Math.round(reqs.reduce((s, r) => s + (r.bytes || 0), 0) / 1024), nReq: reqs.length,
      errors: reqs.filter(r => r.status >= 400 || r.failed).map(r => `${r.status || ''} ${r.failed || ''} ${r.url}`),
      images: reqs.filter(r => r.type === 'Image').map(r => `${Math.round(r.bytes / 1024)}KB ${(r.url || '?').replace('https://fordoctor.com.br', '')}`),
      fonts: reqs.filter(r => r.type === 'Font').map(r => `${Math.round(r.bytes / 1024)}KB ${r.url}`),
      thirdParty: [...new Set(reqs.filter(r => r.url && !r.url.includes('fordoctor.com.br') && !r.url.startsWith('data:')).map(r => new URL(r.url).host))],
      console: log });
    fs.writeFileSync(path.join(OUT, 'results-partial.json'), JSON.stringify(results, null, 1));
    console.log(`ok ${w}x${h} H=${H} req=${reqs.length} ${results.at(-1).totalKB}KB`);
  }
  fs.writeFileSync(path.join(OUT, ONLY ? `results-${ONLY.join('_')}.json` : 'results.json'), JSON.stringify(results, null, 1));
  b.close();
})().catch(e => { console.error(e); process.exit(1); });
