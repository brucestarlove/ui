import * as React from 'react';
import { cx } from './cx';

export interface PaginationProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> {
  /** Current page (1-based). */
  page: number;
  /** Total number of pages. */
  count: number;
  onChange: (page: number) => void;
  /** How many numbered siblings to show around the current page. */
  siblings?: number;
  size?: 'sm' | 'md';
}

type PageEntry = number | 'gap';

function buildRange(page: number, count: number, siblings: number): PageEntry[] {
  const range: PageEntry[] = [];
  const first = 1;
  const last = count;
  const start = Math.max(first, page - siblings);
  const end = Math.min(last, page + siblings);

  range.push(first);
  if (start > first + 1) range.push('gap');
  for (let p = start; p <= end; p++) {
    if (p !== first && p !== last) range.push(p);
  }
  if (end < last - 1) range.push('gap');
  if (last !== first) range.push(last);
  return range;
}

/**
 * Pagination control. Renders Prev/Next nav buttons plus numbered items with
 * collapsing gaps. Controlled — you own `page`.
 *
 * Pair with `import '@starlove/ui/components/pagination';`.
 */
export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  function Pagination(
    { page, count, onChange, siblings = 1, size = 'md', className, ...rest },
    ref,
  ) {
    const entries = buildRange(page, count, siblings);
    return (
      <nav
        ref={ref}
        aria-label="Pagination"
        className={cx('pagination', className)}
        data-size={size === 'md' ? undefined : size}
        {...rest}
      >
        <button
          type="button"
          className="pagination-item"
          data-nav=""
          disabled={page <= 1}
          aria-label="Previous page"
          onClick={() => onChange(page - 1)}
        >
          ‹ Prev
        </button>
        {entries.map((entry, i) =>
          entry === 'gap' ? (
            <span className="pagination-gap" key={`gap-${i}`}>
              …
            </span>
          ) : (
            <button
              type="button"
              className="pagination-item"
              key={entry}
              aria-current={entry === page ? 'page' : undefined}
              onClick={() => onChange(entry)}
            >
              {entry}
            </button>
          ),
        )}
        <button
          type="button"
          className="pagination-item"
          data-nav=""
          disabled={page >= count}
          aria-label="Next page"
          onClick={() => onChange(page + 1)}
        >
          Next ›
        </button>
      </nav>
    );
  },
);
