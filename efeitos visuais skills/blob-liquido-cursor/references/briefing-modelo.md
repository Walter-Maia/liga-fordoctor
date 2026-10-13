# Briefing-modelo: pedir o blob líquido a um agente

O Reel de tegadesigns1 mostra o efeito sendo pedido a um agente de IA, não programado à mão: a autora sobe uma foto sua e um vídeo de referência, cola um prompt, escolhe o modelo e recebe um artefato (`liquid-code-reveal-hero`). Abaixo está o equivalente em português, com o que o vídeo mostra e o que ele omite.

## O que enviar junto com o pedido

1. **Imagem do próprio projeto** (foto, produto, logo). No vídeo é a foto da autora recortada; sem isso o agente inventa um placeholder.
2. **Referência do movimento** (vídeo curto ou 3–4 quadros). O vídeo de referência é o que comunica "mola", "gota" e "gotículas"; palavras sozinhas rendem um círculo duro.
3. **Texto real da hero** (título, apoio, CTA). O agente não deve inventar promessas.
4. **Paleta e fonte** oficiais, se existirem.

## Prompt-padrão (PT-BR)

> Anexei uma imagem minha/do produto e um vídeo de referência do tipo de animação que quero na seção hero do meu site. Eu não sou designer, sou desenvolvedor; quero um portfólio simples com uma hero que seja divertida e muito animada.
>
> Reconstrua a hero com o texto: "[título]" / "[apoio]" / botão "[CTA]". A palavra final do título alterna entre "[a]", "[b]" e "[c]" com um marca-texto atrás.
>
> Faça um blob (forma orgânica, cor [cor escura da marca]) seguir o cursor com física de mola: ele atrasa, ultrapassa um pouco e continua se mexendo nas bordas quando paro. Quando movo rápido, ele estica em gota e solta gotículas que voltam e se fundem ao corpo principal. Dentro do blob aparece a "versão código" da mesma hero (a marcação do que está embaixo), como uma janela para o modo escuro.
>
> Regras: HTML/CSS/JS sem dependências; no toque (sem hover) o blob fica parado perto do título e um botão "Ver o código" mostra a camada inteira; com `prefers-reduced-motion` não há mola nem gotículas; pausar a animação com a aba oculta ou a seção fora da tela; a troca de palavra não pode ser anunciada por leitor de tela a cada ciclo; foco visível no botão. Entregue um único arquivo HTML e uma tabela dos parâmetros (rigidez, amortecimento, raio, esticamento).

No vídeo, o modelo escolhido foi "Opus 5.5 medium ou Fable 5". A escolha do modelo é da pessoa; o prompt funciona em qualquer um que produza HTML executável.

## O que o vídeo não mostra (e você precisa verificar)

- **Quadros em sequência**: a mola só se prova com 6–10 quadros seguidos após um movimento rápido (esticou? soltou gota? a gota voltou e sumiu?). Use o roteiro de `../SKILL.md` § Verificação.
- **Toque**: o vídeo é 100% cursor. Testar em emulação de toque e em um celular real quando houver.
- **Leitor de tela**: conferir que a frase lida é uma só e estável.
- **Desempenho**: `clip-path: path()` recalculado por quadro é barato, mas o filtro goo sobre uma área grande não é. Medir em CPU 4× (ver memória do harness: setTimeout atrasa em CPU 4×, então medir ritmo de rAF, não de timers).
- **Texto por baixo**: o blob não pode cobrir o CTA de forma que ele fique inacessível; a camada de código tem `pointer-events: none` fora do modo "mostra-codigo".
- **Licença e créditos**: o resultado do agente é código novo; não copie o artefato da autora do Reel.

## Variações que cabem no mesmo briefing

- Trocar "versão código" por "modo escuro", "bastidores" (wireframe da seção) ou "antes/depois" de uma reforma.
- Blob como lupa: dentro dele a foto aparece em outra cor/tratamento.
- Sem gotículas: só a mola e o alongamento (mais barato e menos chamativo).
