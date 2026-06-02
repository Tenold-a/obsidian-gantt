## Context

The Gantt chart consists of a person pane (upper) and project pane (lower) sharing horizontal scroll via `sharedScrollLeft`. Each pane has a TaskList (fixed 180px) and a Timeline (flex: 1). The DualPane orchestrates layout, resize handles, and detail sidebars. The store provides `personGroups` and `projectGroups` computed from `mergedTasks`, plus scroll signals for X/Y sync.

Several interaction patterns needed improvement:

### Scroll sync
Each Timeline independently computed `bodyOriginPx` and an initial scroll-to-today centering using its own `clientWidth`. Since the person pane includes a 220px UnassignedPanel, its Timeline is narrower, producing a different `targetScroll`. The last `requestAnimationFrame` to fire would overwrite `sharedScrollLeft`, causing misalignment.

The Timeline synced `scrollLeft` to the container but not `scrollTop`, so programmatic vertical scroll (locate button) only moved the TaskList (via `transform: translateY`) but not the timeline bars.

### Popup positioning
The position editor popup used `position: fixed` with `getBoundingClientRect()` coordinates. Obsidian's `.workspace-leaf-content` likely has `contain` or `transform` CSS, creating a new containing block that breaks viewport-relative `fixed` positioning.

### Selection highlight
`highlightedTaskIds` returns all tasks in the same project (for both task and project selection). There was no way to distinguish the *selected* entity from *related* entities. The selected task bar needed prominent visual differentiation.

### Connector requestUrl
`createObsidianPlatform` creates a placeholder `fetchRef` that throws. `bindObsidianFetch` was exported but never called, so `ctx.request()` always failed.

### Task editing
TaskDetail showed fields as read-only (only title and status were editable). ProjectDetail had full edit support but TaskDetail didn't.

## Decisions

- **Initial scroll**: Moved to DualPane with a shared `didInitialScroll` ref. Uses `document.querySelector('.gantt-timeline')` for a reference width — the project pane's timeline since it's wider. Both panes sync via the existing `sharedScrollLeft` signal.
- **Locate target**: Added `locateTarget` signal to store. DualPane watches it and computes X (from date→pixel) and Y (by iterating personGroups/projectGroups to find row offset). After handling, clears the signal.
- **Selection highlight**: Added `selectedTaskId` and `selectedProjectId` computed signals. TaskBar uses `isSelected` for z-index 1000 + CSS `@keyframes gantt-selected-pulse` animation. Timeline rows and TaskList rows check `selectedProjectId` for orange border/background.
- **Popup portal**: Ref callback on wrapper div `appendChild` to `document.body`. Preact still manages lifecycle — unmount removes from body.
- **Connector fix**: Import `bindObsidianFetch` and `requestUrl` from `obsidian` in `view.tsx`, call immediately after `createObsidianPlatform`.
- **Task editing**: Follows ProjectDetail pattern — `editing` signal toggles view/edit modes. Edit fields use signals initialized from current values on enter. Save compares each field to avoid unnecessary writes.
