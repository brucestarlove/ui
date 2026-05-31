import * as React from 'react';
import { cx } from './cx';

/** Semantic tone for chips. Maps to the `data-tone` attribute the CSS keys off. */
export type ChipTone = 'accent' | 'success' | 'warning' | 'danger';

/* ---------------- Badge — numeric notification count ---------------- */

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement>;

/**
 * A small numeric notification count. Renders nothing when empty.
 * Pair with `import '@starlove/ui/components/badge';`.
 */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  function Badge({ className, ...rest }, ref) {
    return <span ref={ref} className={cx('badge', className)} {...rest} />;
  },
);

/* ---------------- Chip — labeled tag / status pill ---------------- */

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Semantic color. */
  tone?: ChipTone;
  /** `solid` is the bolder, fully-filled emphasis; omit for the quiet default. */
  variant?: 'solid';
  /** Add hover/press toggle affordance (filter-pill behavior). */
  interactive?: boolean;
}

export const Chip = React.forwardRef<HTMLSpanElement, ChipProps>(
  function Chip({ tone, variant, interactive, className, ...rest }, ref) {
    return (
      <span
        ref={ref}
        className={cx('chip', className)}
        data-tone={tone}
        data-variant={variant}
        data-interactive={interactive ? '' : undefined}
        {...rest}
      />
    );
  },
);

/* ---------------- Dot — presence / live status ---------------- */

export interface DotProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Switch from the presence glow to the tone-colored live halo pulse. */
  live?: boolean;
  /** Live tone (default red). */
  tone?: 'success' | 'accent';
  /** Render as a count bubble wrapping `children`. */
  count?: boolean;
}

export const Dot = React.forwardRef<HTMLSpanElement, DotProps>(
  function Dot({ live, tone, count, className, ...rest }, ref) {
    return (
      <span
        ref={ref}
        className={cx('dot', className)}
        data-live={live ? '' : undefined}
        data-tone={tone}
        data-count={count ? '' : undefined}
        {...rest}
      />
    );
  },
);
