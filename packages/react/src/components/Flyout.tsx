import * as React from 'react';
import { cx } from './cx';
import { useClickOutside } from '../useClickOutside';
import { useEscapeKey } from '../useEscapeKey';

export interface FlyoutProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  /** When provided, Escape + outside-click dismiss the flyout. */
  onClose?: () => void;
}

/**
 * Anchored overlay surface for dropdowns, menus, and inline create forms.
 * Position it yourself (wrap the trigger + flyout in a `position: relative`
 * container). Pair with `useDisclosure` for open state; pass `onClose` to wire
 * Escape + outside-click dismissal.
 *
 * Pair with `import '@starlove/ui/components/flyout';`.
 */
export const Flyout = React.forwardRef<HTMLDivElement, FlyoutProps>(
  function Flyout({ open, onClose, className, ...rest }, ref) {
    const innerRef = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(ref, () => innerRef.current as HTMLDivElement);

    useEscapeKey(() => onClose?.(), { enabled: open && !!onClose });
    useClickOutside(innerRef, () => onClose?.(), { enabled: open && !!onClose });

    return (
      <div
        ref={innerRef}
        role="menu"
        aria-hidden={!open}
        className={cx('flyout', open && 'is-open', className)}
        {...rest}
      />
    );
  },
);

export interface FlyoutItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Red destructive styling. */
  danger?: boolean;
  /** Active/selected row. */
  active?: boolean;
}

export const FlyoutItem = React.forwardRef<HTMLButtonElement, FlyoutItemProps>(
  function FlyoutItem({ danger, active, disabled, className, type = 'button', ...rest }, ref) {
    return (
      <button
        ref={ref}
        type={type}
        role="menuitem"
        className={cx('flyout-item', active && 'is-active', className)}
        data-danger={danger ? '' : undefined}
        aria-disabled={disabled || undefined}
        disabled={disabled}
        {...rest}
      />
    );
  },
);

export const FlyoutSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function FlyoutSeparator({ className, ...rest }, ref) {
  return (
    <div
      ref={ref}
      role="separator"
      className={cx('flyout-separator', className)}
      {...rest}
    />
  );
});

export const FlyoutSectionLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function FlyoutSectionLabel({ className, ...rest }, ref) {
  return <div ref={ref} className={cx('flyout-section-label', className)} {...rest} />;
});
