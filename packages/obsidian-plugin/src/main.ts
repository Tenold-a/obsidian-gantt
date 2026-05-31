// Obsidian plugin main entry point.
// Uses Obsidian's Plugin API (resolved at runtime, external at build time).

import { Plugin, WorkspaceLeaf } from 'obsidian';
import { GanttView, VIEW_TYPE } from './view';

export default class GanttPlugin extends Plugin {
  async onload(): Promise<void> {
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
    // Cleanup handled automatically by Obsidian
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
