// Fotografa seções na tela, depois que a animação de cada uma termina. Uso: node qa/scripts/secoes.js [largura] [altura]
const fs = require('fs');
const path = require('path');
const { launch, screenshot, sleep } = require('../fase-1-auditoria/scripts/cdp');

const W = Number(process.argv[2] || 1440), H = Number(process.argv[3] || 900);
const URL_ = 'file:///' + path.resolve(__dirname, '../../preview/index.html').replace(/\\/g, '/') + '?intro=0';
const OUT = path.join(__dirname, '..', 'preview-v0.2', 'capturas');
fs.mkdirSync(OUT, { recursive: true });
const SECOES = [['hero', '.hero', 0], ['recompensas', '#recompensas', 80], ['passos', '#indicacao', 0], ['cadastro', '#cadastro', 40]];

(async () => {
  const b = await launch(9348); const { send, evaluate } = b;
  await send('Page.enable'); await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: W < 1024 });
  await send('Page.navigate', { url: URL_ }); await sleep(1800);
  for (const [nome, sel, ajuste] of SECOES) {
    const y = await evaluate(`Math.max(0, document.querySelector('${sel}').getBoundingClientRect().top + scrollY - ${ajuste} - 64)`);
    await evaluate(`scrollTo({ top: ${y}, behavior: 'instant' })`);
    await sleep(2800);
    await screenshot(send, path.join(OUT, W + '-secao-' + nome + '.jpg'), { quality: 78 });
  }
  b.close();
})().catch(e => { console.error(e); process.exit(1); });
