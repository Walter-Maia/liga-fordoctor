const path = require('path');
const { launch, sleep } = require('../fase-1-auditoria/scripts/cdp');
const URL_ = 'file:///' + path.resolve(__dirname, '../../preview/index.html').split(path.sep).join('/') + '?intro=0';
(async () => {
  const b = await launch(9357); const { send, evaluate } = b; await send('Page.enable'); await send('Runtime.enable');
  const r = {};
  for (const [w, h] of [[320, 568], [390, 844], [1440, 900], [1920, 1080]]) {
    await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 1024 });
    await send('Page.navigate', { url: URL_ }); await sleep(1200);
    r[w] = await evaluate("({ scrollW: document.documentElement.scrollWidth, animacoes: document.querySelector('[data-ondas]').getAnimations({ subtree: true }).filter(a => a.playState === 'running').length })");
  }
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await send('Page.navigate', { url: URL_ }); await sleep(1200);
  r.reduzido = await evaluate("({ animacoes: document.querySelector('[data-ondas]').getAnimations({ subtree: true }).length, opacidade: getComputedStyle(document.querySelector('.ondas span')).opacity })");
  await send('Emulation.setEmulatedMedia', { features: [] });
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: URL_ }); await sleep(1000);
  await evaluate("scrollTo({ top: 3000, behavior: 'instant' })"); await sleep(600);
  r.foraDaTela = await evaluate("({ classe: document.querySelector('[data-ondas]').className, estado: document.querySelector('[data-ondas]').getAnimations({ subtree: true })[0].playState })");
  console.log(JSON.stringify(r));
  b.close();
})();
