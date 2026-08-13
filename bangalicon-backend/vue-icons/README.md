# @bangalicon/vue

Vue icon components for Bangalicon, generated directly from the latest icon library uploads.

## Why use this package

- Built for Vue projects with ready-to-import icon components.
- Follows the Bangalicon library automatically as new icons are published.
- Supports simple sizing and color control with clean SVG output.

## Install

```bash
npm install @bangalicon/vue
```

## Quick start

```vue
<script setup>
import { CartCheck } from "@bangalicon/vue";
</script>

<template>

  <CartCheck :size="24" color="#111111" />
</template>
```

## Component props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `number | string` | `24` | Controls the rendered icon size. |
| `color` | `string` | `currentColor` | Uses your chosen icon color. |

## Notes

- Icons inherit `currentColor` by default, so they fit naturally into your UI.
- Use your framework's normal class and style patterns to control spacing and layout.
- This package currently includes 520 generated icons.

## Package details

- Package: `@bangalicon/vue`
- Framework: Vue
- Generated icons: 520
