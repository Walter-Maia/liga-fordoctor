---
name: hero-imersiva-miniaturas
description: Criar heros fotográficas de grande formato com título sobreposto e seletor compacto de miniaturas, sincronizando transição de imagens, carregamento e legibilidade.
---

# Hero imersiva com seletor de miniaturas

Referência: [Zentro](https://zentro.framer.media/), mostrado aproximadamente em 2 s no [Reel](https://www.instagram.com/reels/DcTT-hUoYrz/). Observado no site: retrato dominante sobre azul, nome de grande escala sobreposto e pequenas imagens agrupadas no canto inferior. O mecanismo de troca abaixo é uma proposta inspirada nessa composição; não foi confirmado o gatilho original das miniaturas.

## Composição

Crie camadas independentes: fundo visual, proteção de contraste, conteúdo HTML e seletor. Reserve altura responsiva e posição focal da foto. O tamanho do nome usa clamp e limites do contêiner; não uma largura fixa que corte letras em telas estreitas. Não copiar rosto, texto ou logo do template.

Use botões para selecionar imagens, com rótulo descritivo e aria-pressed. Miniaturas mostram os próprios arquivos em tamanho adequado. Um único estado selecionado determina imagem principal, destaque da miniatura e legenda quando houver. Clique e teclado são suficientes; hover pode pré-carregar sem trocar o conteúdo automaticamente.

Mantenha a imagem atual enquanto a próxima decodifica. Troque com crossfade/leve escala entre duas camadas, sem reconstruir o título. Cancele resultados de carregamentos antigos. Uma falha de imagem preserva a última válida. Não confundir transição elegante com desfocar a hero inteira e tornar o texto ilegível.

## Movimento e adaptação

Autoplay não é exigido pela referência. Se solicitado, ter pausa e respeitar interação, foco, visibilidade e reduced motion. Não combinar autoplay rápido com miniaturas pequenas. Começar com a primeira imagem leve e pré-carregar no máximo os próximos itens necessários.

No mobile, reposicionar miniaturas fora do rosto/CTA; manter controles de 44 px e título legível. Reduced motion usa troca imediata ou fade breve. Sem JS, uma hero estática íntegra. Não substituir o scroll global nem usar viewport fixa que esconda conteúdo sob a barra do navegador.

## Verificar

Comparar fotos claras/escuras, carregamento lento, clique rápido em várias miniaturas e imagem inexistente. Testar 320/390/768/1440 px, tela baixa e zoom. A altura não pode variar a cada imagem; contador/legenda e imagem precisam concordar. Conferir leitura do título, CTA e foco sobre todas as alternativas.
