## ADDED Requirements

### Requirement: Project tags field in data model
The `Project` interface SHALL include an optional `tags` field of type `string[]` for storing zero or more tag strings.

#### Scenario: Project loaded without tags
- **WHEN** a project is loaded from upstream without a `tags` field
- **THEN** the system SHALL treat the project's tags as an empty array

#### Scenario: Project loaded with tags from upstream
- **WHEN** a project is loaded from upstream with `tags: ["backend", "urgent"]`
- **THEN** the project SHALL display those tags in the project detail panel

#### Scenario: Tags field in project overrides
- **WHEN** a user adds or removes tags from a project
- **THEN** the tag changes SHALL be persisted in `projectOverrides[projectId].tags` in the edits file

### Requirement: Tags display in project detail panel
The project detail panel SHALL display the project's tags as colored badge elements when present.

#### Scenario: Tags displayed as badges
- **WHEN** viewing a project with tags `["backend", "urgent"]`
- **THEN** the detail panel SHALL render two tag badges showing "backend" and "urgent"

#### Scenario: No tags on project
- **WHEN** viewing a project with no tags
- **THEN** the detail panel SHALL display "—" or an empty state for the tags section

### Requirement: Tags editing in project detail panel
In edit mode, the project detail panel SHALL allow adding and removing tags.

#### Scenario: Add a tag in edit mode
- **WHEN** the user is editing a project and types a tag name into the tag input then presses Enter or clicks Add
- **THEN** the tag SHALL be added to the project's tags list and displayed as a badge with a remove button

#### Scenario: Remove a tag in edit mode
- **WHEN** the user clicks the remove (×) button on a tag badge in edit mode
- **THEN** the tag SHALL be removed from the project's tags list

#### Scenario: Duplicate tag prevention
- **WHEN** the user attempts to add a tag that already exists on the project
- **THEN** the system SHALL NOT add a duplicate and MAY show a brief indication

#### Scenario: Tag input autocomplete
- **WHEN** the user types in the tag input field
- **THEN** the system MAY suggest existing tags from the tag management system as autocomplete options

### Requirement: Tags included in push payload
When pushing changes, project tags SHALL be included in the push payload for projects with tag modifications.

#### Scenario: Project with new tags pushed
- **WHEN** a user pushes changes and a project has had tags added or modified
- **THEN** the push payload SHALL include the project's full tags array in the project object

### Requirement: Tags display in project list sidebar
The system SHALL display project tags as small colored badges in the project pane's left sidebar (TaskList), using colors from tag definitions.

#### Scenario: Project tags shown in sidebar
- **WHEN** a project has tags and the tag definitions have matching colors
- **THEN** the project row in the left sidebar SHALL show colored tag badges next to the project name

#### Scenario: Project without tags in sidebar
- **WHEN** a project has no tags
- **THEN** the project row SHALL show only the project name and color dot without tag badges
