// Gera a cena da indicação no hero (constelação) a partir de um roteiro em segundos:
//   - em src/assets/liga.css, entre /* roteiro-hero:inicio */ e /* roteiro-hero:fim */: os @keyframes da cena (tempos em %
//     da cena), o caminho da ponta da caneta (amostrado nas curvas do SVG com a mesma curva de tempo do traço, para os dois
//     andarem juntos) e um @keyframes por segmento do traço e da luz;
//   - em src/landing.html, entre os marcadores roteiro-hero:segmentos, roteiro-hero:luz e roteiro-hero:setas: os segmentos
//     do traço dourado, os da luz que percorre o S e as setas da composição estática.
// As curvas do traço vêm dos <path id="rota-…"> do próprio HTML; a luz anda pela linha central do traço do símbolo oficial
// (#simbolo), corrigida aqui contra o contorno dele.
// Desempenho: tudo o que se move na cena é transform ou opacity em HTML, que a GPU anima sem a thread principal. O traço e
// a luz são segmentos curtos que crescem (scaleX). Cada segmento tem o seu @keyframes, do tamanho da cena inteira: todos
// começam quando a cena liga e terminam juntos no quadro final. Começos ou fins espalhados no tempo (atrasos ou durações
// próprias) obrigam a thread principal a trabalhar a cada início e a cada fim, quase todo quadro.
// A cena toca uma vez e para no quadro final (que é a própria composição estática). Com a entrada (≈ 1,1 s), tudo termina
// em menos de 5 s, então não precisa de botão de pausa (WCAG 2.2.2).
// Uso: node build/gera-roteiro.mjs
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const arqHtml = path.join(raiz, 'src', 'landing.html');
const arqCss = path.join(raiz, 'src', 'assets', 'liga.css');

const CENA = 3.7; // s (o mesmo --cena do CSS)
const SEGMENTO = 12; // unidades da arte por segmento do traço (curto o bastante para a curva parecer contínua)
const SEGMENTO_LUZ = 7; // unidades por segmento da luz (nos laços do S, a corda se afasta da curva 0,2 unidade)

// curvas de tempo: uma família só, sem mola e sem passar do ponto
const SAI = 'cubic-bezier(.16, 1, .3, 1)'; // entradas (o mesmo --ease-out da página)
const SUAVE = 'cubic-bezier(.45, 0, .55, 1)'; // trocas de estado e a luz no S
const ANDA = [0.65, 0, 0.35, 1]; // o traço e a caneta: sai devagar, anda e pousa com calma
const LUZ = [0.45, 0, 0.55, 1]; // a luz no S (a mesma SUAVE)

// TRECHOS do traço: [rota, início, fim] em segundos. O traço de cada trecho se desenha nesse intervalo e a ponta da
// caneta anda junto. Entre um trecho e outro a caneta fica escondida (debaixo do colega ou dentro do símbolo).
const TRECHOS = [
  ['indica', 0.15, 1.05], // você → colega, por baixo
  ['valida', 1.4, 1.9], // colega → ponta direita do símbolo
  ['volta', 2.6, 3.1] // ponta esquerda do símbolo → você
];
const LUZ_TEMPO = [1.88, 2.68]; // a luz percorre o S

// a linha central do traço do símbolo (unidades do viewBox 0 0 93,36 93,15), da ponta de cima à de baixo: retas e os dois
// laços (centro, raio, ângulo inicial e final em graus). Os laços e a barra do meio são corrigidos contra o contorno.
const CENTRAL_S = [
  ['reta', [76.6, 37], [91.2, 21.85]],
  ['reta', [91.2, 21.85], [71.45, 2]],
  ['reta', [71.45, 2], [50.59, 21]],
  ['arco', [29.9, 25.4], 21.15, -12, -270],
  ['reta', [29.9, 46.55], [64, 46.9], true],
  ['arco', [64, 68.2], 21.3, -90, 168],
  ['reta', [43.17, 72.63], [21.91, 91.15]],
  ['reta', [21.91, 91.15], [2.16, 71.3]],
  ['reta', [2.16, 71.3], [16.76, 56.15]]
];
// o símbolo na arte: 128 unidades de lado, centrado em 0,0 (viewBox 93,36 × 93,15, "meet")
const ESCALA_S = 128 / 93.36;
const naArte = ([x, y]) => ({ x: (x - 46.68) * ESCALA_S, y: (y - 46.575) * ESCALA_S });

