// v0.8: confere a cena da indicação no hero (o traço dourado de você ao colega, pelo símbolo e de volta a você).
// Para cada largura: espera a cena ligar, congela todas as animações da constelação (entrada e cena) num instante contado
// a partir do carregamento e fotografa; mede sobreposição entre etiquetas, etiquetas × formandos (exceto o próprio),
// etiquetas fora da caixa do hero, fonte mínima, a ponta da caneta × formandos da rede e × etiquetas, e quanto do traço
// fica coberto pelas etiquetas no quadro final. Grava a cena inteira em MP4 (do carregamento ao quadro final, mais 1 s
// parado) e uma folha de contato. Mede, sem congelar, quanto tempo depois da primeira pintura a última animação do hero
// termina (WCAG 2.2.2: movimento automático de até 5 s dispensa o botão de pausa). Também confere o quadro final sem JS e
// com movimento reduzido, a pausa com a aba oculta e a repetição quando o hero sai da tela e volta.
// Uso: node qa/scripts/com-servidor.js qa/scripts/hero-cena.js [--video]
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { launch, screenshot, sleep } = require('../fase-1-auditoria/scripts/cdp');

const URL_ = (process.env.QA_URL || 'http://localhost:4173/') + '?intro=0';
const OUT = path.join(__dirname, '..', 'preview-v0.8', 'hero-cena');
const VIDEO = process.argv.includes('--video');
const TELAS = [[1440, 900, 1], [1024, 768, 1], [390, 844, 2], [320, 640, 2]];
const ENTRADA = 1.1; // s: a cena começa 1,1 s depois da entrada (o mesmo ENTRADA de liga.js)
const CENA = 3.7; // s (o mesmo --cena do CSS)
// instantes contados do carregamento (entrada em 0): entrada, você acende, traço até o colega, crédito do colega, traço até
// o símbolo, luz no S, volta, crédito chegando, quadro final
const INSTANTES = [0.5, 1.2, 1.7, 2.6, 2.9, 3.4, 3.95, 4.25, 4.5, 4.8];
fs.mkdirSync(OUT, { recursive: true });

// logo depois do carregamento (a entrada ainda tocando): pausa a entrada, liga a cena antes do JS (que depois só confirma
// a classe) e pausa tudo; assim a entrada não termina (animação terminada sai de getAnimations e não volta) e dá para
// filmar do começo. As animações ficam guardadas em window.__cena: depois do fim, uma animação com preenchimento só para
// trás deixa de aparecer em getAnimations e não daria mais para voltar no tempo
const prepara = `(() => {
  const c = document.querySelector('[data-constelacao]');
  c.getAnimations({ subtree: true }).forEach(a => a.pause());
  c.classList.add('em-cena');
  return new Promise(r => requestAnimationFrame(() => { const todas = c.getAnimations({ subtree: true }); todas.forEach(a => a.pause()); window.__cena = todas; r(todas.length); }));
})()`;

// congela tudo no instante t (s desde a entrada): animações de entrada em t, as da cena em t − ENTRADA
const congela = t => `(() => {
  const c = document.querySelector('[data-constelacao]');
  const todas = window.__cena || c.getAnimations({ subtree: true });
  todas.forEach(a => a.pause());
  todas.forEach(a => { const cena = a.animationName && /^(cena-|seg-)/.test(a.animationName); a.currentTime = Math.max(0, (cena ? ${t} - ${ENTRADA} : ${t}) * 1000); });
  return new Promise(r => requestAnimationFrame(() => requestAnimationFrame(() => r(todas.length))));
})()`;

