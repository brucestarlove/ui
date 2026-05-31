---
title: Focus and Accessibility
description: Focus rings, skip links, forced colors, and directionality.
---

Starscape preserves semantic HTML first, then applies shared tokens to make focus and accessibility states consistent.

## Focus ring

Interactive surfaces should terminate in the shared focus token:

```css
:focus-visible {
  outline: none;
  box-shadow: var(--accent-ring);
}
```

Use `box-shadow: var(--accent-ring)` instead of inventing local outlines when matching Starscape controls.

## Focus-visible

Components should target `:focus-visible`, not plain `:focus`.

- Mouse clicks should not add a persistent ring.
- Keyboard navigation should show a ring.
- Screen reader behavior should stay aligned with browser defaults.

## Skip link

```html
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="topbar">...</header>
  <main id="main" tabindex="-1">...</main>
</body>
```

The `tabindex="-1"` makes the main landmark programmatically focusable across browsers.

## Forced colors

The base layer includes forced-colors rules for Windows high contrast and similar environments. Components should use system color keywords where they matter and restore `outline` when shadow-based focus would be invisible.

## Directionality

New component CSS should prefer logical properties:

```css
.component {
  padding-inline: 1rem;
  border-inline-start: 1px solid var(--line);
  inset-inline-end: 0;
}
```

Consumers can set `dir="rtl"` on `<html>` or a subtree without loading a separate stylesheet.
