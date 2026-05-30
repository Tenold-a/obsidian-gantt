// Re-export merge engine
export {
  mergeFields,
  mergeTasks,
  detectConflicts,
  applyFieldReset,
  mergeAll,
  applyStatusCascade,
} from './merge-engine';

// Re-export date utilities
export {
  daysBetween,
  addDays,
  dateToPixel,
  pixelToDate,
  snapToDay,
  isToday,
  todayString,
  getMonthRanges,
  computeTimelineRange,
} from './date-utils';
export type { MonthRange } from './date-utils';

// Re-export CSV parser
export { parseCSV } from './csv-parser';
export type { CsvParseOptions } from './csv-parser';

/** Lifecycle status for tasks and projects. */
export type TaskStatus = 'pending' | 'in-progress' | 'cancelled' | 'pending-online' | 'online' | 'completed';

// ============================================================
// Canonical Data Types (output by connector transform())
// ============================================================

/** A task as provided by an upstream connector. */
export interface Task {
  /** Upstream-unique identifier (required) */
  id: string;
  /** Task title (required) */
  title: string;
  /** Start date in ISO format (YYYY-MM-DD) */
  startDate?: string;
  /** End date in ISO format (YYYY-MM-DD) */
  endDate?: string;
  /** Progress 0-1 */
  progress?: number;
  /** Lifecycle status */
  status?: TaskStatus;
  /** References Person.id */
  personId?: string;
  /** References Project.id */
  projectId?: string;
  /** Parent task for hierarchy */
  parentId?: string;
  /** IDs of tasks this task depends on */
  dependencies?: string[];
  /** Arbitrary tags */
  tags?: string[];
  /** Link back to source system */
  url?: string;
  /** Connector-specific extra data (not merged, pass-through for rendering) */
  metadata?: Record<string, unknown>;
}

/** A person / team member. */
export interface Person {
  /** Unique identifier (required) */
  id: string;
  /** Display name (required) */
  name: string;
  /** Job title or role (e.g. "Engineer", "Manager") */
  position?: string;
  /** Optional avatar URL */
  avatar?: string;
}

/** A named date marker for a project (e.g. "Kickoff: 2026-06-01"). */
export interface KeyDate {
  /** Human-readable label */
  name: string;
  /** ISO date string (YYYY-MM-DD) */
  date: string;
  /** CSS-compatible color for the marker; defaults to amber if not set */
  color?: string;
  /** Single-character icon label rendered inside the marker diamond */
  icon?: string;
}

/** A named hyperlink attached to a project (e.g. "UI Design", "API Docs"). */
export interface KeyLink {
  /** Display label */
  name: string;
  /** URL */
  url: string;
}

/** A project. Independently declared; may have zero tasks. */
export interface Project {
  /** Unique identifier (required) */
  id: string;
  /** Display name (required) */
  name: string;
  /** Lifecycle status */
  status?: TaskStatus;
  /** CSS-compatible color for bars and headers */
  color?: string;
  /** Project introduction / summary */
  description?: string;
  /** Stakeholder or department requesting the project */
  requester?: string;
  /** Custom named date markers (milestones, deadlines, etc.) */
  keyDates?: KeyDate[];
  /** Named hyperlinks (design files, docs, etc.) */
  keyLinks?: KeyLink[];
  /** Connector-specific extra data */
  metadata?: Record<string, unknown>;
}

/** Standardised output from a connector's transform() function. */
export interface CanonicalData {
  tasks: Task[];
  persons: Person[];
  projects: Project[];
}

// ============================================================
// Connector Interface
// ============================================================

/** Context passed to connector scripts. */
export interface ConnectorContext {
  /** User-provided configuration from view settings */
  config: Record<string, unknown>;
  /** Platform-abstracted HTTP request function */
  request: (url: string, options?: RequestInit) => Promise<Response>;
  /** Debug logger */
  log: (message: string) => void;
  /** Read a local file and return its content as a string */
  readFile?: (path: string) => Promise<string>;
  /** Write content to a local file */
  writeFile?: (path: string, content: string) => Promise<void>;
  /** Parse CSV text into an array of record objects */
  parseCSV?: (text: string, options?: CsvParseOptions) => Record<string, string>[];
}

/** Exports expected from a connector script file. */
export interface ConnectorModule {
  fetch: (ctx: ConnectorContext) => Promise<unknown>;
  transform: (rawData: unknown, ctx: ConnectorContext) => CanonicalData;
  /** Optional: push local changes back to the upstream system */
  push?: (changes: PushChangesPayload, ctx: ConnectorContext) => Promise<PushResult>;
}

/** Payload passed to a connector's push() method. */
export interface PushChangesPayload {
  tasks: Task[];
  projects: Project[];
  deletedTaskIds: string[];
  deletedProjectIds: string[];
}

/** Result returned by a connector's push() method. */
export interface PushResult {
  success: boolean;
  error?: string;
}

/** Configuration for a connector instance. */
export interface ConnectorConfig {
  /** Connector identifier (e.g. "my-jira") */
  id: string;
  /** Human-readable name */
  name: string;
  /** Path to the connector script file */
  script: string;
  /** Configuration passed to the connector */
  config?: Record<string, unknown>;
  /** Auto-refresh interval in seconds (0 = manual only) */
  refreshInterval?: number;
}

