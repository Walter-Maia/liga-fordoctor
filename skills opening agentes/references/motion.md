# Movimento cinematográfico leve

## Abertura

Escolha o conceito e monte a intro pelo [catálogo de aberturas](aberturas.md): ele traz o contrato técnico (decisão no `<head>`, failsafe CSS, duas pinturas antes de animar, saídas natural e de segurança) e seis conceitos já testados. Exemplos completos: [siteflux.md](siteflux.md) e [vale-do-aco-digital.md](vale-do-aco-digital.md).

Regras que valem para qualquer marca:

- Sequência em três atos, ajustável: detalhe ou traço → forma completa → assinatura (nome, acento, slogan) → dissolução curta para o conteúdo. Letras terminam antes da saída do conjunto.
- Faixa de duração: 2,4 s (Siteflux, ForDoctor 2,5 s) a 3,9 s (Vale, com câmera). Some delays, durações e saída numa tabela antes de codar.
- Use os caminhos oficiais do SVG; não redesenhe a marca por geração de imagem. Termine na pose oficial (PNG/SVG oficial por cima no fim, se preciso).
- Não adicione espera de rede ou carregamento fictício para justificar a intro. Uma vez por sessão; nunca com `#âncora`, página já rolada, aba oculta ou movimento reduzido.
- Prefira `opacity` e `transform` com easing de desaceleração; acentos com mola `cubic-bezier(.34,1.56,.64,1)`.
- A transição para a primeira seção preserva a posição de leitura. Em vez de voar a logo até o cabeçalho por coordenadas, faça a logo do cabeçalho entrar em partes no momento em que a intro sai (variável `--rise-start`).
- Overlay não prende foco nem rolagem; Escape/Tab, aba oculta, erro e o timer de segurança liberam a página na hora.
- Se o cliente quer conversão rápida ou pede "sem intro", a abertura pode ser o próprio conteúdo (conceito D do catálogo): texto visível na 1ª pintura e só as imagens entrando, cada uma quando carrega.

## Loops com narrativa

Faça o efeito servir a uma relação: origem → marca → consequência. Em conexões SVG, `pathLength=1` facilita `stroke-dashoffset`. Sincronize todos os caminhos pelo mesmo ciclo; delays independentes fazem a saída começar antes da chegada das entradas nos ciclos seguintes.

Na ForDoctor: ciclo 6 s; entradas terminam em 40 %; saída só após 45 %; até 78 % o resultado fica visível; dissolução até 95–100 %, reiniciando sem salto. Pause fora da viewport e em aba oculta sem reiniciar o relógio. Respeite `prefers-reduced-motion` e mostre a composição final estática. Um loop é escolha deliberada, não padrão de toda seção. Se o usuário remover controles de pausa, registre a decisão e não os reintroduza silenciosamente.

## Profundidade com a rolagem (parallax)

- Uma fórmula para tudo: `y = A × (2p − 1)`, com `p` = progresso na faixa *cover* de um contêiner-trilha que **não se move** (medir o próprio elemento que se desloca gera realimentação).
- CSS primeiro: `view-timeline` na trilha + `animation-timeline` nos alvos, amplitude numa propriedade registrada (`@property --px-a`) e em tokens por breakpoint. Caminho JS idêntico (um rAF, IntersectionObserver, ler antes de escrever) para navegadores sem `animation-timeline`, com um parâmetro de URL para forçá-lo nos testes.
- Amplitude perceptível: comece por ~1 vw (12–20 px em 1440, metade no celular). Valores de 4–8 px costumam parecer "sem efeito".
- Mova blocos inteiros (o grupo de texto, o quadro, o cartão), nunca linhas soltas de um parágrafo. Cada alvo extra custa restilização no main thread a cada quadro: meça com CPU 4×.
- Planos de uma foto: separe fundo, objeto intermediário e pessoa em camadas com `z-index` fixo (nunca troque `z-index` durante a rolagem). O que está fisicamente ligado (mão e balcão) anda junto.

## Camadas que não brigam

Cada efeito em um elemento e uma propriedade: parallax no bloco, flutuação num wrapper, reveal no item, hover/press na face, magnetismo no miolo. Não aplique dois `translate`/`transform` de origens diferentes no mesmo nó, nem sobrescreva um `translate` de posicionamento. Novos wrappers herdam `border-radius` e mantêm a área clicável no link.

## Flutuação ambiente

±2–3 px (±1 px no celular), ciclos de 6–9 s, `alternate`, fases diferentes por elemento para não pularem juntos. Pausada por padrão, ligada perto da tela, pausada em aba oculta e sob hover/foco/toque do próprio controle (pausar preserva a posição). Nunca em texto corrido, títulos oficiais, fotos ou logos.

## Interações

- Cabeçalho translúcido: altere apenas o background, mantendo logo e texto opacos. Blur moderado, branco sólido no topo e fallback legível sem `backdrop-filter`. Teste com barra administrativa do WordPress e menu mobile aberto.
- Acordeão nativo: preserve `details/summary`, teclado e valores dos campos. Ao animar altura para zero, o padding vertical também chega a zero; volte a `height:auto` ao abrir. Trate cliques rápidos, cancelamento e resize.
- Valores: mostre o valor exato e use fade/translate curto ou algarismos tabulares. Evite contadores intermediários que pareçam saldo real. Não use `aria-live` a cada quadro.
- Entradas de seções: deslocamentos pequenos com fade e escalonamento breve, por IntersectionObserver. Arme só o que está abaixo da dobra; o que já foi pintado não some para reentrar. Se a rolagem parar com um item armado na tela, revele-o (~220 ms depois). Texto existe sem JS.
- Vídeo decorativo/apresentação: H.264 MP4, `muted loop playsinline preload="none"`, `poster`; toca só perto da tela e com a aba visível; botão de som que não reinicia; se `play()` falhar, devolva os controles nativos; sem autoplay com movimento reduzido.
- Imagens de abertura: nunca esconda uma imagem pronta esperando outra; trate `complete`, `load`, `error`, rejeição de `decode()` e retorno pelo histórico; reserve o espaço com proporção e fundo.

## Validação

Inspecione quadros de início, meio e fim, e o segundo ciclo dos loops. Confira que o efeito começa quando visível, mantém a ordem e não salta ao rolar de volta. Para parallax, meça o deslocamento em p ≈ 0,25 / 0,5 / 0,75 indo e voltando, com a flutuação isolada. Teste mobile emulado, desktop, movimento reduzido (no carregamento e ao vivo), aba oculta, teclado, reentrada de sessão, JS bloqueado e clique/toque rápido. Teste com CPU limitada se houver travamento relatado e com uma imagem deliberadamente atrasada se houver abertura de imagens. Reporte medições reais e limitações; uma captura estática não comprova fluidez.
