import { useCallback, useEffect, useState } from 'react';

export type ThemeMode = 'system' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';

const STORAGE_KEY = 'starscape-theme';

function readStoredMode(): ThemeMode {
  if (typeof window === 'undefined') return 'system';
  const v = window.localStorage.getItem(STORAGE_KEY);
  return v === 'light' || v === 'dark' || v === 'system' ? v : 'system';
}

function applyMode(mode: ThemeMode): ResolvedTheme {
  if (typeof document === 'undefined') return 'light';
  const root = document.documentElement;
  if (mode === 'system') {
    root.removeAttribute('data-theme');
    return systemPrefers();
  }
  root.setAttribute('data-theme', mode);
  return mode;
}

function systemPrefers(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Theme controller for Starscape v3. Returns the current mode (system | light
 * | dark), the resolved theme (light | dark) after considering OS preference,
 * and a setter that persists to localStorage and updates document.documentElement.
 *
 * In system mode, the hook subscribes to matchMedia so the resolved theme
 * tracks the OS in real time.
 */
export function useTheme(): {
  mode: ThemeMode;
  resolved: ResolvedTheme;
  setMode: (m: ThemeMode) => void;
} {
  const [mode, setModeState] = useState<ThemeMode>(() => readStoredMode());
  const [resolved, setResolved] = useState<ResolvedTheme>(() => {
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
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => setResolved(mql.matches ? 'dark' : 'light');
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [mode]);

  const setMode = useCallback((m: ThemeMode) => setModeState(m), []);

  return { mode, resolved, setMode };
}
