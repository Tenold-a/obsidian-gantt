/**
 * Date & coordinate utilities for the Gantt chart.
 * All dates are ISO format strings (YYYY-MM-DD).
 * No timezone handling — dates are treated as calendar days.
 */

/** Parse YYYY-MM-DD into a local Date (noon UTC to avoid tz edge cases). */
function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
}

/** Format a Date to YYYY-MM-DD. */
function formatDate(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Signed number of days from a to b (b - a). */
export function daysBetween(a: string, b: string): number {
  const da = parseDate(a);
  const db = parseDate(b);
  return Math.round((db.getTime() - da.getTime()) / 86400000);
}

/** Add N days to a date string. */
export function addDays(date: string, days: number): string {
  const d = parseDate(date);
  const result = new Date(d.getTime() + days * 86400000);
  return formatDate(result);
}

/** Convert a date to its pixel offset from a timeline start. */
export function dateToPixel(date: string, timelineStart: string, dayWidth: number): number {
  return daysBetween(timelineStart, date) * dayWidth;
}

/** Convert a pixel offset to a date string, based on timeline start. */
export function pixelToDate(px: number, timelineStart: string, dayWidth: number): string {
  const days = Math.round(px / dayWidth);
  return addDays(timelineStart, days);
}

/** Snap a date to a day boundary (already in YYYY-MM-DD format, so it's a no-op). */
export function snapToDay(date: string): string {
  return date;
}

/** Check if a date string represents today. */
export function isToday(date: string): boolean {
  return date === formatDate(new Date());
}

/** Get today's date as a string. */
export function todayString(): string {
  return formatDate(new Date());
}

// ============================================================
// Month ranges for timeline header
// ============================================================

export interface MonthRange {
  /** Month label, e.g. "2026-06" */
  label: string;
  /** Display text, e.g. "June 2026" */
  displayText: string;
  /** Start of month (YYYY-MM-DD) */
  startDate: string;
  /** End of month (YYYY-MM-DD, last day inclusive) */
  endDate: string;
  /** Day index of the month start from timeline start */
  dayOffset: number;
  /** Number of days in the month */
  dayCount: number;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** Generate month ranges between two dates (inclusive). */
export function getMonthRanges(startDate: string, endDate: string): MonthRange[] {
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  const ranges: MonthRange[] = [];

  // Start from first day of the start month
  const cursor = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), 1, 12, 0, 0));

  while (cursor <= end) {
    const year = cursor.getUTCFullYear();
    const month = cursor.getUTCMonth();
    const firstDay = formatDate(new Date(Date.UTC(year, month, 1, 12, 0, 0)));
    const lastDay = formatDate(new Date(Date.UTC(year, month + 1, 0, 12, 0, 0)));

    // dayOffset: how many days from timeline start to month start
    const rawOffset = daysBetween(startDate, firstDay);
    // dayCount in month
    const totalMonthDays = daysBetween(firstDay, lastDay) + 1;

    // If month starts after end date, skip
    const effectiveOffset = Math.max(0, rawOffset);
    const daysBeforeStart = rawOffset < 0 ? Math.abs(rawOffset) : 0;
    const effectiveDayCount = totalMonthDays - daysBeforeStart;

    ranges.push({
      label: `${year}-${String(month + 1).padStart(2, '0')}`,
      displayText: `${MONTH_NAMES[month]} ${year}`,
      startDate: firstDay,
      endDate: lastDay,
      dayOffset: effectiveOffset,
      dayCount: effectiveDayCount,
    });

    cursor.setUTCMonth(month + 1);
  }

  return ranges;
}

// ============================================================
// Timeline range helpers
// ============================================================

/** Find the earliest start date and latest end date from tasks. */
export function computeTimelineRange(
  dates: (string | null | undefined)[],
  paddingDays: number = 7,
): { startDate: string; endDate: string } {
  const validDates = dates.filter((d): d is string => !!d);
  if (validDates.length === 0) {
    const today = todayString();
    return { startDate: today, endDate: today };
  }

  let minDate = validDates[0];
  let maxDate = validDates[0];

  for (const d of validDates) {
    const parsed = parseDate(d);
    if (parsed < parseDate(minDate)) minDate = d;
    if (parsed > parseDate(maxDate)) maxDate = d;
  }

  return {
    startDate: addDays(minDate, -paddingDays),
    endDate: addDays(maxDate, paddingDays),
  };
}
