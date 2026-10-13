# 04 — Imagem revelada com máscara (clip-path reveal)

**O que é:** a imagem entra na tela se "abrindo" (cortina de baixo pra cima ou lateral) com leve zoom interno.
**Visto em:** Porta Studio, Campione (galerias de projetos).

## HTML
```html
<div class="reveal-img"><img src="img/projeto.jpg" alt=""></div>
```

## CSS
```css
.reveal-img { overflow: hidden; }
.reveal-img img { display:block; width:100%; will-change: transform; }
```

## JS
```js
document.querySelectorAll('.reveal-img').forEach(box => {
  const img = box.querySelector('img');
  gsap.set(box, { clipPath: 'inset(100% 0% 0% 0%)' }); // fechado embaixo
  gsap.set(img, { scale: 1.35 });
  gsap.timeline({
    scrollTrigger: { trigger: box, start: 'top 85%' }
  })
  .to(box, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'power4.inOut' })
  .to(img, { scale: 1, duration: 1.2, ease: 'power4.out' }, 0);
});
```

## Variações
- Lateral: `inset(0% 100% 0% 0%)` → `inset(0% 0% 0% 0%)`.
- "Blob" estilo Ethan Clark: use `clip-path: circle(0% at 50% 50%)` → `circle(120% at 50% 50%)`.
