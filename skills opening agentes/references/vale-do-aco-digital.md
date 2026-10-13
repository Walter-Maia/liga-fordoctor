# Referência: Vale do Aço Digital

Projeto em `landing page siteflux/vale-do-aco-digital/`. Duas gerações de efeitos, ambas reaproveitáveis:

- **Site institucional** (versões até 25/09/2026; hoje em `backup-v6/` e `referencias/index-2509-programa-html.html`): intro vetorial com câmera, hero em vídeo conduzido pela rolagem, logos de parceiros animados.
- **Programa Comércio Digital** (`index.html`, v3.x, publicado em valedoacodigital.com.br/programa-digital/): página de campanha sem overlay, com abertura por foto, parallax em camadas, flutuação, três planos e vídeo em formato story.

Identidade: marrom `#260f06` (fundo), creme `#fff5d3`, degradê vermelho → laranja (`#d92011 → #f5701a`), símbolo = triângulo + meio-disco. Regra do cliente: **não inventar fatos** (números, depoimentos, parceiros).

## 1. Intro vetorial com câmera (3,9 s)

Reconstrução de um vídeo de motion (`referencias/Vale do aço digital motion intro.mp4`): os tempos foram medidos no vídeo e comprimidos.

- **Geometria medida, não desenhada:** o script `tools/build-intro.js` mede o triângulo e o meio-disco no canal alfa do PNG oficial, converte para as unidades do SVG da assinatura e gera: 10 cópias concêntricas de cada forma (escalas 1 → 0,45, a partir de um canto, para as hipotenusas ficarem paralelas), traços das arestas, contorno, preenchimento em degradê, e o wordmark copiado dos paths oficiais. O resultado é injetado entre `<!-- intro:start -->` e `<!-- intro:end -->` (idempotente).
- **Câmera:** um `<g class="im-cam">` com keyframes de `transform`: `scale(5)` deslocado sobre o detalhe → 4,3 (34 %) → 2,9 (61 %) → 2,2 (88,6 %) → `translate(0) scale(1)` na pose da assinatura, com easing diferente em cada trecho (`animation-timing-function` dentro do keyframe).
- **Roteiro:** faísca no arco 0,1 s · diagonal 0,3 s · haste 0,43 s · arco 0,63 s · linhas concêntricas a partir de 0,9 s (50 ms cada) · brilho percorrendo o arco 2 s · palavra 2,55 s · contorno 2,63 s · preenchimento 2,7 s · halo 2,75 s · PNG oficial 3 s · ponto vermelho com mola 3,15 s · saída 3,9 s (fade de 0,55 s).
- **Faíscas:** `stroke-dasharray: 0.05 1.4` (um traço curtinho) andando de `dashoffset 0.06 → -0.62` dá a impressão de luz correndo na aresta.
- **Armadilhas registradas:** sem `vector-effect: non-scaling-stroke` no zoom (repinta todo quadro); nenhuma linha abaixo de ~1 px de tela (travou a pintura em palco estreito) — `stroke-width` maior em `max-width: 600px`; a assinatura do hero só entra depois que a da intro sumiu ("nunca dois logos ao mesmo tempo").
- **Liberação:** `intro-on intro-lock` decididos no `<head>` (sessão, hash, rolagem, movimento reduzido); `endIntro()` devolve a rolagem no início do fade; Escape/Tab tiram o overlay na hora; aba em segundo plano encerra.

## 2. Hero em vídeo conduzido pela rolagem (site institucional)

Três modos escolhidos por capacidade, nunca por user agent: **scrub** (ponteiro fino: a rolagem faz o seek do vídeo, um seek por vez, alvo quantizado em quadros, suavização por tempo decorrido — igual em 60/144/240 Hz — e o laço dorme quando não há o que aproximar), **play** (toque: toca uma vez, mudo, inline, em 100svh) e **static** (movimento reduzido, economia de dados, erro ou vídeo lento: quadro final + frase + CTAs). O `<head>` já nasce com a classe do modo para a altura do layout não saltar.

## 3. Logos de parceiros animados (ONEX)

Roteiro da intro do site da ONEX comprimido de 4,6 para 2,4 s, disparado quando a seção entra (`.rede.is-live`): letras traçam (`ox-draw`) e preenchem (`ox-fill`) com 90 ms entre si; trilhas laranja (`dasharray 0.16 1.4`) correm até o X; o X ganha contorno e face; no fim o PNG oficial entra por cima. Bom modelo para "animar a logo de cada parceiro" sem refazer a marca.

## 4. Programa Comércio Digital (v3.x): efeitos de campanha

