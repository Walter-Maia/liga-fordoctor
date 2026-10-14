// v0.5: fotografa cada seção na tela depois das animações de entrada, confere erros de console,
// rolagem lateral e o tom do cabeçalho em cada parada. Uso: node qa/scripts/v05.js [largura] [altura] [dpr]
const fs = require('fs');
const path = require('path');
const { launch, screenshot, sleep } = require('../fase-1-auditoria/scripts/cdp');

const W = Number(process.argv[2] || 1440), H = Number(process.argv[3] || 900), DPR = Number(process.argv[4] || 1);
const URL_ = (process.env.QA_URL || 'http://localhost:4173/') + '?intro=0';
const OUT = process.env.QA_OUT || path.join(__dirname, '..', 'preview-v0.5', 'capturas');
fs.mkdirSync(OUT, { recursive: true });
const SECOES = [['hero', 'main', 0], ['formatura', '#formatura', 0], ['liga', '#liga', 0], ['pj', '#pj', 0], ['oferece', '#oferece', 0],
  ['recompensas', '#recompensas', 0], ['indicacao', '#indicacao', 0], ['contabilidade', '#contabilidade', 0], ['perguntas', '#perguntas', 0],
  ['cadastro', '#cadastro', 0], ['rodape', '.rodape', 300]];

(async () => {
  const b = await launch(9371);
  const { send, evaluate, on } = b;
  const erros = [];
  on(m => {
    if (m.method === 'Runtime.exceptionThrown') erros.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text);
    if (m.method === 'Runtime.consoleAPICalled' && (m.params.type === 'error' || m.params.type === 'warning')) erros.push(m.params.args.map(a => a.value || a.description).join(' '));
    if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error') erros.push(m.params.entry.text + ' ' + (m.params.entry.url || ''));
  });
  await send('Page.enable'); await send('Runtime.enable'); await send('Log.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: DPR, mobile: W < 1024 });
  await send('Page.navigate', { url: URL_ });
  await sleep(2600);
  const relato = [];
  for (const [nome, sel, ajuste] of SECOES) {
    const y = await evaluate(`Math.max(0, document.querySelector('${sel}').getBoundingClientRect().top + scrollY - ${ajuste})`);
    await evaluate(`scrollTo({ top: ${y}, behavior: 'instant' })`);
    await sleep(nome === 'hero' ? 400 : 3000);
    const info = await evaluate(`({ tom: document.querySelector('[data-topo]').getAttribute('data-tom'), rolado: document.querySelector('[data-topo]').classList.contains('topo--rolado'), lateral: document.documentElement.scrollWidth > innerWidth })`);
    relato.push({ secao: nome, ...info });
    await screenshot(send, path.join(OUT, W + '-' + nome + '.jpg'), { quality: 78 });
  }
  console.log(JSON.stringify({ largura: W, relato, erros }, null, 1));
  b.close();
})().catch(e => { console.error(e); process.exit(1); });
