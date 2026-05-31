---
title: Implementation Rules
description: Agent-facing rules for using Starscape UI consistently.
---

These rules are for AI agents and humans making code changes in Starscape projects.

## Use package source first

Before adding local UI, inspect:

- `packages/css/package.json` for CSS export paths,
- `packages/css/src/components` for component classes,
- `packages/react/src/index.ts` for React exports,
- `apps/web-demo/src/App.tsx` for live usage examples,
- these docs for adoption rules.

## Prefer canonical imports

Use the broad import for app-wide adoption:

```ts
import '@starlove/ui';
```

Use component imports for deliberate partial adoption:

```ts
import '@starlove/ui/components/button';
import '@starlove/ui/components/card';
```

## Do not fork shared UI locally

Do not recreate Starscape buttons, cards, lanes, topbars, drawers, modals, flyouts, tabs, or badges in a consuming app when the package already has a component.

If behavior is missing and reusable, add it to `packages/css` or `packages/react`.

## Preserve user preference attributes

Theme and motion must flow through:

- `data-theme`,
- `data-motion`,
- `useTheme()`,
- `useMotion()`.

Do not create app-specific theme or reduced-motion systems unless the project has an explicit migration reason.

## Keep local CSS scoped

Local app CSS should cover layout, density, routing shells, data-specific grids, and project-only flows.

Shared component shape, state, color, focus, and motion rules belong in the package.

## Update docs with package changes

When adding a reusable component or behavior, update the preview app and the relevant docs page in the same change.
