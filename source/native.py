"""Build native Keyman source and its generated typeface from v0.2 chart source.
No compiler or platform-specific binary is included. Use build_native.ps1 or build_native.sh.
"""
from pathlib import Path
from collections import defaultdict
from itertools import chain
import json,re,xml.etree.ElementTree as ET
from lexicon import G, korean_shortcuts, dubeolsik
from composition import MODS, TRANSFORMS, output_rules
P=Path(__file__).resolve().parent
O=P.parent
# Execute only the font-generation section of the existing v0.2 generator. Keep the font
# geometry and cmap unchanged, rather than rebuilding the writing system for each platform.
exec(compile((P/'build.py').read_text(encoding='utf-8').split('# Public stable mapping.')[0],str(P/'build.py'),'exec'))
B=P/'native'; B.mkdir(exist_ok=True)
# Generate the font in the local build directory, not as a separately distributed file.
(O/'ExileChart.ttf').replace(B/'exilechart_v033.ttf')
from fontTools.ttLib import TTFont
f=TTFont(B/'exilechart_v033.ttf')
f['OS/2'].fsType=0
f['OS/2'].fsSelection |= 0x40
f['head'].fontRevision=0.33
for name in f.getGlyphOrder():
 g=f['glyf'][name]
 g.recalcBounds(f['glyf'])
 advance,_=f['hmtx'][name]
 f['hmtx'][name]=(advance, getattr(g,'xMin',0))
for nameid,value in [(3,'ExileChart-0.3.3'),(5,'Version 0.3.3')]:
 for record in list(f['name'].names):
  if record.nameID==nameid:f['name'].setName(value,nameid,record.platformID,record.platEncID,record.langID)
f.save(B/'exilechart_v033.ttf')


byid={g['id']:g for g in G}; groups=defaultdict(list); lookup=defaultdict(set)
for g in G:
 groups[g['group']].append(g)
 for a in [g['id'],g['en'],g.get('en_legacy',''),*g['aliases']]:
  a=a.lower().strip()
  if re.fullmatch(r'[a-z0-9][a-z0-9-]*',a):lookup[a].add(g['id'])
en_aliases={a:next(iter(v)) for a,v in lookup.items() if len(v)==1}
ko_aliases,ambiguous=korean_shortcuts()
physical=defaultdict(set)
for word,id in ko_aliases.items():physical[dubeolsik(word)].add(id)
ko_physical={code:next(iter(ids)) for code,ids in physical.items() if len(ids)==1}
aliases={**en_aliases,**ko_aliases,**{'k/'+a:id for a,id in ko_physical.items()}}
kmn=['c Yubae; stable private encoding v0.2; keyboard v0.4.0.',"store(&VERSION) '15.0'","store(&NAME) 'Exile Zone'","store(&KEYBOARDVERSION) '0.4.0'","store(&TARGETS) 'any'","store(&LAYOUTFILE) 'exile.keyman-touch-layout'","store(&MNEMONICLAYOUT) '1'",'begin Unicode > use(main)','group(main) using keys','c Explicitly delimited mnemonics: /water; /물; /k/anf;.']
for a,id in sorted(aliases.items(),key=lambda x:(-len(x[0]),x[0])):kmn.append(f"'/{a}' + ';' > U+{byid[id]['cp']:04X}")
for g in G:kmn.append(f"+ [U_{g['cp']:04X}] > U+{g['cp']:04X}")
cats=list(dict.fromkeys(g['category'] for g in G))
homeids=['human','you','has','eat','speak','see','can','and','or','then','in','plural','make','live','water']
short={'Numbers':('123','123'),'People':('People','사람'),'Actions':('Actions','행동'),'World':('World','사물'),'Space':('Space','공간'),'Grammar':('Grammar','문법'),'Properties':('Traits','특성'),'Nature':('Nature','자연'),'Time':('Time','시간')}
navids=set()
def nav(target,label):
 id='T_NAV_'+target.upper().replace('-','_'); navids.add(id)
 return {'id':id,'text':label,'nextlayer':target,'sp':1,'fontsize':'0.65em' if len(label)>6 else '0.72em','font':'sans-serif'}
def key(g,learner,ko,popup=True):
 label=g['ko_key'] if ko else g.get('en_legacy',g['en']).split(' / ')[0]
 label={'Magic square':'Magic sq.','Exists not':'Not exist','할 수 있다':'가능하다','죽다·죽이다':'죽다/죽이다'}.get(label,label)
 k={'id':f'U_{g["cp"]:04X}','text':label if learner else g['char'],'fontsize':'2.05em'}
 if learner:
  k['font']='sans-serif'
  n=len(label)
  k['fontsize']=('0.68em' if n<=3 else '0.56em' if n<=5 else '0.48em') if ko else ('0.65em' if n<=5 else '0.57em' if n<=7 else '0.48em')
 alts=[a for a in groups[g['group']] if a['id']!=g['id']]
 if popup and alts:k['sk']=[key(a,learner,ko,False) for a in alts]
 return k
