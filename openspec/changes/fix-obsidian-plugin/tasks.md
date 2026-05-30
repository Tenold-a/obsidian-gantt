## 1. Fix type exports

- [x] 1.1 Export `VaultAdapter` interface from `storage.ts` so `connector-loader.ts` can import it
- [x] 1.2 Fix the import in `connector-loader.ts` to use `import type { VaultAdapter } from './storage'`

## 2. Fix GanttView to extend ItemView

- [x] 2.1 Import `ItemView` from `obsidian` in `view.tsx`
- [x] 2.2 Make `GanttView extends ItemView` and call `super(leaf)` in constructor
- [x] 2.3 Update constructor to accept `leaf: WorkspaceLeaf` parameter
- [x] 2.4 Update `main.ts` to pass the leaf to `GanttView` constructor correctly

## 3. Fix storage directory creation

- [x] 3.1 Remove the unreliable write+remove temp file hack from `storage.ts`
- [x] 3.2 Simplify `write()` method — Obsidian's vault adapter creates parent directories automatically
- [x] 3.3 Add error handling for edge cases where adapter throws on write

## 4. Fix build output and CSS loading

- [x] 4.1 Change build output in `build.mjs` from `dist/main.js` to `main.js` (plugin root)
- [x] 4.2 Update `package.json` main field to `"main.js"`
- [x] 4.3 Remove `loader: { '.css': 'text' }` from build.mjs (CSS is loaded by Obsidian, not bundled)
- [x] 4.4 Verify `manifest.json` is at plugin root alongside `main.js` and `styles.css`

## 5. Verify the build

- [x] 5.1 Run build and confirm no errors
- [x] 5.2 Verify `packages/obsidian-plugin/main.js` exists at plugin root
- [x] 5.3 Verify that importing `@obsidian-gantt/core` and `@obsidian-gantt/ui` resolves correctly in the output

## 6. Fix timeline dynamic rendering (scroll tracking)

- [x] 6.1 Refactor `TimelineGrid` from static full-range rendering to dynamic viewport-based positioning with `scrollLeft`, `viewportWidth`, `bufferPx`, `bodyOriginPx` props
- [x] 6.2 Refactor `TimeHeader` from static `startDate`/`endDate` to dynamic date range computation from scroll position
- [x] 6.3 Move `TimeHeader` outside the scroll container — wrapper div with `flex-direction: column`, header in `overflow: hidden` layer, body in `overflow: scroll` layer
- [x] 6.4 Change `TimeHeader` translateX from `rangeStartBodyPx` to `rangeStartBodyPx - scrollLeft` (header at viewport x=0, no sticky)
- [x] 6.5 Unify buffer: remove `HEADER_BUFFER_DAYS`, use `GRID_BUFFER_PX` (600px) for both grid and header `absAlignedLeft` calculation
- [x] 6.6 Export `TIMELINE_ORIGIN`, `dateToAbsolutePixel`, `absolutePixelToDate` from components.tsx for use in GanttChart.tsx
- [x] 6.7 Add `bodyOriginPx` / `bodyTotalWidth` computation from task date range with 2-year padding
- [x] 6.8 Add shift+wheel horizontal scroll support
- [x] 6.9 Rebuild both `gantt-ui` and `obsidian-plugin` packages
- [x] 6.10 Verify header labels align with grid lines and track scroll position in Obsidian

## 7. Add task detail sidebar

- [x] 7.1 Create `DetailPanel` component showing selected task metadata (title, dates, progress, person, project, dependencies, tags, source info)
- [x] 7.2 Create `FieldRow` helper for consistent label+value display
- [x] 7.3 Create progress bar with visual fill and percentage label
- [x] 7.4 Restructure `DualPane` layout to include right sidebar column conditional on `selectedEntity.type === 'task'`
- [x] 7.5 Hide `UnassignedPanel` when detail panel is visible (both occupy same right column)
- [x] 7.6 Add close button (×) that calls `store.selectEntity(null)`
- [x] 7.7 Rebuild and verify
