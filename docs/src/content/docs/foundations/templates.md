---
title: Page Templates
description: Ready-made full-page layouts — the shell and sidebar templates.
---

Templates are ready-made, full-page layouts built from Starscape tokens and components. They
ship as CSS in `@starlove/ui/templates/*` and as typed React wrappers in `@starlove/ui-react`.

```ts
import '@starlove/ui/templates';          // both templates
import '@starlove/ui/templates/shell';    // shell only
import '@starlove/ui/templates/sidebar';  // sidebar only
```

The CSS owns all styling; the React wrappers only manage layout state (collapse, group
expand). A non-React app can use the class names directly.

## `shell` — single-column app shell

An animated background, a fixed topbar, and a centered scrollable content region.

```html
<div class="page-shell">
  <header class="topbar">…</header>
  <main class="page-shell-main">…</main>
</div>
```

In React: `<PageShell background topbar={<Topbar/>}>…</PageShell>`.

## `sidebar` — collapsible two-column layout

A collapsible left navigation rail (264px ↔ 72px) and a content region. The rail carries a
brand header, an optional search slot, labelled nav sections (icons + count badges),
expandable nav groups, a footer, and a collapse toggle.

```html
<div class="page-sidebar-app">            <!-- add data-collapsed to fold -->
  <aside class="page-sidebar">
    <div class="page-sidebar-header">
      <div class="page-sidebar-logo">✦</div>
      <div class="page-sidebar-titles">
        <span class="page-sidebar-title">Starscape</span>
        <span class="page-sidebar-subtitle">command deck</span>
      </div>
    </div>
    <div class="page-sidebar-search"><input class="input" /></div>
    <nav class="page-sidebar-nav">
      <div class="page-sidebar-section">
        <div class="page-sidebar-section-label">workspace</div>
        <button class="page-sidebar-nav-item" data-active>
          <span class="page-sidebar-nav-icon">…</span>
          <span class="page-sidebar-nav-label">overview</span>
          <span class="page-sidebar-nav-badge">3</span>
        </button>
        <div class="page-sidebar-nav-group" data-expanded>
          <button class="page-sidebar-nav-item page-sidebar-nav-parent">…
            <span class="page-sidebar-nav-chevron">›</span>
          </button>
          <div class="page-sidebar-nav-children">
            <div class="page-sidebar-nav-children-inner">…</div>
          </div>
        </div>
      </div>
    </nav>
    <div class="page-sidebar-footer">…</div>
    <div class="page-sidebar-toggle-wrap"><button class="page-sidebar-toggle">…</button></div>
  </aside>
  <main class="page-sidebar-main">…</main>
</div>
```

Collapse with `data-collapsed` on `.page-sidebar-app`; expand a group with `data-expanded` on
`.page-sidebar-nav-group`. Below 768px the rail folds into a horizontal top bar automatically.

### React wrapper

```tsx
import {
  PageSidebar,
  PageSidebarHeader,
  PageSidebarSearch,
  PageSidebarNav,
  PageSidebarSection,
  PageSidebarNavItem,
  PageSidebarNavGroup,
  PageSidebarFooter,
} from '@starlove/ui-react';

<PageSidebar
  storageKey="app.sidebar"
  brand={<PageSidebarHeader logo="✦" title="Starscape" subtitle="command deck" />}
  search={<PageSidebarSearch><input className="input" placeholder="Search…" /></PageSidebarSearch>}
  nav={
    <PageSidebarNav>
      <PageSidebarSection label="workspace">
        <PageSidebarNavItem icon={<HomeIcon />} active badge="3">overview</PageSidebarNavItem>
        <PageSidebarNavGroup label="profiles" icon={<UserIcon />} defaultExpanded>
          <PageSidebarNavItem>nova</PageSidebarNavItem>
        </PageSidebarNavGroup>
      </PageSidebarSection>
    </PageSidebarNav>
  }
  footer={<PageSidebarFooter>…</PageSidebarFooter>}
>
  …content…
</PageSidebar>
```

`storageKey` persists the collapsed state across reloads. See the `sidebar` lane in the
preview app (`apps/web-demo`) for a full, live example.

## This site uses it

These docs run on the `sidebar` template. Because the layout is pure CSS, it was ported into
Starlight component overrides (`docs/src/components/overrides/`) rather than embedded as a
React island: the rail, sections, active-item accent rail, count badges, collapse toggle, and
responsive top-bar fold are all the same `.page-sidebar-*` classes shown above, driven by
Starlight's own navigation data.
