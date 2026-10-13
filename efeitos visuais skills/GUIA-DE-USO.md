# Guia de uso da biblioteca de efeitos visuais

Esta pasta é uma biblioteca consultável por pessoas e por agentes. Cada subpasta é uma skill autônoma: um `SKILL.md` com frontmatter (`name`, `description`), o que foi observado na referência, a reconstrução proposta, parâmetros, acessibilidade e como verificar. Algumas trazem `references/` (leituras longas), `template/` (HTML funcional) ou `scripts/` (verificação). Nada aqui é código extraído de terceiros: são reconstruções autorais e anotações sobre repositórios abertos, com licença registrada.

Atualizado em 28/09/2026 com o lote de onze posts do Instagram ([referencias/04-LOTE-2026-09-28.md](referencias/04-LOTE-2026-09-28.md)).

## Como está organizada

| Pasta | O que é |
|---|---|
| `SKILL.md` | Índice raiz: setup GSAP + Lenis do catálogo clássico e ponteiros para as demais skills |
| `efeitos/01…13` | Catálogo clássico estilo Awwwards/Framer, um arquivo por efeito, código pronto (GSAP + Lenis) |
| `boas-praticas/` | Regras normativas: [animação](boas-praticas/animacao.md), [design](boas-praticas/design.md) e [checklist de revisão](boas-praticas/checklist-revisao-ui.md) |
| `referencias/` | Catálogos de cada fonte analisada (sites, Reels, repositórios), com evidências e limites |
| Demais pastas | Uma skill por efeito, componente, técnica ou ferramenta |

Leia sempre nesta ordem: **boas-praticas/animacao.md → skill de decisão (`quatro-familias-de-animacao`) → skill específica do efeito**. Ler tudo de uma vez não ajuda; a biblioteca é grande de propósito para que cada pedido use só o que precisa.

## Como escolher a skill

**1. O pedido é sobre abertura ou logo?**
- Intro/splash com o logo da marca → [efeito-de-intro](efeito-de-intro/SKILL.md) (fluxo completo, template, verificação por quadros).
- Batidas cinematográficas de reveal de logo (flip, desintegração, pop de fundo, wireframe → preenchimento, expansão para o nome) → [logo-reveal-cinematico](logo-reveal-cinematico/SKILL.md).
- Abertura com moldura de TV/CRT → [intro-crt-para-hero](intro-crt-para-hero/SKILL.md).
- Logo em metal líquido / cromo → [logo-metal-liquido](logo-metal-liquido/SKILL.md).

**2. O pedido é "deixa o site mais premium/animado" sem efeito nomeado?**
- Primeiro [quatro-familias-de-animacao](quatro-familias-de-animacao/SKILL.md): audite o que a página já tem em scroll, reveal, hover e click, e escolha 3–5 efeitos. Só então abra os arquivos do catálogo `efeitos/`.
- Combinação clássica: `01` smooth scroll + `02` texto linha a linha + `04` reveal de imagem + `11` hover com zoom interno (+ `09` preloader só em landing de impacto).

**3. Scroll**
- Base suave → `efeitos/01`; título que estica → `efeitos/05`; galeria horizontal → `efeitos/08`; marquee → `efeitos/06`.
- Pilha de imagens em 3D → [pilha-imagens-3d-scroll](pilha-imagens-3d-scroll/SKILL.md); índice com fundo imersivo → [indice-projetos-fundo-imersivo](indice-projetos-fundo-imersivo/SKILL.md).

**4. Reveal e texto**
- Linhas com máscara → `efeitos/02`; imagem com clip-path → `efeitos/04`; texto em grade dispersa → [texto-grade-dispersao](texto-grade-dispersao/SKILL.md); letras que rolam no hover → [links-rolagem-por-caractere](links-rolagem-por-caractere/SKILL.md).
- Repertório amplo de animação de texto (rotate, scramble, fonte variável por letra, corte vertical) → [fancy-components](fancy-components/SKILL.md).

