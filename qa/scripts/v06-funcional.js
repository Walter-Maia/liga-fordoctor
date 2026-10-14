// v0.6: testes funcionais da página inteira, sem congelar nada.
// Celular (390 × 844, toque): CTA fixo, tom do cabeçalho, formulário (vazio, máscara do WhatsApp, envio simulado, erro com
// ?erro=1), FAQ e o primeiro Tab no link "Pular para o conteúdo". Desktop: a intro (?intro=1) cobre o hero, sai sozinha e
// o ciclo da indicação só começa depois dela. Erros de console em todas as etapas.
// Uso: node qa/scripts/com-servidor.js qa/scripts/v06-funcional.js
const fs = require('fs');
const path = require('path');
const { launch, sleep } = require('../fase-1-auditoria/scripts/cdp');

const BASE = process.env.QA_URL || 'http://localhost:4173/';
const OUT = path.join(__dirname, '..', 'preview-v0.6', 'funcional');
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const b = await launch(9383);
  const { send, evaluate, on } = b;
  const erros = [];
  on(m => {
    if (m.method === 'Runtime.exceptionThrown') erros.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text);
    if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') erros.push(m.params.args.map(a => a.value || a.description).join(' '));
    if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error') erros.push(m.params.entry.text + ' ' + (m.params.entry.url || ''));
  });
  await send('Page.enable'); await send('Runtime.enable'); await send('Log.enable');
  const r = {};
  const vai = async url => { await send('Page.navigate', { url }); await sleep(1500); };
  const rola = async sel => { await evaluate(`(() => { const el = document.querySelector('${sel}'); scrollTo({ top: el.getBoundingClientRect().top + scrollY - 80, behavior: 'instant' }); })()`); await sleep(500); };
  // a seção passando por baixo do cabeçalho (o tom segue o que está sob a linha do meio dele)
  const sob = async sel => { await evaluate(`scrollTo({ top: document.querySelector('${sel}').getBoundingClientRect().top + scrollY - 10, behavior: 'instant' })`); await sleep(500); };
  const digita = async (sel, texto) => { await evaluate(`document.querySelector('${sel}').focus()`); await send('Input.insertText', { text: texto }); await sleep(60); };
  const tecla = async (key, code, keyCode) => { await send('Input.dispatchKeyEvent', { type: 'keyDown', key, code, windowsVirtualKeyCode: keyCode }); await send('Input.dispatchKeyEvent', { type: 'keyUp', key, code, windowsVirtualKeyCode: keyCode }); await sleep(120); };
  const preenche = async () => {
    await digita('#form-field-first_namae', 'Ana'); await digita('#form-field-last_name', 'Souza');
    await digita('#form-field-email', 'ana@email.com'); await digita('#form-field-field_f2695ae', '31999998888');
    await evaluate(`(() => { const s = document.querySelector('#form-field-periodo'); s.value = s.options[1].value; s.dispatchEvent(new Event('change', { bubbles: true })); })()`);
  };

  // celular
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
  await vai(BASE + '?intro=0');
  await tecla('Tab', 'Tab', 9);
  r.primeiroTab = await evaluate("document.activeElement.className + ' → ' + document.activeElement.getAttribute('href')");
  await evaluate('document.activeElement.blur()');
  const cta = () => evaluate("document.querySelector('[data-cta-fixo]').classList.contains('visivel')");
  const tom = () => evaluate("document.querySelector('[data-topo]').getAttribute('data-tom')");
  r.ctaFixo = { noTopo: await cta() };
  r.tomDoCabecalho = { noTopo: await tom() };
  await sob('#formatura'); r.ctaFixo.depoisDoHero = await cta(); r.tomDoCabecalho.formatura = await tom();
  await sob('#recompensas'); r.tomDoCabecalho.recompensas = await tom();
  await rola('#cadastro'); await sleep(300); r.ctaFixo.noFormulario = await cta();

  // formulário vazio
  await evaluate("document.querySelector('[data-enviar]').click()"); await sleep(300);
  r.formVazio = await evaluate(`({ invalidos: document.querySelectorAll('[aria-invalid="true"]').length, status: document.querySelector('[data-status]').textContent, foco: document.activeElement.id, mensagens: [...document.querySelectorAll('[data-erro]')].map(e => e.textContent).filter(Boolean).length })`);
  await vai(BASE + '?intro=0'); await rola('#cadastro');
  await preenche();
  r.mascara = await evaluate("document.querySelector('#form-field-field_f2695ae').value");
  await evaluate("document.querySelector('[data-enviar]').click()"); await sleep(400);
  r.enviando = await evaluate("({ texto: document.querySelector('[data-enviar-texto]').textContent, desativado: document.querySelector('[data-enviar]').disabled })");
  await sleep(2400);
  r.sucesso = await evaluate("({ painel: !document.querySelector('[data-sucesso]').hidden, formOculto: document.querySelector('[data-formulario]').hidden, foco: document.activeElement.hasAttribute('data-sucesso') })");
  await vai(BASE + '?intro=0&erro=1'); await rola('#cadastro'); await preenche();
  await evaluate("document.querySelector('[data-enviar]').click()"); await sleep(1700);
  r.erroNoEnvio = await evaluate("({ estado: document.querySelector('[data-formulario]').getAttribute('data-estado'), botaoLiberado: !document.querySelector('[data-enviar]').disabled, mensagem: document.querySelector('[data-status]').textContent.slice(0, 60) })");

  // FAQ
  await rola('#perguntas');
  await evaluate("document.querySelector('.faq summary').click()"); await sleep(400);
  const aberto = await evaluate("document.querySelector('.faq details').open");
  await evaluate("document.querySelector('.faq summary').click()"); await sleep(400);
  r.faq = { abre: aberto, fecha: !(await evaluate("document.querySelector('.faq details').open")) };

  // desktop: intro e ciclo do hero
  await send('Emulation.setTouchEmulationEnabled', { enabled: false });
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: BASE + '?intro=1' });
  const amostra = async () => evaluate("({ intro: !!document.querySelector('.li-intro'), ativa: document.documentElement.classList.contains('intro-ativa'), ciclo: document.querySelector('[data-constelacao]').classList.contains('em-ciclo') })");
  await sleep(1500); const durante = await amostra();
  await sleep(2500); const saindo = await amostra();
  let cicloEm = null;
  for (let i = 0; i < 40; i++) { await sleep(100); if ((await amostra()).ciclo) { cicloEm = 4000 + i * 100; break; } }
  r.intro = { durante, aos4s: saindo, cicloLigouEm: cicloEm };

  fs.writeFileSync(path.join(OUT, 'resultado.json'), JSON.stringify({ r, erros }, null, 1));
  console.log(JSON.stringify({ r, erros }, null, 1));
  b.close();
})().catch(e => { console.error(e); process.exit(1); });
