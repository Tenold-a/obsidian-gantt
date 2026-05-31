## ADDED Requirements

### Requirement: Draggable detail panel resize handle
The system SHALL provide a vertical drag handle on the left edge of the right-side detail panel that allows the user to resize the panel width.

#### Scenario: Drag handle visible
- **WHEN** the detail panel is visible (project or task selected)
- **THEN** a vertical resize handle SHALL be visible on the left border of the panel with `cursor: col-resize`

#### Scenario: Drag right increases width
- **WHEN** the user drags the resize handle 50px to the right
- **THEN** the detail panel width SHALL increase by 50px

#### Scenario: Drag left decreases width
- **WHEN** the user drags the resize handle 30px to the left
- **THEN** the detail panel width SHALL decrease by 30px

#### Scenario: Minimum width clamped
- **WHEN** the user drags the handle to a width below 180px
- **THEN** the panel width SHALL be clamped to 180px

#### Scenario: Maximum width clamped
- **WHEN** the user drags the handle to a width above 500px
- **THEN** the panel width SHALL be clamped to 500px

### Requirement: Detail panel width persistence
The user's preferred detail panel width SHALL be persisted and restored across sessions.

#### Scenario: Width saved on drag end
- **WHEN** the user finishes dragging the panel resize handle
- **THEN** the new width SHALL be saved to view settings

#### Scenario: Width restored on reload
- **WHEN** the user reopens the Gantt chart after previously setting a custom panel width
- **THEN** the detail panel SHALL render at the previously saved width

### Requirement: Default panel width
When no custom width has been saved, the detail panel SHALL default to 220px.

#### Scenario: First-time default
- **WHEN** a user opens the Gantt chart for the first time or no custom width has been saved
- **THEN** the detail panel SHALL render at 220px width

### Requirement: Resize handle visual feedback
The resize handle SHALL provide visual feedback during hover and drag.

#### Scenario: Hover highlight
- **WHEN** the user hovers over the resize handle
- **THEN** the handle SHALL change color to the accent color

#### Scenario: Drag highlight persists
- **WHEN** the user is actively dragging the resize handle
- **THEN** the handle SHALL remain highlighted and cursor SHALL stay as `col-resize`
