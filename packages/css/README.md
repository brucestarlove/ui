# @starlove/ui

Pure-CSS design system. No Tailwind, no shadcn, no build step required for consumers — just import the CSS files you need.

## Install

```bash
pnpm add @starlove/ui
```

## Use everything

```js
import '@starlove/ui';
```

That single import pulls tokens, base, backgrounds, all components, and utilities.

## Use à la carte

```js
import '@starlove/ui/tokens';            // light + dark + system glue
import '@starlove/ui/base';              // reset, typography, scrollbar, selection, motion
import '@starlove/ui/base/forced-colors';// Windows high-contrast adjustments (optional)
import '@starlove/ui/backgrounds';       // starscape (dark) + parchment (light)
import '@starlove/ui/components/button';
import '@starlove/ui/components/card';
import '@starlove/ui/components/tabs';
import '@starlove/ui/components/segmented';
import '@starlove/ui/components/check';
import '@starlove/ui/components/alert';
import '@starlove/ui/components/empty-state';
import '@starlove/ui/components/drawer';
import '@starlove/ui/components/sonner';
import '@starlove/ui/utilities/skip-link';
import '@starlove/ui/utilities/text-gradient';
```

## Theming

By default the library follows the OS via `prefers-color-scheme`. To force a theme, set `data-theme` on `<html>`:

```html
<html data-theme="dark">  <!-- always dark -->
<html data-theme="light"> <!-- always light -->
<html>                    <!-- follow OS -->
```

## Custom cursors

Components use cursor custom properties with native browser fallbacks by default. That means importing `@starlove/ui` never requires your app to serve `.cur` files, and missing cursor assets won't create noisy 404s.

Default contract:

```css
cursor: var(--sl-cursor-link, pointer);
```

To opt into the Starscape cursor files, either set the variables to public URLs you control:

```css
:root {
  --sl-cursor-arrow: url('/cursors/live_arrow.cur'), default;
  --sl-cursor-link: url('/cursors/live_link.cur'), pointer;
  --sl-cursor-select: url('/cursors/live_select.cur'), text;
  --sl-cursor-move: url('/cursors/live_move.cur'), move;
  --sl-cursor-unavailable: url('/cursors/live_unavail.cur'), not-allowed;
}
```

…or, if your bundler/static server resolves package-adjacent `.cur` assets correctly, import the optional preset:

```js
import '@starlove/ui/cursors';
```

You can also import individual cursor assets for bundler-managed URLs:

```js
import liveLink from '@starlove/ui/cursors/live_link.cur?url';
```

## What's included

- **tokens** — color, surface, button, accent, scrollbar, RGB-channel duals, motion durations, **spacing scale (`--space-0..8`)**
- **base** — reset, typography (Aptos Display / Bahnschrift / Segoe UI Variable), themed scrollbars, selection, shared keyframes, **forced-colors-mode adjustments**
- **backgrounds** — animated starfield + nebula + milky way (dark), parchment + warm corner washes (light), no SVG
- **components** — button, input/select/textarea (+ search variant), checkbox/radio, switch, tabs, segmented control, card (with `[data-variant="epic|feature|task|bug"]` bezels), badge, alert/banner, empty-state, drawer, modal, flyout, toast, sonner overrides, divider
- **utilities** — `visually-hidden`, `skip-link`, `text-gradient`
- **cursors** — `.cur` files (`live_arrow`, `live_link`, `live_move`, `live_select`, `live_unavail`)

## Accessibility

- Logical properties throughout — set `dir="rtl"` and the drawer slides from the leading edge, lists indent the right way, the search clear button anchors correctly.
- Forced-colors / Windows high-contrast support via `base/forced-colors.css`. Restored focus rings, system-color selections, and link colors.
- `:focus-visible`-only focus rings (no mouse-click rings) anchored to the `--accent-ring` token. See `docs/focus.md`.
- `.skip-link` utility for the bypass-to-main-content keyboard pattern.

## Reduced motion

The starscape twinkle and other ambient animations respect `prefers-reduced-motion: reduce`.
