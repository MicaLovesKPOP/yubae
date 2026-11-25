"""Fixed, explicitly delimited compact root codes (no change to text encoding)."""
import json,re
from pathlib import Path
D=Path(__file__).resolve().parent.parent/'data'

def compact_codes(records,roots):
    codes=json.loads((D/'compact-root-codes.json').read_text(encoding='utf-8'))
    by={g['id']:g for g in records}
    byroot={r['id']:r for r in roots}
    assert len(codes)==len(byroot)==len(set(codes.values()))
    assert set(codes.values())==set(byroot)
    assert all(re.fullmatch(r'[a-z]{2}|[0-9]',c) for c in codes)
    return {';'+code+';':by[byroot[rid]['bare_id']]['char'] for code,rid in codes.items()}