const mede = `(() => {
  const c = document.querySelector('[data-constelacao]');
  const caixa = c.closest('.caixa').getBoundingClientRect();
  const vis = el => { let o = 1, e = el; while (e && e !== c) { const s = getComputedStyle(e); if (s.display === 'none' || s.visibility === 'hidden') return 0; o *= +s.opacity; e = e.parentElement; } return o; };
  const ret = el => { const r = el.getBoundingClientRect(); return { x: r.left, y: r.top, r: r.right, b: r.bottom }; };
  const cruza = (a, b) => Math.max(0, Math.min(a.r, b.r) - Math.max(a.x, b.x)) * Math.max(0, Math.min(a.b, b.b) - Math.max(a.y, b.y));
  const etiquetas = [...c.querySelectorAll('.etiqueta, .credito-colega, .beneficio')].map(el => ({ nome: el.classList[el.classList.length - 1], dono: el.closest('.pessoa--voce') ? 'voce' : 'colega', o: vis(el), ret: ret(el), fonte: Math.min(...[...el.querySelectorAll('span, strong')].filter(t => t.textContent.trim() || getComputedStyle(t, '::after').content !== 'none').map(t => parseFloat(getComputedStyle(t).fontSize))) })).filter(e => e.o > 0.05);
  const pessoas = [...c.querySelectorAll('.pessoa')].filter(p => getComputedStyle(p).display !== 'none').map(p => ({ nome: p.classList[1].replace('pessoa--', '') + (p.classList[2] ? '-' + p.classList[2].replace('pessoa--', '') : ''), ret: ret(p.querySelector('.pessoa__aluno')) }));
  const simbolo = ret(c.querySelector('.constelacao__simbolo'));
  const caneta = c.querySelector('.caneta');
  const ponta = vis(caneta) > 0.05 ? ret(caneta) : null;
  const problemas = [];
  etiquetas.forEach((a, i) => {
    etiquetas.slice(i + 1).forEach(b => { if (cruza(a.ret, b.ret) > 4) problemas.push(a.nome + ' × ' + b.nome); });
    pessoas.forEach(p => { if (!p.nome.startsWith(a.dono) && cruza(a.ret, p.ret) > 4) problemas.push(a.nome + ' × formando ' + p.nome); });
    if (a.ret.x < caixa.left + 2 || a.ret.r > caixa.right - 2) problemas.push(a.nome + ' fora da caixa');
    if (a.fonte < 13) problemas.push(a.nome + ' com fonte de ' + a.fonte + ' px');
    if (cruza(a.ret, simbolo) > 4) problemas.push(a.nome + ' × símbolo');
  });
  if (ponta) {
    pessoas.forEach(p => { if (p.nome.startsWith('rede') && cruza(ponta, p.ret) > 4) problemas.push('caneta × formando ' + p.nome); });
    etiquetas.forEach(e => { if (cruza(ponta, e.ret) > 4) problemas.push('caneta × ' + e.nome); });
  }
  // quanto do traço feito fica escondido debaixo de uma etiqueta visível (o centro de cada segmento já crescido)
  const coberto = {};
  ['indica', 'valida', 'volta'].forEach(n => {
    let total = 0, sob = 0;
    c.querySelectorAll('.segmento--' + n).forEach(sg => {
      const t = getComputedStyle(sg).transform;
      const escala = t === 'none' ? 1 : Math.hypot(...t.slice(7, -1).split(',').slice(0, 2).map(Number));
      if (escala < 0.5) return;
      const r = sg.getBoundingClientRect(), x = (r.left + r.right) / 2, y = (r.top + r.bottom) / 2;
      total++;
      if (etiquetas.some(e => x > e.ret.x && x < e.ret.r && y > e.ret.y && y < e.ret.b)) sob++;
    });
    coberto[n] = total ? Math.round((sob / total) * 100) + '%' : '—';
  });
  return { etiquetas: etiquetas.map(e => e.nome + ' ' + e.o.toFixed(2)), caneta: ponta ? 'visível' : 'escondida', tracoCobertoPorEtiqueta: coberto, problemas, rolagemLateral: document.documentElement.scrollWidth > innerWidth };
})()`;

const recorte = async (evaluate, margem) => evaluate(`(() => { const r = document.querySelector('[data-constelacao]').getBoundingClientRect(); const m = ${margem}; return { x: Math.max(0, r.left + scrollX - m), y: Math.max(0, r.top + scrollY - m), width: Math.min(innerWidth, r.width + 2 * m), height: r.height + 2 * m, scale: 1 }; })()`);
const centraliza = `(() => { const r = document.querySelector('[data-constelacao]').getBoundingClientRect(); scrollTo({ top: Math.max(0, r.top + scrollY - (innerHeight - r.height) / 2), behavior: 'instant' }); })()`;
// o valor que o odômetro mostra: em cada coluna, o dígito alinhado com o topo da janela
const odometro = "[...document.querySelectorAll('.beneficio .odometro__coluna')].map(col => { const r = col.getBoundingClientRect(); const d = [...col.querySelectorAll('.odometro__fita > span')].find(sp => Math.abs(sp.getBoundingClientRect().top - r.top) < 2); return d ? d.textContent : '?'; }).join('')";
const emCena = "document.querySelector('[data-constelacao]').classList.contains('em-cena')";

