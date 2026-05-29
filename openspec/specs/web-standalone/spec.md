## ADDED Requirements

### Requirement: Standalone HTML application
The system SHALL provide a standalone web application that renders the full Gantt chart without requiring Obsidian. The web app SHALL be a single HTML file with bundled JS and CSS.

#### Scenario: Web app loads in browser
- **WHEN** a user opens the web app in a modern browser (Chrome, Firefox, Safari, Edge)
- **THEN** the full dual-pane Gantt chart SHALL render with all interactive features

#### Scenario: No Obsidian dependency
- **WHEN** the web app runs
- **THEN** there SHALL be no reference to Obsidian APIs in the loaded JavaScript

### Requirement: localStorage-based storage
The web app SHALL implement `IStorage` using `localStorage`, with path keys prefixed by `gantt:` (e.g., `gantt:cache/my-jira.json`).

#### Scenario: Data persists across sessions
- **WHEN** a user creates a view, adds connector data, and makes edits
- **THEN** closing and reopening the browser SHALL restore all data from localStorage

#### Scenario: Storage limit warning
- **WHEN** localStorage approaches its quota (typically 5-10MB)
- **THEN** the app SHALL warn the user that storage space is limited

### Requirement: Connector script management
The web app SHALL allow users to add connector scripts via: text input (paste code), or file upload (`<input type="file">`). Scripts SHALL be stored in localStorage.

#### Scenario: Paste connector code
- **WHEN** a user pastes a connector script into the text area and clicks "Save"
- **THEN** the script SHALL be stored and available as a connector

#### Scenario: Upload connector file
- **WHEN** a user uploads a `.js` file via the file input
- **THEN** the file contents SHALL be read and stored as a connector script

#### Scenario: Edit existing connector
- **WHEN** a user modifies a previously saved connector script
- **THEN** the updated script SHALL be used on the next refresh

### Requirement: URL data source
The web app SHALL support loading `CanonicalData` from a URL, specified as a query parameter or configuration, as an alternative to running a connector script.

#### Scenario: Load data from URL
- **WHEN** the web app is configured with a data source URL like `https://api.example.com/gantt-data.json`
- **THEN** it SHALL fetch JSON from that URL and use it as `CanonicalData` directly (bypassing connector script transform)

### Requirement: Static deployment
The web app SHALL be deployable as a set of static files (HTML + JS + CSS) to any static hosting service.

#### Scenario: Deploy to static host
- **WHEN** the built files are placed in a static hosting directory (Netlify, GitHub Pages, S3)
- **THEN** the application SHALL function correctly without any server-side processing

### Requirement: Web app configuration
The web app SHALL store its configuration (views, connector settings) in localStorage, using the same schema as the Obsidian plugin's `views/` and `config.json` files.

#### Scenario: View configuration in localStorage
- **WHEN** a user creates a new Gantt view in the web app
- **THEN** the view definition SHALL be stored under `gantt:views/<view-id>.json` in localStorage
