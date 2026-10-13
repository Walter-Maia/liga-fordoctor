// Servidor local para revisar a pré-visualização: node build/serve.mjs  →  http://localhost:4173
import http from 'http';
import zlib from 'zlib';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'preview');
const porta = Number(process.env.PORT) || 4173;
const tipos = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml', '.webp': 'image/webp', '.avif': 'image/avif', '.jpg': 'image/jpeg', '.png': 'image/png',
  '.woff2': 'font/woff2', '.json': 'application/json'
};

http.createServer(async (req, res) => {
  try {
    const caminho = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    let arquivo = path.normalize(path.join(raiz, caminho));
    if (!arquivo.startsWith(raiz)) { res.writeHead(403); return res.end(); }
    const info = await fs.stat(arquivo).catch(() => null);
    if (info && info.isDirectory()) arquivo = path.join(arquivo, 'index.html');
    let corpo = await fs.readFile(arquivo);
    const cabecalhos = { 'Content-Type': tipos[path.extname(arquivo)] || 'application/octet-stream', 'Cache-Control': 'no-store' };
    // texto comprimido, como a Cloudflare faz em produção
    if (/\.(html|css|js|svg|json)$/.test(arquivo) && /gzip/.test(req.headers['accept-encoding'] || '')) {
      corpo = zlib.gzipSync(corpo);
      cabecalhos['Content-Encoding'] = 'gzip';
    }
    res.writeHead(200, cabecalhos);
    res.end(corpo);
  } catch (e) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Não encontrado');
  }
}).listen(porta, () => console.log('Pré-visualização em http://localhost:' + porta));
