# MAINTAINING.md — `@josh-gao/icon-library`

> **Audience: the library maintainer (you) only.** This file is **not** published to
> npm — it lives on GitHub. Consumers never see it.
>
> It defines how to make a change to the library and keep the surrounding documents
> in sync, so you can run a release by following a checklist instead of re-deciding
> each time.

- **GitHub (source of truth):** https://github.com/josh-gao516/monee-icon-library
- **Local working copy:** `/Users/gaopeng/dev/monee-icon-library`
- **npm package:** https://www.npmjs.com/package/@josh-gao/icon-library

---

## 1. The artifacts and where each lives

| Artifact | Local | GitHub | npm package (`files`) | Audience |
|---|---|---|---|---|
| `icons.json` | ✓ | ✓ | ✓ | runtime + search data |
| `dist/` | ✓ (built) | gitignore | ✓ | runtime |
| `README.md` | ✓ | ✓ | ✓ | humans (npm page) |
| `NAMING.md` | ✓ | ✓ | ✓ | naming handbook (humans + AI) |
| `AGENTS.md` | ✓ | ✓ | ✓ | consuming **AI agents** (usage protocol) |
| `CHANGELOG.md` | ✓ | ✓ | ✓ | consumers ("what changed") |
| `MAINTAINING.md` | ✓ | ✓ | ✗ | **you** (this file) |
| `raw/` (source SVG) | ✓ | ✓ **(critical backup)** | ✗ | editable source |
| `scripts/` (build/verify/descriptions) | ✓ | ✓ | ✗ | build-time |
| `.npmrc` (token) | ✓ (delete after publish) | ✗ **gitignore** | ✗ | secret |

Two rules that protect you:
- **`raw/` + `scripts/` must be on GitHub.** The npm tarball ships only *built*
  artifacts (`dist/`, `icons.json`); you cannot reconstruct the editable source from
  them. GitHub is the only backup of the regenerable source.
- **`.npmrc` never goes to git or npm.** It carries the publish token. Create it at
  publish time, delete it immediately after.

`package.json` `files` whitelist should be:
```json
"files": ["dist", "icons.json", "NAMING.md", "AGENTS.md", "CHANGELOG.md"]
```

---

## 2. Change taxonomy → what to sync

Classify every change as **A**, **B**, or **C**. This decides which documents move
and what the version bump is.

| Type | What it is | `icons.json` | `NAMING.md` | `AGENTS.md` | Version |
|---|---|---|---|---|---|
| **A** | Add icons (existing naming rules); add/improve description·tags | changes | — | — | **MINOR** |
| **B** | A naming decision the current rules don't cover (first use of an enclosure/negation/badge suffix; a genuinely ambiguous compound-noun call) | changes | **update** (add the decided example; flip a Reserved slot to In use) | — | **MINOR** |
| **C** | Change a naming rule, rename existing icons, change the schema, change the component API / props / not-found behavior, or change package name/exports | changes | maybe | **update** | **MAJOR** |

Why `AGENTS.md` only moves on **C**: it encodes the *contract* (component import,
`name`/`color`/`size` props, dot-notation rule, not-found behavior, the shape the
dump command relies on — `icons.json.icons` with `tags`/`description`). It is
**inventory-agnostic on purpose** — it never hardcodes the icon list, so adding
icons (A) never touches it.

> **Keep `AGENTS.md` inventory-agnostic.** The "Current base concepts" snippet in it
> is illustrative and marked "will go stale." Never expand it into a full list — that
> would re-couple the doc to the inventory and force an edit on every A-type release.

`README.md`: update only if usage examples or the API changed (≈ a **C** change). Adding
icons does not require README edits.

---

## 3. Release checklist (run top to bottom)

Most releases are **type A** (adding icons). Steps 1–3 cover the source change; the
classification in step 4 is the only real decision.

1. **Edit source**
   - Add SVG(s) to `raw/` (line + the `.fill` partner, Untitled UI line style, 24×24).
   - Run the description/tags generator so new icons get `description` + bilingual `tags`.
   - `npm run build` → regenerates `icons.json`.
   - `npm run verify` (or `tsx scripts/verify.ts`) → confirm names, paths, suffix order, metadata present.

2. **Eyeball the data**
   ```bash
   node -e "const ic=require('./icons.json').icons; for (const [n,v] of Object.entries(ic)) console.log(n,'|',(v.tags||[]).length,'tags |',(v.description?'desc':'NO DESC'))"
   ```
   Every icon should report tags and `desc`.

3. **Classify the change → A / B / C** (table in §2).

4. **Sync documents per the classification**
   - **A** → no doc edits (just the CHANGELOG entry in step 5).
   - **B** → update `NAMING.md` (add the example / flip the Reserved slot).
   - **C** → update `AGENTS.md` (+ `NAMING.md` / `README.md` as needed).

5. **Write the `CHANGELOG.md` entry** under a new version heading
   (e.g. `## [2.1.0] — YYYY-MM-DD`), category `Added` / `Changed` / `Fixed`.
   For added icons, list them: `Added: gearshape, gearshape.fill, …`.

6. **Pick the version number** (from the §2 table): A/B = MINOR, C = MAJOR,
   docs/packaging-only = PATCH.

7. **Publish**
   ```bash
   cd /Users/gaopeng/dev/monee-icon-library
   npm version <minor|major|patch>        # bumps package.json + git tag
   npm run build                          # (prepublishOnly also rebuilds)
   npm pack --dry-run                     # verify file list: AGENTS.md, CHANGELOG.md, NAMING.md, icons.json, dist/ present
   printf '//registry.npmjs.org/:_authToken=%s\n' '<YOUR_TOKEN>' > .npmrc
   npm publish --access public            # or: npm publish --otp=<code>
   rm .npmrc
   ```

8. **Push source + tags to GitHub**
   ```bash
   git push && git push --tags
   ```

9. **Verify the published result**
   ```bash
   npm view @josh-gao/icon-library version          # expect the new version
   npm pack @josh-gao/icon-library@<new> --dry-run  # confirm bundled files
   ```
   For metadata changes, pull the tarball and confirm `icons.json` carries the new
   fields (don't trust local — confirm what consumers actually receive).

10. **Tell the team only if it matters to them** — a one-line "vX.Y.Z: added A, B, C
    icons" so their agents know to re-run the fallback sweep. The bundled `CHANGELOG.md`
    already records it; the ping is just a nudge.

---

## 4. First incremental run (no defined flow yet)

You haven't run an add-icon release end to end. For the **first** one, do a tiny
batch (1–2 icons) as a dry run of this checklist, and confirm at the end:

- the new names appear in the published `icons.json` (step 9),
- they carry description + bilingual tags,
- a consuming agent, pointed at `node_modules/@josh-gao/icon-library/AGENTS.md`, can
  find them by concept and stop using a prior fallback.

Once that round works, the checklist is proven and later batches are routine.
