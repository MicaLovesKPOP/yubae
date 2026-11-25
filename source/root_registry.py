"""Root-picker registry: graphic components are not writable characters.
Only an explicit documented full form may be inserted. Current chart forms
remain provisional pending primary-source review. Root IDs are UI identifiers,
not Unicode assignments. Never infer a form from the mere existence of a root.
"""
from lexicon import G
from glyphs import N,V,A,D,dots
from composition import FORM_FAMILIES,TRANSFORMS

MARKS={'noun':N,'verb':V,'adjective':A,'adverb':D}
BY_ID={g['id']:g for g in G}
FORM_TO_FAMILY={id:family for family,forms in FORM_FAMILIES.items() for id in forms.values()}
assert len(FORM_TO_FAMILY)==sum(map(len,FORM_FAMILIES.values()))
def base_shape(g,colour=False):
 path=g['path']
 mark=MARKS.get(g['marker'])
 if mark:
  assert path.startswith(mark+' '),(g['id'],mark,path)
  path=path[len(mark)+1:]
 if colour:
  assert path.endswith(' '+dots),g['id']
  path=path[:-len(dots)-1]
 return {'path':path,'fill':g['fill']}
def make_registry():
 roots={}
 for g in G:
  id=g['id']
  family=FORM_TO_FAMILY.get(id)
  root=family or id
  if root in roots:continue
  forms=FORM_FAMILIES.get(family)
  if forms:
   representative=next((forms[m] for m in ('noun','verb','adjective','adverb','colour') if m in forms))
  else:
   representative=id
   forms={('colour' if id=='purple' else g['marker']):id}
  geom=base_shape(BY_ID[representative],colour=(representative=='purple'))
  entries=[]
  for kind,formid in forms.items():
   full=BY_ID[formid]
   marker=full['marker']
   entries.append({'kind':kind,'id':formid,'upper_marker':marker,
    'lower_modifier':'colour' if kind=='colour' else None,
    'evidence':'chart-documented-provisional','verification':full['provenance']['verification']})
  roots[root]={'id':root,'representative':representative,'preview':geom,
   'forms':entries,'bare_writable':any(x['kind']=='none' for x in entries),
   'categories':list(dict.fromkeys(BY_ID[x['id']]['category'] for x in entries))}
 all_forms=[x['id'] for r in roots.values() for x in r['forms']]
 assert len(all_forms)==len(set(all_forms))==len(G)
 assert set(all_forms)==set(BY_ID)
 for r in roots.values():
  assert all(x['verification']=='needs-primary-review' for x in r['forms'])
  assert r['bare_writable']==any(x['kind']=='none' for x in r['forms'])
 # Shape resemblance is not sufficient evidence to merge two words, even
 # when their previews look alike (AND vs live). Day/night are semantic
 # relatives, not proven modifier forms. Their distinct keys remain.
 return list(roots.values())
