import * as React from 'react';
import { cx } from './cx';

export interface CodeSnippetProps
  extends React.HTMLAttributes<HTMLPreElement> {
  /** Snippet text (or pass children). */
  code?: string;
  /** Lower max-height for short commands. */
  compact?: boolean;
}

/** Bare dark code snippet (`.code-snippet`), no terminal chrome. */
export const CodeSnippet = React.forwardRef<HTMLPreElement, CodeSnippetProps>(
  function CodeSnippet({ code, compact, className, children, ...rest }, ref) {
    return (
      <pre
        ref={ref}
        className={cx('code-snippet', compact && 'code-snippet--compact', className)}
        {...rest}
      >
        {code ?? children}
      </pre>
    );
  },
);

export interface TerminalProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Show the macOS traffic-light title bar (default true). */
  bar?: boolean;
  /** Snippet text (or pass children). */
  code?: string;
  compact?: boolean;
}

/**
 * Terminal shell for code snippets — a dark snippet surface with an optional
 * traffic-light title bar. Always dark, like a real terminal.
 *
 * Pair with `import '@starlove/ui/components/terminal';`.
 */
export const Terminal = React.forwardRef<HTMLDivElement, TerminalProps>(
  function Terminal({ bar = true, code, compact, className, children, ...rest }, ref) {
    return (
      <div ref={ref} className={cx('terminal', className)} {...rest}>
        {bar && (
          <div className="terminal-bar" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        )}
        <pre className={cx('code-snippet', compact && 'code-snippet--compact')}>
          {code ?? children}
        </pre>
      </div>
    );
  },
);
