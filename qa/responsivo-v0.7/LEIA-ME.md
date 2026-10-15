# Teste de responsividade — v0.7.0 (15/10/2026)

Script: `node qa/scripts/com-servidor.js qa/scripts/responsivo.js` (Edge headless, Windows). Resultado bruto: `resultado.json`; capturas de página inteira em `capturas/`.

## 18 telas, com densidade de tela real

280×653 @3, 320×568 @2, 360×740 @3, 375×667 @2, 390×844 @3, 414×896 @2, 430×932 @3, 844×390 @3, 768×1024 @2, 820×1180 @2, 1024×768 @2, 1180×820 @2, 1280×800, 1366×768, 1440×900, 1600×900, 1920×1080 e 2560×1440 @1: todas OK.

Em todas: sem rolagem lateral, nenhum texto cortado ou mais largo que a tela, nenhum texto abaixo de 12 px, botões, links e campos com 44 px ou mais, sem palavra sozinha na última linha dos títulos e botões, Dosis carregada, a foto da Liga nítida, nenhuma âncora sem destino, o título do cadastro fica abaixo do cabeçalho flutuante, o CTA fixo do celular não cobre o rodapé e a composição estática do hero (com "Você", o crédito, o envelope, o contrato e as três moedas) cabe na caixa sem nada se cobrir. Nenhum erro de console. Em 844×390 o botão do hero fica abaixo da primeira tela, mas o do cabeçalho está visível.

## Ajustes feitos neste teste

- Composição estática: as três moedas se encostavam em todas as larguras; agora ficam mais espaçadas no trajeto.
- Em 280 e 320 px o envelope parado encostava no crédito. Em colunas de até 339 px o envelope fica mais adiante na curva e o crédito fica mais compacto. No ciclo animado os dois nunca aparecem ao mesmo tempo.

## Mudanças no script

- A checagem do hero estático passou a incluir os objetos (envelope, contrato e moedas) e deixou de procurar "Colega" e "Fechou contrato", que saíram na v0.7.
- As capturas de página inteira agora esticam a janela até a altura da página e usam a captura normal. O modo de captura "além da janela" do Edge às vezes desenhava parte do hero com o tamanho de uma largura anterior (o hero usa unidades relativas à largura da arte). Isso não acontece na tela de verdade: medido e fotografado em cinco larguras seguidas, inclusive redimensionando com o ciclo rodando (ver `qa/preview-v0.7/`).

## Não testado

Safari (iOS e macOS), Firefox, aparelhos físicos e leitores de tela reais.
