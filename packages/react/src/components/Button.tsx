import * as React from 'react';

/**
 * Built-in button variants. The CSS styles the bare `<button>` element as the
 * primary recipe, so `variant` is omitted for primary and maps to the
 * `data-variant` attribute form (the React-friendly form the CSS exposes) for
 * the rest.
 *
 * Pair with `import '@starlove/ui/components/button';`.
 */
export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'cta'
  | 'command'
  | 'plus';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual recipe. Defaults to `primary` (the bare-element style — no attribute emitted). */
  variant?: ButtonVariant;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ variant = 'primary', type = 'button', ...rest }, ref) {
    return (
      <button
        ref={ref}
        type={type}
        data-variant={variant === 'primary' ? undefined : variant}
        {...rest}
      />
    );
  },
);
