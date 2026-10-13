# Reconstrução técnica proposta

## Composição e geometria

Comece com uma lista HTML de imagens com dimensões reservadas, textos alternativos e links. Leia esses dados para criar as texturas; não mantenha um segundo cadastro de conteúdo. Inicialize o canvas apenas quando houver espaço medido e a primeira textura estiver decodificada. Em falha, preserve a lista/carrossel HTML.

Uma aproximação inicial é uma malha de 32 × 12 segmentos por peça. A quantidade é um ponto de partida a medir, não uma propriedade confirmada do Reel. Posicione as peças em uma faixa horizontal com gaps; use a coordenada horizontal global de cada vértice para obter uma curva contínua entre peças. Deformar cada card com uma fase independente quebra a sensação de faixa.

Exemplo conceitual, não shader completo: `q = clamp(xGlobal / meiaLarguraVisivel, -1, 1)`; `e = smoothstep(0.35, 1.0, abs(q))`. Aumente o deslocamento em profundidade com `e * e`; aplique uma pequena rotação progressiva da seção vertical em torno do eixo horizontal usando `e * sinal(q)`. Some uma ondulação transitória proporcional à velocidade horizontal filtrada. O sentido da velocidade deve inverter a inclinação sem inverter ou espelhar a textura.

Reserve margem vertical ao canvas para as bordas curvas. Confira a perspectiva e a câmera antes de aumentar a deformação; planos se cruzando e faces traseiras visíveis geralmente indicam amplitude excessiva. O centro deve permanecer reconhecível e o item selecionado estabilizar. Não adicionar aberração cromática, água, ruído ou brilhos que não foram solicitados.

Texturas mantêm o aspecto original. Para fotografias, crop pode ser uma escolha explícita. Para peças de campanha, use contain com áreas de respiro, sem esticar UVs nem cortar texto. Uma máscara retangular no fragment shader não produz curvatura real da silhueta.

## Um único estado de navegação

Mantenha `position`, `target`, `velocity`, `activeIndex` e `dragState` num controlador. Botões, swipe, teclado e autoplay alimentam esse estado; canvas, contador e indicadores leem dele. Não use um segundo timer ou índice no renderizador.

- Atualize inércia com tempo decorrido, por exemplo `alpha = 1 - exp(-k * dt)`, em vez de um lerp fixo por frame. Limite `dt` ao retornar de aba oculta.
- Mantenha a posição contínua durante o movimento e derive índices com módulo positivo. Faça wrap visual por comprimento total, sem salto ao trocar a textura do centro.
- Se a navegação mudar antes de terminar, retarget a partir da posição atual. Não acumule transições nem bloqueie controles por todo o movimento.
- No arraste, identifique intenção horizontal após uma pequena tolerância (ex.: 8 px). Use `touch-action: pan-y`; não capture a rolagem vertical. Trate pointercancel, captura perdida, resize e saída de aba.
- Links não devem abrir após um arraste. Botões têm área de toque de pelo menos 44 px. Setas/Home/End atuam quando o componente tem foco, sem sequestrar as teclas do documento inteiro.

Autoplay só se fizer parte do pedido/projeto. Pause com interação, foco, hover de mouse, fora da viewport e aba oculta. Uma pausa escolhida pelo usuário não pode ser desfeita pelo IntersectionObserver. Em movimento reduzido, desligue autoplay e deformação, com troca imediata ou discreta.

## Desempenho e recuperação

Renderize somente enquanto houver movimento ou alteração. Pare o requestAnimationFrame quando estabilizar, quando oculto e ao desmontar. Limite inicialmente o pixel ratio a 1,5–2, escolhendo depois por medição. Reutilize geometria e buffers, pré-carregue o item adjacente e evite transferir texturas em cada frame. Defina dimensões CSS antes do canvas para não gerar salto de layout.

Trate erro de imagem e perda do contexto WebGL: mostre o fallback e mantenha navegação funcional. Ao restaurar o contexto, recrie recursos ou permaneça no fallback; não deixe um retângulo vazio. Em navegadores/dispositivos lentos, reduzir resolução, subdivisões e amplitude deve preceder desligar o efeito.

Fontes técnicas para consulta conforme a stack:
- [Boas práticas WebGL — MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices)
- [Documentação Three.js](https://threejs.org/docs/): PlaneGeometry, ShaderMaterial, Texture e descarte de recursos. Verifique a versão do projeto antes de usar APIs.

## Aceite

Verificar 320, 390, 768, 1024 e 1440 px e os breakpoints próprios do projeto. Em Chromium, Firefox e WebKit, testar primeiro/último item, wrap nos dois sentidos, cliques rápidos, drag invertido, gesto vertical, teclado, foco, rotação/resize, reduced motion, JS indisponível, textura com falha e contexto perdido. Inspecionar screenshots e gravação curta: imagem central legível, bordas realmente curvas e nenhum corte ou overflow da página.

Medir intervalos de frames após carregar texturas, separando o custo inicial do movimento contínuo. Comparar com a taxa de atualização disponível e registrar CPU/dispositivo/emulação. Não afirmar 60 fps em celulares reais com base só no desktop. Testar também ausência de trabalho contínuo quando o carrossel estiver parado.
