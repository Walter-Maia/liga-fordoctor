---
name: fancy-components
description: Usar a biblioteca Fancy Components (github.com/danielpetho/fancy, fancycomponents.dev) como referência de microinterações e animações de texto, física e cursor; decidir entre instalar no React ou portar para HTML/CSS/JS, e mapear cada componente para as skills já existentes. Use quando pedirem "fancy components", "componentes animados do GitHub", "text rotate", "marquee em curva", "letras com fonte variável", "gravity/attractor no site" ou "site over-animated".
---

# Fancy Components como biblioteca de referência

## Referência

[Reel de fifbuilds](https://www.instagram.com/reels/DdmTyGbpo6Z/), "GitHub is your new design asset library", 21,3 s, inspecionado em 28/09/2026 a 1 quadro/s. Evidência: `qa/reels-2026-09-28/DdmTyGbpo6Z-p01.jpg` e `-p02.jpg`.

Observado: 0–9 s a autora apresenta o repositório como "one repo for you" para efeitos premiados; 10–11 s home de fancycomponents.dev ("Make your website over-animated?", "a growing library of ready-to-use react components & microinteractions, free & open source"); 12–20 s navegação pelos docs: Marquee Along SVG Path, Image Trail ("ALBUMS"), Parallax Floating, Gravity, Cursor Attractor & Gravity, Vertical Cut Reveal ("HI 👋, FRIEND!"), lista de Text (Letter Swap Hover, Letter 3D Swap, Random Letter Swap Hover, Text Rotate, Variable Font Hover By Letter/Random Letter, Scroll And Swap, Text Cursor Proximity, Breathing Text, Underline Animation, Underline To Background), categorias Background, Physics, Image, Filter e Blocks; aba "Code" de Parallax Floating com `"use client"` e imports de `motion/react`.

Repositório conferido pela API do GitHub em 28/09/2026: `danielpetho/fancy`, MIT, 3,2 mil estrelas, último push 14/03/2026, 45 componentes em `src/fancy/components/`. Stack: React, `motion`, Tailwind, TypeScript; instala pelo CLI do shadcn. A tabela completa está em [references/catalogo-componentes.md](references/catalogo-componentes.md).

## Quando usar / quando não usar

Use o Fancy como **catálogo de vocabulário**: para nomear o efeito que o cliente descreveu, ver uma demo interativa e decidir intensidade. Use o código dele diretamente **só** em projeto React com Tailwind, onde `npx shadcn@latest add` já é o fluxo.

Não instale React, Tailwind ou `motion` em um site estático (Siteflux e Vale do Aço Digital são HTML/CSS/JS sem build) só para ter um componente: porte o mecanismo. Não somar efeitos: a própria home pergunta "over-animated?"; escolha **3 a 5** por site, um por seção, e nunca dois efeitos de cursor ao mesmo tempo.

## Mapa para a biblioteca local

| Fancy | Já temos | O que muda |
|---|---|---|
| letter-swap-* / letter-3d-swap | `links-rolagem-por-caractere` | mesma técnica de duas cópias por grafema |
| simple-marquee | `efeitos/06-marquee-letreiro-infinito.md` | idem |
| image-trail | `efeitos/03-cursor-com-rastro-de-imagens.md` | idem, sem `motion` |
| vertical-cut-reveal | `efeitos/02-texto-revelado-linha-por-linha.md` | acrescentar modo por palavra/letra |
| stacking-cards / box-carousel / css-box | `pilha-imagens-3d-scroll`, `cubo-galeria-vidro` | referência de composição |
| animated-gradient-with-svg | `fundos-shadergradient` | versão SVG mais leve que WebGL |
| gooey-svg-filter | `blob-liquido-cursor` | mesmo filtro |
| text-highlighter | `blob-liquido-cursor` (marca-texto) | idem |

## O que vale portar (e como)

Versões próprias em vanilla; nenhuma linha copiada do repositório.

### text-rotate

Palavras alternam dentro de uma máscara de uma linha. A cópia visível é `aria-hidden`; a frase completa fica em texto oculto para leitores de tela (nunca `aria-live` por ciclo).

```html
<h1>Sites que <span class="sr-only">convertem</span><span class="gira" aria-hidden="true" data-palavras="convertem|carregam rápido|contam história"><span>convertem</span></span></h1>
```
```css
.gira{display:inline-grid;overflow:hidden;vertical-align:bottom;height:1.1em;line-height:1.1}
.gira>span{grid-area:1/1;transition:transform .5s cubic-bezier(.22,1,.36,1),opacity .4s}
.gira>span.sai{transform:translateY(-100%);opacity:0}
.gira>span.entra{transform:translateY(100%);opacity:0;transition:none}
@media (prefers-reduced-motion:reduce){.gira>span{transition:opacity .3s}.gira>span.sai,.gira>span.entra{transform:none}}
```
```js
const g=document.querySelector('.gira'),lista=g.dataset.palavras.split('|');let i=0;
setInterval(()=>{if(document.hidden)return;const velho=g.firstElementChild,novo=document.createElement('span');
  i=(i+1)%lista.length;novo.textContent=lista[i];novo.className='entra';g.append(novo);
  requestAnimationFrame(()=>{velho.classList.add('sai');novo.className='';});
  velho.addEventListener('transitionend',()=>velho.remove(),{once:true});},2600);
```
Largura: `inline-grid` adota a maior palavra? Não; se a largura pulsar, fixe `min-width` medindo a maior palavra uma vez ou use `ch`.

### marquee-along-svg-path

Letreiro seguindo um caminho curvo: `<textPath>` com `startOffset` animado. Repita o texto até cobrir 200 % do comprimento e anime o offset de 0 a −50 %.

```html
<svg viewBox="0 0 1200 300" aria-hidden="true"><path id="trilho" d="M0 200 C300 50 900 350 1200 120" fill="none"/>
<text font-size="48"><textPath href="#trilho" startOffset="0" class="corre">SITEFLUX · SITES QUE CONVERTEM · SITEFLUX · SITES QUE CONVERTEM · </textPath></text></svg>
```
```css
.corre{animation:corre 18s linear infinite}
@keyframes corre{to{startOffset:-50%}} /* Chrome/Firefox animam startOffset via CSS; para Safari, anime o atributo por rAF */
@media (prefers-reduced-motion:reduce){.corre{animation:none}}
```
Se o navegador não animar `startOffset` em CSS, atualize `setAttribute('startOffset', pct+'%')` por rAF a ~30 fps; pause fora da tela. O texto do letreiro é decorativo (`aria-hidden`) e deve existir também em HTML legível.

### variable-font-hover-by-letter

Cada letra muda o eixo `wght` em cascata no hover. Exige fonte variável carregada com o eixo.

```css
@font-face{font-family:"Var";src:url(fonte-variavel.woff2) format("woff2-variations");font-weight:100 900}
.peso{font-family:"Var";font-variation-settings:"wght" 400}
.peso span{display:inline-block;transition:font-variation-settings .35s cubic-bezier(.22,1,.36,1);transition-delay:calc(var(--i) * 18ms)}
.peso:hover span,.peso:focus-visible span{font-variation-settings:"wght" 800}
```
```js
document.querySelectorAll('.peso').forEach(el=>{const seg=new Intl.Segmenter('pt',{granularity:'grapheme'});
  const t=el.textContent;el.setAttribute('aria-label',t);el.innerHTML='';
  [...seg.segment(t)].forEach((s,i)=>{const sp=document.createElement('span');sp.textContent=s.segment;sp.style.setProperty('--i',i);sp.setAttribute('aria-hidden','true');el.append(sp);});});
```
Limite o atraso total a ~180 ms (texto de 10 letras); acima disso a cascata parece lenta. Não use em parágrafos.

### Outros com receita curta

- **vertical-cut-reveal por palavra**: envolver cada palavra em `<span class="mask"><span>` com `overflow: hidden` e `translateY(110%) → 0`, atraso 40–60 ms por palavra; ver `efeitos/02`.
- **gooey-svg-filter**: `feGaussianBlur stdDeviation 8–12` → `feColorMatrix` alpha `… 0 0 0 20 -10` → `feComposite atop`; aplicar em um `<g>` pequeno, nunca na página.
- **scramble-in**: por rAF, a cada 40 ms trocar caracteres ainda "não fixados" por um símbolo aleatório de um conjunto curto, fixando da esquerda para a direita; duração total ≤ 900 ms; reduzido: mostrar o texto pronto.
- **elastic-line**: `<path d="M0 50 Q ${cx} ${cy} 100 50">` com `cy` puxado pelo ponteiro e devolvido por mola (rigidez 0,08, amortecimento 0,8).

## Parâmetros gerais

Easing de entrada `cubic-bezier(.22, 1, .36, 1)`; durações 350–600 ms para texto, 18–30 s por volta em letreiros; atraso por letra 12–25 ms com teto de 180 ms; sempre `transform`/`opacity`/`font-variation-settings`, nunca `width`/`left`. Física (gravity, attractor) fica de fora dos sites do estúdio salvo pedido explícito.

## Acessibilidade, toque, movimento reduzido, aba oculta

- Texto animado por letra: um único nome acessível (`aria-label` no elemento, `aria-hidden` nos spans).
- Efeitos de cursor só com `(hover: hover) and (pointer: fine)`; no toque, estado final estático.
- `prefers-reduced-motion`: text-rotate vira crossfade, letreiro para, fonte variável fica no peso final.
- Letreiros e físicas pausam com `document.hidden` e fora da viewport (`IntersectionObserver`).
- Sem JS: o HTML precisa conter o texto final legível.

## Verificação

Sequência de quadros (não captura parada) para cada efeito adotado: início, meio e fim de um ciclo; segundo ciclo sem acúmulo; largura estável durante text-rotate; letreiro sem "salto" na emenda; zoom 200 % e 360 px de largura; árvore de acessibilidade com um nome por elemento. Registrar em `qa/<etapa>/`.

## Limites e licença

O Fancy é MIT; as fontes e imagens das demos não. As receitas acima são autorais, escritas a partir do comportamento observado nas demos, não do código do repositório. A página pública muda; a árvore de 45 componentes foi lida em 28/09/2026 e pode ganhar itens. Reaproveitar a ideia de "biblioteca de vocabulário" não exige instalar nada.
