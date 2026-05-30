import * as React from 'react';
import { cx } from './cx';

export interface ProseProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * `markdown` styles rendered-markdown block elements; `preserved` keeps
   * literal whitespace in a monospace block (logs, plans, pasted output).
   */
  variant?: 'markdown' | 'preserved';
  /** Pre-rendered HTML (e.g. from a markdown renderer) to inject. */
  html?: string;
}

/**
 * Prose container for rendered markdown or preserved text.
 *
 * Pass `html` for renderer output, or `children` for JSX you control.
 * `preserved` renders a `<pre>`; `markdown` renders a `<div>`.
 *
 * Pair with `import '@starlove/ui/components/prose';`.
 */
export const Prose = React.forwardRef<HTMLElement, ProseProps>(function Prose(
  { variant = 'markdown', html, className, children, ...rest },
  ref,
) {
  const Tag = (variant === 'preserved' ? 'pre' : 'div') as 'pre' | 'div';
  const cls = cx(
    variant === 'preserved' ? 'preserved-text-body' : 'markdown-body',
    className,
  );
  const htmlProps = html != null ? { dangerouslySetInnerHTML: { __html: html } } : {};
  return (
    <Tag
      ref={ref as React.Ref<HTMLPreElement & HTMLDivElement>}
      className={cls}
      {...htmlProps}
      {...rest}
    >
      {html != null ? undefined : children}
    </Tag>
  );
});
