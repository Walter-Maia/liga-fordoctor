// v0.5.3: quadros da transição do FAQ (hover e abrir) em instantes curtos, para conferir se a passagem é suave.
// Uso: node qa/scripts/com-servidor.js qa/scripts/v05-faq.js
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { launch, screenshot, sleep } = require('../fase-1-auditoria/scripts/cdp');

const BASE = process.env.QA_URL || 'http://localhost:4173/';
const OUT = path.join(__dirname, '..', 'preview-v0.5', 'faq');
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const b = await launch(9397);
  const { send, evaluate } = b;
  await send('Page.enable'); await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: BASE + '?intro=0' });
  await sleep(2000);
  await evaluate(`scrollTo({ top: document.querySelector('.faq').getBoundingClientRect().top + scrollY - 160, behavior: 'instant' })`);
  await sleep(2200);
  const caixa = await evaluate(`(() => { const r = document.querySelector('.faq').getBoundingClientRect(); return [Math.round(r.x) - 10, Math.round(r.y + scrollY) - 10, Math.round(r.width) + 20, 330]; })()`);
  const pos = i => evaluate(`(() => { const r = document.querySelectorAll('.faq summary')[${i}].getBoundingClientRect(); return [r.x + 60, r.y + r.height / 2]; })()`);
  const quadros = [];
  const foto = async nome => { const f = path.join(OUT, nome + '.png'); await screenshot(send, f, { format: 'png', clip: { x: caixa[0], y: caixa[1], width: caixa[2], height: caixa[3], scale: 1 } }); quadros.push(f); };
  // relógio: espera em ms medidos pela própria página
  const espera = ms => evaluate(`new Promise(r => { const t0 = performance.now(); const f = () => performance.now() - t0 >= ${ms} ? r() : requestAnimationFrame(f); f(); })`);

  await foto('0-repouso');
  const p1 = await pos(1);
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: p1[0], y: p1[1] });
  await espera(90); await foto('1-hover-90ms');
  await espera(90); await foto('2-hover-180ms');
  await espera(300); await foto('3-hover-fim');
  await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: p1[0], y: p1[1], button: 'left', clickCount: 1 });
  await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: p1[0], y: p1[1], button: 'left', clickCount: 1 });
  await espera(120); await foto('4-abrindo-120ms');
  await espera(400); await foto('5-aberta');
  const p3 = await pos(3);
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: p3[0], y: p3[1] });
  await espera(500); await foto('6-aberta-e-hover-em-outra');
  b.close();

  const tmp = path.join(OUT, '_seq'); fs.mkdirSync(tmp, { recursive: true });
  quadros.forEach((f, i) => fs.copyFileSync(f, path.join(tmp, String(i).padStart(2, '0') + '.png')));
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', path.join(tmp, '%02d.png'), '-vf', 'scale=560:-1,tile=2x4:padding=8:color=white', '-frames:v', '1', path.join(OUT, 'folha.jpg')]);
  quadros.forEach((_, i) => fs.unlinkSync(path.join(tmp, String(i).padStart(2, '0') + '.png')));
  fs.rmdirSync(tmp);
  console.log('quadros', quadros.length);
})().catch(e => { console.error(e); process.exit(1); });
