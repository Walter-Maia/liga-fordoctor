---
name: blob-liquido-cursor
description: Criar uma hero com um blob líquido que segue o cursor com física de mola, estica em gota quando o movimento é rápido, solta gotículas que voltam e se fundem, e funciona como janela que revela outra camada (a "versão código", o modo escuro, os bastidores). Use quando pedirem "blob que segue o mouse", "liquid blob", "revelar o código/modo escuro com o cursor", "lupa líquida" ou "hero igual à do Reel da tegadesigns".
---

# Blob líquido que segue o cursor e revela outra camada

## Referência

[Reel de tegadesigns1](https://www.instagram.com/reels/DdzP81-ht_4/), "Portfolio reveal (Liquid blob physics) step by step", 18,9 s, inspecionado em 28/09/2026 a 2 quadros/s. Evidência: `qa/reels-2026-09-28/DdzP81-ht_4-p01.jpg` a `-p04.jpg`.

Observado (não é reconstrução):

- 0–6 s: hero clara com título "I build software that feels **good** / **fast** / **alive**." A última palavra alterna com um marca-texto laranja atrás; texto de apoio e botão "Download CV"; rodapé "Move your cursor to see the code".
- Um blob azul-marinho segue o cursor **com atraso e ultrapassagem** (mola): ao parar, ele ainda oscila nas bordas. Em movimento rápido vira **gota alongada** no eixo do movimento (quadros 2,5–3,5 s) e solta **gotículas** que ficam para trás e depois voltam e se fundem (quadros 4,5–5,5 s).
- Dentro do blob aparece a **mesma hero em "versão código"** (`className="hero"`, `{"alive"}`, fonte mono clara sobre fundo escuro), como se o blob fosse uma janela para outra camada alinhada pixel a pixel.
- 6,5–13 s: processo. A autora sobe uma imagem e um vídeo de referência no Claude, cola um prompt ("I am not a designer, I am a developer... I want everything highly animated... reveals the dark mode when you scroll"), escolhe "Opus 5.5 medium ou Fable 5" e recebe um artefato `liquid-code-reveal-hero`. A resposta do agente descreve o comportamento: "lags and wobbles; follows your finger on a spring; trails behind, overshoots a little; stretches when you move fast; quick swipe pulls it into a long teardrop and throws off droplets; the droplets get pulled back and merge into the main blob".
- 13–18,9 s: resultado rodando com as três palavras alternando.

O vídeo não mostra código, valores de mola, comportamento no toque nem leitor de tela. Tudo abaixo disso é **reconstrução proposta**.

## Quando usar / quando não usar

Usar em uma hero ou seção-assinatura de portfólio pessoal, estúdio ou produto de desenvolvedor, quando a "outra camada" tem significado (código por trás do site, modo escuro, bastidores, antes/depois). Um efeito por página; ele é a peça memorável, o resto fica quieto.

Não usar quando o conteúdo por baixo é denso (tabelas, preços, formulário), quando não há ponteiro fino como público principal (app de celular), ou junto com outro efeito de cursor (rastro de imagens, cursor customizado, botão magnético em toda a página). Não usar como decoração sem camada revelada: aí vira só um círculo atrapalhando a leitura.

## Implementação (template funcional)

[template/blob-liquido-demo.html](template/blob-liquido-demo.html) é autônomo, sem dependências, e já cumpre as regras de acessibilidade abaixo. Estrutura em três camadas dentro de `.hero` (`isolation: isolate`):

1. **Camada normal** (`z-index: 0`): a hero legível, com o `<h1>`, apoio e CTA. É o que existe sem JS.
2. **Camada goo** (`z-index: 1`, SVG, `pointer-events: none`): desenha o blob principal e as gotículas na cor do blob, com o filtro `feGaussianBlur → feColorMatrix (alpha ×24 −12) → feComposite atop`. É ela que produz os "pescoços" entre gotícula e corpo.
3. **Camada código** (`z-index: 2`, `pointer-events: none`): o mesmo conteúdo em "modo código", fundo da mesma cor do blob, recortada por `clip-path: path("…")` com a **união** do blob principal (gota) e dos círculos das gotículas. Como o fundo é igual ao da camada goo, só os pescoços do goo ficam visíveis fora do recorte, e dentro dele aparece o texto.

Por quadro (`requestAnimationFrame`):

- **Mola**: `vel += (alvo − pos) · rigidez · dt; vel *= amortecimento^dt; pos += vel · dt`, com `dt` em quadros de 16,7 ms limitado a 2 (evita salto após aba oculta).
- **Gota**: alongamento `s = min(esticaMax, |vel| / velEstica)`. A forma é uma elipse assimétrica rotacionada no ângulo da velocidade: raio atrás `r·(1 + 1,15·s)`, na frente `r·(1 + 0,35·s)`, transversal `r·(1 − 0,28·s)`. Gera-se um `path` de 36 pontos; é barato.
- **Gotículas**: quando `|vel| > velGota`, há vaga (`gotasMax`) e passaram 90 ms da última, nasce um círculo na traseira com velocidade oposta a 35 % da do blob. Cada uma tem mola própria (mais mole) para um ponto deslocado do centro; ao chegar a `fundir · r` do centro, é removida (o goo já a mostrou se fundindo).
- **Dormir**: quando velocidade, distância ao alvo e gotículas zeram, o laço para; `pointermove` acorda.
- **Palavra rotativa**: `setTimeout` de 2,4 s; a cópia visível está em `aria-hidden`, e uma cópia fixa `.sr-only` ("good.") dá a frase estável ao leitor de tela; a troca some/volta o marca-texto por `transform: scaleX`.

Para integrar em um site existente: copie as três camadas mantendo o **mesmo conteúdo e o mesmo layout** nas camadas normal e código (mesma grade, mesmos tamanhos de fonte em `clamp`, mesma ordem), senão a "janela" mostra outra coisa e o efeito quebra. Dê à camada código a cor de fundo igual a `--tinta`.

## Parâmetros

| Parâmetro | Padrão | Efeito | Faixa útil |
|---|---|---|---|
| `--raio` | 120 px | tamanho do blob em repouso | 80 px celular · 140 px telas grandes |
| `rigidez` | 0,085 | quanto a mola puxa por quadro | 0,05 flutuante · 0,12 seco |
| `amortecimento` | 0,82 | perda de velocidade por quadro | 0,75 muito elástico · 0,90 quase sem oscilar |
| `esticaMax` | 0,9 | alongamento máximo relativo | 0 desliga a gota · 1,2 caricato |
| `velEstica` | 28 px/quadro | velocidade em que o alongamento satura | 20–40 |
| `gotasMax` | 4 | gotículas simultâneas | 0 desliga · 6 |
| `velGota` | 22 px/quadro | velocidade mínima para soltar gotícula | 15–35 |
| `gotaRaio` | 0,22 | raio da gotícula (× raio) | 0,15–0,3 |
| `gotaRigidez` / `gotaAmort` | 0,05 / 0,86 | mola das gotículas | mais mole que a principal |
| `fundir` | 0,55 | distância (× raio) em que a gotícula desaparece | 0,4–0,7 |
| `stdDeviation` do goo | 10 | espessura dos pescoços | 6–14; acompanha o raio |

Regra de bolso: `amortecimento` mais alto pede `rigidez` mais alta para não parecer "lento e mole". Teste sempre um movimento lento, um rápido e uma parada seca.

## Acessibilidade, toque, movimento reduzido, aba oculta

- **Sem JS**: a camada normal está completa; o blob e a camada código simplesmente não aparecem (`clip-path` inicial vazio).
- **Toque / sem hover** (`hover: none`): nada segue o dedo. O blob descansa em posição fixa e um botão "Ver o código" (`aria-pressed`, `aria-controls`) alterna a camada inteira, que só então deixa de ser `aria-hidden`. Manter `touch-action: pan-y` na hero para não roubar a rolagem.
- **`prefers-reduced-motion: reduce`**: sem mola (o blob vai direto ao ponteiro), sem gotículas, marca-texto sem transição, botão de alternância sempre visível. É uma versão útil, não uma versão quebrada.
- **Leitor de tela**: uma única frase estável; a palavra rotativa e a camada código são `aria-hidden`. Nunca usar `aria-live` na troca de palavra.
- **Teclado**: o CTA da camada normal continua focável e com `:focus-visible`; a camada código não tem elementos focáveis enquanto recortada.
- **Aba oculta e fora da tela**: `visibilitychange` e `IntersectionObserver` param o laço; ao voltar, o `dt` limitado evita o pulo. Lembrar que em aba oculta o estilo não é recalculado; medir só ao reabrir (ver memória do harness de QA).
- **Fotossensibilidade**: não há flashes; a troca de palavra é lenta (2,4 s).

## Verificação

Uma captura parada não prova mola. Roteiro mínimo, com o harness CDP do projeto ou capturas manuais:

1. Movimento lento em linha: 6 quadros a 100 ms; o blob deve ficar atrás do ponteiro e alcançá-lo com uma oscilação pequena.
2. Arrasto rápido e parada seca: 10 quadros; esperar gota alongada no eixo do movimento, 2–4 gotículas atrás, retorno e fusão em menos de 1,5 s, blob circular no fim.
3. Repouso: após 2 s parado, `rodando === false` (laço dormiu) e nenhum `requestAnimationFrame` pendente.
4. Toque emulado: nenhuma movimentação com o dedo; botão alterna e o foco permanece no botão; rolagem vertical livre.
5. `prefers-reduced-motion` emulado: sem gotículas, blob colado ao ponteiro.
6. Aba oculta 5 s e volta: sem salto do blob nem acúmulo de gotículas.
7. Leitor de tela ou árvore de acessibilidade: o `<h1>` expõe uma frase só.
8. Zoom 200 % e largura 360 px: as duas camadas continuam alinhadas (mesma quebra de linha).

Registre os quadros em `qa/<etapa>/` e diga o que não foi testado (celular físico, Safari).

## Limites e licença

- `clip-path: path()` com união de subcaminhos usa preenchimento nonzero; formas sobrepostas somam, como se espera. Firefox e Safari suportam; Safari antigo pode ignorar `path()` e mostrar a camada código inteira: use `@supports (clip-path: path("M0 0"))` para ligar a camada código só onde há suporte.
- O filtro goo sobre a hero inteira custa GPU; limite o `<svg>` à hero e não empilhe outros filtros. Em CPU 4× o ritmo cai; aceite reduzir `gotasMax` para 2 em telas pequenas.
- A camada código duplica o conteúdo no DOM; mantenha-a curta e `aria-hidden` quando recortada.
- Não há código de terceiros aqui. O artefato do Reel é da autora; a reconstrução é autoral. Se o pedido citar "igual ao da tegadesigns", use o [briefing-modelo](references/briefing-modelo.md) para transformar o pedido em requisitos verificáveis antes de codar.
