## ADDED Requirements

### Requirement: Custom position sort order
The system SHALL allow users to define a custom ordering for position values. When the people list is sorted by position, positions listed in the custom order SHALL appear first in the defined sequence, followed by any unlisted positions sorted alphabetically.

#### Scenario: Custom order positions sort first
- **WHEN** the user has set position order `["Manager", "Engineer", "Intern"]` and the people list includes persons with positions "Engineer", "Intern", "Designer", "Manager"
- **THEN** people SHALL be sorted as: Manager group first, Engineer group second, Intern group third, Designer group last (alphabetical fallback)

#### Scenario: Persons without position sort last
- **WHEN** sorting by position with a custom order defined, and some persons have no `position` value
- **THEN** persons without a position SHALL appear after all persons with positions, sorted alphabetically by name

#### Scenario: Unassigned always last
- **WHEN** sorting by position with a custom order defined
- **THEN** the `__unassigned__` group SHALL always appear at the end regardless of the custom order

#### Scenario: Empty custom order falls back to alphabetical
- **WHEN** the custom position order is empty or not configured, and sort mode is `position`
- **THEN** positions SHALL be sorted alphabetically (current behavior)

### Requirement: Position order persistence
The custom position order SHALL be persisted as part of the view settings and survive Obsidian restarts.

#### Scenario: Order survives reload
- **WHEN** the user sets a custom position order and reloads Obsidian
- **THEN** the same position order SHALL be applied when viewing the Gantt chart

### Requirement: Position order editor UI
The system SHALL provide a UI for editing the custom position order when position sort mode is active.

#### Scenario: Editor appears on gear click
- **WHEN** sort mode is `position` and the user clicks a settings gear icon in the person pane header
- **THEN** an inline editor SHALL appear allowing the user to enter positions in order (one per line)

#### Scenario: Editor saves on close
- **WHEN** the user edits the position list and closes the editor
- **THEN** the updated order SHALL be saved and immediately applied to the people list sort
