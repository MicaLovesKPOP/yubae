"""Regression checks for the root-input reference, not native or web integration."""
import sys
import unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/"source"))
from root_input import input_registry, InputState, MARKER_KEYS, FORM_SLOTS, Token
from root_registry import make_registry

class TestRootInput(unittest.TestCase):
    def setUp(self):
        self.registry = input_registry()
    def state(self):
        return InputState(self.registry)

    def test_complete_registry(self):
        self.assertEqual(len(self.registry),83)
        self.assertEqual(sum(x["bare_meaning"]=="unknown" for x in self.registry.values()),67)
        old={f["id"] for r in make_registry() for f in r["forms"]}
        new={v for r in self.registry.values() for v in r["forms"].values()}
        self.assertEqual(len(old),93)
        self.assertEqual(len(new),160)
        self.assertEqual(len(new-old),67)
        self.assertTrue(all(x.startswith("root-") for x in new-old))

    def test_all_root_and_modifier_choices(self):
        for root,r in self.registry.items():
            for slot in FORM_SLOTS:
                with self.subTest(root=root,slot=slot):
                    s=self.state()
                    s.root(root)
                    self.assertEqual(s.tokens,[Token("g",r["bare_id"])])
                    target=r["forms"].get(slot)
                    self.assertEqual(slot in s.available(),target is not None)
                    self.assertEqual(s.modifier(slot),target is not None)
                    self.assertEqual(s.tokens,[Token("g",target or r["bare_id"])])

    def test_all_physical_keys(self):
        for root,r in self.registry.items():
            for key,slot in MARKER_KEYS.items():
                with self.subTest(root=root,key=key):
                    s=self.state(); s.root(root)
                    target=r["forms"].get(slot)
                    result=s.key(key)
                    expected=[Token("g",target)] if target else [Token("g",r["bare_id"]),Token("t",key)]
                    self.assertEqual(s.tokens,expected)
                    self.assertEqual(result,"composed" if target else "literal")
                    self.assertEqual(s.available(),())
                    s.key(key)
                    self.assertEqual(s.tokens,expected+[Token("t",key)])

    def test_bare_repeated_and_commit(self):
        s=self.state()
        s.root("human");s.root("human");s.key("-")
        self.assertEqual(s.tokens,[Token("g","root-human"),Token("g","human")])
        s.root("water");s.commit();s.key("-")
        self.assertEqual(s.tokens[-2:],[Token("g","root-water"),Token("t","-")])
        s.root("meal");s.literal(".")
        self.assertEqual(s.tokens[-2:],[Token("g","root-meal"),Token("t",".")])
        s.root("3");s.key(".")
        self.assertEqual(s.tokens[-2:],[Token("g","3"),Token("t",".")])

    def test_delete_and_context_reset(self):
        s=self.state();s.root("god");s.backspace();s.key("'")
        self.assertEqual(s.tokens,[Token("t","'")])
        s.root("god");s.commit();s.key("'")
        self.assertEqual(s.tokens[-2:],[Token("g","root-god"),Token("t","'")])

if __name__=="__main__":
    unittest.main(verbosity=2)
