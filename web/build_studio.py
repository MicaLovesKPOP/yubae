# SPDX-License-Identifier: GPL-3.0-or-later
"""Generate a self-contained offline app and deployable static PWA from the native registry."""
from pathlib import Path
import json,base64,hashlib,struct,zlib,math,zipfile,io,shutil,sys
from fontTools.ttLib import TTFont
P=Path(__file__).resolve().parent;ROOT=P.parent;D=ROOT/'data';N=ROOT/'source'/'native';OUT=ROOT/'dist';SITE=OUT/'site'
VERSION='0.5.0-alpha.2'
SHARE_BASE='https://micaloveskpop.github.io/yubae/'
def read_json(name):return json.loads((D/name).read_text(encoding='utf-8'))
def read(name):return (P/name).read_text(encoding='utf-8')
lex=read_json('lexicon.json');mn=read_json('mnemonics.json');comps=read_json('composition.json');baseline=read_json('encoding-v1.json')
assert {g['id']:g['cp'] for g in lex}==baseline
assert all(g['char']==chr(g['cp']) for g in lex)
sys.path.insert(0,str(ROOT/'source'))
from root_registry import make_registry
roots=make_registry()
assert {x['id'] for r in roots for x in r['forms']}==set(baseline)
(D/'root-registry.json').write_text(json.dumps(roots,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
# Use the exact font packaged in Keyman, not a separate interpretation.
with zipfile.ZipFile(N/'exile.kmp') as z:
 assert z.testzip() is None
 meta=json.loads(z.read('kmp.json'))
 font=z.read(meta['keyboards'][0]['oskFont'])
f=TTFont(io.BytesIO(font));assert set(f.getBestCmap())=={32,*baseline.values()}
data={'version':VERSION,'encoding':'yubae-private-v1','shareBase':SHARE_BASE,'lexicon':lex,'mnemonics':mn,'composition':comps,'roots':roots}
fontcss="@font-face{font-family:Yubae;src:url(data:font/ttf;base64,"+base64.b64encode(font).decode('ascii')+") format('truetype');font-weight:400;font-style:normal;font-display:block;}"
template=read('index.template.html');css=read('studio.css');model=read('model.js');app=read('studio.js')
assert '</script' not in model.lower()+app.lower()
def html(hosted):
 registry=json.dumps({**data,'hosted':hosted},ensure_ascii=False,separators=(',',':')).replace('<','\\u003c').replace('&','\\u0026')
 manifest='<link rel="manifest" href="./manifest.webmanifest"><link rel="icon" type="image/png" href="./icon-192.png"><link rel="apple-touch-icon" href="./icon-192.png">' if hosted else ''
 out=template
 for a,b in [('<!--MANIFEST-->',manifest),('/*FONT*/',fontcss),('/*CSS*/',css),('/*DATA*/',registry),('/*MODEL*/',model),('/*APP*/',app)]:
  assert out.count(a)==1,a
  out=out.replace(a,b)
 return out
SITE.mkdir(parents=True,exist_ok=True)
offline=html(False)
(OUT/'Yubae_Studio.html').write_text(offline,encoding='utf-8')
(SITE/'Yubae_Studio.html').write_text(offline,encoding='utf-8')
(SITE/'index.html').write_text(html(True),encoding='utf-8')
manifest={'id':'./','name':'Yubae Studio · 유배지어','short_name':'Yubae','description':'Unofficial Korean-English Exile Zone writing toolkit','start_url':'./','scope':'./','display':'standalone','background_color':'#f5f3ef','theme_color':'#f5f3ef','icons':[{'src':f'icon-{size}.png','sizes':f'{size}x{size}','type':'image/png','purpose':'any maskable'} for size in (192,512)]}
(SITE/'manifest.webmanifest').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
# Original icon: our reconstructed human mark, simple green tile; no show assets.
def dist_seg(x,y,a,b):
 ax,ay=a;bx,by=b;dx,dy=bx-ax,by-ay;t=max(0,min(1,((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy)))
 return math.hypot(x-ax-t*dx,y-ay-t*dy)
def png(size):
 segments=[((.30,.30),(.70,.30)),((.50,.41),(.31,.71)),((.31,.71),(.69,.71)),((.69,.71),(.50,.41))]
 rows=[]
 for y in range(size):
  row=bytearray([0])
  for x in range(size):
   d=min(dist_seg((x+.5)/size,(y+.5)/size,a,b) for a,b in segments)
   coverage=max(0,min(1,(.018-d)*size+.5))
   row.extend(round(bg+(fg-bg)*coverage) for bg,fg in zip((38,88,77),(246,243,232)))
  rows.append(bytes(row))
 def chunk(t,v):return struct.pack('>I',len(v))+t+v+struct.pack('>I',zlib.crc32(t+v)&0xffffffff)
 return b'\x89PNG\r\n\x1a\n'+chunk(b'IHDR',struct.pack('>IIBBBBB',size,size,8,2,0,0,0))+chunk(b'IDAT',zlib.compress(b''.join(rows),9))+chunk(b'IEND',b'')
for size in (192,512):(SITE/f'icon-{size}.png').write_bytes(png(size))
h=hashlib.sha256()
for p in sorted(SITE.iterdir()):
 if p.name in ('index.html','manifest.webmanifest','icon-192.png','icon-512.png','Yubae_Studio.html'):h.update(p.read_bytes())
hashid=h.hexdigest()[:16]
(SITE/'sw.js').write_text(read('sw.template.js').replace('/*BUILD_HASH*/',hashid),encoding='utf-8')
(SITE/'.nojekyll').write_bytes(b'')
# License notices available alongside the distributed application. Code and corresponding source live in main.
for name in ('LICENSE','RIGHTS.md'):
 shutil.copy2(ROOT/name,SITE/name)
lic=SITE/'LICENSES';lic.mkdir(exist_ok=True)
for p in (ROOT/'LICENSES').glob('*'):
 if p.is_file():shutil.copy2(p,lic/p.name)
(OUT/'STUDIO_SHA256SUMS.txt').write_text(hashlib.sha256((OUT/'Yubae_Studio.html').read_bytes()).hexdigest()+'  Yubae_Studio.html\n',encoding='ascii')
print(f'Built Studio {VERSION}: {len(lex)} shared glyphs, {len(mn)} shortcuts, {len(comps)} form records, {len(roots)} picker roots; cache {hashid}.')
