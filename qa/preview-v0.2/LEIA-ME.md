# QA da pré-visualização v0.2.0 (13/10/2026)

O que mudou da v0.1: intro "a turma se liga", passos da indicação no estilo da ForDoctor Indica, hero, recompensas e cadastro em navy com os anéis concêntricos, foto do hero com transparência (AVIF/WebP com canal alfa) e rodapé em navy escuro.

Ambiente: Edge 154 headless no Windows, emulação mobile abaixo de 1024 px. Sem Safari, Firefox ou aparelho físico.

## Intro (`intro/`)

- Quadros congelados em 0,2 · 0,5 · 0,8 · 1,1 · 1,4 · 1,7 · 2,0 · 2,3 · 2,6 · 3,0 s, em 1440 e 390 px: `intro/1440-folha.jpg` e `intro/390-folha.jpg`. A ordem bate com o roteiro de `DIRECAO-DESIGN.md`; o último quadro é o logo oficial claro com a legenda.
- Tempo real (`intro/cenarios-intro.json`):

| Caso | Resultado |
|---|---|
| Primeira visita | toca; overlay sai do DOM ~4,0 s após a navegação; cabeçalho termina visível; sessão gravada |
| Segunda carga na mesma aba | sem intro |
| Esc aos 0,9 s | página liberada na hora |
| Clique sobre o CTA do hero durante a intro | só pula; não segue o link (sem `#cadastro`, sem rolagem) |
| URL com `#cadastro` | sem intro |
| Movimento reduzido | sem intro |
| `intro.js` bloqueado | sem cobertura (o `onerror` libera) |
| Aba oculta durante a intro | página liberada |
| Celular com CPU 4× | toca e libera em 5,5 s |
| Sem JavaScript | sem cobertura; página normal (`intro/sem-js-1280.jpg`) |

## Página (`capturas/`, `qa-saida.txt`, `cenarios.json`)

- 11 larguras de 320 a 1920 px: sem estouro lateral (os anéis ficam recortados pela própria seção), sem alvos abaixo de 44 px, sem viúvas, CTA na primeira tela e Dosis/Jost carregadas.
- Seções depois da animação: `capturas/1440-secao-*.jpg` e `capturas/390-secao-*.jpg`.
- Passos da indicação, início/meio/fim: `capturas/1440-passos-folha.jpg` e `capturas/390-passos-folha.jpg`.
- Sem JS, movimento reduzido, teclado (23 paradas até a política de privacidade), formulário (erros, máscara, enviando, recebido, sucesso, erro de envio) e UTMs: todos passaram.

## Lighthouse (`lighthouse/`, mesmo perfil da auditoria)

| | Página no ar (Fase 1) | v0.2 |
|---|---|---|
| Mobile com intro, 1ª visita, mediana de 3 | 44 · 88 · 79 · LCP 5,3 s · TBT 1.579 ms | 95 · 100 · 100 · LCP 1,73 s · TBT 235 ms · CLS 0 |
| Mobile sem intro, 1 rodada | — | 97 · LCP 1,79 s · TBT 176 ms |
| Desktop, mediana de 3 | 85 · 88 · 78 · LCP 1,7 s | 100 · 100 · 100 · LCP 0,43 s · CLS 0 |
| Requisições e peso (mobile) | 74 · 1.326 KB | 10 · 129 KB |

SEO 66 só por causa do `noindex` da pré-visualização. Ainda sem GTM, GA4, Ads e pixel da Meta (cerca de 725 KB de JS de terceiros na página atual); em produção o TBT sobe. Em uma das três rodadas de desktop o CLS foi 0,021; as outras duas deram 0.
