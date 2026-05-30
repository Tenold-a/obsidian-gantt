import { signal, computed, batch } from '@preact/signals';
import type {
  GanttPlatform,
  LocalTask,
  Task,
  Person,
  Project,
  EditsOverlay,
  CacheFile,
  ViewDefinition,
  Conflict,
  PushChangesPayload,
} from '@obsidian-gantt/core';
import {
  mergeAll,
  detectConflicts,
  applyFieldReset,
  computeTimelineRange,
} from '@obsidian-gantt/core';

export interface PersonGroup {
  personId: string;
  personName: string;
  position?: string;
  tasks: LocalTask[];
}

export interface ProjectGroup {
  projectId: string;
  projectName: string;
  color: string | undefined;
  tasks: LocalTask[];
}

export interface SelectedEntity {
  type: 'project' | 'task' | 'person';
  id: string;
}

export interface FieldChange {
  field: string;
  label: string;
  newValue: unknown;
}

export interface PendingEntityChange {
  entityId: string;
  entityType: 'task' | 'project';
  entityName: string;
  changeType: 'modified' | 'added' | 'deleted';
  /** For modified entities: which fields changed */
  fields?: FieldChange[];
  /** For added tasks: task data summary */
  addedSummary?: Record<string, unknown>;
  /** For deleted entities: associated info */
  relatedInfo?: string;
}

export interface GanttStore {
  // Data signals
  caches: ReturnType<typeof signal<CacheFile[]>>;
  edits: ReturnType<typeof signal<EditsOverlay | null>>;
  views: ReturnType<typeof signal<ViewDefinition[]>>;
  currentViewId: ReturnType<typeof signal<string | null>>;

  // Derived data
  mergedTasks: ReturnType<typeof computed<LocalTask[]>>;
  persons: ReturnType<typeof computed<Person[]>>;
  projects: ReturnType<typeof computed<Project[]>>;
  mergedProjects: ReturnType<typeof computed<Project[]>>;
  personGroups: ReturnType<typeof computed<PersonGroup[]>>;
  projectGroups: ReturnType<typeof computed<ProjectGroup[]>>;
  unassignedProjects: ReturnType<typeof computed<Project[]>>;

  // Sort mode
  personSortMode: ReturnType<typeof signal<'name' | 'position'>>;

  // Selection & highlight
  selectedEntity: ReturnType<typeof signal<SelectedEntity | null>>;
  highlightedTaskIds: ReturnType<typeof computed<Set<string>>>;

  // Scroll
  sharedScrollLeft: ReturnType<typeof signal<number>>;
  personScrollTop: ReturnType<typeof signal<number>>;
  projectScrollTop: ReturnType<typeof signal<number>>;

  // Timeline range
  timelineRange: ReturnType<typeof computed<{ startDate: string; endDate: string }>>;

  // Conflicts
  conflicts: ReturnType<typeof computed<Conflict[]>>;

  // Pending changes
  pendingChanges: ReturnType<typeof computed<PendingEntityChange[]>>;

  // Loading state
  isLoading: ReturnType<typeof signal<boolean>>;
  error: ReturnType<typeof signal<string | null>>;

  // Actions
  loadView(viewId: string): Promise<void>;
  refreshConnector(connectorId: string): Promise<void>;
  persistEdit(taskId: string, fieldName: string, value: unknown): Promise<void>;
  resetField(taskId: string, fieldName: string): Promise<void>;
  createLocalTask(task: Task): Promise<void>;
  persistProjectEdit(projectId: string, fieldName: string, value: unknown): Promise<void>;
  selectEntity(entity: SelectedEntity | null): void;
  deleteTask(taskId: string): Promise<void>;
  deleteProject(projectId: string): Promise<void>;
  setTaskStatus(taskId: string, status: string): Promise<void>;
  setProjectStatus(projectId: string, status: string): Promise<void>;
  pushChanges(): Promise<{ connectorId: string; success: boolean; error?: string }[]>;
}

const DAY_WIDTH = 30;
const SCROLL_GUARD_DURATION = 100; // ms

