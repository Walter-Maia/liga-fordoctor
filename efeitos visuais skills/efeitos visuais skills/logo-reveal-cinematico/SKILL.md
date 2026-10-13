---
name: logo-reveal-cinematico
description: Catálogo de "batidas" de reveal de logo no estilo motion graphics (numeral que flipa, pop de fundo em cor chapada, desintegração em partículas, wireframe que acende e preenche, monograma que expande para o nome, espelhamento, resolução final) traduzidas para SVG + CSS/WAAPI/canvas. Use quando o pedido falar em "logo animation", "animação do logo estilo After Effects", "reveal cinematográfico da marca", "intro com partículas", "logo que se desmonta e monta" ou quando a skill efeito-de-intro precisar de batidas além de traço-que-se-desenha e letras em sequência.
---

# Logo reveal cinematográfico (batidas de motion graphics para a web)

Complementa [efeito-de-intro/SKILL.md](../efeito-de-intro/SKILL.md): aquela skill dá o fluxo obrigatório (briefing → vetores oficiais → camadas → roteiro → template → verificação por quadros) e a infraestrutura segura (failsafe, pular, movimento reduzido, aba oculta). Esta skill acrescenta um **catálogo de batidas** vindas de um logo animation de estúdio, com a tradução de cada uma para tecnologia web. Não substitui o fluxo; entra no passo 3 (escolher técnica por camada) e no passo 4 (roteiro com tempos).

## Referência

