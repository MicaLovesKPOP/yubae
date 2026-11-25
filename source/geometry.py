"""Shared, deterministic vector-to-outline geometry for font construction and audits."""
from fontTools.svgLib.path import parse_path
from fontTools.pens.basePen import BasePen
from fontTools.pens.ttGlyphPen import TTGlyphPen
from shapely.geometry import LineString, Polygon
from shapely.geometry.polygon import orient
from shapely.ops import unary_union
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
 # 4.7-unit nominal monoline strokes; small rings retain open centers; shaded regions are solid.
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
def ttglyph(geometry, grid_center=None):
 pen=TTGlyphPen(None)
 for poly in ([geometry] if geometry.geom_type=='Polygon' else geometry.geoms):
  if poly.geom_type!='Polygon' or poly.area<.02: continue
  # SVG y-down -> font y-up. Exterior clockwise after flipping.
  poly=orient(poly,sign=1.)
  for ring in [poly.exterior,*poly.interiors]:
   coords=[]
   for x,y in ring.coords[:-1]:
    if grid_center is None:
     pt=(round(40+x*8.8),round(850-y*8.8))
    else:
     cx,cy=grid_center
     # Quantize around an integer center to preserve reflection symmetry.
     pt=(round(40+cx*8.8)+round((x-cx)*8.8),
         round(850-cy*8.8)-round((y-cy)*8.8))
    if not coords or coords[-1]!=pt:coords.append(pt)
   if len(coords)<3:continue
   pen.moveTo(coords[0]);[pen.lineTo(pt) for pt in coords[1:]];pen.closePath()
 return pen.glyph()
