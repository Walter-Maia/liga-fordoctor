# Quatro repositórios do Reel

Fonte: [vídeo de cindie.zhu](https://www.instagram.com/reels/DcxV37-CJOC/), duração aproximada de 61,67 s. Inspecionado em 20/09/2026. Os nomes foram lidos nos quadros numerados; os links foram cruzados com as páginas públicas dos projetos, identidade visual e arquivos do GitHub. Não foi necessário comentar ou enviar mensagem à autora.

| Trecho aproximado | Repositório GitHub | Skill local |
|---|---|---|
| 28–33 s | [pmndrs/react-three-fiber](https://github.com/pmndrs/react-three-fiber) | [Cenas 3D em React](../cenas-3d-react-three-fiber/SKILL.md) |
| 33–39 s | [dashersw/liquid-glass-js](https://github.com/dashersw/liquid-glass-js) | [Vidro com refração](../vidro-refrativo-liquid-glass/SKILL.md) |
| 39–46 s | [ruucm/shadergradient](https://github.com/ruucm/shadergradient) | [Fundos animados](../fundos-shadergradient/SKILL.md) |
| 46–51 s | [paper-design/liquid-logo](https://github.com/paper-design/liquid-logo) | [Logo de metal líquido](../logo-metal-liquido/SKILL.md) |

## O que foi conferido

- **React Three Fiber:** renderizador React/Three.js; licença MIT; compatibilidade de versão entre React e Fiber explicitada no README. Não é apenas um asset para colar em HTML.
- **Liquid Glass JS:** MIT; classes JavaScript, WebGL e amostragem com html2canvas. A branch principal consultada tem commit de 12/06/2025. Verificar desempenho e acessibilidade na adaptação.
- **ShaderGradient:** README e manifesto de `@shadergradient/react` declaram MIT. Renderizador e interface de ajustes são separados na descrição v2. Metadado de licença na API GitHub ausente não substitui leitura dos arquivos.
- **Liquid Logo:** aplicativo Paper com licença PolyForm Shield 1.0.0. Não deve ser rotulado como MIT nem confundido com outros repositórios chamados liquid-logo. A skill orienta conferir as condições antes de reutilizar código.

Essas observações não certificam todos os assets/dependências ou manutenção futura. Os commits consultados estão em [repos-DcxV37-CJOC.json](repos-DcxV37-CJOC.json), permitindo reencontrar a versão analisada. `pushed_at` do repositório e data do commit da branch podem diferir; o registro usa o commit da branch consultada.

## Aplicação no Siteflux

O projeto atual usa HTML/CSS/JS sem build. Não instalar React/Next ou copiar uma aplicação inteira por padrão. Escolher primeiro o efeito e o menor conjunto de código compatível com o projeto; usar os repositórios como referência quando a dependência não compensar. Cada skill inclui controles de qualidade, comportamento no mobile e fallback.

Foram criadas quatro skills e este índice; nenhuma biblioteca foi instalada e nenhum efeito foi aplicado ao site nesta tarefa. Os testes realizados validam a estrutura das skills e os links locais, não uma integração executável desses repositórios.
