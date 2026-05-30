import * as React from 'react';
import { cx } from './cx';

export interface EmptyStateProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Decorative glyph/illustration. */
  icon?: React.ReactNode;
  title?: React.ReactNode;
  /** Action buttons row. */
  actions?: React.ReactNode;
  /** `sm` fits inside a card/lane; `lg` is a full-page hero. */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * The "nothing here yet" surface: icon + title + body + actions.
 *
 * Pair with `import '@starlove/ui/components/empty-state';`.
 */
export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  function EmptyState(
    { icon, title, actions, size = 'md', className, children, ...rest },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={cx('empty-state', className)}
        data-size={size === 'md' ? undefined : size}
        {...rest}
      >
        {icon != null && (
          <div className="empty-state-icon" aria-hidden="true">
            {icon}
          </div>
        )}
        {title != null && <h3 className="empty-state-title">{title}</h3>}
        {children != null && <p className="empty-state-body">{children}</p>}
        {actions != null && <div className="empty-state-actions">{actions}</div>}
      </div>
    );
  },
);
