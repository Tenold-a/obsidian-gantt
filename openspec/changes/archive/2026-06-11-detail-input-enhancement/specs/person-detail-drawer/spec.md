## ADDED Requirements

### Requirement: Person detail drawer on selection
When the user clicks a person in the person sidebar, the system SHALL display a `PersonDetail` component in the right detail panel area. The drawer SHALL show the person's name, position, avatar (if available), and a list of all tasks assigned to that person with status badges.

#### Scenario: Click person opens detail drawer
- **WHEN** the user clicks a person row in the person sidebar
- **THEN** the PersonDetail panel SHALL appear on the right side, replacing any open task or project detail

#### Scenario: Person detail shows task list
- **WHEN** PersonDetail renders for a person with 5 assigned tasks
- **THEN** the panel SHALL list all 5 tasks with their titles, status badges, and date ranges

#### Scenario: Click task in person detail navigates to task detail
- **WHEN** the user clicks a task in the person's task list
- **THEN** the selection SHALL change to that task, opening the task DetailPanel

#### Scenario: Person with no assigned tasks
- **WHEN** PersonDetail renders for a person with zero tasks
- **THEN** the panel SHALL display "No tasks assigned"

#### Scenario: Unassigned person selected
- **WHEN** the user clicks the "Unassigned" row
- **THEN** the PersonDetail SHALL show all unassigned tasks

#### Scenario: Person detail has locate and close buttons
- **WHEN** PersonDetail renders
- **THEN** it SHALL include a "locate" button to scroll to the person's row and a "close" button to deselect
