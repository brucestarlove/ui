import { useEffect } from 'react';

export interface EscapeKeyOptions {
  /** Skip listener attachment entirely when false. */
  enabled?: boolean;
}

/**
 * Fires the handler when the Escape key is pressed.
 *
 *   const modal = useDisclosure();
 *   useEscapeKey(modal.close, { enabled: modal.isOpen });
 *
 * Attached at the document level so it works regardless of focus position.
 * If multiple surfaces are open at once, all of their handlers fire — order
 * by stacking context (the topmost surface should close first; once closed,
 * its `enabled` flips to false and the next layer's handler runs on the next
 * Escape press).
 */
export function useEscapeKey(
  handler: (event: KeyboardEvent) => void,
  { enabled = true }: EscapeKeyOptions = {},
): void {
  useEffect(() => {
    if (!enabled || typeof document === 'undefined') return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handler(e);
    };

    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [handler, enabled]);
}
