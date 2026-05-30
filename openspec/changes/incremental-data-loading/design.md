## Context

The current connector system does a full fetch → full transform → full cache write cycle. All task data is loaded into memory regardless of the visible viewport. For connectors backed by APIs (Jira, Asana, etc.), fetching years of issues is slow and wasteful. For local CSV files with thousands of rows, parsing everything upfront adds unnecessary startup cost.

The Gantt chart already computes visible date ranges from scroll position and day width. It also knows the full timeline extent. The missing piece is connecting these two: using visible range to drive incremental data loading.

## Goals / Non-Goals

**Goals:**
- Allow connectors to optionally filter data by a time range passed through `ConnectorContext.range`
- Track which time ranges are already cached, compute gaps, and fetch only missing ranges
- Trigger incremental fetches automatically when the user scrolls or zooms near unloaded regions
- Keep existing connectors and cache files working without modification
- Merge incremental results into the existing cache by entity ID without duplication

**Non-Goals:**
- Data expiration / cache invalidation by time — a full refresh still re-fetches everything
- Server-side pagination token / cursor management — only date range filtering
- Streaming or progressive rendering during fetch
- Partial person/project loading — persons and projects are always loaded fully (they're small)
- Cache eviction for memory management — all loaded data stays in memory

## Decisions

### 1. Time range on ConnectorContext, not fetch() parameters

**Choice**: Add `range?: { startDate: string; endDate: string }` to `ConnectorContext`. `fetch(ctx)` signature unchanged.

**Why**: Adding a parameter to `fetch()` would be a **BREAKING** change to the `ConnectorModule` interface — all existing connectors would fail validation. Putting it on `ctx` keeps the function signature identical. Existing connectors simply ignore `ctx.range` and return all data. New connectors read `ctx.range` if they want to optimize.

**Alternatives considered**:
- New optional second parameter `fetch(ctx, range?)` → breaks all existing connector scripts
- Separate `fetchRange()` export on connector module → adds interface complexity for a minor optimization
- Pass range through `ctx.config` → mixes user config with system state, semantically wrong

### 2. Cache coverage as a list of covered date ranges

**Choice**: Add `coveredRanges?: Array<{ start: string; end: string }>` to `CacheFile`. Each entry is a requested time window that has been fetched and merged. The union of all entries represents the loaded coverage.

**Why**: A simple array of intervals is sufficient for gap computation. It avoids the complexity of per-task date tracking while allowing the store to determine which time windows still need fetching.

**Gap algorithm**:
```
function computeGaps(requested, covered):
  sort covered by start
  gaps = []
  cursor = requested.start
  for each [cStart, cEnd] in covered:
    if cStart > cursor: gaps.push([cursor, cStart])
    cursor = max(cursor, cEnd)
  if cursor < requested.end: gaps.push([cursor, requested.end])
  return gaps
```

### 3. Incremental fetch triggered by scroll proximity, not exact boundary

**Choice**: When the visible viewport is within `BUFFER/2` (15 days) of an uncovered region, preemptively fetch the next window. The preload window size equals `VIEWPORT_WIDTH + BUFFER` (default BUFFER = 30 days on each side).

**Why**: Waiting until the user actually scrolls into an uncovered region would show a loading flash. Preloading when they're near the boundary ensures data is ready before it's needed.

**Debounce**: Scroll events fire at ~60fps. The range check should skip if a fetch for the same connector is already in flight, and should not trigger more than once per 500ms.

### 4. Full refresh clears coverage, incremental refresh extends it

**Choice**: `refreshConnector(id)` always does a full fetch (clears `coveredRanges`, fetches all, rebuilds cache). New `fetchForRange(id, start, end)` does incremental (computes gaps, fetches only missing, merges). The UI calls `fetchForRange` automatically; `refreshConnector` remains the manual "reload everything" action.

**Why**: Clear separation of concerns. Manual refresh = start fresh. Auto-fetch = fill gaps. Users clicking "Refresh" expect a full reload; auto-scroll should be non-destructive.

### 5. Entity merge by ID on incremental fetch

**Choice**: When merging incremental results into the cache, entities (tasks, persons, projects) are keyed by ID. Newer data overwrites older for the same ID. Persons and projects are always fully replaced (not merged per-field) — they're small enough that this is harmless.

**Why**: Same ID = same entity. An incremental fetch may return an updated version of a previously loaded task. Overwriting by ID is the natural merge strategy and matches the existing full-refresh behavior.

### 6. Connector responsibility for range filtering

**Choice**: The connector's `fetch()` reads `ctx.range` and decides how to filter. If `ctx.range` is absent, return all data. If present, the connector SHOULD return tasks whose date range overlaps the requested window (not strictly contained within it).

**Why**: Tasks that start before the window but extend into it should still appear on the timeline. Overlap semantics (rather than strict containment) is the correct behavior for Gantt rendering.

**For the CSV connector**: When `ctx.range` is present, filter task rows where `startDate <= range.end AND (endDate >= range.start OR endDate is empty)`. Persons and projects are always returned in full (they're small reference data).

## Risks / Trade-offs

- **Coverage fragmentation**: Many small incremental fetches could produce many small `coveredRanges` entries, slowing gap computation. → Mitigation: merge adjacent/overlapping ranges in `coveredRanges` after each fetch (simple O(n) merge pass).
- **Incomplete data on first load**: Initial view only loads visible range + buffer, so the timeline shows a partial dataset. → Mitigation: the toolbar shows loaded/total task counts; a "Load All" action is available.
- **Connector ignores range**: If a connector doesn't filter by `ctx.range`, incremental fetches return all data anyway. → The covered range is still recorded, so no duplicate fetches occur. The only cost is the redundant data transfer, which is the connector's choice.
- **Scroll jitter during fetch**: If data loads while the user is scrolling, row heights may shift. → Tasks without dates don't affect the timeline layout; date-bearing tasks only shift the row if they change lane assignments, which is already handled by the existing `useMemo` recomputation.
