---
name: componentry
description: Usar o Componentry (componentry.dev, github.com/harshjdhv/componentry) como referência de componentes animados para interfaces polidas (dock magnético estilo macOS, texto em partículas, gradientes animados, grades olho-de-peixe, pilhas de cartões, efeitos ASCII); decidir entre instalar no React ou portar para HTML/CSS/JS. Use quando pedirem "componentry", "dock do Mac no site", "texto em partículas", "animated gradient Oceanic/Toxic", "fisheye grid", "componentes do secret websites part 44".
---

# Componentry como biblioteca de referência

## Referência

[Reel de jj.finds_](https://www.instagram.com/reels/Ddl3VNQBc3O/), "Secret websites you should know (Part 44)", legenda "Free open source UI elements for any project", 10,5 s, inspecionado em 28/09/2026 a 2 quadros/s. Evidência: `qa/reels-2026-09-28/Ddl3VNQBc3O-p01.jpg` e `-p02.jpg`.

Observado:

- 0–1,5 s: um site "Cutout Citizens" com esfera 3D de cartões girando (mesmo padrão já documentado em `carrossel-globo-3d`; não é do Componentry).
- 2–3,5 s: home de componentry.dev, "The component library for polished interfaces", "Animated React components with editable source code. Install via shadcn CLI or your AI editor with MCP", selo "Backed by Vercel OSS Program", vitrine com tiles (efeito Matrix, gradiente magenta, split-flap "COMPONENTRY").
- 4–5 s: leque de cartões de personagens (Mira Vale, Noor Kade, Ari Chen) que se fecha em pilha ao mover o cursor.
- 5,5–6,5 s: texto "Design" formado por partículas que reagem ao cursor, controles "Custom Particle Color" e "Fine Particles (High Density)".
- 6,5 s: dock estilo macOS (Mail, Music) com magnificação, controles "Solid Variant" e "Large Scale Effect".
- 7–7,5 s: "Animated Gradient" magenta/preto com variantes Oceanic, Amber, Toxic, Ghost.
- 8–10 s: grade de docs com Hover Transition, Mac Keyboard, Circuit Board, Flight Status Card, Magnetic Dock, Collection Surfer, Fisheye Infinite Grid, GitHub Calendar, Scroll Choreography, Scroll Tilted Grid, Layered Stack, Dish Card Stack; abas Text Animations, Components, Hero Backgrounds, Visual Effects, ASCII Effects.

Repositório conferido pela API do GitHub em 28/09/2026: `harshjdhv/componentry`, MIT, 535 estrelas, React 19 + Tailwind 4 + Framer Motion, Next.js 16, Turborepo; `npx shadcn@latest add @componentry/magnetic-dock`. O README avisa que `image-trail` e `layered-stack` exigem GSAP e que a licença da GSAP é responsabilidade de quem redistribui. Tabela completa em [references/catalogo-componentes.md](references/catalogo-componentes.md).

## Quando usar / quando não usar

Use como catálogo para **nomear e calibrar** um pedido ("quero um dock como o do Mac", "fundo tipo aurora") e para ver o comportamento em uma demo antes de escrever a versão própria. Em projeto React + Tailwind, instalar pelo CLI do shadcn é o caminho; o código vem para dentro do projeto e você o mantém.

Não usar em site estático sem build (Siteflux, Vale do Aço Digital): porte o mecanismo. Não usar os componentes WebGL (aurora, liquid chrome, spectral ribbon, webgl-liquid, dither-prism) como fundo de página inteira sem medir GPU e sem fallback estático; eles são pesados e disputam com o conteúdo. Evitar dois componentes "de cursor" na mesma tela.

## Mapa para a biblioteca local

| Componentry | Já temos | O que muda |
|---|---|---|
| magnetic-dock | `efeitos/07-botao-magnetico.md` | trocar "gruda no cursor" por **escala por distância** (snippet abaixo) |
| animated-gradient, aurora-flow, silk-aurora, prism-gradient | `fundos-shadergradient` | presets de cor; versão CSS quando bastar |
| liquid-glass-carousel | `vidro-refrativo-liquid-glass` | idem |
| fisheye-infinite-grid | `galeria-grade-curva` | lente por distância ao centro |
| sticky-scroll-cards, layered-stack | `pilha-imagens-3d-scroll` | sem GSAP |
| cursor-driven-particle-typography | `texto-grade-dispersao` | partículas por amostragem de pixels (snippet abaixo) |
| orbit-card-stack, wheel-carousel | `carrossel-globo-3d`, `galeria-anel-cilindrico` | idem |
| kinetic-text-reveal, letter-cascade | `efeitos/02` | idem |
| image-trail, pixel-image-trail | `efeitos/03` | idem |
| signature | `efeito-de-intro` (traço que se desenha) | idem |
| ripple-transition | `efeitos/10` | idem |

## O que vale portar (e como)

Versões próprias; nenhuma linha copiada do repositório.

### Dock magnético (escala por distância, curva gaussiana)

Cada item cresce conforme a distância horizontal do ponteiro ao seu centro, com uma curva em sino; vizinhos crescem menos. O dock é um `<nav>` com botões reais, acessíveis por teclado (foco também amplia).

```html
<nav class="dock" aria-label="Aplicativos">
  <button type="button" class="dock__item" aria-label="Mail"><img src="mail.svg" alt="" width="48" height="48"></button>
  <button type="button" class="dock__item" aria-label="Música"><img src="music.svg" alt="" width="48" height="48"></button>
  <!-- … -->
</nav>
```
```css
.dock{display:flex;align-items:flex-end;gap:8px;padding:10px 14px;border-radius:22px;background:rgba(255,255,255,.55);backdrop-filter:blur(14px)}
.dock__item{--s:1;width:48px;height:48px;border:0;padding:0;background:none;transform:scale(var(--s));transform-origin:50% 100%;transition:transform .12s ease-out;will-change:transform}
.dock__item:focus-visible{outline:3px solid #2b5cff;outline-offset:4px;--s:1.5}
@media (hover:none),(prefers-reduced-motion:reduce){.dock__item{transition:none}}
```
```js
const dock=document.querySelector('.dock'),itens=[...dock.querySelectorAll('.dock__item')];
const MAX=1.9,ALCANCE=110;               // escala máxima e largura da curva (px)
const fino=matchMedia('(hover:hover) and (pointer:fine)'),reduzido=matchMedia('(prefers-reduced-motion:reduce)');
let x=null,pedido=false;
function pinta(){pedido=false;itens.forEach(el=>{const r=el.getBoundingClientRect(),c=r.left+r.width/2;
  const d=x==null?Infinity:Math.abs(x-c);const s=1+(MAX-1)*Math.exp(-(d*d)/(2*ALCANCE*ALCANCE));
  el.style.setProperty('--s',s.toFixed(3));});}
dock.addEventListener('pointermove',e=>{if(!fino.matches||reduzido.matches)return;x=e.clientX;if(!pedido){pedido=true;requestAnimationFrame(pinta);}});
dock.addEventListener('pointerleave',()=>{x=null;requestAnimationFrame(pinta);});
```
"Solid Variant" da demo é só o fundo sem blur; "Large Scale Effect" é `MAX` maior (2,2) com `ALCANCE` maior (150). O `getBoundingClientRect` por item a cada quadro é aceitável para até ~12 itens; acima disso, meça uma vez e recalcule no `resize`. Escala por `transform` não desloca os vizinhos; se quiser que o dock "abra", anime `margin` apenas por transição CSS curta, nunca por quadro.

### Texto em partículas (amostragem de pixels)

Desenhe o texto em um canvas oculto, leia `getImageData`, guarde um ponto a cada `passo` px onde o alfa é alto, e anime os pontos com mola até a posição de origem, repelidos pelo ponteiro.

```js
function amostra(texto,fonte,passo,larg,alt){const c=new OffscreenCanvas(larg,alt),g=c.getContext('2d');
  g.font=fonte;g.textAlign='center';g.textBaseline='middle';g.fillStyle='#fff';g.fillText(texto,larg/2,alt/2);
  const d=g.getImageData(0,0,larg,alt).data,pts=[];
  for(let y=0;y<alt;y+=passo)for(let x=0;x<larg;x+=passo)if(d[(y*larg+x)*4+3]>128)pts.push({ox:x,oy:y,x,y,vx:0,vy:0});
  return pts;}
// laço: para cada p → força de mola (ox,oy) k=0.06, amortecimento 0.85; se dist ao ponteiro < RAIO, empurra
// com força (RAIO-dist)/RAIO * 6 na direção oposta; desenha fillRect(p.x,p.y,passo-1,passo-1).
```
"Fine Particles (High Density)" é `passo` 3 em vez de 6; o custo cresce com o quadrado. Limite: ~4 000 pontos no desktop, ~1 500 no celular; sem ponteiro fino, as partículas ficam paradas no texto (ou animam uma vez na entrada). Texto real fica no DOM (`<h1 class="sr-only">` ou o próprio `<h1>` visualmente coberto) para acessibilidade e SEO.

### Outros com receita curta

- **animated-gradient** sem WebGL: três `radial-gradient` grandes em pseudo-elementos com `translate`/`scale` em keyframes de 18–30 s, `filter: blur()` só no pseudo-elemento, `prefers-reduced-motion` congela.
- **flipping-word-swap / split-flap**: dois `<span>` em `rotateX` com `backface-visibility: hidden`, 500 ms, `perspective: 600px` no pai.
- **magnet-lines**: grade de `<span>` rotacionados por `atan2` até o ponteiro, atualizados por rAF com `pointer:fine`; no toque, apontam para o centro.
- **matrix-rain**: canvas com colunas de caracteres; `prefers-reduced-motion` mostra um quadro estático; pausa em aba oculta.
- **fisheye grid**: escala de cada célula por `1 + k·exp(−d²/2σ²)` em relação ao centro da viewport, calculada no `scroll` com rAF; mesma curva do dock.

## Parâmetros gerais

Dock: `MAX` 1,6–2,2, `ALCANCE` 90–150 px, transição 100–150 ms. Partículas: `passo` 3–8, mola 0,05–0,08, repulsão 60–120 px. Fundos: um ciclo de 18–30 s, no máximo três formas. Sempre `transform`/`opacity`; canvas limitado à área do componente.

## Acessibilidade, toque, movimento reduzido, aba oculta

- Dock e cartões são botões/links reais com nome acessível; ampliar no `:focus-visible` dá ao teclado o mesmo feedback do cursor.
- Efeitos de cursor apenas com ponteiro fino; no toque, estado final estático e sem `pointermove` caro.
- `prefers-reduced-motion`: gradientes congelam, partículas ficam no texto, dock sem transição.
- Canvas e letreiros param com `document.hidden` e fora da viewport.
- Fundos WebGL: `webgl-error-boundary` do repositório é um lembrete; tenha sempre um fundo CSS por baixo.

## Verificação

Sequência de quadros: dock ao passar da esquerda para a direita (os vizinhos crescem e diminuem sem pulo) e com Tab entre itens; partículas após um passe rápido do cursor (dispersam e voltam em menos de 1,5 s, sem tremor residual); fundo animado em dois ciclos (sem emenda visível); CPU 4× para canvas; 360 px de largura; árvore de acessibilidade com um nome por botão. Registrar em `qa/<etapa>/`.

## Limites e licença

Componentry é MIT, mas `image-trail` e `layered-stack` puxam GSAP (licença própria): não redistribua esses dois sem ler a licença da GSAP. As receitas acima são autorais, escritas a partir do comportamento observado nas demos. A árvore lida em 28/09/2026 mistura componentes com peças internas do site de docs; nomes das abas do site não são nomes de arquivo. "Dish Card Stack" e o leque de cartões do vídeo não têm arquivo homônimo na árvore lida; confirme no site antes de citar ao cliente.
