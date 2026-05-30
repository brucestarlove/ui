import * as React from 'react';
import { cx } from './cx';

export interface LaneProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  title?: React.ReactNode;
  /** Count chip shown in the head. */
  count?: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Head actions (buttons) shown at the end of the header row. */
  actions?: React.ReactNode;
  /** Drop the translucent panel chrome. */
  flat?: boolean;
  /** Make the body scroll within a fixed height. */
  scrollable?: boolean;
  /** Extra class on the `.lane-body` element. */
  bodyClassName?: string;
}

/**
 * Section panel — a generalized kanban column: sticky head + scrollable body.
 * Pass `title`/`count`/`subtitle`/`actions` for the header; children fill the
 * body. Wrap several in a `.lane-grid` (see `LaneGrid`).
 *
 * Pair with `import '@starlove/ui/components/lane';`.
 */
export const Lane = React.forwardRef<HTMLElement, LaneProps>(function Lane(
  { title, count, subtitle, actions, flat, scrollable, bodyClassName, className, children, ...rest },
  ref,
) {
  const hasHead = title != null || count != null || subtitle != null || actions != null;
  return (
    <section
      ref={ref}
      className={cx('lane', className)}
      data-flat={flat ? '' : undefined}
      data-scrollable={scrollable ? '' : undefined}
      {...rest}
    >
      {hasHead && (
        <header className="lane-head">
          {title != null && <h3 className="lane-title">{title}</h3>}
          {subtitle != null && <span className="lane-subtitle">{subtitle}</span>}
          {count != null && <span className="count">{count}</span>}
          {actions != null && <div className="lane-actions">{actions}</div>}
        </header>
      )}
      <div className={cx('lane-body', bodyClassName)}>{children}</div>
    </section>
  );
});

/** Multi-column layout wrapper for lanes (`.lane-grid`). */
export const LaneGrid = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function LaneGrid({ className, ...rest }, ref) {
  return <div ref={ref} className={cx('lane-grid', className)} {...rest} />;
});
