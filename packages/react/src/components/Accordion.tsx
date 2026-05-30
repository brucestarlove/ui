import * as React from 'react';
import { cx } from './cx';

export interface AccordionProps
  extends React.DetailsHTMLAttributes<HTMLDetailsElement> {
  /** Summary/trigger label. */
  summary: React.ReactNode;
}

/**
 * Disclosure built on native `<details>/<summary>` — zero JS, keyboard- and
 * screen-reader-friendly out of the box. The marker is replaced with a rotating
 * chevron. Use `open`/`onToggle` for controlled behavior if needed.
 *
 * Pair with `import '@starlove/ui/components/accordion';`.
 */
export const Accordion = React.forwardRef<HTMLDetailsElement, AccordionProps>(
  function Accordion({ summary, className, children, ...rest }, ref) {
    return (
      <details ref={ref} className={cx('accordion', className)} {...rest}>
        <summary>{summary}</summary>
        <div className="accordion-body">{children}</div>
      </details>
    );
  },
);

/** Stacks accordions with shared borders (`.accordion-group`). */
export const AccordionGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function AccordionGroup({ className, ...rest }, ref) {
  return <div ref={ref} className={cx('accordion-group', className)} {...rest} />;
});
