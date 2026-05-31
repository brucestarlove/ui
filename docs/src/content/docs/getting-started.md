---
title: Getting Started
description: Install and use Starscape UI in a local or external app.
---

Starscape UI has two packages:

- `@starlove/ui` is the CSS system: tokens, base styles, backgrounds, components, utilities, cursors, and small framework-neutral helpers.
- `@starlove/ui-react` is the optional React layer: typed wrappers and hooks that sit on top of the CSS package.

Start with CSS. Add React only when an app needs the behavior.

## Local workspace app

For an app inside this monorepo:

```bash
pnpm add @starlove/ui@workspace:*
```

Add the React layer only for React apps that need wrappers or hooks:

```bash
pnpm add @starlove/ui-react@workspace:*
```

## External app

After publishing, install the registry packages:

```bash
pnpm add @starlove/ui
pnpm add @starlove/ui-react
```

React consumers should also install React peer dependencies directly in the app.

## Import the CSS

The broad app-level import is:

```ts
import '@starlove/ui';
```

For narrower adoption, import only the layers or components the app needs:

```ts
import '@starlove/ui/tokens';
import '@starlove/ui/base';
import '@starlove/ui/backgrounds';
import '@starlove/ui/components/button';
import '@starlove/ui/components/card';
import '@starlove/ui/utilities/skip-link';
```

## Add React behavior

```tsx
import '@starlove/ui';
import { Starscape, Toaster, useMotion, useTheme } from '@starlove/ui-react';
```

The React package does not replace the CSS package. It provides behavior around the same classes, tokens, and `data-*` attributes.

## Run the docs

From the repo root:

```bash
pnpm docs:dev
```

The preview app remains separate:

```bash
pnpm dev
```
