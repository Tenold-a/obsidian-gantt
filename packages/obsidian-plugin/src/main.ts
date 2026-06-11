// Obsidian plugin main entry point.
// Uses Obsidian's Plugin API (resolved at runtime, external at build time).

import { Plugin, WorkspaceLeaf } from 'obsidian';
import { GanttView, VIEW_TYPE } from './view';
import { GanttSettingTab, DEFAULT_SETTINGS, migrateHolidayConfig, saveSettings, getSettings } from './settings';
import { initLogStore, destroyLogStore } from './logger';
import { createObsidianStorage } from './storage';

export { getSettings } from './settings';
export { initLogStore, destroyLogStore } from './logger';

export default class GanttPlugin extends Plugin {
  async onload(): Promise<void> {
    // Load persisted settings
    const data = await this.loadData();
    const saved = data && typeof data === 'object' ? data : {};
    const settings = { ...DEFAULT_SETTINGS, ...saved };
    await saveSettings(this, settings);

    // Migrate per-view holiday config to plugin-level (one-time)
    const vault = (this.app as any).vault;
    if (!data?.holidayConfig) {
      const migrated = await migrateHolidayConfig(this, vault);
      if (migrated) {
        await saveSettings(this, { holidayConfig: migrated });
      }
    }

    // Initialize log store with IStorage (proven write+retry+ensureDir logic)
    const logStorage = createObsidianStorage(vault.adapter);
    await initLogStore(logStorage, getSettings().logSettings);

    // Register settings tab
    this.addSettingTab(new GanttSettingTab(this.app, this));

    this.registerView(
      VIEW_TYPE,
      (leaf: WorkspaceLeaf) => new GanttView(leaf),
    );

    this.addRibbonIcon('bar-chart-2', 'Open Gantt Chart', () => {
      this.activateView();
    });

    this.addCommand({
      id: 'open-gantt-chart',
      name: 'Open Gantt Chart',
      callback: () => {
        this.activateView();
      },
    });
  }

  async onunload(): Promise<void> {
    await destroyLogStore();
  }

  async activateView(): Promise<void> {
    const { workspace } = this.app;

    const leaves = workspace.getLeavesOfType(VIEW_TYPE);
    if (leaves.length > 0) {
      workspace.revealLeaf(leaves[0]);
      return;
    }

    await workspace.getLeaf(false)?.setViewState({
      type: VIEW_TYPE,
      active: true,
    });
  }
}
