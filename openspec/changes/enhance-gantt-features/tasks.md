## 1. Core Data Model Changes

- [x] 1.1 Add `position?: string` to `Person` interface in `packages/gantt-core/src/index.ts`
- [x] 1.2 Add `KeyDate` interface (`{ name: string; date: string }`) and export it from `packages/gantt-core/src/index.ts`
- [x] 1.3 Add `description?: string`, `requester?: string`, `keyDates?: KeyDate[]` to `Project` interface in `packages/gantt-core/src/index.ts`
- [x] 1.4 Add `projectOverrides?: Record<string, Partial<Pick<Project, 'description' | 'requester' | 'keyDates'>>>` to `EditsOverlay` interface in `packages/gantt-core/src/index.ts`

## 2. Store: Person Position Sorting

- [x] 2.1 Add `personSortMode` signal (`'name' | 'position'`) to `GanttStore` interface and `createGanttStore` in `packages/gantt-ui/src/store.ts`
- [x] 2.2 Add `position` to `PersonGroup` interface
- [x] 2.3 Update `personGroups` computed to populate `position` from the person data
- [x] 2.4 Update `personGroups` computed sort logic to support position-based ordering (unassigned last, persons without position after those with position)

## 3. Store: Project Custom Fields

- [x] 3.1 Update `projects` computed to include description, requester, and keyDates from cache
- [x] 3.2 Apply `projectOverrides` from `EditsOverlay` when computing project display data (similar to merge pattern for task fields)
- [x] 3.3 Add `persistProjectEdit(projectId, fieldName, value)` action to store for persisting project field changes to `edits/<view-id>.json`

## 4. Store: Bar Lane Assignment

- [x] 4.1 Add `lanes` computed or derived data structure to compute lane assignments per group using the greedy algorithm
- [x] 4.2 Add `groupRowOffsets` computed to calculate cumulative Y offsets accounting for lane-expanded row heights
- [x] 4.3 Include `laneIndex` and `laneCount` in the task bar data passed to rendering

## 5. Person View: Position Display and Sort Toggle

- [x] 5.1 Update `TaskList` labels in person pane to show position alongside name (format: `[position] · name`)
- [x] 5.2 Add person ID as `title` tooltip on person row labels
- [x] 5.3 Add sort toggle button to the person pane header area in `GanttPane` or `DualPane`
- [x] 5.4 Wire sort toggle to `personSortMode` signal, re-rendering person groups on change

## 6. Project Detail Panel

- [x] 6.1 Create `ProjectDetail` component for the right sidebar showing project name, color, description, requester, and key dates
- [x] 6.2 Integrate `ProjectDetail` into `DualPane` — render when `selectedEntity.type === 'project'`
- [x] 6.3 Add "Edit" / "Save" / "Cancel" button flow to `ProjectDetail` for toggling between view and edit modes
- [x] 6.4 Implement inline editing for description (textarea), requester (text input), and key dates (add/remove rows with name + date inputs)
- [x] 6.5 Wire edit save to `persistProjectEdit` store action

## 7. Bar Lane Stacking Rendering

- [x] 7.1 Define `LANE_OFFSET = 12` constant (12px per lane, ~50% of bar height) in `GanttChart.tsx`
- [x] 7.2 Implement lane assignment computation in the `Timeline` component's bar layout pass (sort by start date, greedy first-fit)
- [x] 7.3 Compute per-group lane count and cumulative Y offsets: `groupHeight = ROW_HEIGHT + (laneCount - 1) * LANE_OFFSET`
- [x] 7.4 Update `TaskBar` component to accept `laneIndex` and apply vertical offset `laneIndex * LANE_OFFSET` (partial overlap, not full row separation)
- [x] 7.5 Update `TaskList` row heights to match lane-expanded timeline row heights
- [x] 7.6 Update grid row background divs to span full lane-expanded height
- [x] 7.7 Update drag handler `rowIndex` calculations to account for cumulative Y offsets from lane-expanded rows

## 8. Key Date Timeline Markers

- [x] 8.1 Create `KeyDateMarker` component for rendering diamond-shaped markers on the timeline
- [x] 8.2 Compute key date pixel positions in the `Timeline` component's render pass
- [x] 8.3 Render key date markers within their project's group row area
- [x] 8.4 Add tooltip (title attribute) showing key date name and date on hover

## 9. Styling

- [x] 9.1 Add CSS for person position badge in task list rows
- [x] 9.2 Add CSS for project detail panel (form inputs, key date editor rows)
- [x] 9.3 Add CSS for key date diamond markers (rotated square, color, hover state)
- [x] 9.4 Add CSS for lane-stacked bars (ensure z-index stacking, visual distinction between adjacent lanes)
- [x] 9.5 Add CSS for sort toggle button in person pane header

## 10. Integration and Verification

- [x] 10.1 Verify person position sorting works with sample data in the web app
- [x] 10.2 Verify project custom fields display, edit, and persist correctly
- [x] 10.3 Verify bar lane stacking renders correctly with overlapping tasks (2, 3, and 4 overlapping bars)
- [x] 10.4 Verify drag operations still work correctly with lane-expanded rows
- [x] 10.5 Verify scroll sync and today-line still work with variable row heights
- [x] 10.6 Verify no regressions: existing views load without errors, legacy data without new fields handled gracefully
