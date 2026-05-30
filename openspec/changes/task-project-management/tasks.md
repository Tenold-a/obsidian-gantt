## 1. Core type changes

- [x] 1.1 Add `TaskStatus` type union (`'pending' | 'in-progress' | 'cancelled' | 'pending-online' | 'online' | 'completed'`) and `status?` field to `Task` interface in [packages/gantt-core/src/index.ts](packages/gantt-core/src/index.ts)
- [x] 1.2 Add `status?` field to `Project` interface in [packages/gantt-core/src/index.ts](packages/gantt-core/src/index.ts)
- [x] 1.3 Add `status` to `TaskOverride` type in [packages/gantt-core/src/index.ts](packages/gantt-core/src/index.ts)
- [x] 1.4 Add `deletedTasks?: string[]` and `deletedProjects?: string[]` to `EditsOverlay` interface in [packages/gantt-core/src/index.ts](packages/gantt-core/src/index.ts)
- [x] 1.5 Extend `projectOverrides` value type to include `name?: string` and `status?: string` in [packages/gantt-core/src/index.ts](packages/gantt-core/src/index.ts)
- [x] 1.6 Add optional `push?(changes: PushChangesPayload, ctx: ConnectorContext): Promise<PushResult>` to `ConnectorModule` interface in [packages/gantt-core/src/index.ts](packages/gantt-core/src/index.ts)
- [x] 1.7 Define `PushChangesPayload` interface (`tasks: Task[]`, `projects: Project[]`, `deletedTaskIds: string[]`, `deletedProjectIds: string[]`) and `PushResult` type (`{ success: boolean; error?: string }`) in [packages/gantt-core/src/index.ts](packages/gantt-core/src/index.ts)
- [x] 1.8 Add `status` to `TaskOverride` pick list and `FieldWithSource`-wrapped fields in `LocalTask` in [packages/gantt-core/src/index.ts](packages/gantt-core/src/index.ts)

## 2. Merge engine updates

- [x] 2.1 Update `mergeFields()` to propagate `status` field from upstream/overrides in [packages/gantt-core/src/merge-engine.ts](packages/gantt-core/src/merge-engine.ts)
- [x] 2.2 Update `mergeTasks()` to filter out tasks whose IDs are in `edits.deletedTasks` in [packages/gantt-core/src/merge-engine.ts](packages/gantt-core/src/merge-engine.ts)
- [x] 2.3 Add `applyStatusCascade()` function: when project status is `'completed'`, set all non-cancelled tasks in that project to `'completed'` in [packages/gantt-core/src/merge-engine.ts](packages/gantt-core/src/merge-engine.ts)
- [x] 2.4 Add reverse cascade in `applyStatusCascade()`: when all non-cancelled tasks in a project are `'completed'` and no manual project status override exists, set project status to `'completed'` in [packages/gantt-core/src/merge-engine.ts](packages/gantt-core/src/merge-engine.ts)
- [x] 2.5 Call `applyStatusCascade()` from `mergeAll()` after merging all tasks/projects in [packages/gantt-core/src/merge-engine.ts](packages/gantt-core/src/merge-engine.ts)
- [x] 2.6 Export `applyStatusCascade` from core index in [packages/gantt-core/src/index.ts](packages/gantt-core/src/index.ts)

## 3. Store actions

- [x] 3.1 Add `deleteTask(taskId: string)` action: for upstream tasks, add to `deletedTasks`; for local tasks, remove from `localTasks` array; persist edits in [packages/gantt-ui/src/store.ts](packages/gantt-ui/src/store.ts)
- [x] 3.2 Add `deleteProject(projectId: string)` action: add to `deletedProjects`, cascade-delete associated tasks, persist edits in [packages/gantt-ui/src/store.ts](packages/gantt-ui/src/store.ts)
- [x] 3.3 Add `setTaskStatus(taskId: string, status: string)` action via existing `persistEdit` in [packages/gantt-ui/src/store.ts](packages/gantt-ui/src/store.ts)
- [x] 3.4 Add `setProjectStatus(projectId: string, status: string)` action via existing `persistProjectEdit` in [packages/gantt-ui/src/store.ts](packages/gantt-ui/src/store.ts)
- [x] 3.5 Add `pushChanges()` action: collect all local changes into `PushChangesPayload`, iterate connectors calling `push()` if available, clear edits on success in [packages/gantt-ui/src/store.ts](packages/gantt-ui/src/store.ts)
- [x] 3.6 Add `pendingChanges` computed signal that aggregates all local modifications into a structured list (overrides, localTasks, projectOverrides, deletions) in [packages/gantt-ui/src/store.ts](packages/gantt-ui/src/store.ts)
- [x] 3.7 Update `GanttStore` interface to include new actions and signals in [packages/gantt-ui/src/store.ts](packages/gantt-ui/src/store.ts)

## 4. Inline name editing UI

- [x] 4.1 Add inline editing state (`isEditingTitle` signal, edit input ref) to `DetailPanel` in [packages/gantt-ui/src/GanttChart.tsx](packages/gantt-ui/src/GanttChart.tsx)
- [x] 4.2 Replace static task title display with clickable element that switches to `<input>` on click, saves on Enter/blur, cancels on Escape in [packages/gantt-ui/src/GanttChart.tsx](packages/gantt-ui/src/GanttChart.tsx)
- [x] 4.3 Add inline editing state (`isEditingName` signal) to `ProjectDetail` in [packages/gantt-ui/src/GanttChart.tsx](packages/gantt-ui/src/GanttChart.tsx)
- [x] 4.4 Replace static project name display with clickable element that switches to `<input>`, saves via `store.persistProjectEdit(projectId, 'name', value)` in [packages/gantt-ui/src/GanttChart.tsx](packages/gantt-ui/src/GanttChart.tsx)

