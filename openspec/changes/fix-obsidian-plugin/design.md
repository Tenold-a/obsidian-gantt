## Context

The obsidian-plugin package has a full code skeleton but cannot be loaded into Obsidian. Five specific issues prevent it from working:

1. `GanttView` is a plain class; Obsidian's `registerView` requires `ItemView` subclass
2. `VaultAdapter` interface is defined in `storage.ts` but not exported, breaking `connector-loader.ts`
3. Storage `write()` method tries to create directories by writing+removing a temp file — unreliable on Obsidian's vault adapter
4. `styles.css` exists but is not injected into the DOM; build.mjs uses `loader: 'text'` but nothing imports or injects the CSS string
5. Build outputs to `dist/main.js` but Obsidian expects `main.js` at the plugin root alongside `manifest.json` and `styles.css`

None of these affect the core (`@obsidian-gantt/core`) or UI (`@obsidian-gantt/ui`) packages.

## Goals / Non-Goals

**Goals:**
- Plugin loads in Obsidian without errors when placed in `.obsidian/plugins/`
- Ribbon icon and command both open the Gantt view
- View renders the full GanttChart component with proper styling
- Storage layer works correctly with Obsidian's vault adapter
- Connector loader can import its dependencies
- Build produces output in the right location for Obsidian to discover

**Non-Goals:**
- Functional connector execution (requires user-created connector scripts in the vault)
- Auto-refresh or file watching (out of scope for this fix)
- Sample data seeding (the Obsidian plugin shows empty state until connectors are configured)
- Publishing to Obsidian community plugins registry

## Decisions

### 1. GanttView extends ItemView

**Decision**: Import `ItemView` from `obsidian` and make `GanttView extends ItemView`.

**Rationale**: Obsidian's `registerView(type, constructor)` expects the constructor to return an `ItemView`. The plugin API calls `getViewType()`, `getDisplayText()`, `getIcon()`, `onOpen()`, `onClose()` on the view instance. By extending `ItemView`, we inherit the base class behavior and only override what's needed.

**Alternatives considered**:
- Duck-typing (implement the interface without extending): Works at runtime but breaks if Obsidian adds `instanceof` checks. Extending is the documented pattern.
- Wrapping in a thin ItemView that delegates to GanttView: Adds indirection for no benefit.

### 2. VaultAdapter export

**Decision**: Add `export` keyword to the `VaultAdapter` interface in `storage.ts` and fix the import in `connector-loader.ts` to use `import type`.

**Rationale**: The type is already defined; it just needs to be visible to other modules. This is a one-line fix.

### 3. Directory creation in storage

**Decision**: Remove the existing write+remove hack. Instead, traverse the path segments and ensure each parent directory exists by checking `adapter.exists()` and calling a recursive approach. For Obsidian's vault adapter, creating a file automatically creates parent directories, so the safest approach is to simply let `adapter.write()` handle it. If the adapter throws on missing parents, fall back to creating parent dirs explicitly via the adapter.

**Rationale**: Obsidian's vault adapter (`FileSystemAdapter`) uses Node.js `fs` under the hood which creates parent directories automatically on write. The temp-file hack was unnecessary and could cause issues with different adapter implementations (e.g., S3, WebDAV).

### 4. CSS injection

**Decision**: Import `styles.css` in `main.ts` and inject a `<style>` tag into the document head on plugin load. Remove `loader: 'text'` from build.mjs and rely on esbuild's default CSS handling (or use a simple import with a style injection helper).

Actually: esbuild doesn't handle CSS imports for browser targets by default. Two clean approaches:
- **A)** Keep `loader: 'text'`, import the CSS in `main.ts`, and inject it via a `<style>` element
- **B)** Copy `styles.css` to the plugin root and let Obsidian auto-load it (Obsidian loads `styles.css` from plugin root automatically)

**Decision**: Use approach B. Obsidian automatically loads `styles.css` from the plugin root directory. We already have this file at the package root. By building `main.js` to the package root (Decision 5), all three files are co-located and Obsidian handles CSS automatically.

### 5. Build output location

**Decision**: Change `build.mjs` to output `main.js` directly to the package root (`packages/obsidian-plugin/main.js`) instead of `dist/main.js`. Update `package.json` main field to `"main.js"`.

