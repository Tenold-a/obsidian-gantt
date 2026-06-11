## ADDED Requirements

### Requirement: Description field in TaskOverride
The `TaskOverride` type SHALL support a `description` field (string). The merge engine's `EDITABLE_FIELDS` SHALL include `description`. Users SHALL be able to edit a task's description via the detail panel or the description modal.

#### Scenario: Description stored in overrides
- **WHEN** a user edits a task's description
- **THEN** the description SHALL be stored in `overrides[taskId].description` in the edits file

#### Scenario: Description preserved on refresh
- **WHEN** upstream data is refreshed and the task has a manual description override
- **THEN** the manual description SHALL be preserved (source: 'manual')

### Requirement: Editable description modal
The `DescriptionModal` component SHALL support an editing mode. When in editing mode, a `<textarea>` SHALL display the markdown content for editing. A save button SHALL persist the changes.

#### Scenario: Toggle edit mode in modal
- **WHEN** the user clicks an "Edit" button in the DescriptionModal
- **THEN** the modal SHALL switch from rendered markdown view to a textarea with the raw markdown content

#### Scenario: Save edited description
- **WHEN** the user edits the description text and clicks "Save"
- **THEN** the system SHALL persist the new description and switch back to rendered view

#### Scenario: Cancel editing
- **WHEN** the user clicks "Cancel" in edit mode
- **THEN** the textarea SHALL revert to the original content and switch back to rendered view
