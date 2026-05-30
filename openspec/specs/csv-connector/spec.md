## Purpose

[brief description]

## Requirements

### Requirement: CSV connector reads multiple CSV files by ID reference
The CSV connector SHALL read three CSV files (persons, projects, tasks) linked by ID references, not a single merged spreadsheet.

#### Scenario: Three CSV files produce complete CanonicalData
- **WHEN** the CSV connector's `fetch` reads persons.csv, projects.csv, and tasks.csv
- **THEN** `transform` SHALL return `CanonicalData` with tasks referencing persons and projects by their IDs

#### Scenario: Requester is resolved from person ID
- **WHEN** projects.csv has `requesterId` referencing a person ID in persons.csv
- **THEN** the project's `requester` field SHALL contain the person's name, not the raw ID

### Requirement: CSV connector supports configurable column mapping
The CSV connector SHALL accept a `columnMapping` in `ctx.config` to map canonical field names to CSV column headers.

#### Scenario: Custom column mapping overrides defaults
- **WHEN** config specifies `columnMapping: { taskTitle: "任务名" }`
- **THEN** the connector SHALL read task titles from the "任务名" column instead of the default "title" column

#### Scenario: Unspecified columns use defaults
- **WHEN** config specifies a partial `columnMapping`
- **THEN** unspecified columns SHALL use their default English names

### Requirement: CSV connector exports push function
The CSV connector SHALL export a `push` function that writes modified tasks, persons, and projects back to the configured CSV files, updating rows in-place by ID.

#### Scenario: Push updates task row by ID
- **WHEN** `push` receives a task with ID matching an existing CSV row
- **THEN** only the modified fields in that row SHALL be updated; other columns SHALL be preserved

#### Scenario: Push appends new task
- **WHEN** `push` receives a task with an ID not found in tasks.csv
- **THEN** a new row SHALL be appended to tasks.csv

#### Scenario: Push removes deleted task
- **WHEN** `push` receives a `deletedTaskIds` containing an existing task ID
- **THEN** the corresponding row SHALL be removed from tasks.csv

#### Scenario: Push preserves original CSV headers
- **WHEN** `push` writes back to a CSV file
- **THEN** the original header line and column order SHALL be preserved

### Requirement: CSV connector push serializes CSV safely
When writing CSV rows, fields containing commas, quotes, or newlines SHALL be properly quoted and escaped.

#### Scenario: Field with comma is quoted
- **WHEN** a field value contains a comma
- **THEN** the written CSV SHALL wrap the field in double quotes

#### Scenario: Field with quote is escaped
- **WHEN** a field value contains a double quote
- **THEN** the written CSV SHALL escape it by doubling the quote character
