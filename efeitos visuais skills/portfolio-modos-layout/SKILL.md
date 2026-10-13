---
name: portfolio-modos-layout
description: Criar portfólios com alternância entre apresentações de lista e colunas/grade, animando reorganização com identidade estável, foco preservado e fallback sem movimento.
---

# Alternância de apresentação do portfólio

Referência: [Eric Cole](https://eric-cole.framer.website/), seção Selected Works. Foram encontrados e acionados controles rotulados COLUMN e LIST no site. A técnica FLIP descrita aqui é uma opção de reconstrução, não confirmação da implementação interna ou da semântica exata de cada modo do template.

## Estado e ordem

Defina claramente o que muda em cada modo: tamanho de imagem, número de colunas e disposição dos metadados. Mantenha os mesmos projetos, URLs e ordem semântica. Use ids estáveis e um único conjunto de dados. Evite duplicar toda a lista e esconder uma cópia com opacity, deixando links invisíveis no Tab.

Os seletores de modo são botões com estado aria-pressed e nomes claros. Não usar tabs se não houver painéis independentes. O controle ativado continua focado; alternar layout não deve mandar o visitante para o topo.

## Reorganização proposta

Com FLIP, medir retângulos dos itens antes da troca, aplicar a classe do layout final, medir novamente, inverter visualmente o deslocamento e animar transform até identidade. Separar leitura e escrita evita reflow por item. Conteúdo interno deve evitar escala prolongada de texto: animar posição do wrapper e tratar imagem/legenda separadamente quando necessário.

Não deixar transforms temporários no estilo final. Interrupção por outro clique começa das posições visuais atuais ou termina a animação anterior de forma controlada. Resize durante a transição invalida as medidas: concluir e recalcular o layout. Não calcular posições de imagens sem dimensões reservadas.

Uma duração inicial de 350–550 ms é sugestão ajustável. Reduced motion troca a classe sem trajetória. Sem suporte à API escolhida, uma mudança direta é suficiente. Não exigir biblioteca nova: Web Animations pode atender; reaproveitar infraestrutura existente se houver.

## Limites e testes

Em mobile os modos podem convergir para uma coluna; ocultar um seletor redundante é melhor que uma diferença imperceptível. Manter o modo preferido em memória é opcional, não persistir sem necessidade.

Testar alternância repetida, foco em um projeto, lista vazia, item único, títulos longos, imagem carregando, filtros combinados e resize. Validar que nenhum projeto some, duplica ou troca de URL e que o scroll não salta ao reorganizar itens acima da viewport. Gravação do percurso comprova mais que comparar apenas o início e o fim.
