## ADDED Requirements

### Requirement: Project sort toggle button
The project Gantt pane header SHALL display a sort toggle button that switches between name-based and time-based sorting of project groups.

#### Scenario: Toggle button in project header
- **WHEN** the project Gantt pane renders
- **THEN** its TaskList header SHALL display a sort toggle button

#### Scenario: Click toggles sort mode
- **WHEN** the user clicks the project sort toggle button
- **THEN** `projectSortMode` SHALL switch between `'name'` and `'time'`

#### Scenario: Button label reflects current mode
- **WHEN** `projectSortMode` is `'name'`
- **THEN** the button SHALL display "Sort: Name"
- **WHEN** `projectSortMode` is `'time'`
- **THEN** the button SHALL display "Sort: Time"

## MODIFIED Requirements

### Requirement: Unassigned projects panel
The system SHALL display a panel on the right side showing all projects from `CanonicalData.projects` that have zero associated tasks. This panel SHALL span the full height of both Gantt panes. Each project card SHALL be clickable, opening the `ProjectDetail` panel for that project.

#### Scenario: Projects with no tasks appear
- **WHEN** `projects` contains `{id: "proj-c", name: "Project C"}` and no task references `projectId: "proj-c"`
- **THEN** "Project C" SHALL appear as a draggable card in the unassigned panel

#### Scenario: Project gets a task
- **WHEN** a task referencing a previously unassigned project is created
- **THEN** the project card SHALL be removed from the unassigned panel

#### Scenario: Panel scroll independent of Gantt
- **WHEN** the unassigned panel contains more project cards than fit vertically
- **THEN** the panel SHALL have its own vertical scrollbar, independent of both Gantt panes

#### Scenario: Click unassigned card opens project detail
- **WHEN** the user clicks on an unassigned project card
- **THEN** `selectedEntity` SHALL be set to `{ type: 'project', id: <projectId> }`
- **AND** the `ProjectDetail` panel SHALL open for that project

#### Scenario: Unassigned cards remain draggable
- **WHEN** the user drags an unassigned project card
- **THEN** the drag-to-create-task behavior SHALL still work as before
