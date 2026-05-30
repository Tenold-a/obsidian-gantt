## 1. Core Types: writeFile on ConnectorContext

- [x] 1.1 Add `writeFile?: (path: string, content: string) => Promise<void>` to `ConnectorContext` interface in `packages/gantt-core/src/index.ts`

## 2. Platform: writeFile Implementation

- [x] 2.1 Update `createObsidianConnectorContext` in `packages/obsidian-plugin/src/connector-loader.ts` to include `writeFile` using `vaultAdapter.write(path, content)`
- [x] 2.2 Update `createWebConnectorContext` in `packages/web-app/src/main.tsx` to include `writeFile` using `localStorage.setItem()` or download prompt

## 3. CSV Connector: push() Implementation

- [x] 3.1 Add CSV serialization helper: `toCSVRow(fields, delimiter)` — quotes fields containing commas/quotes/newlines
- [x] 3.2 Implement `push(payload, ctx)` in `csv-connector.js`:
  - Read current tasks.csv via `ctx.readFile`
  - Parse with `ctx.parseCSV` to get row objects + preserve header
  - For each task in payload.tasks: find matching row by ID, update cells, or append new row
  - For each ID in payload.deletedTaskIds: remove matching row
  - Serialize back to CSV text via `toCSVRow`
  - Write via `ctx.writeFile`
  - Repeat for persons.csv and projects.csv (updates only, no new/deleted rows for persons/projects in v1)
  - Return `{ success: true }` or `{ success: false, error: "..." }`

## 4. Store: pushChanges Action

- [x] 4.1 Add `pushChanges(connectorId: string): Promise<void>` to `GanttStore` interface and `createGanttStore` in `packages/gantt-ui/src/store.ts`
- [x] 4.2 Implement payload collection: iterate `mergedTasks`, filter tasks with at least one `source: "manual"` field, build `PushChangesPayload`
- [x] 4.3 Load connector module via `platform.connectorLoader.load(scriptPath)`, create context, call `module.push(payload, ctx)`
- [x] 4.4 On push success, automatically call `refreshConnector(connectorId)` to reload
- [x] 4.5 On push failure or missing push method, set `error` signal with descriptive message

## 5. UI: Push Button

- [x] 5.1 Add "Push" button to toolbar in `packages/gantt-ui/src/GanttChart.tsx`
- [x] 5.2 Push button onClick: iterate view connectors, call `store.pushChanges(connectorId)` for each
- [x] 5.3 Show loading spinner on button while pushing
- [x] 5.4 Show error message (from `store.error`) if push fails

## 6. Verification

- [x] 6.1 Write unit test: `toCSVRow` correctly quotes fields with commas, quotes, newlines
- [x] 6.2 Run `npm run test` and `npm run build` in all packages
- [x] 6.3 Manual test: edit a task date in Gantt, push, verify CSV file is updated
- [x] 6.4 Manual test: create a new task locally, push, verify new row appears in CSV
