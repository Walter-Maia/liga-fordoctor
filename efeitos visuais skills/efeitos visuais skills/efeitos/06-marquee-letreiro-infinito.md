# 06 — Marquee (letreiro infinito, reage à direção do scroll)

**Visto em:** Campione, Avyron.

## HTML
```html
<div class="marquee"><div class="marquee-faixa">
  <span>DESIGN — BRANDING — MOTION — </span>
  <span>DESIGN — BRANDING — MOTION — </span>
</div></div>
```

## CSS
```css
.marquee { overflow: hidden; white-space: nowrap; }
.marquee-faixa { display: inline-flex; will-change: transform; }
.marquee-faixa span { font-size: clamp(2rem, 8vw, 7rem); padding-right: .5em; }
```

## JS (loop infinito + acelera com o scroll)
```js
const faixa = document.querySelector('.marquee-faixa');
const larg = faixa.children[0].offsetWidth;
let vel = 1, direcao = 1, x = 0;

lenis.on('scroll', ({ velocity }) => {
  direcao = velocity < 0 ? -1 : 1;
  vel = 1 + Math.min(Math.abs(velocity) * 0.4, 6); // acelera até 7x
});

gsap.ticker.add(() => {
  x -= vel * direcao;
  if (x <= -larg) x += larg;
  if (x > 0) x -= larg;
  faixa.style.transform = `translateX(${x}px)`;
});
```
