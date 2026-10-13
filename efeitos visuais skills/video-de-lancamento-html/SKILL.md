---
name: video-de-lancamento-html
description: Produzir um vídeo curto de lançamento (15–25 s) de um site ou produto a partir do próprio HTML/CSS/JS, com hook, destaques reais, música e legenda, seguindo as leis criativas do /brag e o princípio "quadro = função pura do tempo" do HyperFrames. Use quando pedirem "vídeo de lançamento", "reel do site", "teaser do produto", "brag", "motion graphics do site" ou animação para Instagram/Stories feita a partir do site real.
---

# Vídeo de lançamento a partir do HTML

Fonte observada: [Reel Ddwjwdfo0Cl](https://www.instagram.com/reel/Ddwjwdfo0Cl/) de petergriffin.ai, 51 s, inspecionado em 28/09/2026 (quadros em `qa/reels-2026-09-28/Ddwjwdfo0Cl-p01.jpg` a `-p05.jpg`). O vídeo mostra a skill `/brag` ("you built it. now brag.") lendo um projeto e um site e devolvendo um vídeo de lançamento com movimento, música e legendas em um comando; a variante `/brag-slim`; a tela "Six ways to get from A to B" com seis easings (linear, ease-in-out, ease-out, back-out, elastic, bounce); biblioteca de música, arraste de arquivos, volume e legendas animadas. A frase-chave do motor: "seu agente já escreve HTML, CSS e JavaScript; nenhuma linguagem nova; todo filme que você está assistindo é uma página web".

Repositórios conferidos (API do GitHub, 28/09/2026):

| Repositório | Licença | Estrelas | Último push | O que é |
|---|---|---|---|---|
| [latent-spaces/brag](https://github.com/latent-spaces/brag) | MIT | 10,9 mil | 24/09/2026 | Skills `skills/brag` (usa HyperFrames) e `skills/brag-slim` (arquivo único, sem assets; o modelo faz tudo com o que há na máquina). Requisitos do `/brag`: Node 22+, FFmpeg no PATH, `npx hyperframes`. |
| [heygen-com/hyperframes](https://github.com/heygen-com/hyperframes) | Apache-2.0 | 53,7 mil | ativo | "Write HTML. Render video. Built for agents." Composição = HTML com `data-composition-id`, `data-start`, `data-width`/`data-height` e `class="clip"`; animações *seekable* em GSAP, CSS, WAAPI, Lottie, Three.js ou Anime.js; CLI `init`, `lint`, `preview`, `render`; 21 skills com roteador `/hyperframes` e workflows como `/product-launch-video`, `/motion-graphics`, `/slideshow`, `/faceless-explainer`; `frame.md` é o design system reescrito para a câmera. |

As leis, tons e a forma abaixo são adaptações em português das regras do `brag-slim` (MIT); o código e o pipeline são deste repositório. Nada aqui é cópia do código do brag ou do HyperFrames.

## 1. Leis criativas (valem para qualquer ferramenta)

1. **Curto.** 15–25 s; 18–22 s é o ponto ideal. Stories/Reels aceitam mais, mas o vídeo de lançamento não precisa.
2. **Claro para um estranho.** Depois de uma exibição, quem nunca ouviu falar do produto sabe o que ele faz, para quem é e como obter. Lidere com isso, não com a tecnologia.
3. **O hook decide tudo.** Os primeiros 2–3 s definem se alguém continua. Planeje o hook antes de qualquer outra cena.
4. **Mostre a coisa real.** Reaproveite a interface, componentes, textos, imagens e animações do site de verdade; reconstrua só o que não dá para reutilizar. Prefira o app funcionando a uma landing descrevendo. Texto ilustrativo pequeno de UI (um nome de arquivo, um toast "Publicado") é aceitável; números, depoimentos e promessas inventadas não.
5. **Específico.** Tem de parecer feito para este projeto: use as frases e reivindicações dele. Linguagem genérica de SaaS ("otimize seu fluxo de trabalho") é proibida.
6. **Legível.** O ritmo vem de movimento e cortes, não de tirar o texto cedo. Toda linha que deve ser lida fica inteira e assentada por ≈0,3 s por palavra, contados a partir do momento em que a linha inteira está na tela. Texto que é só textura não precisa ser lido.
7. **Vivo.** Elementos que aparecem um a um, cliques, arrastes e digitação simulados valem mais que slides estáticos.
8. **Humor só do próprio absurdo do projeto**, nunca forçado.
9. **Todo quadro é postável.** Qualquer frame congelado deveria valer como imagem.
10. **Poster = quadro assentado.** Escolha o frame mais forte com o texto totalmente entrado e grave-o como frame 0 do MP4 (substituindo, não acrescentando, para manter duração e sincronia de áudio).

## 2. Forma padrão e tons

Forma inicial, não molde: **Hook (2–3 s) → Reveal (2–4 s) → 2–3 destaques curtos → Punchline/encerramento (2–4 s)**. Se o pedido aponta uma parte (nova versão, um recurso), ela vira o foco.

| Tom | Sensação | Ritmo e transições |
|---|---|---|
| `default` | Direto, brincalhão, limpo | 4–5 cenas; transições suaves |
| `polished` | Sério, elegante, contido | 3–4 cenas com holds longos; fades suaves |
| `yc-parody` | Lançamento de startup levado a sério demais | 4–5 cenas com uma afirmação cada; cortes secos |
| `chaotic` | RÁPIDO, ALTO, CAIXA ALTA | 6–8 cenas, algumas abaixo de 2 s; flashes e zooms |
| `deadpan` | Calmo, seco, nada é piada | 3–4 cenas, muito vazio; fades lentos |
| `cinematic` | Escala de trailer, afirmações épicas | 4–5 cenas, tipografia enorme; wipes dramáticos |
| `app-store` | Cartões de recursos limpos | 4–6 cenas; deslizes suaves |

Para o Siteflux e o Vale do Aço Digital, o tom natural é `polished` ou `default`; `chaotic` e `yc-parody` só se o briefing pedir.

## 3. Princípio técnico: quadro = função pura do tempo

Gravação em tempo real perde quadros e depende da máquina. Um vídeo determinístico nasce de uma página em que **tudo é posicionado a partir de `t`**: sem `setTimeout`, sem `Date.now()`, sem `requestAnimationFrame` livre. O renderizador pergunta "como fica o quadro em t = 1,833 s?", a página responde, a captura acontece, e o próximo t é pedido.

Mini-padrão em vanilla (o mesmo que `qa/videos-instagram/render.js` aplica):

```html
<script>
  // Toda animação da página é declarada em CSS ou WAAPI e pausada.
  const anims = document.getAnimations({ subtree: true });
  anims.forEach(a => { a.pause(); a.currentTime = 0; });

  // O renderizador chama exportFrame(t) para cada quadro (t em segundos).
  window.exportFrame = function (t) {
    anims.forEach(a => { a.currentTime = t * 1000; });   // CSS/WAAPI "seekable"
    // Estados que não são animação CSS também dependem só de t:
    const p = Math.min(1, Math.max(0, (t - 5.1) / 0.45));
    overlay.style.opacity = 1 - easeOut(p);
    // Nunca ler o relógio real aqui.
  };
</script>
```

Regras do padrão:

- Fontes com `font-display: block` e carregadas antes do primeiro quadro (`document.fonts.ready`); imagens e vídeos decodificados antes de capturar (`img.decode()`, `video.currentTime` fixado e `seeked` aguardado).
- `prefers-reduced-motion` emulado como `no-preference` na captura, senão a página entrega a versão estática.
- Viewport fixa no tamanho do vídeo (`Emulation.setDeviceMetricsOverride`), `deviceScaleFactor: 1`.
- Elementos que dependem de `IntersectionObserver` recebem um modo de exportação que os considera visíveis.

### O pipeline que já existe neste repositório

`qa/videos-instagram/` produz os seis vídeos de `videos para o instagram/` (LEIA-ME de 22/09/2026):

- `render.js preview|render|verify`: extrai do `index.html`, do `siteflux.css` e do `siteflux.js` reais o sprite do logo, a arte do hero e as funções `intro()` e `heroMorph()`, monta `stage.html` (1080 × 1920, fundo `#042b20`, fontes locais Montserrat e Space Grotesk), sobe um Edge headless com perfil próprio (`browser-profile-<porta>`, ignorado pelo Git), fixa métricas e mídia, e para cada quadro chama `exportFrame(t)` e `Page.captureScreenshot` (PNG). Os PNGs entram por `image2pipe` no FFmpeg a 30 fps, que gera H.264 `yuv420p` bt709 e, no mesmo comando, o corte 4:5 (`crop=1080:1350:0:285`) para o feed. `verify` reabre cada MP4 com `ffprobe`, confere codec, dimensões, taxa e número de quadros, decodifica tudo e grava `verification.json` e quadros de conferência em `frames-verificacao/`.
- `render-combinado.js`: versão 03 (símbolo sem marca + intro final) com sobreposição suave.
- `cdp.js`: cliente WebSocket mínimo do DevTools Protocol (sem dependências), reaproveitado pelo harness de QA.
- `source-manifest.json`: hash SHA-256 das três fontes e as adaptações feitas (crop central, logo mais tempo em tela, sem áudio).

Esse pipeline já cumpre "quadro = função pura do tempo" sem instalar nada além de Edge e FFmpeg. Ele não tem música, legendas animadas nem storyboard; isso é o que o `/brag` acrescenta.

## 4. Quando instalar HyperFrames/brag e quando usar o pipeline local

| Situação | Caminho |
|---|---|
| Só precisa reexportar animações reais do site (intro, morph, um componente) em 9:16 e 4:5 | Pipeline local (`render.js`); estender `stage.html` com a nova cena. |
| Vídeo com roteiro, várias cenas, transições, legenda animada e trilha | Instalar HyperFrames (Node 22+, FFmpeg no PATH; `claude plugin marketplace add heygen-com/hyperframes` + `claude plugin install hyperframes@hyperframes`, ou `npx skills add heygen-com/hyperframes`) e opcionalmente o `/brag` (`/plugin marketplace add latent-spaces/brag` + `/plugin install brag@brag`). Antes de instalar, `npx hyperframes doctor`. |
| Sem permissão para instalar, ou máquina sem Node 22 | `brag-slim` como roteiro mental + pipeline local: escrever a página-vídeo com `exportFrame(t)`, capturar por CDP, montar com FFmpeg e adicionar áudio com `-i trilha.mp3 -shortest`. |

Observações: o `/brag` usa trilhas de ende.app e efeitos Kenney (licenças próprias dos autores; conferir antes de publicar). Narração (`--voice`) é opcional e desligada por padrão. Nunca comprometer o site de produção: a página-vídeo é uma cópia isolada, como `stage.html`.

## 5. Os seis easings

Vistos na tela "Six ways to get from A to B" do reel (quadro 24 s). Equivalentes para CSS/WAAPI e uso recomendado:

| Nome | CSS / WAAPI | Quando usar |
|---|---|---|
| linear | `linear` | Marquees, scrub por scroll, contadores; nunca em entradas. |
| ease-in-out | `cubic-bezier(.65, 0, .35, 1)` (o do Siteflux) ou `cubic-bezier(.45, 0, .55, 1)` | Ida e volta, morphs, elementos que trocam de lugar. |
| ease-out | `cubic-bezier(.16, 1, .3, 1)` (o do Vale) ou `cubic-bezier(.22, 1, .36, 1)` | Entradas, reveals, tudo que responde a um clique. |
| back-out | `cubic-bezier(.34, 1.56, .64, 1)` (usado nos dois sites) | Um elemento pequeno que "assenta" com leve ultrapassagem: ponto do logo, chip, ícone. |
| elastic | `linear(...)` gerada (CSS `linear()` com 20–30 pontos) ou keyframes | Um único momento de destaque; nunca em texto longo. |
| bounce | `linear(0, .04, .16, .36, .64, 1, .8, .9, 1, .96, 1)` aproximado, ou keyframes | Objetos "físicos" (bola, cartão que cai). Raro em sites; comum em vídeo. |

Regra: um vídeo usa 2–3 easings, com um deles reservado ao momento de assinatura.

## 6. Verificação antes de entregar

- Stills de **cada cena** e do **meio de cada transição**; procurar estouro, colisão de textos, contraste baixo.
- Crossfade entre dois layouts cheios vira dupla exposição: escalonar (saída do antigo, depois entrada do novo) ou passar pelo fundo.
- Ler o vídeo como um estranho: o que é, para quem, onde obter.
- Tempo de leitura por linha ≥ 0,3 s × palavras depois de assentada.
- Sem números, depoimentos ou logos de clientes inventados; sem promessa de resultado.
- Áudio: efeitos na mesma tonalidade e no mesmo espaço da música, abaixo dela; nada estridente.
- MP4 H.264 `yuv420p`, 30 fps, `faststart`, tamanho e proporção corretos (9:16 1080 × 1920; 4:5 1080 × 1350; 16:9 1920 × 1080); `ffprobe` confirma quadros = duração × fps.
- Poster gravado como frame 0; `share-copy.txt` com 1–3 frases específicas, sem "animados em anunciar".

Entregue: caminho do vídeo e da capa, uma frase sobre o ângulo criativo, o que foi verificado e o que não foi (por exemplo, sem teste em Safari).

Para pedir esse trabalho a um agente, use [references/brief-modelo.md](references/brief-modelo.md).
