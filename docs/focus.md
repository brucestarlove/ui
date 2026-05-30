# Focus & accessibility

Starscape v3 leans on browser-native focus behavior wherever possible. This doc captures the two non-obvious decisions baked into the library and what consumers need to do to opt in.

## The `--accent-ring` token

Every interactive surface (button, input, switch, checkbox/radio, tabs, segmented options, flyout items, alert close) terminates focus styling in the same shape:

```css
:focus-visible {
  outline: none;
  box-shadow: var(--accent-ring);
}
```

`--accent-ring` is defined in `tokens/light.css` and `tokens/dark.css` as a `0 0 0 Npx rgba(...)` shadow. It's a token, not an `outline`, for two reasons:

1. **Outlines clip.** Many of the Starscape surfaces have `border-radius` and `overflow: hidden` ancestors (drawer body, modal). A box-shadow ring follows the border-radius and won't get sheared.
2. **Outlines stack badly.** A button already carries a `box-shadow` for its bezel; an outline would draw outside it. Using `box-shadow` lets us layer focus on top of the bezel cleanly: `box-shadow: var(--btn-shadow), var(--accent-ring)`.

The trade-off is that consumers cannot rely on `outline` for their own focus styling — set focus via `box-shadow: var(--accent-ring)` to stay coherent with the rest of the system.

## `:focus-visible`, not `:focus`

All Starscape components target `:focus-visible`, the modern "show focus when the browser thinks the user needs it" pseudo-class. This means:

- Mouse-clicked buttons don't show a ring.
- Keyboard-tabbed buttons do.
- Screen readers behave normally.

If you need to force-show focus (e.g., during a guided onboarding moment), apply `:focus` to the inner `:focus-visible` selector or temporarily set `box-shadow: var(--accent-ring)` directly.

## Skip-to-content link

The `.skip-link` utility (in `utilities/skip-link.css`) is the recommended landmark for keyboard users to jump past the topbar straight to main content. It's visually hidden until focused, then slides in from the top of the viewport.

```html
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="topbar">…</header>
  <main id="main" tabindex="-1">
    …
  </main>
</body>
```

The `tabindex="-1"` on `<main>` makes it programmatically focusable so the link's `href` actually moves focus into the content (browsers vary here, but `tabindex="-1"` is the cross-browser-safe choice).

## Forced-colors mode

Windows high-contrast mode (and other forced-colors environments) override our color palette with system colors. The library:

- Uses `system` color keywords (`Canvas`, `CanvasText`, `Highlight`, `LinkText`, `ButtonText`) where it matters.
- Restores `outline` on focus for components whose `box-shadow` would be invisible in forced-colors.
- Leaves gradients and shadows alone — they vanish in forced-colors mode anyway, and the system foreground color takes over.

See `base/forced-colors.css` for the centralized rules.

## RTL

Starscape v3 uses [logical properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Logical_Properties_and_Values) (`padding-inline-start`, `inset-inline-end`, `border-inline-start`, etc.) wherever direction matters. Set `dir="rtl"` on `<html>` (or any subtree) and the drawer slides from the left, the search clear button anchors right-of-center reads as start-of-content, and so on — no extra stylesheets needed.

A few legacy spots (badge counters, fixed scrollbar styling) still use physical properties — those are tracked in the migration. PR welcome.
