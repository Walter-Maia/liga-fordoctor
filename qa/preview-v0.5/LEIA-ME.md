# QA da v0.5.0 (14/10/2026): menos fotos, mais símbolo

Pedido: diminuir o uso de imagens, usar mais efeitos visuais e símbolos, manter as cores da ForDoctor e ter efeitos semelhantes aos do Siteflux. Decisões e plano de movimento em `DIRECAO-DESIGN.md` (decisões 15 e 16).

Todos os testes rodaram no Edge headless (Windows) contra o servidor local (`npm run preview`), sem GTM e sem pixels.

## O que mudou nas imagens

| | v0.4 | v0.5 |
|---|---|---|
| Fotos na página | 2 (duas médicas com o kit no hero; composição da estudante como fundo de "O que é a Liga") | 1 (as duas médicas, agora em "O que é a Liga", carregamento preguiçoso) |
| Arquivos de foto gerados (AVIF + WebP, várias larguras) | 14 (6 da foto do kit + 8 do fundo) | 6 (só a foto do kit) |
| Elemento do LCP | foto do hero | texto do H1 |
| Logo | 2 arquivos SVG externos | inline, gerado do vetor oficial (`build/gera-sprite.mjs`) |
| Ícones | nenhum | 10 próprios em traço, num sprite inline |

## Capturas

- `capturas/1440-*.jpg` e `capturas/390-*.jpg`: cada seção depois das animações de entrada (`node qa/scripts/v05.js 1440 900` e `390 844`). Sem erros de console nem rolagem lateral; o cabeçalho fica escuro sobre as caixas navy e claro no resto.
- `intro/1440-folha.jpg`: quadros da intro congelados nos instantes do roteiro (0,6 a 3,0 s). Entre 1,1 e 1,6 s a luz gira dentro do símbolo (dourado, branco e azul) antes de assentar no dourado oficial.
- `entrega/1440-folha.jpg`: quadros em tempo real de 2,6 a 6,0 s (`node qa/scripts/v05-entrega.js`): a intro dissolve, o símbolo do cabeçalho gira e assenta, o nome entra, o botão desce e a constelação do hero se desenha, com as etiquetas por último.
- `estados/`: movimento reduzido e sem JavaScript (`node qa/scripts/com-servidor.js qa/scripts/v05-estados.js`).

## Estados

| Caso | Resultado medido |
|---|---|
| Movimento reduzido | intro não roda; etiquetas, formandos, fios, símbolo, marcas-d'água, ícones, órbita, foto (dentro do círculo) e selo no estado final; nenhuma onda animando |
| Sem JavaScript | todo o conteúdo visível e inteiro; cabeçalho com barra clara sólida; ondas e sinais parados |

## Lighthouse 12.8.2 (localhost, uma rodada cada, `lighthouse/`)

| | Desempenho | Acessibilidade | Boas práticas | SEO | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|
| Celular (com intro) | 94 | 100 | 100 | 66* | 1,5 s | 280 ms | 0,002 |
| Desktop | 100 | 100 | 100 | 66* | 0,5 s | 20 ms | 0 |

\* SEO 66 só porque a pré-visualização tem `noindex`. Para comparação, a v0.3 no mesmo teste deu 95 no celular (TBT 230 ms); a maior tarefa longa continua sendo a montagem da intro (~360 ms com a CPU 4× mais lenta do Lighthouse). Uma rodada só: a variação entre rodadas é de alguns pontos.

## Não testado

Safari (iOS e macOS), Firefox, aparelhos físicos, leitores de tela reais e a página com GTM e pixels.

## v0.5.1 (mesmo dia): formandos, efeitos que se repetem, FAQ e foto no círculo

Pedidos: as duas médicas dentro do fundo circular; formandos em 2D se conectando ao logo; sem botão de pausa; efeitos reaparecendo ao rolar para cima e para baixo; FAQ com hover e mudança de cor ao clicar. As ilustrações não vieram do Pinterest (sem licença para uso comercial): os seis formandos foram desenhados em vetor para esta página (decisão 17 em `DIRECAO-DESIGN.md`).

`repete/` (`node qa/scripts/com-servidor.js qa/scripts/v05-repete.js`), resultado medido:

| Passo | Estado |
|---|---|
| carga: escada e título de "PJ" fora da tela | armados (escondidos só enquanto estão fora da tela) |
| descendo até as recompensas | escada desenhando; depois da animação, estado final |
| no cadastro | escada armada de novo; constelação do hero armada e ondas pausadas |
| subindo até as recompensas | escada desenhando de novo |
| subindo até "PJ" e "O que é a Liga" | título linha a linha de novo; foto abrindo o círculo de novo |
| de volta ao topo | constelação tocando de novo (6 de 6 formandos animando) |
| leitores de tela | os 11 H2 com o texto inteiro, sem repetição (as linhas visuais ficam ocultas para eles) |
| FAQ, hover | cartão branco, texto `#7A5C24` (`faq-hover.jpg`) |
| FAQ, clique | aberto, cartão navy, texto branco (`faq-aberto.jpg`) |

Movimento reduzido e sem JavaScript: tudo no estado final, sem ondas (`v05-estados.js`). As 18 telas do teste de responsividade continuam OK.

Os testes agora ligam o servidor só durante a execução (`qa/scripts/com-servidor.js`), sem processo em segundo plano.
## v0.5.2 e v0.5.3 (mesmo dia): hero sem etiquetas e FAQ mais limpo

- **v0.5.2:** as quatro etiquetas do hero saíram. Os seis formandos ficam igualmente espaçados num mesmo anel, ligados ao símbolo por raios retos (perpendiculares aos círculos). Capturas em `capturas/1440-hero.jpg` e `capturas/390-hero.jpg`.
- **v0.5.3:** hover e abertura do FAQ com uma duração e uma curva só, sem sombra e sem mola. `faq/folha.jpg` (`node qa/scripts/com-servidor.js qa/scripts/v05-faq.js`) mostra repouso, hover em 90 ms, 180 ms e no fim, abrindo em 120 ms e aberta.
- As 18 telas do teste de responsividade continuam OK.

## v0.5.4 (mesmo dia): correções

- **Marcas-d'água e órbita da foto não apareciam desde a v0.5.1.** O controle que repete os efeitos media a altura com `offsetHeight`, que não existe em elementos SVG; a conta dava `NaN` e as duas marcas-d'água (formatura e cadastro) e a órbita ficavam presas no estado inicial, escondidas. Agora a altura vem de `getBoundingClientRect()`, e peças grandes cortadas pela caixa também tocam quando a parte visível ocupa metade da tela. `v05-repete.js` passou a conferir as três, descendo e subindo: desenham nos dois sentidos.
- **Símbolo fora do centro dos anéis na intro.** A legenda "Liga ForDoctor" entrava na centralização e empurrava o logo para cima (32 px em 1440 × 900, 29 px em 390 × 844). A legenda agora fica pendurada abaixo do logo; desvio medido depois: 0,3 e 0,2 px (`node qa/scripts/com-servidor.js qa/scripts/intro-centro.js 1440x900 1.3`, quadros em `intro/centro-1440.jpg`).
- Nomes para leitores de tela conferidos na árvore de acessibilidade do Edge: os 11 títulos e as 10 seções com o texto uma vez só. Ferramentas que leem o texto bruto da página mostram o título duas vezes (o trecho para leitores de tela e as linhas visuais), mas os leitores de tela recebem só o primeiro.
