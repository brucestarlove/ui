import { useEffect } from 'react';
import {
  setupTooltipPlacement,
  type TooltipPlacementOptions,
} from '@starlove/ui/tooltip-placement';

/**
 * Mount the viewport-aware tooltip placement engine. Pair with elements
 * carrying `data-tooltip` and an optional `data-tooltip-placement="top|
 * bottom|left|right"` (default "top"). When the preferred direction would
 * clip the viewport, the engine flips to the opposite side via
 * `data-tooltip-resolved`.
 *
 * Call once near the root of your app:
 *
 *   useTooltipPlacement();
 *
 * Tunable thresholds:
 *
 *   useTooltipPlacement({ verticalGap: 60, horizontalGap: 200 });
 */
export function useTooltipPlacement(options?: TooltipPlacementOptions): void {
  useEffect(() => {
    const teardown = setupTooltipPlacement(options);
    return teardown;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options?.verticalGap, options?.horizontalGap]);
}
