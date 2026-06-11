## 1. Upgrade project detail task list cards

- [x] 1.1 In `ProjectDetail` (GanttChart.tsx ~lines 2393-2424), replace the flat task list items with card-style layout: add border, border-radius, background, and padding matching the person detail card style
- [x] 1.2 Add locate button (target icon) to each task card using `store.locateTarget`, with `e.stopPropagation()` to prevent navigation when clicking the locate button
- [x] 1.3 Add date range display (startDate → endDate) below the title row, matching the person detail date format and handling partial dates
- [x] 1.4 Add assigned person lookup via `store.people.value` using `task.personId.value`, displaying the person's name in their color alongside the date range
- [x] 1.5 Update the "Tasks" label to show count: "Tasks (N)" format

## 2. Verification

- [x] 2.1 Build the gantt-ui package and verify no TypeScript errors
- [x] 2.2 Build the obsidian-plugin and verify the full build chain succeeds
- [x] 2.3 Manually verify the project detail task list renders cards with all expected information (dates, assignee, locate button)
