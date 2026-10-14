// v0.5.1: confere que os efeitos voltam ao início fora da tela e tocam de novo ao rolar para baixo e para cima,
// o nome acessível dos títulos divididos em linhas e os estados do FAQ (hover e aberto).
// Uso: node qa/scripts/com-servidor.js qa/scripts/v05-repete.js
const fs = require('fs');
const path = require('path');
const { launch, screenshot, sleep } = require('../fase-1-auditoria/scripts/cdp');

const BASE = process.env.QA_URL || 'http://localhost:4173/';
const OUT = path.join(__dirname, '..', 'preview-v0.5', 'repete');
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const b = await launch(9395);
  const { send, evaluate } = b;
  await send('Page.enable'); await send('Runtime.enable'); await send('Accessibility.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: BASE + '?intro=0' });
  await sleep(2500);
  const vai = async (sel, extra = 0) => evaluate(`scrollTo({ top: ${sel === 'topo' ? 0 : `document.querySelector('${sel}').getBoundingClientRect().top + scrollY - 120 + ${extra}`}, behavior: 'instant' })`);
  const cls = sel => evaluate(`document.querySelector('${sel}').getAttribute('class')`);
  const log = [];
  const registra = async (rotulo, sel) => log.push(rotulo + ' → ' + (await cls(sel)));

  // ida (para baixo)
  await registra('carga, trilha fora da tela', '[data-trilha]');
  await registra('carga, título PJ fora da tela', '#h-pj');
  await vai('#recompensas', 250); await sleep(350);
  await registra('descendo: trilha entrou', '[data-trilha]');
  await sleep(2000);
  await registra('trilha depois da animação', '[data-trilha]');
  await vai('#cadastro'); await sleep(400);
  await registra('no cadastro: trilha fora da tela', '[data-trilha]');
  await registra('no cadastro: constelação do hero', '[data-constelacao]');
  // volta (para cima)
  await vai('#recompensas', 250); await sleep(350);
  await registra('subindo: trilha entrou de novo', '[data-trilha]');
  await vai('#pj'); await sleep(300);
  await registra('subindo: título PJ', '#h-pj');
  await vai('#liga'); await sleep(400);
  await registra('subindo: foto da Liga', '[data-foto-liga]');
  await sleep(1500);
  await screenshot(send, path.join(OUT, 'liga-foto.jpg'), { quality: 78 });
  await vai('topo'); await sleep(250);
  await registra('de volta ao topo: constelação', '[data-constelacao]');
  log.push('formandos animando de novo: ' + await evaluate(`[...document.querySelectorAll('.aluno')].filter(a => a.getAnimations().length).length + ' de 6'`));
  await sleep(2200);
  await screenshot(send, path.join(OUT, 'hero-de-volta.jpg'), { quality: 78 });

  // traços em SVG (marcas-d'água e órbita): desenham ao entrar e voltam ao início fora da tela, nos dois sentidos
  const traco = sel => evaluate(`(() => { const el = document.querySelector('${sel}'); return (el.getAttribute('class') || '') + ' | dashoffset ' + getComputedStyle(el.querySelector('.orbita') || el).strokeDashoffset; })()`);
  for (const [nome, secao, sel] of [['marca-dágua da formatura', '#formatura', '.marca-dagua--formatura'], ['órbita da foto', '#liga', '.liga__orbita'], ['marca-dágua do cadastro', '#cadastro', '.marca-dagua--cadastro']]) {
    await vai('topo'); await sleep(300);
    log.push(nome + ', fora da tela: ' + await traco(sel));
    await vai(secao); await sleep(500);
    log.push(nome + ', descendo (0,5 s): ' + await traco(sel));
    await sleep(3000);
    log.push(nome + ', depois do desenho: ' + await traco(sel));
    await vai('.rodape', 2000); await sleep(300);
    await vai(secao); await sleep(500);
    log.push(nome + ', subindo de volta (0,5 s): ' + await traco(sel));
  }
  await sleep(3000);
  await screenshot(send, path.join(OUT, 'cadastro-marca-dagua.jpg'), { quality: 78 });

  // nome acessível dos títulos divididos em linhas e das seções que apontam para eles (sem texto repetido)
  const { nodes } = await send('Accessibility.getFullAXTree');
  const titulos = nodes.filter(n => n.role && n.role.value === 'heading' && n.properties && n.properties.some(p => p.name === 'level' && p.value.value === 2)).map(n => n.name && n.name.value);
  log.push('títulos H2 para leitores de tela: ' + JSON.stringify(titulos));
  const regioes = nodes.filter(n => n.role && n.role.value === 'region').map(n => n.name && n.name.value);
  log.push('seções (region) para leitores de tela: ' + JSON.stringify(regioes));

  // FAQ: hover na 1ª pergunta e clique na 2ª
  await vai('#perguntas'); await sleep(2000);
  const r = await evaluate(`(() => { const s = document.querySelectorAll('.faq summary'); const a = s[0].getBoundingClientRect(), c = s[1].getBoundingClientRect(); return [a.x + 40, a.y + a.height / 2, c.x + 40, c.y + c.height / 2]; })()`);
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: r[0], y: r[1] }); await sleep(400);
  log.push('FAQ hover: ' + await evaluate(`(() => { const d = document.querySelectorAll('.faq details')[0]; return getComputedStyle(d).backgroundColor + ' / ' + getComputedStyle(d.querySelector('summary')).color; })()`));
  await screenshot(send, path.join(OUT, 'faq-hover.jpg'), { quality: 78 });
  await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: r[2], y: r[3], button: 'left', clickCount: 1 });
  await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: r[2], y: r[3], button: 'left', clickCount: 1 });
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 5, y: 450 }); await sleep(500);
  log.push('FAQ aberto: ' + await evaluate(`(() => { const d = document.querySelectorAll('.faq details')[1]; return d.open + ' / ' + getComputedStyle(d).backgroundColor + ' / ' + getComputedStyle(d.querySelector('summary')).color; })()`));
  await screenshot(send, path.join(OUT, 'faq-aberto.jpg'), { quality: 78 });

  console.log(log.join('\n'));
  b.close();
})().catch(e => { console.error(e); process.exit(1); });
