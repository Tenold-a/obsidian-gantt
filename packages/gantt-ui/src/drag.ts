import { signal } from '@preact/signals';
import type { GanttStore } from './store';
import { addDays, daysBetween } from '@obsidian-gantt/core';
import { TIMELINE_ORIGIN, dateToAbsolutePixel, absolutePixelToDate } from './components';

const DAY_WIDTH = 30;
const ROW_HEIGHT = 40;
const LANE_OFFSET = 12;

/** Compute the actual height of a person group accounting for lane stacking. */
function computeGroupHeight(tasks: Array<{ startDate: { value: string | null }; endDate: { value: string | null } }>): number {
  const ranges: Array<{ start: string; end: string }> = [];
  for (const t of tasks) {
    const s = t.startDate.value;
    if (!s) continue;
    ranges.push({ start: s, end: t.endDate.value ?? s });
  }
  ranges.sort((a, b) => a.start.localeCompare(b.start));
  const lanes: string[] = [];
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
}

/** Find which group index a content-space Y position falls into. */
function findRowIndex(groups: Array<{ tasks: Array<{ startDate: { value: string | null }; endDate: { value: string | null } }> }>, contentY: number): number {
  let accumulatedY = 0;
  for (let i = 0; i < groups.length; i++) {
    const h = computeGroupHeight(groups[i].tasks);
    if (contentY < accumulatedY + h) return i;
    accumulatedY += h;
  }
  return groups.length - 1;
}

/** Convert date to absolute pixel from TIMELINE_ORIGIN. */
function dateToPx(date: string): number {
  return dateToAbsolutePixel(date, DAY_WIDTH);
}

/** Convert absolute pixel to date. */
function pxToDate(px: number): string {
  return absolutePixelToDate(px, DAY_WIDTH);
}

// ============================================================
// Drag state
// ============================================================

export interface DragState {
  dragMode: 'task' | 'keyDate';
  taskId: string;
  edge: 'left' | 'right' | 'body';
  paneType: 'person' | 'project';
  originalStartDate: string;
  originalEndDate: string;
  currentStartDate: string;
  currentEndDate: string;
  ghostLeft: number;
  ghostWidth: number;
  pointerStartX: number;
  pointerStartY: number;
  /** Person row the task started on (null for project pane) */
  originalPersonId: string | null;
  /** Person row the cursor is currently over */
  currentPersonId: string | null;
  /** Row index for ghost bar positioning */
  rowIndex: number;
  /** Scroll offset of the timeline container at drag start */
  scrollTopStart: number;
  /** Y position of the timeline body top at drag start */
  bodyTopStart: number;
  /** Key date drag: index within project.keyDates */
  keyDateIndex?: number;
  /** Key date drag: project that owns the key date */
  projectId?: string;
  /** Key date drag: original date string */
  originalKeyDate?: string;
  /** Key date drag: current date string */
  currentKeyDate?: string;
}

export const dragState = signal<DragState | null>(null);

// ============================================================
// Drag handler factory
// ============================================================

