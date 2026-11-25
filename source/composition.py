"""Explicit chart-backed transformations. Only listed forms are recognized.
No generative grammar and no new codepoints in this first composition implementation.
The related-glyph UI may include non-morphological relatives, but this table never does.
"""
from lexicon import G
FORM_FAMILIES={
 'meal':{'noun':'food','verb':'eat'},
 'death':{'verb':'kill','adjective':'dead'},
 'addition':{'noun':'sum','verb':'add'},
 'god':{'noun':'god','adjective':'divine'},
 'shadow':{'noun':'shadow','verb':'cover'},
 'ocean':{'noun':'ocean','colour':'blue'},
 'fire':{'noun':'fire','colour':'red'},
 'salt':{'noun':'salt','colour':'white'},
 'glass':{'noun':'glass','colour':'transparent'},
 'charcoal':{'noun':'charcoal','colour':'black'}
}
byid={g['id']:g for g in G}
MODS=('noun','verb','adjective','adverb','colour')
TRANSFORMS={}
for root,forms in FORM_FAMILIES.items():
 for form,id in forms.items():
  assert id in byid
  assert id not in TRANSFORMS
  TRANSFORMS[id]={**forms}
def transformed(id,form):
 return TRANSFORMS.get(id,{}).get(form)
def output_rules():
 for id,forms in sorted(TRANSFORMS.items()):
  for form,target in forms.items():
   yield (id,form,target)
