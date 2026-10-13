const { launch, sleep, screenshot } = require('../fase-1-auditoria/scripts/cdp');
(async () => {
  const b = await launch(9342); const { send, evaluate } = b; await send('Page.enable'); await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: 'http://localhost:4173/' }); await sleep(2000);
  const st = () => evaluate(`(() => { const l = document.querySelector('[data-trilha]'); const p = [...document.querySelectorAll('.degrau__piso')].map(x => getComputedStyle(x).transform + ' ' + Math.round(x.getBoundingClientRect().width)); const v = getComputedStyle(document.querySelector('.degrau:last-child .degrau__valor')); return { cls: l.className, p, valor: v.opacity + ' ' + v.animationName + ' ' + v.animationPlayState }; })()`);
  await evaluate(`document.querySelector('[data-trilha]').scrollIntoView({block:'center'})`);
  for (const t of [100, 500, 900, 1400, 2200]) { await sleep(t === 100 ? 100 : 400); console.log(t, JSON.stringify(await st())); }
  await screenshot(send, __dirname + '/../preview-v0.1/capturas/debug-trilha.jpg');
  b.close();
})();
