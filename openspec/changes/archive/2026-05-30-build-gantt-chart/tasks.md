## 1. Monorepo & Build Infrastructure

- [x] 1.1 Initialize npm workspaces root with `package.json` containing four packages
- [x] 1.2 Create `packages/gantt-core/package.json` with `@obsidian-gantt/core` name and TypeScript dependencies
- [x] 1.3 Create `packages/gantt-ui/package.json` with `@obsidian-gantt/ui` name, Preact and @preact/signals dependencies
- [x] 1.4 Create `packages/obsidian-plugin/package.json` with obsidian typings dependency
- [x] 1.5 Create `packages/web-app/package.json` with Vite dependency for dev/build
- [x] 1.6 Add root `tsconfig.json` with shared TypeScript settings and project references
- [x] 1.7 Add esbuild build scripts for each package (core, ui, obsidian-plugin)
- [x] 1.8 Configure Vite for web-app package with esbuild plugin for JSX
- [x] 1.9 Verify all four packages build successfully from root

## 2. Core Data Model (gantt-core)

- [x] 2.1 Define `Task`, `Person`, `Project` TypeScript interfaces with all fields
- [x] 2.2 Define `CanonicalData` interface (`tasks`, `persons`, `projects`)
- [x] 2.3 Define `LocalTask` with field-level source tracking (`FieldWithSource<T>` wrapper type)
- [x] 2.4 Define `EditsOverlay` interface (`viewId`, `overrides`, `order`, `hidden`, `localTasks`)
- [x] 2.5 Define `ViewDefinition` interface (`id`, `name`, `connectors`, `display`)
- [x] 2.6 Define `CacheFile` interface (`connectorId`, `lastFetch`, `lastError`, entity arrays)
- [x] 2.7 Define `ConnectorContext`, `ConnectorModule` (fetch + transform exports), and `ConnectorConfig` interfaces
- [x] 2.8 Export all types from package index

## 3. Platform Abstraction (gantt-core)

- [x] 3.1 Define `IStorage` interface (`read`, `write`, `delete`, `list`)
- [x] 3.2 Define `IConnectorLoader` interface (`load(scriptPath)` returning `ConnectorModule`)
- [x] 3.3 Define `IWatcher` interface (`onChange(callback)`)
- [x] 3.4 Define `Theme` interface (`isDark`, `onChange`, `variables`)
- [x] 3.5 Define `GanttPlatform` interface composing storage, fetch, connectorLoader, watcher, theme
- [x] 3.6 Add `PlatformError` class for structured platform error reporting

## 4. Merge Engine (gantt-core)

- [x] 4.1 Implement `mergeFields(cache: Task, overrides: Partial<Task>): FieldWithSource<Task>` — merge a single task
- [x] 4.2 Implement `mergeTasks(cache: Task[], edits: EditsOverlay): LocalTask[]` — merge all tasks with overrides
- [x] 4.3 Handle merge for user-created `localTasks` (all fields source = "manual")
- [x] 4.4 Handle merge for upstream-deleted tasks with user edits (preserve, mark warning)
- [x] 4.5 Implement `detectConflicts(cache: Task[], edits: EditsOverlay): Conflict[]` — flag upstream changes to manually-edited fields
- [x] 4.6 Implement `applyFieldReset(taskId, fieldName)` — remove a specific override from edits
- [x] 4.7 Write unit tests for merge engine covering all scenarios from `local-data-store` spec

## 5. Date & Coordinate Utilities (gantt-core)

- [x] 5.1 Implement `dateToPixel(date: string, timelineStart: string, dayWidth: number): number`
- [x] 5.2 Implement `pixelToDate(px: number, timelineStart: string, dayWidth: number): string`
- [x] 5.3 Implement `snapToDay(date: string): string` — normalize to day boundary
- [x] 5.4 Implement `daysBetween(a: string, b: string): number`
- [x] 5.5 Implement `addDays(date: string, days: number): string`
- [x] 5.6 Implement `getMonthRanges(startDate: string, endDate: string): MonthRange[]` — for timeline header
- [x] 5.7 Implement `isToday(date: string): boolean`
- [x] 5.8 Write unit tests for all date utilities

## 6. Gantt Store (gantt-ui)

- [x] 6.1 Implement `createGanttStore(platform: GanttPlatform)` — factory returning signals-based store
- [x] 6.2 Implement `mergedTasks` computed signal — runs merge(cache, edits) reactively
- [x] 6.3 Implement `personGroups` and `projectGroups` computed signals — group tasks by person/project
- [x] 6.4 Implement `unassignedProjects` computed signal — projects with no tasks
- [x] 6.5 Implement `selectedEntity` signal and `highlightedTaskIds` computed signal
- [x] 6.6 Implement `sharedScrollLeft` signal with guard flag for cross-view sync
- [x] 6.7 Implement `timelineRange` signal (startDate, endDate, dayWidth) and `visibleDateRange` computed
- [x] 6.8 Implement `loadView(viewId)` — read view config, load caches, apply edits, populate signals
- [x] 6.9 Implement `refreshConnector(connectorId)` — run fetch+transform, write cache, re-merge
- [x] 6.10 Implement `persistEdit(taskId, fieldName, value)` — write edit to platform storage

## 7. Timeline Rendering (gantt-ui)

- [x] 7.1 Create `TimelineGrid` component using CSS `repeating-linear-gradient` for day/week lines
- [x] 7.2 Create `TimeHeader` component with month row and day row, sticky positioning
- [x] 7.3 Create `TodayLine` component — absolutely positioned vertical line at today's position
- [x] 7.4 Create `TaskBar` component — absolutely positioned bar with width from date range
- [x] 7.5 Implement horizontal virtualization in `TimelineBody` — filter bars to visible range
- [x] 7.6 Implement scroll event handler on timeline container — update `sharedScrollLeft` signal
- [x] 7.7 Create `TaskList` component — vertically scroll-synced with timeline, shows row labels
- [x] 7.8 Apply dark/light theme CSS variables to all timeline components

