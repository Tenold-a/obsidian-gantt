## ADDED Requirements

### Requirement: Multi-select in pending changes panel
Each pending change entry in the Pending Changes panel SHALL be displayed with a checkbox, allowing the user to select which changes to push or dismiss.

#### Scenario: Individual selection
- **WHEN** the user toggles the checkbox on a specific pending change
- **THEN** that change SHALL be marked as selected

#### Scenario: All items selected by default
- **WHEN** the Pending Changes panel opens
- **THEN** all pending changes SHALL be pre-selected (checkboxes checked)

#### Scenario: Select All button
- **WHEN** the user clicks "Select All"
- **THEN** all pending changes SHALL be selected (all checkboxes checked)

#### Scenario: Deselect All button
- **WHEN** the user clicks "Deselect All"
- **THEN** all pending changes SHALL be deselected (all checkboxes unchecked)

### Requirement: Push selected changes only
The push operation SHALL only submit changes that are currently selected in the pending panel.

#### Scenario: Push with some items deselected
- **WHEN** the user deselects 2 out of 5 pending changes and clicks "Push Selected"
- **THEN** only the 3 selected changes SHALL be included in the push payload

#### Scenario: Push with no items selected
- **WHEN** the user deselects all items and clicks "Push (0)"
- **THEN** the push button SHALL be disabled or the action SHALL be a no-op

#### Scenario: Successful selective push clears only selected edits
- **WHEN** a push of selected items succeeds
- **THEN** only the edits corresponding to the selected changes SHALL be cleared from the edits overlay; unselected changes SHALL be preserved

### Requirement: Dismiss (cancel) selected changes
The system SHALL provide a "Dismiss Selected" action that removes the selected changes from the edits overlay without pushing them upstream.

#### Scenario: Dismiss selected changes
- **WHEN** the user selects 2 out of 5 pending changes and clicks "Dismiss Selected"
- **THEN** the edits corresponding to those 2 changes SHALL be removed from the edits overlay

#### Scenario: Dismiss confirmation
- **WHEN** the user clicks "Dismiss Selected"
- **THEN** the system SHALL prompt for confirmation before permanently discarding the local changes

#### Scenario: Dismiss preserves unselected changes
- **WHEN** dismissed changes are cleared
- **THEN** the unselected changes SHALL be preserved in the edits overlay and remain in the pending list

### Requirement: Selection-aware statistics
The panel header SHALL display both the total number of changes and the number currently selected.

#### Scenario: Stats reflect selection
- **WHEN** 3 out of 5 changes are selected
- **THEN** the panel SHALL display "3 of 5 selected" and the push button SHALL read "Push Selected (3)"

### Requirement: Dismiss for individual change types
The dismiss operation SHALL handle all change types correctly: modified task overrides, added local tasks, deleted task markers, modified project overrides, and deleted project markers.

#### Scenario: Dismiss modified task override
- **WHEN** a user dismisses a modified task change
- **THEN** the corresponding task's override SHALL be removed from `overrides[taskId]` in the edits file

#### Scenario: Dismiss added local task
- **WHEN** a user dismisses an added local task
- **THEN** the task SHALL be removed from `localTasks` array in the edits file

#### Scenario: Dismiss deleted task marker
- **WHEN** a user dismisses a deleted task marker
- **THEN** the task ID SHALL be removed from `deletedTasks` array in the edits file

#### Scenario: Dismiss modified project override
- **WHEN** a user dismisses a modified project change
- **THEN** the corresponding project's fields SHALL be removed from `projectOverrides[projectId]` in the edits file

#### Scenario: Dismiss deleted project marker
- **WHEN** a user dismisses a deleted project marker
- **THEN** the project ID SHALL be removed from `deletedProjects` array in the edits file; all cascade-deleted task IDs SHALL also be removed from `deletedTasks`
