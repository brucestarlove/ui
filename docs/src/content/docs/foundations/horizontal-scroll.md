---
title: Horizontal Scroll
description: Design notes for the future ScrollLane primitive.
---

The CSS package already has the visual foundation for horizontal lanes through `lane.css` and the cursor assets. The drag-to-pan React primitive is intentionally deferred.

## Current CSS shape

```html
<section class="lane scroll-lane">
  <div class="scroll-lane-track">
    <article class="card">...</article>
    <article class="card">...</article>
    <article class="card">...</article>
  </div>
</section>
```

```css
.scroll-lane {
  overflow-x: auto;
  overflow-y: hidden;
  overscroll-behavior-x: contain;
  cursor: url('../cursors/live_move.cur'), grab;
  touch-action: pan-y;
  user-select: none;
}

.scroll-lane.is-grabbing {
  cursor: url('../cursors/live_move.cur'), grabbing;
  scroll-behavior: auto;
}

.scroll-lane.is-grabbing > * {
  pointer-events: none;
}

.scroll-lane-track {
  display: flex;
  gap: 0.85rem;
  width: max-content;
}
```

## Drag invariants

- Do not start a drag from links, buttons, inputs, textareas, or `[role="button"]`.
- Wait for a small drag threshold before adding `is-grabbing`.
- Use `setPointerCapture()` so the gesture continues when the pointer leaves the lane.
- Let vertical intent win so pages remain scrollable on touch and trackpads.
- Use `scroll-behavior: auto` while dragging so movement feels direct.

## Future React API

```tsx
import { ScrollLane } from '@starlove/ui-react';

<ScrollLane className="lane" snap="start" showEdgeFades>
  <Card />
  <Card />
  <Card />
</ScrollLane>
```

The future implementation should expose `dragToPan`, `dragThreshold`, `snap`, `showEdgeFades`, `showArrows`, `wheelToHorizontal`, `as`, and `onScrollEnd` without forcing app-specific card markup.
