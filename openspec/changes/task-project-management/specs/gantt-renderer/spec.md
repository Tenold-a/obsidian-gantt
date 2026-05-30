## ADDED Requirements

### Requirement: Clickable task URL in detail panel
The task detail panel SHALL render the task's `url` field as a clickable hyperlink that opens in the system's external browser.

#### Scenario: Task URL displayed as link
- **WHEN** a task has a non-empty `url` field
- **THEN** the detail panel SHALL render a clickable link element with the URL as the href

#### Scenario: Click opens external browser
- **WHEN** a user clicks the task URL link
- **THEN** the system SHALL open the URL in the external browser (via `window.open` or platform equivalent)

#### Scenario: Task without URL
- **WHEN** a task has no `url` field or an empty URL
- **THEN** the detail panel SHALL display "—" or "No link" for the URL field

### Requirement: Associated task list in project detail panel
The project detail panel SHALL display a list of all tasks associated with the selected project, showing each task's title and allowing click-through navigation to the task detail.

#### Scenario: Project with associated tasks
- **WHEN** a project is selected and has associated tasks
- **THEN** the project detail panel SHALL list all associated tasks with their titles

#### Scenario: Click task name navigates to task detail
- **WHEN** a user clicks a task name in the project's task list
- **THEN** the selection SHALL change to that task, opening the task detail panel

#### Scenario: Project with no tasks
- **WHEN** a project is selected but has no associated tasks
- **THEN** the task list section SHALL display "No tasks" or equivalent

#### Scenario: Task list shows task count
- **WHEN** the associated task list is displayed
- **THEN** the section header SHALL show the count of associated tasks

### Requirement: Status badge in detail panels
Both task and project detail panels SHALL display a color-coded status badge showing the current status value.

#### Scenario: Status badge colors
- **WHEN** an entity has a status
- **THEN** the badge SHALL use the following colors: pending = gray (#888), in-progress = blue (#2196f3), cancelled = red (#e53935), pending-online = orange (#fb8c00), online = teal (#00897b), completed = green (#4caf50)

#### Scenario: Status dropdown for changing status
- **WHEN** viewing a task or project in the detail panel
- **THEN** a dropdown selector SHALL allow changing the status to any of the six values

### Requirement: Delete button in detail panels
The task and project detail panels SHALL each include a delete button that triggers a confirmation dialog.

#### Scenario: Delete button in task detail
- **WHEN** a task is selected in the detail panel
- **THEN** a delete button SHALL be visible, typically in the header area alongside the close button

#### Scenario: Delete button in project detail
- **WHEN** a project is selected in the detail panel
- **THEN** a delete button SHALL be visible, typically in the header area alongside the edit and close buttons
