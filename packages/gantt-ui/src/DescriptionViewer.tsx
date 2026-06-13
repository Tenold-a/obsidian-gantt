import { h } from 'preact';
import { useSignal } from '@preact/signals';
import type { GanttStore } from './store';
import { MarkdownView } from './MarkdownView';
import { DescriptionModal } from './DescriptionModal';
import { collapseNewlines } from './constants';

export function DescriptionViewer(props: { description: string; store: GanttStore; taskId?: string; onSave?: (newValue: string) => void }) {
  const showModal = useSignal(false);
  const startEdit = useSignal(false);

  return (
    <div>
      <div
        class="gantt-description-preview"
        style={{
          maxHeight: '200px',
          overflowY: 'auto',
          border: '1px solid var(--background-modifier-border, #e0e0e0)',
          borderRadius: '4px',
          padding: '6px 8px',
          background: 'var(--background-primary, #fff)',
        }}
      >
        {props.description ? (
          <MarkdownView markdown={collapseNewlines(props.description)} store={props.store} />
        ) : (
          <div style={{ fontSize: '12px', color: 'var(--text-muted, #999)', fontStyle: 'italic' }}>No description</div>
        )}
      </div>
      <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
        {props.description && (
          <button
            onClick={() => { showModal.value = true; startEdit.value = false; }}
            style={{
              padding: '3px 12px',
              border: '1px solid var(--background-modifier-border, #ccc)',
              borderRadius: '4px',
              background: 'var(--background-secondary, #f5f5f5)',
              cursor: 'pointer',
              fontSize: '11px',
              color: 'var(--text-muted, #666)',
            }}
          >
            View full description
          </button>
        )}
        {props.taskId && (
          <button
            onClick={() => { showModal.value = true; startEdit.value = true; }}
            style={{
              padding: '3px 12px',
              border: '1px solid var(--background-modifier-border, #ccc)',
              borderRadius: '4px',
              background: 'var(--background-secondary, #f5f5f5)',
              cursor: 'pointer',
              fontSize: '11px',
              color: 'var(--interactive-accent, #4A90D9)',
            }}
          >
            Edit description
          </button>
        )}
        {props.onSave && (
          <button
            onClick={() => { showModal.value = true; startEdit.value = true; }}
            style={{
              padding: '3px 12px',
              border: '1px solid var(--background-modifier-border, #ccc)',
              borderRadius: '4px',
              background: 'var(--background-secondary, #f5f5f5)',
              cursor: 'pointer',
              fontSize: '11px',
              color: 'var(--interactive-accent, #4A90D9)',
            }}
          >
            Edit description
          </button>
        )}
      </div>
      {showModal.value && (
        <DescriptionModal
          description={props.description}
          store={props.store}
          taskId={props.taskId}
          onSave={props.onSave}
          startEdit={startEdit.value}
          onClose={() => { showModal.value = false; }}
        />
      )}
    </div>
  );
}
