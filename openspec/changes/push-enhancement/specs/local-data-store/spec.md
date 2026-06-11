## MODIFIED Requirements

### Requirement: Push changes payload schema
The changes payload passed to `push()` SHALL aggregate local modifications from the edits overlay. For each modified task/project, the payload SHALL include only the specific fields that were modified (PATCH semantics), not full objects. The store SHALL clear only successfully pushed items after push completes, leaving failed items in the overlay for retry.

#### Scenario: Payload includes only changed fields
- **WHEN** building the push payload and a task override contains `{ startDate: "2026-06-15", progress: 0.5 }`
- **THEN** the task in the payload SHALL be `{ id: "<taskId>", startDate: "2026-06-15", progress: 0.5 }` — not a full Task with all 12 fields

#### Scenario: Payload does not assume missing fields
- **WHEN** a connector receives a `Partial<Task>` with only `{ id, progress }`
- **THEN** the connector SHALL apply PATCH semantics — only update `progress`, leave all other fields unchanged on the remote

#### Scenario: Payload includes locally created tasks as full objects
- **WHEN** the edits overlay contains local tasks (no upstream source)
- **THEN** those tasks SHALL be included as full objects since they have no upstream baseline

#### Scenario: Successful items cleared after push
- **WHEN** a push returns `success: true` or partial success with `failedItems`
- **THEN** only the successfully pushed items SHALL be cleared from the edits overlay; failed items SHALL be retained

#### Scenario: Project overrides with changed fields only
- **WHEN** building the push payload and a project override contains `{ status: "completed", color: "#FF0000" }`
- **THEN** the project in the payload SHALL be `{ id: "<projectId>", status: "completed", color: "#FF0000" }`

### Requirement: Progress signal in store
The store SHALL expose a `pushProgress` signal (`Signal<PushProgress | null>`) that is updated during push execution and reset to `null` when push completes.

#### Scenario: Progress signal updated during push
- **WHEN** the connector calls `onProgress({ current: 3, total: 10, message: "..." })`
- **THEN** the `pushProgress` signal SHALL be set to `{ current: 3, total: 10, message: "..." }` (throttled to max 100ms intervals)

#### Scenario: Progress signal reset after push
- **WHEN** push completes (success or failure)
- **THEN** the `pushProgress` signal SHALL be reset to `null`
