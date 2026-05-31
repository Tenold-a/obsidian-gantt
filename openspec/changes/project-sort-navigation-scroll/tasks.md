## 1. Store — Project sort mode and scroll target

- [x] 1.1 Add `projectSortMode` signal (`'name' | 'time'`, default `'name'`) in [store.ts](packages/gantt-ui/src/store.ts)
- [x] 1.2 Update `projectGroups` computed to support time-based sort: prioritize `上线时间` key date, then latest task `endDate`, then alphabetical fallback
- [x] 1.3 Add `scrollTargetDate` computed signal: return selected task's `startDate` or selected project's `上线时间`/earliest task start date, or `null`
- [x] 1.4 Export `projectSortMode` and `scrollTargetDate` via the `GanttStore` interface

## 2. Project Gantt — Sort toggle button

- [x] 2.1 Add sort toggle button in `GanttPane` header when `type === 'project'`, mirroring the existing person sort button
- [x] 2.2 Wire button `onClick` to toggle `store.projectSortMode` between `'name'` and `'time'`

## 3. Unassigned panel — Click to open project detail

- [x] 3.1 Add `onClick` handler to each unassigned project card in `UnassignedPanel` that calls `store.selectEntity({ type: 'project', id: p.id })`
- [x] 3.2 Add `cursor: 'pointer'` to card style to indicate clickability

## 4. Task detail — Bottom project section

- [x] 4.1 Add a "Project" section at the bottom of `DetailPanel` (above source info line) showing project color dot, name, and status badge
- [x] 4.2 Make the project name clickable, navigating to `store.selectEntity({ type: 'project', id: project.id })`
- [x] 4.3 Handle edge cases: task has no project (show "No project"), project is deleted (show name with "(deleted)" suffix, no click)

## 5. Timeline — Auto-scroll on selection change

- [x] 5.1 Add `useEffect` in `Timeline` component that watches `store.scrollTargetDate` and scrolls to center the target date in the viewport
- [x] 5.2 Skip auto-scroll when `scrollTargetDate` is `null` or unchanged from the last handled value
- [x] 5.3 Reuse `sharedScrollLeft` mechanism so both panes scroll together

## 6. Verification

- [x] 6.1 Run `npm run build` in all packages to verify no compilation errors (packages/gantt-core, packages/gantt-ui, packages/obsidian-plugin, packages/web-app)
- [x] 6.2 Manually verify: project sort toggle switches between name and time order correctly
- [x] 6.3 Manually verify: clicking unassigned project card opens project detail
- [x] 6.4 Manually verify: task detail shows project info at bottom with clickable navigation
- [x] 6.5 Manually verify: navigating task↔project auto-scrolls the Gantt to the correct time position