// ROTEIRO (só opacity e transform, que a GPU anima sem a thread principal):
// [nome, curva padrão, [[segundos, declarações, curva do trecho seguinte (opcional)], …]]
// Antes do primeiro instante vale o primeiro estado; depois do último, o último (é o quadro final, que fica).
const ROTEIRO = [
  // você acende: o aro dourado mais grosso e a etiqueta dourada
  ['cena-voce-aro', SAI, [[0, 'opacity: 0'], [0.35, 'opacity: 1']]],
  ['cena-voce-etiqueta', SAI, [[0.05, 'opacity: 0'], [0.35, 'opacity: 1']]],

  // o colega fecha contrato: aro dourado, e o crédito dele (com o visto) aparece
  ['cena-colega-aro', SAI, [[0.95, 'opacity: 0'], [1.3, 'opacity: 1']]],
  ['cena-credito-colega', SAI, [[1.1, 'opacity: 0; transform: translateY(6px)'], [1.45, 'opacity: 1; transform: none']]],

  // a luz percorre o S (os segmentos crescem em LUZ_TEMPO) e depois se apaga: o símbolo volta ao dourado oficial
  ['cena-luz', SUAVE, [[1.84, 'opacity: 0'], [1.88, 'opacity: 1'], [2.75, 'opacity: 1'], [3.25, 'opacity: 0']]],

  // o crédito chega em você: o único brilho da cena, o cartão sobe e o valor rola até 200 (odômetro: as fitas de dígitos
  // sobem; a das centenas para no 2, as das dezenas e unidades dão uma volta inteira e param no 0)
  ['cena-voce-brilho', SAI, [[3.0, 'opacity: 0'], [3.3, 'opacity: 1', SUAVE], [3.7, 'opacity: .75']]],
  ['cena-beneficio', SAI, [[3.0, 'opacity: 0; transform: translateY(8px)'], [3.35, 'opacity: 1; transform: none']]],
  ['cena-odometro-2', SAI, [[3.05, 'transform: translateY(0)'], [3.6, 'transform: translateY(-2em)']]],
  ['cena-odometro-10', SAI, [[3.05, 'transform: translateY(0)'], [3.6, 'transform: translateY(-10em)']]],

  // o traço feito assenta: fica um pouco mais apagado no quadro final (o mesmo valor do CSS estático)
  ['cena-tracos', SUAVE, [[3.3, 'opacity: 1'], [3.7, 'opacity: .7']]],

  // a ponta da caneta: some ao entrar no símbolo e reaparece ao sair; nos outros pontos ela passa por baixo de alguém
  ['cena-caneta', 'linear', [[0.12, 'opacity: 0'], [0.15, 'opacity: 1'], [1.86, 'opacity: 1'], [1.94, 'opacity: 0'], [2.6, 'opacity: 0'], [2.66, 'opacity: 1'], [3.1, 'opacity: 1'], [3.12, 'opacity: 0']]]
];

// setas da composição estática: [rota, fração do comprimento]
const SETAS = [['indica', 0.86], ['valida', 0.62], ['volta', 0.72]];

// ---------------------------------------------------------------------------------------------------------------------

const html = await fs.readFile(arqHtml, 'utf8');
const css = await fs.readFile(arqCss, 'utf8');

const rotas = {};
for (const m of html.matchAll(/<path id="rota-(\w+)"[^>]*\sd="([^"]+)"/g)) rotas[m[1]] = curva(m[2]);
for (const [nome] of TRECHOS) if (!rotas[nome]) throw new Error('Rota "' + nome + '" não encontrada em src/landing.html');
const simbolo = html.match(/<symbol id="simbolo"[^>]*><path[^>]*\sd="([^"]+)"/);
if (!simbolo) throw new Error('#simbolo não encontrado em src/landing.html');

