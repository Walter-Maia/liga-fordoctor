---
name: colagem-pastas-interativas
description: Criar categorias de portfólio como pilhas de fotografias e papéis que se abrem em leque na interação, com composição tátil editorial inspirada em Foldex.
---

# Pastas de colagem interativas

Referência: [Foldex](https://foldex.framer.website/), mostrado aproximadamente entre 3–4 s no [Reel](https://www.instagram.com/reels/DcTT-hUoYrz/). Na página navegável foram vistos grupos de imagens sobrepostas, papéis, clipes, etiquetas numéricas e fundo quadriculado. A abertura em leque abaixo é uma proposta de interação a partir dessa composição, não um algoritmo confirmado do template.

## Construção

Modele cada categoria como um único link com título e quantidade reais, envolvendo uma composição de 2–4 camadas decorativas. Defina aspect-ratio e espaço reservado; imagens internas podem ser absolutas, mas o link participa do fluxo. Evite uma imagem única com toda a interface achatada: título e quantidade continuam HTML.

Cada camada recebe rotações/deslocamentos estáveis por variáveis CSS. Ao hover/focus-visible, aumente separação lateral e rotação das folhas posteriores enquanto a capa sobe poucos pixels. Anime transform e sombra discreta, não top/left. Use origem perto da base ou do clipe para dar impressão de papel preso. O clipe fica acima da pilha, sem capturar eventos.

Pontos iniciais de direção, ajustáveis: repouso com rotações de -6 a +6 graus; leque com deslocamentos de 8–18 px e 250–450 ms de duração. Não são medições do site. Não sortear a composição em cada render: gera instabilidade e dificulta repetir o resultado.

## Conteúdo e mobile

Escolha papéis, fotos e detalhes coerentes com a marca. Não importar a colagem completa ou fotos do template. Texturas devem ser leves, locais e secundárias. Quantidades derivam do conteúdo e não de números decorativos inventados.

No touch, um toque abre a categoria; não exigir um primeiro toque para simular hover. Uma pilha estática com camadas já visíveis comunica o conceito. Com reduced motion, usar somente mudança de contraste/foco. Títulos não giram junto com os papéis, nem são cortados por overflow.

## Verificar

Conferir camadas nos limites do card, duas categorias lado a lado, hover rápido entre pastas, foco por teclado, títulos longos e zero itens. A expansão não pode mover o layout nem bloquear o link vizinho. Medir 320/390/768/1440 px e zoom 200%. Evitar adicionar cursores customizados ou física global para um efeito resolvido por poucas transforms.
