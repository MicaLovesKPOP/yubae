# Project charter / 프로젝트 원칙

## Mission
Make Yubae usable in ordinary life, as a living writing system and language, not a proprietary cipher or a fandom-only input novelty. Preserve what was actually used in the programme; enable transparent, compatible future use. Korean and English are co-primary. Korean speakers never need English to browse or use the companion.

## Product scope
1. Evidence-based bilingual character registry, root/form model, source citations, searchable dictionary, reading and composition help.
2. One stable encoding and generated typeface/keyboard artifacts across Keyman desktop and mobile; ChromeOS extension is secondary until device-tested.
3. Offline-first bilingual web companion, installable PWA when hosted, native input, searchable palette, modifier controls, text/token import and export, accessible PNG/SVG sharing. No account required for ordinary writing.
4. Learning: original vs later vs community filters, stroke/marker descriptions, simple examples, optional practice; spoiler-safe default.
5. Community: documented correction/extension proposals, Korean-language issue templates, versioned review and changelog, compatibility tests.
6. Distribution: one official install route per platform, rollback builds, checksums, update notes in both languages; pursue Keyman Cloud after clearance.

## Boundaries
- No claims of official affiliation, definitive full map, or copyright ownership of the original script.
- No automatic inventing of glyphs or AI-generated dictionary meanings presented as canonical.
- No proprietary accounts, hosted messaging service, ads, paid API, data collection, or always-on network requirement in core input.
- No forced replacement of users' normal keyboard or device fonts; no rooting or jailbreaking.
- Do not promise third-party mobile apps render PUA text. Share images or compatible links as primary interoperable options.
- No Unicode submission until a stable corpus, user community, compatible encoding migration plan and evidence justify it.
- Public fan alpha is authorized under the scoped rights policy in RIGHTS.md; no copied programme footage, original chart imagery, logos or official assets. Do not assert that silence constitutes permission. External outreach in the owner's name still requires approval.

## Evidence status vs collection
Keep two orthogonal fields: collection = original / later-attested / community / unknown; verification = candidate / independently corroborated / primary-confirmed / disputed / rejected. The 93 chart entries are currently original candidates; the chart is not an official source. A form may be attested without its meaning being settled.

## Decisions and governance
The project owner controls publication policy, licensing, budgets and external representation. Public alpha releases may proceed under the standing 2026-11-25 policy in RIGHTS.md; pause affected material if a credible rights concern arises. Contributors may propose changes; a maintainer and preferably a native Korean reviewer review evidence and compatibility. Invite Stella Jang and actual script creators to advise if they want to, without assuming any role or obligation. Document disagreements and credit all voluntary contributors. If an official character chart or standardized encoding emerges, adapt compatibly rather than insisting on ours.

## Release bar
A change to encoding must never silently reinterpret old text. All generators consume the same lexicon; compare previous codepoints and shapes, verify rendering, input rules, accessible UI, and actual-device acceptance per supported platform. A compile is not device verification. Alpha and stable releases are separate; no automatic promotion. Daily usability outranks cosmetic polish. New unverified forms remain excluded from the default canonical keyboard until reviewed.