// ============================================================
// Local Data Types (field-level source tracking)
// ============================================================

/** Tracks the origin of a field's current value. */
export type FieldSource = 'upstream' | 'manual';

/** Wraps a field value with its source. */
export interface FieldWithSource<T> {
  value: T;
  source: FieldSource;
}

/** A Task after merge with source tracking on every editable field. */
export interface LocalTask {
  id: string;
  title: FieldWithSource<string>;
  startDate: FieldWithSource<string | null>;
  endDate: FieldWithSource<string | null>;
  progress: FieldWithSource<number>;
  status: FieldWithSource<string>;
  personId: FieldWithSource<string | null>;
  projectId: FieldWithSource<string | null>;
  parentId: FieldWithSource<string | null>;
  dependencies: FieldWithSource<string[]>;
  tags: FieldWithSource<string[]>;
  url: FieldWithSource<string | null>;
  metadata: Record<string, unknown>;
  /** Connector that provided this task (null for local tasks) */
  connectorId: string | null;
  /** Original upstream task ID (null for local tasks) */
  upstreamId: string | null;
  /** Whether the task was deleted upstream */
  upstreamDeleted: boolean;
}

/** A partial Task stored as a user override. */
export type TaskOverride = Partial<
  Pick<Task, 'startDate' | 'endDate' | 'progress' | 'personId' | 'projectId' | 'parentId' | 'dependencies' | 'tags' | 'title' | 'status'>
>;

// ============================================================
// Local Storage File Schemas
// ============================================================

/** edits/<view-id>.json — user's intentional changes. */
export interface EditsOverlay {
  viewId: string;
  /** Field-level overrides keyed by task ID */
  overrides: Record<string, TaskOverride>;
  /** User-defined task ordering */
  order: string[];
  /** Task IDs the user has hidden */
  hidden: string[];
  /** Tasks created locally (no upstream source) */
  localTasks: Task[];
  /** Project-level field overrides keyed by project ID */
  projectOverrides?: Record<string, Partial<Pick<Project, 'name' | 'status' | 'description' | 'requester' | 'keyDates' | 'keyLinks'>>>;
  /** Task IDs marked for deletion */
  deletedTasks?: string[];
  /** Project IDs marked for deletion */
  deletedProjects?: string[];
}

/** cache/<connector-id>.json — upstream data snapshot. */
export interface CacheFile {
  connectorId: string;
  /** ISO timestamp of last successful fetch */
  lastFetch: string;
  /** Error message from last fetch, or null */
  lastError: string | null;
  tasks: Task[];
  persons: Person[];
  projects: Project[];
}

/** views/<view-id>.json — display configuration. */
export interface ViewDefinition {
  id: string;
  name: string;
  /** Connector IDs this view pulls data from */
  connectors: string[];
  /** Display settings */
  display: {
    /** Default grouping: 'project' or 'person' (the top pane switches to the other) */
    defaultGroupBy: 'project' | 'person';
    /** Which columns to show in the task list */
    visibleColumns: ('progress' | 'person' | 'tags')[];
    /** Override day width in pixels */
    dayWidth?: number;
  };
}

// ============================================================
// Conflict detection
// ============================================================

/** A conflict detected during merge. */
export interface Conflict {
  taskId: string;
  field: string;
  upstreamValue: unknown;
  manualValue: unknown;
}

// ============================================================
// Platform Abstraction
// ============================================================

/** Abstract file-system-like storage. */
export interface IStorage {
  read(path: string): Promise<string | null>;
  write(path: string, data: string): Promise<void>;
  delete(path: string): Promise<void>;
  list(dir: string): Promise<string[]>;
}

/** Abstract connector script loader. */
export interface IConnectorLoader {
  load(scriptPath: string): Promise<ConnectorModule>;
}

/** Optional file watcher for auto-refresh. */
export interface IWatcher {
  onChange(callback: (path: string) => void): void;
}

/** Theme abstraction. */
export interface Theme {
  isDark(): boolean;
  onChange(callback: (dark: boolean) => void): void;
  variables: Record<string, string>;
}

/** Platform abstraction — core and UI depend only on this. */
export interface GanttPlatform {
  storage: IStorage;
  fetch: typeof globalThis.fetch;
  connectorLoader: IConnectorLoader;
  /** Create a ConnectorContext for executing connector scripts */
  createConnectorContext: (config: Record<string, unknown>) => ConnectorContext;
  watcher: IWatcher | null;
  theme: Theme;
}

// ============================================================
// Error Types
// ============================================================

/** Structured error from the platform layer. */
export class PlatformError extends Error {
  constructor(
    message: string,
    public code: 'CONNECTOR_NOT_FOUND' | 'FETCH_ERROR' | 'STORAGE_ERROR' | 'VALIDATION_ERROR' | 'CONNECTOR_SCRIPT_ERROR',
    public cause?: Error,
  ) {
    super(message);
    this.name = 'PlatformError';
  }
}
