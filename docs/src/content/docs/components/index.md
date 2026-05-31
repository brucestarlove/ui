---
title: Component Index
description: How to use the preview app and package exports as the source of truth for components.
---

The component system has two complementary references:

- `apps/web-demo` shows rendered states in a masonry grid.
- `packages/css/package.json` and `packages/react/src/index.ts` define importable package surface.

This page is the starting point for deeper component docs as the system grows.

## Current component groups

| Group | Examples |
| --- | --- |
| Actions | Button (incl. `translucent` + ARC variants), pagination controls, alert close. |
| Forms | Input, checkbox, radio, switch, slider, number field, tag input, rating, search results. |
| Navigation | Topbar (+ topbar-btn / topbar-search / topbar-chip), tabs, segmented control, breadcrumb. |
| Surfaces | Card, lane, section, drawer, modal, dialog, popover, flyout, menu-flyout, create-flyout. |
| Feedback | Alert, empty state, progress, skeleton, loader, toast, Sonner styling. |
| Data | Table, description list, list, code block, terminal, prose, kbd. |
| Indicators | Badge, state-pill, priority-pill, dot, avatar, separator. |
| Disclosure | Accordion, card-accordion, epic accordion, stepper. |
| Product patterns | Media card, context menu, lightbox, appearance theme selector. |
| Page templates | Shell and sidebar layouts (`@starlove/ui/templates/*`). |

Variants are carried on `data-variant` (and tones on `data-tone`) rather than modifier
classes — the v3.2 cleanup removed the older app-specific aliases from the CSS package, so
`.state-pill[data-variant="done"]` and `.card[data-variant="epic"]` are the canonical forms.

## Documentation rule

When adding a new component to Starscape, update these places together:

1. CSS file in `packages/css/src/components`.
2. Export path in `packages/css/package.json`.
3. React wrapper or hook in `packages/react/src` when behavior is useful.
4. Export in `packages/react/src/index.ts` when a React API exists.
5. Preview lane in `apps/web-demo`.
6. Docs page or component index entry here.

## Consumer rule

Consuming apps should import existing component CSS before writing local component styles. Local CSS should describe layout, not reimplement Starscape components.
