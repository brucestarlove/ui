import * as React from 'react';
import { cx } from './cx';

/* ---------------- Avatar ---------------- */

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';
export type AvatarTone = 'accent' | 'amber' | 'cyan' | 'rose' | 'violet';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: AvatarSize;
  tone?: AvatarTone;
  /** Image source — renders an `<img>`; otherwise children (initials) show. */
  src?: string;
  alt?: string;
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  function Avatar({ size = 'md', tone, src, alt = '', className, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={cx('avatar', className)}
        data-size={size === 'md' ? undefined : size}
        data-tone={tone}
        {...rest}
      >
        {src ? <img src={src} alt={alt} /> : children}
      </div>
    );
  },
);

/** Overlapping cluster of avatars (`.avatar-stack`). */
export const AvatarStack = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function AvatarStack({ className, ...rest }, ref) {
  return <div ref={ref} className={cx('avatar-stack', className)} {...rest} />;
});

/* ---------------- Divider ---------------- */

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
}

export const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  function Divider({ orientation = 'horizontal', className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation={orientation}
        className={cx('divider', className)}
        data-orientation={orientation === 'horizontal' ? undefined : orientation}
        {...rest}
      />
    );
  },
);

/* ---------------- Kbd ---------------- */

export const Kbd = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(function Kbd({ className, ...rest }, ref) {
  return <kbd ref={ref} className={cx('kbd', className)} {...rest} />;
});

/* ---------------- Skeleton ---------------- */

export type SkeletonShape = 'text' | 'rect' | 'circle';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  shape?: SkeletonShape;
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  function Skeleton({ shape = 'rect', className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cx('skeleton', `skeleton-${shape}`, className)}
        {...rest}
      />
    );
  },
);

/* ---------------- Progress + Spinner ---------------- */

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 0–100. Omit (or set indeterminate) for the indeterminate bar. */
  value?: number;
  indeterminate?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  function Progress({ value, indeterminate, size = 'md', className, style, ...rest }, ref) {
    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : value}
        aria-valuemin={0}
        aria-valuemax={100}
        className={cx('progress', className)}
        data-indeterminate={indeterminate ? '' : undefined}
        data-size={size === 'md' ? undefined : size}
        {...rest}
      >
        {!indeterminate && (
          <div
            className="progress-bar"
            style={{ ['--value' as string]: `${value ?? 0}%`, ...style }}
          />
        )}
      </div>
    );
  },
);

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  label?: string;
}

export const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
  function Spinner({ label = 'Loading', className, ...rest }, ref) {
    return (
      <span
        ref={ref}
        role="status"
        aria-label={label}
        className={cx('spinner', className)}
        {...rest}
      />
    );
  },
);

/* ---------------- List ---------------- */

export interface ListProps extends React.HTMLAttributes<HTMLElement> {
  /** `numbered` → ordered list with star/number markers; `stars` → starred bullets. */
  variant?: 'numbered' | 'stars';
}

export const List = React.forwardRef<HTMLElement, ListProps>(function List(
  { variant, className, ...rest },
  ref,
) {
  const Tag = variant === 'numbered' ? 'ol' : 'ul';
  return (
    <Tag
      ref={ref as React.Ref<HTMLOListElement & HTMLUListElement>}
      className={cx(variant && `list-${variant}`, className)}
      {...rest}
    />
  );
});

/* ---------------- Description list ---------------- */

export interface DescriptionListProps
  extends React.HTMLAttributes<HTMLDListElement> {
  layout?: 'inline' | 'stacked';
}

export const DescriptionList = React.forwardRef<
  HTMLDListElement,
  DescriptionListProps
>(function DescriptionList({ layout = 'inline', className, ...rest }, ref) {
  return (
    <dl
      ref={ref}
      className={cx('description-list', className)}
      data-layout={layout === 'inline' ? undefined : layout}
      {...rest}
    />
  );
});

/* ---------------- Control row ---------------- */

export interface ControlRowProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: React.ReactNode;
  value?: React.ReactNode;
  /** Stack label above the control instead of inline. */
  stacked?: boolean;
}

/**
 * Label + control + optional value readout row (`.control-row`). Pass `label`
 * and `value`, put the control itself in `children`.
 */
export const ControlRow = React.forwardRef<HTMLDivElement, ControlRowProps>(
  function ControlRow({ label, value, stacked, className, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={cx('control-row', className)}
        data-stacked={stacked ? '' : undefined}
        {...rest}
      >
        {label != null && <span className="control-label">{label}</span>}
        {children}
        {value != null && <span className="control-value">{value}</span>}
      </div>
    );
  },
);
