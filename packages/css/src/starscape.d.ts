/**
 * Starscape JS engine — TypeScript declarations.
 *
 * The implementation lives in starscape.js (plain JS so the css package
 * stays buildless). These declarations make it consumable from TS.
 */

export interface StarscapeOptions {
  /** Element (or selector string) to mount into. Defaults to existing `.grain` or `<body>`. */
  mountTo?: Element | string;
  /** Number of signature pinpoint stars. Default 7. */
  signatureStars?: number;
  /** Whether to run the canvas starfield. Default true. */
  canvasStars?: boolean;
  /** Whether to spawn shooting stars. Default true. */
  meteors?: boolean;
  /** Whether stars track mouse movement. Default true. */
  parallax?: boolean;
  /** Minimum ms between meteors. Default 14000. */
  meteorMinDelay?: number;
  /** Maximum ms between meteors. Default 42000. */
  meteorMaxDelay?: number;
  /** Multiplier for canvas star count (density). Default 1. */
  densityScale?: number;
}

export interface StarscapeHandle {
  /** Re-evaluate theme + reduced-motion. Idempotent. */
  sync(): void;
  /** Tear down DOM, listeners, RAF, timers. */
  stop(): void;
}

/**
 * Mount the Starscape dark-mode background system. Idempotent — calling
 * twice returns the same handle. SSR-safe — returns no-op handle in
 * non-browser environments.
 */
export function startStarscape(options?: StarscapeOptions): StarscapeHandle;
