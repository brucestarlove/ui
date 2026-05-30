import * as React from 'react';
import { cx } from './cx';
import { useClickOutside } from '../useClickOutside';
import { useEscapeKey } from '../useEscapeKey';
import type { ContextMenu as ContextMenuState } from '../useContextMenu';

export interface ContextMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  /** State from `useContextMenu()`. */
  menu: ContextMenuState;
}

/**
 * Right-click menu surface. Drive it with `useContextMenu()` and spread the
 * resulting state via `menu`. Renders nothing until open, positions itself at
 * the cursor, and wires Escape + outside-click dismissal for you.
 *
 *   const menu = useContextMenu();
 *   <div onContextMenu={menu.onContextMenu}>…</div>
 *   <ContextMenu menu={menu}>
 *     <ContextMenuItem onClick={rename}>Rename</ContextMenuItem>
 *     <ContextMenuSeparator />
 *     <ContextMenuItem danger onClick={remove}>Delete</ContextMenuItem>
 *   </ContextMenu>
 *
 * Pair with `import '@starlove/ui/components/context-menu';`.
 */
export const ContextMenu = React.forwardRef<HTMLDivElement, ContextMenuProps>(
  function ContextMenu({ menu, className, children, ...rest }, ref) {
    const innerRef = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(ref, () => innerRef.current as HTMLDivElement);

    useEscapeKey(menu.close, { enabled: menu.isOpen });
    useClickOutside(innerRef, menu.close, { enabled: menu.isOpen });

    if (!menu.isOpen) return null;
    return (
      <div
        ref={innerRef}
        role="menu"
        className={cx('context-menu', className)}
        {...menu.menuProps}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

export interface ContextMenuItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  danger?: boolean;
}

export const ContextMenuItem = React.forwardRef<
  HTMLButtonElement,
  ContextMenuItemProps
>(function ContextMenuItem({ danger, className, type = 'button', ...rest }, ref) {
  return (
    <button
      ref={ref}
      type={type}
      role="menuitem"
      className={cx('flyout-item', className)}
      data-danger={danger ? '' : undefined}
      {...rest}
    />
  );
});

export const ContextMenuSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function ContextMenuSeparator({ className, ...rest }, ref) {
  return (
    <div
      ref={ref}
      role="separator"
      className={cx('flyout-separator', className)}
      {...rest}
    />
  );
});
