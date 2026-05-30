## 1. Core Data Model Changes

- [ ] 1.1 Add `range?: { startDate: string; endDate: string }` to `ConnectorContext` interface in `packages/gantt-core/src/index.ts`
- [ ] 1.2 Add `coveredRanges?: Array<{ start: string; end: string }>` to `CacheFile` interface in `packages/gantt-core/src/index.ts`
- [ ] 1.3 Add `fetchForRange` to `GanttStore` interface in `packages/gantt-ui/src/store.ts`

## 2. Incremental Cache Utilities

- [ ] 2.1 Create `packages/gantt-core/src/cache-utils.ts` with `computeGaps(requested, covered): Array<{start, end}>` function
- [ ] 2.2 Add `compactRanges(ranges): Array<{start, end}>` to merge overlapping/adjacent intervals
- [ ] 2.3 Add `mergeEntities(existing, incoming)` to merge tasks/persons/projects by ID
- [ ] 2.4 Export new utilities from `packages/gantt-core/src/index.ts`

## 3. Store: Incremental Fetch Logic

- [ ] 3.1 Implement `fetchForRange(connectorId, startDate, endDate)` in store:
  - Read current cache for connectorId
  - Compute gaps between requested range and `cache.coveredRanges`
  - For each gap: create context with `range`, load connector, call `fetch(ctx)` → `transform(rawData, ctx)`
  - Merge incremental results into existing cache entities by ID
  - Compact `coveredRanges` and write updated cache
  - Update store's `caches` signal
- [ ] 3.2 Update `refreshConnector(connectorId)` to:
  - Set `ctx.range = undefined` (full fetch)
  - Replace cache entirely (existing behavior) plus set `coveredRanges` from min/max task dates
- [ ] 3.3 Add `isFetching` state tracking to prevent concurrent fetches for the same connector
- [ ] 3.4 Add `loadedRangeStart`/`loadedRangeEnd` derived signals exposing cache coverage for UI

## 4. Connector: CSV Time-Range Filtering

- [ ] 4.1 Update CSV connector `fetch()` to read `ctx.range` and filter task rows by overlapping date range
- [ ] 4.2 CSV connector persons and projects remain unfiltered (always return all)

## 5. Timeline: Visible Range Tracking and Auto-Fetch

- [ ] 5.1 Add `visibleDateRange` computation in `Timeline` component from `scrollLeft`, container width, and `dayWidth`
- [ ] 5.2 Define `BUFFER_DAYS = 30` constant and compute preload window = visible range expanded by buffer on both sides
- [ ] 5.3 Add `useEffect` or scroll callback that compares preload window against `loadedRange` and calls `store.fetchForRange` for uncovered regions
- [ ] 5.4 Implement debounce (500ms) and in-flight dedup to avoid rapid-fire fetch requests
- [ ] 5.5 On initial view load, trigger `fetchForRange` for the default visible window instead of full `refreshConnector`

## 6. Verification

- [ ] 6.1 Write unit tests for `computeGaps` and `compactRanges` in `packages/gantt-core/src/__tests__/cache-utils.test.ts`
- [ ] 6.2 Write unit tests for `mergeEntities` covering: new task, updated task, unchanged task, new person, updated person
- [ ] 6.3 Run `npm run test` in `packages/gantt-core` to verify all tests pass
- [ ] 6.4 Run `npm run build` in all packages to verify no build errors
- [ ] 6.5 Verify existing connectors (CSV) still work without range: full refresh returns all data
- [ ] 6.6 Verify incremental fetch: scroll the timeline, confirm new data loads without duplicating existing tasks
