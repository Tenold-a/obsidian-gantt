# Gantt Chart Connector Development Guide

Connectors are JavaScript modules that bridge external data sources (APIs, CSV files, databases) with the Gantt chart. They are responsible for **fetching** raw data, **transforming** it into the canonical format, and optionally **pushing** local changes back upstream.

## Data Flow

```
External Source (API, CSV, DB, ...)
        │
        ▼
  Connector.fetch(ctx)   ──→  raw data (any shape)
        │
        ▼
  Connector.transform(raw, ctx)  ──→  CanonicalData { tasks, persons, projects }
        │
        ▼
  Gantt Chart UI
        │
        ▼ (user edits)
  Connector.push(changes, ctx)  ──→  External Source
```

## Quick Start

A minimal connector that provides hardcoded data:

```javascript
// connectors/my-connector.js

async function fetch(ctx) {
  // Return raw data in any format. This could be an API call,
  // file read, or anything else.
  return {
    people: [
      { id: 'alice', name: 'Alice' },
    ],
    items: [
      { id: 't1', title: 'My Task', person: 'alice', project: 'demo' },
    ],
    proj: [
      { id: 'demo', name: 'Demo Project', color: '#4A90D9' },
    ],
  };
}

function transform(raw, ctx) {
  // Convert raw data to CanonicalData format
  return {
    tasks: raw.items.map(item => ({
      id: item.id,
      title: item.title,
      personId: item.person,
      projectId: item.project,
    })),
    persons: raw.people,
    projects: raw.proj,
  };
}

// CommonJS-style export
module.exports = { fetch, transform };
```

**Placement**: Save your connector as `<vault-root>/connectors/<name>.js`.
**Configuration**: Create `<vault-root>/obsidian-gantt-data/connectors/<name>.json`:
```json
{
  "id": "my-connector",
  "name": "My Connector",
  "script": "connectors/my-connector.js",
  "refreshInterval": 300,
  "config": {}
}
```
**Enabling**: Add the connector ID to your view's `connectors` list in `obsidian-gantt-data/views/<view-id>.json`.

## Interface Reference

### ConnectorModule

Your script must export an object with these methods:

```typescript
interface ConnectorModule {
  fetch(ctx: ConnectorContext): Promise<unknown>;
  transform(rawData: unknown, ctx: ConnectorContext): CanonicalData;
  push?(changes: PushChangesPayload, ctx: ConnectorContext, onProgress?: (progress: PushProgress) => void): Promise<PushResult>;
  fetchDetail?(id: string, type: 'project' | 'task', ctx: ConnectorContext): Promise<unknown>;
  transformDetail?(rawData: unknown, ctx: ConnectorContext): ProjectDetail | TaskDetail;
}
```

- **`fetch(ctx)`** — Retrieve raw data from the upstream source. Return any shape; `transform` will handle conversion. Throw an error on failure.
- **`transform(raw, ctx)`** — Convert raw data to `CanonicalData`. Must be synchronous. Called with the return value of `fetch()`.
- **`push(changes, ctx, onProgress?)`** (optional) — Send local edits back upstream. If omitted, the connector is read-only. The optional `onProgress` callback (new in 0.3.0) receives progress updates for UI display.
- **`fetchDetail(id, type, ctx)`** (optional) — Fetch rich detail for a single entity. Called when user opens a detail panel.
- **`transformDetail(raw, ctx)`** (optional) — Convert raw detail data into `ProjectDetail` or `TaskDetail`. Required if `fetchDetail` is provided.

### ConnectorContext

Passed to all connector methods. Provides platform-abstracted utilities:

| Property | Type | Description |
|----------|------|-------------|
| `config` | `Record<string, unknown>` | User configuration from `connectors/<id>.json` |
| `request(url, opts?)` | `(string, RequestInit?) => Promise<Response>` | HTTP request (abstracts Obsidian vs. browser) |
| `log(message)` | `(string) => void` | Simple log (delegates to `logger.info`) |
| `logger` | `ILogger` | Structured logger with `debug`, `info`, `warn`, `error` methods |
| `readFile(path)?` | `(string) => Promise<string>` | Read vault file content |
| `writeFile(path, content)?` | `(string, string) => Promise<void>` | Write content to vault file |
| `parseCSV(text, opts?)?` | `(string, CsvParseOptions?) => Record<string, string>[]` | Parse CSV text into objects |
| `viewState?` | `ConnectorViewState` | Current filter/sort state (for optimized fetching) |