**Rationale**: Obsidian expects the plugin directory to contain `manifest.json`, `main.js`, and optionally `styles.css` at the same level. By building to the root, a symlink from `.obsidian/plugins/obsidian-gantt/` → `packages/obsidian-plugin/` makes the plugin immediately loadable.

**Alternatives considered**:
- Keep `dist/` and symlink into it: Extra nesting, confusing
- Copy files in a post-build step: Adds complexity, build.mjs would need fs ops
- Use `.obsidian/plugins/` as the output directory directly: Couples build to user's vault location

## Risks / Trade-offs

- **Risk**: Changing `main` from `dist/main.js` to `main.js` in package.json could break the npm workspace resolution if other packages depend on it → **Mitigation**: No package imports `obsidian-plugin` as a dependency; it's a leaf package
- **Risk**: `ItemView` import from `obsidian` requires the type at build time → **Mitigation**: `obsidian` is already in devDependencies and externalized in build; the type-only import resolves at compile time but is stripped from output
- **Risk**: Future Obsidian API changes could break the ItemView override pattern → **Mitigation**: The Obsidian Plugin API is stable; this pattern is used by hundreds of community plugins

## 6. Timeline dynamic rendering with scroll tracking

### Problem

The Gantt chart timeline initially used a static rendering approach: `TimelineGrid` and `TimeHeader` rendered the full date range from `store.timelineRange` (start-to-end of all tasks) via CSS `repeating-linear-gradient` and flex-based day/month labels. This meant:
- The entire timeline was rendered as one large DOM element (e.g., `totalDays * 30px` wide spanning multiple years)
- No dynamic viewport-based rendering — all tick marks were present regardless of scroll position
- Memory and layout cost scaled linearly with total date range

The refactored dynamic approach renders only the visible portion plus buffers, but the `TimeHeader` used `position: sticky; top: 0` inside the scroll container with `translateX(rangeStartBodyPx)` to position labels. This relied on the sticky element scrolling horizontally with the container, and `translateX` compensating to keep labels aligned with grid lines.

**Root cause of the bug**: `position: sticky` horizontal scroll behavior varies across DOM contexts. In Obsidian's layout (which may apply `transform` or `overflow: hidden` on ancestors), the sticky element could remain at x=0 relative to the viewport instead of scrolling with the container. With `translateX(rangeStartBodyPx)` where `rangeStartBodyPx ≈ scrollLeft - buffer`, the content was pushed 21000+ pixels to the right — completely outside the visible area — leaving no visible tick marks, or showing labels at a fixed offset that didn't respond to scroll.

### Buffer misalignment

A secondary issue: `TimeHeader` used `bufferDays = 30` (900px buffer), while `TimelineGrid` used `bufferPx = 600`. Their `absAlignedLeft` calculations differed by 300px (10 days), causing header labels and grid lines to start at different absolute positions — labels would not align with the grid lines below them.

### Solution: Header-outside-scroll architecture

Move `TimeHeader` **outside** the scroll container entirely, into a separate `overflow: hidden` wrapper. The header is a plain div (no sticky), and its content uses `translateX(gridLeft - scrollLeft)` to track the body scroll position.

```
Before (broken):                      After (fixed):
┌─scroll container────────────────┐   ┌─wrapper (no scroll)─────────┐
│ sticky header                    │   │ header (overflow: hidden)   │
│  └ translateX(gridLeft)          │   │  └ translateX(gridLeft      │
│ body (scrolls)                   │   │        - scrollLeft)        │
│  └ grid left = gridLeft          │   ├─scroll container───────────┤
│  └ task bars                     │   │ body (scrolls)              │
└──────────────────────────────────┘   │  └ grid left = gridLeft     │
                                       │  └ task bars                │
                                       └─────────────────────────────┘
```

