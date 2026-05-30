import { useCallback, useEffect, useState } from 'react';

export type MotionMode = 'system' | 'reduce' | 'full';
export type ResolvedMotion = 'reduce' | 'full';

const STORAGE_KEY = 'starscape-motion';

function readStoredMode(): MotionMode {
  if (typeof window === 'undefined') return 'system';
  const v = window.localStorage.getItem(STORAGE_KEY);
  return v === 'reduce' || v === 'full' || v === 'system' ? v : 'system';
}

function applyMode(mode: MotionMode): ResolvedMotion {
  if (typeof document === 'undefined') return 'full';
  const root = document.documentElement;
  if (mode === 'system') {
    root.removeAttribute('data-motion');
    return systemPrefers();
  }
  root.setAttribute('data-motion', mode);
  return mode;
}

function systemPrefers(): ResolvedMotion {
  if (typeof window === 'undefined') return 'full';
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ? 'reduce'
    : 'full';
}

/**
 * Motion preference controller. Mirrors useTheme: returns the current mode
 * (system | reduce | full), the resolved value after considering the OS
 * setting, and a setter that persists to localStorage and writes
 * `data-motion` on `<html>`.
 *
 * Three meanings:
 *   - "system" → no attribute set; CSS + JS engine follow `prefers-reduced-motion`
 *   - "reduce" → always reduce, regardless of OS preference
 *   - "full"   → ignore OS reduce-motion; use sparingly — accessibility note below
 *
 * Accessibility note: OS-level `prefers-reduced-motion` is often configured
 * because of vestibular sensitivities, migraines, or focus-trap conditions.
 * Don't enable "full" by default for users; it should only flip when the
 * user explicitly chooses it. The default is always "system".
 *
 * In system mode the hook subscribes to matchMedia so the resolved value
 * tracks the OS in real time.
 */
export function useMotion(): {
  mode: MotionMode;
  resolved: ResolvedMotion;
  setMode: (m: MotionMode) => void;
} {
  const [mode, setModeState] = useState<MotionMode>(() => readStoredMode());
  const [resolved, setResolved] = useState<ResolvedMotion>(() => {
    const m = readStoredMode();
    return m === 'system' ? systemPrefers() : m;
  });

  useEffect(() => {
    setResolved(applyMode(mode));
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, mode);
    }
  }, [mode]);

  useEffect(() => {
    if (mode !== 'system' || typeof window === 'undefined') return;
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setResolved(mql.matches ? 'reduce' : 'full');
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [mode]);

  const setMode = useCallback((m: MotionMode) => setModeState(m), []);

  return { mode, resolved, setMode };
}
