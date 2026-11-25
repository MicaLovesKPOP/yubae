# Roadmap / 우선순위

| Priority | Deliverable | Done when |
|---|---|---|
| P0 | Preserve tested alpha, stable codepoints, bilingual data and repo | Compiled artifacts and reproducible regression tests; public reviewed alpha release |
| P0 | Locate authoritative map and identify creator/rights route | Masterclass inspected with timestamps; programme corpus audited 15/15; every visible form mapped or disputed; permission route identified |
| P0 | Source reconciliation and complete basic forms | Cry, ordinals, comparison, particles and other missing candidates resolved; no unsupported shape assigned |
| P0 | Korean and English usability acceptance | Android Korean/glyph/learning modes and modifier controls; iOS/iPadOS, Windows, macOS, Linux install and type; verified display and update behavior |
| P1 | Daily companion | Search in normal Korean IME and English; modifier previews; favourites/recent; draft recovery; image share; versioned text and links; offline; spoiler-safe dictionary |
| P1 | Keyman cloud / web release | Catalogue licensing and naming requirements resolved, bilingual documentation, controlled updates and rollback |
| P1 | Improve input efficiency | User tests; native two-set candidate composition if viable; evidence-based common words; modifier gestures if supported and discoverable; do not introduce unverified forms |
| P2 | ChromeOS and other platforms | Test ChromeOS extension on actual device, choose store or web fallback; Fire OS acceptance; browser compatibility |
| P2 | Community collaboration | Bilingual contribution process and review; Stella/creator involvement only if desired; clear attribution and governance |
| P3 | Language evolution | Versioned later-attested and community vocabulary, grammar notes, learning exercises; robust standards migration only if justified |

## Current blockers
Complete primary visual references, unresolved glyph/script rights for catalogue submission (not a blanket blocker to public fan alpha), native Korean review, no physical iOS/macOS/Linux/ChromeOS test devices in current session, mobile PUA rendering outside Keyman. Native Korean predictive candidate input and physical-device PWA install/share behavior are not yet verified. Studio browser acceptance has passed; public hosting and update lifecycle are separate from native distribution.

## Immediate next session
Primary-source audit is the critical path: view the 30-minute Korean masterclass and original post-show messages, extract a timestamped root/form catalogue and source-confirm missing shape candidates before expanding the default glyph inventory. Independently validate 0.4.0 on Android and Korean users. No need to defer independent software QA while source access is pending.

## Studio milestone 0.5.0-alpha.1
Implemented bilingual composition, Korean initial-consonant search, documented form previews, recent/favourites, draft recovery, PNG, portable tokens and message links. Browser regression, mobile viewport, offline and update tests passed. Next highest-value work: primary-source audit and actual Android/iOS Studio acceptance; review native Korean candidate entry; keep web/native encoding aligned. Do not add provisional shapes merely to fill missing IDs.

## Root-first decision (revised)
Studio alpha.2 currently implements the two-stage picker with 83 provisional graphic root groups and 93 complete forms. The owner revised the desired interaction: all bare roots writable in one tap, optional documented postfix modifiers, with normal punctuation preserved. A tested reference engine now exists in source/root_input.py. Highest-value software work: integrate stable bare-root encoding, generated display/OSK font, shared portable-token support and Studio root tap + optional marker; then migrate the native keyboard and ChromeOS adapters. Keep 608 legacy shortcuts compatible. Real Korean and English keyboard/device trials will determine the best key mapping and UI; see docs/ROOT_INPUT.md. Audit numeral 3/4 geometry and root families against primary source. No speculative new lexical meanings.

## Writable-root implementation milestone
Studio alpha.3 and native 0.5.0 now implement one-tap bare-root entry, optional postfix composition and shared encoding/font. 83 groups, 160 symbols, 608 legacy shortcuts plus 610 root aliases. Next: real Korean/English mobile and desktop device acceptance (including punctuation, context reset and keyboard ergonomics), ChromeOS integration, then improve native root candidate selection. Separately audit authentic root/marker geometry and ordinal forms. Do not change original codepoints or add unsupported lexical meanings.

## Fast root selection milestone
Studio alpha.4 candidate dialog and native 0.5.1 compact code trial implemented and regression-tested. Next: real Korean and English user acceptance; compare candidate, compact-code and possible persistent direct-key modes on actual tasks. Preserve existing compatibility. Prioritize authentic glyph/root/ordinal audit and native device acceptance over additional speculative shortcut schemes.

## Geometry and corpus milestone
Normalized 3/4 as symmetric quarter-turn pair, recorded original-source bounding-box sample, added automatic geometry audit and reviewed all 15 areas of the Korean secondary text. Next priority: resolve exact original head/know, house/dwell, life/death, ordinal and mathematical/functional forms through legible source frames. Do not stretch all roots to square or merge semantically distinct IDs by visual overlap. Continue original-source audit before adding input features.
