// Comportamento real da intro (sem congelar), pelo checklist de efeito-de-intro/references/verificacao.md.
// Uso: node qa/scripts/intro-cenarios.js   (Node 22+, Edge)
const fs = require('fs');
const path = require('path');
const { launch, screenshot, sleep } = require('../fase-1-auditoria/scripts/cdp');

const BASE = 'file:///' + path.resolve(__dirname, '../../preview/index.html').split(path.sep).join('/');
const OUT = path.join(__dirname, '..', 'preview-v0.2', 'intro');
const res = {};
const estado = `({ overlay: !!document.querySelector('.li-intro'), tocando: !!document.querySelector('.li-intro.li-tocando'), classes: document.documentElement.className, cabecalho: getComputedStyle(document.querySelector('.topo__marca')).opacity, hash: location.hash, sessao: (function(){ try { return sessionStorage.getItem('liga-intro'); } catch (e) { return 'erro'; } })() })`;

async function caso(nome, porta, preparo, acao) {
  const b = await launch(porta, ['--lang=pt-BR']);
  const { send, evaluate } = b;
  await send('Page.enable'); await send('Runtime.enable'); await send('Network.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
  if (preparo) await preparo(send);
  try { res[nome] = await acao(b, send, evaluate); } catch (e) { res[nome] = 'ERRO: ' + e.message; }
  b.close();
  await sleep(400);
}

(async () => {
  // 1) Primeira visita: toca inteira, overlay sai do DOM e o cabeçalho termina visível; 2) segunda carga na mesma aba: sem intro
  await caso('primeira_e_segunda_visita', 9360, null, async (b, send, ev) => {
    await send('Page.navigate', { url: BASE }); await sleep(600);
    const durante = await ev(estado);
    const t0 = Date.now(); let fim = null;
    for (let i = 0; i < 80; i++) { await sleep(100); if (!(await ev(`!!document.querySelector('.li-intro')`))) { fim = Date.now() - t0 + 600; break; } }
    await sleep(1600);
    const depois = await ev(estado);
    await send('Page.reload'); await sleep(900);
    const segunda = await ev(estado);
    return { durante, overlayRemovidoEmMs: fim, depois, segunda };
  });

  // 3) Esc no meio (0,9 s): libera na hora
  await caso('esc_no_meio', 9361, null, async (b, send, ev) => {
    await send('Page.navigate', { url: BASE }); await sleep(900);
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
    await sleep(450);
    return ev(estado);
  });

  // 4) Clique durante a intro sobre o CTA do hero: só pula, não segue o link
  await caso('clique_no_meio', 9362, null, async (b, send, ev) => {
    await send('Page.navigate', { url: BASE }); await sleep(1000);
    const alvo = await ev(`(() => { const r = document.querySelector('[data-cta-hero]').getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; })()`);
    await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: alvo[0], y: alvo[1], button: 'left', clickCount: 1 });
    await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: alvo[0], y: alvo[1], button: 'left', clickCount: 1 });
    await sleep(500);
    return Object.assign(await ev(estado), { scrollY: await ev('Math.round(scrollY)') });
  });

  // 5) URL com âncora: sem intro
  await caso('com_ancora', 9363, null, async (b, send, ev) => { await send('Page.navigate', { url: BASE + '#cadastro' }); await sleep(900); return ev(estado); });

  // 6) Movimento reduzido: sem intro
  await caso('movimento_reduzido', 9364, (send) => send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] }),
    async (b, send, ev) => { await send('Page.navigate', { url: BASE }); await sleep(900); return ev(estado); });

  // 7) Script da intro bloqueado: a cobertura sai na hora (onerror)
  await caso('intro_js_bloqueado', 9365, (send) => send('Network.setBlockedURLs', { urls: ['*intro.js*'] }),
    async (b, send, ev) => { await send('Page.navigate', { url: BASE }); await sleep(900); return ev(estado); });

  // 8) Aba oculta no meio: libera
  await caso('aba_oculta', 9366, null, async (b, send, ev) => {
    await send('Page.navigate', { url: BASE }); await sleep(900);
    await ev(`Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }); document.dispatchEvent(new Event('visibilitychange'))`);
    await sleep(450);
    return ev(estado);
  });

  // 9) CPU 4× no celular: a intro ainda termina e libera a página
  await caso('cpu_4x_mobile', 9367, async (send) => {
    await send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  }, async (b, send, ev) => {
    await send('Page.navigate', { url: BASE }); const t0 = Date.now(); let fim = null; let tocou = false;
    for (let i = 0; i < 120; i++) { await sleep(100); const s = await ev(`[!!document.querySelector('.li-intro.li-tocando'), !!document.querySelector('.li-intro')]`); if (s[0]) tocou = true; if (tocou && !s[1]) { fim = Date.now() - t0; break; } }
    await sleep(1500);
    return Object.assign(await ev(estado), { tocou, liberadoEmMs: fim });
  });

  // 10) Sem JavaScript: nenhuma cobertura
  await caso('sem_js', 9368, (send) => send('Emulation.setScriptExecutionDisabled', { value: true }),
    async (b, send, ev) => {
      await send('Page.navigate', { url: BASE }); await sleep(900);
      await screenshot(send, path.join(OUT, 'sem-js-1280.jpg'), { quality: 70 });
      return 'ver captura sem-js-1280.jpg';
    });

  fs.writeFileSync(path.join(OUT, 'cenarios-intro.json'), JSON.stringify(res, null, 1));
  console.log(JSON.stringify(res, null, 1));
})().catch(e => { console.error(e); process.exit(1); });
