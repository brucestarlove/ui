# Horizontal scroll system — design notes

> Status: **deferred**. The CSS pieces below ship today; the React component proposed at the bottom is intentionally not built yet.

The Starscape v3 landing site (`/mnt/c/Users/bruce/git/minimal-agent-board/index.html`, lines 665–720 + JS at 2154–2216) implements a polished horizontal scroller for the kanban board preview. It's a good pattern for any wide-content container — image carousels, KPI strips, comparison tables, week-views, log streams — and we want to ship it as a first-class library primitive eventually. This doc captures the design so a future agent can implement it without re-deriving the details.

## What it does

A pannable horizontal strip. Users can:
- **Click and drag** anywhere in the empty surface to pan the content left/right.
- **Wheel-scroll** vertically and have it translate to horizontal pan (with the OS shift modifier or natively on trackpads).
- **Touch swipe** on mobile (uses native overflow scrolling).
- **Tab** between items via keyboard focus (no JS required).

While dragging, the cursor flips to `grabbing`, scroll-snap is suppressed, and child elements stop receiving pointer events so a drag started anywhere doesn't fire stray clicks.

## What's already in the v3 library

The CSS half of the pattern lives in `packages/css/src/components/lane.css`. It can already be made horizontal:

```html
<section class="lane scroll-lane">
  <div class="scroll-lane-track">
    <article class="card">…</article>
    <article class="card">…</article>
    <article class="card">…</article>
  </div>
</section>
```

```css
/* Recipe — feel free to copy into a new components/scroll-lane.css. */
.scroll-lane {
  overflow-x: auto;
  overflow-y: hidden;
  overscroll-behavior-x: contain;
  scrollbar-width: thin;
  scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track);
  cursor: url('../cursors/live_move.cur'), grab;
  touch-action: pan-y;
  user-select: none;
  -webkit-user-select: none;
}

.scroll-lane.is-grabbing {
  cursor: url('../cursors/live_move.cur'), grabbing;
  scroll-behavior: auto;
}

.scroll-lane.is-grabbing > * {
  pointer-events: none;
}

.scroll-lane::-webkit-scrollbar { height: 8px; }
.scroll-lane::-webkit-scrollbar-track { background: transparent; }
.scroll-lane::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(var(--accent-rgb), 0.45), rgba(var(--blue-rgb), 0.5));
}
.scroll-lane::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(90deg, rgba(var(--accent-rgb), 0.65), rgba(var(--blue-rgb), 0.65));
}

[data-theme="dark"] .scroll-lane::-webkit-scrollbar-thumb {
  background: linear-gradient(90deg, rgba(var(--starlight-rgb), 0.45), rgba(var(--blue-rgb), 0.5));
}

.scroll-lane-track {
  display: flex;
  gap: 0.85rem;
  width: max-content;
}
```

The `cursor: url(.../live_move.cur), grab` already gives the correct visual affordance. What it doesn't give us yet is the **drag-to-pan JS** — without it, users can scroll only via wheel, trackpad, scrollbar, or touch swipe.

## Reference implementation (drag-to-pan)

From the landing site, lines 2154–2216:

```js
function attachBoardPan(board) {
  let isPanning = false;
  let lastX = 0;
  let pointerId = null;
  let dragThresholdMet = false;
  let downX = 0;
  let downY = 0;
  const DRAG_THRESHOLD = 4; // px

  board.addEventListener('pointerdown', (e) => {
    // Skip when starting on an interactive element — let it handle the click.
    if (e.target.closest('a, button, input, textarea, [role="button"]')) return;
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    pointerId = e.pointerId;
    lastX = e.clientX;
    downX = e.clientX;
    downY = e.clientY;
    isPanning = true;
    dragThresholdMet = false;
    board.setPointerCapture(pointerId);
  });

  board.addEventListener('pointermove', (e) => {
    if (!isPanning || e.pointerId !== pointerId) return;
    const dx = e.clientX - lastX;
    if (!dragThresholdMet) {
      const totalDx = Math.abs(e.clientX - downX);
      const totalDy = Math.abs(e.clientY - downY);
      if (totalDx > DRAG_THRESHOLD && totalDx > totalDy) {
        dragThresholdMet = true;
        board.classList.add('is-grabbing');
      } else if (totalDy > DRAG_THRESHOLD) {
        // Vertical intent — release and let the page scroll.
        isPanning = false;
        board.releasePointerCapture(pointerId);
        return;
      } else {
        return;
      }
    }
    board.scrollLeft -= dx;
    lastX = e.clientX;
  });

  const stop = (e) => {
    if (e.pointerId !== pointerId) return;
    isPanning = false;
    pointerId = null;
    board.classList.remove('is-grabbing');
  };
  board.addEventListener('pointerup', stop);
  board.addEventListener('pointercancel', stop);
  board.addEventListener('pointerleave', stop);
}
```

