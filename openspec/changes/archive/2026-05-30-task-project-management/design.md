## Context

The Gantt chart is built with Preact + `@preact/signals` for state management. The store ([store.ts](packages/gantt-ui/src/store.ts)) exposes raw signals and computed values, with action functions for persistence. The UI lives primarily in [GanttChart.tsx](packages/gantt-ui/src/GanttChart.tsx) (~1650 lines), with reusable bar/grid components in [components.tsx](packages/gantt-ui/src/components.tsx). Core data types are defined in [packages/gantt-core/src/index.ts](packages/gantt-core/src/index.ts), and the merge pipeline in [merge-engine.ts](packages/gantt-core/src/merge-engine.ts).

The data flow is: Connector scripts → `fetch()` → `transform()` → `CacheFile` → stored in vault/localStorage. User edits go to `EditsOverlay` (edits/<view-id>.json). The merge engine combines caches + edits into `LocalTask[]` with per-field source tracking.

## Goals / Non-Goals

**Goals:**
- Add `status` field to Task and Project with six lifecycle states and cascading completion logic
- Support inline click-to-edit for task title and project name in detail panels
- Render task `url` field as a clickable external link in the task detail panel
- Build a pending changes panel showing all local modifications with push capability
- Add delete functionality for tasks and projects with confirmation dialog
- Keep all new fields optional for backward compatibility

**Non-Goals:**
- Bulk status changes or multi-select operations
- Custom status definitions (the six states are fixed)
- Undo for delete operations (deletion is permanent in local storage)
- Push conflict resolution UI (first push wins; conflicts surfaced as errors)
- Status-based filtering or sorting in the Gantt view (can be added later)
- Drag-and-drop status changes

## Decisions

### 1. Status field as optional string on Task and Project

Add `status?: TaskStatus` to both `Task` and `Project` interfaces in core. Define `TaskStatus` as a union type: `'pending' | 'in-progress' | 'cancelled' | 'pending-online' | 'online' | 'completed'`. Status is tracked through the existing override mechanism: task status goes through `EditsOverlay.overrides[taskId].status`, project status through `EditsOverlay.projectOverrides[projectId].status`.

**Why an enum-like string union?** Simple, serializable, no migration needed. The existing override system handles it naturally.

**Why not a separate status entity?** Status is tightly coupled to the entity lifecycle. A separate entity would add complexity with no benefit for six predefined states.

### 2. Cascading completion in the merge engine

The status cascade logic runs in a new `applyStatusCascade()` function called after `mergeAll()`:

- **Project → Tasks**: When a project's status changes to `'completed'`, all its tasks that are not already `'cancelled'` also become `'completed'`. This is implemented by checking project status during merge and overriding task status.
- **Tasks → Project**: When all tasks in a project (excluding cancelled) are `'completed'`, the project auto-completes. This runs as a computed check, not a persisted override.
- **Bidirectional enforcement**: The cascade is applied during merge so it always reflects current state. Manual status changes on individual tasks bypass the cascade for that specific field (the override takes precedence).

**Why in the merge engine and not in the UI?** Ensures consistency regardless of where the status change originates (drag, detail panel, connector refresh). The merge engine is the single chokepoint for all data.

**Why computed for tasks→project but persisted for project→tasks?** Project→tasks changes task state (needs persistence). Tasks→project is derived (all tasks completed → project looks completed) but the user can still manually set project status which creates an override.

### 3. Inline editing via local component state with save-on-blur/enter

Each detail panel manages an `isEditing` signal for the name field. Clicking the name switches to an `<input>` with the current value. Pressing Enter or blurring saves via `store.persistEdit(taskId, 'title', value)` for tasks or `store.persistProjectEdit(projectId, 'name', value)` for projects. Pressing Escape cancels and reverts.

**Why not always-visible input?** Read-only display is cleaner for quick scanning. Click-to-edit is a well-established pattern (GitHub issues, Notion, etc.).

