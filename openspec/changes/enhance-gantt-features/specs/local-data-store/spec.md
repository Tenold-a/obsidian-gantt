## ADDED Requirements

### Requirement: Person entity with position field
The `Person` interface SHALL include an optional `position` field of type `string` representing the person's job title or role. This field SHALL be provided by connectors as part of the canonical `CanonicalData.persons` array and stored in cache files.

#### Scenario: Person position in cache file
- **WHEN** a cache file is written after a successful connector fetch
- **THEN** each Person object in `cache.persons` MAY include a `position` string field

#### Scenario: Position survives cache round-trip
- **WHEN** a cache file containing a Person with `position: "Manager"` is read back
- **THEN** the parsed Person object SHALL retain the `position` value

### Requirement: KeyDate type
The system SHALL define a `KeyDate` interface with `name: string` and `date: string` fields. The `date` field SHALL use ISO `YYYY-MM-DD` format.

#### Scenario: KeyDate creation
- **WHEN** a KeyDate object `{ name: "Kickoff", date: "2026-06-01" }` is created
- **THEN** both fields SHALL be accessible and the date SHALL be a valid ISO date string

### Requirement: Project entity with custom fields
The `Project` interface SHALL include optional fields: `description?: string`, `requester?: string`, and `keyDates?: KeyDate[]`. These fields SHALL be provided by connectors as part of `CanonicalData.projects` and stored in cache files.

#### Scenario: Project with custom fields in cache
- **WHEN** a connector provides a Project with `description`, `requester`, and `keyDates`
- **THEN** all three fields SHALL be serialized to the cache file and deserialized on load

#### Scenario: Legacy project data without custom fields
- **WHEN** a cache file contains a Project without `description`, `requester`, or `keyDates`
- **THEN** those fields SHALL default to `undefined` (or `[]` for keyDates) when parsed

### Requirement: EditsOverlay project overrides storage
The `EditsOverlay` interface SHALL include an optional `projectOverrides` field of type `Record<string, Partial<Pick<Project, 'description' | 'requester' | 'keyDates'>>>`. When present, this field SHALL store user edits to project custom fields keyed by project ID. The field SHALL be serialized as part of `edits/<view-id>.json`.

#### Scenario: Project overrides persisted
- **WHEN** a user edits a project's description and requester
- **THEN** the edits file SHALL contain `"projectOverrides": { "<projectId>": { "description": "...", "requester": "..." } }`

#### Scenario: Empty project overrides on new view
- **WHEN** a new view is created with no project edits
- **THEN** `projectOverrides` SHALL default to `{}`

## MODIFIED Requirements

### Requirement: Field-level source tracking
The system SHALL track the source of each editable field on a Task as either `"upstream"` (from connector data) or `"manual"` (set by user action). This tracking SHALL occur at runtime during the merge step and SHALL NOT be persisted to the edits file (edits only store values, not source). Project custom fields (`description`, `requester`, `keyDates`) SHALL also be tracked with source information when a project is displayed in the detail panel.

#### Scenario: Upstream field not overridden
- **WHEN** a task's `startDate` comes from upstream and the user has not edited it
- **THEN** the field's source is `"upstream"` and the value is the upstream value

#### Scenario: User-overridden field
- **WHEN** a user edits a task's `startDate` via drag-and-drop
- **THEN** the field's source SHALL become `"manual"` and the value SHALL be the user-set value

#### Scenario: Refresh preserves manual fields
- **WHEN** the system refreshes from upstream
- **THEN** fields with source `"manual"` SHALL retain their user-set values
- **AND** fields with source `"upstream"` SHALL update to the latest upstream values

#### Scenario: Project field source tracking
- **WHEN** a project's description is loaded from upstream with a user override present
- **THEN** the description SHALL reflect the user's override value and be tracked as source `"manual"`
