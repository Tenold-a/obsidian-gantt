## ADDED Requirements

### Requirement: Move task bar drag
The system SHALL support dragging a task bar horizontally to change both its start and end dates simultaneously, preserving the task's duration.

#### Scenario: Drag bar to new dates
- **WHEN** a user presses on the body of a task bar with `startDate: "2026-06-01"` and `endDate: "2026-06-05"` and drags it 30px right (1 day at 30px/day)
- **THEN** after drop, the task SHALL have `startDate: "2026-06-02"` and `endDate: "2026-06-06"`

#### Scenario: Snap to day boundary
- **WHEN** a user drags a task bar and releases it at a position between two day boundaries
- **THEN** the bar SHALL snap to the nearest day boundary

#### Scenario: Drag prevented outside valid range
- **WHEN** a user drags a task bar beyond the timeline's minimum or maximum date
- **THEN** the bar SHALL be clamped to the timeline boundary

### Requirement: Resize task bar edges
The system SHALL support dragging the left or right edge of a task bar to change its start date or end date independently.

#### Scenario: Drag left edge changes start date
- **WHEN** a user drags the left edge of a bar 60px left (2 days at 30px/day)
- **THEN** the task's `startDate` SHALL decrease by 2 days and `endDate` SHALL remain unchanged

#### Scenario: Drag right edge changes end date
- **WHEN** a user drags the right edge of a bar 30px right
- **THEN** the task's `endDate` SHALL increase by 1 day and `startDate` SHALL remain unchanged

#### Scenario: Edge hit area
- **WHEN** the pointer is within 6px of the left or right edge of a task bar
- **THEN** the cursor SHALL change to `ew-resize` and dragging SHALL perform edge resize

#### Scenario: Minimum task duration
- **WHEN** a user resizes a task bar to less than 1 day in width
- **THEN** the task SHALL be clamped to a minimum duration of 1 day

### Requirement: Card-to-timeline drag for assignment
The system SHALL support dragging a task card from the unassigned panel onto a specific person row in the timeline to assign that task to that person.

#### Scenario: Assign unassigned task to person
- **WHEN** an unassigned project card is dragged from the right panel and dropped onto the timeline row for "张三"
- **THEN** a new local task with `title: "<project name>"` and `personId: "zhangsan"` SHALL be created at the drop date position

#### Scenario: Drop position determines start date
- **WHEN** an unassigned project card is dropped at a position corresponding to June 10 on the timeline
- **THEN** the created task SHALL have `startDate: "2026-06-10"` and a default duration

#### Scenario: Task appears in both views
- **WHEN** a task is created via card drag
- **THEN** the task SHALL immediately appear in both the person Gantt (under the assigned person) and the project Gantt (under its project)

### Requirement: Drag ghost and visual feedback
The system SHALL show a semi-transparent "ghost" bar during drag operations, positioned at the current pointer location with real-time snap-to-grid.

#### Scenario: Ghost bar follows pointer
- **WHEN** a user drags a task bar
- **THEN** a ghost bar at the pointer position SHALL be visible at all times during the drag

#### Scenario: Ghost bar snaps to grid
- **WHEN** a user moves the pointer during a drag
- **THEN** the ghost bar SHALL snap to the nearest day boundary

#### Scenario: Drop target row highlight
- **WHEN** a user drags a project card over a specific person row
- **THEN** that person row SHALL highlight to indicate it is a valid drop target

### Requirement: Edit persistence on drop
All drag operations SHALL persist their results to the edits file immediately upon drop.

#### Scenario: Move drag persists
- **WHEN** a user drops a task bar after moving it
- **THEN** the new `startDate` and `endDate` SHALL be written to `edits/<view-id>.json` under that task's `overrides`

#### Scenario: Resize drag persists
- **WHEN** a user drops a bar edge after resizing
- **THEN** the new start or end date SHALL be written to `edits/<view-id>.json`

#### Scenario: Card drag persists
- **WHEN** a user drops a project card creating a new task
- **THEN** the new task SHALL be appended to `localTasks` in `edits/<view-id>.json`

### Requirement: Undo drag
The system SHALL support undoing the most recent drag operation by pressing Ctrl+Z (Cmd+Z on Mac).

#### Scenario: Undo move
- **WHEN** a user presses Ctrl+Z after moving a task bar
- **THEN** the task SHALL revert to its previous dates and the edit SHALL be removed from the edits file

#### Scenario: Undo card-to-timeline
- **WHEN** a user presses Ctrl+Z after creating a task via card drop
- **THEN** the task SHALL be removed and the project SHALL reappear in the unassigned panel
