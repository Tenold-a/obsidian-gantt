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
  KeyDateMarker,
  isTodayDate,
} from './components';
import type { LocalTask } from '@obsidian-gantt/core';
import { daysBetween, todayString } from '@obsidian-gantt/core';
import { createDragHandler, dragState } from './drag';
import {
  TIMELINE_ORIGIN,
  dateToAbsolutePixel,
  absolutePixelToDate,
} from './components';

const DAY_WIDTH = 30;
const ROW_HEIGHT = 40;
const LANE_OFFSET = 12;       // vertical offset per overlapping lane, ~50% of bar height for partial overlap
const LEFT_PANEL_WIDTH = 180;
const RIGHT_PANEL_WIDTH = 220;
const GRID_BUFFER_PX = 600;    // buffer for both grid and header on each side

/** Convert a date to absolute pixel from TIMELINE_ORIGIN. */
function dateToPx(date: string): number {
  return dateToAbsolutePixel(date, DAY_WIDTH);
}

/** Generate a stable HSL color from a string for position tags. */
function hashColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash |= 0;
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 55%, 35%)`;
}

/** Convert absolute pixel to date. */
function pxToDate(px: number): string {
  return absolutePixelToDate(px, DAY_WIDTH);
}

// ============================================================
// TaskList — left sidebar showing row labels
// ============================================================

function TaskList(props: {
  labels: { key: string; name: string; color?: string; position?: string; positionColor?: string; tooltip?: string }[];
  rowHeights: number[];
  scrollTop?: number;
  highlightedRowKeys?: Set<string>;
  dimmedRowKeys?: Set<string>;
  onRowClick?: (key: string) => void;
  headerContent?: any;
}) {
  const totalRowsHeight = props.rowHeights.reduce((a, b) => a + b, 0);
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
      <div style={{ height: '44px', borderBottom: '1px solid var(--gantt-grid-line-day, #e0e0e0)', display: 'flex', alignItems: 'center', paddingLeft: '8px', paddingRight: '8px' }}>
        {props.headerContent}
      </div>
      {/* Rows — synced vertically with timeline via translateY */}
      <div
        style={{
          height: `${totalRowsHeight}px`,
          transform: props.scrollTop ? `translateY(-${props.scrollTop}px)` : undefined,
        }}
      >
        {props.labels.map((label, i) => {
          const isHighlighted = props.highlightedRowKeys?.has(label.key) ?? false;
          const isDimmed = props.dimmedRowKeys?.has(label.key) ?? false;
          const h = props.rowHeights[i] ?? ROW_HEIGHT;
          return (
            <div
              key={label.key}
              class={`gantt-task-list-row ${isHighlighted ? 'highlighted' : ''} ${isDimmed ? 'dimmed' : ''}`}
              style={{
                height: `${h}px`,
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
              {label.position && (
                <span
                  class="gantt-position-badge"
                  style={{ background: label.positionColor || 'var(--background-modifier-border)' }}
                >
                  {label.position}
                </span>
              )}
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }} title={label.tooltip}>{label.name}</span>
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
  onTaskPointerDown: (e: PointerEvent, taskId: string, edge: 'left' | 'right' | 'body', paneType: 'person' | 'project') => void;
  onKeyDatePointerDown?: (e: PointerEvent, projectId: string, keyDateIndex: number, currentDate: string) => void;
  onDrop: (e: DragEvent, bodyOriginPx?: number) => void;
  onDragOver: (e: DragEvent) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { store, groups, scrollLeft, scrollTop } = props;

  const paneType = props.groupKeyField === 'personId' ? 'person' : 'project';

  // Track visible viewport width for dynamic header/grid rendering
  const viewportWidth = useSignal(800);
  // Ref for initial scroll-to-today (run once per pane)
  const didInitialScroll = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    viewportWidth.value = el.clientWidth;
    const ro = new ResizeObserver(() => {
      viewportWidth.value = el.clientWidth;
    });
    ro.observe(el);

    // Initial scroll: center today in the viewport
    if (!didInitialScroll.current) {
      didInitialScroll.current = true;
      const todayBodyPx = originToBody(dateToPx(todayString()));
      const targetScroll = todayBodyPx - el.clientWidth / 2;
      requestAnimationFrame(() => {
        el.scrollLeft = targetScroll;
        props.onScroll(targetScroll, 0);
      });
    }

    return () => ro.disconnect();
  }, []);

  // Compute body width and origin offset from min/max task dates + generous padding
  const TWO_YEARS_PX = 730 * DAY_WIDTH;
  const bodyOriginPx = useMemo(() => {
    let minAbsPx = dateToPx(todayString());
    for (const group of groups) {
      for (const task of group.tasks) {
        const startVal = task.startDate.value;
        const endVal = task.endDate.value;
        if (startVal) {
          const px = dateToPx(startVal);
          if (px < minAbsPx) minAbsPx = px;
        }
        if (endVal) {
          const px = dateToPx(endVal);
          if (px < minAbsPx) minAbsPx = px;
        }
      }
    }
    return Math.floor(minAbsPx - TWO_YEARS_PX);
  }, [groups]);

  const bodyTotalWidth = useMemo(() => {
    let maxAbsPx = dateToPx(todayString());
    for (const group of groups) {
      for (const task of group.tasks) {
        const startVal = task.startDate.value;
        const endVal = task.endDate.value;
        if (startVal) {
          const px = dateToPx(startVal);
          if (px > maxAbsPx) maxAbsPx = px;
        }
        if (endVal) {
          const px = dateToPx(endVal);
          if (px > maxAbsPx) maxAbsPx = px;
        }
      }
    }
    return Math.ceil(maxAbsPx - bodyOriginPx + TWO_YEARS_PX);
  }, [groups, bodyOriginPx]);

  /** Convert absolute origin pixel to body-relative pixel. */
  const originToBody = (absPx: number) => absPx - bodyOriginPx;

  // Handle scroll events — only sync horizontal scroll between panes
  function handleScroll(e: Event) {
    const el = e.currentTarget as HTMLDivElement;
    props.onScroll(el.scrollLeft, el.scrollTop);
  }

  // Intercept wheel: shift+wheel → horizontal scroll only
  function handleWheel(e: WheelEvent) {
    if (!containerRef.current) return;
    // When shift is held, convert vertical scroll to horizontal
    // and prevent the timeline from also scrolling vertically
    if (e.shiftKey) {
      e.preventDefault();
      containerRef.current.scrollLeft += e.deltaY;
    }
  }

  // Register wheel listener
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  // Sync scrollLeft from signal
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = scrollLeft;
    }
  }, [scrollLeft]);

  // Task bar data with lane assignment
  const taskBars: Array<{
    task: LocalTask;
    left: number;
    width: number;
    groupIndex: number;
    groupStartY: number;
    laneIndex: number;
    color: string;
  }> = [];

  // Per-group lane counts and cumulative Y offsets
  const groupLayout: { startY: number; height: number; laneCount: number }[] = [];

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

  // Greedy lane assignment per group
  for (const group of groups) {
    const groupTasks: Array<{
      task: LocalTask;
      left: number;
      width: number;
      color: string;
    }> = [];

    for (const task of group.tasks) {
      const startVal = task.startDate.value;
      if (!startVal) continue;
      const endVal = task.endDate.value ?? startVal;
      const left = originToBody(dateToPx(startVal));
      const right = originToBody(dateToPx(endVal));
      const width = Math.max(right - left, 4);
      const projectColor = task.projectId.value
        ? projectColorMap.get(task.projectId.value) ?? getDefaultColor(task.projectId.value)
        : getDefaultColor(task.id);

      groupTasks.push({ task, left, width, color: projectColor });
    }

    // Sort by start date for greedy lane assignment
    groupTasks.sort((a, b) => a.left - b.left);

    // Greedy first-fit lane assignment
    const lanes: number[] = []; // lanes[i] = endPx of last bar in lane i
    for (const gt of groupTasks) {
      let assigned = false;
      for (let li = 0; li < lanes.length; li++) {
        if (gt.left >= lanes[li]) {
          lanes[li] = gt.left + gt.width;
          taskBars.push({
            ...gt,
            groupIndex: groupLayout.length,
            groupStartY: 0, // filled in below
            laneIndex: li,
          });
          assigned = true;
          break;
        }
      }
      if (!assigned) {
        lanes.push(gt.left + gt.width);
        taskBars.push({
          ...gt,
          groupIndex: groupLayout.length,
          groupStartY: 0,
          laneIndex: lanes.length - 1,
        });
      }
    }

    const laneCount = Math.max(1, lanes.length);
    const height = ROW_HEIGHT + (laneCount - 1) * LANE_OFFSET;
    const startY = groupLayout.length === 0 ? 0 : groupLayout[groupLayout.length - 1].startY + groupLayout[groupLayout.length - 1].height;
    groupLayout.push({ startY, height, laneCount });

    // Fill in groupStartY for bars just added
    for (let i = taskBars.length - 1; i >= 0; i--) {
      if (taskBars[i].groupIndex === groupLayout.length - 1) {
        taskBars[i] = { ...taskBars[i], groupStartY: startY };
      } else {
        break;
      }
    }
  }

  const totalHeight = groupLayout.length > 0
    ? groupLayout[groupLayout.length - 1].startY + groupLayout[groupLayout.length - 1].height
    : 0;

  const highlightedIds = store.highlightedTaskIds.value;
  const hasSelection = store.selectedEntity.value !== null;

  // Precompute grid-aligned left for header sync
  const gridAbsAligned = Math.floor((bodyOriginPx + scrollLeft - GRID_BUFFER_PX) / DAY_WIDTH) * DAY_WIDTH;
  const gridLeft = gridAbsAligned - bodyOriginPx;
  // Header is outside scroll container at viewport x=0; translateX to match grid's viewport position
  const headerTranslateX = gridLeft - scrollLeft;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
      {/* Header — outside scroll container, synced via translateX */}
      <div style={{ overflow: 'hidden', flexShrink: 0 }}>
        <TimeHeader
          dayWidth={DAY_WIDTH}
          scrollLeft={scrollLeft}
          viewportWidth={viewportWidth.value}
          bufferPx={GRID_BUFFER_PX}
          bodyOriginPx={bodyOriginPx}
        />
      </div>

      {/* Scrollable body */}
      <div
        ref={containerRef}
        class="gantt-timeline"
        style={{
          flex: 1,
          overflow: 'scroll',
          position: 'relative',
        }}
        onScroll={handleScroll}
        onDrop={(e) => props.onDrop(e, bodyOriginPx)}
        onDragOver={(e) => {
          props.onDragOver(e);
          // Auto-scroll when dragging from outside (sidebar) — native
          // HTML5 auto-scroll only triggers for drags started within the
          // same scrollable container. We handle edge-triggered scroll here.
          const el = containerRef.current;
          if (!el) return;
          const r = el.getBoundingClientRect();
          const edge = 40; // px threshold from edge
          const speed = 8; // px per event
          if (e.clientX - r.left < edge) el.scrollLeft -= speed;
          else if (r.right - e.clientX < edge) el.scrollLeft += speed;
          if (e.clientY - r.top < edge) el.scrollTop -= speed;
          else if (r.bottom - e.clientY < edge) el.scrollTop += speed;
        }}
      >
      <div
        style={{
          position: 'relative',
          width: `${bodyTotalWidth}px`,
          height: `${totalHeight}px`,
        }}
      >
        {/* Grid */}
        <TimelineGrid dayWidth={DAY_WIDTH} scrollLeft={scrollLeft} viewportWidth={viewportWidth.value} bufferPx={GRID_BUFFER_PX} bodyOriginPx={bodyOriginPx} />

        {/* Today line */}
        <TodayLine
          leftPx={originToBody(dateToPx(todayString()))}
          visible={true}
        />

        {/* Row backgrounds */}
        {groups.map((group, gi) => {
          const layout = groupLayout[gi];
          if (!layout) return null;
          const isHighlighted = props.highlightedRowKeys.has(group.key);
          const isDimmed = props.dimmedRowKeys.has(group.key);
          // Check if drag is hovering over this row
          const dragHovering = dragState.value?.currentPersonId != null &&
            (dragState.value.currentPersonId === group.key ||
             (dragState.value.currentPersonId === null && group.key === '__unassigned__'));
          return (
            <div
              key={group.key}
              style={{
                position: 'absolute',
                top: `${layout.startY}px`,
                left: 0,
                width: '100%',
                height: `${layout.height}px`,
                borderBottom: '1px solid var(--gantt-grid-line-day, #e0e0e0)',
                opacity: isDimmed ? 0.4 : 1,
                background: dragHovering
                  ? 'var(--gantt-drag-hover-bg, rgba(74, 144, 217, 0.2))'
                  : isHighlighted ? 'var(--gantt-row-highlight-bg, rgba(74, 144, 217, 0.08))' : 'transparent',
                outline: dragHovering ? '2px dashed var(--gantt-drag-hover-border, #4A90D9)' : 'none',
                outlineOffset: '-2px',
                transition: 'opacity 0.15s, background 0.15s',
                pointerEvents: 'none',
              }}
            />
          );
        })}

        {/* Task bars */}
        {taskBars.map(({ task, left, width, groupStartY, laneIndex, color }) => (
          <TaskBar
            key={task.id}
            rowIndex={0}
            groupStartY={groupStartY}
            laneIndex={laneIndex}
            paneType={paneType}
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
            laneOffset={LANE_OFFSET}
            onPointerDown={props.onTaskPointerDown}
            onClick={props.onTaskClick}
          />
        ))}

        {/* Key date markers (project pane only) */}
        {paneType === 'project' && groups.map((group, gi) => {
          const layout = groupLayout[gi];
          if (!layout) return null;
          const projectId = (group as any).projectId as string;
          if (!projectId || projectId === '__no_project__') return null;
          const project = store.mergedProjects.value.find(p => p.id === projectId);
          if (!project?.keyDates?.length) return null;
          return project.keyDates.map((kd, ki) => (
            <KeyDateMarker
              key={`${projectId}-kd-${ki}`}
              leftPx={originToBody(dateToPx(kd.date))}
              groupTopY={layout.startY}
              name={kd.name}
              date={kd.date}
              color={kd.color}
              icon={kd.icon}
              onPointerDown={props.onKeyDatePointerDown
                ? (e) => props.onKeyDatePointerDown!(e, projectId, ki, kd.date)
                : undefined}
            />
          ));
        })}

        {/* Drag ghost bar / key date ghost */}
        {dragState.value && (() => {
          const ds = dragState.value;
          // Only show ghost in the pane where the drag originated
          if (ds.paneType !== paneType) return null;

          if (ds.dragMode === 'keyDate') {
            const ghostLayout = groupLayout[ds.rowIndex];
            const ghostTop = ghostLayout ? ghostLayout.startY + 3 : ds.rowIndex * ROW_HEIGHT + 3;
            return (
              <div
                class="gantt-key-date-ghost"
                style={{
                  position: 'absolute',
                  left: `${ds.ghostLeft - bodyOriginPx - 8}px`,
                  top: `${ghostTop}px`,
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: '#4A90D9',
                  opacity: 0.5,
                  zIndex: 10,
                  pointerEvents: 'none',
                  border: '2px solid #4A90D9',
                }}
              />
            );
          }

          // Task bar ghost
          const barHeight = ROW_HEIGHT * 0.6;
          const ghostLayout = groupLayout[ds.rowIndex];
          const barTop = ghostLayout
            ? ghostLayout.startY + (ROW_HEIGHT - barHeight) / 2
            : ds.rowIndex * ROW_HEIGHT + (ROW_HEIGHT - barHeight) / 2;
          const ghostTask = store.mergedTasks.value.find(t => t.id === ds.taskId);
          const ghostTitle = ghostTask?.title.value ?? '';
          return (
            <div
              class="gantt-task-bar gantt-ghost-bar"
              style={{
                position: 'absolute',
                left: `${ds.ghostLeft - bodyOriginPx}px`,
                top: `${barTop}px`,
                width: `${Math.max(ds.ghostWidth, 4)}px`,
                height: `${barHeight}px`,
                background: '#4A90D9',
                borderRadius: '4px',
                opacity: 0.5,
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                paddingLeft: '4px',
                fontSize: '11px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                color: '#fff',
                pointerEvents: 'none',
              }}
            >
              {ds.ghostWidth > 40 ? ghostTitle : ''}
            </div>
          );
        })()}
      </div>
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
  onTaskPointerDown: (e: PointerEvent, taskId: string, edge: 'left' | 'right' | 'body', paneType: 'person' | 'project') => void;
  onKeyDatePointerDown?: (e: PointerEvent, projectId: string, keyDateIndex: number, currentDate: string) => void;
  onDrop: (e: DragEvent) => void;
  onDragOver: (e: DragEvent) => void;
}) {
  const { store, type } = props;
  const groups = type === 'person' ? store.personGroups.value : store.projectGroups.value;

  const paneType: 'person' | 'project' = type;

  const labels = useMemo(() =>
    groups.map(g => {
      const key = type === 'person' ? (g as PersonGroup).personId : (g as ProjectGroup).projectId;
      if (type === 'person') {
        const pg = g as PersonGroup;
        return {
          key,
          name: pg.personName,
          color: undefined as string | undefined,
          position: pg.position || undefined,
          positionColor: pg.position ? hashColor(pg.position) : undefined,
          tooltip: pg.personId === '__unassigned__' ? undefined : `ID: ${pg.personId}`,
        };
      }
      return {
        key,
        name: (g as ProjectGroup).projectName,
        color: (g as ProjectGroup).color,
        tooltip: undefined as string | undefined,
      };
    }),
    [groups],
  );

  // Compute row heights with lane expansion for overlapping bars
  const groupHeights = useMemo(() => {
    return groups.map(group => {
      const ranges: Array<{ start: string; end: string }> = [];
      for (const task of group.tasks) {
        const s = task.startDate.value;
        if (!s) continue;
        ranges.push({ start: s, end: task.endDate.value ?? s });
      }
      ranges.sort((a, b) => a.start.localeCompare(b.start));

      const lanes: string[] = []; // lanes[i] = end date of last bar in lane i
      for (const dr of ranges) {
        let assigned = false;
        for (let li = 0; li < lanes.length; li++) {
          if (dr.start >= lanes[li]) {
            lanes[li] = dr.end;
            assigned = true;
            break;
          }
        }
        if (!assigned) lanes.push(dr.end);
      }
      return ROW_HEIGHT + (Math.max(1, lanes.length) - 1) * LANE_OFFSET;
    });
  }, [groups]);

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
        rowHeights={groupHeights}
        scrollTop={props.scrollTop}
        highlightedRowKeys={highlightedRowKeys}
        dimmedRowKeys={dimmedRowKeys}
        onRowClick={handleRowClick}
        headerContent={type === 'person' ? (
          <button
            class="gantt-sort-toggle"
            onClick={() => {
              store.personSortMode.value = store.personSortMode.value === 'name' ? 'position' : 'name';
            }}
            title={`Sort: ${store.personSortMode.value === 'name' ? 'by name' : 'by position'}`}
            style={{
              padding: '2px 8px',
              border: '1px solid var(--background-modifier-border, #ccc)',
              borderRadius: '4px',
              background: 'var(--background-secondary, #f5f5f5)',
              cursor: 'pointer',
              fontSize: '11px',
              whiteSpace: 'nowrap',
            }}
          >
            Sort: {store.personSortMode.value === 'name' ? 'Name' : 'Position'}
          </button>
        ) : undefined}
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
        onKeyDatePointerDown={props.onKeyDatePointerDown}
        onDrop={props.onDrop}
        onDragOver={props.onDragOver}
      />
    </div>
  );
}

const PRESET_COLORS = ['#E06C75', '#61AFEF', '#98C379', '#E5C07B', '#C678DD', '#56B6C2', '#D19A66', '#4A90D9'];

const KEY_DATE_PRESETS = [
  { name: '验收时间', color: '#98C379', icon: '✓' },
  { name: '上线时间', color: '#61AFEF', icon: '▲' },
  { name: '提测时间', color: '#C678DD', icon: '◆' },
  { name: '评审时间', color: '#E5C07B', icon: '◎' },
  { name: '交付时间', color: '#56B6C2', icon: '●' },
  { name: '启动时间', color: '#4A90D9', icon: '▶' },
];

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

function ProjectDetail(props: { store: GanttStore; onDelete?: (projectId: string, name: string) => void }) {
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

  function handleNameKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') saveName();
    if (e.key === 'Escape') cancelName();
  }

  // Associated tasks
  const associatedTasks = store.mergedTasks.value.filter(t => t.projectId.value === project.id);

  // Local edit state
  const editDescription = useSignal(description);
  const editRequester = useSignal(requester);
  const editKeyDates = useSignal<{ name: string; date: string; color?: string; icon?: string }[]>(
    keyDates.map(kd => ({ name: kd.name, date: kd.date, color: kd.color, icon: kd.icon })),
  );
  const editKeyLinks = useSignal<{ name: string; url: string }[]>(
    keyLinks.map(kl => ({ ...kl })),
  );

  function handleEdit() {
    editDescription.value = description;
    editRequester.value = requester;
    editKeyDates.value = keyDates.map(kd => ({ name: kd.name, date: kd.date, color: kd.color, icon: kd.icon }));
    editKeyLinks.value = keyLinks.map(kl => ({ ...kl }));
    editing.value = true;
  }

  async function handleSave() {
    await store.persistProjectEdit(project!.id, 'description', editDescription.value || undefined);
    await store.persistProjectEdit(project!.id, 'requester', editRequester.value || undefined);
    await store.persistProjectEdit(project!.id, 'keyDates', editKeyDates.value.length > 0
      ? editKeyDates.value.map(kd => ({ name: kd.name, date: kd.date, color: kd.color, icon: kd.icon }))
      : undefined);
    await store.persistProjectEdit(project!.id, 'keyLinks', editKeyLinks.value.length > 0 ? editKeyLinks.value : undefined);
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
        width: `${RIGHT_PANEL_WIDTH}px`,
        minWidth: `${RIGHT_PANEL_WIDTH}px`,
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
          {project.color && (
            <span style={{
              width: '12px', height: '12px', borderRadius: '3px', background: project.color, flexShrink: 0,
            }} />
          )}
          {editName.value ? (
            <input
              ref={(el: HTMLInputElement | null) => { nameInputRef = el; }}
              type="text"
              value={editNameValue.value}
              onInput={(e) => { editNameValue.value = (e.target as HTMLInputElement).value; }}
              onBlur={saveName}
              onKeyDown={handleNameKeyDown}
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
              onClick={startEditName}
              title="Click to edit name"
            >{project.name}</span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '2px', flexShrink: 0 }}>
          {editing.value ? (
            <>
              <button
                onClick={handleSave}
                title="Save changes"
                style={{
                  padding: '3px 8px', border: '1px solid var(--interactive-accent, #4A90D9)',
                  borderRadius: '4px', background: 'var(--interactive-accent, #4A90D9)', color: '#fff',
                  cursor: 'pointer', fontSize: '11px',
                }}
              >Save</button>
              <button
                onClick={handleCancel}
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
              <button
                onClick={handleEdit}
                title="Edit project details"
                style={{
                  padding: '2px 4px', border: 'none', borderRadius: '3px',
                  background: 'transparent', cursor: 'pointer', fontSize: '13px',
                  color: 'var(--text-muted, #999)', lineHeight: 1,
                }}
              >✎</button>
              <button
                onClick={() => props.onDelete?.(project.id, project.name)}
                title="Delete project"
                style={{
                  padding: '2px 4px', border: 'none', borderRadius: '3px',
                  background: 'transparent', cursor: 'pointer', fontSize: '13px',
                  color: 'var(--text-error, #e00)', lineHeight: 1,
                }}
              >🗑</button>
              <button
                onClick={() => store.selectEntity(null)}
                title="Close detail panel"
                style={{
                  padding: '2px 4px', border: 'none', borderRadius: '3px',
                  background: 'transparent', cursor: 'pointer', fontSize: '14px',
                  color: 'var(--text-muted, #999)', lineHeight: 1,
                }}
              >✕</button>
            </>
          )}
        </div>
      </div>

      {/* Status */}
      <div style={fieldStyle}>
        <div style={labelStyle}>Status</div>
        <select
          value={projectOverrides?.status ?? project.status ?? 'pending'}
          onChange={(e) => store.setProjectStatus(project.id, (e.target as HTMLSelectElement).value)}
          style={{
            width: '100%', fontSize: '12px', padding: '3px 6px', borderRadius: '4px',
            border: '1px solid var(--background-modifier-border, #ccc)',
            background: 'var(--background-primary, #fff)', color: 'var(--text-normal, #333)',
            cursor: 'pointer',
          }}
        >
          {STATUS_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Draggable create-task area */}
      <div
        draggable={true}
        onDragStart={(e) => {
          e.dataTransfer?.setData('text/plain', JSON.stringify({ projectId: project.id, projectName: project.name }));
        }}
        class="gantt-drag-create-area"
        title="Drag to person timeline to create a new task for this project"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 10px',
          marginBottom: '12px',
          border: '2px dashed var(--interactive-accent, #4A90D9)',
          borderRadius: '6px',
          background: 'rgba(74, 144, 217, 0.04)',
          cursor: 'grab',
          fontSize: '12px',
          color: 'var(--interactive-accent, #4A90D9)',
          transition: 'background 0.15s, border-color 0.15s',
        }}
      >
        <span style={{ fontSize: '14px', lineHeight: 1, flexShrink: 0 }}>⠿</span>
        <span style={{ fontWeight: 500 }}>Drag to person timeline to create task</span>
      </div>

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
          <div style={valueStyle}>{description || '—'}</div>
        )}
      </div>

      {/* Requester */}
      <div style={fieldStyle}>
        <div style={labelStyle}>Requester</div>
        {editing.value ? (
          <input
            type="text"
            value={editRequester.value}
            onInput={(e) => { editRequester.value = (e.target as HTMLInputElement).value; }}
            style={{
              width: '100%', boxSizing: 'border-box', fontSize: '12px',
              padding: '4px', borderRadius: '4px', border: '1px solid var(--background-modifier-border, #ccc)',
              background: 'var(--background-primary, #fff)', color: 'var(--text-normal, #333)',
            }}
            placeholder="Stakeholder or department..."
          />
        ) : (
          <div style={valueStyle}>{requester || '—'}</div>
        )}
      </div>

      {/* Key Dates */}
      <div style={fieldStyle}>
        <div style={labelStyle}>Key Dates</div>
        {editing.value ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {/* Preset buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '4px' }}>
              {KEY_DATE_PRESETS.map(preset => (
                <button
                  key={preset.name}
                  onClick={() => {
                    editKeyDates.value = [...editKeyDates.value, {
                      name: preset.name,
                      date: todayString(),
                      color: preset.color,
                      icon: preset.icon,
                    }];
                  }}
                  title={preset.name}
                  style={{
                    padding: '2px 6px', fontSize: '10px', borderRadius: '3px', cursor: 'pointer',
                    border: `1px solid ${preset.color}`,
                    background: 'var(--background-primary, #fff)',
                    color: preset.color,
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span style={{
                    display: 'inline-block', width: '12px', height: '12px', lineHeight: '12px',
                    textAlign: 'center', fontSize: '9px', borderRadius: '2px',
                    background: preset.color, color: '#fff', marginRight: '3px',
                  }}>
                    {preset.icon}
                  </span>
                  {preset.name}
                </button>
              ))}
            </div>
            {/* Key date rows */}
            {editKeyDates.value.map((kd, i) => (
              <div key={i} style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                <input
                  type="color"
                  value={kd.color ?? '#E5C07B'}
                  onInput={(e) => {
                    const next = [...editKeyDates.value];
                    next[i] = { ...next[i], color: (e.target as HTMLInputElement).value };
                    editKeyDates.value = next;
                  }}
                  title="Marker color"
                  style={{ width: '22px', height: '22px', padding: '0', border: 'none', borderRadius: '3px', cursor: 'pointer', flexShrink: 0 }}
                />
                <input
                  type="text"
                  value={kd.icon ?? ''}
                  onInput={(e) => {
                    const next = [...editKeyDates.value];
                    next[i] = { ...next[i], icon: (e.target as HTMLInputElement).value || undefined };
                    editKeyDates.value = next;
                  }}
                  placeholder="◆"
                  maxLength={2}
                  title="Icon (1-2 chars shown in marker)"
                  style={{
                    width: '22px', fontSize: '11px', padding: '3px', textAlign: 'center', borderRadius: '3px', flexShrink: 0,
                    border: '1px solid var(--background-modifier-border, #ccc)',
                    background: 'var(--background-primary, #fff)', color: 'var(--text-normal, #333)',
                  }}
                />
                <input
                  type="text"
                  value={kd.name}
                  onInput={(e) => {
                    const next = [...editKeyDates.value];
                    next[i] = { ...next[i], name: (e.target as HTMLInputElement).value };
                    editKeyDates.value = next;
                  }}
                  placeholder="Name"
                  style={{
                    flex: 1, fontSize: '11px', padding: '3px', borderRadius: '3px',
                    border: '1px solid var(--background-modifier-border, #ccc)',
                    background: 'var(--background-primary, #fff)', color: 'var(--text-normal, #333)',
                  }}
                />
                <input
                  type="date"
                  value={kd.date}
                  onInput={(e) => {
                    const next = [...editKeyDates.value];
                    next[i] = { ...next[i], date: (e.target as HTMLInputElement).value };
                    editKeyDates.value = next;
                  }}
                  style={{
                    width: '110px', fontSize: '11px', padding: '3px', borderRadius: '3px', flexShrink: 0,
                    border: '1px solid var(--background-modifier-border, #ccc)',
                    background: 'var(--background-primary, #fff)', color: 'var(--text-normal, #333)',
                  }}
                />
                <button
                  onClick={() => {
                    editKeyDates.value = editKeyDates.value.filter((_, idx) => idx !== i);
                  }}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px',
                    color: 'var(--text-error, #e00)', padding: '0 2px', lineHeight: 1, flexShrink: 0,
                  }}
                  title="Remove key date"
                >x</button>
              </div>
            ))}
            <button
              onClick={() => {
                editKeyDates.value = [...editKeyDates.value, { name: '', date: '', color: '#E5C07B', icon: '' }];
              }}
              style={{
                padding: '2px 8px', border: '1px dashed var(--background-modifier-border, #ccc)',
                borderRadius: '4px', background: 'transparent', cursor: 'pointer', fontSize: '11px',
                marginTop: '2px',
              }}
            >+ Custom Key Date</button>
          </div>
        ) : (
          <div>
            {keyDates.length > 0 ? (
              keyDates.map((kd, i) => (
                <div key={i} style={{ fontSize: '12px', padding: '2px 0', display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <span style={{
                    display: 'inline-block', width: '10px', height: '10px', borderRadius: '2px',
                    background: kd.color ?? 'var(--gantt-key-date-color, #E5C07B)', flexShrink: 0,
                    transform: 'rotate(45deg)',
                  }} />
                  {kd.icon && (
                    <span style={{ fontSize: '9px', fontWeight: 'bold', color: kd.color ?? 'var(--text-muted, #999)', flexShrink: 0 }}>
                      {kd.icon}
                    </span>
                  )}
                  <span style={{ color: 'var(--text-muted, #999)', minWidth: '80px' }}>{kd.date}</span>
                  <span>{kd.name}</span>
                </div>
              ))
            ) : (
              <div style={valueStyle}>—</div>
            )}
          </div>
        )}
      </div>

      {/* Key Links */}
      <div style={fieldStyle}>
        <div style={labelStyle}>Key Links</div>
        {editing.value ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {editKeyLinks.value.map((kl, i) => (
              <div key={i} style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <input
                  type="text"
                  value={kl.name}
                  onInput={(e) => {
                    const next = [...editKeyLinks.value];
                    next[i] = { ...next[i], name: (e.target as HTMLInputElement).value };
                    editKeyLinks.value = next;
                  }}
                  placeholder="Link name"
                  style={{
                    width: '80px', fontSize: '11px', padding: '3px', borderRadius: '3px', flexShrink: 0,
                    border: '1px solid var(--background-modifier-border, #ccc)',
                    background: 'var(--background-primary, #fff)', color: 'var(--text-normal, #333)',
                  }}
                />
                <input
                  type="url"
                  value={kl.url}
                  onInput={(e) => {
                    const next = [...editKeyLinks.value];
                    next[i] = { ...next[i], url: (e.target as HTMLInputElement).value };
                    editKeyLinks.value = next;
                  }}
                  placeholder="https://..."
                  style={{
                    flex: 1, fontSize: '11px', padding: '3px', borderRadius: '3px',
                    border: '1px solid var(--background-modifier-border, #ccc)',
                    background: 'var(--background-primary, #fff)', color: 'var(--text-normal, #333)',
                  }}
                />
                <button
                  onClick={() => {
                    editKeyLinks.value = editKeyLinks.value.filter((_, idx) => idx !== i);
                  }}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px',
                    color: 'var(--text-error, #e00)', padding: '0 2px', lineHeight: 1, flexShrink: 0,
                  }}
                  title="Remove link"
                >x</button>
              </div>
            ))}
            <button
              onClick={() => {
                editKeyLinks.value = [...editKeyLinks.value, { name: '', url: '' }];
              }}
              style={{
                padding: '2px 8px', border: '1px dashed var(--background-modifier-border, #ccc)',
                borderRadius: '4px', background: 'transparent', cursor: 'pointer', fontSize: '11px',
                marginTop: '2px',
              }}
            >+ Add Link</button>
          </div>
        ) : (
          <div>
            {keyLinks.length > 0 ? (
              keyLinks.map((kl, i) => (
                <div key={i} style={{ fontSize: '12px', padding: '2px 0' }}>
                  <a
                    href={kl.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: 'var(--interactive-accent, #4A90D9)',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span style={{ fontSize: '10px' }}>↗</span>
                    {kl.name || kl.url}
                  </a>
                </div>
              ))
            ) : (
              <div style={valueStyle}>—</div>
            )}
          </div>
        )}
      </div>

      {/* Associated Tasks */}
      <div style={fieldStyle}>
        <div style={labelStyle}>Tasks ({associatedTasks.length})</div>
        {associatedTasks.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {associatedTasks.map(t => (
              <div
                key={t.id}
                onClick={() => store.selectEntity({ type: 'task', id: t.id })}
                style={{
                  fontSize: '12px',
                  padding: '3px 6px',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
                class="gantt-task-link-item"
                title="Click to view task details"
              >
                <StatusBadge status={t.status.value} />
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {t.title.value}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div style={valueStyle}>No tasks</div>
        )}
      </div>
    </div>
  );
}

const STATUS_OPTIONS: { value: string; label: string; color: string }[] = [
  { value: 'pending', label: 'Pending', color: '#888' },
  { value: 'in-progress', label: 'In Progress', color: '#2196f3' },
  { value: 'cancelled', label: 'Cancelled', color: '#e53935' },
  { value: 'pending-online', label: 'Pending Online', color: '#fb8c00' },
  { value: 'online', label: 'Online', color: '#00897b' },
  { value: 'completed', label: 'Completed', color: '#4caf50' },
];

function StatusBadge(props: { status: string }) {
  const opt = STATUS_OPTIONS.find(o => o.value === props.status);
  const color = opt?.color ?? '#888';
  const label = opt?.label ?? props.status;
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: '10px',
      fontSize: '11px',
      fontWeight: 500,
      color: '#fff',
      background: color,
      whiteSpace: 'nowrap',
    }}>{label}</span>
  );
}

function DetailPanel(props: { store: GanttStore; onDelete?: (taskId: string, title: string) => void }) {
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

  function handleTitleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') saveTitle();
    if (e.key === 'Escape') cancelTitle();
  }

  const sourceLabel = task.connectorId
    ? `Connector: ${task.connectorId}`
    : task.upstreamId
      ? 'Local override'
      : 'Manual entry';

  const sourceStyle = task.upstreamDeleted ? 'line-through' : 'normal';

  return (
    <div
      class="gantt-detail-panel"
      style={{
        width: `${RIGHT_PANEL_WIDTH}px`,
        minWidth: `${RIGHT_PANEL_WIDTH}px`,
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
        {editTitle.value ? (
          <input
            ref={(el: HTMLInputElement | null) => { titleInputRef = el; }}
            type="text"
            value={editTitleValue.value}
            onInput={(e) => { editTitleValue.value = (e.target as HTMLInputElement).value; }}
            onBlur={saveTitle}
            onKeyDown={handleTitleKeyDown}
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
          <div
            style={{ fontWeight: 'bold', fontSize: '14px', wordBreak: 'break-word', flex: 1, cursor: 'text' }}
            onClick={startEditTitle}
            title="Click to edit title"
          >
            {task.title.value}
          </div>
        )}
        <div style={{ display: 'flex', gap: '2px', flexShrink: 0, marginLeft: '4px' }}>
          <button
            onClick={() => props.onDelete?.(task.id, task.title.value)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px',
              lineHeight: 1, padding: '0 2px', color: 'var(--text-error, #e00)',
            }}
            title="Delete task"
          >🗑</button>
          <button
            onClick={() => store.selectEntity(null)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px',
              lineHeight: 1, padding: '0 2px', color: 'var(--text-muted, #999)',
            }}
            title="Close detail panel"
          >x</button>
        </div>
      </div>

      {/* Fields */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

        {/* Status */}
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted, #999)', marginBottom: '2px' }}>Status</div>
          <select
            value={task.status.value}
            onChange={(e) => store.setTaskStatus(task.id, (e.target as HTMLSelectElement).value)}
            style={{
              width: '100%', fontSize: '12px', padding: '3px 6px', borderRadius: '4px',
              border: '1px solid var(--background-modifier-border, #ccc)',
              background: 'var(--background-primary, #fff)', color: 'var(--text-normal, #333)',
              cursor: 'pointer',
            }}
          >
            {STATUS_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <FieldRow label="Start" value={task.startDate.value ?? '-'} />
        <FieldRow label="End" value={task.endDate.value ?? '-'} />

        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted, #999)', marginBottom: '2px' }}>Progress</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              flex: 1,
              height: '6px',
              borderRadius: '3px',
              background: 'var(--background-modifier-border, #ccc)',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${(task.progress.value ?? 0) * 100}%`,
                background: task.progress.value === 1 ? 'var(--gantt-completed, #4caf50)' : 'var(--gantt-in-progress, #2196f3)',
                borderRadius: '3px',
              }} />
            </div>
            <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{Math.round((task.progress.value ?? 0) * 100)}%</span>
          </div>
        </div>

        <FieldRow label="Person" value={personName ?? '-'} />

        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted, #999)', marginBottom: '2px' }}>Project</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {project?.color && (
              <span style={{
                width: '10px', height: '10px', borderRadius: '2px', background: project.color, flexShrink: 0,
              }} />
            )}
            <span
              style={{ cursor: 'pointer', color: 'var(--interactive-accent, #4A90D9)' }}
              onClick={() => project && store.selectEntity({ type: 'project', id: project.id })}
              title="Click to view project details"
            >
              {project?.name ?? task.projectId.value ?? '-'}
            </span>
          </div>
        </div>

        {/* URL */}
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted, #999)', marginBottom: '2px' }}>Link</div>
          {task.url.value ? (
            <a
              href={task.url.value}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'var(--interactive-accent, #4A90D9)',
                textDecoration: 'none',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span style={{ fontSize: '10px' }}>↗</span>
              {task.url.value}
            </a>
          ) : (
            <div style={{ fontSize: '12px' }}>—</div>
          )}
        </div>

        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted, #999)', marginBottom: '2px' }}>Dependencies</div>
          <div style={{ fontSize: '12px' }}>
            {task.dependencies.value.length > 0
              ? task.dependencies.value.map(d => (
                  <div key={d} style={{ padding: '1px 0' }}>{d}</div>
                ))
              : '-'}
          </div>
        </div>

        {task.tags.value.length > 0 && (
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted, #999)', marginBottom: '2px' }}>Tags</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {task.tags.value.map(tag => (
                <span key={tag} style={{
                  padding: '1px 6px', borderRadius: '10px',
                  background: 'var(--background-modifier-border, #e0e0e0)', fontSize: '11px',
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

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

function FieldRow(props: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: '11px', color: 'var(--text-muted, #999)', marginBottom: '1px' }}>{props.label}</div>
      <div style={{ fontSize: '13px' }}>{props.value}</div>
    </div>
  );
}

// ============================================================
// ConfirmDialog — modal confirmation dialog
// ============================================================

function ConfirmDialog(props: {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') props.onCancel();
  }

  // Focus trap and Escape listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      class="gantt-confirm-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) props.onCancel();
      }}
    >
      <div
        class="gantt-confirm-dialog"
        style={{
          background: 'var(--background-primary, #fff)',
          borderRadius: '8px',
          padding: '24px',
          maxWidth: '400px',
          width: '90%',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          color: 'var(--text-normal, #333)',
        }}
      >
        <div style={{ marginBottom: '20px', fontSize: '14px', lineHeight: 1.5 }}>{props.message}</div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button
            onClick={props.onCancel}
            class="gantt-btn"
            style={{
              padding: '6px 16px',
              border: '1px solid var(--background-modifier-border, #ccc)',
              borderRadius: '4px',
              background: 'var(--background-secondary, #f5f5f5)',
              cursor: 'pointer',
              fontSize: '13px',
              color: 'var(--text-normal, #333)',
            }}
          >Cancel</button>
          <button
            onClick={props.onConfirm}
            class="gantt-btn gantt-btn-danger"
            style={{
              padding: '6px 16px',
              border: 'none',
              borderRadius: '4px',
              background: 'var(--text-error, #e53935)',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 500,
            }}
          >Delete</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PendingChangesPanel — shows local edits pending push
