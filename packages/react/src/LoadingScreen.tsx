import React from 'react';
import { cx } from './components/cx';

export interface LoadingScreenProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Text shown under the star. Defaults to "Loading…". */
  label?: React.ReactNode;
  /**
   * Optional star artwork (image src). When provided, the image grows in and
   * breathes in place of the CSS-drawn diffraction star — use it to show an
   * app's own logo (e.g. ss-nebula's Starscape-Star.png).
   */
  logo?: string;
  /** Alt text for the logo image. Defaults to "". */
  logoAlt?: string;
  /**
   * Set true to fade the splash out (adds `.is-hiding`). Keep the node mounted
   * for the 0.4s transition, then unmount.
   */
  hiding?: boolean;
}

/**
 * Full-bleed loading splash: a drifting dot-grid starfield, the Starscape star
 * growing in and breathing, and a label. No spinner — the star is the motion.
 *
 * Requires the loader stylesheet:
 *
 *   import '@starlove/ui/components/loader';
 *
 * Respects the motion preference (grow-in/breathe/drift stop under reduced
 * motion; the star renders static at full size). For a splash that paints
 * before the JS bundle, inline the equivalent markup + critical CSS in
 * index.html — see components/loader.css.
 */
export function LoadingScreen({
  label = 'Loading…',
  logo,
  logoAlt = '',
  hiding = false,
  className,
  ...rest
}: LoadingScreenProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cx('ss-loader', hiding && 'is-hiding', className)}
      {...rest}
    >
      {logo ? (
        <img className="ss-loader__logo" src={logo} alt={logoAlt} aria-hidden={!logoAlt} />
      ) : (
        <span className="ss-loader__star" aria-hidden="true" />
      )}
      {label != null && <p className="ss-loader__label">{label}</p>}
    </div>
  );
}
