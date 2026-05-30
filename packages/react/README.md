# @starlove/ui-react

React layer for Starscape v3: typed component wrappers over the CSS design
system, plus the theme/motion/disclosure hooks. Every wrapper renders the
semantically correct element, maps `variant`/`tone`/`size` props to the
`data-*` form the CSS expects, merges your `className`, and forwards `ref` +
native props. Stateful overlays are controlled and compose the hooks below.

```tsx
import '@starlove/ui';          // styles (once, at your root)
import { Button, Card, Modal } from '@starlove/ui-react';

<Button variant="ghost" onClick={save}>Save</Button>
<Card variant="feature">…</Card>
<Modal open={open} onClose={close} title="Settings">…</Modal>
```

## Components

| Group | Components |
|---|---|
| Core | `Button` `Card` `Badge` `Tabs`/`Tab` `Modal` |
| Forms | `Input` `Textarea` `Select` `Label` `FormRow` `FormHelp` `FormError` `SearchInput` `Switch` `Checkbox` `Radio` `Slider` `NumberField` `Rating` `TagInput` |
| Presentational | `Avatar`/`AvatarStack` `Divider` `Kbd` `Skeleton` `Progress` `Spinner` `List` `DescriptionList` `ControlRow` `Alert` `EmptyState` `CodeBlock` |
| Structural | `Breadcrumb` `Pagination` `Table` `Topbar`(+`Brand`/`Nav`/`Spacer`) `Lane`/`LaneGrid` `MediaCard` `Segmented` `Stepper` |
| Overlays | `Drawer` `Flyout`(+`Item`/`Separator`/`SectionLabel`) `Popover` `ContextMenu`(+`Item`/`Separator`) `Accordion`/`AccordionGroup` |
| Helper | `tooltip(label, placement?)` — spread onto any trigger for the CSS `data-tooltip` |

Each component pairs with its CSS file — import the whole library
(`@starlove/ui`) or cherry-pick (`…/components/button`).

## Hooks & utilities

| Export | Purpose |
|---|---|
| `useTheme()` | `system / light / dark` controller with localStorage + live OS tracking |
| `useMotion()` | `system / reduce / full` reduced-motion controller (mirrors `useTheme`) |
| `useScrollAware()` | toggles `body.is-scrolled` for the `.topbar` glass-on-scroll effect |
| `useTooltipPlacement()` | viewport-aware flip for `data-tooltip` elements |
| `useDisclosure()` | open/close primitive for modals, drawers, flyouts, popovers — returns `{ isOpen, open, close, toggle, triggerProps, surfaceProps }` |
| `useClickOutside(ref, handler, opts?)` | dismiss-on-outside-click, gated by `enabled` |
| `useEscapeKey(handler, opts?)` | dismiss-on-Escape, gated by `enabled` |
| `<Toaster />` | wraps `sonner`'s `<Toaster>` with theme tracking |
| `<Starscape />` | mounts the dark-mode background system (canvas starfield, meteors, nebulas) |

## Install

```bash
pnpm add @starlove/ui-react @starlove/ui sonner
```

## Disclosure pattern

Three small hooks replace the boilerplate inside every modal / drawer / flyout:

```tsx
import { useClickOutside, useDisclosure, useEscapeKey } from '@starlove/ui-react';

function MenuButton() {
  const flyout = useDisclosure();
  const wrapRef = useRef<HTMLDivElement>(null);
  useClickOutside(wrapRef, flyout.close, { enabled: flyout.isOpen });
  useEscapeKey(flyout.close, { enabled: flyout.isOpen });

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <button onClick={flyout.toggle} {...flyout.triggerProps}>Menu ▾</button>
      <div className={`flyout ${flyout.isOpen ? 'is-open' : ''}`} {...flyout.surfaceProps}>
        <button className="flyout-item">New space</button>
      </div>
    </div>
  );
}
```

`triggerProps` carries `id`, `aria-expanded`, `aria-controls`. `surfaceProps` carries the matching `id` and `aria-hidden`. Spread and forget.

## Theme + Toaster

```tsx
import '@starlove/ui';
import '@starlove/ui/components/sonner';
import { Toaster, useTheme } from '@starlove/ui-react';
import { toast } from 'sonner';

function ThemeButton() {
  const { mode, setMode } = useTheme();
  return (
    <button onClick={() => setMode(mode === 'dark' ? 'light' : mode === 'light' ? 'system' : 'dark')}>
      Theme: {mode}
    </button>
  );
}

export function App() {
  return (
    <>
      <ThemeButton />
      <button onClick={() => toast.success('hello starscape')}>toast</button>
      <Toaster />
    </>
  );
}
```
