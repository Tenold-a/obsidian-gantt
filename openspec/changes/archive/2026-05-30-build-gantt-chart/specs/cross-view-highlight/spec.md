## ADDED Requirements

### Requirement: Selection state model
The system SHALL maintain a global selection state with fields: `type` ("project" | "task" | "person" | null) and `id` (string). The selection SHALL be stored as a Preact signal.

#### Scenario: Select a project
- **WHEN** a user clicks on a project row header or a task bar belonging to that project
- **THEN** `selectedEntity` SHALL be set to `{type: "project", id: "<projectId>"}`

#### Scenario: Select a task
- **WHEN** a user clicks directly on a task bar
- **THEN** `selectedEntity` SHALL be set to `{type: "task", id: "<taskId>"}`

#### Scenario: Select a person
- **WHEN** a user clicks on a person row header
- **THEN** `selectedEntity` SHALL be set to `{type: "person", id: "<personId>"}`

#### Scenario: Deselect
- **WHEN** a user clicks on empty space in the timeline or presses Escape
- **THEN** `selectedEntity` SHALL be set to `null`

### Requirement: Computed highlight set
The system SHALL derive a set of highlighted task IDs from the current selection using a `computed` signal. The derivation logic SHALL vary by selection type.

#### Scenario: Project selection highlights all project tasks
- **WHEN** a project is selected
- **THEN** all tasks with `projectId` matching the selected project SHALL be in the highlight set

#### Scenario: Task selection highlights sibling tasks
- **WHEN** a task is selected
- **THEN** all tasks with the same `projectId` as the selected task SHALL be in the highlight set

#### Scenario: Person selection highlights person's tasks
- **WHEN** a person is selected
- **THEN** all tasks with `personId` matching the selected person SHALL be in the highlight set

#### Scenario: No selection clears highlight
- **WHEN** `selectedEntity` is null
- **THEN** the highlight set SHALL be empty

### Requirement: Highlight visual style
Highlighted task bars SHALL render with full opacity and an enhanced visual treatment (e.g., brighter color, border). Non-highlighted task bars (when a selection is active) SHALL render with reduced opacity (e.g., 0.3-0.4). Rows with no highlighted tasks SHALL also have reduced opacity.

#### Scenario: Highlighted bars stand out
- **WHEN** a selection is active and a task bar is in the highlight set
- **THEN** the bar SHALL render at full opacity with a prominent visual style

#### Scenario: Non-highlighted bars dim
- **WHEN** a selection is active and a task bar is NOT in the highlight set
- **THEN** the bar SHALL render at reduced opacity (e.g., 0.3)

#### Scenario: Dim state clears on deselect
- **WHEN** selection is set to null
- **THEN** all task bars SHALL render at full opacity

### Requirement: Cross-view highlight synchronization
Both the person Gantt and project Gantt SHALL respond to the same selection state and highlight set simultaneously.

#### Scenario: Select project highlights bars in both views
- **WHEN** a project is selected
- **THEN** the matching task bars SHALL highlight in both the person Gantt (across different person rows) and the project Gantt (within the selected project row)

#### Scenario: Select person highlights bars in both views
- **WHEN** a person is selected
- **THEN** the matching task bars SHALL highlight in both the person Gantt (within the selected person's row) and the project Gantt (across different project rows)

### Requirement: Row-level dimming
When a selection is active, rows in each Gantt pane that contain no highlighted tasks SHALL render with reduced opacity to visually de-emphasize them.

#### Scenario: Project view rows with no match dim
- **WHEN** a person is selected in the person Gantt
- **THEN** in the project Gantt, project rows that contain no tasks assigned to that person SHALL dim

#### Scenario: Person view rows with no match dim
- **WHEN** a project is selected in the project Gantt
- **THEN** in the person Gantt, person rows that contain no tasks from that project SHALL dim
