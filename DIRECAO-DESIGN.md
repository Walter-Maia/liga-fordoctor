# Liga ForDoctor: direção e decisões da LP

Página: https://fordoctor.com.br/liga-fordoctor/ · Fonte única: `src/landing.html` · Pré-visualização: `npm run preview` → http://localhost:4173

Este arquivo registra o que foi decidido, de onde vem cada texto e o que ainda depende de acesso. Decisões novas substituem as antigas.

## Decisões do time (13/10/2026)

| # | Tema | Decisão |
|---|---|---|
| 1 | Title, description e H1 | Partir do que já está no ar. Title e description ficam iguais aos atuais. O H1 atual ganha "Liga ForDoctor" na frente. |
| 2 | Público | Continua 11º e 12º período, independentemente do ano em que o estudante se forma. |
| 3 | PJ gratuita | Mostrar ao lado da promessa a ressalva da página de obrigado: sem honorários de abertura; as taxas dos órgãos públicos ficam com o médico. |
| 4 | Indicação | O representante recebe R$ 200 **em crédito na mensalidade da ForDoctor** por indicado que fechar contrato. |
| 5 | Tom do FAQ | Sem resposta ainda. Padrão adotado: as respostas neutras do documento de SEO ("depende de cada caso"), sem o "na maioria das vezes, sim" da página de obrigado. |
| 6 | Rastreamento | Aprovado fazer as mudanças. As que dependem do WordPress entram com o acesso; as do GTM e da Meta precisam de acesso a essas contas. |
| 7 | Acesso | O WordPress será liberado depois da revisão desta base HTML. |
| 8 | Passos da indicação (v0.2) | Animados no estilo da ForDoctor Indica (`fordoctor.com.br/indica/`, seção "Como funciona?"): nó navy com número dourado, trilho dourado fantasma e linha que liga as etapas. |
| 9 | Mais azul e círculos (v0.2) | Hero, recompensas e cadastro em navy, com os anéis concêntricos da identidade da Liga (antes eram uma imagem de 552 KB; agora são um SVG de 1 KB). |
| 10 | Intro (v0.2) | Aprovada explicitamente pelo time. Feita com a skill `efeito-de-intro`, uma vez por sessão. |
| 11 | Foto do hero (v0.3; substituída na v0.5) | As duas ficavam inteiras dentro do círculo. Na v0.5 a foto sai do hero e vai para "O que é a Liga". |
| 12 | Anéis atravessando a divisa (v0.3) | Os anéis das recompensas continuam para cima em "O que a Liga oferece?", em azul sobre o fundo claro, abaixo do texto, com parallax; as duas camadas andam juntas e ficam alinhadas na divisa. |
| 14 | Ondas no hero (v0.4, em análise pelo time) | Os anéis atrás da foto pulsam em sequência, de dentro para fora, como ondas (ciclo de 6 s). Vídeos: `qa/preview-v0.4/ondas-1440.mp4` e `ondas-390.mp4`. |
| 13 | "O que é a Liga" (v0.3; substituída na v0.5) | O fundo da seção era a composição oficial da estudante. Saiu na v0.5; os originais continuam em `src/originais/`. |
| 15 | Menos fotos, mais símbolo (v0.5, pedido de 14/10) | "Diminuir o uso de imagens e usar mais efeitos visuais e símbolos, mantendo o padrão de cores, com efeitos semelhantes ao Siteflux." De duas fotos grandes para uma: a composição da estudante saiu e a foto das duas médicas com o kit foi do hero para "O que é a Liga". O hero virou uma arte vetorial (constelação da turma em volta do símbolo oficial; desde a v0.5.2, só os formandos, sem etiquetas). Técnicas do Siteflux adaptadas às cores da ForDoctor: caixas arredondadas sobre o papel, cabeçalho flutuante que troca de tom e entra em partes, índice das seções, títulos linha a linha, caixa de baixo subindo sobre a de cima, símbolo em linhas como marca-d'água e luz girando dentro do símbolo na intro. Ícones próprios em traço (10), sem emoji. |
| 16 | Pausa das animações (v0.5; retirada na v0.5.1) | O botão de pausar do hero saiu a pedido do usuário. As ondas e os sinais continuam parando fora da tela, com a aba oculta, com movimento reduzido e sem JavaScript. Pela WCAG 2.2.2, movimento automático com mais de 5 s ao lado de conteúdo pede um jeito de pausar; sem o botão, quem não ativou "reduzir movimento" no sistema não tem como parar as ondas enquanto está no topo. |
| 17 | Formandos em 2D (v0.5.1) | O usuário pediu imagens de formandos em 2D tiradas do Pinterest. Não foram usadas: as ilustrações de lá são de outros autores e não têm licença para uso comercial. No lugar, seis formandos desenhados em vetor para esta página (três de beca e capelo, três de jaleco, tons de pele e cabelos variados), nas cores da marca. Desde a v0.5.2 ficam igualmente espaçados sobre o anel de raio 215 (com um traço dourado discreto) e cada um se liga ao símbolo por um raio reto, perpendicular aos círculos, por onde corre o sinal; as quatro etiquetas (Informação, Orientação, Benefícios, Conexão) saíram do hero para a arte ter menos informação. O briefing original vetava imagens de pessoas geradas por IA; estes são ilustrações simples, não retratos, mas o time deve aprovar. Se o time comprar ilustrações licenciadas, a troca é só no sprite (`#aluno-1` a `#aluno-6`). |
| 18 | Efeitos que se repetem (v0.5.1) | Pedido do usuário: os efeitos de entrada voltam ao início quando o bloco sai da tela e tocam de novo ao rolar para baixo ou para cima (títulos, constelação do hero, foto da Liga, ícones, marcas-d'água, escada e passos). O que está na tela no carregamento não é escondido. |
| 19 | FAQ (v0.5.1; refeito na v0.5.3) | Mais limpo, a pedido do usuário: uma duração e uma curva para tudo (320 ms, `cubic-bezier(.22,1,.36,1)`), sem sombra e sem mola. Hover: fundo branco suave, os filetes vizinhos somem, a pergunta e o aro do + ficam dourados e o + gira 90°. Clique: cartão navy, texto claro, o + fica dourado e completa o giro até virar ×; a resposta entra com opacidade. As cores do + são propriedades registradas (`@property`), então mudam com transição. |
| 20 | Foto da Liga (v0.5.1) | As duas médicas voltam para dentro do círculo, com o anel dourado completo por cima (como na v0.3). |
| 21 | Hero como demonstração da indicação (v0.6, pedido de 14/10) | A constelação passa a contar "você indica um colega → a indicação é validada → o benefício volta para você" em ciclo de 11 s (8 s de sequência, cerca de 3 s de pausa). "Você" é o formando de beca à esquerda, com etiqueta fixa e borda dourada; o colega indicado é o de jaleco à direita; os outros quatro são a rede (menores, borda azul acinzentada). Os raios retos saíram: o trajeto é um oval curvo que contorna o símbolo (indicação por baixo; validação e retorno por cima, encostando no topo do símbolo), atrás dos formandos e sem cruzar o desenho. Uma luz dourada percorre cada trecho; no topo o símbolo ganha um brilho suave (sem se mover) e solta duas ondas que se apagam; as bordas da rede reagem de leve quando a onda passa. Dos seis anéis em ondas ficaram três fixos, finos, com 13% de opacidade (dois no celular). Textos e valores vêm da seção Indicação: "Fechou contrato" (a condição real) e "R$ 200 em crédito na mensalidade" junto de você, sem somar a cada volta. Sem JS ou com movimento reduzido fica uma composição estática com a história inteira (trajeto com setas em ângulo reto, como as pontas do símbolo). No celular saem os dois formandos de baixo e o anel de fora, para as etiquetas caberem sem sobrepor. A borda dos formandos virou variável no sprite (`--aluno-aro`). |

## Intro "a turma se liga"

Conceito: a Liga é a turma se conectando à ForDoctor. Os anéis concêntricos (os círculos da identidade) se abrem a partir do símbolo; seis colegas, pontos dourados, surgem nos anéis e se ligam ao símbolo por curvas que escoam para dentro dele; o contorno oficial do símbolo se desenha e preenche; a câmera desliza e o nome ForDoctor aparece. Termina no logo oficial (SVG claro), com a legenda "Liga ForDoctor" composta em Dosis; não foi criado logo novo para a Liga.

É diferente da intro da ForDoctor Indica (símbolo → nome + filete), como pede o catálogo de aberturas: o verbo forte aqui é **conectar** (pontos → curvas → símbolo), com **câmera** de apoio.

| Início | Duração | Camada | Técnica |
|---|---|---|---|
| 0,00 s + i·0,05 | 0,45 s | 10 anéis concêntricos (centro da tela) | T3 |
| 0,18 s + i·0,07 | 0,32 s | 6 colegas (pontos dourados) sobre os anéis | T8 |
| 0,45 s + i·0,06 | 0,50 s | 6 conexões curvas até o símbolo | T1 |
| 0,90 s | 0,80 s | contorno oficial do símbolo | T1 |
| 1,05 s | 0,80 s | luz dentro do símbolo (v0.5): três setores (dourado, branco, azul dos anéis) giram −40° → 320° sob a máscara do desenho oficial, como no Siteflux | T4 |
| 1,10 s + i·0,03 | 0,40 s | conexões escoam para o símbolo; colegas somem | T2 |
| 1,55 s | 0,30 s | preenchimento oficial; contorno some 1,70–1,95 s | T9 |
| 0,00–2,30 s | — | câmera: aproxima (1,24 → 1,16) e desliza o símbolo até a posição do logo | T6 |
| 1,60 s | 0,70 s | anéis se abrem (1 → 1,14) e esmaecem para 70% | — |
| 1,70 s | 0,75 s | logo oficial claro revela o nome por máscara | T11 |
| 2,35 / 2,45 s | 0,30 / 0,35 s | filete dourado / legenda "Liga ForDoctor" | T1 / T7 |
| 2,80–3,10 s | — | marca parada | — |
| 3,10 s | 0,50 s | dissolução; cabeçalho entra em partes (`--rise-start`) | T12 + F |

Infraestrutura (template da skill): decisão no `<head>` antes da primeira pintura; cobertura navy em CSS com failsafe de 4,6 s; `intro.js` com `onerror` que libera a página; dois `requestAnimationFrame` antes de tocar; fim natural mais duas travas (1,5 s sem quadro e duração + 2 s); pular por Esc, Tab, Enter, teclas de rolagem, roda, toque, clique, rolagem e aba oculta; o clique que pula não atravessa para o botão de baixo. Não roda com `#âncora`, aba oculta, página já rolada, movimento reduzido ou se já foi vista na sessão. `?intro=1` força e `?intro=0` desliga (revisão e QA).

Arquivos: molde `build/intro.template.js` → `node build/gera-intro.mjs` insere o path oficial do símbolo (de `src/originais/logo_fordoctor.svg`) e gera `src/assets/intro.js`. Estilos e roteiro no bloco "Intro" de `src/assets/liga.css`.

## Rota técnica

A base HTML não depende da rota. Recomendação para a Fase 3: **Rota A**, template isolado de campanha (plugin com template de página que carrega só o CSS e o JS da LP), no padrão da ForDoctor Indica. A auditoria mediu 36 folhas de estilo e 26 scripts próprios de tema e addons sem uso nesta página; remover um a um dentro do Elementor (Rota B) é mais lento e mais frágil. A decisão final sai depois de ver o painel: plugins ativos, ações do formulário e como o Rank Math gera o schema.

Requisito das duas rotas: o envio continua chegando ao mesmo destino de hoje (ações do formulário do Elementor, `post_id` 4839, `form_id` fbb441a) e continua redirecionando para `/liga-fordoctor/obrigado/`, que é o que dispara as conversões no GTM (GA4 `Enviou_Formulário` e Google Ads `oQ8RCL2-59QaEPfJ-74C`).

## Mapa de conteúdo

Origem: **no ar** = copiado da página atual ou da página de obrigado (validado) · **time** = decisão de 13/10 · **documento** = texto do modelo de SEO, precisa de validação · **novo** = escrito para esta versão, precisa de validação.

| Seção | Título | Função | Origem do texto |
|---|---|---|---|
| Head | Title "Liga ForDoctor: PJ Médica Grátis para Formandos 2026" (52) e description atual (147) | busca | no ar |
| Hero | H1 "Liga ForDoctor: Benefícios exclusivos para turmas de Medicina que irão se formar em 2026" | informar | no ar + time (marca) |
| Hero | "Abertura de PJ médica gratuita e mais benefícios para sua turma." | oferta | no ar |
| Hero | Ressalva dos honorários e das taxas públicas | regra | no ar (obrigado) + time |
| Hero | "Para estudantes do 11º e do 12º período de Medicina." | regra | time (texto novo) |
| 1 | H2 O que acontece quando você se forma em Medicina? + 10 perguntas | informar | documento |
| 2 | H2 O que é a Liga ForDoctor? | informar | documento |
| 3 | H2 Por que um médico precisa entender de PJ? + 8 fatores | informar | documento |
| 4 | H2 PJ médica para recém-formados (link para /abertura-de-empresa/) | informar | documento; link novo |
| 5 | H2 E se eu for fazer residência médica? | informar | documento |
| 6 | H2 O que a Liga oferece? (Informação, Orientação, Benefícios, Conexão) | provar | documento |
| 7 | H2 Benefícios para quem movimenta a turma: 5 / 10 / 20 reuniões = R$ 250 / R$ 750 / R$ 1.500, regras e formas de concessão | regra | no ar (literal); título do documento |
| 8 | H2 E você também ganha quando um colega entra: 4 passos, R$ 500 de crédito ao colega, R$ 200 em crédito na mensalidade ao representante | regra | no ar + time; nomes dos passos novos |
| 9 | H2 Por que contar com uma contabilidade especializada em médicos? + H3 com 6 serviços | provar | documento |
| 10 | H2 Perguntas frequentes sobre PJ médica (7 perguntas) | informar | documento |
| 11 | H2 Pronto para começar essa nova fase? + formulário | ação | documento + no ar ("Cadastre-se para receber orientações práticas…") |
| Sucesso | "Cadastro recebido" + "Em breve um de nossos atendentes fará contato com você." | ação | no ar (obrigado) |
| Erro | "Não foi possível enviar seu cadastro agora…" com o WhatsApp (31) 99712-5537 | ação | novo; número do botão da página de obrigado |

CTAs: um único texto, "Quero fazer parte da Liga", no cabeçalho (desktop), no hero, depois de "O que é a Liga", depois das recompensas e na barra fixa do celular. O botão do formulário diz o que acontece: "Enviar meu cadastro".

## Tokens

| Grupo | Valores |
|---|---|
| Cor | navy `#091D3E` (hero, recompensas, cadastro, intro) · dourado `#C19B52` também como fundo da caixa "O que a Liga oferece?" (v0.5), com texto e filetes navy · papel no rodapé (v0.5; o navy escuro `#061430` saiu) · anéis `rgba(167,196,240,.17–.24)` sobre o navy · dourado `#C19B52` (filetes, pontos, botão, linha dos passos) · dourado de texto `#7A5C24` (5,7:1 sobre o papel) · texto `#565872` · papel `#F7F5EF` · branco |
| Contraste | navy sobre o botão e a caixa dourada 6,43:1 · dourado sobre o navy (índices) 6,43:1 · `#7A5C24` sobre o branco 6,21:1 · `#565872` sobre o papel 6,4:1 · `#B28B46` sobre o papel dá só 2,9:1, por isso não é usado em texto |
| Tipografia | Dosis 500–700 (títulos, variável, 30 KB) · Jost 400–600 (texto, variável, 27 KB) · woff2 latino auto-hospedado · preload só da Dosis · corpo 17–18 px · linhas de até 60ch |
| Espaço | múltiplos de 4/8 px (4, 8, 12, 16, 24, 32, 48, 64, 96) · lateral 16 / 32 / 48 px |
| Forma | raio 4 px (botões e campos) · caixas (v0.5): margem do papel 6 / 8 / 12 px e raio 22 / 30 / 40 px (celular / tablet / desktop) · painel do formulário com o raio da caixa − 8 px · a caixa das recompensas sobe `clamp(56px, 8vw, 120px)` sobre a dourada · sombras: barra fixa do celular, cabeçalho rolado e formandos do hero |
| Ícones (v0.5) | sprite em `src/landing.html`, viewBox 24, traço 1,6–1,8, pontas redondas, setas em ângulo reto como as pontas do símbolo: informação, orientação, benefícios, conexão, empresa, nota fiscal, planejamento, obrigações, Imposto de Renda, gestão |
| Marca inline (v0.5) | `#simbolo` e `#marca-nome` gerados do vetor oficial por `build/gera-sprite.mjs`; cores por `--marca-letras` e `--marca-sub` (o cabeçalho troca de tom com transição) |
| Easing | `--ease-out: cubic-bezier(.16,1,.3,1)` · `--ease-draw: cubic-bezier(.45,0,.2,1)` · `--ease-spring: cubic-bezier(.34,1.56,.64,1)` |

## Plano de movimento (v0.5)

| # | Efeito | Onde | Gatilho | Duração e easing | Movimento reduzido | Sem JS |
|---|---|---|---|---|---|---|
| 1 | Intro "a turma se liga" (roteiro acima), agora com a luz girando dentro do símbolo | tela cheia, 1ª visita da sessão | carregamento | 3,1 s + 0,5 s de dissolução | não roda | não roda |
| 2 | Cabeçalho em partes (Siteflux): o símbolo gira −120° → 0 e assenta com mola, o nome vem da esquerda, o botão desce | cabeçalho | carga da página ou fim da intro (`--rise-start`) | 760 / 560 / 420 ms | estado final | estado final |
| 3 | Cabeçalho flutuante: transparente sobre o hero; depois da rolagem vira uma barra arredondada translúcida no tom do que passa por baixo (claro ou navy) | cabeçalho | rolagem; caixa navy sob a linha do meio do cabeçalho | 240 ms | sem animação | barra clara sólida |
| 4 | Constelação do hero (v0.6): contorno do símbolo se desenha e acende em dourado, os anéis aparecem, os formandos estouram com mola um a um, o trajeto e a etiqueta "Você" aparecem | hero | carga da página (só CSS) e cada volta à tela | ~1,7 s no total | composição estática | composição estática (CSS) |
| 5 | Demonstração da indicação (decisão 21; roteiro em `src/assets/liga.css`): destaque de "Você" → luz até o colega → "Fechou contrato" e luz até o símbolo → brilho e duas ondas → luz de volta → "R$ 200 em crédito na mensalidade"; formandos flutuam 2–4 px, devagar e desencontrados | hero | o JS liga quando o hero está na tela e a entrada terminou (depois da intro); pausa com a aba oculta; recomeça do "Você" quando o hero sai e volta; sem botão de pausa (decisão 16) | ciclo de 11 s | composição estática, sem movimento | composição estática |
| 6 | Títulos linha a linha (Siteflux: cada linha sobe 112% dentro da própria máscara, 90 ms entre linhas) | H2 abaixo da dobra | entrar na tela | 900 ms `ease-out` | não arma | texto normal |
| 7 | Símbolo em linhas se desenha como marca-d'água | "O que acontece…" e cadastro | 20% na tela | 2,6 s `ease-draw` | inteiro | inteiro |
| 8 | Foto da Liga (dentro do círculo): o círculo abre do centro, o anel assenta, a órbita se desenha e o selo do símbolo estoura | "O que é a Liga" | entrar na tela e estar carregada | ~1,3 s | estado final | estado final |
| 9 | Caixa navy das recompensas sobe sobre a dourada; anéis com parallax continuam na divisa | "O que a Liga oferece?" → recompensas | rolagem | contínuo, acompanha a rolagem | anéis parados | anéis parados |
| 10 | Escada 5 → 10 → 20 se desenha | recompensas | 35% na tela | ~1,2 s | estado final | estado final |
| 11 | Passos da indicação no estilo da Indica | "E você também ganha…" | 35% na tela | ~2,4 s | estado final | estado final |
| 12 | Ícones da oferta e da contabilidade se desenham um a um | "O que a Liga oferece?" e contabilidade | 20% na tela | 900 ms, 110–140 ms entre ícones | inteiros | inteiros |
| 13 | Microinterações: botão comprime com mola, envio em três estados | botões, formulário | clique, enviar | 90–260 ms | sem deslocamento | nativos |
| 14 | FAQ: hover acende a pergunta (fundo branco suave, texto e aro dourados, + gira 90°); aberta vira cartão navy e o + completa o giro até × | perguntas frequentes | passar o mouse, clicar | 320 ms, uma curva só | só a troca de cor | nativo, com as cores |

Desde a v0.5.1 as entradas (1 é a intro e não se repete; 4, 6, 7, 8, 10, 11 e 12) voltam ao início quando o bloco sai inteiro da tela e tocam de novo na volta, nos dois sentidos de rolagem.

Tudo usa `transform`, `opacity`, `stroke-dashoffset`, `fill-opacity` ou `clip-path` (este só na foto da Liga). Nenhum `transition: all`. O único movimento contínuo é o do hero (demonstração da indicação e flutuação dos formandos, v0.6), sem botão de pausa desde a v0.5.1. Sem bibliotecas novas.

São 14 efeitos contra 3–5 do briefing original: o pedido de 14/10 pediu mais efeitos. Se o time achar demais, os candidatos a sair primeiro são o 7 (marca-d'água) e o 12 (ícones).

Fora desta página: preloader, cortina, cursor com rastro, galeria horizontal, marquee, Lenis (rolagem nativa com `scroll-behavior: smooth` e `scroll-padding-top`).

## Formulário

| Campo | `name` (mantido) | Rótulo | `autocomplete` | Validação |
|---|---|---|---|---|
| Nome | `form_fields[first_namae]` | Nome | `given-name` | 2+ caracteres |
| Sobrenome | `form_fields[last_name]` | Sobrenome | `family-name` | 2+ caracteres |
| E-mail | `form_fields[email]` | E-mail | `email` | formato nome@dominio |
| WhatsApp | `form_fields[field_f2695ae]` | WhatsApp com DDD | `tel-national`, `inputmode="tel"` | DDD + celular com 9 dígitos, máscara (31) 99999-9999 |
| Período | `form_fields[periodo]` | Período na faculdade | — | obrigatório; opção "Escolha seu período" adicionada |
| UTM | `form_fields[utm_source|utm_medium|utm_campaign]` | ocultos | — | preenchidos no navegador a partir da URL ou do `sessionStorage` (chave `queryParams`, a mesma do site) |

Os nomes dos campos não mudaram porque o destino do formulário ainda não foi conferido. O texto da opção do 12º período foi corrigido para "Medicina", mas o **valor enviado** continua "Estou no 12º período de Medidina" até confirmarmos se alguma automação depende dele.

## Pendências

- **Favicon (14/10):** a página usa o favicon da ForDoctor Indica (símbolo oficial em dourado: `favicon.svg`, `favicon-32.png`, `favicon-192.png` e `apple-touch-icon.png` em `src/assets/img/`), copiado da produção (plugin `fordoctor-indica` 1.11.2). O repositório `Walter-Maia/Fordoctorindica` está na 1.9.1 e ainda não tem esses arquivos. No WordPress, os quatro vão junto com o template; conferir que o tema não imprime o ícone do site por cima.

- **Decisão do time sobre a v0.6:** aprovar a demonstração da indicação no hero (decisão 21), incluindo os textos "Você", "Colega", "Fechou contrato" e "R$ 200 em crédito na mensalidade". O ciclo dura mais de 5 s e continua sem botão de pausa (risco WCAG 2.2.2 da decisão 16).
- **Decisões do time sobre a v0.5:** aprovar a troca do hero por arte vetorial com formandos em 2D (decisão 17); aprovar a caixa dourada em "O que a Liga oferece?"; quantidade de efeitos (14) e a repetição a cada rolagem; ondas sem botão de pausa (decisão 16); os índices "01 A formatura…" são decorativos e podem sair sem afetar o conteúdo.

- **WordPress (após a revisão):** backup do template do Elementor e das configurações do Rank Math; conferir as ações do formulário; ligar o envio ao destino atual com redirecionamento para a página de obrigado; `noindex` e saída do sitemap da página de obrigado; schema no Rank Math (Organization com logo SVG e perfis reais, WebPage e FAQPage com as 7 perguntas, sem duplicar JSON-LD); subir a imagem de compartilhamento e apontar `og:image` para a URL final.
- **GTM e Meta (acesso a confirmar):** desligar os eventos automáticos do pixel (`CompleteRegistration` no carregamento), remover a tag duplicada do pixel e revisar a conversão `Y4AECI-n7a0aEPfJ-74C` do Ads, que dispara em toda visita.
- **Conteúdo:** validar os textos marcados como documento ou novo; o ano "2026" fica no title e no H1 porque estão na base atual; trocar os dois juntos quando a campanha virar.
- **Pauta do cluster (todas as URLs dão 404 hoje):** `/blog/pj-para-medico-recem-formado/`, `/blog/como-abrir-pj-medica/`, `/blog/medico-precisa-de-contador/`, `/blog/pj-medica-para-plantao/`, `/blog/medico-pessoa-fisica-ou-juridica/`, `/blog/pj-medica-durante-residencia/`. Quando existirem, entram como links nas seções correspondentes.
