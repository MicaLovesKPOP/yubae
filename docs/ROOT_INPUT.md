# Root input architecture / 어근 입력 방식

Status: owner-approved principle; reference engine tested; platform implementation pending (2026-11-25).

## Core interaction

Every provisional graphic root is independently writable, whether or not it has a documented standalone meaning. A bare root with no attested meaning is labelled "unknown meaning" (뜻 미확인), not prohibited. This is an orthographic input capability, not a claim that a new word is part of the original language. A root key writes the bare shape immediately; no mandatory confirmation or second tap. Consecutive roots work just like individual Korean jamo. A documented unmarked form reuses its existing semantic ID. Otherwise the reference model uses a new stable semantic ID root-<root ID>, pending font and encoding integration. Do not add new PUA mappings to public releases until the shared rendering, input, and portable-token roundtrip all pass. Existing 93 text codes and meanings must never be silently reassigned. Current group identities remain provisional.

Modifiers are optional postfix operations, not independent free-standing marks or arbitrary combinations. Only explicitly documented form targets are available. The current handwritten source is provisional evidence; verify it against the original script before canonical claims. Root identity is separate from the existence of a meaningful unmarked form. A full form remains one text character in the initial implementation; root geometry and markers are construction components in the source. When a previously unknown unmarked meaning is discovered, attach it to that root's existing ID rather than reinterpreting old text. Do not infer new combinations merely because they can be drawn. Maintain grammatical and colour axes separately, even if the colour key is a convenience for a documented full form. Ordinal placement and stacking must be audited before a shortcut is finalized.

## Initial physical key mapping (trial, not final)

| Slot | Typed key | Rationale |
|---|---|---|
| Noun | hyphen (-) | horizontal stroke, unshifted |
| Verb | period (.) | upper dot, unshifted |
| Adjective | apostrophe (') | acute/rising accent convention |
| Adverb | backtick (U+0060) | grave/falling accent convention |
| Colour | colon (:) | two dots, available on normal layouts |
| Unmodified | no modifier | already written by root key |

The adjective/adverb assignment follows the acute/grave convention rather than treating the two slants interchangeably. The colon is only a mnemonic for a pair of dots, not the actual glyph geometry. Key selection is provisional until trials on Korean, US, Dutch and other keyboard layouts. Match the input symbol, not a presumed physical scan code, where the platform permits. Keep a visually labelled modifier palette as an alternative. Reserve ordinal control until verified; do not assign an unverified ordinal form.

## Composition and punctuation

A newly entered root owns an active postfix composition anchored at its text position. A valid marker replaces that bare character with the documented full-form ID, then closes the active composition. The next ordinary keystroke, next root, explicit commit, cursor movement, selection change, focus loss, keyboard switch or paste must end the previous active composition. Outside this context punctuation is literal. If a physical marker has no documented target, retain the bare root AND insert the typed punctuation; explicit modifier buttons for unavailable forms are disabled or do nothing. Never swallow punctuation or generate an unknown modified glyph. To type a literal marker after a newly entered root when its modifier is available, explicitly commit or use a literal-punctuation control; implement the best platform-specific equivalent (desktop Escape or an explicit literal mode, touch punctuation layer, browser accessible button). A repeated punctuation key after a successful conversion is literal. No automatic re-modification of already completed text on ordinary punctuation; editing an existing form is an explicit selection-based operation. Backspace normally deletes the last whole character; undo restores the previous state. Test native context invalidation, cancellation and paste rather than assuming every host provides identical events. If a host cannot prove context validity, fall back to an explicit modifier mode rather than guessing.

The executable source/root_input.py reference is deliberately append-only: it models semantic token decisions, not a production editor or OS focus/caret tracking. tests/test_root_input.py verifies every current root and form slot, all five punctuation keys, successive roots, explicit commit and deletion. No standalone root token codes or new glyphs are released yet.

## Platform interaction

- Touch (Android/iOS/iPadOS): bare root keys, a consistent modifier row on all category pages, optional long-press/flick shortcuts only for documented forms; unavailable modifiers visibly disabled where the engine can do it. Use actual native keyboard testing to establish whether static or contextual layers can implement this without slow layer switching. Root tap plus modifier tap is the primary path; bare roots take one tap. Provide a normal punctuation/number layer and a literal-commit route. Keyman touch layouts support layer transitions and longpress; flick support depends on the runtime version (https://help.keyman.com/developer/19.0/guides/walkthrough/05-designing-touch-layout).
- Desktop (Windows/macOS/Linux/ChromeOS): bilingual candidate search and selection for the full root inventory; do not force memorization of 83 physical positions. Explore learnable direct root mappings for frequent roots after studying actual usage. Keep all 608 existing explicit full-form mnemonics unchanged. As a transitional expert route, introduce explicitly prefixed bare-root aliases (e.g. /r/water; and Korean equivalents) with collision/ambiguity handling. Suffix marker keys must work without intercepting Latin punctuation or existing shortcuts. Native IME support may differ; direct aliases are fallback, not the final ideal.
- Studio/browser: native Korean/English search, keyboard-selectable candidate list and root tap/click writes immediately. Fixed optional modifier controls and hardware suffix keys operate on the active root, with explicit form editing also available for previously composed text. Preserve browser text selection, real Korean IME composition, undo/redo, draft recovery, PNG export, links, and accessible labels. For unknown roots, show the shape and "unknown meaning" in gloss/reader. Import and portable sharing must preserve new root IDs without silently changing old messages. Older clients already treat unknown IDs as placeholders; test this compatibility. Update the font and shared data together.
- Cross-platform release: allocate a stable, separate range for the additional bare-root codepoints only after reviewing root geometry and collision policy. Keep a frozen root-ID/codepoint manifest, preserve all 93 existing codes, and generate both OSK and display fonts from it. No required use of combining PUA marks in text until cross-platform display, caret, editing, and export have been verified.

## Acceptance

1. All 83 current provisional roots writable; all 93 previous full forms and shortcuts intact; 67 new bare-only IDs have no asserted gloss.
2. Every documented modifier works, including shape and semantic-ID compatibility. Unsupported combinations never emit invented forms.
3. Continuous typing, bare repeated roots, punctuation, commit, cursor reposition, backspace, paste, keyboard change, selection replacement and undo are predictable. No punctuation disappears.
4. Compare tasks on real Korean/English keyboards and phones: time, taps/keystrokes, error rate, discoverability. Prefer lower effort without sacrificing reliability; adjust mappings before marking them stable.
5. Both languages, all shared clients, font rendering and portable-message tests pass. Release only after actual integration, not just a passing reference model.
