import * as React from 'react';
import { cx } from './cx';

export interface TagInputProps {
  /** Current tags. */
  tags: string[];
  /** Called when a tag is added (Enter on a non-empty input). */
  onAdd: (tag: string) => void;
  /** Called when a tag's × is pressed. */
  onRemove: (index: number) => void;
  placeholder?: string;
  /** Also commit a tag on these keys (default: Enter, comma). */
  commitKeys?: string[];
  className?: string;
  inputProps?: Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'value' | 'onChange' | 'onKeyDown'
  >;
}

/**
 * A field holding removable tags plus a bare text input. Controlled — you own
 * the `tags` array. Commits the typed value on Enter/comma; Backspace on an
 * empty input removes the last tag.
 *
 * Pair with `import '@starlove/ui/components/tag-input';`.
 */
export function TagInput({
  tags,
  onAdd,
  onRemove,
  placeholder = 'Add tag…',
  commitKeys = ['Enter', ','],
  className,
  inputProps,
}: TagInputProps) {
  const [draft, setDraft] = React.useState('');

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (commitKeys.includes(e.key)) {
      e.preventDefault();
      const value = draft.trim();
      if (value) {
        onAdd(value);
        setDraft('');
      }
    } else if (e.key === 'Backspace' && draft === '' && tags.length) {
      onRemove(tags.length - 1);
    }
  }

  return (
    <div className={cx('tag-input', className)}>
      {tags.map((tag, i) => (
        <span className="tag" key={`${tag}-${i}`}>
          {tag}
          <button
            type="button"
            className="tag-remove"
            aria-label={`Remove ${tag}`}
            onClick={() => onRemove(i)}
          >
            ×
          </button>
        </span>
      ))}
      <input
        type="text"
        placeholder={placeholder}
        aria-label="Add tag"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        {...inputProps}
      />
    </div>
  );
}
