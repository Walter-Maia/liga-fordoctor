# 01 — Smooth Scroll (Lenis)

**O que é:** o scroll "pesado e suave" que todo site premium tem. É a base — os outros efeitos assumem que ele existe.
**Visto em:** todos os sites de referência.

## Código
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/lenis/1.1.14/lenis.min.js"></script>
<script>
const lenis = new Lenis({
  lerp: 0.1,        // 0.05 = mais pesado/cinematográfico · 0.15 = mais responsivo
  wheelMultiplier: 1,
  smoothWheel: true,
});
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);

// Âncoras (#contato etc.) continuam funcionando:
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    lenis.scrollTo(a.getAttribute('href'), { offset: 0, duration: 1.2 });
  });
});
</script>
```

## Ajustes que importam
- `lerp: 0.07` dá a sensação do Porta Studio (bem pesado).
- Para parar o scroll (menu aberto, preloader): `lenis.stop()` / `lenis.start()`.
