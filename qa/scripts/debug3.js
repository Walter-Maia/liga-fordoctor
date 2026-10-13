const { launch, sleep } = require('../fase-1-auditoria/scripts/cdp');
(async () => {
  const b = await launch(9343); const { send, evaluate } = b; await send('Page.enable'); await send('Runtime.enable');
  for (const w of [820, 1440]) {
    await send('Emulation.setDeviceMetricsOverride', { width: w, height: 900, deviceScaleFactor: 1, mobile: w < 1024 });
    await send('Page.navigate', { url: 'http://localhost:4173/' }); await sleep(1800); const H = await evaluate('document.documentElement.scrollHeight'); for (let y = 0; y <= H; y += 500) { await evaluate('scrollTo({top:' + y + ',behavior:"instant"})'); await sleep(150); } await sleep(1500);
    console.log(w, JSON.stringify(await evaluate(`(() => { const out = []; document.querySelectorAll('main p, main li, main dd').forEach(el => { const r = document.createRange(); const g = {}; const tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); while (tw.nextNode()) { const n = tw.currentNode; const re = /\S+/g; let m; while ((m = re.exec(n.data))) { r.setStart(n, m.index); r.setEnd(n, m.index + m[0].length); const q = r.getClientRects()[0]; if (!q) continue; const k = Math.round(q.top / 6); (g[k] = g[k] || []).push(m[0]); } } const mx = Math.max(0, ...Object.values(g).map(a => a.join(' ').length)); if (mx > 70) out.push(mx + ' ' + el.className + ' | ' + el.textContent.trim().slice(0, 40)); }); return out; })()`)));
  }
  b.close();
})();
