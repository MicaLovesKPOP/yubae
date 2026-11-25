# Yubae / 유배지어

**An unofficial, bilingual writing and language toolkit for the Exile Zone script.**  
**유배지어를 배우고 쓰고 나누기 위한 비공식 한·영 문자 도구 프로젝트입니다.**

[한국어](README.ko.md) · [Project charter](docs/CHARTER.md) · [Research and source register](docs/RESEARCH.md) · [Encoding and composition](docs/ENCODING.md) · [Roadmap](docs/ROADMAP.md) · [Distribution and collaboration](docs/DISTRIBUTION.md)

## Status — public alpha, 2026-11-25

The 93 glyphs are vector reconstructions of a supplied handwritten chart, not an official complete character set. All current meanings and shapes remain subject to source review. Season reference: The Devil's Plan: Dead Again (season 3). This project is independent of the programme, Netflix, its producers and Stella Jang. No endorsement or permission for the underlying script has been obtained. See [rights and attribution](RIGHTS.md).

- Keyman package for Windows, macOS, Linux, Android and iOS/iPadOS.
- 40 touch layers: glyph/learning labels × Korean/English navigation, phone/tablet.
- 142 English, 233 Hangul and 233 Dubeolsik mnemonics; exact matches only.
- Grammar page: replace the preceding glyph with a known noun/verb/adjective/adverb/colour form. Unsupported combinations do nothing.
- Android input and display verified with v0.3.2; v0.4.0 is compiled and adapter-tested but awaits device testing.
- Browser composer and Chromebook extension are companion targets; browser is the universal display/share fallback.

## Install the public alpha

Download the .kmp from Releases, then install it in Keyman. The package includes the font. Use Keyman's editor on mobile; ordinary apps may not render these private-use characters. Desktop: select Exile Chart in a font-aware editor.

Use /water; for English, /k/anf; (물 typed with two-set Korean key positions) for Korean on a Latin base layout. /물; also matches pre-existing Hangul context, but a conventional Korean IME may not be simultaneously active in the same text field. The browser companion is the preferred route for normal Hangul search. On touch keyboards, tap 한글 / EN to change UI language; 뜻 / ABC selects labels, 문자 / Glyphs selects glyphs.

## Build

Python 3.11+, Node.js 24 (tested), pinned Python dependencies and Keyman compiler:
```sh
python -m venv .venv
# activate .venv for your shell
python -m pip install -r requirements.txt
npm ci
python build_project.py
```
Build artifacts are in dist/. Generated data and character mapping are reviewed with code. Clearly identify provisional glyphs; do not claim authenticity for unreviewed forms. See the charter and RIGHTS.md for release gates.

## Repository structure

source/ — vector outlines, bilingual metadata, composition and native generation.  
data/ — lexicon, stable encoding, missing/reviewed forms and rule exports.  
web/ — self-contained companion source.  
tests/ — reproducible checks.  
docs/ — research, decisions, distribution, acceptance.  
dist/ — generated packages (ignored by Git).

## Rights

Public non-commercial fan alpha, with component-specific licences: MIT for keyboard/shared software, GPLv3-or-later for Studio, CC0 for interoperability specifications and CC BY-SA 4.0 for original editorial knowledge. See the [licence map](LICENSES/README.md). Rights to the underlying script and reconstructed glyph artwork are unresolved and not granted by these licences. No official affiliation. See [RIGHTS.md](RIGHTS.md) for attribution, publication rationale, licence scope and correction/removal requests. No copied programme footage, source chart images, official fonts or logos.
