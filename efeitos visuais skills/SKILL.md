---
name: efeitos-visuais-sites-premium
description: Replica os efeitos visuais de sites premium estilo Awwwards/Framer (Porta Studio, Ethan Clark, Campione, Operator, Avyron, Bureau Nine) em HTML/CSS/JS vanilla com GSAP e Lenis. Use esta skill SEMPRE que o usuário pedir um site com "cara premium", "estilo Awwwards", "efeitos como os sites do Framer", animações de scroll sofisticadas, tipografia gigante animada, cursor customizado, smooth scroll, reveal de imagens, preloader ou transições cinematográficas — mesmo que ele não cite os nomes dos sites de referência.
---

# Efeitos Visuais de Sites Premium (estilo Framer/Awwwards)

## Por onde começar

A biblioteca cresceu além deste catálogo. Antes de escolher um efeito, leia [GUIA-DE-USO.md](GUIA-DE-USO.md) (organização, árvore de decisão, o que cada skill faz) e as regras de [boas-praticas/animacao.md](boas-praticas/animacao.md). Para decidir *onde* uma página precisa de animação, use [quatro-familias-de-animacao/SKILL.md](quatro-familias-de-animacao/SKILL.md); para revisar antes de publicar, [boas-praticas/checklist-revisao-ui.md](boas-praticas/checklist-revisao-ui.md).

## Lote de 28/09/2026: onze posts do Instagram

Catálogo com fontes, evidências e licenças em [referencias/04-LOTE-2026-09-28.md](referencias/04-LOTE-2026-09-28.md). Skills novas: [logo-reveal-cinematico](logo-reveal-cinematico/SKILL.md) (batidas de reveal de logo, complementa a intro), [quatro-familias-de-animacao](quatro-familias-de-animacao/SKILL.md) (scroll · reveal · hover · click), [estilos-de-superficie-morphism](estilos-de-superficie-morphism/SKILL.md) (glass, clay, skeuo, neu), [blob-liquido-cursor](blob-liquido-cursor/SKILL.md) (blob com mola que revela outra camada, com demo), [fancy-components](fancy-components/SKILL.md) e [componentry](componentry/SKILL.md) (dois repositórios MIT de componentes React usados como referência, com mapa para o vanilla desta biblioteca), [video-de-lancamento-html](video-de-lancamento-html/SKILL.md) (vídeo de lançamento a partir do HTML, HyperFrames e o pipeline local), [ferramentas-agente-frontend](ferramentas-agente-frontend/SKILL.md) (MCPs, skills de revisão, `/arena`) e [biblioteca-de-secoes-e-prompts](biblioteca-de-secoes-e-prompts/SKILL.md). Nenhuma delas exige GSAP/Lenis; o setup abaixo é só do catálogo clássico.

## Intro / animação de entrada com o logo

Para qualquer pedido de intro, abertura ou animação do logo ao abrir o site (inclusive "igual à do Siteflux" ou "igual à do Vale do Aço Digital"), use [efeito-de-intro/SKILL.md](efeito-de-intro/SKILL.md). Ela tem as duas intros reais dissecadas, o catálogo de técnicas de animação vetorial, um template funcional e o roteiro de verificação. Não usa GSAP/Lenis: o setup abaixo não se aplica a ela.

## Novas referências: Reel design4me__

Para o Reel de cindie.zhu sobre código no GitHub, consulte [os quatro repositórios e suas skills](referencias/03-REEL-REPOS-DcxV37-CJOC.md): React Three Fiber, Liquid Glass JS, ShaderGradient e Liquid Logo. A escolha de framework, licença e dependências pertence a cada skill; não aplicar o setup geral automaticamente.

O segundo Reel, com Zentro, Foldex, Kai Marlow, Eric Cole, Noah Miles e Liam Bennet, tem um [catálogo de sete novas skills](referencias/02-REEL-PORTFOLIOS-DcTT-hUoYrz.md). Inclui anel cilíndrico, abertura CRT, colagens em camadas, índice com fundo imersivo, links por caractere, hero com miniaturas e alternância de layout. Cada skill separa observação da referência e técnica de reconstrução proposta.

