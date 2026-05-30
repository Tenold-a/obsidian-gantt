import { h, render } from 'preact';
import { createGanttStore, GanttChart } from '@obsidian-gantt/ui';
import type { GanttPlatform } from '@obsidian-gantt/core';
import { ItemView, WorkspaceLeaf } from 'obsidian';
import { createObsidianPlatform } from './platform';

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
    this.store = createGanttStore(this.platform);

    const root = this.contentEl.createDiv('gantt-root');
    root.style.width = '100%';
    root.style.height = '100%';

    render(h(GanttChart, { store: this.store }), root);

    // Auto-load the first available view
    try {
      const viewFiles = await this.platform.storage.list('views');
      if (viewFiles.length > 0) {
        const viewId = viewFiles[0].replace(/\.json$/, '');
        await this.store.loadView(viewId);
      }
    } catch {
      // No views yet — that's fine, UI shows empty state
    }
  }

  async onClose(): Promise<void> {
    // Cleanup
  }
}
