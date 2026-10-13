# Referência 2 — Intro do Vale do Aço Digital

Estado conferido em 24/09/2026. Releia os arquivos antes de copiar.

- Decisão no `<head>`: `vale-do-aco-digital/index.html`, script inline (linhas ~26–37).
- Overlay: no próprio HTML, entre `<!-- intro:start -->` e `<!-- intro:end -->` (linhas ~43–94). SVG completo, com `viewBox="0 0 368.14 146.44"`.
- Controle: `vale-do-aco-digital/assets/js/main.js`, início do arquivo (linhas ~13–53, `endIntro`, `onIntroDone`).
- Estilos e roteiro: `vale-do-aco-digital/assets/css/styles.css`, bloco "intro" (linhas ~135–200).
- Vídeo de onde o roteiro foi medido: `vale-do-aco-digital/referencias/Vale do aço digital motion intro.mp4` (usado o trecho 0,00–3,27 s e o ponto final de 4,30–4,60 s, antecipado).
- Quadros: [../referencias-visuais/vale-do-aco-digital-quadros.jpg](../referencias-visuais/vale-do-aco-digital-quadros.jpg) — 0,2 · 0,5 · 0,8 · 1,2 · 1,7 / 2,2 · 2,6 · 2,8 · 3,1 · 3,5 s.

## Ideia

"Motion de marca" cinematográfico: começamos com a câmera colada no símbolo (scale 5). Cometas riscam o arco e a diagonal, a haste e o arco se desenham, dez linhas concêntricas acendem em cascata formando o símbolo em "linhas de aço", a câmera afasta e desliza para a posição da assinatura, um brilho claro varre o arco, o nome aparece, o contorno pisca, o gradiente vermelho→laranja preenche, surge o brilho de fundo, entra a arte oficial e o ponto vermelho estoura.

Este é o exemplo de como **reconstruir um vídeo de motion em vetor**: os tempos da tabela foram lidos quadro a quadro no MP4 de referência.

## Roteiro (t = 0 no quadro em que `.is-playing` entra)

| Início | Duração | Camada | Técnica | Detalhe |
|---|---|---|---|---|
| 0,00 s | 2,63 s | tudo (`.im-cam`) | T6 câmera: scale 5 → 4,3 (0,89 s) → 2,9 (1,60 s) → 2,2 (2,33 s) → 1 com pan | origem `104.6px 72.7px`, translate 79,5 px até o pan final |
| 0,10 s | 0,32 s | faísca no arco (`.im-trace--spark`) | T2 cometa `dasharray .05 1.4`, `#f7a823` | linear |
| 0,30 s | 0,28 s | faísca na diagonal (`.im-trace--diag`) | T2 `dasharray .2 1.4`, vermelho `#e8352a` | linear |
| 0,43 s | 0,22 s | haste vertical (`.im-trace--stem`) | T1 | some aos 1,05 s |
| 0,63 s | 0,29 s | arco (`.im-trace--arc`) | T1 | some aos 1,05 s |
| 0,90 s + i·0,05 | 0,35 s | 10 pares de linhas concêntricas (`.im-lines`, `--i` 0–9) | T3 fade-in | somem aos 2,67 s em 0,16 s |
| 2,00 s | 0,50 s | brilho claro no arco (`.im-sweep`, `#fff3dc`) | T2 "sweep" | ease-in-out |
| 2,55 s | 0,27 s | nome "VALE DO AÇO DIGITAL" (`.im-word`) | fade 0 → .45 → 1 | linear |
| 2,63 s | 0,45 s | contorno (`.im-outline`) | T9 pisca uma vez | linear |
| 2,70 s | 0,27 s | preenchimento com gradientes (`.im-fill`) | T9 | linear |
| 2,75 s | 0,40 s | brilho radial (`.im-glow`) | T10 | ease-out |
| 3,00 s | 0,30 s | PNG oficial do símbolo (`.im-official`) | T11 | linear |
| 3,15 s | 0,35 s | ponto (`.im-dot`) | T8 pop + cor laranja → vermelho | `cubic-bezier(.34,1.56,.64,1)` |
| 3,90 s | 0,55 s | overlay | T12 (transition opacity/visibility) | `endIntro()` |

Paleta: linhas `#f39a1f`/`#e9801b`, traços `#f08a1d`, gradiente do triângulo `#ba2819 → #e41a18 → #e62821`, do disco `#e62f21 → #ea5f1b → #f39316`, ponto `#e63823`. Fundo: `radial-gradient(60% 48% at 62% 56%, #1b232b, transparent 72%), #070d15`.

## Infraestrutura (diferenças para o Siteflux)

- Overlay escrito direto no HTML (não montado pelo JS). Escondido por padrão (`.intro { display:none }`) e só exibido com `html.intro-on`.
- O `<head>` acrescenta `intro-on intro-lock` se: `sessionStorage['vad-intro'] !== '1'`, sem hash, `pageYOffset <= 4`, sem movimento reduzido. `intro-lock` trava a rolagem (`overflow:hidden`).
- `main.js`: dois rAF → `.is-playing` (com reforço por `setTimeout(250)`); `setTimeout(endIntro, 3900)`; Esc/Tab e aba oculta encerram; `endIntro` grava a sessão, adiciona `.is-leaving`, destrava a rolagem já, e remove `intro-on` em 650 ms.
- `onIntroDone(fn)`: fila de callbacks. A hero (vídeo, logo) só começa depois da intro — "nunca dois logos ao mesmo tempo" (o logo da hero entra 600 ms depois).
- Espessuras de traço em unidades do viewBox, reforçadas abaixo de 600 px; **sem** `non-scaling-stroke` (ver infraestrutura).
- Em `@media (prefers-reduced-motion: reduce)` e no modo de movimento desligado, `.intro { display:none !important }`.

## Como adaptar para outra marca "no estilo Vale"

1. Recrie o símbolo em primitivas (retas, arcos) — é o que permite cometas e linhas concêntricas.
2. Escolha 2–4 traços principais para os cometas/draw iniciais (as "arestas" mais reconhecíveis).
3. Gere 6–10 ecos por forma (método §4) para a cascata.
4. Câmera: comece em scale 4–5 num detalhe do símbolo e termine em 1 na posição da assinatura; ajuste o translate para o detalhe ficar no centro da tela no começo.
5. Finalize com T9 (contorno → gradiente oficial), T10, T11 e T8.
6. Mantenha o total ≤ 3,5 s de coreografia + ~0,4 s de marca parada.
