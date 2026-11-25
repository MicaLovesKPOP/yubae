"""Guard normalized numeral construction and packaged glyph compatibility."""
import sys,unittest,zipfile,io
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'source'))
from numeral_geometry import THREE,FOUR,CENTER,NUMERAL_PATHS,rotate_clockwise
from geometry import outline,ttglyph
from shapely.affinity import scale,rotate
from fontTools.ttLib import TTFont
from writable_roots import load
from audit_geometry import similarity
class NumeralGeometry(unittest.TestCase):
    def test_construction(self):
        self.assertEqual(FOUR,rotate_clockwise(THREE))
        self.assertNotEqual(THREE,FOUR)
        for id in ('3','4'):
            g=outline({'path':NUMERAL_PATHS[id],'fill':''})
            x0,y0,x1,y1=g.bounds
            self.assertLess(abs((x1-x0)-(y1-y0)),.02) # round-join tessellation tolerance
            self.assertAlmostEqual(similarity(g,scale(g,-1,1,origin=CENTER)),1,places=8)
            self.assertAlmostEqual(similarity(g,scale(g,1,-1,origin=CENTER)),1,places=8)
        a,b=[outline({'path':NUMERAL_PATHS[i],'fill':''}) for i in ('3','4')]
        self.assertAlmostEqual(similarity(rotate(a,90,origin=CENTER),b),1,places=8)
        self.assertLess(similarity(a,b),.8)
    def test_integer_center(self):
        g=ttglyph(outline({'path':NUMERAL_PATHS['3'],'fill':''}),CENTER)
        pts=set(map(tuple,g.coordinates))
        cx,cy=round(40+CENTER[0]*8.8),round(850-CENTER[1]*8.8)
        self.assertEqual(pts,{(2*cx-x,y) for x,y in pts})
        self.assertEqual(pts,{(x,2*cy-y) for x,y in pts})
        self.assertEqual(max(x for x,y in pts)-min(x for x,y in pts),max(y for x,y in pts)-min(y for x,y in pts))
    def test_font_and_root_agree(self):
        g,r=load()
        by={x['id']:x for x in g};roots={x['id']:x for x in r}
        for id in ('3','4'):
            self.assertEqual(by[id]['path'],NUMERAL_PATHS[id])
            self.assertEqual(roots[id]['preview']['path'],NUMERAL_PATHS[id])
            self.assertEqual(by[id]['cp'],0xE000+int(id))
        self.assertEqual(len(g),160)
        self.assertEqual(len(r),83)
if __name__=='__main__':unittest.main(verbosity=2)