Post: [Reel DduzTGdMV5w](https://www.instagram.com/reels/DduzTGdMV5w/), the_odin_studio, legenda "Logo animation concept #aftereffects #logo #designer #motion". Inspecionado em 28/09/2026 quadro a quadro em 2 quadros/s. Duração 17,3 s, 720×1280, filmado de um notebook (a tela do vídeo ocupa a parte central; há reflexos, por isso cores são aproximadas). Marca fictícia ou de cliente: monograma **112** e nome **oneonetwo**, tagline **Everything's Ready**. Evidência local: `qa/reels-2026-09-28/DduzTGdMV5w-p01.jpg` a `-p03.jpg`.

Batidas observadas (tempos aproximados):

| Trecho | Observado no vídeo | Nome da batida |
|---|---|---|
| 0,0–1,5 s | "11" branco sobre preto gira no eixo vertical e vira "112"; leve sobreposição de cópias na virada | Flip do numeral |
| 2,0–2,5 s | Fundo vira branco de uma vez; letras do nome entram deslizando e assentam em "oneonetwo" | Pop de fundo + nome |
| 3,0–3,5 s | Fundo vermelho chapado, "112" preto | Pop de fundo (2) |
| 4,0–4,5 s | O "112" se fragmenta em cubos/retângulos que se espalham em anel e somem | Desintegração |
| 5,0–6,0 s | "112" reaparece em azul/roxo sobre preto; depois fundo azul com "112" branco | Recomposição + pop (3) |
| 6,5–7,0 s | "112" em contorno branco, meio apagado, sobre preto | Wireframe |
| 7,5–9,5 s | "112 oneonetwo" grande em contorno, brilho percorre, fecha em preenchimento branco com a tagline abaixo | Wireframe → preenchimento |
| 10,0–12,5 s | Fundo branco; tagline sozinha com cursor vermelho piscando; "112" fino vermelho; nome completo em preto | Assinatura tipográfica |
| 13,0–14,5 s | Fundo laranja-vermelho; mockup de celular com o perfil da marca | Contexto (mockup) |
| 14,5–15,0 s | Pôster/cartaz com foto e blocos vermelhos; blocos se dispersam em quadrados | Contexto (pôster) + dispersão |
| 15,5–17,0 s | "112" vermelho sobre branco; um quadro espelhado horizontalmente; assenta no logo final menor | Espelho + resolução |

A peça é um **vídeo** de portfólio: usa 5 trocas de fundo chapado e ~10 batidas em 17 s. Em um site, isso é demais. O valor aqui é o vocabulário; o roteiro do site usa 3–4 batidas em 2,4–3,5 s.

## Quando usar / quando não usar

Use quando a marca tem um **símbolo ou monograma** que aguenta ser desmontado (formas geométricas, numerais, letras pesadas) e o briefing pede impacto de abertura. Combine no máximo: uma batida de entrada (flip **ou** desintegração invertida **ou** wireframe), uma de expansão (monograma → nome) e uma de resolução (assentar + tagline).

Não use quando: o logo é um lettering fino ou uma fotografia; a página é de conversão direta com tráfego pago (cada segundo antes do conteúdo custa); o cliente já reclamou da intro (o Siteflux 2.37 manteve a intro por decisão do Walter, mas "encurtar segue em aberto"); ou quando o site já tem outra animação forte no hero. Nunca girar, esticar ou espelhar a **palavra** do logo: rotação, flip e espelho só no símbolo/monograma (regra da skill de intro).

## Tradução de cada batida para a web

Todas usam só `transform`, `opacity`, `clip-path`, `stroke-dashoffset` e `fill`/`stroke` (cor). Nada de `filter: blur` em tela cheia, nem animar `width/height`. Os vetores vêm do SVG oficial (ver "Preparar o SVG" em [efeito-de-intro/references/metodo-animacao-vetorial.md](../efeito-de-intro/references/metodo-animacao-vetorial.md)).

### 1. Flip do numeral (rotação no eixo Y)

Reconstrução proposta: o grupo do símbolo gira 180° em Y com `perspective`, e no meio da virada troca o estado (por exemplo, "11" → "112" ou contorno → preenchido).

```css
.intro__simbolo { transform-origin: 50% 50%; transform-box: fill-box; }
.intro--rodando .intro__simbolo { animation: flipY 900ms cubic-bezier(.45, 0, .2, 1) both; }
@keyframes flipY {
  0%   { transform: perspective(900px) rotateY(0); }
  50%  { transform: perspective(900px) rotateY(90deg); }   /* aqui o JS troca a classe de estado */
  100% { transform: perspective(900px) rotateY(180deg); }
}
```

No `<svg>`, `perspective()` dentro de `transform` só funciona em elementos HTML; se o símbolo for um `<g>` interno, envolva o SVG em um `<div>` e gire o `div`. Em SVG puro, simule com `scaleX(1 → 0 → -1)` (achatamento), que visualmente lê como flip. Um leve "eco" (cópia com `opacity: .35` atrasada 60 ms) reproduz a sobreposição vista no vídeo.

### 2. Pop de fundo em cor chapada

Observado: a tela inteira troca de cor de uma vez e o logo troca de cor por contraste. Na web isso é um flash; a regra de fotossensibilidade (WCAG 2.3.1) limita a 3 flashes por segundo, e o bom senso limita a **um** pop por intro, nunca em sequência preto→branco→vermelho.

Reconstrução: um `div` de fundo com `background-color` em transição de 180 ms (`background-color` não é compositor-friendly, mas uma única troca em elemento sem filhos é barata) e o logo com `fill: currentColor` herdando `color` do overlay. Preferir "pop" de uma cor escura da marca para a cor mais clara, uma vez, no momento de assentar.

```css
.intro { background: var(--marca-escura); color: #fff; transition: background-color 180ms linear, color 180ms linear; }
.intro--assentou { background: var(--marca-clara); color: var(--marca-escura); }
```

### 3. Desintegração em cubos e recomposição

Observado: o numeral se parte em ~20 retângulos que se afastam em anel e somem; depois o logo volta inteiro. Na web, a versão invertida (peças convergem para formar o logo) serve melhor como entrada.

Reconstrução com SVG, sem canvas: recorte o símbolo em N `<use>` com `clip-path` retangular (grade 4×5) e anime cada peça com `translate` a partir de um deslocamento radial e `opacity: 0 → 1`, com `animation-delay` por peça.

```html
<svg viewBox="0 0 400 300" class="intro__peças" aria-hidden="true">
  <defs>
    <symbol id="logo"><!-- paths oficiais --></symbol>
    <clipPath id="c-0-0"><rect x="0" y="0" width="100" height="60"/></clipPath>
    <!-- gerar as demais clipPaths com um laço no build ou no JS -->
  </defs>
  <g class="peça" style="--dx:-140px; --dy:-90px; --i:0" clip-path="url(#c-0-0)"><use href="#logo"/></g>
</svg>
```

```css
.peça { animation: convergir 700ms cubic-bezier(.22, 1, .36, 1) calc(var(--i) * 28ms) both; }
@keyframes convergir {
  from { transform: translate(var(--dx), var(--dy)) rotate(12deg); opacity: 0; }
  to   { transform: none; opacity: 1; }
}
```

Até ~40 peças roda bem em celular. Acima disso, ou se quiser cubos com espessura, use canvas 2D desenhando o logo em um offscreen canvas, lendo `getImageData` em blocos e animando os blocos por `requestAnimationFrame` (pausar em `document.hidden`). Canvas é "proposta"; o vídeo não mostra a técnica.

### 4. Wireframe que acende e preenche

Observado: logo e nome em contorno fino, um brilho percorre a linha e o preenchimento fecha. É a combinação de duas técnicas já documentadas na skill de intro (traço que se desenha + preenchimento por máscara), com um passo a mais: o brilho.

```css
.intro__traço { fill: none; stroke: currentColor; stroke-width: 2; stroke-dasharray: 1; stroke-dashoffset: 1; pathLength: 1; }
.intro--ativa .intro__traço { animation: desenhar 1100ms cubic-bezier(.45, 0, .2, 1) both; }
@keyframes desenhar { to { stroke-dashoffset: 0; } }

/* brilho: segundo traço curto que percorre o mesmo caminho */
.intro__brilho { fill: none; stroke: #fff; stroke-width: 3; stroke-dasharray: .08 1; stroke-dashoffset: 1.08; pathLength: 1; opacity: .9; }
.intro--ativa .intro__brilho { animation: correr 900ms 700ms linear both; }
@keyframes correr { to { stroke-dashoffset: 0; opacity: 0; } }

/* preenchimento: clip-path sobe de baixo para cima */
.intro__cheio { clip-path: inset(100% 0 0 0); }
.intro--ativa .intro__cheio { animation: encher 500ms 1400ms cubic-bezier(.22, 1, .36, 1) both; }
@keyframes encher { to { clip-path: inset(0 0 0 0); } }
```

Use `pathLength="1"` como atributo no `<path>`; não use `vector-effect: non-scaling-stroke` junto com zoom de câmera (travou a pintura no Chromium, ver infraestrutura da skill de intro).

### 5. Monograma que expande para o nome completo

Observado: "112" à esquerda e "oneonetwo" surge à direita com deslocamento horizontal, tagline em seguida. Reconstrução: o símbolo faz `translateX` para a posição final (medida no layout final, não "de olho") enquanto cada letra do nome entra com `translateY(.35em) → 0` e `opacity`, stagger 0,05–0,07 s; a tagline entra por último com `opacity` só.

O deslocamento do símbolo é calculado uma vez: renderize o estado final, meça `getBoundingClientRect()` do símbolo, compare com o estado inicial centrado e anime `transform` (FLIP). Não animar `left`.

### 6. Cursor piscando e assinatura tipográfica

Observado: a tagline aparece sozinha com um cursor vermelho piscando, como digitação. Reconstrução: `::after` com `border-right: 2px solid` e `animation: piscar 1s steps(2, start) infinite` **enquanto a intro roda**; parar quando assentar (loops infinitos não podem sobreviver à intro). Digitação real (letra a letra) é opcional; em sites, uma linha curta com fade lê melhor que digitar.

### 7. Contexto (mockup, pôster) e dispersão de blocos

Observado: mockup de celular com perfil e um pôster cujos blocos vermelhos se dispersam. Isso é material de vídeo de portfólio; em um site, o "contexto" é a própria hero aparecendo por baixo da intro. Se quiser o eco da dispersão, use 6–10 retângulos da cor de acento saindo de trás do logo (`translate` + `opacity`) na dissolução final, 300 ms, e nada mais.

### 8. Espelho e resolução

Observado: um quadro espelhado horizontalmente e o logo assenta menor, vermelho sobre branco. O espelho é um corte de vídeo; na web, um `scaleX(-1)` momentâneo no **símbolo** lê como glitch e é desnecessário. A resolução (logo assenta em escala menor, cor final) é obrigatória: é a transição para a hero. Use `scale(1.08 → 1)` com `cubic-bezier(.34, 1.56, .64, 1)` (overshoot leve) e a dissolução de 0,45–0,55 s do template.

## Roteiro-modelo para site (3,0 s + 0,5 s de dissolução)

Um roteiro autoral que usa quatro batidas, no padrão de tabela da skill de intro. Ajuste às camadas do logo real.

| Camada | Técnica | Início | Duração | Easing |
|---|---|---|---|---|
| fundo | cor escura da marca, sólido | 0 | — | — |
| símbolo (peças) | convergir (batida 3, invertida), 20 peças, stagger 28 ms | 0,10 s | 0,70 s + 0,53 s de stagger | `cubic-bezier(.22, 1, .36, 1)` |
| símbolo (traço) | desenhar + brilho (batida 4) | 0,90 s | 1,10 s / brilho 0,9 s | `cubic-bezier(.45, 0, .2, 1)` |
| símbolo (preenchimento) | clip-path sobe (batida 4) | 2,00 s | 0,50 s | `cubic-bezier(.22, 1, .36, 1)` |
| símbolo | desloca para a esquerda (FLIP) (batida 5) | 2,10 s | 0,60 s | `cubic-bezier(.22, 1, .36, 1)` |
| letras do nome | sobem uma a uma, stagger 0,06 s (batida 5) | 2,20 s | 0,45 s cada | `cubic-bezier(.22, 1, .36, 1)` |
| fundo + cor | um pop para a cor clara (batida 2) | 2,70 s | 0,18 s | linear |
| tagline | fade | 2,80 s | 0,30 s | ease-out |
| conjunto | assenta com `scale(1.06 → 1)` (batida 8) | 2,90 s | 0,35 s | `cubic-bezier(.34, 1.56, .64, 1)` |
| overlay | dissolução para a hero | 3,00 s | 0,50 s | ease-in |

Total: 3,5 s. Acima de ~4 s, corte batidas, nunca acelere tudo (fica nervoso).

## Parâmetros que valem ajustar

- Número de peças da desintegração (12–40) e raio de dispersão (`--dx/--dy` entre 0,3× e 0,6× da largura do logo).
- Stagger das peças (20–35 ms) e das letras (50–70 ms).
- Espessura do traço em px de tela (≥ 1,5 px em qualquer escala; abaixo de ~1 px o Chromium falha).
- Cor do pop: sempre entre a cor mais escura e a mais clara da paleta oficial; nunca uma cor nova.
- Overshoot da resolução (`1.56` no bezier é o máximo; `1.2` para marcas sóbrias).

## Acessibilidade, mobile e aba oculta

- `prefers-reduced-motion: reduce`: mostrar o logo montado e a hero sem intro (o template já faz). Não oferecer "versão reduzida" com pop de fundo.
- Fotossensibilidade: no máximo um pop de fundo; sem piscar repetido além do cursor (que para ao assentar).
- Pular: Escape/Tab/roda/toque/clique conforme a skill de intro; sem botão visível no Siteflux por decisão do Walter.
- Celular: reduzir peças para 12–16 e desligar o brilho do traço (custo de repaint em telas 3×); testar em 360×640 emulado. Nenhum celular físico disponível nesta máquina; registrar isso.
- Aba oculta: animações CSS continuam contando o relógio; ao voltar, a intro pode estar no fim. O template usa `visibilitychange` para pular direto; conferir com `el.getAnimations({subtree: true})` na volta (armadilha registrada no harness de QA).
- Sem JS: o failsafe CSS do template revela a hero; as peças em `opacity: 0` **não** podem depender de JS para aparecer (usar `animation` só quando `.intro--ativa` for adicionada, e a hero visível por padrão).

## Verificação

1. Gerar quadros com [efeito-de-intro/scripts/capturar-quadros.js](../efeito-de-intro/scripts/capturar-quadros.js) a cada 0,1 s e conferir contra a tabela do roteiro: as peças convergiram antes do traço começar; o brilho terminou antes do preenchimento; o pop aconteceu uma vez.
2. Medir o custo no harness de CDP (`qa/fluidez-responsividade/ferramentas/`): frames longos > 50 ms durante a convergência indicam peças demais ou `filter` esquecido. Lembrar que o Edge headless alterna 240/60 Hz entre execuções; comparar séries válidas (`vezesOculta = 0`).
3. Testar Escape aos 0,5 s, aba oculta aos 1,0 s e movimento reduzido. Sem JS (bloquear o script) a hero aparece.
4. Contar flashes: um.

## Limites e licença

O vídeo é uma peça de After Effects de terceiro; nada dele é reutilizável (marca "112/oneonetwo", pôster, fotos). Esta skill descreve batidas visuais genéricas e propõe reconstruções autorais em CSS/SVG. A técnica de canvas para partículas é proposta não demonstrada no vídeo. Cores lidas de uma tela filmada são aproximadas. Use sempre os vetores e a paleta oficiais do projeto de destino.
