## MODIFIED Requirements

### Requirement: ConnectorContext
The system SHALL provide a `ConnectorContext` object to connector scripts containing: `config` (user-provided configuration object), a `request` function for HTTP requests (abstracting platform differences), a `log` function for debug output (delegates to `logger.info` for backward compatibility), a `logger` property of type `ILogger` for structured logging, a `readFile` function for reading local files, a `writeFile` function for writing local files, and a `parseCSV` function for parsing CSV text into structured records.

#### Scenario: Connector uses request function
- **WHEN** a connector's `fetch` function calls `context.request(url, options)`
- **THEN** the platform-specific HTTP layer executes the request and returns a standard Response-like object

#### Scenario: Connector reads config
- **WHEN** a connector's `fetch` function accesses `context.config`
- **THEN** it receives the configuration object defined in the view's connector settings

#### Scenario: Connector reads a local file
- **WHEN** a connector calls `context.readFile(path)`
- **THEN** the platform reads the local file and returns its content as a string

#### Scenario: Connector writes a local file
- **WHEN** a connector calls `context.writeFile(path, content)`
- **THEN** the platform writes the content to the local file at the given path

#### Scenario: Connector parses CSV text
- **WHEN** a connector calls `context.parseCSV(text)`
- **THEN** the platform parses the CSV text and returns an array of record objects

#### Scenario: Connector uses structured logger
- **WHEN** a connector calls `context.logger.info("message", { data })`
- **THEN** a structured log entry is created with `source: "connector:<connectorId>"`

#### Scenario: Legacy connector uses log function
- **WHEN** a connector calls `context.log("message")`
- **THEN** the message is forwarded to `logger.info("message")` and captured in the log system
