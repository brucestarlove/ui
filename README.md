# Starscape UI System — v3

A pure-CSS design system. The "Starscape" aesthetic — warm parchment in light mode, animated starfield + nebula + milky way in dark mode — extracted from [`minimal-agent-board`](../minimal-agent-board/) and the [Obsidian Starscape Things](../starscape-theme_extensions/Obsidian/Starscape%20Things/) theme into a standalone library that does **not** depend on Tailwind, shadcn, or any utility-class framework.

## Packages

| Package | Description |
|---|---|
| [`@starlove/ui`](./packages/css) | The CSS library — tokens, base, backgrounds, components, utilities, cursors. Import what you need. |
| [`@starlove/ui-react`](./packages/react) | Optional thin React layer — theme/motion/disclosure/clickOutside/escapeKey hooks + Sonner `<Toaster>` wrapper + `<Starscape>` background mount. |

See [CHANGELOG.md](./CHANGELOG.md) for what's in each version.

## Apps

| App | Description |
|---|---|
| [`web-demo`](./apps/web-demo) | Vite + React preview app with a masonry gallery of the component surface. |
| [`docs`](./docs) | Astro Starlight documentation app for the UI packages and future Starscape project adoption notes. |

## Quick start

```bash
pnpm install
pnpm dev          # starts web-demo on http://localhost:5173
pnpm docs:dev     # starts Starlight docs
```

## Theming model

The library is system-first. With no attribute on `<html>`, the browser's `prefers-color-scheme` decides. Set `data-theme="light"` or `data-theme="dark"` to override:

```html
<!-- follows OS -->
<html>

<!-- always dark -->
<html data-theme="dark">

<!-- always light -->
<html data-theme="light">
```

In React, the `useTheme()` hook in `@starlove/ui-react` handles this for you (system | light | dark, localStorage-persisted, live-updating from OS).

## Motion preferences

Same shape, different attribute. By default the library follows OS `prefers-reduced-motion`; users can override per-app via `data-motion`:

```html
<html data-motion="reduce">  <!-- always reduce, ignores OS -->
<html data-motion="full">    <!-- ignore OS reduce-motion (use sparingly) -->
<html>                       <!-- follow OS (default) -->
```

The React hook is `useMotion()` and works exactly like `useTheme()`. See [`docs/motion.md`](./docs/motion.md) for the full guide.

## Why a v3?

- **v1** — original Starscape brand sketches.
- **v2** — `../starscape-ui-system`, built on shadcn/ui + Tailwind 4.1, used by `../starscape-landing`.
- **v3** — this. Pure CSS, no Tailwind. Animated starscape and parchment from the Obsidian extension; component shapes from the kanban app. Drop-in for vanilla HTML, React, Preact, or anything in between.

v2 stays maintained for shadcn-shaped projects. v3 is the path forward.

## License

MIT — see [LICENSE](./LICENSE).
