---
title: '@starlove/ui'
description: CSS package contract, import paths, and adoption rules.
---

`@starlove/ui` is the primary package. It is framework-neutral CSS plus a small set of browser helpers.

Use this package in every Starscape app before reaching for local component CSS.

## Full import

```ts
import '@starlove/ui';
```

This loads tokens, base styles, backgrounds, components, and utilities from `packages/css/src/index.css`.

## Layer imports

```ts
import '@starlove/ui/tokens';
import '@starlove/ui/base';
import '@starlove/ui/backgrounds';
import '@starlove/ui/utilities';
```

Use layer imports when an app needs a smaller or more explicit surface.

## Component imports

```ts
import '@starlove/ui/components/button';
import '@starlove/ui/components/card';
import '@starlove/ui/components/lane';
import '@starlove/ui/components/topbar';
import '@starlove/ui/components/modal';
import '@starlove/ui/components/table';
```

The complete export list lives in `packages/css/package.json` — currently ~60 component
subpaths plus tokens, base, backgrounds, utilities, and cursors.

## Page templates

Full-page layouts are exported separately from components:

```ts
import '@starlove/ui/templates';          // shell + sidebar
import '@starlove/ui/templates/shell';
import '@starlove/ui/templates/sidebar';
```

See [Page Templates](/foundations/templates/) for the markup. The kitchen-sink `@starlove/ui`
import already includes both templates.

## Helper exports

```ts
import { startStarscape } from '@starlove/ui/starscape';
import { setupTooltipPlacement } from '@starlove/ui/tooltip-placement';
```

Use helpers when CSS alone cannot supply the behavior.

## Adoption rule

When a consuming app needs UI that already exists in `@starlove/ui`, use the package class or entry point. Add local CSS only for app-specific layout, page composition, or product behavior.
