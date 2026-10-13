---
name: quatro-familias-de-animacao
description: Skill de decisão sobre onde uma página precisa (e onde não precisa) de animação, organizada em quatro famílias — scroll (parallax, scrub, pin + transform), reveal (fade + lift, stagger, clip reveal), hover (CTA magnético, zoom de imagem, deslocamento de texto) e click (press + spring, mudança de estado). Use quando o pedido for "deixar o site com cara de caro/premium", "que animações colocar", "o site está parado", "revisar as animações", "está animado demais", ou para auditar quais famílias uma landing já tem e o que falta ou sobra.
---

# Quatro famílias de animação (scroll · reveal · hover · click)

Uma página "vale mais" quando cada família responde a uma pergunta do visitante: *o que acontece quando eu rolo? o que aparece? isso é clicável? cliquei, e agora?* A tese do carrossel de referência fecha com "good animation isn't decoration, it's feedback". Esta skill organiza o catálogo `efeitos/` e as skills irmãs por família, dá um snippet mínimo vanilla de cada padrão e um checklist de auditoria. Não é uma lista para aplicar inteira: a regra da biblioteca continua sendo **3–5 efeitos bem feitos**.

## Referência

Post: [carrossel p/DdBrvbRlElf](https://www.instagram.com/p/DdBrvbRlElf/), web_pros, legenda "save it for your next build! #vibecoding #nocode #webdesign", 5 imagens (capa + 4). Inspecionado em 28/09/2026. Evidência local: `qa/reels-2026-09-28/DdBrvbRlElf-carrossel.jpg` (as cinco lâminas lado a lado).

Conteúdo observado nas lâminas (texto literal traduzido):

| Lâmina | Família | Padrões |
|---|---|---|
| 01 — Scroll · "faça a página se mover com você" | scroll → storytelling | Parallax (camadas em velocidades diferentes) · Scrub (movimento segue o progresso do scroll) · Pin + transform (a seção fica, o conteúdo muda) |
| 02 — Reveal · "não mostre tudo de uma vez" | entrada → hierarquia | Fade + lift ("simples, confiável, premium") · Stagger (elementos entram um após o outro) · Clip reveal (o conteúdo é descoberto) |
| 03 — Hover · "faça o cursor sentir algo" | hover → feedback | Magnetic CTA (botão segue o cursor) · Image zoom ("a imagem se move, não o layout") · Text shift (seta, sublinhado ou rótulo reage) |
| 04 — Click · "todo clique merece resposta" | click → confirmação | Press + spring (botão comprime e volta) · State change (Send → Sending → Sent ✓) |

O carrossel é um resumo de princípios, sem código. Tudo abaixo é reconstrução proposta e alinhada ao que a biblioteca já pratica.

## Como decidir (antes de qualquer código)

1. **Comece pelo click e pelo hover**, não pelo scroll. São as famílias que respondem a uma ação da pessoa e por isso nunca leem como "site de IA". A skill `frontend-design` da Anthropic e o manual de motion desta biblioteca dizem o mesmo: movimento que responde a uma ação é bem-vindo; fade-and-slide-up em toda seção e hover em todo card é o padrão genérico.
2. **Um único momento orquestrado de reveal** (a intro ou a hero) vale mais do que entradas em todas as seções. Use reveal nas 2–3 seções que carregam argumento (prova, como funciona, planos), com deslocamento pequeno.
3. **Scroll storytelling só onde há história**: uma seção pinada com etapas (como `#como-funciona` do Siteflux ou "Na prática" do Vale) justifica pin + transform; um parallax decorativo no fundo raramente justifica o custo.
4. **Some tudo e corte**: se a página tem intro + hero animada + 3 reveals + parallax + hover em cards + marquee, já passou de cinco. Tire o que não responde a uma pergunta do visitante.

## Família 01 — Scroll

**Quando usar:** seções em que a ordem de leitura conta uma sequência (etapas, antes/depois, linha do tempo) ou uma hero com vídeo controlado pelo scroll (o Vale já faz, com teto de 2,5× e três modos; não reinventar).

**Parallax (camadas em velocidades diferentes).** Só em imagens de fundo grandes e com no máximo duas camadas. Preferir CSS scroll-driven animations com fallback estático:

```css
@supports (animation-timeline: view()) {
  .parallax__fundo {
    animation: parallax linear both;
    animation-timeline: view();
    animation-range: entry 0% exit 100%;
  }
  @keyframes parallax { from { transform: translateY(-8%); } to { transform: translateY(8%); } }
}
/* sem suporte: a imagem fica parada, nada quebra */
```

**Scrub (o movimento segue o progresso).** Para uma linha que "enche" com o scroll ou um contador de etapa, use `animation-timeline: view()` no elemento com `animation-range: entry 20% cover 60%`. Fallback: `IntersectionObserver` com `threshold` em passos de 0,05 gravando `--progresso` no elemento (ver `08-galeria-horizontal-no-scroll-vertical.md` para a versão com GSAP/ScrollTrigger, que só se aplica em projetos que já carregam GSAP).

**Pin + transform (a seção fica, o conteúdo muda).** Sem biblioteca: contêiner de 250–300 vh com um filho `position: sticky; top: 0; height: 100vh`, e as etapas trocando por `--progresso`. Regras: nunca pinar mais de ~3 telas; no celular (largura < 720 px) desligar o pin e empilhar as etapas; o conteúdo de cada etapa existe no DOM e é acessível sem JS.

Arquivos relacionados: `efeitos/01-smooth-scroll-lenis.md` (só se o projeto aceitar Lenis; Siteflux e Vale não usam), `efeitos/05-tipografia-gigante-esticada-no-scroll.md`, `efeitos/08-galeria-horizontal-no-scroll-vertical.md`, `pilha-imagens-3d-scroll/`, `indice-projetos-fundo-imersivo/`.

## Família 02 — Reveal

**Quando usar:** 2–3 seções de argumento. Não na hero (a hero já é o momento orquestrado) nem em rodapé, FAQ e listas longas.

**Fade + lift.** Deslocamento de 12–24 px, 500–700 ms, `cubic-bezier(.22, 1, .36, 1)`. Conteúdo visível por padrão; a classe que esconde só entra quando o JS carregou (`html.js .reveal { … }`), assim sem JS nada some.

```css
html.js .reveal { opacity: 0; transform: translateY(18px); transition: opacity 600ms cubic-bezier(.22, 1, .36, 1), transform 600ms cubic-bezier(.22, 1, .36, 1); }
html.js .reveal.is-in { opacity: 1; transform: none; }
```

```js
document.documentElement.classList.add('js');
const io = new IntersectionObserver((ents) => ents.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -12% 0px' });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
```

**Stagger.** Só dentro de um grupo pequeno (3–6 itens): `transition-delay: calc(var(--i) * 70ms)` com teto de ~350 ms no último item. Grupos maiores (cards de planos com 3 colunas é o limite) viram fila de espera.

**Clip reveal.** Para imagens e títulos grandes: `clip-path: inset(0 100% 0 0)` → `inset(0)` em 700–900 ms, ou a versão com máscara de `efeitos/04-imagem-revelada-com-mascara.md` e `efeitos/02-texto-revelado-linha-por-linha.md`. A imagem por baixo pode ter `transform: scale(1.06 → 1)` no mesmo tempo (dá o "desvelar").

Arquivos relacionados: `efeitos/02`, `efeitos/04`, `efeitos/09-preloader-com-contador.md` (evitar contador falso; ver "o que nunca fazer" da skill de intro), `efeito-de-intro/`, `intro-crt-para-hero/`.

## Família 03 — Hover

**Quando usar:** em tudo que é clicável, com ponteiro fino (`@media (hover: hover) and (pointer: fine)`). No toque não existe hover: o estado precisa ser legível sem ele (contraste, sublinhado, seta).

**CTA magnético.** Implementação sem GSAP (a de `efeitos/07-botao-magnetico.md` usa GSAP; esta é a equivalente vanilla):

```js
if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.querySelectorAll('.magnetico').forEach((btn) => {
    let raf = 0, tx = 0, ty = 0;
    const pinta = () => { btn.style.transform = `translate(${tx}px, ${ty}px)`; raf = 0; };
    btn.addEventListener('pointermove', (e) => {
      const r = btn.getBoundingClientRect();
      tx = (e.clientX - (r.left + r.width / 2)) * 0.3;
      ty = (e.clientY - (r.top + r.height / 2)) * 0.3;
      if (!raf) raf = requestAnimationFrame(pinta);
    });
    btn.addEventListener('pointerleave', () => {
      btn.animate([{ transform: btn.style.transform }, { transform: 'translate(0,0)' }], { duration: 600, easing: 'cubic-bezier(.34, 1.56, .64, 1)' })
        .onfinish = () => { btn.style.transform = ''; };
    });
  });
}
```

Força 0,2–0,35; só em 1–2 CTAs principais; o `getBoundingClientRect` roda no evento, não no rAF, e o rAF só escreve.

**Zoom de imagem.** "A imagem se move, não o layout": o card tem `overflow: hidden` e tamanho fixo; a `img` faz `transform: scale(1 → 1.05)` em 500–700 ms. Nunca animar `width`. Ver `efeitos/11-hover-com-distorcao-na-imagem.md`.

**Text shift.** Seta que desloca 4 px (`.link:hover .seta { transform: translateX(4px); }`), sublinhado que cresce da esquerda (`background-size` de `0% 1px` para `100% 1px`), ou rótulo que rola (ver `links-rolagem-por-caractere/`). Transição de 200–300 ms; listar as propriedades (`transition: transform 250ms ease-out, background-size 250ms ease-out`), nunca `transition: all`.

Arquivos relacionados: `efeitos/07`, `efeitos/11`, `efeitos/03-cursor-com-rastro-de-imagens.md` (efeito de assinatura, não de feedback; contar como um dos 3–5), `links-rolagem-por-caractere/`.

## Família 04 — Click

**Quando usar:** em todo botão e controle. É a família mais barata e a mais esquecida.

**Press + spring.**

```css
.botao { transition: transform 120ms ease-out, background-color 160ms ease-out, box-shadow 160ms ease-out; }
.botao:active { transform: scale(.97); }
@media (prefers-reduced-motion: reduce) { .botao { transition-duration: 0ms; } }
```

O "spring" de volta com WAAPI, só quando o clique de fato dispara a ação (evita animar em cliques cancelados):

```js
btn.addEventListener('click', () => {
  btn.animate([{ transform: 'scale(.97)' }, { transform: 'scale(1.02)' }, { transform: 'scale(1)' }], { duration: 320, easing: 'cubic-bezier(.34, 1.56, .64, 1)' });
});
```

**Mudança de estado (Enviar → Enviando… → Enviado ✓).** O rótulo muda no próprio botão, com `aria-live="polite"` em um elemento irmão para leitores de tela, e o botão fica desabilitado só **depois** que a requisição começa (regra das Web Interface Guidelines). O texto de carregamento termina com "…" (reticências reais).

```html
<button class="botao" type="submit" data-estado="pronto"><span class="botao__rotulo">Enviar</span></button>
<p class="sr-only" aria-live="polite" id="status-envio"></p>
```

```js
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  botao.dataset.estado = 'enviando'; rotulo.textContent = 'Enviando…'; botao.disabled = true; status.textContent = 'Enviando sua mensagem…';
  try { await enviar(new FormData(form)); botao.dataset.estado = 'enviado'; rotulo.textContent = 'Enviado ✓'; status.textContent = 'Mensagem enviada.'; }
  catch { botao.dataset.estado = 'erro'; rotulo.textContent = 'Tentar de novo'; status.textContent = 'Não foi possível enviar. Tente de novo.'; botao.disabled = false; }
});
```

Cada estado tem cor e ícone próprios em CSS por `[data-estado]`; a largura do botão não pode saltar (reservar `min-width` pelo rótulo mais longo). No Siteflux e no Vale as ações finais vão para o WhatsApp: o "estado" ali é o hover/press do link, não um envio. Não inventar formulário só para ter o efeito.

Arquivos relacionados: `efeitos/12-menu-fullscreen-overlay.md` (abrir/fechar é um click com resposta), `efeitos/10-transicao-de-pagina-cortina.md`.

## Checklist de auditoria de uma página

Rode antes de propor efeitos novos e registre em `qa/<etapa>/`:

| Pergunta | Onde olhar | Veredito |
|---|---|---|
| Existe **um** momento orquestrado de entrada (intro ou hero)? Só um? | intro, hero | falta / ok / excesso |
| Quantas seções têm reveal? (alvo: 2–3, deslocamento ≤ 24 px, sem stagger longo) | `.reveal`, `[data-in]` | — |
| Há scroll storytelling? Está numa seção que é sequência de verdade? Desliga no celular? | seções pinadas, `animation-timeline`, `sticky` | — |
| Parallax decorativo? Justifica o custo (medir frames longos)? | fundos com `translateY` no scroll | — |
| Todo clicável tem hover legível com ponteiro fino e estado equivalente no toque? | links, cards, CTAs | — |
| CTA principal tem press (`:active`) e volta? | botões | — |
| Ações assíncronas mostram Enviando…/Enviado com `aria-live`? | formulários, botões de cópia | — |
| `prefers-reduced-motion` cobre todas as famílias (não só a intro)? | CSS e JS | — |
| Alguma `transition: all`? Alguma animação de `width/height/top/left`? | grep | — |
| Loops decorativos > 5 s têm pausa (ou param em movimento reduzido e em aba oculta)? | marquees, redes animadas | — |
| Contagem total de efeitos perceptíveis (alvo 3–5) | tudo | — |

Comandos úteis: `grep -n "transition: all\|animation:.*infinite" assets/css/*.css`; `grep -c "prefers-reduced-motion" assets/css/*.css assets/js/*.js`. Para fluidez, o harness de CDP em `qa/fluidez-responsividade/ferramentas/` (Edge headless, ver armadilhas registradas: aba oculta por OAuth, 240/60 Hz).

## Acessibilidade, mobile e aba oculta

- Reveal: conteúdo presente sem JS; `is-in` idempotente; `unobserve` após entrar (não repetir ao rolar de volta, salvo decisão explícita).
- Hover: só com `(hover: hover) and (pointer: fine)`; no toque o primeiro toque ativa o link, não o hover.
- Click: `:focus-visible` com anel visível; o press também no Enter/Espaço (o `:active` já cobre; a animação WAAPI dispara no `click`, que o teclado gera).
- Scroll-driven: em aba oculta o scroll não muda, nada a fazer; em `prefers-reduced-motion`, remover `animation-timeline` (mostrar o estado final).
- Movimento reduzido não é "sem feedback": manter mudança de cor/rótulo, tirar deslocamento.

## Verificação

Gravar 3–4 s de cada família em quadros (harness de CDP ou `capturar-quadros.js` adaptado): o reveal termina antes de a seção estar 40 % visível; o magnético volta ao centro sem oscilar mais de um ciclo; o press não deixa o botão em `scale(.97)` após soltar; o estado "Enviado" permanece e o foco não se perde. Testar 360, 768, 1366 e 1920 de largura, teclado, e movimento reduzido. Documentar o que não pôde ser testado (sem celular físico, Safari ou Firefox nesta máquina).

## Limites e licença

O carrossel é conteúdo editorial de terceiro (web_pros); não há código nele. Os snippets são autorais, vanilla, sem dependência. `animation-timeline` tem suporte parcial (Chromium e Firefox recentes; Safari em progresso em 2026): sempre com `@supports` e fallback estático ou por `IntersectionObserver`.
