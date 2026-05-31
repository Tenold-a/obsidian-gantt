## MODIFIED Requirements

### Requirement: Selection state model
The system SHALL maintain a global selection state with fields: `type` ("project" | "task" | "person" | null) and `id` (string). The selection SHALL be stored as a Preact signal. Selection MAY be triggered by clicking on a task bar, a row header, an unassigned project card, or a project link in the task detail panel.

#### Scenario: Select a project
- **WHEN** a user clicks on a project row header, an unassigned project card, or a project link in task detail
- **THEN** `selectedEntity` SHALL be set to `{type: "project", id: "<projectId>"}`

#### Scenario: Select a task
- **WHEN** a user clicks directly on a task bar or a task link in project detail
- **THEN** `selectedEntity` SHALL be set to `{type: "task", id: "<taskId>"}`

#### Scenario: Select a person
- **WHEN** a user clicks on a person row header
- **THEN** `selectedEntity` SHALL be set to `{type: "person", id: "<personId>"}`

#### Scenario: Deselect
- **WHEN** a user clicks on empty space in the timeline or presses Escape
- **THEN** `selectedEntity` SHALL be set to `null`
