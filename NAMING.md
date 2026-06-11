# NAMING.md — `@josh-gao/icon-library` Naming Convention

> **Status: SF Symbols naming rules fully adopted.**
> This document serves as both the implementation blueprint for **v2.0.0** and the **naming handbook for all future icon additions**.

---

## 0. Mental Model (Clear Up the Most Common Misconceptions First)

Lock these in before reading the rules — skipping this section leads to repeated confusion:

- **Flat namespace:** Every name = one independent SVG file = one flat key in `icons.json`.
- **Suffixes are not variants:** `chevron.left.fill` and `chevron.left` are **two completely independent icons**. The former is not a "filled version" of the latter. The system **never** interprets them as "the same base with a fill variant" — the concept of variants was eliminated during the previous flattening.
- **"Base / suffix" is human-readable naming language, not a system concept.** The runtime components (`Icon.native.tsx` / `Icon.web.tsx`) treat keys as **opaque strings** — `icons[name]` is a single lookup that **never splits on dots or interprets dot semantics**.
- **The only functional role of dots:** They allow the build-time `verify` script to split a name into segments and **validate suffix spelling and ordering**. Because base names use concatenation (no dots) and dots are exclusively for suffixes, the boundary is unambiguous and verification stays clean. Beyond that, dots vs. any other separator has **zero runtime impact**.

> In short: you are choosing a **naming style**, not introducing a new parsing mechanism.

---

## 1. Scope and Trade-offs

- **Goal:** Unify `@josh-gao/icon-library` naming to SF Symbols style (concatenated base names + dot suffixes), and codify the rules into a verifiable, referenceable spec.
- **Nature of change:** Renaming invalidates existing keys → **breaking change → 2.0.0** (currently published as 1.0.0).
- **Consumer impact (small and contained):** Any consumer pinned to `^1.0.0` will **not auto-upgrade to 2.0.0** and is completely unaffected until explicitly updated. When upgrading, only a small number of renamed call sites need updating (`chevron-left` → `chevron.left`, etc.).

---

## 2. Two Core Naming Rules

SF Symbols treats two types of name components differently — this is the foundation of the entire spec.

### Rule A — Compound Nouns: Concatenate, No Separator
When multiple words together form **a single noun concept**, join them into one lowercase word.
- `credit-card` → **`creditcard`** (**not** `credit.card`)
- Real SF Symbols examples follow the same pattern: `creditcard`, `paperplane`, `archivebox`, `externaldrive`.

### Rule B — Structural Modifiers: Use a Dot `.`
When a segment is a **structural modifier** of the base name (direction / enclosure / negation / fill / badge), connect it with a dot.
- `chevron-left` → **`chevron.left`** (`left` is a direction modifier)
- `arrow` + up + circle enclosure + filled → `arrow.up.circle.fill`

### The Decision Test (Every Multi-Word Icon Must Pass This)
> **Is the second word "part of the noun" or "a modifier of the base name"?**
> Part of the noun → concatenate (A). Direction / enclosure / state modifier → dot (B).

The canonical contrast: **`creditcard`** (card is part of the noun) vs **`chevron.left`** (left is a direction modifier). Both appear to be "two words" on the surface but resolve oppositely — **this judgment has no mechanical shortcut; each case requires a human decision.**

---

## 3. SF Symbols Naming Reference (Future Naming Handbook)

> The rules below are derived from real SF Symbols symbol names. This library **adopts the syntactic rules only — not Apple's icon vocabulary** (icon assets come from our own design resources). The token lists below are common examples, not exhaustive.

### 3.1 Overall Name Structure
```
base[.count][.direction][.enclosure][.negation][.fill][.badge.X]
```
The base name is leftmost; structural suffixes follow in fixed slot order.

### 3.2 Base Names: Compound Noun Concatenation
- A single noun concept → all-lowercase concatenation: `creditcard`, `paperplane`, `archivebox`, `arrowshape`.
- Counter-examples (not concatenated, because the second segment is a modifier, not part of the noun): `chevron.left`, `arrow.up`.

### 3.3 Suffix Slots and Canonical Ordering

| Order | Slot | Meaning | Status in this library | Common tokens (non-exhaustive) |
|---|---|---|---|---|
| 1 | count | Quantity | Not used | `2` `3` |
| 2 | direction | Direction | In use (chevron) | `up` `down` `left` `right` `forward` `backward`; combinable: `up.left` `down.right` |
| 3 | enclosure | Enclosing shape | Reserved | `circle` `square` `rectangle` `app` `diamond` `shield` `seal` `hexagon` `octagon` |
| 4 | negation | Negation / disabled | Reserved | `slash` |
| 5 | fill | Filled / solid | In use | `fill` |
| 6 | badge | Badge decoration | Reserved | `badge.plus` `badge.minus` `badge.checkmark` `badge.xmark` `badge.questionmark` `badge.ellipsis` |

