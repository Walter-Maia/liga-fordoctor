const { launch, sleep } = require('./cdp');
(async () => {
  const b = await launch(9335, ['--lang=pt-BR']); const { send, evaluate } = b;
  await send('Page.enable'); await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: 'https://fordoctor.com.br/liga-fordoctor/' }); await sleep(4000);
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 10, y: 10 }); await sleep(2500);
  const st = () => evaluate(`(()=>{const i=document.querySelector('#form-field-email');let p=i,inv=null;while(p){if(p.classList&&p.classList.contains('elementor-invisible')){inv=p.dataset.id;break}p=p.parentElement}const r=i.getBoundingClientRect();return {scrollY:Math.round(scrollY),visibility:getComputedStyle(i).visibility,ancestorInvisible:inv,top:Math.round(r.top)}})()`);
  console.log('topo', JSON.stringify(await st()));
  await evaluate(`[...document.querySelectorAll('a.elementor-button')].at(-1).focus()`); await sleep(800);
  console.log('foco no último CTA', JSON.stringify(await st()));
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 }); await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 }); await sleep(500);
  console.log('após Tab: ativo =', await evaluate(`document.activeElement.tagName+' '+(document.activeElement.name||'')`), JSON.stringify(await st()));
  // tempo até o formulário ficar visível depois que entra na tela
  await evaluate(`document.querySelector('#form-field-email').scrollIntoView({block:'center'})`);
  const t0 = Date.now(); let v; for (let i = 0; i < 30; i++) { v = await st(); if (v.visibility === 'visible' && !v.ancestorInvisible) break; await sleep(100); }
  console.log('visível após rolar até ele em ~' + (Date.now() - t0) + ' ms', JSON.stringify(v));
  const op = await evaluate(`getComputedStyle(document.querySelector('#form-field-email').closest('.animated')||document.body).animationDuration`); console.log('duração da animação do bloco do form:', op);
  b.close();
})();
