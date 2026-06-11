import { render } from 'preact';
import { useEffect } from 'preact/hooks';
import { createGanttStore, GanttChart } from '@obsidian-gantt/ui';
import type { GanttPlatform, IStorage, Theme, IConnectorLoader, ConnectorModule, ConnectorContext, CsvParseOptions } from '@obsidian-gantt/core';
import { parseCSV } from '@obsidian-gantt/core';
import { createWebLogger, pruneWebLogs } from './logger';

// ── Browser localStorage adapter ──────────────────────────────────

const browserStorage: IStorage = {
  async read(path: string): Promise<string | null> {
    return localStorage.getItem(`gantt:${path}`);
  },
  async write(path: string, data: string): Promise<void> {
    localStorage.setItem(`gantt:${path}`, data);
  },
  async delete(path: string): Promise<void> {
    localStorage.removeItem(`gantt:${path}`);
  },
  async list(dir: string): Promise<string[]> {
    const prefix = `gantt:${dir}`;
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(prefix)) {
        keys.push(key.slice('gantt:'.length));
      }
    }
    return keys;
  },
};

// ── Browser theme adapter ─────────────────────────────────────────

const browserTheme: Theme = {
  isDark() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  },
  onChange(callback: (dark: boolean) => void) {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => callback(e.matches);
    mq.addEventListener('change', handler);
  },
  variables: {},
};

// ── Web connector loader ──────────────────────────────────────────

const webConnectorLoader: IConnectorLoader = {
  async load(scriptPath: string): Promise<ConnectorModule> {
    // Try multiple base paths: relative to current origin, then relative to the page
    const bases = ['.', '/connectors'];
    let source: string | null = null;

    for (const base of bases) {
      try {
        const url = `${base}/${scriptPath}`;
        const response = await window.fetch(url);
        if (response.ok) {
          source = await response.text();
          break;
        }
      } catch { /* try next base */ }
    }

    if (!source) {
      throw new Error(`Connector script not found: ${scriptPath}`);
    }

    // Execute the connector script in a controlled scope
    const moduleCode = `
      const module = { exports: {} };
      const exports = module.exports;
      ${source}
      return module.exports;
    `;

    // eslint-disable-next-line no-new-func
    const fn = new Function(moduleCode);
    const mod = fn() as ConnectorModule;

    if (!mod || typeof mod.fetch !== 'function' || typeof mod.transform !== 'function') {
      throw new Error(
        `Connector script must export fetch() and transform() functions. Found: ${Object.keys(mod ?? {}).join(', ')}`
      );
    }

    // Validate detail method pairing
    const hasFetchDetail = typeof mod.fetchDetail === 'function';
    const hasTransformDetail = typeof mod.transformDetail === 'function';
    if (hasFetchDetail !== hasTransformDetail) {
      throw new Error(
        `Connector script must export both fetchDetail() and transformDetail() together, or neither.`
      );
    }

    return mod;
  },
};

// ── Web connector context factory ──────────────────────────────────

function createWebConnectorContext(connectorCfg: Record<string, unknown>, viewState?: any, connectorId?: string): ConnectorContext {
  const source = connectorId ? `connector:${connectorId}` : 'connector';
  const logger = createWebLogger(source);
  const innerConfig = (connectorCfg.config ?? connectorCfg) as Record<string, unknown>;
  return {
    config: innerConfig,
    viewState,
    log: (message: string) => logger.info(message),
    logger,
    request: (url: string, opts?: RequestInit) => window.fetch(url, opts),
    readFile: async (path: string): Promise<string> => {
      const response = await window.fetch(path);
      if (!response.ok) {
        throw new Error(`Failed to read file: ${response.status} ${response.statusText}`);
      }
      return await response.text();
    },
    writeFile: async (path: string, content: string): Promise<void> => {
      localStorage.setItem(`gantt:file:${path}`, content);
    },
    parseCSV: (text: string, options?: CsvParseOptions): Record<string, string>[] => {
      return parseCSV(text, options);
    },
  };
}

// ── Platform ──────────────────────────────────────────────────────

const platform: GanttPlatform = {
  storage: browserStorage,
  fetch: window.fetch.bind(window),
  connectorLoader: webConnectorLoader,
  createConnectorContext: (config: Record<string, unknown>, viewState?: any, connectorId?: string) => createWebConnectorContext(config, viewState, connectorId),
  createLogger: (source: string) => createWebLogger(source),
  watcher: null,
  theme: browserTheme,
  setIcon(el: HTMLElement, name: string) {
    el.textContent = name;
  },
  renderMarkdown(el: HTMLElement, markdown: string) {
    // Simple markdown-to-HTML: bold, italic, code, links, line breaks
    let html = markdown
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    html = html
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code>$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/\n/g, '<br>');
    el.innerHTML = html;
  },
  openExternal: (url: string) => {
    let normalizedUrl = url.trim();
    if (!/^https?:\/\//i.test(normalizedUrl)) {
      normalizedUrl = 'https://' + normalizedUrl;
    }
    window.open(normalizedUrl, '_blank');
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
};

