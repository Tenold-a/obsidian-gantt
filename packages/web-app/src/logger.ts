import type { ILogger, LogEntry, LogLevel, LogSettings } from '@obsidian-gantt/core';
import { meetsLevel, createLogEntry, DEFAULT_LOG_SETTINGS } from '@obsidian-gantt/core';

const STORAGE_KEY = 'gantt:logs';

let settings: LogSettings = { ...DEFAULT_LOG_SETTINGS };

/** Update log settings at runtime. */
export function updateWebLogSettings(s: Partial<LogSettings>): void {
  settings = { ...settings, ...s };
}

/** Get current log settings. */
export function getWebLogSettings(): LogSettings {
  return { ...settings };
}

/** Create an ILogger instance for the web platform. */
export function createWebLogger(source: string): ILogger {
  return {
    debug(message: string, data?: unknown) {
      if (settings.enabled && meetsLevel('debug', settings.level)) {
        const entry = createLogEntry('debug', source, message, data);
        console.debug(`[${entry.level}] ${entry.source}: ${entry.message}`, entry.data ?? '');
        appendEntry(entry);
      }
    },
    info(message: string, data?: unknown) {
      if (settings.enabled && meetsLevel('info', settings.level)) {
        const entry = createLogEntry('info', source, message, data);
        console.log(`[${entry.level}] ${entry.source}: ${entry.message}`, entry.data ?? '');
        appendEntry(entry);
      }
    },
    warn(message: string, data?: unknown) {
      if (settings.enabled && meetsLevel('warn', settings.level)) {
        const entry = createLogEntry('warn', source, message, data);
        console.warn(`[${entry.level}] ${entry.source}: ${entry.message}`, entry.data ?? '');
        appendEntry(entry);
      }
    },
    error(message: string, data?: unknown) {
      if (settings.enabled && meetsLevel('error', settings.level)) {
        const entry = createLogEntry('error', source, message, data);
        console.error(`[${entry.level}] ${entry.source}: ${entry.message}`, entry.data ?? '');
        appendEntry(entry);
      }
    },
  };
}

/** Prune log entries older than retentionDays. Call on app startup. */
export function pruneWebLogs(): void {
  const cutoff = Date.now() - settings.retentionDays * 24 * 60 * 60 * 1000;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const entries: LogEntry[] = JSON.parse(raw);
    const filtered = entries.filter(e => new Date(e.timestamp).getTime() >= cutoff);
    if (filtered.length !== entries.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function appendEntry(entry: LogEntry): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const entries: LogEntry[] = raw ? JSON.parse(raw) : [];
    entries.push(entry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Silently discard on storage failure
  }
}
