// SPDX-License-Identifier: GPL-3.0-or-later
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const D=path.join(__dirname,'..','data'),read=n=>JSON.parse(fs.readFileSync(path.join(D,n),'utf8'));
const data={lexicon:read('text-registry.json'),roots:read('writable-roots.json'),mnemonics:{...read('mnemonics.json'),...read('root-mnemonics.json'),...read('compact-mnemonics.json')},composition:read('composition.json'),compactCodes:read('compact-root-codes.json'),modifierKeys:read('modifier-keys.json'),directLayout:read('direct-layout-trial.json'),curriculum:read('lessons-v1.json')};
const M=require('../web/model.js').createModel(data),L=require('../web/learning-model.js').createLearning(M,data.directLayout,data.curriculum);
const cp=id=>M.byId.get(id).char,bare=id=>cp(M.rootById.get(id).bare_id);
assert.equal(L.locations.size,83);
assert.deepEqual(data.directLayout.layers.map(l=>Object.keys(l.keys).length),[26,26,21,0]);
for(const [id,loc] of L.locations){
 const alt=loc.layer.includes('altgr'),e={code:/^\d$/.test(loc.key)?'Digit'+loc.key:'Key'+loc.key.toUpperCase(),shiftKey:loc.layer.includes('shift'),altKey:alt,ctrlKey:alt,getModifierState:s=>s==='AltGraph'&&alt};
 assert.equal(L.resolvePhysical(e),id);
 assert.equal(L.resolvePhysical({...e,metaKey:true}),null);
 assert.equal(L.resolvePhysical({...e,isComposing:true}),null);
}
assert.equal(L.resolvePhysical({code:'KeyW',ctrlKey:true}),null);
assert.equal(L.resolvePhysical({code:'KeyW',altKey:true}),null);
assert.equal(L.resolvePhysical({code:'KeyW',altKey:true},true),'glass');
assert.equal(L.resolvePhysical({code:'KeyW',altKey:true},false,true),'glass');
assert.equal(L.resolvePhysical({code:'Digit1',shiftKey:true}),null);
assert.equal(L.cards.length,64);
for(const c of L.cards){const opts=L.options(c);assert.equal(opts.length,4);assert(opts.some(g=>g.id===c.id));assert.equal(new Set(opts.map(g=>g.en)).size,4);assert.equal(new Set(opts.map(g=>g.ko_key)).size,4)}
const now=1700000000000,first=L.grade(null,true,now);
assert.equal(first.due,now+86400000);assert.equal(L.grade(first,true,now).due,now+3*86400000);assert.equal(L.grade(first,false,now).due,now);
const card=L.cards[0];assert.equal(L.makeSession('review',{[card.key]:first},now).length,63);
assert.equal(L.makeSession('review',{[card.key]:first},first.due).length,64);
assert.equal(L.writingChecks('English 한글 '+cp('water')).length,0);
const issues=L.writingChecks('😀'+bare('water')+cp('human')+'\uEABC');
assert.deepEqual(issues.map(x=>[x.kind,x.index]),[['unknown-meaning',2],['unregistered',4]]);
assert.deepEqual(issues[0].forms,['water']);
console.log('PASS model: 83 roots, all four layer states, shortcuts/IME guard, 64 recognition/typing cards, unique distractors, review intervals, advisory writing notices.');
if(process.argv.includes('--model-only'))process.exit(0);
const {chromium}=require(process.env.YUBAE_PLAYWRIGHT||'playwright-core');
(async()=>{const b=await chromium.launch({executablePath:process.env.YUBAE_BROWSER,headless:true,args:['--disable-background-networking']});
try{
 const ctx=await b.newContext({offline:true,locale:'en-US',viewport:{width:1280,height:900}});
 const p=await ctx.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('file:///'+path.resolve('dist/Yubae_Studio.html').replaceAll('\\','/'));
 await p.waitForFunction(()=>document.fonts.check('32px Yubae','\uE003'));
 assert.equal(await p.locator('#version').textContent(),'0.5.0-alpha.6');
 const ed=p.locator('#editor');await ed.fill('');await p.locator('#direct-toggle').click();
 assert.equal(await p.locator('#direct-toggle').getAttribute('aria-pressed'),'true');
 await ed.press('w');assert.equal(await ed.inputValue(),bare('water'));await ed.press('-');assert.equal(await ed.inputValue(),cp('water'));
 await ed.press('Shift+w');assert.equal(await ed.inputValue(),cp('water')+bare('ocean'));await ed.press(':');assert.equal(await ed.inputValue(),cp('water')+cp('blue'));
 await ed.press('3');assert.equal(await ed.inputValue(),cp('water')+cp('blue')+cp('3'));
 await ed.press('Shift+Digit1');assert((await ed.inputValue()).endsWith('!'),JSON.stringify(await ed.inputValue()));
 await ed.press('F2');await p.locator('#quick-query').fill('human');await p.locator('#quick-query').press('Enter');await ed.press('-');assert((await ed.inputValue()).endsWith(cp('human')));
 // Each location is dispatched as a physical code; AltGr chords use synthetic events.
 for(const [rid,loc] of L.locations){
   await ed.fill('');const alt=loc.layer.includes('altgr');
   if(alt)await ed.dispatchEvent('keydown',{key:'Alt',code:'AltRight',altKey:true});
   await ed.dispatchEvent('keydown',{key:loc.key,code:/^\d$/.test(loc.key)?'Digit'+loc.key:'Key'+loc.key.toUpperCase(),shiftKey:loc.layer.includes('shift'),altKey:alt,ctrlKey:alt});
   if(alt)await ed.dispatchEvent('keyup',{key:'Alt',code:'AltRight'});
   assert.equal(await ed.inputValue(),bare(rid),rid);
 }
 await p.locator('#direct-keys .layer-tabs button').nth(2).click();await p.locator('#direct-keys [data-root=glass]').click();assert((await ed.inputValue()).endsWith(bare('glass')));
 await p.locator('#direct-toggle').click();await ed.fill('');await ed.pressSequentially(';wa;-');assert.equal(await ed.inputValue(),cp('water'));
 const draft=bare('water')+' '+cp('human')+'\uEABC';await ed.fill(draft);await p.locator('#check-open').click();
 assert.equal(await p.locator('#check-results .check-line').count(),2);assert.equal(await ed.inputValue(),draft);
 await p.locator('#check-results .check-line button').first().click();assert.equal(await ed.evaluate(e=>e.selectionStart),0);assert.equal(await ed.evaluate(e=>e.selectionEnd),1);
 await p.locator('#check-close').click();
 // Start lesson without modifying draft.
 await p.locator('#learn-open').click();assert(await p.locator('#learn-dialog').isVisible());assert.equal(await p.locator('#learn-lessons .lesson-card').count(),4);
 await p.locator('#learn-lessons .lesson-card').first().click();assert.equal(await p.locator('#learn-target').textContent(),cp('0'));
 await p.locator('#learn-options [data-answer="0"]').click();assert((await p.locator('#learn-feedback').textContent()).includes('Correct'));
 await p.locator('#learn-next').click();assert.equal(await p.locator('#learn-target').textContent(),'0');
 await p.locator('#learn-hint').click();assert(await p.locator('#learn-hint-text').isVisible());
 const input=p.locator('#learn-input');await input.focus();await input.press('0');assert.equal(await input.inputValue(),cp('0'));await p.locator('#learn-check').click();assert((await p.locator('#learn-feedback').textContent()).includes('Correct'));
 await p.locator('#learn-next').click();await p.locator('#learn-options button').filter({hasNotText:/^1$/}).first().click();assert((await p.locator('#learn-feedback').textContent()).includes('Not quite'));
 await p.locator('#learn-close').click();assert.equal(await ed.inputValue(),draft);
 const saved=await p.evaluate(()=>JSON.parse(localStorage.getItem('yubae-learn-v1')));
 assert.equal(saved['read:0'].correct,1);assert.equal(saved['type:0'].correct,1);assert.equal(saved['read:1'].streak,0);
 await p.reload();assert.equal(await p.locator('#editor').inputValue(),draft);
 await p.locator('#lang-ko').click();await p.locator('#learn-open').click();assert((await p.locator('#learn-title').textContent()).includes('학습'));assert((await p.locator('#learn-lessons .lesson-card').last().textContent()).includes('62'));
 await p.locator('#learn-lessons .lesson-card').nth(1).click();await p.locator('#learn-options [data-answer=human]').click();await p.locator('#learn-next').click();await input.focus();await input.press('h');await input.press('-');assert.equal(await input.inputValue(),cp('human'));await p.locator('#learn-check').click();assert((await p.locator('#learn-feedback').textContent()).includes('정답입니다'));
 await p.screenshot({path:path.resolve('dist/learn-desktop.png')});
 assert.deepEqual(errors,[]);await ctx.close();
 const mc=await b.newContext({offline:true,locale:'ko-KR',viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2}),mp=await mc.newPage();
 await mp.goto('file:///'+path.resolve('dist/Yubae_Studio.html').replaceAll('\\','/'));await mp.locator('#learn-open').tap();await mp.locator('#learn-lessons .lesson-card').nth(1).tap();await mp.locator('#learn-options [data-answer=human]').tap();await mp.locator('#learn-next').tap();
 await mp.locator('#learn-keys [data-root=human]').tap();await mp.locator('#learn-modifiers button').filter({hasText:'명사'}).tap();assert.equal(await mp.locator('#learn-input').inputValue(),cp('human'));await mp.locator('#learn-check').tap();assert((await mp.locator('#learn-feedback').textContent()).includes('정답입니다'));
 assert(await mp.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await mp.screenshot({path:path.resolve('dist/learn-mobile.png')});await mc.close();
 console.log('PASS browser: opt-in direct layout, all 83 positions, modifiers, ordinary punctuation, quick picker, advisory selection, local lesson scoring and review persistence, Korean UI, touch exercise, no horizontal overflow and no change to draft.');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
