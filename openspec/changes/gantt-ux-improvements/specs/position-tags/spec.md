## ADDED Requirements

### Requirement: Position tag badge rendering
The system SHALL render each person's position as a colored tag badge in the task list row, separate from the person's name.

#### Scenario: Position rendered as tag
- **WHEN** a person has `position: "Engineer"`
- **THEN** a tag badge with the text "Engineer" SHALL appear in the person's task list row, followed by the person's name

#### Scenario: No position renders name only
- **WHEN** a person has no `position` field or an empty position
- **THEN** only the person's name SHALL be displayed in the task list row, with no tag badge

#### Scenario: Position tag color consistency
- **WHEN** two persons share the same `position` string (e.g., "Engineer")
- **THEN** both persons' position tags SHALL have the same background color

#### Scenario: Position tag color distinction
- **WHEN** two persons have different `position` strings (e.g., "Engineer" and "Manager")
- **THEN** their position tags SHALL have visibly distinct background colors

#### Scenario: Tag visibility on dark and light themes
- **WHEN** the position tag is rendered in a dark theme
- **THEN** the tag text SHALL be readable against its background color
- **AND** the tag SHALL be readable against both light and dark theme backgrounds

#### Scenario: Tag layout in row
- **WHEN** a position tag is displayed in a task list row
- **THEN** the tag SHALL be a small, rounded element (approximately 3-4px border radius, compact padding) that fits inline before the person name
