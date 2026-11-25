# Learning, direct typing, and writing feedback / 학습과 직접 입력

## Keyboard capacity and layout trial

83 graphic roots include the ten digits. Preserve those digits on the unmodified 0–9 keys. The remaining 73 roots fit into 3 letter layers of 26 keys (78 slots): 26 normal, 26 Shift, 21 AltGr. Five spare AltGr positions and all 26 Shift+AltGr positions provide 31 extra letter slots. A fourth layer is reserved for expansion, not required today. Punctuation remains available for optional postfix composition. Complete marked forms do not need dedicated root keys.

The shared data/direct-layout-trial.json is a positional QWERTY experiment, arranged with semantic clusters and mnemonic hints, not an empirically optimal layout. On a real keyboard use Shift and Right Alt/AltGr (Option on Mac); in Studio the visual board provides equivalent touch selections. OS/browser shortcuts can intercept physical keys, so actual hardware testing is still necessary. Keep direct typing opt-in and leave existing mnemonics, F2 candidate search, Korean text and native package available. Freeze stable IDs, not experimental key placement.

## First usable learning experience

Studio alpha.6 contains three short bilingual introductions: numerals, everyday words, and forms/markers. Recognition questions use distinct bilingual answer options; typing questions use the actual root/marker input with keyboard, touch and optional hints. All 64 cards come from existing provisional lexical forms rather than assigning meanings to unknown bare roots. Correct answers lengthen the review interval (1, 3, 7, 14, 30, 60 days); incorrect answers become due again. Progress is local to the browser. No sign-up, server, tracking, subscriptions, streak pressure, or external API. Keep course claims clearly provisional.

Next steps: build a short guided tutorial, source-reviewed sentence examples, cloze and translation exercises with acceptable variants, optional difficulty and daily session size, clear learner-controlled review/reset/export, and accessible feedback. Korean and English are equally primary. Test with native speakers and new learners before declaring a course complete.

## Writing assistance

Current Check writing is a deterministic registry check: it identifies unregistered private-use characters and bare roots with no established standalone meaning, shows known related forms, and allows selecting the symbol. It does not consider bare roots errors, change messages automatically, or claim grammatical correctness. A spelling/form suggestion system should use explicit registry relations and source evidence; grammar suggestions must be added only when syntax and examples are sufficiently documented. Distinguish confirmed rules, participant later usage, and experimental interpretations. Explain why a suggestion is offered and allow writers to ignore it.

## Community ideas (later, separately reviewed)

The long-term goal is a low-friction place to learn, write, exchange texts and contribute documented corrections. Begin with existing share links and images, and a public evidence-backed contribution process. A hosted account/profile system, community posts, practice challenges, comments, scores, moderation, privacy and user-generated content raise separate security, operational, legal and cost obligations. Do not launch a social network or collect user data merely to provide lessons. If the learning tools demonstrate value, design the smallest suitable community experience with consent and moderation, and obtain approval before activating new services. Keep the existing static offline Studio fully usable without an account.

## Release boundary

This milestone changes only Studio. Native 0.5.2, the font, all 160 text mappings and 1,301 previous shortcuts are unchanged. See the tests and acceptance record. Physical devices and source review remain outstanding.

Studio alpha.8 uses prefix markers by default in direct physical input, with a persistent optional postfix preference. Lesson hints follow this preference. The touch board still uses root-first composition, and the compact-code hints retain their existing suffix order.
