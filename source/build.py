from pathlib import Path
import json, base64, collections, re, math
from fontTools.svgLib.path import parse_path
from fontTools.pens.basePen import BasePen
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.fontBuilder import FontBuilder
from shapely.geometry import LineString, Polygon
from shapely.geometry.polygon import orient
from shapely.ops import unary_union
from writable_roots import load
FONT_G,_=load()
P=Path(__file__).resolve().parent; O=P.parent
class Flatten(BasePen):
 def __init__(self): super().__init__(None); self.paths=[]; self.cur=[]
 def _moveTo(self,p):
  if self.cur:self.paths.append(self.cur)
  self.cur=[p]
 def _lineTo(self,p): self.cur.append(p)
 def _curveToOne(self,b,c,d):
  a=self.cur[-1]
  for i in range(1,21):
   t=i/20;s=1-t; self.cur.append(tuple(s**3*a[k]+3*s*s*t*b[k]+3*s*t*t*c[k]+t**3*d[k] for k in (0,1)))
 def _qCurveToOne(self,b,c):
  a=self.cur[-1]
  for i in range(1,21):
   t=i/20;s=1-t;self.cur.append(tuple(s*s*a[k]+2*s*t*b[k]+t*t*c[k] for k in (0,1)))
 def _closePath(self):
  if self.cur and self.cur[-1]!=self.cur[0]:self.cur.append(self.cur[0])
  self._endPath()
 def _endPath(self):
  if self.cur:self.paths.append(self.cur); self.cur=[]
def paths(s):
 p=Flatten();parse_path(s,p);p._endPath();return p.paths
def outline(g):
 # 2.6-unit monoline strokes; shaded chart regions rendered solid for clear small-scale contrast.
 gs=[]
 for q in paths(g['path']):
  if len(q)<2:continue
  line=LineString(q); x0,y0,x1,y1=line.bounds
  radius=2.35
  if line.is_ring and max(x1-x0,y1-y0)<=10:
   radius=min(radius,0.325*min(x1-x0,y1-y0))
  gs.append(line.buffer(radius,cap_style=1,join_style=1,quad_segs=4))
 for q in paths(g['fill']):
  if len(q)>=3: gs.append(Polygon(q).buffer(0))
 return unary_union(gs)
def ttglyph(geometry):
 pen=TTGlyphPen(None)
 for poly in ([geometry] if geometry.geom_type=='Polygon' else geometry.geoms):
  if poly.geom_type!='Polygon' or poly.area<.02: continue
  # SVG y-down -> font y-up. Exterior clockwise after flipping.
  poly=orient(poly,sign=1.)
  for ring in [poly.exterior,*poly.interiors]:
   coords=[]
   for x,y in ring.coords[:-1]:
    pt=(round(40+x*8.8),round(850-y*8.8))
    if not coords or coords[-1]!=pt:coords.append(pt)
   if len(coords)<3:continue
   pen.moveTo(coords[0]);[pen.lineTo(pt) for pt in coords[1:]];pen.closePath()
 return pen.glyph()
font=FontBuilder(1000,isTTF=True)
names=['.notdef','space']+[f'exile{g["cp"]:04X}' for g in FONT_G]
font.setupGlyphOrder(names)
font.setupCharacterMap({32:'space',**{g['cp']:f'exile{g["cp"]:04X}' for g in FONT_G}})
glyphs={'.notdef':ttglyph(LineString([(20,20),(80,20),(80,80),(20,80),(20,20)]).buffer(1.5)), 'space':TTGlyphPen(None).glyph()}
for g in FONT_G:glyphs[f'exile{g["cp"]:04X}']=ttglyph(outline(g))
font.setupGlyf(glyphs)
font.setupHorizontalMetrics({k:(420 if k=='space' else 960,0 if k=='space' else (glyphs[k].xMin if hasattr(glyphs[k],'xMin') else 0)) for k in names})
font.setupHorizontalHeader(ascent=900,descent=-180)
font.setupNameTable({'familyName':'Exile Chart','styleName':'Regular','uniqueFontIdentifier':'ExileChart-0.2','fullName':'Exile Chart Regular','psName':'ExileChart-Regular','version':'Version 0.2','copyright':'Unofficial original vector reconstruction of a user-provided handwritten chart.'})
font.setupOS2(sTypoAscender=900,sTypoDescender=-180,usWinAscent=900,usWinDescent=180)
font.setupPost();font.setupMaxp();font.save(str(O/'ExileChart.ttf'))
