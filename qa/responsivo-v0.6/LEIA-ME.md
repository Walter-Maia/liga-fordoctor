# Teste de responsividade — v0.6.0 (14/10/2026)

Script: `node qa/scripts/com-servidor.js qa/scripts/responsivo.js` (Edge headless, Windows). Resultado bruto: `resultado.json`; capturas de página inteira em `capturas/`.

## 18 telas, com densidade de tela real

280×653 @3, 320×568 @2, 360×740 @3, 375×667 @2, 390×844 @3, 414×896 @2, 430×932 @3, 844×390 @3, 768×1024 @2, 820×1180 @2, 1024×768 @2, 1180×820 @2, 1280×800, 1366×768, 1440×900, 1600×900, 1920×1080 e 2560×1440 @1: todas OK.

Em todas: sem rolagem lateral, nenhum texto cortado ou mais largo que a tela, nenhum texto abaixo de 12 px, botões, links e campos com 44 px ou mais, sem palavra sozinha na última linha dos títulos e botões, Dosis carregada, a foto da Liga com pelo menos 85% da resolução necessária, nenhuma âncora sem destino, o título do cadastro fica abaixo do cabeçalho flutuante depois do clique em "Quero fazer parte da Liga", o CTA fixo do celular não cobre o rodapé e a composição estática do hero (as quatro etiquetas juntas) cabe na caixa sem sobreposição. Nenhum erro de console. Em 844×390 o botão do hero fica abaixo da primeira tela, mas o do cabeçalho está visível.

## Ajuste feito neste teste

Em 280 e 320 px, na composição estática do hero (movimento reduzido ou sem JS), "R$ 200 em crédito" e "Fechou contrato" encostavam um no outro. Abaixo de 340 px de arte, o do colega desce uma linha. No ciclo animado os dois nunca aparecem ao mesmo tempo.

## Mudanças no script

- Verificações novas: fontes abaixo de 12 px, âncoras sem destino, título sob o cabeçalho, CTA fixo sobre o rodapé, hero estático e erros de console.
- As capturas de página inteira passaram a ser feitas com movimento reduzido: com movimento, o que está fora da tela fica "armado" (títulos, passos e o próprio hero aparecem vazios na foto). A foto de "O que é a Liga" aparece vazia nessas capturas porque é carregada sob demanda e a página não é rolada nesse passe; no passe com rolagem ela carrega e é medida.

## Não testado

Safari (iOS e macOS), Firefox, aparelhos físicos e leitores de tela reais.
