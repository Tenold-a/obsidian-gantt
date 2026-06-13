import { h } from 'preact';
import { useEffect, useMemo } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import type { GanttStore } from './store';
import type { TaskDetail as TaskDetailType } from '@obsidian-gantt/core';
import { Icon } from './icon';
import { DetailHeader } from './DetailHeader';
import { TagsEditor } from './TagsEditor';
import { LinkField } from './LinkField';
import { DescriptionViewer } from './DescriptionViewer';
import { STATUS_OPTIONS } from './constants';

export function TaskDetail(props: { store: GanttStore; onDelete?: (taskId: string, title: string) => void }) {
  const { store } = props;
  const sel = store.selectedEntity.value;

  if (!sel || sel.type !== 'task') return null;

  const task = store.mergedTasks.value.find(t => t.id === sel.id);
  if (!task) return null;

  const personName = task.personId.value
    ? store.persons.value.find(p => p.id === task.personId.value)?.name ?? task.personId.value
    : null;

  const project = task.projectId.value
    ? store.projects.value.find(p => p.id === task.projectId.value)
    : null;

  // Inline title editing
  const editTitle = useSignal(false);
  const editTitleValue = useSignal(task.title.value);
  let titleInputRef: HTMLInputElement | null = null;

  // Detail fetching: load rich task detail on demand
  const taskDetail = useSignal<TaskDetailType | null>(null);
  const taskDetailLoading = useSignal(false);
  useEffect(() => {
    const connectorId = task.connectorId;
    if (!connectorId) return;
    let cancelled = false;
    taskDetailLoading.value = true;
    store.fetchEntityDetail(task.upstreamId ?? task.id, 'task', connectorId).then(data => {
      if (!cancelled && data) taskDetail.value = data as TaskDetailType;
    }).finally(() => {
      if (!cancelled) taskDetailLoading.value = false;
    });
    return () => { cancelled = true; };
  }, [task.id, task.connectorId]);

  // Full editing mode
  const editing = useSignal(false);
  const editStartDate = useSignal(task.startDate.value ?? '');
  const editEndDate = useSignal(task.endDate.value ?? '');
  const editProgress = useSignal(task.progress.value ?? 0);
  const editPersonId = useSignal(task.personId.value ?? '');
  const editProjectId = useSignal(task.projectId.value ?? '');
  const editUrl = useSignal(task.url.value ?? '');
  const editDeps = useSignal<string[]>([...task.dependencies.value]);
  const editTags = useSignal<string[]>([...task.tags.value]);
  const editDepInput = useSignal('');
  const editDescription = useSignal('');

  // Known tags for autocomplete
  const knownTags = useMemo(() => {
    const set = new Set<string>();
    for (const p of store.mergedProjects.value) {
      for (const t of (p.tags ?? [])) set.add(t);
    }
    for (const t of store.mergedTasks.value) {
      for (const tag of t.tags.value) set.add(tag);
    }
    const defs = store.tagDefinitions.value;
    if (defs) {
      for (const d of defs) set.add(d.name);
    }
    return [...set].sort();
  }, [store.mergedProjects.value, store.mergedTasks.value, store.tagDefinitions.value]);

  function startEditTitle() {
    editTitleValue.value = task!.title.value;
    editTitle.value = true;
    requestAnimationFrame(() => titleInputRef?.focus());
  }

  function saveTitle() {
    const newTitle = editTitleValue.value.trim();
    if (newTitle && newTitle !== task!.title.value) {
      store.persistEdit(task!.id, 'title', newTitle);
    }
    editTitle.value = false;
  }

  function cancelTitle() {
    editTitleValue.value = task!.title.value;
    editTitle.value = false;
  }

  function startEditing() {
    const manualDesc = store.edits.value?.overrides?.[task!.id]?.description as string | undefined;
    const detailDesc = taskDetail.value?.description;
    editDescription.value = manualDesc !== undefined ? manualDesc : (detailDesc ?? '');
    editStartDate.value = task!.startDate.value ?? '';
    editEndDate.value = task!.endDate.value ?? '';
    editProgress.value = task!.progress.value ?? 0;
    editPersonId.value = task!.personId.value ?? '';
    editProjectId.value = task!.projectId.value ?? '';
    editUrl.value = task!.url.value ?? '';
    editDeps.value = [...task!.dependencies.value];
    editTags.value = [...task!.tags.value];
    editing.value = true;
  }

  function cancelEditing() {
    editing.value = false;
  }

  async function saveEditing() {
    const t = task!;
    const pid = t.id;

    if (editStartDate.value !== (t.startDate.value ?? '')) store.persistEdit(pid, 'startDate', editStartDate.value || null);
    if (editEndDate.value !== (t.endDate.value ?? '')) store.persistEdit(pid, 'endDate', editEndDate.value || null);
    if (editProgress.value !== (t.progress.value ?? 0)) store.persistEdit(pid, 'progress', editProgress.value);
    if (editPersonId.value !== (t.personId.value ?? '')) store.persistEdit(pid, 'personId', editPersonId.value || null);
    if (editProjectId.value !== (t.projectId.value ?? '')) store.persistEdit(pid, 'projectId', editProjectId.value || null);
    if (editUrl.value !== (t.url.value ?? '')) store.persistEdit(pid, 'url', editUrl.value || null);
    if (JSON.stringify(editDeps.value) !== JSON.stringify(t.dependencies.value)) store.persistEdit(pid, 'dependencies', editDeps.value);
    if (JSON.stringify(editTags.value) !== JSON.stringify(t.tags.value)) store.persistEdit(pid, 'tags', editTags.value);
    // Description
    const manualDesc = store.edits.value?.overrides?.[pid]?.description as string | undefined;
    const detailDesc = taskDetail.value?.description;
    const currentDesc = manualDesc !== undefined ? manualDesc : detailDesc;
    if (editDescription.value !== (currentDesc ?? '')) store.persistEdit(pid, 'description', editDescription.value || null);

    // Auto-create tags for new tags
    const existingNames = new Set(store.tagDefinitions.value.map(t => t.name));
    const flatColors = ['#4A90D9', '#7B61F8', '#E06C75', '#61AFEF', '#98C379', '#E5C07B', '#C678DD', '#56B6C2'];
    for (const tag of editTags.value) {
      if (!existingNames.has(tag)) {
        await store.createTag(tag, flatColors[Math.floor(Math.random() * flatColors.length)]);
        existingNames.add(tag);
      }
    }

    editing.value = false;
  }

  function addDep() {
    const val = editDepInput.value.trim();
    if (!val || editDeps.value.includes(val)) return;
    editDeps.value = [...editDeps.value, val];
    editDepInput.value = '';
  }

  function removeDep(id: string) {
    editDeps.value = editDeps.value.filter(d => d !== id);
  }

  const sourceLabel = task.connectorId
    ? `Connector: ${task.connectorId}`
    : task.upstreamId
      ? 'Local override'
      : 'Manual entry';
  const sourceStyle = task.upstreamDeleted ? 'line-through' : 'normal';

  const labelStyle = { fontSize: '11px', color: 'var(--text-muted, #999)', marginBottom: '2px' };
  const inputStyle = {
    width: '100%', fontSize: '12px', padding: '3px 6px', borderRadius: '4px',
    border: '1px solid var(--background-modifier-border, #ccc)',
    background: 'var(--background-primary, #fff)', color: 'var(--text-normal, #333)',
    boxSizing: 'border-box' as const,
  };
  const fieldStyle = { marginBottom: '10px' };

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
      <DetailHeader
        store={store}
        editing={editing}
        title={task.title.value}
        editTitleEnabled={editTitle}
        editTitleValue={editTitleValue}
        titleInputRef={(el) => { titleInputRef = el; }}
        onStartEditTitle={startEditTitle}
        onSaveTitle={saveTitle}
        onCancelTitle={cancelTitle}
        onEdit={startEditing}
        onSave={saveEditing}
        onCancel={cancelEditing}
        onDelete={() => props.onDelete?.(task.id, task.title.value)}
        onLocate={() => { store.locateTarget.value = { type: 'task', id: task.id }; }}
        onClose={() => store.selectEntity(null)}
      />

      {/* Fields */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>

        {/* Project */}
        <div style={fieldStyle}>
          <div style={labelStyle}>Project</div>
          {editing.value ? (
            <select
              value={editProjectId.value}
              onChange={(e) => { editProjectId.value = (e.target as HTMLSelectElement).value; }}
              style={inputStyle}
            >
              <option value="">No project</option>
              {store.projects.value.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          ) : project ? (
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px' }}
              onClick={() => store.selectEntity({ type: 'project', id: project.id })}
              title="Go to project"
            >
              <span style={{
                width: '10px', height: '10px', borderRadius: '2px',
                background: project.color ?? '#888', flexShrink: 0,
              }} />
              <span style={{ color: 'var(--interactive-accent, #4A90D9)', textDecoration: 'underline' }}>
                {project.name}
              </span>
            </div>
          ) : (
            <div style={{ fontSize: '13px' }}>—</div>
          )}
        </div>

        {/* Status */}
        <div style={fieldStyle}>
          <div style={labelStyle}>Status</div>
          <select
            value={task.status.value}
            onChange={(e) => store.setTaskStatus(task.id, (e.target as HTMLSelectElement).value)}
            style={inputStyle}
          >
            {STATUS_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div style={fieldStyle}>
          <div style={labelStyle}>Tags</div>
          <TagsEditor
            store={store}
            tags={editing.value ? editTags.value : task.tags.value}
            knownTags={knownTags}
            editing={editing.value}
            onChange={(tags) => { editTags.value = tags; }}
            onSave={(tags) => { editTags.value = tags; }}
          />
        </div>

        {/* Start Date */}
        <div style={fieldStyle}>
          <div style={labelStyle}>Start</div>
          {editing.value ? (
            <input type="date" value={editStartDate.value}
              onInput={(e) => { editStartDate.value = (e.target as HTMLInputElement).value; }}
              style={inputStyle} />
          ) : task.startDate.value ? (
            <div style={{ fontSize: '13px' }}>{task.startDate.value}</div>
          ) : (
            <div style={{ fontSize: '12px' }}>—</div>
          )}
        </div>

        {/* End Date */}
        <div style={fieldStyle}>
          <div style={labelStyle}>End</div>
          {editing.value ? (
            <input type="date" value={editEndDate.value}
              onInput={(e) => { editEndDate.value = (e.target as HTMLInputElement).value; }}
              style={inputStyle} />
          ) : task.endDate.value ? (
            <div style={{ fontSize: '13px' }}>{task.endDate.value}</div>
          ) : (
            <div style={{ fontSize: '12px' }}>—</div>
          )}
        </div>

        {/* Progress */}
        <div style={fieldStyle}>
          <div style={labelStyle}>Progress</div>
          {editing.value ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={editProgress.value}
                onInput={(e) => { editProgress.value = parseFloat((e.target as HTMLInputElement).value); }}
                style={{ flex: 1 }}
              />
              <span style={{ fontSize: '12px', minWidth: '36px', textAlign: 'right' }}>
                {Math.round(editProgress.value * 100)}%
              </span>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ flex: 1, height: '6px', borderRadius: '3px', background: 'var(--background-modifier-border, #e0e0e0)' }}>
                <div style={{
                  width: `${(task.progress.value ?? 0) * 100}%`,
                  height: '100%',
                  borderRadius: '3px',
                  background: 'var(--interactive-accent, #4A90D9)',
                }} />
              </div>
              <span style={{ fontSize: '12px', minWidth: '36px', textAlign: 'right' }}>
                {Math.round((task.progress.value ?? 0) * 100)}%
              </span>
            </div>
          )}
        </div>

        {/* Person */}
        <div style={fieldStyle}>
          <div style={labelStyle}>Person</div>
          {editing.value ? (
            <select
              value={editPersonId.value}
              onChange={(e) => { editPersonId.value = (e.target as HTMLSelectElement).value; }}
              style={inputStyle}
            >
              <option value="">Unassigned</option>
              {store.persons.value.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          ) : (
            <div style={{ fontSize: '13px' }}>{personName || '—'}</div>
          )}
        </div>

        {/* Dependencies */}
        <div style={fieldStyle}>
          <div style={labelStyle}>Dependencies</div>
          {editing.value ? (
            <div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '6px' }}>
                {editDeps.value.map(d => (
                  <span key={d} style={{
                    padding: '1px 6px', borderRadius: '10px', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '4px',
                    background: 'var(--background-modifier-border, #e0e0e0)',
                  }}>
                    {d}
                    <button onClick={() => removeDep(d)} style={{
                      background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px',
                      color: 'var(--text-error, #e00)', lineHeight: 1, padding: 0,
                    }}>×</button>
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                <input type="text" value={editDepInput.value}
                  onInput={(e) => { editDepInput.value = (e.target as HTMLInputElement).value; }}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addDep(); } }}
                  placeholder="Task ID..."
                  style={{ ...inputStyle, flex: 1 }} />
                <button onClick={addDep} style={{
                  padding: '3px 8px', border: '1px solid var(--background-modifier-border, #ccc)',
                  borderRadius: '4px', background: 'var(--background-secondary, #f5f5f5)',
                  cursor: 'pointer', fontSize: '11px', whiteSpace: 'nowrap',
                }}>Add</button>
              </div>
            </div>
          ) : (
            <div style={{ fontSize: '12px' }}>
              {task.dependencies.value.length > 0
                ? task.dependencies.value.map(d => (
                    <div key={d} style={{ padding: '1px 0' }}>{d}</div>
                  ))
                : '—'}
            </div>
          )}
        </div>

        {/* Link (URL) */}
        <div style={fieldStyle}>
          <div style={labelStyle}>Link</div>
          {editing.value ? (
            <input type="text" value={editUrl.value}
              onInput={(e) => { editUrl.value = (e.target as HTMLInputElement).value; }}
              placeholder="https://..."
              style={inputStyle} />
          ) : task.url.value ? (
            <LinkField url={task.url.value} store={store} />
          ) : (
            <div style={{ fontSize: '12px' }}>—</div>
          )}
        </div>

        {/* Description */}
        {editing.value ? (
          <div style={fieldStyle}>
            <div style={labelStyle}>Description</div>
            <textarea
              value={editDescription.value}
              onInput={(e) => { editDescription.value = (e.target as HTMLTextAreaElement).value; }}
              rows={4}
              style={{
                width: '100%', boxSizing: 'border-box', resize: 'vertical', fontSize: '12px',
                padding: '4px', borderRadius: '4px', border: '1px solid var(--background-modifier-border, #ccc)',
                background: 'var(--background-primary, #fff)', color: 'var(--text-normal, #333)',
              }}
              placeholder="Task description..."
            />
          </div>
        ) : (
          (() => {
            const manualDesc = store.edits.value?.overrides?.[task.id]?.description as string | undefined;
            const detailDesc = taskDetail.value?.description;
            const effectiveDesc = manualDesc !== undefined ? manualDesc : detailDesc;
            if (taskDetailLoading.value) {
              return (
                <div style={fieldStyle}>
                  <div style={labelStyle}>Description</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted, #999)', fontStyle: 'italic' }}>Loading...</div>
                </div>
              );
            }
            return (
              <div style={fieldStyle}>
                <div style={labelStyle}>Description</div>
                <DescriptionViewer description={effectiveDesc ?? ''} store={store} taskId={task.id} />
              </div>
            );
          })()
        )}

        {/* Source */}
        <div style={{ fontSize: '11px', color: 'var(--text-muted, #999)', marginTop: '4px' }}>
          <div style={{ textDecoration: sourceStyle }}>{sourceLabel}</div>
          {task.upstreamDeleted && (
            <div style={{ color: 'var(--text-error, #e00)', marginTop: '2px' }}>Deleted upstream</div>
          )}
        </div>

      </div>
    </div>
  );
}
