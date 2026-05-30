import * as React from 'react';
import { cx } from './cx';

/** Type-coded card bezels. Maps to the `data-variant` form the CSS exposes. */
export type CardVariant = 'epic' | 'feature' | 'task' | 'bug';

export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  /** Type bezel. Omit for the plain card. */
  variant?: CardVariant;
  /** Selected ring (`.card[data-selected]`). */
  selected?: boolean;
  /** Render element — defaults to `<article>`. */
  as?: React.ElementType;
}

export const Card = React.forwardRef<HTMLElement, CardProps>(function Card(
  { variant, selected, as: Tag = 'article', className, ...rest },
  ref,
) {
  return (
    <Tag
      ref={ref}
      className={cx('card', className)}
      data-variant={variant}
      data-selected={selected ? '' : undefined}
      {...rest}
    />
  );
});
