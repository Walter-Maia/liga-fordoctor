# 08 — Galeria horizontal no scroll vertical (seção pinada)

**O que é:** a página "trava" e o conteúdo desliza na horizontal enquanto você rola pra baixo — como a faixa de fotos coloridas do reel do Porta Studio.
**Visto em:** Porta Studio, Campione.

## HTML
```html
<section class="secao-horizontal">
  <div class="trilho">
    <div class="painel"><img src="img/1.jpg"></div>
    <div class="painel"><img src="img/2.jpg"></div>
    <div class="painel"><img src="img/3.jpg"></div>
    <div class="painel"><img src="img/4.jpg"></div>
  </div>
</section>
```

## CSS
```css
.secao-horizontal { overflow: hidden; }
.trilho { display: flex; height: 100vh; width: max-content; }
.painel { width: 60vw; flex-shrink: 0; }
.painel img { width: 100%; height: 100%; object-fit: cover; }
```

## JS
```js
const trilho = document.querySelector('.trilho');
gsap.to(trilho, {
  x: () => -(trilho.scrollWidth - innerWidth),
  ease: 'none',
  scrollTrigger: {
    trigger: '.secao-horizontal',
    start: 'top top',
    end: () => '+=' + (trilho.scrollWidth - innerWidth), // duração proporcional
    scrub: 1,
    pin: true,
    invalidateOnRefresh: true,
  }
});
```

No mobile, considere trocar por scroll horizontal nativo (`overflow-x:auto`) — pin em telas pequenas costuma frustrar.
