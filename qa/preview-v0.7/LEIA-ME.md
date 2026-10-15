# QA da v0.7.0 — a indicação contada sem palavras, animação no compositor (15/10/2026)

Edge headless (Windows), servidor local. Decisão: 22 em `DIRECAO-DESIGN.md`. Roteiro em segundos: `build/gera-roteiro.mjs` (gera os @keyframes, o caminho dos objetos, os pontos do rastro e as setas; roda no `npm run build`); resumo comentado no bloco "Constelação do hero" de `src/assets/liga.css`.

## O que mudou no hero

A luz dourada virou objetos: o envelope (convite) sai de trás de "Você" e desce pela curva até o colega → dele sai a folha do contrato assinada, carimbada com o selo de aprovado (o colega fica com um visto) → a folha sobe e entra no topo do símbolo → o símbolo brilha e solta duas ondas → três moedas voltam por cima até você, girando → "+R$ 200 em crédito na mensalidade". Cada objeto deixa um rastro de pontos dourados. Saíram as etiquetas "Colega" e "Fechou contrato". Ciclo de 12 s.

## `hero-indicacao/` — `node qa/scripts/com-servidor.js qa/scripts/hero-indicacao.js --video`

Congela o ciclo e fotografa 12 instantes (0,5 · 0,95 · 1,8 · 2,6 · 3,3 · 3,9 · 4,8 · 5,4 · 6,2 · 7,2 · 8,5 · 10,5 s) em 1440 × 900, 1024 × 768, 390 × 844 @2 e 320 × 640 @2.

- `<largura>-folha.jpg`: os 12 instantes lado a lado; `<largura>-t<s>.jpg`: cada instante.
- `ciclo-1440.mp4` e `ciclo-390.mp4`: um ciclo inteiro (12 s, 20 quadros/s).
- `<largura>-estatico-reduzido.jpg` e `<largura>-estatico-sem-js.jpg`: a composição estática (o infográfico com os três objetos parados no meio dos trajetos).
- `resultado.json`: medições.

Resultado: em todos os instantes e larguras, nenhuma etiqueta encosta em outra nem num formando; nenhum objeto que viaja passa por cima de um formando da rede, do símbolo ou das etiquetas; nada sai da caixa do hero; nenhuma fonte abaixo de 13 px; sem rolagem lateral. Aba oculta: tudo para e continua de onde parou. Hero fora da tela: entrada e ciclo voltam ao início e o ciclo religa depois da entrada. Movimento reduzido: zero animações rodando e a composição estática completa, sem sobreposição. Sem erros de console.

Ajustes feitos durante o teste: os ícones apareciam deslocados (o `<svg>` de fora precisa de viewBox "0 0 largura altura" quando o símbolo tem viewBox negativo); os pontos do rastro não apareciam (já existia uma animação chamada `ponto` na trilha; a do rastro virou `rastro-ponto`); em 320 px o envelope encostava na etiqueta "Você" (agora ele desliza de trás de você até um ponto mais afastado); na composição estática as moedas se encostavam e, em 280 px, o envelope encostava no crédito (moedas mais espaçadas; envelope mais adiante na curva e crédito mais compacto em colunas de até 339 px).

## `desempenho/` — ver `desempenho/LEIA-ME.md`

Com a CPU 4× mais lenta, a thread principal caiu de 780–960 ms por segundo (v0.6) para 11–23 ms (v0.7), sem nenhuma repintura durante o ciclo. Também conferido: redimensionar a janela com o ciclo rodando (1440 → 1024 → 390 → 1440) mantém os objetos em cima do trajeto.

## `funcional/` — `node qa/scripts/com-servidor.js qa/scripts/v06-funcional.js`

Primeiro Tab no "Pular para o conteúdo"; CTA fixo do celular aparece depois do hero e some no formulário; tom do cabeçalho segue a caixa de baixo; formulário vazio marca os 5 campos, mostra as 5 mensagens e foca o primeiro; máscara do WhatsApp; envio simulado (enviando → painel de sucesso com foco); `?erro=1` mostra o erro e libera o botão; FAQ abre e fecha; com `?intro=1` o ciclo do hero fica parado durante a intro e liga cerca de 5 s depois do carregamento. Sem erros de console.

## Não testado

Safari (iOS e macOS), Firefox, aparelhos físicos e leitores de tela reais. O hero é decorativo (`aria-hidden`); a regra da indicação está em texto na seção "Indicação".
