## Why

The left sidebar in the Gantt chart has two usability issues: when scrolling vertically, the sorting controls at the top of the sidebar become obscured by the scrolling rows because the header lacks a background; and the person pane only shows people who have tasks assigned to them, hiding people with no current tasks and making it impossible to see the full team roster.

## What Changes

- Add a solid background to the TaskList header so vertically scrolled rows are hidden behind it instead of overlapping with the sort controls
- Modify the `personGroups` computed signal to include all people from the data store, not just those who have matching tasks — people without tasks will appear with an empty task list and be sorted according to the current sort mode

## Capabilities

### New Capabilities
- `person-list-display`: The person list shall show every person defined in the data, including those with zero tasks assigned

### Modified Capabilities
- `gantt-renderer`: The sidebar list header shall visually separate from scrolling content with a proper background

## Impact

- [packages/gantt-ui/src/GanttChart.tsx](packages/gantt-ui/src/GanttChart.tsx#L77) — TaskList header styling (add background, z-index)
- [packages/gantt-ui/src/store.ts](packages/gantt-ui/src/store.ts#L258-L297) — `personGroups` computed signal logic
