## ADDED Requirements

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
