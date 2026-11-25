"""Stable writable root encoding; the original lexical registry stays intact."""
import json
from pathlib import Path
from lexicon import G
from root_registry import make_registry
from root_input import MARKER_KEYS
D=Path(__file__).resolve().parent.parent/'data'
def load():
    old={g['id']:g for g in G}
    legacy=json.loads((D/'encoding-v1.json').read_text(encoding='utf-8'))
    new=json.loads((D/'root-encoding-v1.json').read_text(encoding='utf-8'))
    assert {g['id']:g['cp'] for g in G}==legacy
    assert set(new).isdisjoint(old) and set(new.values()).isdisjoint(legacy.values())
    assert len(set(new.values()))==len(new)
    records=[dict(g) for g in G]
    roots=make_registry()
    for r in roots:
        existing=next((f['id'] for f in r['forms'] if f['kind']=='none'),None)
        bare=existing or 'root-'+r['id']
        r['bare_id']=bare
        r['bare_meaning']='documented-provisional' if existing else 'unknown'
        r['bare_writable']=True
        if existing:continue
        rep=old[r['representative']]
        cp=new[bare]
        records.append(dict(id=bare,cp=cp,char=chr(cp),
            en='Unknown meaning',ko='뜻 미확인',ko_key='뜻 미확인',
            root_hint_en=rep['en'],root_hint_ko=rep['ko_key'],
            category=rep['category'],aliases=[],ko_aliases=[],
            group=r['id'],marker='none',root_component=True,
            path=r['preview']['path'],fill=r['preview']['fill'],
            provenance={'collection':'graphic-component','verification':'unknown-meaning',
                        'glyph_evidence':'derived from reconstructed chart root'},
            status='writable graphic root; no asserted meaning'))
        r['forms'].insert(0,{'kind':'none','id':bare,'upper_marker':'none','lower_modifier':None,
                             'evidence':'graphic-component','verification':'unknown-meaning'})
    by={g['id']:g for g in records}
    assert set(by)==set(legacy)|set(new)
    assert len({f['id'] for r in roots for f in r['forms']})==len(records)
    return records,roots
def root_aliases(aliases,roots):
    """Reuse unambiguous bilingual full-form aliases within explicit /r/ scope."""
    root_by_form={f['id']:r for r in roots for f in r['forms']}
    result={'r/'+r['id']:r['bare_id'] for r in roots}
    for alias,form in aliases.items():
        bare=root_by_form[form]['bare_id']
        key='r/'+alias
        if key in result:
            assert result[key]==bare,(key,result[key],bare)
        result[key]=bare
    return result
def export_data(records,roots):
    for name,obj in [
      ('text-registry.json',[{k:v for k,v in g.items() if k not in ('path','fill')} for g in records]),
      ('writable-roots.json',roots),
      ('modifier-keys.json',MARKER_KEYS)]:
        (D/name).write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
