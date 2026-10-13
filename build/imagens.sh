#!/usr/bin/env bash
# Gera as imagens responsivas da LP a partir dos originais baixados da produção (src/originais/).
# Requer ffmpeg com libwebp e libaom-av1. Rode da raiz do projeto: bash build/imagens.sh
set -euo pipefail
O=src/originais
D=src/assets/img
mkdir -p "$D"

# Foto das duas estudantes com o kit (hero): o original tem recorte com transparência, mantida
# para os anéis do hero aparecerem em volta. AVIF com alfa = dois fluxos (cor + alfa).
for w in 480 720 991; do
  ffmpeg -loglevel error -y -i "$O/liga-tela-2-1.webp" -vf "scale=${w}:-2,format=yuva420p" -c:v libwebp -quality 76 "$D/liga-kit-alfa-${w}.webp"
  ffmpeg -loglevel error -y -i "$O/liga-tela-2-1.webp" -filter_complex "[0]scale=${w}:-2,format=yuva444p,split[c][a];[a]alphaextract[al]" \
    -map "[c]" -map "[al]" -c:v libaom-av1 -still-picture 1 -crf 32 -cpu-used 4 "$D/liga-kit-alfa-${w}.avif"
done

# Fundo da seção "O que é a Liga": composições oficiais da estudante (gradiente azul + círculos),
# a de desktop (bg-liga-2.webp) e a de celular (lp-fordoctor-liga-mobile2.webp), ambas usadas hoje no site.
for w in 1280 1920; do
  ffmpeg -loglevel error -y -i "$O/bg-liga-2.webp" -vf "scale=${w}:-2,format=yuv420p" -c:v libwebp -quality 78 "$D/liga-fundo-${w}.webp"
  ffmpeg -loglevel error -y -i "$O/bg-liga-2.webp" -vf "scale=${w}:-2,format=yuv420p" -c:v libaom-av1 -still-picture 1 -crf 27 -cpu-used 4 "$D/liga-fundo-${w}.avif"
done
for w in 480 668; do
  ffmpeg -loglevel error -y -i "$O/lp-fordoctor-liga-mobile2.webp" -vf "scale=${w}:-2,format=yuv420p" -c:v libwebp -quality 72 "$D/liga-fundo-mobile-${w}.webp"
  ffmpeg -loglevel error -y -i "$O/lp-fordoctor-liga-mobile2.webp" -vf "scale=${w}:-2,format=yuv420p" -c:v libaom-av1 -still-picture 1 -crf 28 -cpu-used 4 "$D/liga-fundo-mobile-${w}.avif"
done
ls -la "$D"