## 8. Dual Gantt View (gantt-ui)

- [x] 8.1 Create `DualPane` component — vertical split layout with resize handle
- [x] 8.2 Create `PersonGantt` component — composes TaskList (person labels) + Timeline
- [x] 8.3 Create `ProjectGantt` component — composes TaskList (project labels) + Timeline
- [x] 8.4 Implement vertical resize handle drag — update pane height ratio
- [x] 8.5 Wire horizontal scroll sync between the two timelines via `sharedScrollLeft` + guard flag
- [x] 8.6 Ensure each pane's vertical scroll is independent
- [x] 8.7 Create `UnassignedPanel` component — card list of projects with no tasks, full height alongside both panes

## 9. Cross-View Highlight (gantt-ui)

- [x] 9.1 Implement `highlightedTaskIds` computed signal logic — derive from `selectedEntity`
- [x] 9.2 Wire project selection → highlights all tasks with matching `projectId` in both views
- [x] 9.3 Wire task selection → highlights all sibling tasks (same project) in both views
- [x] 9.4 Wire person selection → highlights all tasks with matching `personId` in both views
- [x] 9.5 Apply highlight/dim CSS classes to TaskBar based on `highlightedTaskIds` membership
- [x] 9.6 Apply row-level dimming via CSS class on rows with zero highlighted tasks
- [x] 9.7 Implement click-on-bar → `selectEntity(type: "task", id)`, click-on-row-header → select project/person
- [x] 9.8 Implement click-on-empty-space / Escape key → deselect

## 10. Drag Interactions (gantt-ui)

- [x] 10.1 Implement `usePointerDrag` hook — generic pointerdown/pointermove/pointerup handler with guard against text selection
- [x] 10.2 Implement move drag on TaskBar body — update startDate + endDate preserving duration, snap to day
- [x] 10.3 Implement resize drag on TaskBar edges (left/right 6px hit area, ew-resize cursor)
- [x] 10.4 Implement ghost bar rendering during drag (semi-transparent bar at snap position)
- [x] 10.5 Implement card-to-timeline drag from UnassignedPanel — create localTask on drop
- [x] 10.6 Highlight drop target row during card drag
- [x] 10.7 Implement drag clamping — prevent dragging beyond timeline min/max dates
- [x] 10.8 Implement minimum task duration clamping (1 day minimum)
- [x] 10.9 Call `persistEdit` on drop to write changes to edits file
- [x] 10.10 Implement undo (Ctrl+Z) for last drag operation — revert persisted edit

## 11. Obsidian Plugin Shell (obsidian-plugin)

- [x] 11.1 Implement `ObsidianStorage` — IStorage backed by Obsidian Vault API reading/writing `.obsidian-gantt/`
- [x] 11.2 Implement `ObsidianConnectorLoader` — read connector scripts from vault `connectors/` directory
- [x] 11.3 Implement `ObsidianPlatform` — wires up storage, connector loader, theme from Obsidian, requestUrl for fetch
- [x] 11.4 Implement `GanttView` extending `ItemView` — mounts Preact GanttChart with platform
- [x] 11.5 Implement `SettingsTab` extending `PluginSettingTab` — configure connector scripts, view definitions
- [x] 11.6 Implement `plugin.ts` main entry — register view, settings tab, ribbon icon, command palette command
- [x] 11.7 Add `manifest.json` with plugin metadata
- [x] 11.8 Add esbuild config to bundle obsidian-plugin with Preact and core inline
- [x] 11.9 Create `styles.css` — plugin-specific styles, Obsidian theme variable bridge

## 12. Web Application (web-app)

- [x] 12.1 Implement `LocalStorageImpl` — IStorage backed by localStorage with `gantt:` key prefix
- [x] 12.2 Implement `WebConnectorLoader` — load scripts from localStorage or file upload
- [x] 12.3 Implement `WebPlatform` — wires up localStorage, connector loader, browser fetch, `prefers-color-scheme` for theme
- [x] 12.4 Create `index.html` — app shell mounting point
- [x] 12.5 Create `App.tsx` — Preact app root, creates store with WebPlatform, renders GanttChart
- [x] 12.6 Create `ConfigPanel` — manage views, connector scripts (paste/upload/edit), data source URLs
- [x] 12.7 Implement URL data source loading — fetch CanonicalData directly from URL if configured
- [x] 12.8 Add localStorage quota warning when approaching limit
- [x] 12.9 Configure Vite build for static deployment (HTML + JS + CSS output)

## 13. Integration & Polish

- [x] 13.1 Verify full flow: create connector script → fetch data → create view → render dual Gantt
- [x] 13.2 Verify drag interactions persist to edits and survive page reload
- [x] 13.3 Verify cross-view highlight works correctly for all selection types
- [x] 13.4 Verify horizontal scroll sync is smooth and feedback-free
- [x] 13.5 Verify dark/light theme switching works in both Obsidian and web
- [x] 13.6 Test with empty data (no tasks, no persons, no projects) — graceful empty states
- [x] 13.7 Add error boundaries for connector script failures, network errors, storage errors
- [x] 13.8 Add loading states for fetch operations and view initialization
- [x] 13.9 Test with diverse date ranges (single day tasks, multi-month tasks, tasks spanning year boundaries)
- [x] 13.10 Performance test with 100+ tasks across 10+ persons and 20+ projects
