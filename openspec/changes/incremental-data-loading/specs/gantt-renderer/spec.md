## ADDED Requirements

### Requirement: Visible date range tracking
The Timeline component SHALL compute and expose the currently visible date range based on scroll position, container width, and day width.

#### Scenario: Visible range from scroll position
- **WHEN** the timeline is scrolled to `scrollLeft = 300px`, `dayWidth = 30px`, `containerWidth = 900px`, and the timeline starts at "2026-05-01"
- **THEN** `visibleStartDate` SHALL be "2026-05-11" (300/30 = 10 days offset) and `visibleEndDate` SHALL be approximately "2026-06-10" (10 + 900/30 = 40 days span)

#### Scenario: Visible range updates on scroll
- **WHEN** the user scrolls the timeline horizontally
- **THEN** the visible range SHALL update within the next animation frame

### Requirement: Auto-fetch trigger on scroll near boundary
The system SHALL automatically trigger `fetchForRange` when the visible viewport approaches within half the buffer distance of an unloaded time region.

#### Scenario: Scroll triggers preload
- **WHEN** the user scrolls so the visible range is within 15 days of an uncovered region (buffer/2)
- **THEN** `fetchForRange` SHALL be called for the upcoming region with a window size of `viewportWidth + 2 * buffer` days

#### Scenario: No fetch while already loading
- **WHEN** a fetch is already in progress for the same connector
- **THEN** no additional fetch SHALL be triggered until the current one completes

#### Scenario: Debounce prevents rapid-fire fetches
- **WHEN** the user rapidly scrolls through multiple windows
- **THEN** fetch requests SHALL be throttled to at most one per 500ms per connector

### Requirement: Initial load loads visible range plus buffer
When a view is first loaded, the system SHALL automatically fetch data for the initially visible date range plus a configurable buffer (default 30 days on each side), rather than fetching all data.

#### Scenario: Initial load fetches viewport window
- **WHEN** a view is loaded and the timeline shows approximately 60 days by default
- **THEN** `fetchForRange` SHALL be called for a window of approximately 120 days (60 visible + 30 buffer on each side)

#### Scenario: Full load on explicit refresh
- **WHEN** the user clicks the Refresh button
- **THEN** `refreshConnector` SHALL be called (full fetch, no range filter)
