## ADDED Requirements

### Requirement: Connector script interface
The system SHALL define a standard interface that connector scripts must implement: `fetch(context)` to retrieve raw upstream data and `transform(rawData, context)` to convert it to `CanonicalData`.

#### Scenario: Connector exports both functions
- **WHEN** a connector script exports both `fetch` and `transform` functions
- **THEN** the system recognizes it as a valid connector

#### Scenario: Connector missing required export
- **WHEN** a connector script does not export `fetch` or `transform`
- **THEN** the system SHALL reject the connector with an error message indicating which export is missing

#### Scenario: Transform returns CanonicalData
- **WHEN** a connector's `transform` function returns an object conforming to the `CanonicalData` structure (with `tasks`, `persons`, `projects` arrays)
- **THEN** the system SHALL accept and store the output

#### Scenario: Transform returns invalid data
- **WHEN** a connector's `transform` function returns data not conforming to `CanonicalData` (missing required fields, wrong types)
- **THEN** the system SHALL reject the output with a validation error describing the mismatch

### Requirement: CanonicalData schema
The system SHALL define `CanonicalData` with three independent arrays: `tasks` (Task[]), `persons` (Person[]), and `projects` (Project[]). Projects SHALL be independently declared and MAY have zero associated tasks.

#### Scenario: Project with tasks
- **WHEN** `CanonicalData.projects` contains `{id: "proj-a", name: "Project A"}` and `CanonicalData.tasks` contains `{projectId: "proj-a", ...}`
- **THEN** the task is associated with "Project A" via the `projectId` field

#### Scenario: Project without tasks
- **WHEN** `CanonicalData.projects` contains `{id: "proj-b", name: "Project B"}` and no task in `CanonicalData.tasks` references `projectId: "proj-b"`
- **THEN** "Project B" appears in the unassigned projects panel

#### Scenario: Task references unknown project
- **WHEN** a task's `projectId` references a project ID not present in `CanonicalData.projects`
- **THEN** the task SHALL still be rendered but treated as having no project grouping

### Requirement: ConnectorContext
The system SHALL provide a `ConnectorContext` object to connector scripts containing: `config` (user-provided configuration object), a `request` function for HTTP requests (abstracting platform differences), a `log` function for debug output, a `readFile` function for reading local files, a `writeFile` function for writing local files, and a `parseCSV` function for parsing CSV text into structured records.

#### Scenario: Connector uses request function
- **WHEN** a connector's `fetch` function calls `context.request(url, options)`
- **THEN** the platform-specific HTTP layer executes the request and returns a standard Response-like object

#### Scenario: Connector reads config
- **WHEN** a connector's `fetch` function accesses `context.config`
- **THEN** it receives the configuration object defined in the view's connector settings

#### Scenario: Connector reads a local file
- **WHEN** a connector calls `context.readFile(path)`
- **THEN** the platform reads the local file and returns its content as a string

#### Scenario: Connector writes a local file
- **WHEN** a connector calls `context.writeFile(path, content)`
- **THEN** the platform writes the content to the local file at the given path

#### Scenario: Connector parses CSV text
- **WHEN** a connector calls `context.parseCSV(text)`
- **THEN** the platform parses the CSV text and returns an array of record objects

### Requirement: Connector push interface
The `ConnectorModule` interface SHALL include an optional `push` method with signature `(changes: PushChangesPayload, ctx: ConnectorContext) => Promise<PushResult>`. Connectors without `push` SHALL be treated as read-only.

#### Scenario: Connector exports push for write support
- **WHEN** a connector script exports `push` alongside `fetch` and `transform`
- **THEN** the system SHALL recognize it as a read-write connector

#### Scenario: Connector without push is read-only
- **WHEN** a connector script does not export `push`
- **THEN** the system SHALL treat it as read-only

#### Scenario: Push payload contains modified tasks
- **WHEN** the store builds a `PushChangesPayload`
- **THEN** `tasks` SHALL contain only tasks with at least one manually-edited field
- **AND** `deletedTaskIds` SHALL contain IDs of tasks marked for deletion

### Requirement: PushChangesPayload and PushResult types
The system SHALL define `PushChangesPayload` with fields: `tasks` (Task[]), `projects` (Project[]), `deletedTaskIds` (string[]), `deletedProjectIds` (string[]). `PushResult` SHALL have `success` (boolean) and optional `error` (string).

### Requirement: Connector loading from script file
The system SHALL support loading connector scripts from files in a configurable directory path. In Obsidian, this path SHALL default to `connectors/` within the vault. In Web, it SHALL support file upload or pasted code.

#### Scenario: Load connector from file path
- **WHEN** a view configuration specifies a connector with `script: "connectors/jira.js"`
- **THEN** the system reads and executes that file, extracting the exported `fetch` and `transform` functions

#### Scenario: Connector file not found
- **WHEN** a configured connector script path does not exist
- **THEN** the system SHALL report an error: "Connector script not found: <path>"

### Requirement: Task entity definition
A `Task` in CanonicalData SHALL support the following fields: `id` (required, string), `title` (required, string), `startDate` (optional ISO date string), `endDate` (optional ISO date string), `progress` (optional 0-1 number), `personId` (optional string), `projectId` (optional string), `parentId` (optional string), `dependencies` (optional string array), `tags` (optional string array), `url` (optional string), `metadata` (optional key-value object for connector-specific extensions).

#### Scenario: Minimal valid task
- **WHEN** a task has only `id` and `title` fields
- **THEN** the system SHALL accept it as valid

#### Scenario: Task with all optional fields
- **WHEN** a task includes all optional fields with correct types
- **THEN** the system SHALL accept it as valid

### Requirement: Person entity definition
A `Person` in CanonicalData SHALL support: `id` (required, string), `name` (required, string), `avatar` (optional string URL or path).

#### Scenario: Person with minimal fields
- **WHEN** a person has `id` and `name` fields
- **THEN** the system SHALL accept and display them in the person list

### Requirement: Project entity definition
A `Project` in CanonicalData SHALL support: `id` (required, string), `name` (required, string), `color` (optional CSS-compatible color string), `metadata` (optional key-value object).

#### Scenario: Project with color
- **WHEN** a project specifies a `color` field
- **THEN** the system SHALL use that color for the project's task bars and group header

#### Scenario: Project without color
- **WHEN** a project does not specify a `color`
- **THEN** the system SHALL auto-assign a color from a predefined palette
