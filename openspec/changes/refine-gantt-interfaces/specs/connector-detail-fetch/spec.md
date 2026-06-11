## ADDED Requirements

### Requirement: Connector detail fetch interface

`ConnectorModule` SHALL support optional `fetchDetail` and `transformDetail` methods for lazy-loading rich detail data for a single project or task. The `fetchDetail` method SHALL accept an entity ID, entity type (`'project'` or `'task'`), and `ConnectorContext`, returning raw data. The `transformDetail` method SHALL convert raw detail data to `ProjectDetail` or `TaskDetail`.

#### Scenario: Connector exports detail methods

- **WHEN** a connector script exports `fetchDetail` and `transformDetail` alongside `fetch` and `transform`
- **THEN** the system SHALL recognize it as supporting on-demand detail loading

#### Scenario: Connector without detail methods

- **WHEN** a connector script does not export `fetchDetail` or `transformDetail`
- **THEN** the system SHALL fall back to displaying detail information from `CanonicalData`

#### Scenario: Fetch project detail

- **WHEN** the store calls `fetchDetail("proj-1", "project", ctx)` on a connector that implements detail methods
- **THEN** the connector SHALL fetch raw detail data for the project with ID "proj-1"
- **AND** `transformDetail` SHALL convert it to a `ProjectDetail` object

#### Scenario: Fetch task detail

- **WHEN** the store calls `fetchDetail("task-1", "task", ctx)` on a connector that implements detail methods
- **THEN** the connector SHALL fetch raw detail data for the task with ID "task-1"
- **AND** `transformDetail` SHALL convert it to a `TaskDetail` object

#### Scenario: fetchDetail must be paired with transformDetail

- **WHEN** a connector script exports `fetchDetail` but not `transformDetail`
- **THEN** the system SHALL reject the connector with an error indicating both methods are required for detail support

### Requirement: ProjectDetail type

The system SHALL define a `ProjectDetail` interface that includes all fields from `Project` plus additional detail fields. `ProjectDetail` SHALL contain: `id` (string), `name` (string), `status` (optional string), `color` (optional string), `description` (optional string, markdown), `requester` (optional string), `keyDates` (optional KeyDate array), `keyLinks` (optional KeyLink array), `tags` (optional string array), `metadata` (optional record). All fields from `Project` are included, making `ProjectDetail` a superset.

#### Scenario: ProjectDetail with all fields

- **WHEN** a connector's `transformDetail` returns a `ProjectDetail` with all fields populated
- **THEN** the system SHALL display all fields in the detail view

#### Scenario: ProjectDetail with minimal fields

- **WHEN** a connector's `transformDetail` returns a `ProjectDetail` with only `id` and `name`
- **THEN** the system SHALL accept it and display only the available fields

#### Scenario: ProjectDetail extends Project

- **WHEN** a `ProjectDetail` object is passed to code expecting a `Project`
- **THEN** the code SHALL work without error (structural compatibility)

### Requirement: TaskDetail type

The system SHALL define a `TaskDetail` interface that includes all fields from `Task` plus a `description` field and extended `metadata`. `TaskDetail` SHALL contain: all `Task` fields (`id`, `title`, `startDate?`, `endDate?`, `progress?`, `status?`, `personId?`, `projectId?`, `parentId?`, `dependencies?`, `tags?`, `url?`) plus `description` (optional string, markdown) and `metadata` (optional record).

#### Scenario: TaskDetail with description

- **WHEN** a connector's `transformDetail` returns a `TaskDetail` with a `description` field
- **THEN** the system SHALL render the description as markdown in the task detail view

#### Scenario: TaskDetail without description

- **WHEN** a connector's `transformDetail` returns a `TaskDetail` without `description`
- **THEN** the system SHALL display only the available task fields

#### Scenario: TaskDetail extends Task

- **WHEN** a `TaskDetail` object is passed to code expecting a `Task`
- **THEN** the code SHALL work without error (structural compatibility)

### Requirement: Detail cache in store

The store SHALL maintain an in-memory cache of fetched detail data, keyed by `${type}:${id}`. The cache SHALL be cleared for a connector's entries when that connector is refreshed. Fetching detail for an already-cached entity SHALL return the cached data without calling the connector again.

#### Scenario: Cache hit

- **WHEN** the store fetches detail for "proj-1" and the cache already contains `"project:proj-1"`
- **THEN** the store SHALL return the cached `ProjectDetail` without calling the connector

#### Scenario: Cache miss triggers fetch

- **WHEN** the store fetches detail for "task-5" and the cache does not contain `"task:task-5"`
- **THEN** the store SHALL call `fetchDetail("task-5", "task", ctx)` on the appropriate connector

#### Scenario: Cache cleared on connector refresh

- **WHEN** a connector refresh completes successfully
- **THEN** the store SHALL remove all detail cache entries associated with that connector's ID

#### Scenario: Fallback when connector has no detail methods

- **WHEN** the store requests detail for an entity from a connector that does not implement `fetchDetail`
- **THEN** the store SHALL construct a fallback `ProjectDetail` or `TaskDetail` from the existing `CanonicalData` fields

### Requirement: Detail loading state

The store SHALL expose a `detailLoading` signal (`Set<string>`) tracking which detail keys are currently being fetched. The UI SHALL display a loading indicator when the selected entity's detail is loading.

#### Scenario: Loading indicator shown

- **WHEN** a user selects a project whose detail is not cached and the connector supports `fetchDetail`
- **THEN** the `detailLoading` set SHALL contain `"project:<id>"`
- **AND** the UI SHALL display a loading skeleton until the fetch completes

#### Scenario: Loading indicator cleared

- **WHEN** a detail fetch completes (success or error)
- **THEN** the `detailLoading` set SHALL no longer contain the entity's key

#### Scenario: Loading timeout fallback

- **WHEN** a detail fetch takes longer than 10 seconds
- **THEN** the system SHALL cancel the fetch and fall back to displaying available `CanonicalData` fields
