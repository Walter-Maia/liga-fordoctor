# Desempenho da animação do hero — v0.6 × v0.7 (15/10/2026)

Script: `qa/scripts/hero-desempenho.js` (Edge headless, Windows). Espera o ciclo ligar e mais 3 s (para os efeitos de entrada que tocam uma vez terminarem), desacelera a CPU 4× (celular intermediário) e grava um trace de 12 s com o hero na tela. Soma o tempo da thread principal (união dos intervalos, sem contar eventos aninhados duas vezes), do recálculo de estilo e da pintura.

- v0.7: `node qa/scripts/com-servidor.js qa/scripts/hero-desempenho.js depois`
- v0.6: a pré-visualização do último commit (`git archive HEAD preview build/serve.mjs`) servida numa porta separada, com `QA_URL=http://localhost:<porta>/ node qa/scripts/hero-desempenho.js antes-v0.6`

| Tela | Versão | Thread principal (ms por segundo) | Estilo | Pintura | Pinturas em 12 s |
|---|---|---|---|---|---|
| 1440 × 900 | v0.6 | 959 | 180 | 91 | 1.399 |
| 1440 × 900 | v0.7 | 11 | 0 | 0 | 0 |
| 390 × 844 @2 | v0.6 | 780 | 171 | 91 | 1.493 |
| 390 × 844 @2 | v0.7 | 23 | 0 | 0 | 0 |

Na v0.6 a thread principal ficava praticamente ocupada o tempo todo (com a CPU 4× mais lenta, 1 s de trabalho por segundo é o limite): o SVG inteiro repintava a cada quadro por causa dos traços animados (`stroke-dashoffset`) e da flutuação dos formandos dentro do SVG. Na v0.7 tudo o que se move é HTML animado só com `transform` e `opacity`, que o navegador anima na GPU (compositor), e o SVG de fundo fica parado.

Dois ajustes vieram da medição:

- Os 36 pontos do rastro tinham atraso positivo; cada ponto que começava acordava a thread principal (cerca de 14 quadros por segundo nos trechos com rastro). Com atraso negativo (instante − 12 s) a animação já nasce ativa e não há nenhum quadro na thread principal durante o ciclo.
- A primeira medição do celular incluía o desenho da marca-d'água da seção seguinte, que toca uma vez quando aparece na tela. Por isso a espera de 3 s antes do trace, aplicada às duas versões.

Não medido: aparelhos reais (Android e iPhone), Safari e Firefox.
