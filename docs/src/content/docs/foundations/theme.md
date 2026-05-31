---
title: Theme
description: Starscape light, dark, and system color behavior.
---

Starscape is system-first. With no theme attribute, the browser and operating system decide the color scheme.

## Modes

| Mode | Attribute | Behavior |
| --- | --- | --- |
| `system` | no attribute | Follow `prefers-color-scheme`. |
| `light` | `data-theme="light"` | Force the parchment palette. |
| `dark` | `data-theme="dark"` | Force the starscape palette. |

## HTML

```html
<html>
<html data-theme="light">
<html data-theme="dark">
```

## JavaScript

```js
document.documentElement.setAttribute('data-theme', 'dark');
document.documentElement.removeAttribute('data-theme');
```

Removing the attribute returns the app to system mode.

## React

```tsx
import { useTheme } from '@starlove/ui-react';

function ThemeToggle() {
  const { resolved, setMode } = useTheme();

  return (
    <button type="button" onClick={() => setMode(resolved === 'dark' ? 'light' : 'dark')}>
      Theme
    </button>
  );
}
```

`useTheme()` returns `{ mode, resolved, setMode }`: `mode` is the stored preference
(`system | light | dark`), `resolved` is the active theme after applying the OS preference
(`light | dark`), and `setMode` updates both. Use the hook in React apps so every Starscape
project persists and resolves theme the same way.
