# Método: animar vetores para uma intro

Este arquivo é o "manual de ofício". Ele explica como preparar o SVG e traz o catálogo de técnicas usadas nas intros do Siteflux e do Vale do Aço Digital, cada uma com o código mínimo. Uma intro é sempre **uma combinação de 4 a 8 destas técnicas**, disparadas por uma única classe (`.is-playing`) com `animation-delay` diferentes.

---

## 1. Preparar o SVG

1. **Use os paths oficiais.** Abra o SVG do logo e identifique cada peça: símbolo, letras, acento (ponto), slogan. No Siteflux eles já estão num `<symbol id="sf-logo">` com grupos `.lg-site`, `.lg-flux`, `.lg-accent`; o JS copia os paths dali (sem duplicar o desenho no HTML). No Vale, os paths foram colados direto no overlay.
2. **Um `viewBox` só** para o logo inteiro. Todas as coordenadas de `transform-origin`, máscaras e retângulos usam unidades desse viewBox. Dê folga ao viewBox (Siteflux: `-8 -8 451.28 111.54` para um logo de `435.28 × 95.54`) para o overshoot e o zoom não cortarem.
3. **Separe em grupos animáveis** (`<g class="...">`). Uma letra composta de duas peças (o "i" com pingo) vira um grupo só.
4. **Descubra a geometria do símbolo.** Anote centro, raios, cantos. Ex.: globo do Siteflux = elipse `cx 46.78 cy 36.15 rx 46.78 ry 35.15`; símbolo do Vale = triângulo `M12.27 8.02 L135.42 137.36 H12.27Z` + meio-disco `M135.63 137.36 V8.02 A61.47 64.67 0 0 1 135.63 137.36Z`. Com isso você cria máscaras, clips e linhas derivadas.
5. **Traços que "se desenham" precisam de um path de contorno.** Se o logo é só preenchimento, recrie o contorno com as primitivas geométricas (como o Vale fez) ou use o próprio path preenchido com `fill:none; stroke:...` (como o Siteflux fez com o globo).
6. **Quadro final = arte oficial.** Termine exatamente no desenho oficial (cores e formas). Se o oficial tem gradientes ou textura que o SVG não reproduz, faça o último passo trocar para o PNG/SVG oficial com um fade curto (Vale: `.im-official` aos 3,0 s).
7. `aria-hidden="true" focusable="false"` no SVG da intro; ela é decorativa.

## 2. Configuração que evita 90 % dos bugs

```css
/* tudo começa invisível / no estado inicial; nada anima até .is-playing */
.x-l, .x-dot { opacity: 0; }
/* transform em elementos SVG: dizer qual caixa é a referência */
.x-l, .x-dot { transform-box: fill-box; transform-origin: center; }          /* gira/escala em torno de si */
.x-spin { transform-box: view-box; transform-origin: 46.78px 36.15px; }        /* gira em torno de um ponto do viewBox */
/* todas as animações com fill-mode "both" (ou "forwards"): segura o estado final e respeita o delay */
.intro.is-playing .x-l { animation: x-letter .55s cubic-bezier(.22,1,.36,1) calc(.9s + var(--n) * .07s) both; }
```

- `pathLength="1"` no path que vai ser desenhado: assim `stroke-dasharray`/`dashoffset` usam 0–1 independentemente do tamanho real.
- Índices de stagger vão em `style="--n:3"` / `--i:3` no próprio elemento.
- Dois `requestAnimationFrame` antes de adicionar `.is-playing` para o primeiro quadro pintar o estado inicial.

---

## 3. Catálogo de técnicas

### T1 — Traço que se desenha (draw-on)
Contorno aparece como se fosse riscado.
```html
<path class="t-draw" pathLength="1" d="..."/>
```
```css
.t-draw { fill:none; stroke:#fff; stroke-width:.55; stroke-dasharray:1; stroke-dashoffset:1; }
.intro.is-playing .t-draw { animation: t-draw .95s cubic-bezier(.45,0,.2,1) forwards; }
@keyframes t-draw { to { stroke-dashoffset: 0; } }
```
Uso: Siteflux (globo, 0–0,95 s); Vale (haste e arco, 0,43 s e 0,63 s). Para sumir depois, encadeie um segundo keyframe: `animation: t-draw .95s ... forwards, t-out .4s ease 1.55s forwards;`.

