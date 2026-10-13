# 12 — Menu fullscreen com stagger nos links

**Visto em:** Campione, Avyron.

## HTML
```html
<button class="btn-menu">Menu</button>
<nav class="menu-overlay">
  <a href="index.html"><span>Home</span></a>
  <a href="projetos.html"><span>Projetos</span></a>
  <a href="sobre.html"><span>Sobre</span></a>
  <a href="contato.html"><span>Contato</span></a>
</nav>
```

## CSS
```css
.menu-overlay {
  position: fixed; inset: 0; z-index: 9000; background: #0a0a0a;
  display: flex; flex-direction: column; justify-content: center; padding: 8vw;
  clip-path: inset(0 0 100% 0); pointer-events: none;
}
.menu-overlay.aberto { pointer-events: auto; }
.menu-overlay a { overflow: hidden; }
.menu-overlay a span {
  display: inline-block; transform: translateY(110%);
  font-size: clamp(2.5rem, 8vw, 6rem); color: #fff;
}
```

## JS
```js
const overlay = document.querySelector('.menu-overlay');
const links = overlay.querySelectorAll('a span');
let aberto = false;

document.querySelector('.btn-menu').addEventListener('click', () => {
  aberto = !aberto;
  overlay.classList.toggle('aberto', aberto);
  if (aberto) {
    lenis.stop();
    gsap.timeline()
      .to(overlay, { clipPath: 'inset(0 0 0% 0)', duration: 0.8, ease: 'power4.inOut' })
      .to(links, { y: 0, duration: 0.8, ease: 'power4.out', stagger: 0.07 }, '-=0.3');
  } else {
    lenis.start();
    gsap.timeline()
      .to(links, { y: '110%', duration: 0.4, ease: 'power3.in', stagger: 0.04 })
      .to(overlay, { clipPath: 'inset(0 0 100% 0)', duration: 0.7, ease: 'power4.inOut' }, '-=0.1');
  }
});
```
