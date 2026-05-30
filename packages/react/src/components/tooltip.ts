export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

/**
 * The Starscape tooltip is a CSS `::after` driven by a `data-tooltip` attribute
 * — there's no wrapper element to render. Spread this onto any trigger:
 *
 *   <button {...tooltip('Save (⌘S)')}>Save</button>
 *   <button {...tooltip('Help', 'bottom')}>?</button>
 *
 * For viewport-aware auto-flipping, also mount `useTooltipPlacement()`.
 *
 * Pair with `import '@starlove/ui/components/tooltip';`.
 */
export function tooltip(
  label: string,
  placement?: TooltipPlacement,
): { 'data-tooltip': string; 'data-tooltip-placement'?: TooltipPlacement } {
  return {
    'data-tooltip': label,
    ...(placement ? { 'data-tooltip-placement': placement } : {}),
  };
}
