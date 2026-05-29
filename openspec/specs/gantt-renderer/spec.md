## ADDED Requirements

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
