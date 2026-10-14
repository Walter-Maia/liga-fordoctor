// Confere se os ícones declarados no <head> carregam (status e tipo) pela pré-visualização.
// Uso: node qa/scripts/com-servidor.js qa/scripts/favicon.js
const { launch, sleep } = require('../fase-1-auditoria/scripts/cdp');
const BASE = process.env.QA_URL || 'http://localhost:4173/';
(async () => {
  const b = await launch(9403);
  const { send, evaluate } = b;
  await send('Page.enable'); await send('Runtime.enable');
  await send('Page.navigate', { url: BASE + '?intro=0' });
  await sleep(2000);
  const r = await evaluate(`Promise.all([...document.querySelectorAll('link[rel~="icon"], link[rel="apple-touch-icon"]')].map(async l => {
    const resp = await fetch(l.href);
    return { rel: l.rel, href: l.getAttribute('href'), status: resp.status, tipo: resp.headers.get('content-type'), bytes: (await resp.arrayBuffer()).byteLength };
  }))`);
  console.log(JSON.stringify(r, null, 1));
  b.close();
})().catch(e => { console.error(e); process.exit(1); });