const pct = t => num((t / CENA) * 100) + '%';
const cq = u => num(u / 6) + 'cqw'; // 600 unidades = 100cqw
const translada = p => `transform: translate(${cq(p.x)}, ${cq(p.y)})`;
const ease = bezier(...ANDA); // a mesma curva para o traço e a ponta da caneta

// segmentos: cordas da curva; cada um cresce no intervalo [t0, t1] em que o traço passa por ele
const pecas = [];
for (const [rota, ini, fim] of TRECHOS) {
  const r = rotas[rota];
  const n = Math.max(2, Math.round(r.comprimento / SEGMENTO));
  const instante = s => ini + inverte(ease, s) * (fim - ini);
  for (let i = 0; i < n; i++) pecas.push({ classe: 'segmento--' + rota, a: r.em(i / n), b: r.em((i + 1) / n), t0: instante(i / n), t1: instante((i + 1) / n) });
}
const central = linhaCentral(CENTRAL_S, contorno(simbolo[1]));
{
  const easeLuz = bezier(...LUZ);
  const [ini, fim] = LUZ_TEMPO;
  const n = Math.round(central.comprimento * ESCALA_S / SEGMENTO_LUZ);
  const instante = s => ini + inverte(easeLuz, s) * (fim - ini);
  for (let i = 0; i < n; i++) pecas.push({ classe: 'segmento--luz', a: naArte(central.em(i / n)), b: naArte(central.em((i + 1) / n)), t0: instante(i / n), t1: instante((i + 1) / n) });
}
// cada segmento: um @keyframes do tamanho da cena (parado em scaleX(0) até t0, cresce em linha reta até t1, fica inteiro)
pecas.forEach((p, i) => { p.nome = 'seg-' + i; });
const pc = t => num((t / CENA) * 100, 4) + '%';
const span = p => `<span class="segmento ${p.classe}" style="--x:${num(p.a.x, 2)};--y:${num(p.a.y, 2)};--c:${num(dist(p.a, p.b), 2)};--a:${num((Math.atan2(p.b.y - p.a.y, p.b.x - p.a.x) * 180) / Math.PI, 1)}deg;--k:${p.nome}"></span>`;

const blocos = [];
blocos.push(`/* roteiro-hero:inicio (gerado por build/gera-roteiro.mjs a partir do roteiro em segundos; não editar à mão) */`);
for (const [nome, padrao, quadros] of ROTEIRO) blocos.push(keyframes(nome, padrao, quadros));
blocos.push(caneta());
for (const p of pecas) blocos.push(`@keyframes ${p.nome} { 0%, ${pc(p.t0)} { transform: scaleX(0); } ${pc(p.t1)}, 100% { transform: none; } }`);
blocos.push('/* roteiro-hero:fim */');

const setas = SETAS.map(([rota, s]) => {
  const r = rotas[rota];
  const p = r.em(s);
  return `<path d="M-6-6L0 0-6 6" transform="translate(${num(p.x, 1)} ${num(p.y, 1)}) rotate(${num(r.angulo(s), 1)})"/>`;
});

let novoHtml = troca(html, 'roteiro-hero:segmentos', pecas.filter(p => p.classe !== 'segmento--luz').map(span).join(''), '<!-- ', ' -->');
novoHtml = troca(novoHtml, 'roteiro-hero:luz', pecas.filter(p => p.classe === 'segmento--luz').map(span).join(''), '<!-- ', ' -->');
novoHtml = troca(novoHtml, 'roteiro-hero:setas', '<g class="setas">' + setas.join('') + '</g>', '<!-- ', ' -->');
const reCss = /\/\* roteiro-hero:inicio[\s\S]*?\/\* roteiro-hero:fim \*\//;
if (!reCss.test(css)) throw new Error('Marcadores /* roteiro-hero:inicio */ … /* roteiro-hero:fim */ não encontrados em liga.css');
await fs.writeFile(arqHtml, novoHtml);
await fs.writeFile(arqCss, css.replace(reCss, blocos.join('\n')));
const fimDaCena = Math.max(...ROTEIRO.flatMap(([, , q]) => q.map(([t]) => t)), ...pecas.map(p => p.t1));
const nLuz = pecas.filter(p => p.classe === 'segmento--luz').length;
console.log(`roteiro do hero: ${ROTEIRO.length + 2} @keyframes, ${pecas.length - nLuz} segmentos de traço e ${nLuz} de luz ` +
  `(um @keyframes cada, todos do tamanho da cena); cena de ${CENA} s (último quadro em ${num(fimDaCena)} s); linha central do S: ` +
  `${central.corrigidos} pontos corrigidos, desvio máximo ${num(central.desvio, 2)} un.; comprimentos: ` +
  Object.entries(rotas).map(([k, r]) => k + ' ' + Math.round(r.comprimento)).join(', ') + ', S ' + Math.round(central.comprimento * ESCALA_S));
