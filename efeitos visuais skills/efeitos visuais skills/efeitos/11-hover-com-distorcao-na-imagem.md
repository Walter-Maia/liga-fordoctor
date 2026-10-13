# 11 — Hover com distorção/zoom na imagem do card

**O que é:** ao passar o mouse no card, a imagem dá zoom interno lento e o card revela o título deslizando.
**Visto em:** todos os sites de referência (listas de projetos).

## HTML
```html
<a class="card-projeto" href="projeto.html">
  <div class="card-img"><img src="img/capa.jpg" alt=""></div>
  <div class="card-info"><h3>Nome do projeto</h3><span>Branding · 2026</span></div>
</a>
```

## CSS (só CSS já resolve o essencial)
```css
.card-img { overflow: hidden; }
.card-img img {
  display: block; width: 100%;
  transform: scale(1.01);
  transition: transform 1s cubic-bezier(0.16, 1, 0.3, 1); /* = expo.out */
}
.card-projeto:hover .card-img img { transform: scale(1.08); }

.card-info h3 { transition: transform .5s cubic-bezier(0.16,1,0.3,1); }
.card-projeto:hover .card-info h3 { transform: translateX(8px); }
```

## Upgrade opcional (GSAP): imagem acompanha o mouse dentro do card
```js
document.querySelectorAll('.card-projeto').forEach(card => {
  const img = card.querySelector('img');
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    gsap.to(img, {
      xPercent: ((e.clientX - r.left) / r.width - 0.5) * 6,
      yPercent: ((e.clientY - r.top) / r.height - 0.5) * 6,
      scale: 1.1, duration: 0.6, ease: 'power3.out'
    });
  });
  card.addEventListener('mouseleave', () =>
    gsap.to(img, { xPercent: 0, yPercent: 0, scale: 1.01, duration: 0.8, ease: 'power3.out' }));
});
```
