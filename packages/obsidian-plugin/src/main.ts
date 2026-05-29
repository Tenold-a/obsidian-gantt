// Obsidian plugin main entry point.
// Uses Obsidian's Plugin API (resolved at runtime, external at build time).

import type { Plugin, PluginManifest, App, TFile } from 'obsidian';
import { GanttView } from './view';

declare module 'obsidian' {
  interface App {
    vault: {
      adapter: {
        read(path: string): Promise<string>;
        write(path: string, data: string): Promise<void>;
        exists(path: string): Promise<boolean>;
        list(path: string): Promise<{ files: string[]; folders: string[] }>;
        remove(path: string): Promise<void>;
      };
    };
    workspace: {
      getLeavesOfType(type: string): any[];
      getRightLeaf(create: boolean): any;
      revealLeaf(leaf: any, split?: string): void;
      onLayoutReady(callback: () => void): void;
    };
  }
}

const VIEW_TYPE = 'obsidian-gantt-view';

export default class GanttPlugin extends Plugin {
  async onload(): Promise<void> {
    this.registerView(
      VIEW_TYPE,
      (leaf: any) => {
        const view = new GanttView(leaf.containerEl ?? leaf, this.app);
        return view;
      },
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
    // Cleanup handled automatically by Obsidian
  }

  async activateView(): Promise<void> {
    const { workspace } = this.app;

    const leaves = workspace.getLeavesOfType(VIEW_TYPE);
    if (leaves.length > 0) {
      workspace.revealLeaf(leaves[0], 'right');
      return;
    }

    const rightLeaf = workspace.getRightLeaf(false);
    if (rightLeaf) {
      workspace.revealLeaf(rightLeaf, 'right');
      (rightLeaf as any).setViewState?.({ type: VIEW_TYPE, active: true });
    }
  }
}
