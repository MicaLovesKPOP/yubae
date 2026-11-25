// SPDX-License-Identifier: GPL-3.0-or-later
// Studio model: shared registry in, no dependency on a platform input method.
(function(root){
'use strict';
const MAX=3000, MAX_HASH=24000, INITIAL='ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ';
const norm=s=>String(s??'').normalize('NFC').toLowerCase().replace(/\s+/gu,'');
function initial(s){return Array.from(norm(s),c=>{const x=c.codePointAt(0)-0xac00;return x>=0&&x<11172?INITIAL[Math.floor(x/588)]:c}).join('')}
function createModel(data){
 const byId=new Map(data.lexicon.map(g=>[g.id,g])),byChar=new Map(data.lexicon.map(g=>[g.char,g]));
 const mn=data.mnemonics, forms=data.composition;
 function search(q,cat='all',favorites=[]){
  const terms=String(q).normalize('NFC').trim().split(/\s+/u).filter(Boolean);
  const whole=norm(q), isJamo=/^[ㄱ-ㅎ]+$/u.test(whole);
  return data.lexicon.map((g,i)=>{
   if(cat==='favorites'&&!favorites.includes(g.id))return null;
   if(cat!=='all'&&cat!=='favorites'&&g.category!==cat)return null;
   const keys=[g.en,g.ko_key,g.ko,g.id,...(g.aliases||[]),...(g.ko_aliases||[])].filter(Boolean).map(norm);
   const score=t=>keys.reduce((m,k)=>Math.max(m,k===t?100:k.startsWith(t)?60:k.includes(t)?20:0),0);
   let rank=whole?score(whole):1;
   if(whole&&!rank&&terms.length>1&&terms.every(t=>score(norm(t))))rank=10;
   if(isJamo)rank=Math.max(rank, ...keys.map(k=>initial(k).startsWith(whole)?30:0));
   if(!rank&&whole)return null;
   return {g,rank,i}
  }).filter(Boolean).sort((a,b)=>b.rank-a.rank||a.i-b.i).map(x=>x.g);
 }
 function convert(text,start,end){
  if(start!==end)return null;
  const match=text.slice(0,end).match(/\/(?:k\/)?[A-Za-z0-9가-힣-]+;$/u);
  if(!match||!Object.hasOwn(mn,match[0]))return null;
  const ch=mn[match[0]],i=end-match[0].length;
  return {text:text.slice(0,i)+ch+text.slice(end),caret:i+ch.length,id:byChar.get(ch)?.id}
 }
 function selected(text,start,end){
  const raw=start===end?text.slice(Math.max(0,start-1),start):text.slice(start,end);
  const glyph=byChar.get(raw);
  return glyph?{glyph,start:start===end?start-1:start,end}:null;
 }
 function changeForm(text,start,end,modifier){
  const s=selected(text,start,end),target=s&&byId.get(forms[s.glyph.id]?.[modifier]);
  if(!target)return null;
  return {text:text.slice(0,s.start)+target.char+text.slice(s.end),caret:s.start+target.char.length,id:target.id};
 }
 function encode(text){
  if(typeof text!=='string'||text.length>MAX)throw Error('length');
  const tokens=[];let literal='';
  function flush(){if(literal){tokens.push(['t',literal]);literal=''}}
  for(const c of text){const g=byChar.get(c);if(g){flush();tokens.push(['g',g.id])}else literal+=c}
  flush();return JSON.stringify({schema:'yubae:1',tokens});
 }
 // Unknown future IDs are never silently replaced by an existing glyph.
 // Display explicit placeholders; preserve the original token document in the reader.
 function decode(raw){
  if(typeof raw!=='string'||raw.length>MAX_HASH)throw Error('length');
  const d=JSON.parse(raw);if(d.schema!=='yubae:1'||!Array.isArray(d.tokens)||d.tokens.length>MAX)throw Error('schema');
  let text='',unknown=[];
  for(const tok of d.tokens){
   if(!Array.isArray(tok)||tok.length!==2||typeof tok[1]!=='string')throw Error('token');
   const [type,val]=tok;
   if(type==='t')text+=val;
   else if(type==='g'&&/^[a-z0-9][a-z0-9-]{0,79}$/u.test(val)){
    const g=byId.get(val);if(!g)unknown.push(val);text+=g?g.char:'['+val+']';
   }else throw Error('token');
   if(text.length>MAX)throw Error('length');
  }
  return {text,unknown,raw};
 }
 function hash(text){
  const bytes=new TextEncoder().encode(encode(text));
  const b64=btoa(Array.from(bytes,b=>String.fromCharCode(b)).join('')).replaceAll('+','-').replaceAll('/','_').replace(/=+$/u,'');
  if(b64.length>MAX_HASH)throw Error('length');return '#m='+b64;
 }
 function readHash(hash){
  if(!hash.startsWith('#m='))return null;
  const payload=hash.slice(3);if(payload.length>MAX_HASH||!/^[A-Za-z0-9_-]+$/u.test(payload))throw Error('hash');
  const bytes=Uint8Array.from(atob(payload.replaceAll('-','+').replaceAll('_','/')),c=>c.charCodeAt(0));
  return decode(new TextDecoder('utf-8',{fatal:true}).decode(bytes));
 }
 function gloss(text,ko=false){return Array.from(text,c=>{let g=byChar.get(c);return g?(ko?g.ko_key:g.en):c}).join(' · ').replace(/ · \n · /gu,'\n')}
 return {data,byId,byChar,search,convert,selected,changeForm,encode,decode,hash,readHash,gloss,MAX};
}
const api={createModel,norm,initial};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.YubaeModel=api;
})(typeof globalThis!=='undefined'?globalThis:this);
