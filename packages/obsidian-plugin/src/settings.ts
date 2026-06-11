import type { HolidayConfig, LogSettings } from '@obsidian-gantt/core';
import { DEFAULT_LOG_SETTINGS, parseICS, classifyICSEvents } from '@obsidian-gantt/core';
import { PluginSettingTab, Setting, App, Plugin } from 'obsidian';
import { updateLogSettings } from './logger';

export interface GanttPluginSettings {
  holidayConfig: HolidayConfig;
  logSettings: LogSettings;
}

export const DEFAULT_SETTINGS: GanttPluginSettings = {
  holidayConfig: {
    weekendsEnabled: true,
    holidaysEnabled: true,
    holidayDates: [],
    makeupWorkdays: [],
  },
  logSettings: { ...DEFAULT_LOG_SETTINGS },
};

let pluginSettings: GanttPluginSettings = { ...DEFAULT_SETTINGS };

export function getSettings(): GanttPluginSettings {
  return pluginSettings;
}

export async function saveSettings(
  plugin: Plugin,
  update: Partial<GanttPluginSettings>,
): Promise<void> {
  pluginSettings = { ...pluginSettings, ...update };
  if (update.logSettings) {
    updateLogSettings(update.logSettings);
  }
  await plugin.saveData(pluginSettings);
}

export async function migrateHolidayConfig(
  plugin: Plugin,
  vault: { adapter: { read(path: string): Promise<string>; write(path: string, data: string): Promise<void>; exists(path: string): Promise<boolean>; list(path: string): Promise<{ files: string[]; folders: string[] }> } },
): Promise<HolidayConfig | null> {
  const settingsDir = 'obsidian-gantt-data/settings';
  try {
    const listResult = await vault.adapter.list(settingsDir);
    const files = listResult?.files ?? [];
    const merged: HolidayConfig = {
      weekendsEnabled: true,
      holidaysEnabled: true,
      holidayDates: [],
      makeupWorkdays: [],
    };
    let found = false;
    for (const filePath of files) {
      try {
        const exists = await vault.adapter.exists(filePath);
        if (!exists) continue;
        const raw = await vault.adapter.read(filePath);
        const data = JSON.parse(raw);
        if (!data.holidayConfig) continue;
        found = true;
        const hc = data.holidayConfig;
        if (hc.holidayDates) {
          for (const d of hc.holidayDates) {
            if (!merged.holidayDates.includes(d)) merged.holidayDates.push(d);
          }
        }
        if (hc.makeupWorkdays) {
          for (const d of hc.makeupWorkdays) {
            if (!merged.makeupWorkdays.includes(d)) merged.makeupWorkdays.push(d);
          }
        }
        if (hc.weekendsEnabled !== undefined && found) {
          merged.weekendsEnabled = hc.weekendsEnabled;
        }
        if (hc.holidaysEnabled !== undefined) {
          merged.holidaysEnabled = hc.holidaysEnabled;
        }
        delete data.holidayConfig;
        await vault.adapter.write(filePath, JSON.stringify(data, null, 2));
      } catch { /* skip corrupted */ }
    }
    return found ? merged : null;
  } catch {
    return null;
  }
}

// ─── Tab helper ───────────────────────────────────────────────

type TabId = 'holidays' | 'connectors' | 'logging';

const TAB_DEFS: { id: TabId; label: string }[] = [
  { id: 'holidays', label: 'Holidays' },
  { id: 'connectors', label: 'Connectors' },
  { id: 'logging', label: 'Logging' },
];