if (fimDaCena > CENA + 1e-9) throw new Error('O roteiro passa do fim da cena (' + fimDaCena + ' s > ' + CENA + ' s)');

// ---------------------------------------------------------------------------------------------------------------------

function keyframes(nome, padrao, quadros) {
  const q = quadros.map(([t, decl, tf]) => [t, decl, tf || padrao]);
  if (q[0][0] > 0) q.unshift([0, q[0][1], padrao]);
  if (q[q.length - 1][0] < CENA) q.push([CENA, q[q.length - 1][1], padrao]);
  return `@keyframes ${nome} { ` + q.map(([t, decl, tf]) => `${pct(t)} { ${decl}; animation-timing-function: ${tf}; }`).join(' ') + ' }';
}

// a ponta da caneta anda por cada trecho com a mesma curva do traço (amostrada em 24 pontos) e espera, parada, entre um
// trecho e outro; o salto de um trecho ao seguinte acontece escondido
function caneta() {
  const N = 24;
  const linhas = [];
  TRECHOS.forEach(([rota, ini, fim], k) => {
    const r = rotas[rota];
    const espera = k === 0 ? `0%, ${pct(ini)}` : pct(ini);
    linhas.push(`${espera} { ${translada(r.em(0))}; }`);
    for (let i = 1; i < N; i++) linhas.push(`${pct(ini + (i / N) * (fim - ini))} { ${translada(r.em(ease(i / N)))}; }`);
    const proximo = TRECHOS[k + 1];
    linhas.push(proximo ? `${pct(fim)}, ${pct(proximo[1] - 0.001)} { ${translada(r.em(1))}; }` : `${pct(fim)}, 100% { ${translada(r.em(1))}; }`);
  });
  return `@keyframes cena-caneta-anda { ${linhas.join(' ')} }`;
}

function troca(texto, marca, conteudo, abre, fecha) {
  const re = new RegExp(abre.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + marca + ':inicio' + '[\\s\\S]*?' + marca + ':fim' + fecha.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  if (!re.test(texto)) throw new Error('Marcadores ' + marca + ' não encontrados em src/landing.html');
  return texto.replace(re, `${abre}${marca}:inicio${fecha}${conteudo}${abre}${marca}:fim${fecha}`);
}

// curva cúbica "Mx yCx1 y1 x2 y2 x y": ponto e direção por fração do comprimento
function curva(d) {
  const n = d.match(/-?\d*\.?\d+/g).map(Number);
  if (n.length !== 8) throw new Error('Rota com formato inesperado: ' + d);
  const [x0, y0, x1, y1, x2, y2, x3, y3] = n;
  const pt = t => {
    const a = (1 - t) ** 3, b = 3 * (1 - t) ** 2 * t, c = 3 * (1 - t) * t ** 2, e = t ** 3;
    return { x: a * x0 + b * x1 + c * x2 + e * x3, y: a * y0 + b * y1 + c * y2 + e * y3 };
  };
  const der = t => ({
    x: 3 * (1 - t) ** 2 * (x1 - x0) + 6 * (1 - t) * t * (x2 - x1) + 3 * t ** 2 * (x3 - x2),
    y: 3 * (1 - t) ** 2 * (y1 - y0) + 6 * (1 - t) * t * (y2 - y1) + 3 * t ** 2 * (y3 - y2)
  });
  const AM = 2000;
  const acum = [0];
  let ant = pt(0);
  for (let i = 1; i <= AM; i++) { const p = pt(i / AM); acum.push(acum[i - 1] + dist(p, ant)); ant = p; }
  const L = acum[AM];
  const tDe = s => {
    const alvo = Math.min(1, Math.max(0, s)) * L;
    let lo = 0, hi = AM;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (acum[m] < alvo) lo = m; else hi = m; }
    const f = acum[hi] === acum[lo] ? 0 : (alvo - acum[lo]) / (acum[hi] - acum[lo]);
    return (lo + f) / AM;
  };
  return {
    comprimento: L,
    em: s => pt(tDe(s)),
    angulo: s => { const v = der(tDe(s)); return (Math.atan2(v.y, v.x) * 180) / Math.PI; }
  };
}