## 5. Task URL and project task list

- [x] 5.1 Add clickable URL link rendering in `DetailPanel` using `<a>` tag with `target="_blank"` and `rel="noopener noreferrer"` for `task.url.value` in [packages/gantt-ui/src/GanttChart.tsx](packages/gantt-ui/src/GanttChart.tsx)
- [x] 5.2 Add "Tasks" section to `ProjectDetail` showing all tasks with `projectId` matching the selected project, with task count in header in [packages/gantt-ui/src/GanttChart.tsx](packages/gantt-ui/src/GanttChart.tsx)
- [x] 5.3 Make task names in the project task list clickable, calling `store.selectEntity({ type: 'task', id })` to navigate in [packages/gantt-ui/src/GanttChart.tsx](packages/gantt-ui/src/GanttChart.tsx)

## 6. Status management UI

- [x] 6.1 Add `StatusBadge` helper component that renders a colored badge for a given status value used in both `DetailPanel` and `ProjectDetail` in [packages/gantt-ui/src/GanttChart.tsx](packages/gantt-ui/src/GanttChart.tsx)
- [x] 6.2 Add status dropdown selector to `DetailPanel` with all six status options, calling `store.setTaskStatus()` on change in [packages/gantt-ui/src/GanttChart.tsx](packages/gantt-ui/src/GanttChart.tsx)
- [x] 6.3 Add status dropdown selector to `ProjectDetail` with all six status options, calling `store.setProjectStatus()` on change in [packages/gantt-ui/src/GanttChart.tsx](packages/gantt-ui/src/GanttChart.tsx)

## 7. Confirmation dialog component

- [x] 7.1 Create `ConfirmDialog` component with backdrop overlay, message text, Confirm and Cancel buttons, focus trap, and Escape-to-close in [packages/gantt-ui/src/GanttChart.tsx](packages/gantt-ui/src/GanttChart.tsx)
- [x] 7.2 Add `confirmState` signal to `GanttChart` for managing dialog state: `{ message: string; onConfirm: () => void } | null` in [packages/gantt-ui/src/GanttChart.tsx](packages/gantt-ui/src/GanttChart.tsx)
- [x] 7.3 Render `ConfirmDialog` at the `GanttChart` top level when `confirmState` is non-null in [packages/gantt-ui/src/GanttChart.tsx](packages/gantt-ui/src/GanttChart.tsx)

## 8. Deletion UI

- [x] 8.1 Add delete button to `DetailPanel` header, triggering confirmation dialog then calling `store.deleteTask()` in [packages/gantt-ui/src/GanttChart.tsx](packages/gantt-ui/src/GanttChart.tsx)
- [x] 8.2 Add delete button to `ProjectDetail` header, triggering confirmation dialog (with warning about associated tasks) then calling `store.deleteProject()` in [packages/gantt-ui/src/GanttChart.tsx](packages/gantt-ui/src/GanttChart.tsx)

## 9. Pending changes panel

- [x] 9.1 Create `PendingChangesPanel` component showing changes grouped by category: field overrides, local tasks, project overrides, deletions in [packages/gantt-ui/src/GanttChart.tsx](packages/gantt-ui/src/GanttChart.tsx)
- [x] 9.2 Add "Push" button to `PendingChangesPanel` that calls `store.pushChanges()` with loading/error state display in [packages/gantt-ui/src/GanttChart.tsx](packages/gantt-ui/src/GanttChart.tsx)
- [x] 9.3 Add "Pending Changes" toolbar button (visible when `pendingChanges` is non-empty) that toggles the panel open/closed in [packages/gantt-ui/src/GanttChart.tsx](packages/gantt-ui/src/GanttChart.tsx)

## 10. Styles

- [x] 10.1 Add CSS for inline edit inputs (matching detail panel styling) in [packages/obsidian-plugin/styles.css](packages/obsidian-plugin/styles.css)
- [x] 10.2 Add CSS for status badges (colored backgrounds matching status colors) in [packages/obsidian-plugin/styles.css](packages/obsidian-plugin/styles.css)
- [x] 10.3 Add CSS for confirmation dialog (backdrop, centered modal, button styling) in [packages/obsidian-plugin/styles.css](packages/obsidian-plugin/styles.css)
- [x] 10.4 Add CSS for pending changes panel (overlay/panel layout, change item rows, push button) in [packages/obsidian-plugin/styles.css](packages/obsidian-plugin/styles.css)
- [x] 10.5 Add CSS for delete button (red/danger styling) in [packages/obsidian-plugin/styles.css](packages/obsidian-plugin/styles.css)

## 11. Build verification

- [x] 11.1 Run `npm run build` to verify all TypeScript compiles without errors
- [ ] 11.2 Verify task detail panel shows URL as clickable link, inline title editing works, status selector functions, and delete button with confirmation works
- [ ] 11.3 Verify project detail panel shows associated tasks, inline name editing works, status selector functions, and delete button with confirmation works
- [ ] 11.4 Verify status cascade: completing all tasks auto-completes project; completing project auto-completes all non-cancelled tasks
- [ ] 11.5 Verify pending changes panel shows all local modifications and push button behavior (including no-push-connector fallback message)
