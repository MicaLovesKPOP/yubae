"""Experimental root-first input semantics, independent of OS and font.

The legacy form IDs remain the only released text repertoire until the new
bare-root glyphs, shared token decoder, and platform adapters are implemented.
This reference model operates on semantic tokens, not guessed Unicode values.
"""
from dataclasses import dataclass
from root_registry import make_registry

MARKER_KEYS = {"-": "noun", ".": "verb", "'": "adjective",
               "\x60": "adverb", ":": "colour"}
FORM_SLOTS = ("none", "noun", "verb", "adjective", "adverb", "colour")


def input_registry(roots=None):
    """An unmarked input token exists for every root, even without a gloss."""
    roots = make_registry() if roots is None else roots
    out = {}
    legacy = {form["id"] for r in roots for form in r["forms"]}
    for r in roots:
        forms = {f["kind"]: f["id"] for f in r["forms"]}
        documented = "none" in forms
        bare = forms.get("none", "root-" + r["id"])
        if not documented:
            assert bare not in legacy, bare
        out[r["id"]] = {
            "forms": {**forms, "none": bare},
            "bare_meaning": "documented-provisional" if documented else "unknown",
            "bare_id": bare,
            "preview": r["preview"],
        }
    assert len({r["bare_id"] for r in out.values()}) == len(out)
    return out


@dataclass(frozen=True)
class Token:
    kind: str
    value: str


class InputState:
    """Reference append-only engine; real adapters also track editor selection.

    A root is written at once. Only a freshly inserted root owns a pending
    postfix composition. A successful marker completes that composition.
    Unsupported physical markers are literal, not lost or invented. Explicit
    modifier controls are disabled/no-op when no documented target exists.
    """
    def __init__(self, registry=None):
        self.registry = input_registry() if registry is None else registry
        self.tokens = []
        self.pending = None

    def root(self, root_id):
        rec = self.registry[root_id]
        self.tokens.append(Token("g", rec["bare_id"]))
        self.pending = (len(self.tokens) - 1, root_id)

    def commit(self):
        """Call on cursor/selection/focus changes and before explicit literals."""
        self.pending = None

    def available(self):
        if self.pending is None:
            return ()
        return tuple(m for m in FORM_SLOTS
                     if m in self.registry[self.pending[1]]["forms"])

    def modifier(self, name):
        if self.pending is None:
            return False
        index, root = self.pending
        target = self.registry[root]["forms"].get(name)
        if target is None:
            return False
        self.tokens[index] = Token("g", target)
        self.commit()
        return True

    def key(self, key):
        if len(key) != 1:
            raise ValueError("one literal key expected")
        marker = MARKER_KEYS.get(key)
        if marker and self.modifier(marker):
            return "composed"
        self.literal(key)
        return "literal"

    def literal(self, text):
        self.commit()
        if text:
            self.tokens.append(Token("t", text))

    def backspace(self):
        self.commit()
        if self.tokens:
            self.tokens.pop()
