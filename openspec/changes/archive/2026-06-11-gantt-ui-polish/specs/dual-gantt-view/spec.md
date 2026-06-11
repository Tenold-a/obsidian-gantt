## ADDED Requirements

### Requirement: Resizable left sidebar width
The left task list sidebar in each Gantt pane SHALL have a configurable width, adjustable by the user via a vertical resize handle between the task list and the timeline. The width SHALL be synchronized across both panes (person and project).

#### Scenario: Left panel width synced between panes
- **WHEN** the left panel width is changed
- **THEN** both the person pane and the project pane SHALL use the same left panel width

#### Scenario: Timeline fills remaining space
- **WHEN** the left panel width is set to W pixels
- **THEN** the timeline area SHALL fill the remaining horizontal space via `flex: 1`

#### Scenario: Resize handle cursor
- **WHEN** the user hovers over the left panel resize handle
- **THEN** the cursor SHALL change to `col-resize`