### T2 — Cometa de luz (traço curto que percorre o caminho)
Um segmento curto viaja pelo path e some no fim — a "faísca".
```css
.t-comet { fill:none; stroke:#f7a823; stroke-linecap:round; stroke-dasharray:.05 1.4; stroke-dashoffset:.06; opacity:0; }
.intro.is-playing .t-comet { animation: t-comet .32s linear .1s both; }
@keyframes t-comet { 0% { stroke-dashoffset:.06; opacity:1 } 90% { opacity:1 } 100% { stroke-dashoffset:-.62; opacity:0 } }
```
O primeiro número do `dasharray` é o comprimento do cometa (0,05 = 5 % do path), o segundo (>1) garante que só exista um traço. `dashoffset` vai de "logo antes do início" a um valor negativo (quanto mais negativo, mais longe ele anda). Uso: Vale (faísca no arco, diagonal vermelha, e o `im-sweep` claro aos 2,0 s).

### T3 — Linhas concêntricas em cascata (eco / "offset")
Várias cópias do contorno encolhidas para dentro, acendendo uma após a outra.
```html
<g class="t-lines"><path style="--i:0" d="..."/><path style="--i:1" d="..."/>…</g>
```
```css
.t-lines path { fill:none; stroke:#f39a1f; stroke-width:.85px; opacity:0; }
.intro.is-playing .t-lines path { animation: t-in .35s ease-out calc(.9s + var(--i) * .05s) both, t-out .16s linear 2.67s forwards; }
```
Gerar as cópias por código, não à mão (ver §4). Uso: Vale, 10 pares triângulo + meio-disco.

### T4 — Cores girando dentro do símbolo (máscara)
Setores coloridos giram; só aparece o que está dentro da silhueta do símbolo.
```html
<defs><mask id="m" maskUnits="userSpaceOnUse" x="-4" y="-4" width="102" height="80"><path fill="#fff" d="(path do símbolo)"/></mask></defs>
<g mask="url(#m)">
  <g class="t-spin">
    <path fill="#ccd961" d="M46.78,36.15L126.78,36.15A80,80 0 0,1 6.78,105.43Z"/>  <!-- 3 fatias de 120° de raio maior que o símbolo -->
    <path fill="#3cbcd5" d="M46.78,36.15L6.78,105.43A80,80 0 0,1 6.78,-33.13Z"/>
    <path fill="#fff"    d="M46.78,36.15L6.78,-33.13A80,80 0 0,1 126.78,36.15Z"/>
  </g>
  <rect class="t-settle" x="-4" y="-4" width="102" height="80" fill="#fff"/>   <!-- assenta na cor oficial -->
</g>
```
```css
.t-spin { opacity:0; transform-box:view-box; transform-origin:46.78px 36.15px; }
.intro.is-playing .t-spin { animation: t-spin 1.5s cubic-bezier(.2,.6,.2,1) .35s both; }
@keyframes t-spin { 0% { opacity:0; transform:rotate(-40deg) } 18% { opacity:1 } 100% { opacity:1; transform:rotate(500deg) } }
.t-settle { opacity:0 } .intro.is-playing .t-settle { animation: t-fade .45s ease 1.5s forwards; }
```
Fatias: centro no centro do símbolo, raio maior que o símbolo, ângulos 0°/120°/240° (`x = cx + r·cos θ`, `y = cy + r·sin θ`). Uso: Siteflux.