// contorno do símbolo (path com m, l, h, v, c, s e z, relativos ou absolutos) como lista de arestas
function contorno(d) {
  const tk = d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e-?\d+)?/g);
  let i = 0, cx = 0, cy = 0, sx = 0, sy = 0, px = 0, py = 0, cmd = '';
  const pts = [], arestas = [];
  const fecha = () => { for (let k = 1; k < pts.length; k++) arestas.push([pts[k - 1], pts[k]]); pts.length = 0; };
  const nu = () => +tk[i++];
  const cub = (x0, y0, x1, y1, x2, y2, x3, y3) => {
    for (let k = 1; k <= 8; k++) { const t = k / 8, a = (1 - t) ** 3, b = 3 * (1 - t) ** 2 * t, c = 3 * (1 - t) * t * t, e = t ** 3; pts.push([a * x0 + b * x1 + c * x2 + e * x3, a * y0 + b * y1 + c * y2 + e * y3]); }
  };
  while (i < tk.length) {
    if (/[a-zA-Z]/.test(tk[i])) cmd = tk[i++];
    const rel = cmd === cmd.toLowerCase(), C = cmd.toUpperCase();
    if (C === 'Z') { pts.push([sx, sy]); cx = sx; cy = sy; fecha(); continue; }
    if (C === 'M') { fecha(); const x = nu(), y = nu(); cx = rel ? cx + x : x; cy = rel ? cy + y : y; sx = cx; sy = cy; pts.push([cx, cy]); cmd = rel ? 'l' : 'L'; px = cx; py = cy; }
    else if (C === 'L') { const x = nu(), y = nu(); cx = rel ? cx + x : x; cy = rel ? cy + y : y; pts.push([cx, cy]); px = cx; py = cy; }
    else if (C === 'H') { const x = nu(); cx = rel ? cx + x : x; pts.push([cx, cy]); px = cx; py = cy; }
    else if (C === 'V') { const y = nu(); cy = rel ? cy + y : y; pts.push([cx, cy]); px = cx; py = cy; }
    else if (C === 'C') { const v = [nu(), nu(), nu(), nu(), nu(), nu()].map((q, k) => q + (rel ? (k % 2 ? cy : cx) : 0)); cub(cx, cy, ...v); px = v[2]; py = v[3]; cx = v[4]; cy = v[5]; }
    else if (C === 'S') { const v = [nu(), nu(), nu(), nu()].map((q, k) => q + (rel ? (k % 2 ? cy : cx) : 0)); cub(cx, cy, 2 * cx - px, 2 * cy - py, ...v); px = v[0]; py = v[1]; cx = v[2]; cy = v[3]; }
    else throw new Error('Comando de path não previsto no símbolo: ' + cmd);
  }
  fecha();
  return arestas;
}

