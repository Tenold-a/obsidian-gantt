## Context

The Obsidian Gantt plugin renders a dual-pane Gantt chart inside an Obsidian `ItemView`. The right detail panel shows project or task details when a row is selected. Resize handles on time bars allow adjusting task dates. The people list can be sorted by name or position. External links in project details use standard `<a target="_blank">` elements.

Current constraints:
- Position sorting is purely alphabetical via `localeCompare`
- Task bar resize handles have `pointer-events: none` in CSS, so their `cursor: ew-resize` never activates; the bar always shows `cursor: grab`
- Right detail panel width is hardcoded to `RIGHT_PANEL_WIDTH = 220`
- No `openExternal` method exists on the platform bridge; links rely on default `<a>` behavior which may not work in Electron/WebView contexts

## Goals / Non-Goals

**Goals:**
1. Users can define a custom order for position values, controlling the sort order when people are grouped by position
2. Moving the pointer near the left/right edge of a time bar changes the cursor to `ew-resize`
3. Users can drag the left edge of the detail panel to resize it between 180px and 500px
4. Clicking any external link in project/task details reliably opens the system default browser

**Non-Goals:**
- Drag-to-reorder UI for position list (text input is sufficient)
- Resize handles on other panel edges (top, bottom, right)
- Inline link preview or link validation
- Changing the vertical pane splitter behavior

## Decisions

### Decision 1: Position order stored as JSON array in settings

Store `positionOrder: string[]` in the Store's persisted settings. When sorting by position, build a rank map from this array; positions in the list sort first in list order, followed by any unlisted positions sorted alphabetically.

A simple text editor UI (comma-separated or one-per-line) in the person pane header appears when position sort is active and the user clicks a gear icon.

**Alternatives considered:**
- Drag-to-reorder UI: More intuitive but significantly more code; text list is simple and effective for the typical < 10 positions
- Separate settings tab: Overkill for a single array; inline editor keeps the feature discoverable

### Decision 2: JS-based cursor switching for resize handles

Instead of removing `pointer-events: none` from `.gantt-bar-handle` (which would break the existing hit-test logic in `onPointerDown`), add an `onPointerMove` handler on the task bar `<div>`. When the pointer X relative to the bar is within 8px of either edge, set `cursor: 'ew-resize'` on the bar element; otherwise keep `cursor: 'grab'`.

**Alternatives considered:**
- Remove `pointer-events: none` and use CSS `:hover`: Would mean the 4px-wide handle span is the only hit area — too narrow and fragile. The JS approach keeps the 8px effective hit area.
- Overlay invisible divs at edges: Unnecessary DOM overhead; updating `cursor` style on the existing bar div is simpler.

### Decision 3: Reuse vertical pane splitter pattern for panel resize

The vertical pane splitter already implements `onPointerDown` → track `onPointerMove` → update ratio signal. Apply the same pattern to the detail panel: a 4px vertical bar on the left edge of the panel, `cursor: col-resize`, with `onPointerDown` starting a drag that updates a `detailPanelWidth` signal. Width persists to settings via `store.saveSettings()`.

**Alternatives considered:**
- CSS `resize: horizontal`: Browser-native but styling is inconsistent across platforms and doesn't integrate with the signal/store pattern.

### Decision 4: Platform bridge `openExternal` method

Add `openExternal(url: string): void` to the `GanttPlatform` interface in `gantt-core`. Implement in the Obsidian plugin adapter using `shell.openExternal()` from Electron. Implement in the standalone adapter using `window.open(url, '_blank')`. All `<a>` elements in detail panels gain `onClick` handlers that call `e.preventDefault()` then `platform.openExternal(href)`.

**Alternatives considered:**
- `window.open(url, '_blank')` everywhere: Simple but doesn't work in the Obsidian WebView sandbox reliably.
- Obsidian's `MarkdownRenderer`: Only renders markdown links, not arbitrary `<a>` elements.

## Risks / Trade-offs

- **Position order persistence**: If a position is renamed in source data but still appears in the order list, it's silently ignored (no crash). Users must manually update the order list. → Acceptable; positions rarely change.
- **Resize handle cursor performance**: `onPointerMove` fires frequently. → The handler only does `cursor = isNearEdge ? 'ew-resize' : 'grab'` — trivial and won't cause frame drops.
- **Panel resize vs responsive layout**: On narrow Obsidian panes, a wide detail panel could crowd the chart. → The 500px max keeps it reasonable; if the user sets it too wide they can drag it back.
- **External link security**: `shell.openExternal` opens any URL. → Links come from user's own project data, not arbitrary input. Same trust model as any Obsidian note.
