## MODIFIED Requirements

### Requirement: View activation location
The system SHALL open the Gantt chart view in the center workspace area as a tab when activated via ribbon icon or command, replacing the previous right-sidebar-only behavior.

#### Scenario: Default view position
- **WHEN** the Gantt chart view is activated for the first time
- **THEN** the view SHALL open as a tab in the center workspace area

#### Scenario: Re-opening existing view
- **WHEN** the Gantt chart view already exists (in center, sidebar, or any position)
- **THEN** the system SHALL reveal the existing leaf without creating a new one or changing its position

#### Scenario: View functions identically regardless of position
- **WHEN** the Gantt chart view is rendered in the center tab area
- **THEN** all features (dual-pane layout, independent vertical scrolling, shared horizontal scrolling, unassigned panel) SHALL function identically to when it was in the sidebar
