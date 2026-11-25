// Test the actual compiled Keyman JS with a deterministic context adapter.
// Deadkeys are represented as invisible context tokens. Not OS integration.
const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict'),path=require('path');
const B=path.join(__dirname,'native'),D=path.join(__dirname,'..','data');
const read=f=>JSON.parse(fs.readFileSync(path.join(D,f),'utf8'));
const lex=read('text-registry.json'),legacy=read('lexicon.json'),mn=read('mnemonics.json'),rm=read('root-mnemonics.json'),roots=read('writable-roots.json'),markers=read('modifier-keys.json'),amb=read('ambiguous-ko.json'),comps=read('composition.json');
const by=new Map(lex.map(g=>[g.id,g])),cp=id=>by.get(id).char,source=fs.readFileSync(path.join(B,'exile.js'),'utf8');
let keyboard;
const eq=(a,b)=>typeof a==='object'&&typeof b==='object'&&a&&b?a.t===b.t&&a.d===b.d:a===b;
const K={KR:k=>keyboard=k,KKM:(e,m,c)=>e.mask===m&&e.code===c,
 KFCM:(n,t,a)=>n<=t.tokens.length&&a.length===n&&a.every((v,i)=>eq(v,t.tokens[t.tokens.length-n+i])),
 KDC:(n,t)=>{if(n)t.tokens.splice(-n)},
 KO:(n,t,s)=>{if(n>0)t.tokens.splice(-n);t.tokens.push(...Array.from(s))},
 KDO:(n,t,d)=>{if(n>0)t.tokens.splice(-n);t.tokens.push({t:'d',d})}};
vm.runInNewContext(source,{keyman:{version:'18.0'},KeymanWeb:K,console});
const ids=keyboard.KVKD.split(' '),index=id=>256+ids.indexOf(id);
const ctx=s=>({tokens:Array.from(s||'')});
const visible=t=>t.tokens.filter(v=>typeof v==='string').join('');
function fire(t,id){assert(ids.includes(id),id);return keyboard.gs(t,{mask:16384,code:index(id)})}
function touch(t,id){assert.equal(fire(t,id),1,id)}
function physical(t,c){const handled=keyboard.gs(t,{mask:c===String.fromCharCode(58)?16400:16384,code:c.codePointAt(0)});if(!handled)t.tokens.push(c);return handled}
const key=g=>'U_'+g.cp.toString(16).toUpperCase();
assert.equal(legacy.length,93);assert.equal(lex.length,160);assert.equal(Object.keys(mn).length,608);assert.equal(roots.length,83);
for(const g of lex){const t=ctx('x');touch(t,key(g));assert.equal(visible(t),'x'+g.char,g.id)}
for(const [shortcut,expected] of Object.entries(mn)){const t=ctx('prefix '+shortcut.slice(0,-1));assert.equal(physical(t,';'),1,shortcut);assert.equal(visible(t),'prefix '+expected,shortcut);assert(t.tokens.every(v=>typeof v==='string'))}
for(const [shortcut,expected] of Object.entries(rm)){const t=ctx('prefix '+shortcut.slice(0,-1));assert.equal(physical(t,';'),1,shortcut);assert.equal(visible(t),'prefix '+expected,shortcut);assert.equal(t.tokens.at(-1).t,'d')}
for(const raw of ['someone','water','cry','/cry','/wrong','/somewater','ordinary text',...Object.keys(amb).map(k=>'/'+k)]){const t=ctx(raw);physical(t,';');assert.equal(visible(t),raw+';')}
let cases=0;
for(const r of roots)for(const [k,m] of Object.entries(markers)){
 const bare=by.get(r.bare_id),f=r.forms.find(x=>x.kind===m),target=f?cp(f.id):null;
 const t=ctx('x');touch(t,key(bare));assert.equal(visible(t),'x'+bare.char);physical(t,k);
 assert.equal(visible(t),'x'+(target||bare.char+k),r.id+'/'+k);assert.equal(typeof t.tokens.at(-1),'string');physical(t,k);assert.equal(visible(t),'x'+(target||bare.char+k)+k);
 const u=ctx('x');touch(u,key(bare));touch(u,'T_MOD_'+m.toUpperCase());assert.equal(visible(u),'x'+(target||bare.char),r.id+'/'+m);
 const v=ctx('x');touch(v,key(bare));touch(v,'T_LITERAL_'+m.toUpperCase());assert.equal(visible(v),'x'+bare.char+k);
 const w=ctx('x');touch(w,key(bare));touch(w,'T_COMMIT');physical(w,k);assert.equal(visible(w),'x'+bare.char+k);
 const z=ctx('x'+bare.char);physical(z,k);assert.equal(visible(z),'x'+bare.char+k);
 cases++;
}
for(const a of roots)for(const b of [roots[0],roots[10],roots[12]]){
 const t=ctx();touch(t,key(by.get(a.bare_id)));touch(t,key(by.get(b.bare_id)));
 assert.equal(visible(t),cp(a.bare_id)+cp(b.bare_id));assert.equal(t.tokens.filter(x=>typeof x==='object').length,1);
}
for(const g of legacy)for(const m of Object.values(markers)){
 const t=ctx('x'+g.char);touch(t,'T_MOD_'+m.toUpperCase());assert.equal(visible(t),'x'+(comps[g.id]?.[m]?cp(comps[g.id][m]):g.char));
}
const modeOf=id=>[id.startsWith('ko-'),id.includes('learn-')].join(',');
for(const p of ['phone','tablet']){
 const ls=keyboard.KVKL[p].layer;assert.equal(ls.length,40);const byId=new Map(ls.map(l=>[l.id,l]));
 for(const mode of ['default','learn-default','ko-default','ko-learn-default']){
  const seen=new Set(),todo=[mode],all=new Set(),bare=new Set();while(todo.length){let lid=todo.pop();if(seen.has(lid))continue;seen.add(lid);const l=byId.get(lid);assert(l);
   const row=l.row.at(-2);assert(row);assert.deepEqual(Array.from(row.key,k=>k.id),['T_MOD_NOUN','T_MOD_VERB','T_MOD_ADJECTIVE','T_MOD_ADVERB','T_MOD_COLOUR','T_COMMIT']);
   for(const row of l.row)for(const k of row.key){
    if(k.id.startsWith('U_')){bare.add(k.id);all.add(k.id);if(!mode.includes('learn-'))assert.equal(k.text,String.fromCodePoint(parseInt(k.id.slice(2),16)))}
    for(const s of k.sk||[])if(s.id.startsWith('U_'))all.add(s.id);
    if(k.nextlayer){assert(byId.has(k.nextlayer));if(modeOf(k.nextlayer)===modeOf(mode))todo.push(k.nextlayer)}
   }
  }
  assert.equal(seen.size,10);assert.equal(bare.size,83);assert.equal(all.size,160)
 }
}
console.log('PASS compiled native: 160 codepoints, 608 legacy shortcuts, '+Object.keys(rm).length+' root aliases, '+cases+' root/marker pairs with punctuation, explicit modifiers, literal long-press, commit, successive roots, all 40 bilingual touch layouts.');
