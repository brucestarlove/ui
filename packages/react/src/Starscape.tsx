import { useEffect, useRef } from 'react';
import {
  startStarscape,
  type StarscapeOptions,
} from '@starlove/ui/starscape';

type StarscapeProps = Omit<StarscapeOptions, 'mountTo'>;

/**
 * Mounts the kanban-app dark-mode background system: 3-stop body gradient,
 * drifting violet + cyan nebulas, blurred milky-way band, 7 pinpoint
 * signature stars with diffraction spikes, parallax canvas starfield, and
 * shooting stars that fire every 14–42 seconds.
 *
 * Place once near the root of your app:
 *
 *   <Starscape />
 *   <App />
 *
 * Sleeps in light mode (no canvas, no meteors), wakes in dark. Auto-syncs
 * via MutationObserver on <html data-theme>, so it cooperates with useTheme
 * out of the box. Respects prefers-reduced-motion (canvas freezes, meteors
 * stop).
 *
 * Pass any StarscapeOptions to override defaults — disable meteors with
 * `meteors={false}`, scale star density with `densityScale={0.6}`, etc.
 */
export function Starscape(props: StarscapeProps = {}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const handle = startStarscape({ ...props, mountTo: ref.current });
    return () => handle.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={ref} className="grain" aria-hidden="true">
      <div className="milky-way" aria-hidden="true" />
    </div>
  );
}
