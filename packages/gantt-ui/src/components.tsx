import { h } from 'preact';
import { useRef, useEffect } from 'preact/hooks';
import type { GanttStore } from './store';

// ============================================================
// TimelineGrid — dynamically positioned to cover visible viewport
// ============================================================

export function TimelineGrid(props: {
  dayWidth: number;
  /** Pixel offset from timeline body left edge (same as scrollLeft). */
  scrollLeft: number;
  /** Visible width of the timeline container in pixels. */
  viewportWidth: number;
  /** Buffer pixels on each side to avoid gaps during fast scroll. */
  bufferPx: number;
  /** Body origin offset in absolute pixels. */
  bodyOriginPx: number;
}) {
  const { dayWidth, scrollLeft, viewportWidth, bufferPx, bodyOriginPx } = props;
  const dayPx = dayWidth;
  const weekPx = dayWidth * 7;

  // Align grid to day boundary from body origin
  const absLeft = bodyOriginPx + scrollLeft;
  const absAlignedLeft = Math.floor((absLeft - bufferPx) / dayPx) * dayPx;
  const left = absAlignedLeft - bodyOriginPx;
  const width = viewportWidth + 2 * bufferPx;

  return (
    <div
      class="gantt-timeline-grid"
      style={{
        position: 'absolute',
        top: 0,
        left: `${left}px`,
        width: `${width}px`,
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
// Fixed timeline origin — the absolute zero-date reference
// ============================================================

/** Fixed timeline origin: all absolute pixel positions are computed from this date. */
export const TIMELINE_ORIGIN = '2000-01-01';

/**
 * Convert a date string to its absolute pixel position relative to TIMELINE_ORIGIN.
 */
export function dateToAbsolutePixel(date: string, dayWidth: number): number {
  const days = daysBetweenDates(TIMELINE_ORIGIN, date);
  return days * dayWidth;
}

/**
 * Convert an absolute pixel position back to a date string.
 */
export function absolutePixelToDate(absPx: number, dayWidth: number): string {
  const days = Math.floor(absPx / dayWidth);
  return addDaysToDate(TIMELINE_ORIGIN, days);
}

// ============================================================
// TimeHeader — dynamically rendered for the visible viewport
// ============================================================

interface MonthColumn {
  displayText: string;
  leftPx: number;
  widthPx: number;
}

export function TimeHeader(props: {
  dayWidth: number;
  scrollLeft: number;
  viewportWidth: number;
  /** Buffer in pixels — must match TimelineGrid's bufferPx for alignment. */
  bufferPx: number;
  bodyOriginPx: number;
}) {
  const { dayWidth, scrollLeft, viewportWidth, bufferPx, bodyOriginPx } = props;

  // Align rangeStart to the SAME absolute pixel boundary as TimelineGrid
  const visibleStartAbsPx = bodyOriginPx + scrollLeft;
  const absAlignedLeft = Math.floor((visibleStartAbsPx - bufferPx) / dayWidth) * dayWidth;
  const rangeStart = absolutePixelToDate(absAlignedLeft, dayWidth);

  // End of range: ensure we cover viewport + 2*bufferPx, plus one extra day for safety
  const rangeEndAbsPx = absAlignedLeft + viewportWidth + 2 * bufferPx;
  const rangeEnd = absolutePixelToDate(rangeEndAbsPx + dayWidth, dayWidth);

  const rangeTotalDays = daysBetweenDates(rangeStart, rangeEnd) + 1;
  const rangeWidth = rangeTotalDays * dayWidth;

  // Month columns positioned relative to rangeStart in body coordinates
  const monthColumns = buildMonthColumns(rangeStart, rangeEnd, dayWidth);
  // Body-relative pixel of rangeStart — should equal grid's `left` value
  const rangeStartBodyPx = absAlignedLeft - bodyOriginPx;

  return (
    <div
      class="gantt-time-header"
      style={{
        height: '44px',
        background: 'var(--background-primary, #fff)',
        borderBottom: '1px solid var(--gantt-grid-line-day, #e0e0e0)',
      }}
    >
      <div style={{ transform: `translateX(${rangeStartBodyPx - scrollLeft}px)` }}>
        {/* Month row */}
        <div
          class="gantt-header-months"
          style={{
            position: 'relative',
            height: '24px',
            borderBottom: '1px solid var(--gantt-grid-line-week, #c0c0c0)',
            width: `${rangeWidth}px`,
          }}
        >
          {monthColumns.map((mc) => (
            <div
              key={mc.displayText}
              style={{
                position: 'absolute',
                left: `${mc.leftPx}px`,
                width: `${mc.widthPx}px`,
                textAlign: 'center',
                fontSize: '12px',
                fontWeight: 'bold',
                lineHeight: '24px',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                borderLeft: '1px solid var(--gantt-grid-line-week, #c0c0c0)',
              }}
            >
              {mc.displayText}
            </div>
          ))}
        </div>

        {/* Day row — every day has a label */}
        <div
          class="gantt-header-days"
          style={{
            position: 'relative',
            height: '20px',
            borderBottom: '1px solid var(--gantt-grid-line-day, #e0e0e0)',
            width: `${rangeWidth}px`,
          }}
        >
          {Array.from({ length: rangeTotalDays }, (_, i) => {
            const date = addDaysToDate(rangeStart, i);
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: `${i * dayWidth}px`,
                  width: `${dayWidth}px`,
                  textAlign: 'center',
                  fontSize: '10px',
                  lineHeight: '20px',
                  color: 'var(--text-muted, #999)',
                }}
              >
                {getDayLabel(date)}
              </div>
            );
          })}
        </div>
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
  rowIndex: number;
  groupStartY: number;
  laneIndex: number;
  rowHeight: number;
  laneOffset: number;
  paneType: 'person' | 'project';
  onPointerDown: (e: PointerEvent, taskId: string, edge: 'left' | 'right' | 'body', paneType: 'person' | 'project') => void;
  onClick: (taskId: string) => void;
}) {
  const { data, groupStartY, laneIndex, rowHeight, laneOffset, paneType } = props;
  const barHeight = rowHeight * 0.6;
  const barTop = groupStartY + (rowHeight - barHeight) / 2 + laneIndex * laneOffset;

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
        zIndex: 2 + props.laneIndex,
        boxShadow: data.isHighlighted
          ? '0 0 0 2px var(--gantt-highlight-border, #4A90D9)'
          : 'none',
        transition: 'opacity 0.15s, box-shadow 0.15s',
      }}
      onPointerDown={(e) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const relX = e.clientX - rect.left;
        const edge = relX < 6 ? 'left' : relX > rect.width - 6 ? 'right' : 'body';
        props.onPointerDown(e, data.id, edge, paneType);
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

interface MonthColumn {
  displayText: string;
  leftPx: number;
  widthPx: number;
}

function buildMonthColumns(startDate: string, endDate: string, dayWidth: number): MonthColumn[] {
  const results: MonthColumn[] = [];
  const startD = parseDate(startDate);
  const endD = parseDate(endDate);

  // Walk month by month from startDate to endDate
  let cursor = new Date(Date.UTC(startD.getUTCFullYear(), startD.getUTCMonth(), 1));
  while (cursor <= endD) {
    const y = cursor.getUTCFullYear();
    const m = cursor.getUTCMonth();
    const monthStart = formatDateStr(new Date(Date.UTC(y, m, 1)));
    const monthEnd = formatDateStr(new Date(Date.UTC(y, m + 1, 0)));

    // Days from timeline start to this month start
    const offsetDays = daysBetweenDates(startDate, monthStart);
    // How many days of this month are within the visible range
    const visibleStart = offsetDays < 0 ? startDate : monthStart;
    const visibleStartDays = daysBetweenDates(startDate, visibleStart);
    const dayCount = daysBetweenDates(monthStart, monthEnd) + 1;

    // Clamp: the first visible day of this month, and how many days shown
    const firstDay = Math.max(0, visibleStartDays);
    const lastDay = Math.min(daysBetweenDates(startDate, endDate), offsetDays + dayCount - 1);
    const actualDayCount = lastDay - firstDay + 1;

    if (actualDayCount > 0) {
      results.push({
        displayText: `${MONTH_NAMES[m]} ${y}`,
        leftPx: firstDay * dayWidth,
        widthPx: actualDayCount * dayWidth,
      });
    }

    cursor = new Date(Date.UTC(y, m + 1, 1));
  }

  return results;
}

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

// ============================================================
// KeyDateMarker
// ============================================================

export function KeyDateMarker(props: {
  leftPx: number;
  groupTopY: number;
  name: string;
  date: string;
  color?: string;
  icon?: string;
}) {
  const size = 10;
  const bg = props.color ?? 'var(--gantt-key-date-color, #E5C07B)';
  return (
    <div
      class="gantt-key-date-marker"
      title={`${props.name}: ${props.date}`}
      style={{
        position: 'absolute',
        left: `${props.leftPx - size / 2}px`,
        top: `${props.groupTopY + 3}px`,
        width: `${size}px`,
        height: `${size}px`,
        background: bg,
        transform: 'rotate(45deg)',
        zIndex: 3,
        pointerEvents: 'auto',
        cursor: 'help',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {props.icon && (
        <span style={{
          transform: 'rotate(-45deg)',
          fontSize: '7px',
          color: '#fff',
          lineHeight: 1,
          fontWeight: 'bold',
          pointerEvents: 'none',
        }}>
          {props.icon}
        </span>
      )}
    </div>
  );
}
