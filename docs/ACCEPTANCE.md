# Acceptance matrix

| Target | Evidence | Remaining |
|---|---|---|
| Android | v0.3.2 user screenshot showed U+E00A U+E039 rendered in browser and Keyman editor; touch glyphs visible | Verify v0.4.0 Korean labels, language switch, long press, larger glyphs, modifiers, updates |
| iPhone/iPad | Compiled target | Install, keyboard switching, output/rendering, upgrade |
| Windows/macOS/Linux | Compiled target | Install KMP, editor with font, physical mnemonics including /k/anf;, preserved context, backspace, upgrade |
| Browser | Earlier v0.3.4 Chromium verified, shared font | New bilingual web companion acceptance and other browsers |
| ChromeOS | Earlier extension mnemonic engine tested | Device installation, input method integration, font rendering |
| Fire OS/other | Fallback plan | Actual device |

Test phrase: human, water, god→divine, food→eat, ocean→blue, unsupported modifier on number (must preserve character); compare raw character codes. Korean: 한글/EN toggles, 뜻/문자, /k/anf; with Latin base, ambiguous 팔 does not auto-convert. Verify that previous alpha text remains readable. Test a narrow phone and landscape/tablet; keyboard should not obscure all editor content.

## Studio 0.5.0-alpha.1 — 2026-11-25
- PASS: 93 shared glyphs with exact native font; 608 mnemonic conversions and 465 modifier cases; bilingual search, ambiguity, portable tokens and unknown-ID validation.
- PASS: actual Edge/Chromium headless desktop and Korean-locale touch-sized viewport; glyph insertion, form replacement, history, draft/favourites persistence, PNG export, shared reader, offline HTML, offline reload and an explicitly approved service worker update with retained draft. Clipboard and share APIs were substituted for automated checks; actual operating-system share dialogs were not exercised.
- PENDING: installation, real Korean OS IME interaction, native share sheet and mobile/offline/update acceptance on Android/iOS devices. Native keyboard acceptance remains separate.

## Studio 0.5.0-alpha.2 root-first acceptance
PASS: 83 provisional groups cover each of 93 legacy forms exactly once; six fixed modifier slots, 498 availability cases and 93 actual browser insertions tested. Selecting a root never inserts text; unmarked option is disabled for roots with no documented bare form; cancellation emits nothing. Korean and English search, mobile viewport, standalone HTML, prior composition edits, portable messages and update draft recovery remain tested. Real native keyboard and mobile-device acceptance pending.

## Writable roots — 0.5.0 / Studio alpha.3
PASS: 160 font symbols; 67 new bare roots; original 93 glyph outlines, advances and codepoints unchanged from v0.4.0. PASS: compiled native JS adapter covers 160 outputs, 608 legacy and 610 root mnemonics, 415 root/marker pairs, literal punctuation, commit, repeated roots, all 40 touch layouts. PASS: real Chromium desktop and touch-emulated mobile, all 498 root/form availability states and 160 output forms, 415 physical postfix cases including unsupported/repeated punctuation, caret reset, Escape, portable messages, image export, offline and update draft recovery. Native compile/adapter tests are not real Keyman runtime/device acceptance. Actual IME, font installation, share sheets and Chromebook remain pending.
