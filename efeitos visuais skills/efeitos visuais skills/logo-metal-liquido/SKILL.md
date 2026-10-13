---
name: logo-metal-liquido
description: Criar tratamentos de logo com aparência de metal líquido inspirados em paper-design/liquid-logo, preservando a silhueta, distinguindo o shader do aplicativo completo e verificando sua licença.
---

# Logo com acabamento de metal líquido

Repositório: [paper-design/liquid-logo](https://github.com/paper-design/liquid-logo). Quarto recurso do [Reel](https://www.instagram.com/reels/DcxV37-CJOC/), aproximadamente 46–51 s. O nome, identidade Paper e exemplo visual foram cruzados com o repositório. Não confundir com `collidingScopes/liquid-logo`, que é outro projeto homônimo.

## Delimitar a reutilização

A aplicação consultada usa Next.js/React e shaders. O arquivo `src/app/hero/liquid-frag.ts` contém um fragment shader GLSL com tempo, textura, proporção e controles de padrão/refração. Esse arquivo sozinho não é um componente pronto: a preparação da imagem, montagem WebGL, uniforms e ciclo de vida também precisam ser entendidos.

O [LICENSE](https://github.com/paper-design/liquid-logo/blob/main/LICENSE) consultado em 20/09/2026 é PolyForm Shield 1.0.0, não MIT. Antes de reutilizar código, ler as condições aplicáveis, inclusive a restrição relativa a produtos concorrentes e os avisos de distribuição. A licença de um pacote separado da Paper não deve ser inferida da licença desta aplicação. Se o uso não estiver coberto, usar uma reconstrução visual própria sem copiar código protegido ou esclarecer a autorização necessária.

Não levar o aplicativo inteiro, uploads, analytics, armazenamento remoto ou páginas de compartilhamento para uma landing que só precisa animar um símbolo.

## Preparar a marca

Use uma imagem local de alta qualidade com fundo transparente ou máscara adequada. Confira alpha, proporção, margens e orientação vertical da textura. Preserve uma imagem/SVG estático oficial de fallback com o mesmo tamanho. Não redesenhar a marca ou afinar traços por conveniência do shader.

Separe silhueta de material: o contorno continua reconhecível enquanto bandas de luminosidade e reflexão se movem no interior. Comece com velocidade lenta, refração baixa e poucos tons. Aberração cromática e deformação forte são opções estéticas, não requisitos do efeito. Textos pequenos e assinatura institucional normalmente devem ficar fora da superfície líquida.

Para uma intro, o acabamento pode assentar na cor oficial antes de dissolver para o site. Duração pertence ao projeto; não adicionar espera artificial só para mostrar o material. Para loop decorativo, pausar fora da viewport e em aba oculta.

## Integração e validação

Carregar somente os recursos necessários, limitar pixel ratio e limpar shaders/texturas/listeners ao desmontar. Tratar textura não carregada, proporção incorreta e perda de contexto com fallback imediato. Reduced motion mostra marca estática. Título e nome acessível são HTML, sem duplicação pelo canvas.

Inspecionar bordas em tamanho pequeno, fundo claro/escuro, logos com vazados e tela mobile. Medir GPU durante a animação e confirmar ausência de trabalho contínuo quando pausada. Não afirmar suporte a qualquer logo: traços muito finos e detalhes pequenos podem perder leitura mesmo com o shader correto.
