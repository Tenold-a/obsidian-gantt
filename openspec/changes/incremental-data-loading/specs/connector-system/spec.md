## MODIFIED Requirements

### Requirement: ConnectorContext
The system SHALL provide a `ConnectorContext` object to connector scripts containing: `config` (user-provided configuration object), a `request` function for HTTP requests (abstracting platform differences), a `log` function for debug output, a `readFile` function for reading local files, a `parseCSV` function for parsing CSV text into structured records, and an optional `range` field (`{ startDate: string; endDate: string }`) indicating the requested time window when performing an incremental fetch.

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

#### Scenario: Full refresh provides no range
- **WHEN** a full refresh is triggered via `refreshConnector`
- **THEN** `context.range` SHALL be `undefined` and the connector SHALL return all data

#### Scenario: Incremental fetch provides range
- **WHEN** an incremental fetch is triggered via `fetchForRange` with start and end dates
- **THEN** `context.range` SHALL contain the requested `startDate` and `endDate`

## ADDED Requirements

### Requirement: ConnectorModule interface backward compatibility
The `ConnectorModule` interface (`fetch` and `transform` function signatures) SHALL remain unchanged. Time range filtering SHALL be communicated through `ConnectorContext.range`, not through additional function parameters.

#### Scenario: Existing connector passes validation
- **WHEN** a connector script exports `fetch(ctx)` and `transform(rawData, ctx)` with existing signatures
- **THEN** the system SHALL recognize it as valid without requiring parameter changes
