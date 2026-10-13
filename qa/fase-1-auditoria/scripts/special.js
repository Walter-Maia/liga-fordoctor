// Cenários: sem JS, movimento reduzido, teclado, fonte real usada, rolagem por âncora
const fs = require('fs'); const path = require('path');
const { launch, screenshot, sleep } = require('./cdp');
const URL_ = 'https://fordoctor.com.br/liga-fordoctor/';
const OUT = path.join(__dirname, 'shots'); fs.mkdirSync(OUT, { recursive: true });
const res = {};

async function fresh(b, w, h, mobile) {
  await b.send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile });
  await b.send('Emulation.setTouchEmulationEnabled', { enabled: mobile });
}

(async () => {
  const b = await launch(9334, ['--lang=pt-BR']);
  const { send, evaluate } = b;
  await send('Page.enable'); await send('Runtime.enable'); await send('DOM.enable'); await send('CSS.enable');
  const logs = []; b.on(m => { if (m.method === 'Runtime.consoleAPICalled') logs.push(m.params.type + ': ' + m.params.args.map(a => a.value ?? a.description ?? a.type).join(' ').slice(0, 120)); });

  // 1) JS desativado
  for (const [w, h, mob] of [[390, 844, true], [1440, 900, false]]) {
    await fresh(b, w, h, mob);
    await send('Emulation.setScriptExecutionDisabled', { value: true });
    await send('Page.navigate', { url: URL_ }); await sleep(5000);
    await screenshot(send, path.join(OUT, `${w}-sem-js.jpg`), { full: true, quality: 55 });
    await send('Emulation.setScriptExecutionDisabled', { value: false });
    // lê o estado via DOM (sem JS na página, usamos CDP DOM)
    const doc = await send('DOM.getDocument', { depth: -1 });
    const q = await send('DOM.querySelectorAll', { nodeId: doc.root.nodeId, selector: '.elementor-invisible' });
    res['semJS_' + w] = { elementorInvisible: q.nodeIds.length };
  }

  // 2) Fonte real usada (plataforma) no H1, parágrafo e campo
  await fresh(b, 390, 844, true);
  await send('Page.navigate', { url: URL_ }); await sleep(4000);
  const doc = await send('DOM.getDocument', { depth: -1 });
  for (const s of ['h1', 'h2', 'form input[type=email]', 'a.elementor-button', 'footer p, .elementor-widget-text-editor p']) {
    const n = await send('DOM.querySelector', { nodeId: doc.root.nodeId, selector: s });
    if (!n.nodeId) continue;
    // fonte do primeiro nó de texto
    const d = await send('DOM.describeNode', { nodeId: n.nodeId, depth: 3 });
    let target = n.nodeId;
    try { const pf = await send('CSS.getPlatformFontsForNode', { nodeId: target }); res['fonte_' + s] = pf.fonts; } catch (e) { res['fonte_' + s] = String(e).slice(0, 100); }
  }
  res.fontsCheck = await evaluate(`({poppins: document.fonts.check('16px Poppins'), dosis: document.fonts.check('16px Dosis'), jost: document.fonts.check('16px Jost'), dosisFace: [...document.fonts].filter(f=>f.family.includes('Dosis')).map(f=>f.status)})`);

  // 3) Movimento reduzido: animações do Elementor continuam?
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await send('Page.navigate', { url: URL_ }); await sleep(4000);
  await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 5, y: 800 }] }); await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await sleep(2000);
  await evaluate('window.scrollTo(0, 1500)'); await sleep(150);
  res.reducedMotion = await evaluate(`[...document.querySelectorAll('.animated, .elementor-invisible')].slice(0,8).map(e=>({cls:[...e.classList].filter(c=>/animated|fade|zoom|invisible/.test(c)).join(' '), anim:getComputedStyle(e).animationName, dur:getComputedStyle(e).animationDuration, op:getComputedStyle(e).opacity}))`);
  await sleep(1500);
  await screenshot(send, path.join(OUT, `390-movimento-reduzido-meio.jpg`));
  res.lenisWithReducedMotion = await evaluate(`document.documentElement.className`);
  await send('Emulation.setEmulatedMedia', { features: [] });

  // 4) Teclado em 1440: ordem de tabulação e foco visível
  await fresh(b, 1440, 900, false);
  await send('Page.navigate', { url: URL_ }); await sleep(4000);
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 10, y: 10 }); await sleep(2500);
  const tabs = [];
  for (let i = 0; i < 14; i++) {
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
    await sleep(350);
    tabs.push(await evaluate(`(()=>{const e=document.activeElement;const s=getComputedStyle(e);const r=e.getBoundingClientRect();return {tag:e.tagName, name:e.name||'', text:(e.innerText||e.placeholder||'').trim().slice(0,30), outline:s.outlineStyle+' '+s.outlineWidth+' '+s.outlineColor, shadow:s.boxShadow, inView: r.top>=0 && r.bottom<=innerHeight, scrollY: Math.round(scrollY)}})()`));
    if (i === 0 || i === 2 || i === 6) await screenshot(send, path.join(OUT, `1440-teclado-tab${i + 1}.jpg`));
  }
  res.tabs = tabs;

  // 5) Âncora: Enter no primeiro CTA leva ao formulário? (com Lenis ativo)
  await send('Page.navigate', { url: URL_ }); await sleep(4000);
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 10, y: 10 }); await sleep(2500);
  await evaluate(`document.querySelector('a.elementor-button[href="#form"]').focus()`);
  const t0 = Date.now();
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
  await sleep(2000);
  res.anchor = await evaluate(`(()=>{const f=document.getElementById('form');const r=f?f.getBoundingClientRect():null;const form=document.querySelector('form.elementor-form').getBoundingClientRect();return {anchorExists:!!f, anchorTag:f&&f.tagName, scrollY:Math.round(scrollY), anchorTop:r&&Math.round(r.top), formTop:Math.round(form.top), formBottom:Math.round(form.bottom), vh:innerHeight, focus:document.activeElement.tagName+' '+(document.activeElement.name||'')}})()`);
  await screenshot(send, path.join(OUT, `1440-apos-cta-ancora.jpg`));
  res.consoleLenisLogs = logs.filter(l => l.startsWith('log:')).length;
  res.consoleSample = logs.slice(0, 5);
  fs.writeFileSync(path.join(OUT, 'special.json'), JSON.stringify(res, null, 1));
  console.log(JSON.stringify(res, null, 1).slice(0, 6000));
  b.close();
})().catch(e => { console.error(e); process.exit(1); });