export function createDragHandler(store: GanttStore) {
  let undoStack: Array<() => Promise<void>> = [];

  function onTaskPointerDown(
    e: PointerEvent,
    taskId: string,
    edge: 'left' | 'right' | 'body',
    paneType: 'person' | 'project',
  ) {
    const task = store.mergedTasks.value.find(t => t.id === taskId);
    if (!task) return;

    const startDate = task.startDate.value;
    const endDate = task.endDate.value;
    if (!startDate) return;

    const effectiveEnd = endDate ?? startDate;
    // Store absolute pixel positions from origin (used by ghost preview)
    // The actual task bar left is originPx - bodyOriginPx, handled in Timeline
    const originStartPx = dateToPx(startDate);
    const originEndPx = dateToPx(effectiveEnd);
    const baseLeft = originStartPx;
    const baseRight = originEndPx;

    // Find the task's row index
    const groups = paneType === 'person' ? store.personGroups.value : store.projectGroups.value;
    let rowIndex = 0;
    for (let i = 0; i < groups.length; i++) {
      if (groups[i].tasks.some(t => t.id === taskId)) {
        rowIndex = i;
        break;
      }
    }

    const personId = paneType === 'person' ? (task.personId.value ?? null) : null;

    // Find the timeline body element for accurate Y calculations
    const target = e.currentTarget as HTMLElement;
    const timelineBody = target.closest('.gantt-timeline')?.querySelector('[style*="position: relative"]') as HTMLElement | null;
    const bodyRect = timelineBody?.getBoundingClientRect();
    const scrollEl = target.closest('.gantt-timeline') as HTMLElement | null;

    const ds: DragState = {
      dragMode: 'task',
      taskId,
      edge,
      paneType,
      originalStartDate: startDate,
      originalEndDate: effectiveEnd,
      currentStartDate: startDate,
      currentEndDate: effectiveEnd,
      ghostLeft: baseLeft,
      ghostWidth: Math.max(baseRight - baseLeft, 4),
      pointerStartX: e.clientX,
      pointerStartY: e.clientY,
      originalPersonId: personId,
      currentPersonId: personId,
      rowIndex,
      scrollTopStart: scrollEl?.scrollTop ?? 0,
      bodyTopStart: bodyRect?.top ?? 0,
    };

    dragState.value = ds;

    // Prevent text selection and capture pointer
    document.body.style.userSelect = 'none';
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    e.preventDefault();
    e.stopPropagation();

    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
  }

  function onKeyDatePointerDown(
    e: PointerEvent,
    projectId: string,
    keyDateIndex: number,
    currentDate: string,
  ) {
    const originPx = dateToPx(currentDate);

    // Find the project's row index
    const groups = store.projectGroups.value;
    let rowIndex = 0;
    for (let i = 0; i < groups.length; i++) {
      if (groups[i].projectId === projectId) {
        rowIndex = i;
        break;
      }
    }

    const ds: DragState = {
      dragMode: 'keyDate',
      taskId: '',
      edge: 'body',
      paneType: 'project',
      originalStartDate: currentDate,
      originalEndDate: currentDate,
      currentStartDate: currentDate,
      currentEndDate: currentDate,
      ghostLeft: originPx,
      ghostWidth: 8,
      pointerStartX: e.clientX,
      pointerStartY: e.clientY,
      originalPersonId: null,
      currentPersonId: null,
      rowIndex,
      scrollTopStart: 0,
      bodyTopStart: 0,
      keyDateIndex,
      projectId,
      originalKeyDate: currentDate,
      currentKeyDate: currentDate,
    };

    dragState.value = ds;

    document.body.style.userSelect = 'none';
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    e.preventDefault();
    e.stopPropagation();

    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
  }

  function onPointerMove(e: PointerEvent) {
    const ds = dragState.value;
    if (!ds) return;

    const dx = e.clientX - ds.pointerStartX;
    const dayDelta = Math.round(dx / DAY_WIDTH);

    if (ds.dragMode === 'keyDate') {
      // Key date drag: only horizontal movement
      const newDate = addDays(ds.originalKeyDate!, dayDelta);
      ds.currentKeyDate = newDate;
      ds.ghostLeft = dateToPx(newDate);
      dragState.value = { ...ds };
      return;
    }

    if (ds.edge === 'body') {
      // Move entire bar
      const newStart = addDays(ds.originalStartDate, dayDelta);
      const duration = daysBetween(ds.originalStartDate, ds.originalEndDate);
      const newEnd = addDays(newStart, duration);

      ds.currentStartDate = newStart;
      ds.currentEndDate = newEnd;
      ds.ghostLeft = dateToPx(newStart);
      ds.ghostWidth = Math.max(duration * DAY_WIDTH, 4);

      // ── Cross-row drag (person pane only) ──
      if (ds.paneType === 'person') {
        const pg = store.personGroups.value;
        const scrollEl = document.querySelector('.gantt-timeline') as HTMLElement | null;
        // Use current bodyRect.top which already accounts for scroll
        const timelineBody = scrollEl?.querySelector('[style*="position: relative"]') as HTMLElement | null;
        const currentBodyTop = timelineBody?.getBoundingClientRect().top ?? ds.bodyTopStart;
        const contentY = e.clientY - currentBodyTop;
        const newRowIndex = findRowIndex(pg, contentY);
        ds.rowIndex = newRowIndex;
        const targetPersonId = pg[newRowIndex]?.personId;
        ds.currentPersonId = (targetPersonId === '__unassigned__' || targetPersonId == null) ? null : targetPersonId;
      }
    } else if (ds.edge === 'left') {
      // Resize left edge
      const newStart = addDays(ds.originalStartDate, dayDelta);
      if (daysBetween(newStart, ds.originalEndDate) >= 1) {
        ds.currentStartDate = newStart;
        ds.ghostLeft = dateToPx(newStart);
        ds.ghostWidth = Math.max(daysBetween(newStart, ds.originalEndDate) * DAY_WIDTH, 4);
      }
    } else if (ds.edge === 'right') {
      // Resize right edge
      const newEnd = addDays(ds.originalEndDate, dayDelta);
      if (daysBetween(ds.originalStartDate, newEnd) >= 1) {
        ds.currentEndDate = newEnd;
        ds.ghostWidth = Math.max(daysBetween(ds.originalStartDate, newEnd) * DAY_WIDTH, 4);
      }
    }

    // No clamping — allow dragging anywhere on the infinite timeline
    dragState.value = { ...ds };
  }

  async function onPointerUp(_e: PointerEvent) {
    const ds = dragState.value;
    if (!ds) return;

    document.body.style.userSelect = '';
    document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerup', onPointerUp);

    // ── Key date drag persistence ──
    if (ds.dragMode === 'keyDate') {
      const projectId = ds.projectId!;
      const keyDateIndex = ds.keyDateIndex!;
      const newDate = ds.currentKeyDate!;
      const origDate = ds.originalKeyDate!;

      dragState.value = null;

      if (newDate === origDate) return;

      const project = store.mergedProjects.value.find(p => p.id === projectId);
      if (!project) return;

      const keyDates = [...(project.keyDates ?? [])];
      keyDates[keyDateIndex] = { ...keyDates[keyDateIndex], date: newDate };

      const undo = async () => {
        await store.persistProjectEdit(projectId, 'keyDates', keyDates.map((kd, i) =>
          i === keyDateIndex ? { ...kd, date: origDate } : kd
        ));
      };

      await store.persistProjectEdit(projectId, 'keyDates', keyDates);
      undoStack.push(undo);
      return;
    }

    // ── Task bar drag persistence ──
    const taskId = ds.taskId;
    const newStart = ds.currentStartDate;
    const newEnd = ds.currentEndDate;
    const origStart = ds.originalStartDate;
    const origEnd = ds.originalEndDate;
    const newPersonId = ds.currentPersonId;
    const origPersonId = ds.originalPersonId;

    dragState.value = null;

    if (newStart === origStart && newEnd === origEnd && newPersonId === origPersonId) return;

    const undo = async () => {
      if (origStart !== newStart) {
        await store.persistEdit(taskId, 'startDate', origStart);
      }
      if (origEnd !== newEnd) {
        await store.persistEdit(taskId, 'endDate', origEnd);
      }
      if (origPersonId !== newPersonId) {
        await store.persistEdit(taskId, 'personId', origPersonId ?? null);
      }
    };

    if (newStart !== origStart) {
      await store.persistEdit(taskId, 'startDate', newStart);
    }
    if (newEnd !== origEnd) {
      await store.persistEdit(taskId, 'endDate', newEnd);
    }
    if (newPersonId !== origPersonId) {
      await store.persistEdit(taskId, 'personId', newPersonId ?? null);
    }

    undoStack.push(undo);
  }

  async function undo() {
    const fn = undoStack.pop();
    if (fn) await fn();
  }

  // ─── Card-to-timeline drop ───

  function handleTimelineDrop(e: DragEvent) {
    e.preventDefault();
    const data = e.dataTransfer?.getData('text/plain');
    if (!data) return;

    let projectInfo: { projectId: string; projectName: string };
    try {
      projectInfo = JSON.parse(data);
    } catch {
      return;
    }

    const timelineEl = e.currentTarget as HTMLElement;
    const rect = timelineEl.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;

    const totalScrollLeft = timelineEl.scrollLeft || 0;
    const totalScrollTop = timelineEl.scrollTop || 0;
    const absX = relX + totalScrollLeft;
    const contentY = relY + totalScrollTop;
    const dropDate = pxToDate(absX);

    const personGroups = store.personGroups.value;
    const rowIndex = findRowIndex(personGroups, contentY);
    const targetPerson =
      rowIndex >= 0 && rowIndex < personGroups.length
        ? personGroups[rowIndex].personId
        : null;

    const personId = targetPerson === '__unassigned__' ? null : targetPerson;

    const newTask = {
      id: `local-${Date.now()}`,
      title: projectInfo.projectName,
      projectId: projectInfo.projectId,
      startDate: dropDate,
      endDate: addDays(dropDate, 5),
      personId: personId ?? undefined,
    };

    store.createLocalTask(newTask);
  }

  function handleTimelineDragOver(e: DragEvent) {
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'copy';
    }
  }

  return {
    onTaskPointerDown,
    onKeyDatePointerDown,
    undo,
    handleTimelineDrop,
    handleTimelineDragOver,
  };
}
