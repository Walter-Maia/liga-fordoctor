const path = require('path');
const { launch, sleep } = require('../fase-1-auditoria/scripts/cdp');
const URL_ = 'file:///' + path.resolve(__dirname, '../../preview/index.html').split(path.sep).join('/') + '?intro=0';
(async () => {
  const b = await launch(9354); const { send, evaluate } = b; await send('Page.enable'); await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await send('Page.navigate', { url: URL_ }); await sleep(1500);
  const st = () => evaluate(`(() => { const f = document.querySelector('.liga__fundo'); const i = f.querySelector('img'); window.__l = i.loading; const r = f.getBoundingClientRect(); const ri = i.getBoundingClientRect(); const s = getComputedStyle(f); return { loading: i.loading, cls: f.className, complete: i.complete, nw: i.naturalWidth, src: (i.currentSrc || '').split('/').pop(), fig: [r.top, r.height, r.width].map(Math.round), img: [ri.top, ri.height].map(Math.round), clip: s.clipPath, z: s.zIndex, pos: s.position }; })()`);
  console.log('topo', JSON.stringify(await st()));
  const top = await evaluate("document.getElementById('liga').getBoundingClientRect().top + scrollY");
  await evaluate('scrollTo({ top: ' + Math.round(top + 200) + ', behavior: "instant" })'); await sleep(2000);
  console.log('na seção', JSON.stringify(await st()));
  await evaluate("document.querySelector('.liga__fundo').classList.remove('armada')"); await sleep(1500);
  console.log('sem armada', JSON.stringify(await st()));
  b.close();
})();
