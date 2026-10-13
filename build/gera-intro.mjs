// Gera src/assets/intro.js a partir de build/intro.template.js, inserindo o path oficial do símbolo
// (último path do logo oficial, classe cls-1 começando em "m92.66,23.55"). Uso: node build/gera-intro.mjs
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const svg = await fs.readFile(path.join(raiz, 'src', 'originais', 'logo_fordoctor.svg'), 'utf8');
const simbolo = [...svg.matchAll(/<path class="cls-1" d="([^"]+)"/g)].map((m) => m[1]).find((d) => d.startsWith('m92.66,23.55'));
if (!simbolo) throw new Error('Path do símbolo não encontrado no logo oficial');
const molde = await fs.readFile(path.join(raiz, 'build', 'intro.template.js'), 'utf8');
if (!molde.includes('__SIMBOLO__')) throw new Error('Marcador __SIMBOLO__ não encontrado no molde');
await fs.writeFile(path.join(raiz, 'src', 'assets', 'intro.js'), molde.split('__SIMBOLO__').join(simbolo));
console.log('src/assets/intro.js gerado (' + simbolo.length + ' caracteres no path do símbolo)');
