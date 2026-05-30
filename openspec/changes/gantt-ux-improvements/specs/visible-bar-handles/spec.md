## ADDED Requirements

### Requirement: Visible resize handles on task bars
The system SHALL display visible drag handle elements on the left and right edges of each task bar to indicate that the bar can be resized.

#### Scenario: Handles visible on wide bars
- **WHEN** a task bar has `width` >= 12px
- **THEN** a left handle element and a right handle element SHALL be visible on the respective edges of the bar

#### Scenario: Handles hidden on narrow bars
- **WHEN** a task bar has `width` < 12px
- **THEN** both handle elements SHALL be hidden to avoid visual clutter

#### Scenario: Handle hover feedback
- **WHEN** the user hovers the pointer over a handle element
- **THEN** the cursor SHALL change to `ew-resize` and the handle SHALL increase in opacity

#### Scenario: Handle appearance
- **WHEN** a handle is rendered
- **THEN** it SHALL be approximately 4px wide with a vertical grip pattern (e.g., parallel lines or dots) that visually communicates "draggable edge"

#### Scenario: Handle drag initiates resize
- **WHEN** the user presses the pointer on a handle element and drags horizontally
- **THEN** the task bar's corresponding edge (left or right) SHALL resize, changing the task's start date or end date respectively

#### Scenario: Handle hit area
- **WHEN** the pointer is within 8px of the bar edge (including the 4px visible handle + 4px invisible margin)
- **THEN** the drag SHALL be treated as an edge resize, matching the behavior of the handle itself
