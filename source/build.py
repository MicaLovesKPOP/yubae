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
from geometry import outline, ttglyph
font=FontBuilder(1000,isTTF=True)
names=['.notdef','space']+[f'exile{g["cp"]:04X}' for g in FONT_G]
font.setupGlyphOrder(names)
font.setupCharacterMap({32:'space',**{g['cp']:f'exile{g["cp"]:04X}' for g in FONT_G}})
glyphs={'.notdef':ttglyph(LineString([(20,20),(80,20),(80,80),(20,80),(20,20)]).buffer(1.5)), 'space':TTGlyphPen(None).glyph()}
from numeral_geometry import CENTER
for g in FONT_G:
 glyphs[f'exile{g["cp"]:04X}']=ttglyph(outline(g), CENTER if g['id'] in ('3','4') else None)
# Rotate the quantized contour of 3 itself, so the TTF pair has the same
# exact geometry even after integer rounding. Preserve the contour winding.
from copy import deepcopy
three=glyphs['exileE003']
four=deepcopy(three)
cx,cy=round(40+CENTER[0]*8.8),round(850-CENTER[1]*8.8)
for i,(x,y) in enumerate(three.coordinates):
 four.coordinates[i]=(cx+(y-cy),cy-(x-cx))
glyphs['exileE004']=four
font.setupGlyf(glyphs)
font.setupHorizontalMetrics({k:(420 if k=='space' else 960,0 if k=='space' else (glyphs[k].xMin if hasattr(glyphs[k],'xMin') else 0)) for k in names})
font.setupHorizontalHeader(ascent=900,descent=-180)
font.setupNameTable({'familyName':'Exile Chart','styleName':'Regular','uniqueFontIdentifier':'ExileChart-0.2','fullName':'Exile Chart Regular','psName':'ExileChart-Regular','version':'Version 0.2','copyright':'Unofficial original vector reconstruction of a user-provided handwritten chart.'})
font.setupOS2(sTypoAscender=900,sTypoDescender=-180,usWinAscent=900,usWinDescent=180)
font.setupPost();font.setupMaxp();font.save(str(O/'ExileChart.ttf'))
