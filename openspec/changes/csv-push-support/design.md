## Context

The `ConnectorModule.push` interface and `PushChangesPayload` / `PushResult` types already exist in `gantt-core`. The CSV connector currently only supports read (fetch + transform). Users who adjust dates, reassign tasks, or change progress in the Gantt chart want those edits written back to the original CSV files so the spreadsheet stays in sync.

## Goals / Non-Goals

**Goals:**
- CSV connector `push()` writes modified tasks back to the 3 CSV files (persons, projects, tasks)
- Only manually-edited fields are pushed (source === 'manual'), not upstream data
- New tasks are appended as CSV rows; deleted tasks have their rows removed
- Store provides `pushChanges(connectorId)` that collects edits, calls push, refreshes on success
- UI toolbar has a "Push" button with loading/error feedback
- `ConnectorContext` gains `writeFile` for connector scripts to write back to files

**Non-Goals:**
- Bidirectional sync conflict resolution — push blindly overwrites CSV with manual values
- Partial push (push only selected tasks) — always pushes all manual edits
- Push for non-CSV connectors (the interface supports it, but only CSV implements it now)
- Automatic push on every edit — push is explicit via button click

## Decisions

### 1. Push payload built from merged tasks, filtering only manual fields

**Choice**: `pushChanges()` iterates `mergedTasks`, collects tasks where at least one field has `source === 'manual'`, and builds `PushChangesPayload.tasks` with only the manual field values. Projects and deleted IDs are also collected from edits.

**Why**: The merge engine already tracks source per field. Leveraging that avoids a separate dirty-tracking layer.

### 2. CSV push rewrites entire task CSV, updates person/project CSVs by row

**Choice**: For `tasks.csv`, read the current file, find the matching row by task ID, update cells in-place, and write the entire file. New tasks append new rows. Deleted tasks remove rows. For `persons.csv` and `projects.csv`, only update rows when name/requester/color fields change (these change rarely).

**Why**: CSV files have no partial-update mechanism — rewriting the file is the only safe approach. Line-by-line update preserves formatting and column order of the original file better than regenerating from scratch.

**Alternatives considered**:
- Regenerate entire CSV from canonical data → loses manual formatting, comment lines, column ordering
- Use a database instead → over-engineering for the use case

### 3. writeFile as a ConnectorContext method

**Choice**: Add `writeFile(path: string, content: string): Promise<void>` to `ConnectorContext`. In Obsidian, it uses the vault adapter's `write()`. In Web, it uses `localStorage` or a download prompt.

**Why**: Mirrors the existing `readFile` pattern. Keeps the connector sandbox from needing direct filesystem access.

### 4. Push button in toolbar, push-then-refresh flow

**Choice**: Clicking "Push" calls `store.pushChanges(id)` which: collects payload → calls `connector.push(payload, ctx)` → on success, calls `store.refreshConnector(id)` to re-read the updated CSV. The button shows loading state during the operation and error message on failure.

**Why**: Push-then-refresh ensures the UI reflects the actual CSV state after write. If the CSV was edited externally between the last refresh and push, the refresh catches those changes too.

## Risks / Trade-offs

- **Concurrent CSV edits**: If someone edits the CSV externally while the user is making changes in Gantt, push overwrites those external changes. → Push only writes fields the user has explicitly edited (source: manual), minimizing blast radius.
- **CSV formatting loss**: Rewriting the entire tasks CSV may change formatting (spacing, quoting style). → The CSV parser's output is normalized; rewriting with proper quoting preserves data integrity if not cosmetic formatting.
- **Large CSV write performance**: Rewriting a large CSV on every push may be slow. → For typical project CSVs (hundreds to low thousands of rows), this is negligible.
