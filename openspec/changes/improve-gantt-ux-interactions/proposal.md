## Why

The Gantt chart has four UX pain points that make it less efficient than it should be: position sorting is rigid (alphabetical only), resize handles don't give visual cursor feedback, the detail panel width is fixed at 220px, and external links silently fail to open in the system browser. Fixing these makes the tool feel more polished and productive.

## What Changes

- **Position custom ordering**: When sorting people by position, users can define a custom display order for positions instead of being limited to alphabetical sorting
- **Resize handle cursor feedback**: Hovering over the left/right edges of a time bar now shows an `ew-resize` (left-right arrow) cursor, giving clear visual feedback that the edge is draggable
- **Resizable detail panel**: The right-side detail panel (project/task details) gains a draggable left edge, allowing users to resize it from 180px to 500px instead of being locked at 220px
- **System browser for external links**: Clicking links in project details (key links, task URLs) now reliably opens them in the system default browser rather than relying on `target="_blank"` alone

## Capabilities

### New Capabilities
- `position-custom-order`: Define a custom ordering of position/job-title values that overrides alphabetical sort when the people list is sorted by position
- `resizable-detail-panel`: Drag-to-resize the right-side detail panel width, with min/max constraints and persistence of the user's preferred width
- `external-link-handling`: Click handlers that explicitly open URLs in the system browser via the platform bridge

### Modified Capabilities
- `drag-interactions`: Time bar resize handles now show `ew-resize` cursor on hover (previously the cursor was always `grab` due to `pointer-events: none` on handle elements)

## Impact

- **CSS**: `styles.css` — resize handle cursor rules need adjustment; new styles for panel resize handle
- **Components**: `components.tsx` — TaskBar edge hover detection for cursor changes
- **Store**: `store.ts` — new signal for custom position order; settings persistence
- **GanttChart.tsx**: ProjectDetail, DetailPanel, UnassignedPanel — replace fixed width with resizable panel; new position order editor UI; new link click handlers
- **Platform**: `platform.ts` / `core/src/index.ts` — may need `openExternal` method on the platform interface