### CanonicalData

The output of `transform()`:

```typescript
interface CanonicalData {
  tasks: Task[];
  persons: Person[];
  projects: Project[];
}
```

**Task:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | Yes | Unique identifier |
| `title` | `string` | Yes | Display title |
| `startDate` | `string` | No | ISO date `YYYY-MM-DD` |
| `endDate` | `string` | No | ISO date `YYYY-MM-DD` |
| `progress` | `number` | No | 0–1 completion ratio |
| `status` | `string` | No | One of: `pending`, `in-progress`, `cancelled`, `pending-online`, `online`, `completed` |
| `personId` | `string` | No | References `Person.id` |
| `projectId` | `string` | No | References `Project.id` |
| `parentId` | `string` | No | Parent task ID for hierarchy |
| `dependencies` | `string[]` | No | IDs of blocking tasks |
| `tags` | `string[]` | No | Arbitrary tags |
| `url` | `string` | No | External link |
| `metadata` | `Record<string, unknown>` | No | Connector-specific data (pass-through) |

**Person:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | Yes | Unique identifier |
| `name` | `string` | Yes | Display name |
| `position` | `string` | No | Job title or role |
| `avatar` | `string` | No | Avatar URL or path |

**Project:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | Yes | Unique identifier |
| `name` | `string` | Yes | Display name |
| `status` | `string` | No | Lifecycle status (same values as Task) |
| `color` | `string` | No | CSS color for bars and headers |
| `description` | `string` | No | Rich text description (supports Markdown) |
| `requester` | `string` | No | Stakeholder or department |
| `keyDates` | `KeyDate[]` | No | Named milestone markers |
| `keyLinks` | `KeyLink[]` | No | Named hyperlinks |
| `tags` | `string[]` | No | Arbitrary tags |
| `metadata` | `Record<string, unknown>` | No | Connector-specific data |

### PushChangesPayload, PushResult & PushProgress (v0.3.0)

**BREAKING changes** in v0.3.0 — existing connectors must be updated.

```typescript
interface PushChangesPayload {
  tasks: Partial<Task>[];       // Only modified fields + required id
  projects: Partial<Project>[]; // Only modified fields + required id
  deletedTaskIds: string[];
  deletedProjectIds: string[];
}

interface PushProgress {
  current: number;   // Items completed so far
  total: number;     // Total items to push
  message: string;   // Human-readable progress description
}

interface PushResult {
  success: boolean;
  error?: string;
  failedItems?: { id: string; type: 'task' | 'project'; error: string }[];
}
```

**Key behavioral changes:**

1. **Partial payloads**: `payload.tasks[i]` now contains **only** the fields the user modified (e.g., if only `startDate` changed, the object is `{ id, startDate }`). Locally-created tasks are still full objects. Your connector's upsert logic should merge only the provided fields, not replace the entire entity.

2. **Progress callback**: The optional third parameter `onProgress` lets you report real-time progress to the UI. Call it with `{ current, total, message }` during push. If you don't call it, the UI shows an indeterminate "Pushing..." state.

3. **Per-item failure tracking**: Return `failedItems` alongside `success: false` to indicate which items failed. The store will **only clear successfully pushed items** — failed items remain in the pending changes list for retry.

4. **Backward compatibility**: `failedItems` is optional. If absent, old behavior applies: `success: true` = all cleared, `success: false` = nothing cleared.

## Advanced Features

### Using viewState for Optimized Fetching

`ctx.viewState` provides the current filter/sort state. Use it to limit data fetching:

```javascript
async function fetch(ctx) {
  const vs = ctx.viewState;
  // Only fetch tasks within the filtered time range
  const params = new URLSearchParams();
  if (vs.filterTimeStart) params.set('start', vs.filterTimeStart);
  if (vs.filterTimeEnd) params.set('end', vs.filterTimeEnd);
  if (vs.filterStatuses?.length) params.set('statuses', vs.filterStatuses.join(','));
  if (vs.filterTags?.length) params.set('tags', vs.filterTags.join(','));

  const resp = await ctx.request(`https://api.example.com/tasks?${params}`);
  return resp.json();
}
```

### Logging

Use `ctx.logger` for structured logging. Logs are recorded in the plugin's log system when enabled:

```javascript
async function fetch(ctx) {
  ctx.logger.info('Starting fetch from API', { endpoint: 'https://api.example.com/tasks' });

  try {
    const start = Date.now();
    const resp = await ctx.request('https://api.example.com/tasks');
    const raw = await resp.json();

    ctx.logger.debug('Raw response', {
      status: resp.status,
      itemCount: raw.length,
      firstItem: raw[0],
    });
    ctx.logger.info('Fetch completed', { duration_ms: Date.now() - start, count: raw.length });

    return raw;
  } catch (e) {
    ctx.logger.error('Fetch failed', { error: e.message });
    throw e;
  }
}
```

Level usage guide:
- **debug**: Raw data samples, detailed intermediate states
- **info**: Key steps completed, summaries (e.g., "Fetch completed: 142 tasks")
- **warn**: Recoverable issues, retries, degraded behavior
- **error**: Fatal issues that prevent data loading

The legacy `ctx.log("message")` function still works — it delegates to `logger.info`.

### Error Handling

Throw errors from `fetch()` to signal failures. The system captures the error message and displays it in the UI:

```javascript
async function fetch(ctx) {
  const resp = await ctx.request('https://api.example.com/data');
  if (!resp.ok) {
    throw new Error(`API returned ${resp.status}: ${await resp.text()}`);
  }
  return resp.json();
}
```

The error is stored as `lastError` in the cache file and shown to the user.

### Implementing push() for Bidirectional Sync (v0.3.0)

The new push contract supports three features: partial payloads, progress reporting, and per-item failure tracking. Below is a complete example.

```javascript
async function push(payload, ctx, onProgress) {
  var failedItems = [];

  // Count total operations for progress tracking
  var total =
    (payload.tasks ? payload.tasks.length : 0) +
    (payload.projects ? payload.projects.length : 0) +
    (payload.deletedTaskIds ? payload.deletedTaskIds.length : 0) +
    (payload.deletedProjectIds ? payload.deletedProjectIds.length : 0);
  var completed = 0;

  function report(msg) {
    if (onProgress) {
      onProgress({ current: completed, total: total, message: msg });
    }
  }

  // ── Push tasks individually (per-item error tracking) ──
  if (payload.tasks) {
    for (var i = 0; i < payload.tasks.length; i++) {
      var task = payload.tasks[i];
      report('Pushing task: ' + (task.title || task.id));
      try {
        var res = await ctx.request('https://api.example.com/tasks/' + task.id, {
          method: 'PATCH',  // PATCH — merge only provided fields
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(task),
        });
        if (!res.ok) {
          failedItems.push({ id: task.id, type: 'task', error: 'HTTP ' + res.status });
        }
      } catch (e) {
        failedItems.push({ id: task.id, type: 'task', error: e.message });
      }
      completed++;
      report('Pushed task: ' + (task.title || task.id));
    }
  }

  // ── Push projects (same pattern) ──
  if (payload.projects) {
    for (var j = 0; j < payload.projects.length; j++) {
      var proj = payload.projects[j];
      report('Pushing project: ' + (proj.name || proj.id));
      try {
        var res = await ctx.request('https://api.example.com/projects/' + proj.id, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(proj),
        });
        if (!res.ok) {
          failedItems.push({ id: proj.id, type: 'project', error: 'HTTP ' + res.status });
        }
      } catch (e) {
        failedItems.push({ id: proj.id, type: 'project', error: e.message });
      }
      completed++;
      report('Pushed project: ' + (proj.name || proj.id));
    }
  }

  // ── Process deletions ──
  if (payload.deletedTaskIds) {
    for (var k = 0; k < payload.deletedTaskIds.length; k++) {
      var tid = payload.deletedTaskIds[k];
      report('Deleting task: ' + tid);
      try {
        var delRes = await ctx.request('https://api.example.com/tasks/' + tid, {
          method: 'DELETE',
        });
        if (!delRes.ok) {
          failedItems.push({ id: tid, type: 'task', error: 'HTTP ' + delRes.status });
        }
      } catch (e) {
        failedItems.push({ id: tid, type: 'task', error: e.message });
      }
      completed++;
      report('Deleted task: ' + tid);
    }
  }

  if (payload.deletedProjectIds) {
    for (var m = 0; m < payload.deletedProjectIds.length; m++) {
      var pid = payload.deletedProjectIds[m];
      report('Deleting project: ' + pid);
      try {
        var delRes = await ctx.request('https://api.example.com/projects/' + pid, {
          method: 'DELETE',
        });
        if (!delRes.ok) {
          failedItems.push({ id: pid, type: 'project', error: 'HTTP ' + delRes.status });
        }
      } catch (e) {
        failedItems.push({ id: pid, type: 'project', error: e.message });
      }
      completed++;
      report('Deleted project: ' + pid);
    }
  }

  // ── Return result ──
  if (failedItems.length > 0) {
    return {
      success: false,
      error: 'Partial failure: ' + failedItems.length + ' of ' + total + ' items failed',
      failedItems: failedItems,
    };
  }
  return { success: true };
}

