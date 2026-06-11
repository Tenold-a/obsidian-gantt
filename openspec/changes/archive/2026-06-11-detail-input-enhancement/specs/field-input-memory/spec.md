## ADDED Requirements

### Requirement: Field input memory storage
The system SHALL maintain a memory file at `memory/<view-id>.json` storing recently used values for manual input fields. The file SHALL contain arrays of strings keyed by field type: `persons`, `projects`, `urls`, `tags`, `dependencies`. Each array SHALL hold up to 50 most recent unique values in order of last use.

#### Scenario: Value saved on input
- **WHEN** a user types a new tag name and adds it to a task
- **THEN** the tag SHALL be added to `memory/<view-id>.json` under the `tags` array

#### Scenario: Duplicate values not duplicated
- **WHEN** a user enters a value that already exists in the memory list
- **THEN** the value SHALL be moved to the front of the list but not duplicated

#### Scenario: Memory capped at 50 entries
- **WHEN** a memory array reaches 50 entries
- **THEN** the oldest entry SHALL be removed when a new unique value is added

#### Scenario: Memory provides autocomplete suggestions
- **WHEN** a user focuses a text input field with memory support
- **THEN** a `<datalist>` SHALL provide suggestions from the corresponding memory array

#### Scenario: Memory file created on first use
- **WHEN** the first value is saved for a view that has no memory file
- **THEN** the system SHALL create `memory/<view-id>.json` with the new value
