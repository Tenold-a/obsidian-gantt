# obsidian-gantt

Dual-pane Gantt chart plugin for [Obsidian](https://obsidian.md). Visualize tasks grouped by person and project side by side, with drag-and-drop editing, connector-based data integration, and local-first change tracking.

## Features

### Dual-Pane Gantt View
- **Person Gantt** (top) — tasks grouped by assignee
- **Project Gantt** (bottom) — tasks grouped by project
- **Resizable split** — drag the divider to adjust pane heights
- **Shared horizontal scroll** — both panes stay synchronized
- **Independent vertical scroll** — each pane scrolls separately

### Drag & Drop
- **Move tasks** — drag bars horizontally to shift dates (duration preserved)
- **Resize tasks** — drag left/right edges to change start or end date
- **Create from project** — drag project cards from the unassigned panel onto a person row to create a new task
- **Snap to grid** — all drags snap to day boundaries
- **Undo** — Ctrl+Z / Cmd+Z to revert the last drag operation

### Task & Project Management
- **Inline name editing** — click a task title or project name to rename
- **Status management** — six lifecycle states: Pending, In Progress, Cancelled, Pending Online, Online, Completed
- **Status cascade** — completing a project auto-completes its tasks; completing all tasks auto-completes the project
- **Delete with confirmation** — soft-delete tasks and projects with confirmation dialogs
- **Detail panels** — click any task or project to see full details including dates, status, description, and links

### Project Detail Fields
- **Description** — rich text notes for each project
- **Requester** — stakeholder or department name
- **Key Dates** — named milestones with date, color, and icon marker
- **Key Links** — named URLs associated with the project
- **Tags** — add, remove, and manage tags with autocomplete suggestions

### Tag Management
- **Tag definitions** — create, rename, recolor, and delete tags per view
- **Auto-create** — new tags added to projects are automatically registered
- **Color-coded badges** — tags display with assigned colors in project detail and sidebar
- **Tag filtering** — filter projects by one or more tags (OR logic)

### Filtering
- **Time range filter** — show only projects whose key dates or tasks intersect a date range
- **Status filter** — multi-select filter by project status
- **Tag filter** — multi-select filter by project tags
- **Combined filters** — AND logic across dimensions, OR logic within each dimension
- **Dimmed out-of-filter tasks** — person pane dims task bars belonging to filtered-out projects

### Cross-View Highlight
- **Click to select** — click a project, task, or person to highlight related items
- **Cross-view sync** — selecting an entity highlights matching bars in both panes
- **Row dimming** — rows without highlighted tasks fade to de-emphasize

### Pending Changes & Push
- **Local-first edits** — all modifications saved locally before pushing upstream
- **Pending changes panel** — review all un-pushed changes grouped by type (added/modified/deleted)
- **Multi-select** — select which changes to push or dismiss
- **Push to upstream** — connectors can implement `push()` for bidirectional sync
- **Dismiss** — discard unwanted local changes without pushing

### Data Connectors
- **Connector scripts** — JavaScript modules that fetch, transform, and optionally push data
- **CSV connector** — built-in connector reads persons.csv, projects.csv, tasks.csv with configurable column mapping, custom data persistence, and push support
- **Multi-connector views** — combine data from multiple connectors in one view
- **Platform abstraction** — connectors run in Obsidian (Vault files) or standalone web app (localStorage)

### Local Data Store
- **Three-file separation** — cache (machine-written snapshots), edits (user overrides), views (display config)
- **Field-level source tracking** — each field knows whether it came from upstream or was manually edited
- **Merge engine** — combines upstream data with local edits; manual edits survive refreshes
- **Incremental cache** — time-range-aware caching for efficient data loading

### Standalone Web App
- **Browser-based** — full Gantt chart runs without Obsidian
- **localStorage backend** — all data and configuration stored in the browser
- **Connector upload** — paste or upload connector scripts
- **Static deployment** — deployable to any static hosting

## Architecture

```
obsidian-gantt/
├── packages/
│   ├── gantt-core/          # Zero-dependency core: types, merge engine, date utils, CSV parser
│   ├── gantt-ui/            # Preact + @preact/signals UI: components, store, drag interactions
│   ├── obsidian-plugin/     # Obsidian plugin: view, platform adapters (Vault storage, requestUrl)
│   └── web-app/             # Standalone Vite app: browser platform adapters (localStorage, fetch)
└── openspec/
    ├── specs/               # Authoritative specs (14 capability areas)
    └── changes/             # Active and archived change proposals
```

### Design Principles
- **`gantt-core`** has zero runtime dependencies — pure TypeScript types and logic
- **`gantt-ui`** depends only on `gantt-core`, Preact, and `@preact/signals`
- Platform packages (`obsidian-plugin`, `web-app`) implement `GanttPlatform` interfaces and never import each other
- UI state is managed via signals for fine-grained DOM updates without full re-renders
- The timeline uses CSS `repeating-linear-gradient` for grid lines (no per-line DOM elements) and horizontal virtualization for performance

### Data Flow
```
Connector.fetch() → raw data → Connector.transform() → CanonicalData
                                                              ↓
                                              cache/<connector>.json (snapshot)
                                                              ↓
                        edits/<view>.json ← → Merge Engine → Gantt UI (runtime tasks)
                        (user overrides)         ↓
                                           Source-tracked fields
                                           (upstream vs manual)
                                                              ↓
                        Connector.push() ← Pending Changes Panel
```

## Development

### Prerequisites
- Node.js 18+
- npm 9+

### Commands
```bash
npm install            # Install all dependencies
npm run build          # Build all packages
npm run build:core     # Build core only
npm run build:ui       # Build UI only
npm run build:plugin   # Build Obsidian plugin only
npm run build:web      # Build web app only
npm run dev:web        # Start web app dev server (Vite HMR)
npm test               # Run tests (gantt-core)
npm run clean          # Clean all build outputs
```

### Building the Obsidian Plugin
The built plugin is output to `packages/obsidian-plugin/`:
- `main.js` — bundled plugin (esbuild)
- `main.js.map` — source map
- `manifest.json` — plugin metadata
- Sample CSV files and the CSV connector are also copied

Copy or symlink this directory into your vault's `.obsidian/plugins/obsidian-gantt/` to install.

### Running the Web App
```bash
npm run dev:web
```
Opens a local dev server with hot reload. Useful for rapid UI development without Obsidian.

## Obsidian Plugin Usage

1. Install the plugin in your vault
2. Click the Gantt ribbon icon or run "Open Gantt Chart" command
3. The view opens in the center tab area by default
4. Configure connectors in your view settings to load data
5. Use the built-in CSV connector with sample data to get started, or write custom connectors

### Data Directory Structure
Within your vault, data is stored under `.obsidian-gantt/`:
```
.obsidian-gantt/
├── cache/<connector-id>.json    # Upstream data snapshots
├── edits/<view-id>.json         # User overrides (precious — back up)
├── views/<view-id>.json         # View configurations
├── tags/<view-id>.json          # Tag definitions per view
├── settings/<view-id>.json      # Filter/sort settings per view
└── connectors/                  # Connector scripts
    └── csv-connector.js
```

## License

MIT
