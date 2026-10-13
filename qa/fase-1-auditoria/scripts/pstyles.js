const fs = require('fs'); const { launch, sleep } = require('./cdp');
const code = fs.readFileSync(__dirname + '/pstyles.inpage.js', 'utf8');
(async () => {
  const b = await launch(9337, ['--lang=pt-BR']); const { send, evaluate } = b; await send('Page.enable'); await send('Runtime.enable');
  for (const [w, h, m] of [[390, 844, true], [1440, 900, false]]) {
    await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: m });
    await send('Page.navigate', { url: 'https://fordoctor.com.br/liga-fordoctor/' }); await sleep(4000);
    await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 10, y: 10 }); await sleep(2500);
    const H = await evaluate('document.documentElement.scrollHeight'); for (let y = 0; y <= H; y += 400) { await evaluate(`scrollTo(0,${y})`); await sleep(200); } await sleep(2000);
    console.log('\n### ' + w); (await evaluate(code)).forEach(x => console.log(JSON.stringify(x)));
  }
  b.close();
})();
