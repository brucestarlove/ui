import * as React from 'react';
import { cx } from './cx';
import { Starscape } from '../Starscape';

export interface PageShellProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Sticky top bar — pass a `<Topbar>` (or any node). */
  topbar?: React.ReactNode;
  /** Mount the animated `<Starscape>` background behind the content. */
  background?: boolean;
  /**
   * Framed-board layout (the ss-orbit / ss-nebula shell): lock the viewport,
   * keep the topbar static, and wrap content in an Orbit-style framed `.page-shell-board`
   * that fills the space between rail and footer and scrolls internally.
   */
  board?: boolean;
  /** Rendered after `<main>` — handy for a `<Toaster>` or page footer. */
  footer?: React.ReactNode;
  /** Extra class on the inner `.page-shell-board` (board mode only). */
  boardClassName?: string;
  /** Render the "skip to content" link (default true). */
  skipLink?: boolean;
  /** Visible label for the skip link. */
  skipLinkLabel?: React.ReactNode;
  /** `id` of the `<main>` region (and skip-link target). Default `"main"`. */
  mainId?: string;
  /** Extra class on the inner `<main>`. */
  mainClassName?: string;
}

/**
 * `shell` page template — the single-column app shell from the preview app:
 * optional Starscape background, a fixed topbar slot, a scrollable content
 * region, and a trailing slot (toaster/footer).
 *
 * ```tsx
 * <PageShell background topbar={<Topbar>…</Topbar>} footer={<Toaster />}>
 *   …content…
 * </PageShell>
 * ```
 *
 * Pair with `import '@starlove/ui/templates/shell';` (or the kitchen-sink).
 */
export const PageShell = React.forwardRef<HTMLDivElement, PageShellProps>(
  function PageShell(
    {
      topbar,
      background = false,
      board = false,
      footer,
      skipLink = true,
      skipLinkLabel = 'Skip to content',
      mainId = 'main',
      mainClassName,
      boardClassName,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={cx('page-shell', className)}
        data-no-topbar={topbar == null ? '' : undefined}
        data-board={board ? '' : undefined}
        {...rest}
      >
        {skipLink && (
          <a className="skip-link" href={`#${mainId}`}>
            {skipLinkLabel}
          </a>
        )}
        {background && <Starscape />}
        {topbar}
        <main id={mainId} tabIndex={-1} className={cx('page-shell-main', mainClassName)}>
          {board ? (
            <div className={cx('page-shell-board', boardClassName)}>{children}</div>
          ) : (
            children
          )}
        </main>
        {footer}
      </div>
    );
  },
);
