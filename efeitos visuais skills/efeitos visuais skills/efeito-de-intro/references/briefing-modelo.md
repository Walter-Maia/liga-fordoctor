# Briefing: da descrição da pessoa ao roteiro

A pessoa só precisa **descrever em palavras** a entrada que quer. A IA transforma isso em um briefing preenchido e, dele, no roteiro de tempos. Preencha o que der a partir do pedido e dos arquivos do projeto; pergunte apenas o que faltar e não tiver padrão.

## Modelo (a IA preenche)

```
PROJETO / ARQUIVO ONDE ENTRA: 
LOGO OFICIAL (caminho do SVG ou <symbol>): 
PEÇAS DO LOGO: símbolo = … | nome = … | acento = … | slogan = …
REFERÊNCIA DE ESTILO: Siteflux | Vale do Aço Digital | mistura | outra (descrever)
O QUE A PESSOA DESCREVEU (literal): "…"
TÉCNICAS ESCOLHIDAS (catálogo T1–T12 de metodo-animacao-vetorial.md): 
DURAÇÃO DA COREOGRAFIA: (padrão 2,4 s simples | 3,5 s com câmera)
FUNDO: (padrão: cor mais escura da marca)
CORES DA ANIMAÇÃO: (da paleta da marca)
FREQUÊNCIA: toda visita | uma vez por sessão (padrão)
QUADRO FINAL: arte oficial em SVG | troca para PNG oficial
LIGAÇÃO COM A HERO: o que entra depois e quando
```

## Roteiro (tabela obrigatória antes do código)

| Início | Duração | Camada | Técnica | Easing / cor |
|---|---|---|---|---|
| 0,00 s | … | … | T… | … |

Regras do roteiro: estrutura → energia → assentamento → nome → acento → 0,3–0,4 s parado → saída. Eventos que se sobrepõem em ~30–50 % dão fluidez; eventos colados um após o outro parecem lentos.

---

## Exemplos de pedido → decisão

**1. "Quero uma intro igual à do Siteflux, mas com o logo da minha clínica (um coração com o nome embaixo)."**
- Coração = área fechada → T1 contorno + T4 com as 2–3 cores da clínica girando dentro + assentar na cor oficial.
- Nome embaixo → T7 (stagger 0,05 s se o nome for longo).
- Sem acento → termina no nome; se houver slogan, fade aos ~1,85 s.
- 2,4 s, toda visita ou sessão conforme o site.

**2. "Quero algo cinematográfico, tipo o Vale: começa com linhas douradas bem de perto e vai afastando até aparecer o logo da construtora."**
- Recriar o símbolo em primitivas; T2 cometas dourados nas 2 arestas principais; T1 nas outras; T3 com 8 ecos; T6 câmera de scale 4,5 → 1; T9 + T11 para chegar ao oficial; T8 se houver ponto.
- 3,5 s + 0,4 s parado.

**3. "Só quero que o nome se escreva e um brilho passe por cima, bem minimalista."**
- T7 nas letras (0,6–1,4 s), T2 claro (sweep) percorrendo o contorno das letras ou uma linha sob o nome (1,5–2,0 s), T12. Total ~2,2 s. Sem máscara nem câmera.

**4. "A logo é só texto (wordmark), quero que ela seja desenhada à mão."**
- T1 em cada letra com `fill:none; stroke` e stagger de 0,12 s; depois `fill-opacity` 0 → 1 (0,3 s) com o traço sumindo. Traço ≥ 1 px de tela.

**5. "Tenho só um PNG do logo."**
- Avisar que animação vetorial precisa dos vetores. Opções: pedir o SVG/AI/PDF; vetorizar só formas geométricas simples (declarando que é reconstrução); ou fazer a animação com formas abstratas da paleta e terminar com T11 no PNG.

## Frase pronta para a pessoa usar com qualquer IA

> Leia `efeitos visuais skills/efeito-de-intro/SKILL.md` e siga o fluxo dela. Quero uma intro para [projeto/arquivo]. O logo oficial está em [caminho]. Descrição do que eu imagino: [descrever em palavras — cores, o que aparece primeiro, o que se move, como termina]. Estilo mais parecido com: [Siteflux / Vale do Aço Digital / nenhum]. Mostre o roteiro de tempos antes de implementar e verifique com quadros congelados no final.
