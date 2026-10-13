# Checklist: Web Interface Guidelines (Vercel) para HTML/CSS/JS vanilla

Resumo e tradução das regras de `command.md` do repositório [vercel-labs/web-interface-guidelines](https://github.com/vercel-labs/web-interface-guidelines) (fonte: `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`, lida em 28/09/2026), usadas pela skill `web-design-guidelines` de [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills). Regras específicas de React/Next/Tailwind (`focus-visible:ring-*`, `<Link>`, `useState`, hidratação) foram traduzidas para o equivalente em vanilla; o que não se aplica foi omitido. Saída recomendada ao auditar: `arquivo:linha - problema`, agrupado por arquivo, sem preâmbulo.

## Acessibilidade

- [ ] Botão só com ícone tem `aria-label`.
- [ ] Todo controle de formulário tem `<label>` associado (`for`/`id`) ou `aria-label`.
- [ ] Ações usam `<button>`; navegação usa `<a href>`. Nunca `<div>`/`<span>` com `onclick`.
- [ ] Elementos interativos respondem ao teclado (Enter/Espaço em botões nativos já funcionam; elementos custom precisam de `keydown`).
- [ ] Toda `<img>` tem `alt` (ou `alt=""` se decorativa). Ícones decorativos com `aria-hidden="true"`.
- [ ] Atualizações assíncronas (toast, validação) em região `aria-live="polite"`.
- [ ] HTML semântico antes de ARIA (`<button>`, `<a>`, `<label>`, `<table>`, `<nav>`, `<main>`).
- [ ] Um `<h1>`; títulos sem saltos de nível; link "pular para o conteúdo" apontando para `<main>`.
- [ ] `scroll-margin-top` nos títulos que recebem âncora (compensa o cabeçalho fixo).
- [ ] Mídia com significado tem legenda, transcrição ou descrição; controles de mídia funcionam por teclado; mídia decorativa escondida de leitores de tela.

## Estados de foco

- [ ] Todo interativo tem foco visível: `:focus-visible { outline: 2px solid var(--cor); outline-offset: 2px }`.
- [ ] Nunca `outline: none` sem substituto visível.
- [ ] Usar `:focus-visible` em vez de `:focus` (evita anel no clique de mouse).
- [ ] Controles compostos usam `:focus-within`.
- [ ] Cabeçalho/rodapé fixos e overlays não cobrem o elemento focado (`scroll-padding-top` no `html`).

## Formulários

- [ ] `autocomplete` correto e `name` significativo em cada campo.
- [ ] `type` certo (`email`, `tel`, `url`, `number`) e `inputmode` no celular.
- [ ] Nunca bloquear colar (`paste` + `preventDefault`).
- [ ] Rótulo clicável (`<label for>` ou envolvendo o campo).
- [ ] `spellcheck="false"` em e-mail, códigos e usuários.
- [ ] Checkbox/radio: rótulo e controle formam um único alvo de toque, sem zona morta.
- [ ] Botão de enviar fica habilitado até a requisição começar; spinner durante o envio.
- [ ] Erros inline ao lado do campo; foco vai para o primeiro erro ao enviar.
- [ ] Placeholder termina com `…` e mostra um exemplo do padrão esperado.
- [ ] `autocomplete="off"` em campos que não são de login, para não disparar gerenciador de senhas.
- [ ] Aviso antes de sair com alterações não salvas (`beforeunload`).

## Animação

- [ ] `prefers-reduced-motion` respeitado: variante reduzida ou desligada.
- [ ] Animar só `transform` e `opacity` (compositor). Nada de `width`, `height`, `top`, `left`, `box-shadow` grande, `filter: blur` em tela cheia.
- [ ] Nunca `transition: all`; listar propriedades.
- [ ] `transform-origin` correto.
- [ ] SVG: transformação no `<g>` com `transform-box: fill-box; transform-origin: center`.
- [ ] Animações interrompíveis: respondem a nova ação do usuário no meio.
- [ ] Movimento automático acima de 5 s ao lado de outro conteúdo tem pausar/parar/ocultar.
- [ ] Loops decorativos silenciosos param sob `prefers-reduced-motion`.

## Tipografia

- [ ] `…` (reticências) em vez de `...`.
- [ ] Aspas curvas “ ” em vez de " ".
- [ ] Espaço não separável: `10&nbsp;MB`, `⌘&nbsp;K`, nomes de marca.
- [ ] Estados de carregamento terminam em `…`: "Carregando…", "Salvando…".
- [ ] `font-variant-numeric: tabular-nums` em colunas de números e comparações.
- [ ] `text-wrap: balance` (ou `pretty`) em títulos, evitando viúvas.

## Conteúdo

- [ ] Contêineres de texto aguentam conteúdo longo: `text-overflow: ellipsis`, `-webkit-line-clamp`, `overflow-wrap: anywhere`.
- [ ] Filhos de flex têm `min-width: 0` para permitir truncar.
- [ ] Estados vazios tratados; nada de UI quebrada com string ou lista vazia.
- [ ] Conteúdo de terceiros/usuário testado curto, médio e muito longo.

## Imagens

- [ ] `width` e `height` explícitos em `<img>` (evita CLS).
- [ ] Abaixo da dobra: `loading="lazy"`. Acima da dobra e crítica: `fetchpriority="high"`.

## Desempenho

- [ ] Listas com mais de 50 itens: `content-visibility: auto` ou virtualização.
- [ ] Sem leitura de layout (`getBoundingClientRect`, `offsetHeight`, `scrollTop`) misturada com escrita no mesmo laço; ler tudo, depois escrever.
- [ ] `<link rel="preconnect">` para domínios de CDN/fontes.
- [ ] Fontes críticas com `<link rel="preload" as="font" crossorigin>` e `font-display: swap` (ou `block` só na intro).
- [ ] `<video autoplay muted loop playsinline>` em vez de GIF; imagem estática como alternativa.
- [ ] Loops curtos não essenciais: MP4 H.264 para Safari, condição `prefers-reduced-motion` no `<source media>`, fallback estático.

## Navegação e estado

- [ ] URL reflete estado (filtro, aba, paginação, painel aberto) via query ou hash.
- [ ] Links são `<a href>`: Ctrl/Cmd+clique e clique do meio funcionam.
- [ ] Ações destrutivas exigem confirmação ou janela de desfazer.

## Toque e interação

- [ ] `touch-action: manipulation` em botões e links (elimina atraso do duplo toque).
- [ ] `-webkit-tap-highlight-color` definido de propósito.
- [ ] `overscroll-behavior: contain` em modais, gavetas e sheets.
- [ ] Durante arraste: sem seleção de texto (`user-select: none`), elemento arrastado `inert`.
- [ ] Gestos (arrastar, deslizar, pinçar) têm alternativa por toque/clique e teclado.
- [ ] `autofocus` só no desktop, num único campo principal; nunca no celular.

## Áreas seguras e layout

- [ ] Layouts sangrados usam `env(safe-area-inset-*)`.
- [ ] Sem barra de rolagem horizontal indesejada: `overflow-x: clip` no contêiner e conteúdo corrigido.
- [ ] Flex/grid em vez de medir com JS.

## Dark mode e tema

- [ ] `color-scheme: dark` no `<html>` de temas escuros (barra de rolagem e inputs nativos).
- [ ] `<meta name="theme-color">` igual ao fundo da página.
- [ ] `<select>` nativo com `background-color` e `color` explícitos (Windows escuro).

## Idioma e localidade

- [ ] Datas e horas com `Intl.DateTimeFormat`; números e moeda com `Intl.NumberFormat`.
- [ ] Idioma pelo `navigator.languages`, nunca por IP.
- [ ] Marcas, códigos e identificadores com `translate="no"`.

## Hover e estados interativos

- [ ] Botões e links têm estado `:hover` visível.
- [ ] Hover/active/focus aumentam o contraste em relação ao repouso.

## Texto de interface

- [ ] Voz ativa: "Instale o CLI", não "O CLI será instalado".
- [ ] Numerais em contagens: "8 projetos", não "oito".
- [ ] Rótulos específicos: "Salvar chave", não "Continuar".
- [ ] Erros dizem o próximo passo, não só o problema.
- [ ] Segunda pessoa; evitar primeira pessoa.
- [ ] Em pt-BR, títulos em caixa de frase (a regra original de Title Case é do inglês).

## Antipadrões a sinalizar

- `user-scalable=no` ou `maximum-scale=1` no viewport.
- `paste` com `preventDefault`.
- `transition: all`.
- `outline: none` sem `:focus-visible` substituto.
- Navegação por `onclick` sem `<a>`.
- `<div>`/`<span>` clicável em vez de `<button>`.
- Imagens sem dimensões.
- Listas grandes renderizadas inteiras.
- Campos sem rótulo; botões-ícone sem `aria-label`.
- Datas e números formatados à mão.
- `autofocus` sem justificativa.
- GIF animado onde um vídeo comprimido serve.
- Ação só por gesto, sem alternativa.
