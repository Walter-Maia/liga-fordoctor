# QA da pré-visualização v0.3.0 (13/10/2026)

Mudanças da v0.2: foto do hero inteira dentro do círculo (anel dourado completo), anéis das recompensas continuando em azul na seção "O que a Liga oferece?" com parallax, e seção "O que é a Liga" com a composição oficial da estudante como fundo (versões de desktop e celular).

Ambiente: Edge 154 headless no Windows, emulação mobile abaixo de 1024 px. Sem Safari, Firefox ou aparelho físico.

## Medido

- 11 larguras de 320 a 1920 px (`qa-saida.txt`): sem estouro lateral, sem alvos abaixo de 44 px, sem viúvas, CTA na primeira tela, sem 404. Cada largura baixa uma só variante do fundo: `liga-fundo-mobile-480` (até 414 px), `-668` (768–820 px), `liga-fundo-1280` (1024–1280 px), `liga-fundo-1920` (1366 px em diante), de 7 a 25 KB em AVIF.
- Alinhamento dos anéis na divisa (`scripts/v03.js`): o centro da camada azul e o da camada clara caem no mesmo ponto da tela em 390, 1024 e 1440 px, inclusive com o parallax em movimento.
- Lighthouse, 1 rodada de cada, mesmo perfil da auditoria: mobile com intro 95 · 100 · 100 (LCP 1,69 s, TBT 232 ms, CLS 0,002); desktop 100 · 100 · 100 (LCP 0,44 s, CLS 0).

## Correção encontrada no caminho

O recorte da revelação estava no próprio `<figure>` do fundo. Com o recorte totalmente fechado, o Chromium não dispara o carregamento preguiçoso nem o `IntersectionObserver`, e no celular a estudante nunca aparecia. O recorte foi para o `<picture>` interno, e a imagem é pedida quando a seção chega a 900 px da tela.

## Capturas

`capturas/1440-hero.jpg`, `1440-liga.jpg`, `1440-divisa-a.jpg` e `-b.jpg` (duas posições de rolagem), as mesmas em 1024 e 390 px, e `liga-mobile-folha.jpg` (320, 390 e 768 px).
