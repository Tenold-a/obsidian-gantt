## Context

This is a greenfield project. No existing codebase, no migration constraints. The system needs to work inside Obsidian (as a plugin) and as a standalone web application. Obsidian plugins run in an Electron webview with access to the Obsidian Vault API but limited Node.js access. The web app runs in standard browsers. Both share the same core rendering and data logic.

Key constraints:
- Obsidian plugin bundle must be compact (under ~100KB recommended)
- Must respect Obsidian themes (dark/light) via CSS variables
- Network requests in Obsidian require the `requestUrl` API
- No server-side code — everything is client-side

## Goals / Non-Goals

**Goals:**
- Define a monorepo package structure that cleanly separates core logic, UI, and platform adapters
- Design a connector interface that lets users write JS scripts to pull data from any project management tool
- Design a local data store that separates upstream snapshots from user edits, with field-level merge
- Design a high-performance dual-pane Gantt chart renderer using Preact + Signals
- Define a platform abstraction (GanttPlatform) so core/UI code has zero knowledge of the runtime

**Non-Goals:**
- Server-side rendering or backend API — everything runs client-side
- Real-time collaboration (v1) — single-user with file-based persistence
- Dependency arrow rendering (v1) — deferred to future iteration
- Time-axis zoom — not required for v1, data at day granularity
- Bi-directional sync (write back to upstream) — edits stay local only
- Connector marketplace or discovery — users manage their own connector scripts

## Decisions

### 1. Monorepo with npm workspaces

**Decision:** Four packages under a single repo using npm workspaces.

```
packages/
  gantt-core/     → @obsidian-gantt/core
  gantt-ui/       → @obsidian-gantt/ui
  obsidian-plugin/ → obsidian-gantt (plugin bundle)
  web-app/        → @obsidian-gantt/web
```

**Why:** `gantt-core` and `gantt-ui` are shared between both deployment targets. A monorepo keeps them in lockstep during development. `obsidian-plugin` bundles its own copy of `gantt-ui` and `gantt-core` at build time (no runtime package resolution in Obsidian). `web-app` can use the same packages via npm links or bundled directly.

**Alternatives considered:**
- Single package with platform conditionals → coupling too tight, hard to test independently
- Separate repos → version sync pain during early development
- pnpm/turborepo → unnecessary complexity for 4 packages

### 2. Preact + @preact/signals for rendering

**Decision:** Use Preact (3KB) with `@preact/signals` for fine-grained DOM updates instead of React or full Canvas rendering.

**Why:** At ~100 tasks, DOM-based rendering is more than sufficient. Preact is 3KB vs React's 40KB, critical for Obsidian plugin size. Signals enable per-bar updates during drag without full component tree re-renders — changing `task.startDate.x` updates a single `style.left` on one DOM node. CSS `repeating-linear-gradient` generates time grid lines with zero DOM nodes.

**Alternatives considered:**
- Canvas/WebGL (PixiJS) → overkill at 100-task scale, painful text rendering, custom hit-test for drag
- D3.js → powerful but heavy, still need React/Preact for the rest of the UI
- dhtmlx-gantt/Bryntum → commercial licenses, large bundles, limited customization
- React + Zustand → React is 40KB, VDOM diff on drag wastes CPU

### 3. Custom pointer events for drag instead of dnd-kit

**Decision:** Implement drag with native `pointerdown`/`pointermove`/`pointerup` events (~200 lines) instead of using a drag-and-drop library.

**Why:** Gantt drag semantics are unique — bar body drag vs edge resize have different behaviors, time-axis snapping is custom, and drop targets are computed from pixel-to-date mapping. General-purpose dnd libraries assume drag-between-containers or sortable-list semantics; bending them to Gantt time-axis dragging adds more complexity than writing the ~200 lines ourselves.

**Alternatives considered:**
- dnd-kit → good library but designed for list/container reordering, not continuous axis positioning
- interact.js → closer fit but 25KB for features we won't use
- @dnd-kit/core → abstracted layer, but we'd still write our own collision detection for time axis

### 4. Three-file local storage separation

**Decision:** Store cache (upstream snapshots), edits (user overrides), and views (display config) as separate JSON files.

```
.obsidian-gantt/
  cache/my-jira.json      ← machine-written, can be deleted and rebuilt
  edits/my-dashboard.json ← user-created, small, sync-friendly
  views/my-dashboard.json ← user-configured, metadata about which connectors to use
```

**Why:** This separation makes the merge logic simple and safe. Caches are disposable — delete them and re-fetch. Edits are precious — they only contain user-intentional changes. Views are configuration — they glue connectors to displays. The merge always runs in one direction: `merge(cache.tasks, edits.overrides)` — cache provides the base, edits provide field-level overrides.

