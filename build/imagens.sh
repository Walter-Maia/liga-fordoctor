#!/usr/bin/env bash
# Gera as imagens responsivas da LP a partir dos originais baixados da produção (src/originais/).
# Requer ffmpeg com libwebp e libaom-av1. Rode da raiz do projeto: bash build/imagens.sh
set -euo pipefail
O=src/originais
D=src/assets/img
mkdir -p "$D"

# Foto das duas médicas com o kit (seção "O que é a Liga" desde a v0.5): o original tem recorte com transparência,
# mantida para as duas saírem do círculo. AVIF com alfa = dois fluxos (cor + alfa).
for w in 480 720 991; do
  ffmpeg -loglevel error -y -i "$O/liga-tela-2-1.webp" -vf "scale=${w}:-2,format=yuva420p" -c:v libwebp -quality 76 "$D/liga-kit-alfa-${w}.webp"
  ffmpeg -loglevel error -y -i "$O/liga-tela-2-1.webp" -filter_complex "[0]scale=${w}:-2,format=yuva444p,split[c][a];[a]alphaextract[al]" \
    -map "[c]" -map "[al]" -c:v libaom-av1 -still-picture 1 -crf 32 -cpu-used 4 "$D/liga-kit-alfa-${w}.avif"
done

# v0.5: a seção "O que é a Liga" deixou de usar a composição da estudante como fundo (menos fotos, mais símbolo).
# Os originais continuam em src/originais/ (bg-liga-2.webp e lp-fordoctor-liga-mobile2.webp); para voltar,
# recupere este bloco do histórico do git (commit 9d62d9e).
ls -la "$D"