### T5 — Faixas deslizando por recorte (clipPath)
Retângulos translúcidos atravessam a silhueta, dando sensação de volume/giro.
```html
<clipPath id="c"><ellipse cx="46.78" cy="36.15" rx="46.78" ry="35.15"/></clipPath>
<g class="t-bands" clip-path="url(#c)">
  <rect class="t-band1" x="-34" y="-2" width="30" height="78" fill="#ccd961" opacity=".3"/>
</g>
```
```css
@keyframes t-slide { from { transform:translateX(-40px) } to { transform:translateX(150px) } }
@keyframes t-bands { 0% { opacity:0 } 20%,70% { opacity:1 } 100% { opacity:0 } }
```
`mask` = recorte com a forma exata (aceita path complexo com furos); `clipPath` = recorte geométrico simples, mais barato. Uso: Siteflux.

### T6 — Câmera (zoom-out/pan do conjunto)
Um `<g>` envolve tudo e recebe `transform` com vários keyframes, cada trecho com seu easing.
```css
.t-cam { transform-origin:104.6px 72.7px; transform: translate(79.5px,0) scale(5); }
.intro.is-playing .t-cam { animation: t-cam 2.63s linear both; }
@keyframes t-cam {
  0%    { transform: translate(79.5px,0) scale(5); }
  34%   { transform: translate(79.5px,0) scale(4.3); animation-timing-function: cubic-bezier(.2,.6,.3,1); }
  61%   { transform: translate(79.5px,0) scale(2.9); animation-timing-function: linear; }
  88.6% { transform: translate(79.5px,0) scale(2.2); animation-timing-function: cubic-bezier(.6,0,.2,1); }
  100%  { transform: translate(0,0) scale(1); }
}
```
`animation-timing-function` dentro de um keyframe vale para o trecho **seguinte**. Percentual × duração = segundo absoluto (34 % × 2,63 s ≈ 0,89 s): calcule assim para casar a câmera com os outros eventos. Com câmera, as espessuras de traço ficam em unidades do viewBox (afinam junto com o zoom-out) — garanta ≥ ~1 px de tela no fim. Uso: Vale.

### T7 — Letras em sequência (stagger)
```css
.intro.is-playing .t-l { animation: t-letter .55s cubic-bezier(.22,1,.36,1) calc(.9s + var(--n) * .07s) forwards; }
@keyframes t-letter { from { opacity:0; transform:translateY(9px) } to { opacity:1; transform:none } }
```
Deslocamento pequeno (≈10 % da altura da letra). A palavra não gira nem distorce. Variante do Vale: o nome inteiro entra por opacidade em 0,27 s (`0 → .45 → 1`).

### T8 — Estouro com overshoot (ponto, acento, ícone)
```css
.t-dot { opacity:0; transform-box:fill-box; transform-origin:center; }
.intro.is-playing .t-dot { animation: t-pop .5s cubic-bezier(.34,1.56,.64,1) 1.65s forwards; }
@keyframes t-pop { from { opacity:0; transform:scale(0) } to { opacity:1; transform:scale(1) } }
```
Pode trocar cor no caminho (Vale: laranja → vermelho). Normalmente é o **último** evento: fecha a frase visual.

### T9 — Contorno → preenchimento (flash de acabamento)
Contorno acende e some enquanto o preenchimento com gradiente entra por baixo.
```css
@keyframes t-outline { 0% { opacity:0 } 20%,64% { opacity:1 } 100% { opacity:0 } }   /* .45s */
@keyframes t-fill    { 0% { opacity:0 } 37% { opacity:.45 } 100% { opacity:1 } }        /* .27s, começa ~.07s depois */
```
Uso: Vale (2,63 s e 2,70 s). Gradientes com `gradientUnits="userSpaceOnUse"` e coordenadas do viewBox.

### T10 — Brilho (glow) atrás do símbolo
`<ellipse fill="url(#radial)">` com `stop-opacity` 0,38 → 0 e fade-in de 0,4 s. Barato (não é `filter`). Uso: Vale.

### T11 — Troca para a arte oficial
`<image href="logo-oficial.png">` com as mesmas dimensões do símbolo, fade 0,3 s por cima do vetor. Uso: Vale (3,0 s).

