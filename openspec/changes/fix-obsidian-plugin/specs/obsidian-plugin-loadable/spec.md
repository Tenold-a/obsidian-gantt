## ADDED Requirements

### Requirement: Plugin registers as ItemView

The plugin SHALL extend Obsidian's `ItemView` class so that `registerView()` accepts it and Obsidian can manage its lifecycle.

#### Scenario: Plugin loads in Obsidian without errors
- **WHEN** the plugin is placed in `.obsidian/plugins/obsidian-gantt/` and Obsidian starts
- **THEN** Obsidian loads `main.js` without throwing errors
- **AND** `GanttView` passes type checks as a valid `ItemView` subclass

#### Scenario: View lifecycle methods work
- **WHEN** Obsidian opens the Gantt view via ribbon icon or command
- **THEN** `onOpen()` is called and renders the GanttChart component into the container element
- **AND** `onClose()` is called when the view is closed

### Requirement: Plugin registers ribbon icon and command

The plugin SHALL register a ribbon icon with the `bar-chart-2` icon and a command `Open Gantt Chart` that opens the Gantt view when invoked.

#### Scenario: Ribbon icon activates the view
- **WHEN** user clicks the Gantt chart ribbon icon in the Obsidian sidebar
- **THEN** a new leaf appears in the right pane showing the Gantt chart view

#### Scenario: Command palette activates the view
- **WHEN** user opens the command palette and selects "Open Gantt Chart"
- **THEN** the Gantt view opens in the right pane

### Requirement: VaultAdapter type is exported from storage module

The `VaultAdapter` interface in `storage.ts` SHALL be exported so that `connector-loader.ts` can import and use it.

#### Scenario: Connector loader imports VaultAdapter
- **WHEN** `connector-loader.ts` is compiled
- **THEN** the `import type { VaultAdapter } from './storage'` statement resolves without TypeScript errors

### Requirement: Storage write creates parent directories

The storage adapter's `write` method SHALL ensure parent directories exist before writing a file, using Obsidian's vault adapter capabilities.

#### Scenario: Write to nested path creates directories
- **WHEN** `storage.write('views/demo.json', data)` is called and `.obsidian-gantt/views/` does not exist
- **THEN** the parent directory `.obsidian-gantt/views/` is created automatically by the vault adapter
- **AND** the file is written successfully

#### Scenario: Write to existing directory succeeds
- **WHEN** `storage.write('views/demo.json', data)` is called and `.obsidian-gantt/views/` already exists
- **THEN** the file is written successfully without errors

### Requirement: CSS styles are loaded by Obsidian

The plugin SHALL provide a `styles.css` file at the plugin root so that Obsidian auto-loads it when the plugin is enabled.

#### Scenario: Obsidian loads plugin styles
- **WHEN** the plugin is enabled in Obsidian
- **THEN** `styles.css` from the plugin root is loaded into the DOM
- **AND** CSS custom properties (`--gantt-grid-line-day`, etc.) are available

#### Scenario: Gantt chart renders with styling
- **WHEN** the Gantt view is opened
- **THEN** task bars, grid lines, header labels, and panels have visual styling applied

### Requirement: Build output is at plugin root

The build script SHALL place `main.js` at the plugin package root directory so that Obsidian can find it alongside `manifest.json` and `styles.css`.

#### Scenario: Build produces flat plugin structure
- **WHEN** `npm run build -w packages/obsidian-plugin` is executed
- **THEN** `packages/obsidian-plugin/main.js` exists
- **AND** `packages/obsidian-plugin/manifest.json` exists
- **AND** `packages/obsidian-plugin/styles.css` exists

#### Scenario: manifest.json main field matches output
- **WHEN** `manifest.json` is read by Obsidian
- **THEN** the `main` field is not present (Obsidian defaults to `main.js` in plugin root)

### Requirement: Empty state renders when no views configured

The plugin SHALL render the GanttChart component which shows an empty state message when no view is loaded.

#### Scenario: First launch shows empty state
- **WHEN** the plugin is loaded for the first time with no configured views or connectors
- **THEN** the UI displays a "No view selected" message without errors

### Requirement: Timeline dynamically renders visible tick marks

The Gantt chart timeline SHALL render only the tick marks and date labels for the currently visible viewport (plus buffers), and SHALL update them as the user scrolls horizontally.

#### Scenario: Header labels track horizontal scroll
- **WHEN** the user scrolls the timeline horizontally
- **THEN** the month and day labels in the TimeHeader update to reflect the new visible date range
- **AND** the labels remain aligned with the grid lines below them

#### Scenario: Grid lines cover visible viewport
- **WHEN** the timeline is rendered at any scroll position
- **THEN** the TimelineGrid is positioned to cover `viewportWidth + 2 * bufferPx` pixels centered on the visible area
- **AND** grid lines repeat at day and week intervals aligned to absolute date boundaries

#### Scenario: Header and grid share alignment origin
- **WHEN** the timeline renders
- **THEN** both TimeHeader and TimelineGrid compute their start position using the same formula: `Math.floor((bodyOriginPx + scrollLeft - GRID_BUFFER_PX) / DAY_WIDTH) * DAY_WIDTH`
- **AND** header labels and grid lines start at identical body-relative pixels

#### Scenario: Shift+wheel scrolls horizontally
- **WHEN** the user holds Shift and uses the mouse wheel over the timeline
- **THEN** the timeline scrolls horizontally instead of vertically

### Requirement: Header renders outside scroll container

The TimeHeader SHALL be placed outside the scroll container in a separate `overflow: hidden` wrapper, using `translateX(gridLeft - scrollLeft)` to track the body scroll position. It SHALL NOT use `position: sticky`.

#### Scenario: Header position is independent of scroll container
- **WHEN** the timeline body scrolls
- **THEN** the header remains at a fixed vertical position above the body
- **AND** the header content's `translateX` tracks `gridLeft - scrollLeft` to align with grid lines

### Requirement: Task detail sidebar on selection

When a task bar is clicked, a detail panel SHALL appear on the right side of the Gantt view, displaying the selected task's metadata.

#### Scenario: Detail panel opens on task click
- **WHEN** the user clicks a task bar in either the person or project pane
- **THEN** a 220px detail panel appears on the right side showing the task's title, start date, end date, progress, assigned person, project, dependencies, tags, and source info
- **AND** the `UnassignedPanel` is hidden while the detail panel is visible

#### Scenario: Detail panel closes
- **WHEN** the user clicks the × button in the detail panel header, presses Escape, or clicks "Clear Selection" in the toolbar
- **THEN** the detail panel disappears
- **AND** the `UnassignedPanel` reappears in the upper right section

#### Scenario: Progress bar reflects task completion
- **WHEN** a task with progress = 0.5 is selected
- **THEN** the detail panel shows a progress bar filled to 50% with "50%" label
- **AND** the fill color is blue for in-progress tasks and green for completed (progress = 1.0) tasks

#### Scenario: Missing fields show placeholder
- **WHEN** a selected task has no start date, end date, person, project, or dependencies
- **THEN** the corresponding fields display "—" instead of empty space
