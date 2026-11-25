# Yubae Research — voluntary input and learning research / 자발적 입력·학습 연구

Status: planned direction, discussed with the owner on 2026-11-25. Not implemented, deployed, or authorized to start collecting or uploading participant data. The current Studio remains offline-first and tracking-free. This proposal is a separately reviewed, optional research programme, not an exception to the charter's prohibition on data collection in core input. Korean and English are co-primary.

## Purpose / 연구 목적

Find out how people actually learn, choose, combine and change input methods, as well as how fast and accurately they type. Support several effective learning paths rather than assuming the shortest sequence or the same keyboard is best for everyone. Use evidence to improve desktop and mobile keyboards, accessibility, discoverability, learning tools and switching between methods.

- Compare first exposure, practice, retention and everyday use; examine which methods attract beginners, which remain preferred, and whether individuals gradually migrate to another method as familiarity or speed goals change.
- Measure distinct participants' primary methods and usage shares separately; a toggle or selected preference alone does not establish actual use. Record mixed-method use and changes in preference, including migration back to an earlier method.
- Distinguish voluntary usage data (what participants write with our tools), controlled benchmarks (performance on equivalent targets), and authentic source corpus evidence (language attestations). None is a substitute for the others. Do not infer official meanings, grammar or authentic frequency from fan usage or balanced exercises.

## Study design / 연구 설계

Keep platform/device class (desktop physical, desktop pointer, phone/tablet touch, external keyboard when known), input surface (Studio editor/learning, native Keyman or another supported adapter) and input mechanism as separate fields. Compare direct prefix and postfix, compact codes, bilingual candidate search, visual dictionary/root picker, visual positional board and native keyboard entry as applicable. Native keyboard is a surface that can use several mechanisms; avoid double counting. Attribute committed forms to the mechanism that produced them, with marker-selection mechanism tracked separately if useful. Do not infer native keyboard adoption from characters pasted into Studio. Studio cannot observe typing outside itself; native and third-party integration requires separately scoped consent, technical feasibility and review, never a system-wide keystroke monitor.

### Controlled benchmark

- Reuse actual Studio and registry/learning functionality; no competing editor. Version the layout, form registry, benchmark and platform. Start with alpha.8 prefix/postfix, compact and candidate paths and practical touch comparison.
- Use identical source-supported target forms, not invented authentic sentences. Include numbers, first words, root/marker pairs and harder Shift/AltGr roots. Compare theoretical key activations separately from measured speed.
- Record elapsed time, accuracy/edit distance, correction actions, modifier burden, hint/lookup use, time to first action and participant-reported difficulty/comfort. Counterbalance method order; separate first exposure, equal-duration practice, immediate retest and next-day retention. Report sample size and uncertainty.
- Treat Korean IME and real hardware/mobile acceptance separately from synthetic tests. See [acceptance](ACCEPTANCE.md), [learning](LEARNING.md) and [root input](ROOT_INPUT.md).

### Optional everyday usage

Proposed local aggregate metrics, subject to privacy review and a published field inventory:

| Research question | Candidate measure |
|---|---|
| Which methods become primary? | Distinct opt-in installations by dominant share of committed glyphs in a defined period; retain mixed/insufficient-use categories and report action-volume shares separately. |
| How do preferences change? | First observed method, methods tried, active-day/week/month cohorts, within-installation transitions and retention; distinguish returning participants from dropout and new cohorts. |
| Where is typing difficult? | Aggregate intervals, corrections, modifier-bearing actions and root/marker counts; use coarse timing distributions, not exact event timestamps. |
| How accessible is each path? | Hint use, aggregate search success/failure, selection counts, practice completion, optional brief comfort and switching-reason surveys (no unnecessary free-text collection). |
| How can we improve layout? | Coarse frequency and ergonomic cost estimates; explore candidate layouts offline, then test them with actual users before changing defaults. |

Define denominators and thresholds before analysis (for example, a dominant method needs a sufficient volume of completed input and a clear majority; otherwise report mixed/insufficient). Account for device changes, software versions, unequal practice and selection bias. Report pseudonymous installation counts rather than pretending one installation always equals one person; no cross-device identity inference. A longitudinal identifier must be voluntary, random, scoped to the study, resettable, and never derived from fingerprints, IP or account identity. Distinguish self-selected research participants from the overall user base; do not extrapolate unsupported population shares. Aggregate-only statistics can still be sensitive in small cohorts.

