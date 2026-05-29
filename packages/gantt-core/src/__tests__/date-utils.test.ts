import { describe, it, expect } from 'vitest';
import {
  daysBetween,
  addDays,
  dateToPixel,
  pixelToDate,
  isToday,
  todayString,
  getMonthRanges,
  computeTimelineRange,
} from '../date-utils';

describe('daysBetween', () => {
  it('returns 0 for same day', () => {
    expect(daysBetween('2026-06-01', '2026-06-01')).toBe(0);
  });
  it('counts consecutive days correctly', () => {
    expect(daysBetween('2026-06-01', '2026-06-02')).toBe(1);
    expect(daysBetween('2026-06-02', '2026-06-01')).toBe(-1);
  });
  it('spans months', () => {
    expect(daysBetween('2026-05-31', '2026-06-01')).toBe(1);
  });
  it('spans years', () => {
    expect(daysBetween('2025-12-31', '2026-01-01')).toBe(1);
  });
});

describe('addDays', () => {
  it('adds 1 day', () => {
    expect(addDays('2026-06-01', 1)).toBe('2026-06-02');
  });
  it('crosses month boundary', () => {
    expect(addDays('2026-05-31', 1)).toBe('2026-06-01');
  });
  it('crosses year boundary', () => {
    expect(addDays('2025-12-31', 1)).toBe('2026-01-01');
  });
  it('subtracts days', () => {
    expect(addDays('2026-06-01', -1)).toBe('2026-05-31');
  });
});

describe('dateToPixel and pixelToDate', () => {
  it('converts start date to pixel 0', () => {
    expect(dateToPixel('2026-06-01', '2026-06-01', 30)).toBe(0);
  });
  it('converts day offset to pixels', () => {
    expect(dateToPixel('2026-06-04', '2026-06-01', 30)).toBe(90);
  });
  it('round-trips correctly', () => {
    const px = dateToPixel('2026-06-10', '2026-06-01', 30);
    expect(pixelToDate(px, '2026-06-01', 30)).toBe('2026-06-10');
  });
});

describe('isToday and todayString', () => {
  it('todayString returns today', () => {
    const today = todayString();
    expect(isToday(today)).toBe(true);
  });
  it('is today null for a different date', () => {
    expect(isToday('2020-01-01')).toBe(false);
  });
});

describe('getMonthRanges', () => {
  it('generates a single month range for a single month', () => {
    const ranges = getMonthRanges('2026-06-01', '2026-06-15');
    expect(ranges).toHaveLength(1);
    expect(ranges[0].displayText).toBe('June 2026');
    expect(ranges[0].dayCount).toBe(30);
    expect(ranges[0].dayOffset).toBe(0);
  });
  it('spans multiple months', () => {
    const ranges = getMonthRanges('2026-05-20', '2026-07-10');
    expect(ranges).toHaveLength(3);
    expect(ranges[0].displayText).toBe('May 2026');
    expect(ranges[0].dayOffset).toBe(0);
    expect(ranges[1].displayText).toBe('June 2026');
    expect(ranges[2].displayText).toBe('July 2026');
  });
  it('month offsets accumulate correctly', () => {
    const ranges = getMonthRanges('2026-06-15', '2026-08-01');
    // June: 30 days, July: 31 days → june.dayCount=30, july.dayOffset=16 (30-15+1?)
    // Start date is June 15 (not June 1), so dayOffset for June should be 0
    // June 15 → June 30 is 15 days visible
    // July: offset = daysBetween('2026-06-15', '2026-07-01') = 16
    expect(ranges[1].dayOffset).toBe(16);
  });
});

describe('computeTimelineRange', () => {
  it('returns padded range around dates', () => {
    const result = computeTimelineRange(['2026-06-01', '2026-06-30'], 7);
    // start should be 7 days before June 1 = May 25
    expect(result.startDate).toBe('2026-05-25');
    // end should be 7 days after June 30 = July 7
    expect(result.endDate).toBe('2026-07-07');
  });
  it('handles empty input', () => {
    const result = computeTimelineRange([], 0);
    expect(result.startDate).toBe(todayString());
    expect(result.endDate).toBe(todayString());
  });
});