**5. Hover e cursor**
- Botão magnético → `efeitos/07`; rastro de imagens → `efeitos/03`; zoom interno → `efeitos/11`.
- Blob líquido que segue o cursor e revela outra camada → [blob-liquido-cursor](blob-liquido-cursor/SKILL.md) (demo funcional em `template/`).
- Dock magnético estilo macOS, texto em partículas → [componentry](componentry/SKILL.md).

**6. Galerias e carrosséis**
- Faixa curva/líquida → [carrossel-liquido](carrossel-liquido/SKILL.md); globo 3D → [carrossel-globo-3d](carrossel-globo-3d/SKILL.md); anel cilíndrico → [galeria-anel-cilindrico](galeria-anel-cilindrico/SKILL.md); grade curva → [galeria-grade-curva](galeria-grade-curva/SKILL.md); cubo de vidro → [cubo-galeria-vidro](cubo-galeria-vidro/SKILL.md); vídeo interativo → [galeria-video-interativa](galeria-video-interativa/SKILL.md); editorial → [carrossel-visual-editorial](carrossel-visual-editorial/SKILL.md); pastas/colagens → [colagem-pastas-interativas](colagem-pastas-interativas/SKILL.md); hero com miniaturas → [hero-imersiva-miniaturas](hero-imersiva-miniaturas/SKILL.md); alternar coluna/lista → [portfolio-modos-layout](portfolio-modos-layout/SKILL.md).

**7. Superfícies e fundos**
- Vidro, argila, skeuomorfismo, neumorfismo → [estilos-de-superficie-morphism](estilos-de-superficie-morphism/SKILL.md); vidro com refração real → [vidro-refrativo-liquid-glass](vidro-refrativo-liquid-glass/SKILL.md); gradientes animados → [fundos-shadergradient](fundos-shadergradient/SKILL.md); cenas 3D em React → [cenas-3d-react-three-fiber](cenas-3d-react-three-fiber/SKILL.md); estética terminal/dossiê → `efeitos/13`.

**8. Navegação e transição**
- Menu em tela cheia → `efeitos/12`; cortina entre páginas → `efeitos/10`; preloader com contador → `efeitos/09` (só quando mede carregamento real).

**9. Vídeo, ferramentas e processo**
- Vídeo de lançamento a partir do HTML do próprio site → [video-de-lancamento-html](video-de-lancamento-html/SKILL.md).
- MCPs e skills que dão contexto ao agente (shadcn, 21st, frontend-design, Web Interface Guidelines, Chrome DevTools) e a skill `/arena` → [ferramentas-agente-frontend](ferramentas-agente-frontend/SKILL.md).
- Biblioteca própria de seções + prompt de personalização → [biblioteca-de-secoes-e-prompts](biblioteca-de-secoes-e-prompts/SKILL.md).

## O que cada skill do lote de 28/09/2026 faz

| Skill | Em uma frase | Fonte |
|---|---|---|
| [logo-reveal-cinematico](logo-reveal-cinematico/SKILL.md) | Catálogo de batidas de reveal de logo (flip, pop de fundo, partículas, wireframe, expansão, espelho) traduzidas para SVG/CSS/canvas com roteiro de tempos | Reel the_odin_studio |
| [quatro-familias-de-animacao](quatro-familias-de-animacao/SKILL.md) | Decidir e auditar animação por família (scroll, reveal, hover, click) com snippets vanilla e checklist | Carrossel web_pros |
| [estilos-de-superficie-morphism](estilos-de-superficie-morphism/SKILL.md) | Receitas CSS e limites de contraste para glass, clay, skeuo e neumorfismo, aplicados às identidades Siteflux e Vale | Reel aydadex |
| [biblioteca-de-secoes-e-prompts](biblioteca-de-secoes-e-prompts/SKILL.md) | Montar uma biblioteca própria de seções reutilizáveis e o prompt de personalização para agentes | Anúncio "Kit Página no Ar" |
| [blob-liquido-cursor](blob-liquido-cursor/SKILL.md) | Blob com mola que segue o cursor, estica, solta gotículas e revela outra camada; demo funcional | Reel tegadesigns1 |
| [fancy-components](fancy-components/SKILL.md) | Usar `danielpetho/fancy` como referência, quando instalar vs. portar, catálogo dos 45 componentes e snippets vanilla | Reel fifbuilds |
| [componentry](componentry/SKILL.md) | O mesmo para `harshjdhv/componentry`: dock magnético, texto em partículas, gradientes, grades; alerta de GSAP em dois componentes | Reel jj.finds_ |
| [video-de-lancamento-html](video-de-lancamento-html/SKILL.md) | Leis criativas do `/brag`, modelo HyperFrames (quadro = função do tempo), seis easings e o pipeline local de vídeo | Reel petergriffin.ai |
| [ferramentas-agente-frontend](ferramentas-agente-frontend/SKILL.md) | Cinco ferramentas do fluxo com Claude, checklist das Web Interface Guidelines, princípios da frontend-design e `/arena` | Reels custodiorod e opusjake |
| [boas-praticas/](boas-praticas/) | Regras consolidadas de animação, design e revisão que valem para todas as skills | Toda a biblioteca |

