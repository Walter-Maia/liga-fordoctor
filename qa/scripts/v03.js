// Capturas das mudanças da v0.3: foto do hero no círculo, seção "O que é a Liga" e anéis com parallax na divisa.
const fs = require('fs');
const path = require('path');
const { launch, screenshot, sleep } = require('../fase-1-auditoria/scripts/cdp');
const URL_ = 'file:///' + path.resolve(__dirname, '../../preview/index.html').split(path.sep).join('/') + '?intro=0';
const OUT = path.join(__dirname, '..', 'preview-v0.3', 'capturas');
fs.mkdirSync(OUT, { recursive: true });
const larguras = (process.argv[2] || '1440x900,1024x768,390x844').split(',').map(s => s.split('x').map(Number));

(async () => {
  const b = await launch(9352); const { send, evaluate } = b; await send('Page.enable'); await send('Runtime.enable');
  const medidas = {};
  for (const [w, h] of larguras) {
    await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 1024 });
    await send('Page.navigate', { url: URL_ }); await sleep(1600);
    const vai = async (y) => { await evaluate('scrollTo({ top: ' + Math.round(y) + ', behavior: "instant" })'); };
    await screenshot(send, path.join(OUT, w + '-hero.jpg'), { quality: 78 });
    const ligaTop = await evaluate("document.getElementById('liga').getBoundingClientRect().top + scrollY");
    await vai(ligaTop - 56); await sleep(1700);
    await screenshot(send, path.join(OUT, w + '-liga.jpg'), { quality: 78 });
    const divisa = await evaluate("document.getElementById('recompensas').getBoundingClientRect().top + scrollY");
    await vai(divisa - h * 0.55); await sleep(500);
    await screenshot(send, path.join(OUT, w + '-divisa-a.jpg'), { quality: 78 });
    const ya = await evaluate("document.querySelector('.aneis--oferece').style.translate");
    await vai(divisa - h * 0.25); await sleep(500);
    await screenshot(send, path.join(OUT, w + '-divisa-b.jpg'), { quality: 78 });
    const yb = await evaluate("document.querySelector('.aneis--oferece').style.translate + ' | recompensas: ' + document.querySelector('.aneis--recompensas').style.translate");
    // alinhamento: centro dos dois conjuntos de anéis na mesma posição da tela
    const centros = await evaluate("[...document.querySelectorAll('[data-parallax]')].map(s => { const r = s.getBoundingClientRect(); return [Math.round(r.left + r.width / 2), Math.round(r.top + r.height / 2)]; })");
    medidas[w] = { translateA: ya, translateB: yb, centrosAneis: centros, scrollW: await evaluate('document.documentElement.scrollWidth') };
  }
  console.log(JSON.stringify(medidas, null, 1));
  b.close();
})().catch(e => { console.error(e); process.exit(1); });
