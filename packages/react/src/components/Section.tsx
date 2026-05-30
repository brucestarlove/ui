import * as React from 'react';
import { cx } from './cx';

export interface SectionProps
  extends Omit<React.DetailsHTMLAttributes<HTMLDetailsElement>, 'title'> {
  title: React.ReactNode;
  /** Gradient badge shown beside the title (the "MCP"-style mark). */
  mark?: React.ReactNode;
  /** `lg` renders the larger square hero mark. */
  markSize?: 'sm' | 'lg';
  /** Collapsible disclosure (default) vs a plain static block. */
  collapsible?: boolean;
}

/**
 * Badge accordion — a flat collapsible section whose header carries an optional
 * gradient badge ("mark") and a rotating chevron. Built on native `<details>`.
 * Set `collapsible={false}` for a plain titled section block.
 *
 * Pair with `import '@starlove/ui/components/section';`.
 */
export const Section = React.forwardRef<HTMLElement, SectionProps>(
  function Section(
    { title, mark, markSize = 'sm', collapsible = true, className, children, open, ...rest },
    ref,
  ) {
    const markEl =
      mark != null ? (
        <span className={cx('section-mark', markSize === 'lg' && 'section-mark--lg')}>
          {mark}
        </span>
      ) : null;

    if (!collapsible) {
      return (
        <section
          ref={ref as React.Ref<HTMLElement>}
          className={cx('section', className)}
        >
          <div className="section-title-row">
            {markEl}
            <h3>{title}</h3>
          </div>
          {children}
        </section>
      );
    }

    return (
      <details
        ref={ref as React.Ref<HTMLDetailsElement>}
        className={cx('section', className)}
        open={open}
        {...rest}
      >
        <summary>
          <span className="section-title-row">
            {markEl}
            <h3>{title}</h3>
          </span>
        </summary>
        {children}
      </details>
    );
  },
);
