import type { GanttPlatform, Theme } from '@obsidian-gantt/core';
import { createObsidianStorage } from './storage';
import { createObsidianConnectorLoader, createObsidianConnectorContext } from './connector-loader';

interface ObsidianAppLike {
  vault: {
    adapter: {
      read(path: string): Promise<string>;
      write(path: string, data: string): Promise<void>;
      exists(path: string): Promise<boolean>;
      list(path: string): Promise<{ files: string[]; folders: string[] }>;
      remove(path: string): Promise<void>;
    };
  };
}

export function createObsidianPlatform(app: ObsidianAppLike): GanttPlatform {
  const adapter = app.vault.adapter;

  const storage = createObsidianStorage(adapter);

  // Mutable ref so bindObsidianFetch can inject the real requestUrl later
  const fetchRef: { requestUrl: (opts: { url: string; method?: string; headers?: Record<string, string>; body?: string }) => Promise<{ json: unknown; status: number }> } = {
    requestUrl: () => {
      throw new Error('requestUrl not bound — call bindRequestUrl first');
    },
  };

  const connectorLoader = createObsidianConnectorLoader(adapter, (...args) => fetchRef.requestUrl(...args));

  const createConnectorContext = (config: Record<string, unknown>) =>
    createObsidianConnectorContext(config, adapter, (...args) => fetchRef.requestUrl(...args));

  const theme: Theme = {
    isDark: () => {
      // Check Obsidian's theme
      const body = document.body;
      return body?.classList.contains('theme-dark') ?? false;
    },
    onChange: (cb: (dark: boolean) => void) => {
      const observer = new MutationObserver(() => {
        cb(theme.isDark());
      });
      observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['class'],
      });
    },
    variables: {},
  };

  const platform: GanttPlatform = {
    storage,
    fetch: globalThis.fetch.bind(globalThis),
    connectorLoader,
    createConnectorContext,
    watcher: null, // File watching handled by Obsidian's vault events
    theme,
  } as GanttPlatform;

  // Expose fetchRef so bindObsidianFetch can inject the real requestUrl
  (platform as any)._fetchRef = fetchRef;

  return platform;
}

// Allow binding requestUrl after platform creation
export function bindObsidianFetch(
  platform: GanttPlatform,
  requestUrl: (opts: { url: string; method?: string; headers?: Record<string, string>; body?: string }) => Promise<{ json: unknown; status: number }>,
) {
  // Inject requestUrl into the platform's fetch ref
  const fetchRef = (platform as any)._fetchRef;
  if (fetchRef) {
    fetchRef.requestUrl = requestUrl;
  }
}
