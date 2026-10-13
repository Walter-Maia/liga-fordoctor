---
name: indice-projetos-fundo-imersivo
description: Criar índices de projetos cuja linha ativa revela uma fotografia ou vídeo em fundo amplo, sincronizando hover, foco e seleção com contraste e navegação no mobile.
---

# Índice de projetos com prévia imersiva

Referência: [Liam Bennet](https://liam-bennet.framer.website/), visto por volta de 9 s no [Reel](https://www.instagram.com/reels/DcTT-hUoYrz/). No site foram observados uma lista em colunas sobre fundo preto, prévia fotográfica ampla e faixa colorida destacando uma linha. O rótulo sobreposto do Reel não define a arquitetura do componente.

## Uma lista, um estado visual

Use registros com id, título, cliente/categoria, imagem e URL. Cada linha é um link real. Guarde `activeId` único; hover de mouse e focusin selecionam a mesma prévia. A imagem de fundo é decorativa e não deve anunciar conteúdo duplicado. Se o projeto inclui vídeo, só uma prévia toca por vez e começa sem áudio.

Use duas camadas de imagem para crossfade: mantenha a atual até a próxima estar decodificada. Um token de requisição impede que uma imagem antiga que terminou de baixar tarde substitua a seleção mais recente. Cancelar/retarget a transição ao atravessar linhas rapidamente, sem uma fila de fades atrasados.

Mantenha altura constante das linhas. Uma faixa pode acompanhar a linha ativa por translateY ou cada linha pode mudar seu próprio fundo. Não mover a lista para destacar a seleção. Título do site, cabeçalho de colunas e navegação ficam acima da camada visual, com contraste estável por scrim ou superfície própria.

## Foco e toque

Quando a navegação por teclado assumir controle, evite que movimentos acidentais do mouse roubem a seleção. Ao perder seleção, mantenha a última imagem ou retorne ao fundo neutro de maneira definida. Não deixar uma imagem sem correspondência com a linha destacada.

No touch, um link deve abrir o projeto diretamente. Se a prévia for essencial antes de abrir, acrescente um botão de prévia separado e identificado; não exigir duplo toque oculto. No mobile, empilhe metadados secundários e ofereça miniatura inline se o fundo atrapalhar a leitura.

Reduced motion permite troca imediata ou fade curto. Respeite a rolagem normal; esse índice não requer pin, cursor falso nem WebGL. Sem JS, lista e links funcionam sobre fundo estático.

## Verificar

Testar teclado em todas as linhas, saída/reentrada do ponteiro, seleção rápida com rede lenta, erro de imagem e última linha perto do rodapé. Confirmar que a foto ativa corresponde ao link, que o contraste resiste a fotos claras/escuras e que nenhuma camada intercepta cliques. Validar 320/390/768/1440 px e zoom 200%.
