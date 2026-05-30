import { useTheme } from '@starlove/ui-react';

/**
 * The exact theme toggle from the main components page: the topbar's
 * `data-variant="theme"` button, driven by the library's useTheme hook, with
 * the same sun/moon SVGs. Shared by the shell and sidebar templates so the
 * chrome re-skins identically across every demo view.
 */
export function ThemeToggle() {
  const theme = useTheme();
  return (
    <button
      type="button"
      className="topbar-btn topbar-ctl-shrink"
      data-variant="theme"
      aria-label={`Switch to ${theme.resolved === 'dark' ? 'light' : 'dark'} theme`}
      onClick={() => theme.setMode(theme.resolved === 'dark' ? 'light' : 'dark')}
    >
      {theme.resolved === 'dark' ? (
        <svg className="topbar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="12" cy="12" r="4.5" />
          <path d="M12 2v2.2M12 19.8V22M3.5 12H5.7M18.3 12h2.2M5.6 5.6l1.5 1.5M16.9 16.9l1.5 1.5M5.6 18.4l1.5-1.5M16.9 7.1l1.5-1.5" />
        </svg>
      ) : (
        <svg className="topbar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}
