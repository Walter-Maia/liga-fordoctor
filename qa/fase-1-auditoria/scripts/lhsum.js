// Resume relatórios Lighthouse: mediana de 3 execuções por formato
const fs = require('fs'); const path = require('path');
const dir = process.argv[2];
const files = fs.readdirSync(dir).filter(f => /^(mobile|desktop)-\d\.json$/.test(f));
const med = a => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
const out = {};
for (const f of files) {
  const r = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
  const ff = f.split('-')[0];
  const a = r.audits;
  const items = a['resource-summary']?.details?.items || [];
  const rs = Object.fromEntries(items.map(i => [i.resourceType, { n: i.requestCount, kb: Math.round(i.transferSize / 1024) }]));
  const lcpEl = a['largest-contentful-paint-element']?.details?.items?.[0]?.items?.[0]?.node;
  const lcpPhases = a['largest-contentful-paint-element']?.details?.items?.[1]?.items;
  const row = {
    file: f,
    perf: Math.round(r.categories.performance.score * 100),
    a11y: Math.round(r.categories.accessibility.score * 100),
    bp: Math.round(r.categories['best-practices'].score * 100),
    seo: Math.round(r.categories.seo.score * 100),
    FCP: a['first-contentful-paint'].numericValue, LCP: a['largest-contentful-paint'].numericValue,
    TBT: a['total-blocking-time'].numericValue, CLS: a['cumulative-layout-shift'].numericValue,
    SI: a['speed-index'].numericValue, TTFB: a['server-response-time']?.numericValue,
    requests: items.find(i => i.resourceType === 'total')?.requestCount,
    totalKB: Math.round((items.find(i => i.resourceType === 'total')?.transferSize || 0) / 1024),
    rs, lcpEl: lcpEl ? (lcpEl.snippet || '') + ' :: ' + (lcpEl.nodeLabel || '') + ' :: ' + (lcpEl.selector || '') : null,
    lcpPhases, lighthouseVersion: r.lighthouseVersion, ua: r.environment?.hostUserAgent, fetchTime: r.fetchTime,
    throttling: r.configSettings.throttling, formFactor: r.configSettings.formFactor
  };
  (out[ff] = out[ff] || []).push(row);
}
for (const ff of Object.keys(out)) {
  const rows = out[ff];
  console.log(`\n### ${ff} (${rows.length} execuções)`);
  for (const r of rows) console.log(`${r.file}: perf ${r.perf} a11y ${r.a11y} bp ${r.bp} seo ${r.seo} | FCP ${Math.round(r.FCP)} LCP ${Math.round(r.LCP)} TBT ${Math.round(r.TBT)} CLS ${r.CLS.toFixed(3)} SI ${Math.round(r.SI)} TTFB ${Math.round(r.TTFB)} | req ${r.requests} ${r.totalKB} KB`);
  const m = k => med(rows.map(r => r[k]));
  console.log(`MEDIANA: perf ${m('perf')} a11y ${m('a11y')} bp ${m('bp')} seo ${m('seo')} | FCP ${Math.round(m('FCP'))} LCP ${Math.round(m('LCP'))} TBT ${Math.round(m('TBT'))} CLS ${m('CLS').toFixed(3)} SI ${Math.round(m('SI'))} TTFB ${Math.round(m('TTFB'))} | req ${m('requests')} ${m('totalKB')} KB`);
  const types = ['document', 'stylesheet', 'script', 'image', 'font', 'other', 'third-party', 'total'];
  console.log('por tipo (mediana n / KB):', types.map(t => `${t} ${med(rows.map(r => r.rs[t]?.n || 0))}/${med(rows.map(r => r.rs[t]?.kb || 0))}`).join(' · '));
  console.log('LCP el:', rows.map(r => r.lcpEl).join('\n   '));
  console.log('LCP fases (1ª):', JSON.stringify(rows[0].lcpPhases));
  console.log('config:', JSON.stringify(rows[0].throttling), rows[0].formFactor, rows[0].lighthouseVersion);
}
