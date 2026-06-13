import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import type { GanttStore } from './store';
import { MarkdownView } from './MarkdownView';
import { collapseNewlines } from './constants';

export function DescriptionModal(props: {
  description: string;
  store: GanttStore;
  onClose: () => void;
  taskId?: string;
  onSave?: (newValue: string) => void;
  startEdit?: boolean;
}) {
  const editMode = useSignal(props.startEdit ?? false);
  const editText = useSignal(props.description);

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      if (editMode.value) {
        editText.value = props.description;
        editMode.value = false;
      } else {
        props.onClose();
      }
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  function handleSave() {
    const newValue = editText.value;
    if (props.onSave) {
      props.onSave(newValue);
    } else if (props.taskId) {
      props.store.persistEdit(props.taskId, 'description', newValue || null);
    }
    editMode.value = false;
    props.onClose();
  }

  function handleCancel() {
    editText.value = props.description;
    editMode.value = false;
  }

  return (
    <div
      class="gantt-description-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          if (editMode.value) handleCancel();
          else props.onClose();
        }
      }}
    >
      <div
        class="gantt-description-modal"
        style={{
          background: 'var(--background-primary, #fff)',
          borderRadius: '8px',
          padding: '24px',
          maxWidth: '700px',
          width: '90%',
          maxHeight: '50vh',
          boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
          color: 'var(--text-normal, #333)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexShrink: 0 }}>
          <span style={{ fontWeight: 'bold', fontSize: '14px' }}>Description</span>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            {editMode.value ? (
              <>
                <button
                  onClick={handleSave}
                  title="Save"
                  style={{
                    padding: '3px 10px', border: '1px solid var(--interactive-accent, #4A90D9)',
                    borderRadius: '4px', background: 'var(--interactive-accent, #4A90D9)', color: '#fff',
                    cursor: 'pointer', fontSize: '11px',
                  }}
                >Save</button>
                <button
                  onClick={handleCancel}
                  title="Cancel"
                  style={{
                    padding: '3px 8px', border: '1px solid var(--background-modifier-border, #ccc)',
                    borderRadius: '4px', background: 'transparent', cursor: 'pointer', fontSize: '11px',
                    color: 'var(--text-muted, #999)',
                  }}
                >Cancel</button>
              </>
            ) : (
              (props.taskId || props.onSave) && (
                <button
                  onClick={() => {
                    editText.value = props.description;
                    editMode.value = true;
                  }}
                  title="Edit description"
                  style={{
                    padding: '3px 8px', border: '1px solid var(--background-modifier-border, #ccc)',
                    borderRadius: '4px', background: 'var(--background-secondary, #f5f5f5)',
                    cursor: 'pointer', fontSize: '11px', color: 'var(--text-normal, #333)',
                  }}
                >Edit</button>
              )
            )}
            <button
              onClick={props.onClose}
              title="Close"
              style={{
                padding: '2px 6px', border: 'none', borderRadius: '3px',
                background: 'transparent', cursor: 'pointer', fontSize: '16px',
                color: 'var(--text-muted, #999)', lineHeight: 1,
              }}
            >x</button>
          </div>
        </div>
        <div style={{ overflowY: 'auto', flex: 1, minHeight: 0 }}>
          {editMode.value ? (
            <textarea
              value={editText.value}
              onInput={(e) => { editText.value = (e.target as HTMLTextAreaElement).value; }}
              style={{
                width: '100%', boxSizing: 'border-box', resize: 'vertical', minHeight: '200px',
                fontSize: '13px', padding: '8px', borderRadius: '4px',
                border: '1px solid var(--background-modifier-border, #ccc)',
                background: 'var(--background-primary, #fff)', color: 'var(--text-normal, #333)',
                fontFamily: 'var(--font-monospace, monospace)', lineHeight: 1.5,
              }}
            />
          ) : (
            <MarkdownView markdown={collapseNewlines(props.description)} store={props.store} />
          )}
        </div>
      </div>
    </div>
  );
}
