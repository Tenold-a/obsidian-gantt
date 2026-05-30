## ADDED Requirements

### Requirement: Task status field
The system SHALL support an optional `status` field on Task entities with values: `'pending'` (待开始), `'in-progress'` (进行中), `'cancelled'` (已取消), `'pending-online'` (待上线), `'online'` (已上线), `'completed'` (已完成).

#### Scenario: Task created without status
- **WHEN** a task is created or loaded from upstream without a `status` field
- **THEN** the system SHALL treat the task's status as `'pending'`

#### Scenario: Task status changed manually
- **WHEN** a user selects a new status for a task in the detail panel
- **THEN** the system SHALL persist the status as an override in the edits file and update the task display accordingly

### Requirement: Project status field
The system SHALL support an optional `status` field on Project entities with the same six values as Task status.

#### Scenario: Project created without status
- **WHEN** a project is created or loaded from upstream without a `status` field
- **THEN** the system SHALL treat the project's status as `'pending'`

#### Scenario: Project status changed manually
- **WHEN** a user selects a new status for a project in the detail panel
- **THEN** the system SHALL persist the status as a project override in the edits file

### Requirement: Project-to-tasks completion cascade
When a project's status is changed to `'completed'`, the system SHALL automatically set all non-cancelled tasks belonging to that project to `'completed'` status.

#### Scenario: Project marked completed cascades to tasks
- **WHEN** a user changes a project's status to `'completed'`
- **THEN** all tasks with `projectId` matching that project SHALL have their status set to `'completed'`
- **AND** tasks already in `'cancelled'` status SHALL remain cancelled

#### Scenario: Project with no tasks marked completed
- **WHEN** a user changes a project with zero associated tasks to `'completed'`
- **THEN** the project status SHALL be persisted as `'completed'` with no task changes

### Requirement: Tasks-to-project completion cascade
When all non-cancelled tasks belonging to a project are marked `'completed'`, the system SHALL automatically set the project status to `'completed'`.

#### Scenario: Last task completed auto-completes project
- **WHEN** the final non-cancelled task in a project is changed to `'completed'`
- **THEN** the project's status SHALL automatically become `'completed'`

#### Scenario: Some tasks still in-progress
- **WHEN** a project has tasks in mixed statuses (some completed, some in-progress)
- **THEN** the project SHALL retain its current status without auto-completion

### Requirement: Status display in detail panels
Both the task detail panel and project detail panel SHALL display the current status with a color-coded badge and a dropdown selector for changing status.

#### Scenario: Status badge color
- **WHEN** a task or project has a status
- **THEN** the detail panel SHALL render a colored badge where: pending = gray, in-progress = blue, cancelled = red, pending-online = orange, online = teal, completed = green

#### Scenario: Status selector in task detail
- **WHEN** viewing a task in the detail panel
- **THEN** a status dropdown SHALL be available showing all six status options with the current status pre-selected
