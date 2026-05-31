## ADDED Requirements

### Requirement: Scroll target date computation
The system SHALL compute a `scrollTargetDate` derived from the current `selectedEntity`. The computation logic SHALL be:

- `selectedEntity.type === 'task'` → the selected task's `startDate`
- `selectedEntity.type === 'project'` → the project's `上线时间` key date, or the earliest `startDate` among the project's associated tasks, or `null`
- Otherwise → `null`

#### Scenario: Task selection computes task start date
- **WHEN** a task with `startDate: "2026-08-15"` is selected
- **THEN** `scrollTargetDate` SHALL be `"2026-08-15"`

#### Scenario: Project selection computes 上线时间
- **WHEN** a project with key date `上线时间: "2026-09-01"` is selected
- **THEN** `scrollTargetDate` SHALL be `"2026-09-01"`

#### Scenario: Project without 上线时间 falls back to earliest task
- **WHEN** a project with no `上线时间` key date is selected
- **AND** the project has associated tasks with start dates `"2026-07-15"` and `"2026-08-01"`
- **THEN** `scrollTargetDate` SHALL be `"2026-07-15"`

#### Scenario: Deselection clears target
- **WHEN** `selectedEntity` is set to `null`
- **THEN** `scrollTargetDate` SHALL be `null`

### Requirement: Timeline auto-scroll on target date change
When `scrollTargetDate` changes to a non-null value, the `Timeline` components in both Gantt panes SHALL scroll horizontally to center the target date in the viewport.

#### Scenario: Auto-scroll triggers on entity selection
- **WHEN** the user clicks a task and `scrollTargetDate` changes to a new date
- **THEN** the timeline SHALL scroll horizontally to bring the target date into the center of the viewport

#### Scenario: Auto-scroll does not trigger on same-date selections
- **WHEN** the user clicks a task whose `scrollTargetDate` equals the current value
- **THEN** no scrolling SHALL occur (avoids unnecessary scroll jumps)

#### Scenario: Auto-scroll via shared horizontal sync
- **WHEN** auto-scroll sets `sharedScrollLeft` to the target position
- **THEN** both the person Gantt and project Gantt SHALL scroll to the same horizontal position

#### Scenario: Manual scroll after auto-scroll works normally
- **WHEN** the user manually scrolls horizontally after an auto-scroll
- **THEN** the manual scroll SHALL NOT be overridden by the previous auto-scroll target
