## Why

Currently, creating a task linked to a project requires dragging from the Unassigned Projects panel, which only lists projects that have no tasks. Once a project has at least one task, it disappears from that panel and there's no way to drag-create additional tasks for it. Users need a way to create new tasks for any project directly from its detail panel.

## What Changes

- Add a draggable "Create Task" button in the project detail panel header area
- Dragging this button to the person Gantt timeline creates a new task assigned to both the project and the person whose row it was dropped on, at the drop date position
- The button reuses the existing `handleTimelineDrop` infrastructure which already handles date calculation, person row detection, and local task creation

## Capabilities

### New Capabilities
- `drag-create-task-from-project`: A draggable element in the project detail panel that creates new tasks on the person Gantt timeline via drag-and-drop

### Modified Capabilities
- `gantt-renderer`: ProjectDetail component gains a draggable create-task button alongside the existing Edit/Delete/Close buttons

## Impact

- **UI**: `ProjectDetail` in [GanttChart.tsx](packages/gantt-ui/src/GanttChart.tsx) — adds one draggable button element with `onDragStart` handler
- **No new store actions or core changes**: Reuses `store.createLocalTask()` via the existing `handleTimelineDrop` path
- **No breaking changes**
