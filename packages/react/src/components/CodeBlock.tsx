import * as React from 'react';
import { cx } from './cx';

export interface CodeBlockProps extends React.HTMLAttributes<HTMLElement> {
  /** Filename/label shown in the header. Omit to hide the header. */
  name?: React.ReactNode;
  /** Code as a string (rendered inside `<pre><code>`); or pass children. */
  code?: string;
  /** Gutter line numbers. */
  numbered?: boolean;
  /** Soft-wrap long lines instead of horizontal scroll. */
  wrap?: boolean;
  /** Shows a Copy button when provided (or defaults to copying `code`). */
  onCopy?: () => void;
  copyLabel?: string;
}

/**
 * Code block with optional filename header + copy button. With no `onCopy` but
 * a `code` string, the Copy button writes it to the clipboard.
 *
 * Pair with `import '@starlove/ui/components/code-block';`.
 */
export const CodeBlock = React.forwardRef<HTMLElement, CodeBlockProps>(
  function CodeBlock(
    { name, code, numbered, wrap, onCopy, copyLabel = 'Copy', className, children, ...rest },
    ref,
  ) {
    const showHeader = name != null || onCopy || code != null;
    const handleCopy =
      onCopy ?? (code != null ? () => navigator.clipboard?.writeText(code) : undefined);

    return (
      <figure ref={ref} className={cx('code-block', className)} {...rest}>
        {showHeader && (
          <figcaption className="code-block-head">
            {name != null && <span className="code-block-name">{name}</span>}
            {handleCopy && (
              <button type="button" className="code-block-copy" onClick={handleCopy}>
                {copyLabel}
              </button>
            )}
          </figcaption>
        )}
        <pre
          className="scroll-themed"
          data-numbered={numbered ? '' : undefined}
          data-wrap={wrap ? '' : undefined}
        >
          <code>{code ?? children}</code>
        </pre>
      </figure>
    );
  },
);
