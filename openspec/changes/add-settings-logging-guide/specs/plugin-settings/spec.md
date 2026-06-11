## ADDED Requirements

### Requirement: Plugin settings tab registration
The Obsidian plugin SHALL register a `PluginSettingTab` named "Gantt Chart" accessible from Obsidian's Settings → Community Plugins → Gantt Chart.

#### Scenario: Settings tab appears in Obsidian
- **WHEN** the plugin is loaded and enabled
- **THEN** a settings tab labeled "Gantt Chart" SHALL appear in the plugin's settings section

#### Scenario: Settings tab is accessible via gear icon
- **WHEN** the user clicks the gear icon next to "Gantt Chart" in the Community Plugins list
- **THEN** the settings tab SHALL open

### Requirement: Holiday configuration section
The settings tab SHALL include a "Holidays" section with: a toggle for weekend marking (`weekendsEnabled`), a toggle for holiday marking (`holidaysEnabled`), a list of holiday dates (休) with remove buttons, a list of makeup workday dates (班) with remove buttons, an "Import .ics" file button, and a URL input with "Fetch" button for remote ICS files.

#### Scenario: Toggle weekend marking
- **WHEN** the user unchecks "Mark weekends as non-working"
- **THEN** `weekendsEnabled` is set to `false` and weekend columns no longer show shading

#### Scenario: Toggle holiday marking
- **WHEN** the user unchecks "Highlight imported holidays"
- **THEN** `holidaysEnabled` is set to `false` and holiday date markers are hidden

#### Scenario: Import ICS file
- **WHEN** the user clicks "Import .ics" and selects a valid ICS file
- **THEN** parsed holiday dates and makeup workdays are merged into the existing lists (deduplicated)

#### Scenario: Remove a holiday date
- **WHEN** the user clicks the remove button next to a holiday date
- **THEN** that date is removed from the list and the UI updates immediately

#### Scenario: Fetch ICS from URL
- **WHEN** the user enters a URL and clicks "Fetch"
- **THEN** the plugin fetches the URL, parses ICS content, classifies events, and merges dates

### Requirement: Connector management section
The settings tab SHALL include a "Connectors" section that scans the vault's `connectors/` directory for `.js` files, lists discovered connectors with their name, script path, and enabled status, and provides edit/delete actions. Each connector entry SHALL support inline form editing with fields for `id`, `name`, `script`, `refreshInterval`, and `config` (JSON textarea).

#### Scenario: Scan discovers connector scripts
- **WHEN** the settings tab opens
- **THEN** the plugin scans `<vault>/connectors/` for `.js` files and lists them

#### Scenario: No connectors found
- **WHEN** no `.js` files exist in the `connectors/` directory
- **THEN** the section displays "No connectors found" with a hint to place connector scripts in the connectors/ directory

#### Scenario: Edit connector configuration
- **WHEN** the user clicks "Edit" on a connector
- **THEN** an inline form expands showing all editable fields pre-filled with current values

#### Scenario: Save connector configuration
- **WHEN** the user modifies fields and clicks "Save"
- **THEN** the updated config is written to `connectors/<id>.json` and the form collapses

#### Scenario: Invalid JSON in config field
- **WHEN** the user enters invalid JSON in the `config` textarea and clicks "Save"
- **THEN** an inline error message is displayed and the config is not saved

#### Scenario: Enable connector for a view
- **WHEN** the user toggles a connector to "enabled"
- **THEN** the connector ID is added to the view's `connectors` list

### Requirement: Log settings section
The settings tab SHALL include a "Logging" section with: a toggle to enable/disable logging, a dropdown for minimum log level (Debug, Info, Warn, Error), and a numeric input for retention days (default 30).

#### Scenario: Enable logging
- **WHEN** the user checks "Enable logging"
- **THEN** the plugin begins writing log entries to `obsidian-gantt-data/logs/`

#### Scenario: Disable logging
- **WHEN** the user unchecks "Enable logging"
- **THEN** the plugin stops writing log entries; existing log files are preserved

#### Scenario: Set log level filter
- **WHEN** the user sets log level to "Warn"
- **THEN** only `warn` and `error` level entries are recorded; `debug` and `info` entries are discarded

#### Scenario: Logs pruned on startup
- **WHEN** the plugin loads and logging is enabled
- **THEN** log files older than `retentionDays` SHALL be deleted

### Requirement: Plugin settings persistence
All plugin settings SHALL be persisted via Obsidian's `loadData()` / `saveData()` mechanism into the plugin's `data.json` file. Changes SHALL be saved immediately on each user interaction (no explicit "Save" button for the overall settings page).

#### Scenario: Settings survive plugin reload
- **WHEN** the plugin is disabled and re-enabled
- **THEN** all previously configured settings (holidays, connector configs, log settings) are restored

#### Scenario: Settings are vault-specific
- **WHEN** the plugin is used in a different vault
- **THEN** that vault has its own independent settings stored in its own `.obsidian/plugins/obsidian-gantt/data.json`

### Requirement: Holiday config migration from view settings
On first load after upgrading, the plugin SHALL detect `holidayConfig` entries in existing `settings/<view-id>.json` files, merge them (union of all dates) into the new plugin-level settings, and remove the `holidayConfig` key from each view settings file.

#### Scenario: Single view migration
- **WHEN** one view has `holidayConfig` with holidays [2026-01-01, 2026-02-10] and the plugin is upgraded
- **THEN** those dates appear in the plugin-level holiday settings and the view file no longer contains `holidayConfig`

#### Scenario: Multi-view union merge
- **WHEN** view A has holidays [2026-01-01] and view B has holidays [2026-02-10]
- **THEN** the plugin-level settings contain both [2026-01-01, 2026-02-10]

#### Scenario: Migration is idempotent
- **WHEN** migration has already run and the plugin restarts
- **THEN** no duplicate dates are added and existing view files are not modified again

### Requirement: Toolbar Calendar button removal
The "Calendar" button in the Gantt chart toolbar SHALL be removed. Holiday configuration SHALL only be accessible from the plugin settings tab.

#### Scenario: Calendar button absent after upgrade
- **WHEN** the plugin is loaded after the upgrade
- **THEN** the Gantt chart toolbar no longer shows a Calendar button
