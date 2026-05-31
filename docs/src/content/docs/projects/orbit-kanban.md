---
title: Orbit Kanban
description: Initial adoption notes for Orbit and kanban-style Starscape apps.
---

Orbit-style kanban apps are a primary consumer for Starscape UI. The component vocabulary already includes several patterns that came from that surface.

## Canonical components

| App need | Starscape surface |
| --- | --- |
| Board chrome | `topbar`, `topbar-btn`, `topbar-search`, `topbar-chip`. |
| Lanes and columns | `lane`, future `scroll-lane`. |
| Cards | `card[data-variant="epic\|feature\|task\|bug"]`, with `card-accordion` for compact meta. |
| Ticket state & priority | `state-pill[data-variant=…]`, `priority-pill[data-variant=…]`, `dot` (`data-live` / `data-count`). |
| Create/search menus | `menu-flyout`, `create-flyout`, `flyout`, `popover`. |
| Settings and detail panels | `drawer`, `modal`, `dialog`, `tabs`. |
| Ticket metadata | `badge`, `description-list`, `table`. |
| Inline state | `alert`, `empty-state`, `progress`, `skeleton`. |

These patterns originated in Orbit and were promoted into `@starlove/ui` during the v3.2
cleanup. The package now exposes them in canonical `data-variant` form only; the older
Orbit-specific aliases (`.detail-state-badge`, `.detail-priority-badge`, `.agent-dot`, and
similar) are no longer part of the shared package — Orbit keeps any it still needs as local
CSS layered on top.

## Adoption rule

Kanban apps should avoid local replicas of the card, lane, topbar, drawer, and menu systems. If a missing behavior is useful outside one app, promote it into `@starlove/ui` or `@starlove/ui-react`.

## Local app CSS

Local CSS is appropriate for:

- board layout dimensions,
- data-density choices,
- drag-and-drop positioning,
- project-specific empty states,
- app shell spacing.

Local CSS is not appropriate for duplicating shared button, card, lane, drawer, or popover styling.

## Future docs

This page should eventually link to the Orbit app's exact root import file, theme/motion controls, and any project-specific constraints from its board memory.
