"""Bilingual lexicon metadata. All existing codepoints are immutable.
Glosses are editorial and provisional, not a transcription of an official dictionary.
Search aliases may be broader than exact translations. Ambiguous aliases never auto-convert.
"""
import unicodedata, re
from collections import defaultdict
from glyphs import G
# Korean display label | search synonyms; corrections based on Korean corpus leads are explicitly noted in docs.
KO={
'0':'0|영,공,제로','1':'1|일,하나','2':'2|이,둘','3':'3|삼,셋','4':'4|사,넷','5':'5|오,다섯',
'6':'6|육,여섯','7':'7|칠,일곱','8':'8|팔,여덟','9':'9|구,아홉',
'human':'사람|인간,인물','head':'머리|두부','has':'있다|가지다,존재하다,소유하다',
'hole':'구멍|공,공간','eat':'먹다|마시다,먹기,마시기','food':'음식|먹이,먹을것,식량',
'bottom':'아래|밑,하단,이하','or':'또는|혹은,아니면','and':'그리고|및,와,과',
'speak':'소리내다|소리 내다,말하다,울음소리,발성하다','above':'위|위에,위쪽,상단',
'see':'보다|보이다,바라보다','left':'왼쪽|좌측,좌','right':'오른쪽|우측,우',
'hear':'듣다|들리다,청취하다','small':'작은|작다,작음','plural':'복수|들,여럿',
'kill':'죽다·죽이다|죽다,죽이다','dead':'죽은|죽은상태','big':'큰|크다,커다란',
'exists-not':'없다|존재하지않다,가지고있지않다','bird':'새|조류','can':'할 수 있다|가능하다,가능,할수있다',
'fruit':'열매|과일','cow':'소|암소,황소','grass':'풀|잔디','spider':'거미|','snake':'뱀|',
'make':'만들다|제작하다,짓다','hand':'손·팔|손,팔','foot':'발·다리|발,다리','body':'몸|신체',
'egg':'알|달걀,계란','become':'되다|변하다','minute':'분|분간','hour':'시간|한시간',
'colour':'색|색깔,빛깔','ocean':'바다|대양,해양','blue':'파란색|파랑,청색,푸른색',
'fire':'불|화염','red':'빨간색|빨강,적색,붉은색','salt':'소금|염','white':'흰색|하양,하얀색,백색',
'tree':'나무|목재,수목','add':'더하다|합치다,덧셈,합하다','purple':'보라색|보라,자주색',
'minus':'빼다|빼기,뺄셈,제하다','water':'물|식수','sand':'모래|','glass':'유리|',
'transparent':'투명색|투명,투명한,무색','path':'길|도로,경로,통로','charcoal':'숯|목탄',
'black':'검은색|검정,검정색,흑색','day':'하루|날,일','earth':'지구|','sun':'태양|해',
'orbit':'돌다|공전하다,회전하다','end':'끝에|끝,마지막,최후','god':'신|신령',
'divine':'신의|신성한','moon':'달|월','shadow':'그림자|','cover':'가리다|덮다,숨기다',
'you':'당신|너','daytime':'낮|낮시간','night':'밤|야간','test':'시험|테스트',
'live':'살다|생존하다,살아있다','number':'숫자|수','magic-square':'마방진|',
'horizontal':'가로|수평','vertical':'세로|수직','diagonal':'대각선|대각','sum':'합|합계,총합',
'pass':'통과하다|통과','poison':'독|독약','spear':'창|','then':'그러면|그럼,그다음',
'place':'곳|장소,여기,이곳','floor':'바닥|마루','dwell':'거주하다|살다,거처하다',
'in':'안에|안,내부,속에'
}
EN={
'speak':'Make a sound / speak','kill':'Die / kill','has':'Exist / have','add':'Add / combine',
'hand':'Hand / arm (review)','foot':'Foot / leg (review)','end':'At the end / final',
'transparent':'Transparent / clear'
}
KO_NOTES={
 'speak':'방송 관련 해독 자료에서 소리 내다의 의미가 제시됨. 말하다로 한정하지 않음.',
 'kill':'주어만 있으면 죽다, 목적어가 있으면 죽이다로 풀이되는 용례가 보고됨.',
 'hand':'팔과 손의 관계를 원본 영상에서 확인해야 함. 검색용 유의어이며 별도 글자로 단정하지 않음.',
 'foot':'다리와 발의 관계를 원본 영상에서 확인해야 함.',
 'purple':'보라색 자체의 의미는 보고되나, 아래 점을 뺀 어근의 의미는 아직 미확인.',
 'end':'품사 표지에 따라 뜻이 달라질 수 있으므로 원전의 형용사·부사형을 별도 확인.',
 'dwell':'살다와 거주하다의 검색 결과는 구분되어야 함.'
}
assert set(KO)=={g['id'] for g in G}, (set(KO)^{g['id'] for g in G})
for g in G:
 label,alts=KO[g['id']].split('|')
 original=g['ko']
 g['ko_key']=label
 g['ko_aliases']=list(dict.fromkeys([label,original,*filter(None,alts.split(','))]))
 if g['id'] in EN:
  g['en_legacy']=g['en']; g['en']=EN[g['id']]
 g['note_ko']=KO_NOTES.get(g['id'],'')
 g['provenance']={'collection':'original-candidate','glyph_evidence':'user-supplied-chart','meaning_evidence':'provisional-chart-gloss','verification':'needs-primary-review'}
 g['marker']=next((name for name,mark in [('noun','M18 13 H82'),('verb','M50 8 m-3.8'),('adjective','M42 18 L58 4'),('adverb','M42 4 L58 18')] if g['path'].startswith(mark)), 'none')
# Compact normalized Hangul lookup; same normalization on web.
def normalize_ko(text):return re.sub(r'\s+','',unicodedata.normalize('NFC',text))
INITIAL='r R s e E f a q Q t T d w W c z x v g'.split()
VOWEL='k o i O j p u P h hk ho hl y n nj np nl b m ml l'.split()
FINAL=' r R rt s sw sg e f fr fa fq ft fx fv fg a q qt t T d w c z x v g'.split(' ')
assert len(INITIAL)==19 and len(VOWEL)==21 and len(FINAL)==28
def dubeolsik(text):
 out=''
 for ch in text:
  n=ord(ch)-0xac00
  if not 0<=n<11172:raise ValueError(text)
  out+=INITIAL[n//588]+VOWEL[n%588//28]+FINAL[n%28]
 return out
def korean_shortcuts():
 candidates=defaultdict(set)
 for g in G:
  for a in g['ko_aliases']:
   a=normalize_ko(a)
   if re.fullmatch('[가-힣]+',a):candidates[a].add(g['id'])
 return {a:next(iter(ids)) for a,ids in candidates.items() if len(ids)==1}, {a:sorted(ids) for a,ids in candidates.items() if len(ids)>1}
