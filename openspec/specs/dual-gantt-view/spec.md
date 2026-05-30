## Purpose

[brief description]

## Requirements

### Requirement: Split view layout
The system SHALL display two Gantt charts stacked vertically: the upper pane showing tasks grouped by person, and the lower pane showing tasks grouped by project. A resize handle SHALL separate them, allowing adjustment of the vertical space allocation.

#### Scenario: Default split ratio
- **WHEN** the dual Gantt view first loads
- **THEN** the vertical space SHALL be split evenly (50/50) between the person Gantt and project Gantt

#### Scenario: Resize handle drag
- **WHEN** the user drags the resize handle between the two panes
- **THEN** the person Gantt height and project Gantt height SHALL adjust proportionally

#### Scenario: Each pane has its own task list
- **WHEN** the person Gantt renders
- **THEN** its left sidebar SHALL list person names as row labels
- **AND** the project Gantt's left sidebar SHALL list project names as row labels

### Requirement: Independent vertical scrolling
Each Gantt pane SHALL scroll vertically independently of the other. Each pane's task list (left column) and timeline SHALL scroll vertically in sync with each other.

#### Scenario: Person view vertical scroll
- **WHEN** the user scrolls the person Gantt vertically
- **THEN** the project Gantt's vertical scroll position SHALL NOT change

#### Scenario: Task list and timeline vertical sync
- **WHEN** the user scrolls the timeline vertically
- **THEN** the task list SHALL scroll to the same vertical offset

### Requirement: Shared horizontal scrolling
Both Gantt panes SHALL share the same horizontal scroll position. Scrolling horizontally in either pane SHALL update the other pane's horizontal scroll to match.

#### Scenario: Scroll person timeline horizontally
- **WHEN** the user scrolls the person Gantt's timeline horizontally
- **THEN** the project Gantt's timeline SHALL scroll to the same horizontal offset

#### Scenario: Scroll project timeline horizontally
- **WHEN** the user scrolls the project Gantt's timeline horizontally
- **THEN** the person Gantt's timeline SHALL scroll to the same horizontal offset

#### Scenario: No recursive scroll feedback
- **WHEN** a scroll sync update triggers the target's `onScroll` event
- **THEN** the system SHALL NOT propagate the event back, preventing an infinite loop

### Requirement: Horizontal scroll guard flag
The horizontal scroll synchronization SHALL use a guard flag mechanism: a shared signal tracks the current `scrollLeft`, and a boolean flag prevents recursive updates during synchronization.

#### Scenario: Guard flag prevents feedback
- **WHEN** the sync function sets `scrollLeft` on a target element
- **THEN** the `isSyncing` flag SHALL be set to `true` before the assignment and cleared after the next animation frame

#### Scenario: Scroll event during sync ignored
- **WHEN** an `onScroll` event fires while `isSyncing` is true
- **THEN** the corresponding signal update SHALL be skipped

### Requirement: Unassigned projects panel
The system SHALL display a panel on the right side showing all projects from `CanonicalData.projects` that have zero associated tasks. This panel SHALL span the full height of both Gantt panes.

#### Scenario: Projects with no tasks appear
- **WHEN** `projects` contains `{id: "proj-c", name: "Project C"}` and no task references `projectId: "proj-c"`
- **THEN** "Project C" SHALL appear as a draggable card in the unassigned panel

#### Scenario: Project gets a task
- **WHEN** a task referencing a previously unassigned project is created
- **THEN** the project card SHALL be removed from the unassigned panel

#### Scenario: Panel scroll independent of Gantt
- **WHEN** the unassigned panel contains more project cards than fit vertically
- **THEN** the panel SHALL have its own vertical scrollbar, independent of both Gantt panes

### Requirement: Common time header
Both person and project Gantt panes SHALL display the same time header (month and day labels) at the top of their timeline areas.

#### Scenario: Headers display identical date range
- **WHEN** the view renders with a specific date range
- **THEN** both the person Gantt and project Gantt SHALL show the same date range in their headers
