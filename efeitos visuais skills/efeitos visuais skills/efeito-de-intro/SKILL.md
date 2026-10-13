---
name: efeito-de-intro
description: Criar a animação de entrada (intro/abertura) de um site a partir do logo ou de vetores da marca, no padrão das intros do Siteflux e do Vale do Aço Digital — traços que se desenham, cometas de luz, cores girando dentro do símbolo por máscara, câmera que afasta, letras em sequência, ponto que estoura e dissolução para a hero. Use sempre que o pedido falar em intro, abertura, tela de entrada, splash, animação do logo ao abrir o site ou "igual à intro do Siteflux / do Vale", mesmo que a pessoa descreva só o efeito em palavras.
---

# Efeito de intro (animação vetorial de entrada)

Esta skill ensina a transformar **um pedido em palavras** ("quero que o logo se desenhe em dourado e depois as letras entrem uma a uma") em uma intro vetorial pronta, leve e segura. Tudo é **SVG + CSS keyframes + um pouco de JS** — sem GSAP, sem Lottie, sem vídeo, sem biblioteca.

Duas intros reais deste repositório são a referência:

| Intro | Duração | Assinatura visual | Referência completa |
|---|---|---|---|
| **Siteflux** (`index.html`) | 2,4 s + 0,45 s de dissolução | contorno do globo se desenha → cores lima/ciano/branco giram por máscara dentro do globo → assenta no branco → letras sobem uma a uma → ponto estoura → slogan | [references/intro-siteflux.md](references/intro-siteflux.md) |
| **Vale do Aço Digital** (`vale-do-aco-digital/index.html`) | 3,9 s + 0,55 s | close extremo: cometas percorrem os traços → linhas concêntricas acendem em cascata → câmera afasta → brilho varre o arco → nome aparece → contorno pisca, gradiente preenche → brilho → ponto estoura | [references/intro-vale-do-aco-digital.md](references/intro-vale-do-aco-digital.md) |

Quadros congelados das duas: [referencias-visuais/siteflux-quadros.jpg](referencias-visuais/siteflux-quadros.jpg) (0,1 → 2,4 s) e [referencias-visuais/vale-do-aco-digital-quadros.jpg](referencias-visuais/vale-do-aco-digital-quadros.jpg) (0,2 → 3,5 s). **Olhe as imagens** antes de propor algo "no estilo delas".

## Fluxo obrigatório (siga nesta ordem)

1. **Ler o pedido e preencher o briefing.** Use [references/briefing-modelo.md](references/briefing-modelo.md). Se a pessoa só disse "faz uma intro igual à do Siteflux com o meu logo", o briefing sai quase todo das tabelas das referências; pergunte apenas o que for indispensável e não deduzível (normalmente: qual é o arquivo do logo/SVG oficial e se há uma frase/slogan). Não pergunte o que tem padrão razoável — duração, easing e fundo têm padrões abaixo.
2. **Obter os vetores oficiais.** Logo em SVG (arquivo, `<symbol>` já no HTML, ou paths do protótipo). Nunca redesenhar o logo "de olho"; se só houver PNG, diga isso e use o PNG apenas como quadro final (como o Vale faz com `vad-assinatura-icone.png`). Ver "Preparar o SVG" em [references/metodo-animacao-vetorial.md](references/metodo-animacao-vetorial.md).
3. **Decompor o logo em camadas** (símbolo, contorno, preenchimento, cada letra, ponto/acento, slogan) e escolher uma técnica para cada camada no **catálogo de técnicas** de [references/metodo-animacao-vetorial.md](references/metodo-animacao-vetorial.md).
4. **Escrever o roteiro com tempos** (tabela: camada · técnica · início · duração · easing) antes do código. As duas referências mostram roteiros completos. O roteiro vai no comentário do CSS.
5. **Partir do template** [template/intro-template.html](template/intro-template.html): ele já traz a infraestrutura correta (decisão no `<head>`, cobertura antes do JS, failsafe, pular por tecla/gesto, movimento reduzido, limpeza, sincronia com a hero). Troque só o SVG, os keyframes e os tempos. Regras da infraestrutura: [references/infraestrutura-e-seguranca.md](references/infraestrutura-e-seguranca.md).
6. **Verificar quadro a quadro.** Uma captura parada não prova a animação. Use [scripts/capturar-quadros.js](scripts/capturar-quadros.js) e o checklist de [references/verificacao.md](references/verificacao.md). Olhe as imagens geradas e compare com o roteiro.

## Padrões quando a pessoa não especificar

- Duração da coreografia: **2,4 s** (marca simples) a **3,5 s** (marca com "história", tipo Vale). Nunca acima de ~4 s. Dissolução 0,45–0,55 s.
- Fundo: a cor mais escura da marca, sólida (Siteflux `#042b20`) ou com um radial suave (Vale).
- Tamanho do logo: `width: min(78vw, 460–560px)`.
- Easing de entrada: `cubic-bezier(.22, 1, .36, 1)`; traço desenhando: `cubic-bezier(.45, 0, .2, 1)`; estouro com overshoot: `cubic-bezier(.34, 1.56, .64, 1)`.
- Stagger de letras: 0,07 s; de linhas repetidas: 0,05 s.
- Quando roda: toda visita (Siteflux 2.37) **ou** uma vez por sessão (Vale, `sessionStorage`). Pergunte só se o contexto não deixar claro; na dúvida, uma vez por sessão.
- Nunca roda com `#âncora` na URL, aba oculta, `prefers-reduced-motion`, ou página já rolada.

## O que nunca fazer

- Esconder conteúdo atrás de uma intro que depende do JS terminar: sem JS/erro/atraso, a página aparece sozinha (failsafe CSS).
- Botão "Pular introdução" visível no Siteflux — o Walter pediu para tirar; pular é por Escape/Tab/roda/toque/clique. Em outro projeto, siga o que o briefing pedir.
- Girar, esticar ou distorcer a **palavra** do logo. Movimento de rotação/cor só dentro do símbolo (máscara).
- `vector-effect: non-scaling-stroke` junto com zoom de câmera, ou traços abaixo de ~1 px de tela (travaram a pintura no Chromium — ver infraestrutura).
- Animar `width/height/top/left`, `filter: blur` em tela cheia ou `box-shadow` grande. Anime `transform`, `opacity`, `stroke-dashoffset`.
- Flashes repetidos/intermitentes (fotossensibilidade). Um pulso de contorno é o máximo.
- Contador "0–100 %" que não mede carregamento real.

## Resultado esperado da entrega

Um bloco de HTML (overlay + SVG), um bloco de CSS (roteiro comentado + keyframes) e o JS de controle (ou o template adaptado), integrados ao site sem quebrar a hero. Na resposta, informe: o roteiro de tempos, onde cada coisa foi colocada, o que foi verificado (quadros, pular, movimento reduzido, sem JS) e o que não foi.
