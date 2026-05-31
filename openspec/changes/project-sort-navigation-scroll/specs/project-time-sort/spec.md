## ADDED Requirements

### Requirement: Project sort mode signal
The system SHALL maintain a `projectSortMode` signal with values `'name'` and `'time'`. The initial value SHALL be `'name'`.

#### Scenario: Default sort mode is name
- **WHEN** the application first loads
- **THEN** `projectSortMode` SHALL be `'name'`

#### Scenario: Toggle sort mode
- **WHEN** the user clicks the sort toggle button in the project Gantt header
- **THEN** `projectSortMode` SHALL switch from `'name'` to `'time'`, or from `'time'` to `'name'`

### Requirement: Project time-based sorting
When `projectSortMode` is `'time'`, the system SHALL sort project groups by the following priority (ascending):

1. Projects with a key date named `上线时间` SHALL be sorted first by that date
2. Projects without `上线时间` but with associated tasks SHALL be sorted by the latest task `endDate` among their tasks
3. Projects with no tasks and no `上线时间` SHALL be sorted last by project name alphabetically

#### Scenario: Sort by 上线时间 key date
- **WHEN** project A has key date `上线时间: 2026-06-15` and project B has key date `上线时间: 2026-07-01`
- **AND** `projectSortMode` is `'time'`
- **THEN** project A SHALL appear before project B in the project Gantt

#### Scenario: Fallback to last task end date
- **WHEN** project A has no `上线时间` key date but has a task ending `2026-08-20`
- **AND** project B has no `上线时间` key date but has a task ending `2026-07-10`
- **AND** `projectSortMode` is `'time'`
- **THEN** project B SHALL appear before project A

#### Scenario: Projects with 上线时间 sort before those without
- **WHEN** project A has `上线时间: 2026-09-01`
- **AND** project B has no `上线时间` but has a task ending `2026-05-01`
- **AND** `projectSortMode` is `'time'`
- **THEN** project A SHALL appear before project B (上线时间 takes priority)

#### Scenario: Projects with no tasks sort last
- **WHEN** project A has no `上线时间` and no tasks
- **AND** project B has `上线时间: 2026-12-01`
- **AND** `projectSortMode` is `'time'`
- **THEN** project A SHALL appear after all projects that have either 上线时间 or tasks

#### Scenario: Sort toggle button visible
- **WHEN** the project Gantt pane renders
- **THEN** the pane header SHALL display a sort toggle button with text indicating the current mode ("Sort: Name" or "Sort: Time")
