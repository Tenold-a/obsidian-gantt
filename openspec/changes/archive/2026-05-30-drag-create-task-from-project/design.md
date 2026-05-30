## Context

The drop infrastructure in [drag.ts](packages/gantt-ui/src/drag.ts#L367-L409) already handles creating local tasks from draggable project cards. `handleTimelineDrop` reads `dataTransfer` JSON containing `{ projectId, projectName }`, computes the target date and person row from pointer coordinates, and calls `store.createLocalTask()`. The `UnassignedPanel` already uses this by rendering `draggable={true}` cards.

## Goals / Non-Goals

**Goals:**
- Add a draggable element in `ProjectDetail` that creates tasks for the currently viewed project
- Reuse the existing `handleTimelineDrop` handler without modification
- The new task should default to the project name as title, 5-day duration, and inherit the drop person + date

**Non-Goals:**
- Customizing task defaults (title, duration) before drag
- Dragging to the project Gantt (only person Gantt creates person-assigned tasks)
- Multi-project drag or batch creation

## Decisions

### 1. Draggable button in ProjectDetail header

Add a `draggable={true}` button element in the ProjectDetail header bar (alongside Edit/Delete/Close). On `onDragStart`, set `dataTransfer` with `{ projectId, projectName }` in the exact same format as UnassignedPanel cards. The existing `handleTimelineDrop` in the person Gantt pane handles the rest.

**Why reuse existing format?** The drop handler already parses `{ projectId, projectName }` and creates tasks. Zero new parsing logic needed.

**Why a button and not a draggable card?** The project detail panel already shows project info; a separate card would be redundant. A compact button labeled "Drag to timeline" or using a drag icon is clearer.

## Risks / Trade-offs

- **Visual clarity**: Users may not realize the button is draggable → Use a grip/drag icon and cursor styling