## Privacy and consent / 개인정보 및 동의

Core drafts, preferences, learning progress and offline functionality remain available without research, sign-up or a network connection. Research is off by default; declining or withdrawing must be as easy as accepting. No advertisements, sale of research data, required accounts, manipulative consent prompts, or unrelated profiling.

Separate essential local storage from optional adoption/learning research and optional detailed typing research. Provide independently selectable consent, plain-language Korean and English information about purposes, fields, processing, retention, storage, recipients and deletion, and review applicable EU/Dutch and Korean requirements (including minors) before any pilot. Cookies, local storage and other device-access techniques are not automatically exempt from review. Do not call pseudonymous records anonymous. Do not publish a privacy promise before testing it.

- Local-first: compute statistics on-device; participants can inspect them and export deliberately. Optional collection of longitudinal data and any server upload require a clearly explained, affirmative opt-in, approved architecture and explicit launch approval. No silent transfer. The consent state must be checked before measurement and submission; withdrawal stops both.
- Never transmit message content, raw keystroke logs, clipboard contents, entered search queries, exact text sequences, fine-grained timestamps, device fingerprints or unrelated input. Avoid reconstructable sequence statistics; evaluate rare roots, combinations and small cohorts for disclosure risk before permitting even aggregates. No global keyboard hooks or tracking outside the consenting surface.
- Design a bilingual **My Research Data / 내 연구 데이터** view: inspect exact fields, local/exported records and consent state; export, reset, withdraw and request deletion of linked stored records. If uploads are later approved, use a scoped deletion credential or equivalent without requiring an account; document what can and cannot be removed from already irreversibly aggregated public results.
- Set retention, access controls, deletion verification, server/log/IP minimization and a disclosure policy before launch. Assess applicable legal basis, consent rules and child participation; do not enrol minors until safeguards and requirements are settled. No external analytics SDK by default.
- Report aggregate results only when minimum sample sizes and disclosure checks are satisfied; suppress rare cells and misleading small-group comparisons.

## Public-facing programme / 커뮤니티 연구 참여

Treat research as a positive way to contribute to Yubae, not an obscure cookie banner. Propose a public bilingual **Yubae Research / 유배지어 연구** page explaining participation, methodology, data inventory, privacy and opt-out, current questions, findings, experimental layouts and resulting improvements. Invite participation respectfully in the Studio UI and project documentation once the programme is reviewed and actually available. Declining must not reduce functionality.

Illustrative invitation (publish only once the stated safeguards are implemented and verified):

> **Help shape Yubae's future.** Every writer is different. Voluntarily share limited usage statistics to help us make keyboards and learning tools more intuitive, comfortable and efficient. Your messages stay private. Participation is optional; no advertising or account required.

> **유배지어의 미래를 함께 만들어 주세요.** 사람마다 글을 입력하는 방식이 다릅니다. 제한된 이용 통계 제공에 자발적으로 참여하여 더 쉽고 편리한 입력 방식과 학습 도구를 만드는 데 도움을 주세요. 작성한 메시지는 비공개로 유지됩니다. 참여는 선택 사항이며 광고나 계정 가입은 필요하지 않습니다.

Publish periodic Korean/English findings with methodology, participant counts, limitations, uncertainty and changes actually supported by the results. Share community-driven improvements in release notes without claiming effectiveness before testing. Do not publish individual rankings or identifiable histories.

## Delivery gates / 진행 단계

1. Local-only benchmark and method attribution: exercise equivalence, event counting, accuracy, counterbalancing and real-device tests.
2. Draft minimal versioned aggregate schema, data-flow/threat model, consent controls and local review/export. Test opt-out, resets, deletion and absence of raw content; keep all network submission disabled.
3. Review bilingual consent/privacy/storage policy, retention, minors, backend necessity and security with owner; obtain separate approval before a voluntary pilot or public promotional launch. Preserve normal offline use. Do not introduce a hosted service merely to start lessons.
4. Run a small voluntary Korean/English pilot, publish appropriately aggregated findings and iterate with participant feedback.
5. Evaluate layout candidates using observed root/marker demand, modifier effort and usability; compare alternatives in controlled A/B trials. Preserve stable glyph identities, codepoints, existing compatibility and source boundaries. Do not automatically replace the published direct or native layout.

No telemetry, hosting, live research page, legal compliance claim, native instrumentation, or layout change is delivered by this document.
