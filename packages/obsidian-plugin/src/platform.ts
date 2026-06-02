import type { GanttPlatform, Theme } from '@obsidian-gantt/core';
import { createObsidianStorage } from './storage';
import { createObsidianConnectorLoader, createObsidianConnectorContext } from './connector-loader';
import { setIcon, MarkdownRenderer, Component } from 'obsidian';

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
  // Store app ref for MarkdownRenderer
  const appRef = app as any;

  const storage = createObsidianStorage(adapter);

  // Mutable ref so bindObsidianFetch can inject the real requestUrl later
  const fetchRef: { requestUrl: (opts: { url: string; method?: string; headers?: Record<string, string>; body?: string }) => Promise<{ json: unknown; status: number }> } = {
    requestUrl: () => {
      throw new Error('requestUrl not bound — call bindRequestUrl first');
    },
  };

  const connectorLoader = createObsidianConnectorLoader(adapter, (...args) => fetchRef.requestUrl(...args));

  const createConnectorContext = (config: Record<string, unknown>, viewState?: any) =>
    createObsidianConnectorContext(config, adapter, (...args) => fetchRef.requestUrl(...args), viewState);

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
    setIcon,
    renderMarkdown: async (el: HTMLElement, markdown: string) => {
      const component = new Component();
      await MarkdownRenderer.renderMarkdown(markdown, el, '', component);
    },
    openExternal: (url: string) => {
      // Ensure URL has a protocol prefix, otherwise shell.openExternal may open file manager
      let normalizedUrl = url.trim();
      if (!/^https?:\/\//i.test(normalizedUrl)) {
        normalizedUrl = 'https://' + normalizedUrl;
      }
      try {
        const electronRequire = (window as any).require;
        if (electronRequire) {
          const { shell } = electronRequire('electron');
          shell.openExternal(normalizedUrl);
        } else {
          window.open(normalizedUrl, '_blank');
        }
      } catch {
        window.open(normalizedUrl, '_blank');
      }
    },
    pickFile: (accept: string) => {
      return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = accept;
        input.style.display = 'none';
        let resolved = false;
        input.onchange = async () => {
          resolved = true;
          const file = input.files?.[0];
          if (!file) { resolve(null); return; }
          const content = await file.text();
          resolve({ name: file.name, content });
        };
        // Detect dialog cancel via window refocus
        const onFocus = () => {
          setTimeout(() => {
            if (!resolved) { resolved = true; resolve(null); }
            window.removeEventListener('focus', onFocus);
          }, 300);
        };
        window.addEventListener('focus', onFocus);
        document.body.appendChild(input);
        input.click();
        setTimeout(() => { input.remove(); }, 1000);
      });
    },
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
