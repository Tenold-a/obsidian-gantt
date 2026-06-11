## ADDED Requirements

### Requirement: Push progress callback
The connector's `push()` method SHALL accept an optional third parameter `onProgress` with signature `(progress: PushProgress) => void`. Where `PushProgress` is `{ current: number; total: number; message: string }`.

Connectors SHALL call `onProgress` before/after each item push to report progress. `current` is 1-based (incremented after each item), `total` is the overall item count, and `message` describes the current operation.

#### Scenario: Connector reports progress per item
- **WHEN** a connector calls `onProgress({ current: 5, total: 10, message: "Pushing task: Fix login bug" })`
- **THEN** the UI SHALL display a progress bar at 50% (5/10) with the message text

#### Scenario: Connector does not use progress callback
- **WHEN** a connector never calls `onProgress` during push
- **THEN** the UI SHALL show an indeterminate loading state instead of a percentage bar

#### Scenario: Progress bar in PendingChangesPanel
- **WHEN** a push is in progress and `onProgress` is called
- **THEN** the `PendingChangesPanel` SHALL render a progress bar showing `current/total` with percentage and the connector's message

#### Scenario: Progress completes at total
- **WHEN** the last item finishes and `onProgress({ current: total, total, message: "Complete" })` is called
- **THEN** the progress bar SHALL show 100% then transition to the per-connector result summary

### Requirement: Per-connector result summary
After push completes, the UI SHALL display a summary per connector showing success count and failure count.

#### Scenario: Summary after partial success
- **WHEN** connector A succeeds on all 5 items and connector B succeeds on 2/3 items
- **THEN** the summary SHALL show "Connector A: 5 succeeded" and "Connector B: 2 succeeded, 1 failed"

#### Scenario: Summary auto-dismisses
- **WHEN** the result summary is displayed
- **THEN** it SHALL automatically dismiss after 3 seconds
