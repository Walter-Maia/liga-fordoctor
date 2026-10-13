# Aberturas: catálogo de intros estilosas e diferentes

Uma intro boa conta a marca em 2–4 segundos e entrega a página no mesmo lugar onde o olho já está. Escolha **um** conceito por site, derive-o da geometria da própria marca e nunca repita a mesma intro entre clientes. Antes de escrever código, responda:

1. **Qual é a forma da marca?** (círculo/globo, triângulo + meio-disco, letras com traço, símbolo de linhas). A intro anima essa forma, não um efeito genérico.
2. **De onde vem e para onde vai?** Defina o primeiro quadro (o que o visitante vê no 0 s) e o último (a pose que vira o cabeçalho, a hero ou some).
3. **Qual é o tempo total?** Some delays + durações + saída. Faixa útil: 2,4–3,9 s. Acima de 4 s, só com pular visível.

## Contrato técnico (vale para todos os conceitos)

Estas regras foram aprendidas em produção (Siteflux, Vale do Aço Digital, ForDoctor):

- **Decida no `<head>`, antes da 1ª pintura.** Um script inline de uma linha marca `html.intro-active` só se: não viu nesta sessão (`sessionStorage`), não há `#âncora` na URL, a página não está rolada, a aba está visível e não há `prefers-reduced-motion`. Envolva em `try/catch` (storage bloqueado).
  ```html
  <script>(function(){try{if(sessionStorage.getItem("x-intro")||location.hash||document.hidden||matchMedia("(prefers-reduced-motion: reduce)").matches)return;document.documentElement.classList.add("intro-active")}catch(e){}})();</script>
  ```
- **Cobertura com failsafe só em CSS.** `html.intro-active::before { position:fixed; inset:0; background:<cor>; animation: failsafe .5s 4.6s both }` com `@keyframes failsafe { to { opacity:0; visibility:hidden } }`. Se o JS não carregar, a página se libera sozinha.
- **Monte o palco com os vetores oficiais.** Copie os `path` do `<symbol>`/SVG da marca (via `XMLSerializer`), nunca redesenhe nem gere a marca por IA. Separe em grupos animáveis (símbolo, cada letra, acento, slogan).
- **Duas oportunidades de pintura antes de animar:** `requestAnimationFrame(() => requestAnimationFrame(() => palco.classList.add('is-playing')))`. Um `setTimeout(…, 250)` de reserva cobre abas em que o rAF não roda.
- **Toda a coreografia em CSS** (`.is-playing .peca { animation: … }`) com delays explícitos; o JS só liga, encerra e limpa.
- **Duas saídas.** `finish(true)` no tempo previsto (a hero entra depois da dissolução, via uma variável como `--rise-start: 2.4s`), `finish(false)` como trava de segurança (~3,8 s) e em Escape, Tab, aba oculta ou erro: libera na hora, sem esperar o fade.
- **Overlay não prende nada:** sem foco dentro dele (ou devolver o foco), rolagem devolvida no início da saída, sem capturar toques que ativem campos por baixo, removido do DOM ao terminar.
- **Grave a sessão logo no começo** (`sessionStorage.setItem`), não no fim: um recarregamento no meio não repete a intro.
- **Movimento reduzido** = nenhuma intro; a página nasce no estado final.
- **Traço sempre ≥ 1 px de tela.** Linhas sub-pixel durante zoom travaram a pintura no Chromium; reforce `stroke-width` em telas estreitas. Evite `vector-effect: non-scaling-stroke` em animação de escala (força repintura a cada quadro).
- **`pathLength="1"`** em todo traço desenhado: `stroke-dasharray: 1; stroke-dashoffset: 1 → 0` independe do comprimento real.

## Conceitos testados (escolha um e adapte)

### A. Traço → campos de cor por máscara → assentar (Siteflux, ~2,4 s)
Contorno do símbolo se desenha em branco; dentro dele, faixas e setores coloridos giram e deslizam (recortados por `clipPath`/`mask` com o próprio desenho do símbolo); tudo "assenta" no preenchimento oficial; letras entram uma a uma (70 ms entre si); o ponto/acento estoura com mola; slogan aparece; o conjunto dissolve com zoom de 1,04. Receita completa em [siteflux.md](siteflux.md).
**Quando usar:** marca com símbolo fechado (círculo, escudo, globo) e paleta de 2–3 cores.

