# 02 — Texto revelado linha por linha (split text com máscara)

**O que é:** títulos/parágrafos onde cada linha sobe de dentro de uma "máscara" invisível, com stagger.
**Visto em:** Porta Studio (hero), Ethan Clark (títulos de seção).

## HTML
```html
<h1 class="reveal-texto">Design que<br>fala por si.</h1>
```

## CSS
```css
.linha-mascara { display: block; overflow: hidden; }
.linha-conteudo { display: block; transform: translateY(110%); }
```

## JS (sem plugin pago — split manual por <br> ou palavras)
```js
function splitEmLinhas(el) {
  // Divide pelo <br>; para textos longos, troque por split por palavras + medição.
  const linhas = el.innerHTML.split(/<br\s*\/?>/i);
  el.innerHTML = linhas.map(l =>
    `<span class="linha-mascara"><span class="linha-conteudo">${l}</span></span>`
  ).join('');
  return el.querySelectorAll('.linha-conteudo');
}

document.querySelectorAll('.reveal-texto').forEach(el => {
  const linhas = splitEmLinhas(el);
  gsap.to(linhas, {
    y: 0,
    duration: 1.1,
    ease: 'power4.out',
    stagger: 0.09,
    scrollTrigger: { trigger: el, start: 'top 85%' }
  });
});
```

## Ajustes
- Hero (sem scroll): remova o `scrollTrigger` e adicione `delay: 0.3` (ou dispare após o preloader — ver efeito 09).
- Stagger 0.06–0.12. Ease alternativo: `expo.out`.
