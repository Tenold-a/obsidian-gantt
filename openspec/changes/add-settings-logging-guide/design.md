## Context

The `obsidian-gantt` plugin currently has no Obsidian settings tab. Holiday configuration lives in the `HolidaySettingsPanel` popup (triggered by a toolbar button) and is stored per-view in `settings/<view-id>.json`. Connector configuration is done by manually editing `connectors/<id>.json` files — there is no UI. Logging is limited to `console.log('[Gantt Connector]', ...args)` passed as `ctx.log`. There is no connector development documentation.

The monorepo has four packages: `gantt-core` (zero-dependency types and utilities), `gantt-ui` (Preact components and store), `obsidian-plugin` (Obsidian platform adapter), and `web-app` (standalone browser app). Platform abstraction is enforced: `gantt-core` and `gantt-ui` depend on the `GanttPlatform` interface, never on platform-specific APIs.

## Goals / Non-Goals

**Goals:**
- Add a native Obsidian `PluginSettingTab` with three sections: holidays, connectors, logging
- Migrate holiday config from per-view to plugin-level global storage
- Design a structured `ILogger` interface in `gantt-core` and implement it for both Obsidian and Web platforms
- Expose the logger to connectors via `ConnectorContext.logger` while preserving `ctx.log` for backward compatibility
- Write a comprehensive `CONNECTOR_GUIDE.md` and link it from README

**Non-Goals:**
- Real-time log viewer UI in the plugin
- Log export/forwarding to external services
- Connector marketplace or auto-discovery beyond scanning `connectors/`
- Visual connector config form builder (JSON editor is sufficient for now)
- Changing the per-view storage model for anything other than holidays

## Decisions

### Decision 1: Native Obsidian SettingTab vs. Custom Preact UI

**Choice**: Native `PluginSettingTab` with Obsidian's `Setting` API.

**Rationale**: The settings page is inherently an Obsidian concern. Using the native API gives us proper Obsidian look-and-feel, standard tab placement, and automatic `data.json` persistence via `this.loadData()` / `this.saveData()`. A custom Preact UI would require iframe or portal hacks and would look out of place.

**Alternatives considered**: Custom Preact settings rendered in a modal — rejected because it wouldn't integrate with Obsidian's settings search and navigation.

### Decision 2: Logger interface location

**Choice**: Define `ILogger` in `gantt-core` (`packages/gantt-core/src/logger.ts`), implement in platform packages.

**Rationale**: The logger is used by connectors (via `ConnectorContext`), the UI store, and the plugin itself. Placing the interface in `gantt-core` allows all layers to depend on it without platform coupling. Platform implementations differ: Obsidian writes to vault files, Web writes to `console` + `localStorage`.

**Alternatives considered**: Logger only in `obsidian-plugin` — rejected because `gantt-ui` store needs to log operations (refresh, merge, push) and `ConnectorContext` is defined in `gantt-core`.

### Decision 3: Log buffering and I/O strategy

**Choice**: In-memory buffer, flush to disk on a 5-second interval and on `app.quit` signal.

**Rationale**: Connector fetch/transform can produce many log entries rapidly. Writing each entry individually to the vault would be slow and trigger unnecessary file change events. Buffering and periodic flush balances responsiveness with performance.

**Alternatives considered**: 
- Immediate write per entry — rejected due to I/O overhead
- Flush only on plugin unload — rejected because logs would be lost on crash

### Decision 4: Log file organization

**Choice**: Daily-rotated JSON files (`logs/gantt-YYYY-MM-DD.json`), one JSON array per file, automatic cleanup of files older than `retentionDays`.

**Rationale**: Daily rotation prevents unbounded file growth. JSON Lines (one object per line) was considered but rejected in favor of a single JSON array — the expected volume (hundreds of entries per day, not millions) makes a well-formed array practical and easier for users to inspect.

**Alternatives considered**: Single log file with size-based rotation — rejected because daily rotation is simpler and aligns with how users think about logs ("show me yesterday's logs").

### Decision 5: Holiday migration from per-view to global

**Choice**: On plugin load, read existing `settings/<view-id>.json` files. If any contain `holidayConfig`, merge them (union of all dates) into the new global plugin setting, then remove the `holidayConfig` key from the view settings files.

**Rationale**: Automatic one-time migration prevents data loss. Union merge is the safest strategy — it captures all holidays defined across all views. If different views had conflicting holidays, the union means nothing is lost.

**Alternatives considered**: 
- Keep per-view holidays — rejected per user's explicit request that holidays are a global concern
- Take only the first view's holidays — rejected, could silently drop data

### Decision 6: Connector settings UI approach

**Choice**: Settings tab scans `connectors/` directory for `.js` files, reads corresponding `connectors/<id>.json` for metadata. List view shows all discovered connectors with enable/disable toggle. Edit button expands an inline form with: id, name, script path, refresh interval, and a JSON textarea for `config`.

**Rationale**: The `connectors/` directory scanning matches the existing convention. The form mirrors the `ConnectorConfig` interface exactly, so no data transformation is needed. A JSON textarea for `config` is pragmatic — connectors define arbitrary config shapes, and building a dynamic form generator for `Record<string, unknown>` is a separate feature.

### Decision 7: Connector log API backward compatibility

**Choice**: Add `logger: ILogger` to `ConnectorContext`. Keep the existing `log: (message: string) => void` function but implement it as a wrapper that calls `logger.info(message)`.

**Rationale**: Zero breaking change for existing connectors. New connectors get the full structured logging API. The old `log` function continues to work and its output is now captured in the log file instead of only going to console.

## Risks / Trade-offs

- **[Risk] Holiday union-merge could produce unexpected results if views had intentionally different holiday sets** → Mitigation: This is the user's stated preference. If edge cases arise, a deduplication UI in settings lets users review and remove unwanted dates.
- **[Risk] Log file size on heavily-used vaults** → Mitigation: `retentionDays` default of 30 keeps at most 30 files. Each connector refresh produces roughly 5-10 log entries (~2KB). Even with 10 connectors refreshing hourly, daily log files stay under 1MB.
- **[Risk] Settings page JSON textarea is error-prone** → Mitigation: Validate JSON on save, show inline error messages. Invalid JSON is rejected with a clear error, never silently saved.
- **[Trade-off] Holiday config moves from toolbar (1 click) to settings (3+ clicks)** → Acceptable because the user described it as "low-frequency global operation." The toolbar gains space for future features.
- **[Trade-off] Logger added to GanttPlatform interface** → Platform implementors (currently 2) need to add one factory method. This is minimal burden for the value gained.

## Migration Plan

1. Plugin loads → reads existing `settings/*.json` files
2. For each view settings file with a `holidayConfig` key:
   - Extract `holidayDates`, `makeupWorkdays`, `weekendsEnabled`, `holidaysEnabled`
   - Merge into the new plugin-level `data.json`
   - Remove `holidayConfig` from the view settings file
3. If the plugin-level `data.json` already has holiday config, skip migration (first-launch only)
4. Rollback: If the user downgrades the plugin, holiday config would need to be manually recreated in each view — document this in the release notes
