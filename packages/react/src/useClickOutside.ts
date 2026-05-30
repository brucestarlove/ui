import { useEffect, type RefObject } from 'react';

export interface ClickOutsideOptions {
  /** Skip listener attachment entirely when false — useful for closed surfaces. */
  enabled?: boolean;
  /** Mouse event to listen for. `mousedown` fires before focus-blur, which is
   *  the right time to close a flyout. Use `click` if you need the dismiss to
   *  wait for a complete press-release on the page. */
  event?: 'mousedown' | 'click' | 'pointerdown';
}

/**
 * Fires the handler when a pointer event lands outside the referenced element.
 *
 *   const ref = useRef<HTMLDivElement>(null);
 *   const flyout = useDisclosure();
 *   useClickOutside(ref, flyout.close, { enabled: flyout.isOpen });
 *
 * Listener is added/removed in step with `enabled` so closed surfaces don't
 * pay for an idle global listener. Default event is `mousedown` — that fires
 * before any click on the trigger button can re-open the flyout.
 */
export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  handler: (event: MouseEvent | PointerEvent) => void,
  { enabled = true, event = 'mousedown' }: ClickOutsideOptions = {},
): void {
  useEffect(() => {
    if (!enabled || typeof document === 'undefined') return;

    const onDoc = (e: MouseEvent | PointerEvent) => {
      const node = ref.current;
      if (!node) return;
      if (node.contains(e.target as Node)) return;
      handler(e);
    };

    document.addEventListener(event, onDoc as EventListener);
    return () => document.removeEventListener(event, onDoc as EventListener);
  }, [ref, handler, enabled, event]);
}
