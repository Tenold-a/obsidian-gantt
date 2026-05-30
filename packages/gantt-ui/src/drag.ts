import { signal } from '@preact/signals';
import type { GanttStore } from './store';
import { addDays, daysBetween } from '@obsidian-gantt/core';
import { TIMELINE_ORIGIN, dateToAbsolutePixel, absolutePixelToDate } from './components';

const DAY_WIDTH = 30;
const ROW_HEIGHT = 40;

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

  function onPointerMove(e: PointerEvent) {
    const ds = dragState.value;
    if (!ds) return;

    const dx = e.clientX - ds.pointerStartX;
    const dayDelta = Math.round(dx / DAY_WIDTH);

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
        const currentScrollTop = scrollEl?.scrollTop ?? 0;
        const bodyTop = ds.bodyTopStart;
        const absoluteY = (e.clientY - bodyTop) + currentScrollTop;
        const newRowIndex = Math.max(0, Math.min(pg.length - 1,
          Math.floor(absoluteY / ROW_HEIGHT)));
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
    const absX = relX + totalScrollLeft;
    const dropDate = pxToDate(absX);

    const personGroups = store.personGroups.value;
    const rowIndex = Math.floor(relY / ROW_HEIGHT);
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
    undo,
    handleTimelineDrop,
    handleTimelineDragOver,
  };
}
