const path = require('path');
const { launch, sleep } = require('../fase-1-auditoria/scripts/cdp');
const URL_ = 'file:///' + path.resolve(__dirname, '../../preview/index.html').split(path.sep).join('/') + '?intro=0';
(async () => {
  const b = await launch(9355); const { send, evaluate, on } = b;
  const ev = [];
  on(m => {
    if (m.method === 'Network.requestWillBeSent' && /liga-fundo/.test(m.params.request.url)) ev.push('pedido ' + m.params.request.url.split('/').pop() + ' iniciador=' + (m.params.initiator.type) + (m.params.initiator.stack ? ' (js)' : ''));
    if (m.method === 'Network.responseReceived' && /liga-fundo/.test(m.params.response.url)) ev.push('resposta ' + m.params.response.url.split('/').pop() + ' cache=' + (m.params.response.fromDiskCache || m.params.response.fromPrefetchCache || false));
    if (m.method === 'Network.requestServedFromCache') ev.push('servido do cache');
  });
  await send('Page.enable'); await send('Runtime.enable'); await send('Network.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1024, height: 768, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: URL_ }); await sleep(1500);
  const top = await evaluate("document.getElementById('liga').getBoundingClientRect().top + scrollY");
  await evaluate('scrollTo({ top: ' + Math.round(top) + ', behavior: "instant" })'); await sleep(1500);
  console.log(ev.join('\n'));
  b.close();
})();
