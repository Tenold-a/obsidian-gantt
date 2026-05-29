import { h } from 'preact';
import { useRef, useEffect, useMemo } from 'preact/hooks';
import { useSignal, useComputed } from '@preact/signals';
import type { GanttStore, PersonGroup, ProjectGroup } from './store';
import {
  TimelineGrid,
  TimeHeader,
  TodayLine,
  TaskBar,
  TaskRow,
  isTodayDate,
} from './components';
import type { LocalTask } from '@obsidian-gantt/core';
import { dateToPixel, daysBetween, todayString } from '@obsidian-gantt/core';
import { createDragHandler, dragState } from './drag';

const DAY_WIDTH = 30;
const ROW_HEIGHT = 40;
const LEFT_PANEL_WIDTH = 180;
const RIGHT_PANEL_WIDTH = 220;

// ============================================================
// TaskList — left sidebar showing row labels
// ============================================================

function TaskList(props: {
  labels: { key: string; name: string; color?: string }[];
  rowHeight: number;
  scrollTop: number;
  highlightedRowKeys?: Set<string>;
  dimmedRowKeys?: Set<string>;
  onRowClick?: (key: string) => void;
}) {
  return (
    <div
      class="gantt-task-list"
      style={{
        width: `${LEFT_PANEL_WIDTH}px`,
        minWidth: `${LEFT_PANEL_WIDTH}px`,
        overflow: 'hidden',
        borderRight: '1px solid var(--gantt-grid-line-week, #c0c0c0)',
      }}
    >
      {/* Spacer to match header height */}
      <div style={{ height: '44px', borderBottom: '1px solid var(--gantt-grid-line-day, #e0e0e0)' }} />
      {/* Header */}
      <div
        style={{
          height: `${props.labels.length * props.rowHeight}px`,
          transform: `translateY(-${props.scrollTop}px)`,
        }}
      >
        {props.labels.map((label) => {
          const isHighlighted = props.highlightedRowKeys?.has(label.key) ?? false;
          const isDimmed = props.dimmedRowKeys?.has(label.key) ?? false;
          return (
            <div
              key={label.key}
              class={`gantt-task-list-row ${isHighlighted ? 'highlighted' : ''} ${isDimmed ? 'dimmed' : ''}`}
              style={{
                height: `${props.rowHeight}px`,
                lineHeight: `${props.rowHeight}px`,
                borderBottom: '1px solid var(--gantt-grid-line-day, #e0e0e0)',
                opacity: isDimmed ? 0.4 : 1,
                background: isHighlighted ? 'var(--gantt-row-highlight-bg, rgba(74, 144, 217, 0.08))' : 'transparent',
                paddingLeft: '8px',
                paddingRight: '8px',
                fontSize: '13px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'opacity 0.15s',
              }}
              onClick={() => props.onRowClick?.(label.key)}
            >
              {label.color && (
                <span
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '2px',
                    background: label.color,
                    flexShrink: 0,
                  }}
                />
              )}
              <span>{label.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// Timeline — the scrollable time axis area
// ============================================================

function Timeline(props: {
  store: GanttStore;
  groups: { key: string; tasks: LocalTask[] }[];
  groupKeyField: 'personId' | 'projectId';
  scrollLeft: number;
  scrollTop: number;
  onScroll: (scrollLeft: number, scrollTop: number) => void;
  highlightedRowKeys: Set<string>;
  dimmedRowKeys: Set<string>;
  onRowClick: (key: string) => void;
  onTaskClick: (taskId: string) => void;
  onTaskPointerDown: (e: PointerEvent, taskId: string, edge: 'left' | 'right' | 'body') => void;
  onDrop: (e: DragEvent) => void;
  onDragOver: (e: DragEvent) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { store, groups, scrollLeft, scrollTop } = props;

  const range = store.timelineRange.value;
  const totalDays = daysBetween(range.startDate, range.endDate) + 1;
  const totalWidth = totalDays * DAY_WIDTH;

  // Handle scroll events
  function handleScroll(e: Event) {
    const el = e.currentTarget as HTMLDivElement;
    props.onScroll(el.scrollLeft, el.scrollTop);
  }

  // Sync scrollLeft from signal
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = scrollLeft;
    }
  }, [scrollLeft]);

  // Task bar data
  const taskBars: Array<{
    task: LocalTask;
    left: number;
    width: number;
    rowIndex: number;
    color: string;
  }> = [];
  let rowIndex = 0;

  const projectColorMap = new Map<string, string>();
  for (const p of store.projects.value) {
    projectColorMap.set(p.id, p.color ?? getDefaultColor(p.id));
  }
  const DEFAULT_COLORS = ['#4A90D9', '#7B61F8', '#E06C75', '#61AFEF', '#98C379', '#E5C07B', '#C678DD', '#56B6C2'];

  function getDefaultColor(id: string): string {
    let hash = 0;
    for (let i = 0; i < id.length; i++) hash = ((hash << 5) - hash) + id.charCodeAt(i);
    return DEFAULT_COLORS[Math.abs(hash) % DEFAULT_COLORS.length];
  }

  for (const group of groups) {
    for (const task of group.tasks) {
      const startVal = task.startDate.value;
      const endVal = task.endDate.value;
      if (!startVal) continue;

      const end = endVal ?? startVal;
      const left = dateToPixel(startVal, range.startDate, DAY_WIDTH);
      const right = dateToPixel(end, range.startDate, DAY_WIDTH);
      const width = Math.max(right - left, 4);

      const projectColor = task.projectId.value
        ? projectColorMap.get(task.projectId.value) ?? getDefaultColor(task.projectId.value)
        : getDefaultColor(task.id);

      taskBars.push({
        task,
        left,
        width,
        rowIndex,
        color: projectColor,
      });
    }
    rowIndex++;
  }

  const highlightedIds = store.highlightedTaskIds.value;
  const hasSelection = store.selectedEntity.value !== null;
  const totalRows = groups.length;

  return (
    <div
      ref={containerRef}
      class="gantt-timeline"
      style={{
        flex: 1,
        overflow: 'scroll',
        position: 'relative',
      }}
      onScroll={handleScroll}
      onDrop={props.onDrop}
      onDragOver={props.onDragOver}
    >
      {/* Time header (sticky) */}
      <TimeHeader startDate={range.startDate} endDate={range.endDate} dayWidth={DAY_WIDTH} />

      {/* Scrollable body */}
      <div
        style={{
          position: 'relative',
          width: `${totalWidth}px`,
          height: `${totalRows * ROW_HEIGHT}px`,
        }}
      >
        {/* Grid */}
        <TimelineGrid dayWidth={DAY_WIDTH} totalDays={totalDays} />

        {/* Today line */}
        <TodayLine
          leftPx={dateToPixel(todayString(), range.startDate, DAY_WIDTH)}
          visible={true}
        />

        {/* Row backgrounds */}
        {groups.map((group, gi) => {
          const isHighlighted = props.highlightedRowKeys.has(group.key);
          const isDimmed = props.dimmedRowKeys.has(group.key);
          return (
            <div
              key={group.key}
              style={{
                position: 'absolute',
                top: `${gi * ROW_HEIGHT}px`,
                left: 0,
                width: '100%',
                height: `${ROW_HEIGHT}px`,
                borderBottom: '1px solid var(--gantt-grid-line-day, #e0e0e0)',
                opacity: isDimmed ? 0.4 : 1,
                background: isHighlighted ? 'var(--gantt-row-highlight-bg, rgba(74, 144, 217, 0.08))' : 'transparent',
                transition: 'opacity 0.15s',
                pointerEvents: 'none',
              }}
            />
          );
        })}

        {/* Task bars */}
        {taskBars.map(({ task, left, width, rowIndex: ri, color }) => (
          <TaskBar
            key={task.id}
            data={{
              id: task.id,
              title: task.title.value,
              left,
              width,
              color,
              isHighlighted: highlightedIds.has(task.id),
              isDimmed: hasSelection && !highlightedIds.has(task.id),
              progress: task.progress.value,
            }}
            rowHeight={ROW_HEIGHT}
            onPointerDown={props.onTaskPointerDown}
            onClick={props.onTaskClick}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================================
// Single Gantt Pane (shared between person and project views)
// ============================================================

function GanttPane(props: {
  store: GanttStore;
  type: 'person' | 'project';
  scrollLeft: number;
  scrollTop: number;
  onScroll: (scrollLeft: number, scrollTop: number) => void;
  onTaskPointerDown: (e: PointerEvent, taskId: string, edge: 'left' | 'right' | 'body') => void;
  onDrop: (e: DragEvent) => void;
  onDragOver: (e: DragEvent) => void;
}) {
  const { store, type } = props;
  const groups = type === 'person' ? store.personGroups.value : store.projectGroups.value;

  const labels = useMemo(() =>
    groups.map(g => ({
      key: g.personId ?? g.projectId,
      name: type === 'person' ? g.personName : g.projectName,
      color: type === 'project' ? (g as ProjectGroup).color : undefined,
    })),
    [groups],
  );

  // Compute highlighted and dimmed row keys
  const highlightedIds = store.highlightedTaskIds.value;
  const hasSelection = store.selectedEntity.value !== null;

  const highlightedRowKeys = useMemo(() => {
    if (!hasSelection) return new Set<string>();
    const keys = new Set<string>();
    for (const group of groups) {
      if (group.tasks.some(t => highlightedIds.has(t.id))) {
        keys.add(type === 'person'
          ? (group as PersonGroup).personId
          : (group as ProjectGroup).projectId);
      }
    }
    return keys;
  }, [groups, highlightedIds, hasSelection]);

  const dimmedRowKeys = useMemo(() => {
    if (!hasSelection) return new Set<string>();
    const keys = new Set<string>();
    for (const group of groups) {
      const key = type === 'person'
        ? (group as PersonGroup).personId
        : (group as ProjectGroup).projectId;
      if (!highlightedRowKeys.has(key)) {
        keys.add(key);
      }
    }
    return keys;
  }, [groups, highlightedRowKeys, hasSelection]);

  function handleRowClick(key: string) {
    if (type === 'person') {
      store.selectEntity({ type: 'person', id: key });
    } else {
      store.selectEntity({ type: 'project', id: key });
    }
  }

  function handleTaskClick(taskId: string) {
    store.selectEntity({ type: 'task', id: taskId });
  }

  return (
    <div class="gantt-pane" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
      <TaskList
        labels={labels}
        rowHeight={ROW_HEIGHT}
        scrollTop={props.scrollTop}
        highlightedRowKeys={highlightedRowKeys}
        dimmedRowKeys={dimmedRowKeys}
        onRowClick={handleRowClick}
      />
      <Timeline
        store={store}
        groups={groups}
        groupKeyField={type === 'person' ? 'personId' : 'projectId'}
        scrollLeft={props.scrollLeft}
        scrollTop={props.scrollTop}
        onScroll={props.onScroll}
        highlightedRowKeys={highlightedRowKeys}
        dimmedRowKeys={dimmedRowKeys}
        onRowClick={handleRowClick}
        onTaskClick={handleTaskClick}
        onTaskPointerDown={props.onTaskPointerDown}
        onDrop={props.onDrop}
        onDragOver={props.onDragOver}
      />
    </div>
  );
}

// ============================================================
// UnassignedPanel
// ============================================================

function UnassignedPanel(props: {
  store: GanttStore;
  onDragStart: (e: PointerEvent, project: import('@obsidian-gantt/core').Project) => void;
}) {
  const projects = props.store.unassignedProjects.value;

  if (projects.length === 0) {
    return (
      <div
        class="gantt-unassigned-panel"
        style={{
          width: `${RIGHT_PANEL_WIDTH}px`,
          minWidth: `${RIGHT_PANEL_WIDTH}px`,
          borderLeft: '1px solid var(--gantt-grid-line-week, #c0c0c0)',
          padding: '12px',
          fontSize: '13px',
          color: 'var(--text-muted, #999)',
          overflowY: 'auto',
        }}
      >
        <div style={{ fontWeight: 'bold', marginBottom: '8px', color: 'var(--text-normal, #333)' }}>
          Unassigned Projects
        </div>
        <div style={{ fontStyle: 'italic', fontSize: '12px' }}>
          All projects have tasks assigned.
        </div>
      </div>
    );
  }

  return (
    <div
      class="gantt-unassigned-panel"
      style={{
        width: `${RIGHT_PANEL_WIDTH}px`,
        minWidth: `${RIGHT_PANEL_WIDTH}px`,
        borderLeft: '1px solid var(--gantt-grid-line-week, #c0c0c0)',
        padding: '12px',
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          fontWeight: 'bold',
          marginBottom: '8px',
          color: 'var(--text-normal, #333)',
          fontSize: '13px',
        }}
      >
        Unassigned ({projects.length})
      </div>
      {projects.map(p => (
        <div
          key={p.id}
          class="gantt-unassigned-card"
          draggable={true}
          onDragStart={(e) => {
            e.dataTransfer?.setData('text/plain', JSON.stringify({ projectId: p.id, projectName: p.name }));
          }}
          style={{
            padding: '8px 10px',
            marginBottom: '6px',
            border: '1px solid var(--gantt-grid-line-day, #e0e0e0)',
            borderRadius: '6px',
            background: 'var(--background-secondary, #f5f5f5)',
            cursor: 'grab',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          {p.color && (
            <span
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '2px',
                background: p.color,
                flexShrink: 0,
              }}
            />
          )}
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {p.name}
          </span>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// DualPane — top-level layout
// ============================================================

export function DualPane(props: {
  store: GanttStore;
  onTaskPointerDown: (e: PointerEvent, taskId: string, edge: 'left' | 'right' | 'body') => void;
  onDrop: (e: DragEvent) => void;
  onDragOver: (e: DragEvent) => void;
}) {
  const { store } = props;

  const personScrollTop = useSignal(0);
  const projectScrollTop = useSignal(0);
  const paneRatio = useSignal(0.5); // 50/50 split

  // Drag resize state
  const isResizing = useSignal(false);

  function handleResizePointerDown(e: PointerEvent) {
    e.preventDefault();
    isResizing.value = true;

    const startY = e.clientY;
    const startRatio = paneRatio.value;
    const containerEl = (e.currentTarget as HTMLElement).parentElement!;
    const totalHeight = containerEl.clientHeight;

    function onMove(ev: PointerEvent) {
      const dy = ev.clientY - startY;
      const newRatio = Math.min(0.8, Math.max(0.2, startRatio + dy / totalHeight));
      paneRatio.value = newRatio;
    }

    function onUp() {
      isResizing.value = false;
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
    }

    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
  }

  return (
    <div class="gantt-dual-pane" style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
      {/* Person Gantt (upper) */}
      <div style={{ flex: `0 0 ${paneRatio.value * 100}%`, display: 'flex', overflow: 'hidden' }}>
        <GanttPane
          store={store}
          type="person"
          scrollLeft={store.sharedScrollLeft.value}
          scrollTop={personScrollTop.value}
          onScroll={(sl) => {
            store.sharedScrollLeft.value = sl;
            personScrollTop.value = sl;
          }}
          onTaskPointerDown={props.onTaskPointerDown}
          onDrop={props.onDrop}
          onDragOver={props.onDragOver}
        />
        {/* Unassigned panel on the right */}
        <UnassignedPanel store={store} onDragStart={() => {}} />
      </div>

      {/* Resize handle */}
      <div
        class="gantt-resize-handle"
        style={{
          height: '6px',
          cursor: 'row-resize',
          background: isResizing.value
            ? 'var(--interactive-accent, #4A90D9)'
            : 'var(--background-modifier-border, #ccc)',
          flexShrink: 0,
          transition: isResizing.value ? 'none' : 'background 0.15s',
        }}
        onPointerDown={handleResizePointerDown}
      />

      {/* Project Gantt (lower) */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <GanttPane
          store={store}
          type="project"
          scrollLeft={store.sharedScrollLeft.value}
          scrollTop={projectScrollTop.value}
          onScroll={(sl, st) => {
            store.sharedScrollLeft.value = sl;
            projectScrollTop.value = st;
          }}
          onTaskPointerDown={props.onTaskPointerDown}
          onDrop={props.onDrop}
          onDragOver={props.onDragOver}
        />
        {/* The unassigned panel spans the full height, so it's only in the upper pane */}
      </div>
    </div>
  );
}

// ============================================================
// Top-level GanttChart component
// ============================================================

export function GanttChart(props: {
  store: GanttStore;
}) {
  const { store } = props;
  const dragHandler = createDragHandler(store);

  // Keyboard handler for Escape and Undo
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        store.selectEntity(null);
      }
      if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        dragHandler.undo();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  function handleTaskPointerDown(e: PointerEvent, taskId: string, edge: 'left' | 'right' | 'body') {
    dragHandler.onTaskPointerDown(e, taskId, edge);
  }

  function handleDrop(e: DragEvent) {
    dragHandler.handleTimelineDrop(e);
  }

  function handleDragOver(e: DragEvent) {
    dragHandler.handleTimelineDragOver(e);
  }

  if (store.isLoading.value) {
    return (
      <div class="gantt-loading" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted, #999)' }}>
        Loading...
      </div>
    );
  }

  if (store.error.value) {
    return (
      <div class="gantt-error" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-error, #e00)' }}>
        Error: {store.error.value}
      </div>
    );
  }

  if (!store.currentViewId.value) {
    return (
      <div class="gantt-empty" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted, #999)' }}>
        No view selected. Create a view to get started.
      </div>
    );
  }

  return (
    <div class="gantt-chart" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Toolbar */}
      <div
        class="gantt-toolbar"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '8px 12px',
          borderBottom: '1px solid var(--background-modifier-border, #ccc)',
          fontSize: '13px',
        }}
      >
        <button
          class="gantt-btn"
          style={{
            padding: '4px 12px',
            border: '1px solid var(--background-modifier-border, #ccc)',
            borderRadius: '4px',
            background: 'var(--background-secondary, #f5f5f5)',
            cursor: 'pointer',
            fontSize: '12px',
          }}
          onClick={() => store.selectEntity(null)}
        >
          Clear Selection
        </button>
        <span style={{ color: 'var(--text-muted, #999)', fontSize: '12px' }}>
          {store.mergedTasks.value.length} tasks · {store.personGroups.value.length} people · {store.projectGroups.value.length} projects
        </span>
        <span style={{ color: 'var(--text-muted, #999)', fontSize: '12px', marginLeft: 'auto' }}>
          {store.conflicts.value.length > 0 ? `⚠ ${store.conflicts.value.length} conflicts` : ''}
        </span>
      </div>

      {/* Dual pane */}
      <DualPane
        store={store}
        onTaskPointerDown={handleTaskPointerDown}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      />
    </div>
  );
}
