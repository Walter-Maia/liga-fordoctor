---
name: cubo-galeria-vidro
description: Construir uma galeria de imagens em cubo 3D com faces visíveis, rotação interativa e acabamento translúcido discreto, com alternativa plana para mobile e movimento reduzido.
---

# Cubo de galeria

Referência: [Reel design4me__](https://www.instagram.com/reels/DdBi1YOo0H5/), aproximadamente 2,1–2,8 s, “glass gallery cube”. Observado: volume cúbico inclinado, imagens nas faces e arestas claras. O trecho não comprova refração física nem revela código. As técnicas abaixo são propostas.

Use CSS perspective/transform-style preserve-3d para seis faces planas quando isso bastar. Centralize a origem e aplique translateZ de metade da aresta a cada face após sua rotação. Confira ordem de transformações, backface-visibility e recorte pelo contêiner. Só recorrer a WebGL se a refração/iluminação for efetivamente necessária; blur aplicado ao cubo inteiro prejudica as fotos.

Converta a posição do ponteiro em alvos limitados de rotação; amortize com tempo decorrido e retorne ao repouso ao sair. Arestas sutis e poucas faces legíveis funcionam melhor do que giro incessante. Texto/CTA ficam fora do objeto 3D. Ofereça seleção por botões ou galeria plana; não dependa de hover para revelar conteúdo essencial.

No toque, arraste apenas se não disputar com scroll vertical. Em movimento reduzido, exiba uma orientação estática ou grade. Pause fora da tela/aba oculta e pare o loop ao estabilizar. Sem JS, preserve as imagens e links.

Valide orientação e aspecto das seis faces, frente/verso, sobreposição de links, gesto vertical e resize em 320/390/768/1440 px. Não deixar faces traseiras invisíveis no caminho de Tab. Tratar o cubo como apresentação visual de uma lista semântica, sem duplicar nomes acessíveis.
