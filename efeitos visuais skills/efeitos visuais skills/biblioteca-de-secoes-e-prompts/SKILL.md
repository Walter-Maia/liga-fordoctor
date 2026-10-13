---
name: biblioteca-de-secoes-e-prompts
description: Montar e manter uma biblioteca própria de seções de landing page reutilizáveis (hero, prova, passos, planos, FAQ, CTA) com HTML/CSS isolados, tokens e uma ficha por seção, mais o modelo de prompt para um agente personalizar cada seção com identidade e conteúdo factual do cliente. Use quando o pedido for "monta uma página de vendas rápido", "quero modelos de seções prontos", "kit de landing", "reaproveitar seções do Siteflux/Vale em outro cliente", "prompt para a IA personalizar o modelo", ou para transformar um site aprovado em modelos para o próximo.
---

# Biblioteca de seções e prompts de personalização

O ponto de partida é um anúncio de produto pago que vende exatamente isso: modelos prontos de seções e páginas, cada um com um prompt para colar em uma IA e trocar imagens, cores e seções. A skill não compra nem copia o kit: ensina a montar a **biblioteca própria** equivalente a partir das landings já aprovadas deste repositório, com as regras de trabalho que o Walter repete nos briefings (fatos × conceitos, nada de números inventados, snapshot antes de mexer).

## Referência

