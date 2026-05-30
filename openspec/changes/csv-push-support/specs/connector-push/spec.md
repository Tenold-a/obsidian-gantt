## ADDED Requirements

### Requirement: Push collects manual edits into payload
The system SHALL collect all tasks with at least one field whose source is `"manual"` into a `PushChangesPayload`, including only the manually-edited field values on each task.

#### Scenario: Task with manual date change
- **WHEN** a user drags a task bar to change its `startDate` from "2026-06-01" to "2026-06-10"
- **THEN** the task SHALL appear in `PushChangesPayload.tasks` with `startDate: "2026-06-10"`
- **AND** fields with `source: "upstream"` SHALL be omitted from the payload task

#### Scenario: Task with no manual edits
- **WHEN** a task has all fields with `source: "upstream"`
- **THEN** the task SHALL NOT appear in `PushChangesPayload.tasks`

#### Scenario: Locally created task
- **WHEN** a task was created locally (no upstream source, `connectorId: null`)
- **THEN** the task SHALL appear in `PushChangesPayload.tasks` with all its field values

#### Scenario: Deleted local task
- **WHEN** a locally-created task is deleted by the user
- **THEN** its ID SHALL appear in `PushChangesPayload.deletedTaskIds`

### Requirement: Push calls connector.push() with payload
The store's `pushChanges(connectorId)` action SHALL load the connector module, create a context, build the payload from merged data, and call `module.push(payload, ctx)`.

#### Scenario: Successful push triggers refresh
- **WHEN** `module.push()` returns `{ success: true }`
- **THEN** the store SHALL automatically call `refreshConnector(connectorId)` to reload data from the updated upstream

#### Scenario: Failed push shows error
- **WHEN** `module.push()` returns `{ success: false, error: "Write failed" }`
- **THEN** the store SHALL set `error.value` to the error message
- **AND** no refresh SHALL be triggered

#### Scenario: Connector has no push method
- **WHEN** a connector does not export a `push` function
- **THEN** `pushChanges` SHALL set an error: "Connector does not support push"

### Requirement: Push button in toolbar
The Gantt chart toolbar SHALL include a "Push" button that triggers `pushChanges` for each connector in the current view.

#### Scenario: Push button triggers push for all connectors
- **WHEN** the user clicks "Push" and the view has connectors ["csv-connector"]
- **THEN** `pushChanges("csv-connector")` SHALL be called

#### Scenario: Push button shows loading state
- **WHEN** `pushChanges` is in progress
- **THEN** the button SHALL display a loading indicator and be disabled
