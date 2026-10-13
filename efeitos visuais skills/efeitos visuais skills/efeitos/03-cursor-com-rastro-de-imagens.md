# 03 — Cursor com rastro de imagens (image trail)

**O que é:** ao mover o mouse sobre uma seção, imagens "brotam" atrás do cursor e somem — assinatura do template Ethan Clark.
**Visto em:** Ethan Clark (hero/about).

## HTML
```html
<section class="area-rastro" data-imagens='["img/1.jpg","img/2.jpg","img/3.jpg","img/4.jpg","img/5.jpg"]'>
  <h2>Trabalhos selecionados</h2>
</section>
```

## CSS
```css
.area-rastro { position: relative; overflow: hidden; }
.img-rastro {
  position: absolute; width: 190px; aspect-ratio: 3/4; object-fit: cover;
  pointer-events: none; will-change: transform, opacity;
  transform: translate(-50%, -50%) scale(0);
}
```

## JS
```js
document.querySelectorAll('.area-rastro').forEach(area => {
  const fontes = JSON.parse(area.dataset.imagens);
  let ultX = 0, ultY = 0, i = 0;
  const DISTANCIA_MIN = 120; // px entre um spawn e outro

  area.addEventListener('mousemove', (e) => {
    const r = area.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    if (Math.hypot(x - ultX, y - ultY) < DISTANCIA_MIN) return;
    ultX = x; ultY = y;

    const img = document.createElement('img');
    img.src = fontes[i++ % fontes.length];
    img.className = 'img-rastro';
    img.style.left = x + 'px'; img.style.top = y + 'px';
    area.appendChild(img);

    gsap.timeline({ onComplete: () => img.remove() })
      .to(img, { scale: 1, rotation: gsap.utils.random(-8, 8), duration: 0.4, ease: 'power3.out' })
      .to(img, { scale: 0.4, opacity: 0, y: '+=60', duration: 0.6, ease: 'power2.in' }, '+=0.15');
  });
});
```

## Regras
- **Desative no touch**: envolva tudo em `if (matchMedia('(hover:hover)').matches) { ... }`.
- Limite a ~15 imagens vivas simultâneas se as fotos forem pesadas.
