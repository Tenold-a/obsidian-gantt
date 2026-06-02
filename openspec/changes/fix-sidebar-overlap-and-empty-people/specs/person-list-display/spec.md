## ADDED Requirements

### Requirement: All known people visible in person pane
The person pane SHALL display every person defined in the data store (`persons` from cache files), including those who have zero tasks assigned.

#### Scenario: Person with tasks shown
- **WHEN** a person has one or more tasks assigned
- **THEN** the person SHALL appear in the person pane with their tasks grouped under their name

#### Scenario: Person without tasks shown
- **WHEN** a person exists in the data store but has zero tasks assigned
- **THEN** the person SHALL still appear in the person pane with an empty task list, using the standard row height

#### Scenario: Person list includes all entries
- **WHEN** the data store contains N persons and M of them have tasks (where M <= N)
- **THEN** the person pane SHALL display exactly N rows (plus "Unassigned" if applicable), not just M rows

#### Scenario: Empty-task persons sorted correctly
- **WHEN** a person with no tasks is included in the person pane
- **THEN** the person SHALL be sorted according to the current `personSortMode` (name or position) alongside persons who have tasks