As skills anteriores estão descritas em [referencias/00](referencias/00-SITES-DE-REFERENCIA.md), [01](referencias/01-REEL-DESIGN4ME.md), [02](referencias/02-REEL-PORTFOLIOS-DcTT-hUoYrz.md) e [03](referencias/03-REEL-REPOS-DcxV37-CJOC.md).

## Regras que valem para qualquer skill

1. **Movimento é feedback.** Cada animação responde a algo (chegada na tela, rolagem, ponteiro, clique) ou conta a história da marca uma vez. Entradas em toda seção e hover em todo card são o padrão genérico de página gerada por IA.
2. **Um momento orquestrado por página** (intro ou hero) e três a cinco efeitos no resto. Antes de somar, tire um.
3. **Só `transform`, `opacity`, `clip-path`, `stroke-dashoffset` e filtros pequenos.** Nunca `transition: all`; `will-change` só em animação contínua; sem `filter: blur` em tela cheia.
4. **Easing e duração com tokens.** Entradas `cubic-bezier(.22, 1, .36, 1)` em 0,3–0,5 s; micro-interações 150–250 ms; cinemáticas 0,8–1,4 s; stagger 50–80 ms com teto de ~180 ms. Tabela completa em [boas-praticas/animacao.md](boas-praticas/animacao.md).
5. **Acessibilidade sempre.** `prefers-reduced-motion` com variante reduzida (não só "desligar"), foco visível, toque com alternativa ao hover, texto legível sem JS, loops longos com pausa, um flash de fundo no máximo.
6. **Pausar quando não se vê.** Aba oculta e fora da viewport param relógios sem reiniciar; `visibilitychange` + `getAnimations()`.
7. **Verificar por sequência de quadros**, nunca por captura parada. O harness de CDP em `qa/` e o roteiro de `efeito-de-intro/references/verificacao.md` mostram como.
8. **Identidade do projeto.** Cores, fontes e materiais do cliente; nada de creme + serifa + terracota, preto + acento ácido ou kit de cards iguais por padrão.
9. **Licença e origem registradas.** Ao usar um repositório como referência, anote licença, data e o que foi conferido, como em `referencias/03` e `04`.
10. **Entrega verificável.** Dizer o que mudou, onde, o que foi testado (larguras, reduced motion, teclado, aba oculta) e o que não foi (sem celular físico, Safari ou Firefox nesta máquina).

## Para agentes

- No Claude Code, estas skills também existem como atalhos em `.claude/skills/` do repositório `vale-do-aco-digital`; o atalho manda ler o arquivo completo aqui.
- Em outro projeto, copie a pasta da skill para o diretório de skills do agente ou aponte as instruções para este `GUIA-DE-USO.md`.
- Ao criar uma skill nova, siga o formato das existentes, registre a fonte em `referencias/`, atualize este guia, o `SKILL.md` raiz e rode o gerador de atalhos.
