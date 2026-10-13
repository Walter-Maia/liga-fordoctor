# Referência 1 — Intro do Siteflux

Estado conferido em 24/09/2026 (versão 2.37). Antes de copiar, releia os arquivos: o código é a fonte da verdade.

- Decisão no `<head>`: `index.html`, script inline logo depois das folhas de estilo (linha ~35).
- Overlay e controle: `assets/js/siteflux.js`, função `intro()` (linhas ~19–160).
- Estilos e roteiro: `assets/css/siteflux.css`, bloco "Intro vetorial Siteflux" (linhas ~1149–1190) e `--rise-start` (linha ~393).
- Quadros: [../referencias-visuais/siteflux-quadros.jpg](../referencias-visuais/siteflux-quadros.jpg) — 0,1 · 0,5 · 0,9 · 1,2 / 1,5 · 1,8 · 2,1 · 2,4 s.

## Ideia

O globo do logo "nasce" como contorno branco, ganha vida com as três cores da marca girando dentro dele, assenta no branco oficial e então o nome se escreve letra a letra ("site" branco, "flux" lima), o ponto ciano estoura e o slogan aparece. Tudo dissolve para a hero, que começa a subir no mesmo instante.

## Roteiro (t = 0 no quadro em que `.is-playing` entra)

| Início | Duração | Camada | Técnica | Easing / detalhe |
|---|---|---|---|---|
| 0,00 s | 0,95 s | contorno do globo (`.sfi-stroke`) | T1 draw-on, `stroke-width .55` | `cubic-bezier(.45,0,.2,1)` |
| 0,30 s | 1,50 s | faixa lima 30 u, opacidade .3 (`.sfi-band--1`) | T5 translateX −40 → 150 dentro do clip elíptico | `cubic-bezier(.3,0,.2,1)` |
| 0,35 s | 1,50 s | 3 fatias lima/ciano/branco (`.sfi-spin`) | T4 rotate −40° → 500°, fade-in nos primeiros 18 % | `cubic-bezier(.2,.6,.2,1)` |
| 0,55 s | 1,50 s | faixa ciano 18 u, opacidade .34 (`.sfi-band--2`) | T5 | idem |
| 0,90 s + n·0,07 | 0,55 s | 8 letras s·i·t·e·f·l·u·x (`.sfi-l`, `--n` 0–7) | T7 translateY 9 → 0 + fade | `cubic-bezier(.22,1,.36,1)` |
| 1,50 s | 0,45 s | retângulo branco dentro da máscara (`.sfi-settle`) | assenta na cor oficial | `ease` |
| 1,55 s | 0,40 s | contorno some | fade-out | `ease` |
| 1,65 s | 0,50 s | ponto ciano (`.sfi-accent`) | T8 pop | `cubic-bezier(.34,1.56,.64,1)` |
| 1,85 s | 0,45 s | slogan "Sua presença digital começa aqui." | fade | `ease` |
| 2,40 s | 0,45 s | overlay inteiro | T12 dissolve + logo scale 1,04 (0,6 s) | — |

A hero usa `--rise-start: 2.4s` enquanto a intro existe: as entradas da hero são empurradas para começar junto com a dissolução. A página é liberada (`release`) 1,8 s depois da dissolução, quando a última entrada da hero termina.

## Montagem (o que o JS faz)

1. Só roda se o `<head>` marcou `html.intro-active` — condição: sem `location.hash`, aba visível, sem `prefers-reduced-motion`.
2. Desiste (libera a página) se chegou tarde: `performance.now() > 3000` ou a página já rolou.
3. Lê os paths do `<symbol id="sf-logo">`: `.lg-site` (globo, s, i-haste, i-pingo, t, e, slogan…), `.lg-flux` (f, l, u, x), `.lg-accent` (ponto). Serializa cada um com `XMLSerializer` e remonta dentro do overlay, agrupando as letras.
4. Cria `<div class="intro"><svg class="intro-logo" viewBox="-8 -8 451.28 111.54">` com `clipPath` elíptico, `mask` com o path do globo, faixas, contorno, fatias, retângulo de assentamento, letras, ponto e slogan.
5. Registra: `keydown` (Esc/Tab e teclas de rolagem pulam; as de rolagem com `preventDefault`), `wheel`/`touchstart` não passivos (o gesto que pula não rola a página), `pointerdown`, `scroll`, `visibilitychange`.
6. Dois `requestAnimationFrame` → `.is-playing`, corrige `--rise-start` pelo atraso real (`alignHero`) e agenda `finish(true)` em 2400 ms.
7. Failsafes: sem quadro em 1,5 s → pula; 4,4 s → pula. No CSS, `html.intro-active::before` cobre a página com a cor de fundo **antes do JS existir** e some sozinho aos 4,6 s (`sf-intro-failsafe`); se o `siteflux.js` falhar, o `onerror` da tag remove `intro-active`.
8. `finish(natural)`: limpa timers e listeners; natural → `intro-leaving` (a hero sobe) e remove o overlay em 480 ms; pulo → libera na hora e remove em 320 ms.

## Como adaptar para outra marca "no estilo Siteflux"

- Símbolo com área fechada (círculo, escudo, gota…) → T1 no contorno + T4 com as cores da marca dentro + T5 opcional + assentar na cor oficial.
- Nome → T7 com cor por palavra, se a marca tiver duas cores.
- Acento (ponto, estrela, traço) → T8.
- Tempos: mantenha a proporção 0,95 / 1,5 / 0,55 / 0,45; se a marca tiver mais letras, reduza o stagger para 0,05 s para o nome caber antes de 1,9 s.
- Símbolo sem área fechada (só linhas): troque T4 por T2 (cometas) ou T3 (ecos) — aí o estilo aproxima-se do Vale.
