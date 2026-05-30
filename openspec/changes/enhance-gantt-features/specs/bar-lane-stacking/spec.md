## ADDED Requirements

### Requirement: Overlap detection within groups
The system SHALL detect overlapping task bars within each group row. Two task bars overlap when their date ranges intersect: `taskA.startDate <= taskB.endDate AND taskB.startDate <= taskA.endDate`. Tasks without a start date SHALL be excluded from overlap detection.

#### Scenario: Two tasks overlap
- **WHEN** Task A spans June 1-5 and Task B spans June 3-8 in the same group
- **THEN** the system SHALL detect an overlap between them

#### Scenario: Adjacent tasks do not overlap
- **WHEN** Task A spans June 1-5 and Task B spans June 6-10 in the same group
- **THEN** the system SHALL NOT detect an overlap

#### Scenario: Task without start date excluded
- **WHEN** a task has no start date in the same group as other tasks
- **THEN** the task SHALL NOT participate in lane assignment

### Requirement: Greedy lane assignment algorithm
The system SHALL assign overlapping task bars to non-overlapping vertical sub-lanes within their group row using a greedy algorithm: tasks within a group SHALL be sorted by start date, then each task SHALL be placed in the first lane where its date range does not overlap the most recently placed task in that lane. Lane indices SHALL start at 0.

#### Scenario: Two overlapping tasks get different lanes
- **WHEN** Task A (June 1-5) and Task B (June 3-8) overlap in the same group
- **THEN** Task A SHALL be assigned lane 0 and Task B SHALL be assigned lane 1

#### Scenario: Three tasks with chain overlap
- **WHEN** Task A (June 1-5), Task B (June 3-8), and Task C (June 6-12) are in the same group
- **THEN** Task A SHALL be lane 0, Task B SHALL be lane 1, and Task C SHALL be lane 0 (since it does not overlap Task A)

#### Scenario: Three tasks all overlapping
- **WHEN** Task A (June 1-10), Task B (June 1-10), and Task C (June 1-10) are in the same group
- **THEN** Task A SHALL be lane 0, Task B lane 1, and Task C lane 2

### Requirement: Partial vertical lane offset
Each task bar's vertical position SHALL be offset by `laneIndex * LANE_OFFSET` pixels from the base row position, where `LANE_OFFSET` is a small constant (SHALL default to 12px). Bars SHALL partially overlap vertically — the offset SHALL be just enough to expose the edge of each underlying bar. Lane 0 SHALL remain at the base position: `groupRowTop + (ROW_HEIGHT - barHeight) / 2`.

#### Scenario: Lane 1 bar is slightly offset below lane 0 bar
- **WHEN** a task bar is assigned to lane 1 with `LANE_OFFSET = 12` and base top is 8px within the row
- **THEN** its top position SHALL be `8 + 12 = 20px` within the row, partially overlapping the lane 0 bar

#### Scenario: Lane 2 bar is offset further
- **WHEN** a task bar is assigned to lane 2 with `LANE_OFFSET = 12`
- **THEN** its top position SHALL be `8 + 24 = 32px` within the row

#### Scenario: Bars remain visually distinguishable through partial overlap
- **WHEN** three task bars are stacked in lanes 0, 1, 2 within the same group
- **THEN** each bar SHALL expose a visible strip (~12px) of itself below the bar in the lane above, so the user can visually identify that multiple bars are present

### Requirement: Expanded group row height for partial overlap
Each group's visual row height SHALL be `ROW_HEIGHT + (laneCount - 1) * LANE_OFFSET`. Groups without overlapping bars SHALL remain at `ROW_HEIGHT`. The expanded height SHALL be just enough to contain the bottom edge of the highest-lane bar.

#### Scenario: Group with 3 overlapping lanes
- **WHEN** a group has 3 lanes and `LANE_OFFSET = 12`
- **THEN** the group's visual row height SHALL be `40 + (3 - 1) * 12 = 64px`

#### Scenario: Group with 2 overlapping lanes
- **WHEN** a group has 2 lanes and `LANE_OFFSET = 12`
- **THEN** the group's visual row height SHALL be `40 + (2 - 1) * 12 = 52px`

#### Scenario: Group without overlaps has normal height
- **WHEN** a group has only 1 lane (no overlaps)
- **THEN** the group's visual row height SHALL be `40px` (standard `ROW_HEIGHT`)

### Requirement: Task list row height matches lane-expanded height
The task list sidebar row for each group SHALL match the expanded height of the corresponding timeline row, so labels remain vertically aligned with their bar group.

#### Scenario: Task list row aligns with multi-lane timeline row
- **WHEN** a group has 2 lanes (52px height in timeline with partial overlap)
- **THEN** the corresponding task list row SHALL also be 52px tall, with the label vertically centered

### Requirement: Cumulative Y positioning for successive groups
Each group's row Y position SHALL be the sum of all preceding groups' expanded heights. The Y position of group at index `i` SHALL be `sum(groupHeight[0..i-1])`.

#### Scenario: Successive groups with different lane counts
- **WHEN** group 0 has 1 lane (40px), group 1 has 3 lanes (64px), and group 2 has 1 lane (40px)
- **THEN** group 0 SHALL start at Y=0, group 1 at Y=40, and group 2 at Y=104

### Requirement: Grid row backgrounds expand to lane height
The row background divs in the timeline SHALL span the full expanded height of each group row, so the grid lines and alternating backgrounds cover the entire lane-stacked area.

#### Scenario: Background covers all lanes
- **WHEN** a group has 2 lanes (52px total height)
- **THEN** the row background div SHALL have `height: 52px` and `top` positioned at the group's cumulative Y coordinate
