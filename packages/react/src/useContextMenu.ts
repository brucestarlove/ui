import {
  useCallback,
  useMemo,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
} from 'react';

export interface ContextMenu {
  isOpen: boolean;
  /** Viewport coords of the last open request. */
  position: { x: number; y: number };
  /** Spread onto the element that should own the right-click menu. */
  onContextMenu: (event: ReactMouseEvent) => void;
  open: (x: number, y: number) => void;
  close: () => void;
  /** Spread onto the .context-menu surface — fixed-positioned at the cursor. */
  menuProps: { style: CSSProperties };
}

export interface ContextMenuOptions {
  /** Estimated menu size, used to keep the menu inside the viewport. */
  size?: { width: number; height: number };
}

/**
 * Right-click menu state for the .context-menu component. Captures the
 * contextmenu event, stores the cursor position, and hands back fixed-position
 * styles clamped to the viewport.
 *
 *   const menu = useContextMenu();
 *   const ref = useRef<HTMLDivElement>(null);
 *   useClickOutside(ref, menu.close, { enabled: menu.isOpen });
 *   useEscapeKey(menu.close, { enabled: menu.isOpen });
 *
 *   <div onContextMenu={menu.onContextMenu}>right-click me</div>
 *   {menu.isOpen && (
 *     <div ref={ref} className="context-menu" role="menu" {...menu.menuProps}>…</div>
 *   )}
 *
 * Pair with useClickOutside + useEscapeKey for dismissal (same primitives the
 * flyout/modal use).
 */
export function useContextMenu({
  size = { width: 192, height: 220 },
}: ContextMenuOptions = {}): ContextMenu {
  const [isOpen, setOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const open = useCallback((x: number, y: number) => {
    setPosition({ x, y });
    setOpen(true);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  const onContextMenu = useCallback(
    (event: ReactMouseEvent) => {
      event.preventDefault();
      open(event.clientX, event.clientY);
    },
    [open],
  );

  const menuProps = useMemo(() => {
    const vw = typeof window === 'undefined' ? size.width : window.innerWidth;
    const vh = typeof window === 'undefined' ? size.height : window.innerHeight;
    const x = Math.max(8, Math.min(position.x, vw - size.width - 8));
    const y = Math.max(8, Math.min(position.y, vh - size.height - 8));
    return { style: { left: x, top: y } satisfies CSSProperties };
  }, [position, size.width, size.height]);

  return useMemo(
    () => ({ isOpen, position, onContextMenu, open, close, menuProps }),
    [isOpen, position, onContextMenu, open, close, menuProps],
  );
}
