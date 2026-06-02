## 1. Fix sidebar header background

- [x] 1.1 Add `background`, `position: 'relative'`, and `zIndex: 1` to the TaskList header div

## 2. Include all people in person list

- [x] 2.1 Modify the `personGroups` computed signal to add `PersonGroup` entries for people from `persons.value` who are not already present from task grouping, with empty `tasks: []` arrays
- [x] 2.2 Verify that people without tasks sort correctly according to `personSortMode` (name/position) alongside those with tasks
