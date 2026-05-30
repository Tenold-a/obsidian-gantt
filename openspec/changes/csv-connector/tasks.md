## 1. CSV Parser (gantt-core)

- [x] 1.1 Create `packages/gantt-core/src/csv-parser.ts` with `parseCSV(text: string, options?: CsvParseOptions): Record<string, string>[]` function that handles: header row extraction, quoted fields, escaped quotes (`""`), embedded commas/newlines in quotes, empty fields, configurable delimiter, UTF-8 BOM stripping
- [x] 1.2 Add `CsvParseOptions` interface (`{ delimiter?: string }`) and export it from `csv-parser.ts`
- [x] 1.3 Re-export `parseCSV` and `CsvParseOptions` from `packages/gantt-core/src/index.ts`

## 2. ConnectorContext Extension (gantt-core)

- [x] 2.1 Add `readFile?: (path: string) => Promise<string>` to `ConnectorContext` interface in `packages/gantt-core/src/index.ts`
- [x] 2.2 Add `parseCSV?: (text: string, options?: CsvParseOptions) => Record<string, string>[]` to `ConnectorContext` interface in `packages/gantt-core/src/index.ts`

## 3. Obsidian Platform: readFile and parseCSV

- [x] 3.1 Update `createObsidianConnectorContext` in `packages/obsidian-plugin/src/connector-loader.ts` to accept a `VaultAdapter` parameter and implement `readFile` using `adapter.read(path)`
- [x] 3.2 Implement `parseCSV` in `createObsidianConnectorContext` by importing and delegating to `parseCSV` from `@obsidian-gantt/core`
- [x] 3.3 Update the caller of `createObsidianConnectorContext` (in platform.ts or connector-loader.ts) to pass the vault adapter

## 4. Web Platform: readFile and parseCSV

- [x] 4.1 Update the connector context factory in `packages/web-app/src/main.tsx` to implement `readFile` using the Fetch API (`fetch(path) → response.text()`)
- [x] 4.2 Implement `parseCSV` in the web connector context by importing and delegating to `parseCSV` from `@obsidian-gantt/core`

## 5. CSV Connector Script

- [x] 5.1 Create `packages/obsidian-plugin/connectors/csv-connector.js` with `async function fetch(ctx)` that reads a CSV file via `ctx.readFile(ctx.config.csvPath)` and parses it via `ctx.parseCSV(content, { delimiter: ctx.config.delimiter })`
- [x] 5.2 Implement `function transform(records, ctx)` that maps CSV records to `CanonicalData` using `ctx.config.columnMapping` with defaults:
  - `taskId` → `"任务"` (combined with project for uniqueness)
  - `taskTitle` → `"任务"`
  - `personId` → `"人员"`
  - `personName` → `"人员"`
  - `projectId` → `"项目"`
  - `projectName` → `"项目"`
  - `projectRequester` → `"需求方"`
  - `startDate` → `"开始日期"`
  - `endDate` → `"结束日期"`
- [x] 5.3 Implement person deduplication: iterate all task rows, collect unique `personId`→`personName` pairs into `persons[]`
- [x] 5.4 Implement project deduplication: iterate all task rows, collect unique `projectId`→`{name, requester}` pairs into `projects[]`
- [x] 5.5 Handle missing optional columns gracefully (requester, dates may be absent)
- [x] 5.6 Ensure the connector script is copied/bundled into the Obsidian plugin output so it's available for extraction to the vault's `connectors/` directory

## 6. Verification

- [x] 6.1 Write unit tests for `parseCSV` in `packages/gantt-core/tests/csv-parser.test.ts` covering: basic parsing, quoted fields, escaped quotes, empty fields, custom delimiter, BOM handling, empty input
- [x] 6.2 Run `npm run test` in `packages/gantt-core` to verify CSV parser tests pass
- [x] 6.3 Run `npm run build` (or equivalent) in each affected package to verify no build errors
- [x] 6.4 Manually verify the CSV connector works with a sample CSV file in Obsidian: create a test CSV, configure the connector, and confirm tasks/persons/projects render correctly
