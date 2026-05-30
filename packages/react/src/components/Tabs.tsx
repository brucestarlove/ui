import * as React from 'react';
import { cx } from './cx';

export type TabsVariant = 'pill' | 'underline';
export type TabsOrientation = 'horizontal' | 'vertical';

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: TabsVariant;
  orientation?: TabsOrientation;
}

/**
 * Tab strip. Renders `<div class="tabs" role="tablist">`. Wrap `<Tab>`
 * children. State (which tab is selected) stays with the consumer — pass
 * `selected` to each `<Tab>`. Pair with `.tab-panels` + `role="tabpanel"`
 * sections for the panels.
 */
export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  { variant, orientation, className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      role="tablist"
      className={cx('tabs', className)}
      data-variant={variant === 'pill' ? undefined : variant}
      data-orientation={orientation === 'horizontal' ? undefined : orientation}
      {...rest}
    />
  );
});

export interface TabProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Active tab — drives `aria-selected` and the active styling. */
  selected?: boolean;
}

export const Tab = React.forwardRef<HTMLButtonElement, TabProps>(function Tab(
  { selected, className, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      role="tab"
      aria-selected={selected}
      className={cx('tab', className)}
      {...rest}
    />
  );
});
