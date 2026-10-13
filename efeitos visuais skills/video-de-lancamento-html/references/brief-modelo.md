# Brief-modelo: vídeo de lançamento

Copie, preencha os colchetes e envie ao agente junto com o caminho da skill `video-de-lancamento-html`. Campos sem resposta seguem o padrão indicado.

```
Projeto: [Siteflux | Vale do Aço Digital | outro]
Fonte: [pasta do projeto, ex.: C:\Users\Walter\orca\siteflux-engage] e/ou [URL pública, ex.: https://siteflux.com.br]
Foco: [tudo | uma seção/recurso, ex.: "galeria de projetos" | "nova versão 2.37"]
Público do vídeo: [ex.: donos de pequenos negócios do Vale do Aço]
Formato: [vertical 1080x1920 | feed 1080x1350 | horizontal 1920x1080] — padrão: vertical + feed
Duração: [15–25 s] — padrão: 20 s
Tom: [default | polished | yc-parody | chaotic | deadpan | cinematic | app-store | descrição livre] — padrão: polished
Trilha: [arquivo .mp3/.wav com licença | "sem música" | "sugerir"] — padrão: sem música (adiciono no Instagram)
Legendas animadas: [sim | não] — padrão: sim, em pt-BR
Narração: [não | sim, texto:] — padrão: não
O que NÃO pode aparecer: [ex.: telefone, preços, nomes de clientes]
Frase de compartilhamento: [deixar o agente propor | texto próprio]
Ferramenta: [pipeline local qa/videos-instagram | HyperFrames | brag] — padrão: pipeline local se não houver Node 22 + FFmpeg
Entrega em: [pasta] — padrão: videos para o instagram/<nome>/ com evidências em qa/<nome>/
```

## Exemplo preenchido (Siteflux)

```
Projeto: Siteflux
Fonte: C:\Users\Walter\orca\siteflux-engage e https://siteflux.com.br
Foco: intro do logo + hero (símbolo virando site) + vitrine de projetos
Público: empresas locais que precisam de site com manutenção mensal
Formato: vertical + feed
Duração: 20 s
Tom: polished
Trilha: sem música
Legendas: sim
Narração: não
Não aparecer: telefone, preço dos planos
Frase: propor
Ferramenta: pipeline local
Entrega: videos para o instagram/04-lancamento-2-37/
```

## O que o agente deve devolver

1. `brag-plan.md` (ou equivalente): ângulo, hook, 2–3 destaques, punchline, storyboard cena a cena com durações que somam o alvo.
2. Página-vídeo isolada com `exportFrame(t)` (não editar o site).
3. MP4 verificado por `ffprobe`, capa como frame 0, `share-copy.txt`.
4. Stills de cada cena e de meio de transição na pasta de QA.
5. Relatório: o que foi reutilizado do site real, o que foi reconstruído, o que foi verificado e limitações (sem Safari/Firefox/celular físico nesta máquina).
