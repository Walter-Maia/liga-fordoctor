# Landing page da Liga ForDoctor

Nova versão de https://fordoctor.com.br/liga-fordoctor/. Decisões, mapa de conteúdo, tokens e plano de movimento estão em [DIRECAO-DESIGN.md](DIRECAO-DESIGN.md). A auditoria da página atual está em `qa/fase-1-auditoria/`.

## Ver a pré-visualização

```bash
npm run preview
```

Abre um servidor em http://localhost:4173. Também dá para abrir `preview/index.html` direto no navegador. A pré-visualização tem `noindex` e o formulário não envia dados (para ver o estado de erro, acrescente `?erro=1` à URL).

A intro toca uma vez por sessão do navegador. Para revê-la, use `?intro=1`; para pular, `?intro=0` (os parâmetros combinam: `?intro=0&erro=1`).

## Estrutura

| Caminho | O que é |
|---|---|
| `src/landing.html` | fonte única do conteúdo |
| `src/assets/liga.css`, `src/assets/liga.js` | estilos e comportamento (vanilla, sem bibliotecas) |
| `src/assets/fonts/` | Dosis e Jost em woff2, subset latino (licença SIL OFL) |
| `src/assets/img/` | imagens responsivas (AVIF e WebP), logo oficial em SVG e imagem de compartilhamento |
| `src/originais/` | originais baixados da produção, usados para gerar as imagens |
| `build/build.mjs` | gera `preview/` (CSS embutido, versão nos assets, `noindex`) |
| `build/imagens.sh`, `build/og.mjs` | regeneram as imagens (ffmpeg) e a imagem de compartilhamento (Edge headless) |
| `build/intro.template.js`, `build/gera-intro.mjs` | molde da intro e gerador que insere o path oficial do símbolo em `src/assets/intro.js` (rode antes do build; `npm run build` já faz) |
| `qa/` | auditoria da Fase 1, capturas e Lighthouse da pré-visualização e scripts de QA |

`build.mjs` e `serve.mjs` rodam no Node 14 ou mais novo. Os scripts de QA e `og.mjs` precisam do Node 22 ou mais novo (WebSocket nativo) e do Microsoft Edge instalado.
