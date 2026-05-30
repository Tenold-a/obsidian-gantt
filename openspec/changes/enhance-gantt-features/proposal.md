## Why

The current Gantt chart system lacks three important capabilities that users need for practical project management: (1) people cannot be sorted by their role/position, making it hard to see workload by team hierarchy; (2) projects only carry a name and color — there is no place for project descriptions, custom milestones, or requester information; (3) when multiple tasks for the same person or project overlap in time, their bars stack on top of each other and become indistinguishable.

## What Changes

- **Person position field and sorting**: Add a `position` field to the `Person` data model. Display person ID and position in the person view row labels. Support switching sort order between alphabetical (by name) and by position in the person Gantt pane.
- **Project custom fields**: Add `description` (project introduction), `keyDates` (array of named date markers with optional color and icon, e.g. "验收时间: 2026-06-01"), `requester` (demand-side stakeholder info), and `keyLinks` (named hyperlinks for design files, docs, etc.) to the `Project` data model. Support preset one-click key date insertion for common milestones. Support display in the project detail panel and editing via the detail panel.
- **Overlapping bar lane stacking**: When multiple task bars within the same group row have overlapping date ranges, stack them into sub-lanes with reduced height so each bar remains visually distinct. Implement a greedy lane-assignment algorithm.

## Capabilities

### New Capabilities

- `person-position-sorting`: Person entity gains a `position` field; person view supports sorting by position with configurable sort order; person ID and position are shown in row labels.
- `project-custom-fields`: Project entity gains `description`, `keyDates`, `requester`, and `keyLinks` fields; `KeyDate` supports `color` and `icon` for visual distinction; preset key dates enable one-click insertion of common milestones; key dates render as colored diamond markers on the timeline; key links display as clickable links in the detail panel.
- `bar-lane-stacking`: When task bars overlap within the same group row, they are assigned to non-overlapping vertical sub-lanes via a greedy algorithm, keeping each bar visually distinct.

### Modified Capabilities

- `local-data-store`: Person and Project canonical interfaces gain new fields; merge engine and edits overlay must handle the new project fields for editing persistence.
- `gantt-renderer`: Task bar rendering must account for lane index when computing vertical position; row height for groups with overlapping bars expands to accommodate stacked lanes.

## Impact

- **Core data types** (`packages/gantt-core/src/index.ts`): `Person` gains `position?: string`; `KeyDate` gains `color?: string` and `icon?: string`; new `KeyLink` interface (`{ name, url }`); `Project` gains `description?: string`, `keyDates?: KeyDate[]`, `requester?: string`, `keyLinks?: KeyLink[]`; `EditsOverlay.projectOverrides` extended to cover `keyLinks`.
- **Merge engine** (`packages/gantt-core/src/merge-engine.ts`): No changes needed (new fields follow existing merge patterns via `FieldWithSource`).
- **Store** (`packages/gantt-ui/src/store.ts`): `PersonGroup` gains sort mode; `personGroups` computed supports position-based sorting; project groups expose new custom fields.
- **GanttChart** (`packages/gantt-ui/src/GanttChart.tsx`): Person row labels show position and ID; sort toggle control; overlapping bar lane computation added to bar layout logic; project detail panel shows and edits custom fields; key dates render as timeline markers.
- **Components** (`packages/gantt-ui/src/components.tsx`): `TaskBar` accepts optional `laneIndex` and `totalLanes` props for vertical offset; new `KeyDateMarker` component for timeline milestone indicators.
- **CSS** (`packages/obsidian-plugin/styles.css`): New styles for position badge, project detail editor, lane-stacked bars, key date markers.
