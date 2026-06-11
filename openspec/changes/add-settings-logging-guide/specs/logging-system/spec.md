## ADDED Requirements

### Requirement: ILogger interface
The system SHALL define an `ILogger` interface in `gantt-core` with four methods: `debug(message: string, data?: unknown): void`, `info(message: string, data?: unknown): void`, `warn(message: string, data?: unknown): void`, and `error(message: string, data?: unknown): void`. Each method call SHALL produce a structured `LogEntry` record.

#### Scenario: Debug log entry
- **WHEN** `logger.debug("Processing item", { id: "t1" })` is called
- **THEN** a `LogEntry` with `level: "debug"`, `message: "Processing item"`, and `data: { id: "t1" }` is created

#### Scenario: Error log entry with exception data
- **WHEN** `logger.error("Network failure", { status: 500, url: "..." })` is called
- **THEN** a `LogEntry` with `level: "error"` and the provided data is created

### Requirement: LogEntry structure
Each log entry SHALL include the fields `timestamp` (ISO 8601 string), `level` (one of `"debug" | "info" | "warn" | "error"`), `source` (a string identifying the component, e.g. `"plugin"`, `"ui"`, `"connector:csv-connector"`), `message` (string), and an optional `data` field of type `unknown`.

#### Scenario: Log entry has required fields
- **WHEN** any log method is called
- **THEN** the resulting entry SHALL have non-empty `timestamp`, `level`, `source`, and `message` fields

#### Scenario: Log entry with optional data
- **WHEN** `logger.info("Loaded", { count: 42 })` is called
- **THEN** the entry's `data` field SHALL be `{ count: 42 }`

### Requirement: LogSettings type
The system SHALL define a `LogSettings` type with fields: `enabled` (boolean), `level` (one of `"debug" | "info" | "warn" | "error"`), and `retentionDays` (number, default 30).

#### Scenario: Default log settings
- **WHEN** no user-configured log settings exist
- **THEN** the system SHALL use `{ enabled: false, level: "info", retentionDays: 30 }`

#### Scenario: Logging disabled
- **WHEN** `LogSettings.enabled` is `false`
- **THEN** the logger SHALL be a no-op and produce zero log entries

### Requirement: Level-based filtering
The logger SHALL compare each call's level against the configured `LogSettings.level` and SHALL discard entries below the threshold. The level hierarchy SHALL be: `debug` < `info` < `warn` < `error`.

#### Scenario: Info level filters out debug
- **WHEN** `LogSettings.level` is `"info"` and `logger.debug(...)` is called
- **THEN** the debug entry is discarded

#### Scenario: Warn level passes error through
- **WHEN** `LogSettings.level` is `"warn"` and `logger.error(...)` is called
- **THEN** the error entry is recorded

### Requirement: Obsidian logger implementation
The Obsidian platform SHALL implement `ILogger` by buffering entries in memory and flushing them as a JSON array to `obsidian-gantt-data/logs/gantt-YYYY-MM-DD.json` on a 5-second interval and on plugin unload. Each day SHALL produce a separate file.

#### Scenario: Log file created on first flush
- **WHEN** the first log entry is flushed for the day
- **THEN** a new file `logs/gantt-<today>.json` is created containing a JSON array with that entry

#### Scenario: Subsequent entries append to same file
- **WHEN** additional entries are flushed on the same day
- **THEN** the existing file is overwritten with the full array including new entries

#### Scenario: New day creates new file
- **WHEN** log entries span across midnight
- **THEN** entries after midnight are written to a new file for the new date

#### Scenario: Flush on plugin unload
- **WHEN** the plugin is unloaded
- **THEN** all buffered log entries are flushed to disk immediately

### Requirement: Web logger implementation
The web app platform SHALL implement `ILogger` by calling `console.log` / `console.warn` / `console.error` (with level prefix) and appending entries to a `gantt:logs` key in localStorage as a JSON array. Entries older than `retentionDays` SHALL be pruned on app startup.

#### Scenario: Web debug log goes to console
- **WHEN** `logger.debug("test")` is called in the web app
- **THEN** `console.log("[debug] test")` is invoked

#### Scenario: Web error log goes to console.error
- **WHEN** `logger.error("fail")` is called in the web app
- **THEN** `console.error("[error] fail")` is invoked

#### Scenario: Web logs persisted in localStorage
- **WHEN** a log entry is created in the web app
- **THEN** the entry is appended to the `gantt:logs` JSON array in localStorage

### Requirement: Logger factory on GanttPlatform
The `GanttPlatform` interface SHALL expose a `createLogger(source: string): ILogger` method so that all platform consumers (UI store, connectors) can obtain a logger instance.

#### Scenario: Platform provides logger to store
- **WHEN** the UI store initializes
- **THEN** it calls `platform.createLogger("ui")` and receives an `ILogger` instance

#### Scenario: Platform provides logger to connector context
- **WHEN** a connector context is created
- **THEN** `createLogger("connector:<connectorId>")` is called and the result is passed as `ctx.logger`

### Requirement: Log entry source tagging
Each `ILogger` instance SHALL be created with a fixed `source` string that is automatically attached to every log entry produced by that instance.

#### Scenario: Plugin logger tags as "plugin"
- **WHEN** a logger is created with `createLogger("plugin")`
- **THEN** all entries have `source: "plugin"`

#### Scenario: Connector logger tags with connector ID
- **WHEN** a logger is created with `createLogger("connector:csv-connector")`
- **THEN** all entries have `source: "connector:csv-connector"`
