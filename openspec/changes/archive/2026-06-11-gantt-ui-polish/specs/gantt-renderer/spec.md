## ADDED Requirements

### Requirement: KeyDate chronological sort on render
The system SHALL sort KeyDate markers by date in ascending order (earliest date first) before rendering them on the timeline and in the project detail panel.

#### Scenario: KeyDates rendered in date order on timeline
- **WHEN** a project has keyDates `[{name: "Go-Live", date: "2026-12-01"}, {name: "Kickoff", date: "2026-06-01"}]`
- **THEN** the timeline SHALL render the "Kickoff" marker to the left of the "Go-Live" marker regardless of their order in the data array

#### Scenario: KeyDates rendered in date order in detail panel
- **WHEN** the project detail panel displays key dates
- **THEN** the key date list SHALL be sorted by date ascending

#### Scenario: KeyDates with same date preserve relative order
- **WHEN** two keyDates have the same date value
- **THEN** they SHALL retain their original relative order (stable sort)
