import type { Task, LocalTask, TaskOverride, EditsOverlay, Conflict, FieldWithSource, FieldSource, CacheFile } from './index';

// ============================================================
// Status cascade
// ============================================================

/**
 * Apply project→tasks status cascade: when a project is 'completed',
 * all its non-cancelled tasks become 'completed'.
 * Also handles tasks→project: when all non-cancelled tasks in a project
 * are 'completed' and no manual project override exists, mark project completed.
 * Returns the updated tasks with cascade applied.
 */
export function applyStatusCascade(
  tasks: LocalTask[],
  caches: CacheFile[],
  edits: EditsOverlay,
): LocalTask[] {
  // Build a map of effective project status
  const projectStatuses = new Map<string, string>();

  for (const cache of caches) {
    for (const project of cache.projects) {
      // Check for project overrides first
      const projectOverride = edits.projectOverrides?.[project.id];
      const effectiveStatus = projectOverride?.status ?? project.status ?? 'pending';
      projectStatuses.set(project.id, effectiveStatus);
    }
  }

  // Project→tasks cascade: completed project forces all non-cancelled tasks to completed
  for (const task of tasks) {
    const projectId = task.projectId.value;
    if (!projectId) continue;
    const projectStatus = projectStatuses.get(projectId);
    if (projectStatus === 'completed' && task.status.value !== 'cancelled') {
      task.status = { value: 'completed', source: 'upstream' };
    }
  }

  // Tasks→project cascade: if all non-cancelled tasks in a project are completed
  // and no manual project override exists, mark the project as completed
  const projectTaskCounts = new Map<string, { total: number; completed: number; cancelled: number }>();

  for (const task of tasks) {
    const projectId = task.projectId.value;
    if (!projectId) continue;
    if (!projectTaskCounts.has(projectId)) {
      projectTaskCounts.set(projectId, { total: 0, completed: 0, cancelled: 0 });
    }
    const counts = projectTaskCounts.get(projectId)!;
    counts.total++;
    if (task.status.value === 'completed') counts.completed++;
    if (task.status.value === 'cancelled') counts.cancelled++;
  }

  for (const [projectId, counts] of projectTaskCounts) {
    const nonCancelled = counts.total - counts.cancelled;
    if (nonCancelled > 0 && counts.completed >= nonCancelled) {
      // All non-cancelled tasks are completed — mark project completed
      // Only if no manual override prevents it
      const hasManualOverride = edits.projectOverrides?.[projectId]?.status !== undefined;
      if (!hasManualOverride) {
        projectStatuses.set(projectId, 'completed');
      }
    }
  }

  return tasks;
}

// ============================================================
// Merge single task
// ============================================================

const EDITABLE_FIELDS = [
  'title', 'startDate', 'endDate', 'progress', 'status',
  'personId', 'projectId', 'parentId', 'dependencies', 'tags',
] as const;

type EditableField = typeof EDITABLE_FIELDS[number];

function fieldWithSource<T>(value: T, source: FieldSource): FieldWithSource<T> {
  return { value, source };
}

/**
 * Merge a single upstream Task with any user overrides.
 * Returns a LocalTask with per-field source tracking.
 */
export function mergeFields(
  task: Task,
  overrides: TaskOverride | undefined,
  connectorId: string,
): LocalTask {
  const ov = overrides ?? {};

  function get<T>(field: EditableField, upstreamVal: T): FieldWithSource<T> {
    if (field in ov) {
      return fieldWithSource(ov[field] as T, 'manual');
    }
    return fieldWithSource(upstreamVal, 'upstream');
  }

  return {
    id: task.id,
    title: get('title', task.title),
    startDate: get('startDate', task.startDate ?? null),
    endDate: get('endDate', task.endDate ?? null),
    progress: get('progress', task.progress ?? 0),
    status: get('status', task.status ?? 'pending'),
    personId: get('personId', task.personId ?? null),
    projectId: get('projectId', task.projectId ?? null),
    parentId: get('parentId', task.parentId ?? null),
    dependencies: get('dependencies', task.dependencies ?? []),
    tags: get('tags', task.tags ?? []),
    url: fieldWithSource(task.url ?? null, 'upstream'),   // url is not user-editable
    metadata: task.metadata ?? {},
    connectorId,
    upstreamId: task.id,
    upstreamDeleted: false,
  };
}

/**
 * Convert a locally-created task to a LocalTask (all fields manual).
 */
