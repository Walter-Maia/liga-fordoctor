const path = require('path');
const { launch, sleep } = require('../fase-1-auditoria/scripts/cdp');
(async () => {
  const b = await launch(9349); const { send, evaluate } = b; await send('Page.enable'); await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  const url = 'file:///' + path.resolve(__dirname, '../../preview/index.html').split(path.sep).join('/') + '?intro=0';
  await send('Page.navigate', { url }); await sleep(1500);
  console.log(JSON.stringify(await evaluate(`(() => { const s = document.querySelector('.aneis--hero'); const r = s.getBoundingClientRect(); const cs = getComputedStyle(s); const u = s.querySelector('use').getBoundingClientRect(); const r2 = document.querySelector('.aneis--recompensas').getBoundingClientRect();
    return { hero: [r.x, r.y, r.width, r.height].map(Math.round), use: [u.x, u.y, u.width, u.height].map(Math.round), z: cs.zIndex, color: cs.color, mask: cs.maskImage || cs.webkitMaskImage, op: cs.opacity, disp: cs.display, recomp: [r2.width, r2.height].map(Math.round) }; })()`)));
  b.close();
})();
