const path = require('path');
const { launch, screenshot, sleep } = require('../fase-1-auditoria/scripts/cdp');
const URL_ = 'file:///' + path.resolve(__dirname, '../../preview/index.html').split(path.sep).join('/') + '?intro=0';
(async () => {
  const b = await launch(9359); const { send, evaluate } = b; await send('Page.enable'); await send('Runtime.enable');
  for (const [w, h] of [[1920, 1080], [2560, 1440]]) {
    await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: false });
    await send('Page.navigate', { url: URL_ }); await sleep(1500);
    const top = await evaluate("document.getElementById('liga').getBoundingClientRect().top + scrollY");
    await evaluate('scrollTo({ top: ' + Math.round(top - 56) + ', behavior: "instant" })'); await sleep(2500);
    console.log(w, JSON.stringify(await evaluate(`(() => { const f = document.querySelector('.liga__fundo'); const p = f.querySelector('picture'); const i = f.querySelector('img'); const s = document.getElementById('liga'); const r = x => { const q = x.getBoundingClientRect(); return [q.left, q.top, q.width, q.height].map(Math.round); }; return { secao: r(s), fig: r(f), pic: r(p), img: r(i), cls: f.className, clip: getComputedStyle(p).clipPath, fit: getComputedStyle(i).objectFit, src: i.currentSrc.split('/').pop() }; })()`)));
    await screenshot(send, path.join(__dirname, '..', 'responsivo-v0.4', 'capturas', w + '-liga.jpg'), { quality: 70 });
  }
  b.close();
})();
