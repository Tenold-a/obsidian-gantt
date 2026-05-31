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
  TagDefinition,
} from '@obsidian-gantt/core';
import {
  mergeAll,
  detectConflicts,
  applyFieldReset,
  computeTimelineRange,
  daysBetween,
  addDays,
  isNonWorkingDay,
  getNonWorkingBlocks,
} from '@obsidian-gantt/core';
import type { HolidayConfig } from '@obsidian-gantt/core';
import { configureIconRenderer } from './icon';

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
  projectSortMode: ReturnType<typeof signal<'name' | 'time'>>;
  projectSortKeyDates: ReturnType<typeof signal<string[]>>;
  positionOrder: ReturnType<typeof signal<string[]>>;
  detailPanelWidth: ReturnType<typeof signal<number>>;

  // Filtering
  filterTimeStart: ReturnType<typeof signal<string>>;
  filterTimeEnd: ReturnType<typeof signal<string>>;
  filterStatuses: ReturnType<typeof signal<Set<string>>>;
  filterTags: ReturnType<typeof signal<Set<string>>>;
  filteredProjectGroupKeys: ReturnType<typeof computed<Set<string> | null>>;
  filterDimmedTaskIds: ReturnType<typeof computed<Set<string>>>;
  availableFilterTags: ReturnType<typeof computed<{ value: string; label: string }[]>>;

  // Selection & highlight
  selectedEntity: ReturnType<typeof signal<SelectedEntity | null>>;
  highlightedTaskIds: ReturnType<typeof computed<Set<string>>>;

  // Scroll target for auto-scroll on selection change
  scrollTargetDate: ReturnType<typeof computed<string | null>>;

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

  // Tag definitions
  tagDefinitions: ReturnType<typeof signal<TagDefinition[]>>;

  // Holiday config
  holidayConfig: ReturnType<typeof signal<HolidayConfig>>;

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
  dismissChanges(selectedIds: Set<string>): Promise<void>;

  // Tag management
  loadTags(): Promise<void>;
  createTag(name: string, color: string): Promise<void>;
  updateTag(oldName: string, newName: string, color?: string): Promise<void>;
  deleteTag(name: string): Promise<void>;
  saveSettings(): Promise<void>;
  saveHolidayConfig(config: HolidayConfig): Promise<void>;
}

const DAY_WIDTH = 30;
const SCROLL_GUARD_DURATION = 100; // ms

