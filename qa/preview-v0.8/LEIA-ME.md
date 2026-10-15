# QA da v0.8.0 — o hero refeito com olhar de motion design (15/10/2026)

Edge headless (Windows), servidor local. Decisão: 23 em `DIRECAO-DESIGN.md`. Roteiro em segundos: `build/gera-roteiro.mjs` (gera os @keyframes da cena, os segmentos do traço e da luz, o caminho da ponta da caneta e as setas do quadro estático; roda no `npm run build`); resumo comentado no bloco "Constelação do hero" de `src/assets/liga.css`.

## O que mudou no hero

Saíram o envelope, a folha do contrato, as moedas com "$", o rastro de pontos, as ondas, a mola, os halos e a flutuação. O próprio símbolo conta a indicação (um S com uma seta para cada lado: ida e volta):

| tempo (desde a primeira pintura) | o que acontece |
|---|---|
| 0–1,1 s | entrada: o contorno do símbolo se desenha e acende; os formandos aparecem subindo 6 px (você, o colega, depois a rede) |
| 1,1–1,45 s | você acende: aro e etiqueta dourados |
| 1,25–2,15 s | o traço dourado se desenha de você até o colega, por baixo, puxado pela ponta da caneta |
| 2,05–2,55 s | o colega acende e ganha o crédito dele: "+R$ 500", com o visto |
| 2,5–3,0 s | o traço segue do colega até a ponta direita do símbolo |
| 2,98–3,78 s | a luz percorre o S de uma seta à outra |
| 3,7–4,2 s | o traço sai pela ponta esquerda e volta até você |
| 4,1–4,7 s | o crédito chega: um brilho em você, o cartão sobe e o valor rola até 200 (odômetro) |
| 4,8 s | a cena para no quadro final (a própria composição estática) |

Formandos em traço, sem rosto, no desenho de linha dos ícones da página. Valores da seção Indicação (o colega recebe R$ 500 de crédito; quem indica, R$ 200 em crédito na mensalidade).

Como é feito: tudo o que se move na cena é `transform` ou `opacity` em HTML, que a GPU anima sem a thread principal. O traço é feito de 63 segmentos curtos que crescem (`scaleX`); a luz do S, de 75 segmentos claros sobre a linha central do traço do símbolo, que o build corrige contra o contorno oficial (885 pontos, desvio máximo de 0,89 unidade); o valor é um odômetro (fitas de dígitos que sobem). Cada segmento tem o seu @keyframes do tamanho da cena, então todos começam e terminam juntos.

## `hero-cena/` — `node qa/scripts/com-servidor.js qa/scripts/hero-cena.js --video`

Pausa a entrada logo no carregamento, liga a cena e fotografa 10 instantes (0,5 · 1,2 · 1,7 · 2,6 · 2,9 · 3,4 · 3,95 · 4,25 · 4,5 · 4,8 s) em 1440 × 900, 1024 × 768, 390 × 844 @2 e 320 × 640 @2.

- `<largura>-folha.jpg`: os 10 instantes lado a lado; `<largura>-t<s>.jpg`: cada instante.
- `cena-1440.mp4` e `cena-390.mp4`: do carregamento ao quadro final, mais 1 s parado (30 quadros/s).
- `<largura>-estatico-reduzido.jpg` e `<largura>-estatico-sem-js.jpg`: o quadro final sem animação (1440, 390 e 320).
- `resultado.json`: medições.

Resultado: em todos os instantes e larguras, nenhuma etiqueta encosta em outra, num formando que não é o dela ou no símbolo; nada sai da caixa do hero; nenhuma fonte abaixo de 13 px; a ponta da caneta não passa por cima da rede nem das etiquetas; sem rolagem lateral; o odômetro termina em 200. No quadro final, o cartão do crédito não cobre o traço em 1440 (fica acima de você); nas colunas estreitas (1024, 390, 320) ele fica abaixo e cobre 10–15% da curva de baixo, que passa por trás dele.

