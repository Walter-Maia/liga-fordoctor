# Boas práticas de design (guia normativo)

Consolidação, em 28/09/2026, da skill frontend-design da Anthropic (síntese em `../ferramentas-agente-frontend/references/frontend-design-principios.md`), dos vídeos analisados (estilos de superfície de aydadex, carrossel de animação de web_pros, catálogos fancy e Componentry, portfólios Framer, logo "112" de the_odin_studio, blob líquido de tegadesigns1) e das decisões já tomadas nos projetos Siteflux e Vale do Aço Digital.

## 1. Comece pelo assunto, não pelo estilo

Antes de qualquer pixel: o que é, para quem, qual é o trabalho principal da página. As escolhas visuais saem da indústria, do material e do vocabulário do assunto. Siteflux é uma agência de sites com manutenção mensal para negócios locais; Vale do Aço Digital é um movimento regional (Vale + indústria + infraestrutura + pessoas). Um não pode parecer o outro nem parecer "site de tecnologia genérico".

Processo em dois passes: plano de tokens (4–6 cores nomeadas, famílias e papéis tipográficos, conceito de layout com wireframe ASCII e alinhamento, princípios) → revisão contra o briefing (se parece o que você faria para qualquer página parecida, revise e diga o que mudou) → código.

## 2. Hero é o momento característico

Abra com a coisa mais característica do assunto, na forma mais adequada: título, imagem, animação (símbolo virando site, no Siteflux), demo, momento interativo (blob que revela o código, no portfólio de tegadesigns1). "Número grande + rótulo + gradiente" é o padrão; só se for de fato o melhor.

## 3. Tipografia carrega a personalidade

- Uma ou duas famílias; se duas, claramente distintas (Siteflux: Montserrat + Space Grotesk; Vale: Montserrat em peso leve para títulos gigantes ~15,5 vw, tracking −0,05 em, entrelinha 0,92, referência exoape).
- Escala com pesos, larguras e espaçamentos intencionais; quando o tipo é o visual, ele é parte ativa (títulos que esticam, letras que rolam, texto por caractere).
- Linhas < 80 caracteres; serifas com linhas um pouco maiores e mais entrelinha.
- Evitar: uma só palavra destacada em cor/itálico no título; rótulos em caixa alta; etiquetas desnecessárias acima do conteúdo.
- `text-wrap: balance` em títulos; `tabular-nums` em números comparáveis; aspas curvas e reticências reais.

## 4. Estrutura visual é informação

Bordas, filetes, numeração, eyebrows e divisores codificam algo (sequência, hierarquia, agrupamento). Numeração 01/02/03 só quando é sequência real (Conectar → Compartilhar → Desenvolver → Proteger é; uma lista de recursos não é). Grade com blocos assimétricos (41 · 26 · 33 no Vale) diz mais que cards iguais.

## 5. Estilo de superfície a serviço do produto

Do reel de aydadex (Ddtjns6tLv5): quatro linguagens distintas, e "o estilo deve sustentar o produto, não só deixar a UI na moda".

| Estilo | Aparência | Quando | Cuidados |
|---|---|---|---|
| Glassmorphism | superfícies translúcidas foscas (`backdrop-filter: blur`) | camadas sobre foto/vídeo, navegação flutuante, cards sobre hero | contraste do texto sobre o vidro; fallback sem `backdrop-filter`; custo de pintura em telas cheias |
| Claymorphism | formas macias, infladas, 3D suave, sombras internas | produtos lúdicos, educação, apps de consumo | não em dados densos; sombras duplas pesam |
| Skeuomorphism | UI que imita objetos reais (calculadora, botão físico) | quando a metáfora ajuda (instrumentos, controles) | evitar decoração sem função |
| Neumorphism | superfícies suaves com relevo sutil no mesmo tom do fundo | dashboards calmos, controles | contraste baixo por natureza: falha em acessibilidade se usado em texto e estados |

Regra: escolher um estilo por produto e aplicá-lo com consistência; misturar dois só com intenção (vidro sobre foto no hero, plano no resto).

## 6. Evitar os "tells" de página gerada

Creme `#F4F1EA` + serifa + terracota `#D97757`; preto com um acento ácido; jornal com filetes; kit de cards SaaS iguais com a mesma sombra; eyebrow em caixa alta; pontos-médios; "PALAVRA — fragmento"; quase-preto `#0B0B0B`; monoespaçada em rótulos; "→" no fim de todo link; fade + subida em cada seção. Se o briefing pede, siga o briefing; se não, não gaste a liberdade nisso. A referência 13 desta biblioteca (estética terminal/dossiê) é um desses padrões e só entra por pedido explícito.

## 7. Movimento é feedback

Ver `animacao.md`. Um momento orquestrado por página; o resto responde a ações. Efeitos de catálogo (fancy, Componentry, Framer) são referência de comportamento, reescritos em vanilla e adaptados à identidade, nunca colados.

## 8. Escrita de interface

Voz ativa; CTA diz o que acontece ("Falar no WhatsApp", não "Enviar"); o nome da ação não muda no fluxo; erros com próximo passo; tela vazia convida a agir; segunda pessoa; caixa de frase; sem enchimento. Fato e conceito de comunicação separados (o README do Vale já faz isso); nunca prometer resultado que o texto oficial não promete.

## 9. Identidade dos dois projetos (decisões vigentes)

- **Siteflux:** fundo `#042b20`, lima `#ccd961`, ciano `#3cbcd5`, branco; intro do globo em toda visita (2.37), sem botão "pular"; vitrine de projetos em anel; apenas WebP; Montserrat local. Decisões do Walter em aberto listadas na memória `estado-landings-2026-09`.
- **Vale do Aço Digital:** linguagem "exo" (títulos gigantes leves, margem 6,5 vw, grade de 12 colunas assimétrica, paleta papel/areia/quase-preto com o vermelho da marca como único acento); intro com cometas e câmera (3,9 s), uma vez por sessão; hero em vídeo com scrub limitado a 2,5×.
- Em ambos: preservar trabalho existente, snapshot em `versoes/` antes de mexer, evidências em `qa/<etapa>/`, READMEs atualizados, limitações reais documentadas.

## 10. Contenção

Antes de entregar, tire um acessório. Piso de qualidade sem anunciar: responsivo até 320 px, foco visível, movimento reduzido, contraste, paleta harmônica. Critique com capturas, não com adjetivos.
