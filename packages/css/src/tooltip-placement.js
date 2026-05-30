/**
 * Starscape v3 — viewport-aware tooltip placement.
 *
 * On hover/focus of any element with `data-tooltip`, this engine:
 *
 *   1. Reads the preferred placement from `data-tooltip-placement` (default
 *      "top").
 *   2. Uses the trigger's getBoundingClientRect() to check whether the
 *      preferred direction has room in the viewport.
 *   3. Sets `data-tooltip-resolved` on the trigger to either the preferred
 *      placement (it fits) or the opposite side (it doesn't).
 *
 * The CSS in components/tooltip.css prefers `data-tooltip-resolved` when set
 * and falls back to `data-tooltip-placement` when no JS is loaded — so
 * static HTML still works correctly without this engine running.
 *
 * Idempotent. SSR-safe. Returns a teardown function.
 *
 *   import { setupTooltipPlacement } from '@starlove/ui/tooltip-placement';
 *   const teardown = setupTooltipPlacement();
 *   // …
 *   teardown();
 */

let teardownActive = null;

/**
 * @typedef {Object} TooltipPlacementOptions
 * @property {number} [verticalGap=80]    Pixels needed in preferred top/bottom direction. Less than this triggers flip.
 * @property {number} [horizontalGap=240] Pixels needed in preferred left/right direction. Less than this triggers flip.
 */

/** @returns {() => void} teardown */
export function setupTooltipPlacement(options = {}) {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return noop;
  }
  if (teardownActive) return teardownActive;

  const verticalGap = typeof options.verticalGap === 'number' ? options.verticalGap : 80;
  const horizontalGap = typeof options.horizontalGap === 'number' ? options.horizontalGap : 240;

  /** Resolve the placement on a single trigger element. */
  function resolve(el) {
    const preferred = el.getAttribute('data-tooltip-placement') || 'top';
    const rect = el.getBoundingClientRect();
    const vw = window.innerWidth || document.documentElement.clientWidth;
    const vh = window.innerHeight || document.documentElement.clientHeight;

    let resolved = preferred;

    switch (preferred) {
      case 'top':
        if (rect.top < verticalGap && vh - rect.bottom >= verticalGap) {
          resolved = 'bottom';
        }
        break;
      case 'bottom':
        if (vh - rect.bottom < verticalGap && rect.top >= verticalGap) {
          resolved = 'top';
        }
        break;
      case 'left':
        if (rect.left < horizontalGap && vw - rect.right >= horizontalGap) {
          resolved = 'right';
        }
        break;
      case 'right':
        if (vw - rect.right < horizontalGap && rect.left >= horizontalGap) {
          resolved = 'left';
        }
        break;
      default:
        // Unknown placement — leave it for the CSS to handle as default.
        return;
    }

    el.setAttribute('data-tooltip-resolved', resolved);
  }

  function findTrigger(target) {
    if (!target || target.nodeType !== 1) return null;
    return target.closest('[data-tooltip]');
  }

  function onPointer(e) {
    const el = findTrigger(e.target);
    if (el) resolve(el);
  }

  function onFocus(e) {
    const el = findTrigger(e.target);
    if (el) resolve(el);
  }

  // mouseover bubbles, so a single delegated listener covers the whole
  // document. The handler is cheap (one getBoundingClientRect + a comparison)
  // so over-firing on child movement is acceptable.
  document.addEventListener('mouseover', onPointer, true);
  document.addEventListener('focusin', onFocus, true);

  // On viewport resize, re-check any currently-hovered tooltip — otherwise
  // a window resize while a tooltip is showing leaves the placement stale.
  let resizeTimer = 0;
  function onResize() {
    if (resizeTimer) return;
    resizeTimer = window.setTimeout(() => {
      resizeTimer = 0;
      const hovered = document.querySelector('[data-tooltip]:hover');
      if (hovered) resolve(hovered);
    }, 100);
  }
  window.addEventListener('resize', onResize, { passive: true });

  function teardown() {
    document.removeEventListener('mouseover', onPointer, true);
    document.removeEventListener('focusin', onFocus, true);
    window.removeEventListener('resize', onResize);
    if (resizeTimer) {
      window.clearTimeout(resizeTimer);
      resizeTimer = 0;
    }
    document.querySelectorAll('[data-tooltip-resolved]').forEach((el) => {
      el.removeAttribute('data-tooltip-resolved');
    });
    teardownActive = null;
  }

  teardownActive = teardown;
  return teardown;
}

function noop() {}
