# Efeito de intro — como usar esta pasta

Esta pasta ensina qualquer IA (Claude, Codex, outro agente) a criar a animação de entrada de um site a partir do logo, no padrão das intros do **Siteflux** e do **Vale do Aço Digital**. Você só precisa **descrever em palavras** o que quer ver.

## Passo a passo para quem vai pedir

1. Tenha o **logo em vetor** (SVG, ou o arquivo AI/PDF). Só com PNG a IA não consegue animar as partes do logo.
2. Cole para a IA:

> Leia `efeitos visuais skills/efeito-de-intro/SKILL.md` e siga o fluxo dela. Quero uma intro para [projeto/arquivo]. O logo oficial está em [caminho]. Descrição do que eu imagino: [cores, o que aparece primeiro, o que se move, como termina]. Estilo mais parecido com: [Siteflux / Vale do Aço Digital / nenhum]. Mostre o roteiro de tempos antes de implementar e verifique com quadros congelados no final.

3. A IA devolve primeiro um **roteiro** (tabela com o que acontece em cada segundo). Ajuste o que quiser ("o ponto pode entrar antes", "quero mais lento") e só então ela implementa.

Exemplos de descrição: "o contorno do logo se desenha em dourado, depois as cores giram dentro e o nome sobe letra por letra"; "começa bem de perto em linhas laranja e vai afastando até o logo completo, com um brilho no final".

## Mapa da pasta

| Arquivo | Para quê |
|---|---|
| `SKILL.md` | Porta de entrada da IA: fluxo obrigatório, padrões e proibições |
| `references/metodo-animacao-vetorial.md` | Como preparar o SVG e o catálogo de técnicas T1–T12 com código |
| `references/intro-siteflux.md` | Intro do Siteflux dissecada: roteiro segundo a segundo e onde está o código |
| `references/intro-vale-do-aco-digital.md` | Intro do Vale do Aço Digital dissecada |
| `references/infraestrutura-e-seguranca.md` | O que impede a intro de quebrar o site (failsafe, pular, movimento reduzido, hero) |
| `references/briefing-modelo.md` | Modelo de briefing, exemplos de pedido → técnica, frase pronta |
| `references/verificacao.md` | Como provar que ficou certo |
| `template/intro-template.html` | Intro completa e funcional para copiar e adaptar (abra no navegador) |
| `scripts/capturar-quadros.js` | Fotografa a intro congelada em instantes escolhidos (Edge headless) |
| `referencias-visuais/*.jpg` | Quadros reais das duas intros, na ordem do tempo |
