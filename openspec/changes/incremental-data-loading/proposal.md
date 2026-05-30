## Why

Currently the connector system fetches all data at once and loads it entirely into memory. For large projects with years of tasks, this is inefficient: the initial load is slow, memory usage is high, and most of the loaded data isn't visible. By supporting time-range-based incremental fetching, the Gantt chart only loads data relevant to the visible viewport plus a buffer, and automatically loads more as the user scrolls or zooms.

## What Changes

- **Time-range-aware connector fetch**: `ConnectorContext` gains an optional `range?: { startDate: string; endDate: string }` field. Connectors can use it to filter upstream queries. When absent, behavior is unchanged (full fetch).
- **Incremental cache model**: Cache files are extended with a `coveredRanges: Array<{ startDate: string; endDate: string }>` field tracking which time windows have been fetched. Merging multiple fetches deduplicates tasks by ID.
- **Store fetch-for-range**: New `fetchForRange(startDate, endDate)` method checks which portions of the requested range are already cached, requests only gaps from the connector, merges results into the existing cache.
- **Scroll-driven auto-load**: `Timeline` component monitors the visible date range. When the user scrolls or zooms near the edge of cached coverage, it triggers `fetchForRange` for the next window. A configurable buffer (default 30 days) preloads ahead of the viewport.
- **Backward compatibility**: Connectors that don't read `ctx.range` continue to work — their full result is cached and marked as covering the entire returned date span.

## Capabilities

### New Capabilities

- `connector-time-range`: ConnectorContext provides an optional time range; connectors can filter upstream data to only the requested window; backward-compatible with existing connectors
- `incremental-cache`: Cache file tracks which time ranges have been covered; multiple fetch results are merged by task ID without duplication; cache exposes coverage gaps for the store to request

### Modified Capabilities

- `connector-system`: `ConnectorContext` gains `range?: { startDate: string; endDate: string }`; `ConnectorModule.fetch` signature unchanged (range comes via context, not parameters); connector documentation updated
- `local-data-store`: `CacheFile` gains `coveredRanges` array; store gains `fetchForRange` action; refresh logic extended to support incremental vs full refresh
- `gantt-renderer`: `Timeline` exposes visible date range changes; triggers incremental loads when approaching cache boundaries

## Impact

- **Core types** (`packages/gantt-core/src/index.ts`): `ConnectorContext` gains `range`; `CacheFile` gains `coveredRanges`
- **Store** (`packages/gantt-ui/src/store.ts`): New `fetchForRange` action; `refreshConnector` supports full vs incremental mode; cache merge logic for deduplication
- **Timeline** (`packages/gantt-ui/src/GanttChart.tsx`): Visible range tracking; auto-fetch trigger on scroll/zoom near boundaries
- **Connector implementations**: CSV connector optionally filters tasks by date range (performance optimization for large files); other connectors unchanged
