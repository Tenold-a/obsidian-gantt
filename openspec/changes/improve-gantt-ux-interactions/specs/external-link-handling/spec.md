## ADDED Requirements

### Requirement: External links open in system browser
The system SHALL open external URLs from project details and task details in the system default browser, not within Obsidian's WebView.

#### Scenario: Key link click opens system browser
- **WHEN** a user clicks a key link in the project detail panel
- **THEN** the URL SHALL open in the system default browser

#### Scenario: Task URL click opens system browser
- **WHEN** a user clicks the task URL link in the task detail panel
- **THEN** the URL SHALL open in the system default browser

#### Scenario: Link click does not navigate Obsidian view
- **WHEN** a user clicks an external link in the detail panel
- **THEN** the current Obsidian view SHALL NOT navigate away from the Gantt chart

### Requirement: Platform bridge openExternal method
The `GanttPlatform` interface SHALL expose an `openExternal(url: string)` method that each platform adapter implements appropriately.

#### Scenario: Obsidian plugin uses Electron shell
- **WHEN** running as an Obsidian plugin, calling `openExternal("https://example.com")`
- **THEN** the URL SHALL be opened using Electron's `shell.openExternal`

#### Scenario: Standalone web uses window.open
- **WHEN** running in standalone web mode, calling `openExternal("https://example.com")`
- **THEN** the URL SHALL be opened using `window.open(url, '_blank')`

### Requirement: All detail panel links use platform bridge
Every clickable link rendered in the detail panel (key links, task URL) SHALL use the `openExternal` platform method instead of relying on default `<a>` behavior.

#### Scenario: Prevent default link navigation
- **WHEN** a user clicks any `<a>` link in the detail panel
- **THEN** the default browser navigation SHALL be prevented and `platform.openExternal(href)` SHALL be called instead
