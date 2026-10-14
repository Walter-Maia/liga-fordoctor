// v0.5.1: confere a página com movimento reduzido e sem JavaScript (o botão de pausa saiu na v0.5.1).
// Uso: node qa/scripts/v05-estados.js   (servidor local ligado: npm run preview)
const fs = require('fs');
const path = require('path');
const { launch, screenshot, sleep } = require('../fase-1-auditoria/scripts/cdp');

const BASE = process.env.QA_URL || 'http://localhost:4173/';
const OUT = path.join(__dirname, '..', 'preview-v0.5', 'estados');
fs.mkdirSync(OUT, { recursive: true });

// o que precisa estar visível e inteiro no estado final (opacidade, traço e recorte)
const ESTADO = `(() => {
  const op = s => [...document.querySelectorAll(s)].map(el => +getComputedStyle(el).opacity);
  const dash = s => [...document.querySelectorAll(s)].map(el => getComputedStyle(el).strokeDashoffset);
  const clip = s => [...document.querySelectorAll(s)].map(el => getComputedStyle(el).clipPath);
  return {
    anelDaTurma: dash('.orbita-turma'), formandos: op('.aluno'), fios: dash('.fio'), simbolo: dash('.constelacao__simbolo'),
    marcas: dash('.marca-dagua'), icones: dash('.servicos__icone'), orbita: dash('.orbita'),
    fotoLiga: clip('.liga__foto picture'), selo: op('.liga__selo'),
    titulos: [...document.querySelectorAll('[data-revela]')].filter(h => h.querySelector('.linha-conteudo')).length,
    armados: document.querySelectorAll('.armada').length,
    ondasAnimando: [...document.querySelectorAll('.ondas span')].filter(s => getComputedStyle(s).animationName !== 'none').length
  };
})()`;

(async () => {
  const b = await launch(9381);
  const { send, evaluate } = b;
  await send('Page.enable'); await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  const resultado = {};
  const percorre = async (prefixo) => {
    const altura = await evaluate('document.documentElement.scrollHeight');
    for (let y = 0; y <= altura; y += 600) { await evaluate('scrollTo({top:' + y + ',behavior:"instant"})'); await sleep(120); }
    await sleep(600);
    for (const sel of ['#liga', '#contabilidade']) {
      await evaluate(`scrollTo({ top: document.querySelector('${sel}').getBoundingClientRect().top + scrollY, behavior: 'instant' })`);
      await sleep(300);
      await screenshot(send, path.join(OUT, prefixo + '-' + sel.slice(1) + '.jpg'), { quality: 72 });
    }
  };

  // 1. movimento reduzido: tudo nasce no estado final, sem ondas nem sinais
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await send('Page.navigate', { url: BASE + '?intro=1' }); await sleep(1500);
  resultado.introComReduzido = await evaluate("!!document.querySelector('.li-intro') || document.documentElement.classList.contains('intro-ativa')");
  await percorre('reduzido');
  resultado.reduzido = await evaluate(ESTADO);
  await send('Emulation.setEmulatedMedia', { features: [] });

  // 2. sem JavaScript: conteúdo inteiro, cabeçalho com barra sólida
  await send('Emulation.setScriptExecutionDisabled', { value: true });
  await send('Page.navigate', { url: BASE }); await sleep(3500);
  await screenshot(send, path.join(OUT, 'sem-js-hero.jpg'), { quality: 72 });
  await percorre('sem-js');
  resultado.semJs = await evaluate(ESTADO).catch(() => 'avaliação bloqueada sem JS');
  await send('Emulation.setScriptExecutionDisabled', { value: false });

  console.log(JSON.stringify(resultado, null, 1));
  b.close();
})().catch(e => { console.error(e); process.exit(1); });