// a linha central do S: amostra as retas e os laços a cada 0,25 unidade; nos laços e na barra, desloca cada ponto para o
// meio do traço (lança a normal para os dois lados até o contorno) e suaviza; devolve o caminho por fração do comprimento
function linhaCentral(partes, arestas) {
  const pts = [];
  for (const p of partes) {
    if (p[0] === 'reta') {
      const [, a, b, corrige] = p;
      const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 0.25));
      for (let k = pts.length ? 1 : 0; k <= n; k++) pts.push({ x: a[0] + ((b[0] - a[0]) * k) / n, y: a[1] + ((b[1] - a[1]) * k) / n, corrige: !!corrige });
    } else {
      const [, c, r, a0, a1] = p;
      const n = Math.ceil((Math.abs(a1 - a0) * Math.PI * r) / 180 / 0.25);
      for (let k = 1; k <= n; k++) { const ang = ((a0 + ((a1 - a0) * k) / n) * Math.PI) / 180; pts.push({ x: c[0] + r * Math.cos(ang), y: c[1] + r * Math.sin(ang), corrige: true }); }
    }
  }
  let corrigidos = 0, desvio = 0;
  const desloc = pts.map((p, k) => {
    if (!p.corrige) return 0;
    const ant = pts[Math.max(0, k - 1)], seg = pts[Math.min(pts.length - 1, k + 1)];
    const tx = seg.x - ant.x, ty = seg.y - ant.y, tl = Math.hypot(tx, ty) || 1;
    const nx = -ty / tl, ny = tx / tl;
    // distância (com sinal) ao contorno ao longo da normal, para cada lado
    const raio = sinal => {
      let melhor = Infinity;
      for (const [[x1, y1], [x2, y2]] of arestas) {
        const dx = x2 - x1, dy = y2 - y1, den = nx * dy - ny * dx;
        if (Math.abs(den) < 1e-9) continue;
        const ox = x1 - p.x, oy = y1 - p.y;
        const lam = (ox * dy - oy * dx) / den, mu = (ox * ny - oy * nx) / den;
        if (mu >= 0 && mu <= 1 && lam * sinal > 0 && Math.abs(lam) < Math.abs(melhor)) melhor = lam;
      }
      return melhor;
    };
    const l1 = raio(1), l2 = raio(-1);
    if (!isFinite(l1) || !isFinite(l2) || l1 - l2 > 6) return 0;
    const m = (l1 + l2) / 2;
    if (Math.abs(m) > 2) return 0;
    corrigidos++;
    p.nx = nx; p.ny = ny;
    return m;
  });
  // suaviza os deslocamentos (média de 9 vizinhos) e aplica
  const suave = desloc.map((_, k) => { let s = 0, n = 0; for (let j = k - 4; j <= k + 4; j++) if (j >= 0 && j < desloc.length && pts[j].corrige) { s += desloc[j]; n++; } return n ? s / n : 0; });
  const final = pts.map((p, k) => { if (!p.corrige || p.nx === undefined) return { x: p.x, y: p.y }; desvio = Math.max(desvio, Math.abs(suave[k])); return { x: p.x + p.nx * suave[k], y: p.y + p.ny * suave[k] }; });
  const acum = [0];
  for (let k = 1; k < final.length; k++) acum.push(acum[k - 1] + dist(final[k], final[k - 1]));
  const L = acum[acum.length - 1];
  return {
    comprimento: L, corrigidos, desvio,
    em: s => {
      const alvo = Math.min(1, Math.max(0, s)) * L;
      let lo = 0, hi = acum.length - 1;
      while (hi - lo > 1) { const m = (lo + hi) >> 1; if (acum[m] < alvo) lo = m; else hi = m; }
      const f = acum[hi] === acum[lo] ? 0 : (alvo - acum[lo]) / (acum[hi] - acum[lo]);
      return [final[lo].x + (final[hi].x - final[lo].x) * f, final[lo].y + (final[hi].y - final[lo].y) * f];
    }
  };
}

// cubic-bezier do CSS: devolve y(x)
function bezier(x1, y1, x2, y2) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const sx = t => ((ax * t + bx) * t + cx) * t;
  const sy = t => ((ay * t + by) * t + cy) * t;
  return x => { let lo = 0, hi = 1, t = x; for (let i = 0; i < 50; i++) { t = (lo + hi) / 2; if (sx(t) < x) lo = t; else hi = t; } return sy(t); };
}
// inversa de uma curva crescente em [0, 1]: o x em que f(x) = y
function inverte(f, y) { let lo = 0, hi = 1; for (let i = 0; i < 50; i++) { const m = (lo + hi) / 2; if (f(m) < y) lo = m; else hi = m; } return (lo + hi) / 2; }
function dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
function num(v, casas = 3) { return String(+v.toFixed(casas)); }
