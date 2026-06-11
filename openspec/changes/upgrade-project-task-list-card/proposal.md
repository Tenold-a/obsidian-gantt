## Why

The project detail page's task list is a flat, minimal list with only a status badge and title. In contrast, the person detail page's task list shows richer information: card-style layout with borders, locate buttons, date ranges, and associated project names. Users managing projects need the same level of detail to quickly understand task assignments, timelines, and navigate between tasks — without switching to the person view.

## What Changes

- Upgrade the project detail task list from flat items to styled cards matching the person detail task list layout
- Add a **locate button** (target icon) to each task card, allowing users to jump to the task in the Gantt
- Display **date range** (start date → end date) on each task card
- Display the **assigned person's name** with their color (instead of project info, since the project context is already known)
- Show task count next to the "Tasks" label (matching the "Tasks: N" pattern from person detail)

## Capabilities

### New Capabilities

- `project-task-list-enhancement`: Enhanced task list cards in the project detail view with locate button, date ranges, and assignee information

### Modified Capabilities

<!-- No existing spec requirements are being modified -->

## Impact

- Affected code: `packages/gantt-ui/src/GanttChart.tsx` — the `ProjectDetail` component's task list section (lines ~2393-2424)
- No API changes, no dependency changes
- Pure UI enhancement within an existing component
