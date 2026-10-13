# Infraestrutura: a intro nunca pode quebrar o site

A animação é a parte fácil. O que torna as intros do Siteflux e do Vale seguras é a "casca" em volta dela. O [template](../template/intro-template.html) já implementa tudo abaixo; ao adaptar, não remova nenhum item sem motivo.

## 1. Decidir no `<head>`, antes da primeira pintura

Script inline, síncrono, **depois** das folhas de estilo (assim a página não pinta e depois é coberta):

```html
<script>(function(){var d=document.documentElement;d.classList.add("js");try{
  if(location.hash||document.hidden||window.pageYOffset>4||matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  /* uma vez por sessão (opcional): */ if(sessionStorage.getItem("x-intro")==="1")return;
  d.classList.add("intro-active")}catch(e){}})();</script>
<script src="app.js" defer onerror="document.documentElement.classList.remove('intro-active')"></script>
```

Não roda: link com `#âncora`, aba aberta em segundo plano, página já rolada (voltar/restaurar), movimento reduzido, e (opcional) já vista nesta sessão.

## 2. Cobertura CSS antes do JS + failsafe

```css
html.intro-active::before { content:''; position:fixed; inset:0; z-index:900; background:var(--intro-bg);
  animation: intro-failsafe .5s 4.6s both; }
@keyframes intro-failsafe { to { opacity:0; visibility:hidden; } }
```
Se o JS nunca chegar, a cobertura some sozinha em ~5 s. O overlay real (z-index maior) fica por cima dela.

## 3. Controle no JS

- **Um relógio só**: a coreografia conta a partir de `.is-playing` (depois de dois `requestAnimationFrame`), e o fim natural é `setTimeout(finish, DURACAO)` agendado no mesmo momento.
- **Desistir se chegou tarde** (`performance.now() > 3000` ou página já rolada): libera tudo e não monta.
- **Pular**: Escape, Tab, teclas de rolagem (com `preventDefault`), roda, toque, clique, `scroll` e `visibilitychange` (aba oculta). Listeners de `wheel`/`touchstart` com `{passive:false, capture:true}` só enquanto a intro existe, para o gesto que pula não rolar a página escondida.
- **Failsafes JS**: sem quadro em 1,5 s (rAF parado) → pula; total + 2 s → pula.
- **`finish()` idempotente** (`if (done) return`), limpa timers e remove todos os listeners, remove o overlay do DOM depois do fade. O overlay continua capturando cliques durante o fade (senão o clique atravessa para um link da hero).
- Foco: nada focável dentro da intro; se o foco estiver nela ao sair, `blur()`.

## 4. Sincronizar com a hero

A hero deve começar a entrar **quando a intro começa a dissolver**, não antes (conteúdo aparecendo por baixo) nem muito depois (tela vazia).
- Siteflux: variável CSS `--rise-start` usada nos delays da hero (`html.intro-active, html.intro-leaving { --rise-start: 2.4s; }`), corrigida em JS pelo atraso real.
- Vale: fila `onIntroDone(fn)` para iniciar vídeo/logo da hero.

Nunca mostrar dois logos ao mesmo tempo (o da intro e o do cabeçalho/hero).

## 5. Movimento reduzido, sem JS, impressão

```css
@media (prefers-reduced-motion: reduce) { .intro, html.intro-active::before { display:none; } }
```
Sem JS, a classe nem é adicionada: a página aparece normal. A intro é `aria-hidden` e não é anunciada.

## 6. Armadilhas já pagas neste repositório

- `vector-effect: non-scaling-stroke` + zoom de câmera: repintura a cada quadro no Chromium; combinado a `pathLength` + `dasharray`, travou a pintura. Use espessura no viewBox.
- Traço menor que ~1 px de tela (hairline) travou a pintura em palcos estreitos: reforce `stroke-width` em `max-width: 600px`.
- `transform` em SVG sem `transform-box` gira em torno do canto do viewBox. Use `fill-box` (em torno da própria peça) ou `view-box` + `transform-origin` em px do viewBox.
- Animações sem `fill-mode: both` "piscam" o estado final antes do delay.
- Aba oculta não recalcula estilo e o rAF para: por isso aba oculta = pular.
- Iniciar `.is-playing` no mesmo quadro da montagem engole o começo das animações: sempre dois rAF.
- `id` de `mask`/`clipPath`/`gradient` precisa ser único na página inteira (prefixe: `sfi-`, `ig-`).
- `performance.now()` alto ou `pageYOffset > 0` na montagem = usuário já está usando a página: não cubra.
