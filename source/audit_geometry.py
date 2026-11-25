"""Repeatable geometry audit of the reconstructed font source, not official measurements."""
from pathlib import Path
import json,itertools
from shapely.affinity import translate,scale,rotate
from geometry import outline
from writable_roots import load
from root_registry import make_registry
D=Path(__file__).resolve().parent.parent/'data'

def similarity(a,b):
    area=a.union(b).area
    return a.intersection(b).area/area if area else 0

def centered(g):
    x0,y0,x1,y1=g.bounds
    return translate(g,-(x0+x1)/2,-(y0+y1)/2)
def normalized(g):
    g=centered(g);x0,y0,x1,y1=g.bounds
    f=1/max(x1-x0,y1-y0)
    return scale(g,f,f,origin=(0,0))
def metrics(g):
    x0,y0,x1,y1=g.bounds
    w,h=x1-x0,y1-y0;c=centered(g)
    return {'bounds':[round(x,3) for x in g.bounds],
            'width':round(w,3),'height':round(h,3),'ratio':round(w/h,4),
            'within_5pct_square':abs(w-h)/max(w,h)<=.05,
            'mirror_x_iou':round(similarity(c,scale(c,-1,1,origin=(0,0))),5),
            'mirror_y_iou':round(similarity(c,scale(c,1,-1,origin=(0,0))),5)}

def audit():
    records,roots=load()
    root_shapes={r['id']:outline(r['preview']) for r in roots}
    normalized_shapes={id:normalized(g) for id,g in root_shapes.items()}
    pairs=[]
    tolerant={id:g.buffer(.035) for id,g in normalized_shapes.items()}
    for a,b in itertools.combinations(normalized_shapes,2):
        x,y=normalized_shapes[a],normalized_shapes[b]
        score=similarity(x,y)
        near=similarity(tolerant[a],tolerant[b])
        if near>=.80:pairs.append({'a':a,'b':b,'iou':round(score,5),'tolerant_iou':round(near,5)})
    pairs.sort(key=lambda p:(-p['tolerant_iou'],p['a'],p['b']))
    form_metrics={g['id']:metrics(outline(g)) for g in records}
    root_metrics={id:metrics(g) for id,g in root_shapes.items()}
    three,four=root_shapes['3'],root_shapes['4']
    rot=rotate(three,90,origin=(50,51))
    assert similarity(rot,four)>0.999999
    for id in ('3','4'):
        m=root_metrics[id]
        assert abs(m['width']-m['height'])<.02
        assert m['mirror_x_iou']==m['mirror_y_iou']==1
    return {'scope':'Current reconstructed vector source. Not an official script measurement.',
       'units':'100-unit SVG design grid, includes stroke outline',
       'root_count':len(roots),'text_symbol_count':len(records),
       'root_bounds':root_metrics,'text_bounds':form_metrics,
       'square_root_count':sum(x['within_5pct_square'] for x in root_metrics.values()),
       'square_text_count':sum(x['within_5pct_square'] for x in form_metrics.values()),
       'numeral_pair':{'rotation_degrees':90,'rotation_iou':round(similarity(rot,four),8)},
       'visual_similarity_method':'Uniform max-dimension scaling, center alignment, raw IoU and IoU after 0.035-unit dilation. Includes strokes and fills; does not infer meaning.',
       'visual_similarity_candidates':pairs,
       'warning':'High overlap indicates visual similarity only; never merge linguistic identities from geometry alone.'}

if __name__=='__main__':
    a=audit()
    (D/'geometry-audit.json').write_text(json.dumps(a,indent=2)+'\n',encoding='utf-8')
    print('Root square count:',a['square_root_count'],'/',a['root_count'])
    print('Text square count:',a['square_text_count'],'/',a['text_symbol_count'])
    print('3/4 rotation:',a['numeral_pair'])
    print('Top same-orientation visual candidates:',a['visual_similarity_candidates'][:15])
