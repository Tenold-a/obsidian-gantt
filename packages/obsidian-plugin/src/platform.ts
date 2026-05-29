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
  const connectorLoader = createObsidianConnectorLoader(adapter, (opts) => {
    // At runtime, Obsidian provides requestUrl globally.
    // This is a typed wrapper that will be bound when the plugin loads.
    throw new Error('requestUrl not bound — call bindRequestUrl first');
  });

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

  return {
    storage,
    fetch: globalThis.fetch.bind(globalThis),
    connectorLoader,
    watcher: null, // File watching handled by Obsidian's vault events
    theme,
  };
}

// Allow binding requestUrl after platform creation
export function bindObsidianFetch(
  platform: GanttPlatform,
  requestUrl: (opts: { url: string; method?: string; headers?: Record<string, string>; body?: string }) => Promise<{ json: unknown; status: number }>,
) {
  // Replace connector loader with one that has requestUrl bound
  // (The platform is re-created or the fetch is injected)
  (platform as any)._requestUrl = requestUrl;
}
