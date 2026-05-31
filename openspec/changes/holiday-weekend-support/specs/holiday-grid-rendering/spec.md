## ADDED Requirements

### Requirement: Non-working day column background on grid
The timeline grid SHALL render non-working day columns with a semi-transparent background overlay using CSS `linear-gradient` with hard color stops. A unified gradient SHALL cover both weekend days and imported holidays, treating them identically. Makeup workdays SHALL render with the normal (transparent) background. Each non-working→working transition SHALL use double stops at the same pixel position to produce sharp column boundaries.

#### Scenario: Weekend columns shaded when enabled
- **WHEN** `weekendsEnabled` is `true` and the visible date range includes Saturday and Sunday (not makeup workdays)
- **THEN** the grid SHALL display a shaded overlay with sharp edges on Saturday and Sunday columns

#### Scenario: Weekday holiday shaded same as weekend
- **WHEN** `holidaysEnabled` is `true` and a Tuesday is in `holidayDates`
- **THEN** the grid SHALL shade that Tuesday column with the same color as weekend columns

#### Scenario: Makeup workday has no shading
- **WHEN** a Saturday is in `makeupWorkdays` with holidays enabled
- **THEN** the grid SHALL NOT shade that Saturday column (normal working-day background)

#### Scenario: Hard stop boundaries between columns
- **WHEN** a non-working day column is adjacent to a working day column
- **THEN** the boundary SHALL be a sharp edge (no gradient blending), achieved by placing two color stops at the same pixel position

#### Scenario: No shading when both toggles disabled
- **WHEN** both `weekendsEnabled` and `holidaysEnabled` are `false`
- **THEN** the grid SHALL NOT display any non-working day shading

### Requirement: CSS custom property for non-working day background
The shading color SHALL use `var(--gantt-weekend-bg, rgba(0,0,0,0.07))` in light theme and `var(--gantt-weekend-bg, rgba(255,255,255,0.08))` in dark theme, ensuring visibility in both themes.

#### Scenario: Light theme background
- **WHEN** the active theme is light
- **THEN** non-working day columns SHALL use `rgba(0, 0, 0, 0.07)` as the default background color

#### Scenario: Dark theme background
- **WHEN** the active theme is dark
- **THEN** non-working day columns SHALL use `rgba(255, 255, 255, 0.08)` as the default background color

### Requirement: Non-working day styling in timeline header
The day row in the timeline header SHALL visually distinguish date types. Holiday dates SHALL display the day number with a blue "休" superscript indicator. Makeup workdays SHALL display the day number with a red "班" superscript indicator. Regular weekends SHALL use muted text color. Regular weekdays SHALL use normal text color.

#### Scenario: Holiday indicator
- **WHEN** a day label represents a date in `holidayDates` with holidays enabled
- **THEN** the label SHALL show the day number followed by a blue "休" indicator in superscript

#### Scenario: Makeup workday indicator
- **WHEN** a day label represents a date in `makeupWorkdays` with holidays enabled
- **THEN** the label SHALL show the day number followed by a red "班" indicator in superscript

#### Scenario: Regular weekend label
- **WHEN** a day label represents a weekend day not in `makeupWorkdays`
- **THEN** the label SHALL use `var(--gantt-weekend-text)` color without an indicator

#### Scenario: Regular weekday label
- **WHEN** a day label represents a Monday-Friday not in `holidayDates`
- **THEN** the label SHALL use default text color without an indicator

### Requirement: Grid overlay performance
The non-working day shading SHALL NOT create DOM elements for each day column. It SHALL use a single CSS `linear-gradient` with explicit color stops computed from the visible date range only, recalculated on scroll.

#### Scenario: Gradient recomputed on scroll
- **WHEN** the user scrolls horizontally, changing the visible date range
- **THEN** the gradient color stops SHALL be recalculated for the new visible range plus buffer
