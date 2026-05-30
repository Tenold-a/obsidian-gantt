## Why

Users edit task dates and fields directly in the Gantt chart, but those changes only persist locally in `edits/<view-id>.json`. The upstream CSV files remain unchanged. To close the loop, the CSV connector needs a `push()` method that writes local modifications back to the original CSV tables, making the Gantt chart a true two-way editor for spreadsheet-based project data.

## What Changes

- **CSV connector `push()` implementation**: Writes modified tasks back to the 3 CSV files (persons, projects, tasks). Tasks with changed fields update the corresponding CSV rows. New tasks append rows. Deleted tasks remove rows.
- **Store `pushChanges` action**: New action that collects all manually-modified tasks from merged data, packages them as `PushChangesPayload`, calls the connector's `push()` method, and on success triggers a refresh to reconcile.
- **UI "Push" button**: A toolbar button that triggers `pushChanges` for each connector in the current view, with visual feedback (loading/success/error).
- **`readFile` → `writeFile` on ConnectorContext**: The `push()` method needs to write files back, so `ConnectorContext` exposed to connectors also needs a `writeFile` capability (already available implicitly through platform, formalized as `writeFile`).

## Capabilities

### New Capabilities

- `connector-push`: Defines when and how the system calls a connector's `push()` method — collecting manual edits into `PushChangesPayload`, calling push, and reconciling on success
- `csv-push`: CSV connector's `push()` implementation — maps `PushChangesPayload` back to CSV rows, updates/inserts/deletes in the 3 CSV files via `ctx.writeFile`

### Modified Capabilities

- `csv-connector`: CSV connector script gains `push` export; configuration MAY include `paths` for writing (defaults to same paths as `fetch`)
- `connector-system`: `ConnectorContext` gains optional `writeFile(path, content)` method for writing local files; `PushChangesPayload` and `PushResult` already defined

## Impact

- **Core types** (`packages/gantt-core/src/index.ts`): `ConnectorContext` gains `writeFile?: (path: string, content: string) => Promise<void>`; `PushChangesPayload` and `PushResult` already exist
- **CSV connector** (`packages/obsidian-plugin/connectors/csv-connector.js`): New `push()` export that serializes changes back to CSV; helper for CSV row serialization (quoting fields with commas/quotes)
- **Store** (`packages/gantt-ui/src/store.ts`): New `pushChanges(connectorId)` action that collects manual edits, calls `connector.push()`, then refreshes
- **Platform** (`packages/obsidian-plugin/src/connector-loader.ts`, `packages/web-app/src/main.tsx`): `ConnectorContext` factory adds `writeFile` implementation
- **UI** (`packages/gantt-ui/src/GanttChart.tsx`): "Push" button in toolbar
