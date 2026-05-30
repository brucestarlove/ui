import * as React from 'react';
import { cx } from './cx';
import { useClickOutside } from '../useClickOutside';
import { useEscapeKey } from '../useEscapeKey';

export interface DrawerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  open: boolean;
  onClose: () => void;
  /** Small uppercase kicker above the title. */
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
  /** Footer region (e.g. Save/Cancel). */
  footer?: React.ReactNode;
  /** Dismiss on backdrop click / Escape (default true). */
  dismissable?: boolean;
}

/**
 * Right-anchored drawer (sheet) for detail panes and side forms. Controlled:
 * you own `open`/`onClose`. Renders the `.drawer-backdrop` + `.drawer` pair and
 * stays mounted so the slide transition plays. Escape + outside-click come from
 * the shared hooks.
 *
 * Pair with `import '@starlove/ui/components/drawer';`.
 */
export const Drawer = React.forwardRef<HTMLDivElement, DrawerProps>(
  function Drawer(
    { open, onClose, eyebrow, title, footer, dismissable = true, className, children, ...rest },
    ref,
  ) {
    const panelRef = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(ref, () => panelRef.current as HTMLDivElement);

    useEscapeKey(onClose, { enabled: open && dismissable });
    useClickOutside(panelRef, onClose, { enabled: open && dismissable });

    const hasHeader = eyebrow != null || title != null;
    return (
      <>
        <div className={cx('drawer-backdrop', open && 'is-visible')} aria-hidden="true" />
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-hidden={!open}
          className={cx('drawer', open && 'is-open', className)}
          {...rest}
        >
          {hasHeader && (
            <header className="drawer-header">
              <div>
                {eyebrow != null && <div className="drawer-eyebrow">{eyebrow}</div>}
                {title != null && <h2 className="drawer-title">{title}</h2>}
              </div>
              <button
                type="button"
                className="drawer-close"
                aria-label="Close"
                onClick={onClose}
              >
                ×
              </button>
            </header>
          )}
          <div className="drawer-body">{children}</div>
          {footer != null && <footer className="drawer-footer">{footer}</footer>}
        </div>
      </>
    );
  },
);
