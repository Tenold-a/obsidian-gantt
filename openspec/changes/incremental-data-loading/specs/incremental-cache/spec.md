## ADDED Requirements

### Requirement: Cache file tracks covered time ranges
The `CacheFile` interface SHALL include an optional `coveredRanges` field: `Array<{ start: string; end: string }>` recording which time windows have been fetched and merged into the cache.

#### Scenario: Full refresh records single range
- **WHEN** a full refresh completes successfully and the returned tasks span from "2026-05-01" to "2026-09-01"
- **THEN** `coveredRanges` SHALL contain a single entry covering the extent of all returned tasks

#### Scenario: Incremental fetch appends to covered ranges
- **WHEN** an incremental fetch for ["2026-08-01", "2026-10-01"] completes after a previous full fetch covered ["2026-05-01", "2026-07-31"]
- **THEN** `coveredRanges` SHALL contain entries covering both windows

#### Scenario: Legacy cache without coveredRanges is valid
- **WHEN** reading a cache file that does not have a `coveredRanges` field
- **THEN** the system SHALL treat the entire returned data as loaded and compute coverage from the min/max dates of all tasks

### Requirement: Gap computation between requested and covered ranges
The system SHALL compute which portions of a requested date range are not yet covered by existing cache data, using a merge-interval algorithm.

#### Scenario: No overlap — full gap
- **WHEN** requesting ["2026-06-01", "2026-06-30"] and nothing is cached
- **THEN** the gap SHALL be the full ["2026-06-01", "2026-06-30"]

#### Scenario: Partial overlap — one gap
- **WHEN** requesting ["2026-06-01", "2026-06-30"] and cache covers ["2026-06-01", "2026-06-15"]
- **THEN** the gap SHALL be ["2026-06-15", "2026-06-30"]

#### Scenario: Fully covered — no gap
- **WHEN** requesting ["2026-06-01", "2026-06-30"] and cache covers ["2026-05-01", "2026-07-31"]
- **THEN** there SHALL be no gaps to fetch

#### Scenario: Multiple gaps
- **WHEN** requesting ["2026-06-01", "2026-06-30"] and cache covers ["2026-06-01", "2026-06-05"] and ["2026-06-20", "2026-06-25"]
- **THEN** gaps SHALL be ["2026-06-05", "2026-06-20"] and ["2026-06-25", "2026-06-30"]

### Requirement: Incremental entity merge by ID
When merging incremental fetch results into an existing cache, entities SHALL be keyed by ID. Newer data SHALL overwrite older data for the same ID.

#### Scenario: Task with same ID is updated
- **WHEN** a new fetch returns a task with ID "t1" and title "Updated Title", and the cache already has task "t1" with title "Old Title"
- **THEN** the merged cache SHALL have task "t1" with title "Updated Title"

#### Scenario: New task is added
- **WHEN** a new fetch returns a task with ID "t99" that does not exist in the cache
- **THEN** task "t99" SHALL be added to the merged cache

#### Scenario: Person is updated
- **WHEN** a new fetch returns a person with an ID already in cache but with a different name
- **THEN** the cache SHALL use the newer person data

### Requirement: Covered ranges compaction
After each incremental merge, adjacent or overlapping `coveredRanges` entries SHALL be merged into a minimal set of non-overlapping intervals.

#### Scenario: Adjacent ranges are merged
- **WHEN** `coveredRanges` contains ["2026-06-01", "2026-06-15"] and ["2026-06-15", "2026-06-30"]
- **THEN** after compaction they SHALL become a single entry ["2026-06-01", "2026-06-30"]

#### Scenario: Overlapping ranges are merged
- **WHEN** `coveredRanges` contains ["2026-06-01", "2026-06-20"] and ["2026-06-10", "2026-06-30"]
- **THEN** after compaction they SHALL become a single entry ["2026-06-01", "2026-06-30"]
