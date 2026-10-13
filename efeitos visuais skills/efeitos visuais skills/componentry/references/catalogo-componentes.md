# Catálogo dos componentes do Componentry (harshjdhv/componentry)

Lista lida da árvore do repositório em 28/09/2026 (pasta `components/` do app de docs; alguns itens são peças internas do site de documentação e foram omitidos: docs-*, providers, site-header, footer, theme-toggle, copy-button, install-command, kbd, tabs, spinner, input, command, scroll-area, playground-primitives, webgl-error-boundary, route-scrollbar-controller, page-context-menu, navbar-theme-switcher, floating-docs-sidebar-*, coss-badge/button, package-manager-command, import/live/dynamic-code-block, component-*). Stack: React 19 + Tailwind 4 + Framer Motion; instala com `npx shadcn@latest add @componentry/<nome>`. O README declara que **image-trail** e **layered-stack** dependem de GSAP (licença própria). "Portar": **B** baixa, **M** média, **A** alta (canvas/WebGL/física). "O que faz" vem do nome, do vídeo e dos docs quando visíveis; confirme no site antes de prometer ao cliente.

| Componente | Categoria (aba) | O que faz | Dependência conhecida | Portar | Uso sugerido / equivalente local |
|---|---|---|---|---|---|
| animated-gradient | Hero Backgrounds | gradiente animado com presets (Oceanic, Amber, Toxic, Ghost) | Framer Motion/CSS | B | fundo de hero; ver `fundos-shadergradient` |
| annotated-text | Text Animations | anotações desenhadas sobre o texto (círculo, sublinhado) | SVG | B | destaque editorial |
| ascii-effect | ASCII Effects | converte imagem/vídeo em caracteres | canvas | M | assinatura tech; pesado em vídeo |
| aurora-flow | Hero Backgrounds | aurora fluida | WebGL/shader | A | ver `fundos-shadergradient` |
| case-study-flip-stack | Components | pilha de cases que vira | Motion + CSS 3D | M | portfólio |
| circuit-board | Visual Effects | placa de circuito com nós animados | SVG | M | fundo tech; ver rede animada do Vale |
| closing-plasma | Visual Effects | plasma que se fecha | WebGL | A | transição |
| collection-surfer | Components | navegação suave por coleções | Motion | M | vitrine |
| cursor-driven-particle-typography | Text Animations | texto em partículas que reagem ao cursor (Custom Particle Color, Fine Particles) | canvas | M | ver snippet na SKILL; `texto-grade-dispersao` |
| dithered-logo | Visual Effects | logo com dithering | canvas | M | identidade retrô |
| dither-gradient | Hero Backgrounds | gradiente com dithering | canvas/shader | M | fundo |
| dither-prism-hero | Hero Backgrounds | hero com prisma e dithering | WebGL | A | fundo |
| eye-tracking | Components | olhos que seguem o cursor | rAF | B | mascote; `pointer:fine` |
| fisheye-infinite-grid | Components | grade infinita com lente olho-de-peixe | canvas/Motion | A | ver `galeria-grade-curva` |
| flight-status-card | Components | cartão de status de voo animado | Motion | B | dashboards |
| flipping-word-swap | Text Animations | palavra vira em 3D para outra | CSS 3D | B | ver `text-rotate` em `fancy-components` |
| github-calendar | Components | calendário de contribuições | dados | B | perfil |
| grain-gradient | Hero Backgrounds | gradiente com grão | shader/CSS | M | fundo |
| hero-geometric | Hero Backgrounds | formas geométricas flutuantes | Motion | B | fundo de hero |
| hover-transition | Components | transição de hover por cartão (fotos trocam) | Motion | B | equipe/portfólio |
| image-ripple-effect | Visual Effects | ondulação na imagem ao passar o cursor | WebGL | A | ver `efeitos/11` (versão leve) |
| image-trail | Visual Effects | rastro de imagens | **GSAP** | M | ver `efeitos/03` |
| infinite-image-field | Components | campo infinito de imagens arrastável | canvas/Motion | A | galeria imersiva |
| kinetic-text-reveal | Text Animations | reveal cinético de texto | Motion | B | ver `efeitos/02` |
| layered-stack | Components | pilha de camadas com scroll | **GSAP** | M | ver `pilha-imagens-3d-scroll` |
| letter-cascade | Text Animations | letras caem em cascata | Motion | B | título de abertura |
| line-nav | Components | navegação por linha | CSS | B | menu |
| liquid-chrome | Visual Effects | metal líquido | WebGL | A | ver `logo-metal-liquido` |
| liquid-glass-carousel | Components | carrossel com vidro refrativo | WebGL/CSS | A | ver `vidro-refrativo-liquid-glass` |
| mac-keyboard | Components | teclado Mac com teclas reativas | CSS | M | demo de atalhos |
| magnetic-dock | Components | dock estilo macOS com magnificação (Solid Variant, Large Scale Effect) | Motion | B | ver snippet na SKILL; `efeitos/07` |
| magnet-lines | Visual Effects | linhas que apontam para o cursor | rAF | B | fundo interativo |
| matrix-rain | Visual Effects | chuva de caracteres | canvas | B | tech; `prefers-reduced-motion` |
| music-player | Components | player de música | Motion | B | demo |
| newsletter-bookshelf | Components | estante de newsletters | CSS 3D | M | conteúdo |
| orbit-card-stack | Components | cartões em órbita | Motion | M | ver `carrossel-globo-3d` |
| pixel-canvas | Visual Effects | canvas de pixels reativo ao hover | canvas | B | fundo de cartão |
| pixel-image-trail | Visual Effects | rastro pixelado de imagens | canvas | M | ver `efeitos/03` |
| prism-gradient | Hero Backgrounds | gradiente prismático | shader | M | fundo |
| ripple-transition | Visual Effects | transição em ondas | Motion/WebGL | M | ver `efeitos/10` |
| scroll-based-velocity | Text Animations | letreiro cuja velocidade segue o scroll | Motion | B | ver `efeitos/06` |
| scroll-choreography | Components | coreografia de elementos no scroll | Motion | M | narrativa; ver `efeitos/08` |
| scroll-split-card | Components | cartão que se divide no scroll | Motion | M | destaque |
| scroll-tilted-grid | Components | grade inclinada que rola | CSS 3D + scroll | M | portfólio |
| signature | Visual Effects | assinatura que se desenha | SVG stroke | B | ver `efeito-de-intro` |
| silk-aurora | Hero Backgrounds | seda/aurora | WebGL | A | fundo |
| spectral-ribbon | Visual Effects | fita espectral | WebGL | A | fundo |
| spiral-3d-slider | Components | slider em espiral 3D | CSS 3D | M | vitrine |
| split-flap-display | Text Animations | painel de aeroporto (letras giram) | CSS 3D | M | contador/rótulo |
| sticky-scroll-cards | Components | cartões grudam e empilham no scroll | scroll | B | ver `pilha-imagens-3d-scroll` |
| text-morph | Text Animations | texto muda de forma para outro | SVG/Motion | M | logo/título |
| text-repel | Text Animations | letras fogem do cursor | rAF | B | hero interativa |
| webgl-liquid | Visual Effects | líquido em WebGL | WebGL | A | fundo |
| wheel-carousel | Components | carrossel em roda | CSS 3D | M | ver `galeria-anel-cilindrico` |

Vistos no vídeo mas sem arquivo com esse nome exato na árvore lida: **Dish Card Stack** e o leque de cartões (provavelmente `case-study-flip-stack` ou `orbit-card-stack`), **Collection Surfer** (existe), **Fisheye Infinite Grid** (existe). Trate nomes de abas do site como categorias de docs, não como nomes de arquivo.
