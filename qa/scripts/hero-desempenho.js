// Mede o custo da animação do hero no navegador e soma o tempo da thread principal (tarefas, estilo, layout, pintura).
// CPU desacelerada 4× para simular um celular intermediário. Resultados em ms por segundo (quanto menor, mais folga para
// 60 quadros/s). v0.8: a cena toca uma vez, então são duas janelas: "cena" (do .em-cena ligar até o quadro final, 3,7 s)
// e "parado" (3 s depois do quadro final, quando nada do hero se mexe mais).
// Uso: node qa/scripts/com-servidor.js qa/scripts/hero-desempenho.js <rotulo>   (ex.: antes, depois)
// Para medir outra versão já servida: QA_URL=http://localhost:<porta>/ node qa/scripts/hero-desempenho.js <rotulo>
const fs = require('fs');
const path = require('path');
const { launch, sleep } = require('../fase-1-auditoria/scripts/cdp');

const URL_ = (process.env.QA_URL || 'http://localhost:4173/') + '?intro=0';
const ROTULO = process.argv[2] || 'medicao';
const OUT = path.join(__dirname, '..', process.env.QA_SAIDA || 'preview-v0.8', 'desempenho');
const CENA = 3700;
const TELAS = [[1440, 900, 1], [390, 844, 2]].filter(([w]) => !process.env.QA_TELAS || process.env.QA_TELAS.split(',').includes(String(w)));
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const b = await launch(9385);
  const { send, evaluate, on } = b;
  let eventos = [];
  let fim = null;
  on(m => {
    if (m.method === 'Tracing.dataCollected') eventos.push(...m.params.value);
    if (m.method === 'Tracing.tracingComplete' && fim) fim();
  });
  await send('Page.enable'); await send('Runtime.enable');
  const relato = { rotulo: ROTULO, cpu: '4x' };
  for (const [w, h, dpr] of TELAS) {
    await send('Emulation.setCPUThrottlingRate', { rate: 1 });
    await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: dpr, mobile: w < 1024 });
    await send('Page.navigate', { url: URL_ });
    await sleep(300);
    // diagnóstico: CSS extra (ex.: QA_CSS='.constelacao{display:none}' mede a página sem o hero)
    if (process.env.QA_CSS) await evaluate(`document.head.insertAdjacentHTML('beforeend', ${JSON.stringify('<style>' + process.env.QA_CSS + '</style>')})`);
    await evaluate("(() => { const r = document.querySelector('[data-constelacao]').getBoundingClientRect(); scrollTo({ top: Math.max(0, r.top + scrollY - (innerHeight - r.height) / 2), behavior: 'instant' }); })()");
    await send('Emulation.setCPUThrottlingRate', { rate: 4 });
    // a janela da cena começa quando .em-cena liga; com o hero escondido (QA_CSS), no mesmo instante (1,15 s depois da navegação)
    for (let i = 0; i < 150; i++) { await sleep(20); if (await evaluate("(() => { const c = document.querySelector('[data-constelacao]'); return c.classList.contains('em-cena') || (getComputedStyle(c).display === 'none' && performance.now() > 1150); })()")) break; }
    relato[w] = {};
    for (const [janela, espera, dura] of [['cena', 0, CENA], ['parado', 1000, 3000]]) {
    await sleep(espera);
    const JANELA = dura;
    eventos = [];
    await send('Tracing.start', { categories: 'devtools.timeline,disabled-by-default-devtools.timeline,disabled-by-default-devtools.timeline.frame,toplevel,cc,viz', transferMode: 'ReportEvents' });
    await sleep(JANELA);
    await new Promise(r => { fim = r; send('Tracing.end'); });
    fim = null;

    // threads do renderizador da página
    const nomes = new Map();
    eventos.filter(e => e.ph === 'M' && e.name === 'thread_name').forEach(e => nomes.set(e.pid + ':' + e.tid, e.args.name));
    const principal = new Set([...nomes].filter(([, n]) => n === 'CrRendererMain').map(([k]) => k));
    const daPrincipal = e => principal.has(e.pid + ':' + e.tid);
    const raster = new Set([...nomes].filter(([, n]) => /CompositorTileWorker|RasterWorker/.test(n)).map(([k]) => k));
    // soma a união dos intervalos (eventos aninhados não contam duas vezes)
    const soma = (filtro) => {
      const iv = eventos.filter(e => e.ph === 'X' && e.dur && filtro(e)).map(e => [e.ts, e.ts + e.dur]).sort((a, c) => a[0] - c[0]);
      let total = 0, ini = -1, fimIv = -1;
      for (const [a, c] of iv) { if (a > fimIv) { if (fimIv > ini) total += fimIv - ini; ini = a; fimIv = c; } else if (c > fimIv) fimIv = c; }
      if (fimIv > ini) total += fimIv - ini;
      return total / 1000;
    };
    if (process.env.DEBUG_TRACE) {
      console.log([...new Set(nomes.values())].join(', '));
      const top = {}; eventos.filter(e => e.ph === 'X' && daPrincipal(e)).forEach(e => { top[e.name] = (top[e.name] || 0) + (e.dur || 0) / 1000; });
      console.log(Object.entries(top).sort((a, c) => c[1] - a[1]).slice(0, 25).map(([n, v]) => n + ' ' + v.toFixed(0)).join(' | '));
      const rt = {}; eventos.filter(e => e.ph === 'X' && !daPrincipal(e)).forEach(e => { const k = nomes.get(e.pid + ':' + e.tid) + ' / ' + e.name; rt[k] = (rt[k] || 0) + (e.dur || 0) / 1000; });
      console.log(Object.entries(rt).sort((a, c) => c[1] - a[1]).slice(0, 25).map(([n, v]) => n + ' ' + v.toFixed(0)).join(' | '));
    }
    const porSegundo = ms => +(ms / (JANELA / 1000)).toFixed(1);
    const quadros = eventos.filter(e => e.name === 'BeginFrame' && principal.has(e.pid + ':' + e.tid)).length;
    relato[w][janela] = {
      janelaMs: JANELA,
      threadPrincipal_msPorS: porSegundo(soma(daPrincipal)),
      estilo_msPorS: porSegundo(soma(e => daPrincipal(e) && e.name === 'UpdateLayoutTree')),
      layout_msPorS: porSegundo(soma(e => daPrincipal(e) && e.name === 'Layout')),
      pintura_msPorS: porSegundo(soma(e => daPrincipal(e) && (e.name === 'Paint' || e.name === 'PrePaint'))),
      rasterizacao_msPorS: porSegundo(soma(e => raster.has(e.pid + ':' + e.tid) && /RasterTask|TaskGraphRunner::RunTask/.test(e.name))),
      pinturas: eventos.filter(e => e.ph === 'X' && daPrincipal(e) && e.name === 'Paint').length,
      quadrosNaPrincipal: quadros
    };
    }
    await send('Emulation.setCPUThrottlingRate', { rate: 1 });
  }
  fs.writeFileSync(path.join(OUT, ROTULO + '.json'), JSON.stringify(relato, null, 1));
  console.log(JSON.stringify(relato, null, 1));
  b.close();
})().catch(e => { console.error(e); process.exit(1); });
