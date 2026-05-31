---
title: Project Adoption
description: How future Starscape projects should adopt shared UI.
---

New Starscape projects should treat `@starlove/ui` as the base UI layer and document any project-specific additions here.

## Adoption checklist

1. Add `@starlove/ui` to the app.
2. Import the full package once at the app root, or import only the required layers.
3. Add `@starlove/ui-react` only if the app needs React wrappers or hooks.
4. Use `data-theme` and `data-motion` for user preferences.
5. Use existing component classes before adding local variants.
6. Add a project page under `docs/src/content/docs/projects` for app-specific contracts.

## Project page template

Each project page should answer:

- Which Starscape packages does the app consume?
- Where are the root CSS imports?
- Which components are canonical for the app?
- Which local styles are allowed and why?
- Are there accessibility, theme, or motion constraints unique to the app?
- What should agents avoid changing?

## Boundary

Shared reusable UI belongs in `packages/css` or `packages/react`.

Product-specific layout and workflow code belongs in the consuming app.
