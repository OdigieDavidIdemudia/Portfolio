# CV pipeline

The CV is generated, not hand-edited. One data file feeds both the CV and the
portfolio, so they cannot drift apart.

```
data/cv.json ──┬──> scripts/build_cv.py ──> public/assets/David_Odigie_CV.{docx,pdf}
               │
               └──> scripts/sync_github.mjs ──> src/data/generated-projects.json
                                                     │
src/data/projects.js <───────────────────────────────┘
```

## Commands

| Command | What it does |
|---|---|
| `npm run cv:sync` | Pulls your public GitHub repos into `data/cv.json` and `src/data/generated-projects.json` |
| `npm run cv:build` | Renders the ATS-safe DOCX + PDF and publishes them to `public/assets/` |
| `npm run cv:all` | Both, in order |

## Adding a project

Publish the repo on GitHub. That's it.

`cv:sync` picks up any public, non-fork, non-archived repo that has a
description or a language, and adds it to both the CV and the portfolio.

To control what appears, edit **`data/sync.config.json`**:

- `exclude` — repo names that never appear anywhere
- `overrides.<repo>.cvDescription` — the sentence used on the CV
- `overrides.<repo>.name` — display name (rename `OrangeIntel` to `TealHunt`, etc.)
- `overrides.<repo>.live` — live URL, or `null`
- `overrides.<repo>.hidden` — `true` keeps it out of both outputs

Repos not listed in `overrides` are hidden by default (`includeUnlisted: false`).
That is deliberate: a scratch repo should not end up on your CV because you
pushed it.

## Publications

A repo named `<project>-publication` is treated as the public write-up for
`<project>`, not as a separate project:

- If the source repo exists and is public, the publication is **attached** to it.
- If the source repo is private or missing (e.g. `LinkPass`, `AssetPulse`,
  `pacman`), the publication **stands in** for the project.
- Publication repos never appear as their own project entries.

The link priority for a project's "live" button is:

1. `overrides.<repo>.live` (an explicit `null` suppresses the link)
2. the repo's own `homepage` field
3. the companion publication's page
4. the repo's own GitHub Pages site (`https://<user>.github.io/<repo>/`)

So a project with a publication is clickable straight through to its write-up,
and a repo with Pages enabled but no homepage still gets a working link.

## ATS safety rules

`scripts/build_cv.py` enforces these by construction, and `--check` verifies
them against the generated file before it is published:

- single column, no tables, no text boxes, no images
- no headers or footers (contact details live in the body)
- ASCII only — no smart quotes, en/em dashes, or middots
- one document section
- standard headings: PROFESSIONAL SUMMARY, PROFESSIONAL EXPERIENCE,
  TECHNICAL SKILLS, PROJECTS, EDUCATION, CERTIFICATIONS, PROFESSIONAL DEVELOPMENT
- `MM/YYYY` dates
- title, company, location and dates on separate lines

If `--check` fails, the build exits non-zero and lists the violations.

## Why this exists

The original `David_Odigie_CV (1).docx` had three defects that silently break
ATS parsing:

1. **Double-encoded UTF-8.** `·` was stored as `Â·` (39 occurrences) and `—` as
   `â€"` (15 occurrences). Parsers extracted the garbage literally.
2. **Certifications were in a 7-row table.** Workday's parser is documented as
   failing on tables.
3. **Titles and dates were glued together** with no separator, e.g.
   `Cybersecurity Analyst & Threat Intelligence SpecialistJul 2025 – Present`.

All three are structurally impossible in the generated output.

## Automation

`.github/workflows/sync-cv.yml` runs on every push to `main`, daily at 06:00,
and on demand. It syncs repos, rebuilds the CV, commits the result, and uploads
the DOCX/PDF as build artefacts.

It uses the built-in `GITHUB_TOKEN`, which is enough for public repo metadata.