### Abertura por foto (sem overlay)
Script inline no `<head>`: escuta `load`/`error` em captura no documento, chama `decode()` e marca cada `.mz-tile` como pronta **uma vez** (`tile.__ok`). Atraso pela posição (coluna × 40 ms + linha × 30 ms, teto 180 ms) aplicado como `transition-delay` (`--od`), não por rAF — o rAF não roda antes da 1ª pintura. Estados: `:not(.is-in) img { opacity:0; scale:1.035; clip-path: inset(0 0 X 0) }` → `.is-in` transiciona; `.is-done` remove a máscara; `.is-quebrada` esconde a imagem com erro e mantém o fundo do quadrado. Varre imagens já completas em `DOMContentLoaded` e `pageshow` (cache e voltar). Failsafe `open-done` em 6 s. Lição: **nunca** condicionar uma coluna a todas as fotos (uma foto lenta escondia duas prontas).

### Parallax em camadas, CSS primeiro
- Fórmula única: `y = A × (2p − 1)`, `p` = progresso na faixa *cover* do contêiner-trilha (`[data-px-track]`), que nunca se move (sem realimentação).
- CSS: `@property --px-a { syntax:'<length>' }`, `view-timeline: --px-cena block` na trilha e `animation: px-drift linear both; animation-timeline: --px-cena; animation-range: cover 0% cover 100%` nos alvos `[data-px]`. Amplitudes em tokens por breakpoint (`--px-texto`, `--px-quadro`…).
- JS (navegadores sem `animation-timeline`, ou `?fx=js`): mesmo cálculo num rAF só, ligado por IntersectionObserver, lendo tudo antes de escrever. Amplitudes relidas do CSS com um elemento-sonda (`margin-left: <valor>` → `getComputedStyle`).
- Para o cliente, parallax tem de ser **visível**: comece por ~1 vw (12–20 px em 1440); 4–8 px pareceu "sem efeito".
- Custo medido: cada elemento com animação ligada à rolagem é restilizado no main thread a cada quadro; com CPU 4× no desktop, 7 elementos já pesam. Use poucos alvos grandes (o bloco de texto inteiro, não cada linha).

### Camadas que não brigam
Cada efeito numa propriedade e num elemento próprio: parallax no bloco (`transform`/`translate` em `[data-px]`), flutuação num wrapper (`.boia`), reveal no item, hover/press na face (`.svc__face`), magnetismo no miolo (`.cta__mag`). Nunca sobrescrever `translate` de posicionamento (ex.: `.cta--final { translate:-50% 50% }`).

### Flutuação ambiente
`@keyframes boia { from { translate: 0 calc(var(--boia-a) * -1) } to { translate: 0 var(--boia-a) } }`, `infinite alternate`, ±2–2,5 px (±1 px no celular), ciclos de 6–8 s com fases negativas diferentes. Pausada por padrão; `.is-perto` (IntersectionObserver) liga; `html.aba-oculta` e `:hover/:focus/:active` pausam (pausar mantém a posição, retoma sem salto). Texto corrido nunca flutua.

### Três planos numa foto
Fundo (foto sem a pessoa, mesmo enquadramento) `z-index:1` < bloco que desce sobre a foto `z-index:2` < pessoa recortada com alfa `z-index:4`. Se a mão da pessoa apoia num objeto do fundo, pessoa e fundo andam **juntos** no parallax; só o bloco do meio se move diferente. Recortes enviados pelo cliente: alinhar por correlação/diferença (`ffmpeg blend=difference` + `signalstats` dá 0 quando bate) antes de posicionar.

### Vídeo em formato story que transborda a seção
Bloco 9:16 em `position:absolute` dentro da coluna (a altura da seção continua sendo a do texto), centrado e subindo alguns px para cobrir o fim da seção de cima; a foto de baixo passa na frente pelo `z-index`. Vídeo: converter HEVC/MOV para H.264 MP4 (720×1280, `crf 28`, `+faststart`), `muted loop playsinline preload="none"`, `poster`; tocar só perto da tela (IntersectionObserver ≥ 25 %) e com a aba visível; botão só com ícone para som (`v.muted = !v.muted`, sem reiniciar); se `play()` for recusado, devolver os controles nativos. Com `?fx=0` ou movimento reduzido: controles nativos, sem autoplay.

### Modos e garantias
`?fx=0` = composição final estática (nenhuma animação, nenhum autoplay); `?fx=js` = força o caminho JS do parallax; sem JS nada fica invisível; movimento reduzido vale ao vivo; um controlador com `window.__vadFx.destroy()` remove listeners e observadores. Reveal "ocioso": se a rolagem parar com um item armado já na tela, ele entra 220 ms depois.

## Ferramentas de QA usadas (reaproveitáveis)
Edge headless por CDP (`qa/premium-2026-09-29/tools/qa.cjs` + extras): medições de rede com cache frio, amostras de `translate` em p = 0,25/0,5/0,75 indo e voltando, ciclo de flutuação amostrado a cada 200 ms, foto deliberadamente atrasada por um servidor auxiliar, matriz responsiva de 320 a 1920, checagem em `file://`. No headless: `:focus` só casa com `Emulation.setFocusEmulationEnabled`; captura com `clip` usa coordenadas do documento (somar `scrollY`).
