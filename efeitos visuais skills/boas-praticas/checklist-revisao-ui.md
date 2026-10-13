# Checklist de revisão de um `index.html` vanilla antes de publicar

Versão operacional curta. A lista completa (100+ regras) está em `../ferramentas-agente-frontend/references/checklist-web-interface-guidelines.md`. Rode do diretório do projeto; `rg` = ripgrep (ou `grep -rn`). Saída esperada da revisão: `arquivo:linha - problema`, agrupado por arquivo.

| # | Item | Como conferir |
|---|---|---|
| 1 | Um único `<h1>`, títulos sem salto de nível | `rg -o '<h[1-6]' index.html \| sort \| uniq -c`; ler a ordem |
| 2 | Link "pular para o conteúdo" e `<main>` | `rg -n 'href="#(conteudo\|main)"' index.html`; `rg -n '<main' index.html` |
| 3 | Botões-ícone com `aria-label` | `rg -n '<button[^>]*>\s*<svg' index.html` e checar cada um |
| 4 | Nenhum `<div>`/`<span>` clicável | `rg -n 'on(click\|keydown)=' index.html`; no JS, `rg -n "addEventListener\('click'" assets/js` e conferir o alvo |
| 5 | Links de navegação são `<a href>` | `rg -n 'role="link"' index.html` (deve ser zero) |
| 6 | Toda `<img>` com `alt`, `width` e `height` | `rg -n '<img' index.html \| rg -v 'width=' ` e `\| rg -v 'alt=' ` |
| 7 | `loading="lazy"` abaixo da dobra; hero com `fetchpriority="high"` | `rg -c 'loading="lazy"' index.html`; `rg -n 'fetchpriority' index.html` |
| 8 | Fontes: `preload` + `font-display` | `rg -n 'rel="preload" as="font"' index.html`; `rg -n 'font-display' assets/css` |
| 9 | `preconnect` para domínios externos (fontes, CDN) | `rg -n 'preconnect' index.html`; comparar com `rg -o 'https://[a-z0-9.-]+' index.html \| sort -u` |
| 10 | Foco visível em tudo; nenhum `outline: none` sem substituto | `rg -n 'outline:\s*(none\|0)' assets/css`; `rg -n 'focus-visible' assets/css` |
| 11 | Sem `transition: all` | `rg -n 'transition:\s*all' assets/css` (zero) |
| 12 | Só `transform`/`opacity` animados | `rg -n 'transition:[^;]*(width\|height\|top\|left\|box-shadow)' assets/css`; `rg -n '@keyframes' -A6 assets/css \| rg '(width\|height\|top\|left):'` |
| 13 | `prefers-reduced-motion` cobre intro, loops e reveals | `rg -n 'prefers-reduced-motion' assets/css assets/js`; DevTools → Rendering → emular e rolar a página inteira |
| 14 | Loops > 5 s pausam fora da tela e em aba oculta | `rg -n 'visibilitychange\|IntersectionObserver' assets/js`; harness `node tools/cdp.js loops` (Vale) |
| 15 | Animações interrompíveis (clique rápido, resize) | testar no navegador: abrir/fechar menu e FAQ duas vezes rápido |
| 16 | Formulários: `label`, `autocomplete`, `type`, `inputmode`, erro inline | `rg -n '<input' index.html \| rg -v 'autocomplete='` |
| 17 | `touch-action: manipulation` em botões/links; `overscroll-behavior: contain` em diálogos | `rg -n 'touch-action\|overscroll-behavior' assets/css` |
| 18 | Sem estouro lateral de 320 a 1920 px | harness: `node tools/cdp.js exo 390 844` (Vale) / `qa/fluidez-responsividade` (Siteflux); DevTools: `document.documentElement.scrollWidth > innerWidth` |
| 19 | Títulos com `text-wrap: balance`; sem viúvas em 390 px | `rg -n 'text-wrap' assets/css`; captura em 390 px |
| 20 | Tipografia: `…`, aspas curvas, `&nbsp;` em unidades e marcas | `rg -n '\.\.\.' index.html`; `rg -n ' "' index.html` |
| 21 | `<meta name="theme-color">` = fundo; `color-scheme` em tema escuro | `rg -n 'theme-color\|color-scheme' index.html assets/css` |
| 22 | Viewport sem `user-scalable=no`/`maximum-scale=1` | `rg -n 'user-scalable\|maximum-scale' index.html` (zero) |
| 23 | `scroll-margin-top`/`scroll-padding-top` para âncoras sob cabeçalho fixo | `rg -n 'scroll-(margin\|padding)-top' assets/css` |
| 24 | Sem leitura+escrita de layout intercaladas em laços | `rg -n 'getBoundingClientRect\|offsetHeight\|offsetWidth' assets/js` e ler o contexto |
| 25 | Zero erros de console, zero recursos 404, sem JS a página é legível | harness (`errors` no JSON); `rg -n '<noscript' index.html`; abrir com JS desativado |

## Depois do checklist

- Sequência de quadros das animações principais (não uma captura só).
- Capturas em 390, 820, 1366, 1440 e 1920 px salvas em `qa/<etapa>/`.
- README do projeto e `versoes/LEIA-ME.md` atualizados; snapshot em `versoes/<nome>/` feito **antes** de editar.
- Limitações declaradas: sem Safari, Firefox ou celular físico nesta máquina.
