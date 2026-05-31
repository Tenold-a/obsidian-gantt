## ADDED Requirements

### Requirement: Tag management page access
The system SHALL provide a tag management interface accessible from the Gantt chart toolbar.

#### Scenario: Open tag management from toolbar
- **WHEN** the user clicks the "Manage Tags" button in the toolbar
- **THEN** a tag management panel or modal SHALL open

#### Scenario: Close tag management
- **WHEN** the user clicks the close button or presses Escape in the tag management panel
- **THEN** the panel SHALL close and return to the Gantt chart

### Requirement: Tag list display
The tag management interface SHALL display all tags defined for the current view, each showing its name, color, and the count of associated projects.

#### Scenario: Tags listed with color and usage count
- **WHEN** the tag management page is open and tags exist
- **THEN** each tag SHALL be displayed with its color swatch, name, and the number of projects using it

#### Scenario: Empty tag list
- **WHEN** no tags have been defined
- **THEN** the page SHALL display a message indicating no tags exist yet

### Requirement: Create new tag
The system SHALL allow users to create a new tag with a name and optional color.

#### Scenario: Create tag with name and default color
- **WHEN** the user enters a tag name and clicks "Create" without selecting a color
- **THEN** a new tag SHALL be created with a randomly assigned color from a preset palette

#### Scenario: Create tag with custom color
- **WHEN** the user enters a tag name, selects a color, and clicks "Create"
- **THEN** a new tag SHALL be created with the specified name and color

#### Scenario: Duplicate tag name rejected
- **WHEN** the user attempts to create a tag with a name that already exists
- **THEN** the system SHALL reject the creation and display an error message

### Requirement: Edit existing tag
The system SHALL allow users to rename a tag or change its color.

#### Scenario: Rename a tag
- **WHEN** the user renames a tag from "old-name" to "new-name"
- **THEN** the tag's name SHALL be updated, and all projects referencing "old-name" SHALL be updated to "new-name"

#### Scenario: Change tag color
- **WHEN** the user changes a tag's color
- **THEN** the tag's new color SHALL be saved and reflected everywhere the tag is displayed

### Requirement: Delete tag
The system SHALL allow users to delete a tag via a two-step confirmation flow, with automatic cleanup of references on all associated projects.

#### Scenario: Two-step delete confirmation
- **WHEN** the user clicks the delete button on a tag
- **THEN** the delete button SHALL be replaced by a "Sure?" confirm button and a cancel button, requiring a second click to execute the deletion

#### Scenario: Delete tag with associated projects
- **WHEN** the user confirms deletion of a tag that is used by N projects
- **THEN** the system SHALL remove the tag from all associated projects' tag arrays

#### Scenario: Delete unused tag
- **WHEN** the user confirms deletion of a tag that is not used by any project
- **THEN** the tag SHALL be removed from tag definitions without affecting any projects

### Requirement: Tag auto-creation from project edits
When a user adds a tag to a project, the system SHALL automatically create the tag in tag definitions if it does not already exist.

#### Scenario: New tag added to project auto-created in tag definitions
- **WHEN** a user adds a previously unknown tag to a project and saves
- **THEN** the tag SHALL be created in tag definitions with a random preset color, and SHALL appear in the tag management page

#### Scenario: Existing tag added to project does not duplicate
- **WHEN** a user adds a tag to a project that already exists in tag definitions
- **THEN** no duplicate tag definition SHALL be created

### Requirement: Tag data storage
Tag definitions SHALL be stored per-view in a `tags/<viewId>.json` file containing an array of `{ name: string, color: string }` objects.

#### Scenario: Tags loaded with view
- **WHEN** a view is loaded
- **THEN** the system SHALL load the associated tags from `tags/<viewId>.json`

#### Scenario: Tags persisted on modification
- **WHEN** a tag is created, renamed, deleted, or its color changed
- **THEN** the changes SHALL be persisted to `tags/<viewId>.json`