### B. Câmera em close extremo → zoom-out → assinatura (Vale do Aço Digital, 3,9 s)
O palco começa com `scale(5)` sobre um detalhe do símbolo: faíscas percorrem arestas (`dasharray` curto andando pelo `dashoffset`), hastes e arcos se desenham, linhas paralelas concêntricas aparecem em cascata (50 ms cada); a "câmera" (um `<g>` com `transform` por keyframes) recua em 4 trechos com easings diferentes e desliza até a pose da assinatura; contorno → preenchimento em degradê → brilho → PNG oficial por cima → ponto final com mola. Receita em [vale-do-aco-digital.md](vale-do-aco-digital.md).
**Quando usar:** marca geométrica (triângulos, arcos, linhas) e um vídeo de motion de referência para cronometrar.

### C. Letras desenhadas → trilhas → preenchimento (ONEX no Vale, 2,4 s)
Cada letra traça o contorno (`stroke-dashoffset`) e depois preenche (`fill-opacity`), com 90 ms entre letras; trilhas laranja correm entre elas até o "hub"; a peça-assinatura recebe contorno e face coloridos; no fim entra o PNG oficial (que já traz o complemento, ex.: "data center"). Comprima o roteiro da referência (4,6 → 2,4 s) mantendo a ordem.
**Quando usar:** wordmark forte sem símbolo, ou para animar logos de parceiros numa seção (não só na abertura).

### D. Sem overlay: a abertura é o próprio conteúdo (Programa Comércio Digital)
Nada cobre a página. Frase, botão e título são HTML visíveis na 1ª pintura; só as fotos do mosaico entram, **cada uma quando ela mesma carrega** (fade + máscara curta na base + zoom 1,035 → 1), escalonadas pela posição (coluna × 40 ms + linha × 30 ms, teto 180 ms). Receita em [vale-do-aco-digital.md](vale-do-aco-digital.md).
**Quando usar:** landing de campanha com foco em conversão, LCP importante, ou quando o cliente pede "sem intro".

### E. Tela cheia → objeto da hero (CRT, monitor, moldura)
A intro ocupa a tela e se reduz até um retângulo reservado na hero (a TV, o celular, a moldura). Detalhes na skill `intro-crt-para-hero` da biblioteca `efeitos visuais skills`. Calcule o retângulo final a partir do layout real (não de coordenadas fixas) e recalcule em resize.

### F. Entrega para o cabeçalho (complemento de qualquer conceito)
Depois da intro, a logo do cabeçalho entra em partes: botão e menu descem com fade (`translateY(-16px)`), "site" chega da esquerda, "flux" da direita, o ponto estoura por último (mola `cubic-bezier(.34,1.56,.64,1)`). São animações CSS com `animation-fill-mode: backwards` (valem sem JS e não travam estados posteriores) atrasadas por `--rise-start`. É a forma segura de "a logo da intro vira a do topo" sem voar por coordenadas frágeis.

## Como criar uma intro nova e diferente

1. Liste as formas primitivas da marca e escolha um verbo para cada uma: **desenhar** (traço), **revelar** (máscara/clip), **girar/deslizar** (campos de cor dentro de máscara), **montar** (peças que se encontram), **recuar** (câmera), **acender** (preenchimento/brilho), **estourar** (acento com mola).
2. Ordene em 3 atos: *mistério* (detalhe, traço, close) → *construção* (forma completa) → *assinatura* (nome, acento, slogan) → saída curta (0,4–0,5 s).
3. Cronometre numa tabela (peça, início, duração, easing) antes do CSS. Se houver vídeo de referência, extraia os tempos quadro a quadro (`ffmpeg -vf fps=10,tile`) e comprima mantendo proporções.
4. Varie o conceito entre clientes: se o último site usou A, não use A no próximo. Combine no máximo dois verbos fortes; o resto é apoio.
5. Termine sempre na pose oficial da marca (PNG/SVG oficial por cima no fim, se o vetor reconstruído tiver qualquer diferença).

## Validação de uma intro

Capture quadros em 0, 25, 50, 75 e 100 % do tempo, em 390 e 1440 px; confira que nenhuma peça termina depois da saída; teste recarregar (não repete na sessão), `#âncora` (não roda), aba em segundo plano (libera), Escape/Tab, movimento reduzido, JS bloqueado (failsafe libera em ~5 s) e CPU 4× (sem quadros presos). No headless, rAF não roda antes da 1ª pintura e `Page.setWebLifecycleState` frozen mata o rAF: simule aba oculta por `visibilitychange`.
