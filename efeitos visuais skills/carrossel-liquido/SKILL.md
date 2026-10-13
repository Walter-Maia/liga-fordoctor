---
name: carrossel-liquido
description: Criar ou refinar carrosséis de imagens com curvatura fluida de faixa, deformação nas laterais e movimento horizontal com inércia. Use para liquid carousel; inclui adaptação para peças com texto, toque e fallback sem WebGL.
---

# Carrossel líquido

Referência visual observada: [Reel de design4me__](https://www.instagram.com/reels/DdBi1YOo0H5/), trecho aproximado 4,5–5,9 s, rotulado “liquid carousel”. As imagens formam uma faixa; suas bordas se curvam e torcem nas extremidades, enquanto o centro permanece mais frontal. Título e contador ficam separados da superfície deformada.

O Reel não fornece código, pacote, licença nem parâmetros. As soluções abaixo são propostas de reconstrução, não a implementação original. Não chamar zoom, skew de um card rígido ou crossfade de reprodução fiel desse efeito.

## Escolha de implementação

Leia [references/implementacao.md](references/implementacao.md) para geometria, estado, toque e testes. Para aplicar no projeto local Siteflux, leia também [references/siteflux.md](references/siteflux.md).

- Use uma malha subdividida por imagem em WebGL quando a curvatura real for central ao pedido. Reaproveite o renderizador existente; Three.js é uma opção, não uma dependência obrigatória. Não instale GSAP/Lenis ou substitua o scroll da página só para isso.
- Se o ambiente não suporta WebGL, entregue carrossel HTML com translação e os mesmos controles. Descreva-o como alternativa simplificada.
- Para materiais com preços e texto impresso, mantenha a peça ativa frontal e sem recorte. Concentre a curvatura nas peças periféricas; assente a deformação ao terminar o movimento.
- Título, descrição, CTA, contador e controles permanecem HTML. O canvas é uma camada visual, não a única maneira de acessar os projetos.

## Resultado verificável

Teste a faixa em movimento e em repouso, nos dois sentidos e ao passar do último item para o primeiro. Inspecione uma sequência de quadros: uma captura parada não comprova fluidez. Preserve swipe, setas, foco, rolagem vertical e fallback. Registre o que foi testado e diferencie implementação pronta, protótipo e instrução técnica.