/** Sanitize a file-name segment: replace characters invalid on Windows/Unix with "_". */
function safeName(name: string): string {
  return name.replace(/[\\/:*?"<>|]/g, '_');
}

export function createGanttStore(platform: GanttPlatform): GanttStore {
  // ── State signals ──
  const caches = signal<CacheFile[]>([]);
  const edits = signal<EditsOverlay | null>(null);
  const views = signal<ViewDefinition[]>([]);
  const currentViewId = signal<string | null>(null);
  const selectedEntity = signal<SelectedEntity | null>(null);
  const sharedScrollLeft = signal<number>(0);
  const personScrollTop = signal<number>(0);
  const projectScrollTop = signal<number>(0);
  const personSortMode = signal<'name' | 'position'>('name');
  const isLoading = signal<boolean>(false);
  const error = signal<string | null>(null);

  // Scroll sync guard
  let scrollGuardActive = false;
  let scrollGuardTimer: ReturnType<typeof setTimeout> | null = null;

  function syncScrollTo(value: number) {
    if (!scrollGuardActive) {
      scrollGuardActive = true;
      sharedScrollLeft.value = value;
      if (scrollGuardTimer) clearTimeout(scrollGuardTimer);
      scrollGuardTimer = setTimeout(() => {
        scrollGuardActive = false;
      }, SCROLL_GUARD_DURATION);
    }
  }

  // Vertical scroll guards (per-pane to allow independent scroll)
  let personScrollGuardActive = false;
  let personScrollGuardTimer: ReturnType<typeof setTimeout> | null = null;
  let projectScrollGuardActive = false;
  let projectScrollGuardTimer: ReturnType<typeof setTimeout> | null = null;

  function syncPersonScrollTop(value: number) {
    if (!personScrollGuardActive) {
      personScrollGuardActive = true;
      personScrollTop.value = value;
      if (personScrollGuardTimer) clearTimeout(personScrollGuardTimer);
      personScrollGuardTimer = setTimeout(() => {
        personScrollGuardActive = false;
      }, SCROLL_GUARD_DURATION);
    }
  }

  function syncProjectScrollTop(value: number) {
    if (!projectScrollGuardActive) {
      projectScrollGuardActive = true;
      projectScrollTop.value = value;
      if (projectScrollGuardTimer) clearTimeout(projectScrollGuardTimer);
      projectScrollGuardTimer = setTimeout(() => {
        projectScrollGuardActive = false;
      }, SCROLL_GUARD_DURATION);
    }
  }

  // ── Derived signals ──
  const mergedTasks = computed<LocalTask[]>(() => {
    const currentEdits = edits.value;
    const currentCaches = caches.value;
    if (!currentEdits || currentCaches.length === 0) return [];
    return mergeAll(currentCaches, currentEdits);
  });

  const persons = computed<Person[]>(() => {
    const personMap = new Map<string, Person>();
    for (const cache of caches.value) {
      for (const p of cache.persons) {
        personMap.set(p.id, p);
      }
    }
    return [...personMap.values()];
  });

  const projects = computed<Project[]>(() => {
    const projectMap = new Map<string, Project>();
    for (const cache of caches.value) {
      for (const p of cache.projects) {
        projectMap.set(p.id, p);
      }
    }
    return [...projectMap.values()];
  });

  const mergedProjects = computed<Project[]>(() => {
    const overrides = edits.value?.projectOverrides ?? {};
    const deletedProjects = new Set(edits.value?.deletedProjects ?? []);
    return projects.value
      .filter(p => !deletedProjects.has(p.id))
      .map(p => {
        const override = overrides[p.id];
        if (!override) return p;
        return { ...p, ...override };
      });
  });

  const personGroups = computed<PersonGroup[]>(() => {
    const map = new Map<string, LocalTask[]>();
    const personMap = new Map(persons.value.map(p => [p.id, p]));

    for (const t of mergedTasks.value) {
      const key = t.personId.value || '__unassigned__';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(t);
    }

    const groups: PersonGroup[] = [];
    for (const [personId, tasks] of map) {
      const person = personMap.get(personId);
      groups.push({
        personId,
        personName: person?.name ?? 'Unassigned',
        position: person?.position,
        tasks,
      });
    }

    const mode = personSortMode.value;

    groups.sort((a, b) => {
      if (a.personId === '__unassigned__') return 1;
      if (b.personId === '__unassigned__') return -1;

      if (mode === 'position') {
        const pa = a.position;
        const pb = b.position;
        if (pa && pb) return pa.localeCompare(pb);
        if (pa && !pb) return -1;
        if (!pa && pb) return 1;
      }

      return a.personName.localeCompare(b.personName);
    });

    return groups;
  });

  const projectGroups = computed<ProjectGroup[]>(() => {
    const map = new Map<string, LocalTask[]>();
    const projectInfoMap = new Map(projects.value.map(p => [p.id, p]));

    for (const t of mergedTasks.value) {
      const key = t.projectId.value || '__no_project__';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(t);
    }

    const groups: ProjectGroup[] = [];
    for (const [projectId, tasks] of map) {
      const info = projectInfoMap.get(projectId);
      groups.push({
        projectId,
        projectName: info?.name ?? projectId,
        color: info?.color,
        tasks,
      });
    }

    groups.sort((a, b) => a.projectName.localeCompare(b.projectName));
    return groups;
  });

  const unassignedProjects = computed<Project[]>(() => {
    const taskProjectIds = new Set(
      mergedTasks.value.map(t => t.projectId.value).filter(Boolean),
    );
    const localTaskProjectIds = new Set<string>();
    if (edits.value) {
      for (const lt of edits.value.localTasks) {
        if (lt.projectId) localTaskProjectIds.add(lt.projectId);
      }
    }
    return projects.value.filter(
      p => !taskProjectIds.has(p.id) && !localTaskProjectIds.has(p.id),
    );
  });

  const highlightedTaskIds = computed<Set<string>>(() => {
    const sel = selectedEntity.value;
    if (!sel) return new Set();

    if (sel.type === 'project') {
      return new Set(
        mergedTasks.value
          .filter(t => t.projectId.value === sel.id)
          .map(t => t.id),
      );
    }

    if (sel.type === 'task') {
      const task = mergedTasks.value.find(t => t.id === sel.id);
      if (!task) return new Set();
      const projectId = task.projectId.value;
      return new Set(
        mergedTasks.value
          .filter(t => t.projectId.value === projectId)
          .map(t => t.id),
      );
    }

    if (sel.type === 'person') {
      return new Set(
        mergedTasks.value
          .filter(t => t.personId.value === sel.id)
          .map(t => t.id),
      );
    }

    return new Set();
  });

  const timelineRange = computed(() => {
    const allDates: string[] = [];
    for (const t of mergedTasks.value) {
      if (t.startDate.value) allDates.push(t.startDate.value);
      if (t.endDate.value) allDates.push(t.endDate.value);
    }
    return computeTimelineRange(allDates, 7);
  });

  const conflicts = computed(() => {
    const currentEdits = edits.value;
    if (!currentEdits) return [];
    const allConflicts: Conflict[] = [];
    for (const cache of caches.value) {
      allConflicts.push(...detectConflicts(cache.tasks, currentEdits));
    }
    return allConflicts;
  });

  // ── Actions ──
  async function loadView(viewId: string): Promise<void> {
    isLoading.value = true;
    error.value = null;

    try {
      // Read view config
      const viewRaw = await platform.storage.read(`views/${safeName(viewId)}.json`);
      if (!viewRaw) throw new Error(`View not found: ${viewId}`);
      const view: ViewDefinition = JSON.parse(viewRaw);

      // Read edits
      const editsRaw = await platform.storage.read(`edits/${safeName(viewId)}.json`);
      const viewEdits: EditsOverlay = editsRaw
        ? JSON.parse(editsRaw)
        : { viewId, overrides: {}, order: [], hidden: [], localTasks: [] };

      // Read caches for each connector
      const loadedCaches: CacheFile[] = [];
      for (const connectorId of view.connectors) {
        const cacheRaw = await platform.storage.read(`cache/${safeName(connectorId)}.json`);
        if (cacheRaw) {
          loadedCaches.push(JSON.parse(cacheRaw));
        }
      }

      batch(() => {
        views.value = [...views.value.filter(v => v.id !== viewId), view];
        currentViewId.value = viewId;
        caches.value = loadedCaches;
        edits.value = viewEdits;
      });
    } catch (e) {
      error.value = e instanceof Error ? e.message : String(e);
    } finally {
      isLoading.value = false;
    }
  }

  async function refreshConnector(connectorId: string): Promise<void> {
    isLoading.value = true;
    error.value = null;

    try {
      // Read connector config — auto-create if missing
      const configPath = `connectors/${safeName(connectorId)}.json`;
      let configRaw = await platform.storage.read(configPath);
      let connConfig: Record<string, unknown>;
      if (configRaw) {
        connConfig = JSON.parse(configRaw);
      } else {
        // No config file yet — create a default one with default script path
        connConfig = { script: `connectors/${connectorId}.js` };
        await platform.storage.write(configPath, JSON.stringify(connConfig, null, 2));
        console.log(`[Gantt] Auto-created connector config: ${configPath}`);
      }
      const scriptPath = (connConfig.script as string) || `connectors/${safeName(connectorId)}.js`;

      // Load the connector module
      const mod = await platform.connectorLoader.load(scriptPath);

      // Create context with the connector's config
      const ctx = platform.createConnectorContext(connConfig);

      // Execute fetch → transform
      const rawData = await mod.fetch(ctx);
      const canonical = mod.transform(rawData, ctx);

      // Write cache
      const cache: CacheFile = {
        connectorId,
        lastFetch: new Date().toISOString(),
        lastError: null,
        tasks: canonical.tasks ?? [],
        persons: canonical.persons ?? [],
        projects: canonical.projects ?? [],
      };

      await platform.storage.write(`cache/${safeName(connectorId)}.json`, JSON.stringify(cache, null, 2));

      // Update store
      caches.value = [
        ...caches.value.filter(c => c.connectorId !== connectorId),
        cache,
      ];
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error(`[Gantt] Failed to refresh connector "${connectorId}":`, msg);
      error.value = msg;
    } finally {
      isLoading.value = false;
    }
  }

  async function persistEdit(taskId: string, fieldName: string, value: unknown): Promise<void> {
    const currentEdits = edits.value;
    const viewId = currentViewId.value;
    if (!currentEdits || !viewId) return;

    const overrides = { ...currentEdits.overrides };
    const taskOverrides = { ...(overrides[taskId] ?? {}) };
    (taskOverrides as Record<string, unknown>)[fieldName] = value;
    overrides[taskId] = taskOverrides;

    const updated: EditsOverlay = {
      ...currentEdits,
      overrides,
    };

    await platform.storage.write(`edits/${safeName(viewId)}.json`, JSON.stringify(updated, null, 2));
    edits.value = updated;
  }

  async function resetField(taskId: string, fieldName: string): Promise<void> {
    const currentEdits = edits.value;
    const viewId = currentViewId.value;
    if (!currentEdits || !viewId) return;

    const updated = applyFieldReset(currentEdits, taskId, fieldName as any);
    if (!updated) return;

    await platform.storage.write(`edits/${safeName(viewId)}.json`, JSON.stringify(updated, null, 2));
    edits.value = updated;
  }

  async function createLocalTask(task: Task): Promise<void> {
    const currentEdits = edits.value;
    const viewId = currentViewId.value;
    if (!currentEdits || !viewId) return;

    const updated: EditsOverlay = {
      ...currentEdits,
      localTasks: [...currentEdits.localTasks, task],
    };

    await platform.storage.write(`edits/${safeName(viewId)}.json`, JSON.stringify(updated, null, 2));
    edits.value = updated;
  }

  async function persistProjectEdit(projectId: string, fieldName: string, value: unknown): Promise<void> {
    const currentEdits = edits.value;
    const viewId = currentViewId.value;
    if (!currentEdits || !viewId) return;

    const projectOverrides = { ...(currentEdits.projectOverrides ?? {}) };
    const projectFields = { ...(projectOverrides[projectId] ?? {}) };
    (projectFields as Record<string, unknown>)[fieldName] = value;
    projectOverrides[projectId] = projectFields as Partial<Pick<Project, 'name' | 'status' | 'description' | 'requester' | 'keyDates' | 'keyLinks'>>;

    const updated: EditsOverlay = {
      ...currentEdits,
      projectOverrides,
    };

    await platform.storage.write(`edits/${safeName(viewId)}.json`, JSON.stringify(updated, null, 2));
    edits.value = updated;
  }

  function selectEntity(entity: SelectedEntity | null): void {
    selectedEntity.value = entity;
  }

  async function deleteTask(taskId: string): Promise<void> {
    const currentEdits = edits.value;
    const viewId = currentViewId.value;
    if (!currentEdits || !viewId) return;

    // Check if it's a local task (remove from localTasks) or upstream (add to deletedTasks)
    const isLocal = currentEdits.localTasks.some(t => t.id === taskId);

    let updated: EditsOverlay;
    if (isLocal) {
      // Remove from localTasks and clean up any overrides for this task
      const newOverrides = { ...currentEdits.overrides };
      delete newOverrides[taskId];
      updated = {
        ...currentEdits,
        localTasks: currentEdits.localTasks.filter(t => t.id !== taskId),
        overrides: newOverrides,
      };
    } else {
      const deletedTasks = [...(currentEdits.deletedTasks ?? [])];
      if (!deletedTasks.includes(taskId)) {
        deletedTasks.push(taskId);
      }
      updated = {
        ...currentEdits,
        deletedTasks,
      };
    }

    await platform.storage.write(`edits/${safeName(viewId)}.json`, JSON.stringify(updated, null, 2));
    edits.value = updated;
    selectEntity(null);
  }

  async function deleteProject(projectId: string): Promise<void> {
    const currentEdits = edits.value;
    const viewId = currentViewId.value;
    if (!currentEdits || !viewId) return;

    // Add project to deletedProjects and cascade-delete all associated tasks
    const deletedProjects = [...(currentEdits.deletedProjects ?? [])];
    if (!deletedProjects.includes(projectId)) {
      deletedProjects.push(projectId);
    }

    // Cascade: delete all tasks belonging to this project
    const deletedTasks = [...(currentEdits.deletedTasks ?? [])];
    const allTasks = mergeAll(caches.value, currentEdits);
    const cascadeTaskIds: string[] = [];
    for (const task of allTasks) {
      if (task.projectId.value === projectId && !deletedTasks.includes(task.id)) {
        deletedTasks.push(task.id);
        cascadeTaskIds.push(task.id);
      }
    }

    // Clean up: remove project overrides, local tasks, and task overrides for cascade-deleted tasks
    const newProjectOverrides = { ...(currentEdits.projectOverrides ?? {}) };
    delete newProjectOverrides[projectId];

    const newOverrides = { ...currentEdits.overrides };
    for (const taskId of cascadeTaskIds) {
      delete newOverrides[taskId];
    }

    const cascadeTaskIdSet = new Set(cascadeTaskIds);
    const updated: EditsOverlay = {
      ...currentEdits,
      deletedProjects,
      deletedTasks,
      projectOverrides: Object.keys(newProjectOverrides).length > 0 ? newProjectOverrides : undefined,
      overrides: newOverrides,
      localTasks: currentEdits.localTasks.filter(t => !cascadeTaskIdSet.has(t.id)),
    };

    await platform.storage.write(`edits/${safeName(viewId)}.json`, JSON.stringify(updated, null, 2));
    edits.value = updated;
    selectEntity(null);
  }

  async function setTaskStatus(taskId: string, status: string): Promise<void> {
    await persistEdit(taskId, 'status', status);
  }

  async function setProjectStatus(projectId: string, status: string): Promise<void> {
    await persistProjectEdit(projectId, 'status', status);
  }

  async function pushChanges(): Promise<{ connectorId: string; success: boolean; error?: string }[]> {
    const currentEdits = edits.value;
    const viewId = currentViewId.value;
    if (!currentEdits || !viewId) return [];

    const results: { connectorId: string; success: boolean; error?: string }[] = [];

    // Build push payload from all local changes
    const payload: PushChangesPayload = {
      tasks: [],
      projects: [],
      deletedTaskIds: currentEdits.deletedTasks ?? [],
      deletedProjectIds: currentEdits.deletedProjects ?? [],
    };

    // Collect tasks with overrides as full merged objects
    const allMerged = mergeAll(caches.value, currentEdits);
    const overrideIds = new Set(Object.keys(currentEdits.overrides));
    for (const task of allMerged) {
      if (overrideIds.has(task.id) || task.connectorId === null) {
        payload.tasks.push({
          id: task.id,
          title: task.title.value,
          startDate: task.startDate.value ?? undefined,
          endDate: task.endDate.value ?? undefined,
          progress: task.progress.value,
          status: task.status.value as Task['status'],
          personId: task.personId.value ?? undefined,
          projectId: task.projectId.value ?? undefined,
          dependencies: task.dependencies.value,
          tags: task.tags.value,
          url: task.url.value ?? undefined,
        });
      }
    }

    // Include locally created tasks
    for (const lt of currentEdits.localTasks) {
      payload.tasks.push(lt);
    }

    // Collect project overrides
    if (currentEdits.projectOverrides) {
      for (const [projectId, overrides] of Object.entries(currentEdits.projectOverrides)) {
        const project = caches.value
          .flatMap(c => c.projects)
          .find(p => p.id === projectId);
        if (project) {
          payload.projects.push({ ...project, ...overrides });
        }
      }
    }

    // Try pushing through each connector
    for (const cache of caches.value) {
      try {
        // Load connector module
        const configPath = `connectors/${safeName(cache.connectorId)}.json`;
        const configRaw = await platform.storage.read(configPath);
        if (!configRaw) continue;
        const connConfig = JSON.parse(configRaw);
        const scriptPath = connConfig.script || `connectors/${safeName(cache.connectorId)}.js`;

        const mod = await platform.connectorLoader.load(scriptPath);
        if (!mod.push) {
          results.push({ connectorId: cache.connectorId, success: false, error: 'Connector does not support push' });
          continue;
        }

        const ctx = platform.createConnectorContext(connConfig);
        const result = await mod.push(payload, ctx);
        results.push({ connectorId: cache.connectorId, success: result.success, error: result.error });
      } catch (e) {
        results.push({ connectorId: cache.connectorId, success: false, error: e instanceof Error ? e.message : String(e) });
      }
    }

    // If any connector succeeded, clear the pushed edits and refresh caches
    const anySuccess = results.some(r => r.success);
    if (anySuccess) {
      const cleared: EditsOverlay = {
        ...currentEdits,
        overrides: {},
        localTasks: currentEdits.localTasks.filter(
          lt => payload.tasks.some(pt => pt.id === lt.id)
        ),
        projectOverrides: {},
        deletedTasks: [],
        deletedProjects: [],
      };
      await platform.storage.write(`edits/${safeName(viewId)}.json`, JSON.stringify(cleared, null, 2));
      edits.value = cleared;

      // Refresh caches for connectors that pushed successfully
      for (const result of results) {
        if (result.success) {
          try {
            await refreshConnector(result.connectorId);
          } catch {
            // Refresh failure after successful push is non-fatal
          }
        }
      }
    }

    return results;
  }

  // ── Pending changes computed ──
  const pendingChanges = computed<PendingEntityChange[]>(() => {
    const currentEdits = edits.value;
    if (!currentEdits) return [];

    const result: PendingEntityChange[] = [];
    const allMerged = mergedTasks.value;
    const allPersons = persons.value;
    const allProjects = projects.value;

    const FIELD_LABELS: Record<string, string> = {
      title: 'Title',
      startDate: 'Start Date',
      endDate: 'End Date',
      progress: 'Progress',
      status: 'Status',
      personId: 'Person',
      projectId: 'Project',
      dependencies: 'Dependencies',
      tags: 'Tags',
      description: 'Description',
      requester: 'Requester',
      keyDates: 'Key Dates',
      keyLinks: 'Key Links',
      name: 'Name',
    };

    // ── Task overrides → aggregate by task ID ──
    const taskFieldMap = new Map<string, FieldChange[]>();
    for (const [taskId, overrides] of Object.entries(currentEdits.overrides)) {
      const fields: FieldChange[] = [];
      for (const [field, value] of Object.entries(overrides)) {
        fields.push({
          field,
          label: FIELD_LABELS[field] ?? field,
          newValue: value,
        });
      }
      if (fields.length > 0) {
        taskFieldMap.set(taskId, fields);
      }
    }

    for (const [taskId, fields] of taskFieldMap) {
      const task = allMerged.find(t => t.id === taskId);
      const person = allPersons.find(p => p.id === task?.personId.value);
      const project = allProjects.find(p => p.id === task?.projectId.value);
      const entityName = task?.title.value ?? taskId;

      result.push({
        entityId: taskId,
        entityType: 'task',
        entityName,
        changeType: 'modified',
        fields: fields.map(f => {
          // Format value for display
          let displayValue = f.newValue;
          if (f.field === 'personId' && person) displayValue = person.name;
          if (f.field === 'projectId' && project) displayValue = project.name;
          if (f.field === 'status') {
            const opt = ['pending','in-progress','cancelled','pending-online','online','completed'];
            const idx = opt.indexOf(String(f.newValue));
            displayValue = ['Pending','In Progress','Cancelled','Pending Online','Online','Completed'][idx] ?? f.newValue;
          }
          if (f.field === 'progress') displayValue = `${Math.round(Number(f.newValue) * 100)}%`;
          return { ...f, newValue: displayValue };
        }),
      });
    }

    // ── Locally created tasks ──
    for (const lt of currentEdits.localTasks) {
      const person = allPersons.find(p => p.id === lt.personId);
      const project = allProjects.find(p => p.id === lt.projectId);
      const summary: Record<string, unknown> = {};
      if (lt.startDate) summary['Start'] = lt.startDate;
      if (lt.endDate) summary['End'] = lt.endDate;
      if (lt.status) {
        const idx = ['pending','in-progress','cancelled','pending-online','online','completed'].indexOf(lt.status);
        summary['Status'] = ['Pending','In Progress','Cancelled','Pending Online','Online','Completed'][idx] ?? lt.status;
      } else {
        summary['Status'] = 'Pending';
      }
      if (person) summary['Person'] = person.name;
      if (project) summary['Project'] = project.name;
      if (lt.tags?.length) summary['Tags'] = lt.tags.join(', ');
      if (lt.url) summary['Link'] = lt.url;

      result.push({
        entityId: lt.id,
        entityType: 'task',
        entityName: lt.title,
        changeType: 'added',
        addedSummary: summary,
      });
    }

    // ── Project overrides → aggregate by project ID ──
    const projFieldMap = new Map<string, FieldChange[]>();
    if (currentEdits.projectOverrides) {
      for (const [projectId, overrides] of Object.entries(currentEdits.projectOverrides)) {
        const fields: FieldChange[] = [];
        for (const [field, value] of Object.entries(overrides)) {
          fields.push({
            field,
            label: FIELD_LABELS[field] ?? field,
            newValue: value,
          });
        }
        if (fields.length > 0) {
          projFieldMap.set(projectId, fields);
        }
      }
    }

    for (const [projectId, fields] of projFieldMap) {
      const project = allProjects.find(p => p.id === projectId);
      const entityName = project?.name ?? projectId;

      result.push({
        entityId: projectId,
        entityType: 'project',
        entityName,
        changeType: 'modified',
        fields,
      });
    }

    // ── Deleted tasks ──
    for (const taskId of (currentEdits.deletedTasks ?? [])) {
      const task = allMerged.find(t => t.id === taskId);
      const project = allProjects.find(p => p.id === task?.projectId.value);
      result.push({
        entityId: taskId,
        entityType: 'task',
        entityName: task?.title.value ?? taskId,
        changeType: 'deleted',
        relatedInfo: project ? `Project: ${project.name}` : undefined,
      });
    }

    // ── Deleted projects ──
    for (const projectId of (currentEdits.deletedProjects ?? [])) {
      const project = allProjects.find(p => p.id === projectId);
      result.push({
        entityId: projectId,
        entityType: 'project',
        entityName: project?.name ?? projectId,
        changeType: 'deleted',
      });
    }

    // ── Deduplication: deleted > modified, added + modified → added, added + deleted → cancel ──
    const deletedTaskIds = new Set(currentEdits.deletedTasks ?? []);
    const deletedProjectIds = new Set(currentEdits.deletedProjects ?? []);
    const localTaskIds = new Set(currentEdits.localTasks.map(t => t.id));
    const allMergedTaskIds = new Set(allMerged.map(t => t.id));
    const allProjectIds = new Set(allProjects.map(p => p.id));
    // Track which added tasks consumed their modified counterpart
    const consumedModified = new Set<string>();

    // 1. Remove modified entries for entities that are deleted (deletion takes precedence)
    // 2. Merge modified entries into added entries for newly created tasks
    // 3. Remove added entries that are also deleted (net zero)
    // 4. Remove orphaned modified entries where the entity no longer exists
    const filtered: PendingEntityChange[] = [];
    for (const entry of result) {
      if (entry.entityType === 'task') {
        // Orphaned: modified entry for a task that no longer exists anywhere
        if (entry.changeType === 'modified' && !allMergedTaskIds.has(entry.entityId) && !localTaskIds.has(entry.entityId)) {
          continue;
        }
        // deleted + modified → just keep deleted (skip modified)
        if (entry.changeType === 'modified' && deletedTaskIds.has(entry.entityId)) {
          continue;
        }
        // added + deleted → cancel out entirely
        if (entry.changeType === 'added' && deletedTaskIds.has(entry.entityId)) {
          continue;
        }
        // added + modified → merge modified fields into added summary
        if (entry.changeType === 'added' && localTaskIds.has(entry.entityId)) {
          const modEntry = result.find(
            e => e.entityId === entry.entityId && e.entityType === 'task' && e.changeType === 'modified'
          );
          if (modEntry && modEntry.fields && entry.addedSummary) {
            for (const f of modEntry.fields) {
              entry.addedSummary[f.label] = f.newValue;
            }
            consumedModified.add(entry.entityId);
          }
          filtered.push(entry);
          continue;
        }
        // Skip modified entries already consumed by an added entry
        if (entry.changeType === 'modified' && consumedModified.has(entry.entityId)) {
          continue;
        }
      }
      if (entry.entityType === 'project') {
        // Orphaned: modified entry for a project that no longer exists
        if (entry.changeType === 'modified' && !allProjectIds.has(entry.entityId)) {
          continue;
        }
        // deleted + modified → just keep deleted
        if (entry.changeType === 'modified' && deletedProjectIds.has(entry.entityId)) {
          continue;
        }
      }
      filtered.push(entry);
    }

    // Sort: added first, then modified, then deleted; by entity name within each group
    const order = { added: 0, modified: 1, deleted: 2 };
    filtered.sort((a, b) => {
      const d = (order[a.changeType] ?? 1) - (order[b.changeType] ?? 1);
      if (d !== 0) return d;
      return a.entityName.localeCompare(b.entityName);
    });

    return filtered;
  });

  return {
    caches,
    edits,
    views,
    currentViewId,
    mergedTasks,
    persons,
    projects,
    mergedProjects,
    personGroups,
    projectGroups,
    unassignedProjects,
    selectedEntity,
    highlightedTaskIds,
    sharedScrollLeft,
    personScrollTop,
    projectScrollTop,
    personSortMode,
    timelineRange,
    conflicts,
    pendingChanges,
    isLoading,
    error,
    loadView,
    refreshConnector,
    persistEdit,
    resetField,
    createLocalTask,
    persistProjectEdit,
    selectEntity,
    deleteTask,
    deleteProject,
    setTaskStatus,
    setProjectStatus,
    pushChanges,
  };
}

export type { GanttPlatform };
