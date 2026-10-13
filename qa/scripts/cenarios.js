// Cenários de QA da pré-visualização: sem JS, movimento reduzido, quadros da trilha, aba oculta, teclado, formulário e file://
// Uso: node qa/scripts/cenarios.js   (Node 22+, servidor local em http://localhost:4173)
const fs = require('fs');
const path = require('path');
const { launch, screenshot, sleep } = require('../fase-1-auditoria/scripts/cdp');

const URL_ = 'file:///' + path.resolve(__dirname, '../../preview/index.html').split(path.sep).join('/') + '?intro=0';
const OUT = path.join(__dirname, '..', 'preview-v0.2', 'capturas');
fs.mkdirSync(OUT, { recursive: true });
const res = {};

(async () => {
  const b = await launch(9344, ['--lang=pt-BR']);
  const { send, evaluate } = b;
  await send('Page.enable'); await send('Runtime.enable'); await send('DOM.enable'); await send('CSS.enable');
  const vai = async (w, h, mobile, url = URL_) => {
    await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile });
    await send('Page.navigate', { url }); await sleep(2000);
  };
  const rola = (y) => evaluate('scrollTo({top:' + Math.round(y) + ',behavior:"instant"})');
  const tecla = async (key, code, vk) => {
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key, code, windowsVirtualKeyCode: vk });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key, code, windowsVirtualKeyCode: vk });
  };
  const topoDe = (sel) => evaluate(`document.querySelector('${sel}').getBoundingClientRect().top + scrollY`);

  // 1) Sem JS: todo o conteúdo visível
  await send('Emulation.setScriptExecutionDisabled', { value: true });
  await vai(390, 844, true);
  await screenshot(send, path.join(OUT, '390-sem-js.jpg'), { full: true, quality: 55 });
  await send('Emulation.setScriptExecutionDisabled', { value: false });

  // 2) Movimento reduzido: nada é armado, a página nasce no estado final
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await vai(390, 844, true);
  res.reduzido = await evaluate(`({ armados: document.querySelectorAll('.armada, .revela-armado, .aguardando').length, valores: [...document.querySelectorAll('.degrau__valor')].map(e => getComputedStyle(e).opacity).join(',') })`);
  await rola((await topoDe('[data-trilha]')) - 200); await sleep(300);
  await screenshot(send, path.join(OUT, '390-movimento-reduzido-recompensas.jpg'));
  await send('Emulation.setEmulatedMedia', { features: [] });

  // 3) Quadros da trilha (início, meio, fim) em 1440 e 390
  for (const [w, h, m] of [[1440, 900, false], [390, 844, true]]) {
    await vai(w, h, m);
    await rola((await topoDe('[data-trilha]')) - h * 0.3);
    const t0 = Date.now();
    for (const [nome, t] of [['0-inicio', 80], ['1-meio', 640], ['2-fim', 1600]]) {
      await sleep(Math.max(0, t - (Date.now() - t0)));
      await screenshot(send, path.join(OUT, w + '-trilha-' + nome + '.jpg'), { quality: 70 });
    }
    res['trilha_' + w + '_classes_no_fim'] = await evaluate(`document.querySelector('[data-trilha]').className`);
  }

  // 4) Aba oculta durante o desenho: pausa e retoma sem reiniciar
  await vai(1440, 900, false);
  await rola((await topoDe('[data-trilha]')) - 270); await sleep(350);
  await evaluate(`Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }); document.dispatchEvent(new Event('visibilitychange'))`);
  await sleep(100);
  const aoOcultar = await evaluate(`document.querySelector('[data-trilha]').className`);
  await sleep(1500);
  const depois = await evaluate(`document.querySelector('[data-trilha]').className`);
  await evaluate(`Object.defineProperty(document, 'hidden', { configurable: true, get: () => false }); document.dispatchEvent(new Event('visibilitychange'))`);
  await sleep(1800);
  res.abaOculta = { aoOcultar, depoisDe1500ms: depois, aoVoltar: (await evaluate(`document.querySelector('[data-trilha]').className`)) || 'trilha (concluída)' };

  // 5) Teclado: ordem de foco do início ao fim e foco visível
  await vai(1440, 900, false);
  const ordem = [];
  for (let i = 0; i < 40; i++) {
    await tecla('Tab', 'Tab', 9);
    await sleep(120);
    const a = await evaluate(`(() => { const e = document.activeElement; const s = getComputedStyle(e); const rot = e.labels && e.labels[0] ? e.labels[0].innerText : (e.innerText || ''); return e.tagName + ' ' + (e.id || e.getAttribute('href') || '') + ' "' + rot.trim().replace(/\\s+/g, ' ').slice(0, 30) + '" contorno=' + s.outlineStyle + ' ' + s.outlineWidth; })()`);
    ordem.push(a);
    if (i === 1) await screenshot(send, path.join(OUT, '1440-foco-cta.jpg'));
    if (a.startsWith('BODY')) break;
  }
  res.teclado = ordem;

  // 6) Formulário: erros, máscara, enviando, recebido, UTM e erro de envio (a pré-visualização não envia nada)
  await vai(390, 844, true);
  await rola((await topoDe('#cadastro')) + 300); await sleep(400);
  await evaluate(`document.querySelector('[data-enviar]').click()`); await sleep(300);
  res.erros = await evaluate(`[...document.querySelectorAll('[data-erro]')].map(e => e.textContent).filter(Boolean).concat('status: ' + document.querySelector('[data-status]').textContent, 'foco em: ' + document.activeElement.id)`);
  await screenshot(send, path.join(OUT, '390-formulario-erros.jpg'));
  await evaluate(`(() => { const f = (s, v) => { const el = document.querySelector(s); el.focus(); el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('blur')); }; f('#form-field-first_namae', 'Teste'); f('#form-field-last_name', 'Auditoria'); f('#form-field-email', 'teste@exemplo.com'); f('#form-field-field_f2695ae', '31999998888'); const s = document.querySelector('#form-field-periodo'); s.value = s.options[2].value; s.dispatchEvent(new Event('change', { bubbles: true })); })()`);
  res.mascara = await evaluate(`document.querySelector('#form-field-field_f2695ae').value`);
  await evaluate(`document.querySelector('[data-enviar]').click()`); await sleep(250);
  res.enviando = await evaluate(`document.querySelector('[data-enviar-texto]').textContent + ' | desabilitado=' + document.querySelector('[data-enviar]').disabled`);
  await screenshot(send, path.join(OUT, '390-formulario-enviando.jpg'));
  await sleep(1100);
  res.enviado = await evaluate(`document.querySelector('[data-enviar-texto]').textContent`);
  await screenshot(send, path.join(OUT, '390-formulario-recebido.jpg'));
  await sleep(1100);
  res.sucesso = await evaluate(`({ painelVisivel: !document.querySelector('[data-sucesso]').hidden, focoEm: document.activeElement.className })`);
  await screenshot(send, path.join(OUT, '390-formulario-sucesso.jpg'));

  await vai(390, 844, true, URL_ + '&erro=1&utm_source=teste-qa&utm_medium=preview&utm_campaign=liga');
  res.utm = await evaluate(`['utm_source','utm_medium','utm_campaign'].map(k => document.querySelector('[name="form_fields[' + k + ']"]').value).join(' / ')`);
  await evaluate(`(() => { const f = (s, v) => { document.querySelector(s).value = v; }; f('#form-field-first_namae', 'Teste'); f('#form-field-last_name', 'Auditoria'); f('#form-field-email', 'teste@exemplo.com'); f('#form-field-field_f2695ae', '(31) 99999-8888'); const s = document.querySelector('#form-field-periodo'); s.value = s.options[1].value; })()`);
  await rola((await topoDe('#cadastro')) + 300);
  await evaluate(`document.querySelector('[data-enviar]').click()`); await sleep(1500);
  res.erroEnvio = await evaluate(`document.querySelector('[data-status]').textContent + ' | botão: ' + document.querySelector('[data-enviar-texto]').textContent`);
  await screenshot(send, path.join(OUT, '390-formulario-erro-envio.jpg'));

  // 7) Abrindo o arquivo direto (file://): as fontes carregam?
  await vai(390, 844, true, 'file:///' + path.resolve(__dirname, '../../preview/index.html').replace(/\\/g, '/'));
  const doc = await send('DOM.getDocument', { depth: -1 });
  const n = await send('DOM.querySelector', { nodeId: doc.root.nodeId, selector: '.h1__frase' });
  res.fonteViaArquivo = (await send('CSS.getPlatformFontsForNode', { nodeId: n.nodeId })).fonts.map(f => f.familyName + (f.isCustomFont ? ' (web)' : ' (sistema)')).join(', ');

  fs.writeFileSync(path.join(OUT, '..', 'cenarios.json'), JSON.stringify(res, null, 1));
  console.log(JSON.stringify(res, null, 1));
  b.close();
})().catch(e => { console.error(e); process.exit(1); });