### T12 — Saída (dissolução)
```css
.intro.is-leaving { animation: t-leave .45s ease forwards; }          @keyframes t-leave { to { opacity:0 } }
.intro.is-leaving .intro-logo { animation: t-zoom .6s cubic-bezier(.22,1,.36,1) forwards; } @keyframes t-zoom { to { transform:scale(1.04) } }
```
Ou `transition: opacity .55s, visibility 0s .55s` com `.is-leaving { opacity:0; visibility:hidden; pointer-events:none }` (Vale).

---

## 4. Gerar linhas derivadas por código (T3)

As 10 cópias do Vale são o triângulo com o topo descendo e a ponta recuando em passos fixos, e o meio-disco com raios menores. Gere assim e cole o resultado no SVG (ou gere no JS ao montar o overlay):

```js
// triângulo: canto sup. (x0,yTop) → ponta (xTip,yBase) → canto inf. (x0,yBase)
const x0 = 12.27, yBase = 137.36, yTop = 8.02, xTip = 135.42, N = 10;
const tri = [...Array(N)].map((_, i) => {
  const y = yTop + i * 7.905, x = xTip - i * 7.525;             // passo = (altura e largura) / ~16
  return `<path style="--i:${i}" d="M${x0} ${y.toFixed(2)}L${x.toFixed(2)} ${yBase}H${x0}Z"/>`;
});
// meio-disco: eixo desloca para a direita e os raios encolhem
const disc = [...Array(N)].map((_, i) => {
  const x = 135.63 + i * 1.88, y1 = 137.36 - i * 3.95, y0 = 8.02 + i * 3.95;
  const rx = 61.47 - i * 3.755, ry = 64.67 - i * 3.95;
  return `<path style="--i:${i}" d="M${x.toFixed(2)} ${y1.toFixed(2)}V${y0.toFixed(2)}A${rx.toFixed(2)} ${ry.toFixed(2)} 0 0 1 ${x.toFixed(2)} ${y1.toFixed(2)}Z"/>`;
});
```
Para qualquer forma: escolha um ponto "âncora" (canto que fica fixo) e interpole os outros vértices em direção a ele. Para círculos/elipses, reduza os raios. Para paths arbitrários, uma alternativa é `transform="scale(s)"` com `transform-origin` no centro — mas a espessura do traço também escala; compense com `stroke-width / s`.

## 5. Traduzir palavras do pedido em técnicas

| A pessoa diz… | Técnica |
|---|---|
| "se desenha", "riscado", "traço aparecendo", "caneta" | T1 |
| "faísca", "luz correndo pelo contorno", "brilho percorrendo" | T2 (e T2 claro no fim = "sweep") |
| "várias linhas", "efeito de eco", "ondas", "camadas de contorno" | T3 |
| "cores girando dentro", "gradiente vivo", "líquido dentro do logo" | T4 (+ T5) |
| "começa bem de perto e afasta", "zoom", "câmera", "revela aos poucos" | T6 |
| "letras entrando uma a uma", "digitando", "subindo" | T7 |
| "ponto pulando", "estalo", "pop" | T8 |
| "acende e preenche", "ganha cor", "vira o logo de verdade" | T9 + T11 |
| "brilho atrás", "aura", "neon" | T10 (sem `filter`) |
| "some suave", "dissolve pra dentro do site" | T12 |

Ordem narrativa que funciona nas duas referências: **estrutura (traços) → energia (cor/luz/movimento) → assentamento (forma oficial) → nome → acento final → pausa curta → saída**. Deixe ~0,3–0,4 s com a marca completa parada antes de sair.

## 6. Desempenho

- Anime só `transform`, `opacity`, `stroke-dashoffset`. `mask`/`clipPath` estáticos com conteúdo girando são baratos.
- Evite `filter` (blur, drop-shadow) animado e `vector-effect: non-scaling-stroke` sob zoom (no Chromium força repintura por quadro e, com `pathLength`+`dasharray`, travou a pintura).
- Traços nunca abaixo de ~1 px de tela: reforce em telas pequenas (`@media (max-width:600px)` com `stroke-width` maior), como o Vale.
- Um overlay por página, removido do DOM ao terminar; nenhum listener/timer sobrando.
