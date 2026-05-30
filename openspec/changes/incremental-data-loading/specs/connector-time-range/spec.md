## ADDED Requirements

### Requirement: ConnectorContext provides optional time range
The `ConnectorContext` SHALL include an optional `range` field of type `{ startDate: string; endDate: string }` that indicates the time window the system is requesting. When absent, the connector SHALL return all available data.

#### Scenario: Connector receives time range
- **WHEN** the store calls `fetchForRange(connectorId, "2026-06-01", "2026-08-01")`
- **THEN** the connector's `fetch(ctx)` SHALL receive `ctx.range` equal to `{ startDate: "2026-06-01", endDate: "2026-08-01" }`

#### Scenario: Full refresh does not set range
- **WHEN** the store calls `refreshConnector(connectorId)` for a full refresh
- **THEN** the connector's `fetch(ctx)` SHALL receive `ctx.range` as `undefined`

#### Scenario: Existing connector ignores range
- **WHEN** an existing connector that does not read `ctx.range` is called with a time range set
- **THEN** the connector SHALL return all data as before, and the result SHALL be merged into the cache normally

### Requirement: Connector filters tasks by overlapping date range
When `ctx.range` is set, the connector SHOULD return tasks whose date range overlaps the requested window (startDate <= range.end AND endDate >= range.start), not just tasks strictly contained within it.

#### Scenario: Task spanning the range boundary is included
- **WHEN** `ctx.range` is `{ startDate: "2026-06-10", endDate: "2026-06-20" }` and a task has `startDate: "2026-06-01", endDate: "2026-06-15"`
- **THEN** the task SHALL be included in the connector's returned data because its date range overlaps the requested window

#### Scenario: Task entirely outside range is excluded
- **WHEN** `ctx.range` is `{ startDate: "2026-06-10", endDate: "2026-06-20" }` and a task has `startDate: "2026-07-01", endDate: "2026-07-10"`
- **THEN** the task MAY be excluded from the connector's returned data

### Requirement: Persons and projects always returned in full
Regardless of `ctx.range`, connectors SHALL return all persons and projects. Only tasks MAY be filtered by the time range.

#### Scenario: Incremental fetch returns all persons
- **WHEN** an incremental fetch is made with a limited time range
- **THEN** the returned `persons` array SHALL contain all known persons, not just those assigned to tasks within the range

#### Scenario: Incremental fetch returns all projects
- **WHEN** an incremental fetch is made with a limited time range
- **THEN** the returned `projects` array SHALL contain all known projects, not just those referenced by tasks within the range
