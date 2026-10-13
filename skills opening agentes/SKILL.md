---
name: landing-design-wordpress
description: Dirigir e implementar landing pages com identidade própria, aberturas (intros) estilosas e diferentes a cada marca, parallax em camadas, flutuação e vídeo, com componentes responsivos; preparar, testar e publicar essas páginas (WordPress, pasta no servidor, GitHub Pages) e versionar no GitHub. Traz receitas reais do Siteflux, do Vale do Aço Digital e da ForDoctor. Use em criação ou refinamento visual de campanhas, ao criar uma intro de site e na entrega.
---

# Direção de landing pages e entrega WordPress

Transforme o material do cliente em uma experiência navegável, com decisões visuais justificadas e arquivos que outro agente consiga manter. A skill ensina o fluxo; não concede acesso a contas nem autorização permanente para publicar em projetos futuros.

## Comece pela decisão de design

Leia AGENTS.md e a direção atual do projeto. Identifique público, ação principal, conteúdo obrigatório e materiais oficiais. Separe fatos comerciais de mensagens promocionais. Preserve condições e qualificadores perto da promessa: crédito condicionado a conversão não equivale a dinheiro por preencher um formulário. Não invente números, depoimentos, parceiros ou resultados.

Inspecione imagens antes de usá-las; monte uma folha de contato quando houver muitas. Aproveite fotografias, símbolos e assinaturas pertinentes. Não transforme a landing inteira numa imagem de layout nem duplique peças de redes sociais com instruções como “arraste” ou “clique abaixo”. Mantenha títulos, regras, links e formulário em HTML. Quando o cliente mandar uma arte pronta, recomponha-a em seções HTML usando recortes limpos das fotos e o texto como texto. Não atribua profissão, depoimentos ou resultados à pessoa de uma fotografia sem informação fornecida.

Defina uma hierarquia própria: título, argumento, condição, ação e apoio visual. Use cores e vetores oficiais, tipografia legível, largura de leitura e espaçamentos consistentes. Uma imagem deve ajudar a explicar ou humanizar a oferta. Evite adicionar neon, bordas giratórias, brilhos e cards repetidos por padrão; considere o gosto explicitamente aprovado pelo usuário. Fonte ou biblioteca externa nova só com aprovação.

## Aberturas (intros)

Cada marca merece uma intro própria, derivada da geometria dela: o globo da Siteflux vira palco de cores girando; o triângulo + meio-disco do Vale vira close de câmera com linhas concêntricas; um wordmark vira letras desenhadas. Leia [aberturas.md](references/aberturas.md) antes de criar qualquer intro: ele traz o contrato técnico obrigatório (decisão no `<head>`, failsafe em CSS, saídas natural e de segurança, sessão, movimento reduzido), seis conceitos testados e um método para inventar um conceito novo sem repetir o último cliente. Receitas completas, com tempos, estão em [siteflux.md](references/siteflux.md) e [vale-do-aco-digital.md](references/vale-do-aco-digital.md).

## Movimento e componentes

Para parallax, flutuação, reveals, vídeo, loops, acordeões ou problemas de fluidez, leia [motion.md](references/motion.md). Trabalhe a sequência e a transição para o conteúdo, não apenas o logo isolado. Separe cada efeito em sua própria camada. Preserve entrada por teclado, movimento reduzido, um modo estático (`?fx=0`) e a disponibilidade do conteúdo quando JavaScript falhar.

Para refinamentos, observe o componente no navegador, formule uma causa e valide a mudança com seu comportamento real. Quando o usuário mandar uma captura com o elemento selecionado, use o seletor dela para achar o nó exato. Não declare “responsivo em qualquer resolução”: teste larguras representativas e transições de breakpoint e relate o que verificou. Em ajustes de tamanho pedidos “um pouco”, mude um único token, mostre o resultado e guarde o valor anterior para poder voltar.

## Implementação e entrega

Use uma fonte única para o conteúdo e gere preview e template do plugin quando for WordPress. Evite editar apenas arquivos gerados. Preserve classes isoladas do tema, dimensões de imagens, versão dos assets (`?v=`) e opções administrativas. Para WordPress, pasta estática no servidor, GitHub Pages, repositório e QA, leia [delivery.md](references/delivery.md).

Se o usuário pedir colaboração com outro agente, entregue uma tarefa delimitada com contexto, arquivos, critérios de aceite e responsabilidade de validação. Use as ferramentas disponíveis da sessão, consultando suas instruções; não presuma que Claude, Orca, Edge ou autenticação estão disponíveis. Não é necessário delegar para aplicar esta skill.

## Continuidade

Registre decisões aprovadas no projeto, incluindo as que substituem decisões antigas. Separe conhecimento reutilizável de dados de um cliente. Não salve senhas, cookies, tokens ou respostas de formulários na skill; se uma senha foi passada no chat, use-a só na tarefa, encerre a sessão e recomende trocá-la. Referências de projeto (não impor a outras marcas):

- [fordoctor.md](references/fordoctor.md) — ForDoctor Indica (WordPress, intro de 2,5 s, loop de conexões).
- [siteflux.md](references/siteflux.md) — Siteflux (intro vetorial com máscaras, cabeçalho em partes, seções que se invadem).
- [vale-do-aco-digital.md](references/vale-do-aco-digital.md) — Vale do Aço Digital (intro com câmera, hero em vídeo por rolagem, logos de parceiros animados, campanha com parallax, três planos e vídeo story).

Entregue um resultado verificável: o que mudou, caminhos e versão, testes realizados, URL publicada quando houver e qualquer pendência real. “Upload aceito”, “plugin atualizado”, “site carregando a versão” e “e-mail recebido” são evidências distintas.