function localToLocalTask(task: Task): LocalTask {
  return {
    id: task.id,
    title: fieldWithSource(task.title, 'manual'),
    startDate: fieldWithSource(task.startDate ?? null, 'manual'),
    endDate: fieldWithSource(task.endDate ?? null, 'manual'),
    progress: fieldWithSource(task.progress ?? 0, 'manual'),
    status: fieldWithSource(task.status ?? 'pending', 'manual'),
    personId: fieldWithSource(task.personId ?? null, 'manual'),
    projectId: fieldWithSource(task.projectId ?? null, 'manual'),
    parentId: fieldWithSource(task.parentId ?? null, 'manual'),
    dependencies: fieldWithSource(task.dependencies ?? [], 'manual'),
    tags: fieldWithSource(task.tags ?? [], 'manual'),
    url: fieldWithSource(task.url ?? null, 'manual'),
    metadata: task.metadata ?? {},
    connectorId: null,
    upstreamId: null,
    upstreamDeleted: false,
  };
}

// ============================================================
// Merge all tasks
// ============================================================

/**
 * Merge upstream tasks with user edits.
 * - Applies field-level overrides from edits.overrides
 * - Appends localTasks from edits.localTasks
 * - Marks upstream-deleted tasks that have manual overrides
 * - Filters out hidden tasks
 */
export function mergeTasks(
  cachedTasks: Task[],
  edits: EditsOverlay,
  connectorId: string,
): LocalTask[] {
  const overrideMap = edits.overrides ?? {};
  const hidden = new Set(edits.hidden ?? []);
  const deleted = new Set(edits.deletedTasks ?? []);
  const result: LocalTask[] = [];

  // 1. Merge cached tasks with overrides
  for (const task of cachedTasks) {
    if (hidden.has(task.id)) continue;
    if (deleted.has(task.id)) continue;
    const overrides = overrideMap[task.id];
    result.push(mergeFields(task, overrides, connectorId));
  }

  // 2. Handle tasks that have overrides but were deleted upstream
  for (const [taskId, overrides] of Object.entries(overrideMap)) {
    const stillExists = cachedTasks.some(t => t.id === taskId);
    if (!stillExists) {
      // Create a synthetic LocalTask from overrides only
      const synthetic: Task = {
        id: taskId,
        title: overrides.title ?? taskId,
        ...overrides,
      };
      const local = mergeFields(synthetic, overrides, connectorId);
      local.upstreamDeleted = true;
      result.push(local);
    }
  }

  // 3. Append locally-created tasks
  for (const localTask of edits.localTasks ?? []) {
    if (hidden.has(localTask.id)) continue;
    result.push(localToLocalTask(localTask));
  }

  return result;
}

// ============================================================
// Detect conflicts
// ============================================================

/**
 * Detect conflicts where upstream changed a field that the user has manually edited.
 */
export function detectConflicts(
  cachedTasks: Task[],
  edits: EditsOverlay,
): Conflict[] {
  const conflicts: Conflict[] = [];
  const overrideMap = edits.overrides ?? {};

  for (const task of cachedTasks) {
    const overrides = overrideMap[task.id];
    if (!overrides) continue;

    for (const field of EDITABLE_FIELDS) {
      if (!(field in overrides)) continue;

      const upstreamVal = task[field];
      const manualVal = (overrides as Record<string, unknown>)[field];

      // Conflict: upstream changed from what we overrode
      if (upstreamVal !== manualVal) {
        conflicts.push({
          taskId: task.id,
          field,
          upstreamValue: upstreamVal,
          manualValue: manualVal,
        });
      }
    }
  }

  return conflicts;
}

// ============================================================
// Reset a field override
// ============================================================

/**
 * Apply a field reset by returning the updated EditsOverlay
 * with the specified field override removed.
 * Returns null if there was no override to remove.
 */
export function applyFieldReset(
  edits: EditsOverlay,
  taskId: string,
  fieldName: EditableField,
): EditsOverlay | null {
  const overrides = edits.overrides[taskId];
  if (!overrides || !(fieldName in overrides)) {
    return null;
  }

  const newOverrides = { ...overrides };
  delete (newOverrides as Record<string, unknown>)[fieldName];

  const newOverrideMap = { ...edits.overrides };

  if (Object.keys(newOverrides).length === 0) {
    delete newOverrideMap[taskId];
  } else {
    newOverrideMap[taskId] = newOverrides;
  }

  return {
    ...edits,
    overrides: newOverrideMap,
  };
}

// ============================================================
// Full merge pipeline (cache files + edits → LocalTask[])
// ============================================================

/**
 * Run the full merge pipeline: combine multiple cache files with edits.
 */
export function mergeAll(
  caches: CacheFile[],
  edits: EditsOverlay,
): LocalTask[] {
  const allTasks: LocalTask[] = [];

  for (const cache of caches) {
    const merged = mergeTasks(cache.tasks, edits, cache.connectorId);
    allTasks.push(...merged);
  }

  return applyStatusCascade(allTasks, caches, edits);
}
