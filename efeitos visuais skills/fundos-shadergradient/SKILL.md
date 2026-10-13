---
name: fundos-shadergradient
description: Criar fundos e formas com gradientes orgânicos animados usando ShaderGradient, escolhendo preset, paleta, velocidade e qualidade conforme a identidade e a stack do projeto.
---

# Fundos orgânicos com ShaderGradient

Repositório: [ruucm/shadergradient](https://github.com/ruucm/shadergradient). Terceiro recurso do [Reel](https://www.instagram.com/reels/DcxV37-CJOC/), aproximadamente 39–46 s. A referência mostra massas de cor em movimento e configuração de forma/cor. Não confundir com gradiente CSS deslocado: o renderizador usa uma cena 3D.

## Pacote e compatibilidade

Na revisão de 20/09/2026, o pacote de renderização é `@shadergradient/react`; `ShaderGradient` é usado dentro de `ShaderGradientCanvas`. O README v2 separa o renderizador da interface de ajustes. Não instalar a interface do editor se a landing só precisa de um preset fixo.

Inspecionar peer dependencies e exemplos da versão instalada. React, React DOM, Fiber e Three precisam de versões compatíveis; não misturar código legado v1 e v2. O README e o package.json consultados declaram MIT; conferir o pacote e seus avisos ao distribuir. Em HTML estático, avaliar uma implementação própria mais leve ou uma ilha React, sem transformar o site inteiro em React só por causa do fundo.

## Direção visual

Parta das cores reais da marca, com uma cor dominante, uma de apoio e contraste suficiente para o conteúdo. Ajuste primeiro forma/câmera, depois escala do padrão, movimento e cor; alterar tudo de uma vez dificulta reconhecer a causa do resultado.

Guarde o preset em configuração local versionada, com nomes de parâmetros conferidos no pacote. Não depender do editor remoto em runtime. A paleta pode variar com tema claro/escuro, mas não com valores aleatórios a cada carregamento. A forma deve preservar espaços tranquilos atrás do título.

Posicione o canvas em camada decorativa dentro de um contêiner dimensionado, com pointer-events none quando não interativo. Texto/CTA permanecem HTML. Um scrim estável pode proteger o contraste enquanto as cores passam; verificar o trecho mais claro e o mais escuro da animação.

## Qualidade adaptativa

Comece com movimento lento e pixel ratio moderado, medindo no destino. Reduza resolução, pós-processamento e complexidade antes de aumentar a carga. Pause fora da tela/aba oculta e evite múltiplos canvases para repetir o mesmo fundo em muitos cards.

Reduced motion mostra preset congelado ou imagem estática. Sem WebGL, renderize fallback CSS/poster já presente desde o primeiro paint. Se a biblioteca não expuser uma pausa apropriada na versão escolhida, usar poster/desmontagem controlada; não continuar consumindo GPU atrás de opacity zero.

## Aceite

Verificar import/build de produção, tamanho do bundle, primeiro paint, resize e ciclo de montagem. Testar 320/390/768/1440 px, contraste em vários momentos, interrupção por aba oculta e contexto perdido. Medir frames e uso de renderização, sem atribuir à biblioteca uma garantia universal de fluidez.
