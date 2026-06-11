## MODIFIED Requirements

### Requirement: GanttPlatform interface
The system SHALL define a `GanttPlatform` interface that abstracts all platform-specific concerns. Core logic and UI components SHALL depend only on this interface and never on platform-specific APIs directly. The interface SHALL include a `createLogger(source: string): ILogger` factory method for obtaining platform-appropriate logger instances.

#### Scenario: Platform injected at initialization
- **WHEN** the application starts in any environment
- **THEN** a concrete `GanttPlatform` implementation SHALL be created and passed to the core and UI layers

#### Scenario: Core code has no platform imports
- **WHEN** reviewing `gantt-core` source code
- **THEN** there SHALL be no imports from Obsidian API, Node.js, or browser-specific globals (except standard Web APIs shared across all targets)

#### Scenario: Platform provides logger factory
- **WHEN** any layer calls `platform.createLogger("source-name")`
- **THEN** it receives an `ILogger` instance that writes entries tagged with the given source name
