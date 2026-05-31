## ADDED Requirements

### Requirement: View opens in center tab area by default
The system SHALL open the Gantt chart view as a center-area tab when activated via ribbon icon or command, replacing the previous right-sidebar behavior.

#### Scenario: View activated when no leaf exists
- **WHEN** the user clicks the ribbon icon or runs the "Open Gantt Chart" command and no Gantt view leaf exists
- **THEN** the system SHALL create the view in the center workspace area via `workspace.getLeaf(false)` rather than `workspace.getRightLeaf(false)`

#### Scenario: View activated when leaf already exists
- **WHEN** the user activates the Gantt chart and a leaf already exists (regardless of its current position)
- **THEN** the system SHALL reveal the existing leaf without creating a new one

#### Scenario: User drags view to sidebar
- **WHEN** the user manually drags the Gantt chart tab from the center area to the sidebar
- **THEN** the view SHALL continue to function normally in the sidebar position

#### Scenario: View reopened after being closed
- **WHEN** the Gantt chart view was previously closed and the user activates it again
- **THEN** the system SHALL create a new leaf in the center area by default
