import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './globals.css';

const container = document.getElementById('root');
if (!container) throw new Error('#root element not found');

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Fade the boot splash out once the (heavy) mount above is done, keeping it up
// for a minimum of 786ms from navigation start so a fast load doesn't flash it.
// Mounting first means the breathe and fade-out run on a quiet main thread, so
// the star leaves smoothly instead of stuttering mid-fade.
const splash = document.getElementById('ss-loader');
if (splash) {
  const SPLASH_MIN_MS = 786;
  setTimeout(() => {
    splash.classList.add('is-hiding');
    // transitionend is the happy path; the timeout guarantees removal even if
    // the transition is skipped (e.g. tab backgrounded mid-fade).
    splash.addEventListener('transitionend', () => splash.remove(), { once: true });
    setTimeout(() => splash.remove(), 600);
  }, Math.max(0, SPLASH_MIN_MS - performance.now()));
}
