## ADDED Requirements

### Requirement: Person position field
The `Person` interface SHALL include an optional `position` field of type `string`. When provided by a connector, this field indicates the person's job title or role (e.g., "Engineer", "Designer", "Manager").

#### Scenario: Person with position from connector
- **WHEN** a connector provides a Person with `{ id: "p1", name: "Alice", position: "Engineer" }`
- **THEN** the position value SHALL be available in the `persons` computed signal for display and sorting

#### Scenario: Person without position
- **WHEN** a connector provides a Person without a `position` field
- **THEN** the person's position SHALL be treated as `undefined` and they SHALL sort to the end when sorting by position

### Requirement: Person ID and position display in row labels
In the person view's task list sidebar, each person row label SHALL display the person's position (if available) and ID alongside their name. The format SHALL be: `[position] Name` with the person ID available as a tooltip or secondary text.

#### Scenario: Person row with position
- **WHEN** a person has `name: "Alice"`, `position: "Engineer"`, and `id: "eng-01"`
- **THEN** the row label SHALL display "Engineer · Alice" and the element's title attribute SHALL include the ID "eng-01"

#### Scenario: Person row without position
- **WHEN** a person has `name: "Bob"` and no position
- **THEN** the row label SHALL display "Bob" without a position prefix

### Requirement: Person sort mode toggle
The person Gantt pane SHALL support two sort modes for person groups: "by name" (alphabetical) and "by position" (alphabetical by position string). The default mode SHALL be "by name". A toggle control in the person pane header SHALL allow switching between modes.

#### Scenario: Sort by name (default)
- **WHEN** the person view loads with default settings
- **THEN** person groups SHALL be sorted alphabetically by `personName`, with the unassigned group last

#### Scenario: Sort by position
- **WHEN** the user activates the "sort by position" toggle
- **THEN** person groups SHALL be sorted alphabetically by `position`, with persons lacking a position sorted after those with positions, and the unassigned group always last

#### Scenario: Toggle between sort modes
- **WHEN** the user clicks the sort toggle in the person pane header
- **THEN** the person groups SHALL immediately reorder according to the new sort mode without a page reload
