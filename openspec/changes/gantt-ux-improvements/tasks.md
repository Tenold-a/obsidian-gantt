## 1. Position tags in task list

- [x] 1.1 Add `hashColor(position: string): string` utility function that converts a position string to a stable HSL color
- [x] 1.2 Update `GanttPane` label generation to pass position as a separate field (not as text prefix) to `TaskList`
- [x] 1.3 Update `TaskList` to accept optional `position` and `positionColor` fields per label, rendering a colored badge element before the person name
- [x] 1.4 Style the position badge in [styles.css](packages/obsidian-plugin/styles.css) using the existing `.gantt-position-badge` class with background color and white text

## 2. Visible drag handles on task bars

- [x] 2.1 Add left and right handle `<div>` elements inside `TaskBar` in [components.tsx](packages/gantt-ui/src/components.tsx), conditionally rendered when bar width >= 12px
- [x] 2.2 Style handle elements with a vertical grip pattern (repeating-linear-gradient) and hover opacity transition in [styles.css](packages/obsidian-plugin/styles.css)
- [x] 2.3 Update the edge detection logic in `TaskBar.onPointerDown` to use 8px hit zone (4px handle + 4px margin) and set `cursor: ew-resize` on handle hover
- [x] 2.4 Ensure the existing drag resize behavior (minimum 1-day duration, snap-to-grid) works correctly with the new handle elements

## 3. Vertical scroll synchronization

- [x] 3.1 Add `personScrollTop` and `projectScrollTop` signals to [store.ts](packages/gantt-ui/src/store.ts) with scroll guard pattern (matching `sharedScrollLeft`)
- [x] 3.2 Update `GanttPane` to pass `scrollTop` prop to `TaskList` and apply it via `transform: translateY(-scrollTop)` on the inner row container
- [x] 3.3 Update `Timeline.onScroll` in each `GanttPane` to report `scrollTop` to the store signal, with guard flag preventing feedback loops
- [x] 3.4 Verify that horizontal scroll behavior is unchanged: left panel stays fixed horizontally, only timeline scrolls horizontally

## 4. Draggable key date markers

- [x] 4.1 Extend `DragState` interface in [drag.ts](packages/gantt-ui/src/drag.ts) with `keyDateIndex?: number` and `projectId?: string` fields for key date drag mode
- [x] 4.2 Add `onKeyDatePointerDown` method to the drag handler factory in [drag.ts](packages/gantt-ui/src/drag.ts) that initiates key date dragging with pointer capture
- [x] 4.3 Update `onPointerMove` to handle key date mode: compute new date from horizontal delta, snap to day boundary
- [x] 4.4 Update `onPointerUp` to persist key date changes to `edits/<view-id>.json` via `store.persistEdit()` and support undo
- [x] 4.5 Add `onKeyDatePointerDown` prop to `KeyDateMarker` in [components.tsx](packages/gantt-ui/src/components.tsx) and wire `onPointerDown` with `cursor: ew-resize`
- [x] 4.6 Render key date drag ghost in `Timeline` as a colored circle at the snapped date position during key date drag
- [x] 4.7 Update `GanttPane` to pass the key date drag handler down to `Timeline` and `KeyDateMarker`

## 5. Integration verification

- [x] 5.1 Run `npm run build` (or the project's build command) to verify all TypeScript compiles without errors
- [x] 5.2 Verify position tags render correctly in both sort modes (by name, by position)
- [x] 5.3 Verify bar handles appear on hover/drag and resize behavior matches existing spec
- [x] 5.4 Verify vertical scroll sync: scrolling the timeline vertically moves the left task list in sync
- [x] 5.5 Verify horizontal scroll is NOT affected by vertical scroll changes
- [x] 5.6 Verify key date drag, persistence, and undo work correctly
