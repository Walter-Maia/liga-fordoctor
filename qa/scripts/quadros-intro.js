// Congela a intro em instantes do roteiro e fotografa cada quadro (adaptado de efeito-de-intro/scripts/capturar-quadros.js).
// Uso: node qa/scripts/quadros-intro.js [larguraxaltura] [tempos]   (Node 22+, Edge)
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { launch, screenshot, sleep } = require('../fase-1-auditoria/scripts/cdp');

const [W, H] = (process.argv[2] || '1440x900').split('x').map(Number);
const T = (process.argv[3] || '0.2,0.5,0.8,1.1,1.4,1.7,2.0,2.3,2.6,3.0').split(',').map(Number);
const URL_ = 'file:///' + path.resolve(__dirname, '../../preview/index.html').replace(/\\/g, '/') + '?intro=1';
const OUT = process.env.QA_OUT || path.join(__dirname, '..', 'preview-v0.2', 'intro');
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const b = await launch(9347);
  const { send, evaluate } = b;
  await send('Page.enable'); await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: W < 1024 });
  // anula timers longos: o fim natural e as travas não disparam enquanto fotografamos
  await send('Page.addScriptToEvaluateOnNewDocument', { source: '(function(){var st=window.setTimeout;window.setTimeout=function(f,ms){return ms>=1400?0:st.apply(window,arguments)}})();' });
  await send('Page.navigate', { url: URL_ });
  let ok = false;
  for (let i = 0; i < 80 && !ok; i++) { await sleep(100); ok = await evaluate("!!document.querySelector('.li-intro.li-tocando')"); }
  if (!ok) throw new Error('a intro não entrou em .li-tocando');
  await sleep(300);
  const n = await evaluate("(window.__an = document.querySelector('.li-intro').getAnimations({ subtree: true })).forEach(a => a.pause()), window.__an.length");
  const arquivos = [];
  for (const t of T) {
    await evaluate(`window.__an.forEach(a => { a.currentTime = ${t * 1000}; }); new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))`);
    const f = path.join(OUT, W + '-' + t.toFixed(1).replace('.', '_') + '.jpg');
    await screenshot(send, f, { quality: 80 });
    arquivos.push(f);
  }
  console.log(JSON.stringify({ animacoes: n, quadros: arquivos.length }));
  b.close();
  const tmp = path.join(OUT, '_seq'); fs.mkdirSync(tmp, { recursive: true });
  arquivos.forEach((f, i) => fs.copyFileSync(f, path.join(tmp, String(i).padStart(2, '0') + '.jpg')));
  const cols = Math.min(5, arquivos.length), rows = Math.ceil(arquivos.length / cols);
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', path.join(tmp, '%02d.jpg'), '-vf', `scale=${W > 800 ? 480 : 240}:-1,tile=${cols}x${rows}:padding=6:color=white`, '-frames:v', '1', path.join(OUT, W + '-folha.jpg')]);
  arquivos.forEach((_, i) => fs.unlinkSync(path.join(tmp, String(i).padStart(2, '0') + '.jpg')));
  fs.rmdirSync(tmp);
})().catch(e => { console.error(e); process.exit(1); });
