/*
 * Congela a intro em instantes fixos e fotografa cada quadro (Edge headless via DevTools Protocol, sem dependências).
 * Reusa o cliente CDP do QA do repositório (qa/auditoria-qa-2026-09-22/depois/lib.js).
 *
 * Uso (sirva a pasta do site por HTTP antes, ex.: python -m http.server 4321 --bind 127.0.0.1):
 *   node capturar-quadros.js <nome> <url> <tempos em s separados por vírgula> [larguraxaltura]
 *   node capturar-quadros.js siteflux http://127.0.0.1:4321/index.html 0.1,0.5,0.9,1.2,1.5,1.8,2.1,2.4
 * Saída: ./quadros/capturas/<nome>-<tempo>.jpg  (+ folha de contato <nome>-folha.jpg se houver ffmpeg no PATH)
 *
 * Como funciona: timers >= 1,4 s são anulados (fim natural e failsafes não disparam), espera .intro.is-playing,
 * pausa todas as animações do overlay (Web Animations API) e posiciona currentTime em cada instante.
 * Vale para intros em que tudo dispara com .is-playing (padrão desta skill). Aba precisa estar visível.
 */
const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');
const OUT = path.join(process.cwd(), 'quadros');
process.env.SF_OUT = OUT;
const { session, sleep } = require(path.join(__dirname, '../../../qa/auditoria-qa-2026-09-22/depois/lib.js'));

const [, , nome, url, tempos, tamanho] = process.argv;
if (!nome || !url || !tempos) { console.error('uso: node capturar-quadros.js <nome> <url> <t1,t2,...> [1280x720]'); process.exit(1); }
const T = tempos.split(',').map(Number);
const [W, H] = (tamanho || '1280x720').split('x').map(Number);

session(nome, { W, H }, async (h) => {
  await h.cdp.send('Page.addScriptToEvaluateOnNewDocument', { source: "(function(){try{sessionStorage.clear()}catch(e){}var st=window.setTimeout;window.setTimeout=function(f,ms){return ms>=1400?0:st.apply(window,arguments)}})();" });
  await h.cdp.send('Page.navigate', { url });
  let ok = false;
  for (let i = 0; i < 80 && !ok; i++) { await sleep(100); ok = await h.ev("return !!document.querySelector('.intro.is-playing')"); }
  if (!ok) throw new Error('a intro não entrou em .is-playing (hash na URL? movimento reduzido? seletor diferente de .intro?)');
  const n = await h.ev("window.__an=document.querySelector('.intro').getAnimations({subtree:true});window.__an.forEach(a=>a.pause());return window.__an.length");
  h.result.animacoes = n;
  const arquivos = [];
  for (const t of T) {
    await h.ev(`window.__an.forEach(a=>{a.currentTime=${t * 1000}});await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));`);
    arquivos.push(await h.shot(t.toFixed(2).replace('.', '_')));
  }
  h.result.quadros = arquivos;
  // folha de contato (opcional)
  try {
    const dir = path.join(OUT, 'capturas'), tmp = path.join(dir, '_seq');
    fs.mkdirSync(tmp, { recursive: true });
    arquivos.forEach((f, i) => fs.copyFileSync(f, path.join(tmp, String(i).padStart(2, '0') + '.jpg')));
    const cols = Math.min(5, arquivos.length), rows = Math.ceil(arquivos.length / cols);
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', path.join(tmp, '%02d.jpg'), '-vf', `scale=640:-1,tile=${cols}x${rows}:padding=6:color=white`, '-frames:v', '1', path.join(OUT, nome + '-folha.jpg')]);
    fs.rmSync(tmp, { recursive: true, force: true });
    h.result.folha = path.join(OUT, nome + '-folha.jpg');
  } catch (e) { h.result.folha = 'sem ffmpeg: ' + e.message.split('\n')[0]; }
});
