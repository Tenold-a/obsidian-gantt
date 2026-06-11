## ADDED Requirements

### Requirement: ConnectorContext.logger property
The `ConnectorContext` interface SHALL include a `logger` property of type `ILogger`. This logger SHALL be pre-configured with `source: "connector:<connectorId>"` so that all connector log entries are automatically tagged with the connector's identifier.

#### Scenario: Connector uses logger.info
- **WHEN** a connector calls `ctx.logger.info("Fetch completed", { taskCount: 42 })`
- **THEN** a log entry with `level: "info"`, `source: "connector:<id>"`, and `data: { taskCount: 42 }` is created

#### Scenario: Connector uses logger.debug for raw response
- **WHEN** a connector calls `ctx.logger.debug("Raw API response", { status: 200, firstItem: {...} })`
- **THEN** the response metadata and first item are recorded in the log system

#### Scenario: Connector uses logger.warn for retries
- **WHEN** a connector retries a failed request and calls `ctx.logger.warn("Retrying", { attempt: 2 })`
- **THEN** a warning entry is recorded with retry context

#### Scenario: Connector uses logger.error for failures
- **WHEN** a connector catches an error and calls `ctx.logger.error("Fetch failed", { error: "timeout" })`
- **THEN** an error entry is recorded with the failure context

### Requirement: Backward compatibility with ctx.log
The existing `log` property on `ConnectorContext` SHALL be preserved. It SHALL internally delegate to `logger.info(message)`, ensuring that existing connectors continue to work and their log output is captured in the structured log system.

#### Scenario: Old connector uses ctx.log
- **WHEN** an existing connector calls `ctx.log("Fetching data...")`
- **THEN** the message is recorded as an `info` level entry with `source: "connector:<id>"`

#### Scenario: ctx.log output appears in log file
- **WHEN** `ctx.log("test")` is called and logging is enabled
- **THEN** the message appears in the daily log file alongside structured log entries
