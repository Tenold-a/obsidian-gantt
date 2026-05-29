import { h, render } from 'preact';
import { createGanttStore, GanttChart } from '@obsidian-gantt/ui';
import type { GanttPlatform } from '@obsidian-gantt/core';
import { createObsidianPlatform } from './platform';

export class GanttView {
  private store: ReturnType<typeof createGanttStore> | null = null;
  private platform: GanttPlatform | null = null;

  constructor(
    private containerEl: HTMLElement,
    private app: { vault: { adapter: unknown } },
  ) {}

  getViewType(): string {
    return 'obsidian-gantt-view';
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

    const root = this.containerEl.createDiv('gantt-root');
    root.style.width = '100%';
    root.style.height = '100%';

    render(h(GanttChart, { store: this.store }), root);

    // Try to auto-load the first view
    try {
      const views = await this.platform.storage.list('views');
      if (views.length > 0) {
        const viewId = views[0].replace(/\.json$/, '');
        await this.store.loadView(viewId);
      }
    } catch {
      // No views yet — that's fine
    }
  }

  async onClose(): Promise<void> {
    // Cleanup
  }
}

export function createGanttView(
  containerEl: HTMLElement,
  app: { vault: { adapter: unknown } },
): GanttView {
  return new GanttView(containerEl, app);
}
