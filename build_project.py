"""Build with pinned dependencies: pip install -r requirements.txt; npm ci."""
from pathlib import Path
import sys,os,subprocess,json,hashlib,zipfile,io,shutil
from fontTools.ttLib import TTFont
P=Path(__file__).resolve().parent; S=P/'source'; B=S/'native'; D=P/'data'; OUT=P/'dist'
def run(*args):
 subprocess.run([str(x) for x in args],cwd=P,check=True)
run(sys.executable,S/'native.py')
kmc=Path(os.environ.get('YUBAE_KMC',str(P/'node_modules'/'.bin'/('kmc.cmd' if os.name=='nt' else 'kmc'))))
if not kmc.is_file():raise SystemExit('Keyman compiler not found; run npm ci or set YUBAE_KMC')
for filename in ('exile.kmn','exile.kps'):
 if os.name=='nt':run('cmd.exe','/d','/c',str(kmc),'build',B/filename)
 else:run(kmc,'build',B/filename)
run('node',S/'test_compiled.cjs')
run(sys.executable,P/'tests'/'test_geometry.py')
run(sys.executable,S/'audit_geometry.py')
lex=json.loads((D/'text-registry.json').read_text(encoding='utf-8'))
baseline=json.loads((D/'encoding-v1.json').read_text(encoding='utf-8'))
current={g['id']:g['cp'] for g in lex}
assert len(set(current.values()))==len(current)==len(lex)
assert all(current.get(id)==cp for id,cp in baseline.items()),'Breaking encoding change'
assert len(baseline)==93
assert current=={**baseline,**json.loads((D/'root-encoding-v1.json').read_text(encoding='utf-8'))}
assert len(current)==160
with zipfile.ZipFile(B/'exile.kmp') as z:
 assert z.testzip() is None
 meta=json.loads(z.read('kmp.json'))
 version=meta['keyboards'][0]['version']
 assert meta['keyboards'][0]['id']=='exile'
 fname=meta['keyboards'][0]['oskFont']
 assert fname==meta['keyboards'][0]['displayFont']
 font=TTFont(io.BytesIO(z.read(fname))); cmap=font.getBestCmap()
 assert set(cmap)=={32,*current.values()}
 assert all(font['glyf'][cmap[cp]].numberOfContours>0 for cp in current.values())
 assert font['OS/2'].fsType==0
 a,b=[font['glyf'][cmap[k]] for k in (0xe003,0xe004)]
 cx,cy=(480,401)
 pts=set(map(tuple,a.coordinates));rot=set(map(tuple,b.coordinates))
 assert a.xMax-a.xMin==a.yMax-a.yMin==b.xMax-b.xMin==b.yMax-b.yMin
 assert pts=={(2*cx-x,y) for x,y in pts}=={(x,2*cy-y) for x,y in pts}
 assert rot=={(cx+y-cy,cy-x+cx) for x,y in pts} and rot!=pts
OUT.mkdir(exist_ok=True)
package=OUT/f'Exile_Keyboard_{version}.kmp';shutil.copy2(B/'exile.kmp',package)
(OUT/'SHA256SUMS.txt').write_text(f'{hashlib.sha256(package.read_bytes()).hexdigest()}  {package.name}\n',encoding='ascii')
print('PASS: immutable legacy encoding, font mapping, package metadata and integrity.')
print(package)
