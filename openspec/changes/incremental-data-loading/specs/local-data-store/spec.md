## MODIFIED Requirements

### Requirement: Cache file structure
Each cache file (`cache/<connector-id>.json`) SHALL contain: `connectorId` (string), `lastFetch` (ISO timestamp), `lastError` (string or null), `tasks` (Task[]), `persons` (Person[]), `projects` (Project[]), and `coveredRanges` (optional array of `{ start: string; end: string }` recording fetched time windows).

#### Scenario: Successful fetch updates cache
- **WHEN** a refresh completes without errors
- **THEN** `lastFetch` SHALL be updated, `lastError` SHALL be null, all entity arrays SHALL contain the latest upstream data, and `coveredRanges` SHALL reflect the fetched time windows

#### Scenario: Failed fetch preserves previous cache
- **WHEN** a refresh fails with an error
- **THEN** `lastError` SHALL be updated with the error message, the previous entity arrays SHALL be preserved, and the UI SHALL show a warning

#### Scenario: Legacy cache without coveredRanges
- **WHEN** a cache file does not contain `coveredRanges`
- **THEN** the system SHALL treat it as a full-data cache and compute coverage from the min/max dates of contained tasks

## ADDED Requirements

### Requirement: Store fetchForRange action
The store SHALL provide a `fetchForRange(connectorId: string, startDate: string, endDate: string)` action that: reads the current cache, computes coverage gaps against the requested range, calls the connector for each gap, merges results, and writes the updated cache.

#### Scenario: First fetch loads initial window
- **WHEN** `fetchForRange("my-csv", "2026-06-01", "2026-08-01")` is called and no cache exists
- **THEN** the connector SHALL be called with `ctx.range = { startDate: "2026-06-01", endDate: "2026-08-01" }`
- **AND** the result SHALL be written as a new cache file with `coveredRanges: [{ start: "2026-06-01", end: "2026-08-01" }]`

#### Scenario: Second fetch only requests gaps
- **WHEN** `fetchForRange("my-csv", "2026-07-01", "2026-09-01")` is called and cache already covers ["2026-06-01", "2026-08-01"]
- **THEN** the connector SHALL be called only for the gap ["2026-08-01", "2026-09-01"]
- **AND** the results SHALL be merged with existing cached tasks

#### Scenario: Fully covered range skips fetch
- **WHEN** `fetchForRange("my-csv", "2026-06-15", "2026-06-30")` is called and cache covers ["2026-06-01", "2026-08-01"]
- **THEN** no connector call SHALL be made and the cache SHALL remain unchanged

### Requirement: Full refresh clears incremental coverage
The `refreshConnector(connectorId)` action SHALL perform a full fetch (no `ctx.range`), replace the entire cache, and set `coveredRanges` to the extent of all returned tasks.

#### Scenario: Full refresh after incremental fetches
- **WHEN** `refreshConnector` is called after several incremental fetches
- **THEN** the cache SHALL be replaced with the full fetch result and `coveredRanges` SHALL be reset to the full data span
