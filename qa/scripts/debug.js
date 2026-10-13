const { launch, sleep } = require('../fase-1-auditoria/scripts/cdp');
(async () => {
  const b = await launch(9341); const { send, evaluate } = b; await send('Page.enable'); await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: 'http://localhost:4173/' }); await sleep(2000);
  console.log(JSON.stringify(await evaluate(`(() => {
    const b = document.querySelector('.botao--topo'); const s = getComputedStyle(b); const r = b.getBoundingClientRect();
    const p = document.querySelector('.degrau__piso'); const ps = p ? getComputedStyle(p) : null; const pr = p ? p.getBoundingClientRect() : null;
    return { topo: { display: s.display, op: s.opacity, vis: s.visibility, r: [r.x, r.y, r.width, r.height].map(Math.round), anim: s.animationName },
      piso: p && { display: ps.display, pos: ps.position, bg: ps.backgroundColor, tf: ps.transform, r: [pr.x, pr.y, pr.width, pr.height].map(Math.round) },
      trilhaClasses: document.querySelector('[data-trilha]').className };
  })()`)));
  b.close();
})();
