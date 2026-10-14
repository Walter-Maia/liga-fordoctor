// Atualiza, em src/landing.html, o sprite da marca entre <!-- sprite-marca:inicio --> e <!-- sprite-marca:fim -->,
// com os paths do logo oficial (src/originais/logo_fordoctor.svg), sem redesenho:
//   #simbolo     o símbolo (último path cls-1, começa em "m92.66,23.55"); fica em (0,0) no logo, 93,36 × 93,15
//   #marca-nome  as letras "ForDoctor" (cls-2) e "Contabilidade Médica" (cls-1), no viewBox do logo inteiro
// As cores vêm de variáveis do elemento <use> (--marca-letras, --marca-sub; o símbolo herda fill/stroke),
// então o mesmo desenho serve no cabeçalho claro, no escuro, na constelação do hero e nas marcas-d'água.
// Uso: node build/gera-sprite.mjs
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const svg = await fs.readFile(path.join(raiz, 'src', 'originais', 'logo_fordoctor.svg'), 'utf8');
const paths = [...svg.matchAll(/<path class="(cls-\d)" d="([^"]+)"/g)].map((m) => ({ classe: m[1], d: m[2] }));
const simbolo = paths.find((p) => p.d.startsWith('m92.66,23.55'));
const letras = paths.filter((p) => p.classe === 'cls-2');
// o arquivo oficial repete o subtítulo; fica só a primeira cópia (19 paths), como no logo publicado
const sub = paths.filter((p) => p.classe === 'cls-1' && p !== simbolo).slice(0, 19);
if (!simbolo || letras.length !== 9 || sub.length !== 19) throw new Error('Estrutura do logo oficial diferente da esperada');

const sprite = [
  '<!-- sprite-marca:inicio (gerado por build/gera-sprite.mjs) -->',
  '  <symbol id="simbolo" viewBox="0 0 93.36 93.15"><path pathLength="1" d="' + simbolo.d + '"/></symbol>',
  '  <symbol id="marca-nome" viewBox="0 0 341.01 93.48">' +
    '<g style="fill:var(--marca-letras,#182a3f)">' + letras.map((p) => '<path d="' + p.d + '"/>').join('') + '</g>' +
    '<g style="fill:var(--marca-sub,#b28b46)">' + sub.map((p) => '<path d="' + p.d + '"/>').join('') + '</g>' +
  '</symbol>',
  '  <!-- sprite-marca:fim -->'
].join('\n');

const arquivo = path.join(raiz, 'src', 'landing.html');
const html = await fs.readFile(arquivo, 'utf8');
const re = /<!-- sprite-marca:inicio[\s\S]*?<!-- sprite-marca:fim -->/;
if (!re.test(html)) throw new Error('Marcadores do sprite não encontrados em src/landing.html');
await fs.writeFile(arquivo, html.replace(re, sprite));
console.log('sprite da marca atualizado (' + (sprite.length / 1024).toFixed(1) + ' KB)');
