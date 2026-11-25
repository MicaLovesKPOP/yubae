# Tests

Run python build_project.py. It compiles the package, checks package integrity, legacy encoding and glyph mapping, and runs source/test_compiled.cjs against the actual compiled JavaScript rules with a deterministic Keyman context adapter. This is not a replacement for native OS tests. Device checklist: docs/ACCEPTANCE.md.

## Studio
Build the native package, then run \`python web/build_studio.py\` and \`node tests/studio.cjs --model-only\`. For browser checks see web/README.md. Full Chromium tests cover input, Korean/English search, ambiguity, form replacements, undo/redo, drafts, favourites, portable messages, link/clipboard behavior with test adapters, actual PNG download, safe shared reader, offline reload, approved update and a mobile viewport. They do not establish native device/IME acceptance.
