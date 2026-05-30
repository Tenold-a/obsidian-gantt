## MODIFIED Requirements

### Requirement: Independent vertical scrolling
Each Gantt pane SHALL scroll vertically independently of the other. Each pane's task list (left column) and timeline SHALL scroll vertically in sync with each other via a shared scrollTop signal per pane.

#### Scenario: Person view vertical scroll
- **WHEN** the user scrolls the person Gantt vertically
- **THEN** the project Gantt's vertical scroll position SHALL NOT change

#### Scenario: Task list and timeline vertical sync
- **WHEN** the user scrolls the timeline vertically
- **THEN** the task list SHALL scroll to the same vertical offset via CSS translateY transform

#### Scenario: Task list does not display its own scrollbar
- **WHEN** the task list container receives a vertical scroll offset
- **THEN** the content SHALL move via `transform: translateY()` on the inner row container, and the task list SHALL NOT display a visible scrollbar
