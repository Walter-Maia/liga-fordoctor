# 07 — Botão magnético

**O que é:** o botão "gruda" no cursor e segue levemente o mouse; solta com elástico.
**Visto em:** Porta Studio, Avyron (CTAs e ícones sociais).

## HTML
```html
<button class="magnetico"><span>Fale comigo</span></button>
```

## JS
```js
if (matchMedia('(hover:hover)').matches) {
  document.querySelectorAll('.magnetico').forEach(btn => {
    const texto = btn.querySelector('span');
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      gsap.to(btn,   { x: dx * 0.35, y: dy * 0.35, duration: 0.4, ease: 'power3.out' });
      gsap.to(texto, { x: dx * 0.15, y: dy * 0.15, duration: 0.4, ease: 'power3.out' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to([btn, texto], { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.35)' });
    });
  });
}
```

`0.35` = força do ímã (0.2 sutil · 0.5 exagerado). O elástico na saída é o que dá o toque premium.
