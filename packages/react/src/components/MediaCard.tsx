import * as React from 'react';
import { cx } from './cx';

export type MediaPlayState = 'idle' | 'playing' | 'error';

export interface MediaCardProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  title: React.ReactNode;
  /** Sub-line under the title (source, version, etc.). */
  meta?: React.ReactNode;
  selected?: boolean;
  /** Play button state — the icon morphs idle → playing → error. */
  playState?: MediaPlayState;
  onPlay?: () => void;
  /** Waveform fill, 0–100. Renders the `.media-envelope` when set. */
  envelope?: number;
  /** Chip row (e.g. `<Badge>`s / `.chip`s). */
  chips?: React.ReactNode;
  /** Analysis/footnote line. */
  note?: React.ReactNode;
  /** Footer action buttons. */
  actions?: React.ReactNode;
}

/**
 * Rich selectable media "audition" card: header with a state-driven play
 * button, an optional waveform envelope, a chip row, a note, and an actions
 * footer.
 *
 * Pair with `import '@starlove/ui/components/media-card';`.
 */
export const MediaCard = React.forwardRef<HTMLElement, MediaCardProps>(
  function MediaCard(
    { title, meta, selected, playState = 'idle', onPlay, envelope, chips, note, actions, className, children, ...rest },
    ref,
  ) {
    return (
      <article
        ref={ref}
        className={cx('media-card', className)}
        data-selected={selected ? 'true' : undefined}
        {...rest}
      >
        <header>
          <div>
            <strong>{title}</strong>
            {meta != null && <span>{meta}</span>}
          </div>
          {onPlay && (
            <button
              type="button"
              className="media-play"
              data-state={playState}
              aria-label={playState === 'playing' ? 'Pause' : 'Play'}
              onClick={onPlay}
            >
              {playState === 'playing' ? 'Pause' : 'Play'}
            </button>
          )}
        </header>
        {envelope != null && (
          <div className="media-envelope" aria-hidden="true">
            <span style={{ width: `${envelope}%` }} />
          </div>
        )}
        {chips != null && <div className="media-card-chips">{chips}</div>}
        {note != null && <p className="media-card-note">{note}</p>}
        {children}
        {actions != null && <div className="media-card-actions">{actions}</div>}
      </article>
    );
  },
);
