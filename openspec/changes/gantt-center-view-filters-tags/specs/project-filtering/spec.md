## ADDED Requirements

### Requirement: Project filter by time range
The system SHALL support filtering projects by a date range. Projects whose key dates or associated task date ranges intersect with the filter range SHALL match and be displayed in the project pane; all non-matching projects SHALL be hidden from the project pane. In the person pane, task bars belonging to hidden projects SHALL be dimmed.

#### Scenario: Project with key date in range matches
- **WHEN** the user sets a time range filter of "2026-06-01" to "2026-06-30" and a project has a key date "上线时间" set to "2026-06-15"
- **THEN** the project SHALL be displayed in the project pane, and its tasks SHALL display normally in the person pane

#### Scenario: Project with task spanning filter range matches
- **WHEN** the user sets a time range filter of "2026-06-01" to "2026-06-30" and a project has tasks spanning "2026-05-15" to "2026-07-15" (intersecting the filter)
- **THEN** the project SHALL be displayed in the project pane

#### Scenario: Project entirely outside filter range is hidden
- **WHEN** the user sets a time range filter of "2026-06-01" to "2026-06-30" and a project's key dates and all tasks fall entirely before "2026-06-01"
- **THEN** the project SHALL be hidden from the project pane, and its task bars in the person pane SHALL be rendered at reduced opacity (dimmed)

#### Scenario: Person pane dimming for filtered-out project tasks
- **WHEN** a project is hidden by filter and has tasks assigned to a person
- **THEN** those task bars SHALL appear dimmed (opacity ~0.3) in the person pane, and the person row SHALL remain visible

#### Scenario: Time range filter cleared
- **WHEN** the user clears the time range filter
- **THEN** all projects SHALL reappear in the project pane and all task bars SHALL return to full opacity

### Requirement: Project filter by status
The system SHALL support filtering projects by status. Only projects with a status matching one of the selected filter statuses SHALL be displayed in the project pane; all others SHALL be hidden. Person-pane tasks of hidden projects SHALL be dimmed.

#### Scenario: Single status filter active
- **WHEN** the user selects "In Progress" in the status filter
- **THEN** projects with status "in-progress" SHALL be displayed in the project pane and projects with other statuses SHALL be hidden from the project pane

#### Scenario: Multiple statuses selected
- **WHEN** the user selects both "In Progress" and "Pending" in the status filter
- **THEN** projects with status "in-progress" or "pending" SHALL be displayed, and projects with other statuses SHALL be hidden

#### Scenario: Status filter cleared
- **WHEN** the user deselects all status filters
- **THEN** all projects SHALL be displayed in the project pane and all task bars SHALL return to full opacity

### Requirement: Project filter by tags
The system SHALL support filtering projects by tags. Only projects that have at least one of the selected filter tags SHALL be displayed in the project pane; all others SHALL be hidden. Person-pane tasks of hidden projects SHALL be dimmed.

#### Scenario: Single tag filter active
- **WHEN** the user selects tag "urgent" in the tag filter
- **THEN** projects containing the tag "urgent" SHALL be displayed in the project pane and all other projects SHALL be hidden

#### Scenario: Multiple tags filter (OR logic)
- **WHEN** the user selects tags "urgent" and "backend"
- **THEN** projects containing either "urgent" or "backend" (or both) SHALL be displayed in the project pane

#### Scenario: Tag filter cleared
- **WHEN** the user deselects all tag filters
- **THEN** all projects SHALL be displayed in the project pane

### Requirement: Combined filter logic (AND across dimensions)
When multiple filter dimensions are active simultaneously, the system SHALL apply AND logic across dimensions: a project must match all active dimension filters to be displayed.

#### Scenario: Time range AND status filter
- **WHEN** the user sets time range "2026-06-01" to "2026-06-30" and selects status "In Progress"
- **THEN** only projects that both intersect the time range AND have status "in-progress" SHALL be displayed; all others SHALL be hidden

#### Scenario: All three filter dimensions active
- **WHEN** the user sets time range, status, and tag filters simultaneously
- **THEN** a project SHALL be displayed only if it matches the time range AND matches the status filter AND matches the tag filter

### Requirement: Person pane task dimming on filter
When one or more filter dimensions are active, the person pane SHALL dim task bars that belong to projects hidden by the filter, while keeping all person rows visible.

#### Scenario: Person pane shows dimmed tasks for hidden projects
- **WHEN** a filter is active and person "张三" has tasks belonging to both a matching project and a hidden project
- **THEN** "张三"'s person row SHALL remain visible, tasks from the matching project SHALL display at full opacity, and tasks from the hidden project SHALL display dimmed

#### Scenario: Person with only hidden-project tasks
- **WHEN** a filter is active and all of a person's tasks belong to hidden projects
- **THEN** the person row SHALL remain visible and all task bars SHALL be dimmed

### Requirement: Filter UI in toolbar
The system SHALL provide filter controls in the Gantt chart toolbar for time range, status, and tags.

#### Scenario: Filter controls visible in toolbar
- **WHEN** the Gantt chart is displayed with data loaded
- **THEN** the toolbar SHALL contain a time range picker (start/end date inputs), a status multi-select dropdown, and a tag multi-select dropdown

#### Scenario: Active filter indicator
- **WHEN** at least one filter is active
- **THEN** the toolbar SHALL visually indicate that filtering is active (e.g., highlighted filter button or badge count)

### Requirement: Filter and sort settings persistence
Filter and sort settings SHALL be persisted per view to `settings/<viewId>.json` and restored on view load.

#### Scenario: Settings saved on change
- **WHEN** the user changes any filter (time range, status, tags) or sort mode (person/project sort, key date names)
- **THEN** the settings SHALL be written to `settings/<viewId>.json` within 500ms (debounced)

#### Scenario: Settings restored on view load
- **WHEN** a view is loaded
- **THEN** previously saved filter values, sort mode, and sort key dates SHALL be restored from the settings file

#### Scenario: Settings file absent on first use
- **WHEN** no settings file exists for the current view
- **THEN** filters SHALL default to empty (no filtering) and sort modes SHALL default to their factory values
