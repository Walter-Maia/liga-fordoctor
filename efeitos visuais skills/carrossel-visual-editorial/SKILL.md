---
name: carrossel-visual-editorial
description: Criar carrosséis editoriais com imagens altas, prévia dos slides adjacentes e movimento lateral suave, sem deformação líquida ou scroll vertical obrigatório.
---

# Carrossel visual editorial

Referência: [Reel design4me__](https://www.instagram.com/reels/DdBi1YOo0H5/), aproximadamente 8,5–9,7 s, “visual carousel”. Observado: sequência horizontal de imagens altas com separações claras. Comportamentos de swipe, foco e autoplay abaixo são decisões de implementação, não confirmados pelo Reel.

Use uma lista semântica com viewport recortada e trilho horizontal. Faça a peça principal ocupar espaço suficiente para leitura, com uma prévia parcial do próximo item quando a largura permitir. O carrossel não deve criar overflow no documento.

Escolha scroll-snap ou transform conforme os controles existentes. Um único índice governa setas, indicadores, contador e foco. Gestos horizontais preservam pan-y; cliques após arraste não abrem links. Não misture swipe e pin vertical para o mesmo avanço.

Fotografias podem ter aspect-ratio comum e crop deliberado; peças com texto mantêm contain e proporção original. Legendas/controles ficam fora da imagem, sem cobrir informação. Área de toque de 44 px e foco visível. A grade estática é uma alternativa válida sem JS.

Autoplay é opcional e precisa respeitar pausa manual, foco, hover, visibilidade e reduced motion. Para loop com clones, remover IDs repetidos, usar inert/aria-hidden e não anunciar clones como itens novos.

Teste 1/2/muitos itens, limites ou loop, indicadores após resize, teclado e swipe nos dois sentidos. Inspecione a prévia do próximo item em mobile/desktop e ausência de scrollbar crua. Se o pedido for liquid carousel, usar a skill carrossel-liquido; translação simples não substitui deformação.
