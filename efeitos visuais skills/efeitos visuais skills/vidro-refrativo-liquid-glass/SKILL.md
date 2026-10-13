---
name: vidro-refrativo-liquid-glass
description: Adaptar superfícies e controles de vidro com refração usando dashersw/liquid-glass-js como referência, mantendo controles HTML acessíveis, contraste e fallback leve.
---

# Vidro refrativo para interfaces

Repositório correspondente ao vídeo: [dashersw/liquid-glass-js](https://github.com/dashersw/liquid-glass-js). Segundo recurso do [Reel](https://www.instagram.com/reels/DcxV37-CJOC/), aproximadamente 33–39 s. Não confundir com outros repositórios de mesmo nome nem com carrossel líquido: aqui o fundo é refratado por uma superfície de vidro.

## Ler antes de adaptar

Inspeção em 20/09/2026: licença MIT, JavaScript sem framework, classes Container e Button, WebGL e uso de html2canvas para amostrar a página. A branch principal consultada tem commit de junho de 2025. Isso não comprova abandono, mas exige teste atual de compatibilidade. Não repetir “zero dependências” ignorando html2canvas.

Examinar container.js, button.js e os estilos necessários. O código observado cria um div para o elemento do Container e amostra document.body; não assumir semântica de botão ou custo baixo pela aparência da demo. Não importar demo.js e painel de controles como parte da página de produção.

## Aplicar com propósito

Escolha um pequeno conjunto de superfícies: navegação, controle flutuante ou seletor. Preserve texto e ícones nítidos numa camada HTML. Refração acontece no fundo, não nas letras. Comece com borda e tint discretos; aumentar distorção central pode atrapalhar a leitura.

Use button/a reais para ações. Se o componente visual usa div/canvas, adapte a semântica e o teclado ou mantenha o renderizador como decoração sem captura de eventos. Estados disabled, focus-visible e pressed precisam funcionar independentemente do shader.

Evite capturar toda a página continuamente: delimite a região de amostragem quando viável, atualize em eventos necessários e meça o custo. Teste imagens CORS, vídeo, canvas e conteúdo dinâmico, que podem não aparecer corretamente na captura. Não incluir o próprio efeito na amostra recursivamente.

Implemente ciclo de vida explícito para instâncias, listeners, timers e recursos WebGL. Verifique o código real antes de chamar um método destroy/dispose: não presumir que a biblioteca oferece essa API. Limite a quantidade de contextos simultâneos.

## Fallback e testes

Se a refração não funcionar ou for cara, use superfície translúcida com blur CSS quando suportado e cor sólida como último fallback. Identificar esse modo como simplificação visual. Reduced motion remove ondulação; não remove a funcionalidade do controle.

Testar Chrome/Chromium, Firefox e WebKit, com e sem WebGL, e áreas claras/escuras atrás da superfície. Verificar legibilidade, toque de 44 px, Tab/Enter/Space, resize, scroll e liberação ao desmontar. A confirmação do README sobre navegadores não substitui testes na integração.
