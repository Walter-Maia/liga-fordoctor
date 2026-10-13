const path = require('path');
const { launch, screenshot, sleep } = require('../fase-1-auditoria/scripts/cdp');
const URL_ = 'file:///' + path.resolve(__dirname, '../../preview/index.html').split(path.sep).join('/') + '?intro=0';
(async () => {
  const b = await launch(9353); const { send, evaluate } = b; await send('Page.enable'); await send('Runtime.enable');
  for (const [w, h] of [[390, 844], [320, 568], [768, 1024]]) {
    await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: true });
    await send('Page.navigate', { url: URL_ }); await sleep(1500);
    const r = await evaluate("(() => { const s = document.getElementById('liga').getBoundingClientRect(); return [s.top + scrollY, s.height]; })()");
    await evaluate('scrollTo({ top: ' + Math.round(r[0] - 56) + ', behavior: "instant" })'); await sleep(1600);
    await screenshot(send, path.join(__dirname, '..', 'preview-v0.3', 'capturas', w + '-liga-inteira.jpg'), { quality: 75, full: false, clip: undefined });
    await send('Emulation.setDeviceMetricsOverride', { width: w, height: Math.round(r[1]) + 56, deviceScaleFactor: 1, mobile: true });
    await sleep(400); await evaluate('scrollTo({ top: ' + Math.round(r[0] - 56) + ', behavior: "instant" })'); await sleep(600);
    await screenshot(send, path.join(__dirname, '..', 'preview-v0.3', 'capturas', w + '-liga-inteira.jpg'), { quality: 75 });
    console.log(w, 'altura da seção', Math.round(r[1]));
  }
  b.close();
})();
