import * as React from 'react';
import { cx } from './cx';
import { useClickOutside } from '../useClickOutside';
import { useEscapeKey } from '../useEscapeKey';

export interface ModalProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Controlled open state — drives `.is-open` / `.is-visible`. */
  open: boolean;
  /** Called on Escape, backdrop click, or close-button press. */
  onClose: () => void;
  /** Optional header title; renders the `.modal-header` row when provided. */
  title?: React.ReactNode;
  /** Set false to keep the modal mounted while closed (default keeps it mounted for the exit transition). */
  closeOnBackdrop?: boolean;
}

/**
 * Centered modal dialog. Controlled: you own `open` and `onClose`. Renders the
 * `.modal-backdrop` + `.modal` pair the CSS expects and stays mounted so the
 * open/close transitions play. Escape and outside-click dismissal come from
 * the shared hooks; both are gated on `open`.
 *
 * Pair with `import '@starlove/ui/components/modal';`.
 */
export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  function Modal(
    { open, onClose, title, closeOnBackdrop = true, className, children, ...rest },
    ref,
  ) {
    const dialogRef = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(ref, () => dialogRef.current as HTMLDivElement);
    const labelId = React.useId();

    useEscapeKey(onClose, { enabled: open });
    useClickOutside(dialogRef, onClose, { enabled: open && closeOnBackdrop });

    return (
      <>
        <div className={cx('modal-backdrop', open && 'is-visible')} aria-hidden="true" />
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? labelId : undefined}
          aria-hidden={!open}
          className={cx('modal', open && 'is-open', className)}
          {...rest}
        >
          {title != null && (
            <div className="modal-header">
              <h2 id={labelId} className="modal-title">
                {title}
              </h2>
              <button
                type="button"
                className="modal-close"
                aria-label="Close"
                onClick={onClose}
              >
                ×
              </button>
            </div>
          )}
          {children}
        </div>
      </>
    );
  },
);
