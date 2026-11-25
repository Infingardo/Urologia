# Urologia: instructions for Claude and Codex

Uropathology tools. Each tool is a self-contained HTML page in its own folder (currently `urotelio/`: checklist of urothelial proliferations and neoplasms, WHO 2022). The output is a morphological orientation, never a diagnosis: classifying a case stays the pathologist's decision. Never present a tool otherwise.

## Rules
- Diagnostic content (categories, criteria, thresholds, ICD-O codes, wording) is curated by Filippo. Change it only on his instruction or from a cited source, never from memory. If code and source disagree, report it; do not choose.
- Every finding has three states (not evaluated / absent / present): an empty field is not "absent". No verdict on incomplete or contradictory input; no field silently changes another one. No fake precision: show uncertainty and equivocal results.
- The decision logic lives in `<script id="uro-engine">` and stays pure (no DOM, no global state), so `tests/run.mjs` can run it in Node.
- Before changing anything that can alter an output: plan first, state which outputs change, add or update tests with at least one input per affected class, and run `npm test` before closing.
- After such a change, get an independent review against the agreed spec or the cited source.
- Keep `README.md` and `CHANGELOG.md` aligned with any change in behavior or version.
- Offline-first: no page loads external resources (fonts, scripts, styles, images). If a library is ever needed it goes in `vendor/`. `npm test` checks this; never bypass hooks with `--no-verify`.
- No patient data in code, tests, fixtures, docs or commit messages.
- `AGENTS.md` is a copy of this file for Codex: keep the two aligned when you edit either.
