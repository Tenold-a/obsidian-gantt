import { h } from 'preact';
import { useRef, useEffect } from 'preact/hooks';
import type { GanttStore } from './store';

// ============================================================
// TimelineGrid — CSS gradient background
// ============================================================

export function TimelineGrid(props: {
  dayWidth: number;
  totalDays: number;
}) {
  const { dayWidth, totalDays } = props;
  const dayPx = dayWidth;
  const weekPx = dayWidth * 7;

  return (
    <div
      class="gantt-timeline-grid"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: `${totalDays * dayWidth}px`,
        height: '100%',
        background: `repeating-linear-gradient(
          to right,
          transparent 0,
          transparent ${dayPx - 1}px,
          var(--gantt-grid-line-day, #e0e0e0) ${dayPx - 1}px,
          var(--gantt-grid-line-day, #e0e0e0) ${dayPx}px
        ), repeating-linear-gradient(
          to right,
          transparent 0,
          transparent ${weekPx - 1}px,
          var(--gantt-grid-line-week, #c0c0c0) ${weekPx - 1}px,
          var(--gantt-grid-line-week, #c0c0c0) ${weekPx}px
        )`,
        pointerEvents: 'none',
      }}
    />
  );
}

// ============================================================
// TimeHeader — month + day labels
// ============================================================

interface HeaderMonth {
  displayText: string;
  startIdx: number;
  dayCount: number;
}

