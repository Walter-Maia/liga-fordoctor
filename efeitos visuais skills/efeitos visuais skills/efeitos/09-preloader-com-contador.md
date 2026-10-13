# 09 — Preloader com contador 0→100 e cortina

**Visto em:** Porta Studio, Operator.

## HTML (primeiro elemento do body)
```html
<div class="preloader">
  <span class="preloader-numero">0</span>
</div>
```

## CSS
```css
.preloader {
  position: fixed; inset: 0; z-index: 9999; background: #0a0a0a;
  display: grid; place-items: center; color: #fff;
}
.preloader-numero { font-size: clamp(4rem, 12vw, 10rem); font-variant-numeric: tabular-nums; }
```

## JS
```js
lenis.stop(); // trava o scroll durante o load
const contador = { v: 0 };
gsap.timeline({ onComplete: () => { document.querySelector('.preloader').remove(); lenis.start(); } })
  .to(contador, {
    v: 100, duration: 2, ease: 'power2.inOut',
    onUpdate: () => document.querySelector('.preloader-numero').textContent = Math.round(contador.v)
  })
  .to('.preloader-numero', { yPercent: -120, opacity: 0, duration: 0.5, ease: 'power3.in' })
  .to('.preloader', { yPercent: -100, duration: 0.9, ease: 'power4.inOut' })
  .add(() => animarHero(), '-=0.4'); // dispare aqui o reveal do hero (efeito 02)
```

Dica: para carregar de verdade (não só timer), atualize `contador.v` conforme `document.images` carregam e trave em 100 no `window.load`.
