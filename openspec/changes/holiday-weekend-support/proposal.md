## Why

The Gantt chart currently treats every calendar day as a working day. In real project planning, weekends and holidays are non-working periods where tasks cannot progress. Without visual distinction for these periods, the chart misrepresents project timelines. Adding holiday/weekend support gives users accurate visual context for realistic project planning, with special support for Chinese calendar conventions (holidays 休 and makeup workdays 班).

## What Changes

- Add `getDayOfWeek` and `isWeekend` to the date utility layer (UTC-based, no timezone issues)
- Introduce `HolidayConfig` with four fields: `weekendsEnabled`, `holidaysEnabled`, `holidayDates`, `makeupWorkdays`
- Add `isNonWorkingDay` — weekends are non-working UNLESS they are makeup workdays; holidays are always non-working
- Add `getDateLabelType` returning `'normal' | 'weekend' | 'holiday' | 'makeup'` for per-date styling classification
- Add `getNonWorkingBlocks` for contiguous non-working day detection (bar overlays)
- iCalendar parser: extracts `DTSTART` + `DTEND` (multi-day expansion) and `SUMMARY`; `classifyICSEvents` auto-detects makeup workdays via SUMMARY keywords (补班/班/makeup)
- Import `.ics` via local file picker OR URL fetch (e.g. `https://cdn.jsdelivr.net/npm/chinese-days/dist/years/2026.ics`)
- Grid: unified hard-stop `linear-gradient` shading non-working day columns with sharp boundaries; same bg color for weekends and holidays
- Header: day labels show blue "休" superscript for holidays, red "班" superscript for makeup workdays
- Task bars: striped overlay on non-working portions using `isNonWorkingDay`
- HolidaySettingsPanel UI: toggles, file import, URL fetch, two categorized date lists (休/班) with remove/clear
- CSS variables: `--gantt-weekend-bg`, `--gantt-holiday-text` (blue), `--gantt-makeup-text` (red), `--gantt-bar-holiday-stripe`; dark theme overrides
- `pickFile` on `GanttPlatform` (Obsidian + web implementations)

## Capabilities

### New Capabilities

- `holiday-data-model`: `HolidayConfig` with separate holiday and makeup workday arrays, `isNonWorkingDay` with makeup override logic, `getDateLabelType` for 4-way classification, `getNonWorkingBlocks` for bar overlays, ICS parser with multi-day + SUMMARY extraction, `classifyICSEvents` for auto-detection, persistence in settings JSON.
- `holiday-grid-rendering`: Unified hard-stop CSS gradient shading non-working columns (weekends + holidays same color), day header with 休/班 superscript indicators, dark/light theme CSS variables.
- `holiday-bar-rendering`: Striped overlay on task bar non-working segments, driven by `getNonWorkingBlocks`.

### Modified Capabilities

- `gantt-renderer`: Grid background switched from pure `repeating-linear-gradient` to dynamically-computed hard-stop gradient. Day header gains conditional label styling. Task bar gains overlay child elements.

## Impact

- **gantt-core**: `date-utils.ts` — `getDayOfWeek`, `isWeekend`, `HolidayConfig`, `isNonWorkingDay`, `getDateLabelType`, `getNonWorkingBlocks`, `NonWorkingBlock`. `ics-parser.ts` — `parseICS` (returns `ICSEvent[]`), `parseICSDates`, `classifyICSEvents`. `index.ts` — `pickFile` on `GanttPlatform`.
- **gantt-ui**: `components.tsx` — `TimelineGrid` unified gradient, `TimeHeader` 休/班 labels, `TaskBar` overlay divs. `store.ts` — `holidayConfig` signal, `saveHolidayConfig` action, settings persistence. `GanttChart.tsx` — `HolidaySettingsPanel` modal with import/URL fetch/two lists.
- **obsidian-plugin**: `platform.ts` — `pickFile` via DOM file input. `styles.css` — 6 new CSS variables + dark theme overrides.
- **web-app**: `main.tsx` — `pickFile` via DOM file input.
