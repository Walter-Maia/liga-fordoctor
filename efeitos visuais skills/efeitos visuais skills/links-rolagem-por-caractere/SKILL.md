---
name: links-rolagem-por-caractere
description: Animar links e botões com caracteres que rolam verticalmente em sequência no hover e foco, mantendo uma única etiqueta acessível e o layout estável.
---

# Letras que rolam no hover

Referência: [Noah Miles](https://noahmiles.framer.website/), portfólio mostrado aproximadamente em 8 s no [Reel](https://www.instagram.com/reels/DcTT-hUoYrz/). A inspeção dos links do site e um hover em Works confirmaram duas representações por caractere e deslocamento vertical sequencial. Isso difere da skill de reveal de linhas ao entrar na tela: aqui o gatilho é a interação com um link.

## Estrutura

Mantenha um único link ou button com nome acessível integral. O conjunto animado é aria-hidden; forneça o nome com texto visualmente oculto ou aria-label, evitando duplicar a leitura. Cada grafema tem uma janela de recorte e duas cópias empilhadas. Anime o trilho em uma altura de linha, não a posição do elemento interativo.

Segmente grafemas com Intl.Segmenter quando disponível. Array.from é fallback limitado: caracteres combinados e emojis podem exigir tratamento adicional. Preserve espaços, ligaduras relevantes, RTL e largura original. Para texto longo ou quebra de linha, prefira animação por palavra ou estática em vez de recortar letras fora da janela.

Proposta CSS: transição de 250–420 ms, atraso por caractere de 12–25 ms limitado a um teto total de cerca de 180 ms. No hover/focus-visible, transladar cada trilho para a segunda cópia; ao sair, retornar sem acumular animações. Estes valores são pontos de partida, não medições do site original. A altura do recorte acompanha line-height e deve acomodar acentos e descendentes.

## Uso

Aplicar a navegação curta e CTAs secundários. Não usar em preços, instruções extensas ou todo texto da página. Manter sublinhado/contraste/foco perceptíveis. A caixa clicável não deve deslocar junto com as letras.

Limitar hover ao ponteiro preciso. No touch, link funciona no primeiro toque. Reduced motion mantém o texto inteiro estático. Se JS não carregar, o link continua legível; só construir a duplicação após medir fontes ou garantir métricas estáveis.

## Verificar

Testar “Indicação”, “Ação”, espaços, emoji composto, fontes substitutas e zoom 200%. Conferir um único nome acessível, foco visível, entrada/saída rápida e largura invariável. Gravar um trecho curto para conferir a sequência: o último caractere não deve continuar animando muito depois de o usuário sair.
