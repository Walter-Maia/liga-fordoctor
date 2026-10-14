# QA da v0.6.0 — demonstração da indicação no hero (14/10/2026)

Edge headless (Windows), servidor local. Decisão e roteiro: decisão 21 em `DIRECAO-DESIGN.md` e o bloco "Constelação do hero" em `src/assets/liga.css`.

## `hero-indicacao/` — `node qa/scripts/com-servidor.js qa/scripts/hero-indicacao.js --video`

O script espera o ciclo ligar, congela as animações (Web Animations API) e fotografa nove instantes do roteiro (0,5 · 1,8 · 2,7 · 3,5 · 4,2 · 4,6 · 5,3 · 6,6 · 9,8 s) em 1440 × 900, 1024 × 768, 390 × 844 @2 e 320 × 640 @2.

- `<largura>-folha.jpg`: os nove instantes lado a lado; `<largura>-t<s>.jpg`: cada instante.
- `ciclo-1440.mp4` e `ciclo-390.mp4`: um ciclo inteiro (11 s, 20 quadros/s).
- `<largura>-estatico-reduzido.jpg` e `<largura>-estatico-sem-js.jpg`: a composição estática.
- `resultado.json`: medições.

Resultado: em todos os instantes e larguras, nenhuma etiqueta encosta em outra nem em outro formando, nenhuma sai da caixa do hero, nenhuma fonte abaixo de 13 px e sem rolagem lateral. Aba oculta: tudo para (`paused`) e continua de onde parou. Hero fora da tela: entrada e ciclo voltam ao início; na volta, o ciclo religa depois da entrada (1,9 s). Movimento reduzido: zero animações rodando e as quatro etiquetas visíveis. Sem erros de console.

## `funcional/` — `node qa/scripts/com-servidor.js qa/scripts/v06-funcional.js`

Primeiro Tab no "Pular para o conteúdo"; CTA fixo do celular aparece depois do hero e some no formulário; tom do cabeçalho segue a caixa de baixo; formulário vazio marca os 5 campos, mostra as 5 mensagens e foca o primeiro; máscara do WhatsApp; envio simulado (enviando → painel de sucesso com foco); `?erro=1` mostra o erro e libera o botão; FAQ abre e fecha; com `?intro=1` o ciclo do hero fica parado durante a intro e liga ~1,9 s depois que ela sai. Sem erros de console.

## Não testado

Safari (iOS e macOS), Firefox, aparelhos físicos e leitores de tela reais. Os scripts antigos `v05-estados.js`, `ondas-check.js` e `video-ondas.js` medem a constelação da v0.4/v0.5 (ondas e raios) e não valem para a v0.6.
