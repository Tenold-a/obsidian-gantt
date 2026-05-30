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

  // Timeline range
  timelineRange: ReturnType<typeof computed<{ startDate: string; endDate: string }>>;

  // Conflicts
  conflicts: ReturnType<typeof computed<Conflict[]>>;

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
    return projects.value.map(p => {
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
      // Read connector config
      const configRaw = await platform.storage.read(`connectors/${safeName(connectorId)}.json`);
      const connConfig: Record<string, unknown> = configRaw ? JSON.parse(configRaw) : {};
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
      error.value = e instanceof Error ? e.message : String(e);
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
    projectOverrides[projectId] = projectFields as Partial<Pick<Project, 'description' | 'requester' | 'keyDates' | 'keyLinks'>>;

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
    personSortMode,
    timelineRange,
    conflicts,
    isLoading,
    error,
    loadView,
    refreshConnector,
    persistEdit,
    resetField,
    createLocalTask,
    persistProjectEdit,
    selectEntity,
  };
}

export type { GanttPlatform };
