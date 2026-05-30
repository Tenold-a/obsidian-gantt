## ADDED Requirements

### Requirement: Key date marker drag
The system SHALL support dragging a KeyDateMarker horizontally on the project timeline to change the key date's date value.

#### Scenario: Drag key date marker to new date
- **WHEN** a user presses on a KeyDateMarker at date "2026-06-10" and drags it 60px right (2 days at 30px/day)
- **THEN** after drop, the key date SHALL have `date: "2026-06-12"`

#### Scenario: Key date snap to day boundary
- **WHEN** a user drags a key date marker and releases it at a position between two day boundaries
- **THEN** the marker SHALL snap to the nearest day boundary

#### Scenario: Key date drag ghost
- **WHEN** a user drags a key date marker
- **THEN** a visual indicator (e.g., a colored circle or outline of the marker) SHALL follow the pointer at the snapped date position

#### Scenario: Key date drag persist
- **WHEN** a user drops a key date marker after dragging
- **THEN** the new date SHALL be written to `edits/<view-id>.json` under the project's `keyDates` overrides

#### Scenario: Key date drag undo
- **WHEN** a user presses Ctrl+Z (Cmd+Z on Mac) after dragging a key date marker
- **THEN** the key date SHALL revert to its previous date and the edit SHALL be removed from the edits file

#### Scenario: Key date marker cursor
- **WHEN** the pointer hovers over a KeyDateMarker
- **THEN** the cursor SHALL change to `ew-resize` to indicate the marker is draggable horizontally
