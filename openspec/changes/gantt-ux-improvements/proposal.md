## Why

The Gantt chart currently supports drag-to-resize on task bars via invisible 6px edge zones, but users have no visual affordance indicating this capability. Key date markers are static and can only be edited through the detail panel, slowing down timeline adjustments. The left person/project list does not scroll vertically with the timeline, causing row labels to misalign with their bars. Person positions are displayed as plain text prefixes, making it hard to scan and distinguish roles at a glance.

## What Changes

- Add visible drag handle elements (grippy indicators) on both ends of task bars, replacing the invisible 6px hit zones with clear visual affordances
- Make KeyDateMarker (project milestone diamonds) horizontally draggable to adjust their date directly on the timeline
- Synchronize vertical scrolling between the left task list panel and the timeline body within each pane, so row labels stay aligned with their bars
- Replace the text prefix position display (`"Engineer · Alice Chen"`) with colored tag badges, using position-based color coding for quick visual scanning

## Capabilities

### New Capabilities
- `visible-bar-handles`: Visible drag handle UI elements on the left and right edges of task bars that clearly indicate resizability
- `draggable-key-dates`: Drag-to-reposition support for KeyDateMarker components on the project timeline
- `position-tags`: Colored tag badges for person positions in the task list, with automatic color assignment based on position name

### Modified Capabilities
- `dual-gantt-view`: The existing "Task list and timeline vertical sync" scenario is specified but not yet implemented. This change completes that implementation.
- `drag-interactions`: The edge hit area changes from invisible 6px zones to visible handle elements with a larger click target. The resize drag mechanics remain the same.

## Impact

- **Components**: `TaskBar`, `KeyDateMarker`, `TaskList` rows in [GanttChart.tsx](packages/gantt-ui/src/GanttChart.tsx); new handle sub-elements in [components.tsx](packages/gantt-ui/src/components.tsx)
- **Drag system**: New `onKeyDatePointerDown` handler alongside existing task drag in [drag.ts](packages/gantt-ui/src/drag.ts); key date dragging writes to edit persistence
- **Scroll**: `GanttPane` vertical scroll synchronization between left panel and timeline; new `sharedScrollTop` signal per pane in [store.ts](packages/gantt-ui/src/store.ts)
- **Styles**: Handle visuals, position tag colors, scroll behavior in [styles.css](packages/obsidian-plugin/styles.css)
- **No breaking changes**: All existing drag behaviors and scroll behaviors are preserved
