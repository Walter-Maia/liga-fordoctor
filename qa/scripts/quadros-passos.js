// Sequência dos passos da indicação (início, meio, fim) em 1440 e 390 px
const path = require('path');
const { launch, screenshot, sleep } = require('../fase-1-auditoria/scripts/cdp');
const URL_ = 'file:///' + path.resolve(__dirname, '../../preview/index.html').split(path.sep).join('/') + '?intro=0';
const OUT = path.join(__dirname, '..', 'preview-v0.2', 'capturas');
(async () => {
  const b = await launch(9351); const { send, evaluate } = b; await send('Page.enable'); await send('Runtime.enable');
  for (const [w, h] of [[1440, 900], [390, 844]]) {
    await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 1024 });
    await send('Page.navigate', { url: URL_ }); await sleep(1500);
    const y = await evaluate("document.querySelector('[data-passos]').getBoundingClientRect().top + scrollY - " + (w < 1024 ? 90 : 260));
    await evaluate('scrollTo({ top: ' + Math.round(y) + ', behavior: "instant" })');
    const t0 = Date.now();
    for (const [nome, t] of [['0-inicio', 120], ['1-meio', 800], ['2-fim', 2600]]) {
      await sleep(Math.max(0, t - (Date.now() - t0)));
      await screenshot(send, path.join(OUT, w + '-passos-' + nome + '.jpg'), { quality: 72 });
    }
  }
  b.close();
})().catch(e => { console.error(e); process.exit(1); });
