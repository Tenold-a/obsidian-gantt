## ADDED Requirements

### Requirement: Per-item push with failure accumulation
Connectors implementing push SHALL push each item (task, project, delete) individually. On item failure, the connector SHALL append to a `failedItems` array and continue with remaining items. After all items are processed, if `failedItems.length > 0`, return `{ success: false, failedItems }`; otherwise `{ success: true }`.

The push pattern:
```typescript
async function push(payload, ctx, onProgress) {
  const failedItems = [];
  let completed = 0;
  const total = payload.tasks.length + payload.projects.length
    + payload.deletedTaskIds.length + payload.deletedProjectIds.length;

  for (const task of payload.tasks) {
    try { await pushTask(task); }
    catch (e) { failedItems.push({ id: task.id, type: 'task', error: e.message }); }
    completed++;
    onProgress?.({ current: completed, total, message: `Pushed task: ${task.id}` });
  }
  // ... same for projects, deletes ...

  return failedItems.length > 0
    ? { success: false, failedItems }
    : { success: true };
}
```

#### Scenario: Partial push success with per-item failure
- **WHEN** a connector pushes 3 modified tasks and successfully writes 2 but fails on 1
- **THEN** the PushResult SHALL be `{ success: false, failedItems: [{ id: "task-3", type: "task", error: "..." }] }`

#### Scenario: Full push success
- **WHEN** a connector pushes all items without errors
- **THEN** the PushResult SHALL be `{ success: true }` with no `failedItems`

#### Scenario: All items fail
- **WHEN** every item push fails
- **THEN** the PushResult SHALL be `{ success: false, failedItems: [...] }` containing all items

#### Scenario: One item failure does not block other items
- **WHEN** item 2 of 5 fails
- **THEN** items 1, 3, 4, 5 SHALL still be attempted and their results reflected independently

### Requirement: Selective push rollback in store
The store's `pushChanges()` method SHALL only clear edits for items that were successfully pushed. Items listed in `failedItems` SHALL retain their local edits and remain in the pending changes list, allowing the user to retry.

#### Scenario: Successful items cleared, failed items retained
- **WHEN** connector A succeeds on task-1, task-2 and reports task-3 in `failedItems`
- **THEN** edits for task-1 and task-2 SHALL be cleared; task-3's edits SHALL remain in the overlay

#### Scenario: All items failed — nothing cleared
- **WHEN** all connectors return `success: false` with all items in `failedItems`
- **THEN** no edits SHALL be cleared and all changes SHALL remain pending

#### Scenario: Backward compatibility with old connector (no failedItems)
- **WHEN** the store receives a PushResult without `failedItems`
- **THEN** it SHALL treat `success: true` as all succeeded (clear all) and `success: false` as all failed (clear none)

### Requirement: Test server partial failure endpoint
The test server SHALL provide `POST /api/push-partial?failEvery=N` that simulates partial push failures.

- `failEvery=N`: every Nth item fails, all others succeed
- `failEvery=1`: all items fail
- `failEvery` absent or 0: all items succeed
- Response: `{ success: boolean, failedItems?: { id: string, type: string, error: string }[] }`

#### Scenario: Every 3rd item fails
- **WHEN** posting 6 tasks to `/api/push-partial?failEvery=3`
- **THEN** items 3 and 6 SHALL fail, items 1, 2, 4, 5 SHALL succeed

#### Scenario: All items succeed with failEvery=0
- **WHEN** posting to `/api/push-partial` without `failEvery` parameter
- **THEN** all items SHALL succeed and response SHALL be `{ success: true }`