(async () => {
  const b = await launch(9381);
  const { send, evaluate, on } = b;
  const erros = [];
  on(m => {
    if (m.method === 'Runtime.exceptionThrown') erros.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text);
    if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') erros.push(m.params.args.map(a => a.value || a.description).join(' '));
  });
  await send('Page.enable'); await send('Runtime.enable');
  const relato = {};
  // QA_SO_FINAL=1: pula as fotos e os vídeos por largura (só duração, pausa, repetição e quadro final)
  for (const [w, h, dpr] of process.env.QA_SO_FINAL ? [] : TELAS) {
    await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: dpr, mobile: w < 1024 });
    await send('Page.navigate', { url: URL_ });
    await sleep(150);
    await evaluate(centraliza);
    // espera a entrada existir (na primeira navegação o navegador ainda está frio) e o observador do JS ver o hero (depois
    // disso ele não tira mais a classe da cena)
    for (let i = 0; i < 40; i++) { if (await evaluate("(document.querySelector('[data-constelacao]')?.getAnimations({ subtree: true }).length || 0) >= 10")) break; await sleep(25); }
    await sleep(150);
    const r = { instantes: {} };
    r.animacoes = await evaluate(prepara);
    await evaluate(congela(0));
    const clip = await recorte(evaluate, w < 600 ? 18 : 40);
    for (const t of INSTANTES) {
      await evaluate(congela(t));
      r.instantes[t] = { ...(await evaluate(mede)), valor: await evaluate(odometro) };
      await screenshot(send, path.join(OUT, `${w}-t${String(t).replace('.', '_')}.jpg`), { quality: 88, clip });
    }
    const lista = INSTANTES.map(t => path.join(OUT, `${w}-t${String(t).replace('.', '_')}.jpg`));
    const lado = w < 600 ? 300 : 360;
    execFileSync('ffmpeg', ['-v', 'error', '-y', ...lista.flatMap(f => ['-i', f]), '-filter_complex', lista.map((_, i) => `[${i}:v]scale=${lado}:-2[v${i}]`).join(';') + ';' + lista.map((_, i) => `[v${i}]`).join('') + `xstack=inputs=${lista.length}:layout=${grade(lista.length, 5)}:fill=white`, '-frames:v', '1', path.join(OUT, `${w}-folha.jpg`)]);
    if (VIDEO && (w === 1440 || w === 390)) {
      const dir = path.join(OUT, 'quadros-' + w); fs.mkdirSync(dir, { recursive: true });
      const FPS = 30, FIM = ENTRADA + CENA, PARADO = 1;
      const n = Math.ceil((FIM + PARADO) * FPS);
      for (let q = 0; q < n; q++) {
        await evaluate(congela(Math.min(FIM, q / FPS)));
        await screenshot(send, path.join(dir, String(q).padStart(3, '0') + '.jpg'), { quality: 90, clip });
      }
      execFileSync('ffmpeg', ['-v', 'error', '-y', '-framerate', String(FPS), '-i', path.join(dir, '%03d.jpg'), '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2,format=yuv420p', '-c:v', 'libx264', '-crf', '18', '-movflags', '+faststart', path.join(OUT, `cena-${w}.mp4`)]);
      fs.readdirSync(dir).forEach(f => fs.unlinkSync(path.join(dir, f))); fs.rmdirSync(dir);
    }
    relato[w] = r;
  }

  // duração real, sem congelar: da primeira pintura até a última animação do hero terminar
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: URL_ });
  await sleep(200);
  relato.duracao = await evaluate(`new Promise(r => {
    const c = document.querySelector('[data-constelacao]');
    let viuCena = false, cenaEm = 0;
    const olha = () => {
      const anims = c.getAnimations({ subtree: true });
      if (c.classList.contains('em-cena') && !viuCena) { viuCena = true; cenaEm = performance.now(); }
      if (viuCena && anims.every(a => a.playState === 'finished')) {
        const fcp = (performance.getEntriesByName('first-contentful-paint')[0] || { startTime: 0 }).startTime;
        const infinitas = anims.filter(a => a.effect.getTiming().iterations === Infinity).length;
        return r({ fimMs: Math.round(performance.now()), primeiraPinturaMs: Math.round(fcp), cenaLigouMsDepoisDaPintura: Math.round(cenaEm - fcp), movimentoMs: Math.round(performance.now() - fcp), animacoesInfinitas: infinitas, animacoes: anims.length });
      }
      if (performance.now() > 15000) return r({ erro: 'não terminou em 15 s', estados: [...new Set(anims.map(a => a.animationName + ':' + a.playState))] });
      setTimeout(olha, 25);
    };
    olha();
  })`);

  // pausa com a aba oculta (no meio da cena), repetição fora da tela e de volta
  await send('Page.navigate', { url: URL_ });
  for (let i = 0; i < 40; i++) { await sleep(100); if (await evaluate(emCena)) break; }
  await sleep(1200);
  relato.abaOculta = await evaluate(`(() => {
    Object.defineProperty(document, 'hidden', { value: true, configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
    const c = document.querySelector('[data-constelacao]');
    const pausada = c.classList.contains('pausada');
    const anim = () => c.querySelector('.caneta').getAnimations()[0];
    return new Promise(r => requestAnimationFrame(() => requestAnimationFrame(() => {
      const estados = [...new Set(c.getAnimations({ subtree: true }).map(a => a.playState))];
      const t1 = anim().currentTime;
      setTimeout(() => {
        const t2 = anim().currentTime;
        Object.defineProperty(document, 'hidden', { value: false, configurable: true });
        document.dispatchEvent(new Event('visibilitychange'));
        setTimeout(() => {
          const t3 = anim().currentTime;
          r({ pausada, estados, parado: t1 === t2, voltou: !c.classList.contains('pausada'), andaDeNovo: t3 !== t2, continuaDeOndeParou: t3 - t2 < 600 });
        }, 300);
      }, 400);
    })));
  })()`);
  await sleep(4500);
  relato.terminouParado = await evaluate("document.querySelector('[data-constelacao]').getAnimations({ subtree: true }).every(a => a.playState === 'finished')");
  await evaluate("scrollTo({ top: document.querySelector('#pj').offsetTop, behavior: 'instant' })"); await sleep(500);
  relato.foraDaTela = await evaluate("({ armada: document.querySelector('[data-constelacao]').classList.contains('armada'), emCena: document.querySelector('[data-constelacao]').classList.contains('em-cena') })");
  await evaluate('scrollTo({ top: 0, behavior: "instant" })'); await sleep(600);
  const logo = await evaluate(emCena);
  await sleep(1400);
  relato.deVolta = { emCenaLogoNaVolta: logo, emCenaDepoisDaEntrada: await evaluate(emCena), cenaDoComeco: await evaluate("(() => { const a = document.querySelector('.caneta').getAnimations()[0]; return a ? Math.round(a.currentTime) : null; })()") };

  // quadro final sem animação: movimento reduzido e sem JS
  for (const [w, h, dpr] of [[1440, 900, 1], [390, 844, 2], [320, 640, 2]]) {
    await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: dpr, mobile: w < 1024 });
    await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
    await send('Page.navigate', { url: URL_ }); await sleep(1500); await evaluate(centraliza); await sleep(300);
    relato['reduzido-' + w] = { ...(await evaluate(mede)), animacoesRodando: await evaluate("document.querySelector('[data-constelacao]').getAnimations({ subtree: true }).filter(a => a.playState === 'running').length"), credito: await evaluate(odometro) };
    await screenshot(send, path.join(OUT, `${w}-estatico-reduzido.jpg`), { quality: 88, clip: await recorte(evaluate, w < 600 ? 18 : 40) });
    await send('Emulation.setEmulatedMedia', { features: [] });
    await send('Emulation.setScriptExecutionDisabled', { value: true });
    await send('Page.navigate', { url: URL_ }); await sleep(2600);
    relato['sem-js-' + w] = await evaluate(mede).catch(e => ({ erro: String(e).slice(0, 120) }));
    await screenshot(send, path.join(OUT, `${w}-estatico-sem-js.jpg`), { quality: 86 });
    await send('Emulation.setScriptExecutionDisabled', { value: false });
  }
  fs.writeFileSync(path.join(OUT, process.env.QA_SO_FINAL ? 'resultado-final.json' : 'resultado.json'), JSON.stringify({ relato, erros }, null, 1));
  console.log(JSON.stringify({ relato, erros }, null, 1));
  b.close();
})().catch(e => { console.error(e); process.exit(1); });

function grade(n, colunas) {
  // grade de "colunas" colunas; alturas iguais (mesmo recorte)
  const pos = [];
  for (let i = 0; i < n; i++) {
    const col = i % colunas, lin = Math.floor(i / colunas);
    pos.push((col ? Array.from({ length: col }, (_, k) => 'w' + k).join('+') : '0') + '_' + (lin ? Array.from({ length: lin }, (_, k) => 'h' + (k * colunas)).join('+') : '0'));
  }
  return pos.join('|');
}