// ── Seed sample data (runs once) ───────────────────────────────────

async function seedSampleData() {
  const viewExists = await platform.storage.read('views/demo.json');
  if (viewExists) return; // already seeded

  // Sample persons
  const persons = [
    { id: 'alice', name: 'Alice Chen', avatar: '' },
    { id: 'bob', name: 'Bob Martinez', avatar: '' },
    { id: 'carol', name: 'Carol Wu', avatar: '' },
  ];

  // Sample projects
  const projects = [
    { id: 'proj-api', name: 'API Redesign', color: '#4A90D9' },
    { id: 'proj-mobile', name: 'Mobile App v2', color: '#7B61F8' },
    { id: 'proj-infra', name: 'Infrastructure', color: '#98C379' },
    { id: 'proj-ux', name: 'UX Overhaul', color: '#E06C75' },
  ];

  // Sample tasks
  const tasks = [
    { id: 't1', title: 'Design new endpoints', startDate: '2026-06-01', endDate: '2026-06-08', progress: 1, personId: 'alice', projectId: 'proj-api' },
    { id: 't2', title: 'Implement auth middleware', startDate: '2026-06-03', endDate: '2026-06-12', progress: 0.6, personId: 'bob', projectId: 'proj-api' },
    { id: 't3', title: 'Write API tests', startDate: '2026-06-10', endDate: '2026-06-18', progress: 0.1, personId: 'carol', projectId: 'proj-api' },
    { id: 't4', title: 'Deploy API to staging', startDate: '2026-06-19', endDate: '2026-06-22', progress: 0, personId: 'alice', projectId: 'proj-api' },
    { id: 't5', title: 'Home screen redesign', startDate: '2026-05-28', endDate: '2026-06-10', progress: 0.8, personId: 'carol', projectId: 'proj-mobile' },
    { id: 't6', title: 'Push notification system', startDate: '2026-06-05', endDate: '2026-06-20', progress: 0.3, personId: 'bob', projectId: 'proj-mobile' },
    { id: 't7', title: 'Offline sync engine', startDate: '2026-06-15', endDate: '2026-07-05', progress: 0, personId: 'bob', projectId: 'proj-mobile' },
    { id: 't8', title: 'Set up CI/CD pipeline', startDate: '2026-05-25', endDate: '2026-06-02', progress: 0.95, personId: 'alice', projectId: 'proj-infra' },
    { id: 't9', title: 'Database migration plan', startDate: '2026-06-08', endDate: '2026-06-16', progress: 0.4, personId: 'carol', projectId: 'proj-infra' },
    { id: 't10', title: 'User research sessions', startDate: '2026-06-01', endDate: '2026-06-07', progress: 0.5, personId: 'alice', projectId: 'proj-ux' },
  ];

  // Cache file
  const cache = {
    connectorId: 'sample',
    lastFetch: new Date().toISOString(),
    lastError: null,
    tasks,
    persons,
    projects,
  };

  // View definition
  const view = {
    id: 'demo',
    name: 'Demo View',
    connectors: ['sample'],
    display: {
      defaultGroupBy: 'person' as const,
      visibleColumns: ['progress', 'person'] as ('progress' | 'person' | 'tags')[],
    },
  };

  // Edits overlay (empty — no user overrides)
  const edits = {
    viewId: 'demo',
    overrides: {},
    order: [],
    hidden: [],
    localTasks: [],
  };

  await platform.storage.write('views/demo.json', JSON.stringify(view, null, 2));
  await platform.storage.write('cache/sample.json', JSON.stringify(cache, null, 2));
  await platform.storage.write('edits/demo.json', JSON.stringify(edits, null, 2));

  // Also seed a connector config so detail fetching can locate the connector
  const connectorCfg = { script: 'connectors/api-connector.js', config: { baseUrl: 'http://localhost:3456', pushDelay: 800, failEvery: 0 } };
  await platform.storage.write('connectors/sample.json', JSON.stringify(connectorCfg, null, 2));
}

// ── App ────────────────────────────────────────────────────────────

// Prune expired logs on startup
pruneWebLogs();

function App() {
  const store = createGanttStore(platform);

  useEffect(() => {
    seedSampleData().then(() => store.loadView('demo'));
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <GanttChart store={store} />
    </div>
  );
}

render(<App />, document.getElementById('app')!);
