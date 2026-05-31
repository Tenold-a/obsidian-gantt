## ADDED Requirements

### Requirement: Multi-select support in pending panel
Each pending change entry in the panel SHALL include a checkbox for selection. The panel SHALL provide "Select All" and "Deselect All" controls.

#### Scenario: Checkbox per change entry
- **WHEN** the pending changes panel is open with N changes
- **THEN** each change entry SHALL display a checkbox, all initially checked

#### Scenario: Select All / Deselect All
- **WHEN** the user clicks "Deselect All"
- **THEN** all checkboxes SHALL become unchecked
- **WHEN** the user clicks "Select All"
- **THEN** all checkboxes SHALL become checked

### Requirement: Selective push
The push operation SHALL only submit changes that are currently selected. The store's `pushChanges` method SHALL accept an optional set of selected entity IDs.

#### Scenario: Push with selection filter
- **WHEN** the user selects 3 of 5 pending changes and clicks "Push Selected (3)"
- **THEN** the push payload SHALL only include entities whose IDs are in the selected set

#### Scenario: Push button reflects selection count
- **WHEN** N items are selected
- **THEN** the push button label SHALL display "Push Selected (N)"

### Requirement: Dismiss selected changes
The system SHALL provide a "Dismiss Selected" action that permanently removes the selected pending changes from the edits overlay without pushing them.

#### Scenario: Dismiss removes selected edits
- **WHEN** the user selects specific pending changes and clicks "Dismiss Selected"
- **THEN** a confirmation dialog SHALL appear, and upon confirmation the selected edits SHALL be removed from the edits overlay

#### Scenario: Dismiss preserves unselected edits
- **WHEN** selected changes are dismissed
- **THEN** any unselected pending changes SHALL remain in the edits overlay

## ADDED Requirements

### Requirement: Null-safe cleared field display
The pending changes panel SHALL gracefully handle field overrides whose value is `undefined` (representing a cleared field), displaying a clear indication instead of crashing.

#### Scenario: Cleared tags field displayed safely
- **WHEN** a project override has `tags: undefined` (all tags removed)
- **THEN** the panel SHALL display `(cleared)` or an empty-state indicator instead of throwing a TypeError

#### Scenario: Cleared keyDates field displayed safely
- **WHEN** a project override has `keyDates: undefined` (all key dates removed)
- **THEN** the panel SHALL display `0 dates` instead of throwing a TypeError

#### Scenario: Cleared keyLinks field displayed safely
- **WHEN** a project override has `keyLinks: undefined`
- **THEN** the panel SHALL display `0 links` instead of throwing a TypeError

#### Scenario: Cleared dependencies field displayed safely
- **WHEN** a task override has `dependencies: undefined`
- **THEN** the panel SHALL display `[]` instead of throwing a TypeError

## MODIFIED Requirements

### Requirement: Push to upstream
The system SHALL support pushing local changes to upstream systems via an optional `push(changes, context)` method on connector modules. The push operation SHALL accept an optional set of entity IDs to selectively push only those changes.

#### Scenario: Push with connector that supports push
- **WHEN** a user clicks "Push" or "Push Selected" in the pending changes panel and at least one connector implements `push()`
- **THEN** the system SHALL call `push()` with the structured changes payload containing only the selected entity IDs

#### Scenario: Push with connector that does not support push
- **WHEN** a user clicks "Push" but no connector implements `push()`
- **THEN** the system SHALL display a message indicating that push is not supported by the current connectors

#### Scenario: Successful push clears selected changes
- **WHEN** a push operation completes successfully
- **THEN** only the corresponding selected edits SHALL be cleared from the edits overlay and the pending changes panel SHALL update

#### Scenario: Failed push preserves changes
- **WHEN** a push operation fails with an error
- **THEN** the local edits SHALL be preserved, an error message SHALL be displayed, and the user MAY retry
