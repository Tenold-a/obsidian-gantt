/**
 * Minimal iCalendar (RFC 5545) parser.
 * Extracts VEVENT dates and SUMMARY, returning structured event data.
 * Handles multi-day events (DTEND) and both DATE/DATE-TIME value types.
 */

import { addDays, daysBetween } from './date-utils';

export interface ICSEvent {
  date: string;
  summary: string;
}

/** Parse a YYYYMMDD string into YYYY-MM-DD. */
function parseDateStr(raw: string): string {
  const y = raw.slice(0, 4);
  const m = raw.slice(4, 6);
  const d = raw.slice(6, 8);
  return `${y}-${m}-${d}`;
}

/** Match DTSTART or DTEND with optional VALUE=DATE param and optional time suffix. */
function matchDateProp(line: string): string | null {
  const m = line.match(/^(?:DTSTART|DTEND)(?:;[^:]*)?:(\d{8})(?:T\d{6}Z?)?$/i);
  return m ? parseDateStr(m[1]) : null;
}

/**
 * Parse an iCalendar (.ics) text and extract all VEVENT dates with summaries.
 * Multi-day events (with DTEND) expand to one entry per day in [DTSTART, DTEND).
 * Returns deduplicated, sorted events (keeps longest summary per date).
 */
export function parseICS(text: string): ICSEvent[] {
  const eventMap = new Map<string, string>();

  const normalized = text
    .replace(/\r\n?/g, '\n')
    .replace(/\n[ \t]/g, '');

  const lines = normalized.split('\n');

  let inEvent = false;
  let dtStart: string | null = null;
  let dtEnd: string | null = null;
  let summary = '';

  function flushEvent() {
    if (!dtStart) return;
    const endDate = dtEnd ?? addDays(dtStart, 1); // single-day: [start, start+1)
    const totalDays = daysBetween(dtStart, endDate);
    for (let i = 0; i < totalDays; i++) {
      const date = addDays(dtStart, i);
      const existing = eventMap.get(date);
      if (!existing || summary.length > existing.length) {
        eventMap.set(date, summary);
      }
    }
  }

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed === 'BEGIN:VEVENT') {
      inEvent = true;
      dtStart = null;
      dtEnd = null;
      summary = '';
      continue;
    }
    if (trimmed === 'END:VEVENT') {
      flushEvent();
      inEvent = false;
      continue;
    }

    if (!inEvent) continue;

    // DTSTART
    if (trimmed.toUpperCase().startsWith('DTSTART')) {
      dtStart = matchDateProp(trimmed);
      continue;
    }
    // DTEND
    if (trimmed.toUpperCase().startsWith('DTEND')) {
      dtEnd = matchDateProp(trimmed);
      continue;
    }
    // SUMMARY
    const summaryMatch = trimmed.match(/^SUMMARY(?:;[^:]*)?:(.+)$/i);
    if (summaryMatch) {
      summary = summaryMatch[1].trim();
    }
  }

  const events: ICSEvent[] = [];
  for (const [date, s] of eventMap) {
    events.push({ date, summary: s });
  }
  events.sort((a, b) => a.date.localeCompare(b.date));
  return events;
}

/**
 * Build a set of simple date strings from ICS events (for backwards compatibility).
 */
export function parseICSDates(text: string): string[] {
  return parseICS(text).map(e => e.date);
}

/**
 * Classify ICS events into holidays and makeup workdays.
 *
 * A makeup workday (班) is a weekend day designated as a working day.
 * Detection: SUMMARY contains keywords like "补班", "班", "调休上班", "makeup".
 *
 * A holiday (休) is a non-weekend day off, or any imported non-working day.
 */
export function classifyICSEvents(events: ICSEvent[]): {
  holidayDates: string[];
  makeupWorkdays: string[];
} {
  const holidayDates: string[] = [];
  const makeupWorkdays: string[] = [];

  const makeupPattern = /补班|(?<![调休])班|调休上班|makeup|workday|working/i;

  for (const ev of events) {
    if (makeupPattern.test(ev.summary)) {
      makeupWorkdays.push(ev.date);
    } else {
      holidayDates.push(ev.date);
    }
  }

  return { holidayDates, makeupWorkdays };
}
