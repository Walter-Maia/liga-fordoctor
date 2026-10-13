const s=require('fs').readFileSync(process.argv[2],'utf8');
const i=s.indexOf('var data = {');const start=s.indexOf('{',i);
// find matching brace
let d=0,j=start;for(;j<s.length;j++){const c=s[j];if(c==='{')d++;else if(c==='}'){d--;if(!d)break}}
const data=JSON.parse(s.slice(start,j+1));const r=data.resource;
console.log('version',r.version,'macros',r.macros.length,'tags',r.tags.length,'predicates',r.predicates.length,'rules',r.rules.length);
const fmt=v=>JSON.stringify(v).slice(0,160);
r.tags.forEach((t,k)=>{const o={};for(const key in t){if(/^vtp_(eventName|measurementId|conversionId|conversionLabel|tagId|html|eventParameters|sendTo|event)/.test(key))o[key]=t[key]}console.log('TAG',k,t.function,t.tag_id||'',fmt(o).replace(/\n/g,' ').slice(0,300))});
r.predicates.forEach((p,k)=>console.log('PRED',k,p.function,fmt(p.arg0),fmt(p.arg1)));
r.rules.forEach((ru,k)=>console.log('RULE',k,fmt(ru)));
r.macros.forEach((m,k)=>{if(/obrigado|form|utm|url|path|element/i.test(JSON.stringify(m)))console.log('MACRO',k,m.function,fmt(m).slice(0,200))});
