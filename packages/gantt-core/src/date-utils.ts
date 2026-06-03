/**
 * Date & coordinate utilities for the Gantt chart.
 * All dates are ISO format strings (YYYY-MM-DD).
 * No timezone handling — dates are treated as calendar days.
 */

/** Parse YYYY-MM-DD into a local Date (noon UTC to avoid tz edge cases). */
function parseDate(dateStr: string): Date {
  if (!dateStr || typeof dateStr !== 'string') return new Date(NaN);
  const parts = dateStr.split('-');
  if (parts.length !== 3) return new Date(NaN);
  const [y, m, d] = parts.map(Number);
  if (isNaN(y) || isNaN(m) || isNaN(d)) return new Date(NaN);
  if (m < 1 || m > 12 || d < 1 || d > 31) return new Date(NaN);
  return new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
}

/** Check if a date string is valid (YYYY-MM-DD format, represents a real date). */
export function isValidDate(dateStr: string | null | undefined): dateStr is string {
  if (!dateStr || typeof dateStr !== 'string') return false;
  const parts = dateStr.split('-');
  if (parts.length !== 3) return false;
  const [y, m, d] = parts.map(Number);
  if (isNaN(y) || isNaN(m) || isNaN(d)) return false;
  if (m < 1 || m > 12 || d < 1 || d > 31) return false;
  if (y < 1900 || y > 2200) return false;
  const date = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  if (date.getUTCFullYear() !== y || date.getUTCMonth() !== m - 1 || date.getUTCDate() !== d) return false;
  return !isNaN(date.getTime());
}

/** Format a Date to YYYY-MM-DD. */
function formatDate(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Signed number of days from a to b (b - a). Returns 0 for invalid dates. */
export function daysBetween(a: string, b: string): number {
  const da = parseDate(a);
  const db = parseDate(b);
  if (isNaN(da.getTime()) || isNaN(db.getTime())) return 0;
  return Math.round((db.getTime() - da.getTime()) / 86400000);
}

/** Get day of week for a date string. Returns 0-6 (Sunday=0, Monday=1, ..., Saturday=6). Returns -1 for invalid dates. */
export function getDayOfWeek(date: string): number {
  const d = parseDate(date);
  if (isNaN(d.getTime())) return -1;
  return d.getUTCDay();
}

/** Check if a date is a weekend day (Saturday or Sunday). */
export function isWeekend(date: string): boolean {
  const dow = getDayOfWeek(date);
  return dow === 0 || dow === 6;
}

// ============================================================
// Holiday / non-working day helpers
// ============================================================

/** Holiday / non-working day configuration for a view. */
export interface HolidayConfig {
  /** Whether to treat weekends (Sat/Sun) as non-working days. */
  weekendsEnabled: boolean;
  /** Whether to highlight imported holiday dates. */
  holidaysEnabled: boolean;
  /** ISO date strings (YYYY-MM-DD) that are holidays (non-working, including weekdays off). */
  holidayDates: string[];
  /** ISO date strings that are weekend makeup workdays (班). These override weekend treatment. */
  makeupWorkdays: string[];
}

/** Classification of a date for display styling. */
export type DateLabelType = 'normal' | 'weekend' | 'holiday' | 'makeup';

/** Get the display label type for a date based on config. */
export function getDateLabelType(date: string, config: HolidayConfig): DateLabelType {
  if (config.holidaysEnabled && config.holidayDates?.includes(date)) return 'holiday';
  if (config.weekendsEnabled && isWeekend(date)) {
    if (config.holidaysEnabled && config.makeupWorkdays?.includes(date)) return 'makeup';
    return 'weekend';
  }
  return 'normal';
}

/** Check whether a date is a non-working day based on config. */
export function isNonWorkingDay(date: string, config: HolidayConfig): boolean {
  const type = getDateLabelType(date, config);
  return type === 'weekend' || type === 'holiday';
}

/** A contiguous block of non-working days. */
export interface NonWorkingBlock {
  start: string;
  end: string;
}

/**
 * Find contiguous blocks of non-working days within a date range.
 * Used to render overlay elements on task bars.
 */
export function getNonWorkingBlocks(
  startDate: string,
  endDate: string,
  config: HolidayConfig,
): NonWorkingBlock[] {
  if (!config.weekendsEnabled && !config.holidaysEnabled) return [];
  if (!isValidDate(startDate) || !isValidDate(endDate)) return [];
  if (endDate < startDate) return [];

  const blocks: NonWorkingBlock[] = [];
  let blockStart: string | null = null;

  const totalDays = daysBetween(startDate, endDate) + 1;
  for (let i = 0; i < totalDays; i++) {
    const date = addDays(startDate, i);
    if (isNonWorkingDay(date, config)) {
      if (blockStart === null) {
        blockStart = date;
      }
    } else {
      if (blockStart !== null) {
        blocks.push({ start: blockStart, end: addDays(date, -1) });
        blockStart = null;
      }
    }
  }

  if (blockStart !== null) {
    blocks.push({ start: blockStart, end: endDate });
  }

  return blocks;
}

/** Add N days to a date string. Returns empty string for invalid input dates. */
export function addDays(date: string, days: number): string {
  const d = parseDate(date);
  if (isNaN(d.getTime())) return '';
  const result = new Date(d.getTime() + days * 86400000);
  return formatDate(result);
}

/** Convert a date to its pixel offset from a timeline start. Returns 0 for invalid dates. */
export function dateToPixel(date: string, timelineStart: string, dayWidth: number): number {
  if (!isValidDate(date)) return 0;
  return daysBetween(timelineStart, date) * dayWidth;
}

/** Convert a pixel offset to a date string, based on timeline start. Returns empty string for invalid timeline. */
export function pixelToDate(px: number, timelineStart: string, dayWidth: number): string {
  if (dayWidth <= 0 || !isValidDate(timelineStart)) return '';
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

/** Generate month ranges between two dates (inclusive). Returns empty array for invalid inputs. */
export function getMonthRanges(startDate: string, endDate: string): MonthRange[] {
  if (!isValidDate(startDate) || !isValidDate(endDate)) return [];
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
  const validDates = dates.filter((d): d is string => isValidDate(d));
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
    startDate: addDays(minDate, -paddingDays) || todayString(),
    endDate: addDays(maxDate, paddingDays) || todayString(),
  };
}
