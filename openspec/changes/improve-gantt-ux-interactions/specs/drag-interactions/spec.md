## MODIFIED Requirements

### Requirement: Resize task bar edges
The system SHALL support dragging the left or right edge of a task bar to change its start date or end date independently.

#### Scenario: Drag left edge changes start date
- **WHEN** a user drags the left edge of a bar 60px left (2 days at 30px/day)
- **THEN** the task's `startDate` SHALL decrease by 2 days and `endDate` SHALL remain unchanged

#### Scenario: Drag right edge changes end date
- **WHEN** a user drags the right edge of a bar 30px right
- **THEN** the task's `endDate` SHALL increase by 1 day and `startDate` SHALL remain unchanged

#### Scenario: Edge hit area
- **WHEN** the pointer is within 8px of the left or right edge of a task bar
- **THEN** the cursor SHALL change to `ew-resize` and dragging SHALL perform edge resize

#### Scenario: Cursor outside edge hit area
- **WHEN** the pointer is more than 8px from both edges but still over the task bar
- **THEN** the cursor SHALL show `grab`

#### Scenario: Minimum task duration
- **WHEN** a user resizes a task bar to less than 1 day in width
- **THEN** the task SHALL be clamped to a minimum duration of 1 day