Duração real, sem congelar: a cena liga 1,1 s depois da primeira pintura e a última animação do hero termina 4,8–4,9 s depois dela; nenhuma animação infinita na página (WCAG 2.2.2). Aba oculta: tudo para e continua de onde parou. Hero fora da tela: entrada e cena voltam ao início e tocam de novo na volta. Movimento reduzido e sem JS: zero animações rodando e o quadro final completo, sem sobreposição, com o valor em 200. Sem erros de console.

Ajustes feitos durante o teste: o cartão do crédito cobria 22% da curva de baixo em 1440 (subiu para cima de você); depois, em uma linha, quase encostava no laço do símbolo (passou para duas linhas em todas as telas); a ponta da caneta ficava visível no lugar de você antes de o formando entrar (agora aparece só quando o traço começa); os formandos entravam fora de ordem (agora você, o colega e depois a rede).

## `desempenho/` — `node qa/scripts/com-servidor.js qa/scripts/hero-desempenho.js depois`

CPU 4× mais lenta. Duas janelas: "cena" (os 3,7 s a partir de `.em-cena`) e "parado" (3 s depois do quadro final). `sem-hero.json` é a mesma medição com o hero escondido (`QA_CSS='.constelacao{display:none}'`): o que sobra são as outras entradas da página no mesmo intervalo.

| thread principal (ms por segundo) | 1440 na cena | 390 na cena | depois da cena |
|---|---|---|---|
| página sem o hero | 35 | 335 | 0–6 |
| v0.8, primeira versão (traço em `stroke-dashoffset`, máscara na luz, contador) | 790 | 700 | 0–10 |
| **v0.8 final** (`depois.json`) | **77** | **357** | **0–1** |
| v0.7, para comparar (ciclo infinito, sempre) | 11–23 | 11–23 | 11–23 |

O hero custa ≈ 42 ms/s no desktop e ≈ 22 ms/s no celular durante os 3,7 s da cena, e zero depois; quase não repinta (2 pinturas em toda a cena no desktop). O que derrubava a primeira versão: (1) três animações que só a thread principal faz (o traço da máscara, o visto e o contador `@property`), que obrigavam o navegador a montar o quadro inteiro a cada frame; (2) os segmentos terminando cada um num instante diferente, o que acordava a thread principal quase todo quadro; agora todos terminam juntos. Diagnóstico pelo trace do navegador (eventos `Animation` com `compositeFailed`) e por eliminação com `QA_CSS`.

## `../responsivo-v0.8/` — `node qa/scripts/com-servidor.js qa/scripts/responsivo.js`

18 de 18 telas OK (280 a 2560 px): sem estouro, texto cortado, alvos de toque pequenos ou viúvas; CTA na dobra; imagens nítidas; fonte Dosis carregada; hero estático sem sobreposição. Sem erros de console.

## `funcional/` — `node qa/scripts/com-servidor.js qa/scripts/v06-funcional.js`

Primeiro Tab no "Pular para o conteúdo"; CTA fixo do celular aparece depois do hero e some no formulário; tom do cabeçalho segue a caixa de baixo; formulário vazio marca os 5 campos e foca o primeiro; máscara do WhatsApp; envio simulado (enviando → sucesso com foco); `?erro=1` mostra o erro e libera o botão; FAQ abre e fecha; com `?intro=1` a cena do hero fica parada durante a intro e liga 4,4 s depois do carregamento. Sem erros de console.

## `comparacao/v07-x-v08-1440.mp4`

12 s lado a lado: a v0.7 (ciclo de 12 s) à esquerda e a v0.8 à direita (toca uma vez e fica no quadro final). A página da v0.7 continua em `qa/preview-v0.7/pagina/`: `RAIZ=qa/preview-v0.7/pagina PORT=4174 node build/serve.mjs`.

## Não testado

Safari (iOS e macOS), Firefox, aparelhos físicos e leitores de tela reais. O hero é decorativo (`aria-hidden`); a regra da indicação está em texto na seção "Indicação".
