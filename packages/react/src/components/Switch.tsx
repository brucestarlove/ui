import * as React from 'react';
import { cx } from './cx';

export interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Text label rendered beside the track. */
  label?: React.ReactNode;
}

/**
 * Toggle switch. Wraps a visually-hidden but real `<input type="checkbox">`
 * (focusable, form-submittable) with the painted `.switch-track`. Controlled or
 * uncontrolled like any checkbox.
 *
 * Pair with `import '@starlove/ui/components/switch';`.
 */
export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  function Switch({ label, className, ...rest }, ref) {
    return (
      <label className={cx('switch', className)}>
        <input ref={ref} type="checkbox" {...rest} />
        <span className="switch-track" aria-hidden="true" />
        {label != null && <span className="switch-label">{label}</span>}
      </label>
    );
  },
);
