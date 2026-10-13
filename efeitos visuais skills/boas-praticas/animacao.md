# Boas práticas de animação (guia normativo)

Consolidação do que a biblioteca aprendeu até 28/09/2026: skills desta pasta, carrossel "Animation that makes a website feel worth $1000" (web_pros, post DdBrvbRlElf), leis do brag-slim/HyperFrames, regras de animação das Web Interface Guidelines da Vercel, skill frontend-design da Anthropic, `skills agentes/references/motion.md` e as auditorias de QA dos dois sites. Vale para HTML/CSS/JS vanilla; frameworks seguem as mesmas regras.

## 1. Propósito

**Boa animação não é decoração; é feedback.** Cada movimento responde a uma destas perguntas: de onde isto veio, o que mudou, o que acontece se eu clicar, onde estou na página. Se não responde a nenhuma, corte.

## 2. As quatro famílias

| Família | Gatilho | Formas | Regra |
|---|---|---|---|
| **Scroll** | rolagem | parallax (camadas em velocidades diferentes), scrub (o movimento segue o progresso), pin + transform (a seção fica, o conteúdo muda) | a página se move *com* a pessoa; nunca sequestrar o scroll |
| **Reveal** | entrada na tela | fade + lift (simples, confiável, premium), stagger (um após o outro), clip reveal (o conteúdo é descoberto) | não mostrar tudo de uma vez, mas mostrar tudo em até ~1 s |
| **Hover** | ponteiro | CTA magnético, zoom da imagem (a imagem se move, não o layout), text shift (seta, sublinhado ou rótulo reagem) | só com `(hover: hover) and (pointer: fine)`; no toque, o primeiro toque executa |
| **Click** | ação | press + spring (comprime e volta), state change (Enviar → Enviando… → Enviado ✓) | toda ação recebe resposta; o nome da ação não muda no meio |

## 3. Quantidade

- **Um momento orquestrado por página** (intro, hero ou um reveal de assinatura). Fade + subida em toda seção e hover elaborado em todo card é o padrão que denuncia página gerada.
- **3–5 efeitos** bem-feitos por site. Combinação de base: scroll suave + reveal de títulos + máscara de imagem + zoom no hover (+ intro em landing de impacto).
- Gaste a ousadia em um lugar; o resto fica quieto.

## 4. Propriedades e CSS

- Animar só `transform` e `opacity` (compositor). `stroke-dashoffset` e `clip-path` são aceitáveis em vetores e reveals curtos. Nunca `width/height/top/left`, `box-shadow` grande, `filter: blur` em tela cheia.
- `transition` sempre com propriedades listadas; nunca `transition: all`.
- `transform-origin` explícito; em SVG, transformar o `<g>` com `transform-box: fill-box`.
- `will-change` só no elemento que vai animar e só pouco antes; remover depois.
- `vector-effect: non-scaling-stroke` não combina com zoom de câmera; traços abaixo de ~1 px travam a pintura no Chromium (lição da intro do Vale).

## 5. Easings

Tokens recomendados no `:root` (os dois sites já usam estas curvas, com nomes diferentes):

```css
:root {
  --ease-out:    cubic-bezier(.16, 1, .3, 1);     /* Vale; alternativa Siteflux: cubic-bezier(.22, 1, .36, 1) */
  --ease-in-out: cubic-bezier(.65, 0, .35, 1);    /* Siteflux; alternativa Vale: cubic-bezier(.6, 0, .3, 1) */
  --ease-draw:   cubic-bezier(.45, 0, .2, 1);     /* traço se desenhando */
  --ease-spring: cubic-bezier(.34, 1.56, .64, 1); /* back-out; usado nos dois sites */
}
```

| Easing | CSS | Uso |
|---|---|---|
| linear | `linear` | marquee, scrub, contador |
| ease-in-out | `var(--ease-in-out)` | ida e volta, morph, troca de posição |
| ease-out | `var(--ease-out)` | entradas, reveals, resposta a clique |
| back-out | `var(--ease-spring)` | assentar com leve ultrapassagem (ponto do logo, chip, ícone) |
| elastic | `linear(...)` com pontos ou keyframes | um único destaque; nunca em texto |
| bounce | keyframes | objetos "físicos"; raro em sites |

Entradas com `ease-out` ou `expo.out`; `ease: none` só em marquee e scrub. Um site usa 2–3 curvas.

## 6. Durações

| Tipo | Duração | Exemplos |
|---|---|---|
| Micro | 150–250 ms | hover, press, toggle, ícone de estado |
| Entradas | 300–500 ms | reveal de seção, abertura de menu, FAQ |
| Cinemáticas | 800–1400 ms | reveal de hero, transição de galeria (FLIP), morph |
| Intro | 2,4–3,5 s + 0,45–0,55 s de dissolução | nunca acima de ~4 s |

Stagger: 50–80 ms entre itens (letras 70 ms, linhas repetidas 50 ms, caracteres de link 12–25 ms) com **teto total** (~180 ms em links, ~600 ms em listas). O último item não pode continuar animando muito depois de o usuário ter saído.

## 7. Controle

- **Interrompível:** nova ação do usuário cancela ou inverte a animação em curso; nunca enfileirar.
- **Pausa fora da viewport e em aba oculta** sem reiniciar o relógio (`IntersectionObserver` + `visibilitychange`; conferir `el.getAnimations({subtree: true})` na volta, porque aba oculta não recalcula estilo).
- **Movimento reduzido:** `@media (prefers-reduced-motion: reduce)` entrega a composição final estática ou uma variante reduzida (só opacidade). Não basta `animation: none` se o estado final depende da animação.
- **Loops:** um loop é escolha deliberada, não padrão de toda seção. Movimento automático acima de 5 s ao lado de conteúdo precisa de pausar/parar/ocultar; se o usuário mandou tirar o botão, registrar a decisão e não reintroduzir.
- **Fotossensibilidade:** sem flashes repetidos; um pulso de contorno é o máximo. Trocas de fundo em cores saturadas (branco → vermelho → azul, como no logo "112") funcionam em vídeo; num site, uma vez, e nunca em loop.
- **Sem JS:** o conteúdo existe e é legível; intro e reveals têm failsafe em CSS.
- **Toque:** cursor trail, magnético e proximidade desligados; swipe com alternativa por botão e teclado.

## 8. Texto em movimento

- Título gigante: `clamp(3rem, 8vw, 10rem)`, tracking −0,03 a −0,05 em, muito espaço.
- Em vídeo, cada linha fica inteira por ≈0,3 s × palavras depois de assentar.
- Reveal de linha por máscara: uma linha por `overflow: hidden`; nunca cortar letras fora da janela em texto longo.
- Uma única etiqueta acessível quando as letras são duplicadas (`aria-hidden` no conjunto animado).

## 9. Verificação

Uma captura parada não prova animação. Sempre:

1. Sequência de quadros (início, meio, fim e segundo ciclo) com `scripts/capturar-quadros.js` da skill de intro ou o harness `qa/`.
2. Desktop, tablet e celular emulados; reduced motion; aba oculta e volta; teclado; sem JS; clique/toque rápido durante a animação.
3. CPU limitada quando houver travamento relatado (lembrar que 4× de CPU atrasa `setTimeout`, ver memória `qa-harness-edge-headless`).
4. Relatar medições reais e limitações (sem Safari, Firefox ou celular físico nesta máquina). Nunca afirmar ganho de conversão.
