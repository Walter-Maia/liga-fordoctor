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
| 11 | Foto do hero (v0.3) | As duas ficam inteiras dentro do círculo: recorte logo dentro do anel da foto e anel dourado completo desenhado em CSS. |
| 12 | Anéis atravessando a divisa (v0.3) | Os anéis das recompensas continuam para cima em "O que a Liga oferece?", em azul sobre o fundo claro, abaixo do texto, com parallax; as duas camadas andam juntas e ficam alinhadas na divisa. |
| 14 | Ondas no hero (v0.4, em análise pelo time) | Os anéis atrás da foto pulsam em sequência, de dentro para fora, como ondas (ciclo de 6 s). Vídeos: `qa/preview-v0.4/ondas-1440.mp4` e `ondas-390.mp4`. |
| 13 | "O que é a Liga" (v0.3) | O fundo da seção é a própria composição oficial da estudante (gradiente azul + círculos), com versão de celular; a cor da seção é a da borda da imagem, sem emenda. Texto em branco. |

## Intro "a turma se liga"

Conceito: a Liga é a turma se conectando à ForDoctor. Os anéis concêntricos (os círculos da identidade) se abrem a partir do símbolo; seis colegas, pontos dourados, surgem nos anéis e se ligam ao símbolo por curvas que escoam para dentro dele; o contorno oficial do símbolo se desenha e preenche; a câmera desliza e o nome ForDoctor aparece. Termina no logo oficial (SVG claro), com a legenda "Liga ForDoctor" composta em Dosis; não foi criado logo novo para a Liga.

É diferente da intro da ForDoctor Indica (símbolo → nome + filete), como pede o catálogo de aberturas: o verbo forte aqui é **conectar** (pontos → curvas → símbolo), com **câmera** de apoio.

| Início | Duração | Camada | Técnica |
|---|---|---|---|
| 0,00 s + i·0,05 | 0,45 s | 10 anéis concêntricos (centro da tela) | T3 |
| 0,18 s + i·0,07 | 0,32 s | 6 colegas (pontos dourados) sobre os anéis | T8 |
| 0,45 s + i·0,06 | 0,50 s | 6 conexões curvas até o símbolo | T1 |
| 0,90 s | 0,80 s | contorno oficial do símbolo | T1 |
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
| Cor | navy `#091D3E` (hero, recompensas, cadastro, intro) · navy escuro `#061430` (rodapé) · anéis `rgba(167,196,240,.17–.24)` sobre o navy · dourado `#C19B52` (filetes, pontos, botão, linha dos passos) · dourado de texto `#7A5C24` (5,7:1 sobre o papel) · texto `#565872` · papel `#F7F5EF` · branco |
| Contraste | navy sobre o botão dourado 6,4:1 · `#565872` sobre o papel 6,4:1 · `#B28B46` sobre o papel dá só 2,9:1, por isso não é usado em texto |
| Tipografia | Dosis 500–700 (títulos, variável, 30 KB) · Jost 400–600 (texto, variável, 27 KB) · woff2 latino auto-hospedado · preload só da Dosis · corpo 17–18 px · linhas de até 60ch |
| Espaço | múltiplos de 4/8 px (4, 8, 12, 16, 24, 32, 48, 64, 96) · lateral 16 / 32 / 48 px |
| Forma | raio 4 px (botões e campos) e 8 px (foto e painel do formulário) · uma sombra, só na barra fixa do celular |
| Easing | `--ease-out: cubic-bezier(.16,1,.3,1)` · `--ease-draw: cubic-bezier(.45,0,.2,1)` · `--ease-spring: cubic-bezier(.34,1.56,.64,1)` |

## Plano de movimento

