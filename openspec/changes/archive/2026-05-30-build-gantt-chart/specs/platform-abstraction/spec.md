## ADDED Requirements

### Requirement: GanttPlatform interface
The system SHALL define a `GanttPlatform` interface that abstracts all platform-specific concerns. Core logic and UI components SHALL depend only on this interface and never on platform-specific APIs directly.

#### Scenario: Platform injected at initialization
- **WHEN** the application starts in any environment
- **THEN** a concrete `GanttPlatform` implementation SHALL be created and passed to the core and UI layers

#### Scenario: Core code has no platform imports
- **WHEN** reviewing `gantt-core` source code
- **THEN** there SHALL be no imports from Obsidian API, Node.js, or browser-specific globals (except standard Web APIs shared across all targets)

### Requirement: IStorage interface
The platform SHALL provide an `IStorage` implementation with methods: `read(path: string): Promise<string | null>`, `write(path: string, data: string): Promise<void>`, `delete(path: string): Promise<void>`, `list(dir: string): Promise<string[]>`.

#### Scenario: Obsidian IStorage backed by Vault
- **WHEN** running in the Obsidian plugin
- **THEN** `read` and `write` SHALL operate on files within the vault's `.obsidian-gantt/` directory using the Obsidian Vault API

#### Scenario: Web IStorage backed by localStorage
- **WHEN** running in the web app
- **THEN** `read` and `write` SHALL use `localStorage` with path-mapped keys (e.g., `gantt:cache/my-jira.json`)

### Requirement: IConnectorLoader interface
The platform SHALL provide an `IConnectorLoader` with a `load(scriptPath: string): Promise<ConnectorModule>` method. `ConnectorModule` SHALL contain the `fetch` and `transform` functions exported by the connector script.

#### Scenario: Obsidian loads connector from vault file
- **WHEN** `load("connectors/jira.js")` is called in Obsidian
- **THEN** the plugin SHALL read the file from `vault/connectors/jira.js`, execute it in a sandboxed context, and return the exported functions

#### Scenario: Web loads connector from uploaded file
- **WHEN** `load("my-connector")` is called in the web app
- **THEN** the app SHALL retrieve the connector script content from localStorage and execute it

### Requirement: Theme interface
The platform SHALL provide a `theme` object with: `isDark(): boolean`, `onChange(callback): void`, and `variables: Record<string, string>` (CSS variable names to values).

#### Scenario: Dark theme detection in Obsidian
- **WHEN** the Obsidian theme is set to dark mode
- **THEN** `theme.isDark()` SHALL return `true` and `theme.variables` SHALL contain dark-appropriate color values

#### Scenario: Theme change callback
- **WHEN** the user switches themes
- **THEN** the `onChange` callback SHALL be invoked, allowing the UI to update accordingly

### Requirement: Fetch abstraction
The platform SHALL provide a `fetch` function compatible with the standard Web Fetch API. In Obsidian, this SHALL internally use `requestUrl` for cross-origin requests that would otherwise be blocked.

#### Scenario: Connector uses platform fetch
- **WHEN** a connector's `fetch()` function calls `context.request(url)`
- **THEN** the platform-specific fetch implementation handles the request appropriately for the environment

### Requirement: Package boundaries
The monorepo SHALL enforce the following dependency rules: `gantt-core` SHALL have zero dependencies (except TypeScript). `gantt-ui` SHALL depend only on `gantt-core`, `preact`, and `@preact/signals`. `obsidian-plugin` and `web-app` SHALL depend on `gantt-core` and `gantt-ui`, and SHALL NOT import each other.

#### Scenario: Core package builds independently
- **WHEN** building `gantt-core` in isolation
- **THEN** the build SHALL succeed without requiring any other packages or external runtime dependencies

#### Scenario: UI package uses platform interface
- **WHEN** `gantt-ui` needs to read or write data
- **THEN** it SHALL call methods on the injected `GanttPlatform` object rather than importing platform-specific code

### Requirement: Watcher interface
The platform MAY provide an optional `IWatcher` interface with a `onChange(callback: (path: string) => void)` method for detecting file changes. If absent, automatic refresh on file change SHALL be disabled.

#### Scenario: Obsidian platform provides watcher
- **WHEN** running in Obsidian
- **THEN** the `IWatcher` SHALL be provided, monitoring the `connectors/` directory for script changes

#### Scenario: Web platform omits watcher
- **WHEN** running in the web app
- **THEN** `IWatcher` SHALL be null and the user SHALL manually trigger refresh via a button
