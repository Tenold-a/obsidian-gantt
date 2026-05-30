## ADDED Requirements

### Requirement: CSV push updates task rows in-place
The CSV connector's `push()` method SHALL read the current `tasks.csv` file, locate each modified task by ID in the task ID column, update the corresponding cell values, and write the entire file back.

#### Scenario: Update task start date in CSV
- **WHEN** push receives a task `{ id: "api-design", startDate: "2026-06-05" }` and tasks.csv has a row where `id` column equals "api-design"
- **THEN** the `startDate` column in that row SHALL be updated to "2026-06-05"
- **AND** all other columns in that row SHALL remain unchanged

#### Scenario: Append new task to CSV
- **WHEN** push receives a task with an ID not found in tasks.csv
- **THEN** a new row SHALL be appended to tasks.csv with all provided field values

#### Scenario: Remove deleted task from CSV
- **WHEN** push receives `deletedTaskIds: ["api-design"]` and tasks.csv has a matching row
- **THEN** that row SHALL be removed from tasks.csv

### Requirement: CSV push handles persons and projects
The `push()` method SHALL update `persons.csv` for modified person fields and `projects.csv` for modified project fields, using the same update-in-place logic.

#### Scenario: Update person name
- **WHEN** push receives a person `{ id: "zhangsan", name: "张三丰" }` in the projects payload
- **THEN** the corresponding row in persons.csv SHALL be updated

#### Scenario: Update project requester
- **WHEN** push receives a project `{ id: "api-refactor", requester: "赵六" }`
- **THEN** the corresponding row in projects.csv SHALL be updated

### Requirement: CSV serialization handles special characters
When writing CSV rows, fields containing commas, quotes, or newlines SHALL be properly quoted and escaped.

#### Scenario: Field with comma is quoted
- **WHEN** a field value contains a comma (e.g., "Engineer, Senior")
- **THEN** the written CSV SHALL wrap the field in double quotes

#### Scenario: Field with quote is escaped
- **WHEN** a field value contains a double quote
- **THEN** the written CSV SHALL escape it by doubling the quote character