/** Shared CSS injected once into the settings container. */
function injectStyles(container: HTMLElement): void {
  if (container.querySelector('#gantt-settings-styles')) return;
  const style = document.createElement('style');
  style.id = 'gantt-settings-styles';
  style.textContent = `
    .gantt-tab-bar { display: flex; gap: 0; border-bottom: 1px solid var(--background-modifier-border); margin-bottom: 20px; padding: 0 4px; }
    .gantt-tab-btn { padding: 8px 20px; font-size: 13px; font-weight: 500; border: none; border-bottom: 2px solid transparent; background: none; color: var(--text-muted); cursor: pointer; border-radius: 0; transition: color 0.15s, border-color 0.15s; }
    .gantt-tab-btn:hover { color: var(--text-normal); background: none; }
    .gantt-tab-btn.active { color: var(--text-accent); border-bottom-color: var(--text-accent); }
    .gantt-tab-content { display: none; }
    .gantt-tab-content.active { display: block; }
    .gantt-date-chips { display: flex; flex-wrap: wrap; gap: 6px; margin: 4px 0 12px 0; }
    .gantt-date-chip { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; font-size: 12px; border-radius: 12px; background: var(--background-modifier-hover); border: 1px solid var(--background-modifier-border); }
    .gantt-date-chip .gantt-chip-remove { cursor: pointer; opacity: 0.5; font-size: 14px; line-height: 1; padding: 0 2px; }
    .gantt-date-chip .gantt-chip-remove:hover { opacity: 1; color: var(--text-error); }
    .gantt-date-chip.holiday { border-color: var(--text-error); background: rgba(var(--color-red-rgb), 0.08); }
    .gantt-date-chip.makeup { border-color: var(--text-accent); background: rgba(var(--color-blue-rgb), 0.08); }
    .gantt-connector-card { padding: 10px 12px; margin-bottom: 8px; border: 1px solid var(--background-modifier-border); border-radius: 6px; background: var(--background-secondary); }
    .gantt-connector-card .gantt-connector-header { display: flex; align-items: center; gap: 10px; }
    .gantt-connector-card .gantt-connector-name { font-weight: 600; font-size: 13px; flex: 1; }
    .gantt-connector-card .gantt-connector-meta { font-size: 11px; color: var(--text-muted); }
    .gantt-connector-card .gantt-connector-actions { display: flex; gap: 6px; }
    .gantt-inline-row { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
    .gantt-inline-row label { font-size: 12px; color: var(--text-muted); min-width: 80px; white-space: nowrap; }
    .gantt-inline-row input[type="text"], .gantt-inline-row input[type="number"] { flex: 1; padding: 4px 8px; font-size: 12px; border: 1px solid var(--background-modifier-border); border-radius: 4px; background: var(--background-primary); color: var(--text-normal); }
    .gantt-inline-row textarea { width: 100%; font-family: var(--font-monospace); font-size: 12px; border: 1px solid var(--background-modifier-border); border-radius: 4px; background: var(--background-primary); color: var(--text-normal); resize: vertical; }
    .gantt-section-label { font-size: 11px; font-weight: 600; text-transform: uppercase; color: var(--text-faint); margin: 16px 0 6px 0; letter-spacing: 0.5px; }
    .gantt-empty-hint { font-size: 12px; color: var(--text-faint); font-style: italic; }
    .gantt-view-selector { display: flex; align-items: center; gap: 8px; margin-bottom: 14px; }
    .gantt-view-selector label { font-size: 12px; color: var(--text-muted); white-space: nowrap; }
    .gantt-view-selector select { flex: 1; padding: 4px 8px; font-size: 12px; border: 1px solid var(--background-modifier-border); border-radius: 4px; background: var(--background-primary); color: var(--text-normal); }
    .gantt-toggle-icon { display: inline-flex; align-items: center; justify-content: center; width: 20px; height: 20px; border-radius: 3px; border: 1px solid var(--background-modifier-border); cursor: pointer; font-size: 14px; line-height: 1; flex-shrink: 0; }
    .gantt-toggle-icon.on { background: var(--text-accent); color: var(--text-on-accent); border-color: var(--text-accent); }
    .gantt-toggle-icon.off { background: transparent; color: transparent; }
  `;
  container.appendChild(style);
}

export class GanttSettingTab extends PluginSettingTab {
  private plugin: Plugin;
  private activeTab: TabId = 'holidays';

