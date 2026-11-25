# Licensing map / 라이선스 안내

Yubae uses component-specific free licences to maximize interoperability while keeping improvements to the application and community knowledge available to others. These grants cover only material for which the project contributors have the relevant rights. See [RIGHTS.md](../RIGHTS.md) for the separate, unresolved underlying script and glyph rights.

| Component | Licence | Scope |
| --- | --- | --- |
| Keyboard and shared software | MIT | Original native keyboard implementation, ChromeOS input method, build tools, tests, shared software and the functional keyboard labels, aliases and lookup rules required for independent keyboard builds. See [LICENSE](../LICENSE). |
| Yubae Studio | GPL-3.0-or-later | Original application-specific implementation in web/, including future distributed PWA builds. See [GPL](GPL-3.0-or-later.txt). Independently MIT-licensed shared modules keep their original licence. |
| Interoperability specifications | CC0-1.0 | Original encoding/interchange specification, stable semantic IDs and private-use mapping data, including docs/ENCODING.md and data/encoding-v1.json. See [CC0](CC0-1.0.txt). No claim to ownership of the language. |
| Dictionary and educational materials | CC-BY-SA-4.0 | Original editorial dictionary entries, explanations, examples, research annotations and educational documentation, including original contributions to the lexicon and documentation. See [CC BY-SA](CC-BY-SA-4.0.txt). Functional lookup data used in the keyboard may also be used under MIT to maintain Keyman compatibility. |
| Typeface and reconstructed glyph artwork | Rights unresolved; SIL OFL 1.1 intended if permitted | No new licence grant for the underlying script or glyph designs; no OFL licence is represented as currently in force. |

The original source and lookup data may contain separately licensed or excluded material. In particular, source/glyphs.py contains reconstructed shapes, and source/lexicon.py and data/lexicon.json contain both functional keyboard data and editorial material. A software or database licence does not confer rights to those underlying glyphs or third-party expressions. Keep source references and attribution notices when redistributing.

## Contributions and releases

- Submit original contributions under the licence of the component being changed; clearly identify third-party content and its licence or permission. For dual-purpose keyboard metadata, allow MIT use of the functional portion.
- Distribute Studio modifications under GPL-3.0-or-later with the corresponding source, build instructions and notices required by the GPL. Public use of a modified server alone is not necessarily distribution under GPL; if a hosted backend is ever introduced, review AGPL separately rather than assuming GPL covers server-side changes.
- Distribute adaptations of original CC BY-SA educational materials under the same or a compatible licence, with attribution. Individual user-written messages and ordinary outputs are not automatically licensed under GPL or CC BY-SA merely because a Yubae tool generated or displayed them.
- All three software/content licences allow commercial use where their conditions and any underlying third-party rights are satisfied. The project's own operation remains non-commercial; the licences are not non-commercial-only restrictions.
- Previously granted MIT permissions remain valid for earlier software releases. This policy does not retroactively revoke them. New Studio-specific work follows GPL; existing MIT modules can be used within GPL Studio without changing their original grants.
- Package each release with the applicable licence texts, notices and source availability; do not label the entire mixed-licence repository or bundled font MIT or GPL. A Keyman catalogue submission must meet the catalogue's licence and asset requirements independently.

## 한국어

- 입력기 및 공용 소프트웨어: MIT. 다른 입력기에서도 자유롭게 사용할 수 있도록 합니다.
- 유배지어 편집기(Yubae Studio)의 독자 개발 부분: GPL-3.0-or-later. 수정한 프로그램을 배포할 때에는 GPL에 따라 대응 소스 코드도 제공해야 합니다.
- 독자 작성한 문자 부호화·상호 운용 명세 및 매핑: CC0-1.0.
- 독자 작성한 사전의 설명, 학습 자료 및 연구 주석: CC BY-SA 4.0. 출처를 표시하고 개작물을 같은 조건으로 공유합니다. 입력기에 필요한 기능적 검색 데이터는 MIT로도 사용할 수 있습니다.
- 재구성한 글자 도안 및 글꼴: 권리 관계 미확인. 허용될 경우 SIL OFL 1.1을 검토합니다. 현 시점에서 원래 문자나 글꼴에 대한 권리를 허가하는 것은 아닙니다.

상업적 이용은 각 라이선스의 조건과 제3자의 권리를 준수하는 범위에서 허용됩니다. 이 프로젝트 자체는 비영리로 운영합니다. 이전 MIT 배포본의 권리는 유지됩니다. 기여할 때에는 해당 구성 요소의 라이선스를 따르고 제3자 자료의 출처와 이용 조건을 명시해 주세요.
