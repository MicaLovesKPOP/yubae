# Yubae Studio / 웹 편집기

Public alpha: https://micaloveskpop.github.io/yubae/

## Build
Run the pinned native build first (see root README), then \`python web/build_studio.py\`.
The generated \`dist/site/\` directory is a static PWA; \`dist/Yubae_Studio.html\` is the self-contained offline version. They embed the same registry and exact font from the native package. The standalone version does not have automatic updates. Studio is GPL-3.0-or-later, subject to component-specific rights notices.

## Acceptance
\`node tests/studio.cjs --model-only\` runs the deterministic shared-registry and message-model tests.
Full browser checks: install Playwright Core into a development-only environment, set \`YUBAE_PLAYWRIGHT\` to its module path if needed and \`YUBAE_BROWSER\` to an available Chromium/Edge executable, then run \`node tests/studio.cjs\`.
This verifies Chromium headless desktop and mobile viewport behavior, not actual-device installation, Korean OS IME or native sharing UI. Clipboard and share APIs are substituted in the desktop test; PNG export, offline caching and a controlled update use actual browser facilities.

## Deployment and updating
The \`gh-pages\` branch contains only generated, reviewed assets and licence notices. Deploy a reviewed build with a normal commit (no force push). Updates use a content-keyed service worker cache; when an installed new worker is waiting, Studio offers an explicit update. The saved draft survives reload. Open tabs and browser storage availability can affect update behavior.

Messages use the \`yubae:1\` portable token schema and URL fragments, which are decoded in the browser. No application backend, account, telemetry or message upload is implemented. Hosting providers and browsers may still log page visits; a message link is not encrypted and anyone receiving it can read it. Unknown portable glyph IDs are preserved in the reader's original portable message and refused as an editor import rather than silently reinterpreted.

## Limitations
93 provisional reconstructed glyphs; not a canonical dictionary. No automatic sentence translation. Native Keyman distribution remains at 0.4.0. No real-device PWA install claim. See docs/RESEARCH.md, RIGHTS.md and docs/ACCEPTANCE.md.
