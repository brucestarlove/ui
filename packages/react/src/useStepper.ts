import { useCallback, useMemo, useState } from 'react';

export interface Stepper {
  /** Zero-based index of the active step. */
  current: number;
  total: number;
  isFirst: boolean;
  isLast: boolean;
  /** Advance one step (clamped at the last). */
  next: () => void;
  /** Go back one step (clamped at the first). */
  prev: () => void;
  /** Jump to an arbitrary step (clamped into range). */
  goTo: (index: number) => void;
  /** Resolve a step's render state for the .stepper CSS. */
  stateOf: (index: number) => 'done' | 'current' | 'upcoming';
}

/**
 * Step-index primitive for the .stepper component (wizards, multi-step forms).
 *
 *   const s = useStepper(3);
 *   <ol className="stepper">
 *     {labels.map((l, i) => (
 *       <li key={l} className="step" data-state={s.stateOf(i)}>
 *         <span className="step-dot">{i + 1}</span>
 *         <span className="step-label">{l}</span>
 *       </li>
 *     ))}
 *   </ol>
 *   <button onClick={s.prev} disabled={s.isFirst}>Back</button>
 *   <button onClick={s.next} disabled={s.isLast}>Next</button>
 *
 * All movers clamp into [0, total - 1], so wiring them to always-enabled
 * buttons is still safe.
 */
export function useStepper(total: number, initial = 0): Stepper {
  const max = Math.max(0, total - 1);
  const clamp = useCallback(
    (n: number) => Math.min(max, Math.max(0, n)),
    [max],
  );
  const [current, setCurrent] = useState(() => clamp(initial));

  const next = useCallback(() => setCurrent(c => clamp(c + 1)), [clamp]);
  const prev = useCallback(() => setCurrent(c => clamp(c - 1)), [clamp]);
  const goTo = useCallback((index: number) => setCurrent(clamp(index)), [clamp]);

  const stateOf = useCallback(
    (index: number): 'done' | 'current' | 'upcoming' =>
      index < current ? 'done' : index === current ? 'current' : 'upcoming',
    [current],
  );

  return useMemo(
    () => ({
      current,
      total,
      isFirst: current <= 0,
      isLast: current >= max,
      next,
      prev,
      goTo,
      stateOf,
    }),
    [current, total, max, next, prev, goTo, stateOf],
  );
}
