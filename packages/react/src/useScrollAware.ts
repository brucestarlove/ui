import { useEffect } from 'react';

/**
 * Toggles a class on document.body whenever window.scrollY crosses a
 * threshold. Pairs with the .topbar component in @starlove/ui,
 * which lights up its glass background once `body.is-scrolled` is set.
 *
 * Defaults match the landing site exactly: 4px threshold, "is-scrolled"
 * class. Both are tunable.
 *
 *   useScrollAware();                  // body.is-scrolled when scroll > 4
 *   useScrollAware({ threshold: 80 }); // tweak the trigger
 *   useScrollAware({ className: 'has-scrolled' });
 */
export function useScrollAware({
  threshold = 4,
  className = 'is-scrolled',
}: { threshold?: number; className?: string } = {}): void {
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const update = () => {
      document.body.classList.toggle(className, window.scrollY > threshold);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => {
      window.removeEventListener('scroll', update);
      document.body.classList.remove(className);
    };
  }, [threshold, className]);
}
