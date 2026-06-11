# Team setup — using `@josh-gao/icon-library` with your AI assistant

**One step:** paste the block below into your project's `AGENTS.md` (or `CLAUDE.md` /
`.cursor/rules`). You do **not** run any install command yourself and you do **not**
copy any rules file — the pointer tells your AI assistant to install the package and
then read the usage protocol that ships **inside** it (so the rules always match the
version you have).

### Paste this into your repo's `AGENTS.md`

```markdown
## Icons

Use `@josh-gao/icon-library` for all icons.

1. Ensure it's installed (public package, no auth token). If it's missing, install it:
       npm install @josh-gao/icon-library
2. Then read and follow the bundled usage protocol — it is version-matched to the
   installed version:
       node_modules/@josh-gao/icon-library/AGENTS.md

In short: find icons by concept against `icons.json` (each icon has a `description`
+ bilingual `tags`); render with the `<Icon>` component and a token-resolved `color`;
if no icon fits, fall back to `lucide` only, mark it with an `ICON-FALLBACK[...]`
comment, and report the gap so the library can be extended.
```

That's the whole setup. The first time your assistant needs an icon, it installs the
package (adding it to your `package.json` like any dependency) and then follows the
bundled `AGENTS.md` from there.

> Why the install line lives in the pointer: the full protocol file only exists
> *after* the package is installed, so the pointer carries just enough to bootstrap —
> install first, then read the rest from inside the package.

### Reporting a missing icon

When your assistant can't find an icon and falls back to `lucide`, it leaves a
`// ICON-FALLBACK[concept=…; page=…; source=lucide:…]` marker and produces a short
gap report. Send that report to the library maintainer — it's what drives new icons
and better search descriptions in the next release.

```bash
grep -rn "ICON-FALLBACK" src/   # collect this session's gaps to report
```
