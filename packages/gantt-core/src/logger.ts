/** Log severity levels. */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/** Structured log entry produced by the logging system. */
export interface LogEntry {
  /** ISO 8601 timestamp */
  timestamp: string;
  /** Severity level */
  level: LogLevel;
  /** Component that produced this entry (e.g. "plugin", "connector:csv-connector") */
  source: string;
  /** Human-readable message */
  message: string;
  /** Optional structured data attached to the entry */
  data?: unknown;
}

/** User-configurable logging settings. */
export interface LogSettings {
  /** Whether logging is enabled at all */
  enabled: boolean;
  /** Minimum level to record; entries below this level are discarded */
  level: LogLevel;
  /** Number of days to keep log files before automatic cleanup */
  retentionDays: number;
}

/** Default log settings used when no user configuration exists. */
export const DEFAULT_LOG_SETTINGS: LogSettings = {
  enabled: true,
  level: 'info',
  retentionDays: 30,
};

/** Level priority for filtering: higher number = more severe. */
const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

/** Return true if `entryLevel` meets the configured minimum. */
export function meetsLevel(entryLevel: LogLevel, minLevel: LogLevel): boolean {
  return LEVEL_ORDER[entryLevel] >= LEVEL_ORDER[minLevel];
}

/**
 * Platform-agnostic logger interface.
 * Each platform (Obsidian, Web) provides its own implementation.
 */
export interface ILogger {
  debug(message: string, data?: unknown): void;
  info(message: string, data?: unknown): void;
  warn(message: string, data?: unknown): void;
  error(message: string, data?: unknown): void;
}

/** Create a LogEntry with the current timestamp. */
export function createLogEntry(
  level: LogLevel,
  source: string,
  message: string,
  data?: unknown,
): LogEntry {
  return {
    timestamp: new Date().toISOString(),
    level,
    source,
    message,
    data,
  };
}
