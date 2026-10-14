// Roda um script de QA com o servidor local ligado só durante o teste (não deixa processo em segundo plano).
// Uso: node qa/scripts/com-servidor.js qa/scripts/v05.js 1440 900
const { spawn } = require('child_process');
const path = require('path');

const PORTA = process.env.PORT || '4179';
const [script, ...args] = process.argv.slice(2);
if (!script) { console.error('uso: node qa/scripts/com-servidor.js <script> [args]'); process.exit(1); }
const raiz = path.resolve(__dirname, '../..');
const servidor = spawn(process.execPath, [path.join(raiz, 'build', 'serve.mjs')], { env: { ...process.env, PORT: PORTA }, stdio: 'ignore' });

(async () => {
  const url = 'http://localhost:' + PORTA + '/';
  for (let i = 0; i < 50; i++) {
    try { if ((await fetch(url)).ok) break; } catch (e) { /* ainda subindo */ }
    await new Promise(r => setTimeout(r, 100));
  }
  const teste = spawn(process.execPath, [path.resolve(script), ...args], { env: { ...process.env, QA_URL: url }, stdio: 'inherit' });
  teste.on('exit', codigo => { servidor.kill(); process.exit(codigo || 0); });
})();