def prefix(ko,learner):return ('ko-' if ko else '')+('learn-' if learner else '')
def layer(id,ks,ns,lang_target,ko):
 footer=[{'id':'K_LOPT','text':'*Menu*','sp':1,'width':85},nav(lang_target,'EN' if ko else '한글'),{'id':'K_SPACE','text':'공백' if ko else 'Space','width':160,'font':'sans-serif','fontsize':'0.68em'},{'id':'K_BKSP','text':'*BkSp*','sp':1,'width':85},{'id':'K_ENTER','text':'*Enter*','sp':1,'width':85}]
 footer[1]['width']=85
 rows=[ks[i:i+5] for i in range(0,len(ks),5)]+ns+[footer]
 for row in rows[:-1]:
  for i,k in enumerate(row):k['width']=(500*(i+1))//len(row)-(500*i)//len(row)
 return {'id':id,'row':[{'id':i+1,'key':r} for i,r in enumerate(rows)]}
layers=[]
for ko in (False,True):
 for learner in (False,True):
  pre=prefix(ko,learner); other=prefix(ko,not learner); lang=prefix(not ko,learner); home=pre+'default'
  toggle=('문자' if learner else '뜻') if ko else ('Glyphs' if learner else 'ABC')
  menu=[nav(pre+'c'+str(i)+'-0',short[cat][int(ko)]) for i,cat in enumerate(cats)]
  menu.append(nav(other+'default',toggle))
  layers.append(layer(home,[key(byid[x],learner,ko) for x in homeids],[menu[:5],menu[5:]],lang+'default',ko))
  for i,cat in enumerate(cats):
   gs=[g for g in G if g['category']==cat]; chunks=[gs[j:j+15] for j in range(0,len(gs),15)]
   for j,chunk in enumerate(chunks):
    suffix='c'+str(i)+'-'+str(j)
    ns=[nav(home,'홈' if ko else 'Home')]
    if cat=='Grammar':
     labels=('명사','동사','형용사','부사','색') if ko else ('Noun','Verb','Adj.','Adv.','Colour')
     mods=[{'id':'T_MOD_'+m.upper(),'text':label,'fontsize':'0.65em','font':'sans-serif','sp':1} for m,label in zip(MODS,labels)]
     # Grammar has at most 10 entries. Pad out its final lexical row so modifiers
     # have a full distinct row and do not change category key positions.
     assert len(chunk)<=10


    if j:ns.append(nav(pre+'c'+str(i)+'-'+str(j-1),'이전' if ko else 'Prev'))
    if j+1<len(chunks):ns.append(nav(pre+'c'+str(i)+'-'+str(j+1),'다음' if ko else 'Next'))
    ns.append(nav(other+suffix,toggle))
    layers.append(layer(pre+suffix,[key(g,learner,ko) for g in chunk],([mods,ns] if cat=='Grammar' else [ns]),lang+suffix,ko))
for id,form,target in output_rules():
 kmn.append(f"U+{byid[id]['cp']:04X} + [T_MOD_{form.upper()}] > U+{byid[target]['cp']:04X}")
