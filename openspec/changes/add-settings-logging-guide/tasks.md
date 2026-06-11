## 1. gantt-core: Logger interface and types

- [x] 1.1 Create `packages/gantt-core/src/logger.ts` with `LogLevel`, `LogEntry`, `LogSettings`, and `ILogger` interface definitions
- [x] 1.2 Add `ILogger`, `LogEntry`, `LogSettings` to `packages/gantt-core/src/index.ts` exports

## 2. gantt-core: Extend existing interfaces

- [x] 2.1 Add `logger: ILogger` property to `ConnectorContext` interface in `packages/gantt-core/src/index.ts`
- [x] 2.2 Add `createLogger(source: string): ILogger` method to `GanttPlatform` interface in `packages/gantt-core/src/index.ts`
- [x] 2.3 Rebuild `gantt-core` package

## 3. obsidian-plugin: Logger implementation

- [x] 3.1 Create `packages/obsidian-plugin/src/logger.ts` with `ObsidianLogger` class implementing `ILogger` — buffer entries in memory, flush every 5 seconds and on `destroy()`, write to `obsidian-gantt-data/logs/gantt-YYYY-MM-DD.json`
- [x] 3.2 Implement level filtering (compare entry level against configured `LogSettings.level`)
- [x] 3.3 Implement automatic cleanup: on creation, scan `logs/` directory and delete files older than `retentionDays`
- [x] 3.4 Wire `createLogger` factory in `platform.ts` to return new `ObsidianLogger` instances
- [x] 3.5 Update `connector-loader.ts` — `createObsidianConnectorContext()` accepts an `ILogger` and sets both `ctx.logger` and `ctx.log` (delegating to `logger.info`)

## 4. obsidian-plugin: Settings tab

- [x] 4.1 Create `packages/obsidian-plugin/src/settings.ts` with `GanttSettingTab` class extending `PluginSettingTab`
- [x] 4.2 Implement "Holidays" section: weekend toggle, holiday toggle, holiday date list with remove buttons, makeup workday list with remove buttons, ICS file import button using `platform.pickFile`, ICS URL input + fetch button
- [x] 4.3 Implement "Connectors" section: scan `connectors/` directory for `.js` files, list with name/script/status, inline edit form (id, name, script, refreshInterval, config JSON textarea), JSON validation on save
- [x] 4.4 Implement "Logging" section: enable/disable toggle, level dropdown (Debug/Info/Warn/Error), retention days input
- [x] 4.5 Implement holiday migration logic: on first load, read existing `settings/<view-id>.json` files, extract and union-merge `holidayConfig`, remove from view settings, save to plugin `data.json`
- [x] 4.6 Register `GanttSettingTab` in `main.ts` via `this.addSettingTab()`
- [x] 4.7 Pass plugin-level holiday config from settings to the UI store via a platform or initialization mechanism
- [x] 4.8 Update `manifest.json` if needed

## 5. gantt-ui: Remove holiday panel, adapt store

- [x] 5.1 Remove `HolidaySettingsPanel` component from `packages/gantt-ui/src/GanttChart.tsx`
- [x] 5.2 Remove Calendar button from toolbar in `GanttChart.tsx`
- [x] 5.3 Update `store.ts` — accept plugin-level `HolidayConfig` from platform/initialization instead of maintaining a per-view signal with save logic
- [ ] 5.4 Rebuild `gantt-ui` package

## 6. web-app: Logger implementation

- [x] 6.1 Create `packages/web-app/src/logger.ts` with `WebLogger` class implementing `ILogger` — `console.log`/`console.warn`/`console.error` with level prefix, append to `gantt:logs` in localStorage
- [x] 6.2 Implement level filtering and retention-based pruning in `WebLogger`
- [x] 6.3 Wire `createLogger` factory in web platform adapter

## 7. Documentation: Connector guide and README

- [x] 7.1 Create `CONNECTOR_GUIDE.md` at project root with sections: overview, quick start, interface spec (ConnectorModule, ConnectorContext, CanonicalData), core concepts (fetch/transform/push), advanced features (viewState, logger, error handling), CSV connector walkthrough, REST API example, testing guidance, appendices (CanonicalData types, config JSON schema)
- [x] 7.2 Add link to `CONNECTOR_GUIDE.md` in README.md under the "数据连接器" or "开发" section

## 8. Build, test, verify

- [x] 8.1 Run full build chain: `core` → `ui` → `plugin` + `web-app`
- [x] 8.2 Run existing test suite (`npm test`) — 46 tests pass
- [ ] 8.3 Verify settings tab appears in Obsidian and all three sections render correctly
- [ ] 8.4 Verify holiday migration from old per-view config
- [ ] 8.5 Verify log files are created and rotated in `obsidian-gantt-data/logs/`
- [ ] 8.6 Verify connector logger integration — connector `ctx.logger.info()` calls appear in log file
- [ ] 8.7 Verify backward compatibility — existing `ctx.log()` calls are captured
