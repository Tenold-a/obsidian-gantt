## 1. UI Implementation

- [x] 1.1 Add draggable "Create Task" button to `ProjectDetail` header bar in [packages/gantt-ui/src/GanttChart.tsx](packages/gantt-ui/src/GanttChart.tsx)
- [x] 1.2 Set `draggable={true}` and `onDragStart` handler that writes `{ projectId, projectName }` JSON to `dataTransfer` — matching the exact format used by `UnassignedPanel`
- [x] 1.3 Add visual affordance: drag grip icon (⠿ or ≡) and `cursor: grab` styling on the button
- [x] 1.4 Add tooltip text: "Drag to person timeline to create a task"

## 2. Styles

- [x] 2.1 Add CSS for the draggable create-task button (grab cursor, hover effect) in [packages/obsidian-plugin/styles.css](packages/obsidian-plugin/styles.css)

## 3. Build verification

- [x] 3.1 Run `npm run build` to verify all TypeScript compiles without errors
- [x] 3.2 Verify dragging the button from project detail to person Gantt timeline creates a task with correct project + person + date
