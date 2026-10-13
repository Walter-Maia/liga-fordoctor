---
name: pilha-imagens-3d-scroll
description: Criar uma sequência de imagens em camadas com perspectiva que se revela pelo scroll, mantendo percurso finito, ordem de leitura e alternativa plana.
---

# Pilha de imagens no scroll

Referência: [Reel design4me__](https://www.instagram.com/reels/DdBi1YOo0H5/), aproximadamente 6,8–7,7 s, “3d image stack scroll”. Observado: planos de imagem separados em profundidade, com inclinações diferentes. A relação exata entre scroll e transformação não é demonstrada; o rótulo identifica a intenção.

Defina início/fim da seção e mapeie progresso normalizado às camadas. Use translateZ, rotateX e translateY com perspectiva moderada. Dê a cada imagem uma janela de entrada/saída; preserve uma camada dominante legível em vez de sobrepor todas com a mesma opacidade.

Mantenha imagens e legendas na ordem de leitura do DOM. Só use sticky/pin se fizer parte da experiência solicitada; calcule altura finita proporcional ao número de etapas. Nunca substituir globalmente a rolagem para controlar esta seção. Preferir APIs já usadas pelo projeto, sem adicionar GSAP/Lenis automaticamente.

Com reduced motion ou sem JS, renderize a sequência plana. Em telas baixas/mobile, dispense pin ou reduza profundidade, sem cortar imagens e sem prender o usuário. Mudanças tardias de imagem/fonte não devem recalcular a posição de scroll do usuário.

Teste ida e volta, âncora no meio da página, carregamento com scroll restaurado, resize, orientação e passagem para a seção seguinte. Verifique conteúdo alcançável por teclado. No Siteflux, não aplicar este padrão ao carrossel de peças: o usuário já rejeitou navegação dependente do scroll vertical nesse componente.
