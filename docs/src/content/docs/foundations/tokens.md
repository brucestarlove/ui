---
title: Tokens
description: Shared semantic tokens used by Starscape packages and apps.
---

Starscape tokens live in `packages/css/src/tokens`.

Concrete RGB channel tokens stay stable across themes. Semantic tokens point at the right color, surface, shadow, and interaction values for the active theme.

## Entry points

```ts
import '@starlove/ui/tokens';
import '@starlove/ui/tokens/light';
import '@starlove/ui/tokens/dark';
import '@starlove/ui/tokens/system';
```

Most apps should use `@starlove/ui/tokens` or the full `@starlove/ui` import.

## Common semantic tokens

| Token | Purpose |
| --- | --- |
| `--paper` | Page background. |
| `--paper-deep` | Deeper page or inset background. |
| `--ink` | Primary text. |
| `--muted` | Secondary text. |
| `--line` | Borders and hairlines. |
| `--surface` | Panels and low-elevation surfaces. |
| `--surface-raised` | Popovers, menus, and raised panels. |
| `--accent` | Primary accent. |
| `--accent-ring` | Shared focus ring. |
| `--shadow` | Default elevation shadow. |

## Authoring rule

Prefer semantic tokens in components and app surfaces. Use concrete RGB tokens only when the design needs an opacity-adjustable tint:

```css
.notice {
  background: rgba(var(--accent-rgb), 0.12);
  color: var(--ink);
  border-color: var(--line);
}
```

Do not hard-code theme colors in consuming apps unless the value is genuinely app-specific.
