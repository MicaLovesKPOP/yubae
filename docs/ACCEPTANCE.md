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
