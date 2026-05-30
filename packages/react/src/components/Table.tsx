import * as React from 'react';
import { cx } from './cx';

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  /** Striped body rows. */
  zebra?: boolean;
  /** Tighter cell padding. */
  density?: 'comfortable' | 'compact';
  /** Wrapper class for the horizontal-scroll container. */
  wrapClassName?: string;
}

/**
 * Data table. Renders the `.table-wrap` scroll container around `.table`. Use
 * native `<thead>/<tbody>/<th>/<td>` inside; mark cells with `data-numeric` for
 * right-aligned tabular figures and `<th data-sortable aria-sort="…">` for sort
 * affordances.
 *
 * Pair with `import '@starlove/ui/components/table';`.
 */
export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  function Table({ zebra, density = 'comfortable', wrapClassName, className, children, ...rest }, ref) {
    return (
      <div className={cx('table-wrap', 'scroll-themed', wrapClassName)}>
        <table
          ref={ref}
          className={cx('table', className)}
          data-zebra={zebra ? '' : undefined}
          data-density={density === 'compact' ? 'compact' : undefined}
          {...rest}
        >
          {children}
        </table>
      </div>
    );
  },
);
