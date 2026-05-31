## Context

The Gantt chart renderer (`packages/gantt-ui/src/components.tsx`) currently treats every calendar day identically. The `TimelineGrid` component uses pure CSS `repeating-linear-gradient` for day/week lines with no awareness of which days are weekends or holidays. The `TimeHeader` day row labels all days with the same style. `TaskBar` renders as a single solid rectangle across its entire date range.

This feature introduces the concept of "non-working days" — a set of dates (weekends + imported holidays) that get distinct visual treatment across three rendering layers: grid background, header labels, and bar overlays.

**Constraints:**
- The rendering system is Preact + signals, with fine-grained DOM updates
- The grid background is currently pure CSS (no per-day DOM elements) for performance
- Horizontal virtualization means only visible day ranges are computed at any time
- All dates are ISO strings (YYYY-MM-DD), rendered at `DAY_WIDTH = 30px`
- The platform abstraction must remain clean — gantt-ui cannot import Obsidian APIs directly
- Dark/light theme support must be maintained via CSS custom properties

## Goals / Non-Goals

**Goals:**
- Detect weekends (Saturday/Sunday) from date strings without external dependencies
- Allow users to toggle weekend treatment on/off
- Support importing `.ics` (iCalendar) files to add custom holiday dates
- Render non-working day columns with a distinct semi-transparent background on the grid
- Style non-working day labels differently in the header day row
- Render a striped/hatched overlay on task bar segments that overlap non-working days
- Persist holiday configuration (enabled flag + imported dates) alongside view settings
- Keep the feature optional — when disabled, rendering is identical to current behavior

**Non-Goals:**
- Timezone-aware holiday handling (dates are calendar days, no time component)
- Recurring holiday rules (RRULE in iCalendar) — only concrete dates (VEVENT with DTSTART date values) are imported
- Holiday-aware duration calculation (task durations still count calendar days, not business days)
- Per-person or per-project holiday calendars — one global holiday set per view
- Complex iCalendar features (VALARM, VTODO, VJOURNAL, timezone definitions) — parse-only for VEVENT dates
- Chinese/other locale-specific holiday auto-detection — users import the `.ics` files they need

## Decisions

### Decision 1: Holiday data stored as a simple `Set<string>` of ISO dates

**Choice**: Store holidays as a flat set of ISO date strings (`Set<string>`) in a JSON file. Weekends are computed, not stored.

**Alternatives considered**:
- Store as array of date ranges → more complex to query, harder to edit manually
- Store each holiday as an object with name/date → the names from `.ics` files aren't needed for rendering, adds complexity
- Compute holidays on-the-fly from iCalendar rules → RRULE parsing is complex and error-prone; most users will import static `.ics` files with concrete dates

**Why**: A `Set<string>` provides O(1) lookup for `isHoliday(date)`. Serialization is trivial (`Array.from(set)` → JSON). The weekend check is a pure function on the date string (no storage needed).

### Decision 2: CSS `repeating-linear-gradient` extended, not replaced

**Choice**: Add additional gradient layers for weekend columns rather than rendering per-day DOM elements. The grid stays a single `<div>` with a multi-layer `background` property.

Current layers:
1. Day lines: thin line every `DAY_WIDTH` px
2. Week lines: thicker line every `7 * DAY_WIDTH` px

New layers (conditional on holiday config):
3. Weekend shading: semi-transparent overlay on Saturday/Sunday columns
4. Holiday shading: semi-transparent overlay on specific date columns

**Alternatives considered**:
- Render individual `<div>` elements per day column → DOM-heavy, would need horizontal virtualization for the grid itself, loses the performance advantage of the current approach
- Use SVG pattern → adds complexity without benefit over CSS gradients
- Use `canvas` element → overkill for colored column backgrounds

**Why**: Weekend bands repeat every 7 days, which maps perfectly to `repeating-linear-gradient`. For specific holiday dates (non-repeating), we'll use a generated gradient with explicit color stops computed from the visible date range. The hybrid approach keeps the grid performant while adding holiday visualization.

