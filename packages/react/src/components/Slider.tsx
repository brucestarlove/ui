import * as React from 'react';
import { cx } from './cx';

export type SliderSize = 'sm' | 'md' | 'lg';

export interface SliderProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  size?: SliderSize;
  /** Optional heading label shown above the track. */
  label?: React.ReactNode;
  /** Optional value readout shown opposite the label. */
  valueLabel?: React.ReactNode;
}

/** Percent (0–100) of an input's value within its min/max, for the CSS fill. */
function fillPercent(el: HTMLInputElement): number {
  const min = Number(el.min || 0);
  const max = Number(el.max || 100);
  return max > min ? ((Number(el.value) - min) / (max - min)) * 100 : 0;
}

/**
 * Range slider with the "charged track" look. WebKit has no native progress
 * pseudo, so the filled portion is driven by a `--value` (0–100) custom
 * property: we set it from the value/min/max props and keep it live on input.
 * Firefox fills on its own via `::-moz-range-progress`.
 *
 * With a `label`/`valueLabel`, renders the `.slider` wrapper with a
 * `.slider-head` row; otherwise renders a bare `.slider` input.
 *
 * Pair with `import '@starlove/ui/components/slider';`.
 */
export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  function Slider(
    { size = 'md', label, valueLabel, className, disabled, style, onInput, min, max, ...rest },
    ref,
  ) {
    const raw = rest.value ?? rest.defaultValue;
    const lo = Number(min ?? 0);
    const hi = Number(max ?? 100);
    const pct =
      raw != null && hi > lo ? ((Number(raw) - lo) / (hi - lo)) * 100 : undefined;
    const mergedStyle =
      pct != null ? ({ ...style, '--value': pct } as React.CSSProperties) : style;

    const handleInput: React.InputEventHandler<HTMLInputElement> = (e) => {
      e.currentTarget.style.setProperty('--value', String(fillPercent(e.currentTarget)));
      onInput?.(e);
    };

    const hasHead = label != null || valueLabel != null;
    const input = (
      <input
        ref={ref}
        type="range"
        className={hasHead ? undefined : cx('slider', className)}
        disabled={disabled}
        min={min}
        max={max}
        style={mergedStyle}
        onInput={handleInput}
        {...rest}
      />
    );

    if (!hasHead) return input;

    return (
      <div
        className={cx('slider', className)}
        data-size={size === 'md' ? undefined : size}
        data-disabled={disabled ? '' : undefined}
      >
        <span className="slider-head">
          <b>{label}</b>
          <b>{valueLabel}</b>
        </span>
        {input}
      </div>
    );
  },
);