module.exports = { fetch, transform, push };
```

**Design decisions in this pattern:**

- **Push items individually** rather than in batch — enables per-item `failedItems` tracking. A single failed item won't block others.
- **Use HTTP PATCH** — aligns with partial payload semantics. `Partial<Task>` means only changed fields are sent; the server should merge, not replace.
- **Always call `onProgress` if available** — the `if (onProgress)` guard keeps the connector compatible with older callers.
- **Return `failedItems` on partial failure** — the store uses this to selectively clear only successfully pushed items.
- **Return `success: false` with empty `failedItems`** → treated as total failure (backward compatible).
- **Return `success: true` without `failedItems`** → all items succeeded (backward compatible).

### Refresh Interval

Set `refreshInterval` in the connector config (seconds). The chart will auto-refresh data from this connector at the specified interval. Set to `0` to disable auto-refresh.

## Built-in Examples

### CSV Connector

The `csv-connector.js` (included with the plugin) demonstrates:
- Reading multiple CSV files via `ctx.readFile` and `ctx.parseCSV`
- Configurable column mapping via `ctx.config`
- Custom `.json` companion files for persistence
- Fallback to defaults when optional data is missing

Source: `packages/obsidian-plugin/connectors/csv-connector.js`

### REST API Connector (JIRA example pattern)

```javascript
// connectors/jira-connector.js

async function fetch(ctx) {
  const { baseUrl, projectKey } = ctx.config;
  const headers = { 'Authorization': `Bearer ${ctx.config.apiToken}` };

  const issuesResp = await ctx.request(
    `${baseUrl}/rest/api/3/search?jql=project=${projectKey}&maxResults=200`,
    { headers }
  );
  const issues = await issuesResp.json();

  const usersResp = await ctx.request(
    `${baseUrl}/rest/api/3/users/assignable/search?project=${projectKey}`,
    { headers }
  );
  const users = await usersResp.json();

  return { issues: issues.issues, users };
}

function transform(raw, ctx) {
  const persons = raw.users.map(u => ({
    id: u.accountId,
    name: u.displayName,
    avatar: u.avatarUrls['48x48'],
  }));

  const projectMap = new Map();
  const tasks = raw.issues.map(issue => {
    const fields = issue.fields;
    const projectKey = fields.project.key;
    if (!projectMap.has(projectKey)) {
      projectMap.set(projectKey, {
        id: projectKey,
        name: fields.project.name,
      });
    }
    return {
      id: issue.key,
      title: fields.summary,
      status: mapStatus(fields.status.name),
      personId: fields.assignee?.accountId,
      projectId: projectKey,
      startDate: fields.customfield_10015, // custom start date field
      endDate: fields.duedate,
      url: `${ctx.config.baseUrl}/browse/${issue.key}`,
    };
  });

  return {
    tasks,
    persons,
    projects: [...projectMap.values()],
  };
}

