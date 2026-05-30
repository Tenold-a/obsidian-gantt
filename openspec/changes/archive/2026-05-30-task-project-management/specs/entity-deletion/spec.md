## ADDED Requirements

### Requirement: Delete task from detail panel
The task detail panel SHALL provide a delete button that, when clicked, shows a confirmation dialog before removing the task.

#### Scenario: Delete button visible on task detail
- **WHEN** a task is selected and the detail panel is displayed
- **THEN** a delete button or icon SHALL be visible in the detail panel header

#### Scenario: Confirmation dialog on delete click
- **WHEN** a user clicks the delete button on a task
- **THEN** a confirmation dialog SHALL appear asking the user to confirm the deletion

#### Scenario: Confirm task deletion
- **WHEN** a user confirms deletion in the dialog
- **THEN** the task SHALL be removed: for upstream tasks, added to `deletedTasks` array; for local tasks, removed from `localTasks` array
- **AND** the detail panel SHALL close
- **AND** the task SHALL disappear from the Gantt view

#### Scenario: Cancel task deletion
- **WHEN** a user cancels the deletion in the confirmation dialog
- **THEN** the task SHALL remain unchanged and the dialog SHALL close

### Requirement: Delete project from detail panel
The project detail panel SHALL provide a delete button that, when clicked, shows a confirmation dialog before removing the project.

#### Scenario: Delete button visible on project detail
- **WHEN** a project is selected and the detail panel is displayed
- **THEN** a delete button or icon SHALL be visible in the detail panel header

#### Scenario: Confirmation dialog warns about associated tasks
- **WHEN** a user clicks delete on a project that has associated tasks
- **THEN** the confirmation dialog SHALL warn that all associated tasks will also be affected

#### Scenario: Confirm project deletion
- **WHEN** a user confirms project deletion
- **THEN** the project SHALL be added to `deletedProjects` array
- **AND** all tasks belonging to that project SHALL also be marked for deletion
- **AND** the detail panel SHALL close

#### Scenario: Cancel project deletion
- **WHEN** a user cancels the project deletion in the confirmation dialog
- **THEN** the project SHALL remain unchanged and the dialog SHALL close

### Requirement: Confirmation dialog component
The system SHALL provide a reusable confirmation dialog component with a message, confirm button, and cancel button, rendered as a modal overlay.

#### Scenario: Dialog traps focus
- **WHEN** the confirmation dialog is open
- **THEN** keyboard focus SHALL be trapped within the dialog

#### Scenario: Dialog closes on Escape
- **WHEN** the user presses the Escape key while the confirmation dialog is open
- **THEN** the dialog SHALL close and the action SHALL be cancelled

#### Scenario: Dialog closes on backdrop click
- **WHEN** the user clicks the backdrop area outside the dialog
- **THEN** the dialog SHALL close and the action SHALL be cancelled

### Requirement: Deleted entity tracking in edits overlay
The edits overlay SHALL support `deletedTasks` (array of task ID strings) and `deletedProjects` (array of project ID strings) to track deleted entities.

#### Scenario: Deletion persisted to disk
- **WHEN** a task or project is deleted
- **THEN** its ID SHALL be added to the corresponding deletion array in the edits file

#### Scenario: Merge engine excludes deleted tasks
- **WHEN** the merge engine processes tasks
- **THEN** tasks whose IDs appear in `deletedTasks` SHALL be excluded from the merged output

#### Scenario: Merge engine excludes deleted projects
- **WHEN** the merge engine processes projects
- **THEN** projects whose IDs appear in `deletedProjects` SHALL be excluded from the merged output
