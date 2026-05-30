## ADDED Requirements

### Requirement: Optional push method on connector modules
The `ConnectorModule` interface SHALL support an optional `push(changes, context)` method that allows writing local changes back to the upstream system.

#### Scenario: Connector exports push function
- **WHEN** a connector script exports a `push` function alongside `fetch` and `transform`
- **THEN** the system SHALL recognize the connector as supporting bidirectional sync

#### Scenario: Push receives structured changes
- **WHEN** the system calls `push(changes, context)`
- **THEN** the `changes` parameter SHALL contain `{ tasks: Task[], projects: Project[], deletedTaskIds: string[], deletedProjectIds: string[] }` representing all local modifications

#### Scenario: Push returns success status
- **WHEN** a `push()` call completes successfully
- **THEN** the function SHALL return `{ success: true }` or a promise resolving to that value

#### Scenario: Push returns error status
- **WHEN** a `push()` call fails
- **THEN** the function SHALL return `{ success: false, error: string }` with an error message describing the failure

#### Scenario: Connector without push is read-only
- **WHEN** a connector script does not export a `push` function
- **THEN** the system SHALL treat that connector's data as read-only for upstream sync

### Requirement: Push changes payload schema
The changes payload passed to `push()` SHALL aggregate all local modifications from the edits overlay into a structured format with full task/project objects and deletion lists.

#### Scenario: Payload includes overridden tasks as full objects
- **WHEN** building the push payload
- **THEN** tasks with overrides SHALL be included as full `Task` objects with merged values (manual values taking precedence)

#### Scenario: Payload includes locally created tasks
- **WHEN** the edits overlay contains local tasks
- **THEN** those tasks SHALL be included in the changes payload's `tasks` array

#### Scenario: Payload includes deletion IDs
- **WHEN** the edits overlay contains deleted task or project IDs
- **THEN** those IDs SHALL be included in the changes payload's `deletedTaskIds` or `deletedProjectIds` arrays

## MODIFIED Requirements

### Requirement: Connector script interface
The system SHALL define a standard interface that connector scripts must implement: `fetch(context)` to retrieve raw upstream data, `transform(rawData, context)` to convert it to `CanonicalData`, and optionally `push(changes, context)` to write local changes back upstream.

#### Scenario: Connector exports both functions
- **WHEN** a connector script exports both `fetch` and `transform` functions
- **THEN** the system recognizes it as a valid connector

#### Scenario: Connector exports all three functions
- **WHEN** a connector script exports `fetch`, `transform`, and `push` functions
- **THEN** the system recognizes it as a bidirectional connector capable of both read and write

#### Scenario: Connector missing required export
- **WHEN** a connector script does not export `fetch` or `transform`
- **THEN** the system SHALL reject the connector with an error message indicating which export is missing

#### Scenario: Transform returns CanonicalData
- **WHEN** a connector's `transform` function returns an object conforming to the `CanonicalData` structure (with `tasks`, `persons`, `projects` arrays)
- **THEN** the system SHALL accept and store the output

#### Scenario: Transform returns invalid data
- **WHEN** a connector's `transform` function returns data not conforming to `CanonicalData` (missing required fields, wrong types)
- **THEN** the system SHALL reject the output with a validation error describing the mismatch

### Requirement: Task entity definition
A `Task` in CanonicalData SHALL support the following fields: `id` (required, string), `title` (required, string), `startDate` (optional ISO date string), `endDate` (optional ISO date string), `progress` (optional 0-1 number), `status` (optional string, one of six lifecycle states), `personId` (optional string), `projectId` (optional string), `parentId` (optional string), `dependencies` (optional string array), `tags` (optional string array), `url` (optional string), `metadata` (optional key-value object for connector-specific extensions).

#### Scenario: Minimal valid task
- **WHEN** a task has only `id` and `title` fields
- **THEN** the system SHALL accept it as valid

#### Scenario: Task with all optional fields
- **WHEN** a task includes all optional fields with correct types
- **THEN** the system SHALL accept it as valid

#### Scenario: Task with status field
- **WHEN** a task includes a `status` field with a valid status value
- **THEN** the system SHALL accept and display the status

### Requirement: Project entity definition
A `Project` in CanonicalData SHALL support: `id` (required, string), `name` (required, string), `status` (optional string, one of six lifecycle states), `color` (optional CSS-compatible color string), `metadata` (optional key-value object).

#### Scenario: Project with color
- **WHEN** a project specifies a `color` field
- **THEN** the system SHALL use that color for the project's task bars and group header

#### Scenario: Project without color
- **WHEN** a project does not specify a `color`
- **THEN** the system SHALL auto-assign a color from a predefined palette

#### Scenario: Project with status
- **WHEN** a project includes a `status` field with a valid status value
- **THEN** the system SHALL accept and display the status
