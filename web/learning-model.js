// SPDX-License-Identifier: GPL-3.0-or-later
(function(global){
'use strict';
const DAY=86400000,LAYERS=['base','shift','altgr','shift-altgr'];
function createLearning(M,layout,curriculum){
 const roots=new Set(M.roots.map(r=>r.id)),seen=new Set();
 if(layout.layers.map(l=>l.id).join(',')!==LAYERS.join(','))throw Error('layout layers');
 const mappings=new Map(layout.layers.map(l=>[l.id,l.keys])),locations=new Map();
 for(const [key,id] of Object.entries(layout.digits)){
  if(!/^[0-9]$/.test(key)||id!==key||!roots.has(id)||seen.has(id))throw Error('digit mapping');
  seen.add(id);locations.set(id,{layer:'base',key});
 }
 for(const [layer,map] of mappings)for(const [key,id] of Object.entries(map)){
  if(!/^[a-z]$/.test(key)||!roots.has(id)||seen.has(id))throw Error('root mapping');
  seen.add(id);locations.set(id,{layer,key});
 }
 if(seen.size!==roots.size)throw Error('incomplete mapping');
 const cards=[],lessons=new Map();
 for(const lesson of curriculum.lessons){
  if(lessons.has(lesson.id)||new Set(lesson.forms).size!==lesson.forms.length)throw Error('lesson');
  for(const id of lesson.forms){
   const g=M.byId.get(id);
   if(!g||g.root_component||!M.rootByForm.has(id))throw Error('unverified bare-root exercise');
   for(const mode of ['read','type'])cards.push({key:mode+':'+id,id,mode,lesson:lesson.id})
  }
  lessons.set(lesson.id,lesson)
 }
 function resolvePhysical(e,rightAlt=false,mac=false){
  if(e.isComposing||e.keyCode===229||e.metaKey)return null;
  const altgr=!!(e.getModifierState?.('AltGraph')||(rightAlt&&e.altKey)||(mac&&e.altKey&&!e.ctrlKey));
  if(e.ctrlKey&&!altgr||e.altKey&&!altgr)return null;
  if(/^Digit[0-9]$/.test(e.code)&&!e.shiftKey&&!altgr)return layout.digits[e.code.slice(-1)]||null;
  if(!/^Key[A-Z]$/.test(e.code))return null;
  const layer=altgr?(e.shiftKey?'shift-altgr':'altgr'):(e.shiftKey?'shift':'base');
  return mappings.get(layer)[e.code.slice(-1).toLowerCase()]||null;
 }
 // US-International reports Quote/Backquote (and sometimes shifted accent
 // positions) as key='Dead'. In direct mode these are our own keys, not OS
 // accent sequences. Keep normal IME handling outside the explicit mode.
 const punctuation={Backquote:['`','~'],Quote:["'",'"'],Minus:['-','_'],Equal:['=','+'],BracketLeft:['[','{'],BracketRight:[']','}'],Backslash:['\\','|'],Semicolon:[';',':'],Comma:[',','<'],Period:['.','>'],Slash:['/','?'],Space:[' ',' '],Enter:['\n','\n']};
 const shiftedDigits=')!@#$%^&*(';
 function directAction(e,rightAlt=false,mac=false){
  if(e.metaKey)return null;
  const altgr=!!(e.getModifierState?.('AltGraph')||(rightAlt&&e.altKey)||(mac&&e.altKey&&!e.ctrlKey));
  if(e.ctrlKey&&!altgr||e.altKey&&!altgr)return null;
  // Explicit physical mode must still resolve a physical key when the OS
  // reports it as composing because a dead key was pressed previously.
  const physical={code:e.code,shiftKey:e.shiftKey,altKey:e.altKey,ctrlKey:e.ctrlKey,metaKey:e.metaKey,getModifierState:k=>e.getModifierState?.(k)};
  const rid=resolvePhysical(physical,rightAlt,mac);
  if(rid)return {kind:'root',id:rid};
  if(/^Key[A-Z]$/.test(e.code))return {kind:'reserved'};
  if(altgr)return null;
  let char;
  if(punctuation[e.code])char=punctuation[e.code][e.shiftKey?1:0];
  else if(e.shiftKey&&/^Digit[0-9]$/.test(e.code))char=shiftedDigits[Number(e.code.slice(-1))];
  else if(typeof e.key==='string'&&Object.hasOwn(M.data.modifierKeys||{},e.key))char=e.key;
  if(char===undefined)return null;
  // Honour ordinary printable punctuation on non-US layouts where possible.
  // For Dead/Process/composing input, use the visible US physical position.
  if(!e.isComposing&&e.key!=='Dead'&&e.key!=='Process'&&e.key!=='Unidentified'&&typeof e.key==='string'&&e.key.length===1&&/^[\x20-\x7E]$/.test(e.key))char=e.key;
  // KeyDown Enter is mapped explicitly only for the writer, not quiz grading.
  return Object.hasOwn(M.data.modifierKeys||{},char)?{kind:'marker',char,modifier:M.data.modifierKeys[char]}:{kind:'literal',char};
 }
 function options(card){
  const lesson=lessons.get(card.lesson),target=M.byId.get(card.id);
  const ids=[...lesson.forms,...M.data.lexicon.filter(g=>!g.root_component).map(g=>g.id)];
  const result=[target],en=new Set([target.en]),ko=new Set([target.ko_key]);
  const start=lesson.forms.indexOf(card.id)+1;
  for(const id of [...ids.slice(start),...ids.slice(0,start)]){
   const g=M.byId.get(id);
   if(!g||en.has(g.en)||ko.has(g.ko_key))continue;
   result.push(g);en.add(g.en);ko.add(g.ko_key);if(result.length===4)break;
  }
  // Deterministic varied placement, not a fixed correct-option position.
  const offset=cards.findIndex(c=>c.key===card.key&&c.lesson===card.lesson)%result.length;
  return [...result.slice(offset),...result.slice(0,offset)];
 }
 function makeSession(id,progress,now=Date.now()){
  if(id!=='review')return cards.filter(c=>c.lesson===id);
  const unique=new Map();for(const c of cards)if(!unique.has(c.key))unique.set(c.key,c);
  return [...unique.values()].filter(c=>!progress[c.key]||progress[c.key].due<=now).sort((a,b)=>(progress[a.key]?.due||0)-(progress[b.key]?.due||0));
 }
 function grade(previous,correct,now=Date.now()){
  const n=correct?Math.min(6,(Number(previous?.streak)||0)+1):0;
  return {streak:n,attempts:(Number(previous?.attempts)||0)+1,correct:(Number(previous?.correct)||0)+Number(correct),
   due:now+(correct?[0,1,3,7,14,30,60][n]*DAY:0),last:now};
 }
 function writingChecks(text){
  const issues=[];let index=0;
  for(const ch of text){
   const g=M.byChar.get(ch),cp=ch.codePointAt(0);
   if(g?.root_component){const r=M.rootByForm.get(g.id);issues.push({kind:'unknown-meaning',index,length:ch.length,id:g.id,forms:r.forms.filter(f=>f.kind!=='none').map(f=>f.id)})}
   else if(!g&&cp>=0xe000&&cp<=0xf8ff)issues.push({kind:'unregistered',index,length:ch.length,cp});
   index+=ch.length;
  }
  return issues;
 }
 return {layout,lessons,cards,locations,mappings,resolvePhysical,directAction,options,makeSession,grade,writingChecks};
}
const api={createLearning,LAYERS};if(typeof module!=='undefined'&&module.exports)module.exports=api;else global.YubaeLearning=api;
})(typeof globalThis!=='undefined'?globalThis:this);
