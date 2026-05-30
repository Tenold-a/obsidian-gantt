## ADDED Requirements

### Requirement: CSV connector script exports fetch and transform
The CSV connector script SHALL export a `fetch` function that reads and parses a CSV file, and a `transform` function that converts parsed records to `CanonicalData`.

#### Scenario: Fetch reads CSV file via readFile
- **WHEN** the CSV connector's `fetch` function is called with a context containing `config.csvPath`
- **THEN** the function SHALL call `ctx.readFile(config.csvPath)` to read the CSV file content
- **AND** SHALL call `ctx.parseCSV(content, { delimiter: config.delimiter ?? ',' })` to parse the content into record arrays
- **AND** SHALL return the parsed records

#### Scenario: Fetch reports missing csvPath config
- **WHEN** the CSV connector's `fetch` function is called and `config.csvPath` is not set
- **THEN** the function SHALL throw an error with a message indicating that `csvPath` is required

#### Scenario: Fetch reports file read error
- **WHEN** the CSV connector's `fetch` function is called and `ctx.readFile` fails
- **THEN** the function SHALL throw an error with the original error message

### Requirement: CSV connector transform maps columns to CanonicalData
The CSV connector's `transform` function SHALL map CSV records to `CanonicalData` using a configurable column mapping, and SHALL deduplicate persons and projects by ID.

#### Scenario: Transform with default Chinese column mapping
- **WHEN** `transform` receives records with columns 项目, 任务, 人员, 需求方 and no `columnMapping` config
- **THEN** each record SHALL produce a Task with `id` from the 项目+任务 columns combined, `title` from 任务, `projectId` from 项目, `personId` from 人员
- **AND** `persons` array SHALL contain unique entries with `id` and `name` from 人员 column
- **AND** `projects` array SHALL contain unique entries with `id` and `name` from 项目 column, and `requester` from 需求方 column

#### Scenario: Transform with custom column mapping
- **WHEN** `transform` receives records and `config.columnMapping` remaps fields to different CSV columns
- **THEN** the mapping SHALL use the configured column names instead of defaults

#### Scenario: Transform deduplicates persons by ID
- **WHEN** multiple CSV rows have the same person ID
- **THEN** the `persons` array SHALL contain only one entry per unique person ID
- **AND** the last occurrence of the person name SHALL be used

#### Scenario: Transform deduplicates projects by ID
- **WHEN** multiple CSV rows have the same project ID
- **THEN** the `projects` array SHALL contain only one entry per unique project ID
- **AND** the last occurrence of the project name and requester SHALL be used

#### Scenario: Transform handles rows with missing optional fields
- **WHEN** a CSV row is missing the 需求方 (requester) column or it is empty
- **THEN** the project SHALL be created with `requester` undefined
- **AND** other fields SHALL still be populated from available columns

#### Scenario: Transform handles empty CSV
- **WHEN** `transform` receives an empty records array
- **THEN** the function SHALL return `CanonicalData` with all empty arrays (`tasks: [], persons: [], projects: []`)

### Requirement: CSV connector supports date fields
The CSV connector SHALL support optional start date and end date columns for tasks.

#### Scenario: Task with start and end dates
- **WHEN** a CSV row has values for the configured `startDate` and `endDate` columns
- **THEN** the resulting task SHALL have `startDate` and `endDate` set to those values

#### Scenario: Task without dates
- **WHEN** a CSV row has empty values for `startDate` and `endDate` columns
- **THEN** the task SHALL have `startDate` and `endDate` undefined
