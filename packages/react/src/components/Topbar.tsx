import * as React from 'react';
import { cx } from './cx';
import { useScrollAware } from '../useScrollAware';

export interface TopbarProps extends React.HTMLAttributes<HTMLElement> {
  /** Auto-toggle the glass-on-scroll effect via useScrollAware (default on). */
  scrollAware?: boolean;
  /** Scroll threshold in px before the glass slides in. */
  threshold?: number;
}

/**
 * Scroll-aware fixed topbar. Backgroundless until the page scrolls past
 * `threshold`, then a soft gradient + blur slides in. By default wires up
 * `useScrollAware()` for you; pass `scrollAware={false}` to manage `is-scrolled`
 * yourself. Remember to pad your main content by the topbar height.
 *
 * Pair with `import '@starlove/ui/components/topbar';`.
 */
export const Topbar = React.forwardRef<HTMLElement, TopbarProps>(function Topbar(
  { scrollAware = true, threshold = 8, className, ...rest },
  ref,
) {
  // Infinity threshold never crosses, so the hook stays a no-op when opted out
  // (keeps the call unconditional for rules-of-hooks).
  useScrollAware({ threshold: scrollAware ? threshold : Infinity });
  return <header ref={ref} className={cx('topbar', className)} {...rest} />;
});

export const TopbarBrand = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function TopbarBrand({ className, ...rest }, ref) {
  return <div ref={ref} className={cx('topbar-brand', className)} {...rest} />;
});

export const TopbarNav = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(function TopbarNav({ className, ...rest }, ref) {
  return <nav ref={ref} className={cx('topbar-nav', className)} {...rest} />;
});

/** Flexible spacer that pushes following items to the end. */
export const TopbarSpacer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function TopbarSpacer({ className, ...rest }, ref) {
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cx('topbar-spacer', className)}
      {...rest}
    />
  );
});
