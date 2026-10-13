---
name: ferramentas-agente-frontend
description: Configurar e usar as cinco ferramentas que tiram um agente de "construir no escuro" ao criar sites (shadcn/ui MCP, 21st MCP, skill frontend-design da Anthropic, Web Design Guidelines da Vercel, Chrome DevTools MCP), sabendo em que etapa cada uma entra, como ligar no Claude Code e no Claude Desktop e quais riscos de chave, telemetria e licença existem. Use quando pedirem "site genérico/feio", "componentes melhores", "revisar UI", "auditar acessibilidade", "abrir o site no navegador de verdade" ou setup de MCP para front-end.
---

# Ferramentas de agente para front-end

Fonte observada: [Reel DdukoWYP0kC](https://www.instagram.com/reel/DdukoWYP0kC/) de custodiorod, 50 s, em português, inspecionado em 28/09/2026 (quadros em `qa/reels-2026-09-28/DdukoWYP0kC-p01.jpg` a `-p05.jpg`). Argumento do vídeo: o site sai "feio, genérico" (exemplo: landing de pizzaria com hero laranja padrão) porque o agente constrói sem contexto; cinco ferramentas dão componentes melhores, direção visual e revisão no navegador real. "O ponto não é instalar tudo sem critério."

Repositórios conferidos pela API do GitHub em 28/09/2026:

| # | Ferramenta | Repositório | Licença | Etapa |
|---|---|---|---|---|
| 1 | shadcn/ui MCP | [Jpisnice/shadcn-ui-mcp-server](https://github.com/Jpisnice/shadcn-ui-mcp-server), 3 mil estrelas, push 16/05/2026 | MIT | Construção (componentes de base) |
| 2 | 21st MCP (ex-Magic MCP) | [21st-dev/magic-mcp](https://github.com/21st-dev/magic-mcp), 5,9 mil, push 09/09/2026; setup em 21st.dev/mcp | ISC (o proxy) | Construção (seções e animações prontas) |
| 3 | Frontend Design (skill) | [anthropics/claude-code](https://github.com/anthropics/claude-code) `plugins/frontend-design/skills/frontend-design/SKILL.md` | ver `LICENSE.txt` do plugin | Antes de construir (direção) |
| 4 | Web Design Guidelines (skill) | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) `skills/web-design-guidelines`, 31,6 mil, push 28/08/2026 | sem licença declarada no repositório | Revisão |
| 5 | Chrome DevTools MCP | [ChromeDevTools/chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp), 52,7 mil, push 27/09/2026 | Apache-2.0 | Revisão e depuração |

## O fluxo em três etapas

**Antes de construir: direção.** Ler a skill frontend-design (síntese em [references/frontend-design-principios.md](references/frontend-design-principios.md)) e escrever o plano de tokens (cores, tipografia, layout, princípios) antes de qualquer HTML. É o que impede o hero laranja genérico. Para comparar direções concorrentes, ver [references/arena-melhor-de-n.md](references/arena-melhor-de-n.md).

**Durante: componentes.** Buscar em catálogos em vez de reinventar botões, menus, formulários e seções.

- **shadcn/ui MCP** dá ao agente o código-fonte atual dos componentes, blocos (dashboards, formulários, calendários), demos e metadados do shadcn/ui v4 para React, Svelte 5, Vue e React Native. `npx @jpisnice/shadcn-ui-mcp-server`; com `--github-api-key ghp_...` sobe de 60 para 5000 requisições/hora; `--framework svelte|vue|react-native`; `--ui-library base` troca Radix por Base UI. Instalação de um clique no Claude Desktop pelo arquivo `.mcpb` dos Releases.
- **21st MCP** busca mais de 10 mil componentes React/Tailwind da comunidade (heros, seções, animações de scroll, fundos) e pode gerar e iterar UI por IA. Hoje o pacote `@21st-dev/magic` é só um proxy; o caminho oficial é `npx @21st-dev/cli@latest init --client claude` ou o servidor HTTP `https://21st.dev/api/mcp` com cabeçalho `x-api-key`. Chaves antigas do Magic foram invalidadas. As ferramentas `generate`/`iterate_generation` só aparecem com assinatura de IA ativa; sem ela, usar `search` + `get_component` e adaptar o código com o próprio agente.

Nos projetos deste repositório (HTML/CSS/JS sem build) esses catálogos servem de **referência de estrutura e comportamento**, não de dependência: o agente lê o componente e reescreve em vanilla, como fazem as skills desta biblioteca.

**Revisão: regras e navegador real.**

- **Web Design Guidelines** é uma skill de auditoria: baixa as regras em `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`, lê os arquivos indicados e devolve achados no formato `arquivo:linha - problema`. Mais de 100 regras (acessibilidade, foco, formulários, animação, tipografia, imagens, desempenho, navegação, toque, dark mode, i18n). A tradução aplicável a vanilla está em [references/checklist-web-interface-guidelines.md](references/checklist-web-interface-guidelines.md).
- **Chrome DevTools MCP** abre o site num Chrome real controlado por Puppeteer: navega, clica, tira capturas, lê console com stack traces mapeados, lista requisições de rede, grava trace de desempenho e extrai insights. "Então ele vai ver o que quebrou, o que não está funcionando, e vai conseguir consertar."

## Configuração

Claude Code (por projeto, arquivo `.mcp.json` na raiz; ou `claude mcp add <nome> -- <comando>`):

```json
{
  "mcpServers": {
    "shadcn-ui": {
      "command": "npx",
      "args": ["-y", "@jpisnice/shadcn-ui-mcp-server", "--github-api-key", "${GITHUB_TOKEN}"]
    },
    "21st": {
      "url": "https://21st.dev/api/mcp",
      "headers": { "x-api-key": "${TWENTY_FIRST_API_KEY}" }
    },
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest", "--no-usage-statistics", "--no-performance-crux"]
    }
  }
}
```

Skills (não são MCP): Web Design Guidelines com `npx skills add vercel-labs/agent-skills --skill web-design-guidelines`, ou copiando `skills/web-design-guidelines/` para `~/.claude/skills/` (global) ou `.claude/skills/` (projeto). Frontend Design pelo marketplace de plugins do Claude Code (`/plugin`) ou copiando a pasta `plugins/frontend-design/skills/frontend-design/`. Reiniciar o Claude Code depois de copiar.

Claude Desktop: Configurações → MCP → Adicionar servidor; para o shadcn, o `.mcpb` dos Releases instala com dois cliques e pede o token do GitHub opcionalmente.

Chaves ficam em variáveis de ambiente, nunca no arquivo versionado. Se o `.mcp.json` for commitado, usar a sintaxe `${VAR}`.

## Riscos e limites

- **Telemetria:** o Chrome DevTools MCP coleta estatísticas de uso por padrão (desligar com `--no-usage-statistics` ou `CHROME_DEVTOOLS_MCP_NO_USAGE_STATISTICS`) e pode enviar URLs para a API CrUX do Google ao analisar desempenho (`--no-performance-crux`). Ele expõe todo o conteúdo do navegador ao cliente MCP: não abrir sessões logadas em contas pessoais.
- **Chaves:** 21st exige chave de API e assinatura para gerar; shadcn funciona sem token, mas com limite baixo. Nunca colar chaves em prompts.
- **Licenças:** o código dos componentes do 21st é da comunidade (licença por componente); shadcn/ui é MIT; componentes de catálogos que dependem de GSAP seguem a licença do GSAP. Registrar a origem em `assets/CREDITS.md`, como os projetos daqui já fazem para fotos e logos.
- **Frameworks:** shadcn e 21st entregam React/Tailwind. Não instalar React num projeto vanilla só para usar um botão; reescrever.
- **Suporte:** o DevTools MCP suporta oficialmente Google Chrome e Chrome for Testing; o Edge desta máquina "pode funcionar".

## Relação com o que esta sessão já usa

- A extensão **Claude in Chrome** (ferramentas `mcp__claude-in-chrome__*`) cumpre o papel do Chrome DevTools MCP para navegação, capturas, console e rede na sessão interativa. Diferença: a extensão roda na conta do Walter (aba costuma estar oculta, o que trava vídeo e rAF — ver memória `qa-harness-edge-headless`), enquanto o MCP abre um Chrome dedicado e grava traces de desempenho.
- O **harness CDP próprio** (`qa/fluidez-responsividade/ferramentas/cdp-lib.js`, `vale-do-aco-digital/tools/cdp.js`, `qa/videos-instagram/cdp.js`) já faz o que importa para medir fluidez em Edge headless sem dependências. Manter; usar o DevTools MCP quando precisar de trace de desempenho interpretado ou de um Chrome real.
- Os checklists desta skill e de `boas-praticas/checklist-revisao-ui.md` substituem a chamada ao WebFetch da skill da Vercel quando não houver rede.
