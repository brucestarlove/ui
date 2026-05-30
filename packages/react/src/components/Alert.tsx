import * as React from 'react';
import { cx } from './cx';

export type AlertTone = 'info' | 'success' | 'warning' | 'danger';

export interface AlertProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  tone?: AlertTone;
  /** Full-width, square-cornered page-top banner. */
  banner?: boolean;
  /** Leading icon/glyph. */
  icon?: React.ReactNode;
  /** Bold first line. */
  title?: React.ReactNode;
  /** Called when the dismiss × is pressed; omit to hide it. */
  onClose?: () => void;
  closeLabel?: string;
}

/**
 * Persistent alert/banner (the counterpart to a transient toast). Pass `title`
 * and/or children for the message; `onClose` adds the dismiss button.
 *
 * Pair with `import '@starlove/ui/components/alert';`.
 */
export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { tone, banner, icon, title, onClose, closeLabel = 'Dismiss', className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      role="status"
      className={cx('alert', className)}
      data-tone={tone}
      data-variant={banner ? 'banner' : undefined}
      {...rest}
    >
      {icon != null && <span className="alert-icon">{icon}</span>}
      <div className="alert-body">
        {title != null && <strong className="alert-title">{title}</strong>}
        {children != null && <p className="alert-message">{children}</p>}
      </div>
      {onClose && (
        <button
          type="button"
          className="alert-close"
          aria-label={closeLabel}
          onClick={onClose}
        >
          ×
        </button>
      )}
    </div>
  );
});
