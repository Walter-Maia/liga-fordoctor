# /arena: melhor de N por torneio de sub-agentes

Fonte observada: [Reel DdysDw5t4Km](https://www.instagram.com/reel/DdysDw5t4Km/) de opusjake, 34 s, inspecionado em 28/09/2026 (quadros em `qa/reels-2026-09-28/DdysDw5t4Km-p01.jpg` a `-p03.jpg`): "if Claude keeps giving you bad answers, make 100 versions of it fight"; terminal com `/arena Write a cold email to land my first client`, 100 agentes, 7 rodadas, 595 chamadas; cartões de raciocínio (First principles, Inversion, Working backwards), fluxos (Draft → Critique → Rewrite; Three drafts → Pick one; Research → Synthesise) e estratégias (Simplest thing that works, Explicit trade-offs, Edge cases first); arena em pixel art com "AGENTS LEFT 13"; vencedor `a081`, "Working backwards · Three drafts, pick one · Explicit trade-offs".

Repositório: [Jakeschincariol/arena-skill](https://github.com/Jakeschincariol/arena-skill), MIT, 5 estrelas, push 27/09/2026. Exige Claude Code (ferramenta Agent) e Python 3.8+; nada para instalar via pip. **Nunca toca nos arquivos do projeto:** tudo é escrito em `.arena/`; usar o vencedor é decisão de quem pediu.

## Como funciona (conforme o README)

1. **Spawn.** N sub-agentes, um por chamada, todos com o mesmo texto da tarefa (um teste garante isso) e um cartão de estratégia único: 15 modos de raciocínio × 12 fluxos × 12 estratégias = 2.160 cartões, sem repetição.
2. **Ataque.** Soluções pareadas (evitando dois agentes com o mesmo modo de raciocínio); cada lado ataca a solução do outro por meio do seu cartão: o que está errado, que requisito faltou, qual entrada quebra. Até 7 ataques, rotulados FATAL, MAJOR ou MINOR.
3. **Defesa.** Cada lado responde a cada ataque, concedendo ou rebatendo com evidência, e reescreve a solução corrigindo o que concedeu.
4. **Juiz.** Um sub-agente separado lê as duas soluções revisadas, confere os ataques e pontua pela rubrica: correção 30, completude 25, robustez aos ataques 20, especificidade 15, clareza 10. O juiz não vê os cartões. Uma solução com falha fatal verificada não vence uma sem.
5. **Repetição** até sobrar uma: 100 → 50 → 25 → 13 → 7 → 4 → 2 → 1 (byes em rodadas ímpares, nunca duas vezes para o mesmo agente enquanto outro espera).
6. **Resultado:** a solução sobrevivente, os ataques que venceu, seu cartão e o número de rodadas. Se partiu de uma resposta rejeitada, um último juiz compara às cegas e informa a pontuação mesmo quando a antiga vence.

| Flag | Efeito |
|---|---|
| `--agents N` | N competidores (padrão 100) |
| `--quick` | 16 competidores, "o ajuste do dia a dia" |
| `--seed S` | Mesmos cartões e mesmo chaveamento |
| `--wave W` | Sub-agentes por onda (padrão 10; só subir se o limite do Claude Code foi aumentado) |

Custo: com 100 agentes são 595 chamadas de sub-agente em 70 ondas; com `--quick`, uma fração disso. Cada chamada consome contexto e tokens; um `/arena` completo pode custar mais que o trabalho inteiro que o motivou.

## Instalação

```bash
git clone https://github.com/Jakeschincariol/arena-skill.git
cp -r arena-skill/skills/arena ~/.claude/skills/        # global, aparece como /arena
# ou, no projeto: cp -r arena-skill/skills/arena .claude/skills/
```

Como plugin (`/plugin marketplace add Jakeschincariol/arena-skill` + `/plugin install arena-skill@arena-skill`) o comando vira `/arena-skill:arena`.

## Quando faz sentido em design e quando não

Faz sentido para **decisões de texto curto e direção**, em que a rubrica premia especificidade e o custo de errar é alto: headline do hero, proposta de valor em uma frase, nomes de planos, microcopy de CTA e erro, 16 direções de tokens (paleta + tipo + layout) para um briefing. Use `--quick` e peça que a tarefa inclua o briefing inteiro e as restrições (identidade, público, palavras proibidas), senão o juiz premia o mais bonito no vácuo.

Não faz sentido para código de animação ou layout: o juiz lê texto, não abre o navegador, e "robustez aos ataques" não mede fluidez, acessibilidade ou fidelidade ao briefing visual. Para esses casos, use as skills desta biblioteca, o checklist de revisão e o harness `qa/`.

Regra prática desta biblioteca: antes de rodar um torneio, escrever o plano de tokens da skill frontend-design; a arena compara execuções de um plano, não substitui o plano.
