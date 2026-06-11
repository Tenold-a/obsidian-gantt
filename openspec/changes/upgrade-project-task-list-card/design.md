## Context

The `ProjectDetail` component renders a task list section (lines 2393-2424) showing tasks associated with the selected project. Currently it displays each task as a flat, minimal row: status badge + clickable title. No date ranges, no assignee info, no locate button.

The `PersonDetail` component has a more mature task list (lines 3999-4054) with cards featuring: border/background styling, locate button (target icon), date range, and associated project name with color. The project detail should offer equivalent richness, replacing project info with assignee info.

Data available per task (`LocalTask` in `@obsidian-gantt/core`):
- `personId: FieldWithSource<string | null>` — resolves to a `Person` via `store.people`
- `startDate`, `endDate` — date range fields
- `title`, `status` — already displayed

The `store.people.value` array provides `Person` objects with `name` and `color` fields.

## Goals / Non-Goals

**Goals:**
- Give project task cards the same visual card styling as person task cards
- Add a locate button to each task card
- Display date range on each task card
- Display assignee name with color on each task card
- Show task count label

**Non-Goals:**
- Extracting a shared `TaskCard` component (can be done later, but YAGNI for now — two instances is not enough duplication to warrant abstraction)
- Adding edit functionality to task cards
- Changing the person detail task list (it stays as reference)

## Decisions

**Decision 1: Mirror existing PersonDetail card pattern instead of extracting a shared component**
- Rationale: The two card lists share layout but differ in the contextual info they show (project name vs person name). With only two instances, extracting a shared component would force parameterization of a single differing field, adding indirection without reducing duplication meaningfully.
- Alternative considered: Extract a `TaskCard` component. Rejected — premature abstraction for 2 instances.

**Decision 2: Look up assignee via `store.people`**
- Use `task.personId.value` to find the `Person` from `store.people.value`, same pattern used in PersonDetail to look up projects.
- The `Person` type has `name` and `color` fields, suitable for display.

**Decision 3: Show "Unassigned" when no person is set**
- When `task.personId.value` is null/empty, show no assignee line (same as PersonDetail hiding project name when null).

## Risks / Trade-offs

- [Risk] Performance: O(n) lookup per task rendered. With typical project task counts (<50), this is negligible. → No mitigation needed; Preact's diffing handles re-renders efficiently.
- [Risk] Missing person data: If personId references a person not in `store.people` (edge case with external connectors), the assignee lookup returns null and the assignee row is silently hidden. → Acceptable — same pattern already used for project lookup in PersonDetail.