for form in MODS:kmn.append(f"+ [T_MOD_{form.upper()}] > nul")
for id in sorted(navids):kmn.append(f'+ [{id}] > nul')
(B/'exile.kmn').write_text('\n'.join(kmn)+'\n',encoding='utf-8')
(B/'exile.keyman-touch-layout').write_text(json.dumps({'phone':{'displayUnderlying':False,'layer':layers},'tablet':{'displayUnderlying':False,'layer':layers}},ensure_ascii=False,indent=2),encoding='utf-8')
(B/'desktop-mnemonics.json').write_text(json.dumps({'/'+a+';':id for a,id in aliases.items()},ensure_ascii=False,indent=2),encoding='utf-8')
data=O/'data';data.mkdir(exist_ok=True)
(data/'lexicon.json').write_text(json.dumps([{k:v for k,v in g.items() if k not in ('path','fill')} for g in G],ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(data/'mnemonics.json').write_text(json.dumps({'/'+a+';':byid[id]['char'] for a,id in aliases.items()},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(data/'ambiguous-ko.json').write_text(json.dumps(ambiguous,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(data/'composition.json').write_text(json.dumps(TRANSFORMS,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')

# Keyman package source: package language is explicitly private, not an assigned language identifier.
root=ET.Element('Package'); opts=ET.SubElement(root,'Options'); ET.SubElement(opts,'FollowKeyboardVersion').text='True'; info=ET.SubElement(root,'Info')
ET.SubElement(info,'Name').text='Exile Zone / 유배지어 (unofficial)'; ET.SubElement(info,'Version').text='0.4.0'; ET.SubElement(info,'Copyright').text='Unofficial fan reconstruction of handwritten reference.'
files=ET.SubElement(root,'Files')
for file in ['exile.kmx','exile.js','exilechart_v033.ttf','welcome.htm']:
 e=ET.SubElement(files,'File'); ET.SubElement(e,'Name').text=file; ET.SubElement(e,'Description').text=file; ET.SubElement(e,'CopyLocation').text='0'
kb=ET.SubElement(ET.SubElement(root,'Keyboards'),'Keyboard')
for k,v in [('Name','Exile Zone'),('ID','exile'),('Version','0.4.0'),('OSKFont','exilechart_v033.ttf'),('DisplayFont','exilechart_v033.ttf')]:ET.SubElement(kb,k).text=v
ET.SubElement(ET.SubElement(kb,'Languages'),'Language',{'ID':'art-x-exile'}).text='Exile Zone / 유배지어 (unofficial)'
for tag in ('WebOSKFonts','WebDisplayFonts'):ET.SubElement(ET.SubElement(kb,tag),'Font',{'Filename':'exilechart_v033.ttf'})
ET.indent(root); ET.ElementTree(root).write(B/'exile.kps',encoding='utf-8',xml_declaration=True)
(B/'welcome.htm').write_text('''<!doctype html><meta charset="utf-8"><title>Yubae / 유배지어</title><h1>Exile Zone — unofficial keyboard</h1><p>Android and iOS: tap a glyph or hold for related forms. Use 한글 / EN to change navigation language, and ABC / 뜻 / 문자 to change between word labels and glyphs. 한국어: 한글 버튼을 눌러 한국어 메뉴로 전환하고 뜻 버튼으로 한글 뜻을 표시하세요. Windows, macOS and Linux: type /water; or /human; to enter one symbol. On macOS and Linux, use the US English base layout for the mnemonic keys. Korean desktop users can enter /k/anf; using the familiar 두벌식 keys for 물, or use the bilingual browser composer with a normal Korean IME. The Grammar / 문법 page has Noun, Verb, Adj., Adv., Colour controls (명사, 동사, 형용사, 부사, 색). They change the previous character only when its chart-backed equivalent exists; otherwise no change. Ordinary text stays ordinary. The keyboard uses private-use characters U+E000–E05C, not official Unicode. Select Exile Chart in font-aware desktop applications. Other mobile apps may show missing glyphs. Cry is not yet available. No network access or prediction in the keyboard rules.</p><h2>Font check</h2><style>@font-face{font-family:ExileTest;src:url(exilechart_v033.ttf) format('truetype')} .sample{font-family:ExileTest,sans-serif;font-size:36px;line-height:1.5}</style><p>These five characters should be distinct symbols, not boxes:</p><div class="sample">&#xE00A; &#xE00E; &#xE039; &#xE047; &#xE012;</div><p>If they are visible here but not in the keyboard or editor, report that distinction. Switch to readable Korean or English labels if needed.</p>''',encoding='utf-8')

assert len(G)==93 and {g['cp'] for g in G}==set(range(0xE000,0xE05D))
assert len(en_aliases)==142,len(en_aliases)
assert set(en_aliases.values())==set(byid)
assert len({x['id'] for x in layers})==len(layers)==40
lmap={l['id']:l for l in layers}
def mode_of(id):return (id.startswith('ko-'),'learn-' in id)
for l in layers:
 keys=list(chain.from_iterable(r['key'] for r in l['row']))
 assert len({k['id'] for k in keys})==len(keys),l['id']
 assert all(k['nextlayer'] in lmap for k in keys if 'nextlayer' in k)
 assert all(sum(k.get('width',100) for k in r['key'])==500 for r in l['row']),l['id']
for mode in ('default','learn-default','ko-default','ko-learn-default'):
 seen=set();todo=[mode];cps=set()
 while todo:
  id=todo.pop()
  if id in seen:continue
  seen.add(id)
  for k in chain.from_iterable(r['key'] for r in lmap[id]['row']):
   if k['id'].startswith('U_'):cps.add(int(k['id'][2:],16))
   if 'nextlayer' in k and mode_of(k['nextlayer'])==mode_of(mode):todo.append(k['nextlayer'])
 assert len(seen)==10 and cps==set(range(0xE000,0xE05D)),(mode,len(cps))
assert '팔' in ambiguous and '일' in ambiguous and '살다' in ambiguous
assert aliases['물']==aliases['k/anf']=='water'
print(f'{len(G)} glyphs; {len(en_aliases)} English, {len(ko_aliases)} Hangul, {len(ko_physical)} Dubeolsik mnemonics; {len(layers)} layers; {len(ambiguous)} ambiguous aliases excluded')
