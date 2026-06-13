import { h } from 'preact';
import { useEffect, useMemo } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import type { GanttStore } from './store';
import type { ProjectDetail as ProjectDetailType } from '@obsidian-gantt/core';
import { Icon } from './icon';
import { DetailHeader } from './DetailHeader';
import { TagsEditor } from './TagsEditor';
import { KeyDateEditor } from './KeyDateEditor';
import { KeyLinkEditor } from './KeyLinkEditor';
import { DescriptionViewer } from './DescriptionViewer';
import { ColorSwatchPicker } from './ColorSwatchPicker';
import { StatusBadge } from './StatusBadge';
import { STATUS_OPTIONS, KEY_DATE_PRESETS, PRESET_COLORS, getDefaultColor } from './constants';

export function ProjectDetail(props: { store: GanttStore; onDelete?: (projectId: string, name: string) => void }) {
  const { store } = props;
  const sel = store.selectedEntity.value;
  const editing = useSignal(false);

  if (!sel || sel.type !== 'project') return null;

  const project = store.mergedProjects.value.find(p => p.id === sel.id);
  if (!project) return null;

  const projectOverrides = store.edits.value?.projectOverrides?.[project.id];
  const description = projectOverrides?.description ?? project.description ?? '';
  const requester = projectOverrides?.requester ?? project.requester ?? '';
  const keyDates = projectOverrides?.keyDates ?? project.keyDates ?? [];
  const keyLinks = projectOverrides?.keyLinks ?? project.keyLinks ?? [];

  // Detail fetching: load rich project detail on demand
  const projectDetail = useSignal<ProjectDetailType | null>(null);
  const projectDetailLoading = useSignal(false);
  useEffect(() => {
    let connectorId: string | null = null;
    for (const cache of store.caches.value) {
      if (cache.projects.some(p => p.id === project.id)) {
        connectorId = cache.connectorId;
        break;
      }
    }
    if (!connectorId) return;
    let cancelled = false;
    projectDetailLoading.value = true;
    store.fetchEntityDetail(project.id, 'project', connectorId).then(data => {
      if (!cancelled && data) projectDetail.value = data as ProjectDetailType;
    }).finally(() => {
      if (!cancelled) projectDetailLoading.value = false;
    });
    return () => { cancelled = true; };
  }, [project.id]);

  // Priority: manual override > detail fetch > canonical upstream
  const displayDescription = projectOverrides?.description ?? projectDetail.value?.description ?? project.description ?? '';
  const displayRequester = projectOverrides?.requester ?? projectDetail.value?.requester ?? project.requester ?? '';
  const displayKeyDates = projectOverrides?.keyDates ?? projectDetail.value?.keyDates ?? project.keyDates ?? [];
  const displayKeyLinks = projectOverrides?.keyLinks ?? projectDetail.value?.keyLinks ?? project.keyLinks ?? [];

  // Inline name editing
  const editName = useSignal(false);
  const editNameValue = useSignal(project.name);
  let nameInputRef: HTMLInputElement | null = null;

  function startEditName() {
    editNameValue.value = project!.name;
    editName.value = true;
    requestAnimationFrame(() => nameInputRef?.focus());
  }

  function saveName() {
    const newName = editNameValue.value.trim();
    if (newName && newName !== project!.name) {
      store.persistProjectEdit(project!.id, 'name', newName);
    }
    editName.value = false;
  }

  function cancelName() {
    editNameValue.value = project!.name;
    editName.value = false;
  }

  // Associated tasks
  const associatedTasks = store.mergedTasks.value.filter(t => t.projectId.value === project.id);

  // Local edit state
  const editDescription = useSignal(displayDescription);
  const editRequester = useSignal(displayRequester);
  const editKeyDates = useSignal<{ name: string; date: string; color?: string; icon?: string }[]>(
    displayKeyDates.map(kd => ({ name: kd.name, date: kd.date, color: kd.color, icon: kd.icon })),
  );
  const editKeyLinks = useSignal<{ name: string; url: string }[]>(
    displayKeyLinks.map(kl => ({ ...kl })),
  );
  const projectTags = (projectOverrides?.tags ?? project.tags ?? []) as string[];
  const editTags = useSignal<string[]>([...projectTags]);
  const showProjectColorPicker = useSignal(false);

  // Collect all known tags for autocomplete
  const knownTags = useMemo(() => {
    const set = new Set<string>();
    for (const p of store.mergedProjects.value) {
      for (const t of (p.tags ?? [])) set.add(t);
    }
    const defs = store.tagDefinitions.value;
    if (defs) {
      for (const d of defs) set.add(d.name);
    }
    return [...set].sort();
  }, [store.mergedProjects.value]);

  function handleEdit() {
    editDescription.value = displayDescription;
    editRequester.value = displayRequester;
    editKeyDates.value = displayKeyDates.map(kd => ({ name: kd.name, date: kd.date, color: kd.color, icon: kd.icon }));
    editKeyLinks.value = displayKeyLinks.map(kl => ({ ...kl }));
    editTags.value = [...projectTags];
    editing.value = true;
  }

  async function handleSave() {
    await store.persistProjectEdit(project!.id, 'description', editDescription.value || undefined);
    await store.persistProjectEdit(project!.id, 'requester', editRequester.value || undefined);
    if (editRequester.value) store.saveFieldMemory('requesters', editRequester.value);
    await store.persistProjectEdit(project!.id, 'keyDates', editKeyDates.value.length > 0
      ? editKeyDates.value.map(kd => ({ name: kd.name, date: kd.date, color: kd.color, icon: kd.icon }))
      : undefined);
    for (const kd of editKeyDates.value) { if (kd.name) store.saveFieldMemory('keyDateNames', kd.name); }
    await store.persistProjectEdit(project!.id, 'keyLinks', editKeyLinks.value.length > 0 ? editKeyLinks.value : undefined);
    for (const kl of editKeyLinks.value) { if (kl.name) store.saveFieldMemory('keyLinkNames', kl.name); }
    await store.persistProjectEdit(project!.id, 'tags', editTags.value.length > 0 ? editTags.value : undefined);

    // Auto-create any new tags in tagDefinitions
    const existingNames = new Set(store.tagDefinitions.value.map(t => t.name));
    const flatColors = PRESET_COLORS.flat();
    for (const tag of editTags.value) {
      if (!existingNames.has(tag)) {
        await store.createTag(tag, flatColors[Math.floor(Math.random() * flatColors.length)]);
        existingNames.add(tag);
      }
    }

    editing.value = false;
  }

  function handleCancel() {
    editing.value = false;
  }

  const fieldStyle = { marginBottom: '12px' };
  const labelStyle: Record<string, string> = { fontSize: '11px', color: 'var(--text-muted, #999)', marginBottom: '2px' };
  const valueStyle: Record<string, string> = { fontSize: '13px', wordBreak: 'break-word' };

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
        title={project.name}
        editTitleEnabled={editName}
        editTitleValue={editNameValue}
        titleInputRef={(el) => { nameInputRef = el; }}
        onStartEditTitle={startEditName}
        onSaveTitle={saveName}
        onCancelTitle={cancelName}
        onEdit={handleEdit}
        onSave={handleSave}
        onCancel={handleCancel}
        onDelete={() => props.onDelete?.(project.id, project.name)}
        onLocate={() => { store.locateTarget.value = { type: 'project', id: project.id }; }}
        onClose={() => store.selectEntity(null)}
      >
        {/* Color swatch in header */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <button
            onClick={() => { showProjectColorPicker.value = !showProjectColorPicker.value; }}
            title="Change project color"
            style={{
              width: '12px', height: '12px', borderRadius: '3px',
              background: project.color ?? getDefaultColor(project.id),
              border: '1px solid var(--background-modifier-border, #ccc)',
              cursor: 'pointer', padding: 0,
            }}
          />
          {showProjectColorPicker.value && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, zIndex: 100,
              background: 'var(--background-primary, #fff)',
              border: '1px solid var(--background-modifier-border, #ccc)',
              borderRadius: '4px', padding: '6px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              marginTop: '4px',
            }}>
              <ColorSwatchPicker
                value={project.color ?? getDefaultColor(project.id)}
                onChange={(c) => {
                  store.persistProjectEdit(project.id, 'color', c);
                  showProjectColorPicker.value = false;
                }}
              />
            </div>
          )}
        </div>
      </DetailHeader>

      {/* Drag-to-create area */}
      <div
        style={{
          border: '2px dashed var(--interactive-accent, #7B61F8)',
          borderRadius: '4px',
          padding: '6px 8px',
          marginBottom: '12px',
          textAlign: 'center',
          cursor: 'grab',
          fontSize: '11px',
          color: 'var(--interactive-accent, #7B61F8)',
          background: 'var(--interactive-accent-bg, rgba(123, 97, 248, 0.04))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px',
        }}
        class="gantt-drag-create-area"
        draggable={true}
        onDragStart={(e) => {
          e.dataTransfer?.setData('text/plain', JSON.stringify({ projectId: project.id, projectName: project.name }));
        }}
      >
        <Icon name="grip-vertical" size={12} /> Drag to person timeline to create task
      </div>

      {/* Status */}
      <div style={fieldStyle}>
        <div style={labelStyle}>Status</div>
        <select
          value={project.status ?? 'pending'}
          onChange={(e) => store.setProjectStatus(project.id, (e.target as HTMLSelectElement).value)}
          style={{
            width: '100%', fontSize: '12px', padding: '3px 6px', borderRadius: '4px',
            border: '1px solid var(--background-modifier-border, #ccc)',
            background: 'var(--background-primary, #fff)', color: 'var(--text-normal, #333)',
          }}
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
          tags={editing.value ? editTags.value : projectTags}
          knownTags={knownTags}
          editing={editing.value}
          onChange={(tags) => { editTags.value = tags; }}
          onSave={(tags) => { editTags.value = tags; }}
        />
      </div>

      {/* Key Dates */}
      <KeyDateEditor
        store={store}
        keyDates={editing.value ? editKeyDates.value : displayKeyDates}
        editing={editing.value}
        onChange={(kds) => { editKeyDates.value = kds; }}
        fieldStyle={fieldStyle}
        labelStyle={labelStyle}
        valueStyle={valueStyle}
      />

      {/* Requester */}
      <div style={fieldStyle}>
        <div style={labelStyle}>Requester</div>
        {editing.value ? (
          <input
            type="text"
            value={editRequester.value}
            onInput={(e) => { editRequester.value = (e.target as HTMLInputElement).value; }}
            list="requester-memory-list"
            style={{
              width: '100%', boxSizing: 'border-box', fontSize: '12px',
              padding: '4px', borderRadius: '4px', border: '1px solid var(--background-modifier-border, #ccc)',
              background: 'var(--background-primary, #fff)', color: 'var(--text-normal, #333)',
            }}
            placeholder="Stakeholder or department..."
          />
        ) : (
          <div style={valueStyle}>{displayRequester || '—'}</div>
        )}
      </div>

      {/* Key Links */}
      <KeyLinkEditor
        store={store}
        keyLinks={editing.value ? editKeyLinks.value : displayKeyLinks}
        editing={editing.value}
        onChange={(kls) => { editKeyLinks.value = kls; }}
        fieldStyle={fieldStyle}
        labelStyle={labelStyle}
        valueStyle={valueStyle}
      />

      {/* Description */}
      <div style={fieldStyle}>
        <div style={labelStyle}>Description</div>
        {editing.value ? (
          <textarea
            value={editDescription.value}
            onInput={(e) => { editDescription.value = (e.target as HTMLTextAreaElement).value; }}
            rows={4}
            style={{
              width: '100%', boxSizing: 'border-box', resize: 'vertical', fontSize: '12px',
              padding: '4px', borderRadius: '4px', border: '1px solid var(--background-modifier-border, #ccc)',
              background: 'var(--background-primary, #fff)', color: 'var(--text-normal, #333)',
            }}
            placeholder="Project description..."
          />
        ) : (
          displayDescription
            ? <DescriptionViewer
                description={displayDescription}
                store={store}
                onSave={(newValue) => { store.persistProjectEdit(project.id, 'description', newValue || undefined); }} />
            : <div style={valueStyle}>—</div>
        )}
      </div>

      {/* Associated Tasks */}
      <div style={fieldStyle}>
        <div style={labelStyle}>Tasks ({associatedTasks.length})</div>
        {associatedTasks.length === 0 ? (
          <div style={{ fontSize: '12px', color: 'var(--text-muted, #999)', fontStyle: 'italic' }}>No tasks</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {associatedTasks.map(t => {
              const assignee = t.personId.value
                ? store.persons.value.find(p => p.id === t.personId.value)
                : null;
              return (
                <div
                  key={t.id}
                  onClick={() => store.selectEntity({ type: 'task', id: t.id })}
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
                    store.hoveredTaskId.value = t.id;
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
                    <StatusBadge status={t.status.value} />
                    <span style={{ fontWeight: 500, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {t.title.value}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        store.locateTarget.value = { type: 'task', id: t.id };
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
                    {t.startDate.value && t.endDate.value ? (
                      <span>{t.startDate.value} → {t.endDate.value}</span>
                    ) : t.startDate.value ? (
                      <span>{t.startDate.value}</span>
                    ) : null}
                    {assignee && <span style={{ color: assignee.color }}>{assignee.name}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Source */}
      <div style={{ fontSize: '11px', color: 'var(--text-muted, #999)', marginTop: '4px' }}>
        {(() => {
          let connectorId: string | null = null;
          for (const cache of store.caches.value) {
            if (cache.projects.some(p => p.id === project.id)) {
              connectorId = cache.connectorId;
              break;
            }
          }
          return connectorId ? `Connector: ${connectorId}` : 'Manual entry';
        })()}
      </div>

      {/* Field memory datalists */}
      <datalist id="requester-memory-list">
        {store.fieldMemory.value.requesters.map(r => (
          <option key={r} value={r} />
        ))}
      </datalist>
      <datalist id="keydate-name-memory-list">
        {store.fieldMemory.value.keyDateNames.map(n => (
          <option key={n} value={n} />
        ))}
      </datalist>
      <datalist id="keylink-name-memory-list">
        {store.fieldMemory.value.keyLinkNames.map(n => (
          <option key={n} value={n} />
        ))}
      </datalist>
    </div>
  );
}
