# inline-name-editing Specification

## Purpose
TBD - created by archiving change task-project-management. Update Purpose after archive.
## Requirements
### Requirement: Task title inline editing
The task detail panel SHALL support inline editing of the task title by clicking on the title text, which transforms it into a text input field.

#### Scenario: Click to edit task title
- **WHEN** a user clicks on the task title text in the detail panel
- **THEN** the title text SHALL be replaced with a text input pre-filled with the current title value

#### Scenario: Save task title on Enter
- **WHEN** a user presses Enter while editing the task title
- **THEN** the new title SHALL be persisted via `store.persistEdit()` and the input SHALL revert to display mode

#### Scenario: Save task title on blur
- **WHEN** a user clicks outside the task title input (blur event)
- **THEN** the new title SHALL be persisted and the input SHALL revert to display mode

#### Scenario: Cancel task title edit on Escape
- **WHEN** a user presses Escape while editing the task title
- **THEN** the title SHALL revert to its original value and the input SHALL revert to display mode without persisting

#### Scenario: Empty title rejected
- **WHEN** a user clears the task title and saves
- **THEN** the system SHALL revert to the previous title value

### Requirement: Project name inline editing
The project detail panel SHALL support inline editing of the project name by clicking on the name text, independently of the existing Edit mode for other fields.

#### Scenario: Click to edit project name
- **WHEN** a user clicks on the project name text in the detail panel
- **THEN** the name text SHALL be replaced with a text input pre-filled with the current name

#### Scenario: Save project name on Enter
- **WHEN** a user presses Enter while editing the project name
- **THEN** the new name SHALL be persisted via `store.persistProjectEdit()` and the input SHALL revert to display mode

#### Scenario: Save project name on blur
- **WHEN** a user clicks outside the project name input
- **THEN** the new name SHALL be persisted and the input SHALL revert to display mode

#### Scenario: Cancel project name edit on Escape
- **WHEN** a user presses Escape while editing the project name
- **THEN** the name SHALL revert to its original value without persisting

#### Scenario: Empty project name rejected
- **WHEN** a user clears the project name and saves
- **THEN** the system SHALL revert to the previous name value