/** Sanitize a file-name segment: replace characters invalid on Windows/Unix with "_". */
function safeName(name: string): string {
  return name.replace(/[\\/:*?"<>|]/g, '_');
}

export function createGanttStore(platform: GanttPlatform): GanttStore {
  configureIconRenderer((el, name) => platform.setIcon(el, name));

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
  const projectSortMode = signal<'name' | 'time'>('name');
  const projectSortKeyDates = signal<string[]>(['上线时间']);
  const positionOrder = signal<string[]>([]);
  const detailPanelWidth = signal<number>(220);
  const filterTimeStart = signal<string>('');
  const filterTimeEnd = signal<string>('');
  const filterStatuses = signal<Set<string>>(new Set());
  const filterTags = signal<Set<string>>(new Set());
  const tagDefinitions = signal<TagDefinition[]>([]);
  const holidayConfig = signal<HolidayConfig>({
    weekendsEnabled: true,
    holidaysEnabled: true,
    holidayDates: [],
    makeupWorkdays: [],
  });
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

    // Include people with no assigned tasks
    for (const p of persons.value) {
      if (!map.has(p.id)) {
        map.set(p.id, []);
      }
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

    // Build position rank map for custom ordering
    const orderList = positionOrder.value;
    const rankMap = new Map<string, number>();
    if (orderList.length > 0) {
      for (let i = 0; i < orderList.length; i++) {
        rankMap.set(orderList[i].trim(), i);
      }
    }

    groups.sort((a, b) => {
      if (a.personId === '__unassigned__') return 1;
      if (b.personId === '__unassigned__') return -1;

      if (mode === 'position') {
        const pa = a.position;
        const pb = b.position;
        if (pa && pb) {
          const ra = rankMap.get(pa);
          const rb = rankMap.get(pb);
          // Both in custom order → sort by rank
          if (ra !== undefined && rb !== undefined) return ra - rb;
          // One in custom order → it comes first
          if (ra !== undefined) return -1;
          if (rb !== undefined) return 1;
          // Neither in custom order → alphabetical
          return pa.localeCompare(pb);
        }
        if (pa && !pb) return -1;
        if (!pa && pb) return 1;
      }

      return a.personName.localeCompare(b.personName);
    });

    return groups;
  });

  const projectGroups = computed<ProjectGroup[]>(() => {
    const map = new Map<string, LocalTask[]>();
    const projectInfoMap = new Map(mergedProjects.value.map(p => [p.id, p]));

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

    const sortMode = projectSortMode.value;

    if (sortMode === 'time') {
      const sortKeyDates = projectSortKeyDates.value;
      // Pre-compute time info per project: matching key date, last task end
      const projectTimeInfo = new Map<string, { sortDate: string | null; lastEnd: string | null }>();
      for (const [projectId, projectTasks] of map) {
        const info = projectInfoMap.get(projectId);
        // Find first matching key date from the configured list
        let sortDate: string | null = null;
        for (const kdName of sortKeyDates) {
          const kd = info?.keyDates?.find(k => k.name === kdName);
          if (kd?.date) { sortDate = kd.date; break; }
        }
        let lastEnd: string | null = null;
        for (const t of projectTasks) {
          const e = t.endDate.value;
          if (e && (!lastEnd || e > lastEnd)) lastEnd = e;
        }
        projectTimeInfo.set(projectId, { sortDate, lastEnd });
      }

      groups.sort((a, b) => {
        const infoA = projectTimeInfo.get(a.projectId);
        const infoB = projectTimeInfo.get(b.projectId);
        const dateA = infoA?.sortDate ?? null;
        const dateB = infoB?.sortDate ?? null;

        // Each project's effective date: key date if present, else last end date
        const effA = dateA ?? infoA?.lastEnd ?? null;
        const effB = dateB ?? infoB?.lastEnd ?? null;

        // 1. Both have an effective date → sort by it
        if (effA && effB) return effA.localeCompare(effB);
        // 2. One has it → it comes first
        if (effA) return -1;
        if (effB) return 1;
        // 3. Neither has any date → alphabetical
        return a.projectName.localeCompare(b.projectName);
      });
    } else {
      groups.sort((a, b) => a.projectName.localeCompare(b.projectName));
    }

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

  const scrollTargetDate = computed<string | null>(() => {
    const sel = selectedEntity.value;
    if (!sel) return null;

    if (sel.type === 'task') {
      const task = mergedTasks.value.find(t => t.id === sel.id);
      const s = task?.startDate.value;
      const e = task?.endDate.value;
      if (!s) return null;
      if (!e || s === e) return s;
      return addDays(s, Math.floor(daysBetween(s, e) / 2));
    }

    if (sel.type === 'project') {
      const project = mergedProjects.value.find(p => p.id === sel.id);
      // Try configured sort key dates first
      for (const kdName of projectSortKeyDates.value) {
        const kd = project?.keyDates?.find(k => k.name === kdName);
        if (kd?.date) return kd.date;
      }

      const projectTasks = mergedTasks.value.filter(t => t.projectId.value === sel.id);
      let earliest: string | null = null;
      let latest: string | null = null;
      for (const t of projectTasks) {
        const s = t.startDate.value;
        const e = t.endDate.value ?? s;
        if (s) {
          if (!earliest || s < earliest) earliest = s;
          if (!latest || e > latest) latest = e;
        }
      }
      if (!earliest) return null;
      if (!latest || earliest === latest) return earliest;
      return addDays(earliest, Math.floor(daysBetween(earliest, latest) / 2));
    }

    return null;
  });

  // Filtering computed: which projects match all active filters.
  // Returns null when no filters are active ("show all").
  // Returns a Set (possibly empty) when filters are active.
  const filteredProjectGroupKeys = computed(() => {
    const timeStart = filterTimeStart.value;
    const timeEnd = filterTimeEnd.value;
    const statuses = filterStatuses.value;
    const tags = filterTags.value;

    // No filters active — return null to signal "show everything"
    if (!timeStart && !timeEnd && statuses.size === 0 && tags.size === 0) {
      return null;
    }

    const matchingIds = new Set<string>();
    for (const group of projectGroups.value) {
      const projectId = group.projectId;
      if (projectId === '__no_project__') {
        matchingIds.add(projectId);
        continue;
      }

      const project = mergedProjects.value.find(p => p.id === projectId);
      if (!project) continue;

      let match = true;

      // Time range filter: project must have keyDate or task date intersecting [start, end]
      if (match && (timeStart || timeEnd)) {
        let timeMatch = false;
        // Check key dates
        if (project.keyDates) {
          for (const kd of project.keyDates) {
            if ((!timeStart || kd.date >= timeStart) && (!timeEnd || kd.date <= timeEnd)) {
              timeMatch = true;
              break;
            }
          }
        }
        // Check task dates
        if (!timeMatch) {
          for (const task of group.tasks) {
            const s = task.startDate.value;
            const e = task.endDate.value ?? s;
            if (s && e) {
              const taskEndBeforeStart = timeStart && e < timeStart;
              const taskStartAfterEnd = timeEnd && s > timeEnd;
              if (!taskEndBeforeStart && !taskStartAfterEnd) {
                timeMatch = true;
                break;
              }
            }
          }
        }
        match = timeMatch;
      }

      // Status filter: project status must be in selected set
      if (match && statuses.size > 0) {
        const projStatus = project.status ?? 'pending';
        match = statuses.has(projStatus);
      }

      // Tag filter: project must have at least one selected tag (OR logic)
      if (match && tags.size > 0) {
        const projTags = project.tags ?? [];
        match = projTags.some(t => tags.has(t));
      }

      if (match) matchingIds.add(projectId);
    }

    return matchingIds;
  });

  // Filtering computed: task IDs that belong to projects hidden by filter
  const filterDimmedTaskIds = computed(() => {
    const matchingKeys = filteredProjectGroupKeys.value;
    // null = no filter active, nothing is dimmed
    if (matchingKeys === null) return new Set<string>();

    const dimmed = new Set<string>();
    for (const group of projectGroups.value) {
      if (!matchingKeys.has(group.projectId)) {
        for (const task of group.tasks) {
          dimmed.add(task.id);
        }
      }
    }
    return dimmed;
  });

  // Available tag options for filter dropdown — from tagDefinitions + project tags
  const availableFilterTags = computed(() => {
    const nameSet = new Set<string>();
    // From tag definitions
    for (const td of tagDefinitions.value) nameSet.add(td.name);
    // From all projects
    for (const p of projects.value) {
      for (const t of (p.tags ?? [])) nameSet.add(t);
    }
    // From project overrides
    const projOverrides = edits.value?.projectOverrides ?? {};
    for (const [, overrides] of Object.entries(projOverrides)) {
      if (overrides.tags) {
        for (const t of overrides.tags) nameSet.add(t);
      }
    }
    return [...nameSet].sort().map(n => ({ value: n, label: n }));
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

      // Load tag definitions and settings
      await loadTags();
      await loadSettings();
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

    // For locally-created tasks, update the task in localTasks directly
    // (overrides on local tasks are ignored by the merge engine)
    const isLocal = currentEdits.localTasks.some(t => t.id === taskId);
    if (isLocal) {
      const updated: EditsOverlay = {
        ...currentEdits,
        localTasks: currentEdits.localTasks.map(t =>
          t.id === taskId ? { ...t, [fieldName]: value } : t
        ),
      };
      await platform.storage.write(`edits/${safeName(viewId)}.json`, JSON.stringify(updated, null, 2));
      edits.value = updated;
      return;
    }

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
    projectOverrides[projectId] = projectFields as Partial<Pick<Project, 'name' | 'status' | 'description' | 'requester' | 'keyDates' | 'keyLinks' | 'tags'>>;

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
    // Cascade: if all non-cancelled tasks in the project are completed, auto-complete the project
    await cascadeTaskToProject(taskId, status);
  }

  async function cascadeTaskToProject(taskId: string, newStatus: string): Promise<void> {
    // Find the task and its project
    const allTasks = mergedTasks.value;
    const task = allTasks.find(t => t.id === taskId);
    if (!task) return;
    const projectId = task.projectId.value;
    if (!projectId) return;

    // Count non-cancelled and completed tasks in this project
    const projectTasks = allTasks.filter(t => t.projectId.value === projectId);
    if (projectTasks.length === 0) return;
    const nonCancelled = projectTasks.filter(t => t.status.value !== 'cancelled');
    if (nonCancelled.length === 0) return;
    const completed = nonCancelled.filter(t => t.status.value === 'completed');

    const projectOverride = edits.value?.projectOverrides?.[projectId]?.status;
    // Get the upstream project status
    let upstreamStatus = 'pending';
    for (const cache of caches.value) {
      const p = cache.projects.find(pr => pr.id === projectId);
      if (p) { upstreamStatus = p.status ?? 'pending'; break; }
    }

    if (completed.length >= nonCancelled.length) {
      // All non-cancelled tasks are completed — auto-complete the project
      if (projectOverride !== 'completed' && upstreamStatus !== 'completed') {
        await persistProjectEdit(projectId, 'status', 'completed');
      }
    } else if (newStatus !== 'completed') {
      // Task was un-completed — if project was auto-completed, revert to pending
      if (projectOverride === 'completed') {
        await persistProjectEdit(projectId, 'status', 'pending');
      }
    }
  }

  async function setProjectStatus(projectId: string, status: string): Promise<void> {
    await persistProjectEdit(projectId, 'status', status);
  }

  async function pushChanges(selectedIds?: Set<string>): Promise<{ connectorId: string; success: boolean; error?: string }[]> {
    const currentEdits = edits.value;
    const viewId = currentViewId.value;
    if (!currentEdits || !viewId) return [];

    const results: { connectorId: string; success: boolean; error?: string }[] = [];

    // Build a filter set from selectedIds if provided
    const hasSelection = selectedIds !== undefined && selectedIds.size > 0;

    // Build push payload from all local changes
    const payload: PushChangesPayload = {
      tasks: [],
      projects: [],
      deletedTaskIds: hasSelection
        ? (currentEdits.deletedTasks ?? []).filter(id => selectedIds!.has(id))
        : (currentEdits.deletedTasks ?? []),
      deletedProjectIds: hasSelection
        ? (currentEdits.deletedProjects ?? []).filter(id => selectedIds!.has(id))
        : (currentEdits.deletedProjects ?? []),
    };

    // Track which task/project IDs are in the payload for selective clearing
    const pushedTaskIds = new Set<string>();
    const pushedProjectIds = new Set<string>();

    // Collect tasks with overrides as full merged objects (upstream tasks only)
    const allMerged = mergeAll(caches.value, currentEdits);
    const overrideIds = new Set(Object.keys(currentEdits.overrides));
    for (const task of allMerged) {
      // Only include upstream tasks with overrides (local tasks handled separately)
      if (task.connectorId !== null && overrideIds.has(task.id)) {
        if (hasSelection && !selectedIds!.has(task.id)) continue;
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
        pushedTaskIds.add(task.id);
      }
    }

    // Include locally created tasks (connectorId === null)
    for (const lt of currentEdits.localTasks) {
      if (hasSelection && !selectedIds!.has(lt.id)) continue;
      payload.tasks.push(lt);
      pushedTaskIds.add(lt.id);
    }

    // Collect project overrides
    if (currentEdits.projectOverrides) {
      for (const [projectId, overrides] of Object.entries(currentEdits.projectOverrides)) {
        if (hasSelection && !selectedIds!.has(projectId)) continue;
        const project = caches.value
          .flatMap(c => c.projects)
          .find(p => p.id === projectId);
        if (project) {
          payload.projects.push({ ...project, ...overrides });
        }
        pushedProjectIds.add(projectId);
      }
    }

    // Add deleted task/project IDs
    for (const id of payload.deletedTaskIds) {
      if (hasSelection && !selectedIds!.has(id)) continue;
      pushedTaskIds.add(id);
    }
    for (const id of payload.deletedProjectIds) {
      if (hasSelection && !selectedIds!.has(id)) continue;
      pushedProjectIds.add(id);
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
      // Selectively clear only pushed items, preserving unpushed ones
      const newOverrides = { ...currentEdits.overrides };
      for (const id of pushedTaskIds) delete newOverrides[id];

      const newProjectOverrides = { ...(currentEdits.projectOverrides ?? {}) };
      for (const id of pushedProjectIds) delete newProjectOverrides[id];

      const cleared: EditsOverlay = {
        ...currentEdits,
        overrides: newOverrides,
        // Remove pushed local tasks (NOT keep — filter was inverted)
        localTasks: currentEdits.localTasks.filter(
          lt => !pushedTaskIds.has(lt.id)
        ),
        projectOverrides: Object.keys(newProjectOverrides).length > 0 ? newProjectOverrides : undefined,
        deletedTasks: (currentEdits.deletedTasks ?? []).filter(id => !pushedTaskIds.has(id)),
        deletedProjects: (currentEdits.deletedProjects ?? []).filter(id => !pushedProjectIds.has(id)),
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

  async function dismissChanges(selectedIds: Set<string>): Promise<void> {
    const currentEdits = edits.value;
    const viewId = currentViewId.value;
    if (!currentEdits || !viewId || selectedIds.size === 0) return;

    const newOverrides = { ...currentEdits.overrides };
    const newProjectOverrides = { ...(currentEdits.projectOverrides ?? {}) };
    let localTasks = [...currentEdits.localTasks];
    let deletedTasks = [...(currentEdits.deletedTasks ?? [])];
    let deletedProjects = [...(currentEdits.deletedProjects ?? [])];

    for (const id of selectedIds) {
      // Remove task override
      delete newOverrides[id];
      // Remove local task
      localTasks = localTasks.filter(lt => lt.id !== id);
      // Remove from deleted tasks
      deletedTasks = deletedTasks.filter(did => did !== id);
      // Remove project override
      delete newProjectOverrides[id];
      // Remove from deleted projects
      deletedProjects = deletedProjects.filter(did => did !== id);
    }

    const cleared: EditsOverlay = {
      ...currentEdits,
      overrides: newOverrides,
      localTasks,
      projectOverrides: Object.keys(newProjectOverrides).length > 0 ? newProjectOverrides : undefined,
      deletedTasks: deletedTasks.length > 0 ? deletedTasks : undefined,
      deletedProjects: deletedProjects.length > 0 ? deletedProjects : undefined,
    };

    await platform.storage.write(`edits/${safeName(viewId)}.json`, JSON.stringify(cleared, null, 2));
    edits.value = cleared;
  }

  // ── Tag management actions ──

  async function loadTags(): Promise<void> {
    const viewId = currentViewId.value;
    if (!viewId) return;
    const raw = await platform.storage.read(`tags/${safeName(viewId)}.json`);
    if (raw) {
      try {
        const data = JSON.parse(raw);
        tagDefinitions.value = data.tags ?? [];
      } catch { /* ignore parse errors */ }
    }
  }

  async function createTag(name: string, color: string): Promise<void> {
    const viewId = currentViewId.value;
    if (!viewId) return;

    // Check duplicate
    if (tagDefinitions.value.some(t => t.name === name)) return;

    const updated = [...tagDefinitions.value, { name, color }];
    await platform.storage.write(`tags/${safeName(viewId)}.json`, JSON.stringify({ tags: updated }, null, 2));
    tagDefinitions.value = updated;
  }

  async function updateTag(oldName: string, newName: string, color?: string): Promise<void> {
    const viewId = currentViewId.value;
    if (!viewId) return;

    const updated = tagDefinitions.value.map(t =>
      t.name === oldName ? { name: newName, color: color ?? t.color } : t
    );
    await platform.storage.write(`tags/${safeName(viewId)}.json`, JSON.stringify({ tags: updated }, null, 2));
    tagDefinitions.value = updated;

    // Sync rename across all project overrides and upstream projects
    if (oldName !== newName) {
      const currentEdits = edits.value;
      if (currentEdits) {
        let changed = false;
        const newProjectOverrides = { ...(currentEdits.projectOverrides ?? {}) };

        // Update overrides that have the old tag
        for (const [projectId, overrides] of Object.entries(newProjectOverrides)) {
          if (overrides.tags?.includes(oldName)) {
            newProjectOverrides[projectId] = {
              ...overrides,
              tags: overrides.tags.map(t => t === oldName ? newName : t),
            };
            changed = true;
          }
        }

        // Also sync upstream projects that have the old tag but no override yet
        for (const p of projects.value) {
          if (p.tags?.includes(oldName) && !newProjectOverrides[p.id]) {
            newProjectOverrides[p.id] = {
              ...(newProjectOverrides[p.id] ?? {}),
              tags: (p.tags ?? []).map(t => t === oldName ? newName : t),
            };
            changed = true;
          }
        }

        if (changed) {
          const updatedEdits: EditsOverlay = {
            ...currentEdits,
            projectOverrides: Object.keys(newProjectOverrides).length > 0 ? newProjectOverrides : undefined,
          };
          await platform.storage.write(`edits/${safeName(viewId)}.json`, JSON.stringify(updatedEdits, null, 2));
          edits.value = updatedEdits;
        }
      }
    }
  }

  async function deleteTag(name: string): Promise<void> {
    const viewId = currentViewId.value;
    if (!viewId) return;

    // Remove tag from definitions
    const updated = tagDefinitions.value.filter(t => t.name !== name);
    await platform.storage.write(`tags/${safeName(viewId)}.json`, JSON.stringify({ tags: updated }, null, 2));
    tagDefinitions.value = updated;

    // Clean up references in project overrides and upstream projects
    const currentEdits = edits.value;
    if (currentEdits) {
      let changed = false;
      const newProjectOverrides = { ...(currentEdits.projectOverrides ?? {}) };
      for (const [projectId, overrides] of Object.entries(newProjectOverrides)) {
        if (overrides.tags?.includes(name)) {
          const newTags = overrides.tags.filter(t => t !== name);
          newProjectOverrides[projectId] = {
            ...overrides,
            tags: newTags.length > 0 ? newTags : [],
          };
          changed = true;
        }
      }
      // Also clean upstream projects that have the tag but no override
      for (const p of projects.value) {
        if (p.tags?.includes(name) && !newProjectOverrides[p.id]) {
          newProjectOverrides[p.id] = {
            ...(newProjectOverrides[p.id] ?? {}),
            tags: (p.tags ?? []).filter(t => t !== name),
          };
          changed = true;
        }
      }
      if (changed) {
        const updatedEdits: EditsOverlay = {
          ...currentEdits,
          projectOverrides: Object.keys(newProjectOverrides).length > 0 ? newProjectOverrides : undefined,
        };
        await platform.storage.write(`edits/${safeName(viewId)}.json`, JSON.stringify(updatedEdits, null, 2));
        edits.value = updatedEdits;
      }
    }
  }

  // ── Settings persistence ──

  async function loadSettings(): Promise<void> {
    const viewId = currentViewId.value;
    if (!viewId) return;
    const raw = await platform.storage.read(`settings/${safeName(viewId)}.json`);
    if (!raw) return;
    try {
      const data = JSON.parse(raw);
      if (data.filterTimeStart !== undefined) filterTimeStart.value = data.filterTimeStart ?? '';
      if (data.filterTimeEnd !== undefined) filterTimeEnd.value = data.filterTimeEnd ?? '';
      if (data.filterStatuses) filterStatuses.value = new Set(data.filterStatuses as string[]);
      if (data.filterTags) filterTags.value = new Set(data.filterTags as string[]);
      if (data.personSortMode) personSortMode.value = data.personSortMode;
      if (data.projectSortMode) projectSortMode.value = data.projectSortMode;
      if (data.projectSortKeyDates) projectSortKeyDates.value = data.projectSortKeyDates;
      if (data.positionOrder) positionOrder.value = data.positionOrder;
      if (data.detailPanelWidth !== undefined) detailPanelWidth.value = data.detailPanelWidth;
      if (data.holidayConfig) {
          holidayConfig.value = {
            weekendsEnabled: data.holidayConfig.weekendsEnabled ?? true,
            holidaysEnabled: data.holidayConfig.holidaysEnabled ?? true,
            holidayDates: data.holidayConfig.holidayDates ?? [],
            makeupWorkdays: data.holidayConfig.makeupWorkdays ?? [],
          };
        }
    } catch { /* ignore */ }
  }

  async function saveSettings(): Promise<void> {
    const viewId = currentViewId.value;
    if (!viewId) return;
    const data = {
      filterTimeStart: filterTimeStart.value,
      filterTimeEnd: filterTimeEnd.value,
      filterStatuses: [...filterStatuses.value],
      filterTags: [...filterTags.value],
      personSortMode: personSortMode.value,
      projectSortMode: projectSortMode.value,
      projectSortKeyDates: projectSortKeyDates.value,
      positionOrder: positionOrder.value,
      detailPanelWidth: detailPanelWidth.value,
      holidayConfig: holidayConfig.value,
    };
    await platform.storage.write(`settings/${safeName(viewId)}.json`, JSON.stringify(data, null, 2));
  }

  async function saveHolidayConfig(config: HolidayConfig): Promise<void> {
    holidayConfig.value = config;
    await saveSettings();
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
    scrollTargetDate,
    sharedScrollLeft,
    personScrollTop,
    projectScrollTop,
    personSortMode,
    projectSortMode,
    projectSortKeyDates,
    positionOrder,
    detailPanelWidth,
    filterTimeStart,
    filterTimeEnd,
    filterStatuses,
    filterTags,
    filteredProjectGroupKeys,
    filterDimmedTaskIds,
    availableFilterTags,
    timelineRange,
    conflicts,
    pendingChanges,
    tagDefinitions,
    holidayConfig,
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
    dismissChanges,
    loadTags,
    createTag,
    updateTag,
    deleteTag,
    saveSettings,
    saveHolidayConfig,
    loadSettings,
    _platform: platform,
  };
}

export type { GanttPlatform };