**Alternatives considered:**
- Single merged file → every refresh requires careful diff, easy to corrupt
- SQLite (via wasm) → overkill, Obsidian's Vault API is file-based anyway
- IndexedDB (web) → good for web-app but Obsidian wants files; unifying on files is simpler

### 5. Field-level source tracking

**Decision:** Each editable field on a Task tracks whether its current value came from `"upstream"` or `"manual"`. On refresh, upstream values only overwrite fields marked `"upstream"`.

**Why:** This is the core mechanism that makes the local data store safe. Without it, refreshing from upstream would either clobber all user edits or require complex per-field conflict resolution UI. With it, the default behavior is correct: refresh updates what the user didn't touch, preserves what they did.

**Alternatives considered:**
- Whole-task overwrite policy → user loses work on refresh
- Timestamp-based last-write-wins → race conditions between refresh and user edit
- OT/CRDT → overkill for single-user, single-device use case

### 6. Horizontal scroll sync via signal + guard flag

**Decision:** Both Gantt panes share a `sharedScrollLeft` signal. Each pane's `onScroll` handler writes to it and reads from it, with a guard flag to prevent infinite recursion.

**Why:** CSS-only solutions (scroll-linked containers, `scroll-snap`) can't synchronize two independent scroll containers. A guard flag (`isSyncing`) set inside `requestAnimationFrame` breaks the feedback loop while keeping the scroll positions in sync within one frame — invisible to the user.

**Alternatives considered:**
- Single shared scroll container → can't achieve independent vertical scrolling
- Custom scrollbar that programmatically sets both → loses native scroll physics and touchpad gestures
- `scroll-timeline` CSS → not yet widely supported

### 7. esbuild for all builds

**Decision:** Use esbuild as the sole bundler for all packages.

**Why:** Fast, handles TypeScript natively, can bundle all four packages with different configs. The Obsidian plugin needs a single CJS/ESM bundle; the web app needs HTML + JS + CSS output. esbuild handles both with minimal config.

**Alternatives considered:**
- Vite → good for web app, awkward for Obsidian plugin bundle
- Rollup → more config overhead
- Webpack → too heavy for this project size

## Risks / Trade-offs

**[Risk] Connector script execution security** → Connector scripts are user-authored JS that runs with full page access. This is intentional — they're like Obsidian plugins or user scripts. Document clearly that connectors have the same trust level as the application itself. In Obsidian, they run in the same security context as any other plugin.

**[Risk] Cache file can grow large** → If an upstream system has thousands of tasks, the cache JSON could become megabytes. Mitigation: store cache per-connector (not per-view), so large datasets are at least scoped. Future: consider gzip compression or incremental updates.

**[Risk] Preact signals learning curve** → The team (initially solo) needs to understand signals vs state for perf. Mitigation: signals usage is scoped to `useGanttStore`, a single module that owns all signals. Components consume them via hooks that look like regular state reads.

**[Risk] esbuild plugin bundling of Preact** → esbuild must resolve Preact's JSX pragma. Mitigation: configure `jsxFactory: 'h'` and `jsxFragment: 'Fragment'` in esbuild config, import from 'preact'. Standard Preact+esbuild pattern.

**[Trade-off] No library for drag-and-drop** → We save ~20KB bundle size and gain full control, but must implement and test all drag interactions from scratch. At ~200 lines of pointer event handling, this is a net win for this specific use case.

**[Trade-off] Files over IndexedDB for web-app** → The web-app could use IndexedDB for more efficient local storage, but using the same file-like API (via localStorage) keeps the IStorage interface implementation simple and the mental model consistent. Can migrate to IndexedDB in the future if needed.

## Package Dependency Graph

```
gantt-core (zero deps)
    ↑
gantt-ui (depends on gantt-core)
    ↑
┌───┴───────────┐
obsidian-plugin  web-app
(depends on UI)  (depends on UI)
```

`gantt-core` has no external dependencies — pure TypeScript types and logic.
`gantt-ui` depends only on Preact + @preact/signals + gantt-core.
Platform packages depend on core + UI and implement `GanttPlatform`.

## Open Questions

- Should connectors support a `push()` function for writing back to upstream in a future version? (Decision: no for v1, but design the interface to allow adding it later without breaking changes)
- How should the web-app handle connector script storage? localStorage for script content? File upload each session? (Decision: localStorage for v1, clear documented limitation)
- Should the Obsidian plugin support Markdown code blocks (`` ```gantt ``) in addition to the dedicated view? (Decision: deferred — dedicated view first, code block renderer can be added later)
