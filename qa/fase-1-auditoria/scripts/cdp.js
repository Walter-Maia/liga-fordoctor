// Harness CDP mínimo (Edge headless, Node 24, sem dependências)
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function launch(port = 9333, extraArgs = []) {
  // perfil temporário fora do projeto (cache e cookies do navegador não podem ir para o repositório)
  const profile = fs.mkdtempSync(path.join(require('os').tmpdir(), 'liga-qa-edge-'));
  const proc = spawn(EDGE, [
    '--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`,
    '--no-first-run', '--no-default-browser-check', '--disable-extensions',
    '--hide-scrollbars', '--mute-audio', ...extraArgs, 'about:blank'
  ], { stdio: 'ignore' });
  for (let i = 0; i < 50; i++) {
    try { const r = await fetch(`http://127.0.0.1:${port}/json/version`); if (r.ok) break; } catch (e) {}
    await sleep(200);
  }
  const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  const page = list.find(t => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  let id = 0; const pending = new Map(); const listeners = [];
  ws.onmessage = ev => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) { const { res, rej } = pending.get(msg.id); pending.delete(msg.id); msg.error ? rej(new Error(JSON.stringify(msg.error))) : res(msg.result); }
    else if (msg.method) listeners.forEach(l => l(msg));
  };
  const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); });
  const on = fn => listeners.push(fn);
  const evaluate = async (expr) => {
    const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
    if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails).slice(0, 500));
    return r.result.value;
  };
  const close = () => {
    try { ws.close(); } catch (e) {}
    proc.kill();
    // apaga o perfil quando o Edge terminar de liberar os arquivos
    setTimeout(() => { try { fs.rmSync(profile, { recursive: true, force: true }); } catch (e) {} }, 1500);
  };
  return { send, on, evaluate, close };
}

async function screenshot(send, file, opts = {}) {
  const r = await send('Page.captureScreenshot', { format: opts.format || 'jpeg', quality: opts.quality || 70, captureBeyondViewport: !!opts.full, clip: opts.clip });
  fs.writeFileSync(file, Buffer.from(r.data, 'base64'));
}

module.exports = { launch, screenshot, sleep };
