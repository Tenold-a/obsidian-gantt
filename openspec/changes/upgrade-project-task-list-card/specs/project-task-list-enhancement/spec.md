## ADDED Requirements

### Requirement: Project task list uses card layout
The system SHALL render task items in the project detail panel as styled cards with visible borders, background, and padding, matching the visual treatment of task cards in the person detail panel.

#### Scenario: Multiple tasks render as cards
- **WHEN** a project is selected that has multiple associated tasks
- **THEN** each task is rendered as a card with border, border-radius, background color, and padding

#### Scenario: No tasks associated
- **WHEN** a project is selected that has no associated tasks
- **THEN** a "No tasks" message is displayed in muted italic text

### Requirement: Task card shows locate button
Each task card in the project detail panel SHALL include a locate button (target icon) that scrolls the Gantt to the task's position.

#### Scenario: Click locate button
- **WHEN** the user clicks the locate button on a task card
- **THEN** the Gantt view scrolls to center that task bar and the click event does not navigate to the task detail

### Requirement: Task card shows date range
Each task card in the project detail panel SHALL display the task's date range (start date → end date) when available, formatted identically to the person detail panel.

#### Scenario: Task has both start and end dates
- **WHEN** a task has both a start date and an end date
- **THEN** the card displays the date range as "startDate → endDate" in muted, smaller text

#### Scenario: Task has only start date
- **WHEN** a task has a start date but no end date
- **THEN** the card displays only the start date in muted, smaller text

#### Scenario: Task has no dates
- **WHEN** a task has neither a start date nor an end date
- **THEN** the card does not display any date information

### Requirement: Task card shows assigned person
Each task card in the project detail panel SHALL display the assigned person's name with their assigned color when a person is associated with the task.

#### Scenario: Task has an assigned person
- **WHEN** a task has a personId that matches a person in the store
- **THEN** the card displays the person's name in the person's color alongside the date range

#### Scenario: Task has no assigned person
- **WHEN** a task has a null or empty personId
- **THEN** the card does not display any person information

#### Scenario: Task has personId not in store
- **WHEN** a task has a personId that does not match any person in the store
- **THEN** the card does not display any person information (graceful fallback)

### Requirement: Task count label
The project detail panel SHALL display the task count next to the "Tasks" label.

#### Scenario: Project has tasks
- **WHEN** a project is selected that has associated tasks
- **THEN** the label displays "Tasks (N)" where N is the count of associated tasks

#### Scenario: Project has no tasks
- **WHEN** a project is selected that has no associated tasks
- **THEN** the label displays "Tasks (0)"
