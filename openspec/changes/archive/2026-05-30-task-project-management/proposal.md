## Why

The Gantt chart currently functions as a read-only visualization tool. Users cannot edit task/project names inline, manage entity status lifecycle, delete entities, or push local changes back to upstream systems. These gaps make the tool unsuitable for daily project management workflows where names change, statuses evolve, and stale entities need cleanup.

## What Changes

- **Project detail panel shows associated tasks**: When viewing a project in the detail panel, a list of all tasks linked to that project is displayed, with clickable task names to navigate
- **Inline name editing**: Task titles and project names become editable directly in their detail panels (click to edit, Enter/Blur to save)
- **Clickable task URLs**: The task detail panel renders the `url` field as a clickable link that opens in the external browser
- **Pending changes panel**: A new panel accessible from the toolbar shows all local edits (overrides, new local tasks, project overrides, deletions). Supports one-click push to upstream when the connector implements the new optional `push()` method
- **Task and project status with cascading linkage**: Both tasks and projects gain a `status` field with six states: pending (待开始), in-progress (进行中), cancelled (已取消), pending-online (待上线), online (已上线), completed (已完成). Cascading rules: marking a project completed auto-completes all its tasks; completing all tasks in a project auto-completes the project
- **Entity deletion with confirmation**: Delete buttons on task detail and project detail panels, with a modal confirmation dialog before execution

## Capabilities

### New Capabilities
- `task-project-status`: Status field on Task and Project entities with six lifecycle states and cascading completion linkage between tasks and their parent project
- `inline-name-editing`: Click-to-edit inline name editing on task detail panel (title field) and project detail panel (name field)
- `pending-changes-panel`: A diff-style panel showing all unsubmitted local changes with one-click push to upstream connectors
- `entity-deletion`: Delete tasks and projects from the detail panel with a confirmation dialog requiring explicit user acknowledgement

### Modified Capabilities
- `local-data-store`: EditsOverlay schema extended with `deletedTasks`, `deletedProjects`, and status fields in overrides; projectOverrides extended to include `name` and `status`; merge engine updated to filter deleted entities
- `connector-system`: `ConnectorModule` interface extended with optional `push?()` method for writing local changes back to upstream systems
- `gantt-renderer`: DetailPanel gains URL link rendering, inline title editing, status selector, and delete button; ProjectDetail gains associated task list, inline name editing, status selector, and delete button

## Impact

- **Core types**: `Task` and `Project` interfaces gain optional `status` field; `EditsOverlay` gains `deletedTasks` and `deletedProjects` arrays; `ConnectorModule` gains optional `push` method
- **Merge engine**: Updated to filter out deleted entities and apply status cascade logic
- **Store**: New actions for `deleteTask`, `deleteProject`, `setTaskStatus`, `setProjectStatus`, `pushChanges`; new signals for pending changes tracking
- **UI components**: `DetailPanel`, `ProjectDetail` significantly expanded; new `PendingChangesPanel` and `ConfirmDialog` components in GanttChart.tsx
- **Styles**: New CSS classes for status badges, confirm dialog, inline edit inputs, pending changes panel in styles.css
- **No breaking changes**: All existing APIs and behaviors preserved; new fields are optional
