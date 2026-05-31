import * as React from 'react';
import { cx } from './cx';

export interface EpicAccordionProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'title' | 'onToggle'> {
  /** Head label (uppercased by the styling). */
  title: React.ReactNode;
  /** Optional count badge shown after the title. */
  count?: React.ReactNode;
  /** Initial open state when uncontrolled. Defaults to closed. */
  defaultOpen?: boolean;
  /** Controlled open state. Pass with `onToggle` to drive it yourself. */
  open?: boolean;
  /** Fires with the next open state on toggle. */
  onToggle?: (open: boolean) => void;
  /** State label when collapsed / expanded. */
  showLabel?: string;
  hideLabel?: string;
}

/**
 * Epic accordion — the ARC-grade disclosure panel (see epic-accordion.css).
 * The whole head is a button (so it inherits the shared ARC sweep ring), with
 * an uppercase title, optional count badge, a Show/Hide label, and a chevron
 * that rotates on open.
 *
 * Performance: the children are mounted ONLY while open, so a heavy panel costs
 * nothing collapsed — close it and its contents (and their animations) leave
 * the DOM entirely.
 *
 *   <EpicAccordion title="ARC lab" count={10}>
 *     …heavy content…
 *   </EpicAccordion>
 *
 * Uncontrolled by default (`defaultOpen`); pass `open` + `onToggle` to control.
 */
export const EpicAccordion = React.forwardRef<HTMLElement, EpicAccordionProps>(
  function EpicAccordion(
    {
      title,
      count,
      defaultOpen = false,
      open: openProp,
      onToggle,
      showLabel = 'Show',
      hideLabel = 'Hide',
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
    const isControlled = openProp != null;
    const open = isControlled ? openProp : internalOpen;
    const bodyId = React.useId();

    const handleToggle = () => {
      if (!isControlled) setInternalOpen(o => !o);
      onToggle?.(!open);
    };

    return (
      <section
        ref={ref}
        className={cx('epic-accordion', className)}
        data-open={open || undefined}
        {...rest}
      >
        <button
          type="button"
          className="epic-accordion-toggle"
          aria-expanded={open}
          aria-controls={bodyId}
          onClick={handleToggle}
        >
          <svg className="epic-accordion-chevron" viewBox="0 0 24 24" aria-hidden>
            <path
              d="M9 6l6 6-6 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="epic-accordion-title">{title}</span>
          {count != null && <span className="epic-accordion-count">{count}</span>}
          <span className="epic-accordion-state">{open ? hideLabel : showLabel}</span>
        </button>
        {open && (
          <div className="epic-accordion-body" id={bodyId}>
            {children}
          </div>
        )}
      </section>
    );
  },
);
