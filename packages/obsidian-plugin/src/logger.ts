import type { ILogger, LogEntry, LogLevel, LogSettings, IStorage } from '@obsidian-gantt/core';
import { meetsLevel, createLogEntry, DEFAULT_LOG_SETTINGS } from '@obsidian-gantt/core';

const LOG_DIR = 'logs';
const FLUSH_INTERVAL_MS = 5000;

/** Shared log store — all ILogger instances feed into this single buffer. */
class LogStore {
  private entries: LogEntry[] = [];
  private settings: LogSettings = { ...DEFAULT_LOG_SETTINGS };
  private flushTimer: ReturnType<typeof setInterval> | null = null;
  private storage: IStorage | null = null;

  /** Initialise the store with an IStorage and optional settings. */
  async init(storage: IStorage, settings?: Partial<LogSettings>): Promise<void> {
    this.storage = storage;
    if (settings) {
      this.settings = { ...this.settings, ...settings };
    }
    if (this.settings.enabled) {
      this.startFlushTimer();
      // Emit a baseline entry so the user can confirm logging is working
      this.push(createLogEntry('info', 'plugin', 'Logging initialized', {
        level: this.settings.level,
        retentionDays: this.settings.retentionDays,
      }));
    }
    this.pruneOldLogs();
  }

  /** Update settings at runtime (e.g. from settings tab). */
  updateSettings(settings: Partial<LogSettings>): void {
    const previous = { ...this.settings };
    this.settings = { ...this.settings, ...settings };
    if (!this.settings.enabled && this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    } else if (this.settings.enabled && !this.flushTimer && this.storage) {
      this.startFlushTimer();
    }
    // Log settings changes when logging is enabled
    if (this.settings.enabled) {
      const changed: string[] = [];
      if (settings.enabled !== undefined && settings.enabled !== previous.enabled) {
        changed.push(`enabled: ${previous.enabled} -> ${settings.enabled}`);
      }
      if (settings.level !== undefined && settings.level !== previous.level) {
        changed.push(`level: ${previous.level} -> ${settings.level}`);
      }
      if (settings.retentionDays !== undefined && settings.retentionDays !== previous.retentionDays) {
        changed.push(`retention: ${previous.retentionDays}d -> ${settings.retentionDays}d`);
      }
      if (changed.length > 0) {
        this.push(createLogEntry('info', 'plugin', 'Log settings updated', { changes: changed }));
      }
    }
  }

  getSettings(): LogSettings {
    return { ...this.settings };
  }

  /** Push an entry to the buffer. No-op if logging is disabled or level too low. */
  push(entry: LogEntry): void {
    if (!this.settings.enabled) return;
    if (!meetsLevel(entry.level, this.settings.level)) return;
    this.entries.push(entry);
  }

  /** Flush buffered entries to disk via IStorage. */
  async flush(): Promise<void> {
    if (!this.storage || this.entries.length === 0) return;

    const toWrite = this.entries.splice(0);
    const today = new Date().toISOString().slice(0, 10);
    const filePath = `${LOG_DIR}/gantt-${today}.json`;

    try {
      let existing: LogEntry[] = [];
      const raw = await this.storage.read(filePath);
      if (raw) {
        try {
          existing = JSON.parse(raw);
        } catch {
          existing = [];
        }
      }
      const merged = [...existing, ...toWrite];
      const serialized = JSON.stringify(merged, null, 2);
      await this.storage.write(filePath, serialized);
      console.log(`[Gantt] Log flushed: ${toWrite.length} entries -> ${filePath} (${serialized.length} bytes)`);
    } catch (err) {
      console.error('[Gantt] Log flush failed:', err);
    }
  }

  /** Clean up log files older than retentionDays. */
  async pruneOldLogs(): Promise<void> {
    if (!this.storage) return;

    const cutoff = Date.now() - this.settings.retentionDays * 24 * 60 * 60 * 1000;

    try {
      const files = await this.storage.list(LOG_DIR);
      for (const f of files) {
        const match = f.match(/gantt-(\d{4}-\d{2}-\d{2})\.json$/);
        if (match) {
          const fileDate = new Date(match[1]).getTime();
          if (fileDate < cutoff) {
            await this.storage.delete(`${LOG_DIR}/${f}`).catch(() => {});
          }
        }
      }
    } catch {
      // Directory may not exist yet — that's fine
    }
  }

  /** Destroy the store: flush and stop timer. */
  async destroy(): Promise<void> {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
    await this.flush();
  }

  private startFlushTimer(): void {
    this.flushTimer = setInterval(() => {
      this.flush().catch(() => {});
    }, FLUSH_INTERVAL_MS);
  }
}

/** Module-level singleton store. */
const store = new LogStore();

/** Create an ILogger instance that writes to the shared store. */
export function createObsidianLogger(source: string): ILogger {
  return {
    debug(message: string, data?: unknown) {
      store.push(createLogEntry('debug', source, message, data));
    },
    info(message: string, data?: unknown) {
      store.push(createLogEntry('info', source, message, data));
    },
    warn(message: string, data?: unknown) {
      store.push(createLogEntry('warn', source, message, data));
    },
    error(message: string, data?: unknown) {
      store.push(createLogEntry('error', source, message, data));
    },
  };
}

/** Initialise the log store. Called once during plugin startup. */
export async function initLogStore(
  storage: IStorage,
  settings?: Partial<LogSettings>,
): Promise<void> {
  await store.init(storage, settings);
}

/** Update log settings at runtime. Called from the settings tab. */
export function updateLogSettings(settings: Partial<LogSettings>): void {
  store.updateSettings(settings);
}

/** Get current log settings. */
export function getLogSettings(): LogSettings {
  return store.getSettings();
}

/** Flush and shutdown the log store. Called on plugin unload. */
export function destroyLogStore(): Promise<void> {
  return store.destroy();
}
