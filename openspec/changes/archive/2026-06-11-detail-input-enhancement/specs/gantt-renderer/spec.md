## ADDED Requirements

### Requirement: Person detail panel rendering
The system SHALL render a `PersonDetail` component in the right detail panel area when the selected entity type is `'person'`. The component SHALL display person metadata and the list of associated tasks.

#### Scenario: PersonDetail replaces task/project detail
- **WHEN** the user clicks a person in the sidebar and a task detail was previously shown
- **THEN** the task detail panel SHALL be replaced by the PersonDetail panel

#### Scenario: PersonDetail shows person info header
- **WHEN** PersonDetail renders for a person with name, position, and avatar
- **THEN** the header SHALL display the person's name (editable), position, and avatar

#### Scenario: PersonDetail task list clickable
- **WHEN** a task is listed in PersonDetail
- **THEN** clicking the task SHALL change the selected entity to that task
