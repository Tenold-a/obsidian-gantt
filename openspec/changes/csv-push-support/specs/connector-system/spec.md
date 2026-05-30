## MODIFIED Requirements

### Requirement: ConnectorContext
The system SHALL provide a `ConnectorContext` object to connector scripts containing: `config` (user-provided configuration object), a `request` function for HTTP requests (abstracting platform differences), a `log` function for debug output, a `readFile` function for reading local files, a `writeFile` function for writing local files, a `parseCSV` function for parsing CSV text into structured records, and an optional `range` field (`{ startDate: string; endDate: string }`) indicating the requested time window when performing an incremental fetch.

#### Scenario: Connector uses request function
- **WHEN** a connector's `fetch` function calls `context.request(url, options)`
- **THEN** the platform-specific HTTP layer executes the request and returns a standard Response-like object

#### Scenario: Connector reads config
- **WHEN** a connector's `fetch` function accesses `context.config`
- **THEN** it receives the configuration object defined in the view's connector settings

#### Scenario: Connector uses readFile function
- **WHEN** a connector's `fetch` function calls `context.readFile(path)`
- **THEN** the platform reads the local file and returns its contents as a string

#### Scenario: Connector uses writeFile function
- **WHEN** a connector's `push` function calls `context.writeFile(path, content)`
- **THEN** the platform writes the content to the local file at the given path

#### Scenario: Connector uses parseCSV function
- **WHEN** a connector's `fetch` function calls `context.parseCSV(text)`
- **THEN** the platform parses the CSV text and returns an array of record objects

## ADDED Requirements

### Requirement: ConnectorModule push interface
The `ConnectorModule` interface SHALL include an optional `push` method with signature `(changes: PushChangesPayload, ctx: ConnectorContext) => Promise<PushResult>`. Connectors that don't export `push` SHALL be treated as read-only.

#### Scenario: Connector with push exports push function
- **WHEN** a connector script exports `push` alongside `fetch` and `transform`
- **THEN** the system SHALL recognize it as a read-write connector

#### Scenario: Connector without push is read-only
- **WHEN** a connector script does not export `push`
- **THEN** the system SHALL treat it as read-only and hide or disable the Push button
