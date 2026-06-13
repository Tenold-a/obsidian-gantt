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
import { daysBetween, addDays, todayString, isValidDate, parseICS, classifyICSEvents } from '@obsidian-gantt/core';
import { Icon } from './icon';
import { createDragHandler, dragState } from './drag';
import {
  TIMELINE_ORIGIN,
  dateToAbsolutePixel,
  absolutePixelToDate,
} from './components';
import { TaskDetail } from './TaskDetail';
import { ProjectDetail } from './ProjectDetail';
import { PersonDetail } from './PersonDetail';
import { FilterMultiSelect } from './FilterMultiSelect';
import { UnassignedPanel } from './UnassignedPanel';
import { ColorSwatchPicker } from './ColorSwatchPicker';
import {
  DAY_WIDTH,
  ROW_HEIGHT,
  LANE_OFFSET,
  LEFT_PANEL_WIDTH,
  RIGHT_PANEL_WIDTH,
  GRID_BUFFER_PX,
  DEFAULT_COLORS,
  getDefaultColor,
  STATUS_OPTIONS,
  PRESET_COLORS,
  KEY_DATE_PRESETS,
  hashColor,
} from './constants';

/** Convert a date to absolute pixel from TIMELINE_ORIGIN. Returns 0 for invalid dates. */
function dateToPx(date: string): number {
  if (!isValidDate(date)) return 0;
  return dateToAbsolutePixel(date, DAY_WIDTH);
}

/** Convert absolute pixel to date. Returns empty string for invalid pixels. */
function pxToDate(px: number): string {
  if (!isFinite(px)) return '';
  return absolutePixelToDate(px, DAY_WIDTH);
}

// ============================================================
// TaskList — left sidebar showing row labels
// ============================================================