Key changes:
1. **Timeline component** ([GanttChart.tsx:295](packages/gantt-ui/src/GanttChart.tsx#L295)): Wraps header + scroll body in a `flex-direction: column` div. Header wrapper has `overflow: hidden; flex-shrink: 0`. Scroll container has `flex: 1; overflow: scroll`.

2. **TimeHeader** ([components.tsx:97](packages/gantt-ui/src/components.tsx#L97)): Removed `position: sticky`. Changed translateX from `rangeStartBodyPx` to `rangeStartBodyPx - scrollLeft`. The content now directly tracks scroll position via the signal-driven re-render.

3. **Unified buffer** ([GanttChart.tsx:26](packages/gantt-ui/src/GanttChart.tsx#L26)): Removed `HEADER_BUFFER_DAYS` constant. Both `TimelineGrid` and `TimeHeader` use `GRID_BUFFER_PX` (600px) and compute `absAlignedLeft` with the same formula:
   ```
   Math.floor((bodyOriginPx + scrollLeft - GRID_BUFFER_PX) / DAY_WIDTH) * DAY_WIDTH
   ```
   This guarantees header labels and grid lines start at identical absolute positions.

4. **Exported helpers** ([components.tsx:63-79](packages/gantt-ui/src/components.tsx#L63)): `TIMELINE_ORIGIN`, `dateToAbsolutePixel`, `absolutePixelToDate` are exported and used in `GanttChart.tsx` for coordinate calculations.

### Why translateX(gridLeft - scrollLeft) works

- `gridLeft = absAlignedLeft - bodyOriginPx` is the grid's body-relative position (same as `rangeStartBodyPx`)
- Grid viewport position = `gridLeft - scrollLeft` (body scrolls, moving the grid left)
- Header is at viewport x=0 (outside scroll container)
- Header content at `translateX(gridLeft - scrollLeft)` appears at the same viewport position as the grid
- Since `gridLeft ≈ scrollLeft - bufferPx`, translateX ≈ `-bufferPx` → content starts ~600px before viewport edge, clipped by `overflow: hidden`
- As `scrollLeft` changes (via signal → re-render), `gridLeft` updates (day-aligned), and `translateX` tracks

### Data flow

```
User scroll → scroll event → handleScroll()
  → store.sharedScrollLeft.value = sl
    → DualPane re-renders (reads signal)
      → GanttPane receives new scrollLeft prop
        → Timeline computes gridLeft, headerTranslateX
          → TimeHeader renders with translateX(gridLeft - scrollLeft)
          → TimelineGrid positions at left=gridLeft inside body
```

## 7. Task detail sidebar

### Problem

When a task bar was clicked, the task was selected (highlighted via `selectedEntity` signal) but no detail information was displayed. The right side of the layout was occupied solely by the `UnassignedPanel` (220px fixed width in the upper pane), which showed projects without assigned tasks. There was no way to inspect task metadata (dates, progress, assignee, dependencies) without looking at the raw data.

### Solution: DetailPanel component

Created a `DetailPanel` component ([GanttChart.tsx:639](packages/gantt-ui/src/GanttChart.tsx#L639)) that renders a 220px sidebar when a task is selected. The panel displays:

- **Task title** with close button (×), resets selection to null
- **Dates**: Start date, End date (or `—` if unset)
- **Progress**: Visual progress bar with percentage
- **Person**: Assigned person name (looked up from `store.persons`)
- **Project**: Project name with color dot (looked up from `store.projects`)
- **Dependencies**: List of dependency task IDs
- **Tags**: Chip-style tag display
- **Source info**: Connector name, Local override, or Manual entry; upstream deletion warning

A helper `FieldRow` component renders label + value pairs with consistent styling.

### Layout change

The `DualPane` layout was restructured ([GanttChart.tsx:789](packages/gantt-ui/src/GanttChart.tsx#L789)):

```
DualPane (flex column, h 100%)
  +-- flex row (flex: 1)
        +-- Main content column (flex: 1, minWidth: 0)
        |     +-- Upper: GanttPane(person) [+ UnassignedPanel if !showDetail]
        |     +-- Handle
        |     +-- Lower: GanttPane(project)
        +-- DetailPanel (220px, conditional on sel?.type === 'task')
```

- `showDetail = sel?.type === 'task'` determines whether the detail sidebar is visible
- When visible, `UnassignedPanel` is hidden (it would overlap in the same right column)
- Both read `store.selectedEntity.value` (a signal), so the panel appears/disappears reactively
- Clicking the × button or pressing Escape calls `store.selectEntity(null)` to close
