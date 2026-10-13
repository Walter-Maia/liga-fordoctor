// Gera preview/index.html a partir da fonte única src/landing.html.
// Uso: node build/build.mjs   (Node 14 ou mais novo, sem dependências)
// O template do WordPress (Fase 3) será gerado daqui também, depois do acesso ao painel.
import { promises as fs } from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(raiz, 'src');
const saida = path.join(raiz, 'preview');
const pacote = JSON.parse(await fs.readFile(path.join(raiz, 'package.json'), 'utf8'));
const versao = pacote.version;

async function copia(de, para) {
  await fs.mkdir(para, { recursive: true });
  for (const item of await fs.readdir(de, { withFileTypes: true })) {
    const a = path.join(de, item.name);
    const b = path.join(para, item.name);
    if (item.isDirectory()) await copia(a, b);
    else await fs.copyFile(a, b);
  }
}

function troca(texto, de, para) {
  if (!texto.includes(de)) throw new Error('Trecho não encontrado no HTML: ' + de);
  return texto.split(de).join(para);
}

await fs.rm(saida, { recursive: true, force: true });
await copia(path.join(src, 'assets'), path.join(saida, 'assets'));
await fs.rm(path.join(saida, 'assets', 'liga.css')); // o CSS vai embutido no HTML

let html = await fs.readFile(path.join(src, 'landing.html'), 'utf8');
const css = (await fs.readFile(path.join(src, 'assets', 'liga.css'), 'utf8'))
  .split('url("fonts/').join('url("assets/fonts/');

// CSS da página inteiro embutido: é pequeno e elimina a requisição que bloqueia a renderização
html = troca(html, '<link rel="stylesheet" href="assets/liga.css">', '<style>\n' + css + '</style>');
html = troca(html, 'src="assets/liga.js"', 'src="assets/liga.js?v=' + versao + '"');
html = troca(html, 'src="assets/intro.js"', 'src="assets/intro.js?v=' + versao + '"');

// Pré-visualização: fora do Google e com aviso de que o formulário não envia
html = troca(html, '<html lang="pt-BR">', '<html lang="pt-BR" data-preview>');
html = troca(html, '<meta name="viewport"', '<meta name="robots" content="noindex, nofollow">\n<meta name="viewport"');
html = troca(html, '<footer class="rodape">', '<p class="aviso-preview" role="note">Pré-visualização v' + versao + ' para revisão. O formulário não envia dados.</p>\n<footer class="rodape">');

await fs.writeFile(path.join(saida, 'index.html'), html);

const tamanho = async (arquivo) => {
  const buf = await fs.readFile(arquivo);
  return (buf.length / 1024).toFixed(1) + ' KB (gzip ' + (zlib.gzipSync(buf).length / 1024).toFixed(1) + ' KB)';
};
console.log('preview/index.html   ' + await tamanho(path.join(saida, 'index.html')));
console.log('preview/assets/liga.js  ' + await tamanho(path.join(saida, 'assets', 'liga.js')));
console.log('preview/assets/intro.js ' + await tamanho(path.join(saida, 'assets', 'intro.js')));
console.log('versão ' + versao);
