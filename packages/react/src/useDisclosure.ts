import { useCallback, useId, useMemo, useState } from 'react';

export interface DisclosureProps {
  /** Stable id for aria-controls / labelledby wiring. */
  id: string;
  /** ARIA boolean — flips with isOpen. */
  'aria-expanded': boolean;
  /** Helper for trigger buttons that need to point at the controlled surface. */
  'aria-controls': string;
}

export interface Disclosure {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  /** Spread these onto the trigger element (button). */
  triggerProps: DisclosureProps;
  /** Spread onto the controlled surface (id matches aria-controls). */
  surfaceProps: { id: string; 'aria-hidden': boolean };
}

/**
 * Disclosure state primitive — the open/close half of every modal, drawer,
 * flyout, accordion, popover. Returns the boolean state, three setters
 * (open / close / toggle), and a pair of pre-baked prop bags so trigger and
 * surface stay aria-wired without ceremony.
 *
 *   const settings = useDisclosure();
 *   <button onClick={settings.toggle} {...settings.triggerProps}>Settings</button>
 *   <div className={`drawer ${settings.isOpen ? 'is-open' : ''}`} {...settings.surfaceProps}>…</div>
 *
 * Pair with useClickOutside + useEscapeKey for full dismiss behavior.
 */
export function useDisclosure(initialOpen = false): Disclosure {
  const [isOpen, setOpen] = useState(initialOpen);
  const id = useId();

  const open = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen(o => !o), []);

  const triggerProps = useMemo<DisclosureProps>(() => ({
    id: `${id}-trigger`,
    'aria-expanded': isOpen,
    'aria-controls': id,
  }), [id, isOpen]);

  const surfaceProps = useMemo(() => ({
    id,
    'aria-hidden': !isOpen,
  }), [id, isOpen]);

  return { isOpen, open, close, toggle, triggerProps, surfaceProps };
}
