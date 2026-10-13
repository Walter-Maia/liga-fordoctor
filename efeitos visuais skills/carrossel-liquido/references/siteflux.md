# Aplicação no Siteflux

Contexto inspecionado em 20/09/2026. Antes de implementar, reler os arquivos: esta referência pode ficar desatualizada.

- Projeto estático: `index.html`, `assets/css/siteflux.css`, `assets/js/siteflux.js`.
- Controlador existente: IIFE `carousel()` e seletor `[data-carousel]`. Há `.carousel-viewport`, `.cards`, botões `[data-prev]`/`[data-next]`, indicadores, contador e pausa.
- Já existem autoplay de 4,6 s, navegação de 750 ms, estado `pos/index`, clones inertes e swipe. Reaproveitar a máquina de estados e substituir/adicionar a camada visual; evitar dois controladores disputando transform e índice.
- Ler `CORRECAO-CARROSSEL-SITEFLUX.md` e README. O carrossel deve continuar reconhecível como carrossel, sem pin/scroll vertical obrigatório ou barra de rolagem exposta. Peças com texto devem ser exibidas integralmente.
- Paleta verde-escuro/lima/ciano e Montserrat; adaptar a referência ao painel existente. Começar com deformação lateral moderada e centro plano. Não copiar a moldura vermelha do Reel: ela pertence à edição do vídeo.
- O briefing existente pede não acrescentar biblioteca só para este componente. Preferir WebGL nativo ou recursos já disponíveis; não presumir autorização para introduzir Three.js. Se uma dependência se tornar necessária, explicar a decisão no contexto da implementação.
- Preservar intro, planos, preços, links e a pasta `vale-do-aco-digital`, que contém outro projeto.

Esta entrega acrescenta skills; não modifica o carrossel do site. A integração deve ser uma tarefa de implementação com comparação visual antes/depois e os testes descritos na skill.
