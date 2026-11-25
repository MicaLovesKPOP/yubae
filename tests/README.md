# Tests

Run python build_project.py. It compiles the package, checks package integrity, legacy encoding and glyph mapping, and runs source/test_compiled.cjs against the actual compiled JavaScript rules with a deterministic Keyman context adapter. This is not a replacement for native OS tests. Device checklist: docs/ACCEPTANCE.md.

## Studio
Build the native package, then run \`python web/build_studio.py\` and \`node tests/studio.cjs --model-only\`. For browser checks see web/README.md. Full Chromium tests cover input, Korean/English search, ambiguity, form replacements, undo/redo, drafts, favourites, portable messages, link/clipboard behavior with test adapters, actual PNG download, safe shared reader, offline reload, approved update and a mobile viewport. They do not establish native device/IME acceptance.

Root-first Studio regression checks every root and all six modifier slots, with actual browser insertion of all 93 legacy forms. All 498 combinations are checked for enabled/disabled state, and selection/cancel must not alter text.

Run \`python tests/test_root_input.py\` for the experimental root-first postfix semantic reference. It tests all 498 root/form-slot combinations, 415 physical marker-key combinations, bare-root repetitions, punctuation and commit. No platform integration or new codepoint/font acceptance is implied.

Geometry checks: python tests/test_geometry.py and python source/audit_geometry.py; the native build runs both. The audit reports dimensions, ratios, symmetry and shape similarity for current vector outlines, not official source metrics.

Run node tests/learning.cjs --model-only for direct-layout, curriculum, review, and advisory registry checks. Run node tests/learning.cjs with the same YUBAE_PLAYWRIGHT and YUBAE_BROWSER environment as the Studio test for browser integration.
