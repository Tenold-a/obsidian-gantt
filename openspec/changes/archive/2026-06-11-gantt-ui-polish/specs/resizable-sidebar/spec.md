## ADDED Requirements

### Requirement: Left panel width is resizable
The system SHALL allow the user to resize the left sidebar task list width by dragging a vertical handle between the task list and the timeline. The width SHALL persist in view settings and be restored on next load.

#### Scenario: Default left panel width
- **WHEN** a view loads without a saved `leftPanelWidth` setting
- **THEN** the left panel SHALL default to 180px

#### Scenario: Drag to resize left panel
- **WHEN** the user drags the resize handle between the task list and timeline horizontally
- **THEN** the left panel width SHALL update in real-time to follow the pointer position

#### Scenario: Width clamped to bounds
- **WHEN** the user drags the resize handle
- **THEN** the left panel width SHALL be clamped between 120px (minimum) and 400px (maximum)

#### Scenario: Width persisted to settings
- **WHEN** the user finishes dragging the resize handle (pointer up)
- **THEN** the new width SHALL be saved to the view settings file via `saveSettings()`

#### Scenario: Width restored on load
- **WHEN** a view loads with a saved `leftPanelWidth` value
- **THEN** the left panel SHALL render at the saved width
