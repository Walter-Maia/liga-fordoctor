// v0.5: quadros em tempo real da passagem intro → página (cabeçalho em partes e constelação do hero).
// Uso: node qa/scripts/v05-entrega.js [largura] [altura]   (servidor local ligado)
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { launch, screenshot, sleep } = require('../fase-1-auditoria/scripts/cdp');

const W = Number(process.argv[2] || 1440), H = Number(process.argv[3] || 900);
const OUT = path.join(__dirname, '..', 'preview-v0.5', 'entrega');
fs.mkdirSync(OUT, { recursive: true });
const TEMPOS = [2.6, 3.2, 3.5, 3.8, 4.1, 4.5, 5.0, 6.0];

(async () => {
  const b = await launch(9391);
  const { send, evaluate } = b;
  await send('Page.enable'); await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: W < 1024 });
  await send('Page.navigate', { url: (process.env.QA_URL || 'http://localhost:4173/') + '?intro=1' });
  // relógio da própria página: espera cada instante contado a partir de .li-tocando
  let t0 = null;
  for (let i = 0; i < 60 && t0 === null; i++) { await sleep(50); t0 = await evaluate("document.querySelector('.li-intro.li-tocando') ? performance.now() : null"); }
  if (t0 === null) throw new Error('a intro não tocou');
  const arquivos = [];
  for (const t of TEMPOS) {
    await evaluate(`new Promise(r => { const f = () => performance.now() - ${t0} >= ${t * 1000} ? r() : requestAnimationFrame(f); f(); })`);
    const f = path.join(OUT, W + '-' + t.toFixed(1).replace('.', '_') + '.jpg');
    await screenshot(send, f, { quality: 72 });
    arquivos.push(f);
  }
  b.close();
  const tmp = path.join(OUT, '_seq'); fs.mkdirSync(tmp, { recursive: true });
  arquivos.forEach((f, i) => fs.copyFileSync(f, path.join(tmp, String(i).padStart(2, '0') + '.jpg')));
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', path.join(tmp, '%02d.jpg'), '-vf', `scale=${W > 800 ? 480 : 240}:-1,tile=4x2:padding=6:color=white`, '-frames:v', '1', path.join(OUT, W + '-folha.jpg')]);
  arquivos.forEach((_, i) => fs.unlinkSync(path.join(tmp, String(i).padStart(2, '0') + '.jpg')));
  fs.rmdirSync(tmp);
  console.log('quadros', arquivos.length);
})().catch(e => { console.error(e); process.exit(1); });
