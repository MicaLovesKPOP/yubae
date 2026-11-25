# Distribution, updates and collaboration / 배포·업데이트·협업

## Daily user experience
Start with a one-click URL and a clear platform-specific install button. Readers need no app or account to receive an image or open a message link. Writers can use an offline-first web companion/PWA (normal Korean input search, recent/favourites, share sheet, PNG, portable tokens), or install Keyman if they want typing within other apps. Use the native keyboard in a font-aware editor, not an app that cannot display PUA. KakaoTalk, Instagram, Discord etc are supported via images/share links, not guaranteed plain text.

## Updates
Official catalogue is the preferred route. Keyman Cloud provides in-app discovery and keyboard updates (Android/iOS check and offer updates; macOS/Linux automatic; Windows has configurable updates). See https://help.keyman.com/developer/keyboards/ and https://help.keyman.com/knowledge-base/kb0121. Keep stable keyboard ID and monotonically increasing version. Request Keyman team guidance on PUA, private language tag art-x-exile, naming and licence compatibility before submission. Acceptance is not guaranteed.
- Until catalogue acceptance: public GitHub Releases alpha with checksum, both-language changes, older known-good release available, manual import/upgrade. Do not misrepresent this as automatic native updates.
- Keyboard and shared software use MIT; Studio-specific software uses GPL-3.0-or-later; interoperability specifications use CC0; original editorial materials use CC BY-SA. See LICENSES/README.md; font/script rights are not granted. Review catalogue licensing requirements and resolve any necessary asset permissions, then submit to Keyman experimental and later stable. See https://help.keyman.com/developer/keyboards/github/step-0.
- Web/PWA: static HTTPS hosting, service worker versioned assets, offline cached shell and embedded font, prompt to reload after saving draft when update ready; no silent incompatible migration. Public GitHub Pages is allowed by the standing fan-alpha policy; review site assets, disclosures and acceptance before deployment. No original chart imagery or programme footage.
- ChromeOS: experimental IME extension with permission minimization, no keystroke collection; validate physical mnemonics and actual OS acceptance. If released through Chrome Web Store, managed updates; no sideload requirement for ordinary users. Confirm current developer registration and policy; no spending without approval.
- Fire OS and other browsers: web fallback; Android package compatibility must be tested. No custom native app unless evidence shows Keyman and PWA cannot meet a critical need.

## Build/release discipline
Pinned compiler and dependencies; one shared generator; generate package, web artifact, dictionary and registry from identical data. Run regression checks including previous mapping, Korean/English shortcuts, modifier no-op, source verification status, rendered screenshots, mobile and desktop acceptance. CI can build on demand; no automated public releases or spend. Manual reviewed tag -> release; checksums, applicable component licence texts/notices and reproducible corresponding source/build instructions; keep rollback paths. Separate verified device/version status from compile status.

## Stella Jang and creators
Aim to be useful to her stated interest in continuing to use the script, as reported by secondary sources, rather than launching a competing definition of Yubae. Ask whether she wants collaboration/advisory review; share a working Korean-first demo and a short feedback request. Ask for original complete chart, root/marker rules, her post-show vocabulary, whether she knows the actual designer and their preferred route for permission. Ask how she wants attribution and whether she prefers independent community development or no involvement. She is not assumed to be the script's rights holder. Seek the production/script rights owner for clarification and a mutually acceptable longer-term distribution route, especially for catalogue licensing. Public alpha is not conditional on receiving a reply.
Do not send anything yet. Use official site contact link at https://stella-jang.com/ if outreach approved. Prefer one concise Korean message, no repeated unsolicited contact, no personal contact lookup, no claim of endorsement.

### Draft (not sent)
안녕하세요. 《데블스 플랜: 데드 어게인》의 유배지어를 실제로 배우고 사용할 수 있도록, 한국어와 영어를 함께 지원하는 비공식 입력기 및 문자 도구를 개발하고 있습니다. 스텔라장 님의 유배지어 강의와 방송 이후의 활용에 관심을 갖게 되었습니다.

현재 손글씨 자료를 바탕으로 여러 운영체제에서 작동하는 입력기를 만들었지만, 원전과 글자 뜻을 정확하게 확인하고 싶습니다. 혹시 공개할 수 있는 전체 문자표나 품사·파생 규칙 자료가 있을까요? 유배지어를 계속 발전시키는 방향에 관해 의견을 주시거나, 실제 문자 제작자 및 공개 배포 관련 권리 문의 창구를 알려 주실 수 있다면 감사하겠습니다.

원전과 방송 이후의 용례, 팬 창작을 구분하여 기록하고, 공식 프로젝트나 협업으로 오해되지 않도록 하겠습니다. 원하신다면 간단한 한국어 입력기 시연을 공유드릴 수 있습니다. 참여 여부는 전적으로 편하신 방향에 따르겠습니다. 감사합니다.
