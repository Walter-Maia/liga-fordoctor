// Gera src/assets/img/og-liga-fordoctor.jpg (1200×630) a partir de build/og.html usando o Edge headless.
// Uso: node build/og.mjs   (Node 22+, por causa do WebSocket nativo)
import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath, pathToFileURL } from 'url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const EDGE = process.env.EDGE || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const porta = 9350;
const perfil = await fs.mkdtemp(path.join(os.tmpdir(), 'og-edge-'));
const edge = spawn(EDGE, ['--headless=new', '--remote-debugging-port=' + porta, '--user-data-dir=' + perfil, '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

try {
  let alvo;
  for (let i = 0; i < 50 && !alvo; i++) {
    try { alvo = (await (await fetch('http://127.0.0.1:' + porta + '/json/list')).json()).find((t) => t.type === 'page'); } catch (e) { await espera(200); }
  }
  const ws = new WebSocket(alvo.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  let id = 0; const pendentes = new Map();
  ws.onmessage = (ev) => { const m = JSON.parse(ev.data); if (m.id && pendentes.has(m.id)) { pendentes.get(m.id)(m.result); pendentes.delete(m.id); } };
  const envia = (method, params = {}) => new Promise((r) => { const i = ++id; pendentes.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  await envia('Emulation.setDeviceMetricsOverride', { width: 1200, height: 630, deviceScaleFactor: 1, mobile: false });
  await envia('Page.enable');
  await envia('Page.navigate', { url: pathToFileURL(path.join(raiz, 'build', 'og.html')).href });
  await espera(1500);
  const shot = await envia('Page.captureScreenshot', { format: 'jpeg', quality: 84, clip: { x: 0, y: 0, width: 1200, height: 630, scale: 1 } });
  const destino = path.join(raiz, 'src', 'assets', 'img', 'og-liga-fordoctor.jpg');
  await fs.writeFile(destino, Buffer.from(shot.data, 'base64'));
  console.log('og-liga-fordoctor.jpg  ' + ((await fs.stat(destino)).size / 1024).toFixed(1) + ' KB');
  ws.close();
} finally {
  edge.kill();
}
