## ADDED Requirements

### Requirement: CSV parser parses header row and data rows
The system SHALL provide a `parseCSV` function in `gantt-core` that accepts a CSV text string and returns an array of record objects keyed by header row values.

#### Scenario: Parse simple CSV with headers
- **WHEN** `parseCSV` is called with text `"name,age\nAlice,30\nBob,25"`
- **THEN** the function SHALL return `[{name: "Alice", age: "30"}, {name: "Bob", age: "25"}]`

#### Scenario: Parse CSV with quoted fields
- **WHEN** `parseCSV` is called with text containing `"Name,Description\nAlice,"Engineer, Senior""`
- **THEN** the comma inside the quoted field SHALL be treated as part of the value, not a delimiter
- **AND** the second record SHALL have `Description: "Engineer, Senior"`

#### Scenario: Parse CSV with escaped quotes
- **WHEN** `parseCSV` is called with text containing doubled quotes (`""`) inside a quoted field
- **THEN** each pair of doubled quotes SHALL be unescaped to a single quote character in the value

#### Scenario: Parse CSV with empty fields
- **WHEN** `parseCSV` is called with text containing consecutive delimiters (e.g., `"a,,c"`)
- **THEN** the empty field SHALL be represented as an empty string `""`

#### Scenario: Parse CSV with only header row
- **WHEN** `parseCSV` is called with text containing only a header row and no data rows
- **THEN** the function SHALL return an empty array `[]`

#### Scenario: Parse empty string
- **WHEN** `parseCSV` is called with an empty string
- **THEN** the function SHALL return an empty array `[]`

### Requirement: CSV parser supports configurable delimiter
The `parseCSV` function SHALL accept an optional `CsvParseOptions` parameter with a `delimiter` field.

#### Scenario: Parse tab-delimited CSV
- **WHEN** `parseCSV` is called with text using tabs as delimiters and `{ delimiter: "\t" }`
- **THEN** the function SHALL correctly split fields on tab characters instead of commas

#### Scenario: Default delimiter is comma
- **WHEN** `parseCSV` is called without a `delimiter` option
- **THEN** the function SHALL use comma (`,`) as the delimiter

### Requirement: CSV parser handles BOM and whitespace
The `parseCSV` function SHALL handle UTF-8 BOM markers and trim insignificant whitespace around fields.

#### Scenario: Strip UTF-8 BOM from first header
- **WHEN** `parseCSV` is called with text starting with a UTF-8 BOM (`﻿`) before the first header
- **THEN** the BOM SHALL be stripped and the first header SHALL be parsed correctly

#### Scenario: Preserve significant whitespace in quoted fields
- **WHEN** `parseCSV` is called with a quoted field containing leading/trailing spaces (e.g., `"  padded  "`)
- **THEN** the spaces inside quotes SHALL be preserved in the value

### Requirement: CsvParseOptions type definition
The `CsvParseOptions` interface SHALL be exported from `gantt-core` with the following shape:

```typescript
export interface CsvParseOptions {
  delimiter?: string;  // default: ','
}
```

#### Scenario: Type is importable
- **WHEN** another module imports `CsvParseOptions` from `@obsidian-gantt/core`
- **THEN** the type SHALL be available with `delimiter` as an optional string field