// ============================================================

function PendingChangesPanel(props: { store: GanttStore; onClose: () => void }) {
  const { store } = props;
  const changes = store.pendingChanges.value;
  const pushing = useSignal(false);
  const pushResults = useSignal<{ connectorId: string; success: boolean; error?: string }[] | null>(null);

  async function handlePush() {
    pushing.value = true;
    pushResults.value = null;
    try {
      const results = await store.pushChanges();
      pushResults.value = results;
    } finally {
      pushing.value = false;
    }
  }

  const stats = {
    added: changes.filter(c => c.changeType === 'added').length,
    modified: changes.filter(c => c.changeType === 'modified').length,
    deleted: changes.filter(c => c.changeType === 'deleted').length,
  };

  const changeTypeLabel = {
    added: 'New',
    modified: 'Updated',
    deleted: 'Deleted',
  };

  const changeTypeColor = {
    added: '#4caf50',
    modified: '#2196f3',
    deleted: '#e53935',
  };

  const changeTypeBadge = {
    added: 'NEW',
    modified: 'MOD',
    deleted: 'DEL',
  };

  return (
    <div
      class="gantt-confirm-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) props.onClose();
      }}
    >
      <div
        class="gantt-pending-panel"
        style={{
          background: 'var(--background-primary, #fff)',
          borderRadius: '8px',
          padding: '0',
          maxWidth: '560px',
          width: '90%',
          maxHeight: '75vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          color: 'var(--text-normal, #333)',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 24px 16px',
          borderBottom: changes.length > 0 ? '1px solid var(--background-modifier-border, #eee)' : 'none',
        }}>
          <div>
            <h3 style={{ margin: '0 0 4px', fontSize: '16px' }}>Changes to Push</h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted, #999)' }}>
              {stats.added > 0 && <span style={{ color: changeTypeColor.added, marginRight: '10px' }}>+{stats.added} new</span>}
              {stats.modified > 0 && <span style={{ color: changeTypeColor.modified, marginRight: '10px' }}>~{stats.modified} updated</span>}
              {stats.deleted > 0 && <span style={{ color: changeTypeColor.deleted }}>-{stats.deleted} deleted</span>}
              {changes.length === 0 && 'No pending changes'}
            </span>
          </div>
          <button
            onClick={props.onClose}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px',
              lineHeight: 1, padding: '0 2px', color: 'var(--text-muted, #999)',
            }}
          >x</button>
        </div>

        {/* Body - scrollable */}
        <div style={{ overflowY: 'auto', padding: '16px 24px', flex: 1 }}>
          {changes.length === 0 ? (
            <div style={{ color: 'var(--text-muted, #999)', fontSize: '13px', padding: '20px 0', textAlign: 'center' }}>
              No pending changes. All local modifications have been pushed.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {changes.map((change, i) => (
                <div
                  key={`${change.entityType}-${change.entityId}-${change.changeType}-${i}`}
                  class="gantt-change-card"
                  style={{
                    border: '1px solid var(--background-modifier-border, #e0e0e0)',
                    borderRadius: '6px',
                    padding: '12px',
                    fontSize: '12px',
                  }}
                >
                  {/* Card header: type badge + entity name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '1px 6px',
                      borderRadius: '3px',
                      fontSize: '9px',
                      fontWeight: 700,
                      color: '#fff',
                      background: changeTypeColor[change.changeType],
                      letterSpacing: '0.5px',
                      flexShrink: 0,
                    }}>
                      {changeTypeBadge[change.changeType]}
                    </span>
                    <span style={{
                      fontSize: '10px',
                      color: 'var(--text-muted, #999)',
                      textTransform: 'uppercase',
                      flexShrink: 0,
                    }}>
                      {change.entityType === 'task' ? 'Task' : 'Project'}
                    </span>
                    <span style={{
                      fontWeight: 600,
                      fontSize: '13px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      flex: 1,
                    }}>
                      {change.entityName}
                    </span>
                  </div>

                  {/* Modified: field changes */}
                  {change.changeType === 'modified' && change.fields && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      {change.fields.map((f, j) => (
                        <div key={j} style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                          <span style={{
                            color: 'var(--text-muted, #999)',
                            fontSize: '11px',
                            minWidth: '70px',
                            flexShrink: 0,
                          }}>
                            {f.label}:
                          </span>
                          <span style={{
                            color: 'var(--interactive-accent, #4A90D9)',
                            fontWeight: 500,
                          }}>
                            {f.field === 'keyDates'
                              ? `${(f.newValue as unknown[]).length} dates`
                              : f.field === 'keyLinks'
                                ? `${(f.newValue as unknown[]).length} links`
                                : f.field === 'tags'
                                  ? `[${(f.newValue as string[]).join(', ')}]`
                                  : f.field === 'dependencies'
                                    ? `[${(f.newValue as string[]).join(', ')}]`
                                    : String(f.newValue)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Added: summary info */}
                  {change.changeType === 'added' && change.addedSummary && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      {Object.entries(change.addedSummary).map(([key, val]) => (
                        <div key={key} style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                          <span style={{
                            color: 'var(--text-muted, #999)',
                            fontSize: '11px',
                            minWidth: '50px',
                            flexShrink: 0,
                          }}>
                            {key}:
                          </span>
                          <span style={{ color: '#4caf50', fontWeight: 500 }}>
                            {String(val)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Deleted: related info */}
                  {change.changeType === 'deleted' && (
                    <div style={{ fontSize: '11px', color: 'var(--text-error, #e53935)' }}>
                      {change.relatedInfo
                        ? `Will be deleted · ${change.relatedInfo}`
                        : 'Will be deleted'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with push button */}
        {changes.length > 0 && (
          <div style={{
            padding: '12px 24px',
            borderTop: '1px solid var(--background-modifier-border, #eee)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <button
              onClick={handlePush}
              disabled={pushing.value}
              class="gantt-btn"
              style={{
                padding: '8px 20px',
                border: 'none',
                borderRadius: '4px',
                background: pushing.value ? 'var(--background-modifier-border, #ccc)' : 'var(--interactive-accent, #4A90D9)',
                color: '#fff',
                cursor: pushing.value ? 'not-allowed' : 'pointer',
                fontSize: '13px',
                fontWeight: 500,
              }}
            >
              {pushing.value ? 'Pushing...' : `Push ${changes.length} Changes`}
            </button>
            {pushResults.value && (
              <span style={{ fontSize: '12px' }}>
                {pushResults.value.some(r => r.success)
                  ? `Pushed to ${pushResults.value.filter(r => r.success).map(r => r.connectorId).join(', ')}`
                  : 'Push failed'}
                {pushResults.value.some(r => !r.success) && (
                  <span style={{ color: 'var(--text-error, #e00)' }}>
                    {' · '}
                    {pushResults.value.filter(r => !r.success).map(r => r.error).join('; ')}
                  </span>
                )}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function DualPane(props: {
  store: GanttStore;
  onTaskPointerDown: (e: PointerEvent, taskId: string, edge: 'left' | 'right' | 'body', paneType: 'person' | 'project') => void;
  onKeyDatePointerDown?: (e: PointerEvent, projectId: string, keyDateIndex: number, currentDate: string) => void;
  onDrop: (e: DragEvent) => void;
  onDragOver: (e: DragEvent) => void;
  onDeleteTask?: (taskId: string, title: string) => void;
  onDeleteProject?: (projectId: string, name: string) => void;
}) {
  const { store } = props;

  // Vertical scroll guard flags to prevent feedback loops
  let personVGuardActive = false;
  let personVGuardTimer: ReturnType<typeof setTimeout> | null = null;
  let projectVGuardActive = false;
  let projectVGuardTimer: ReturnType<typeof setTimeout> | null = null;

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

  const sel = store.selectedEntity.value;
  const showTaskDetail = sel?.type === 'task';
  const showProjectDetail = sel?.type === 'project';

  return (
    <div class="gantt-dual-pane" style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Main content column */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* Person Gantt (upper) */}
          <div style={{ flex: `0 0 ${paneRatio.value * 100}%`, display: 'flex', overflow: 'hidden' }}>
            <GanttPane
              store={store}
              type="person"
              scrollLeft={store.sharedScrollLeft.value}
              scrollTop={store.personScrollTop.value}
              onScroll={(sl, st) => {
                store.sharedScrollLeft.value = sl;
                if (!personVGuardActive) {
                  personVGuardActive = true;
                  store.personScrollTop.value = st;
                  if (personVGuardTimer) clearTimeout(personVGuardTimer);
                  personVGuardTimer = setTimeout(() => {
                    personVGuardActive = false;
                  }, 100);
                }
              }}
              onTaskPointerDown={props.onTaskPointerDown}
              onDrop={props.onDrop}
              onDragOver={props.onDragOver}
            />
            {/* Unassigned only when no detail shown */}
            {!showTaskDetail && !showProjectDetail && <UnassignedPanel store={store} onDragStart={() => {}} />}
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
              scrollTop={store.projectScrollTop.value}
              onScroll={(sl, st) => {
                store.sharedScrollLeft.value = sl;
                if (!projectVGuardActive) {
                  projectVGuardActive = true;
                  store.projectScrollTop.value = st;
                  if (projectVGuardTimer) clearTimeout(projectVGuardTimer);
                  projectVGuardTimer = setTimeout(() => {
                    projectVGuardActive = false;
                  }, 100);
                }
              }}
              onTaskPointerDown={props.onTaskPointerDown}
              onKeyDatePointerDown={props.onKeyDatePointerDown}
              onDrop={props.onDrop}
              onDragOver={props.onDragOver}
            />
          </div>
        </div>

        {/* Detail sidebar — appears when task or project is selected */}
        {showTaskDetail && <DetailPanel store={store} onDelete={props.onDeleteTask} />}
        {showProjectDetail && <ProjectDetail store={store} onDelete={props.onDeleteProject} />}
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

  // Confirmation dialog state
  const confirmState = useSignal<{ message: string; onConfirm: () => void } | null>(null);
  const showPendingPanel = useSignal(false);

  function handleDeleteTask(taskId: string, title: string) {
    confirmState.value = {
      message: `Are you sure you want to delete task "${title}"? This action can be undone until changes are pushed upstream.`,
      onConfirm: () => {
        store.deleteTask(taskId);
        confirmState.value = null;
      },
    };
  }

  function handleDeleteProject(projectId: string, name: string) {
    const taskCount = store.mergedTasks.value.filter(t => t.projectId.value === projectId).length;
    confirmState.value = {
      message: `Are you sure you want to delete project "${name}"?${taskCount > 0 ? ` This will also delete ${taskCount} associated task(s).` : ''} This action can be undone until changes are pushed upstream.`,
      onConfirm: () => {
        store.deleteProject(projectId);
        confirmState.value = null;
      },
    };
  }

  // Keyboard handler for Escape and Undo
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (confirmState.value) {
          confirmState.value = null;
          return;
        }
        if (showPendingPanel.value) {
          showPendingPanel.value = false;
          return;
        }
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

  function handleTaskPointerDown(e: PointerEvent, taskId: string, edge: 'left' | 'right' | 'body', paneType: 'person' | 'project') {
    dragHandler.onTaskPointerDown(e, taskId, edge, paneType);
  }

  function handleKeyDatePointerDown(e: PointerEvent, projectId: string, keyDateIndex: number, currentDate: string) {
    dragHandler.onKeyDatePointerDown(e, projectId, keyDateIndex, currentDate);
  }

  function handleDrop(e: DragEvent, bodyOriginPx?: number) {
    dragHandler.handleTimelineDrop(e, bodyOriginPx);
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
        <button
          class="gantt-btn"
          title="Re-run all connectors to fetch latest data"
          style={{
            padding: '4px 12px',
            border: '1px solid var(--background-modifier-border, #ccc)',
            borderRadius: '4px',
            background: 'var(--background-secondary, #f5f5f5)',
            cursor: 'pointer',
            fontSize: '12px',
          }}
          onClick={async () => {
            const view = store.views.value.find(v => v.id === store.currentViewId.value);
            if (!view) return;
            for (const cid of view.connectors) {
              await store.refreshConnector(cid);
            }
          }}
        >
          Refresh
        </button>
        <button
          class="gantt-btn"
          title="View and push pending local changes"
          style={{
            padding: '4px 12px',
            border: '1px solid var(--interactive-accent, #4A90D9)',
            borderRadius: '4px',
            background: store.pendingChanges.value.length > 0 ? 'var(--interactive-accent, #4A90D9)' : 'var(--background-secondary, #f5f5f5)',
            color: store.pendingChanges.value.length > 0 ? '#fff' : 'var(--text-normal, #333)',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: store.pendingChanges.value.length > 0 ? 500 : 'normal',
          }}
          onClick={() => { showPendingPanel.value = true; }}
        >
          Pending ({store.pendingChanges.value.length})
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
        onKeyDatePointerDown={handleKeyDatePointerDown}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDeleteTask={handleDeleteTask}
        onDeleteProject={handleDeleteProject}
      />

      {/* Confirm dialog */}
      {confirmState.value && (
        <ConfirmDialog
          message={confirmState.value.message}
          onConfirm={confirmState.value.onConfirm}
          onCancel={() => { confirmState.value = null; }}
        />
      )}

      {/* Pending changes panel */}
      {showPendingPanel.value && (
        <PendingChangesPanel
          store={store}
          onClose={() => { showPendingPanel.value = false; }}
        />
      )}
    </div>
  );
}
