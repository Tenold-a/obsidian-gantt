## 1. Core date utilities — weekend detection

- [x] 1.1 Add `getDayOfWeek(date: string): number` to `packages/gantt-core/src/date-utils.ts` — returns 0-6 (Sunday-Saturday) using UTC-based calculation to avoid timezone issues
- [x] 1.2 Add `isWeekend(date: string): boolean` to `packages/gantt-core/src/date-utils.ts` — returns `true` for Saturday (6) and Sunday (0)

## 2. Holiday data model — types and combined check

- [x] 2.1 Define `HolidayConfig` interface in `packages/gantt-core/src/index.ts`: `{ weekendsEnabled: boolean; holidaysEnabled: boolean; holidayDates: string[] }`
- [x] 2.2 Add `isNonWorkingDay(date: string, config: HolidayConfig): boolean` to `packages/gantt-core/src/date-utils.ts` — combines weekend check + holiday set lookup, respecting both toggles
- [x] 2.3 Add `getNonWorkingBlocks(startDate: string, endDate: string, config: HolidayConfig): { start: string; end: string }[]` to `packages/gantt-core/src/date-utils.ts` — returns contiguous non-working day blocks within a date range, used by bar overlay rendering

## 3. iCalendar (.ics) parser

- [x] 3.1 Create `packages/gantt-core/src/ics-parser.ts` with `parseICS(text: string): string[]` — extracts VEVENT DTSTART dates, handles both `VALUE=DATE:YYYYMMDD` and `DTSTART:YYYYMMDDTHHMMSS` formats, skips non-VEVENT components, returns deduplicated ISO date strings
- [x] 3.2 Export `parseICS` from `packages/gantt-core/src/index.ts`

## 4. Platform file picker

- [x] 4.1 Add optional `pickFile?: (accept: string) => Promise<{ name: string; content: string } | null>` to `GanttPlatform` interface in `packages/gantt-core/src/index.ts`
- [x] 4.2 Implement `pickFile` in `packages/obsidian-plugin/src/platform.ts` — use Obsidian's file dialog or `requestUrl` to read vault files (accept `.ics` filter); if Obsidian has no file picker API, implement as a textarea-based import dialog fallback
- [x] 4.3 Implement `pickFile` in `packages/web-app/src/main.tsx` — use `<input type="file" accept=".ics">` via a temporary DOM element that returns `{ name, content }`

## 5. Holiday configuration persistence

- [x] 5.1 Holiday config persisted in settings file (`settings/<view-id>.json`) alongside other settings — integrated into existing `loadSettings`/`saveSettings` mechanism
- [x] 5.2 Add holiday config signals to `createGanttStore` in `packages/gantt-ui/src/store.ts`: `holidayConfig` signal (default `{ weekendsEnabled: true, holidaysEnabled: true, holidayDates: [] }`)
- [x] 5.3 Wire `holidayConfig` loading into `store.loadView()` via `loadSettings()`, and `saveHolidayConfig` action into store

## 6. CSS custom properties for holiday styling

- [x] 6.1 Add CSS variables to `packages/obsidian-plugin/styles.css` in `:root`: `--gantt-weekend-bg` (default `rgba(0,0,0,0.06)`), `--gantt-holiday-bg` (default `rgba(255,0,0,0.08)`), `--gantt-weekend-text` (default `var(--text-faint)`), `--gantt-holiday-text` (default `#c62828`), `--gantt-bar-holiday-stripe` (default `rgba(255,255,255,0.35)`)
- [x] 6.2 Add dark theme overrides in `.theme-dark` block — adjusted opacity/colors for dark backgrounds

## 7. Grid rendering — weekend and holiday column shading

- [x] 7.1 Update `TimelineGrid` component in `packages/gantt-ui/src/components.tsx` to accept optional `holidayConfig: HolidayConfig` prop
- [x] 7.2 Compute weekend gradient layer in `TimelineGrid`: when `weekendsEnabled`, add a `repeating-linear-gradient` with a 7-day cycle (`7 * dayWidth` px) shading Saturday-Sunday of each cycle
- [x] 7.3 Compute holiday gradient layer in `TimelineGrid`: when `holidaysEnabled` and `holidayDates` is non-empty, generate explicit color stops for each holiday date within the visible range + buffer, producing a linear gradient with `var(--gantt-holiday-bg)` at holiday positions and `transparent` elsewhere
- [x] 7.4 Pass `holidayConfig` from the store to `TimelineGrid` in `GanttChart.tsx` (both person and project panes)

## 8. Timeline header — non-working day label styling

- [x] 8.1 Update `TimeHeader` component in `packages/gantt-ui/src/components.tsx` to accept optional `holidayConfig: HolidayConfig` prop
- [x] 8.2 Apply conditional text color to day labels: use `var(--gantt-weekend-text)` for weekend days when enabled, `var(--gantt-holiday-text)` for holiday dates when enabled
- [x] 8.3 Pass `holidayConfig` from the store to `TimeHeader` in `GanttChart.tsx` (both panes)

## 9. Task bar — non-working day overlays

- [x] 9.1 Update `TaskBar` component in `packages/gantt-ui/src/components.tsx` to accept optional `startDate`, `endDate`, `bodyOriginPx`, `dayWidth`, and `holidayConfig` props
- [x] 9.2 Compute non-working-day blocks within the bar's date range using `getNonWorkingBlocks(startDate, endDate, config)`
- [x] 9.3 For each contiguous non-working block, render an absolutely-positioned `<div>` overlay inside the bar: positioned at correct pixel offset, `pointer-events: none`, z-index 1, with a CSS striped pattern background using `var(--gantt-bar-holiday-stripe)`
- [x] 9.4 Skip overlay rendering entirely when both `weekendsEnabled` and `holidaysEnabled` are `false` (via `getNonWorkingBlocks` returning empty)
- [x] 9.5 Pass holiday config, startDate, endDate, bodyOriginPx, and dayWidth from store through the component tree in `GanttChart.tsx` down to each `TaskBar`

## 10. Holiday settings UI

- [x] 10.1 Created `HolidaySettingsPanel` component in `GanttChart.tsx` with modal dialog
- [x] 10.2 Added toggle checkbox for "Show weekends as non-working" — bound to `holidayConfig.weekendsEnabled`, triggers `saveHolidayConfig` on change
- [x] 10.3 Added toggle checkbox for "Show imported holidays as non-working" — bound to `holidayConfig.holidaysEnabled`, triggers `saveHolidayConfig` on change
- [x] 10.4 Added "Import .ics" button — calls `platform.pickFile('.ics')`, parses content with `parseICS()`, merges dates into `holidayConfig.holidayDates` (deduplicating), saves config
- [x] 10.5 Display list of imported holiday dates with individual delete (x) buttons — each remove button splices the date from `holidayDates` and saves
- [x] 10.6 Show count of imported holiday dates and a "Clear all" button when count > 0

## 11. Build verification

- [x] 11.1 Ran full build — all four packages build successfully with no type errors
- [x] 11.2 `gantt-core` builds with new exports (`isWeekend`, `getDayOfWeek`, `isNonWorkingDay`, `getNonWorkingBlocks`, `parseICS`, `HolidayConfig`, `NonWorkingBlock`)
- [x] 11.3 `gantt-ui` builds with updated components (`TimelineGrid`, `TimeHeader`, `TaskBar` with new props) and new UI (`HolidaySettingsPanel`)
- [x] 11.4 `obsidian-plugin` builds with `pickFile` implementation and new CSS variables
- [x] 11.5 `web-app` builds with `pickFile` implementation
