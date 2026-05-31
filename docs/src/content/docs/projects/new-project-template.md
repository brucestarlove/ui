---
title: New Project Template
description: Baseline documentation checklist for a new Starscape project.
---

Use this page as the starting checklist when a new Starscape app adopts the shared UI package.

## Package setup

```bash
pnpm add @starlove/ui
```

React apps:

```bash
pnpm add @starlove/ui-react
```

## Root imports

```ts
import '@starlove/ui';
```

Partial adoption:

```ts
import '@starlove/ui/tokens';
import '@starlove/ui/base';
import '@starlove/ui/components/button';
```

## Project docs to add

Create a page under `docs/src/content/docs/projects` with:

- app purpose,
- package dependencies,
- root import path,
- canonical components,
- local CSS boundaries,
- known gaps,
- agent rules.

## Before adding local UI

Search `packages/css/src/components` and `packages/react/src/components` first. If the app needs a reusable primitive, add it to the UI package instead of hiding it in the app.
