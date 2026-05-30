## Purpose

[brief description]
## Requirements
### Requirement: Three-file storage separation
The system SHALL separate local data into three file categories: `cache/` for upstream data snapshots (machine-written, disposable), `edits/` for user overrides (human-created, precious), and `views/` for display configuration (human-configured).

#### Scenario: Cache file creation after fetch
- **WHEN** a connector's `fetch()` completes successfully
- **THEN** the system SHALL write the full upstream `CanonicalData` to `cache/<connector-id>.json`

#### Scenario: Edits file persists user changes
- **WHEN** a user modifies a task field via drag-and-drop or manual input
- **THEN** the system SHALL write only the changed fields to `edits/<view-id>.json` under the `overrides` key

#### Scenario: View file stores display configuration
- **WHEN** a user creates or modifies a Gantt chart view
- **THEN** the system SHALL write the view definition to `views/<view-id>.json`

### Requirement: Edits overlay schema
The edits file (`edits/<view-id>.json`) SHALL contain: `viewId` (string), `overrides` (map of task ID to partial Task fields), `order` (ordered array of task IDs), `hidden` (array of hidden task IDs), and `localTasks` (array of full Task objects with no upstream source).

#### Scenario: Field override
- **WHEN** a user drags a task bar to change its start date from "2026-05-01" to "2026-05-10"
- **THEN** the system SHALL write `{"overrides": {"<taskId>": {"startDate": "2026-05-10"}}}` to the edits file

#### Scenario: Manual task order
- **WHEN** a user reorders tasks in the list
- **THEN** the system SHALL update the `order` array in the edits file

#### Scenario: Hidden task
- **WHEN** a user hides a task from the view
- **THEN** the task's ID SHALL be added to the `hidden` array in the edits file

#### Scenario: Locally created task
- **WHEN** a user creates a new task (e.g., by dragging a project card to the timeline)
- **THEN** the full task object SHALL be appended to the `localTasks` array in the edits file

### Requirement: Field-level source tracking
The system SHALL track the source of each editable field on a Task as either `"upstream"` (from connector data) or `"manual"` (set by user action). This tracking SHALL occur at runtime during the merge step and SHALL NOT be persisted to the edits file (edits only store values, not source).

#### Scenario: Upstream field not overridden
- **WHEN** a task's `startDate` comes from upstream and the user has not edited it
- **THEN** the field's source is `"upstream"` and the value is the upstream value

#### Scenario: User-overridden field
- **WHEN** a user edits a task's `startDate` via drag-and-drop
- **THEN** the field's source SHALL become `"manual"` and the value SHALL be the user-set value

#### Scenario: Refresh preserves manual fields
- **WHEN** the system refreshes from upstream
- **THEN** fields with source `"manual"` SHALL retain their user-set values
- **AND** fields with source `"upstream"` SHALL update to the latest upstream values

### Requirement: Refresh merge engine
The system SHALL implement a merge engine that combines upstream cache data with user edits at view load time. The merge SHALL run in one direction: `merge(cache, edits) → runtime tasks with source tracking`.

#### Scenario: New task from upstream appears
- **WHEN** a refresh brings a new task that did not exist before
- **THEN** the task SHALL appear in the view with all fields marked `source: "upstream"`

#### Scenario: Task removed from upstream but user edited it
- **WHEN** a refresh finds a task was removed from upstream, but the user had manual overrides on it
- **THEN** the task SHALL be retained with all fields marked `source: "manual"` and a warning indicator displayed

#### Scenario: Task removed from upstream with no user edits
- **WHEN** a refresh finds a task was removed from upstream and the user had no edits on it
- **THEN** the task SHALL be removed from the view

#### Scenario: Reset field to upstream value
- **WHEN** a user chooses "Reset to upstream" on a manually-edited field
- **THEN** the field's override SHALL be removed from the edits file and the field SHALL revert to the upstream value

### Requirement: Cache file structure
Each cache file (`cache/<connector-id>.json`) SHALL contain: `connectorId` (string), `lastFetch` (ISO timestamp), `lastError` (string or null), `tasks` (Task[]), `persons` (Person[]), `projects` (Project[]).

#### Scenario: Successful fetch updates cache
- **WHEN** a refresh completes without errors
- **THEN** `lastFetch` SHALL be updated, `lastError` SHALL be null, and all entity arrays SHALL contain the latest upstream data

