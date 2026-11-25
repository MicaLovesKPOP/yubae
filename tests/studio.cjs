// SPDX-License-Identifier: GPL-3.0-or-later
// Model tests + isolated headless browser acceptance of the actual generated Studio.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),D=path.join(root,'data'),site=path.join(root,'dist','site');
const read=n=>JSON.parse(fs.readFileSync(path.join(D,n),'utf8'));
const lex=read('text-registry.json'),mn={...read('mnemonics.json'),...read('root-mnemonics.json'),...read('compact-mnemonics.json')},composition=read('composition.json'),roots=read('writable-roots.json'),markers=read('modifier-keys.json');
const M=require('../web/model.js').createModel({lexicon:lex,mnemonics:mn,composition,roots,compactCodes:read('compact-root-codes.json')});
const cp=id=>M.byId.get(id).char, human=cp('human'),water=cp('water'),god=cp('god'),divine=cp('divine');
assert.equal(M.search('물')[0].id,'water');
assert.equal(M.search('water')[0].id,'water');
assert(M.search('ㅁ').some(g=>g.id==='water'));
assert(M.search('팔').some(g=>g.id==='8')&&M.search('팔').some(g=>g.id==='hand'));
for(const [shortcut,expected] of Object.entries(mn)){const text='x'+shortcut+'y';assert.equal(M.convert(text,text.length-1,text.length-1).text,'x'+expected+'y',shortcut)}
for(const q of ['/팔;','/cry;','water;','/somewater;'])assert.equal(M.convert(q,q.length,q.length),null);
for(const g of lex)for(const mod of ['noun','verb','adjective','adverb','colour']){
 const r=M.changeForm('x'+g.char+'y',2,2,mod),target=M.rootByForm.get(g.id)?.forms.find(f=>f.kind===mod)?.id;
 assert.equal(r?.text,target?'x'+cp(target)+'y':undefined)
}
const message=human+' '+water+'\n한글 😀 & <test>';
assert.equal(M.decode(M.encode(message)).text,message);
assert.equal(M.readHash(M.hash(message)).text,message);
const unknown=M.decode(JSON.stringify({schema:'yubae:1',tokens:[['g','future-word'],['g','water']]}));
assert.deepEqual(unknown.unknown,['future-word']);assert.equal(unknown.text,'[future-word]'+water);
for(const raw of ['{}','{"schema":"yubae:1","tokens":[["x","water"]]}','{"schema":"yubae:1","tokens":[["g","<script>"]]}'])assert.throws(()=>M.decode(raw));
assert.throws(()=>M.encode('a'.repeat(3001)));
assert.equal(M.rootSearch('').length,83);
assert.equal(M.candidateSearch('').length,83);
assert.equal(M.candidateSearch('water')[0].root.id,'water');
assert.equal(M.candidateSearch('물')[0].root.id,'water');
assert(M.candidateSearch('ㅁ').some(e=>e.root.id==='water'));
assert(M.candidateSearch('팔').some(e=>e.root.id==='8')&&M.candidateSearch('팔').some(e=>e.root.id==='hand'));
assert.equal(M.candidateSearch('k/anf')[0].root.id,'water');
assert.equal(M.candidateSearch('',[cp('root-water')&&'root-water'])[0].match.id,'water');
assert.equal(M.candidateSearch('zzzz-unavailable').length,0);
for(const [code,id] of Object.entries(read('compact-root-codes.json'))){
 const r=M.rootById.get(id);
 assert.equal(M.candidateSearch(';'+code)[0].root.id,id);
 const text=';'+code+';',converted=M.convert(text,text.length,text.length);
 assert.equal(converted.text,cp(r.bare_id));assert.equal(converted.rootId,id);
}
console.log('PASS candidate model: 83 compact codes, all roots reachable, bilingual/initial and two-set lookup, ambiguous Korean candidates, recent root ordering.');
assert.equal(roots.filter(r=>r.bare_writable).length,83);assert.equal(roots.filter(r=>r.bare_meaning==='unknown').length,67);
assert.equal(M.rootSearch('food')[0].root.id,M.rootSearch('eat')[0].root.id);
assert.equal(M.rootForm('horizontal','none').id,'root-horizontal');
assert.equal(M.rootForm('horizontal','adjective').id,'horizontal');
assert.equal(M.rootForm('purple','noun'),null);
assert.equal(M.rootForm('purple','colour').id,'purple');
assert.equal(M.rootForm('3','none').id,'3');
const actual=[];
for(const r of roots)for(const mod of ['none','noun','verb','adjective','adverb','colour']){
 const expected=r.forms.find(f=>f.kind===mod)?.id;
 const g=M.rootForm(r.id,mod);
 assert.equal(g?.id,expected,r.id+'/'+mod);
 if(g)actual.push(g.id)
}
assert.equal(actual.length,160);assert.equal(new Set(actual).size,160);
const allText=lex.map(g=>g.char).join('');assert.equal(M.decode(M.encode(allText)).text,allText);assert.equal(M.readHash(M.hash(allText)).text,allText);
console.log('PASS root registry: 83 writable root groups, 160 encoded forms, 498 root/modifier cases, 67 bare-only additions.');
console.log('PASS model: 1301 mnemonic conversions, 800 modifier cases, bilingual/initial search, ambiguity, portable token roundtrip, validation and unknown-ID preservation.');
if(process.argv.includes('--model-only'))process.exit(0);
const {chromium}=require(process.env.YUBAE_PLAYWRIGHT||'playwright-core');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.webmanifest':'application/manifest+json','.png':'image/png','.md':'text/plain; charset=utf-8'};
let next=false;
const server=http.createServer((req,res)=>{
 const u=new URL(req.url,'http://127.0.0.1'),rel=u.pathname==='/'?'index.html':decodeURIComponent(u.pathname.slice(1)),f=path.resolve(site,rel);
 if(!f.startsWith(site+path.sep)||!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404);res.end();return}
 let content=fs.readFileSync(f);
 if(next&&rel==='sw.js')content=Buffer.from(content.toString().replace(/yubae-studio-[a-f0-9]+/,'yubae-studio-test-next'));
 if(next&&rel==='index.html')content=Buffer.from(content.toString().replace('"version":"0.5.0-alpha.5"','"version":"0.5.0-alpha.6-test"'));
 res.writeHead(200,{'Content-Type':mime[path.extname(f)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(content)
});
async function run(){
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port+'/';
 const browser=await chromium.launch({executablePath:process.env.YUBAE_BROWSER||undefined,headless:true,args:['--disable-background-networking']});
 try{
 const ctx=await browser.newContext({viewport:{width:1280,height:840},locale:'en-US',acceptDownloads:true,permissions:['clipboard-read','clipboard-write']});
 await ctx.addInitScript(()=>{let clip='';Object.defineProperty(navigator,'clipboard',{value:{writeText:async v=>{clip=v},readText:async()=>clip},configurable:true});Object.defineProperty(navigator,'share',{value:undefined,configurable:true});Object.defineProperty(navigator,'canShare',{value:()=>false,configurable:true})});
 const page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.accept());
 await page.goto(url);await page.waitForFunction(()=>document.fonts.check('32px Yubae','\uE00A'));await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
 assert.equal(await page.locator('#results .glyph-key').count(),83);assert.equal(await page.locator('#version').textContent(),'0.5.0-alpha.5');
 await page.locator('#search').fill('water');assert.equal(await page.locator('#results .glyph-key').count(),1);await page.locator('#results [data-id=water]').click();assert.equal(await page.locator('#editor').inputValue(),cp('root-water'));assert(!(await page.locator('#root-form-buttons [data-modifier=none]').isDisabled()));await page.locator('#root-form-buttons [data-modifier=noun]').click();
 await page.locator('#reset-search').click();await page.locator('#lang-ko').click();assert.equal(await page.locator('html').getAttribute('lang'),'ko');await page.locator('#search').fill('사람');await page.locator('#results [data-id=human]').click();await page.locator('#root-form-buttons [data-modifier=noun]').click();assert.equal(await page.locator('#editor').inputValue(),water+human);
 await page.locator('#space').click();await page.locator('#search').fill('신');await page.locator('#results [data-id=god]').click();await page.locator('#root-form-buttons [data-modifier=noun]').click();await page.locator('#form-buttons button').filter({hasText:'형용사'}).click();assert.equal(await page.locator('#editor').inputValue(),water+human+' '+divine);
 await page.locator('#undo').click();assert.equal(await page.locator('#editor').inputValue(),water+human+' '+god);await page.locator('#redo').click();assert.equal(await page.locator('#editor').inputValue(),water+human+' '+divine);
 await page.locator('#editor').fill('/물;');assert.equal(await page.locator('#editor').inputValue(),water);
 await page.locator('#editor').fill('/팔;');assert.equal(await page.locator('#editor').inputValue(),'/팔;');
 await page.locator('#reset-search').click();
 for(const r of roots){
  await page.locator('#editor').fill('');
  await page.locator('#results [data-root="'+r.id+'"]').click();
  assert.equal(await page.locator('#editor').inputValue(),cp(r.bare_id));
  for(const mod of ['none','noun','verb','adjective','adverb','colour']){
   const btn=page.locator('#root-form-buttons [data-modifier='+mod+']');
   const form=r.forms.find(f=>f.kind===mod);
   assert.equal(await btn.isDisabled(),!form,r.id+'/'+mod);
   if(form){await btn.click();assert.equal(await page.locator('#editor').inputValue(),cp(form.id));await page.locator('#editor').fill('');await page.locator('#results [data-root="'+r.id+'"]').click()}
  }
  await page.locator('#root-cancel').click();
 }
 console.log('PASS browser root picker: all 83 roots, all 160 form outputs, 498 availability states, immediate bare-root insertion and commit.');
 // Exercise physical postfix composition, cancellation and normal punctuation.
 const ed=page.locator('#editor');
 for(const r of roots){
  for(const [k,mod] of Object.entries(markers)){
   await ed.fill('/r/'+r.id+';');
   assert.equal(await ed.inputValue(),cp(r.bare_id));
   await ed.press(k);
   const f=r.forms.find(f=>f.kind===mod);
   assert.equal(await ed.inputValue(),f?cp(f.id):cp(r.bare_id)+k,r.id+'/'+k);
   await ed.press(k);
   assert.equal(await ed.inputValue(),(f?cp(f.id):cp(r.bare_id)+k)+k);
  }
 }
 await ed.fill('');await ed.pressSequentially('/r/water;');assert.equal(await ed.inputValue(),cp('root-water'));await ed.press('Escape');await ed.press('-');assert.equal(await ed.inputValue(),cp('root-water')+'-');
 await ed.fill('/r/water;');await ed.press('ArrowLeft');await ed.press('ArrowRight');await ed.press('-');assert.equal(await ed.inputValue(),cp('root-water')+'-');
 await ed.fill('/r/water;');await ed.press('-');assert.equal(await ed.inputValue(),water);
 await ed.fill('/water;');await ed.press('-');assert.equal(await ed.inputValue(),water+'-');
 await ed.fill('/r/water;');await page.locator('#root-cancel').click();assert.equal(await ed.inputValue(),cp('root-water'));
 console.log('PASS physical browser postfix: all 415 root/marker pairs, literal fallback, repeated punctuation, commit and cursor reset.');
 // Quick picker accepts roots at the stored insertion caret; search itself
 // is never pasted into the message. The modifier may follow immediately.
 const q=page.locator('#quick-query'),dialog=page.locator('#quick-dialog');
 await ed.fill('');await ed.press('F2');assert(await dialog.isVisible());assert.equal(await q.evaluate(el=>document.activeElement===el),true);
 await q.fill('water');await q.press('Enter');assert(!(await dialog.isVisible()));assert.equal(await ed.inputValue(),cp('root-water'));assert(await ed.evaluate(el=>document.activeElement===el));await ed.press('-');assert.equal(await ed.inputValue(),water);
 await ed.press('F2');await q.fill('신');await q.press('Enter');await ed.press("'");assert.equal(await ed.inputValue(),water+divine);
 await ed.fill('ab');await ed.evaluate(el=>el.setSelectionRange(1,1));await ed.press('F2');await q.fill('k/anf');await q.press('Enter');await ed.press('-');assert.equal(await ed.inputValue(),'a'+water+'b');
 await ed.fill('unchanged');await ed.evaluate(el=>el.setSelectionRange(2,5));await ed.press('F2');await q.fill('zzzz-unavailable');await q.press('Enter');assert(await dialog.isVisible());await q.press('Escape');assert.equal(await ed.inputValue(),'unchanged');assert.equal(await ed.evaluate(el=>el.selectionStart),2);assert.equal(await ed.evaluate(el=>el.selectionEnd),5);
 await ed.fill('');await ed.press('F2');await q.fill('팔');assert(await page.locator('#quick-results [data-root="8"]').count());assert(await page.locator('#quick-results [data-root="hand"]').count());
 const options=page.locator('#quick-results .quick-option');const second=await options.nth(1).getAttribute('data-root');await q.press('ArrowDown');await q.press('Enter');assert.equal(await ed.inputValue(),cp(M.rootById.get(second).bare_id));
 await ed.fill('');await ed.press('F2');await q.press('PageDown');const selected=await page.locator('#quick-results [aria-selected=true]').getAttribute('data-root');await q.press('Enter');assert.equal(await ed.inputValue(),cp(M.rootById.get(selected).bare_id));
 await ed.fill('');await ed.press('F2');await q.fill(';wa');await q.press('Alt+1');assert.equal(await ed.inputValue(),cp('root-water'));await ed.press('-');assert.equal(await ed.inputValue(),water);
 // Synthetic composition events verify the candidate picker does not
 // commit on Enter while an OS IME is still composing.
 await ed.press('F2');await q.dispatchEvent('compositionstart');await q.fill('물');await q.dispatchEvent('keydown',{key:'Enter',isComposing:true});assert(await dialog.isVisible());await q.dispatchEvent('compositionend');await q.press('Enter');assert.equal(await ed.inputValue(),water+cp('root-water'));
 await ed.fill('');await ed.pressSequentially(';wa;-;go;');await ed.press("'");assert.equal(await ed.inputValue(),water+divine);
 await ed.fill('');await ed.pressSequentially(';zz;');assert.equal(await ed.inputValue(),';zz;');
 await ed.press('F2');await q.fill('물');await page.screenshot({path:path.join(root,'dist','studio-quick-picker.png')});await q.press('Escape');
 console.log('PASS browser quick picker: F2, bilingual/ambiguous/2-set search, arrows/pages/numbered choice, insertion caret, cancellation, synthetic IME composition guard, postfix and compact shortcuts.');

 await page.locator('#editor').fill(human+' '+water);
 await page.locator('#mode').click();await page.locator('#search').fill('물');await page.locator('#results [data-id=water]').click();await page.locator('#detail-fav').click();await page.locator('#categories [data-cat=favorites]').click();assert.equal(await page.locator('#results .glyph-key').count(),1);
 await page.reload();assert.equal(await page.locator('#editor').inputValue(),human+' '+water);assert.equal(await page.locator('html').getAttribute('lang'),'ko');await page.locator('#categories [data-cat=favorites]').click();assert.equal(await page.locator('#results [data-id=water]').count(),1);
 await page.locator('#portable').click();await page.waitForFunction(async()=> (await navigator.clipboard.readText()).includes('yubae:1'));const portable=await page.evaluate(()=>navigator.clipboard.readText());assert.equal(M.decode(portable).text,human+' '+water);
 await page.locator('#share').click();await page.waitForFunction(async()=> (await navigator.clipboard.readText()).includes('#m='));const link=await page.evaluate(()=>navigator.clipboard.readText());assert.equal(M.readHash(new URL(link).hash).text,human+' '+water);
 const [dl]=await Promise.all([page.waitForEvent('download'),page.locator('#png').click()]);await dl.saveAs(path.join(root,'dist','test-message.png'));const png=fs.readFileSync(path.join(root,'dist','test-message.png'));assert.equal(png.subarray(1,4).toString(),'PNG');assert.equal(png.readUInt32BE(16),1000);assert(png.length>1200);
 // Shared messages never replace a locally saved draft unless explicitly requested.
 await page.goto(url+M.hash(god+water));assert(await page.locator('#reader').isVisible());assert.equal(await page.locator('#read-message').textContent(),god+water);await page.locator('#read-toggle').click();assert(await page.locator('#read-gloss').isVisible());await page.locator('#read-reply').click();assert.equal(await page.locator('#editor').inputValue(),human+' '+water);
 await page.locator('#import').click();await page.locator('#import-value').fill(M.encode(god));await page.locator('#import-apply').click();assert((await page.locator('#editor').inputValue()).includes(god));
 await page.goto(url+M.hash('x'));await page.locator('#read-open').click();assert.equal(await page.locator('#editor').inputValue(),'x');
 await page.locator('#editor').fill(human+' '+water);
 await page.screenshot({path:path.join(root,'dist','studio-desktop.png'),fullPage:true});
 await ctx.setOffline(true);await page.reload();assert.equal(await page.locator('#editor').inputValue(),human+' '+water);await page.locator('#search').fill('water');assert.equal(await page.locator('#results [data-id=water]').count(),1);await ctx.setOffline(false);
 next=true;await page.evaluate(async()=>{const r=await navigator.serviceWorker.getRegistration();await r.update()});await page.locator('#update-banner').waitFor({state:'visible',timeout:20000});assert.equal(await page.locator('#version').textContent(),'0.5.0-alpha.5');await page.locator('#update').click();await page.waitForFunction(()=>document.getElementById('version').textContent==='0.5.0-alpha.6-test');assert.equal(await page.locator('#editor').inputValue(),human+' '+water);
 assert.deepEqual(errors,[]);
 console.log('PASS browser desktop: input, Korean search, forms, undo/redo, ambiguity, favourites/draft reload, portable copy, sharing, PNG download, shared reader, import, offline reload, approved update retains draft.');
 await ctx.close();
 next=false;const mobile=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true,locale:'ko-KR'});
 const mp=await mobile.newPage();await mp.goto(url);await mp.waitForFunction(()=>document.fonts.check('32px Yubae','\uE00A'));assert.equal(await mp.locator('html').getAttribute('lang'),'ko');assert.equal(await mp.locator('#version').textContent(),'0.5.0-alpha.5');assert(await mp.locator('#share-more').isVisible());assert(!(await mp.locator('#import').isVisible()));await mp.locator('#share-more').tap();assert(await mp.locator('#import').isVisible());await mp.locator('#share-more').tap();assert(!(await mp.locator('#import').isVisible()));await mp.locator('#search').fill('물');await mp.locator('#results [data-id=water]').tap();assert.equal(await mp.locator('#editor').inputValue(),cp('root-water'));await mp.locator('#root-form-buttons [data-modifier=noun]').tap();assert.equal(await mp.locator('#editor').inputValue(),water);assert(await mp.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await mp.screenshot({path:path.join(root,'dist','studio-mobile.png'),fullPage:true});await mp.locator('#quick-open').tap();assert(await mp.locator('#quick-dialog').isVisible());await mp.locator('#quick-query').fill('물');await mp.locator('#quick-results [data-root=water]').tap();assert.equal(await mp.locator('#editor').inputValue(),water+cp('root-water'));await mobile.close();
 console.log('PASS mobile viewport: Korean default, touch insertion, no horizontal overflow. Actual device installation remains untested.');
 // The downloadable HTML must work without a server or service worker.
 const offline=await browser.newContext({offline:true,viewport:{width:1000,height:800}}),op=await offline.newPage();await op.goto('file:///'+path.join(root,'dist','Yubae_Studio.html').replaceAll('\\','/'));await op.waitForFunction(()=>document.fonts.check('32px Yubae','\uE00A'));await op.locator('#search').fill('water');await op.locator('#results [data-id=water]').click();await op.locator('#root-form-buttons [data-modifier=noun]').click();assert.equal(await op.locator('#editor').inputValue(),water);await offline.close();console.log('PASS offline standalone HTML.');
 }finally{await browser.close();server.close()}
}
run().catch(e=>{console.error(e);server.close();process.exitCode=1});
