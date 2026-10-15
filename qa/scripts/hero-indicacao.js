// v0.7: confere a demonstração da indicação no hero (constelação): convite → contrato → moedas de crédito.
// Para cada largura: espera o ciclo ligar, congela as animações do ciclo e fotografa instantes do roteiro;
// mede sobreposição entre etiquetas, etiquetas × formandos (exceto o próprio) e etiquetas fora da caixa do hero, e os
// objetos que viajam × formandos da rede, × símbolo e × etiquetas (o convite e as moedas podem passar por trás de
// "Você" e do colega, de onde saem e aonde chegam);
// grava um ciclo em MP4 e uma folha de contato. Também confere a composição estática (movimento reduzido e sem JS),
// a pausa com a aba oculta e o reinício quando o hero sai da tela e volta.
// Uso: node qa/scripts/com-servidor.js qa/scripts/hero-indicacao.js [--video]
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { launch, screenshot, sleep } = require('../fase-1-auditoria/scripts/cdp');

const URL_ = (process.env.QA_URL || 'http://localhost:4173/') + '?intro=0';
const OUT = path.join(__dirname, '..', 'preview-v0.7', 'hero-indicacao');
const VIDEO = process.argv.includes('--video');
const TELAS = [[1440, 900, 1], [1024, 768, 1], [390, 844, 2], [320, 640, 2]];
const INSTANTES = [0.5, 0.95, 1.8, 2.6, 3.3, 3.9, 4.8, 5.4, 6.2, 7.2, 8.5, 10.5];
const CICLO = 12;
fs.mkdirSync(OUT, { recursive: true });

// congela o ciclo em t segundos (a flutuação fica parada onde estava)
const congela = t => `(() => {
  const c = document.querySelector('[data-constelacao]');
  const anims = c.getAnimations({ subtree: true }).filter(a => a.effect && a.effect.getTiming().iterations === Infinity && a.animationName !== 'flutua');
  c.getAnimations({ subtree: true }).forEach(a => a.pause());
  anims.forEach(a => { a.currentTime = ${t * 1000}; });
  return new Promise(r => requestAnimationFrame(() => requestAnimationFrame(() => r(anims.length))));
})()`;

// etiquetas visíveis e o que elas encostam
const mede = `(() => {
  const c = document.querySelector('[data-constelacao]');
  const caixa = c.closest('.caixa').getBoundingClientRect();
  const vis = el => { let o = 1, e = el; while (e && e !== c) { const s = getComputedStyle(e); if (s.display === 'none' || s.visibility === 'hidden') return 0; o *= +s.opacity; e = e.parentElement; } return o; };
  const ret = el => { const r = el.getBoundingClientRect(); return { x: r.left, y: r.top, r: r.right, b: r.bottom }; };
  const cruza = (a, b) => Math.max(0, Math.min(a.r, b.r) - Math.max(a.x, b.x)) * Math.max(0, Math.min(a.b, b.b) - Math.max(a.y, b.y));
  const etiquetas = [...c.querySelectorAll('.etiqueta, .beneficio')].map(el => ({ nome: el.className.baseVal || el.className, dono: el.closest('.pessoa--voce') ? 'voce' : 'colega', o: vis(el), ret: ret(el), fonte: Math.min(...[...el.querySelectorAll('span, strong')].filter(t => t.textContent.trim()).map(t => parseFloat(getComputedStyle(t).fontSize))) })).filter(e => e.o > 0.05);
  const pessoas = [...c.querySelectorAll('.pessoa')].filter(p => getComputedStyle(p).display !== 'none').map(p => ({ nome: p.classList[1].replace('pessoa--', '') + (p.classList[2] ? '-' + p.classList[2].replace('pessoa--', '') : ''), ret: ret(p.querySelector('.pessoa__aluno')) }));
  // objetos que viajam (só o desenho, sem o halo) e o símbolo
  const objetos = [...c.querySelectorAll('.viajante__icone')].map(el => ({ nome: el.parentElement.classList[1].replace('viajante--', '') + (el.parentElement.classList[2] ? '-' + el.parentElement.classList[2].replace('viajante--', '') : ''), o: vis(el), ret: ret(el.querySelector('svg')) })).filter(e => e.o > 0.05);
  const simbolo = ret(c.querySelector('.constelacao__simbolo'));
  const problemas = [];
  etiquetas.forEach((a, i) => {
    etiquetas.slice(i + 1).forEach(b => { if (cruza(a.ret, b.ret) > 4) problemas.push(a.nome + ' × ' + b.nome); });
    pessoas.forEach(p => { if (!p.nome.startsWith(a.dono) && cruza(a.ret, p.ret) > 4) problemas.push(a.nome + ' × formando ' + p.nome); });
    if (a.ret.x < caixa.left + 2 || a.ret.r > caixa.right - 2) problemas.push(a.nome + ' fora da caixa');
    if (a.fonte < 13) problemas.push(a.nome + ' com fonte de ' + a.fonte + ' px');
  });
  objetos.forEach(o => {
    pessoas.forEach(p => { if (!/^(voce|colega)/.test(p.nome) && cruza(o.ret, p.ret) > 4) problemas.push('objeto ' + o.nome + ' × formando ' + p.nome); });
    if (cruza(o.ret, simbolo) > 4) problemas.push('objeto ' + o.nome + ' × símbolo');
    etiquetas.forEach(e => { if (cruza(o.ret, e.ret) > 4) problemas.push('objeto ' + o.nome + ' × ' + e.nome); });
  });
  return { etiquetas: etiquetas.map(e => e.nome.split(' ')[0] + (e.nome.includes('--') ? '--' + e.nome.split('--')[1] : '') + ' ' + e.o.toFixed(2)), objetos: objetos.map(o => o.nome + ' ' + o.o.toFixed(2)), problemas, rolagemLateral: document.documentElement.scrollWidth > innerWidth };
})()`;

