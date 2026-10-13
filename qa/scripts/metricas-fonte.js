const { launch, sleep } = require('../fase-1-auditoria/scripts/cdp');
(async () => {
  const b = await launch(9345); const { send, evaluate } = b; await send('Page.enable'); await send('Runtime.enable');
  await send('Page.navigate', { url: 'http://localhost:4173/' }); await sleep(2000);
  console.log(JSON.stringify(await evaluate(`(async () => {
    await document.fonts.ready;
    const amostra = 'Benefícios exclusivos para turmas de Medicina que irão se formar em 2026 Abertura de PJ médica gratuita';
    const mede = (fam, peso) => { const c = document.createElement('canvas').getContext('2d'); c.font = peso + ' 100px ' + fam; return c.measureText(amostra).width; };
    const r = {};
    for (const [fam, peso] of [['Dosis', 700], ['Dosis', 600], ['Jost', 400], ['Jost', 500]]) {
      for (const sis of ['Arial', 'Trebuchet MS', 'Segoe UI']) r[fam + peso + '/' + sis] = +(mede(fam, peso) / mede(sis, peso)).toFixed(3);
    }
    return r;
  })()`)));
  b.close();
})();
