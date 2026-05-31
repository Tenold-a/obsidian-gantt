## MODIFIED Requirements

### Requirement: CSS gradient time grid
The system SHALL render the time grid background using CSS `repeating-linear-gradient` to generate day and week separator lines without creating DOM elements for each line. When holiday/weekend configuration is enabled, additional gradient layers SHALL overlay non-working day columns with semi-transparent shading.

#### Scenario: Grid renders for visible date range
- **WHEN** the timeline displays a date range of N days
- **THEN** the grid SHALL show vertical lines at day boundaries using a single CSS `background` property on the timeline container

#### Scenario: Week boundaries visually distinct
- **WHEN** the grid renders week boundaries
- **THEN** week-separator lines SHALL be thicker or darker than day-separator lines, using a second `repeating-linear-gradient` layer

#### Scenario: Weekend shading via gradient layer
- **WHEN** weekends are enabled in the holiday configuration
- **THEN** the grid background SHALL include an additional `repeating-linear-gradient` layer that shades Saturday and Sunday columns using `var(--gantt-weekend-bg, rgba(0,0,0,0.08))`

#### Scenario: Holiday shading via gradient layer
- **WHEN** holidays are enabled and the visible date range includes imported holiday dates
- **THEN** the grid background SHALL include an additional gradient layer with explicit color stops shading each holiday date column using `var(--gantt-holiday-bg, rgba(255,0,0,0.10))`

#### Scenario: No holiday layers when disabled
- **WHEN** both weekends and holidays are disabled in configuration
- **THEN** the grid background SHALL contain only the day-line and week-line gradient layers (current behavior)

### Requirement: Timeline header
The timeline SHALL display a two-row header: a month row showing month names spanning their respective day ranges, and a day row showing individual day numbers. Non-working days (weekends and holidays) SHALL be visually distinguished in the day row.

#### Scenario: Month label spans correct width
- **WHEN** June has 30 days and `dayWidth: 30px`
- **THEN** the "June" header cell SHALL be `900px` wide

#### Scenario: Header scrolls horizontally with content
- **WHEN** the user scrolls the timeline horizontally
- **THEN** the header SHALL scroll in sync with the task bars, but remain vertically sticky (always visible)

#### Scenario: Weekend day labels styled distinctly
- **WHEN** weekends are enabled and a day in the header is Saturday or Sunday
- **THEN** the day label SHALL use `var(--gantt-weekend-text, inherit)` for text color

#### Scenario: Holiday day labels styled distinctly
- **WHEN** holidays are enabled and a day is in the holiday set
- **THEN** the day label SHALL use `var(--gantt-holiday-text, #c62828)` for text color

### Requirement: Task bar rendering
Each task SHALL render as an absolutely-positioned bar within the timeline. Size and position SHALL be computed from the task's date fields mapped to pixel coordinates based on a configurable `dayWidth`. When a bar spans non-working days, striped overlay elements SHALL be rendered on the non-working portions.

#### Scenario: Bar position from dates
- **WHEN** a task has `startDate: "2026-06-01"` and `endDate: "2026-06-05"` with `dayWidth: 30px` and the timeline starts at June 1
- **THEN** the bar's `left` SHALL be `0px` and `width` SHALL be `120px` (4 days)

#### Scenario: Bar with no start or end date
- **WHEN** a task has no `startDate` or no `endDate`
- **THEN** the task SHALL render as a milestone marker (diamond or thin marker) instead of a rectangular bar, or be omitted from the timeline with a visual indicator

#### Scenario: Bar crossing non-working days shows overlay
- **WHEN** a task bar spans a date range that includes non-working days (weekends or holidays, per configuration)
- **THEN** the bar SHALL render absolutely-positioned overlay divs covering the pixel range of each contiguous non-working-day block, with a striped pattern using CSS `repeating-linear-gradient` at 45 degrees and `var(--gantt-bar-holiday-stripe, rgba(255,255,255,0.4))`
