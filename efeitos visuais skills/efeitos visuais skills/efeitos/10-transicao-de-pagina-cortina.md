# 10 — Transição de página com cortina

**O que é:** ao clicar num link interno, uma cortina cobre a tela, a página troca, e a cortina sobe revelando a nova página.
**Visto em:** Porta Studio, Ethan Clark.

## HTML (em TODAS as páginas)
```html
<div class="cortina"></div>
```

## CSS
```css
.cortina {
  position: fixed; inset: 0; z-index: 9998; background: #0a0a0a;
  transform: translateY(101%); pointer-events: none;
}
```

## JS
```js
// SAÍDA: intercepta links internos
document.querySelectorAll('a[href]:not([href^="#"]):not([target])').forEach(a => {
  const url = new URL(a.href, location.href);
  if (url.origin !== location.origin) return;
  a.addEventListener('click', (e) => {
    e.preventDefault();
    gsap.to('.cortina', {
      y: 0, yPercent: -101, // parte do translateY(101%) do CSS até cobrir
      duration: 0.7, ease: 'power4.inOut',
      onComplete: () => location.href = a.href
    });
  });
});

// ENTRADA: nova página abre coberta e revela
window.addEventListener('pageshow', () => {
  gsap.fromTo('.cortina', { yPercent: 0 }, { yPercent: -101, duration: 0.9, ease: 'power4.inOut', delay: 0.1 });
});
```

Obs.: na página de entrada, comece com a cortina cobrindo (`transform: translateY(0)`) via classe adicionada no `<html>` o mais cedo possível, para não piscar conteúdo.