Additional conventions:
- **Direction combination order:** Vertical before horizontal — `arrow.up.left` (not `left.up`).
- **count / and:** Rare. Count example: `square.2`; combined symbols use `and`, e.g. `arrow.up.and.down`. Not currently used in this library.

### 3.4 Parsing Examples

| Full name | Breakdown |
|---|---|
| `chevron.left` | `chevron` (base) · `left` (direction) |
| `creditcard.fill` | `creditcard` (base, concatenated) · `fill` (fill) |
| `arrow.up.circle.fill` | `arrow` (base) · `up` (direction) · `circle` (enclosure) · `fill` (fill) |
| `trash.slash.fill` | `trash` (base) · `slash` (negation) · `fill` (fill) |
| `folder.fill.badge.plus` | `folder` (base) · `fill` (fill) · `badge.plus` (badge) |

### 3.5 Three Adoption Disciplines (Must Follow)
1. **Borrow the syntax, not the vocabulary:** Use the ordering rules above — do not copy Apple's icon names. (SF Symbols uses `person` for a person icon; this library keeps `user`.)
2. **Every suffixed variant = an independent SVG asset, not a programmatic transform:** `chevron.left` and `chevron.right` are **two separate design files**, not a rotated `chevron`; `.fill` is a separate solid-filled design, not the line icon with auto-fill applied.
3. **Register only what you have:** A token should appear in a name — and in `SUFFIX_REGISTRY` — only when there is a **real corresponding icon asset**. Do not pre-populate the full Apple token vocabulary.

### 3.6 Canonical Ruling on fill ↔ badge Ordering
SF Symbols itself is inconsistent here: `folder.fill.badge.plus` (fill before badge) vs `bell.badge.fill` / `app.badge.fill` (fill after badge).
**This library standardizes: `fill` always comes before `badge`**, enforced by verify — more self-consistent than Apple's own spec.

---

## 4. Rename Results for All 11 Base Names

Applying Rules A/B to the current 11 base names (`.fill` variants follow their base name):

| Current key | New base | Rule | Reason | Changed |
|---|---|---|---|---|
| `bank` | `bank` | — | Single word | No |
| `bell` | `bell` | — | Single word | No |
| `chevron-left` | `chevron.left` | B | `left` = direction modifier → dot | **Yes** |
| `chevron-right` | `chevron.right` | B | `right` = direction modifier → dot | **Yes** |
| `copy` | `copy` | — | Single word | No |
| `credit-card` | `creditcard` | A | Compound noun → concatenate (**not** `credit.card`) | **Yes** |
| `gift` | `gift` | — | Single word | No |
| `home` | `home` | — | Single word | No |
| `lock` | `lock` | — | Single word | No |
| `shield` | `shield` | — | Single word | No |
| `user` | `user` | — | Single word | No |

**Only 3 base names changed** (chevron-left, chevron-right, credit-card), plus their `.fill` variants — **6 keys renamed in total**, the other 16 unchanged:
```
chevron-left        → chevron.left
chevron-left.fill   → chevron.left.fill
chevron-right       → chevron.right
chevron-right.fill  → chevron.right.fill
credit-card         → creditcard
credit-card.fill    → creditcard.fill
```
> The value is not in "renaming 6 keys" — it is in **establishing the rules**: every future icon addition follows §2/§3, keeping the naming system consistent long-term.

---

## 5. Parsing and Validation (Dots Reserved for Suffixes → Stays Simple)

**Key insight: concatenated base names (always a single dot-free segment) + dots reserved exclusively for suffixes means `split('.')[0]` is always the base name, and every subsequent segment is a suffix.** No need for a heavy "peel right-to-left + master dictionary" approach — the registry's only job is to **validate suffix legality and ordering**, not to guess base name boundaries.

- `creditcard.fill` → base `creditcard`, suffixes `[fill]`
- `chevron.left.fill` → base `chevron`, suffixes `[left, fill]`

**Runtime components are unchanged:** still `icons[name]` — a single opaque-string lookup. The registry and parsing below are **build-time / verify only, not included in the published package, not involved at runtime.**

### 5.1 Registry (verify-only)
```ts
// scripts/suffix-registry.ts — used only by verify/build, not published with the package
export type SuffixSlot = 'count' | 'direction' | 'enclosure' | 'negation' | 'fill' | 'badge';
export interface SuffixDef { slot: SuffixSlot; order: number; } // lower order = closer to base name

// Single source of truth for which dot segments are valid suffixes.
// Only add a token when there is a real corresponding icon asset.
export const SUFFIX_REGISTRY: Record<string, SuffixDef> = {
  // direction — order 2
  up:    { slot: 'direction', order: 2 },
  down:  { slot: 'direction', order: 2 },
  left:  { slot: 'direction', order: 2 },
  right: { slot: 'direction', order: 2 },
  // enclosure — order 3 (reserved, not yet used)
  circle: { slot: 'enclosure', order: 3 },
  square: { slot: 'enclosure', order: 3 },
  // negation — order 4 (reserved)
  slash: { slot: 'negation', order: 4 },
  // fill — order 5
  fill:  { slot: 'fill', order: 5 },
};
```