**Why separate from the existing "Edit" mode on ProjectDetail?** The name is the primary identifier and should be quickly editable without entering full edit mode. The existing Edit button flow for description/keyDates/keyLinks remains unchanged.

### 4. Pending changes panel as a new toolbar-triggered panel

A new `PendingChangesPanel` component renders as an overlay/modal triggered by a toolbar button. It reads from the store:
- `edits.overrides` — shows task ID, field name, old value, new value
- `edits.localTasks` — shows locally created tasks
- `edits.projectOverrides` — shows project field changes
- `edits.deletedTasks` / `edits.deletedProjects` — shows deletions

The "Push" button calls `store.pushChanges()` which:
1. Collects all edits into a structured payload
2. Iterates through connectors, calling `connector.push(changes, context)` for those that implement the optional `push()` method
3. On success, clears the relevant edits from the overlay
4. On failure, shows error per connector

**Why a modal/panel rather than inline indicators?** A dedicated panel gives users a deliberate review step before pushing. Inline indicators would be noisy for day-to-day use.

**Why optional `push()` on connectors?** Not all data sources support write-back (e.g., CSV files, read-only APIs). Making it optional allows gradual adoption.

### 5. Confirmation dialog as a lightweight Preact component

A `ConfirmDialog` component renders as a fixed-position overlay with backdrop. It accepts `message`, `onConfirm`, and `onCancel` props. Used by both task and project delete flows. The dialog traps focus and closes on Escape.

**Why a custom component and not `window.confirm`?** `window.confirm` is blocking, unstyled, and inconsistent with the Obsidian theme. A Preact component integrates with the existing styling and is non-blocking.

### 6. Entity deletion via edits overlay arrays

Deleted entities are tracked in new optional arrays on `EditsOverlay`:
- `deletedTasks?: string[]` — task IDs marked for deletion
- `deletedProjects?: string[]` — project IDs marked for deletion

The merge engine filters out deleted entities. Deletion is a two-phase process:
1. User clicks Delete → ConfirmDialog appears → on confirm, the entity ID is added to the deletion array and the edits file is persisted
2. The merge engine skips deleted entities, effectively removing them from the view

For local tasks (no upstream source), the task is removed from `localTasks` array instead of being added to `deletedTasks`.

**Why deletion arrays and not just hiding?** Hiding is already supported via the `hidden` array but is semantically different (hide = temporarily remove from view; delete = permanently remove). Using separate arrays makes the intent clear and supports the pending changes workflow.

**Why not immediately delete from disk?** The two-phase approach allows undo (remove from deletion array) and makes deletions visible in the pending changes panel.

### 7. Project detail shows associated tasks

In `ProjectDetail`, when viewing a project, render a new "Tasks" section below Key Links. This lists all tasks from `mergedTasks` filtered by `projectId`. Each task name is clickable, calling `store.selectEntity({ type: 'task', id: task.id })`. The task count is shown in the section header.

**Why inline in ProjectDetail and not a separate panel?** Keeps all project information in one scrollable view. The task list is compact (name only, no dates/bars).

## Risks / Trade-offs

- **Status cascade complexity**: Bidirectional cascade could create update loops → Mitigation: cascade runs once during merge with guard flags; status overrides take precedence over computed cascade
- **Push reliability**: Connector `push()` failures leave local state unchanged; repeated push attempts needed → Mitigation: show per-connector push status with error details; user can retry
- **Deletion irreversibility**: Once pushed upstream, deletion can't be undone locally → Mitigation: confirmation dialog with clear messaging; deleted items remain recoverable until push
- **Pending changes panel performance**: Large edit volumes could make the panel slow → Mitigation: edits are typically small (user-driven changes); virtualize if needed in future
- **Name edit persistence on every keystroke**: Could cause excessive writes → Mitigation: save on blur/enter only, not on each keystroke