export function TimeHeader(props: {
  startDate: string;
  endDate: string;
  dayWidth: number;
}) {
  const { startDate, endDate, dayWidth } = props;

  // Generate month ranges and day indices
  const months = generateMonthRanges(startDate, endDate);
  const totalDays = daysBetweenDates(startDate, endDate) + 1;

  // Generate day labels for the visible range
  const dayLabels: string[] = [];
  for (let i = 0; i < totalDays; i++) {
    dayLabels.push(getDayLabel(addDaysToDate(startDate, i)));
  }

  function generateMonthRanges(start: string, end: string): HeaderMonth[] {
    const results: HeaderMonth[] = [];
    const startD = parseDate(start);
    const endD = parseDate(end);

    let cursor = new Date(Date.UTC(startD.getUTCFullYear(), startD.getUTCMonth(), 1));
    while (cursor <= endD) {
      const y = cursor.getUTCFullYear();
      const m = cursor.getUTCMonth();
      const monthStart = formatDateStr(new Date(Date.UTC(y, m, 1)));
      const monthEnd = formatDateStr(new Date(Date.UTC(y, m + 1, 0)));
      const startIdx = daysBetweenDates(start, monthStart);
      const dayCount = daysBetweenDates(monthStart, monthEnd) + 1;

      results.push({
        displayText: `${MONTH_NAMES[m]} ${y}`,
        startIdx: Math.max(0, startIdx),
        dayCount,
      });

      cursor = new Date(Date.UTC(y, m + 1, 1));
    }
    return results;
  }

  return (
    <div
      class="gantt-time-header"
      style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--background-primary, #fff)' }}
    >
      {/* Month row */}
      <div class="gantt-header-months" style={{ display: 'flex', height: '24px', borderBottom: '1px solid var(--gantt-grid-line-week, #c0c0c0)' }}>
        {months.map(m => (
          <div
            key={m.displayText}
            style={{
              width: `${m.dayCount * dayWidth}px`,
              marginLeft: m.startIdx === 0 ? `${m.startIdx * dayWidth}px` : '0',
              textAlign: 'center',
              fontSize: '12px',
              fontWeight: 'bold',
              lineHeight: '24px',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              borderLeft: '1px solid var(--gantt-grid-line-week, #c0c0c0)',
            }}
          >
            {m.displayText}
          </div>
        ))}
      </div>
      {/* Day row */}
      <div class="gantt-header-days" style={{ display: 'flex', height: '20px', borderBottom: '1px solid var(--gantt-grid-line-day, #e0e0e0)' }}>
        {dayLabels.map((label, i) => (
          <div
            key={i}
            style={{
              width: `${dayWidth}px`,
              textAlign: 'center',
              fontSize: '10px',
              lineHeight: '20px',
              color: 'var(--text-muted, #999)',
            }}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// TodayLine
// ============================================================

export function TodayLine(props: {
  leftPx: number;
  visible: boolean;
}) {
  if (!props.visible) return null;
  return (
    <div
      class="gantt-today-line"
      style={{
        position: 'absolute',
        top: 0,
        left: `${props.leftPx}px`,
        width: '2px',
        height: '100%',
        background: 'var(--gantt-today-color, #ff4444)',
        zIndex: 5,
        pointerEvents: 'none',
      }}
    />
  );
}

// ============================================================
// TaskBar
// ============================================================

export interface TaskBarData {
  id: string;
  title: string;
  left: number;
  width: number;
  color: string;
  isHighlighted: boolean;
  isDimmed: boolean;
  progress: number;
}

export function TaskBar(props: {
  data: TaskBarData;
  rowHeight: number;
  onPointerDown: (e: PointerEvent, taskId: string, edge: 'left' | 'right' | 'body') => void;
  onClick: (taskId: string) => void;
}) {
  const { data, rowHeight } = props;
  const barHeight = rowHeight * 0.6;
  const barTop = (rowHeight - barHeight) / 2;

  return (
    <div
      class={`gantt-task-bar ${data.isHighlighted ? 'highlighted' : ''} ${data.isDimmed ? 'dimmed' : ''}`}
      style={{
        position: 'absolute',
        left: `${data.left}px`,
        top: `${barTop}px`,
        width: `${Math.max(data.width, 4)}px`,
        height: `${barHeight}px`,
        background: data.color,
        borderRadius: '4px',
        opacity: data.isDimmed ? 0.3 : 1,
        cursor: 'grab',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: '4px',
        fontSize: '11px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        color: 'var(--text-on-accent, #fff)',
        zIndex: 2,
        boxShadow: data.isHighlighted
          ? '0 0 0 2px var(--gantt-highlight-border, #4A90D9)'
          : 'none',
        transition: 'opacity 0.15s, box-shadow 0.15s',
      }}
      onPointerDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        // Detect edge hit (6px dead zone)
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const relX = e.clientX - rect.left;
        const edge = relX < 6 ? 'left' : relX > rect.width - 6 ? 'right' : 'body';
        props.onPointerDown(e as unknown as PointerEvent, data.id, edge);
      }}
      onClick={(e) => {
        e.stopPropagation();
        props.onClick(data.id);
      }}
      title={`${data.title}`}
    >
      {data.width > 40 ? data.title : ''}
    </div>
  );
}

// ============================================================
// TaskRow — a single row in the task list or timeline
// ============================================================

export function TaskRow(props: {
  label: string;
  rowHeight: number;
  index: number;
  isDimmed: boolean;
  isHighlighted: boolean;
  children?: any;
  onClick?: () => void;
  onPointerOver?: (e: PointerEvent) => void;
  style?: Record<string, string>;
}) {
  const { label, rowHeight, index, isDimmed, isHighlighted } = props;

  return (
    <div
      class={`gantt-row ${isDimmed ? 'dimmed' : ''} ${isHighlighted ? 'highlighted' : ''}`}
      style={{
        position: 'relative',
        height: `${rowHeight}px`,
        lineHeight: `${rowHeight}px`,
        borderBottom: '1px solid var(--gantt-grid-line-day, #e0e0e0)',
        opacity: isDimmed ? 0.4 : 1,
        transition: 'opacity 0.15s',
        background: isHighlighted ? 'var(--gantt-row-highlight-bg, rgba(74, 144, 217, 0.08))' : 'transparent',
      }}
      onClick={props.onClick}
    >
      {props.children}
    </div>
  );
}

// ============================================================
// Helpers (inlined to avoid extra imports for now)
// ============================================================

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function parseDate(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
}

function formatDateStr(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function daysBetweenDates(a: string, b: string): number {
  const da = parseDate(a);
  const db = parseDate(b);
  return Math.round((db.getTime() - da.getTime()) / 86400000);
}

function addDaysToDate(date: string, days: number): string {
  const d = parseDate(date);
  const r = new Date(d.getTime() + days * 86400000);
  return formatDateStr(r);
}

function getDayLabel(date: string): string {
  const d = parseDate(date);
  return String(d.getUTCDate());
}

export function isTodayDate(date: string): boolean {
  const today = formatDateStr(new Date());
  return date === today;
}