function TaskList(props: {
  labels: { key: string; name: string; color?: string; position?: string; positionColor?: string; tooltip?: string; tags?: string[]; tagColors?: Map<string, string> }[];
  rowHeights: number[];
  scrollTop?: number;
  highlightedRowKeys?: Set<string>;
  dimmedRowKeys?: Set<string>;
  selectedRowKey?: string | null;
  onRowClick?: (key: string) => void;
  headerContent?: any;
  width?: number;
  onScroll?: (scrollTop: number) => void;
}) {
  const panelWidth = props.width ?? 180;
  const totalRowsHeight = props.rowHeights.reduce((a, b) => a + b, 0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollGuard = useRef(false);

  // Sync scrollTop from prop → element (when Timeline drives the scroll)
  useEffect(() => {
    if (scrollRef.current && props.scrollTop !== undefined) {
      scrollGuard.current = true;
      scrollRef.current.scrollTop = props.scrollTop;
      requestAnimationFrame(() => { scrollGuard.current = false; });
    }
  }, [props.scrollTop]);

  function handleScroll(e: Event) {
    if (scrollGuard.current) return;
    const el = e.currentTarget as HTMLDivElement;
    props.onScroll?.(el.scrollTop);
  }

  return (
    <div
      class="gantt-task-list"
      style={{
        width: `${panelWidth}px`,
        minWidth: `${panelWidth}px`,
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid var(--gantt-grid-line-week, #c0c0c0)',
      }}
    >
      {/* Header — fixed */}
      <div style={{ height: '44px', borderBottom: '1px solid var(--gantt-grid-line-day, #e0e0e0)', display: 'flex', alignItems: 'center', paddingLeft: '8px', paddingRight: '8px', background: 'var(--background-primary, #ffffff)', flexShrink: 0 }}>
        {props.headerContent}
      </div>
      {/* Scrollable rows — synced bidirectionally with timeline */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
        onScroll={handleScroll}
      >
        <div style={{ height: `${totalRowsHeight}px` }}>
        {props.labels.map((label, i) => {
          const isHighlighted = props.highlightedRowKeys?.has(label.key) ?? false;
          const isDimmed = props.dimmedRowKeys?.has(label.key) ?? false;
          const isSelected = props.selectedRowKey === label.key;
          const h = props.rowHeights[i] ?? ROW_HEIGHT;
          return (
            <div
              key={label.key}
              class={`gantt-task-list-row ${isSelected ? 'selected' : ''} ${isHighlighted ? 'highlighted' : ''} ${isDimmed ? 'dimmed' : ''}`}
              style={{
                height: `${h}px`,
                borderBottom: '1px solid var(--gantt-grid-line-day, #e0e0e0)',
                opacity: isDimmed ? 0.4 : 1,
                background: isSelected ? 'var(--gantt-selected-row-bg, rgba(255, 107, 53, 0.12))'
                  : isHighlighted ? 'var(--gantt-row-highlight-bg, rgba(74, 144, 217, 0.08))' : 'transparent',
                outline: isSelected ? '2px solid var(--gantt-selected-border, #FF6B35)' : 'none',
                outlineOffset: '-2px',
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
              {label.tags && label.tags.length > 0 && (
                <span style={{ display: 'flex', gap: '3px', marginLeft: 'auto', flexShrink: 0 }}>
                  {label.tags.map(tag => (
                    <span
                      key={tag}
                      style={{
                        padding: '0 4px',
                        borderRadius: '3px',
                        fontSize: '9px',
                        lineHeight: '16px',
                        background: label.tagColors?.get(tag) ?? 'var(--background-modifier-border, #e0e0e0)',
                        color: '#fff',
                        whiteSpace: 'nowrap',
                      }}
                    >{tag}</span>
                  ))}
                </span>
              )}
            </div>
          );
        })}
        </div>
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
  filterDimmedTaskIds: Set<string>;
  onRowClick: (key: string) => void;
  onTaskClick: (taskId: string) => void;
  onTaskPointerDown: (e: PointerEvent, taskId: string, edge: 'left' | 'right' | 'body', paneType: 'person' | 'project', laneIndex: number) => void;
  onKeyDatePointerDown?: (e: PointerEvent, projectId: string, keyDateIndex: number, currentDate: string) => void;
  onDrop: (e: DragEvent, bodyOriginPx?: number) => void;
  onDragOver: (e: DragEvent) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { store, groups, scrollLeft, scrollTop } = props;

  const paneType = props.groupKeyField === 'personId' ? 'person' : 'project';

  // Track visible viewport width for dynamic header/grid rendering
  const viewportWidth = useSignal(800);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    viewportWidth.value = el.clientWidth;
    const ro = new ResizeObserver(() => {
      viewportWidth.value = el.clientWidth;
    });
    ro.observe(el);
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
        if (startVal && isValidDate(startVal)) {
          const px = dateToPx(startVal);
          if (px < minAbsPx) minAbsPx = px;
        }
        if (endVal && isValidDate(endVal)) {
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
        if (startVal && isValidDate(startVal)) {
          const px = dateToPx(startVal);
          if (px > maxAbsPx) maxAbsPx = px;
        }
        if (endVal && isValidDate(endVal)) {
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

  // Sync scrollLeft from signal (for shared horizontal scroll between panes)
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = scrollLeft;
    }
  }, [scrollLeft]);

  // Sync scrollTop from signal (for programmatic vertical scroll e.g. locate button)
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = scrollTop;
    }
  }, [scrollTop]);

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
    if (p.id) {
      projectColorMap.set(p.id, p.color || getDefaultColor(p.id));
    }
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
      if (!startVal || !isValidDate(startVal)) continue;
      let endVal = task.endDate.value;
      if (!endVal || !isValidDate(endVal)) endVal = startVal;
      // Swap if end date is earlier than start date
      const effectiveStart = startVal <= endVal ? startVal : endVal;
      const effectiveEnd = startVal <= endVal ? endVal : startVal;
      const left = originToBody(dateToPx(effectiveStart));
      const right = originToBody(dateToPx(effectiveEnd));
      const width = Math.max(right - left, 12);
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
          holidayConfig={store.holidayConfig.value}
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
        <TimelineGrid dayWidth={DAY_WIDTH} scrollLeft={scrollLeft} viewportWidth={viewportWidth.value} bufferPx={GRID_BUFFER_PX} bodyOriginPx={bodyOriginPx} holidayConfig={store.holidayConfig.value} />

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
          const isSelectedRow = paneType === 'project' && group.key === store.selectedProjectId.value;
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
                  : isSelectedRow ? 'var(--gantt-selected-row-bg, rgba(255, 107, 53, 0.12))'
                  : isHighlighted ? 'var(--gantt-row-highlight-bg, rgba(74, 144, 217, 0.08))' : 'transparent',
                outline: isSelectedRow ? '2px solid var(--gantt-selected-border, #FF6B35)'
                  : dragHovering ? '2px dashed var(--gantt-drag-hover-border, #4A90D9)' : 'none',
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
              isSelected: task.id === store.selectedTaskId.value,
              isDimmed: (hasSelection && !highlightedIds.has(task.id)) || (paneType === 'person' && props.filterDimmedTaskIds.has(task.id)),
              isHovered: task.id === store.hoveredTaskId.value,
              isDragging: dragState.value?.taskId === task.id && dragState.value?.dragMode === 'task',
              progress: task.progress.value,
              status: task.status.value,
            }}
            rowHeight={ROW_HEIGHT}
            laneOffset={LANE_OFFSET}
            onPointerDown={props.onTaskPointerDown}
            onClick={props.onTaskClick}
            startDate={task.startDate.value}
            endDate={task.endDate.value}
            bodyOriginPx={bodyOriginPx}
            dayWidth={DAY_WIDTH}
            holidayConfig={store.holidayConfig.value}
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
          return [...project.keyDates]
            .sort((a, b) => a.date.localeCompare(b.date))
            .map((kd, ki) => (
            <KeyDateMarker
              key={`${projectId}-kd-${ki}`}
              leftPx={originToBody(dateToPx(kd.date))}
              groupTopY={layout.startY}
              groupHeight={layout.height}
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
            ? ghostLayout.startY + (ROW_HEIGHT - barHeight) / 2 + (ds.laneIndex ?? 0) * LANE_OFFSET
            : ds.rowIndex * ROW_HEIGHT + (ROW_HEIGHT - barHeight) / 2 + (ds.laneIndex ?? 0) * LANE_OFFSET;
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
  onTaskPointerDown: (e: PointerEvent, taskId: string, edge: 'left' | 'right' | 'body', paneType: 'person' | 'project', laneIndex: number) => void;
  onKeyDatePointerDown?: (e: PointerEvent, projectId: string, keyDateIndex: number, currentDate: string) => void;
  onDrop: (e: DragEvent) => void;
  onDragOver: (e: DragEvent) => void;
}) {
  const { store, type } = props;
  const rawGroups = type === 'person' ? store.personGroups.value : store.projectGroups.value;

  // Position editor state
  const showPosEditor = useSignal(false);
  const posEditorItems = useSignal<string[]>([]);
  const posEditorButtonRef = useRef<HTMLButtonElement | null>(null);
  const posDragIndex = useSignal<number | null>(null);
  const posDragOverIndex = useSignal<number | null>(null);

  // Sidebar resize state
  const isResizingSidebar = useSignal(false);

  // TaskList scroll guard — prevents feedback loop when Timeline drives the scroll
  let taskListVGuardActive = false;
  let taskListVGuardTimer: ReturnType<typeof setTimeout> | null = null;

  // Apply project filtering — null = no filter active, Set = active filter
  const filterMatches = store.filteredProjectGroupKeys.value;
  const filterActive = filterMatches !== null;
  const filterDimmedIds = store.filterDimmedTaskIds.value;
  const groups = filterActive && type === 'project'
    ? rawGroups.filter(g => filterMatches!.has((g as ProjectGroup).projectId))
    : rawGroups;

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
        tags: (store.mergedProjects.value.find(p => p.id === key)?.tags as string[] | undefined),
        tagColors: new Map(store.tagDefinitions.value.map(t => [t.name, t.color] as [string, string])),
      };
    }),
    [groups],
  );

  // Compute row heights with lane expansion for overlapping bars
  // Uses pixel-based lane assignment (matching Timeline's groupLayout) to ensure
  // the TaskList row heights are consistent with the timeline bar layout.
  const groupHeights = useMemo(() => {
    return groups.map(group => {
      const ranges: Array<{ left: number; right: number }> = [];
      for (const task of group.tasks) {
        const startVal = task.startDate.value;
        if (!startVal || !isValidDate(startVal)) continue;
        let endVal = task.endDate.value;
        if (!endVal || !isValidDate(endVal)) endVal = startVal;
        // Swap if end date is earlier than start date
        const effectiveStart = startVal <= endVal ? startVal : endVal;
        const effectiveEnd = startVal <= endVal ? endVal : startVal;
        const left = dateToPx(effectiveStart);
        const right = dateToPx(effectiveEnd);
        const width = Math.max(right - left, 12);
        ranges.push({ left, right: left + width });
      }
      ranges.sort((a, b) => a.left - b.left);

      const lanes: number[] = []; // lanes[i] = end pixel of last bar in lane i
      for (const dr of ranges) {
        let assigned = false;
        for (let li = 0; li < lanes.length; li++) {
          if (dr.left >= lanes[li]) {
            lanes[li] = dr.right;
            assigned = true;
            break;
          }
        }
        if (!assigned) lanes.push(dr.right);
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

  function handleSidebarResizePointerDown(e: PointerEvent) {
    e.preventDefault();
    isResizingSidebar.value = true;
    const startX = e.clientX;
    const startWidth = store.leftPanelWidth.value;

    function onMove(ev: PointerEvent) {
      const dx = ev.clientX - startX;
      const newWidth = Math.min(400, Math.max(120, startWidth + dx));
      store.leftPanelWidth.value = newWidth;
    }

    function onUp() {
      isResizingSidebar.value = false;
      store.saveSettings();
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
    }

    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
  }

  return (
    <div class="gantt-pane" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
      <TaskList
        labels={labels}
        rowHeights={groupHeights}
        scrollTop={props.scrollTop}
        highlightedRowKeys={highlightedRowKeys}
        dimmedRowKeys={dimmedRowKeys}
        selectedRowKey={type === 'project' ? store.selectedProjectId.value : (store.selectedEntity.value?.type === 'person' ? store.selectedEntity.value.id : null)}
        onRowClick={handleRowClick}
        width={store.leftPanelWidth.value}
        onScroll={(st) => {
          if (taskListVGuardActive) return;
          taskListVGuardActive = true;
          if (type === 'person') {
            store.personScrollTop.value = st;
          } else {
            store.projectScrollTop.value = st;
          }
          if (taskListVGuardTimer) clearTimeout(taskListVGuardTimer);
          taskListVGuardTimer = setTimeout(() => { taskListVGuardActive = false; }, 100);
        }}
        headerContent={type === 'person' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
            <button
              class="gantt-sort-toggle"
              onClick={() => {
                store.personSortMode.value = store.personSortMode.value === 'name' ? 'position' : 'name';
                store.saveSettings();
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
            {store.personSortMode.value === 'position' && (
              <div style={{ position: 'relative' }}>
                <button
                  ref={posEditorButtonRef}
                  onClick={() => {
                    if (showPosEditor.value) {
                      showPosEditor.value = false;
                      return;
                    }
                    // Collect unique positions from person data and merge with current order
                    const existing = new Set(store.positionOrder.value);
                    for (const g of rawGroups) {
                      const pg = g as PersonGroup;
                      if (pg.position) existing.add(pg.position);
                    }
                    posEditorItems.value = [...existing];
                    showPosEditor.value = true;
                  }}
                  title="Edit position order"
                  style={{
                    padding: '2px 6px',
                    border: '1px solid var(--background-modifier-border, #ccc)',
                    borderRadius: '4px',
                    background: showPosEditor.value ? 'var(--interactive-accent, #4A90D9)' : 'var(--background-secondary, #f5f5f5)',
                    color: showPosEditor.value ? '#fff' : 'var(--text-normal, #333)',
                    cursor: 'pointer',
                    fontSize: '11px',
                  }}
                >
                  <Icon name="settings" size={13} />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
            <button
              class="gantt-sort-toggle"
              onClick={() => {
                store.projectSortMode.value = store.projectSortMode.value === 'name' ? 'time' : 'name';
                store.saveSettings();
              }}
              title={`Sort: ${store.projectSortMode.value === 'name' ? 'by name' : 'by time'}`}
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
              Sort: {store.projectSortMode.value === 'name' ? 'Name' : 'Time'}
            </button>
            {store.projectSortMode.value === 'time' && (
              <input
                type="text"
                value={store.projectSortKeyDates.value.join(', ')}
                onInput={(e) => {
                  const raw = (e.target as HTMLInputElement).value;
                  const names = raw.split(/[,，]/).map(s => s.trim()).filter(Boolean);
                  store.projectSortKeyDates.value = names.length > 0 ? names : ['上线时间'];
                  store.saveSettings();
                }}
                title="Key date names for sort priority (comma-separated)"
                placeholder="上线时间"
                style={{
                  padding: '2px 4px',
                  border: '1px solid var(--background-modifier-border, #ccc)',
                  borderRadius: '3px',
                  background: 'var(--background-primary, #fff)',
                  color: 'var(--text-normal, #333)',
                  fontSize: '10px',
                  width: '80px',
                }}
              />
            )}
          </div>
        )}
      />
      {/* Sidebar resize handle */}
      <div
        class="gantt-sidebar-resize-handle"
        style={{
          width: '4px',
          cursor: 'col-resize',
          background: isResizingSidebar.value
            ? 'var(--interactive-accent, #4A90D9)'
            : 'var(--background-modifier-border, #ccc)',
          flexShrink: 0,
          transition: isResizingSidebar.value ? 'none' : 'background 0.15s',
        }}
        onPointerDown={handleSidebarResizePointerDown}
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
        filterDimmedTaskIds={type === 'person' ? store.filterDimmedTaskIds.value : new Set()}
        onRowClick={handleRowClick}
        onTaskClick={handleTaskClick}
        onTaskPointerDown={props.onTaskPointerDown}
        onKeyDatePointerDown={props.onKeyDatePointerDown}
        onDrop={props.onDrop}
        onDragOver={props.onDragOver}
      />
      {/* Position editor popup — rendered to document.body via ref portal to escape any CSS containment in Obsidian */}
      {showPosEditor.value && (
        <div
          ref={(el: HTMLDivElement | null) => {
            if (el && el.parentElement !== document.body) {
              document.body.appendChild(el);
            }
          }}
        >
          {/* Backdrop */}
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 9998 }}
            onClick={() => { showPosEditor.value = false; }}
          />
          <div
            class="gantt-pos-editor-overlay"
            style={{
              position: 'fixed',
              top: (posEditorButtonRef.current?.getBoundingClientRect().bottom ?? 100) + 4 + 'px',
              left: (posEditorButtonRef.current?.getBoundingClientRect().left ?? 200) + 'px',
              zIndex: 9999,
              background: 'var(--background-primary, #fff)',
              border: '1px solid var(--background-modifier-border, #ccc)',
              borderRadius: '6px',
              padding: '8px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
              minWidth: '180px',
              maxWidth: '260px',
              maxHeight: '320px',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: '11px', color: 'var(--text-muted, #999)', marginBottom: '6px', flexShrink: 0 }}>
              Drag to reorder positions:
            </div>
            <div style={{ overflowY: 'auto', flex: 1, minHeight: 0 }}>
              {posEditorItems.value.map((item, i) => (
                <div
                  key={item}
                  draggable
                  onDragStart={() => { posDragIndex.value = i; }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    posDragOverIndex.value = i;
                  }}
                  onDragEnd={() => {
                    if (posDragIndex.value !== null && posDragOverIndex.value !== null && posDragIndex.value !== posDragOverIndex.value) {
                      const next = [...posEditorItems.value];
                      const [removed] = next.splice(posDragIndex.value, 1);
                      next.splice(posDragOverIndex.value, 0, removed);
                      posEditorItems.value = next;
                    }
                    posDragIndex.value = null;
                    posDragOverIndex.value = null;
                  }}
                  onDrop={(e) => e.preventDefault()}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 6px',
                    borderRadius: '4px',
                    marginBottom: '2px',
                    fontSize: '12px',
                    cursor: 'grab',
                    background: posDragOverIndex.value === i
                      ? 'var(--interactive-accent, #4A90D9)'
                      : posDragIndex.value === i
                        ? 'var(--background-modifier-border, #e0e0e0)'
                        : 'transparent',
                    color: posDragOverIndex.value === i ? '#fff' : 'var(--text-normal, #333)',
                    transition: 'background 0.1s',
                    border: '1px solid transparent',
                    borderColor: posDragOverIndex.value === i ? 'var(--interactive-accent, #4A90D9)' : 'transparent',
                  }}
                >
                  <Icon name="grip-vertical" size={12} />
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item}</span>
                </div>
              ))}
              {posEditorItems.value.length === 0 && (
                <div style={{ fontSize: '11px', color: 'var(--text-muted, #999)', padding: '8px', textAlign: 'center' }}>
                  No positions found
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: '4px', marginTop: '6px', flexShrink: 0 }}>
              <button
                onClick={() => {
                  store.positionOrder.value = posEditorItems.value;
                  store.saveSettings();
                  showPosEditor.value = false;
                }}
                style={{
                  padding: '2px 10px',
                  border: 'none',
                  borderRadius: '4px',
                  background: 'var(--interactive-accent, #4A90D9)',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '11px',
                }}
              >
                Save
              </button>
              <button
                onClick={() => { showPosEditor.value = false; }}
                style={{
                  padding: '2px 10px',
                  border: '1px solid var(--background-modifier-border, #ccc)',
                  borderRadius: '4px',
                  background: 'transparent',
                  color: 'var(--text-muted, #999)',
                  cursor: 'pointer',
                  fontSize: '11px',
                }}
              >
                Cancel
              </button>
              {posEditorItems.value.length > 0 && (
                <button
                  onClick={() => {
                    posEditorItems.value = [];
                  }}
                  style={{
                    padding: '2px 10px',
                    border: '1px solid #E06C75',
                    borderRadius: '4px',
                    background: 'transparent',
                    color: '#E06C75',
                    cursor: 'pointer',
                    fontSize: '11px',
                    marginLeft: 'auto',
                  }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 7 hues × 4 lightness levels: red, orange, yellow, green, cyan, blue, purple






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
// TagManagementPanel — CRUD for tag definitions
// ============================================================

function TagManagementPanel(props: { store: GanttStore; onClose: () => void }) {
  const { store } = props;

  const newName = useSignal('');
  const newColor = useSignal(PRESET_COLORS[1][0]);
  const editingTag = useSignal<string | null>(null);
  const editName = useSignal('');
  const editColor = useSignal('');
  const deleteConfirmName = useSignal<string | null>(null);
  const creating = useSignal(false);
  const errorMsg = useSignal('');

  // Count usage across all projects (reads signals reactively)
  const usageCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of store.mergedProjects.value) {
      for (const t of (p.tags ?? [])) {
        counts.set(t, (counts.get(t) ?? 0) + 1);
      }
    }
    const overrides = store.edits.value?.projectOverrides ?? {};
    for (const [, o] of Object.entries(overrides)) {
      if (o.tags) {
        for (const t of o.tags) {
          if (!counts.has(t)) counts.set(t, 0);
        }
      }
    }
    return counts;
  }, [store.mergedProjects.value, store.edits.value]);

  async function handleCreate() {
    const name = newName.value.trim();
    if (!name) return;
    // Check duplicate against current tag definitions
    if (store.tagDefinitions.value.some(t => t.name === name)) {
      errorMsg.value = `Tag "${name}" already exists`;
      return;
    }
    errorMsg.value = '';
    creating.value = true;
    try {
      await store.createTag(name, newColor.value);
      newName.value = '';
      newColor.value = PRESET_COLORS[1][0];
    } catch (e) {
      errorMsg.value = `Failed: ${e instanceof Error ? e.message : String(e)}`;
    } finally {
      creating.value = false;
    }
  }

  function handleCreateKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      handleCreate();
    }
  }

  function startEdit(tag: { name: string; color: string }) {
    editingTag.value = tag.name;
    editName.value = tag.name;
    editColor.value = tag.color;
  }

  async function saveEdit() {
    const oldName = editingTag.value;
    const newNameVal = editName.value.trim();
    if (!oldName || !newNameVal) return;
    if (newNameVal !== oldName && store.tagDefinitions.value.some(t => t.name === newNameVal)) {
      errorMsg.value = `Tag "${newNameVal}" already exists`;
      return;
    }
    errorMsg.value = '';
    try {
      await store.updateTag(oldName, newNameVal, editColor.value);
      editingTag.value = null;
    } catch (e) {
      errorMsg.value = `Failed: ${e instanceof Error ? e.message : String(e)}`;
    }
  }

  function cancelEdit() {
    editingTag.value = null;
  }

  function handleEditKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); saveEdit(); }
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); cancelEdit(); }
  }

  function confirmDelete(name: string) {
    deleteConfirmName.value = name;
  }

  async function handleDelete() {
    if (!deleteConfirmName.value) return;
    const name = deleteConfirmName.value;
    deleteConfirmName.value = null;
    errorMsg.value = '';
    try {
      await store.deleteTag(name);
    } catch (e) {
      errorMsg.value = `Failed: ${e instanceof Error ? e.message : String(e)}`;
    }
  }

  // Reactively read tag definitions for rendering
  const tagList = store.tagDefinitions.value;

  return (
    <div
      class="gantt-confirm-backdrop"
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) props.onClose(); }}
    >
      <div
        style={{
          background: 'var(--background-primary, #fff)', borderRadius: '8px', padding: '0',
          maxWidth: '500px', width: '90%', maxHeight: '75vh',
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          color: 'var(--text-normal, #333)',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '20px 24px 16px',
          borderBottom: '1px solid var(--background-modifier-border, #eee)',
        }}>
          <h3 style={{ margin: 0, fontSize: '16px' }}>Tag Management</h3>
          <button
            onClick={props.onClose}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px',
              lineHeight: 1, padding: '0 2px', color: 'var(--text-muted, #999)',
            }}
          >x</button>
        </div>

        {/* Body */}
        <div style={{ overflowY: 'auto', padding: '16px 24px', flex: 1 }}>
          {/* Create new tag */}
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <button
                onClick={() => { editingTag.value = editingTag.value === '__new__' ? null : '__new__'; }}
                title="Tag color"
                style={{
                  width: '28px', height: '28px', padding: 0, border: '1px solid var(--background-modifier-border, #ccc)',
                  borderRadius: '4px', cursor: 'pointer', background: newColor.value,
                }}
              />
              {editingTag.value === '__new__' && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, zIndex: 100,
                  background: 'var(--background-primary, #fff)',
                  border: '1px solid var(--background-modifier-border, #ccc)',
                  borderRadius: '4px', padding: '6px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  marginTop: '2px',
                }}>
                  <ColorSwatchPicker
                    value={newColor.value}
                    onChange={(c) => {
                      newColor.value = c;
                      editingTag.value = null;
                    }}
                  />
                </div>
              )}
            </div>
            <input
              type="text"
              value={newName.value}
              onInput={(e) => { newName.value = (e.target as HTMLInputElement).value; }}
              onKeyDown={handleCreateKeyDown}
              onKeyUp={(e) => { e.stopPropagation(); }}
              placeholder="New tag name..."
              style={{
                flex: 1, fontSize: '12px', padding: '4px 8px', borderRadius: '4px',
                border: '1px solid var(--background-modifier-border, #ccc)',
                background: 'var(--background-primary, #fff)', color: 'var(--text-normal, #333)',
              }}
            />
            <button
              onClick={handleCreate}
              disabled={creating.value || !newName.value.trim() || store.tagDefinitions.value.some(t => t.name === newName.value.trim())}
              style={{
                padding: '4px 12px', border: 'none', borderRadius: '4px',
                background: creating.value ? 'var(--background-modifier-border, #ccc)' : 'var(--interactive-accent, #4A90D9)', color: '#fff',
                cursor: creating.value || !newName.value.trim() ? 'not-allowed' : 'pointer', fontSize: '12px', whiteSpace: 'nowrap',
                opacity: newName.value.trim() ? 1 : 0.5,
              }}
            >{creating.value ? '...' : 'Create'}</button>
          </div>
          {errorMsg.value && (
            <div style={{ fontSize: '11px', color: 'var(--text-error, #e00)', marginBottom: '8px' }}>{errorMsg.value}</div>
          )}

          {/* Tag list */}
          {tagList.length === 0 ? (
            <div style={{ color: 'var(--text-muted, #999)', fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>
              No tags defined yet. Create one above.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {tagList.map(tag => (
                <div
                  key={tag.name}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px',
                    border: '1px solid var(--background-modifier-border, #e0e0e0)',
                    borderRadius: '6px', background: 'var(--background-secondary, #f5f5f5)',
                  }}
                >
                  {editingTag.value === tag.name ? (
                    <>
                      <div style={{ flexShrink: 0 }}>
                        <ColorSwatchPicker
                          value={editColor.value}
                          onChange={(c) => { editColor.value = c; }}
                        />
                      </div>
                      <input
                        type="text"
                        value={editName.value}
                        onInput={(e) => { editName.value = (e.target as HTMLInputElement).value; }}
                        onKeyDown={handleEditKeyDown}
                        onKeyUp={(e) => { e.stopPropagation(); }}
                        style={{
                          flex: 1, fontSize: '12px', padding: '3px 6px', borderRadius: '3px',
                          border: '1px solid var(--interactive-accent, #4A90D9)',
                          background: 'var(--background-primary, #fff)', color: 'var(--text-normal, #333)',
                        }}
                      />
                      <button onClick={saveEdit} style={{ padding: '2px 6px', border: 'none', borderRadius: '3px', background: 'var(--interactive-accent, #4A90D9)', color: '#fff', cursor: 'pointer', fontSize: '11px' }}>Save</button>
                      <button onClick={cancelEdit} style={{ padding: '2px 6px', border: '1px solid var(--background-modifier-border, #ccc)', borderRadius: '3px', background: 'transparent', cursor: 'pointer', fontSize: '11px' }}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <span style={{
                        width: '14px', height: '14px', borderRadius: '3px',
                        background: tag.color, flexShrink: 0,
                      }} />
                      <span style={{ flex: 1, fontSize: '13px', fontWeight: 500 }}>{tag.name}</span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted, #999)' }}>
                        {usageCounts.get(tag.name) ?? 0} projects
                      </span>
                      <button
                        onClick={() => startEdit(tag)}
                        title="Edit tag"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: 'var(--text-muted, #999)', padding: '0 2px' }}
                      ><Icon name="pencil" size={13} /></button>
                      {deleteConfirmName.value === tag.name ? (
                        <>
                          <button
                            onClick={handleDelete}
                            title="Confirm delete"
                            style={{ background: 'var(--text-error, #e00)', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '10px', color: '#fff', padding: '2px 6px', whiteSpace: 'nowrap' }}
                          >Sure?</button>
                          <button
                            onClick={() => { deleteConfirmName.value = null; }}
                            title="Cancel delete"
                            style={{ background: 'none', border: '1px solid var(--background-modifier-border, #ccc)', borderRadius: '3px', cursor: 'pointer', fontSize: '10px', color: 'var(--text-muted, #999)', padding: '2px 4px' }}
                          ><Icon name="x" size={10} /></button>
                        </>
                      ) : (
                        <button
                          onClick={() => confirmDelete(tag.name)}
                          title="Delete tag"
                          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: 'var(--text-error, #e00)', padding: '0 2px' }}
                        ><Icon name="trash-2" size={13} /></button>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
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
  const dismissConfirm = useSignal(false);
  const progress = store.pushProgress;  // reactive PushProgress signal

  // Selected IDs — keyed by "entityType:entityId"
  const selectedIds = useSignal<Set<string>>(new Set(changes.map(c => `${c.entityType}:${c.entityId}`)));

  function selectedEntityIds(): Set<string> {
    const ids = new Set<string>();
    for (const key of selectedIds.value) {
      const colonIdx = key.lastIndexOf(':');
      if (colonIdx > 0) ids.add(key.slice(colonIdx + 1));
    }
    return ids;
  }

  function toggleSelect(key: string) {
    const next = new Set(selectedIds.value);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    selectedIds.value = next;
  }

  function selectAll() {
    selectedIds.value = new Set(changes.map(c => `${c.entityType}:${c.entityId}`));
  }

  function deselectAll() {
    selectedIds.value = new Set();
  }

  async function handlePush() {
    const ids = selectedEntityIds();
    if (ids.size === 0) return;
    pushing.value = true;
    pushResults.value = null;
    try {
      const results = await store.pushChanges(ids);
      pushResults.value = results;
    } finally {
      pushing.value = false;
    }
  }

  async function handleDismiss() {
    if (!dismissConfirm.value) {
      dismissConfirm.value = true;
      return;
    }
    const ids = selectedEntityIds();
    if (ids.size === 0) return;
    await store.dismissChanges(ids);
    dismissConfirm.value = false;
    selectedIds.value = new Set();
  }

  const selectedCount = selectedIds.value.size;
  const totalCount = changes.length;

  const stats = {
    added: changes.filter(c => c.changeType === 'added').length,
    modified: changes.filter(c => c.changeType === 'modified').length,
    deleted: changes.filter(c => c.changeType === 'deleted').length,
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
              {changes.map((change, i) => {
                const key = `${change.entityType}:${change.entityId}`;
                const isSelected = selectedIds.value.has(key);
                return (
                <div
                  key={`${change.entityType}-${change.entityId}-${change.changeType}-${i}`}
                  class="gantt-change-card"
                  style={{
                    border: '1px solid var(--background-modifier-border, #e0e0e0)',
                    borderRadius: '6px',
                    padding: '12px',
                    fontSize: '12px',
                    opacity: isSelected ? 1 : 0.5,
                    transition: 'opacity 0.15s',
                  }}
                >
                  {/* Card header: checkbox + type badge + entity name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(key)}
                      style={{ margin: 0, flexShrink: 0 }}
                    />
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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginLeft: '24px' }}>
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
                              ? `${((f.newValue as unknown[]) ?? []).length} dates`
                              : f.field === 'keyLinks'
                                ? `${((f.newValue as unknown[]) ?? []).length} links`
                                : f.field === 'tags'
                                  ? `[${(f.newValue as string[] ?? []).join(', ')}]`
                                  : f.field === 'dependencies'
                                    ? `[${(f.newValue as string[] ?? []).join(', ')}]`
                                    : String(f.newValue ?? '(cleared)')}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Added: summary info */}
                  {change.changeType === 'added' && change.addedSummary && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginLeft: '24px' }}>
                      {Object.entries(change.addedSummary).map(([key2, val]) => (
                        <div key={key2} style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                          <span style={{
                            color: 'var(--text-muted, #999)',
                            fontSize: '11px',
                            minWidth: '50px',
                            flexShrink: 0,
                          }}>
                            {key2}:
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
                    <div style={{ fontSize: '11px', color: 'var(--text-error, #e53935)', marginLeft: '24px' }}>
                      {change.relatedInfo
                        ? `Will be deleted · ${change.relatedInfo}`
                        : 'Will be deleted'}
                    </div>
                  )}
                </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer with push/dismiss buttons, progress bar, and results */}
        {changes.length > 0 && (
          <div style={{
            padding: '12px 24px',
            borderTop: '1px solid var(--background-modifier-border, #eee)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}>
            {/* Progress bar — shown during push */}
            {pushing.value && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {progress.value ? (
                  <>
                    <div style={{
                      height: '6px',
                      borderRadius: '3px',
                      background: 'var(--background-modifier-border, #e0e0e0)',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${Math.round((progress.value.current / progress.value.total) * 100)}%`,
                        borderRadius: '3px',
                        background: 'var(--interactive-accent, #4A90D9)',
                        transition: 'width 0.2s',
                      }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted, #999)' }}>
                      <span>{progress.value.message}</span>
                      <span>{progress.value.current} / {progress.value.total}</span>
                    </div>
                  </>
                ) : (
                  <div style={{ fontSize: '12px', color: 'var(--text-muted, #999)', textAlign: 'center' }}>
                    Pushing changes...
                  </div>
                )}
              </div>
            )}

            {/* Results summary — shown after push completes */}
            {pushResults.value && !pushing.value && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px' }}>
                {(() => {
                  const succeeded = pushResults.value.filter(r => r.success);
                  const failed = pushResults.value.filter(r => !r.success);
                  return (
                    <>
                      {succeeded.length > 0 && (
                        <div style={{ color: '#4caf50' }}>
                          Successful: {succeeded.map(r => r.connectorId).join(', ')}
                        </div>
                      )}
                      {failed.length > 0 && (
                        <div style={{ color: 'var(--text-error, #e00)' }}>
                          Failed: {failed.map(r => `${r.connectorId} (${r.error || 'unknown error'})`).join('; ')}
                        </div>
                      )}
                      {succeeded.length > 0 && failed.length === 0 && (
                        <div style={{ color: '#4caf50', fontWeight: 500 }}>All changes pushed successfully.</div>
                      )}
                      {succeeded.length === 0 && failed.length > 0 && (
                        <div style={{ color: 'var(--text-error, #e00)', fontWeight: 500 }}>Push failed — no changes cleared.</div>
                      )}
                    </>
                  );
                })()}
              </div>
            )}

            {/* Action buttons — hidden during push */}
            {!pushing.value && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button onClick={selectAll} style={{
                  padding: '4px 8px', border: '1px solid var(--background-modifier-border, #ccc)',
                  borderRadius: '3px', background: 'transparent', cursor: 'pointer', fontSize: '11px',
                }}>All</button>
                <button onClick={deselectAll} style={{
                  padding: '4px 8px', border: '1px solid var(--background-modifier-border, #ccc)',
                  borderRadius: '3px', background: 'transparent', cursor: 'pointer', fontSize: '11px',
                }}>None</button>
                <span style={{ fontSize: '11px', color: 'var(--text-muted, #999)' }}>
                  {selectedCount} of {totalCount} selected
                </span>
                <div style={{ flex: 1 }} />
                <button
                  onClick={handleDismiss}
                  disabled={selectedCount === 0}
                  class="gantt-btn"
                  style={{
                    padding: '6px 14px',
                    border: '1px solid var(--text-error, #e00)',
                    borderRadius: '4px',
                    background: dismissConfirm.value ? 'var(--text-error, #e53935)' : 'transparent',
                    color: dismissConfirm.value ? '#fff' : 'var(--text-error, #e00)',
                    cursor: selectedCount === 0 ? 'not-allowed' : 'pointer',
                    fontSize: '12px',
                    opacity: selectedCount === 0 ? 0.5 : 1,
                  }}
                >
                  {dismissConfirm.value ? 'Click again to confirm' : `Dismiss (${selectedCount})`}
                </button>
                <button
                  onClick={handlePush}
                  disabled={selectedCount === 0}
                  class="gantt-btn"
                  style={{
                    padding: '8px 20px',
                    border: 'none',
                    borderRadius: '4px',
                    background: selectedCount === 0 ? 'var(--background-modifier-border, #ccc)' : 'var(--interactive-accent, #4A90D9)',
                    color: '#fff',
                    cursor: selectedCount === 0 ? 'not-allowed' : 'pointer',
                    fontSize: '13px',
                    fontWeight: 500,
                    opacity: selectedCount === 0 ? 0.5 : 1,
                  }}
                >
                  Push ({selectedCount})
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function DualPane(props: {
  store: GanttStore;
  onTaskPointerDown: (e: PointerEvent, taskId: string, edge: 'left' | 'right' | 'body', paneType: 'person' | 'project', laneIndex: number) => void;
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

  // Panel resize state
  const isResizingPanel = useSignal(false);

  // Shared initial scroll — computed once to center today, using the same
  // bodyOriginPx logic as each Timeline so both panes agree on the origin.
  const didInitialScroll = useRef(false);
  useEffect(() => {
    if (didInitialScroll.current || store.mergedTasks.value.length === 0) return;
    didInitialScroll.current = true;

    requestAnimationFrame(() => {
      const timelineEl = document.querySelector<HTMLDivElement>('.gantt-timeline');
      if (!timelineEl) return;

      // Compute bodyOriginPx from actual task dates (same logic as Timeline)
      let minAbsPx = dateToPx(todayString());
      for (const t of store.mergedTasks.value) {
        const sd = t.startDate.value;
        const ed = t.endDate.value;
        if (sd) { const px = dateToPx(sd); if (px < minAbsPx) minAbsPx = px; }
        if (ed) { const px = dateToPx(ed); if (px < minAbsPx) minAbsPx = px; }
      }
      const bodyOriginPx = Math.floor(minAbsPx - 730 * DAY_WIDTH);
      const todayBodyPx = dateToPx(todayString()) - bodyOriginPx;
      const targetScroll = Math.max(0, todayBodyPx - timelineEl.clientWidth / 2);

      store.sharedScrollLeft.value = targetScroll;
    });
  }, []);

  // Locate entity — scroll both X and Y to bring the selected entity into view
  useEffect(() => {
    const target = store.locateTarget.value;
    if (!target) return;

    requestAnimationFrame(() => {
      // Compute bodyOriginPx from task dates (same as Timeline)
      let minAbsPx = dateToPx(todayString());
      for (const t of store.mergedTasks.value) {
        const sd = t.startDate.value;
        const ed = t.endDate.value;
        if (sd) { const px = dateToPx(sd); if (px < minAbsPx) minAbsPx = px; }
        if (ed) { const px = dateToPx(ed); if (px < minAbsPx) minAbsPx = px; }
      }
      const bodyOriginPx = Math.floor(minAbsPx - 730 * DAY_WIDTH);

      if (target.type === 'task') {
        const task = store.mergedTasks.value.find(t => t.id === target.id);
        if (!task) { store.locateTarget.value = null; return; }

        // X: scroll to task's start date
        const startVal = task.startDate.value;
        if (startVal) {
          const timelineEl = document.querySelector<HTMLDivElement>('.gantt-timeline');
          const viewportW = timelineEl ? timelineEl.clientWidth : 800;
          const targetBodyPx = dateToPx(startVal) - bodyOriginPx;
          store.sharedScrollLeft.value = Math.max(0, targetBodyPx - viewportW / 4);
        }

        // Y: scroll person pane to the task's person group
        const personKey = task.personId.value || '__unassigned__';
        let personRowY = 0;
        let accY = 0;
        for (const group of store.personGroups.value) {
          const taskCount = group.tasks.length || 1;
          const lanes = Math.min(taskCount, 3);
          const h = ROW_HEIGHT + (lanes - 1) * LANE_OFFSET;
          if (group.personId === personKey) {
            personRowY = accY;
            break;
          }
          accY += h;
        }
        const personPaneEl = document.querySelector('.gantt-pane');
        const personViewH = personPaneEl ? personPaneEl.clientHeight / 2 : 300;
        store.personScrollTop.value = Math.max(0, personRowY - personViewH / 3);

        // Y: scroll project pane to the task's project group
        const projectKey = task.projectId.value || '__no_project__';
        let projectRowY = 0;
        accY = 0;
        for (const group of store.projectGroups.value) {
          const taskCount = group.tasks.length || 1;
          const lanes = Math.min(taskCount, 3);
          const h = ROW_HEIGHT + (lanes - 1) * LANE_OFFSET;
          if (group.projectId === projectKey) {
            projectRowY = accY;
            break;
          }
          accY += h;
        }
        const projectPaneEl = document.querySelectorAll('.gantt-pane')[1];
        const projectViewH = projectPaneEl ? projectPaneEl.clientHeight : 300;
        store.projectScrollTop.value = Math.max(0, projectRowY - projectViewH / 3);
      }

      if (target.type === 'project') {
        const projectTasks = store.mergedTasks.value.filter(t => t.projectId.value === target.id);

        // X: scroll to middle of project's date range
        let earliest: string | null = null;
        let latest: string | null = null;
        for (const t of projectTasks) {
          const s = t.startDate.value;
          const e = t.endDate.value ?? s;
          if (s) {
            if (!earliest || s < earliest) earliest = s;
            if (!latest || e > latest) latest = e;
          }
        }
        if (earliest) {
          const projectMidDate = earliest === latest || !latest
            ? earliest
            : addDays(earliest, Math.floor(daysBetween(earliest, latest) / 2));
          if (projectMidDate) {
            const timelineEl = document.querySelector<HTMLDivElement>('.gantt-timeline');
            const viewportW = timelineEl ? timelineEl.clientWidth : 800;
            const targetBodyPx = dateToPx(projectMidDate) - bodyOriginPx;
            store.sharedScrollLeft.value = Math.max(0, targetBodyPx - viewportW / 4);
          }
        }

        // Y: scroll project pane to the project's row
        let projectRowY = 0;
        let accY = 0;
        for (const group of store.projectGroups.value) {
          const taskCount = group.tasks.length || 1;
          const lanes = Math.min(taskCount, 3);
          const h = ROW_HEIGHT + (lanes - 1) * LANE_OFFSET;
          if (group.projectId === target.id) {
            projectRowY = accY;
            break;
          }
          accY += h;
        }
        const projectPaneEl = document.querySelectorAll('.gantt-pane')[1];
        const projectViewH = projectPaneEl ? projectPaneEl.clientHeight : 300;
        store.projectScrollTop.value = Math.max(0, projectRowY - projectViewH / 3);
      }

      // Clear the locate target after handling
      store.locateTarget.value = null;
    });
  }, [store.locateTarget.value]);

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

  function handlePanelResizePointerDown(e: PointerEvent) {
    e.preventDefault();
    isResizingPanel.value = true;

    const startX = e.clientX;
    const startWidth = store.detailPanelWidth.value;

    function onMove(ev: PointerEvent) {
      const dx = startX - ev.clientX;
      const newWidth = Math.min(500, Math.max(180, startWidth + dx));
      store.detailPanelWidth.value = newWidth;
    }

    function onUp() {
      isResizingPanel.value = false;
      store.saveSettings();
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
    }

    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
  }

  const sel = store.selectedEntity.value;
  const showTaskDetail = sel?.type === 'task';
  const showProjectDetail = sel?.type === 'project';
  const showPersonDetail = sel?.type === 'person';

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
            {!showTaskDetail && !showProjectDetail && !showPersonDetail && <UnassignedPanel store={store} onDragStart={() => {}} />}
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

        {/* Detail sidebar — resizable, appears when task or project is selected */}
        <div style={{ display: 'flex', flexShrink: 0 }}>
          {/* Panel resize handle */}
          <div
            class="gantt-panel-resize-handle"
            style={{
              width: '4px',
              cursor: 'col-resize',
              background: isResizingPanel.value
                ? 'var(--interactive-accent, #4A90D9)'
                : 'var(--background-modifier-border, #ccc)',
              flexShrink: 0,
              transition: isResizingPanel.value ? 'none' : 'background 0.15s',
            }}
            onPointerDown={handlePanelResizePointerDown}
          />
          {showTaskDetail && <TaskDetail store={store} onDelete={props.onDeleteTask} />}
          {showProjectDetail && <ProjectDetail store={store} onDelete={props.onDeleteProject} />}
          {showPersonDetail && <PersonDetail store={store} />}
        </div>
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
  const showTagPanel = useSignal(false);

  let saveTimer: ReturnType<typeof setTimeout> | null = null;
  function scheduleSave() {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => store.saveSettings(), 500);
  }

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
        if (showTagPanel.value) {
          showTagPanel.value = false;
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

  function handleTaskPointerDown(e: PointerEvent, taskId: string, edge: 'left' | 'right' | 'body', paneType: 'person' | 'project', laneIndex: number) {
    dragHandler.onTaskPointerDown(e, taskId, edge, paneType, laneIndex);
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
        <button
          class="gantt-btn"
          title="Manage tag definitions"
          style={{
            padding: '4px 12px',
            border: '1px solid var(--background-modifier-border, #ccc)',
            borderRadius: '4px',
            background: 'var(--background-secondary, #f5f5f5)',
            cursor: 'pointer',
            fontSize: '12px',
          }}
          onClick={() => { showTagPanel.value = true; }}
        >
          Tags
        </button>
        <span style={{ color: 'var(--text-muted, #999)', fontSize: '12px' }}>
          {store.mergedTasks.value.length} tasks · {store.personGroups.value.length} people · {store.projectGroups.value.length} projects
        </span>
        <span style={{ color: 'var(--text-muted, #999)', fontSize: '12px', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Filter controls */}
          <input
            type="date"
            value={store.filterTimeStart.value}
            onInput={(e) => { store.filterTimeStart.value = (e.target as HTMLInputElement).value; scheduleSave(); }}
            title="Filter start date"
            style={{
              padding: '2px 6px', fontSize: '11px', borderRadius: '3px', width: '120px',
              border: '1px solid var(--background-modifier-border, #ccc)',
              background: 'var(--background-primary, #fff)', color: 'var(--text-normal, #333)',
            }}
          />
          <span style={{ fontSize: '11px' }}>—</span>
          <input
            type="date"
            value={store.filterTimeEnd.value}
            onInput={(e) => { store.filterTimeEnd.value = (e.target as HTMLInputElement).value; scheduleSave(); }}
            title="Filter end date"
            style={{
              padding: '2px 6px', fontSize: '11px', borderRadius: '3px', width: '120px',
              border: '1px solid var(--background-modifier-border, #ccc)',
              background: 'var(--background-primary, #fff)', color: 'var(--text-normal, #333)',
            }}
          />
          <FilterMultiSelect
            label="Status"
            options={STATUS_OPTIONS.map(o => ({ value: o.value, label: o.label }))}
            selected={store.filterStatuses.value}
            onChange={(s) => { store.filterStatuses.value = s; scheduleSave(); }}
          />
          {/* Tag filter uses store.tagDefinitions */}
          <FilterMultiSelect
            label="Tags"
            options={store.availableFilterTags.value}
            selected={store.filterTags.value}
            onChange={(s) => { store.filterTags.value = s; scheduleSave(); }}
          />
          {(store.filteredProjectGroupKeys.value !== null) && (
            <span style={{ fontSize: '11px', color: 'var(--interactive-accent, #4A90D9)', fontWeight: 500 }}>
              {store.filteredProjectGroupKeys.value.size} matching
            </span>
          )}
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

      {/* Tag management panel */}
      {showTagPanel.value && (
        <TagManagementPanel
          store={store}
          onClose={() => { showTagPanel.value = false; }}
        />
      )}
    </div>
  );
}
