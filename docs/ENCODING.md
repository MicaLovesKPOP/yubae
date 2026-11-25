# Encoding & composition / 문자 부호화 및 조합

## Stable private encoding
Current 93 forms occupy U+E000–U+E05C. These are project-private assignments, not Unicode standard characters, and may conflict with other private scripts. Stable ASCII IDs are the semantic interchange layer. Legacy assignments are immutable and tested against data/encoding-v1.json; allocate new confirmed forms at the next free codepoint, never by sorted index. Do not reuse retired codes. Treat U+E05D onward as unallocated until registry review. Keep keyboard ID exile for installed-alpha update compatibility; before public catalogue submission confirm name uniqueness and migration with Keyman.

## Root model
A form is (root ID, grammatical marker, other modifier(s), shape variant, semantic ID, provenance). A top mark is not universally productive; separate a bare functional glyph from a root's grammatical form. Colour is a different axis from grammatical POS. Ordinal is a numeral-specific modifier with source-dependent placement. Compound words may be multiple characters rather than one graphic; do not collapse them without evidence.
- Current font uses precomposed PUA glyphs for compatibility and easy typing.
- Composition maps recognized forms to existing codepoints. Current table has 10 root families / 20 directional nonidentity changes; includes god↔divine, food↔eat and ocean↔blue. Each change is explicitly enumerated, not a Cartesian product.
- Mobile: select the previous glyph with cursor, then Grammar / 문법: Noun / 명사, Verb / 동사, Adj. / 형용사, Adv. / 부사, Colour / 색. A missing form leaves text unchanged. Existing long-press relatives stay available. Adverb control currently has no verified mapped counterpart in these chart-backed families.
- Web: offer only supported forms for selected glyph, explain unavailability. Future root picker can expose generated previews only in clearly labelled community/experimental mode.
- Later: separate actual base contours from marker components, generate new verified composites from source geometry; preserve existing precomposed output IDs. Consider OpenType mark positioning/ligatures or separate combining PUA only after cross-platform rendering and editing tests, with deterministic canonicalization to legacy tokens. Do not introduce fragile combining strings now.

## Interchange
Use plain PUA text where the same font is available. Portable representation uses stable [id] tokens plus [space] and line breaks; future structured message format records schema, encoding revision, ordered IDs, optional translations, never requires an account. Versioned share links can encode tokens client-side; no message sent to server by default. Recipient without font can view PNG/SVG or a self-contained page. Preserve unknown IDs in future formats without guessing meanings; user must see unsupported characters.

## Bilingual input
Korean UI and English UI have equal coverage. Keep Korean headwords, synonyms, English glosses, searchable aliases separate from word morphology. Exact ambiguous alias maps never auto-convert (공, 일, 팔, 살다 currently ambiguous). Hangul search uses NFC and space normalization. Two-set physical keyboard mnemonics are an interim desktop route, not a full Korean IME. Ideal: a responsive Korean/English candidate search bar and normal OS Korean IME support in companion, then assess native incremental Hangul composition/candidate support using supported Keyman APIs. No claim that arbitrary Korean sentences translate automatically.
