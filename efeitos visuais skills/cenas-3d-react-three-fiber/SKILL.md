---
name: cenas-3d-react-three-fiber
description: Integrar cenas 3D interativas em projetos React usando React Three Fiber, isolando modelos, materiais e movimento de exemplos do repositório sem migrar desnecessariamente a aplicação.
---

# Cenas 3D com React Three Fiber

Repositório: [pmndrs/react-three-fiber](https://github.com/pmndrs/react-three-fiber). Referência do [Reel de cindie.zhu](https://www.instagram.com/reels/DcxV37-CJOC/), primeiro recurso, aproximadamente 28–33 s. É um renderizador React para Three.js, não um pacote de efeitos prontos para qualquer HTML. Three.js Journey aparece no vídeo como recurso relacionado; não é o repositório solicitado.

## Selecionar a menor cena útil

Identifique o efeito concreto: objeto girando, material, parallax, partículas ou iluminação. Escolha um exemplo próximo e registre sua origem/commit. Separe o que pertence à cena do que é interface da demonstração. Não carregar um editor, galeria de demos ou motor de física para exibir um único objeto.

Verifique package.json e lockfile do projeto antes de instalar. Na documentação consultada em 20/09/2026, Fiber 8 corresponde a React 18 e Fiber 9 a React 19. Revalidar essa correspondência ao atualizar; não usar force/legacy-peer-deps como correção padrão. Licença MIT no repositório; conferir separadamente modelos, HDRs, fontes e imagens de cada exemplo.

Se o projeto é HTML/JS sem React, não migrá-lo automaticamente. Reconstituir a cena com Three.js existente ou avaliar uma ilha React isolada conforme o escopo. A escolha deve justificar o custo de runtime/build.

## Integração

Reserve dimensões do contêiner antes de montar Canvas e ofereça poster enquanto assets carregam. Em SSR, deixe APIs de browser na fronteira cliente. Mantenha título, CTA e conteúdo principal em HTML acima ou ao lado da cena.

Atualizações por frame usam refs e delta de tempo, sem setState a cada quadro. Reutilize geometria/material, reduza resolução de texturas e escolha pixel ratio após medir. Uma cena parada pode renderizar sob demanda; movimento contínuo precisa agendamento ativo, com pausa fora da viewport/aba oculta. Não prometer economia só por configurar demanda se um callback invalida todo frame.

No toque, preservar scroll vertical; rotação por arraste não pode capturar todos os gestos da página. Reduced motion usa pose fixa ou poster. A cena decorativa não recebe foco nem impede clicar no CTA. Descartar recursos criados manualmente e remover listeners ao desmontar, sem destruir recursos compartilhados ainda em uso.

## Aceite

Validar montagem/desmontagem repetida, context loss, asset ausente, CPU/GPU limitada, resize e 320/390/768/1440 px. Medir custo inicial separado do movimento estável. Conferir que fallback e CTA funcionam sem WebGL. Consultar [documentação oficial](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction) para a versão instalada, sem copiar setup antigo de um tutorial.
