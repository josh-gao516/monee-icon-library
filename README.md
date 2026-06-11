# @josh-gao/icon-library

A data-driven icon library for both **React Native** and **Web**. All icons share a single source of truth (`icons.json`), so the same path data renders identically across platforms.

Icons follow **SF Symbols naming conventions** — compound nouns are concatenated (`creditcard`), structural modifiers use dot notation (`chevron.left`, `lock.fill`). See [NAMING.md](https://github.com/josh-gao516/monee-icon-library/blob/main/NAMING.md) for the full convention.

## Install

```bash
# React Native (requires react-native-svg peer)
npm install @josh-gao/icon-library react-native-svg

# Web (no react-native-svg needed)
npm install @josh-gao/icon-library
```

Platform resolution is automatic: React Native bundlers (Metro) resolve the native build via the `react-native` export condition; web bundlers use the standard `import`/`require` entry.

## Usage

```tsx
import { Icon } from '@josh-gao/icon-library';

// Stroke icon
<Icon name="lock" color="#1a1a1a" />

// Fill icon — append .fill to the base name
<Icon name="lock.fill" color="#ea580c" />

// Direction modifier
<Icon name="chevron.left" color="#1a1a1a" />
<Icon name="chevron.right" color="#1a1a1a" />

// Compound-noun base + fill
<Icon name="creditcard.fill" color="#16a34a" />

// Custom size (defaults to 24)
<Icon name="bell" size={32} color="#000" />
```

On **Web**, `color` is optional and defaults to `currentColor`, so icons inherit the surrounding text color:

```tsx
<span style={{ color: 'tomato' }}>
  <Icon name="gift" />   {/* renders tomato */}
</span>
```

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `name` | `IconName` | — | Required. Key from `icons.json`; type-checked at compile time. |
| `size` | `number` | `24` | Width and height in px. |
| `color` | `string` | RN: `#000` · Web: `currentColor` | Stroke color (stroke icons) or fill color (fill icons). |
| `strokeWidth` | `number` | `2` | Stroke icons only; ignored for fill icons. |

`IconName` and `IconProps` types are exported for use in your own components.

## Available icons (22 keys)

| Base | Stroke | Fill |
|------|--------|------|
| `bank` | ✓ | `bank.fill` |
| `bell` | ✓ | `bell.fill` |
| `chevron.left` | ✓ | `chevron.left.fill` |
| `chevron.right` | ✓ | `chevron.right.fill` |
| `copy` | ✓ | `copy.fill` |
| `creditcard` | ✓ | `creditcard.fill` |
| `gift` | ✓ | `gift.fill` |
| `home` | ✓ | `home.fill` |
| `lock` | ✓ | `lock.fill` |
| `shield` | ✓ | `shield.fill` |
| `user` | ✓ | `user.fill` |

## Naming conventions

Keys follow SF Symbols conventions — see [NAMING.md](https://github.com/josh-gao516/monee-icon-library/blob/main/NAMING.md) for the complete spec. The short version:

- **Compound nouns are concatenated** (no separator): `creditcard`, not `credit-card` or `credit.card`.
- **Structural modifiers use dots**: direction (`chevron.left`), fill (`lock.fill`), enclosure (`bell.circle` — future).
- The runtime component treats keys as opaque strings (`icons[name]`). The dot structure exists purely for naming consistency, enforced at build time by `verify.ts`.

## Reading the icon manifest

The raw `icons.json` is exported directly. Useful for tooling — for example, constraining an AI codegen workflow to valid icon names:

```js
import data from '@josh-gao/icon-library/icons.json';

const validNames = Object.keys(data.icons);
// ['bank', 'bank.fill', 'bell', 'bell.fill', 'chevron.left', ...]
```

The manifest shape:
```ts
{
  schemaVersion: 2,
  defaultSize: 24,
  defaultViewBox: "0 0 24 24",
  icons: {
    [key: string]: {
      paths: Array<{ d: string; type: 'stroke' | 'fill'; fillRule?: 'evenodd' }>;
      size?: number;    // only present when != defaultSize
      viewBox?: string; // only present when != defaultViewBox
    }
  }
}
```

## How it works

Icons are not hand-authored. Source SVGs (exported from Figma) flow through a build pipeline (SVGO → path extraction) into `icons.json`. The `<Icon>` component reads that data and renders it with `react-native-svg` (native) or native `<svg>` (web). Because both platforms consume the same path data, the rendered shapes are guaranteed identical.

- **Stroke** icons use open paths with `strokeWidth`, round caps/joins.
- **Fill** icons use closed paths; cutout shapes use `fill-rule="evenodd"`.

## License

MIT
