## MODIFIED Requirements

### Requirement: GanttPlatform interface
The system SHALL define a `GanttPlatform` interface that abstracts all platform-specific concerns. Core logic and UI components SHALL depend only on this interface and never on platform-specific APIs directly. For connector scripts, the platform SHALL provide a `readFile` capability and a `parseCSV` capability via the `ConnectorContext`.

#### Scenario: Platform injected at initialization
- **WHEN** the application starts in any environment
- **THEN** a concrete `GanttPlatform` implementation SHALL be created and passed to the core and UI layers

#### Scenario: Core code has no platform imports
- **WHEN** reviewing `gantt-core` source code
- **THEN** there SHALL be no imports from Obsidian API, Node.js, or browser-specific globals (except standard Web APIs shared across all targets)

### Requirement: IConnectorLoader interface
The platform SHALL provide an `IConnectorLoader` with a `load(scriptPath: string): Promise<ConnectorModule>` method. `ConnectorModule` SHALL contain the `fetch` and `transform` functions exported by the connector script. When creating the `ConnectorContext` for a connector execution, the platform SHALL include `readFile` and `parseCSV` implementations.

#### Scenario: Obsidian loads connector from vault file
- **WHEN** `load("connectors/csv-connector.js")` is called in Obsidian
- **THEN** the plugin SHALL read the file from the vault, execute it in a sandboxed context, and return the exported functions
- **AND** the `ConnectorContext` passed to the connector SHALL include `readFile` backed by the Vault adapter and `parseCSV` backed by the core CSV parser

#### Scenario: Web loads connector from uploaded file
- **WHEN** `load("my-connector")` is called in the web app
- **THEN** the app SHALL retrieve the connector script content from localStorage and execute it
- **AND** the `ConnectorContext` passed to the connector SHALL include `readFile` backed by the fetch API and `parseCSV` backed by the core CSV parser

### Requirement: ConnectorContext factory provides file reading
Each platform's `ConnectorContext` factory function SHALL provide a `readFile` implementation appropriate for the environment.

#### Scenario: Obsidian readFile reads from vault
- **WHEN** a connector calls `ctx.readFile("data/projects.csv")` in Obsidian
- **THEN** the platform SHALL use the Obsidian Vault adapter to read the file relative to the vault root

#### Scenario: Web readFile fetches from URL
- **WHEN** a connector calls `ctx.readFile("data/projects.csv")` in the web app
- **THEN** the platform SHALL use the Fetch API to retrieve the file content

### Requirement: ConnectorContext factory provides CSV parsing
Each platform's `ConnectorContext` factory function SHALL provide a `parseCSV` implementation that delegates to the core CSV parser.

#### Scenario: Obsidian parseCSV uses core parser
- **WHEN** a connector calls `ctx.parseCSV(text)` in Obsidian
- **THEN** the platform SHALL call the `parseCSV` function from `@obsidian-gantt/core` and return the result

#### Scenario: Web parseCSV uses core parser
- **WHEN** a connector calls `ctx.parseCSV(text)` in the web app
- **THEN** the platform SHALL call the `parseCSV` function from `@obsidian-gantt/core` and return the result
