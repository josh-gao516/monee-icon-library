# @josh-gao/icon-library

A data-driven icon library with **Line** and **Solid** variants, for both **React Native** and **Web**. All icons share a single source of truth (`icons.json`), so the same path data renders identically across platforms.

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

// Line variant (default)
<Icon name="lock" color="#1a1a1a" />

// Solid variant
<Icon name="lock" variant="solid" color="#ea580c" />

// Custom size (defaults to each icon's defaultSize, 24)
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
| `name` | `IconName` | — | Required. Kebab-case key, type-checked against `icons.json`. |
| `variant` | `'line' \| 'solid'` | `'line'` | Which style to render. |
| `size` | `number` | icon's `defaultSize` (24) | Width and height in px. |
| `color` | `string` | RN: `#000` · Web: `currentColor` | Stroke color (line) or fill color (solid). |
| `strokeWidth` | `number` | `2` | Line variant only; ignored for solid. |

`IconName`, `Variant`, and `IconProps` types are exported for use in your own components.

## Available icons (11)

`bank` · `bell` · `chevron-left` · `chevron-right` · `copy` · `credit-card` · `gift` · `home` · `lock` · `shield` · `user`

Each icon ships both `line` and `solid` variants.

## Reading the icon manifest

The raw `icons.json` data source is exported directly. Useful for tooling — for example, constraining an AI codegen workflow to valid icon names:

```js
import iconsData from '@josh-gao/icon-library/icons.json';

const validNames = Object.keys(iconsData);
// ['bank', 'bell', 'chevron-left', ...]
```

Each entry includes `description`, `tags`, `defaultSize`, `viewBox`, and the `line` / `solid` path data.

## How it works

Icons are not hand-authored. Source SVGs (exported from Figma) flow through a build pipeline (SVGO → path extraction) into `icons.json`. The `<Icon>` component reads that data and renders it with `react-native-svg` (native) or native `<svg>` (web). Because both platforms consume the same path data, the rendered shapes are guaranteed identical.

- **Line** icons are stroke-based (open paths, `strokeWidth`, round caps).
- **Solid** icons are fill-based (closed paths, `fill-rule="evenodd"` for cutouts).

## License

MIT
