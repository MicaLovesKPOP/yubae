# Geometry and corpus audit / 문자 형태 및 원전 조사

2026-11-25 — Native 0.5.2 / Studio 0.5.0-alpha.5. This is an evidence-led reconstruction, not an official character chart.

## Evidence retrieved

- P1: [Stella Jang's lecture](https://www.youtube.com/watch?v=xss78qe_ko4). Public page with chapter boundaries and public 320x180 storyboard frames sampled at ten-second intervals, through 20:50. Korean automatic-caption endpoint returned no text, so the full spoken explanation was not reviewed. The timestamps below refer to storyboard samples and not exact speech start times.
- S1: [Korean Exile Zone decipherment](https://namu.moe/w/데블스%20플랜%3A%20데드%20어게인/유배지). The entire text for its 15 numbered areas was recovered; its floor-map image returned HTTP 503. Zone numbers are fan editorial locators. Treat the readings as secondary evidence.
- S2: [Early Korean visual decipherment](https://gall.dcinside.com/mini/board/view/?id=devilsplans3&no=32708&page=1). Two annotated images recovered and inspected. They include crops of original inscriptions, but early glosses may be inaccurate.
- S3: [Hweek gallery](https://hweek.kr/article/9043), including a reproduced Netflix floor image and excerpts from the lecture. Examined relevant images. Evidence images, full web pages and captions are kept out of Git and release packages.

The original programme is season 3, Dead Again, according to the Korean sources. No authoritative complete glyph map or original vector artwork was obtained.

## Numerals 3 and 4

P1 samples at 06:10 and 06:30 show the consecutive numeral series with 3 and 4 as opposed crossed-chevron constructions. S3 gallery 2 shows two floor occurrences of numeral 4, with joined middle top/bottom vertices. This supports the owner's rotational hypothesis. An exact square ratio is an editorial normalization, not a measured specification from the designer.

Use a single pair of continuous opposing chevrons in the 100-unit coordinate grid. Center (50,51); endpoints 20..80 horizontally, 21..81 vertically. Rotate all points by 90 degrees about that center to generate 4. Both have exact horizontal and vertical centerline reflection symmetry, with distinct orientations and equal stroke widths. Rounded outline tessellation differs by less than 0.02 grid units between width and height; exact rotation overlap is 1.0 within numerical tolerance. The TrueType quantizer rounds about integer center (480,401), then rotates the quantized 3 contour to produce 4. Both packaged glyphs have exact 570 x 570 bounds, both mirror axes, and exact quarter-turn coordinate equality. The final embedded font also rendered equal square bounds in an offline Chromium smoke test. Keep U+E003 and U+E004 unchanged. Comparison with v0.5.1 verified that all other 158 writable outlines, their advances, and all mappings are unchanged.

Zero: P1 06:30 explicitly shows a square in the zero demonstration. The floor's reported blank numeral slot does not establish that written zero is impossible. Keep square zero distinct from open-corner 8. Whether the square was printed on the original floor remains unresolved.

## Bounding-box findings

Hand-localized warm-pixel masks of S3 gallery 2, measured at four thresholds; widths and heights include the upper grammatical marker when present. Results vary with threshold, compression and camera perspective.

| Complete symbol | Approximate W/H range in selected image |
|---|---|
| 4, first occurrence | 1.00–1.17 |
| 4, second occurrence | 0.93–1.03 |
| Human (noun), two occurrences | 0.68–0.80 |
| Has/exists (verb) | 0.46–0.51 |
| Can | 0.81–0.87 |

Thus the observed symbols do not all occupy equal square tight boxes. Do not stretch each symbol independently to 1:1. Distinguish design cell, bare-root bounds, marked-form bounds, baseline and advance width. Original floor image proportions are approximate and not perspective-corrected; more views are needed for precise geometry.

The reproducible vector audit of our reconstruction finds 26/83 root previews and 46/160 writable symbols within 5% of square. This is a description of current software, not a statistic for the authentic script. It measures root/complete outline dimensions, symmetry and similarity across all current entries. Tolerant overlap is a review aid: for example AND/live resemble each other, but zero/eight and minute/hour also score highly despite being semantically distinct.

## Corpus coverage and root relationships

data/corpus-review.json records the 15 secondary-source areas, 36 distinct area-linked research questions, nine prioritized relationship records, and a separate later-usage register. data/research-queue.json has 39 research items (not 39 proven missing characters; includes disputes and broad audit tasks). No new meanings or codepoints are introduced in this geometry revision.

Highest-value next investigations:
1. Head noun versus know verb: S1 area 12 explicitly identifies the same body with different upper marker. S3 gallery 6 reproduces later usage; remember/think may be broader later senses, not identical to the original meaning.
2. Dwell verb versus house noun: S1 areas 3 and 11 explicitly relate them. Compare the actual house body to the current dwell root before adding it.
3. Life/death nouns: S1 area 2 and P1 around 11:00 support these forms. AND and live appear to share a graphic shape. Keep their existing IDs distinct, introduce a graphic-family relationship before considering a UI merge, and preserve legacy root-live text.
4. Missing functional marks: equals, not-equals, instrumental particle, ordinal 1/2/6. The ordinal examples may mark more than one endpoint, especially 6; do not apply a universal one-dot recipe.
5. Other reported forms: tail, scorpion and its adjective, human/number/table/final adjectives, spatial adverbs, method, contest, victory, hole/spear adverbs. Reconcile table versus magic square, below versus current bottom, and arm/leg versus hand/foot against legible source.
6. Colour: keep grammatical upper markers distinct from lower colour dots. P1 08:00 and application segment discuss extension of colour vocabulary. Treat new participant-derived words as later usage; distinguish them from show corpus. The precise original purple root remains unconfirmed.
7. Cry: original corpus uses the broader sound-making verb in the bird and human examples. It is not yet established that there is a separate missing cry glyph.

## Reproducibility

Run python tests/test_geometry.py and python source/audit_geometry.py with the pinned font dependencies. The standard build invokes both. The generated data/geometry-audit.json covers all 83 roots and 160 writable entries. data/source-geometry-sample.json records the image checksum, crop windows, thresholds and measured bounds. Raw source images are not published. For future original-source audits, store URL/episode/timecode, source class, shape observations, semantic confidence and geometry decision separately. Only promote a new form when evidence and compatibility are reviewed.

## 한국어 요약

3과 4의 대칭 및 90도 회전 관계를 강의의 숫자 예시와 방송 바닥 사진을 통해 검토했습니다. 정사각형 비율은 편집상의 정규화이며 공식 도안의 정확한 치수를 확인한 것은 아닙니다. 사람·있다 등의 실제 외곽은 정사각형이 아니므로 모든 글자를 강제로 정사각형으로 변형하지 않습니다. 기존 부호는 유지합니다.

한국어 해독 자료의 15개 구역을 검토했으며, 머리→알다, 거주하다→집, 삶·죽음, 서수와 문법 표지 등 추가 검증이 필요한 형태를 기록했습니다. 아직 공식 전체 문자표를 확보하거나 강의 전체를 직접 검증한 것은 아닙니다. 원전, 방송 이후의 용례, 팬 창작을 구분합니다.
