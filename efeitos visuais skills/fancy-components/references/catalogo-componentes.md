# Catálogo dos 45 componentes do Fancy (danielpetho/fancy)

Lista lida da árvore `src/fancy/components/` em 28/09/2026 (branch `main`, último push 14/03/2026). "Dependência provável" vem da descrição pública e do padrão do repositório (React + `motion` + Tailwind + TypeScript); confira o arquivo antes de instalar. "Portar" indica a dificuldade de escrever uma versão própria em HTML/CSS/JS sem framework: **B** baixa (CSS ou poucas linhas de JS), **M** média (rAF, medição de layout, `Intl.Segmenter`), **A** alta (física, canvas/WebGL, filtros pesados). "Equivalente local" aponta a skill já existente nesta biblioteca.

| Componente | Categoria | O que faz | Dependência provável | Portar | Uso sugerido / equivalente local |
|---|---|---|---|---|---|
| animated-gradient-with-svg | background | gradiente animado por SVG com blobs desfocados | motion | M | fundo de hero; ver `fundos-shadergradient` |
| pixel-trail | background | rastro pixelado que segue o cursor sobre uma grade | motion | M | fundo decorativo curto; desligar no toque |
| circling-elements | blocks | itens orbitando um centro | motion | B | ornamento de logo/ícones; `animation: rotate` |
| css-box | blocks | cubo 3D em CSS com faces | CSS 3D | B | vitrine pequena; ver `cubo-galeria-vidro` |
| drag-elements | blocks | elementos arrastáveis com inércia | motion (drag) | M | mural de stickers; exige alternativa por teclado |
| element-along-svg-path | blocks | elemento percorrendo um `<path>` | motion | M | ícone que "viaja"; `offset-path` em CSS |
| float | blocks | flutuação suave (senoidal) | motion | B | destaque de produto; CSS keyframes |
| marquee-along-svg-path | blocks | letreiro que corre por um caminho curvo | motion | M | assinatura de hero; `<textPath>` + `startOffset` |
| media-between-text | blocks | mídia que abre entre palavras no hover | motion (layout) | M | chamada editorial; `grid-template-columns` animado |
| screensaver | blocks | elemento quicando nas bordas (DVD) | rAF | B | humor/vazio; `easter egg` |
| simple-carousel | blocks | carrossel básico | motion | B | ver `carrossel-visual-editorial` |
| simple-marquee | blocks | letreiro infinito | motion | B | ver `efeitos/06-marquee-letreiro-infinito.md` |
| stacking-cards | blocks | cartões empilhando no scroll | scroll | M | ver `pilha-imagens-3d-scroll` |
| box-carousel | carousel | carrossel em caixa 3D girando | motion + CSS 3D | M | ver `cubo-galeria-vidro` |
| gooey-svg-filter | filter | filtro "goo" (blur + colorMatrix) | SVG | B | fusão de blobs; ver `blob-liquido-cursor` |
| pixelate-svg-filter | filter | pixelização por `feFlood`/`feComposite`/`feMorphology` | SVG | B | transição de imagem; custo alto em áreas grandes |
| image-trail | image | rastro de imagens seguindo o cursor | motion | M | ver `efeitos/03-cursor-com-rastro-de-imagens.md` |
| parallax-floating | image | itens flutuando em parallax com o cursor | motion | M | hero editorial; profundidade por fator |
| cursor-attractor-and-gravity | physics | corpos atraídos pelo cursor com gravidade | matter-js | A | brinquedo de hero; pesado, desligar no toque |
| elastic-line | physics | linha que estica como elástico ao passar o cursor | SVG + rAF | M | divisor de seção vivo; `Q` quadrática com mola |
| gravity | physics | objetos caindo e colidindo | matter-js | A | mural de tags; só com fallback estático |
| basic-number-ticker | text | contador animado | motion | B | números reais apenas; `tabular-nums` |
| breathing-text | text | peso da fonte variável pulsando | fonte variável | B | destaque calmo; `font-variation-settings` |
| letter-3d-swap | text | letras giram em 3D trocando para cópia | motion + CSS 3D | M | links/CTA; ver `links-rolagem-por-caractere` |
| letter-swap-forward-anim | text | letra sobe e a cópia entra por baixo | motion | B | ver `links-rolagem-por-caractere` |
| letter-swap-pingpong-anim | text | idem, volta no mesmo caminho | motion | B | idem |
| random-letter-swap-forward-anim | text | idem, ordem aleatória por letra | motion | B | idem, ordem embaralhada |
| random-letter-swap-pingpong-anim | text | idem, pingue-pongue aleatório | motion | B | idem |
| scramble-hover | text | caracteres embaralham no hover | rAF | B | links técnicos; limitar duração |
| scramble-in | text | texto "decodifica" ao entrar | rAF | B | intro de título; reduzido: mostrar direto |
| scroll-and-swap-text | text | texto troca conforme o scroll | scroll | M | narrativa; `IntersectionObserver` |
| text-along-path | text | texto sobre um caminho SVG | SVG | B | `<textPath>` puro |
| text-cursor-proximity | text | letras reagem à distância do cursor | rAF | M | hero interativa; `pointer:fine` apenas |
| text-highlighter | text | marca-texto que se desenha | motion | B | ver marca-texto em `blob-liquido-cursor` |
| text-rotate | text | palavras alternam com máscara de linha | motion | B | ver snippet na SKILL |
| typewriter | text | digitação com cursor | timers | B | evitar em títulos longos |
| underline-center | text | sublinhado cresce do centro | CSS | B | links |
| underline-comes-in-goes-out | text | sublinhado entra por um lado e sai pelo outro | CSS | B | links |
| underline-goes-out-comes-in | text | variação inversa | CSS | B | links |
| underline-to-background | text | sublinhado cresce até virar fundo | CSS | B | links/CTA |
| variable-font-and-cursor | text | eixos da fonte seguem o cursor | fonte variável + rAF | M | hero tipográfica |
| variable-font-cursor-proximity | text | eixos variam pela proximidade por letra | idem | M | idem |
| variable-font-hover-by-letter | text | eixos animam letra a letra no hover | fonte variável | B | ver snippet na SKILL |
| variable-font-hover-by-random-letter | text | idem em ordem aleatória | fonte variável | B | idem |
| vertical-cut-reveal | text | linhas/palavras/letras sobem dentro de máscara | motion | B | ver `efeitos/02-texto-revelado-linha-por-linha.md` |

## Observações

- Os componentes de **physics** dependem de motor de física (matter-js, pela descrição do site); são os mais caros e os que mais atrapalham leitura. Só entram como brinquedo isolado e com versão estática no toque e em movimento reduzido.
- Os de **text** com fonte variável exigem carregar os eixos (`wght`, `wdth`, `slnt`) na `@font-face`; sem fonte variável, nada acontece.
- Vários itens são variantes do mesmo mecanismo (letter-swap ×4, underline ×4, variable-font ×4). Ao portar, escreva um único componente com opções em vez de quatro.
- Licença do repositório: MIT. A licença das fontes e imagens dos exemplos do site não é a do código.
