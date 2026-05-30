## Why

Users need to manage project data from local CSV spreadsheets. Many teams track projects, tasks, and personnel assignments in Excel/CSV format. Without a CSV connector, users must manually convert CSV data into the canonical format or write custom connector scripts from scratch. A built-in CSV connector enables zero-code import of spreadsheet-based project data.

## What Changes

- **New CSV connector script template**: A ready-to-use connector that reads a local CSV file and maps columns to `CanonicalData` (tasks, persons, projects)
- **New built-in CSV parser**: A lightweight, dependency-free CSV parsing utility in `gantt-core` that connectors can use to parse CSV text into record arrays
- **Extended ConnectorContext**: Add `readFile(path: string): Promise<string>` method so connectors can read local files (not just make HTTP requests)
- **Platform implementations**: Obsidian platform implements `readFile` via Vault adapter; Web platform implements it via fetch API
- **CSV column mapping**: Support configurable column mapping from CSV columns (项目/任务/人员/需求方) to canonical fields

## Capabilities

### New Capabilities

- `csv-connector`: A connector script that reads a local CSV file, parses rows, and converts them to `CanonicalData` with proper deduplication of persons and projects
- `csv-parser`: A built-in, zero-dependency CSV parsing utility in `gantt-core` that handles quoted fields, escaped characters, and header row extraction

### Modified Capabilities

- `connector-system`: `ConnectorContext` gains an optional `readFile` method for local file access; the connector interface documentation is updated
- `platform-abstraction`: `GanttPlatform` and `ConnectorContext` factory functions must provide `readFile` implementation

## Impact

- **Core types** (`packages/gantt-core/src/index.ts`): `ConnectorContext` gains `readFile?: (path: string) => Promise<string>`
- **New CSV parser** (`packages/gantt-core/src/csv-parser.ts`): Exported `parseCSV(text: string)` function
- **Connector loader** (`packages/obsidian-plugin/src/connector-loader.ts`): `createObsidianConnectorContext` provides `readFile` via vault adapter
- **Web platform** (`packages/web-app/src/main.tsx`): `createConnectorContext` provides `readFile` via fetch
- **New connector script** (shipped as example or embedded): CSV connector with `fetch()` and `transform()` functions
