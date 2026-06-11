## Why

The plugin currently lacks a settings UI, has no structured logging, and provides no developer documentation for connector authors. Users must manually edit JSON files to configure connectors and holidays. Debugging connector issues requires guessing — there is no record of communication data. External developers have no guidance on building custom connectors. Adding these pieces rounds out the plugin from a working prototype into a complete, maintainable tool.

## What Changes

- Add an Obsidian plugin settings tab (`PluginSettingTab`) with three sections: holiday configuration (migrated from the per-view HolidaySettingsPanel popup), connector quick-setup (scan, list, enable/disable, form-edit), and log settings (on/off, level, retention)
- Migrate holiday configuration from per-view `settings/<view-id>.json` to plugin-level `data.json`, making holidays a global setting. Remove the Calendar button from the toolbar. **BREAKING**: existing per-view holiday configs will be auto-migrated on first load
- Build a structured logging system (`ILogger` interface in `gantt-core`) with four levels (debug/info/warn/error), per-source tagging, timestamped entries, and daily-rotated log files under `obsidian-gantt-data/logs/`
- Provide the `ILogger` instance to connectors via `ConnectorContext.logger`, allowing connectors to record their own runtime logs into the shared log system. Keep `ctx.log` as a backward-compatible alias
- Add `CONNECTOR_GUIDE.md` — a complete connector development guide covering the interface spec, step-by-step tutorial, best practices, and example connectors
- Add a link to `CONNECTOR_GUIDE.md` in the README

## Capabilities

### New Capabilities

- `plugin-settings`: Plugin-level settings tab in Obsidian, including holiday config (weekend toggle, holiday dates, makeup workdays, ICS import), connector management (scan connectors/ directory, list with enable/disable, form-based field editing), and log settings (enable/disable, level filter, retention days)
- `logging-system`: Structured logging with ILogger interface in gantt-core, Obsidian implementation writing daily-rotated JSON log files, web-app implementation using console + localStorage, log entry format {timestamp, level, source, message, data?}, automatic cleanup of expired logs
- `connector-log-api`: Enhanced ConnectorContext with a `logger: ILogger` property so connectors can write structured logs into the shared system. Existing `log` property retained as a `logger.info` alias for backward compatibility

### Modified Capabilities

- `connector-system`: ConnectorContext gains an optional `logger` property for structured connector logging. The existing `log` function is preserved as a backward-compatible convenience alias
- `platform-abstraction`: GanttPlatform gains an optional `createLogger(source: string): ILogger` factory method. Log file storage is handled through the existing `IStorage` interface — no new storage operations are required

## Impact

- **gantt-core**: New `ILogger` interface, `LogEntry` type, `LogSettings` type defined in a new `logger.ts` module. `ConnectorContext` interface extended with `logger` field. `GanttPlatform` interface extended with `createLogger` factory
- **gantt-ui**: `HolidaySettingsPanel` component removed or repurposed as a read-only preview accessed from settings. Toolbar Calendar button removed. Store's `holidayConfig` signal and `saveHolidayConfig()` action accept plugin-level config passed from above. New `connectorSettings` signal for settings page data
- **obsidian-plugin**: New `GanttSettingTab` class (extends `PluginSettingTab`) in `src/settings.ts`. New `ObsidianLogger` implementing `ILogger` (buffered writes, daily rotation). `main.ts` registers the settings tab. `platform.ts` wires `createLogger` factory. `manifest.json` may add `settings`-related metadata
- **web-app**: New `WebLogger` implementing `ILogger` (console.log + localStorage). `platform.ts` wires `createLogger` factory
- **Documentation**: New `CONNECTOR_GUIDE.md` at project root. README.md updated with a link to it
