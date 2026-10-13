---
name: intro-crt-para-hero
description: Construir aberturas de site com estética de televisão CRT, transição da tela cheia para um monitor na hero e liberação segura do conteúdo, com versão de movimento reduzido.
---

# Abertura CRT que se integra à hero

Referência: [Eric Cole](https://eric-cole.framer.website/), também mostrado aproximadamente entre 6–7 s no [Reel](https://www.instagram.com/reels/DcTT-hUoYrz/). Inspeção da página mostrou uma moldura de TV ocupando a tela, contador, mudança de luminosidade e, depois, uma TV menor na hero. A sequência proposta abaixo recria essa continuidade; não presume acesso ao código original.

## Sequência e camadas

Monte a hero acessível primeiro, reservando o retângulo final da televisão. Separe moldura, conteúdo da tela e vinheta. O texto comercial e a navegação não ficam dentro de vídeo ou canvas. Use uma moldura própria/autorizada, mantendo proporção e abertura transparente.

Controle estados explícitos: idle → abertura → acomodação → concluída. Uma única linha do tempo governa a sequência. Comece com tela escura e ativação suave; revele imagem/vídeo; reduza o conjunto até o retângulo final; dissolva o overlay e libere a interação. Uma animação FLIP pode medir retângulos inicial/final e interpolar transform, em vez de animar width/top a cada frame.

Se a abertura inclui uma linha horizontal, ela deve expandir suavemente uma vez. Não imitar flashes intensos/repetidos. Scanlines e ruído são opcionais e discretos; não animar grandes filtros/blur em toda a página. Prefira uma textura pequena estática e máscara leve. Avaliar se o efeito ainda funciona sem ruído.

## Tempo e disponibilidade

Defina uma duração curta conforme a marca; 2–3 s é um ponto de partida, não uma regra do original. Um contador percentual só representa carregamento se medir trabalho real. Se for apenas uma assinatura visual, use um traço ou progresso sem alegar bytes carregados.

Preparar a camada inicial antes do primeiro paint relevante para evitar conteúdo aparecendo e sendo coberto depois. Porém, o site não pode depender da execução da animação para existir: sem JS, com erro ou timeout, liberar a hero. Escape/Tab devem concluir sem prender foco. Link profundo ou scroll restaurado não deve voltar ao topo para mostrar a abertura.

Reduced motion pula a transformação espacial. Clique/toque não pula por acidente, salvo decisão explícita do projeto. Resize durante a animação deve recalcular o destino ou terminar com segurança. Vídeo silencioso usa poster e trata falha de reprodução.

## Verificar

Registrar entrada/saída com cache frio, fontes atrasadas, CPU limitada, tela baixa e mudança de orientação. Conferir alinhamento da TV ao final, ausência de salto de layout, overlay removido e conteúdo clicável. Não usar o timeout como duração normal, nem deixar listeners/timers ativos após concluir.
