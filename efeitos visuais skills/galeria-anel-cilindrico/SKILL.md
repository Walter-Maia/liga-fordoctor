---
name: galeria-anel-cilindrico
description: Criar galerias de projetos em uma faixa cilíndrica 3D aberta, com rotação, arraste e profundidade. Use para o anel de imagens inspirado em Kai Marlow, distinto de globo e carrossel líquido.
---

# Galeria em anel cilíndrico

Referência inspecionada: [Kai Marlow](https://kaimarlow.framer.website/), também mostrado por volta de 5 s no [Reel](https://www.instagram.com/reels/DcTT-hUoYrz/). Observado no site: imagens em uma faixa circular aberta, com interior visível, leve inclinação e título serifado grande ao fundo. A fórmula e os parâmetros abaixo são uma reconstrução proposta, não código original.

## Forma que identifica o efeito

O anel tem altura constante e eixo vertical. Não distribuir imagens sobre uma esfera nem fazê-las ondular como o carrossel líquido. O vazio no centro e a leitura da faixa traseira são partes importantes da composição. A tipografia continua HTML, sem acompanhar o giro.

Para N painéis rígidos de largura w e gap g, uma aproximação CSS é `R = (w + g) / (2 * tan(PI/N))`, com cada painel em `rotateY(i * 360/N) translateZ(R)`. Essa solução fica facetada. Para uma faixa lisa, subdivida cada imagem horizontalmente: `theta = thetaInicial + u * arco`, `x = R * sin(theta)`, `z = R * cos(theta)`, `y = (v - 0.5) * altura`. Use geometria e UVs coerentes, sem copiar uma imagem inteira em cada segmento.

Escolha como tratar o interior: face traseira espelhada pode ser deliberada; para texto que precise ser legível, uma superfície interna separada exige UVs próprios. Não deixar z-fighting entre faces coladas. Reserve espaço no contêiner para inclinação e perspectiva, evitando cortar topo e base.

## Navegação e custo

Um estado angular único controla drag, botões e índice. Converta pixels arrastados em radianos com uma sensibilidade limitada pela largura do componente. Inércia usa tempo decorrido; selecione o item frontal pela distância angular normalizada. Não disparar navegação se houve drag. Controles HTML e lista alternativa mantêm acesso aos projetos escondidos atrás.

Autorrotação é opcional; se adotada, pausa com foco, interação, aba oculta e saída da viewport. Em mobile, reduza tamanho/densidade ou use carrossel plano quando as miniaturas ficarem ilegíveis. Sem JS/WebGL e com reduced motion, apresentar os projetos sem giro. Não introduzir uma biblioteca 3D se o projeto já tem renderizador adequado.

## Verificar

Testar 1/2/3 e muitos projetos, fechamento da emenda, drag nos dois sentidos, retorno após resize e transparência/verso. A fórmula CSS não funciona como anel útil com N menor que 3: nesses casos, usar composição plana. Medir renderização parado e girando, conferir que links traseiros não capturam cliques da frente e que existe percurso por teclado. Comparar captura frontal e lateral, não apenas um quadro favorecido.
