## Purpose

[brief description]
## Requirements
### Requirement: Preact-based component architecture
The rendering system SHALL use Preact with `@preact/signals` for state management. UI state SHALL be stored in signals rather than component-local state to enable fine-grained DOM updates without full component tree re-renders.

#### Scenario: Task bar position update
- **WHEN** a task's position changes (e.g., during drag)
- **THEN** only the affected task bar's DOM element SHALL update its `style.left` and `style.width` properties, without re-rendering sibling bars or parent components

#### Scenario: Signal subscription scoping
- **WHEN** a component subscribes to a signal via `computed()` or direct `.value` access within a component
- **THEN** the component SHALL only re-render when that specific signal's value changes

### Requirement: CSS gradient time grid
The system SHALL render the time grid background using CSS `repeating-linear-gradient` to generate day and week separator lines without creating DOM elements for each line.

#### Scenario: Grid renders for visible date range
- **WHEN** the timeline displays a date range of N days
- **THEN** the grid SHALL show vertical lines at day boundaries using a single CSS `background` property on the timeline container

#### Scenario: Week boundaries visually distinct
- **WHEN** the grid renders week boundaries
- **THEN** week-separator lines SHALL be thicker or darker than day-separator lines, using a second `repeating-linear-gradient` layer

### Requirement: Horizontal virtualization
The system SHALL only render task bars and timeline elements that fall within the visible horizontal viewport, plus a configurable buffer zone.

#### Scenario: Tasks outside viewport not rendered
- **WHEN** the timeline is scrolled to show days 20-70 of a 180-day range
- **THEN** only task bars that are visually within (or near) days 20-70 SHALL have DOM elements created

#### Scenario: Tasks enter viewport on scroll
- **WHEN** the user scrolls horizontally, bringing new days into view
- **THEN** task bars for the newly visible days SHALL be rendered within the next animation frame

#### Scenario: Visible range calculation
- **WHEN** computing which tasks to render
- **THEN** `visibleDayStart` SHALL be calculated as `floor(scrollLeft / dayWidth)` and `visibleDayCount` as `ceil(viewportWidth / dayWidth) + buffer`

### Requirement: Task bar rendering
Each task SHALL render as an absolutely-positioned bar within the timeline. Size and position SHALL be computed from the task's date fields mapped to pixel coordinates based on a configurable `dayWidth`.

#### Scenario: Bar position from dates
- **WHEN** a task has `startDate: "2026-06-01"` and `endDate: "2026-06-05"` with `dayWidth: 30px` and the timeline starts at June 1
- **THEN** the bar's `left` SHALL be `0px` and `width` SHALL be `120px` (4 days)

#### Scenario: Bar with no start or end date
- **WHEN** a task has no `startDate` or no `endDate`
- **THEN** the task SHALL render as a milestone marker (diamond or thin marker) instead of a rectangular bar, or be omitted from the timeline with a visual indicator

### Requirement: Timeline header
The timeline SHALL display a two-row header: a month row showing month names spanning their respective day ranges, and a day row showing individual day numbers.

#### Scenario: Month label spans correct width
- **WHEN** June has 30 days and `dayWidth: 30px`
- **THEN** the "June" header cell SHALL be `900px` wide

#### Scenario: Header scrolls horizontally with content
- **WHEN** the user scrolls the timeline horizontally
- **THEN** the header SHALL scroll in sync with the task bars, but remain vertically sticky (always visible)

### Requirement: Today indicator
The system SHALL display a vertical line at the current date position in the timeline, using a distinct color (e.g., red).

#### Scenario: Today line position
- **WHEN** today is June 10, the timeline starts at May 1, and `dayWidth: 30px`
- **THEN** the today line SHALL be positioned at `(June 10 - May 1) * 30px = 1200px` from the timeline start

#### Scenario: Today line outside visible range
- **WHEN** the current date is outside the visible or total timeline range
- **THEN** the today line SHALL NOT be rendered

### Requirement: Dark and light theme support
The system SHALL support both dark and light themes by reading CSS custom properties from the current Obsidian theme or the web app's theme configuration.

#### Scenario: Theme variables applied
- **WHEN** the active theme is dark
- **THEN** task bars, text, grid lines, and backgrounds SHALL use colors appropriate for a dark background

#### Scenario: Theme change detection
- **WHEN** the user switches between light and dark themes
- **THEN** the Gantt chart SHALL update its appearance without requiring a page reload

### Requirement: View group by switching
The system SHALL support grouping tasks by different criteria (person, project) by generating grouped row structures from the same underlying task data.

#### Scenario: Group by person
- **WHEN** the view is set to group by person
- **THEN** tasks SHALL be arranged in rows keyed by `personId`, with unassigned tasks collected under an "Unassigned" row

#### Scenario: Group by project
- **WHEN** the view is set to group by project
- **THEN** tasks SHALL be arranged in rows keyed by `projectId`, with tasks without a project collected under a "No Project" row

### Requirement: Clickable task URL in detail panel
The task detail panel SHALL render the task's `url` field as a clickable hyperlink that opens in the system's external browser.

#### Scenario: Task URL displayed as link
- **WHEN** a task has a non-empty `url` field
- **THEN** the detail panel SHALL render a clickable link element with the URL as the href

#### Scenario: Click opens external browser
- **WHEN** a user clicks the task URL link
- **THEN** the system SHALL open the URL in the external browser (via `window.open` or platform equivalent)

#### Scenario: Task without URL
- **WHEN** a task has no `url` field or an empty URL
- **THEN** the detail panel SHALL display "—" or "No link" for the URL field

### Requirement: Associated task list in project detail panel
The project detail panel SHALL display a list of all tasks associated with the selected project, showing each task's title and allowing click-through navigation to the task detail.

#### Scenario: Project with associated tasks
- **WHEN** a project is selected and has associated tasks
- **THEN** the project detail panel SHALL list all associated tasks with their titles

#### Scenario: Click task name navigates to task detail
- **WHEN** a user clicks a task name in the project's task list
- **THEN** the selection SHALL change to that task, opening the task detail panel

#### Scenario: Project with no tasks
- **WHEN** a project is selected but has no associated tasks
- **THEN** the task list section SHALL display "No tasks" or equivalent

#### Scenario: Task list shows task count
- **WHEN** the associated task list is displayed
- **THEN** the section header SHALL show the count of associated tasks

### Requirement: Status badge in detail panels
Both task and project detail panels SHALL display a color-coded status badge showing the current status value.

#### Scenario: Status badge colors
- **WHEN** an entity has a status
- **THEN** the badge SHALL use the following colors: pending = gray (#888), in-progress = blue (#2196f3), cancelled = red (#e53935), pending-online = orange (#fb8c00), online = teal (#00897b), completed = green (#4caf50)

#### Scenario: Status dropdown for changing status
- **WHEN** viewing a task or project in the detail panel
- **THEN** a dropdown selector SHALL allow changing the status to any of the six values

### Requirement: Delete button in detail panels
The task and project detail panels SHALL each include a delete button that triggers a confirmation dialog.

#### Scenario: Delete button in task detail
- **WHEN** a task is selected in the detail panel
- **THEN** a delete button SHALL be visible, typically in the header area alongside the close button

#### Scenario: Delete button in project detail
- **WHEN** a project is selected in the detail panel
- **THEN** a delete button SHALL be visible, typically in the header area alongside the edit and close buttons

