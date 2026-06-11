## ADDED Requirements

### Requirement: Description field in task overrides
The task overrides in the edits overlay SHALL support the `description` field, allowing users to add or edit descriptions on upstream tasks. The merge engine SHALL include `description` in the list of editable fields.

#### Scenario: Task description persisted in overrides
- **WHEN** a user adds a description to an upstream task
- **THEN** the description SHALL be stored in `overrides[taskId].description` in the edits file

#### Scenario: Description merged from detail fetch
- **WHEN** a task has no manual description override but the connector provides one via `fetchDetail`
- **THEN** the detail description SHALL be displayed but not treated as a manual override

### Requirement: Field memory persistence
The system SHALL store field input memory at `memory/<view-id>.json`. The store SHALL expose `fieldMemory` signal and `saveFieldMemory`/`loadFieldMemory` methods.

#### Scenario: FieldMemory read on view load
- **WHEN** a view is loaded
- **THEN** the `fieldMemory` signal SHALL be populated from `memory/<view-id>.json`

#### Scenario: FieldMemory written on field input
- **WHEN** a user enters a new person name, project name, URL, tag, or dependency ID
- **THEN** the value SHALL be persisted to the memory file via `saveFieldMemory()`
