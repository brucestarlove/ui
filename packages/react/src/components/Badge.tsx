import * as React from 'react';
import { cx } from './cx';

/** Badge/chip tones. Maps to the `data-tone` attribute the CSS keys off. */
export type BadgeTone = 'accent' | 'success' | 'warning' | 'danger';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  /** `.chip` shares the badge base; set this for the chip alias. */
  chip?: boolean;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  function Badge({ tone, chip, className, ...rest }, ref) {
    return (
      <span
        ref={ref}
        className={cx(chip ? 'chip' : 'badge', className)}
        data-tone={tone}
        {...rest}
      />
    );
  },
);
