# Changelog

All notable changes to `@josh-gao/icon-library` are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/); this project
follows [Semantic Versioning](https://semver.org/).

> **How versions map to changes in this project** (see `MAINTAINING.md` for the full rule):
> - **MINOR** (`x.Y.0`) — new icons, or new search metadata consumers can use. Backward compatible.
> - **PATCH** (`x.y.Z`) — docs, packaging, or build-only changes; nothing a consumer's code or the rendered output changes.
> - **MAJOR** (`X.0.0`) — naming-rule, schema, or component-API changes (breaking).

---

## [Unreleased]

---

## [2.0.4] — 2026-06-11

### Added
- Bundled **`AGENTS.md`** (machine-readable usage protocol for AI coding assistants)
  and this **`CHANGELOG.md`** into the published package via the `files` whitelist,
  so both are version-matched to the installed library.

---

## [2.0.3] — 2026-06-11

### Added
- `description` and `tags` metadata on **all 22 icons** for concept-based discovery
  by AI agents. Tags are **bilingual (English + Chinese)**.

> Note: this content is additive and, by the rule above, would conventionally be a
> **minor** bump. It shipped as a patch; future additive releases will use minor.

## [2.0.2] — 2026-06-11

### Fixed
- README link to `NAMING.md` changed from a relative path (which 404s on the npm
  site) to an absolute GitHub URL.

## [2.0.1] — 2026-06-10

### Added
- `NAMING.md` is now included in the published package (added to the `files` whitelist).

### Changed
- Synced the updated README to the npm package page.

## [2.0.0] — 2026-06-10

### Changed (BREAKING)
- **Flattened the icon schema.** Removed the nested `variants: { line, solid }`
  structure and the `variant` prop. Each style is now an independent flat key, with
  the `.fill` suffix marking filled icons (e.g. `lock` and `lock.fill` are two
  independent keys, not a base + computed variant).
- **Adopted SF-Symbols-style naming.** Renamed keys: `chevron-left` → `chevron.left`,
  `chevron-right` → `chevron.right`, `credit-card` → `creditcard` (plus their `.fill`
  variants). Structural suffixes use dot notation; compound nouns are concatenated.

### Added
- `NAMING.md` naming-convention handbook (authored this release; bundled from 2.0.1).
- Strict not-found behavior: an unknown name triggers a `console.warn` and renders
  nothing (no throw).

## [1.0.0] — 2026-06-10

### Changed
- First **stable** release. Nested `variants: { line, solid }` schema with the
  `variant` prop; kebab-case names (`chevron-left`, `credit-card`, …).

## [0.1.3] — 2026-06-09

### Added
- README.
- License set to MIT.

## [0.1.1] — 2026-06-09

### Changed
- Packaging and publish-metadata refinements (e.g. peer-dependency range widened to
  `react >=18`, exports map).

## [0.1.0] — 2026-06-09

### Added
- Initial public release. **11 icons** in line + solid variants.
- Dual-platform: React Native (`react-native-svg`) and Web (native `<svg>`), both
  driven by a single `icons.json` source of truth.
- tsup dual build (CJS + ESM + `.d.ts`) with a `react-native` export condition.

---

<!--
  MAINTAINER NOTE (remove or keep): entries for 0.1.0–1.0.0 were reconstructed from
  project history. Verify exact per-version detail against your tags/log before
  treating this as authoritative for the pre-2.0 line:
      git tag -l
      git log --oneline --decorate
  From 2.0.x onward, write the entry as part of each release (see MAINTAINING.md).
-->
