// SPDX-License-Identifier: GPL-3.0-or-later
'use strict';
const $=id=>document.getElementById(id);
const data=JSON.parse($('registry').textContent), M=YubaeModel.createModel(data);
const words={
 en:{more:'More',less:'Less',install:'Install',updateReady:'A new version is ready. Your draft is saved locally.',update:'Update',sharedMessage:'Shared message',unofficial:'Unofficial alpha',showGloss:'Show glosses',hideGloss:'Hide glosses',copyText:'Copy text',editCopy:'Edit a copy',writeReply:'Open my editor',portable:'Portable text',write:'Write',message:'Yubae message',undo:'Undo',redo:'Redo',space:'Space',newline:'New line',backspace:'Delete',clear:'Clear',forms:'Change form',formNone:'Select one glyph or place the cursor after it.',formUnavailable:'No other form is documented in our chart.',gloss:'Word-by-word gloss (not a translation)',share:'Share link',png:'Image',import:'Import',shareHint:'Share a link or image so recipients can read it without installing a font. Plain copied glyphs may appear as boxes in other apps.',dictionary:'Character dictionary',browse:'Inspect',insertMode:'Insert mode',search:'Search in Korean or English',reset:'Reset',recent:'Recent',provisional:'Provisional forms',insert:'Insert',close:'Close',howTo:'How to use',instructions:'Search Korean or English words (Korean initial consonants work too). Tap a character to insert it. Use Inspect to view meanings and add favourites. Select a glyph or place the cursor immediately after it to change its form, if a corresponding chart form is available.',keyboardHelp:'You can also type directly with Keyman, or enter shortcuts such as /water; or /물; in this editor using your normal keyboard. Korean two-set shortcut: /k/anf;. This does not translate sentences automatically.',nativeDownload:'Install the native Keyman keyboard',about:'About this project',aboutText:'Independent fan project. All 93 current forms were reconstructed from a handwritten reference; exact shapes and meanings require primary-source review. No programme footage or original chart image is included. Not an official or endorsed language reference.',sources:'Research sources',rights:'Rights and licences',footer:'Yubae Studio · Offline-first · No account or tracking.',offlineFile:'Download offline HTML',importHint:'Paste private-use glyph text, a Yubae portable JSON message, or a Yubae message link. It is only imported when you confirm.',cancel:'Cancel',importApply:'Insert imported text',saved:'Saved on this device',notSaved:'Local saving unavailable',empty:'Write something first.',copied:'Copied.',copyFailed:'Copy is unavailable. Select the text and copy it manually.',tooLong:'Message too long. Use a shorter message.',shareLong:'This link is too long for reliable sharing. Use an image or portable text.',importFailed:'Invalid or unsupported message.',unknown:'Some character IDs are not in this version. Placeholders are shown; original portable message is preserved.',unknownImport:'Unknown IDs cannot be safely inserted into this editor. Open a newer version or keep the portable text.',shareErr:'Unable to share. Try copying or downloading.',imageSaved:'Image ready.',exportErr:'Unable to render image. Try a shorter message.',clearConfirm:'Clear the current draft? You can undo this.',replaceConfirm:'Replace your current draft with this message?',favorite:'Add favourite',unfavorite:'Remove favourite',noResults:'No matching characters. Try another word.',all:'All',favorites:'Favourites',People:'People',Actions:'Actions',World:'Objects',Space:'Space',Grammar:'Grammar',Properties:'Traits',Nature:'Nature',Time:'Time',Numbers:'Numbers',noun:'Noun',verb:'Verb',adjective:'Adjective',adverb:'Adverb',colour:'Colour',none:'Unmarked',sourceNote:'Provisional chart reconstruction; source review pending.',matchCount:n=>n+' characters',count:n=>n+' / '+M.MAX,placeholder:'Start writing here…',inspectHint:'Inspect character',insertHint:'Insert character',shareTitle:'A Yubae message',fontErr:'The custom font could not be loaded. Image sharing is unavailable.',portableSaved:'Portable message copied.',unsupportedInstall:'Use your browser’s Add to Home Screen / Install option.',privateLink:'This message is stored in the link itself. Anyone you send it to can read it.',readMalformed:'The shared message link could not be read.',favoritesEmpty:'No favourites yet. Inspect a glyph and add it to your favourites.'},
 ko:{more:'더 보기',less:'접기',install:'설치',updateReady:'새 버전이 준비되었습니다. 작성 내용은 이 기기에 저장됩니다.',update:'업데이트',sharedMessage:'받은 메시지',unofficial:'비공식 알파',showGloss:'뜻 보기',hideGloss:'뜻 숨기기',copyText:'문자 복사',editCopy:'복사본 편집',writeReply:'내 편집기 열기',portable:'호환 텍스트',write:'쓰기',message:'유배지어 메시지',undo:'실행 취소',redo:'다시 실행',space:'공백',newline:'줄 바꿈',backspace:'지우기',clear:'전체 지우기',forms:'형태 바꾸기',formNone:'글자 하나를 선택하거나 글자 바로 뒤에 커서를 놓으세요.',formUnavailable:'현재 문자표에서 확인된 다른 형태가 없습니다.',gloss:'단어별 뜻 (번역 아님)',share:'링크 공유',png:'이미지',import:'가져오기',shareHint:'링크나 이미지를 공유하면 상대방이 글꼴을 설치하지 않아도 읽을 수 있습니다. 문자를 그대로 복사하면 다른 앱에서 네모로 보일 수 있습니다.',dictionary:'문자 사전',browse:'자세히 보기',insertMode:'입력 모드',search:'한국어 또는 영어 검색',reset:'초기화',recent:'최근 사용',provisional:'잠정 문자',insert:'입력',close:'닫기',howTo:'사용 방법',instructions:'한국어 또는 영어로 검색하세요(초성 검색도 가능). 글자를 누르면 입력됩니다. 자세히 보기에서 뜻을 확인하고 즐겨찾기에 추가할 수 있습니다. 글자 하나를 선택하거나 글자 뒤에 커서를 두면 확인된 다른 형태로 바꿀 수 있습니다.',keyboardHelp:'Keyman으로 직접 입력하거나 일반 키보드로 /물; 또는 /water; 를 입력할 수 있습니다. 두벌식 키 위치 단축어: /k/anf;. 문장을 자동 번역하지는 않습니다.',nativeDownload:'Keyman 입력기 설치',about:'프로젝트 소개',aboutText:'비공식 팬 프로젝트입니다. 현재 93개 문자는 손글씨 자료를 재구성한 것으로, 정확한 모양과 뜻은 원전 대조가 필요합니다. 방송 영상이나 원본 문자표 이미지는 포함하지 않습니다. 공식 자료나 승인된 프로젝트가 아닙니다.',sources:'연구 출처',rights:'권리 및 라이선스',footer:'유배지어 편집기 · 오프라인 우선 · 계정·추적 없음.',offlineFile:'오프라인 HTML 다운로드',importHint:'사적 사용 영역 문자, 호환 JSON 메시지 또는 유배지어 공유 링크를 붙여 넣으세요. 확인 후에만 입력됩니다.',cancel:'취소',importApply:'가져온 문자 입력',saved:'이 기기에 저장됨',notSaved:'로컬 저장 불가',empty:'먼저 글자를 입력하세요.',copied:'복사했습니다.',copyFailed:'복사할 수 없습니다. 텍스트를 직접 선택해 복사하세요.',tooLong:'메시지가 너무 깁니다. 줄여 주세요.',shareLong:'링크가 너무 깁니다. 이미지나 호환 텍스트로 공유하세요.',importFailed:'올바르지 않거나 지원하지 않는 메시지입니다.',unknown:'이 버전에 없는 문자 ID가 있어 자리 표시자를 보여 줍니다. 원래 호환 메시지는 보존됩니다.',unknownImport:'알 수 없는 ID를 안전하게 입력할 수 없습니다. 최신 버전에서 열거나 호환 텍스트를 보관하세요.',shareErr:'공유할 수 없습니다. 복사 또는 다운로드를 시도하세요.',imageSaved:'이미지가 준비되었습니다.',exportErr:'이미지를 만들 수 없습니다. 더 짧은 메시지로 시도하세요.',clearConfirm:'작성 내용을 모두 지울까요? 실행 취소할 수 있습니다.',replaceConfirm:'현재 작성 내용을 받은 메시지로 바꿀까요?',favorite:'즐겨찾기 추가',unfavorite:'즐겨찾기 해제',noResults:'검색 결과가 없습니다. 다른 단어로 검색하세요.',all:'전체',favorites:'즐겨찾기',People:'사람',Actions:'행동',World:'사물',Space:'공간',Grammar:'문법',Properties:'특성',Nature:'자연',Time:'시간',Numbers:'숫자',noun:'명사',verb:'동사',adjective:'형용사',adverb:'부사',colour:'색',none:'표지 없음',sourceNote:'손글씨 자료를 재구성한 잠정 문자입니다. 원전 검토가 필요합니다.',matchCount:n=>n+'개 문자',count:n=>n+' / '+M.MAX,placeholder:'여기에 글자를 입력하세요…',inspectHint:'문자 자세히 보기',insertHint:'문자 입력',shareTitle:'유배지어 메시지',fontErr:'글꼴을 불러오지 못했습니다. 이미지 공유를 사용할 수 없습니다.',portableSaved:'호환 메시지를 복사했습니다.',unsupportedInstall:'브라우저에서 홈 화면에 추가 또는 설치를 선택하세요.',privateLink:'메시지는 링크 자체에 담깁니다. 링크를 받은 사람은 누구나 읽을 수 있습니다.',readMalformed:'공유 메시지 링크를 읽을 수 없습니다.',favoritesEmpty:'아직 즐겨찾기가 없습니다. 문자 상세 보기에서 추가하세요.'}
};
const STORE='yubae-studio-v1'; let stored={};
try{stored=JSON.parse(localStorage.getItem(STORE)||'{}')||{}}catch{}
let lang=stored.lang==='ko'||stored.lang==='en'?stored.lang:(navigator.language||'').startsWith('ko')?'ko':'en';
const validIds=xs=>Array.isArray(xs)?Array.from(new Set(xs.filter(x=>M.byId.has(x)))).slice(0,93):[];
let favorites=validIds(stored.favorites),recent=validIds(stored.recent).slice(0,8),category='all',inspect=false,detailId=null,shared=null,showGloss=false,isComposing=false,searchComposing=false;
const editor=$('editor');editor.value=typeof stored.text==='string'?stored.text.slice(0,M.MAX):'';
let history=[{text:editor.value,start:editor.value.length,end:editor.value.length}],historyIndex=0,toastTimer,waitingWorker,installPrompt,approvedUpdate=false;
editor.setSelectionRange(editor.value.length,editor.value.length);
const t=k=>words[lang][k]??words.en[k]??k;
const name=g=>lang==='ko'?g.ko_key:g.en;
const other=g=>lang==='ko'?g.en:g.ko_key;
function notify(k){const el=$('toast');el.textContent=t(k);el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),3000)}
function save(){try{localStorage.setItem(STORE,JSON.stringify({lang,text:editor.value,favorites,recent}));$('draft-state').textContent=t('saved');return true}catch{$('draft-state').textContent=t('notSaved');return false}}
function snap(){return {text:editor.value,start:editor.selectionStart,end:editor.selectionEnd}}
function record(){const now=snap(),before=history[historyIndex];if(now.text===before.text){history[historyIndex]=now;return}history=history.slice(0,historyIndex+1);history.push(now);if(history.length>101)history.shift();historyIndex=history.length-1}
function markRecent(id){if(!id)return;recent=[id,...recent.filter(x=>x!==id)].slice(0,8)}
function refreshEditor(){save();$('count').textContent=t('count')(editor.value.length);$('gloss').textContent=M.gloss(editor.value,lang==='ko');$('undo').disabled=historyIndex===0;$('redo').disabled=historyIndex===history.length-1;renderForms()}
function refresh(){refreshEditor();renderRecent();renderResults();renderDetail()}
function commit(text,caret,id){if(text.length>M.MAX){notify('tooLong');return false}editor.value=text;editor.setSelectionRange(caret,caret);markRecent(id);record();refresh();return true}
function insertText(text,id){const s=snap();return commit(s.text.slice(0,s.start)+text+s.text.slice(s.end),s.start+text.length,id)}
function navigateHistory(delta){let i=historyIndex+delta;if(i<0||i>=history.length)return;historyIndex=i;const s=history[i];editor.value=s.text;editor.setSelectionRange(s.start,s.end);refreshEditor()}
function renderForms(){
 const s=M.selected(editor.value,editor.selectionStart,editor.selectionEnd),wrap=$('form-buttons');wrap.replaceChildren();
 if(!s){$('form-context').textContent=t('formNone');return}
 const forms=data.composition[s.glyph.id]||{},entries=Object.entries(forms).filter(([,id])=>id!==s.glyph.id&&M.byId.has(id));
 $('form-context').textContent=name(s.glyph)+' · '+(entries.length?t(s.glyph.marker||'none'):t('formUnavailable'));
 for(const [mod,id] of entries){const g=M.byId.get(id),b=document.createElement('button'),span=document.createElement('span'),label=document.createElement('span');span.className='glyph';span.textContent=g.char;label.textContent=t(mod)+' · '+name(g);b.append(span,label);b.addEventListener('mousedown',e=>e.preventDefault());b.addEventListener('click',()=>{const r=M.changeForm(editor.value,editor.selectionStart,editor.selectionEnd,mod);if(r)commit(r.text,r.caret,r.id)});wrap.append(b)}
}
function glyphButton(g){
 const b=document.createElement('button');b.className='glyph-key';b.dataset.id=g.id;b.type='button';b.setAttribute('aria-label',t(inspect?'inspectHint':'insertHint')+': '+name(g)+' / '+other(g));b.title=name(g)+' / '+other(g);
 const c=document.createElement('span');c.className='glyph';c.textContent=g.char;const l=document.createElement('span');l.className='word';l.textContent=name(g);b.append(c,l);
 if(favorites.includes(g.id)){const star=document.createElement('span');star.className='star';star.textContent='★';star.setAttribute('aria-hidden','true');b.append(star)}
 b.addEventListener('mousedown',e=>e.preventDefault());b.addEventListener('click',()=>{if(inspect){detailId=g.id;renderDetail();$('detail').scrollIntoView({block:'nearest',behavior:'auto'})}else insertText(g.char,g.id)});
 b.addEventListener('contextmenu',e=>{e.preventDefault();detailId=g.id;renderDetail();$('detail').scrollIntoView({block:'nearest',behavior:'auto'})});return b
}
const categories=['all','favorites','People','Actions','Grammar','Nature','World','Properties','Space','Time','Numbers'];
function renderCategories(){const el=$('categories');el.replaceChildren();for(const cat of categories){const b=document.createElement('button');b.textContent=t(cat);b.dataset.cat=cat;b.setAttribute('aria-pressed',String(category===cat));b.onclick=()=>{category=cat;renderCategories();renderResults()};el.append(b)}}
function renderResults(){const q=$('search').value,gs=M.search(q,category,favorites),el=$('results');el.replaceChildren();$('result-count').textContent=t('matchCount')(gs.length);if(!gs.length){const p=document.createElement('p');p.className='muted';p.style.gridColumn='1/-1';p.textContent=t(category==='favorites'&&!favorites.length?'favoritesEmpty':'noResults');el.append(p)}else for(const g of gs)el.append(glyphButton(g))}
function renderRecent(){const el=$('recents');el.replaceChildren();$('recents-wrap').hidden=!recent.length;for(const id of recent)el.append(glyphButton(M.byId.get(id)))}
function renderDetail(){const g=M.byId.get(detailId);$('detail').hidden=!g;if(!g)return;$('detail-glyph').textContent=g.char;$('detail-name').textContent=name(g);$('detail-secondary').textContent=other(g);$('detail-code').textContent='U+'+g.cp.toString(16).toUpperCase()+' · '+t(g.marker||'none');$('detail-note').textContent=t('sourceNote')+(lang==='ko'&&g.note_ko?' '+g.note_ko:'');$('detail-fav').textContent=t(favorites.includes(g.id)?'unfavorite':'favorite')}
function renderReader(){if(!shared)return;$('read-message').textContent=shared.text;$('read-gloss').textContent=M.gloss(shared.text,lang==='ko');$('read-gloss').hidden=!showGloss;$('read-toggle').textContent=t(showGloss?'hideGloss':'showGloss');$('read-warning').hidden=!shared.unknown.length;$('read-warning').textContent=t('unknown');$('read-open').disabled=!!shared.unknown.length}
function translate(){
 document.documentElement.lang=lang;for(const el of document.querySelectorAll('[data-i]'))el.textContent=t(el.dataset.i);
 $('share-more').textContent=t($('share-more').getAttribute('aria-expanded')==='true'?'less':'more');$('lang-ko').setAttribute('aria-pressed',String(lang==='ko'));$('lang-en').setAttribute('aria-pressed',String(lang==='en'));
 $('search').placeholder=t('search');editor.placeholder=t('placeholder');$('mode').textContent=t(inspect?'insertMode':'browse');$('mode').setAttribute('aria-pressed',String(inspect));renderCategories();refresh();renderReader()
}
$('lang-ko').onclick=()=>{lang='ko';translate()};$('lang-en').onclick=()=>{lang='en';translate()};
$('mode').onclick=()=>{inspect=!inspect;translate()};$('reset-search').onclick=()=>{$('search').value='';category='all';renderCategories();renderResults()};
$('search').addEventListener('compositionstart',()=>searchComposing=true);$('search').addEventListener('compositionend',()=>{searchComposing=false;renderResults()});$('search').addEventListener('input',()=>{if(!searchComposing)renderResults()});
$('search').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.isComposing&&!searchComposing){const gs=M.search($('search').value,category,favorites);if(gs.length===1){e.preventDefault();if(inspect){detailId=gs[0].id;renderDetail()}else insertText(gs[0].char,gs[0].id)}}});
$('detail-insert').onclick=()=>{const g=M.byId.get(detailId);if(g)insertText(g.char,g.id)};
$('detail-fav').onclick=()=>{if(!M.byId.has(detailId))return;favorites=favorites.includes(detailId)?favorites.filter(id=>id!==detailId):[...favorites,detailId];save();renderResults();renderRecent();renderDetail()};
$('detail-close').onclick=()=>{detailId=null;renderDetail()};
editor.addEventListener('compositionstart',()=>isComposing=true);editor.addEventListener('compositionend',()=>{isComposing=false;handleInput()});
function handleInput(){if(isComposing)return;const s=snap(),r=M.convert(s.text,s.start,s.end);if(r)commit(r.text,r.caret,r.id);else{if(s.text.length>M.MAX){editor.value=s.text.slice(0,M.MAX);notify('tooLong')}for(const c of Array.from(editor.value.slice(Math.max(0,editor.selectionStart-1),editor.selectionStart)))markRecent(M.byChar.get(c)?.id);record();refreshEditor();renderRecent()}}
editor.addEventListener('input',handleInput);for(const ev of ['select','keyup','click','focus'])editor.addEventListener(ev,renderForms);
editor.addEventListener('keydown',e=>{if(isComposing||e.isComposing)return;if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'){e.preventDefault();navigateHistory(e.shiftKey?1:-1)}else if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='y'){e.preventDefault();navigateHistory(1)}});
for(const id of ['undo','redo','space','newline','backspace','clear'])$(id).addEventListener('mousedown',e=>e.preventDefault());
$('undo').onclick=()=>navigateHistory(-1);$('redo').onclick=()=>navigateHistory(1);$('space').onclick=()=>insertText(' ');$('newline').onclick=()=>insertText('\n');
$('backspace').onclick=()=>{const s=snap();let start=s.start;if(start===s.end&&start>0)start-=Array.from(s.text.slice(0,start)).at(-1).length;commit(s.text.slice(0,start)+s.text.slice(s.end),start)};
$('clear').onclick=()=>{if(editor.value&&confirm(t('clearConfirm')))commit('',0)};
async function copyText(text,key='copied'){try{await navigator.clipboard.writeText(text);notify(key);return true}catch{const tmp=document.createElement('textarea');tmp.value=text;tmp.style.position='fixed';tmp.style.left='-10000px';document.body.append(tmp);tmp.select();let ok=false;try{ok=document.execCommand('copy')}catch{}tmp.remove();if(ok){notify(key);return true}window.prompt(t('copyFailed'),text);return false}}
function download(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500)}
function getMessage(){if(!editor.value.trim()){notify('empty');return null}return editor.value}
$('share-more').onclick=()=>{const b=$('share-more'),open=b.getAttribute('aria-expanded')!=='true';b.setAttribute('aria-expanded',String(open));b.closest('.share-row').dataset.expanded=String(open);b.textContent=t(open?'less':'more')};
$('copy').onclick=()=>{const s=getMessage();if(s!==null)copyText(s)};
$('portable').onclick=()=>{const s=getMessage();if(s!==null)copyText(M.encode(s),'portableSaved')};
$('share').onclick=async()=>{const s=getMessage();if(s===null)return;try{const link=data.shareBase+M.hash(s);if(link.length>8000){notify('shareLong');return}if(navigator.share){try{await navigator.share({title:t('shareTitle'),url:link});return}catch(e){if(e.name==='AbortError')return}}await copyText(link)}catch{notify('shareErr')}};
async function makePNG(text){
 const font='54px Yubae, system-ui, sans-serif';const loaded=await document.fonts.load('54px Yubae','\uE00A');if(!loaded.length)throw Error('font');
 const canvas=document.createElement('canvas');canvas.width=1000;const ctx=canvas.getContext('2d');ctx.font=font;const pad=45,maxWidth=canvas.width-2*pad;let lines=[],line='';
 for(const c of text){if(c==='\r')continue;if(c==='\n'){lines.push(line);line='';continue}if(line&&ctx.measureText(line+c).width>maxWidth){lines.push(line);line=c}else line+=c}lines.push(line);
 if(lines.length*83+2*pad>8192)throw Error('length');canvas.height=Math.max(174,lines.length*83+2*pad);
 ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle='#20272a';ctx.font=font;ctx.textBaseline='top';for(let i=0;i<lines.length;i++)ctx.fillText(lines[i],pad,pad+i*83);
 return await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error('png')),'image/png'))
}
$('png').onclick=async()=>{const s=getMessage();if(s===null)return;$('png').disabled=true;try{const blob=await makePNG(s),file=new File([blob],'yubae-message.png',{type:'image/png'});if(navigator.canShare?.({files:[file]})&&navigator.share){try{await navigator.share({files:[file]});return}catch(e){if(e.name==='AbortError')return}}download(blob,file.name);notify('imageSaved')}catch{notify('exportErr')}finally{$('png').disabled=false}};
$('import').onclick=()=>{$('import-value').value='';$('import-dialog').showModal()};
$('import-apply').onclick=()=>{const raw=$('import-value').value;try{let r;if(raw.trimStart().startsWith('{'))r=M.decode(raw);else if(raw.includes('#m=')){const h=raw.slice(raw.indexOf('#m='));r=M.readHash(h)}else r={text:raw,unknown:[]};if(r.unknown.length){notify('unknownImport');return}if(insertText(r.text))$('import-dialog').close()}catch{notify('importFailed')}};
function readLocation(){
 try{shared=M.readHash(location.hash);if(shared){showGloss=false;$('reader').hidden=false;$('workspace').hidden=true;renderReader()}else{$('reader').hidden=true;$('workspace').hidden=false}}
 catch{shared=null;$('reader').hidden=true;$('workspace').hidden=false;notify('readMalformed')}
}
function exitReader(){historyReplaceHash();shared=null;$('reader').hidden=true;$('workspace').hidden=false}
function historyReplaceHash(){try{window.history.replaceState(null,'',location.pathname+location.search)}catch{}}
$('read-toggle').onclick=()=>{showGloss=!showGloss;renderReader()};$('read-copy').onclick=()=>{if(shared)copyText(shared.text)};
$('read-save').onclick=()=>{if(shared)copyText(shared.raw,'portableSaved')};
$('read-reply').onclick=exitReader;$('read-open').onclick=()=>{if(!shared||shared.unknown.length)return;if(editor.value&&!confirm(t('replaceConfirm')))return;const text=shared.text;exitReader();commit(text,text.length)};
window.addEventListener('hashchange',readLocation);
$('version').textContent=data.version;
$('offline-download').hidden=location.protocol==='file:';
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;$('install').hidden=false});
$('install').onclick=async()=>{if(!installPrompt){notify('unsupportedInstall');return}await installPrompt.prompt();installPrompt=null;$('install').hidden=true};
window.addEventListener('appinstalled',()=>{$('install').hidden=true;installPrompt=null});
if('serviceWorker'in navigator&&location.protocol!=='file:'&&data.hosted){
 const showWaiting=w=>{waitingWorker=w;$('update-banner').hidden=false};
 navigator.serviceWorker.register('./sw.js').then(reg=>{
  if(reg.waiting&&navigator.serviceWorker.controller)showWaiting(reg.waiting);
  reg.addEventListener('updatefound',()=>{const w=reg.installing;if(!w)return;w.addEventListener('statechange',()=>{if(w.state==='installed'&&navigator.serviceWorker.controller)showWaiting(w)})});
  window.addEventListener('focus',()=>reg.update().catch(()=>{}));setInterval(()=>{if(document.visibilityState==='visible')reg.update().catch(()=>{})},3600000)
 }).catch(()=>{});
 navigator.serviceWorker.addEventListener('controllerchange',()=>{if(approvedUpdate)location.reload()});
 $('update').onclick=()=>{if(!waitingWorker)return;if(!save()&&editor.value){notify('notSaved');return}approvedUpdate=true;waitingWorker.postMessage({type:'ACTIVATE'})}
}
translate();readLocation();
document.fonts.load('32px Yubae','\uE00A').then(f=>{if(!f.length)notify('fontErr')}).catch(()=>notify('fontErr'));
