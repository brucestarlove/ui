import * as React from 'react';
import { cx } from './cx';

export interface NumberFieldProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  size?: 'sm' | 'md';
  disabled?: boolean;
  /** Accessible label for the input. */
  'aria-label'?: string;
  className?: string;
  id?: string;
  name?: string;
}

/**
 * Number spinbox with −/+ steppers. Controlled — you own `value`/`onChange`.
 * Clamps to `min`/`max` and steps by `step`.
 *
 * Pair with `import '@starlove/ui/components/number-field';`.
 */
export const NumberField = React.forwardRef<HTMLInputElement, NumberFieldProps>(
  function NumberField(
    {
      value,
      onChange,
      min,
      max,
      step = 1,
      size = 'md',
      disabled,
      className,
      id,
      name,
      ...rest
    },
    ref,
  ) {
    const clamp = (n: number) =>
      Math.min(max ?? Infinity, Math.max(min ?? -Infinity, n));
    const set = (n: number) => !disabled && onChange(clamp(n));

    return (
      <div
        className={cx('number-field', className)}
        data-size={size === 'md' ? undefined : size}
      >
        <button
          type="button"
          className="number-step"
          data-dir="down"
          aria-label="Decrease"
          disabled={disabled || (min != null && value <= min)}
          onClick={() => set(value - step)}
        >
          −
        </button>
        <input
          ref={ref}
          type="text"
          inputMode="numeric"
          id={id}
          name={name}
          value={value}
          disabled={disabled}
          onChange={(e) => {
            const n = Number(e.target.value);
            if (!Number.isNaN(n)) set(n);
          }}
          {...rest}
        />
        <button
          type="button"
          className="number-step"
          data-dir="up"
          aria-label="Increase"
          disabled={disabled || (max != null && value >= max)}
          onClick={() => set(value + step)}
        >
          +
        </button>
      </div>
    );
  },
);
