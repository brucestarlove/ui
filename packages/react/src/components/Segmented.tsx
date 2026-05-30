import * as React from 'react';
import { cx } from './cx';

export interface SegmentedOption<T extends string = string> {
  value: T;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface SegmentedProps<T extends string = string>
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value: T;
  onChange: (value: T) => void;
  options: SegmentedOption<T>[];
  size?: 'sm' | 'md' | 'lg';
  /** Required for the radiogroup label. */
  'aria-label': string;
}

/**
 * Segmented control — "joined pills", one value selected at a time. Implemented
 * as an ARIA radiogroup. Controlled via `value`/`onChange`.
 *
 * Pair with `import '@starlove/ui/components/segmented';`.
 */
export function Segmented<T extends string = string>({
  value,
  onChange,
  options,
  size = 'md',
  className,
  ...rest
}: SegmentedProps<T>) {
  return (
    <div
      role="radiogroup"
      className={cx('segmented', className)}
      data-size={size === 'md' ? undefined : size}
      {...rest}
    >
      {options.map((opt) => (
        <button
          type="button"
          key={opt.value}
          role="radio"
          className="segmented-option"
          aria-checked={value === opt.value}
          aria-disabled={opt.disabled || undefined}
          disabled={opt.disabled}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