  constructor(app: App, plugin: Plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();
    injectStyles(containerEl);

    containerEl.createEl('h2', { text: 'Gantt Chart' });

    // Tab bar
    const tabBar = containerEl.createDiv('gantt-tab-bar');
    const contentArea = containerEl.createDiv();

    for (const tab of TAB_DEFS) {
      const btn = tabBar.createEl('button', {
        text: tab.label,
        cls: `gantt-tab-btn${tab.id === this.activeTab ? ' active' : ''}`,
      });
      btn.onclick = () => {
        this.activeTab = tab.id;
        this.display();
      };

      const panel = contentArea.createDiv(
        `gantt-tab-content${tab.id === this.activeTab ? ' active' : ''}`,
      );
      switch (tab.id) {
        case 'holidays': this.renderHolidaysTab(panel); break;
        case 'connectors': this.renderConnectorsTab(panel); break;
        case 'logging': this.renderLoggingTab(panel); break;
      }
    }
  }

  // ═══════════════════════════════════════════════════════════
  // Holidays Tab
  // ═══════════════════════════════════════════════════════════

  private renderHolidaysTab(el: HTMLElement): void {
    const hc = pluginSettings.holidayConfig;

    // Toggles

    new Setting(el)
      .setName('Weekend shading')
      .setDesc('Mark Sat/Sun as non-working')
      .addToggle(t => t.setValue(hc.weekendsEnabled).onChange(async v => {
        hc.weekendsEnabled = v;
        await saveSettings(this.plugin, { holidayConfig: hc });
      }));

    new Setting(el)
      .setName('Holiday markers')
      .setDesc('Show 休/班 indicators on holiday dates')
      .addToggle(t => t.setValue(hc.holidaysEnabled).onChange(async v => {
        hc.holidaysEnabled = v;
        await saveSettings(this.plugin, { holidayConfig: hc });
      }));

    // ── Holiday dates (休) ──
    el.createEl('div', { cls: 'gantt-section-label', text: 'Holiday Dates (休)' });
    const holidayChips = el.createDiv('gantt-date-chips');
    if (hc.holidayDates.length === 0) {
      holidayChips.createEl('span', { cls: 'gantt-empty-hint', text: 'No holiday dates' });
    } else {
      for (const date of [...hc.holidayDates].sort()) {
        const chip = holidayChips.createDiv('gantt-date-chip holiday');
        chip.createEl('span', { text: '休' });
        chip.createEl('span', { text: date });
        const rm = chip.createEl('span', { cls: 'gantt-chip-remove', text: '×' });
        rm.onclick = async () => {
          const idx = hc.holidayDates.indexOf(date);
          if (idx >= 0) hc.holidayDates.splice(idx, 1);
          await saveSettings(this.plugin, { holidayConfig: hc });
          this.display();
        };
      }
    }

    // ── Makeup workdays (班) ──
    el.createEl('div', { cls: 'gantt-section-label', text: 'Makeup Workdays (班)' });
    const makeupChips = el.createDiv('gantt-date-chips');
    if (hc.makeupWorkdays.length === 0) {
      makeupChips.createEl('span', { cls: 'gantt-empty-hint', text: 'No makeup workdays' });
    } else {
      for (const date of [...hc.makeupWorkdays].sort()) {
        const chip = makeupChips.createDiv('gantt-date-chip makeup');
        chip.createEl('span', { text: '班' });
        chip.createEl('span', { text: date });
        const rm = chip.createEl('span', { cls: 'gantt-chip-remove', text: '×' });
        rm.onclick = async () => {
          const idx = hc.makeupWorkdays.indexOf(date);
          if (idx >= 0) hc.makeupWorkdays.splice(idx, 1);
          await saveSettings(this.plugin, { holidayConfig: hc });
          this.display();
        };
      }
    }

    // ── Import ──
    el.createEl('div', { cls: 'gantt-section-label', text: 'Import from Calendar' });

    // File import
    const fileRow = el.createDiv('gantt-inline-row');
    fileRow.createEl('label', { text: '.ics file' });
    const fileBtn = fileRow.createEl('button', { text: 'Choose file...' });
    fileBtn.onclick = () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.ics,.ical,.icalendar,text/calendar';
      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) return;
        const text = await file.text();
        this.mergeICS(text);
      };
      input.click();
    };

    // URL import
    const urlRow = el.createDiv('gantt-inline-row');
    urlRow.createEl('label', { text: 'URL' });
    const urlInput = urlRow.createEl('input', {
      type: 'text',
      attr: { placeholder: 'https://example.com/holidays.ics' },
    });
    const fetchBtn = urlRow.createEl('button', { text: 'Fetch' });
    fetchBtn.onclick = async () => {
      const url = (urlInput as HTMLInputElement).value.trim();
      if (!url) return;
      try {
        const resp = await fetch(url);
        const text = await resp.text();
        await this.mergeICS(text);
      } catch { /* silent */ }
    };
  }

  private async mergeICS(text: string): Promise<void> {
    const hc = pluginSettings.holidayConfig;
    const events = parseICS(text);
    const classified = classifyICSEvents(events);
    for (const d of classified.holidayDates) {
      if (!hc.holidayDates.includes(d)) hc.holidayDates.push(d);
    }
    for (const d of classified.makeupWorkdays) {
      if (!hc.makeupWorkdays.includes(d)) hc.makeupWorkdays.push(d);
    }
    await saveSettings(this.plugin, { holidayConfig: hc });
    this.display();
  }

  // ═══════════════════════════════════════════════════════════
  // Connectors Tab
  // ═══════════════════════════════════════════════════════════

  private async renderConnectorsTab(el: HTMLElement): Promise<void> {
    const vault = (this.app as any).vault;
    const adapter = vault.adapter;

    // ── Load views ──
    let viewFiles: string[] = [];
    let viewMap = new Map<string, { id: string; name: string; connectors: string[] }>();
    try {
      const listResult = await adapter.list('obsidian-gantt-data/views');
      viewFiles = (listResult?.files ?? [])
        .map((f: string) => {
          const parts = f.split('/');
          return parts[parts.length - 1];
        })
        .filter((f: string) => f.endsWith('.json'));
    } catch { /* no views yet */ }

    for (const f of viewFiles) {
      try {
        const raw = await adapter.read(`obsidian-gantt-data/views/${f}`);
        if (raw) {
          const v = JSON.parse(raw);
          viewMap.set(v.id, { id: v.id, name: v.name ?? v.id, connectors: v.connectors ?? [] });
        }
      } catch { /* skip corrupted */ }
    }

    if (viewMap.size === 0) {
      el.createEl('p', { cls: 'gantt-empty-hint', text: 'No views found. Open a Gantt chart view first.' });
      return;
    }

    // ── View selector ──
    let selectedViewId = viewMap.values().next().value?.id ?? '';
    const selectorRow = el.createDiv('gantt-view-selector');
    selectorRow.createEl('label', { text: 'Configure connectors for:' });
    const selectEl = selectorRow.createEl('select');
    for (const [id, v] of viewMap) {
      const opt = document.createElement('option');
      opt.value = id;
      opt.textContent = v.name;
      selectEl.appendChild(opt);
    }

    // Container that gets rebuilt when view selection changes
    const connectorList = el.createDiv();
    const renderList = () => this.renderConnectorList(connectorList, selectedViewId, viewMap);
    selectEl.onchange = () => {
      selectedViewId = selectEl.value;
      renderList();
    };
    renderList();
  }

  private async renderConnectorList(
    el: HTMLElement,
    viewId: string,
    viewMap: Map<string, { id: string; name: string; connectors: string[] }>,
  ): Promise<void> {
    el.empty();
    const vault = (this.app as any).vault;
    const adapter = vault.adapter;
    const activeConnectors = viewMap.get(viewId)?.connectors ?? [];

    el.createEl('div', { cls: 'gantt-section-label', text: 'Available Connectors' });

    // Scan connectors/ directory
    let jsFiles: string[] = [];
    try {
      const listResult = await adapter.list('connectors');
      const allFiles = listResult?.files ?? [];
      jsFiles = allFiles.filter((f: string) => f.endsWith('.js'));
    } catch { /* dir may not exist */ }

    if (jsFiles.length === 0) {
      el.createEl('p', { cls: 'gantt-empty-hint', text: 'Place .js connector scripts in the connectors/ directory at your vault root.' });
      return;
    }

    for (const scriptPath of jsFiles) {
      const fileName = scriptPath.split('/').pop() ?? scriptPath;
      const connectorId = fileName.replace(/\.js$/, '');
      const isActive = activeConnectors.includes(connectorId);

      let meta = { name: connectorId, refreshInterval: 0, config: {} as Record<string, unknown> };
      try {
        const raw = await adapter.read(`obsidian-gantt-data/connectors/${connectorId}.json`);
        if (raw) {
          const cfg = JSON.parse(raw);
          meta = { name: cfg.name ?? connectorId, refreshInterval: cfg.refreshInterval ?? 0, config: cfg.config ?? {} };
        }
      } catch { /* no config yet */ }

      // Card
      const card = el.createDiv('gantt-connector-card');

      // Header row
      const header = card.createDiv('gantt-connector-header');

      // Toggle switch
      const toggle = header.createDiv('gantt-toggle-icon');
      toggle.className = isActive ? 'gantt-toggle-icon on' : 'gantt-toggle-icon off';
      if (isActive) toggle.textContent = '✓';
      toggle.title = isActive ? 'Click to disable' : 'Click to enable';
      toggle.onclick = async () => {
        const view = viewMap.get(viewId);
        if (!view) return;
        const newActive = !view.connectors.includes(connectorId);
        if (newActive) {
          view.connectors.push(connectorId);
        } else {
          view.connectors = view.connectors.filter((c: string) => c !== connectorId);
        }
        // Persist the view
        const viewRaw = await adapter.read(`obsidian-gantt-data/views/${viewId}.json`);
        if (viewRaw) {
          const vd = JSON.parse(viewRaw);
          vd.connectors = view.connectors;
          await adapter.write(`obsidian-gantt-data/views/${viewId}.json`, JSON.stringify(vd, null, 2));
        }
        // Re-render the list
        await this.renderConnectorList(el, viewId, viewMap);
      };

      header.createEl('span', { cls: 'gantt-connector-name', text: meta.name });
      header.createEl('span', { cls: 'gantt-connector-meta', text: scriptPath });

      const actions = header.createDiv('gantt-connector-actions');
      const editBtn = actions.createEl('button', { text: 'Configure' });
      editBtn.style.fontSize = '11px';
      editBtn.style.padding = '2px 8px';

      // Edit form (hidden by default)
      const editForm = card.createDiv();
      editForm.style.display = 'none';
      editForm.style.marginTop = '10px';
      editForm.style.padding = '10px';
      editForm.style.borderTop = '1px solid var(--background-modifier-border)';

      editBtn.onclick = () => {
        const visible = editForm.style.display === 'block';
        editForm.style.display = visible ? 'none' : 'block';
        if (!visible) {
          this.renderConnectorEditForm(editForm, connectorId, meta.name, scriptPath, meta.refreshInterval, meta.config);
        }
      };
    }
  }

  private renderConnectorEditForm(
    container: HTMLElement,
    connectorId: string,
    currentName: string,
    currentScript: string,
    currentInterval: number,
    currentConfig: Record<string, unknown>,
  ): void {
    container.empty();

    let editName = currentName;
    let editScript = currentScript;
    let editInterval = String(currentInterval);
    let editConfig = JSON.stringify(currentConfig, null, 2);
    let configError = '';

    // Name + script in one row
    const row1 = container.createDiv('gantt-inline-row');
    row1.createEl('label', { text: 'Name' });
    const nameInput = row1.createEl('input', { type: 'text' });
    (nameInput as HTMLInputElement).value = editName;
    nameInput.oninput = () => { editName = (nameInput as HTMLInputElement).value; };

    const row2 = container.createDiv('gantt-inline-row');
    row2.createEl('label', { text: 'Script' });
    const scriptInput = row2.createEl('input', { type: 'text' });
    (scriptInput as HTMLInputElement).value = editScript;
    scriptInput.oninput = () => { editScript = (scriptInput as HTMLInputElement).value; };

    const row3 = container.createDiv('gantt-inline-row');
    row3.createEl('label', { text: 'Refresh (s)' });
    const intervalInput = row3.createEl('input', { type: 'number', attr: { min: '0', placeholder: '0' } });
    (intervalInput as HTMLInputElement).value = editInterval;
    intervalInput.oninput = () => { editInterval = (intervalInput as HTMLInputElement).value; };
    row3.createEl('span', { cls: 'gantt-connector-meta', text: '0 = manual only' });

    // Config textarea
    const configLabel = container.createEl('div', { cls: 'gantt-section-label', text: 'Config (JSON)' });
    configLabel.style.marginTop = '8px';
    const textarea = container.createEl('textarea', { attr: { rows: '5' } });
    textarea.className = 'gantt-inline-row';
    textarea.style.width = '100%';
    textarea.style.fontFamily = 'var(--font-monospace)';
    textarea.style.fontSize = '12px';
    textarea.style.padding = '6px';
    textarea.style.border = '1px solid var(--background-modifier-border)';
    textarea.style.borderRadius = '4px';
    textarea.style.background = 'var(--background-primary)';
    textarea.style.color = 'var(--text-normal)';
    textarea.style.resize = 'vertical';
    textarea.value = editConfig;
    textarea.oninput = () => {
      editConfig = (textarea as HTMLTextAreaElement).value;
      try {
        JSON.parse(editConfig);
        configError = '';
        textarea.style.borderColor = '';
      } catch {
        configError = 'Invalid JSON';
        textarea.style.borderColor = 'var(--text-error)';
      }
    };

    if (configError) {
      const err = container.createEl('p');
      err.style.color = 'var(--text-error)';
      err.style.fontSize = '11px';
      err.textContent = configError;
    }

    // Buttons
    const btnRow = container.createDiv('gantt-inline-row');
    btnRow.style.marginTop = '10px';
    const saveBtn = btnRow.createEl('button', { text: 'Save' });
    saveBtn.className = 'mod-cta';
    saveBtn.style.fontSize = '12px';
    saveBtn.onclick = async () => {
      if (configError) return;
      const configData = editConfig.trim() ? JSON.parse(editConfig) : {};
      const interval = parseInt(editInterval, 10);
      const out = {
        id: connectorId,
        name: editName || connectorId,
        script: editScript,
        refreshInterval: isNaN(interval) ? 0 : interval,
        config: configData,
      };
      const vault = (this.app as any).vault;
      await vault.adapter.write(
        `obsidian-gantt-data/connectors/${connectorId}.json`,
        JSON.stringify(out, null, 2),
      );
      this.display();
    };
    const cancelBtn = btnRow.createEl('button', { text: 'Cancel' });
    cancelBtn.style.fontSize = '12px';
    cancelBtn.onclick = () => { this.display(); };
  }

  // ═══════════════════════════════════════════════════════════
  // Logging Tab
  // ═══════════════════════════════════════════════════════════

  private renderLoggingTab(el: HTMLElement): void {
    const ls = pluginSettings.logSettings;

    new Setting(el)
      .setName('Enable logging')
      .setDesc('Record communication data between Gantt chart and connectors to daily log files')
      .addToggle(t => t.setValue(ls.enabled).onChange(async v => {
        ls.enabled = v;
        await saveSettings(this.plugin, { logSettings: ls });
      }));

    new Setting(el)
      .setName('Minimum level')
      .setDesc('Debug captures raw data samples; Error only records failures')
      .addDropdown(d => d
        .addOption('debug', 'Debug — all details')
        .addOption('info', 'Info — key steps')
        .addOption('warn', 'Warn — issues only')
        .addOption('error', 'Error — failures only')
        .setValue(ls.level)
        .onChange(async v => {
          ls.level = v as LogSettings['level'];
          await saveSettings(this.plugin, { logSettings: ls });
        }));

    new Setting(el)
      .setName('Retention')
      .setDesc('Days to keep log files before auto-deletion')
      .addText(t => t
        .setValue(String(ls.retentionDays))
        .setPlaceholder('30')
        .onChange(async v => {
          const n = parseInt(v, 10);
          if (!isNaN(n) && n > 0) {
            ls.retentionDays = n;
            await saveSettings(this.plugin, { logSettings: ls });
          }
        }));
    (el.lastChild?.querySelector('input') as HTMLInputElement)?.setAttribute('type', 'number');
    (el.lastChild?.querySelector('input') as HTMLInputElement)?.setAttribute('style', 'width: 70px;');

    el.createEl('p', {
      cls: 'gantt-empty-hint',
      text: 'Log files: obsidian-gantt-data/logs/gantt-YYYY-MM-DD.json',
    });
  }
}
