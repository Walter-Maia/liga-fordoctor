# Referência: Siteflux (siteflux.com.br)

Projeto em `landing page siteflux/` (`index.html`, `assets/css/siteflux.css`, `assets/js/siteflux.js`, versão 2.35). Use como **modelo de técnica**, não de identidade: as cores e a marca são da Siteflux.

## Identidade usada nos efeitos

- Tokens: `--sf-dark #042b20` (fundo da intro e tinta), `--sf-lime #ccd961`, `--sf-blue #3cbcd5`, branco.
- Logo como `<symbol id="sf-logo" viewBox="0 0 435.28 95.54">` com três grupos: `.lg-site` (globo + "site" + slogan), `.lg-flux`, `.lg-accent` (o ponto). As cores vêm de variáveis (`--lg-site/--lg-flux/--lg-accent`), então a mesma marca serve em fundo claro, escuro ou azul só trocando variáveis no contêiner.
- Variante para fundo escuro: site branco, flux lima, ponto azul. Variante "ink": tudo `--sf-dark`.

## Intro vetorial (~2,4 s + saída, 1x por sessão)

**Roteiro** (tudo disparado por `.intro.is-playing`):

| Peça | Início | Duração | O que faz |
|---|---|---|---|
| contorno do globo (`.sfi-stroke`, `pathLength=1`) | 0 | 0,95 s | desenha em branco (`cubic-bezier(.45,0,.2,1)`), some em 1,55 s |
| faixas lima/azul (`.sfi-band--1/2`) | 0,30 / 0,55 s | 1,5 s | deslizam −40 → 150 px dentro de um `clipPath` elíptico do globo |
| setores (`.sfi-spin`, 3 fatias lima/azul/branco) | 0,35 s | 1,5 s | giram −40° → 500° dentro de uma `mask` com o desenho do globo |
| preenchimento final (`.sfi-settle`) | 1,5 s | 0,45 s | retângulo branco sob a máscara: o globo "assenta" no oficial |
| letras s-i-t-e-f-l-u-x (`.sfi-l`, `--n` 0–7) | 0,9 s + n×70 ms | 0,55 s | sobem 9 px com fade; "site" branco, "flux" lima |
| ponto (`.sfi-accent`) | 1,65 s | 0,5 s | `scale(0→1)` com mola `cubic-bezier(.34,1.56,.64,1)` |
| slogan | 1,85 s | 0,45 s | fade |
| saída | 2,4 s | 0,45 s | overlay some; logo faz zoom para 1,04 |

**Montagem (JS):** lê os filhos de `#sf-logo`, valida a quantidade esperada (`throw` se faltar peça → `finish(false)`), serializa cada parte com `XMLSerializer`, agrupa as letras (o "i" = haste + pingo) e injeta um SVG com `viewBox="-8 -8 451.28 111.54"` (folga para a rotação não cortar). Timers: `finish(true)` em 2,4 s, `finish(false)` em 3,8 s. Escape/Tab e aba oculta liberam na hora.

**Integração com a página:** `html.intro-active, html.intro-leaving { --rise-start: 2.4s; }` — a hero e o cabeçalho usam esse atraso nas próprias animações, então começam exatamente quando a intro dissolve. Sem intro, `--rise-start` cai para 0,1 s.

**Por que funciona:** os três atos usam a geometria da marca (o globo é o palco), as cores entram como luz dentro do símbolo e a última pose é idêntica à logo oficial.

## Entrada do cabeçalho (logo em partes)

Animações CSS com `backwards`, atrasadas por `--rise-start`: botão (+0,05 s) e menu (+0,3 s) descem 16 px; a logo desce (+0,18 s) e, dentro dela, `.lg-site` vem da esquerda (+0,38 s), `.lg-flux` da direita (+0,46 s) e o ponto estoura (+0,62 s). A logo inline é uma **cópia** dos paths (não `<use>`), porque `<use>` não deixa animar as partes separadamente. A cada abrir/fechar do menu a logo dá um pulso curto (`scale(1.08)` em 0,5 s, reiniciado com `void el.offsetWidth`).

## Outros efeitos reutilizáveis

- **Títulos linha a linha:** cada linha em `.ln > span` com `overflow` na linha; estado pendente `translateY(112%)`, entrada `transform 1.1s` com 90 ms entre linhas (`--n`). Sem JS e com movimento reduzido, o texto fica no lugar.
- **Reveal genérico:** `.reveal-pending { opacity:0; transform:translateY(24px) }` → `.reveal-run` com `--i × 90 ms`, ligado por IntersectionObserver.
- **Peças invadindo a seção seguinte:** com JS, a seção de baixo sobe por margem negativa (`margin-top: calc(-1 * clamp(110px,12vw,190px))` + o mesmo valor somado ao `padding-top`) e a de cima fica com `z-index` maior: o leque de peças e os traços cruzam a divisa sem buraco entre as seções. Traços translúcidos mudam de tom sozinhos sobre o novo fundo.
- **Menu em cortina:** `html.menu-open` trava a rolagem e esconde logo/botão do topo; ícone de 3 barras vira X por `rotate(±45deg)`.
- **Portfólio em "pastas":** capa = tela inteira do projeto; no hover (ponteiro fino) desliza até um detalhe escolhido; "Explorar projeto" abre a pasta. A paleta de cada pasta vem de variáveis `--p-*` do próprio cliente.

## Lições

- Cobertura `::before` com failsafe de 4,6 s garantiu que nenhum visitante ficasse preso atrás da intro quando o JS falhou.
- Movimento reduzido desliga tudo com `animation:none !important; transition:none !important` e mostra os estados finais (`.reveal-pending` opaco, traços com `dashoffset: 0`).
