## MODIFIED Requirements

### Requirement: PushProgress type
The system SHALL define `PushProgress` as `{ current: number; total: number; message: string }`. `current` is the 1-based count of items processed so far, `total` is the total number of items to push, and `message` is a human-readable description of the current operation (e.g. "Pushing task: Fix login bug").

### Requirement: PushChangesPayload and PushResult types
The system SHALL define `PushChangesPayload` with fields: `tasks` (`Partial<Task>[]` — only fields with manual overrides, must include `id`), `projects` (`Partial<Project>[]` — only fields with manual overrides, must include `id`), `deletedTaskIds` (`string[]`), `deletedProjectIds` (`string[]`).

`PushResult` SHALL have:
- `success: boolean`
- `error?: string` — overall error description
- `failedItems?: { id: string; type: 'task' | 'project'; error: string }[]` — per-item failure details

Connector 实现者不假设 12 个字段全在 payload 中，应使用 PATCH 语义合并。

#### Scenario: Push result indicates success
- **WHEN** a connector's `push` method completes successfully with no failures
- **THEN** the return value SHALL include `success: true`

#### Scenario: Push result indicates partial failure
- **WHEN** a connector pushes items item-by-item and some items fail
- **THEN** the return value SHALL include `success: false` and `failedItems` listing each failed item with `id`, `type`, and `error`

#### Scenario: Push result indicates total failure
- **WHEN** a connector's `push` method fails entirely (e.g. network error)
- **THEN** the return value SHALL include `success: false` and an `error` string

#### Scenario: Push payload tasks only include changed fields (PATCH semantics)
- **WHEN** the store builds a push payload and a task only has its `startDate` and `progress` edited
- **THEN** the task in the payload SHALL only contain `{ id, startDate, progress }` — not all 12 fields

#### Scenario: Push payload includes local tasks as full objects
- **WHEN** a task is locally created (no upstream ID)
- **THEN** it SHALL be included as a full object since there is no upstream baseline to PATCH against

### Requirement: Connector push interface
The `ConnectorModule` interface SHALL include an optional `push` method with signature:

```typescript
push?(changes: PushChangesPayload, ctx: ConnectorContext,
      onProgress?: (p: PushProgress) => void): Promise<PushResult>;
```

Connectors without `push` SHALL be treated as read-only.

#### Scenario: Connector exports push for write support
- **WHEN** a connector script exports `push` alongside `fetch` and `transform`
- **THEN** the system SHALL recognize it as a read-write connector

#### Scenario: Connector without push is read-only
- **WHEN** a connector script does not export `push`
- **THEN** the system SHALL treat it as read-only

#### Scenario: Push receives progress callback
- **WHEN** the system calls `push(changes, context, onProgress)`
- **THEN** the connector MAY call `onProgress({ current, total, message })` before/after each item to report progress

## REMOVED Requirements

None.
