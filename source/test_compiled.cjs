// Execute the compiled keyboard against a deterministic Keyman context adapter.
// This proves generated rules and layout coverage, not platform integration.
const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict'),path=require('path');
const B=path.join(__dirname,'native'),D=path.join(__dirname,'..','data');
const read=(f)=>JSON.parse(fs.readFileSync(path.join(D,f),'utf8'));
const lex=read('lexicon.json'),mn=read('mnemonics.json'),comps=read('composition.json'),amb=read('ambiguous-ko.json');
const by=new Map(lex.map(g=>[g.id,g]));
const source=fs.readFileSync(path.join(B,'exile.js'),'utf8');
let keyboard;
const K={KR:k=>keyboard=k,KKM:(e,m,c)=>e.mask===m&&e.code===c,KFCM:(n,t,a)=>t.value.slice(-n)===a.join(''),KCM:(n,t,c)=>t.value.slice(-n)===c,KDC:(n,t)=>{if(n)t.value=t.value.slice(0,-n)},KO:(n,t,s)=>{if(n>0)t.value=t.value.slice(0,-n);t.value+=s}};
vm.runInNewContext(source,{keyman:{version:'18.0'},KeymanWeb:K,console});
const ids=keyboard.KVKD.split(' '), index=id=>256+ids.indexOf(id);
function key(id,context=''){let t={value:context};assert.notEqual(ids.indexOf(id),-1);assert.equal(keyboard.gs(t,{mask:16384,code:index(id)}),1,id);return t.value}
const cp=id=>parseInt(id.slice(2),16);
assert.equal(lex.length,93);assert.equal(Object.keys(mn).length,608);
for(let g of lex){const id='U_'+g.cp.toString(16).toUpperCase();assert.equal(key(id,'x'),'x'+g.char,id)}
for(const id of ids.filter(x=>x.startsWith('T_NAV_')))assert.equal(key(id,'keep'),'keep',id);
function semicolon(context){let t={value:context};const handled=keyboard.gs(t,{mask:16384,code:59});return {handled,output:t.value+(handled?'':';')}}
for(const [shortcut,expected] of Object.entries(mn)){assert.deepEqual(semicolon('prefix '+shortcut.slice(0,-1)),{handled:1,output:'prefix '+expected},shortcut)}
for(const raw of ['someone','water','cry','/cry','/wrong','/somewater','ordinary text',...Object.keys(amb).map(k=>'/'+k)])assert.equal(semicolon(raw).output,raw+';');
let transformed=0;
for(const g of lex)for(const m of ['noun','verb','adjective','adverb','colour']){
 const target=comps[g.id]?.[m];assert.equal(key('T_MOD_'+m.toUpperCase(),'prefix '+g.char),'prefix '+(target?by.get(target).char:g.char),g.id+'/'+m);if(target&&target!==g.id)transformed++;
}
assert.equal(transformed,20);
for(const m of ['noun','verb','adjective','adverb','colour'])assert.equal(key('T_MOD_'+m.toUpperCase(),'latin'),'latin');
const modeOf=id=>[id.startsWith('ko-'),id.includes('learn-')].join(',');
for(const p of ['phone','tablet']){
 const ls=keyboard.KVKL[p].layer;assert.equal(ls.length,40);const byId=new Map(ls.map(l=>[l.id,l]));
 for(const mode of ['default','learn-default','ko-default','ko-learn-default']){
  const seen=new Set(),todo=[mode],cps=new Set();while(todo.length){let lid=todo.pop();if(seen.has(lid))continue;seen.add(lid);const l=byId.get(lid);assert(l);
  for(const r of l.row)for(const k of r.key){
   if(k.id.startsWith('U_')){cps.add(cp(k.id));if(!mode.includes('learn-'))assert.equal(k.text,String.fromCodePoint(cp(k.id)));else if(mode.startsWith('ko-')&&cp(k.id)>0xe009)assert.match(k.text,/[가-힣]/u);for(const a of k.sk||[])assert.equal(key(a.id),String.fromCodePoint(cp(a.id)))}
   if(k.nextlayer){assert(byId.has(k.nextlayer));if(modeOf(k.nextlayer)===modeOf(mode))todo.push(k.nextlayer)}
  }}assert.equal(cps.size,93);assert.equal(seen.size,10)
 }
}
console.log('PASS: 93 glyphs; 608 bilingual shortcuts; 40 reachable phone/tablet layers; all 465 modifier/character cases (20 nonidentity transformations); ambiguous gloss safety; long-press and navigation rules.');
