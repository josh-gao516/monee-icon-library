<!--
  @josh-gao/icon-library — BUNDLED USAGE PROTOCOL (AGENTS.md)

  This file ships INSIDE the npm package, so it is always version-matched to the
  installed library. Any AI coding assistant (Claude Code, Cursor, Windsurf, …)
  building pages that use this icon library must read and follow it. Consumers do
  not copy this file; their own repo's AGENTS.md points here:
      node_modules/@josh-gao/icon-library/AGENTS.md
  (See the team setup snippet for that one-line pointer.)

  Maintainer: edits to this file are a CONTRACT change — bump a version and
  republish so every consumer's bundled copy updates. See MAINTAINING.md.
-->

## ⚠️ MANDATORY: Icons come from `@josh-gao/icon-library`

Our shared, versioned icon set lives in one public npm package. Every page an
agent builds **must** source icons from this package first. The same `icons.json`
data drives both **React Native** and **Web**, so icons render identically across
platforms.

- **Package:** `@josh-gao/icon-library`
- **Public page (share this with the team):** https://www.npmjs.com/package/@josh-gao/icon-library
- **Access:** public scope — `npm install` needs **no auth token**.
- **Single source of truth:** the icon set, exact names, naming rules, and search
  metadata are defined by the package, not by the agent. Do not invent names or
  inline raw SVG when a package icon exists.

What ships in the package:

| File | Purpose |
|---|---|
| `dist/` | Compiled `<Icon>` component (RN via `react-native` export condition, Web via `import`/`require`). |
| `icons.json` | **Authoritative icon list** (exposed at `@josh-gao/icon-library/icons.json`). The only valid source of icon names, plus each icon's `description`/`tags` search metadata. |
| `NAMING.md` | The naming convention (read this before guessing any name). |
| `AGENTS.md` | **This file** — the usage protocol you are reading. |
| `CHANGELOG.md` | What changed per version (check it after updating to see if new icons landed). |
| `README.md` | Usage examples. |

Peers (already present in a normal RN app): `react >=18`, `react-native-svg >=13`.

---

## Golden rules (TL;DR)

1. **Never guess an icon name.** Read it from `icons.json`. Names use SF-Symbols
   **dot notation** (`chevron.left`, `creditcard`, `lock.fill`) — **not** kebab-case.
2. **Match by meaning, not by spelling.** Each icon entry carries a `description`
   and `tags` (tags are **bilingual — English + Chinese**); match the concept you
   need against that metadata in either language, then use the icon's exact key.
3. A wrong name fails **silently** (the component `console.warn`s and renders
   nothing). There is no crash to catch — so name validation is on you.
4. **Package first.** Only fall back to an open-source icon when the package has
   no suitable match — and when you do, follow the fallback rules and log it.
5. **Every fallback must be reported** so the package can be extended later.
6. On a returning session, **make sure the package is current** and try to retire
   any fallbacks the package now covers. Don't churn icons that still resolve.

---

## Page-creation workflow (follow in order, every time)

### Step 0 — Ensure the package is installed and current

**First time in a repo** (package not in `package.json`):

```bash
npm install @josh-gao/icon-library
```

**Returning** (package already installed): check whether the installed version is
behind the registry, and update if so.

```bash
npm ls @josh-gao/icon-library           # installed version
npm view @josh-gao/icon-library version # latest published version
npm install @josh-gao/icon-library@latest   # if behind
```

> Updates are additive and safe to take: new icons and richer search metadata get
> added over time; existing keys stay valid. (JS-only package — an RN/Expo app
> only needs a Metro reload after updating, not a native rebuild.)

### Step 1 — Find the right icon by concept, against the real data

Before writing any `<Icon name="…">`, dump the authoritative entries — **names plus
their `description`/`tags`** — and match the design's concept against that metadata.
Do **not** rely on memory of the API; the set grows over time.

```bash
# Print every icon: name — tags — description
node -e "const ic=require('@josh-gao/icon-library/icons.json').icons; for (const [n,v] of Object.entries(ic)) console.log(n + '  |  ' + ((v.tags||[]).join(', ')) + '  |  ' + (v.description||''))"
```

- Pick the icon whose **`description`/`tags`** best fit the meaning you need (e.g.
  a "log out / sign off" concept, a "settings / preferences" concept). `tags`
  include Chinese terms, so a Chinese concept matches too. Then use its exact key.
- For a filled style, use the `.fill` variant of that base name.
- `description`/`tags` are **discovery metadata only** — they help you choose the
  right key. They do not affect rendering (the component looks up `paths` by the
  opaque key).

### Step 2 — Use the `<Icon>` component

```tsx
import { Icon, type IconName } from '@josh-gao/icon-library';

// `color` is REQUIRED — pass a resolved design-token value, never a raw hex.
// `size` is OPTIONAL — omit to use the icon's default (24).
<Icon name="lock" color={colors.foreground} />
<Icon name="chevron.right" size={16} color={colors.muted} />
```

- Prefer the exported **`IconName`** type for props so invalid names are caught at
  build time (TS) wherever possible.
- Do **not** set stroke width / line caps per use — styling is centralized in the
  component (keeps the line weight consistent).
