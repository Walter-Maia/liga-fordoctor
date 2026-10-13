# 05 — Tipografia gigante animada pelo scroll (scrub)

**O que é:** título enorme no hero que escala/estica/sobe amarrado à posição do scroll (scrub), como o "Porta Studio" atrás do laptop no reel.
**Visto em:** Campione, Operator, Porta Studio.

## HTML
```html
<section class="hero">
  <h1 class="titulo-gigante">PORTA*STUDIO</h1>
</section>
```

## CSS
```css
.hero { height: 100vh; display: grid; place-items: center; overflow: hidden; }
.titulo-gigante {
  font-size: clamp(3rem, 14vw, 12rem);
  letter-spacing: -0.04em; line-height: 0.9; white-space: nowrap;
}
```

## JS
```js
gsap.to('.titulo-gigante', {
  scale: 1.6,
  yPercent: -30,
  opacity: 0.15,
  ease: 'none',            // scrub = sempre ease none
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true,           // amarra ao scroll; use scrub: 1 para dar inércia
  }
});
```

## Variação "esticar por letra" (Campione)
Envolva cada letra em `<span>` e anime `scaleY` com stagger + scrub.
