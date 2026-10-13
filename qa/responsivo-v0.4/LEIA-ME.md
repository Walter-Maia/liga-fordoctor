# Teste de responsividade — v0.4.0 (13/10/2026)

Script: `qa/scripts/responsivo.js` (Edge 154 headless, Windows). Resultado bruto: `resultado.json`; capturas de página inteira em `capturas/`.

## 18 telas, com densidade de tela real

| Tela | Uso | Resultado |
|---|---|---|
| 280×653 @3 | celular dobrável fechado | OK (após ajuste do botão de envio) |
| 320×568 @2 | celular pequeno | OK |
| 360×740 @3 | Android comum | OK |
| 375×667 @2 | iPhone SE | OK |
| 390×844 @3 | iPhone 14 | OK |
| 414×896 @2 | iPhone grande | OK |
| 430×932 @3 | iPhone Pro Max | OK |
| 844×390 @3 | celular deitado | OK; o botão do hero fica abaixo da 1ª tela, mas o do cabeçalho está visível |
| 768×1024 @2 | iPad retrato | OK |
| 820×1180 @2 | iPad Air retrato | OK |
| 1024×768 @2 | iPad deitado | OK |
| 1180×820 @2 | iPad Air deitado | OK |
| 1280×800, 1366×768, 1440×900, 1600×900, 1920×1080, 2560×1440 @1 | notebooks e monitores | OK (2560 após ajuste do fundo da Liga) |

Em todas: sem rolagem lateral, nenhum texto cortado ou mais largo que a tela, todos os botões, links e campos com 44 px ou mais, sem palavra sozinha na última linha dos títulos e botões, Dosis e Jost carregadas.

## Ajustes feitos neste teste

1. **280 px:** "Enviar meu cadastro" quebrava em duas linhas. Abaixo de 340 px o painel e os botões têm menos respiro lateral.
2. **2560 px:** a foto da seção "O que é a Liga" ficava esticada e cortava a cabeça da estudante. Acima de 1920 px a foto fica no tamanho original, à direita, e a esquerda continua o gradiente da borda da imagem (`capturas/liga-2560.jpg`).

## Imagens

Cada tela recebe a maior versão disponível de cada foto. O limite é o original: a composição da estudante para celular tem 668 px de largura e fica ampliada em celulares de densidade 3 (até ~1,9×); a de desktop tem 1920 px e fica ampliada em telas retina e acima de 1920 px. Se a ForDoctor tiver essas artes em resolução maior, basta trocar em `src/originais/` e rodar `bash build/imagens.sh`.

## Intro

Quadros em 0,8 · 1,4 · 2,2 · 3,0 s em 280×653, 844×390 e 2560×1440 (`intro/intro-extremos.jpg`): o logo e a legenda cabem inteiros em todas.

## Ondas do hero

Rodam em todas as larguras; pausam com o hero fora da tela e com a aba oculta; com movimento reduzido os anéis ficam parados. Vídeos de um ciclo em `qa/preview-v0.4/ondas-1440.mp4` e `ondas-390.mp4`.

## Não testado

Safari (iOS e macOS), Firefox, navegadores de aparelhos físicos e leitores de tela reais.
