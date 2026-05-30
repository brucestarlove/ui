import * as React from 'react';
import { cx } from './cx';

/**
 * Form fields. The CSS styles bare `<input>`, `<select>`, `<textarea>` and
 * `<label>`, so these wrappers mostly exist to forward refs/props and add the
 * opt-in pieces (select chevron, search affordance, layout helpers).
 *
 * Pair with `import '@starlove/ui/components/input';`.
 */

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input(props, ref) {
    return <input ref={ref} {...props} />;
  },
);

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(props, ref) {
    return <textarea ref={ref} {...props} />;
  },
);

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /** Custom caret glyph (`.select-chevron-field`). On by default. */
  chevron?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  function Select({ chevron = true, className, ...rest }, ref) {
    return (
      <select
        ref={ref}
        className={cx(chevron && 'select-chevron-field', className)}
        {...rest}
      />
    );
  },
);

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  function Label(props, ref) {
    return <label ref={ref} {...props} />;
  },
);

/** Vertical label + field + help/error stack (`.form-row`). */
export const FormRow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function FormRow({ className, ...rest }, ref) {
  return <div ref={ref} className={cx('form-row', className)} {...rest} />;
});

/** Muted helper text under a field (`.form-help`). */
export const FormHelp = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(function FormHelp({ className, ...rest }, ref) {
  return <p ref={ref} className={cx('form-help', className)} {...rest} />;
});

/** Danger-toned validation text (`.form-error`). */
export const FormError = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(function FormError({ className, role = 'alert', ...rest }, ref) {
  return (
    <p ref={ref} role={role} className={cx('form-error', className)} {...rest} />
  );
});

export interface SearchInputProps extends InputProps {
  /** Renders the clear button and calls this when pressed. */
  onClear?: () => void;
  /** Accessible label for the clear button. */
  clearLabel?: string;
}

/**
 * Search field with the magnifier glyph + optional clear button. Controlled —
 * the clear button shows when `value` is non-empty (the CSS also reveals it via
 * `:not(:placeholder-shown)` for uncontrolled use).
 */
export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput(
    { onClear, clearLabel = 'Clear', className, value, type = 'search', ...rest },
    ref,
  ) {
    const hasValue = value != null && value !== '';
    return (
      <div className={cx('input-search', className)}>
        <input ref={ref} type={type} value={value} {...rest} />
        {onClear && (
          <button
            type="button"
            className="input-search-clear"
            aria-label={clearLabel}
            data-has-value={hasValue ? 'true' : undefined}
            onClick={onClear}
          >
            ×
          </button>
        )}
      </div>
    );
  },
);
