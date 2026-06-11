## MODIFIED Requirements

### Requirement: Connector script interface

The system SHALL define a standard interface that connector scripts must implement: `fetch(context)` to retrieve raw upstream data, `transform(rawData, context)` to convert it to `CanonicalData`, optionally `push(changes, context)` to write local changes back upstream, and optionally `fetchDetail(id, type, context)` with `transformDetail(rawData, context)` to lazily fetch rich detail for a single project or task.

#### Scenario: Connector exports both functions

- **WHEN** a connector script exports both `fetch` and `transform` functions
- **THEN** the system recognizes it as a valid connector

#### Scenario: Connector exports all three functions

- **WHEN** a connector script exports `fetch`, `transform`, and `push` functions
- **THEN** the system recognizes it as a bidirectional connector capable of both read and write

#### Scenario: Connector exports detail methods

- **WHEN** a connector script exports `fetchDetail` and `transformDetail` alongside `fetch` and `transform`
- **THEN** the system recognizes it as supporting on-demand detail loading

#### Scenario: Connector missing required export

- **WHEN** a connector script does not export `fetch` or `transform`
- **THEN** the system SHALL reject the connector with an error message indicating which export is missing

#### Scenario: Transform returns CanonicalData

- **WHEN** a connector's `transform` function returns an object conforming to the `CanonicalData` structure (with `tasks`, `persons`, `projects` arrays)
- **THEN** the system SHALL accept and store the output

#### Scenario: Transform returns invalid data

- **WHEN** a connector's `transform` function returns data not conforming to `CanonicalData` (missing required fields, wrong types)
- **THEN** the system SHALL reject the output with a validation error describing the mismatch
