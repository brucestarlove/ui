---
title: Motion
description: Reduced-motion handling and explicit motion overrides.
---

Starscape animations can be reduced by the operating system through `prefers-reduced-motion` or by an explicit app-level user choice.

## Modes

| Mode | Attribute | Behavior |
| --- | --- | --- |
| `system` | no attribute | Follow `prefers-reduced-motion`. |
| `reduce` | `data-motion="reduce"` | Always reduce motion. |
| `full` | `data-motion="full"` | Use full motion even when the OS asks for reduced motion. |

`full` should only be used after an explicit user choice.

## HTML and JavaScript

```html
<html>
<html data-motion="reduce">
<html data-motion="full">
```

```js
document.documentElement.setAttribute('data-motion', 'reduce');
document.documentElement.removeAttribute('data-motion');
```

## React

```tsx
import { useMotion } from '@starlove/ui-react';

function MotionToggle() {
  const { mode, resolved, setMode } = useMotion();

  return (
    <fieldset aria-label="Motion preference">
      <button type="button" aria-pressed={mode === 'system'} onClick={() => setMode('system')}>
        Auto
      </button>
      <button type="button" aria-pressed={mode === 'reduce'} onClick={() => setMode('reduce')}>
        Reduce
      </button>
      <button type="button" aria-pressed={mode === 'full'} onClick={() => setMode('full')}>
        Full
      </button>
      <output>{resolved}</output>
    </fieldset>
  );
}
```

## Authoring pattern

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

The explicit `data-motion="full"` path exists for user choice, not app defaults.
