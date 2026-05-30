import * as React from 'react';
import { cx } from './cx';

export interface DialogProps
  extends Omit<React.DialogHTMLAttributes<HTMLDialogElement>, 'open' | 'title'> {
  open: boolean;
  /** Fired on Escape, backdrop click, or native close. */
  onClose?: () => void;
  /** Close when the backdrop (outside the content) is clicked (default true). */
  closeOnBackdrop?: boolean;
}

/**
 * Native `<dialog>` overlay. Controlled: drives `showModal()`/`close()` from
 * `open`. Escape and backdrop clicks dismiss it (both call `onClose`). Distinct
 * from `Modal` (which is a JS-class-driven div) — this uses the platform dialog
 * + `::backdrop`.
 *
 * Pair with `import '@starlove/ui/components/dialog';`.
 */
export const Dialog = React.forwardRef<HTMLDialogElement, DialogProps>(
  function Dialog({ open, onClose, closeOnBackdrop = true, className, children, ...rest }, ref) {
    const dialogRef = React.useRef<HTMLDialogElement>(null);
    React.useImperativeHandle(ref, () => dialogRef.current as HTMLDialogElement);

    React.useEffect(() => {
      const el = dialogRef.current;
      if (!el) return;
      if (open && !el.open) el.showModal();
      else if (!open && el.open) el.close();
    }, [open]);

    return (
      <dialog
        ref={dialogRef}
        className={cx('dialog', className)}
        onClose={() => onClose?.()}
        onClick={(e) => {
          if (closeOnBackdrop && e.target === dialogRef.current) onClose?.();
        }}
        {...rest}
      >
        {children}
      </dialog>
    );
  },
);

export interface WelcomeNotice {
  /** Small uppercase label above the notice text. */
  label?: React.ReactNode;
  content: React.ReactNode;
}

export interface WelcomeDialogProps {
  open: boolean;
  onClose?: () => void;
  /** Logo image URL, or a custom node (e.g. an inline SVG). */
  logo?: string | React.ReactNode;
  /** Edition pill text (e.g. "Preview edition"). */
  edition?: React.ReactNode;
  title: React.ReactNode;
  lede?: React.ReactNode;
  notices?: WelcomeNotice[];
  ctaLabel?: React.ReactNode;
  /** CTA press; defaults to closing the dialog. */
  onCta?: () => void;
}

/**
 * Preview-edition welcome panel composed inside the native `Dialog` shell:
 * logo + edition pill, title, lede, a bordered notices list, and a primary CTA.
 *
 * Pair with `import '@starlove/ui/components/dialog';`.
 */
export function WelcomeDialog({
  open,
  onClose,
  logo,
  edition,
  title,
  lede,
  notices,
  ctaLabel = 'Get started',
  onCta,
}: WelcomeDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <div className="welcome-dialog-inner">
        {(logo != null || edition != null) && (
          <div className="welcome-dialog-head">
            {typeof logo === 'string' ? (
              <img className="welcome-dialog-logo" src={logo} alt="" />
            ) : (
              logo
            )}
            {edition != null && (
              <span className="welcome-dialog-edition-pill">{edition}</span>
            )}
          </div>
        )}
        <div>
          <h2 className="welcome-dialog-title">{title}</h2>
          {lede != null && <p className="welcome-dialog-lede">{lede}</p>}
        </div>
        {notices && notices.length > 0 && (
          <ul className="welcome-dialog-notices">
            {notices.map((n, i) => (
              <li key={i}>
                {n.label != null && (
                  <span className="welcome-dialog-notice-label">{n.label}</span>
                )}
                {n.content}
              </li>
            ))}
          </ul>
        )}
        <div className="welcome-dialog-footer">
          <button
            type="button"
            className="welcome-dialog-cta"
            onClick={() => (onCta ? onCta() : onClose?.())}
          >
            {ctaLabel}
          </button>
        </div>
      </div>
    </Dialog>
  );
}
