import * as React from 'react';
import { cx } from './cx';

export interface RatingProps {
  /** Current rating, 1..max. Use 0 for unrated. */
  value: number;
  /** Interactive when provided; omit (or set readOnly) for display-only. */
  onChange?: (value: number) => void;
  max?: number;
  readOnly?: boolean;
  /** Radio group name — required when interactive so the inputs group. */
  name?: string;
  'aria-label'?: string;
  className?: string;
}

/**
 * Star rating built on a radio group. Interactive when `onChange` is passed;
 * otherwise renders the read-only display form (`data-readonly` + `data-value`,
 * no inputs, per the CSS).
 *
 * Pair with `import '@starlove/ui/components/rating';`.
 */
export function Rating({
  value,
  onChange,
  max = 5,
  readOnly,
  name,
  className,
  'aria-label': ariaLabel = 'Rating',
}: RatingProps) {
  const interactive = !!onChange && !readOnly;
  const groupName = React.useId();

  if (!interactive) {
    return (
      <div
        className={cx('rating', className)}
        data-readonly=""
        data-value={value}
        role="img"
        aria-label={`${value} of ${max}`}
      />
    );
  }

  // High → low DOM order so the CSS sibling-fill works.
  const stars = Array.from({ length: max }, (_, i) => max - i);
  return (
    <fieldset className={cx('rating', className)} aria-label={ariaLabel}>
      {stars.map((star) => {
        const id = `${groupName}-${star}`;
        return (
          <React.Fragment key={star}>
            <input
              type="radio"
              name={name ?? groupName}
              id={id}
              value={star}
              checked={value === star}
              onChange={() => onChange!(star)}
            />
            <label htmlFor={id} title={`${star}`}>
              {star} {star === 1 ? 'star' : 'stars'}
            </label>
          </React.Fragment>
        );
      })}
    </fieldset>
  );
}