Para os oito componentes do Reel enviado em 20/09/2026, consulte o [catálogo específico](referencias/01-REEL-DESIGN4ME.md). Para o carrossel com faixa curva, comece por [carrossel-liquido/SKILL.md](carrossel-liquido/SKILL.md). Essas skills têm suas próprias decisões técnicas: o setup GSAP/Lenis abaixo não é obrigatório para elas. São reconstruções propostas a partir do vídeo, não downloads dos componentes originais do Framer.

Esta skill ensina a recriar, em **HTML/CSS/JS vanilla + GSAP + Lenis** (sem Framer, sem frameworks), os efeitos característicos dos sites de referência listados em `referencias/00-SITES-DE-REFERENCIA.md`.

## Setup base (usar em TODO projeto que aplicar esta skill)

```html
<!-- Antes do fechamento do </body> -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/lenis/1.1.14/lenis.min.js"></script>
<script>
  gsap.registerPlugin(ScrollTrigger);
  // Smooth scroll global — ver efeitos/01-smooth-scroll-lenis.md
  const lenis = new Lenis({ lerp: 0.1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
</script>
```

## Catálogo de efeitos (um arquivo por efeito, na pasta `efeitos/`)

Leia SOMENTE os arquivos dos efeitos que o projeto pedir. Cada arquivo tem: onde o efeito aparece nos sites de referência, o código completo pronto para colar, e os parâmetros que valem a pena ajustar.

| Arquivo | Efeito | Visto em |
|---|---|---|
| `01-smooth-scroll-lenis.md` | Scroll suave/pesado, base de todos os outros | Todos |
| `02-texto-revelado-linha-por-linha.md` | Títulos que sobem linha a linha com máscara (split text) | Porta, Ethan Clark |
| `03-cursor-com-rastro-de-imagens.md` | Imagens que seguem o mouse deixando rastro | Ethan Clark |
| `04-imagem-revelada-com-mascara.md` | Imagens que se revelam com clip-path ao entrar na tela | Porta, Campione |
| `05-tipografia-gigante-esticada-no-scroll.md` | Título enorme que escala/estica conforme o scroll | Campione, Operator |
| `06-marquee-letreiro-infinito.md` | Faixa de texto que corre sem parar (velocidade reage ao scroll) | Campione, Avyron |
| `07-botao-magnetico.md` | Botão que "gruda" e segue o mouse | Porta, Avyron |
| `08-galeria-horizontal-no-scroll-vertical.md` | Seção que trava e rola na horizontal | Porta, Campione |
| `09-preloader-com-contador.md` | Tela de carregamento com contador 0→100 e cortina | Porta, Operator |
| `10-transicao-de-pagina-cortina.md` | Cortina que cobre a tela ao trocar de página | Porta, Ethan Clark |
| `11-hover-com-distorcao-na-imagem.md` | Zoom/escala interna da imagem no hover do card | Todos |
| `12-menu-fullscreen-overlay.md` | Menu que toma a tela com stagger nos links | Campione, Avyron |
| `13-estetica-terminal-dossie.md` | Estética "dossiê/terminal" dark (Bureau Nine) | Bureau Nine |

## Regras de qualidade ao aplicar

1. **Menos é mais**: sites premium usam 3–5 efeitos bem-feitos, não todos de uma vez. Combinação clássica: 01 + 02 + 04 + 11 (+ 09 se for landing de impacto).
2. **Easing**: use `power4.out` ou `expo.out` para entradas; duração 0.8–1.4s. Nunca `ease: "none"` fora de marquees/scrub.
3. **Tipografia**: fontes grandes (clamp de 3rem a 10rem no hero), tracking apertado (-0.03em), muito espaço em branco.
4. **Respeite `prefers-reduced-motion`** — desative efeitos decorativos quando ativo.
5. Sempre teste que os efeitos não quebram no mobile (cursor trail e magnético devem ser desativados em telas touch).
