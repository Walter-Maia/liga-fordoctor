# QA da pré-visualização v0.1.0 (13/10/2026)

Ambiente: Edge 154 headless no Windows, emulação mobile abaixo de 1024 px, servidor local `build/serve.mjs` com gzip. Sem Safari, Firefox ou aparelho físico.

## Medido

| Item | Antes (página no ar) | Pré-visualização |
|---|---|---|
| Lighthouse mobile, mediana de 3 (4G lenta, CPU 4×) | Performance 44 · Acessibilidade 88 · Boas práticas 79 | 99 · 100 · 100 |
| LCP mobile | 5,3 s | 1,66 s |
| TBT mobile | 1.579 ms | 104 ms |
| CLS mobile | 0,026 | 0,026 (ajuste aplicado depois, ainda não medido; ver abaixo) |
| Lighthouse desktop, mediana de 3 | 85 · 88 · 78 | 100 · 100 · 100 |
| Requisições / peso, mobile sem interação | 74 / 1.326 KB | 8 / 109 KB |
| HTML | 166 KB (58 KB gzip) | 46,9 KB (12,5 KB gzip) com todo o CSS embutido |
| JS próprio | 26 arquivos atrasados pelo WP Rocket | 1 arquivo, 4,8 KB gzip |

SEO aparece 66 na pré-visualização porque ela tem `noindex` de propósito. A pré-visualização ainda não tem GTM, GA4, Ads e pixel da Meta, que hoje somam cerca de 725 KB de JavaScript de terceiros; em produção o TBT vai subir. Os JSON estão em `lighthouse/`.

## Cenários (`scripts/cenarios.js`, resultado em `cenarios.json`)

- Sem JavaScript: todo o conteúdo, os valores e o formulário aparecem (`capturas/390-sem-js.jpg`).
- Movimento reduzido: nada é armado; valores visíveis desde o início.
- Trilha das recompensas: quadros de início, meio e fim em 390 e 1440 px; pausa com a aba oculta e retoma.
- Teclado: o Tab percorre link de pular, logo, CTAs, link interno, 7 perguntas, os 5 campos, o botão e os links de privacidade, todos com contorno de 3 px.
- Formulário: erros em português com foco no primeiro campo inválido; máscara (31) 99999-8888; estados "Enviando…", "Cadastro recebido ✓" e painel de sucesso; erro de envio com o WhatsApp da ForDoctor (`?erro=1`); UTMs da URL preenchidas nos campos ocultos.
- Abrindo `preview/index.html` direto (file://) no Edge, as fontes carregam.

## Ajustes feitos depois da última rodada completa

1. Fontes de reserva com largura ajustada (Dosis 85%, Jost 96% da Arial) para a troca de fonte não deslocar a foto do hero (origem do CLS de 0,026).
2. Divisão dos títulos em linhas agrupando leituras e escritas do DOM (o Lighthouse apontava 153 ms de reflow forçado com CPU 4×).
3. Espaço inseguível em "para recém-formados" e aviso de pré-visualização estático acima do rodapé.

Com esses ajustes, o QA rodou de 320 a 1024 px (`qa-saida.txt`): sem estouro lateral, sem alvos abaixo de 44 px, sem viúvas, CTA na primeira tela e fontes da marca carregadas. A rodada de 1280 a 1920 px, os cenários e o Lighthouse dessa versão final foram interrompidos pelo Claude Code por falta de memória na máquina e precisam ser repetidos:

```bash
node build/serve.mjs                      # em um terminal
node qa/scripts/qa-preview.js             # Node 22+, outro terminal
node qa/scripts/cenarios.js
```
