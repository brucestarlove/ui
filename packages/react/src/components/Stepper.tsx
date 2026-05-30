import * as React from 'react';
import { cx } from './cx';

export type StepState = 'done' | 'current' | 'upcoming';

export interface StepItem {
  label: React.ReactNode;
  /** Override the dot content (defaults to the 1-based index). */
  dot?: React.ReactNode;
}

export interface StepperProps extends React.HTMLAttributes<HTMLOListElement> {
  steps: StepItem[];
  /** Index of the current step. Earlier steps are `done`, later are `upcoming`. */
  active: number;
  orientation?: 'horizontal' | 'vertical';
}

function stateFor(index: number, active: number): StepState {
  if (index < active) return 'done';
  if (index === active) return 'current';
  return 'upcoming';
}

/**
 * Step progress indicator. Pass `steps` and the `active` index; states are
 * derived. Drive `active` with the `useStepper` hook for wizard flows.
 *
 * Pair with `import '@starlove/ui/components/stepper';`.
 */
export const Stepper = React.forwardRef<HTMLOListElement, StepperProps>(
  function Stepper({ steps, active, orientation = 'horizontal', className, ...rest }, ref) {
    return (
      <ol
        ref={ref}
        className={cx('stepper', className)}
        data-orientation={orientation === 'horizontal' ? undefined : orientation}
        {...rest}
      >
        {steps.map((step, i) => (
          <li className="step" key={i} data-state={stateFor(i, active)}>
            <span className="step-dot">{step.dot ?? i + 1}</span>
            <span className="step-label">{step.label}</span>
          </li>
        ))}
      </ol>
    );
  },
);
