---
name: estilos-de-superficie-morphism
description: Escolher e implementar em CSS os quatro estilos de superfície — glassmorphism (vidro fosco translúcido), claymorphism (formas infladas e macias), skeuomorphism (imita objetos reais) e neumorphism (relevo sutil na mesma cor do fundo) — com receitas, fallbacks, tabela de contraste e custo de desempenho. Use quando o pedido falar em "efeito de vidro", "glass", "cards translúcidos", "estilo clay/3D fofinho", "parecer um objeto real", "botões em relevo/soft UI", ou quando for preciso decidir qual acabamento combina com a identidade do projeto.
---

# Estilos de superfície (glass · clay · skeuo · neu)

A frase que resume a referência: "o estilo deve servir ao produto, não só deixar a interface na moda". Cada um destes quatro acabamentos comunica uma coisa; a skill dá a receita CSS de cada um, o que ele custa em contraste e desempenho, e onde cabe (ou não) nas identidades do Siteflux e do Vale do Aço Digital. Para vidro com refração real (WebGL), a skill irmã é [vidro-refrativo-liquid-glass/SKILL.md](../vidro-refrativo-liquid-glass/SKILL.md); esta aqui é o vidro "de CSS", e os outros três estilos.

## Referência

Post: [Reel Ddtjns6tLv5](https://www.instagram.com/reels/Ddtjns6tLv5/), aydadex (Ayda Dehghan), 14 s, legenda listando os quatro estilos e a mensagem sobre servir ao produto. Inspecionado em 28/09/2026 a 1 quadro/s. Evidência local: `qa/reels-2026-09-28/Ddtjns6tLv5-p01.jpg` e `-p02.jpg`.

Observado (ilustrações 3D flutuando sobre a apresentadora, cada uma seguida de um mockup de app):

| Trecho | Objeto ilustrativo | Mockup | Estilo |
|---|---|---|---|
| 0–2 s | bloco de vidro fosco | dashboard translúcido sobre fundo com gradiente | Glassmorphism |
| 2–4 s | bolha lilás inflada, mate | app de tarefas com cards arredondados e "gordinhos", sombra colorida | Claymorphism |
| 5–7 s | calculadora física preta → calculadora de app lilás | teclado numérico com botões que imitam os reais | Skeuomorphism |
| 8–11 s | botão em relevo cinza-claro, mesma cor do fundo | tela de ajustes com toggles e cards em relevo suave | Neumorphism |

O vídeo mostra ilustrações e mockups, não código. As receitas abaixo são reconstruções propostas com CSS padrão.

## Quando usar cada um

| Estilo | Comunica | Cabe em | Evite em |
|---|---|---|---|
| Glass | leveza, camadas, "por cima" do conteúdo | cabeçalho fixo, menu overlay, cards sobre foto/vídeo/gradiente | fundos lisos (não há nada para desfocar), texto pequeno, áreas grandes em celular |
| Clay | amigável, lúdico, produto de consumo | apps infantis/educacionais, onboarding, ícones e ilustrações | B2B sóbrio, texto denso, marcas industriais |
| Skeuo | familiaridade, "funciona como o objeto" | calculadora, mixer, controles físicos, mockups de dispositivo | tudo o que não tem equivalente físico (vira decoração pesada) |
| Neu | continuidade, superfície única, calma | telas de ajustes, players, dashboards claros com poucos controles | formulários (contraste), sites de conversão, modo escuro sem cuidado |

Regra prática: **um estilo de superfície por produto**, aplicado a uma família de componentes (cards, ou controles, ou cabeçalho), nunca a tudo. Misturar glass com neu na mesma tela lê como indecisão.

## Receitas

Todas usam variáveis para a cor de fundo (`--fundo`) e de acento (`--acento`) do projeto; nenhuma usa cor nova.

### Glassmorphism (vidro fosco)

```css
.vidro {
  --vidro-cor: 255 255 255;            /* branco em RGB separado, para alpha */
  background: rgb(var(--vidro-cor) / .12);
  border: 1px solid rgb(var(--vidro-cor) / .28);
  border-radius: 18px;
  box-shadow: 0 8px 32px rgb(0 0 0 / .18), inset 0 1px 0 rgb(var(--vidro-cor) / .35);
  color: #fff;
}
@supports (backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)) {
  .vidro { -webkit-backdrop-filter: blur(14px) saturate(140%); backdrop-filter: blur(14px) saturate(140%); }
}
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .vidro { background: rgb(var(--vidro-cor) / .82); color: #0b0b0b; }   /* fallback opaco e legível */
}
```

Detalhes que fazem parecer vidro e não "div transparente": a borda de 1 px mais clara que o fundo, o realce interno de 1 px no topo (`inset 0 1px 0`), `saturate()` junto do blur, e um **fundo com textura** (foto, gradiente animado de `fundos-shadergradient/`, ou a rede do Vale) para o desfoque ter o que desfocar. Em modo escuro, `--vidro-cor: 255 255 255` com alpha .06–.10; em modo claro, use um cinza escuro `20 20 24` com alpha .06 e borda escura.

Borda com gradiente (o brilho de aresta): `border: 1px solid transparent; background: linear-gradient(var(--fundo), var(--fundo)) padding-box, linear-gradient(135deg, rgb(255 255 255 / .5), rgb(255 255 255 / .05)) border-box;` — só sem `backdrop-filter` no mesmo elemento (o padding-box opaco anula o vidro); aplicar em um pseudo-elemento.

### Claymorphism (argila inflada)

```css
.clay {
  background: var(--clay-base, #cdbdf5);
  border-radius: 28px;                  /* raio grande: 20–32 px */
  box-shadow:
    inset -8px -8px 16px rgb(0 0 0 / .14),      /* sombra interna no canto oposto à luz */
    inset  6px  6px 14px rgb(255 255 255 / .55), /* luz interna */
    12px 18px 32px rgb(90 60 180 / .28);          /* sombra externa colorida, deslocada */
  color: #2a1f4d;
}
.clay--botao:active { box-shadow: inset 6px 6px 14px rgb(0 0 0 / .16), inset -4px -4px 10px rgb(255 255 255 / .4), 4px 6px 12px rgb(90 60 180 / .18); transform: translateY(1px); }
```

O que define clay: raio grande, duas sombras internas (luz e sombra) e uma externa **colorida** (derivada do fundo, não preta). Contraste do texto sobre pastel: usar a cor mais escura da paleta, nunca branco. Sombras internas não são compositor-friendly; não animar `box-shadow`, só trocar entre dois estados (a transição de 160 ms é aceitável em botões pequenos).

### Skeuomorphism (imita o objeto)

```css
.tecla {
  background: linear-gradient(180deg, #f7f5ff 0%, #e3def7 100%);
  border: 1px solid #c9c2e6;
  border-bottom-width: 3px;             /* espessura da tecla */
  border-radius: 10px;
  box-shadow: 0 1px 0 #fff inset, 0 2px 4px rgb(0 0 0 / .12);
  font-variant-numeric: tabular-nums;
  transition: transform 90ms ease-out, border-bottom-width 90ms ease-out, box-shadow 90ms ease-out;
}
.tecla:active { transform: translateY(2px); border-bottom-width: 1px; box-shadow: 0 1px 0 #fff inset, 0 0 1px rgb(0 0 0 / .1); }
```

Skeuo hoje é **sugestão de material**, não textura fotográfica: gradiente vertical curto (luz de cima), aresta inferior mais grossa, "afundar" no press. Use só onde o objeto real existe (teclado numérico, dial, chave). Para mockups de dispositivo, o Siteflux já tem molduras próprias; não trocar por PNGs de aparelhos.

### Neumorphism (soft UI)

```css
.neu {
  --neu-fundo: #e6e9f0;
  background: var(--neu-fundo);
  border-radius: 16px;
  box-shadow: 8px 8px 16px rgb(163 177 198 / .6), -8px -8px 16px rgb(255 255 255 / .85);  /* relevo */
  color: #23272f;
}
.neu--afundado, .neu:active { box-shadow: inset 6px 6px 12px rgb(163 177 198 / .6), inset -6px -6px 12px rgb(255 255 255 / .85); }
.neu:focus-visible { outline: 2px solid var(--acento); outline-offset: 3px; }   /* obrigatório: o relevo sozinho não marca foco */
```

Neu exige fundo claro de baixa saturação e o mesmo `--neu-fundo` no contêiner e no componente (é isso que dá a ilusão de "extrudado do fundo"). Em modo escuro, sombras `rgb(0 0 0 / .5)` e `rgb(255 255 255 / .05)`: o efeito fica fraco; se o produto é escuro, prefira glass.

## Contraste, acessibilidade e custo

| Estilo | Risco de contraste | Mitigação | Custo de renderização |
|---|---|---|---|
| Glass | texto sobre conteúdo variável por trás (pode passar de 7:1 para 2:1 ao rolar) | alpha do fundo ≥ .12 escuro ou ≥ .75 claro; testar sobre o trecho mais claro e o mais escuro do fundo | **alto**: `backdrop-filter` repinta a cada frame do que está atrás; em cabeçalho fixo é aceitável; em cards grandes que rolam, medir |
| Clay | pastel + texto claro falha; ícones brancos sobre lilás claro < 3:1 | texto na cor escura da paleta; ícones com contorno | médio: sombras internas grandes custam no paint; não animar |
| Skeuo | geralmente bom (superfícies opacas) | manter rótulo em texto, não só ícone | baixo |
| Neu | **estrutural**: bordas não existem, o estado é só sombra; botão desabilitado e ativo se confundem; foco invisível | anel de foco explícito; rótulos; estado ativo com cor de acento além do "afundar"; nunca em formulários críticos | baixo a médio |

Regras comuns: `prefers-reduced-transparency: reduce` → tornar o glass opaco; `prefers-contrast: more` → bordas sólidas em todos; `forced-colors: active` → as sombras somem, então cada componente precisa de `border: 1px solid` para continuar visível. Medir contraste com o harness de QA ou o painel de acessibilidade do DevTools; registrar em `qa/`.

Desempenho: `backdrop-filter` só em elementos pequenos ou fixos; nunca em listas; `will-change: backdrop-filter` não ajuda e `will-change: transform` só no elemento que de fato anima (o CSS do Siteflux tem 4 ocorrências; não somar mais por hábito). Em celular, limitar o blur a 10–12 px.

## Combinação com as identidades locais

**Siteflux** (verde escuro `#042b20`, lima e ciano, Montserrat local): o glass funciona no cabeçalho e no menu overlay sobre a hero escura (alpha branco .08, borda .18, blur 12 px), porque a hero tem o morph SVG por trás. Clay e neu não combinam com a marca (é B2B, escura, técnica). Skeuo só como sugestão de material nas molduras de dispositivo já existentes. Não aplicar nada disso automaticamente: a landing 2.37 tem decisões pendentes do Walter e o README registra o que está aprovado.

**Vale do Aço Digital** (papel/areia/quase-preto, vermelho de acento, linguagem "exo" de títulos gigantes leves): superfícies **opacas** são a identidade (quadrados encaixados com bordas compartilhadas). Glass cabe apenas no menu em tela cheia sobre fotografia; neu contradiz a grade de bordas; clay contradiz a seriedade regional. Se um card precisar de "material", use papel: `box-shadow: 0 1px 0 rgb(0 0 0 / .06), 0 12px 24px -16px rgb(0 0 0 / .25)` sobre `--areia`.

## Verificação

1. Tirar capturas do componente sobre o trecho **mais claro** e o **mais escuro** do fundo que ele pode cobrir (glass) e medir contraste do texto; anexar em `qa/<etapa>/`.
2. Alternar `prefers-reduced-transparency`, `prefers-contrast: more` e `forced-colors` (emulação do DevTools) e conferir que o componente continua delimitado.
3. Medir custo: com o harness de CDP, rolar 2 telas com o glass fixo no topo; frames > 32 ms recorrentes indicam blur grande demais ou área grande demais.
4. Teclado: foco visível em todos os estilos; `:active` não substitui `:focus-visible`.
5. Registrar limitações: Safari/Firefox indisponíveis nesta máquina (o `-webkit-backdrop-filter` fica sem teste real).

## Limites e licença

Reel de terceiro com ilustrações e mockups de exemplo; não há código nem licença a herdar. Receitas autorais em CSS. Os valores de alpha, blur e sombra são pontos de partida, não medições do vídeo. Vidro com refração e distorção real está em `vidro-refrativo-liquid-glass/` (WebGL, com licença própria do repositório de referência).
