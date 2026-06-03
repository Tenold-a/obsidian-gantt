import { h } from 'preact';
import { useRef, useEffect } from 'preact/hooks';
import type { GanttStore } from './store';
import type { HolidayConfig, NonWorkingBlock } from '@obsidian-gantt/core';
import { getDayOfWeek, isNonWorkingDay, getDateLabelType, getNonWorkingBlocks, daysBetween, addDays } from '@obsidian-gantt/core';
import { Icon, isLucideIcon } from './icon';

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
  /** Optional holiday config for weekend/holiday column shading. */
  holidayConfig?: HolidayConfig;
}) {
  const { dayWidth, scrollLeft, viewportWidth, bufferPx, bodyOriginPx, holidayConfig } = props;
  const dayPx = dayWidth;
  const weekPx = dayWidth * 7;

  // Align grid to day boundary from body origin
  const absLeft = bodyOriginPx + scrollLeft;
  const absAlignedLeft = Math.floor((absLeft - bufferPx) / dayPx) * dayPx;
  const left = absAlignedLeft - bodyOriginPx;
  const width = viewportWidth + 2 * bufferPx;

  // Build background layers
  const layers: string[] = [
    // Day lines
    `repeating-linear-gradient(
      to right,
      transparent 0,
      transparent ${dayPx - 1}px,
      var(--gantt-grid-line-day, #e0e0e0) ${dayPx - 1}px,
      var(--gantt-grid-line-day, #e0e0e0) ${dayPx}px
    )`,
    // Week lines
    `repeating-linear-gradient(
      to right,
      transparent 0,
      transparent ${weekPx - 1}px,
      var(--gantt-grid-line-week, #c0c0c0) ${weekPx - 1}px,
      var(--gantt-grid-line-week, #c0c0c0) ${weekPx}px
    )`,
  ];

  // Non-working day shading: hard-stop gradient for weekends + holidays
  if (holidayConfig && (holidayConfig.weekendsEnabled || holidayConfig.holidaysEnabled)) {
    const gridStartDate = absolutePixelToDate(absAlignedLeft, dayWidth);
    const totalDays = Math.ceil(width / dayPx) + 2;
    const stops: string[] = [];
    let inNWD = false;

    for (let i = 0; i <= totalDays; i++) {
      const date = addDaysToDate(gridStartDate, i);
      const isNWD = isNonWorkingDay(date, holidayConfig);
      const px = i * dayPx;
      if (isNWD && !inNWD) {
        // Entering non-working: hard stop from transparent to shaded
        stops.push(`transparent ${px}px`);
        stops.push(`var(--gantt-weekend-bg, rgba(0,0,0,0.06)) ${px}px`);
        inNWD = true;
      } else if (!isNWD && inNWD) {
        // Leaving non-working: hard stop from shaded to transparent
        stops.push(`var(--gantt-weekend-bg, rgba(0,0,0,0.06)) ${px}px`);
        stops.push(`transparent ${px}px`);
        inNWD = false;
      }
    }
    if (inNWD) {
      const endPx = (totalDays + 1) * dayPx;
      stops.push(`var(--gantt-weekend-bg, rgba(0,0,0,0.06)) ${endPx}px`);
      stops.push(`transparent ${endPx}px`);
    }

    if (stops.length > 0) {
      layers.push(`linear-gradient(to right, ${stops.join(', ')})`);
    }
  }

  return (
    <div
      class="gantt-timeline-grid"
      style={{
        position: 'absolute',
        top: 0,
        left: `${left}px`,
        width: `${width}px`,
        height: '100%',
        background: layers.join(', '),
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
  /** Optional holiday config for non-working day label styling. */
  holidayConfig?: HolidayConfig;
}) {
  const { dayWidth, scrollLeft, viewportWidth, bufferPx, bodyOriginPx, holidayConfig } = props;

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
            let labelColor = 'var(--text-muted, #999)';
            let indicator = '';
            let indicatorColor = '';
            if (holidayConfig) {
              const labelType = getDateLabelType(date, holidayConfig);
              if (labelType === 'holiday') {
                labelColor = 'var(--gantt-holiday-text, #c62828)';
                indicator = '休';
                indicatorColor = 'var(--gantt-holiday-text, #c62828)';
              } else if (labelType === 'makeup') {
                labelColor = 'var(--text-normal, #333)';
                indicator = '班';
                indicatorColor = 'var(--gantt-makeup-text, #1565c0)';
              } else if (labelType === 'weekend') {
                labelColor = 'var(--gantt-weekend-text, var(--text-faint))';
              }
            }
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
                  color: labelColor,
                }}
              >
                {getDayLabel(date)}
                {indicator && (
                  <span style={{
                    fontSize: '7px',
                    color: indicatorColor,
                    marginLeft: '1px',
                    verticalAlign: 'super',
                    lineHeight: 1,
                  }}>{indicator}</span>
                )}
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
  isSelected: boolean;
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
  /** Task start date for non-working day overlay computation. */
  startDate?: string | null;
  /** Task end date for non-working day overlay computation. */
  endDate?: string | null;
  /** Body origin offset for pixel conversion. */
  bodyOriginPx?: number;
  /** Day width for pixel conversion. */
  dayWidth?: number;
  /** Holiday config for non-working day overlay rendering. */
  holidayConfig?: HolidayConfig;
}) {
  const { data, groupStartY, laneIndex, rowHeight, laneOffset, paneType,
    startDate, endDate, bodyOriginPx, dayWidth, holidayConfig } = props;
  const barHeight = rowHeight * 0.6;
  const barTop = groupStartY + (rowHeight - barHeight) / 2 + laneIndex * laneOffset;
  const barWidth = Math.max(data.width, 4);
  const showHandles = barWidth >= 12;

  // Inject pulse animation keyframes once for selected task bar glow
  const injectedRef = useRef(false);
  useEffect(() => {
    if (injectedRef.current) return;
    injectedRef.current = true;
    const style = document.createElement('style');
    style.textContent = `
      @keyframes gantt-selected-pulse {
        0%, 100% { box-shadow: 0 0 0 3px var(--gantt-selected-border, #FF6B35), 0 0 10px rgba(255, 107, 53, 0.3); }
        50% { box-shadow: 0 0 0 4px var(--gantt-selected-border, #FF6B35), 0 0 24px rgba(255, 107, 53, 0.6); }
      }
    `;
    document.head.appendChild(style);
  }, []);

  // Compute non-working day overlays
  let overlays: { left: number; width: number }[] = [];
  if (startDate && endDate && bodyOriginPx !== undefined && dayWidth && holidayConfig) {
    const blocks = getNonWorkingBlocks(startDate, endDate, holidayConfig);
    overlays = blocks.map(block => {
      const blockLeft = dateToAbsolutePixel(block.start, dayWidth) - bodyOriginPx;
      const blockRight = dateToAbsolutePixel(block.end, dayWidth) - bodyOriginPx + dayWidth;
      return {
        left: blockLeft - data.left,
        width: blockRight - blockLeft,
      };
    });
  }

  return (
    <div
      class={`gantt-task-bar ${data.isSelected ? 'selected' : ''} ${data.isHighlighted ? 'highlighted' : ''} ${data.isDimmed ? 'dimmed' : ''}`}
      style={{
        position: 'absolute',
        left: `${data.left}px`,
        top: `${barTop}px`,
        width: `${barWidth}px`,
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
        zIndex: data.isSelected ? 1000 : 2 + props.laneIndex,
        animation: data.isSelected ? 'gantt-selected-pulse 1.4s ease-in-out infinite' : 'none',
        boxShadow: data.isSelected
          ? 'none'
          : data.isHighlighted
            ? '0 0 0 2px var(--gantt-highlight-border, #4A90D9)'
            : 'none',
        transition: data.isSelected ? 'none' : 'opacity 0.15s, box-shadow 0.15s',
      }}
      onPointerDown={(e) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const relX = e.clientX - rect.left;
        const edge = relX < 8 ? 'left' : relX > rect.width - 8 ? 'right' : 'body';
        props.onPointerDown(e, data.id, edge, paneType);
      }}
      onPointerMove={(e) => {
        if (showHandles) {
          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
          const relX = e.clientX - rect.left;
          const isNearEdge = relX < 8 || relX > rect.width - 8;
          (e.currentTarget as HTMLElement).style.cursor = isNearEdge ? 'ew-resize' : 'grab';
        }
      }}
      onPointerLeave={(e) => {
        (e.currentTarget as HTMLElement).style.cursor = '';
      }}
      onClick={(e) => {
        e.stopPropagation();
        props.onClick(data.id);
      }}
      title={`${data.title}`}
    >
      {/* Non-working day overlays */}
      {overlays.map((ol, i) => (
        <div
          key={`nw-${i}`}
          style={{
            position: 'absolute',
            left: `${ol.left}px`,
            top: 0,
            width: `${Math.max(ol.width, 0)}px`,
            height: '100%',
            background: `repeating-linear-gradient(
              -45deg,
              transparent 0,
              transparent 3px,
              var(--gantt-bar-holiday-stripe, rgba(255,255,255,0.35)) 3px,
              var(--gantt-bar-holiday-stripe, rgba(255,255,255,0.35)) 6px
            )`,
            pointerEvents: 'none',
            zIndex: 1,
            borderRadius: 'inherit',
          }}
        />
      ))}
      {showHandles && <span class="gantt-bar-handle gantt-bar-handle-left" />}
      {data.width > 40 ? data.title : ''}
      {showHandles && <span class="gantt-bar-handle gantt-bar-handle-right" />}
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
  isSelected: boolean;
  children?: any;
  onClick?: () => void;
  onPointerOver?: (e: PointerEvent) => void;
  style?: Record<string, string>;
}) {
  const { label, rowHeight, index, isDimmed, isHighlighted, isSelected } = props;

  return (
    <div
      class={`gantt-row ${isSelected ? 'selected' : ''} ${isDimmed ? 'dimmed' : ''} ${isHighlighted ? 'highlighted' : ''}`}
      style={{
        position: 'relative',
        height: `${rowHeight}px`,
        lineHeight: `${rowHeight}px`,
        borderBottom: '1px solid var(--gantt-grid-line-day, #e0e0e0)',
        opacity: isDimmed ? 0.4 : 1,
        transition: 'opacity 0.15s',
        background: isSelected ? 'var(--gantt-selected-row-bg, rgba(255, 107, 53, 0.12))'
          : isHighlighted ? 'var(--gantt-row-highlight-bg, rgba(74, 144, 217, 0.08))'
          : 'transparent',
        outline: isSelected ? '2px solid var(--gantt-selected-border, #FF6B35)' : 'none',
        outlineOffset: '-2px',
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
  if (!s || typeof s !== 'string') return new Date(NaN);
  const parts = s.split('-');
  if (parts.length !== 3) return new Date(NaN);
  const [y, m, d] = parts.map(Number);
  if (isNaN(y) || isNaN(m) || isNaN(d)) return new Date(NaN);
  if (m < 1 || m > 12 || d < 1 || d > 31) return new Date(NaN);
  return new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
}

function formatDateStr(d: Date): string {
  if (isNaN(d.getTime())) return '';
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function daysBetweenDates(a: string, b: string): number {
  return daysBetween(a, b);
}

function addDaysToDate(date: string, days: number): string {
  return addDays(date, days);
}

function getDayLabel(date: string): string {
  const d = parseDate(date);
  if (isNaN(d.getTime())) return '';
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
  onPointerDown?: (e: PointerEvent) => void;
}) {
  const size = 16;
  const bg = props.color ?? 'var(--gantt-key-date-color, #E5C07B)';
  return (
    <div
      class="gantt-key-date-marker"
      title={`${props.name}: ${props.date}`}
      onPointerDown={props.onPointerDown}
      style={{
        position: 'absolute',
        left: `${props.leftPx - size / 2}px`,
        top: `${props.groupTopY + 1}px`,
        width: `${size}px`,
        height: `${size}px`,
        background: bg,
        transform: 'rotate(45deg)',
        zIndex: 3,
        pointerEvents: 'auto',
        cursor: props.onPointerDown ? 'ew-resize' : 'help',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {props.icon && isLucideIcon(props.icon) ? (
        <span style={{
          transform: 'rotate(-45deg)',
          color: '#fff',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Icon name={props.icon} size={10} />
        </span>
      ) : props.icon ? (
        <span style={{
          transform: 'rotate(-45deg)',
          fontSize: '10px',
          color: '#fff',
          lineHeight: 1,
          fontWeight: 'bold',
          pointerEvents: 'none',
        }}>
          {props.icon}
        </span>
      ) : null}
    </div>
  );
}
