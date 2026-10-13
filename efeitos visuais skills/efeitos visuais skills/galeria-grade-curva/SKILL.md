---
name: galeria-grade-curva
description: Criar galerias de imagens em grade com curvatura espacial e resposta suave ao ponteiro ou arraste, preservando dados de CMS e navegação acessível.
---

# Galeria em grade curva

Referência: [Reel design4me__](https://www.instagram.com/reels/DdBi1YOo0H5/), aproximadamente 2,8–3,7 s, “CMS curve gallery”. Observado: mosaico de fotos apresentado numa superfície curvada. O rótulo cita CMS; o vídeo não mostra integração de dados nem comprova qual CMS foi usado.

Comece com uma lista de registros id/imagem/alt/título/link, vinda da fonte real do projeto. Não implante CMS só para reproduzir a aparência. Faça primeiro a grade responsiva estática.

Para curvatura verdadeira, posicione vértices de cada tile sobre um cilindro: para coordenada horizontal x e raio R, uma proposta é theta=x/R, x'=R*sin(theta), z'=R*(1-cos(theta)). Compartilhe a mesma origem entre tiles, preserve gaps e mantenha títulos HTML. CSS rotateY/translateZ é alternativa facetada; não apresentá-la como superfície lisa idêntica.

Limite a rotação do conjunto e mantenha o centro legível. No mobile, reduza colunas e curvatura ou use grade plana. Links devem continuar acionáveis por teclado; ofereça lista HTML equivalente se o canvas não permitir hit testing confiável. Não colocar link invisível desalinhado sobre uma imagem curva.

Teste troca/remoção de registros, proporções distintas, imagem ausente, foco, resize e lista vazia. Pause renderização fora da viewport e use modo estático para reduced motion ou falha de WebGL. Verifique leitura das imagens laterais, não apenas ausência de erro no console.
