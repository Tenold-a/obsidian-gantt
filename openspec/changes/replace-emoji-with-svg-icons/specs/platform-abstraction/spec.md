## MODIFIED Requirements

### Requirement: GanttPlatform interface
The system SHALL define a `GanttPlatform` interface that abstracts all platform-specific concerns. Core logic and UI components SHALL depend only on this interface and never on platform-specific APIs directly.

#### Scenario: Platform injected at initialization
- **WHEN** the application starts in any environment
- **THEN** a concrete `GanttPlatform` implementation SHALL be created and passed to the core and UI layers

#### Scenario: Core code has no platform imports
- **WHEN** reviewing `gantt-core` source code
- **THEN** there SHALL be no imports from Obsidian API, Node.js, or browser-specific globals (except standard Web APIs shared across all targets)

---

### Requirement: Platform icon rendering
The platform SHALL provide a `setIcon(el: HTMLElement, name: string): void` method. Obsidian platform implementations SHALL delegate to `Obsidian.setIcon()`. Web platform implementations SHALL display the icon name as fallback text. This method enables UI components to render SVG icons without platform-specific imports.

#### Scenario: Obsidian platform renders Lucide SVG
- **WHEN** `platform.setIcon(element, "pencil")` is called in the Obsidian plugin
- **THEN** the element's innerHTML SHALL be replaced with the Lucide pencil SVG markup

#### Scenario: Web platform shows fallback text
- **WHEN** `platform.setIcon(element, "pencil")` is called in the web app
- **THEN** the element's textContent SHALL be set to a visible fallback representation

#### Scenario: UI package calls setIcon through platform
- **WHEN** a `gantt-ui` component needs to render an icon
- **THEN** it SHALL call `platform.setIcon()` and SHALL NOT import any icon library directly