const recorte = async (evaluate, margem) => evaluate(`(() => { const r = document.querySelector('[data-constelacao]').getBoundingClientRect(); const m = ${margem}; return { x: Math.max(0, r.left + scrollX - m), y: Math.max(0, r.top + scrollY - m), width: Math.min(innerWidth, r.width + 2 * m), height: r.height + 2 * m, scale: 1 }; })()`);
const centraliza = `(() => { const r = document.querySelector('[data-constelacao]').getBoundingClientRect(); scrollTo({ top: Math.max(0, r.top + scrollY - (innerHeight - r.height) / 2), behavior: 'instant' }); })()`;

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
  for (const [w, h, dpr] of TELAS) {
    await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: dpr, mobile: w < 1024 });
    await send('Page.navigate', { url: URL_ });
    await sleep(800);
    await evaluate(centraliza);
    let ligou = false;
    for (let i = 0; i < 40 && !ligou; i++) { await sleep(150); ligou = await evaluate("document.querySelector('[data-constelacao]').classList.contains('em-ciclo')"); }
    await sleep(300);
    const r = { ligou, instantes: {} };
    r.animacoesDoCiclo = await evaluate(congela(0));
    const clip = await recorte(evaluate, w < 600 ? 18 : 40);
    for (const t of INSTANTES) {
      await evaluate(congela(t));
      r.instantes[t] = await evaluate(mede);
      await screenshot(send, path.join(OUT, `${w}-t${String(t).replace('.', '_')}.jpg`), { quality: 86, clip });
    }
    // folha de contato
    const lista = INSTANTES.map(t => path.join(OUT, `${w}-t${String(t).replace('.', '_')}.jpg`));
    execFileSync('ffmpeg', ['-v', 'error', '-y', ...lista.flatMap(f => ['-i', f]), '-filter_complex', lista.map((_, i) => `[${i}:v]scale=${w < 600 ? 360 : 420}:-2[v${i}]`).join(';') + ';' + lista.map((_, i) => `[v${i}]`).join('') + `xstack=inputs=${lista.length}:layout=${xstack(lista.length, w < 600 ? 360 : 420)}:fill=white`, '-frames:v', '1', path.join(OUT, `${w}-folha.jpg`)]);
    if (VIDEO && (w === 1440 || w === 390)) {
      const dir = path.join(OUT, 'quadros-' + w); fs.mkdirSync(dir, { recursive: true });
      const FPS = 20;
      for (let q = 0; q < CICLO * FPS; q++) {
        await evaluate(congela(q / FPS));
        await screenshot(send, path.join(dir, String(q).padStart(3, '0') + '.jpg'), { quality: 88, clip });
      }
      execFileSync('ffmpeg', ['-v', 'error', '-y', '-framerate', String(FPS), '-i', path.join(dir, '%03d.jpg'), '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2,format=yuv420p', '-c:v', 'libx264', '-crf', '20', '-movflags', '+faststart', path.join(OUT, `ciclo-${w}.mp4`)]);
      fs.readdirSync(dir).forEach(f => fs.unlinkSync(path.join(dir, f))); fs.rmdirSync(dir);
    }
    relato[w] = r;
  }

  // pausa com a aba oculta, reinício fora da tela, composição estática
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: URL_ }); await sleep(3000);
  relato.abaOculta = await evaluate(`(() => {
    Object.defineProperty(document, 'hidden', { value: true, configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
    const c = document.querySelector('[data-constelacao]');
    const pausada = c.classList.contains('pausada');
    const anim = () => c.querySelector('.beneficio').getAnimations()[0];
    return new Promise(r => requestAnimationFrame(() => requestAnimationFrame(() => {
      const estados = [...new Set(c.getAnimations({ subtree: true }).map(a => a.playState))];
      const t1 = anim().currentTime;
      setTimeout(() => {
        const t2 = anim().currentTime;
        Object.defineProperty(document, 'hidden', { value: false, configurable: true });
        document.dispatchEvent(new Event('visibilitychange'));
        // a animação roda no compositor: ao sair da pausa fica "pendente" até o compositor confirmar; mede 300 ms depois
        setTimeout(() => {
          const t3 = anim().currentTime;
          r({ pausada, estados, parado: t1 === t2, voltou: !c.classList.contains('pausada'), andaDeNovo: t3 !== t2, continuaDeOndeParou: t3 - t2 < 600 });
        }, 300);
      }, 400);
    })));
  })()`);
  await evaluate("scrollTo({ top: document.querySelector('#pj').offsetTop, behavior: 'instant' })"); await sleep(500);
  relato.foraDaTela = await evaluate("({ armada: document.querySelector('[data-constelacao]').classList.contains('armada'), emCiclo: document.querySelector('[data-constelacao]').classList.contains('em-ciclo') })");
  await evaluate('scrollTo({ top: 0, behavior: "instant" })'); await sleep(600);
  const logo = await evaluate("document.querySelector('[data-constelacao]').classList.contains('em-ciclo')");
  await sleep(2000);
  relato.deVolta = { emCicloLogoNaVolta: logo, emCicloDepoisDaEntrada: await evaluate("document.querySelector('[data-constelacao]').classList.contains('em-ciclo')") };

  for (const [w, h, dpr] of [[1440, 900, 1], [390, 844, 2]]) {
    await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: dpr, mobile: w < 1024 });
    await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
    await send('Page.navigate', { url: URL_ }); await sleep(1500); await evaluate(centraliza); await sleep(300);
    relato['reduzido-' + w] = { ...(await evaluate(mede)), animacoesRodando: await evaluate("document.querySelector('[data-constelacao]').getAnimations({ subtree: true }).filter(a => a.playState === 'running').length") };
    await screenshot(send, path.join(OUT, `${w}-estatico-reduzido.jpg`), { quality: 86, clip: await recorte(evaluate, w < 600 ? 18 : 40) });
    await send('Emulation.setEmulatedMedia', { features: [] });
    await send('Emulation.setScriptExecutionDisabled', { value: true });
    await send('Page.navigate', { url: URL_ }); await sleep(2600);
    await screenshot(send, path.join(OUT, `${w}-estatico-sem-js.jpg`), { quality: 86 });
    await send('Emulation.setScriptExecutionDisabled', { value: false });
  }
  fs.writeFileSync(path.join(OUT, 'resultado.json'), JSON.stringify({ relato, erros }, null, 1));
  console.log(JSON.stringify({ relato, erros }, null, 1));
  b.close();
})().catch(e => { console.error(e); process.exit(1); });

function xstack(n, largura) {
  // grade de 3 colunas; alturas iguais (mesmo recorte)
  const pos = [];
  for (let i = 0; i < n; i++) {
    const col = i % 3, lin = Math.floor(i / 3);
    pos.push((col ? Array.from({ length: col }, (_, k) => 'w' + k).join('+') : '0') + '_' + (lin ? Array.from({ length: lin }, (_, k) => 'h' + (k * 3)).join('+') : '0'));
  }
  return pos.join('|');
}
