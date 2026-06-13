import { h } from 'preact';
import { useSignal } from '@preact/signals';
import type { GanttStore } from './store';
import { Icon } from './icon';
import { StatusBadge } from './StatusBadge';

export function PersonDetail(props: { store: GanttStore }) {
  const { store } = props;
  const sel = store.selectedEntity.value;

  if (!sel || sel.type !== 'person') return null;

  const person = store.persons.value.find(p => p.id === sel.id);
  const personOverrides = store.edits.value?.personOverrides?.[sel.id];
  const displayName = personOverrides?.name ?? person?.name ?? (sel.id === '__unassigned__' ? 'Unassigned' : sel.id);
  const displayPosition = personOverrides?.position ?? person?.position;

  // Tasks assigned to this person
  const personTasks = store.mergedTasks.value.filter(t =>
    sel.id === '__unassigned__' ? !t.personId.value : t.personId.value === sel.id,
  );

  // Inline name editing
  const editName = useSignal(false);
  const editNameValue = useSignal(displayName);
  const editPosition = useSignal(false);
  const editPositionValue = useSignal(displayPosition ?? '');
  let nameInputRef: HTMLInputElement | null = null;
  let positionInputRef: HTMLInputElement | null = null;

  function startEditName() {
    editNameValue.value = displayName;
    editName.value = true;
    requestAnimationFrame(() => nameInputRef?.focus());
  }

  function saveName() {
    const newName = editNameValue.value.trim();
    if (newName && newName !== displayName && sel) {
      store.persistPersonEdit(sel.id, 'name', newName);
    }
    editName.value = false;
  }

  function cancelName() {
    editNameValue.value = displayName;
    editName.value = false;
  }

  function handleNameKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); saveName(); }
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); cancelName(); }
  }

  function startEditPosition() {
    editPositionValue.value = displayPosition ?? '';
    editPosition.value = true;
    requestAnimationFrame(() => positionInputRef?.focus());
  }

  function savePosition() {
    const newPos = editPositionValue.value.trim();
    if (newPos !== (displayPosition ?? '') && sel) {
      store.persistPersonEdit(sel.id, 'position', newPos || undefined);
    }
    editPosition.value = false;
  }

  function cancelPosition() {
    editPositionValue.value = displayPosition ?? '';
    editPosition.value = false;
  }

  function handlePositionKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); savePosition(); }
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); cancelPosition(); }
  }

  const fieldStyle = { marginBottom: '12px' };
  const labelStyle: Record<string, string> = { fontSize: '11px', color: 'var(--text-muted, #999)', marginBottom: '2px' };

  return (
    <div
      class="gantt-detail-panel"
      style={{
        width: `${store.detailPanelWidth.value}px`,
        minWidth: '180px',
        maxHeight: '100%',
        borderLeft: '1px solid var(--gantt-grid-line-week, #c0c0c0)',
        padding: '12px',
        fontSize: '13px',
        color: 'var(--text-normal, #333)',
        overflowY: 'auto',
        background: 'var(--background-secondary, #f5f5f5)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div style={{ flex: 1 }}>
          {sel.id !== '__unassigned__' ? (
            <>
              {editName.value ? (
                <input
                  ref={(el: HTMLInputElement | null) => { nameInputRef = el; }}
                  type="text"
                  value={editNameValue.value}
                  onInput={(e) => { editNameValue.value = (e.target as HTMLInputElement).value; }}
                  onBlur={saveName}
                  onKeyDown={handleNameKeyDown}
                  onKeyUp={(e) => { e.stopPropagation(); }}
                  class="gantt-inline-edit-input"
                  style={{
                    fontSize: '14px', fontWeight: 'bold', padding: '2px 6px',
                    border: '1px solid var(--interactive-accent, #4A90D9)',
                    borderRadius: '4px', background: 'var(--background-primary, #fff)',
                    color: 'var(--text-normal, #333)', width: '100%', boxSizing: 'border-box',
                  }}
                />
              ) : (
                <div
                  style={{ fontWeight: 'bold', fontSize: '14px', wordBreak: 'break-word', cursor: 'text' }}
                  onClick={startEditName}
                  title="Click to edit name"
                >{displayName}</div>
              )}
              <div style={{ marginTop: '4px' }}>
                {editPosition.value ? (
                  <input
                    ref={(el: HTMLInputElement | null) => { positionInputRef = el; }}
                    type="text"
                    value={editPositionValue.value}
                    onInput={(e) => { editPositionValue.value = (e.target as HTMLInputElement).value; }}
                    onBlur={savePosition}
                    onKeyDown={handlePositionKeyDown}
                    onKeyUp={(e) => { e.stopPropagation(); }}
                    class="gantt-inline-edit-input"
                    placeholder="Position..."
                    style={{
                      fontSize: '12px', padding: '2px 6px',
                      border: '1px solid var(--interactive-accent, #4A90D9)',
                      borderRadius: '4px', background: 'var(--background-primary, #fff)',
                      color: 'var(--text-normal, #333)', width: '100%', boxSizing: 'border-box',
                    }}
                  />
                ) : (
                  <span
                    style={{ fontSize: '12px', color: 'var(--text-muted, #999)', cursor: 'text' }}
                    onClick={startEditPosition}
                    title="Click to edit position"
                  >{displayPosition || 'No position'}</span>
                )}
              </div>
            </>
          ) : (
            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>Unassigned</div>
          )}
        </div>
        <div style={{ display: 'flex', gap: '2px', flexShrink: 0 }}>
          {sel.id !== '__unassigned__' && person && (
            <button
              onClick={() => { store.locateTarget.value = { type: 'task', id: personTasks[0]?.id ?? '' }; }}
              title="Locate person row"
              style={{
                padding: '2px 4px', border: 'none', borderRadius: '3px',
                background: 'transparent', cursor: 'pointer', fontSize: '13px',
                color: 'var(--text-muted, #999)', lineHeight: 1,
              }}
            ><Icon name="target" size={13} /></button>
          )}
          <button
            onClick={() => store.selectEntity(null)}
            title="Close detail panel"
            style={{
              padding: '2px 4px', border: 'none', borderRadius: '3px',
              background: 'transparent', cursor: 'pointer', fontSize: '14px',
              color: 'var(--text-muted, #999)', lineHeight: 1,
            }}
          ><Icon name="x" size={14} /></button>
        </div>
      </div>

      {/* Avatar */}
      {person?.avatar && (
        <div style={fieldStyle}>
          <img src={person.avatar} alt={displayName} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
        </div>
      )}

      {/* Task count */}
      <div style={fieldStyle}>
        <div style={labelStyle}>Tasks</div>
        <div style={{ fontSize: '13px', fontWeight: 500 }}>{personTasks.length}</div>
      </div>

      {/* Task list */}
      <div style={fieldStyle}>
        <div style={labelStyle}>Assigned Tasks</div>
        {personTasks.length === 0 ? (
          <div style={{ fontSize: '12px', color: 'var(--text-muted, #999)', fontStyle: 'italic' }}>No tasks assigned</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {personTasks.map(task => {
              const project = task.projectId.value
                ? store.projects.value.find(p => p.id === task.projectId.value)
                : null;
              return (
                <div
                  key={task.id}
                  onClick={() => store.selectEntity({ type: 'task', id: task.id })}
                  style={{
                    padding: '6px 8px',
                    border: '1px solid var(--background-modifier-border, #e0e0e0)',
                    borderRadius: '4px',
                    background: 'var(--background-primary, #fff)',
                    cursor: 'pointer',
                    fontSize: '12px',
                    transition: 'background 0.12s, border-color 0.12s, box-shadow 0.12s',
                  }}
                  onMouseEnter={(e) => {
                    store.hoveredTaskId.value = task.id;
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = 'var(--background-secondary, #f8f8f8)';
                    el.style.borderColor = 'var(--gantt-hover-border, #FFB347)';
                    el.style.boxShadow = '0 0 0 1px var(--gantt-hover-border, #FFB347)';
                  }}
                  onMouseLeave={(e) => {
                    store.hoveredTaskId.value = null;
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = 'var(--background-primary, #fff)';
                    el.style.borderColor = 'var(--background-modifier-border, #e0e0e0)';
                    el.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <StatusBadge status={task.status.value} />
                    <span style={{ fontWeight: 500, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {task.title.value}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        store.locateTarget.value = { type: 'task', id: task.id };
                      }}
                      title="Locate task"
                      style={{
                        padding: '1px 3px', border: 'none', borderRadius: '3px',
                        background: 'transparent', cursor: 'pointer',
                        color: 'var(--text-muted, #999)', lineHeight: 1, flexShrink: 0,
                      }}
                    ><Icon name="target" size={12} /></button>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: 'var(--text-muted, #999)' }}>
                    {task.startDate.value && task.endDate.value ? (
                      <span>{task.startDate.value} → {task.endDate.value}</span>
                    ) : task.startDate.value ? (
                      <span>{task.startDate.value}</span>
                    ) : null}
                    {project && <span style={{ color: project.color }}>{project.name}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