- Do **not** paste raw `<svg>`/`<Path>` for anything the package already provides.

### Step 3 — Only if there is no suitable package icon: controlled fallback

A fallback is allowed **only** after Step 1 confirms no package icon fits (by name
and by `description`/`tags`). When you fall back, obey all of:

1. **Use one sanctioned fallback library**, not a mix: **`lucide`** (web) /
   **`lucide-react-native`** (RN). It is the closest visual match to our line style
   (24×24 grid, ~2px stroke, round caps). Never introduce a second fallback lib.
2. **Match the visual style** (line, not filled, unless the design demands fill;
   24px box; round caps) so the fallback doesn't read as foreign next to package
   icons.
3. **Keep the fallback import local** to the file (don't add it to shared barrels)
   so it's trivial to delete later.
4. **Tag it with a greppable marker comment** directly above the usage, so the
   replacement sweep and the gap report can be produced mechanically:

```tsx
// ICON-FALLBACK[concept=settings; page=SettingsScreen; source=lucide:Settings]
import { Settings } from 'lucide-react-native';
```

   Marker format (keep the keys, semicolon-separated):
   `ICON-FALLBACK[concept=<semantic-concept>; page=<Page/Component>; source=<lib>:<exportName>]`

### Step 4 — Emit the gap report (every fallback used this session)

Collect all fallbacks introduced and produce a report for the package maintainer.
The marker comments make this a one-liner:

```bash
grep -rn "ICON-FALLBACK" src/   # lists every fallback with concept + page + source
```

Deliver the report in **this exact table** (append to a running `ICON-REQUESTS.md`
at repo root if one exists, and surface it to the human at the end of the task):

| Concept (semantic) | Suggested name (our convention) | Page / Component | Fallback used (lib:export) | Suggested description / tags |
|---|---|---|---|---|
| settings / gear | `gearshape` | SettingsScreen | lucide:Settings | "app settings, preferences, configuration"; tags: settings, gear, preferences |
| … | … | … | … | … |

- **Concept** = the meaning the page needed (not a guessed file name).
- **Suggested name** = your best proposal in the SF-Symbols convention (helps the
  maintainer name the future asset). If unsure, leave blank.
- **Suggested description / tags** = a short natural-language gloss + synonyms. The
  maintainer uses this to author the new icon's `description`/`tags` so the next
  agent finds it by concept in Step 1. Be generous here.

This report is the **product feedback loop**: it tells the maintainer which icons
to add next and how to describe them for search.

### Step 5 — Returning sessions: reconcile after an update

After Step 0 confirms the package is current, before finishing the page:

1. **Re-run the fallback sweep** (`grep -rn "ICON-FALLBACK" src/`). For each
   fallback, redo Step 1 against the updated metadata — if the package now covers
   that concept, **replace the fallback** with `<Icon name="…">` and delete the
   marker + the local import.
2. **Keep everything that still resolves.** If an existing `<Icon name="…">` is
   still a valid key in `icons.json`, leave it untouched — do not churn working icons.
3. Add any **newly introduced** fallbacks to the gap report (Step 4).

---

## Naming convention (so the agent stops guessing)

Names follow SF-Symbols-style rules (full spec in the package's `NAMING.md`):

- **Dot `.` separates structural suffixes** — direction (`chevron.left`,
  `chevron.right`), enclosure, negation, fill (`lock.fill`, `home.fill`), badge —
  in that slot order.
- **Compound nouns are concatenated, no separator** — `creditcard`, **not**
  `credit-card`; `gearshape`, **not** `gear-shape`.
- **Base name = the primary (line) form**; the `.fill` suffix is the filled variant.
  Each name is an independent key — `chevron.left.fill` is its own icon, not a
  computed variant of `chevron.left`.
- ❌ Therefore: **never** assume kebab-case. `chevron-left` is wrong; the key is
  `chevron.left`.

Current base concepts (each also has a `.fill` variant):

```
bank · bell · chevron.left · chevron.right · copy · creditcard ·
gift · home · lock · shield · user
```

⚠️ This printed list **will go stale**. Treat `icons.json` (Step 1) as truth, not
this snippet.

---

## Versioning & updates

- Always work against the **latest** published version (Step 0). Updates are
  **additive**: icons and search metadata get added; existing keys stay valid, so
  taking an update never breaks current usage.
- After any update, run the **Step 5** fallback-replacement sweep so newly added
  icons retire earlier fallbacks.

---

## Definition of done (icon checklist)

Before finishing a page, confirm:

1. ☐ Package installed and on the latest version (`npm view … version`).
2. ☐ Every icon chosen by matching concept against `description`/`tags`, and every
   name validated against `icons.json` — no guessed/kebab names.
3. ☐ All available icons use `<Icon>`; no inline SVG duplicating a package icon.
4. ☐ Every `<Icon>` passes a **token-resolved `color`** (no raw hex).
5. ☐ Each fallback uses `lucide` only, matches the line style, and carries an
   `ICON-FALLBACK[...]` marker.
6. ☐ Gap report produced (Step 4), with suggested description/tags, and surfaced to
   the human.
7. ☐ (Returning sessions) fallback-replacement sweep run; unchanged icons left intact.
