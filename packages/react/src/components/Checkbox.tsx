import * as React from 'react';
import { cx } from './cx';

export interface ChoiceProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Text label beside the box/dot. Omit to render a bare restyled input. */
  label?: React.ReactNode;
}

/**
 * Checkbox. With a `label`, renders the `.check` block wrapper; without one,
 * renders a bare native checkbox (the CSS restyles it in place).
 *
 * Pair with `import '@starlove/ui/components/check';`.
 */
export const Checkbox = React.forwardRef<HTMLInputElement, ChoiceProps>(
  function Checkbox({ label, className, ...rest }, ref) {
    if (label == null) {
      return <input ref={ref} type="checkbox" className={className} {...rest} />;
    }
    return (
      <label className={cx('check', className)}>
        <input ref={ref} type="checkbox" {...rest} />
        <span className="check-label">{label}</span>
      </label>
    );
  },
);

/** Radio — mirrors Checkbox with the `.radio` wrapper. */
export const Radio = React.forwardRef<HTMLInputElement, ChoiceProps>(
  function Radio({ label, className, ...rest }, ref) {
    if (label == null) {
      return <input ref={ref} type="radio" className={className} {...rest} />;
    }
    return (
      <label className={cx('radio', className)}>
        <input ref={ref} type="radio" {...rest} />
        <span className="radio-label">{label}</span>
      </label>
    );
  },
);
