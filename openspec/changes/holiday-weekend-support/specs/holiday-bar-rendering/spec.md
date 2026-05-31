## ADDED Requirements

### Requirement: Task bar non-working day overlay
When a task bar spans one or more non-working days (weekends or holidays, per configuration), the bar SHALL render overlay elements on the portions that fall on non-working days. Each overlay SHALL cover the exact pixel range of the non-working-day block within the bar. Overlays SHALL use a striped/hatched pattern via CSS `repeating-linear-gradient` at a 45-degree angle.

#### Scenario: Bar crossing a weekend
- **WHEN** a task bar spans from Friday ("2026-06-05") to Monday ("2026-06-08") with `dayWidth: 30px` and weekends enabled
- **THEN** the bar SHALL render a striped overlay covering the Saturday-Sunday portion (pixels 30-89 from the bar's left edge)

#### Scenario: Bar entirely on working days
- **WHEN** a task bar spans Monday to Friday only, with no holidays on those dates
- **THEN** the bar SHALL NOT render any non-working day overlay

#### Scenario: Bar crossing a holiday
- **WHEN** a task bar spans a Thursday that is in the holiday set, with holidays enabled
- **THEN** the bar SHALL render a striped overlay covering the Thursday portion

#### Scenario: Overlay does not interfere with pointer events
- **WHEN** a non-working day overlay is rendered on a task bar
- **THEN** the overlay SHALL have `pointer-events: none` so drag and click interactions pass through to the bar

#### Scenario: Overlay uses theme-compatible colors
- **WHEN** a non-working day overlay is rendered
- **THEN** the stripe pattern SHALL use `var(--gantt-bar-holiday-stripe, rgba(255,255,255,0.4))` for the stripe color

#### Scenario: Bar with no non-working days when config disabled
- **WHEN** both `weekendsEnabled` and `holidaysEnabled` are `false`
- **THEN** no task bar SHALL render non-working day overlays, regardless of date ranges

### Requirement: Contiguous block detection
The system SHALL detect contiguous blocks of non-working days within a task's date range. Each contiguous block SHALL produce one overlay element. For example, a bar spanning two weekends (Sat-Sun, 5-day gap, Sat-Sun) SHALL produce two overlay elements.

#### Scenario: Two separate weekend blocks
- **WHEN** a task bar spans 14 days including two weekends (days 1-5 working, days 6-7 weekend, days 8-12 working, days 13-14 weekend)
- **THEN** the bar SHALL render two separate overlay elements, one for days 6-7 and one for days 13-14

#### Scenario: Adjacent holiday and weekend merge into one block
- **WHEN** a Friday is a holiday and Saturday-Sunday are weekends, all enabled
- **THEN** Friday-Sunday SHALL be treated as one contiguous block producing one overlay element
