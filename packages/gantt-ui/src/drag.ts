import { signal } from '@preact/signals';
import type { GanttStore } from './store';
import { pixelToDate, addDays, daysBetween } from '@obsidian-gantt/core';

const DAY_WIDTH = 30;

// ============================================================
// Drag state
// ============================================================

export interface DragState {
  taskId: string;
  edge: 'left' | 'right' | 'body';
  originalStartDate: string;
  originalEndDate: string;
  currentStartDate: string;
  currentEndDate: string;
  ghostLeft: number;
  ghostWidth: number;
  pointerStartX: number;
  pointerStartY: number;
}

export const dragState = signal<DragState | null>(null);

// ============================================================
// usePointerDrag hook — attaches global listeners on drag start
// ============================================================

export function createDragHandler(store: GanttStore) {
  let undoStack: Array<() => Promise<void>> = [];

  function onTaskPointerDown(
    e: PointerEvent,
    taskId: string,
    edge: 'left' | 'right' | 'body',
  ) {
    const task = store.mergedTasks.value.find(t => t.id === taskId);
    if (!task) return;

    const startDate = task.startDate.value;
    const endDate = task.endDate.value;
    if (!startDate) return;

    const effectiveEnd = endDate ?? startDate;
    const range = store.timelineRange.value;
    const baseLeft = (daysBetween(range.startDate, startDate) ?? 0) * DAY_WIDTH;
    const baseRight = (daysBetween(range.startDate, effectiveEnd) ?? 0) * DAY_WIDTH;

    const ds: DragState = {
      taskId,
      edge,
      originalStartDate: startDate,
      originalEndDate: effectiveEnd,
      currentStartDate: startDate,
      currentEndDate: effectiveEnd,
      ghostLeft: baseLeft,
      ghostWidth: Math.max(baseRight - baseLeft, 4),
      pointerStartX: e.clientX,
      pointerStartY: e.clientY,
    };

    dragState.value = ds;

    // Prevent text selection during drag
    document.body.style.userSelect = 'none';
    (e.target as HTMLElement)?.setPointerCapture?.(e.pointerId);

    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
  }

  function onPointerMove(e: PointerEvent) {
    const ds = dragState.value;
    if (!ds) return;

    const range = store.timelineRange.value;
    const dx = e.clientX - ds.pointerStartX;
    const dayDelta = Math.round(dx / DAY_WIDTH);

    if (ds.edge === 'body') {
      // Move entire bar
      const newStart = addDays(ds.originalStartDate, dayDelta);
      const duration = daysBetween(ds.originalStartDate, ds.originalEndDate);
      const newEnd = addDays(newStart, duration);

      ds.currentStartDate = newStart;
      ds.currentEndDate = newEnd;
      ds.ghostLeft = (daysBetween(range.startDate, newStart) ?? 0) * DAY_WIDTH;
      ds.ghostWidth = Math.max(duration * DAY_WIDTH, 4);
    } else if (ds.edge === 'left') {
      // Resize left edge
      const newStart = addDays(ds.originalStartDate, dayDelta);
      // Clamp: start must be before end by at least 1 day
      if (daysBetween(newStart, ds.originalEndDate) >= 1) {
        ds.currentStartDate = newStart;
        ds.ghostLeft = (daysBetween(range.startDate, newStart) ?? 0) * DAY_WIDTH;
        ds.ghostWidth = Math.max(daysBetween(newStart, ds.originalEndDate) * DAY_WIDTH, 4);
      }
    } else if (ds.edge === 'right') {
      // Resize right edge
      const newEnd = addDays(ds.originalEndDate, dayDelta);
      // Clamp: end must be after start by at least 1 day
      if (daysBetween(ds.originalStartDate, newEnd) >= 1) {
        ds.currentEndDate = newEnd;
        ds.ghostWidth = Math.max(daysBetween(ds.originalStartDate, newEnd) * DAY_WIDTH, 4);
      }
    }

    // Clamp to timeline boundaries
    const minDay = store.timelineRange.value.startDate;
    const maxDay = store.timelineRange.value.endDate;
    if (ds.currentStartDate < minDay) {
      ds.currentStartDate = minDay;
      ds.ghostLeft = 0;
    }
    if (ds.currentEndDate > maxDay) {
      ds.currentEndDate = maxDay;
    }

    dragState.value = { ...ds };
  }

  async function onPointerUp(_e: PointerEvent) {
    const ds = dragState.value;
    if (!ds) return;

    document.body.style.userSelect = '';
    document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerup', onPointerUp);

    // Snapshot states before clearing
    const taskId = ds.taskId;
    const newStart = ds.currentStartDate;
    const newEnd = ds.currentEndDate;
    const origStart = ds.originalStartDate;
    const origEnd = ds.originalEndDate;

    dragState.value = null;

    // If nothing changed, skip persistence
    if (newStart === origStart && newEnd === origEnd) return;

    // Build undo function using captured values
    const undo = async () => {
      if (origStart !== newStart) {
        await store.persistEdit(taskId, 'startDate', origStart);
      }
      if (origEnd !== newEnd) {
        await store.persistEdit(taskId, 'endDate', origEnd);
      }
    };

    // Persist changes
    if (newStart !== origStart) {
      await store.persistEdit(taskId, 'startDate', newStart);
    }
    if (newEnd !== origEnd) {
      await store.persistEdit(taskId, 'endDate', newEnd);
    }

    // Push undo
    undoStack.push(undo);

    // Re-merge to update UI
    // (edits signal update triggers recomputation)
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

    const range = store.timelineRange.value;
    const ROW_HEIGHT = 40;

    // Calculate drop date from x position
    const totalScrollLeft = (timelineEl as HTMLElement).scrollLeft || 0;
    const absX = relX + totalScrollLeft;
    const dropDate = pixelToDate(absX, range.startDate, DAY_WIDTH);

    // Calculate which person row from y position
    const personGroups = store.personGroups.value;
    const rowIndex = Math.floor(relY / ROW_HEIGHT);
    const targetPerson =
      rowIndex >= 0 && rowIndex < personGroups.length
        ? personGroups[rowIndex].personId
        : null;

    // If dropped on "unassigned", just create without person
    const personId = targetPerson === '__unassigned__' ? null : targetPerson;

    // Create local task
    const newTask = {
      id: `local-${Date.now()}`,
      title: projectInfo.projectName,
      projectId: projectInfo.projectId,
      startDate: dropDate,
      endDate: addDays(dropDate, 5), // default 5-day duration
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
