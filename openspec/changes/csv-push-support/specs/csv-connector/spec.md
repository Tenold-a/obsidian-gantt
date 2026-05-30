## ADDED Requirements

### Requirement: CSV connector exports push function
The CSV connector script SHALL export a `push` function that writes modified tasks, persons, and projects back to the configured CSV files.

#### Scenario: Push writes to configured paths
- **WHEN** `push(payload, ctx)` is called and `ctx.config.paths` contains `{ tasks: "data/tasks.csv", ... }`
- **THEN** the connector SHALL write updated data to the same paths used for reading

#### Scenario: Push with no paths configured reports error
- **WHEN** `push(payload, ctx)` is called and no `paths` are configured
- **THEN** `push` SHALL return `{ success: false, error: "No CSV paths configured" }`

#### Scenario: Push requires writeFile
- **WHEN** `push(payload, ctx)` is called and `ctx.writeFile` is not available
- **THEN** `push` SHALL return `{ success: false, error: "ctx.writeFile is not available on this platform" }`
