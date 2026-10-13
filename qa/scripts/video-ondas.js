// Grava um ciclo das ondas do hero quadro a quadro (animação congelada via Web Animations) e monta um MP4.
// Uso: node qa/scripts/video-ondas.js   (Node 22+, Edge, ffmpeg)
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { launch, screenshot, sleep } = require('../fase-1-auditoria/scripts/cdp');

const URL_ = 'file:///' + path.resolve(__dirname, '../../preview/index.html').split(path.sep).join('/') + '?intro=0';
const OUT = path.join(__dirname, '..', 'preview-v0.4');
const FPS = 20, CICLO = 6;

(async () => {
  const b = await launch(9356); const { send, evaluate } = b; await send('Page.enable'); await send('Runtime.enable');
  for (const [w, h, recorte] of [[1440, 900, 'crop=1440:760:0:56'], [390, 844, 'crop=780:1576:0:112']]) {
    const dir = path.join(OUT, 'quadros-' + w); fs.mkdirSync(dir, { recursive: true });
    await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: w < 1024 ? 2 : 1, mobile: w < 1024 });
    await send('Page.navigate', { url: URL_ }); await sleep(1600);
    if (w < 1024) await evaluate("scrollTo({ top: document.querySelector('.hero__foto').getBoundingClientRect().top + scrollY - 140, behavior: 'instant' })");
    await sleep(300);
    const n = await evaluate("(window.__on = document.querySelector('[data-ondas]').getAnimations({ subtree: true })).forEach(a => a.pause()), window.__on.length");
    const total = FPS * CICLO;
    for (let q = 0; q < total; q++) {
      await evaluate(`window.__on.forEach(a => { a.currentTime = ${(q / FPS) * 1000}; }); new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))`);
      await screenshot(send, path.join(dir, String(q).padStart(3, '0') + '.jpg'), { quality: 88 });
    }
    const mp4 = path.join(OUT, 'ondas-' + w + '.mp4');
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-framerate', String(FPS), '-stream_loop', '2', '-i', path.join(dir, '%03d.jpg'), '-vf', recorte + (w < 1024 ? ',scale=390:-2' : '') + ',format=yuv420p', '-c:v', 'libx264', '-crf', '20', '-movflags', '+faststart', mp4]);
    // folha com 4 instantes do ciclo
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', path.join(dir, '%03d.jpg'), '-vf', `select='not(mod(n\\,${total / 4}))',${recorte}${w < 1024 ? ',scale=390:-2' : ',scale=720:-2'},tile=4x1:padding=6:color=white`, '-frames:v', '1', path.join(OUT, 'ondas-' + w + '-folha.jpg')]);
    fs.readdirSync(dir).forEach(f => fs.unlinkSync(path.join(dir, f))); fs.rmdirSync(dir);
    console.log(w, 'animações:', n, '→', mp4);
  }
  b.close();
})().catch(e => { console.error(e); process.exit(1); });
