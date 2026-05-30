# Motion preferences

Starscape v3's animations — twinkling stars, drifting nebulas, breathing milky-way, shooting meteors, card-settle entrances, toast bounces, progress shimmers — can be paused either by the OS (via `prefers-reduced-motion: reduce`) or by an explicit per-app user choice. This document explains the resolution model and how to set it.

## Three modes

Motion preference resolves to one of three modes, all controlled by a `data-motion` attribute on `<html>`:

| Mode | Attribute | Behavior |
|---|---|---|
| **system** *(default)* | no attribute set | Follow `prefers-reduced-motion` from the OS. |
| **reduce** | `data-motion="reduce"` | Always reduce, regardless of OS preference. |
| **full** | `data-motion="full"` | Ignore OS reduce-motion (full motion). Use sparingly — see below. |

The pattern mirrors the `data-theme` system. Same vocabulary (`system` / explicit override), same precedence (explicit attribute always wins).

## Setting it from HTML / vanilla JS

```html
<!-- follow the OS (default) -->
<html>

<!-- always reduce, regardless of OS -->
<html data-motion="reduce">

<!-- full motion, override OS reduce -->
<html data-motion="full">
```

Toggling at runtime:

```js
// Turn on reduce
document.documentElement.setAttribute('data-motion', 'reduce');

// Back to OS-driven default
document.documentElement.removeAttribute('data-motion');
```

The CSS reacts immediately. The JS engine (`startStarscape`) watches the attribute via a `MutationObserver` — no callback needed.

## React (`useMotion`)

```tsx
import { useMotion } from '@starlove/ui-react';

function MotionToggle() {
  const { mode, resolved, setMode } = useMotion();
  // mode:     'system' | 'reduce' | 'full'
  // resolved: 'reduce' | 'full'

  return (
    <fieldset aria-label="Motion preference">
      <button aria-pressed={mode === 'system'} onClick={() => setMode('system')}>
        Auto (follow OS)
      </button>
      <button aria-pressed={mode === 'reduce'} onClick={() => setMode('reduce')}>
        Always reduce
      </button>
      <button aria-pressed={mode === 'full'} onClick={() => setMode('full')}>
        Full motion
      </button>
    </fieldset>
  );
}
```

The hook persists `mode` to `localStorage['starscape-motion']` and updates `<html data-motion="…">` when it changes. In `system` mode it subscribes to `matchMedia('(prefers-reduced-motion: reduce)')` so `resolved` stays in sync if the OS preference flips.

## What gets reduced

When the resolved mode is `reduce`:

| Layer | Behavior |
|---|---|
| Starfield canvas (`<canvas class="starfield-canvas">`) | RAF loop stops, draws one static frame at base brightness, no parallax, no twinkle. |
| `.milky-way` breathe | Animation paused at current opacity. |
| `.grain::before` violet nebula drift | Drift paused. |
| `.grain::after` cyan nebula drift | Drift paused. |
| `.signature-star × 7` twinkle | Twinkle paused (stars stay at base opacity). |
| `.meteor` | `display: none` — no shooting stars. |
| `.card` settle entrance | No entry animation. |
| Sonner / vanilla `.toast` slide-in | Skipped, toast appears instantly. |
| `.progress[data-indeterminate]` shimmer | Animation off. |
| `.spinner` rotation | Animation off. |
| `.skeleton` pulse | Animation off. |
| Drawer slide / Modal fade / Flyout / Tooltip / Topbar background blend | `transition: none` — instant state change instead of animated. |

## Accessibility note on `'full'`

OS-level `prefers-reduced-motion: reduce` is often configured because of vestibular sensitivities, migraines, or focus disorders. **Never enable `data-motion="full"` by default** — it should only flip when the user explicitly opts in. The default is always `system`, and `useMotion()` enforces this on first load.

If your app is meant for users who specifically want immersive animations even on enterprise machines where IT enforces reduce globally, expose the `'full'` option behind a clearly-labeled toggle with explanatory copy. Don't bury it.

## Combined with theme

Motion and theme are independent. You can mix any of the 3×3 combinations:

| | Light | System | Dark |
|---|---|---|---|
| **Reduce** | parchment, no animation | OS-driven theme, no animation | starscape, no canvas/meteors, no drift |
| **System** | parchment, OS-driven motion | OS-driven theme, OS-driven motion | starscape, OS-driven motion |
| **Full** | parchment (no animation in light anyway) | OS-driven theme, animations on | starscape with full canvas + meteors, regardless of OS reduce |

In `data-motion="reduce"` + dark mode, the static layers (body gradient, milky-way, nebulas) remain visible — they're still beautiful — but the canvas, twinkle, drift, breathe, and meteors all pause.

## CSS author notes

If you're adding new components with ambient animations and want to honor the same motion preference resolution, follow this pattern:

```css
.my-component {
  animation: my-keyframe 3s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  :root:not([data-motion="full"]) .my-component {
    animation: none;
  }
}

[data-motion="reduce"] .my-component {
  animation: none;
}
```

The `:root:not([data-motion="full"])` qualifier inside the `@media` block lets `data-motion="full"` override the OS preference. The bare `[data-motion="reduce"]` selector outside the media query catches the explicit-reduce path.

For functional motion (drawer slides, modal fades, tooltip transitions), the same pattern applies but you swap `transition: none` for `animation: none`. Don't drop functional motion entirely — leave the transitions in place at instant duration so the user still sees state changes.

## See also

- [`docs/horizontal-scroll.md`](./horizontal-scroll.md) — the proposed `<ScrollLane>` component should also respect this motion system when implemented.
- `packages/css/src/base/motion.css` — central reduced-motion guards.
- `packages/css/src/backgrounds/starscape.css` — starfield reduce-motion handling.
- `packages/react/src/useMotion.ts` — hook source.
