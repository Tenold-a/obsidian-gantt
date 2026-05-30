## ADDED Requirements

### Requirement: Project custom fields data model
The `Project` interface SHALL include optional fields: `description` (string, a human-readable introduction or summary of the project), `requester` (string, the stakeholder or department requesting the project), `keyDates` (array of `KeyDate` objects), and `keyLinks` (array of `KeyLink` objects).

#### Scenario: Project with all custom fields
- **WHEN** a connector provides a Project with `description`, `requester`, and `keyDates`
- **THEN** all fields SHALL be available in the `projects` computed signal for display and editing

#### Scenario: Project with no custom fields
- **WHEN** a connector provides a Project without any custom fields
- **THEN** the fields SHALL default to `undefined` (description, requester) or empty array (keyDates)

### Requirement: KeyDate type definition
The system SHALL define a `KeyDate` interface with two required fields: `name` (string) and `date` (string, ISO `YYYY-MM-DD` format). It SHALL include optional fields: `color` (CSS-compatible color string, defaults to `#E5C07B` amber) and `icon` (1-2 character string rendered inside the marker diamond).

#### Scenario: KeyDate with color and icon
- **WHEN** a key date `{ name: "验收时间", date: "2026-06-15", color: "#98C379", icon: "✓" }` is provided
- **THEN** the marker SHALL render with green color and the checkmark icon inside the diamond

#### Scenario: KeyDate without color or icon
- **WHEN** a key date `{ name: "Deadline", date: "2026-07-01" }` is provided without color or icon
- **THEN** the marker SHALL default to amber color with no icon displayed

### Requirement: KeyLink type definition
The system SHALL define a `KeyLink` interface with two required fields: `name` (string, display label) and `url` (string, hyperlink URL). `keyLinks` SHALL be an optional array on `Project`.

#### Scenario: KeyLink structure
- **WHEN** a key link `{ name: "UI Design", url: "https://figma.com/..." }` is provided
- **THEN** the name SHALL be "UI Design" and the url SHALL be the Figma URL

### Requirement: Preset key date insertion
The project detail editor SHALL provide a set of predefined key date templates that users can insert with a single click. Presets SHALL include predefined `name`, `color`, and `icon` values. The date SHALL default to today's date when inserted.

#### Scenario: One-click preset insertion
- **WHEN** the user clicks the "验收时间" preset button in the key dates editor
- **THEN** a key date with `name: "验收时间"`, `color: "#98C379"`, `icon: "✓"`, and `date: <today>` SHALL be appended to the edit list

### Requirement: Project detail panel display
When a project row is selected in the project Gantt pane, the right sidebar SHALL display a project detail panel showing: the project name, color swatch, description, requester, a list of key dates (with date, name, color indicator, and icon), and a list of key links as clickable hyperlinks. The panel SHALL replace the task detail panel when `selectedEntity.type === 'project'`.

#### Scenario: Project detail panel renders
- **WHEN** the user clicks a project row in the project pane
- **THEN** the right sidebar SHALL show the project's name, description, requester, key dates with color/icon indicators, and key links

#### Scenario: Key links are clickable
- **WHEN** a project has key links displayed in the detail panel
- **THEN** each link SHALL render as a clickable anchor element that opens the URL in a new tab

#### Scenario: Switching from task detail to project detail
- **WHEN** a task detail panel is open and the user clicks a project row
- **THEN** the task detail panel SHALL be replaced by the project detail panel

### Requirement: Project custom field editing
The project detail panel SHALL include an "Edit" button that switches display fields to editable inputs. Changes SHALL be persisted to the `EditsOverlay.projectOverrides` map keyed by project ID. Editing SHALL follow the existing field-level source tracking pattern (fields edited by the user become `source: 'manual'`).

#### Scenario: Edit project description
- **WHEN** the user clicks "Edit" on the project detail panel and modifies the description field
- **THEN** the change SHALL be written to `edits/<view-id>.json` under `projectOverrides.<projectId>.description`

#### Scenario: Edit project key dates
- **WHEN** the user adds a new key date via the project detail editor
- **THEN** the key date SHALL be appended to the project's `keyDates` array and persisted

#### Scenario: Cancel editing
- **WHEN** the user clicks "Cancel" while editing project fields
- **THEN** all fields SHALL revert to their pre-edit values

### Requirement: EditsOverlay project overrides
The `EditsOverlay` interface SHALL include an optional `projectOverrides` field of type `Record<string, Partial<Pick<Project, 'description' | 'requester' | 'keyDates' | 'keyLinks'>>>`. This field SHALL be read and written alongside task overrides in `edits/<view-id>.json`.

#### Scenario: Edits file with project overrides
- **WHEN** the edits file is loaded and contains `projectOverrides`
- **THEN** those overrides SHALL be applied to the corresponding projects during merge

#### Scenario: Legacy edits file without projectOverrides
- **WHEN** an existing edits file does not contain `projectOverrides`
- **THEN** the field SHALL default to an empty object `{}`

### Requirement: Key date markers on timeline
Each project's key dates SHALL render as small colored diamond-shaped markers on the timeline at their corresponding date positions. Markers SHALL use the key date's `color` property (default amber). When `icon` is set, the icon character SHALL render inside the diamond. Markers SHALL be positioned within the project's group row area. Markers SHALL display the key date name and date as a tooltip on hover.

#### Scenario: Key date marker with color and icon
- **WHEN** a project has a key date `{ name: "验收时间", date: "2026-07-01", color: "#98C379", icon: "✓" }` at pixel 5000
- **THEN** a green diamond marker with "✓" inside SHALL render at `left: 5000px`

#### Scenario: Key date marker tooltip
- **WHEN** the user hovers over a key date marker
- **THEN** the marker's title attribute SHALL display "<name>: <date>" (e.g., "验收时间: 2026-07-01")

### Requirement: Key link editing
The project detail editor SHALL support adding, editing, and removing key links. Each key link row SHALL provide a name input and a URL input. Changes SHALL be persisted via `projectOverrides.keyLinks`.

#### Scenario: Add a key link
- **WHEN** the user clicks "+ Add Link" in the key links editor
- **THEN** a new empty row with name and URL inputs SHALL appear

#### Scenario: Remove a key link
- **WHEN** the user clicks the remove button on a key link row
- **THEN** that key link SHALL be removed from the edit list
