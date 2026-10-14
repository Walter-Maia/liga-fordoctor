# Teste de responsividade — v0.5.0 (14/10/2026)

Script: `qa/scripts/responsivo.js` (Edge headless, Windows, servidor local `npm run preview`). Resultado bruto: `resultado.json`; capturas de página inteira em `capturas/`.

## 18 telas, com densidade de tela real

280×653 @3, 320×568 @2, 360×740 @3, 375×667 @2, 390×844 @3, 414×896 @2, 430×932 @3, 844×390 @3, 768×1024 @2, 820×1180 @2, 1024×768 @2, 1180×820 @2, 1280×800, 1366×768, 1440×900, 1600×900, 1920×1080 e 2560×1440 @1: todas OK.

Em todas: sem rolagem lateral, nenhum texto cortado ou mais largo que a tela, todos os botões, links e campos com 44 px ou mais, sem palavra sozinha na última linha dos títulos e botões, Dosis carregada, a foto da Liga recebe um arquivo com pelo menos 85% da resolução necessária. Em 844×390 o botão do hero fica abaixo da primeira tela, mas o do cabeçalho está visível.

## Ajuste feito neste teste

Em 1024×768 o "2026" do H1 ficava sozinho na última linha, porque a arte do hero ocupava 540 px. Entre 960 e ~1230 px a arte agora ocupa no máximo 44% da largura.

## Mudanças no script

- Usa o servidor local em vez de `file://` (em `file://` o navegador bloqueia o preload da fonte).
- A arte do hero, as marcas-d'água e a órbita da foto são decorativas e saem da conta de estouro (passam da borda de propósito e são cortadas pela caixa).
- Corrigida a leitura da largura dos arquivos de imagem: na v0.4 a expressão regular perdia as barras invertidas dentro do texto do script e a checagem de nitidez não media nada.

## Não testado

Safari (iOS e macOS), Firefox, navegadores de aparelhos físicos e leitores de tela reais.
