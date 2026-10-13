---
name: texto-grade-dispersao
description: Criar títulos com fragmentos em grade que se deslocam perto do ponteiro e retornam à forma original, mantendo o texto real legível e acessível.
---

# Texto com dispersão em grade

Referência: [Reel design4me__](https://www.instagram.com/reels/DdBi1YOo0H5/), aproximadamente 3,7–4,5 s, “scattered grid text”. Observado: a palavra Bonjour e fragmentação/deslocamento localizado perto de sua primeira letra. O trecho não mostra o algoritmo; reconstrução proposta abaixo.

Mantenha um título semântico com a frase original e crie uma camada visual aria-hidden. Aguarde as fontes antes de rasterizar ou medir o texto. Divida a representação em tiles, armazenando a posição original e o recorte correspondente. Evite criar centenas de elementos focáveis ou anunciar cada fragmento.

Use distância ao ponteiro para calcular força local com queda suave até zero fora do raio. Amortize deslocamento e retorno por tempo decorrido; não sorteie novos destinos a cada frame. Limite deslocamento e rotação para que a palavra continue reconhecível. Uma grade fina em canvas pode ser mais barata que milhares de spans; escolha após medir.

Ative só em hover de ponteiro preciso. Toque e reduced motion mostram texto estático; não fazer o título fugir de quem tenta tocar. Ao sair, perder foco da janela ou alterar tamanho/fontes, restaure a palavra. Reconstrua a grade em resize sem esconder o texto durante a medição.

Teste acentos, palavras longas, zoom 200%, quebra de linha e carregamento lento da fonte. Confirme retorno completo ao repouso, ausência de layout shift e um único título acessível. Não aplicar automaticamente a parágrafos, preços ou formulários.
