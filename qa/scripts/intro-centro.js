// Mede, com a intro congelada, a distância entre o centro dos anéis e o centro do símbolo (deve ser ~0 px)
// e fotografa o quadro. Uso: node qa/scripts/com-servidor.js qa/scripts/intro-centro.js [larguraxaltura] [tempo]
const fs = require('fs');
const path = require('path');
const { launch, screenshot, sleep } = require('../fase-1-auditoria/scripts/cdp');

const [W, H] = (process.argv[2] || '1440x900').split('x').map(Number);
const T = Number(process.argv[3] || 1.3);
const BASE = process.env.QA_URL || 'http://localhost:4173/';
const OUT = path.join(__dirname, '..', 'preview-v0.5', 'intro');
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const b = await launch(9399);
  const { send, evaluate } = b;
  await send('Page.enable'); await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: W < 1024 });
  await send('Page.addScriptToEvaluateOnNewDocument', { source: '(function(){var st=window.setTimeout;window.setTimeout=function(f,ms){return ms>=1400?0:st.apply(window,arguments)}})();' });
  await send('Page.navigate', { url: BASE + '?intro=1' });
  let ok = false;
  for (let i = 0; i < 80 && !ok; i++) { await sleep(100); ok = await evaluate("!!document.querySelector('.li-intro.li-tocando')"); }
  if (!ok) throw new Error('a intro não tocou');
  await sleep(200);
  await evaluate(`(window.__an = document.querySelector('.li-intro').getAnimations({ subtree: true })).forEach(a => { a.pause(); a.currentTime = ${T * 1000}; }); new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))`);
  const m = await evaluate(`(() => {
    const c = r => [r.left + r.width / 2, r.top + r.height / 2];
    const aneis = c(document.querySelector('.li-anel').getBoundingClientRect());
    const simbolo = c(document.querySelector('.li-contorno').getBoundingClientRect());
    return { tela: [innerWidth / 2, innerHeight / 2], aneis, simbolo, desvio: [+(simbolo[0] - aneis[0]).toFixed(1), +(simbolo[1] - aneis[1]).toFixed(1)] };
  })()`);
  await screenshot(send, path.join(OUT, 'centro-' + W + '.jpg'), { quality: 80 });
  console.log(JSON.stringify(m));
  b.close();
})().catch(e => { console.error(e); process.exit(1); });
