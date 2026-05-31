## MODIFIED Requirements

### Requirement: Project overrides in edits overlay
The project overrides in the edits overlay SHALL support the following fields: `name`, `status`, `description`, `requester`, `keyDates`, `keyLinks`, and `tags`. The `tags` value SHALL be an array of strings (`string[]`).

#### Scenario: Project tags persisted in project overrides
- **WHEN** a user adds or removes tags from a project
- **THEN** the updated tags array SHALL be stored in `projectOverrides[projectId].tags` in the edits file

#### Scenario: Project without tag override uses upstream tags
- **WHEN** a project has upstream tags but no tag override in the edits file
- **THEN** the project SHALL display the upstream tags

#### Scenario: Empty tags override clears upstream tags
- **WHEN** a user removes all tags from a project that had upstream tags
- **THEN** the edits file SHALL store `"tags": []` in the project override, and the project SHALL display no tags

### Requirement: Tags field in merge engine
The merge engine SHALL respect the `tags` field in project overrides when computing merged projects. When a `tags` override exists, it SHALL replace the upstream `tags` value.

#### Scenario: Tags override applied during merge
- **WHEN** the merge engine processes a project with `projectOverrides[projectId].tags = ["backend"]`
- **THEN** the merged project SHALL have `tags: ["backend"]` regardless of the upstream value

#### Scenario: No tags override during merge
- **WHEN** the merge engine processes a project with no tags override
- **THEN** the merged project SHALL use the upstream `tags` value (or empty array if none)
