// SPDX-License-Identifier: GPL-3.0-or-later
// Local learning, advisory checks and opt-in positional keyboard trial.
const L=YubaeLearning.createLearning(M,data.directLayout,data.curriculum);
Object.assign(words.en,{
 learnOpen:'Learn',learnTitle:'Learn Yubae',learnDisclaimer:'Practice uses our provisional reference vocabulary, not an official course. Progress stays on this device.',learnInput:'Your practice answer',learnHint:'Show hint',learnCheck:'Check answer',learnBack:'Lessons',learnNext:'Continue',learnRead:'What does this character mean?',learnType:'Write this character',learnCorrect:'Correct!',learnTry:'Not quite. Here is the reference form.',learnDone:'Lesson complete',learnReview:'Review due cards',learnNoDue:'Nothing due right now. Choose a lesson to practice again.',learnCards:n=>n+' exercises',learnDue:n=>n+' due',learnResults:(n,total)=>n+' / '+total+' correct',learnProgress:(n,total)=>n+' of '+total,
 directOff:'Direct keys: off',directOn:'Direct keys: on',directTitle:'Trial QWERTY layout',directHint:'Letters and unmodified digits write roots. Shift and right Alt select other layers. Type punctuation for markers. Turn this mode off for Latin/Hangul or mnemonic entry.',base:'Normal',shift:'Shift',altgr:'AltGr / Option','shift-altgr':'Shift + AltGr',
 checkWriting:'Check writing',checkDisclaimer:'Advisory registry checks only. Unknown bare roots are valid writing, not spelling errors. No automatic correction or grammar judgment.',checkClear:'No unknown root meanings or unregistered private-use symbols found.',checkUnknown:'Bare root: standalone meaning unknown',checkUnregistered:'Symbol outside our registry',checkSelect:'Select',checkForms:'Documented related forms:',checkMore:n=>n+' additional notices'
});
Object.assign(words.ko,{
 learnOpen:'학습',learnTitle:'유배지어 학습',learnDisclaimer:'잠정 참고 어휘를 사용하는 연습이며 공식 강좌가 아닙니다. 학습 기록은 이 기기에만 저장됩니다.',learnInput:'연습 답안',learnHint:'힌트 보기',learnCheck:'정답 확인',learnBack:'학습 목록',learnNext:'계속',learnRead:'이 문자의 뜻은 무엇인가요?',learnType:'이 문자를 입력하세요',learnCorrect:'정답입니다!',learnTry:'아쉽네요. 참고 문자 형태를 확인하세요.',learnDone:'학습 완료',learnReview:'복습할 카드',learnNoDue:'지금 복습할 카드가 없습니다. 학습을 선택해 다시 연습할 수 있습니다.',learnCards:n=>n+'개 연습',learnDue:n=>n+'개 복습',learnResults:(n,total)=>total+'개 중 '+n+'개 정답',learnProgress:(n,total)=>n+' / '+total,
 directOff:'직접 입력: 끔',directOn:'직접 입력: 켬',directTitle:'시험 QWERTY 자판',directHint:'영문 키 위치와 숫자로 어근을 입력합니다. Shift와 오른쪽 Alt로 다른 층을 선택합니다. 문장부호 키로 표지를 적용합니다. 한글·영문·단축어 입력 시 이 모드를 끄세요.',base:'기본',shift:'Shift',altgr:'AltGr / Option','shift-altgr':'Shift + AltGr',
 checkWriting:'글 확인',checkDisclaimer:'참고 문자표를 기준으로 안내합니다. 뜻이 미확인된 어근도 올바른 입력입니다. 자동 수정이나 문법 판정은 하지 않습니다.',checkClear:'뜻이 미확인된 어근이나 미등록 사적 사용 영역 문자가 없습니다.',checkUnknown:'어근: 독립적인 뜻 미확인',checkUnregistered:'문자표에 없는 기호',checkSelect:'선택',checkForms:'기록된 관련 형태:',checkMore:n=>'추가 안내 '+n+'개'
});
const el=(tag,cls,text)=>{const node=document.createElement(tag);if(cls)node.className=cls;if(text!==undefined)node.textContent=text;return node};
const keyButton=(text,handler)=>{const b=el('button','',text);b.type='button';b.addEventListener('mousedown',e=>e.preventDefault());b.onclick=handler;return b};
const isMac=/Mac|iPhone|iPad/.test(navigator.platform||'');
let heldRightAlt=false;
document.addEventListener('keydown',e=>{if(e.code==='AltRight')heldRightAlt=true},true);
document.addEventListener('keyup',e=>{if(e.code==='AltRight')heldRightAlt=false},true);
window.addEventListener('blur',()=>{heldRightAlt=false;endPending();learnPending=null});
const layerRows=['qwertyuiop','asdfghjkl','zxcvbnm'];
function rootChar(rid){return M.byId.get(M.rootById.get(rid).bare_id)}
function renderKeyBoard(container,layer,onLayer,onRoot){
 container.replaceChildren();
 const tabs=el('div','actions layer-tabs');
 for(const id of YubaeLearning.LAYERS){const b=keyButton(t(id),()=>onLayer(id));b.setAttribute('aria-pressed',String(id===layer));tabs.append(b)}
 container.append(tabs);
 const groups=[['0123456789',L.layout.digits],...layerRows.map(row=>[row,L.mappings.get(layer)])];
 for(const [row,map] of groups){
  const line=el('div','direct-row');
  for(const k of row){
   const rid=map[k],b=keyButton('',()=>onRoot(rid));b.className='direct-key';b.disabled=!rid;b.dataset.key=k;
   b.append(el('span','direct-cap',k.toUpperCase()));
   if(rid){b.dataset.root=rid;const r=M.rootById.get(rid),g=M.byId.get(r.representative);b.append(el('span','glyph',rootChar(rid).char));b.title=name(g);b.setAttribute('aria-label',k.toUpperCase()+': '+name(g))}
   else b.append(el('span','muted','—'));
   line.append(b)
  }
  container.append(line)
 }
}
let directMode=false,directLayer='base';
function renderDirect(){
 const b=$('direct-toggle');b.textContent=t(directMode?'directOn':'directOff');b.setAttribute('aria-pressed',String(directMode));$('direct-board').hidden=!directMode;
 if(directMode)renderKeyBoard($('direct-keys'),directLayer,l=>{directLayer=l;renderDirect()},rid=>{const g=rootChar(rid);editor.focus();insertText(g.char,g.id,rid)})
}
$('direct-toggle').onclick=()=>{directMode=!directMode;endPending();renderDirect();editor.focus()};
editor.addEventListener('keydown',e=>{
 if(!directMode||e.defaultPrevented||isComposing)return;
 const rid=L.resolvePhysical(e,heldRightAlt,isMac);if(!rid)return;
 e.preventDefault();const g=rootChar(rid);insertText(g.char,g.id,rid)
});
// Neutral, explicit checks; do not silently modify text or judge unknown words.
function renderChecks(){
 const wrap=$('check-results');wrap.replaceChildren();const found=L.writingChecks(editor.value);
 if(!found.length){wrap.append(el('p','muted',t('checkClear')));return}
 for(const issue of found.slice(0,30)){
  const line=el('div','check-line'),s=el('span','glyph check-symbol',editor.value.slice(issue.index,issue.index+issue.length)),body=el('div','check-body');
  body.append(el('strong','',t(issue.kind==='unknown-meaning'?'checkUnknown':'checkUnregistered')));
  if(issue.forms?.length)body.append(el('p','muted',t('checkForms')+' '+issue.forms.map(id=>name(M.byId.get(id))).join(' / ')));
  const b=keyButton(t('checkSelect'),()=>{endPending();editor.focus();editor.setSelectionRange(issue.index,issue.index+issue.length);renderForms()});
  line.append(s,body,b);wrap.append(line)
 }
 if(found.length>30)wrap.append(el('p','muted',t('checkMore')(found.length-30)))
}
$('check-open').onclick=()=>{$('writing-check').hidden=false;renderChecks()};
$('check-close').onclick=()=>{$('writing-check').hidden=true};
const originalRefreshEditor=refreshEditor;
refreshEditor=function(){originalRefreshEditor();if(!$('writing-check').hidden)renderChecks()};
const learn=$('learn-dialog'),li=$('learn-input'),PROGRESS='yubae-learn-v1';
let progress={};try{const p=JSON.parse(localStorage.getItem(PROGRESS)||'{}');if(p&&typeof p==='object'&&!Array.isArray(p))progress=p}catch{}
let session=[],cardIndex=0,score=0,graded=false,correct=false,learnDirect=true,learnLayer='base',learnPending=null,learnComposing=false,showLearnHint=false,learnFocus=null;
const current=()=>session[cardIndex];
function saveProgress(){try{localStorage.setItem(PROGRESS,JSON.stringify(progress))}catch{}}
function lessonName(lesson){return lang==='ko'?lesson.ko:lesson.en}
function showLessons(){
 $('learn-setup').hidden=false;$('learn-quiz').hidden=true;session=[];
 const wrap=$('learn-lessons');wrap.replaceChildren();
 for(const lesson of L.lessons.values()){
  const b=keyButton('',()=>startLesson(lesson.id));b.className='lesson-card';
  b.append(el('strong','',lessonName(lesson)),el('span','muted',lang==='ko'?lesson.description_ko:lesson.description_en),el('span','muted',t('learnCards')(lesson.forms.length*2)));wrap.append(b)
 }
 const due=L.makeSession('review',progress).length;
 const review=keyButton('',()=>startLesson('review'));review.className='lesson-card';review.append(el('strong','',t('learnReview')),el('span','muted',due?t('learnDue')(due):t('learnNoDue')));wrap.append(review)
}
function startLesson(id){session=L.makeSession(id,progress);cardIndex=0;score=0;$('learn-setup').hidden=true;$('learn-quiz').hidden=false;newCard()}
function newCard(){graded=false;correct=false;learnPending=null;learnLayer='base';showLearnHint=false;li.value='';renderLesson()}
function openLearn(){if(learn.open)return;learnFocus=document.activeElement;endPending();showLessons();learn.showModal()}
function closeLearn(){learn.close();learnPending=null;learnFocus?.focus()}
$('learn-open').onclick=openLearn;$('learn-close').onclick=closeLearn;
learn.addEventListener('cancel',e=>{if(learnComposing)e.preventDefault();else{e.preventDefault();closeLearn()}});
$('learn-back').onclick=showLessons;
$('learn-next').onclick=()=>{if(cardIndex>=session.length){showLessons();return}if(graded){cardIndex++;newCard()}};
function setPractice(text,caret,root=null){li.value=text;li.focus();li.setSelectionRange(caret,caret);learnPending=root?{root,text,caret}:null;renderLearnMods()}
function practiceRoot(rid){if(graded)return;const g=rootChar(rid),a=li.selectionStart,b=li.selectionEnd;if(li.value.length-(b-a)>=64)return;setPractice(li.value.slice(0,a)+g.char+li.value.slice(b),a+g.char.length,rid)}
function activeLearn(){return learnPending&&li.value===learnPending.text&&li.selectionStart===learnPending.caret&&li.selectionEnd===learnPending.caret?learnPending:null}
function practiceMod(mod){const a=activeLearn();if(!a||graded)return false;const target=M.rootForm(a.root,mod);if(!target)return false;setPractice(li.value.slice(0,a.caret-1)+target.char+li.value.slice(a.caret),a.caret);return true}
function renderLearnMods(){
 const wrap=$('learn-modifiers');wrap.replaceChildren();const a=activeLearn();
 for(const [key,kind] of Object.entries(data.modifierKeys)){const g=a&&M.rootForm(a.root,kind),b=keyButton(key+' · '+t(kind),()=>practiceMod(kind));b.disabled=graded||!g;wrap.append(b)}
}
function renderPracticeBoard(){renderKeyBoard($('learn-keys'),learnLayer,l=>{learnLayer=l;renderPracticeBoard()},practiceRoot);renderLearnMods()}
$('learn-direct').onclick=()=>{learnDirect=!learnDirect;learnPending=null;$('learn-direct').textContent=t(learnDirect?'directOn':'directOff');$('learn-direct').setAttribute('aria-pressed',String(learnDirect));li.focus()};
li.addEventListener('compositionstart',()=>{learnComposing=true;learnPending=null});
li.addEventListener('compositionend',()=>{learnComposing=false;practiceInput()});
function practiceInput(){if(learnComposing||graded)return;learnPending=null;const r=M.convert(li.value,li.selectionStart,li.selectionEnd);if(r)setPractice(r.text,r.caret,r.rootId);else renderLearnMods()}
li.addEventListener('input',practiceInput);
li.addEventListener('select',()=>{if(!activeLearn())learnPending=null;renderLearnMods()});
li.addEventListener('keydown',e=>{
 if(graded||learnComposing||e.isComposing)return;
 if(e.key==='Escape'&&activeLearn()){e.preventDefault();e.stopPropagation();learnPending=null;renderLearnMods();return}
 if(!e.ctrlKey&&!e.metaKey&&!e.altKey&&activeLearn()&&Object.hasOwn(data.modifierKeys,e.key)){
  if(practiceMod(data.modifierKeys[e.key])){e.preventDefault();return}learnPending=null
 }
 if(learnDirect){const rid=L.resolvePhysical(e,heldRightAlt,isMac);if(rid){e.preventDefault();practiceRoot(rid);return}}
 if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();checkPractice();return}
 if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End','Tab'].includes(e.key)){learnPending=null;renderLearnMods()}
});
function showHint(){
 const c=current();if(!c)return;const g=M.byId.get(c.id),r=M.rootByForm.get(c.id),loc=L.locations.get(r.id),f=r.forms.find(f=>f.id===g.id),mark=Object.entries(data.modifierKeys).find(([,m])=>m===f.kind)?.[0];
 $('learn-hint-text').hidden=!showLearnHint;$('learn-hint-text').textContent=(loc.layer==='base'?'':t(loc.layer)+' + ')+loc.key.toUpperCase()+(mark?' → '+mark:'')+' · '+(';'+M.compactByRoot.get(r.id)+';')+(mark||'');
}
$('learn-hint').onclick=()=>{showLearnHint=!showLearnHint;if(showLearnHint){learnLayer=L.locations.get(M.rootByForm.get(current().id).id).layer;renderPracticeBoard()}showHint()};
function answer(ok){
 if(graded||!current())return;graded=true;correct=ok;score+=Number(ok);
 progress[current().key]=L.grade(progress[current().key],ok);saveProgress();renderLesson()
}
function checkPractice(){if(!graded&&li.value.length)answer(li.value.trim()===M.byId.get(current().id).char)}
$('learn-check').onclick=checkPractice;
function renderLesson(){
 const c=current(),total=session.length;
 $('learn-count').textContent=t('learnProgress')(Math.min(cardIndex+1,total),total);$('learn-score').textContent=t('learnResults')(score,cardIndex+Number(graded));$('learn-progress').max=Math.max(1,total);$('learn-progress').value=Math.min(total,cardIndex+Number(graded));
 $('learn-options').replaceChildren();$('learn-feedback').replaceChildren();$('learn-feedback').hidden=true;$('learn-next').disabled=!graded;
 if(!c){$('learn-prompt').textContent=total?t('learnDone'):t('learnNoDue');$('learn-target').textContent=total?t('learnResults')(score,total):'';$('learn-target').className='learn-target';$('learn-typing').hidden=true;$('learn-next').disabled=false;return}
 const g=M.byId.get(c.id),read=c.mode==='read';$('learn-prompt').textContent=t(read?'learnRead':'learnType');$('learn-target').className=read?'glyph learn-target':'learn-target';$('learn-target').textContent=read?g.char:name(g);$('learn-typing').hidden=read;
 if(read){
  for(const option of L.options(c)){const b=keyButton(name(option),()=>answer(option.id===c.id));b.disabled=graded;b.dataset.answer=option.id;if(graded&&option.id===c.id)b.classList.add('correct-choice');$('learn-options').append(b)}
 }else{
  $('learn-direct').textContent=t(learnDirect?'directOn':'directOff');$('learn-direct').setAttribute('aria-pressed',String(learnDirect));li.readOnly=graded;$('learn-check').disabled=graded;renderPracticeBoard();showHint()
 }
 if(graded){const fb=$('learn-feedback');fb.hidden=false;fb.append(el('strong','',t(correct?'learnCorrect':'learnTry')),el('span','glyph',g.char),el('span','',name(g)));$('learn-next').focus()}
}
function localLanguage(){renderDirect();if(learn.open){if($('learn-setup').hidden)renderLesson();else showLessons()}if(!$('writing-check').hidden)renderChecks()}
$('lang-ko').addEventListener('click',localLanguage);$('lang-en').addEventListener('click',localLanguage);
translate();renderDirect();
