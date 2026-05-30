## Context

The Gantt chart is built with Preact + `@preact/signals`. Task bars are rendered as absolutely-positioned `<div>` elements in [components.tsx](packages/gantt-ui/src/components.tsx#L235-L292). Drag interactions use pointer events managed by [drag.ts](packages/gantt-ui/src/drag.ts). The left panel (TaskList) and timeline body live inside each `GanttPane` ([GanttChart.tsx](packages/gantt-ui/src/GanttChart.tsx#L633-L678)). Horizontal scroll is already synchronized across both panes via `store.sharedScrollLeft` and a scroll guard pattern. Vertical scroll synchronization between the left panel and timeline is specified in the `dual-gantt-view` spec but not yet implemented.

## Goals / Non-Goals

**Goals:**
- Add visible resize handle affordances on both ends of task bars
- Make KeyDateMarker components draggable to reposition dates on the timeline
- Synchronize vertical scrolling between the left task list and the timeline body within each pane
- Render person positions as colored tag badges instead of plain text prefixes

**Non-Goals:**
- Changing the resize drag mechanics (minimum duration, snap-to-grid remain the same)
- Vertical scroll sync between the person and project panes (they remain independent)
- Multi-select drag or batch date editing
- User-configurable position colors (automatic hash-based coloring is sufficient)

## Decisions

### 1. Visible handles as DOM sub-elements inside TaskBar

Add two `<div>` children inside the `TaskBar` component at each edge. Each is ~4px wide with a CSS repeating-linear-gradient grip pattern (vertical lines). Handles are always rendered but become more visible on hover via opacity transition (0.3 → 0.8).

**Why not CSS pseudo-elements?** Pseudo-elements don't receive pointer events reliably across browsers. Real DOM elements give us proper hit targets and can participate in the pointer event flow.

**Why not a separate Handle component?** The handles are trivial (a single div with CSS) and tightly coupled to the bar's geometry. A separate component adds indirection without benefit.

### 2. Key date drag as a new drag mode

Extend `DragState` with an optional `keyDateIndex` field. When non-null, the drag operates on a key date instead of a task bar. Add `onKeyDatePointerDown` to the drag handler factory. Key date dragging only changes the date; all other fields (name, color, icon) are preserved.

**Why re-use the existing drag infrastructure?** The pointer capture, snap-to-grid, and ghost rendering patterns are already battle-tested. Adding a new drag type reuses all of this.

**Why not a separate drag handler?** A separate handler would duplicate pointer lifecycle management (capture, move, up) and could interfere with the existing handler's pointer events.

### 3. Vertical scroll sync via shared signal per pane

Add `personScrollTop` and `projectScrollTop` signals to the store. The `GanttPane`'s `Timeline` component already reports `scrollTop` in its `onScroll` callback. Apply this `scrollTop` to the `TaskList`'s inner row container via `transform: translateY(-scrollTop)` or by setting `scrollTop` on the TaskList container after changing `overflow: 'hidden'` to `overflow: 'hidden'` with programmatic scroll.

Use `overflow: 'hidden'` on the outer TaskList, but apply the scroll offset to the inner row container via CSS `transform: translateY(-${scrollTop}px)`. This avoids changing the overflow behavior (the TaskList should not show its own scrollbar) while still moving rows in sync with the timeline.

**Why `translateY` instead of `scrollTop`?** Setting `scrollTop` on an `overflow: hidden` element is a no-op. Using `translateY` on the inner container gives us full control without introducing a second visible scrollbar.

**Why per-pane signals and not a single shared one?** The existing spec requires independent vertical scrolling between person and project panes. Each pane tracks its own scrollTop.

### 4. Position tag colors via string hashing

Generate a consistent HSL color from the position string using a simple hash function (`hashCode(position) % 360` for hue). Render the position as a small badge with `background: hsl(hash, 60%, 35%)` and white text. The badge replaces the current `"Position · Name"` text prefix format; the person name is displayed separately.

**Why hash-based coloring?** No configuration needed. The same position string always gets the same color across sessions. It's deterministic and zero-config.

**Why HSL with fixed saturation/lightness?** Gives vibrant but readable colors on both dark and light backgrounds. The 35% lightness ensures contrast with both white text and dark/light backgrounds.

## Risks / Trade-offs

- **Handle visibility on very short bars**: Bars at minimum width (4px) won't have room for handles. → Handles are hidden when bar width < 12px.
- **Key date drag ghost**: The ghost for a key date is the rotated diamond shape, which is more complex to position than a rectangular bar. → Use a simple colored circle as the key date drag ghost for simplicity.
- **Vertical scroll sync performance**: `translateY` on every scroll event could cause layout thrashing. → Use `requestAnimationFrame` throttling, same as the existing horizontal scroll guard pattern.
- **Position color collisions**: Two different positions could hash to similar hues. → Acceptable trade-off; positions in practice are distinct enough that occasional proximity isn't confusing.