### 5.2 Parsing + Validation (verify-only)
```ts
export interface ParsedName { base: string; suffixes: string[]; }

// Base name = leftmost segment; every subsequent segment must be a registered suffix.
export function parseIconName(key: string): ParsedName {
  const seg = key.split('.');
  return { base: seg[0], suffixes: seg.slice(1) };
}

export function validateIconName(key: string): string[] {
  const errs: string[] = [];
  const { base, suffixes } = parseIconName(key);

  // Base name hygiene: all lowercase, no hyphens
  // (compound nouns must be concatenated — automatically catches un-migrated credit-card style names)
  if (base.includes('-')) errs.push(`base "${base}" contains a hyphen; compound nouns must be concatenated (e.g. creditcard)`);
  if (base !== base.toLowerCase()) errs.push(`base "${base}" must be all lowercase`);

  // Each suffix must be registered, and suffix ordering must be non-decreasing
  // (same slot can repeat adjacently, e.g. multi-direction up.left)
  let last = 0;
  for (const s of suffixes) {
    const def = SUFFIX_REGISTRY[s];
    if (!def) { errs.push(`unknown suffix ".${s}" (${key}): either register it or rename`); continue; }
    if (def.order < last) errs.push(`suffix ".${s}" is out of order (${key}): must follow direction→enclosure→slash→fill`);
    last = def.order;
  }
  return errs;
}
```

---

## 6. verify.ts Upgrade Checklist

Replace the current single `fill`-only whitelist check with:
1. Run `validateIconName` on every key and aggregate errors.
2. **Base name hyphen check** — automatically catches any un-migrated `credit-card` style names.
3. Retain orphan check: `x.fill` exists but base `x` does not → warn.
4. Retain: path type ∈ `{stroke, fill}`; fill paths with even-odd winding must have `fillRule`; no `transform` residue.
5. Retain: member set of `keyof typeof iconsData` === `Object.keys(icons)`.

---

## 7. v2.0.0 Execution Checklist

1. **Rename raw SVGs (6 files):**
   ```
   chevron-left.svg       → chevron.left.svg
   chevron-left.fill.svg  → chevron.left.fill.svg
   chevron-right.svg      → chevron.right.svg
   chevron-right.fill.svg → chevron.right.fill.svg
   credit-card.svg        → creditcard.svg
   credit-card.fill.svg   → creditcard.fill.svg
   ```
2. Re-run build → `icons.json` keys update automatically; `IconName` (`keyof typeof iconsData`) follows.
3. Add `scripts/suffix-registry.ts`, upgrade `verify.ts` per §5/§6, confirm all checks pass.
4. Bump `package.json` to **2.0.0**, run `npm pack --dry-run` to preview, then `npm publish`.
5. Update README / AGENTS.md to reference the new naming conventions and link to this file.

---

## 8. Naming Flow for New Icons (Practical Handbook)

Follow this process for every new icon added:

1. **What is the core concept?** → Draft base name candidates.
2. **Is the base name multi-word?**
   - Multiple words forming a single noun → all-lowercase concatenation (`creditcard`).
   - Contains a direction / enclosure / state modifier → that part is a suffix, not part of the base (see §3).
3. **Is it a structural variant of an existing icon (filled / enclosed / negated / directional)?**
   - Yes → apply the corresponding suffix in slot order per §3.3; if the token is not yet registered, add it to `SUFFIX_REGISTRY` first.
   - No (brand new independent concept) → base name only.
4. **File name = final key.** Place in `raw/`, run build to generate the key.
5. **Run verify:** Confirm the name is valid, suffix ordering is correct, no orphans, no duplicates.

---

## 9. Decision Log (Why These Choices)

- **Concatenated compound nouns, not dots:** Dot-separated base names require dictionary disambiguation to find the base boundary. Concatenation keeps base names as single segments — `split('.')` just works. This also matches SF Symbols itself (`creditcard`, not `credit.card`).
- **Dots reserved for suffixes; registry is build-time only:** Runtime treats keys as opaque strings with zero parsing; naming discipline is enforced at build time, not shipped in the package.
- **Borrow the syntax, not the vocabulary:** Icon assets come from our own design resources. We adopt only SF Symbols' **naming syntax**, not its icon vocabulary or master dictionary.
