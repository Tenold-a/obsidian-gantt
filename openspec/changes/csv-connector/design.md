## Context

The Gantt chart project has a connector system where connector scripts export `fetch()` and `transform()` functions. Currently, `ConnectorContext` only supports HTTP requests via `ctx.request()`. There is no mechanism for connectors to read local files or parse structured text formats. The user needs to import data from local CSV spreadsheets, which is a common workflow for teams tracking projects in Excel or similar tools.

The connector script sandbox (`new Function()`) prevents direct imports from `@obsidian-gantt/core`, so utility functions must be provided through `ConnectorContext`.

## Goals / Non-Goals

**Goals:**
- Provide a lightweight, zero-dependency CSV parser in `gantt-core` that handles RFC 4180 compliant CSV (quoted fields, escaped quotes, embedded newlines, configurable delimiter)
- Extend `ConnectorContext` with two new methods: `readFile(path)` for local file access and `parseCSV(text)` for CSV parsing
- Implement `readFile` and `parseCSV` in both Obsidian and Web platforms
- Ship a ready-to-use CSV connector script template that maps typical Chinese spreadsheet columns (项目/任务/人员/需求方) to `CanonicalData`
- Support configurable column mapping so users can adapt to their CSV structure
- Auto-deduplicate persons and projects derived from task rows

**Non-Goals:**
- Excel `.xlsx` file support — CSV only
- Streaming/large-file parsing — the entire CSV is read into memory
- Custom date format parsing — dates must be ISO 8601 (YYYY-MM-DD) in the CSV
- Multi-file or multi-connector CSV
- Progress reporting during CSV parsing

## Decisions

### 1. CSV parser as a utility on ConnectorContext, not inlined

**Choice**: Add `parseCSV(text: string, options?: CsvParseOptions): CsvRecord[]` to `ConnectorContext`. The parser implementation lives in `gantt-core/src/csv-parser.ts` and is injected into the context by the platform.

**Why**: The connector sandbox (`new Function()`) has no module system. If the parser were a separate module, each connector script would need to inline it. Putting it on the context means one canonical implementation, tested once, available to all connectors.

**Alternatives considered**:
- Inline the parser in each connector script → code duplication, hard to fix bugs
- Expose it as a global → pollutes scope, harder to type
- Use an external library (PapaParse) → adds a dependency, most features unnecessary

### 2. readFile as a ConnectorContext method

**Choice**: Add `readFile(path: string): Promise<string>` to `ConnectorContext`.

**Why**: Connectors that read local data (CSV, JSON, XML files) need a file access primitive. The existing `request()` method is HTTP-only and does not handle local files. `readFile` provides a unified abstraction: in Obsidian it reads from the vault, in Web it fetches from a URL or uses the File API.

**Alternatives considered**:
- Pass file content in `config.data` → bad UX, user must copy-paste file content
- Use `request()` with `file://` URLs → not supported by Obsidian's `requestUrl`, inconsistent across platforms

### 3. CSV connector shipped as a built-in script, not user-authored from scratch

**Choice**: Provide a complete `csv-connector.js` script that users can use directly. The script is embedded in the plugin build and extracted to the vault's `connectors/` directory on first use.

**Why**: Reduces friction. Users should not need to write connector code for a standard format like CSV. They configure the CSV path and column mapping in the view settings, and the built-in script handles the rest.

**Alternatives considered**:
- Documentation-only approach with code snippets → more work for users, error-prone
- CSV importer that bypasses the connector system → creates a second data path, violates architecture

### 4. Column mapping via config, not hardcoded column names

**Choice**: The connector script accepts a `columnMapping` object in `ctx.config` that maps canonical fields to CSV column headers. Default mapping for Chinese headers:

```json
{
  "columnMapping": {
    "taskId": "任务ID",
    "taskTitle": "任务",
    "startDate": "开始日期",
    "endDate": "结束日期",
    "personId": "人员ID",
    "personName": "人员",
    "projectId": "项目ID", 
    "projectName": "项目",
    "projectRequester": "需求方"
  }
}
```

**Why**: Different teams use different column names. A configurable mapping makes the connector reusable without script modification.

### 5. Persons and projects derived from task rows with deduplication

**Choice**: `transform()` scans all task rows, extracts unique `personId`/`personName` pairs and `projectId`/`projectName` pairs, and builds the `persons[]` and `projects[]` arrays. Duplicates (same ID) are merged.

**Why**: Typical CSV spreadsheets have person and project info inline in each task row. Requiring separate CSV files for persons and projects would add complexity. Deduplication by ID is straightforward and handles the common case.

**Risk**: If two rows have the same person ID but different names, the last row wins silently. → Mitigation: document that person/project IDs should be consistent across rows.

## Risks / Trade-offs

- **CSV parser is custom, not battle-tested**: A hand-written parser may have edge cases with unusual CSV formats. → The parser targets RFC 4180 compliance, the most common standard. A test suite covers quoted fields, escapes, and BOM handling.
- **readFile path security**: In Obsidian, `readFile` could access files outside the vault if not restricted. → The Obsidian implementation restricts paths to the vault root via the Vault adapter which already enforces this.
- **Memory for large CSV files**: The entire file is loaded into memory. → For typical project management spreadsheets (hundreds to low thousands of rows), this is negligible. Document the limitation.
- **Connector context breaking change**: Adding methods to `ConnectorContext` is backward-compatible (new optional methods), but existing platform implementations must be updated. → Both `readFile` and `parseCSV` are optional; existing connectors continue to work without them.
