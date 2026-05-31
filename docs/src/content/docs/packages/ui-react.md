---
title: '@starlove/ui-react'
description: Optional React wrappers and hooks for Starscape UI.
---

`@starlove/ui-react` is a thin, typed React layer over `@starlove/ui`.

It should stay optional. Non-React apps use the CSS package directly; the wrappers render the
same canonical markup and `data-*` attributes the CSS package styles — they add types,
state, and a few behaviors, not new styling.

## App import shape

```tsx
import '@starlove/ui';
import { Button, Card, Starscape, Toaster, useTheme } from '@starlove/ui-react';
```

The CSS import is still required. React wrappers render canonical Starscape markup but do not
bundle the stylesheet for the app.

## Hooks

```tsx
import {
  useTheme,
  useMotion,
  useDisclosure,
  useClickOutside,
  useEscapeKey,
  useContextMenu,
  useScrollAware,
  useStepper,
  useTooltipPlacement,
} from '@starlove/ui-react';
```

- `useTheme()` manages `system | light | dark`, resolves the active theme, and writes explicit
  choices to `<html data-theme>`. Returns `{ mode, resolved, setMode }`.
- `useMotion()` manages `system | reduce | full` and writes to `<html data-motion>`. Returns
  `{ mode, resolved, setMode }`.
- `useDisclosure()`, `useClickOutside()`, `useEscapeKey()`, `useContextMenu()`,
  `useScrollAware()`, `useStepper()`, `useTooltipPlacement()` package common interaction
  behavior without forcing app-specific state models.

## Components

The package exports typed wrappers for most of the CSS component surface. Variants and tones
map to the `data-variant` / `data-tone` attributes documented per component.

| Group | Exports |
| --- | --- |
| Actions | `Button` (`ButtonVariant`: `primary` · `secondary` · `ghost` · `translucent` · `cta` · `command` · `plus`), `Pagination` |
| Forms | `Input`, `Textarea`, `Select`, `Label`, `FormRow`, `FormHelp`, `FormError`, `SearchInput`, `Switch`, `Checkbox`, `Radio`, `Slider`, `NumberField`, `Rating`, `TagInput` |
| Surfaces | `Card` (`CardVariant`: `epic` · `feature` · `task` · `bug`), `Lane`, `LaneGrid`, `Section`, `MediaCard` |
| Overlays | `Modal`, `Drawer`, `Flyout` (+ `FlyoutItem`, `FlyoutSeparator`, `FlyoutSectionLabel`), `Popover`, `ContextMenu` (+ `ContextMenuItem`, `ContextMenuSeparator`), `Dialog`, `WelcomeDialog` |
| Navigation | `Topbar` (+ `TopbarBrand`, `TopbarNav`, `TopbarSpacer`), `Tabs`/`Tab`, `Segmented`, `Breadcrumb` |
| Disclosure | `Accordion`/`AccordionGroup`, `EpicAccordion`, `Stepper` |
| Feedback | `Alert`, `EmptyState`, `Progress`, `Spinner`, `Skeleton`, `Toaster` (Sonner wrapper) |
| Data & content | `Table`, `DescriptionList`, `List`, `CodeBlock`, `Terminal`/`CodeSnippet`, `Prose` |
| Indicators | `Badge`, `Chip`, `Dot`, `Avatar`/`AvatarStack`, `Kbd`, `Separator`, `ControlRow` |
| Background | `Starscape` (mounts the dark-mode starfield), `LoadingScreen` |
| Utilities | `tooltip()` helper |

## Page templates

Ready-made full-page layouts, mirroring the `@starlove/ui/templates/*` CSS:

- `PageShell` — single-column app shell (background, fixed topbar, scrollable content).
- `PageSidebar` (+ `PageSidebarHeader`, `PageSidebarBrand`, `PageSidebarSearch`,
  `PageSidebarNav`, `PageSidebarSection`, `PageSidebarNavItem`, `PageSidebarNavGroup`,
  `PageSidebarNavSeparator`, `PageSidebarFooter`) — the collapsible two-column rail layout.
  This documentation site runs on the same template (ported to Starlight overrides).

See [Page Templates](/foundations/templates/) for the markup contract and the CSS/React split.

## Dependency rule

Apps using this package should depend on both packages:

```json
{
  "dependencies": {
    "@starlove/ui": "workspace:*",
    "@starlove/ui-react": "workspace:*"
  }
}
```