### Decision 3: Holiday bar overlay as absolutely-positioned child divs

**Choice**: For each task bar that spans non-working days, render 1-N absolutely-positioned overlay divs inside the bar, each covering the pixel range of a contiguous non-working-day block within the bar's span.

**Alternatives considered**:
- CSS `repeating-linear-gradient` on the bar itself → can't align with calendar weekends because the bar's left edge doesn't align with week boundaries
- SVG clip-path or mask → complex to implement, harder to theme
- Change bar opacity for holiday segments → doesn't work because opacity affects the whole bar

**Why**: Absolutely-positioned child divs with a striped pattern (via CSS `repeating-linear-gradient` at 45° on each overlay) is the simplest approach that correctly handles arbitrary bar positions. The overlays use `pointer-events: none` so they don't interfere with drag interactions. Performance is acceptable because most visible bars span 0-2 non-working-day blocks (a bar crossing one weekend = 1 block).

### Decision 4: iCalendar parsing via a minimal custom parser in gantt-core

**Choice**: Write a focused `.ics` parser that extracts only `VEVENT` components with `DTSTART` date values (ignoring time components), collecting them into a set of ISO date strings.

**Alternatives considered**:
- Use a library like `ical.js` or `node-ical` → adds a dependency, most of which would be unused (we only need VEVENT dates)
- Use Obsidian's community plugin ecosystem → gantt-ui is platform-agnostic, can't depend on Obsidian
- Require users to manually enter dates → poor UX for national holidays (10+ dates per year)

**Why**: The iCalendar format is well-defined (RFC 5545). The subset we need (VEVENT + DTSTART) is straightforward to parse with line-by-line processing. A custom parser is ~100 lines with no dependencies, handles the common `.ics` files distributed by governments and HR systems, and lives in `gantt-core` where both platforms can use it.

### Decision 5: Holiday configuration UI as a collapsible section in the toolbar

**Choice**: Add a "Non-working days" dropdown/section to the existing toolbar area in `GanttChart.tsx`, containing:
- Toggle checkbox: "Show weekends as non-working"
- Toggle checkbox: "Show imported holidays as non-working"
- "Import .ics file" button → triggers platform file picker
- List of imported holiday dates with individual delete (X) buttons
- Summary count of imported dates

**Why**: The toolbar already houses filters and view controls. Holiday settings are view-level configuration that changes infrequently — they fit the toolbar pattern. A dedicated section keeps the UI organized without cluttering the detail panels.

### Decision 6: Platform file picker for .ics import

**Choice**: Add an optional `pickFile?: (accept: string) => Promise<{ name: string; content: string } | null>` method to `GanttPlatform`. Obsidian platform implements it; web platform uses `<input type="file">`.

**Why**: File picking is inherently platform-specific (Obsidian has its own file dialog, web uses the DOM API). Following the existing pattern of platform abstraction (like `setIcon`), this keeps `gantt-ui` platform-agnostic.

## Risks / Trade-offs

- **Grid gradient complexity**: Each holiday date requires an explicit color stop in the gradient string. With 50+ imported holidays visible at once, the gradient string could become large → Mitigation: Only include holidays within the visible date range + buffer, recomputed on scroll. The string is set as an inline style, not in the DOM as elements.
- **Weekend detection locale**: Saturday/Sunday is the most common weekend worldwide, but some regions use Friday/Saturday or Sunday only → Mitigation: In the future, add a configurable weekend day selector. For v1, Saturday+Sunday covers the vast majority of use cases.
- **iCalendar parsing edge cases**: `.ics` files vary in quality. Some use `DTSTART;VALUE=DATE:20260101`, others use `DTSTART:20260101T000000` → Mitigation: Handle both formats. Skip unparseable lines gracefully. Log warnings for unexpected content.
- **Bar overlay performance**: Each bar crossing a non-working period creates extra DOM nodes → Mitigation: Most bars cross at most 1-2 weekend blocks. The overlay divs are simple (no children, no event handlers). If profiling shows issues, overlays can be conditionally rendered only for visible bars.
