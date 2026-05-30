/**
 * Starscape tooltip-placement engine — TypeScript declarations.
 */

export interface TooltipPlacementOptions {
  /**
   * Pixels needed in the preferred top/bottom direction before the engine
   * accepts it. If less, flips. Default 80 (covers single-line tooltips
   * with margin to spare).
   */
  verticalGap?: number;

  /**
   * Pixels needed in the preferred left/right direction. Default 240
   * (covers most short tooltip content).
   */
  horizontalGap?: number;
}

/**
 * Mount the viewport-aware tooltip placement engine. On hover/focus of any
 * element carrying `data-tooltip`, sets `data-tooltip-resolved` to the
 * placement that fits (preferring `data-tooltip-placement` when it has room).
 *
 * Idempotent. SSR-safe. Returns a teardown function that removes listeners
 * and clears any resolved attributes.
 */
export function setupTooltipPlacement(
  options?: TooltipPlacementOptions
): () => void;
