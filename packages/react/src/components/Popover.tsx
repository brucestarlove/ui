import * as React from 'react';
import { cx } from './cx';
import { useClickOutside } from '../useClickOutside';
import { useEscapeKey } from '../useEscapeKey';

export type PopoverPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface PopoverProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  open: boolean;
  onClose?: () => void;
  placement?: PopoverPlacement;
  /** Header title region. */
  title?: React.ReactNode;
  /** Footer region (e.g. Reset/Apply). */
  footer?: React.ReactNode;
  /** Show the directional arrow (default true). */
  arrow?: boolean;
}

/**
 * Richer anchored surface than `Flyout`: title/body/footer regions and a
 * directional arrow. Position it yourself and set `placement` to match. Pass
 * `onClose` to wire Escape + outside-click dismissal.
 *
 * Pair with `import '@starlove/ui/components/popover';`.
 */
export const Popover = React.forwardRef<HTMLDivElement, PopoverProps>(
  function Popover(
    { open, onClose, placement = 'bottom', title, footer, arrow = true, className, children, ...rest },
    ref,
  ) {
    const innerRef = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(ref, () => innerRef.current as HTMLDivElement);

    useEscapeKey(() => onClose?.(), { enabled: open && !!onClose });
    useClickOutside(innerRef, () => onClose?.(), { enabled: open && !!onClose });

    return (
      <div
        ref={innerRef}
        role="dialog"
        aria-hidden={!open}
        className={cx('popover', open && 'is-open', className)}
        data-placement={placement === 'bottom' ? undefined : placement}
        {...rest}
      >
        {arrow && <div className="popover-arrow" aria-hidden="true" />}
        {title != null && <header className="popover-head">{title}</header>}
        <div className="popover-body">{children}</div>
        {footer != null && <footer className="popover-foot">{footer}</footer>}
      </div>
    );
  },
);
