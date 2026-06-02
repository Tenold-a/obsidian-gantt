## ADDED Requirements

### Requirement: Sidebar header visual separation
The sidebar TaskList header SHALL have an opaque background to prevent vertically scrolled rows from being visible through it.

#### Scenario: Header hides scrolled rows
- **WHEN** the user scrolls the timeline vertically
- **THEN** the sidebar rows SHALL disappear behind the header area rather than being visible through it

#### Scenario: Header uses theme-appropriate background
- **WHEN** the header background is rendered
- **THEN** it SHALL use the CSS variable `var(--background-primary, #ffffff)` to match the current theme's primary background color

#### Scenario: Header appears above scrolled content
- **WHEN** rows are translated upward via `translateY` during scroll
- **THEN** the header SHALL remain visually on top of the translated rows due to a higher stacking context (`z-index: 1`)
