## 1. Fix connector requestUrl binding

- [x] 1.1 Import `bindObsidianFetch` and `requestUrl` in `view.tsx`
- [x] 1.2 Call `bindObsidianFetch(platform, requestUrl)` after `createObsidianPlatform`
- [x] 1.3 Add `test-api-connector.js` copy step to `build.mjs`

## 2. Test API server and connector

- [x] 2.1 Create `test-server/server.mjs` — zero-dependency HTTP server on port 3456
- [x] 2.2 Serve GET endpoints for `/api/health`, `/api/data`, `/api/tasks`, `/api/persons`, `/api/projects`
- [x] 2.3 Serve POST endpoints for `/api/tasks`, `/api/projects` (batch upsert)
- [x] 2.4 Serve DELETE endpoints for `/api/tasks/:id`, `/api/projects/:id`
- [x] 2.5 Generate 55 tasks, 14 persons, 10 projects of test data
- [x] 2.6 Create `test-api-connector.js` with fetch/transform/push

## 3. Fix initial scroll-to-today drift

- [x] 3.1 Move initial scroll from per-Timeline `useEffect` to single DualPane `useEffect`
- [x] 3.2 Use shared `didInitialScroll` ref to prevent duplicate execution
- [x] 3.3 Compute `bodyOriginPx` from `store.mergedTasks` (same data both panes use)
- [x] 3.4 Use `document.querySelector('.gantt-timeline')` for reference width

## 4. Remove auto-scroll on selection

- [x] 4.1 Remove `scrollTargetDate` computed from `store.ts`
- [x] 4.2 Remove auto-scroll `useEffect` from Timeline component
- [x] 4.3 Add `selectedTaskId` and `selectedProjectId` computed signals

## 5. Add locate button and scroll-to-entity

- [x] 5.1 Add `locateTarget` signal to store
- [x] 5.2 Add DualPane `useEffect` that watches `locateTarget` and scrolls X + Y
- [x] 5.3 Add locate (target icon) button to ProjectDetail header
- [x] 5.4 Add locate (target icon) button to TaskDetail header
- [x] 5.5 Add `scrollTop` sync `useEffect` in Timeline for Y-axis programmatic scroll

## 6. Enhanced selection highlighting

- [x] 6.1 Add `isSelected` to `TaskBarData` and `TaskRow` props
- [x] 6.2 Selected task bar: z-index 1000 + CSS `@keyframes gantt-selected-pulse` animation
- [x] 6.3 Selected project row: orange background + orange outline in Timeline and TaskList
- [x] 6.4 Inject pulse keyframes once via `useRef`/`useEffect` in TaskBar component

## 7. Fix position editor popup placement

- [x] 7.1 Wrap popup in portal div with ref callback that moves to `document.body`
- [x] 7.2 Include backdrop overlay in the same portal wrapper

## 8. Task detail editing

- [x] 8.1 Add `editing` signal and edit-mode fields (startDate, endDate, progress, personId, projectId, url, dependencies, tags)
- [x] 8.2 Add pencil edit button to task header
- [x] 8.3 Add Save/Cancel buttons in edit mode
- [x] 8.4 Implement field-level save via `store.persistEdit` with change detection
