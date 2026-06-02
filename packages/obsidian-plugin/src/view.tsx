import { h, render } from 'preact';
import { createGanttStore, GanttChart } from '@obsidian-gantt/ui';
import type { GanttPlatform } from '@obsidian-gantt/core';
import { ItemView, WorkspaceLeaf, requestUrl } from 'obsidian';
import { createObsidianPlatform, bindObsidianFetch } from './platform';

export const VIEW_TYPE = 'obsidian-gantt-view';

export class GanttView extends ItemView {
  private store: ReturnType<typeof createGanttStore> | null = null;
  private platform: GanttPlatform | null = null;

  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
  }

  getViewType(): string {
    return VIEW_TYPE;
  }

  getDisplayText(): string {
    return 'Gantt Chart';
  }

  getIcon(): string {
    return 'bar-chart-2';
  }

  async onOpen(): Promise<void> {
    this.platform = createObsidianPlatform(this.app as any);
    bindObsidianFetch(this.platform, requestUrl);
    this.store = createGanttStore(this.platform);

    // Ensure subdirectories exist for tags and settings
    const vault = (this.app as any).vault;
    const BASE = 'obsidian-gantt-data';
    for (const sub of ['tags', 'settings']) {
      const dir = `${BASE}/${sub}`;
      try {
        const exists = await vault.adapter.exists(dir);
        if (!exists) {
          await vault.createFolder(dir);
        }
      } catch { /* ignore */ }
    }

    const root = this.contentEl.createDiv('gantt-root');
    root.style.width = '100%';
    root.style.height = '100%';

    render(h(GanttChart, { store: this.store }), root);

    // Seed demo data if no views exist
    await this.seedIfEmpty();
  }

  private async seedIfEmpty(): Promise<void> {
    if (!this.platform || !this.store) return;

    try {
      const viewFiles = await this.platform.storage.list('views');
      if (viewFiles.length > 0) {
        // Views exist — load the first one
        const viewId = viewFiles[0].replace(/\.json$/, '');
        await this.store.loadView(viewId);
        return;
      }

      // No views — create demo setup with sample data
      const persons = [
        { id: 'alice', name: 'Alice Chen', position: 'Engineer' },
        { id: 'bob', name: 'Bob Martinez', position: 'Designer' },
        { id: 'carol', name: 'Carol Wu', position: 'Manager' },
      ];

      const projects = [
        { id: 'proj-api', name: 'API Redesign', color: '#4A90D9', description: 'Redesign the core API endpoints for v2', requester: 'Platform Team' },
        { id: 'proj-mobile', name: 'Mobile App v2', color: '#7B61F8' },
        { id: 'proj-infra', name: 'Infrastructure', color: '#98C379' },
        { id: 'proj-ux', name: 'UX Overhaul', color: '#E06C75' },
      ];

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
        { id: 't11', title: 'Wireframe review', startDate: '2026-06-01', endDate: '2026-06-05', progress: 0.7, personId: 'alice', projectId: 'proj-ux' },
      ];

      const cache = {
        connectorId: 'demo',
        lastFetch: new Date().toISOString(),
        lastError: null,
        tasks,
        persons,
        projects,
      };

      const view = {
        id: 'demo',
        name: 'Demo View',
        connectors: ['demo'],
        display: {
          defaultGroupBy: 'person' as const,
          visibleColumns: ['progress', 'person'] as ('progress' | 'person' | 'tags')[],
        },
      };

      const edits = {
        viewId: 'demo',
        overrides: {},
        order: [],
        hidden: [],
        localTasks: [],
      };

      await this.platform.storage.write('views/demo.json', JSON.stringify(view, null, 2));
      await this.platform.storage.write('cache/demo.json', JSON.stringify(cache, null, 2));
      await this.platform.storage.write('edits/demo.json', JSON.stringify(edits, null, 2));

      await this.store.loadView('demo');
    } catch (e) {
      // Seed failed — that's fine, UI shows empty state
      console.error('[Gantt] Seed failed:', e);
    }
  }

  async onClose(): Promise<void> {
    // Cleanup
  }
}
