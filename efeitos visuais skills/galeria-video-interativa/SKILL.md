---
name: galeria-video-interativa
description: Construir galerias editoriais de vídeos curtos com posters, reprodução seletiva e controle de consumo, adaptando hover para toque e movimento reduzido.
---

# Galeria de vídeos

Referência: [Reel design4me__](https://www.instagram.com/reels/DdBi1YOo0H5/), aproximadamente 7,7–8,5 s, “video gallery”. Observado: mosaico de peças visuais. A curta duração não permite confirmar quantos vídeos são simultâneos nem qual gesto inicia a reprodução. Não inventar essas propriedades como fatos da referência.

Use posters com dimensões reservadas e elementos video reais, com controles acessíveis quando necessários. Reprodução decorativa automática deve ser silenciosa e playsinline, com tratamento da Promise de play rejeitada. Não pressupor autoplay com áudio.

Para hover de mouse, tocar apenas a peça sob o ponteiro; ao sair, pausar e escolher explicitamente manter quadro ou voltar ao poster. No toque, oferecer play/pause claros. Se o vídeo contém informação ou fala necessária, prover legendas e alternativa textual; não tratar conteúdo essencial como decoração.

Carregue somente os itens próximos e limite a quantidade de vídeos ativos. Pause ao sair da viewport e quando a aba for ocultada. Reduced motion começa nos posters. Não carregar todos os arquivos completos com preload auto.

Teste autoplay bloqueado, conexão lenta, erro de arquivo, entrada/saída rápida de hover, play por teclado, interrupção e orientação. Conte quantos vídeos estão efetivamente tocando para comprovar a política de reprodução. O fallback é poster com link/controle funcional, nunca um card vazio.
