import { h } from 'preact';
import { useRef } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import type { GanttStore } from './store';

export function TagsEditor(props: {
  store: GanttStore;
  tags: string[];
  knownTags: string[];
  editing: boolean;
  onChange: (tags: string[]) => void;
  onSave: (tags: string[]) => void;
}) {
  const editTagInput = useSignal('');
  const editTagInputRef = useRef<HTMLInputElement | null>(null);

  function addTag() {
    const tag = editTagInput.value.trim();
    if (!tag || props.tags.includes(tag)) return;
    props.onChange([...props.tags, tag]);
    editTagInput.value = '';
    editTagInputRef.current?.focus();
  }

  function removeTag(tag: string) {
    props.onChange(props.tags.filter(t => t !== tag));
  }

  function handleTagInputKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      addTag();
    }
  }

  return (
    <div>
      {props.editing ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            <input
              ref={editTagInputRef}
              type="text"
              value={editTagInput.value}
              onInput={(e) => { editTagInput.value = (e.target as HTMLInputElement).value; }}
              onKeyDown={handleTagInputKeyDown}
              onKeyUp={(e) => { e.stopPropagation(); }}
              placeholder="Add tag..."
              list="tag-suggestions"
              style={{
                flex: 1, fontSize: '11px', padding: '3px 6px', borderRadius: '3px',
                border: '1px solid var(--background-modifier-border, #ccc)',
                background: 'var(--background-primary, #fff)', color: 'var(--text-normal, #333)',
              }}
            />
            <datalist id="tag-suggestions">
              {props.knownTags.filter(t => !props.tags.includes(t)).map(t => (
                <option key={t} value={t} />
              ))}
            </datalist>
            <button
              onClick={addTag}
              style={{
                padding: '3px 10px', border: '1px solid var(--interactive-accent, #4A90D9)',
                borderRadius: '3px', background: 'var(--interactive-accent, #4A90D9)',
                color: '#fff', cursor: 'pointer', fontSize: '11px', whiteSpace: 'nowrap',
              }}
            >+</button>
          </div>
          {props.tags.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {props.tags.map(tag => (
                <span
                  key={tag}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '3px',
                    padding: '1px 6px',
                    borderRadius: '10px',
                    fontSize: '11px',
                    background: 'var(--interactive-accent, #4A90D9)',
                    color: '#fff',
                  }}
                >
                  {tag}
                  <span
                    onClick={() => removeTag(tag)}
                    style={{ cursor: 'pointer', fontSize: '13px', lineHeight: 1, opacity: 0.7 }}
                    title={`Remove tag "${tag}"`}
                  >x</span>
                </span>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: '11px', color: 'var(--text-muted, #999)' }}>No tags</div>
          )}
        </div>
      ) : (
        <div>
          {props.tags.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {props.tags.map(tag => (
                <span
                  key={tag}
                  style={{
                    display: 'inline-block',
                    padding: '1px 6px',
                    borderRadius: '10px',
                    fontSize: '11px',
                    background: 'var(--background-modifier-border, #e0e0e0)',
                    color: 'var(--text-normal, #333)',
                  }}
                >{tag}</span>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: '13px' }}>—</div>
          )}
        </div>
      )}
    </div>
  );
}
