---
title: Starscape Docs
description: Central documentation for Starscape UI packages and project adoption.
---

Starscape Docs is the companion site for the Starscape UI package family and the place future Starscape apps should look before adopting shared interface patterns.

The visual preview app answers "what exists?" with a masonry gallery of live components. This docs site answers "how should I use it?" with package contracts, foundations, project adoption notes, and agent-facing implementation rules.

## Scope

| Area | Purpose |
| --- | --- |
| Packages | Installation, imports, exports, and dependency shape for `@starlove/ui` and `@starlove/ui-react`. |
| Foundations | Theme, motion, focus, tokens, accessibility, directionality, and shared interaction rules. |
| Component system | Canonical class names, React wrappers, CSS entry points, and authoring conventions. |
| Projects | Notes for apps such as Orbit Kanban that consume Starscape as their base UI layer. |
| Agents | Rules that keep AI-assisted edits aligned with the design system instead of inventing local variants. |

## Relationship to the preview app

Use `apps/web-demo` when you need to inspect rendered components, compare states, or test the masonry gallery.

Use this docs app when you need durable guidance:

- which package to install,
- which import path to use,
- which attributes control theme and motion,
- which component class or React wrapper is canonical,
- what a future Starscape project should do before adding local UI.

## First reading path

1. Start with [Getting Started](/getting-started/).
2. Read [@starlove/ui](/packages/ui/) before changing CSS imports.
3. Read [@starlove/ui-react](/packages/ui-react/) before using wrappers or hooks.
4. Check the [Project Adoption](/projects/) notes before wiring the package into an app.
5. Check [Implementation Rules](/agents/implementation-rules/) before letting an agent modify a consuming project.
