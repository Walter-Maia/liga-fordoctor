# Princípios da skill frontend-design (Anthropic), em português

Síntese de `plugins/frontend-design/skills/frontend-design/SKILL.md` do repositório [anthropics/claude-code](https://github.com/anthropics/claude-code), lido em 28/09/2026 (licença descrita no `LICENSE.txt` do plugin). É uma síntese, não a skill; para aplicá-la como skill, instale o plugin. Postura proposta pelo texto: agir como diretor de uma casa de design conhecida por dar a cada cliente uma identidade que não se confunde com a de ninguém, para um cliente que já rejeitou propostas clichê.

## Ancorar no assunto

Se o briefing não diz o que é o produto, descubra e confirme antes de desenhar: um assunto concreto, o público e o trabalho principal da página. Indústria, matéria-prima e vocabulário do assunto são a fonte das escolhas visuais; um brinquedo para meninas de 8–11 anos e um painel para analistas financeiros não podem sair parecidos. Construa com o conteúdo real.

## Princípios

- **Hero é o momento mais característico do assunto**, na forma mais adequada: título, imagem, animação, demo ao vivo ou momento interativo. "Número grande com rótulo pequeno, estatísticas de apoio e acento em gradiente" é o padrão; só use se for de fato a melhor opção.
- **Tipografia carrega a personalidade.** Uma ou duas famílias; se duas, claramente distintas. Escolha deliberada, não a família que você usaria em qualquer projeto; escala tipográfica com pesos, larguras e espaçamentos intencionais. Quando o tipo é o elemento visual, trate-o como parte ativa do design.
- Linhas com menos de 80 caracteres; serifas aceitam linhas um pouco mais longas e pedem mais entrelinha.
- Evitar os tratamentos tipográficos mais denunciadores: destacar uma única palavra do título em itálico/negrito/cor; rótulos em caixa alta; etiquetas desnecessárias acima do conteúdo.
- **Estrutura visual é informação.** Contornos, bordas, numeração, eyebrows, divisores e rótulos codificam algo sobre o conteúdo; não decoram. Numeração (01/02/03) só se o conteúdo for de fato uma sequência.
- **Movimento não acionado pelo usuário com parcimônia**, só para dirigir atenção. Um momento orquestrado (uma sequência de carga ou um reveal) funciona melhor que efeitos espalhados; fade + subida em cada seção e hover em cada card é o padrão genérico e lê como gerado por IA. Movimento que responde a uma ação (abrir, expandir, confirmar) é bem-vindo quando mostra o que mudou.
- **Texto é conteúdo de design**, com a mesma intenção e minimalismo do espaçamento e da cor.

## Os "tells" de página gerada por IA

Todos legítimos para algum briefing, mas são padrões, não escolhas, e aparecem seja qual for o assunto. Se o briefing pede um deles, siga o briefing; onde ele deixa livre, não gaste a liberdade neles.

1. Fundo creme quente (≈ `#F4F1EA`) com serifa de alto contraste e acento terracota/argila (≈ `#D97757`, a cor de interação do Claude, por isso delata).
2. Fundo quase preto com um único acento verde-ácido ou vermelhão.
3. Layout de jornal ("broadsheet") com filetes finos, raio zero e colunas densas.
4. Kit de cards SaaS: conteúdo picado em cards iguais, um só `border-radius` para tudo, a mesma sombra cinza suave (`rgba(0,0,0,.1)`) e lavagens de gradiente como decoração.
5. Chrome de template: eyebrow em CAIXA ALTA espaçada acima de todo título; metadados unidos por ponto-médio ("A · B · C"); rótulos "PALAVRA — fragmento" com travessão espaçado; quase-preto tingido (`#0B0B0B`, `#111`) no lugar do preto; monoespaçada em rótulos pequenos; "→" no fim de links e botões.

## Processo em dois passes

1. **Plano compacto de tokens** a partir do briefing: cor (4–6 hex nomeados), tipo (famílias e papéis), layout (uma frase e um wireframe ASCII; alinhamento à esquerda, centralizado ou justificado) e princípios (o que torna esta página única).
2. **Revisão contra o briefing antes de codar:** se alguma parte do plano parece o padrão que você produziria para qualquer página parecida (simule um prompt semelhante e veja se cai no mesmo lugar), revise e diga o que mudou e por quê. Só então escreva o código, seguindo o plano revisado.

Ao codar, cuidado com especificidade de seletores que se cancelam (`.section` vs. `.cta`), sobretudo em padding/margin entre seções.

## Contenção e autocrítica

Gaste a ousadia em um lugar: um elemento memorável, o resto quieto e disciplinado; corte decoração que não serve ao briefing. Piso de qualidade sem anunciar: responsivo até o celular, foco visível no teclado, movimento reduzido respeitado, acessível, paleta harmônica. Critique o próprio trabalho com capturas de tela. Antes de sair de casa, olhe no espelho e tire um acessório (Chanel). Anote o que já tentou para não repetir.

## Escrita na interface

Palavras existem para tornar a interface mais fácil de entender e usar. Escreva do ponto de vista de quem usa: "gerenciar notificações", não "config de webhook". Descreva o que a coisa faz em termos simples, sem vender. Voz ativa; o CTA diz exatamente o que acontece ("Salvar alterações", não "Enviar"); a ação mantém o mesmo nome no fluxo inteiro ("Publicar" → toast "Publicado"). Erros explicam o que houve e como corrigir, sem pedir desculpas e sem vagueza; tela vazia é convite a agir. Tom conversacional, verbos simples, caixa de frase, sem enchimento; cada texto faz um único trabalho.
