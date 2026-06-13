import { h } from 'preact';
import { Signal } from '@preact/signals';
import type { ComponentChildren } from 'preact';
import type { GanttStore } from './store';
import { Icon } from './icon';

export interface DetailHeaderProps {
  store: GanttStore;
  editing: Signal<boolean>;
  title: string;
  editTitleEnabled: Signal<boolean>;
  editTitleValue: Signal<string>;
  titleInputRef: (el: HTMLInputElement | null) => void;
  onStartEditTitle: () => void;
  onSaveTitle: () => void;
  onCancelTitle: () => void;
  children?: ComponentChildren;  // e.g., project color swatch
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete?: () => void;
  onLocate?: () => void;
  onClose: () => void;
}

const buttonStyle = {
  padding: '2px 4px',
  border: 'none',
  borderRadius: '3px',
  background: 'transparent',
  cursor: 'pointer',
  lineHeight: 1,
};

export function DetailHeader(props: DetailHeaderProps) {
  function handleNameKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); props.onSaveTitle(); }
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); props.onCancelTitle(); }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
        {props.children}
        {props.editTitleEnabled.value ? (
          <input
            ref={props.titleInputRef}
            type="text"
            value={props.editTitleValue.value}
            onInput={(e) => { props.editTitleValue.value = (e.target as HTMLInputElement).value; }}
            onBlur={props.onSaveTitle}
            onKeyDown={handleNameKeyDown}
            onKeyUp={(e) => { e.stopPropagation(); }}
            class="gantt-inline-edit-input"
            style={{
              flex: 1,
              fontSize: '14px',
              fontWeight: 'bold',
              padding: '2px 6px',
              border: '1px solid var(--interactive-accent, #4A90D9)',
              borderRadius: '4px',
              background: 'var(--background-primary, #fff)',
              color: 'var(--text-normal, #333)',
            }}
          />
        ) : (
          <span
            style={{ fontWeight: 'bold', fontSize: '14px', wordBreak: 'break-word', cursor: 'text' }}
            onClick={props.onStartEditTitle}
            title="Click to edit"
          >{props.title}</span>
        )}
      </div>
      <div style={{ display: 'flex', gap: '2px', flexShrink: 0, marginLeft: '4px' }}>
        {props.editing.value ? (
          <>
            <button
              onClick={props.onSave}
              title="Save changes"
              style={{
                padding: '3px 8px', border: '1px solid var(--interactive-accent, #4A90D9)',
                borderRadius: '4px', background: 'var(--interactive-accent, #4A90D9)', color: '#fff',
                cursor: 'pointer', fontSize: '11px',
              }}
            >Save</button>
            <button
              onClick={props.onCancel}
              title="Cancel editing"
              style={{
                padding: '3px 8px', border: '1px solid var(--background-modifier-border, #ccc)',
                borderRadius: '4px', background: 'var(--background-secondary, #f5f5f5)',
                cursor: 'pointer', fontSize: '11px',
              }}
            >Cancel</button>
          </>
        ) : (
          <>
            <button onClick={props.onEdit} title="Edit details" style={{ ...buttonStyle, fontSize: '13px', color: 'var(--text-muted, #999)' }}>
              <Icon name="pencil" size={13} />
            </button>
            {props.onDelete && (
              <button onClick={props.onDelete} title="Delete" style={{ ...buttonStyle, fontSize: '13px', color: 'var(--text-error, #e00)' }}>
                <Icon name="trash-2" size={13} />
              </button>
            )}
            {props.onLocate && (
              <button onClick={props.onLocate} title="Scroll to entity" style={{ ...buttonStyle, fontSize: '13px', color: 'var(--text-muted, #999)' }}>
                <Icon name="target" size={13} />
              </button>
            )}
            <button onClick={props.onClose} title="Close detail panel" style={{ ...buttonStyle, fontSize: '14px', color: 'var(--text-muted, #999)' }}>
              <Icon name="x" size={14} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
