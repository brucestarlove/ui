/**
 * Tiny className joiner — no dependency, no clsx. Falsy entries drop out so
 * wrappers can write `cx('card', selected && 'selected', className)` without
 * leaking `undefined`/`false` into the DOM.
 */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
