import * as React from 'react';
import { cx } from './cx';

export interface BreadcrumbItem {
  label: React.ReactNode;
  href?: string;
  /** Marks the current page (rendered muted, non-link). Defaults to the last item. */
  current?: boolean;
}

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
}

/**
 * Breadcrumb trail. Separators are CSS-generated. The last item (or any with
 * `current`) renders muted and non-linked.
 *
 * Pair with `import '@starlove/ui/components/breadcrumb';`.
 */
export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  function Breadcrumb({ items, className, ...rest }, ref) {
    return (
      <nav
        ref={ref}
        aria-label="Breadcrumb"
        className={cx('breadcrumb', className)}
        {...rest}
      >
        <ol>
          {items.map((item, i) => {
            const current = item.current ?? i === items.length - 1;
            return (
              <li key={i}>
                {current || !item.href ? (
                  <span aria-current={current ? 'page' : undefined}>{item.label}</span>
                ) : (
                  <a href={item.href}>{item.label}</a>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  },
);
