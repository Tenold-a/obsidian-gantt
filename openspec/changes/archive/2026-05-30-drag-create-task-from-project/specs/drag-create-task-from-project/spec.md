## ADDED Requirements

### Requirement: Draggable task creation from project detail
The project detail panel SHALL include a draggable element that, when dragged to the person Gantt timeline, creates a new task assigned to the current project and the target person at the drop date.

#### Scenario: Drag to person timeline creates task
- **WHEN** a user drags the create-task element from the project detail panel to the person Gantt timeline at a specific row and date
- **THEN** a new local task SHALL be created with the project's ID, the target person's ID, and the drop date as start date
- **AND** the task SHALL appear in both the person and project Gantt views after creation

#### Scenario: Draggable element is visually identifiable
- **WHEN** the project detail panel is displayed
- **THEN** the create-task element SHALL show a drag grip icon or cursor indicating it is draggable

#### Scenario: Drag data matches existing format
- **WHEN** the drag starts from the create-task element
- **THEN** the `dataTransfer` SHALL contain JSON with `{ projectId, projectName }` matching the current project
