## Context

The current system has a working dual-pane Gantt chart (person + project views) with signal-based state management, field-level merge tracking, and drag interaction. Three new capabilities are needed: person position metadata with sorting, project custom fields with editing, and overlapping bar lane stacking. These changes span the core data types, store logic, and rendering components.

## Goals / Non-Goals

**Goals:**
- Add `position` field to `Person`, display person ID and position in row labels, support toggling sort between name and position in the person pane
- Add `description`, `keyDates` (named date markers), and `requester` fields to `Project`, with display in a project detail panel and editing with persistence
- Implement greedy lane-stacking for overlapping task bars so each bar remains visually distinct
- Keep all new fields optional and backward-compatible with existing data

**Non-Goals:**
- Hierarchical position ordering (e.g., Manager > Lead > Engineer) — first iteration uses alphabetical sort on position string
- Rich text editing for project description — plain text only
- Key date markers as drag-interactive elements — display-only markers initially
- Persisting sort preference across sessions — sort mode resets to default (by name) on load
- Lane stacking for the drag ghost bar — ghost remains single-lane

## Decisions

### 1. Person position stored on canonical `Person` interface

**Choice**: Add `position?: string` to the `Person` interface in `gantt-core`, not as a task-level field.

**Why**: Position is a property of the person, not of individual tasks. Connectors provide it once per person. The person-grouping code already has access to `persons` via `personNameMap`; it can build a `positionMap` the same way.

**Alternatives considered**:
- Storing position on each `Task` — redundant, violates normalization, harder for connectors to provide.
- A separate `Position` enum/union type — over-engineering for v1; free-form string is flexible across organizations.

### 2. Sort mode as a UI-local signal, not persisted

**Choice**: Store `personSortMode: 'name' | 'position'` as a `signal<'name' | 'position'>` in the store, defaulting to `'name'`.

**Why**: Keeps scope small. Persisting sort preference can be added later by writing to the view definition's `display` object.

### 3. Project custom fields stored on canonical `Project`, edits via extended `EditsOverlay`

**Choice**: Add `description?: string`, `requester?: string`, and `keyDates?: KeyDate[]` to the `Project` interface. Add `projectOverrides: Record<string, Partial<Pick<Project, 'description' | 'requester' | 'keyDates'>>>` to `EditsOverlay`.

**Why**: Project fields need the same upstream-vs-manual tracking as task fields. Extending `EditsOverlay` uses the existing persistence path (read/write `edits/<view-id>.json`) rather than creating a new file category. The `projectOverrides` map mirrors the task `overrides` map.

**Alternatives considered**:
- Separate `project-edits/<view-id>.json` file — adds a new storage category for a small amount of data.
- Storing project edits in `views/<view-id>.json` — mixes display config with data edits, violating the three-file separation.

### 4. `KeyDate` with color and icon for visual distinction

**Choice**: `interface KeyDate { name: string; date: string; color?: string; icon?: string; }`. Color defaults to amber (`#E5C07B`) when not set. Icon is a 1-2 character label rendered inside the diamond marker.

**Why**: Users need to distinguish different types of milestones at a glance (e.g., acceptance vs. launch vs. review). Color + icon provides dual-channel encoding. A single character icon fits inside the 10x10 diamond marker.

### 4b. Preset key dates for one-click insertion

**Choice**: A set of 6 predefined `KeyDate` templates with name, color, and icon: 验收时间 (green ✓), 上线时间 (blue ▲), 提测时间 (purple ◆), 评审时间 (amber ◎), 交付时间 (teal ●), 启动时间 (dark-blue ▶). Users click a preset button to insert a key date pre-filled with today's date.

**Why**: Common milestones are repeated across projects. One-click insertion saves typing and ensures consistent visual coding.

### 4c. `KeyLink` for project-attached hyperlinks

**Choice**: `interface KeyLink { name: string; url: string; }`. Added as `keyLinks?: KeyLink[]` on `Project`. Displayed as clickable links in the project detail panel. Editable via name+url input rows.

**Why**: Projects often have associated design files, documentation, or external resources. Storing these as named links on the project makes them easily accessible without cluttering the timeline.

### 5. Greedy lane assignment with partial vertical overlap

**Choice**: Within each group row, sort tasks by `startDate`, then assign each task to the first lane where its date range does not overlap the previous task in that lane. Each lane offsets the bar vertically by a **small fixed amount** (`LANE_OFFSET = Math.min(12, barHeight * 0.5)`, defaulting to ~12px) rather than a full `ROW_HEIGHT` per lane. Bars partially overlap vertically — just enough to expose the edge of each bar underneath.

**Algorithm**:
```
for each group:
  lanes: number[][] = []  // each lane is list of [startPx, endPx]
  for task in group.tasks (sorted by startDate):
    assigned = false
    for i, lane in lanes:
      if task.startPx >= last(lane).endPx:
        lane.push([task.startPx, task.endPx])
        task.laneIndex = i
        assigned = true
        break
    if not assigned:
      lanes.push([[task.startPx, task.endPx]])
      task.laneIndex = lanes.length - 1
  group.laneCount = max(1, lanes.length)
```

**Why partial overlap**: Full lane separation (ROW_HEIGHT × laneCount) wastes vertical space and makes overlaps look like separate rows rather than overlapping tasks. A small offset (12px/lane) exposes the edge of each underlying bar while keeping the visual grouping tight — the user can immediately tell multiple bars are stacked without the layout becoming sparse.

### 6. Row height expansion for multi-lane groups

**Choice**: Each group row has independent height: `ROW_HEIGHT + (laneCount - 1) * LANE_OFFSET` where `LANE_OFFSET = 12`. For example, a group with 3 lanes expands from 40px to 64px (not 120px). Task list row labels match this height. Grid row backgrounds span the full expanded height.

**Why**: With partial overlap, bars only need a small amount of extra vertical space at the bottom. The expansion formula grows by just 12px per additional lane rather than 40px, keeping the overall timeline compact.

**Risks**: Bars in higher lanes may slightly overflow the row boundary on very tight overlaps. → The formula includes a small safety margin; the highest lane's bar bottom is at `(ROW_HEIGHT - barHeight)/2 + (laneCount-1) * LANE_OFFSET + barHeight` which fits within the expanded row height.

### 7. Project detail display via existing detail panel area

**Choice**: When a project row is clicked in the project pane, show a project detail panel in the right sidebar (replacing the task detail panel) with read-only display of description, key dates, and requester. Editing is triggered by an "Edit" button that switches fields to inputs.

**Why**: Reuses the existing `DetailPanel` sidebar slot (220px right panel) which currently only shows for task selection. When a project row is clicked, `selectedEntity` becomes `{ type: 'project', id: ... }`, and the detail panel renders project info instead of task info.

## Risks / Trade-offs

- **Expanded rows cause scroll jitter**: When a group's row height changes (e.g., after editing dates), the vertical layout shifts. → Row heights are computed in a `useMemo` from stable task data; they only change on data load or edit commit, not during drag.
- **Project edits via `EditsOverlay` couples project and task editing**: A single file now holds both. → Acceptable because both are "user edits" for the same view; the separation concern is upstream (cache) vs user (edits), not task vs project.
- **Key dates may clutter the timeline**: If many projects have many key dates, the timeline could become crowded. → Key date markers are small (diamond icons, 8x8px) and only render for the visible viewport range. A future iteration could add a filter.
