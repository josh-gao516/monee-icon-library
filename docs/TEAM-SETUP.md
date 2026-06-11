# Team setup — using `@josh-gao/icon-library` with your AI assistant

You don't copy any rules file. The usage protocol ships **inside** the package, so it
always matches the version you have installed. You just (1) install the package and
(2) add a one-line pointer to your project's `AGENTS.md` (or `CLAUDE.md` /
`.cursor/rules`) so your AI assistant reads the bundled protocol.

### 1. Install

```bash
npm install @josh-gao/icon-library
```

Public package — no auth token needed.

### 2. Add this pointer to your repo's `AGENTS.md`

```markdown
## Icons

Use `@josh-gao/icon-library` for all icons. Before using any icon, read and follow
the bundled usage protocol — it is version-matched to the version you have installed:

    node_modules/@josh-gao/icon-library/AGENTS.md

In short: find icons by concept against `icons.json` (each icon has `description` +
bilingual `tags`); use the `<Icon>` component with a token-resolved `color`; if no
icon fits, fall back to `lucide` only, mark it with an `ICON-FALLBACK[...]` comment,
and report the gap so the library can be extended.
```

That's it. Your assistant will open the bundled `AGENTS.md` and follow it.

### Reporting a missing icon

When your assistant can't find an icon and falls back, it leaves a
`// ICON-FALLBACK[concept=…; page=…; source=lucide:…]` marker and produces a short
gap report. Send that report to the library maintainer — it's what drives new icons
and better search descriptions in the next release.

```bash
grep -rn "ICON-FALLBACK" src/   # collect this session's gaps to report
```
