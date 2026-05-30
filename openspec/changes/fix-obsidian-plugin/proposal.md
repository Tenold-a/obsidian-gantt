## Why

The Obsidian plugin has a complete code skeleton (platform adapter, storage, connector loader, views) but does not actually load or render in Obsidian due to several critical bugs. The plugin needs to work as a real Obsidian community plugin so users can install it and view Gantt charts inside their vault.

Additionally, the timeline rendering in the Gantt chart uses a dynamic viewport-based approach where tick marks and header labels should update as the user scrolls horizontally. The initial implementation had the TimeHeader inside the scroll container using `position: sticky` plus `translateX`, which failed to track scroll position correctly — the header labels appeared stationary regardless of scroll.

## What Changes

- Fix `GanttView` to properly extend `obsidian.ItemView` so `registerView` accepts it
- Export `VaultAdapter` type from `storage.ts` to resolve the broken import in `connector-loader.ts`
- Replace unreliable directory-creation logic in storage with proper adapter-based recursion
- Inject CSS styles into the DOM on plugin load so the Gantt chart has visual styling
- Place build output files (`main.js`, `manifest.json`, `styles.css`) in a structure that Obsidian can load directly
- **Refactor timeline rendering**: Move TimeHeader outside the scroll container, replace `position: sticky` with a `translateX(gridLeft - scrollLeft)` sync approach
- **Unify buffer alignment**: Use `GRID_BUFFER_PX` (600px) consistently for both TimelineGrid and TimeHeader to ensure grid lines and header labels start at the same absolute pixel
- **Add task detail sidebar**: When a task bar is clicked, a `DetailPanel` appears on the right side showing task metadata (dates, progress, assignee, project, dependencies, tags, source info)

## Capabilities

### New Capabilities

- `obsidian-plugin-loadable`: The plugin loads correctly in Obsidian, registers its view, and renders the Gantt chart UI when activated via ribbon icon or command.
- `timeline-dynamic-rendering`: The Gantt timeline dynamically renders tick marks and header labels for the visible viewport, tracking horizontal scroll position in real time.

### Modified Capabilities

None — existing core capabilities remain unchanged; only the Obsidian integration layer is fixed.

## Impact

- **Affected code**: `packages/obsidian-plugin/src/main.ts`, `view.tsx`, `storage.ts`, `connector-loader.ts`, `platform.ts`, `build.mjs`, `tsconfig.json`, `manifest.json`, `packages/gantt-ui/src/GanttChart.tsx`, `packages/gantt-ui/src/components.tsx`, `packages/gantt-ui/src/index.ts`
- **No API changes** to `@obsidian-gantt/core`
- **Build output** now goes to `packages/obsidian-plugin/` root so Obsidian can find `main.js`, `manifest.json`, `styles.css` at the plugin root level
