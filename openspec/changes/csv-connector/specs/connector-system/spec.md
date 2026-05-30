## ADDED Requirements

### Requirement: ConnectorContext provides readFile method
The `ConnectorContext` interface SHALL include an optional `readFile` method that allows connector scripts to read local file content.

#### Scenario: Connector reads a local file
- **WHEN** a connector's `fetch` function calls `ctx.readFile("data/projects.csv")`
- **THEN** the platform SHALL read the file at the given path and return its content as a string

#### Scenario: readFile throws on missing file
- **WHEN** a connector calls `ctx.readFile` with a path that does not exist
- **THEN** the method SHALL throw an error indicating the file was not found

#### Scenario: Connector uses readFile with config path
- **WHEN** a connector calls `ctx.readFile(config.csvPath)` using a path from connector configuration
- **THEN** the platform SHALL resolve and read the file at the configured path

### Requirement: ConnectorContext provides parseCSV method
The `ConnectorContext` interface SHALL include an optional `parseCSV` method that provides CSV parsing capability to connector scripts.

#### Scenario: Connector parses CSV content
- **WHEN** a connector's `fetch` function calls `ctx.parseCSV(csvText)` with CSV text content
- **THEN** the method SHALL return an array of record objects parsed from the CSV text

#### Scenario: Connector parses CSV with custom delimiter
- **WHEN** a connector calls `ctx.parseCSV(csvText, { delimiter: ";" })` with a semicolon delimiter
- **THEN** the method SHALL parse fields using semicolons as delimiters

#### Scenario: parseCSV same as core parseCSV
- **WHEN** `ctx.parseCSV` is called on the Obsidian or Web platform
- **THEN** it SHALL delegate to the same `parseCSV` function exported from `gantt-core`

## MODIFIED Requirements

### Requirement: ConnectorContext
The system SHALL provide a `ConnectorContext` object to connector scripts containing: `config` (user-provided configuration object), a `request` function for HTTP requests (abstracting platform differences), a `log` function for debug output, a `readFile` function for reading local files, and a `parseCSV` function for parsing CSV text into structured records.

#### Scenario: Connector uses request function
- **WHEN** a connector's `fetch` function calls `context.request(url, options)`
- **THEN** the platform-specific HTTP layer executes the request and returns a standard Response-like object

#### Scenario: Connector reads config
- **WHEN** a connector's `fetch` function accesses `context.config`
- **THEN** it receives the configuration object defined in the view's connector settings

#### Scenario: Connector uses readFile function
- **WHEN** a connector's `fetch` function calls `context.readFile(path)`
- **THEN** the platform reads the local file and returns its contents as a string

#### Scenario: Connector uses parseCSV function
- **WHEN** a connector's `fetch` function calls `context.parseCSV(text)`
- **THEN** the platform parses the CSV text and returns an array of record objects
