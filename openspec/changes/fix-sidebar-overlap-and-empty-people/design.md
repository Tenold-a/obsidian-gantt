## Context

The `TaskList` component renders a fixed header (44px, sort controls) and a scrollable rows area. The rows area scrolls via CSS `translateY(-scrollTop)` synchronized to the timeline's scroll position. The outer container has `overflow: hidden`. The header currently has no background, so translated rows visually overlap the sort toggle button.

The `personGroups` computed signal builds groups by iterating over `mergedTasks.value` and bucketing by `personId`. People defined in `persons.value` (from cache files) who have no tasks assigned are absent from the list entirely.

## Goals / Non-Goals

**Goals:**
- Prevent sidebar rows from bleeding into the sort header during vertical scroll
- Show every person defined in the data in the person pane, with or without tasks

**Non-Goals:**
- Changing the scroll synchronization mechanism (remain CSS transform-based)
- Adding independent scroll to the sidebar
- Changing how people are stored or defined (data model unchanged)
- Adding UI for "people without tasks" beyond the existing empty row pattern

## Decisions

### 1. Header background via CSS variable

**Decision:** Add `background: 'var(--background-primary, #ffffff)'` and `zIndex: 1` with `position: 'relative'` to the TaskList header div.

**Alternatives considered:**
- CSS class approach: Would require updating `styles.css` and the plugin styles. Inline style keeps the change minimal and uses the existing CSS variable pattern.
- `position: sticky; top: 0`: Not needed since the header itself doesn't scroll (the rows translate underneath it). A simple background with `z-index` stacking context is sufficient.
- Clipping with `overflow: hidden` on the rows container: Already present on the outer container; the issue is that the header is a sibling, not a clipping ancestor.

### 2. Merge people with task groups

**Decision:** After building the task-to-person map, iterate over `persons.value` and add a `PersonGroup` entry for any person not already present with an empty `tasks: []` array. These entries are sorted alongside the task-based groups according to the current `personSortMode`.

**Alternatives considered:**
- Pre-initialize all people groups then fill in tasks: Would work but is slightly more complex (requires merging tasks into pre-existing groups). The add-missing approach is a smaller diff and avoids restructuring the existing loop.
- Filter out people with zero tasks when filters are active: Rejected — the explicit requirement is to show ALL people. Filtering should only dim/hide tasks, not people.

## Risks / Trade-offs

- Empty person rows have zero height in the timeline (no task bars), so the `groupHeights` computation returns `ROW_HEIGHT` (40px) for them — consistent with the existing "unassigned" pattern. No special handling needed.
- The `__unassigned__` group already follows the "show with empty tasks" pattern — this change extends the same treatment to named people.