function mapStatus(jiraStatus) {
  const mapping = {
    'To Do': 'pending',
    'In Progress': 'in-progress',
    'Done': 'completed',
    'Cancelled': 'cancelled',
  };
  return mapping[jiraStatus] || 'pending';
}

module.exports = { fetch, transform };
```

## Testing Your Connector

### In the Web App

1. Run `npm run dev:web` in the project root
2. Open the browser dev tools console
3. Enable logging in the app (console-based)
4. Paste your connector code or upload it
5. Verify the Gantt chart renders your data correctly

### In Obsidian

1. Copy your connector to `<vault>/connectors/`
2. Create a config JSON at `<vault>/obsidian-gantt-data/connectors/<id>.json`
3. Add the connector ID to your view's connector list
4. Enable logging in Plugin Settings → Gantt Chart → Logging
5. Check `obsidian-gantt-data/logs/` for detailed communication logs
6. Use the Refresh button in the Gantt toolbar to trigger a fetch

### Debugging Tips

- Set log level to "Debug" to see raw response data samples in the log files
- Check `obsidian-gantt-data/cache/<connector-id>.json` to see the last successful `CanonicalData` output
- If `lastError` is set in the cache file, the connector's `fetch()` threw an error
- The `transform()` function should be pure and synchronous — avoid side effects
- Use `ctx.logger.debug(...)` liberally during development, then remove or demote to info for production

### Testing Push Enhancements (v0.3.0)

The test server (`test-server/server.mjs`) provides endpoints to verify the three new push features.

**1. Partial payload verification**

Configure a connector to point at the test server, make edits, and observe the network tab:
- Only modified fields appear in the POST body (e.g., `[{ id: "t001", startDate: "2026-06-15" }]`)
- Locally-created tasks still appear as full objects with all populated fields

**2. Progress callback verification**

The `api-connector.js` calls `onProgress` before and after each item. To verify:
- Open `PendingChangesPanel`, select items, click Push
- A progress bar appears with percentage and message (e.g., "Pushing task: Requirements gathering")
- If `onProgress` is never called, the UI shows an indeterminate "Pushing..." state instead

**3. Partial failure / selective rollback verification**

The test server provides `POST /api/push-partial?failEvery=N` to simulate partial failures:
- Every Nth item fails with a simulated error
- The rest are applied successfully to the in-memory data store

To test:
1. Start the test server: `node test-server/server.mjs`
2. Point your connector's `push` to `POST /api/push-partial?failEvery=3` instead of the normal batch endpoints
3. Make edits to at least 3 tasks, push, observe:
   - Successfully pushed items are cleared from the pending list
   - Failed items remain with their edits intact
   - The results summary shows which connector(s) failed and the error count

**Connector migration checklist:**

- [ ] Add `onProgress` parameter to `push(payload, ctx, onProgress)`
- [ ] Call `onProgress({ current, total, message })` during push (guarded with `if (onProgress)`)
- [ ] Push items individually (not batch) for per-item error tracking
- [ ] Accumulate failures in a `failedItems` array
- [ ] Return `{ success: false, error: "...", failedItems }` on partial failure
- [ ] Return `{ success: true }` (no `failedItems`) on full success
- [ ] Accept `Partial<Task>` / `Partial<Project>` — use PATCH/POST with single-item payloads
- [ ] Do NOT assume all 12 Task fields are present in payload items

## Configuration JSON Schema

```json
{
  "id": "connector-id",
  "name": "Human-readable name",
  "script": "connectors/script-name.js",
  "refreshInterval": 300,
  "config": {
    // Connector-specific settings — any shape your connector needs
  }
}
```

- `id`: Must match the filename stem (e.g., `my-jira` for `my-jira.json`)
- `name`: Display name shown in settings and views
- `script`: Path to the `.js` file, relative to vault root
- `refreshInterval`: Auto-refresh interval in seconds. `0` = manual only
- `config`: Arbitrary JSON object passed to your connector as `ctx.config`