#### Scenario: Failed fetch preserves previous cache
- **WHEN** a refresh fails with an error
- **THEN** `lastError` SHALL be updated with the error message, the previous entity arrays SHALL be preserved, and the UI SHALL show a warning

### Requirement: View definition schema
A view file (`views/<view-id>.json`) SHALL contain: `id` (string), `name` (string), `connectors` (array of connector ID references), and `display` (object with `defaultGroupBy`, `visibleColumns`, and optional display settings).

#### Scenario: View references multiple connectors
- **WHEN** a view configuration lists `connectors: ["my-jira", "team-linear"]`
- **THEN** the system SHALL fetch and merge data from both connectors for that view

### Requirement: Platform-agnostic storage interface
The local data store SHALL operate through the `IStorage` interface (`read`, `write`, `delete`, `list` methods) and SHALL NOT directly access platform-specific APIs.

#### Scenario: Storage operations through interface
- **WHEN** the merge engine needs to read the cache file
- **THEN** it SHALL call `storage.read("cache/<connector-id>.json")` through the injected `IStorage` implementation

### Requirement: Status field in edits overlay
The edits overlay SHALL support `status` as an overridable field on task overrides and project overrides. The status value SHALL be one of: `'pending'`, `'in-progress'`, `'cancelled'`, `'pending-online'`, `'online'`, `'completed'`.

#### Scenario: Task status persisted in overrides
- **WHEN** a user changes a task's status
- **THEN** the new status SHALL be stored in `overrides[taskId].status` in the edits file

#### Scenario: Project status persisted in project overrides
- **WHEN** a user changes a project's status
- **THEN** the new status SHALL be stored in `projectOverrides[projectId].status` in the edits file

### Requirement: Project name override support
The project overrides in the edits overlay SHALL support the `name` field, allowing users to rename projects locally.

#### Scenario: Project name persisted in project overrides
- **WHEN** a user edits a project's name
- **THEN** the new name SHALL be stored in `projectOverrides[projectId].name` in the edits file

### Requirement: Deletion tracking in edits overlay
The edits overlay SHALL support `deletedTasks` (array of task ID strings) and `deletedProjects` (array of project ID strings) to track soft-deleted entities.

#### Scenario: Deleted task ID stored
- **WHEN** a user deletes a task
- **THEN** the task ID SHALL be appended to `deletedTasks` in the edits file

#### Scenario: Deleted project ID stored
- **WHEN** a user deletes a project
- **THEN** the project ID SHALL be appended to `deletedProjects` in the edits file

#### Scenario: Edits file backward compatibility
- **WHEN** loading an edits file that does not contain `deletedTasks` or `deletedProjects` fields
- **THEN** the system SHALL treat them as empty arrays

### Requirement: Merge engine excludes deleted entities
The merge engine SHALL filter out tasks whose IDs appear in `deletedTasks` and projects whose IDs appear in `deletedProjects`.

#### Scenario: Deleted upstream task excluded from merge
- **WHEN** a task ID is present in `deletedTasks`
- **THEN** the merge engine SHALL exclude that task from the merged output regardless of its presence in cache or overrides

#### Scenario: Deleted local task removed
- **WHEN** a locally-created task is deleted
- **THEN** the task SHALL be removed from `localTasks` array in the edits file

#### Scenario: Deleted project excluded from merge
- **WHEN** a project ID is present in `deletedProjects`
- **THEN** the merge engine SHALL exclude that project from the merged project output

### Requirement: Status cascade in merge engine
The merge engine SHALL apply status cascading logic: when a project is completed, all its non-cancelled tasks become completed; when all non-cancelled tasks in a project are completed, the project becomes completed.

#### Scenario: Project completion cascades to tasks during merge
- **WHEN** the merge engine processes data where a project has status `'completed'`
- **THEN** all tasks belonging to that project SHALL have their effective status set to `'completed'` unless the task status is `'cancelled'`

#### Scenario: All tasks completed auto-completes project during merge
- **WHEN** the merge engine processes data where all non-cancelled tasks in a project have status `'completed'` and no project status override exists
- **THEN** the project's effective status SHALL be `'completed'`

#### Scenario: Manual project status override prevents auto-completion
- **WHEN** a user has manually set a project status to a non-completed value
- **THEN** the tasks-to-project cascade SHALL NOT override the manual project status

