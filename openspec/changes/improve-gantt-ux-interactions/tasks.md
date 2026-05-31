## 1. Platform bridge - openExternal method

- [x] 1.1 Add `openExternal(url: string): void` to `GanttPlatform` interface in `packages/gantt-core/src/index.ts`
- [x] 1.2 Implement `openExternal` in Obsidian plugin platform adapter using `window.open(url, '_blank', 'noopener,noreferrer')`
- [x] 1.3 Implement `openExternal` in standalone web platform adapter using `window.open(url, '_blank', 'noopener,noreferrer')`

## 2. External links open in system browser

- [x] 2.1 Add `onClick` handler to key link `<a>` elements in `ProjectDetail` that calls `e.preventDefault()` then `platform.openExternal(href)`
- [x] 2.2 Add `onClick` handler to task URL `<a>` element in `DetailPanel` that calls `e.preventDefault()` then `platform.openExternal(href)`

## 3. Resize handle cursor feedback

- [x] 3.1 Add `onPointerMove` handler to the task bar `<div>` in `TaskBar` component to detect pointer proximity to edges (within 8px)
- [x] 3.2 Set inline `cursor` style on the bar element to `ew-resize` when near left/right edge, `grab` otherwise
- [x] 3.3 Update existing edge detection constant to 8px in `onPointerDown` to match the hover zone
- [x] 3.4 Remove or suppress the unused `cursor: ew-resize` from `.gantt-bar-handle` CSS since handles have `pointer-events: none`

## 4. Position custom ordering

- [x] 4.1 Add `positionOrder: string[]` signal to Store with default `[]`, include in settings persistence
- [x] 4.2 Update `personGroups` sort logic in Store: when mode is `position` and `positionOrder` is non-empty, build a rank map and sort by rank first, then alphabetical fallback
- [x] 4.3 Add gear icon button next to the sort toggle in person pane header (visible only when sort mode is `position`)
- [x] 4.4 Implement inline position order editor (popover/modal with textarea, one position per line)
- [x] 4.5 Wire editor save to update `positionOrder` signal and persist via `store.saveSettings()`

## 5. Resizable detail panel

- [x] 5.1 Add `detailPanelWidth` signal to Store with default 220, min 180, max 500, include in settings persistence
- [x] 5.2 Add vertical resize handle element on the left edge of the detail panel with `cursor: col-resize`
- [x] 5.3 Implement `onPointerDown` → `onPointerMove` → `onPointerUp` drag logic to update `detailPanelWidth`
- [x] 5.4 Apply `detailPanelWidth` signal to `ProjectDetail`, `DetailPanel`, and `UnassignedPanel` width styles
- [x] 5.5 Add CSS styles for the panel resize handle (hover highlight, active state)
- [x] 5.6 Save panel width on drag end via `store.saveSettings()`

## 6. Build verification

- [x] 6.1 Rebuild `gantt-core` package
- [x] 6.2 Rebuild `gantt-ui` package
- [x] 6.3 Rebuild Obsidian plugin package
- [x] 6.4 Verify no TypeScript errors across all packages