| # | Efeito | Onde | Gatilho | Duração e easing | Movimento reduzido | Sem JS |
|---|---|---|---|---|---|---|
| 1 | Abertura sem overlay: só a foto entra (fade, máscara curta, zoom 1,035 → 1); logo e botão do cabeçalho descem 12 px | hero e cabeçalho | carga da própria foto; carga da página | 640 ms `ease-out`; 420 ms | estado final | foto e cabeçalho visíveis |
| 2 | Título revelado por linha (máscara por linha, 60 ms entre linhas, teto de 600 ms) | H2 abaixo da dobra | entrar na tela | 560 ms `ease-out` | não arma | texto normal |
| 3 | Momento principal: escada 5 → 10 → 20 se desenha (piso e espelho com `transform`), valores exatos com fade curto, sem contador | recompensas | 35% da trilha na tela; pausa se sair da tela ou a aba ficar oculta | ~1,2 s `ease-draw` | estado final | estado final |
| 4 | Imagem revelada com máscara: o fundo de "O que é a Liga" entra pelo lado da estudante (desktop, da direita) ou de baixo (celular), com zoom 1,04 → 1. O recorte fica no `<picture>`, para o navegador continuar carregando a imagem | fundo de "O que é a Liga" | entrar na tela e estar carregada | 1.000 ms `ease-out` | estado final | imagem visível |
| 5 | Microinterações: botão comprime com mola; resposta do FAQ entra com opacidade; envio em três estados; fundo do cabeçalho fica translúcido depois da rolagem | botões, FAQ, formulário, cabeçalho | clique, abrir, enviar, rolar | 90–260 ms | sem deslocamento | FAQ e formulário nativos |
| 6 (v0.2) | Intro "a turma se liga" (roteiro acima); com ela, o efeito 1 vira a dissolução da intro e a entrega do cabeçalho | tela cheia, 1ª visita da sessão | carregamento | 3,1 s + 0,5 s de dissolução | não roda | não roda |
| 7 (v0.2) | Passos da indicação no estilo da Indica: nó entra com mola, texto sobe, linha dourada liga ao próximo nó; o nó do crédito pulsa uma vez | "E você também ganha…" | 35% da lista na tela; pausa fora da tela e com a aba oculta | ~2,4 s (440 ms por etapa) | estado final | estado final |

Acessório retirado antes da entrega: o botão magnético do hero.

| 8 (v0.3) | Parallax dos anéis: camada azul em "O que a Liga oferece?" e camada clara nas recompensas, `y = A × (2p − 1)` com A = 6vw (24–90 px) e p = progresso da faixa das recompensas na tela | divisa entre as duas seções | rolagem (um `requestAnimationFrame`, só perto da tela) | contínuo, acompanha a rolagem | desligado | anéis parados |

| 9 (v0.4) | Ondas nos anéis do hero: 6 anéis (HTML, animação de `scale` e `opacity` no compositor) com o mesmo deslocamento (16 unidades) e 0,5 s de atraso entre eles; a crista fica mais clara | hero | carga da página (espera a intro terminar) | ciclo de 6 s, `cubic-bezier(.45,0,.55,1)`, contínuo; pausa fora da tela e com a aba oculta | anéis parados | anéis parados |

Com os pedidos do time, a página passa de 5 para 9 efeitos. A intro e as sequências tocam uma vez; o parallax só se move quando a pessoa rola. As ondas do hero são o único loop contínuo: pela WCAG 2.2.2, movimento automático com mais de 5 s ao lado de conteúdo pede um controle de pausa (a Indica teve esse controle removido por decisão do time). Se as ondas forem aprovadas, decidir entre um botão discreto de pausar, parar depois de alguns ciclos ou manter como está.

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

- **WordPress (após a revisão):** backup do template do Elementor e das configurações do Rank Math; conferir as ações do formulário; ligar o envio ao destino atual com redirecionamento para a página de obrigado; `noindex` e saída do sitemap da página de obrigado; schema no Rank Math (Organization com logo SVG e perfis reais, WebPage e FAQPage com as 7 perguntas, sem duplicar JSON-LD); subir a imagem de compartilhamento e apontar `og:image` para a URL final.
- **GTM e Meta (acesso a confirmar):** desligar os eventos automáticos do pixel (`CompleteRegistration` no carregamento), remover a tag duplicada do pixel e revisar a conversão `Y4AECI-n7a0aEPfJ-74C` do Ads, que dispara em toda visita.
- **Conteúdo:** validar os textos marcados como documento ou novo; o ano "2026" fica no title e no H1 porque estão na base atual; trocar os dois juntos quando a campanha virar.
- **Pauta do cluster (todas as URLs dão 404 hoje):** `/blog/pj-para-medico-recem-formado/`, `/blog/como-abrir-pj-medica/`, `/blog/medico-precisa-de-contador/`, `/blog/pj-medica-para-plantao/`, `/blog/medico-pessoa-fisica-ou-juridica/`, `/blog/pj-medica-durante-residencia/`. Quando existirem, entram como links nas seções correspondentes.
