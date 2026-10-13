---
name: carrossel-globo-3d
description: Apresentar imagens distribuídas ao redor de um globo 3D rotativo com arraste e seleção, preservando uma alternativa de galeria linear acessível.
---

# Globo de imagens 3D

Referência: [Reel design4me__](https://www.instagram.com/reels/DdBi1YOo0H5/), aproximadamente 5,9–6,8 s, “3d globe carousel”. Observado: várias fotos distribuídas em um volume arredondado com sobreposição e profundidade. Não há demonstração suficiente para confirmar seleção, autoplay ou controles originais.

Distribua posições sobre uma esfera, por exemplo com amostragem Fibonacci, evitando concentração nos polos. Escolha conscientemente entre cards tangentes à superfície ou orientados para a câmera: essa decisão altera a leitura. Não reconstruir o conjunto de posições a cada frame.

Um único controlador de orientação recebe drag/teclado/botões. Limite velocidade, amortize a desaceleração e pause no foco/hover se houver rotação automática. Fotos no hemisfério traseiro devem ser ocultadas/atenuadas de forma coerente, sem links clicáveis por cima da frente.

Mantenha uma lista HTML de projetos e uma forma linear de navegar. Apresentação WebGL pode ser decorativa; se interativa, use hit testing compatível com o desenho e exiba o selecionado de forma frontal com link real. Não anunciar todas as mudanças de rotação.

Reduza densidade no mobile, mantenha gesto vertical e ofereça grade ou carrossel comum em reduced motion/falha de contexto. Teste zero/um/muitos itens, polos, sobreposições, foco e recuperação após resize. Meça uso de texturas: dezenas de fotos em resolução original são desnecessárias para miniaturas.
