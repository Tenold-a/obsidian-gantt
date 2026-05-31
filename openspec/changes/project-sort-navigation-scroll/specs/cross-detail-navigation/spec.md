## ADDED Requirements

### Requirement: Unassigned project card click opens detail
Each project card in the `UnassignedPanel` SHALL be clickable. When clicked, the system SHALL set `selectedEntity` to `{ type: 'project', id: <projectId> }`, causing the `ProjectDetail` panel to open.

#### Scenario: Click unassigned project card
- **WHEN** the user clicks on an unassigned project card in the right panel
- **THEN** `selectedEntity` SHALL be set to `{ type: 'project', id: <project.id> }`
- **AND** the `ProjectDetail` panel SHALL open showing that project's details

#### Scenario: Unassigned card has clickable cursor
- **WHEN** the unassigned project panel renders cards
- **THEN** each card SHALL display a pointer cursor on hover

#### Scenario: Drag still works on unassigned cards
- **WHEN** the user drags an unassigned project card
- **THEN** the drag-to-create-task behavior SHALL still work (click and drag are distinct interactions)

### Requirement: Task detail bottom project section
The `DetailPanel` (task detail) SHALL display a project info section at the bottom of the detail content, above the source info line. This section SHALL include:

- The project's color indicator (colored square)
- The project name as a clickable link
- The project status as a status badge

#### Scenario: Task has an associated project
- **WHEN** a task with `projectId` referencing an existing project is selected
- **THEN** a "Project" section SHALL appear at the bottom of the task detail panel
- **AND** the section SHALL show the project's color dot, name, and status badge

#### Scenario: Click project name navigates to project detail
- **WHEN** the user clicks on the project name in the task detail bottom section
- **THEN** `selectedEntity` SHALL be set to `{ type: 'project', id: <projectId> }`
- **AND** the `ProjectDetail` panel SHALL open

#### Scenario: Task has no associated project
- **WHEN** a task with no `projectId` is selected
- **THEN** the project section SHALL display "No project" or be hidden

#### Scenario: Associated project has been deleted
- **WHEN** a task's `projectId` references a project that is in `deletedProjects`
- **THEN** the project section SHALL display the project name with a "(deleted)" indicator and no click action
