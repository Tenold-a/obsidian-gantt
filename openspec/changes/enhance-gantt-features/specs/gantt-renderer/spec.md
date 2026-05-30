## ADDED Requirements

### Requirement: Lane-aware task bar positioning
TaskBar components SHALL accept optional `laneIndex` and `laneCount` properties. When `laneCount > 1`, the bar's vertical position SHALL be offset by `laneIndex * LANE_OFFSET` pixels from the base row position, where `LANE_OFFSET` SHALL default to 12px. When `laneCount` is 1 or undefined, the bar SHALL render at its original un-offset position (backward compatible). Bars SHALL partially overlap vertically — the small offset exposes the edge of each underlying bar while keeping the stack visually compact.

#### Scenario: Single-lane bar unchanged
- **WHEN** a TaskBar has `laneCount: 1` or no laneCount
- **THEN** the bar SHALL render at its original vertical position within the group row

#### Scenario: Multi-lane bar uses small offset
- **WHEN** a TaskBar has `laneIndex: 1` and `laneCount: 3` with `LANE_OFFSET = 12`
- **THEN** the bar SHALL render 12px below the base row position (not a full ROW_HEIGHT)

### Requirement: Group row height driven by lane count with partial overlap
The timeline SHALL compute each group's visual row height as `ROW_HEIGHT + (laneCount - 1) * LANE_OFFSET` where `LANE_OFFSET` defaults to 12px. Groups without overlapping bars SHALL remain at `ROW_HEIGHT` (40px).

#### Scenario: Height for two-lane group
- **WHEN** a group's tasks require 2 lanes
- **THEN** the group's allocated vertical space SHALL be `40 + 12 = 52px`

#### Scenario: Height for three-lane group
- **WHEN** a group's tasks require 3 lanes
- **THEN** the group's allocated vertical space SHALL be `40 + 24 = 64px`

#### Scenario: Cumulative Y offset for subsequent groups
- **WHEN** group 0 has 2 lanes (52px) and group 1 has 1 lane (40px)
- **THEN** group 1's row background and bars SHALL start at Y = 52px (not 40px)

### Requirement: Key date markers on timeline
The timeline SHALL render small diamond-shaped markers for each project's key dates at the corresponding date pixel positions. Markers SHALL be 8x8 pixel rotated squares positioned within the project's group row area.

#### Scenario: Key date marker renders at correct position
- **WHEN** a project has a key date at "2026-07-15" and the timeline math places that date at pixel 6000 (body-relative)
- **THEN** a diamond marker SHALL render at `left: 6000px` within the project's row

#### Scenario: Multiple key dates for one project
- **WHEN** a project has 3 key dates
- **THEN** each SHALL render as a separate diamond marker at its respective date position

#### Scenario: Key date outside visible range
- **WHEN** a key date falls outside the visible viewport range
- **THEN** its marker SHALL NOT be rendered (follows horizontal virtualization)

## MODIFIED Requirements

### Requirement: Task bar rendering
Each task SHALL render as an absolutely-positioned bar within the timeline. Size and position SHALL be computed from the task's date fields mapped to pixel coordinates based on a configurable `dayWidth`. When multiple task bars overlap within the same group row, they SHALL be assigned to distinct vertical lanes to remain visually distinguishable.

#### Scenario: Bar position from dates
- **WHEN** a task has `startDate: "2026-06-01"` and `endDate: "2026-06-05"` with `dayWidth: 30px` and the timeline starts at June 1
- **THEN** the bar's `left` SHALL be `0px` and `width` SHALL be `120px` (4 days)

#### Scenario: Bar with no start or end date
- **WHEN** a task has no `startDate` or no `endDate`
- **THEN** the task SHALL render as a milestone marker (diamond or thin marker) instead of a rectangular bar, or be omitted from the timeline with a visual indicator

#### Scenario: Overlapping bars in different lanes
- **WHEN** two tasks in the same group have overlapping date ranges
- **THEN** each bar SHALL be vertically offset into a distinct lane so both remain fully visible