Key invariants:
- **4px drag threshold** before flipping into pan mode — below that, treat as a click and let interactive children handle it.
- **`setPointerCapture`** on the container so the gesture continues even if the cursor leaves the element.
- **Vertical intent dominates** — if a user starts dragging mostly vertically, release pointer capture so the page can scroll normally (critical on touch devices in vertical layouts).
- **`is-grabbing` class only added once threshold is crossed** — so a clean click doesn't ever flash the grabbing cursor.
- **`scroll-behavior: auto`** while grabbing (set in CSS via `.is-grabbing`) — disables smooth scroll so dragging feels 1:1 instead of laggy.

## Proposed React component

Future API (not built yet):

```tsx
import { ScrollLane } from '@starlove/ui-react';

<ScrollLane className="lane" snap="start" showEdgeFades>
  <Card />
  <Card />
  <Card />
</ScrollLane>
```

Behavior:

| Prop | Default | Notes |
|---|---|---|
| `dragToPan` | `true` | Whether to wire pointer-drag handlers. Mobile users who rely on touch swipe alone don't need it. |
| `dragThreshold` | `4` | Pixels before pointer-down counts as a drag. |
| `snap` | `undefined` | `'start' \| 'center' \| 'end'` — when set, applies `scroll-snap-type: x mandatory` on the lane and `scroll-snap-align: <value>` to children. |
| `showEdgeFades` | `false` | Adds left/right gradient masks via `mask-image: linear-gradient(...)` that hide overflow clipping at the edges. |
| `showArrows` | `false` | Renders previous/next arrow buttons (anchored against the lane) that scroll one viewport-width per click. |
| `wheelToHorizontal` | `false` | Translates vertical wheel deltas into `scrollLeft` changes — only enable on lanes that have no vertical content of their own. |
| `as` | `'div'` | Render-as escape hatch (`'section'`, `'ol'`). |
| `onScrollEnd` | — | Fires when the user releases and momentum settles. Useful for analytics or auto-pagination. |
| `className` | — | Composed onto the root; pass `lane` to keep the design-system aesthetic. |

Internal hooks:

- `useDragToPan(ref, { threshold, enabled })` — packages the JS above. Reusable on its own.
- `useScrollSnap(ref, mode)` — applies inline styles for snap behavior.
- `useWheelToHorizontal(ref, enabled)` — translates wheel events.

## Edge cases worth handling on day one

1. **Nested interactive elements.** A `<button>` inside a `ScrollLane` must still respond to clicks. Use `e.target.closest('a, button, input, textarea, [role="button"]')` to short-circuit drag handling.
2. **iOS momentum scrolling.** Don't disable native scroll on touch — only the mouse drag. Use `pointerType === 'touch'` to bail out of the manual pan path.
3. **Reduced motion.** Disable smooth scroll always (`scroll-behavior: auto`) when `prefers-reduced-motion: reduce` matches; consider not snapping either.
4. **Focus visibility.** When users tab to an off-screen child, scroll it into view with `behavior: 'smooth'` (or `'auto'` under reduced motion).
5. **Keyboard arrows.** Arrow-left / arrow-right when the lane is focused should scroll one card width — define `tabIndex={0}` on the lane and listen for those keys.
6. **Scrollbar height during scroll-snap.** WebKit's `::-webkit-scrollbar` sometimes interacts oddly with snap; test on Safari before locking the design.

## What ships in v3 today

- `lane.css` — the visual chrome of a section panel.
- `live_move.cur` — the panning cursor asset.
- The `--scrollbar-thumb`, `--scrollbar-thumb-hover`, `--scrollbar-track` tokens.

## What doesn't (yet)

- The drag-to-pan JS handler.
- Edge fade masks.
- Arrow buttons.
- `<ScrollLane>` React component.
- A `prefers-reduced-motion` story for snap behavior.

When picking this up, start by porting the CSS recipe above into `packages/css/src/components/scroll-lane.css`, then build the React layer on top. Mirror the kanban source's cursor + class behavior closely — it's already user-tested.