Post: [p/Dc4NwWWMKMl](https://www.instagram.com/p/Dc4NwWWMKMl/), omatheus.augusto, vídeo de 50 s, legenda: "Tenha uma página de vendas profissional sem precisar criar nada do zero e independente do seu conhecimento em design. Com o Kit Página no Ar, você recebe modelos prontos, personaliza com IA e coloca sua oferta no ar ainda hoje. Clique em Saiba Mais". É um **anúncio pago** (`vencode_tag` do vídeo marca `INSTAGRAM.AD`) de um produto comercial; não há repositório, licença ou código público. Inspecionado em 28/09/2026 a 1 quadro/s. Evidência local: `qa/reels-2026-09-28/Dc4NwWWMKMl-p01.jpg` a `-p05.jpg`.

Observado: uma interface escura ("Tudo que você precisa, em um só lugar") com uma grade de miniaturas de páginas e seções numeradas (01–04) — heros com foto e título forte, "Soluções que entregamos", "Para empresas", "Trabalhos realizados", seções de FAQ e CTA; o fluxo mostrado é *escolher o modelo → copiar o prompt → colar na IA (Gemini, "Build your ideas with Gemini") → pedir para trocar imagens, cores e seções específicas → montar a página*. Há também "tutoriais passo a passo". Não é possível avaliar a qualidade do código dos modelos pelo vídeo.

O que vale extrair: o **formato do produto** (biblioteca navegável + ficha + prompt por seção) é uma boa forma de organizar trabalho reutilizável. Tudo abaixo é proposta autoral.

## Quando usar / quando não usar

Use para: acelerar um segundo ou terceiro cliente com estrutura parecida (landing de serviço local, institucional, campanha); documentar as seções aprovadas do Siteflux e do Vale como modelos; dar a um agente um ponto de partida verificado em vez de "faça uma landing".

Não use para: substituir direção de arte (a skill `frontend-design` e o manual de motion continuam mandando: cada cliente tem identidade própria, e a biblioteca só entrega estrutura e comportamento); copiar texto, fotos ou números de um cliente para outro; publicar sem os testes que cada seção pede.

## Estrutura da biblioteca

Uma pasta por seção, isolada e servível sozinha:

```
biblioteca-secoes/
  README.md                 índice: nome · objetivo · quando usar · origem (site aprovado + versão)
  tokens.css                variáveis neutras (--cor-fundo, --cor-texto, --cor-acento, --fonte-titulo, --fonte-texto, --raio, --espaco-*)
  secoes/
    hero-argumento/
      FICHA.md              ficha (abaixo)
      secao.html            só o <section>, classes com prefixo próprio (.hero-arg__*)
      secao.css             só o CSS da seção, usando tokens; sem seletores globais
      secao.js              opcional; progressivo (a seção funciona sem ele)
      preview.html          monta tokens + secao.* para abrir no navegador e no harness de QA
      conteudo-exemplo.json campos com texto de exemplo marcado como fictício
    prova-social/
    passos-como-funciona/
    planos/
    faq/
    cta-final/
    rodape/
  prompts/
    personalizar-secao.md   modelo de prompt (abaixo)
    montar-pagina.md        modelo para compor 5–7 seções em uma página
```

Regras de isolamento: cada seção declara suas dependências (fontes, ícones, um script) na ficha; nada de CSS global além de `tokens.css`; imagens sempre com `width`/`height`, `loading="lazy"` fora da dobra, `alt` preenchido pelo conteúdo. Os efeitos vêm da biblioteca `efeitos visuais skills/` por referência (a ficha diz "reveal família 02, fade + lift"), não por cópia de código em cada seção.

## Ficha de cada seção (FICHA.md)

```markdown
# Hero com argumento e prova

**Objetivo:** dizer em 3 s o que é, para quem e a ação principal.
**Origem:** Siteflux `index.html` #inicio, versão 2.37 (23/09/2026); comportamento aprovado pelo Walter em …
**Conteúdo obrigatório:** título (≤ 9 palavras) · argumento (≤ 25 palavras) · CTA principal (verbo + objeto) · 1 elemento visual oficial (logo/ilustração/foto do cliente).
**Conteúdo opcional:** CTA secundário · linha de prova (só com fonte) · badge.
**Variações:** A) texto à esquerda + visual à direita · B) centrado com visual abaixo · C) visual em sangria.
**Animação:** um momento orquestrado (ver quatro-familias-de-animacao, família 02); sem parallax.
**Não fazer:** contador de clientes sem fonte; "eyebrow" em caixa alta por hábito; frase com uma palavra colorida por padrão.
**Responsivo:** 360 · 768 · 1366 · 1920 testados em <data>; texto não sai da caixa em 320 (exofit).
**Acessibilidade:** um único h1; CTA é <a> com nome completo; contraste ≥ 4,5:1 sobre o visual.
**Testes:** `node tools/cdp.js exo 1440 900` (ou equivalente) + captura em `qa/`.
```

A ficha é o contrato. Uma seção sem ficha não entra na biblioteca.

## Modelo de prompt de personalização (prompts/personalizar-secao.md)

O prompt separa o que o agente **recebe como fato**, o que pode **propor** e o que **não pode inventar**. Modelo:

```markdown
Você vai personalizar a seção `<nome-da-secao>` desta biblioteca para o cliente <nome>.

## Identidade (fatos, use exatamente)
- Cores oficiais: <hex> (fundo), <hex> (texto), <hex> (acento). Não crie cores.
- Tipografia: <família> (títulos), <família> (texto). Arquivos em <caminho> ou Google Fonts <link>.
- Logo/vetores: <caminho do SVG oficial>. Não redesenhe.
- Tom de voz: <2 linhas>. Público: <quem>. Ação principal: <o que a pessoa faz>.

## Conteúdo factual (fatos com fonte; não altere o sentido)
- Título e argumento: <texto> (fonte: <briefing/site oficial>)
- Prova, números, prazos, preços: <lista com fonte> — se um campo estiver vazio, deixe o placeholder `TODO` visível; não invente.
- Imagens: <caminhos + créditos/licença>. Sem imagem oficial, use o bloco de cor da identidade, não banco de imagens.

## O que você pode propor
- Variação (A/B/C) da ficha e o motivo.
- Microcopy de botões e rótulos (ativo, específico: "Pedir orçamento", não "Enviar").
- Ajuste de espaçamento e escala dentro dos tokens.

## O que não fazer
- Não trocar a estrutura semântica (h1/h2, <a> vs <button>) nem remover atributos de acessibilidade.
- Não adicionar efeitos além do que a ficha permite; não usar `transition: all`.
- Não afirmar ganho de conversão, "aprovado por", depoimentos ou cifras sem fonte.

## Entrega
1. Snapshot do estado anterior em `versoes/<nome>/` + linha em `versoes/LEIA-ME.md`.
2. `secao.html/css/js` personalizados no projeto do cliente, com `?v=` nos assets.
3. Capturas em `qa/<etapa>/` nas quatro larguras; lista do que foi testado e do que não pôde ser (sem celular físico, Safari, Firefox).
4. README do projeto atualizado com: o que mudou, decisões aprovadas, pendências `TODO`.

## Critérios de aceite
- Todos os fatos batem com a fonte; nenhum `TODO` foi preenchido com invenção.
- Sem erros de console; sem estouro lateral em 320–1920; h1 único; foco visível.
- A seção funciona sem JS (texto e links visíveis).
```

Para montar uma página, `prompts/montar-pagina.md` lista a ordem sugerida (hero → prova → como funciona → planos → FAQ → CTA final → rodapé), exige no máximo um momento orquestrado de animação e 3–5 efeitos no total, e repete os critérios de aceite.

## Como isso conversa com o repositório

- Os briefings `PROMPT-CLAUDE-SITEFLUX-*.md` na raiz já são prompts de personalização de alto nível; a biblioteca só os torna repetíveis por seção. As regras que eles repetem valem aqui: preservar trabalho existente; snapshot em `versoes/`; quatro projetos reais no portfólio sem links externos; evidências em `qa/<etapa>/`; atualizar READMEs; documentar limitações reais; não afirmar ganho de conversão.
- "Fato × conceito × pendência" do README do Vale é o modelo da divisão do prompt: o que tem fonte, o que é comunicação, o que é `TODO`.
- Seções candidatas a virar modelo hoje: Siteflux `#recursos`, `#como-funciona`, `#planos`, `#faq`; Vale "Na prática" (linha que enche com o scroll), "Perguntas" (JSON-LD FAQPage gerado das mesmas perguntas), CTA final com três entradas para o WhatsApp. Antes de extrair, confirmar com o Walter quais estão aprovadas na versão atual.
- Nada vai para a biblioteca com texto, foto ou número do cliente original: `conteudo-exemplo.json` é fictício e marcado como tal.

## Verificação

Cada seção entra na biblioteca depois de: abrir `preview.html` servido localmente e rodar o cenário de QA correspondente (no Vale, `node tools/cdp.js exo|exofit`; no Siteflux, os scripts em `qa/`), 0 erros de console, 0 estouro lateral em 320–1920, título dentro da caixa, foco visível, funcionamento sem JS. Registrar data e larguras testadas na ficha. Quando uma seção for personalizada para um cliente, o mesmo roteiro se repete no projeto do cliente.

## Limites e licença

O post é publicidade de um kit comercial; a skill não reproduz seus modelos, textos ou prompts e não avalia sua qualidade. A estrutura de biblioteca, as fichas e o modelo de prompt são autorais. Ao extrair seções dos sites deste repositório, o código é do próprio projeto; fotos e logos de terceiros seguem os créditos em `assets/CREDITS.md` de cada site e não são reutilizáveis em outros clientes.
