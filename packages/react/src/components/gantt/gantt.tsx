import { useEffect, useMemo, useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';

import { cn } from '../../utils';

import {
  TooltipRoot,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../tooltip';

export type GanttItem = {
  id: string;
  name: string;
  startAt: Date;
  endAt: Date;
  /** Any CSS colour. Falls back to the theme's primary. */
  color?: string;
  /** Replaces the label inside the bar. */
  content?: ReactNode;
};

export type GanttRow = {
  id: string;
  label: ReactNode;
  items: GanttItem[];
};

/** A labelled vertical line — a release date, a deadline. */
export type GanttMarker = {
  id: string;
  date: Date;
  label: string;
  color?: string;
};

export type GanttUnit = 'day' | 'week' | 'month';

export type GanttProps = {
  rows: GanttRow[];
  markers?: GanttMarker[];
  from?: Date;
  to?: Date;
  unit?: GanttUnit;
  /** Percentage applied to the unit's natural column width. */
  zoom?: number;
  labelWidth?: number;
  /**
   * Height of a lane holding a single bar. Lanes with overlapping tasks grow
   * past it, because the bars are stacked rather than drawn on top of one
   * another.
   */
  rowHeight?: number;
  /**
   * Any CSS height. Without it the chart grows to fit and the page scrolls,
   * which leaves the ruler behind — sticky only works inside a scroll box.
   */
  maxHeight?: number | string;
  /** Column header for the sidebar. */
  sidebarTitle?: ReactNode;
  onItemClick?: (item: GanttItem, row: GanttRow) => void;
  onRowClick?: (row: GanttRow) => void;
  /** Scroll so today is in view on mount. */
  scrollToToday?: boolean;
  locale?: string;
  className?: string;
};

const DAY_MS = 86_400_000;

/** Shared so the default doesn't hand the chart a new array on every render. */
const NO_MARKERS: GanttMarker[] = [];

/** Height of the two-tier ruler, in px. Referenced by the overlays below it. */
const RULER_HEIGHT = 52;

/** A bar never gets thinner than this, so it stays visible and clickable. */
const MIN_BAR_WIDTH = 12;
/** Below this there isn't room for a label inside the bar. */
const LABEL_INSIDE_MIN = 56;
/** Room needed after a bar before its label may sit outside it. */
const LABEL_OUTSIDE_MIN = 44;

/** Bar height when a lane holds one bar, and when it has to stack them. */
const BAR_HEIGHT = 28;
const STACKED_BAR_HEIGHT = 22;
const STACK_GAP = 6;

/**
 * Natural pixels-per-day before `zoom`.
 *
 * Week and month used to be 10 and 4, which put a whole task inside a dozen
 * pixels — every bar hit `MIN_BAR_WIDTH` and a two-day job looked the same as
 * a two-week one. These give a week column ~112px and a month ~180px, wide
 * enough for the bars to keep their proportions and for labels to land.
 */
const DAY_WIDTH: Record<GanttUnit, number> = {
  day: 40,
  week: 16,
  month: 6,
};

type Tier = 'day' | 'week' | 'month' | 'year';

/**
 * The coarse row above the ruler's own unit. Month zoom gets years — labelling
 * months twice, once per tier, is what made that view unreadable.
 */
const TOP_TIER: Record<GanttUnit, Tier> = {
  day: 'month',
  week: 'month',
  month: 'year',
};

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const addDays = (date: Date, days: number) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);

const daysBetween = (a: Date, b: Date) =>
  Math.round((startOfDay(b).getTime() - startOfDay(a).getTime()) / DAY_MS);

const isWeekend = (date: Date) => [0, 6].includes(date.getDay());

type Segment = {
  key: string;
  label: string;
  days: number;
  offset: number;
  date: Date;
};

/**
 * Splits the range into ruler columns. Month, week and year segments have
 * uneven day counts at the edges, so each carries its own span instead of
 * assuming a fixed width — that is what keeps a February and a March column
 * aligned with the days beneath them.
 */
const buildSegments = (
  from: Date,
  totalDays: number,
  tier: Tier,
  locale: string,
): Segment[] => {
  const segments: Segment[] = [];
  let offset = 0;

  while (offset < totalDays) {
    const start = addDays(from, offset);
    let days: number;
    let label: string;

    if (tier === 'day') {
      days = 1;
      label = String(start.getDate());
    } else if (tier === 'week') {
      // Weeks start on Monday; the first is short when `from` isn't one.
      days = 7 - ((start.getDay() + 6) % 7);
      label = `${start.getDate()}/${start.getMonth() + 1}`;
    } else if (tier === 'month') {
      days =
        daysBetween(
          start,
          new Date(start.getFullYear(), start.getMonth() + 1, 0),
        ) + 1;
      label = start.toLocaleDateString(locale, { month: 'short' });
    } else {
      days = daysBetween(start, new Date(start.getFullYear() + 1, 0, 0)) + 1;
      label = String(start.getFullYear());
    }

    days = Math.min(days, totalDays - offset);
    segments.push({
      key: start.toISOString(),
      label,
      days,
      offset,
      date: start,
    });
    offset += days;
  }

  return segments;
};

/** The coarse tier spells the month out; the fine one abbreviates it. */
const topTierLabel = (
  segment: Segment,
  tier: Tier,
  index: number,
  locale: string,
) => {
  if (tier === 'year') return segment.label;

  return segment.date.toLocaleDateString(locale, {
    month: 'long',
    // The year is only news at the start of the chart and each January.
    ...(index === 0 || segment.date.getMonth() === 0
      ? { year: 'numeric' }
      : {}),
  });
};

const SHORT_DATE: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  month: 'numeric',
};

const formatSpan = (start: Date, end: Date, locale: string) => {
  const from = start.toLocaleDateString(locale, SHORT_DATE);
  const to = end.toLocaleDateString(locale, SHORT_DATE);
  return from === to ? from : `${from} – ${to}`;
};

const formatRange = (item: GanttItem, locale: string) =>
  formatSpan(item.startAt, item.endAt, locale);

/**
 * The lane's overall span, not its first item's — a lane holds several tasks
 * and the sidebar has to describe all of them.
 */
const rowSpan = (row: GanttRow, locale: string) => {
  if (!row.items.length) return '—';

  const starts = row.items.map((item) => item.startAt.getTime());
  const ends = row.items.map((item) => item.endAt.getTime());

  return formatSpan(
    new Date(Math.min(...starts)),
    new Date(Math.max(...ends)),
    locale,
  );
};

type PlacedItem = {
  item: GanttItem;
  /** Days from the chart's start. */
  offset: number;
  span: number;
  /** Which stacked bar within the lane. */
  stack: number;
  /** Start of the next task sharing this stack, in days from the chart start. */
  nextOffset: number | null;
};

type RowLayout = {
  row: GanttRow;
  items: PlacedItem[];
  stacks: number;
  height: number;
  barHeight: number;
};

/**
 * Assigns each task the first stack whose previous task has already finished —
 * plain interval partitioning. Two tasks on the same day used to be drawn on
 * top of each other, which at week and month zoom turned a lane into a pile of
 * unreadable blobs.
 */
const layoutRow = (
  row: GanttRow,
  start: Date,
  rowHeight: number,
): RowLayout => {
  const sorted = row.items.toSorted(
    (a, b) => a.startAt.getTime() - b.startAt.getTime(),
  );
  const stackEnds: number[] = [];

  const placed = sorted.map((item) => {
    const offset = daysBetween(start, item.startAt);
    const span = Math.max(1, daysBetween(item.startAt, item.endAt) + 1);

    let stack = stackEnds.findIndex((end) => end <= offset);

    if (stack === -1) {
      stack = stackEnds.length;
      stackEnds.push(0);
    }

    stackEnds[stack] = offset + span;

    return { item, offset, span, stack, nextOffset: null as number | null };
  });

  // A bar only competes for label space with the next bar in its own stack.
  placed.forEach((entry, index) => {
    const next = placed
      .slice(index + 1)
      .find((candidate) => candidate.stack === entry.stack);

    entry.nextOffset = next ? next.offset : null;
  });

  const stacks = Math.max(1, stackEnds.length);
  const barHeight = stacks === 1 ? BAR_HEIGHT : STACKED_BAR_HEIGHT;

  return {
    row,
    items: placed,
    stacks,
    barHeight,
    height:
      stacks === 1 ? rowHeight : stacks * (barHeight + STACK_GAP) + STACK_GAP,
  };
};

/**
 * Timeline chart: one lane per row, bars positioned by date.
 *
 * ```tsx
 * <Gantt
 *   unit="day"
 *   rows={rows}
 *   markers={[{ id: 'ship', date: releaseDate, label: 'Bàn giao' }]}
 *   onItemClick={(item) => open(item.id)}
 * />
 * ```
 *
 * Layout runs off one number — pixels per day — so bars, ruler, grid lines,
 * weekend shading and markers all derive from it and can never drift apart.
 * `unit` picks the natural day width and how the two ruler tiers are labelled;
 * `zoom` scales it.
 *
 * The chart renders and reads a timeline. It does not drag bars to reschedule.
 */
export const Gantt = ({
  rows,
  markers = NO_MARKERS,
  from,
  to,
  unit = 'day',
  zoom = 100,
  labelWidth = 240,
  rowHeight = 40,
  maxHeight,
  sidebarTitle,
  onItemClick,
  onRowClick,
  scrollToToday = true,
  locale = 'vi-VN',
  className,
}: GanttProps) => {
  const dayWidth = (DAY_WIDTH[unit] * zoom) / 100;

  const { start, totalDays } = useMemo(() => {
    const dates = rows.flatMap((row) =>
      row.items.flatMap((item) => [item.startAt, item.endAt]),
    );

    const min =
      from ??
      (dates.length
        ? new Date(Math.min(...dates.map((date) => date.getTime())))
        : new Date());
    const max =
      to ??
      (dates.length
        ? new Date(Math.max(...dates.map((date) => date.getTime())))
        : new Date());

    const paddedStart = addDays(startOfDay(min), -3);
    const paddedEnd = addDays(startOfDay(max), 3);

    return {
      start: paddedStart,
      totalDays: Math.max(1, daysBetween(paddedStart, paddedEnd) + 1),
    };
  }, [rows, from, to]);

  const segments = useMemo(
    () => buildSegments(start, totalDays, unit, locale),
    [start, totalDays, unit, locale],
  );

  const topTier = TOP_TIER[unit];
  const topSegments = useMemo(
    () => buildSegments(start, totalDays, topTier, locale),
    [start, totalDays, topTier, locale],
  );

  const layout = useMemo(
    () => rows.map((row) => layoutRow(row, start, rowHeight)),
    [rows, start, rowHeight],
  );

  /**
   * Weekend shading, built once for the whole chart rather than per row — a
   * year at day zoom would otherwise be 365 nodes multiplied by every lane.
   */
  const weekends = useMemo(() => {
    if (unit !== 'day') return [];
    return Array.from({ length: totalDays }, (_, index) => index).filter(
      (index) => isWeekend(addDays(start, index)),
    );
  }, [start, totalDays, unit]);

  const gridWidth = totalDays * dayWidth;
  const todayOffset = daysBetween(start, new Date());
  const todayVisible = todayOffset >= 0 && todayOffset < totalDays;

  const scroller = useRef<HTMLDivElement>(null);

  // Open on the part of the timeline that matters. A quarter-viewport of lead-in
  // keeps what just happened visible instead of pinning today to the left edge.
  useEffect(() => {
    if (!scrollToToday || !todayVisible || !scroller.current) return;

    const viewport = scroller.current.clientWidth - labelWidth;
    scroller.current.scrollLeft = Math.max(
      0,
      todayOffset * dayWidth - viewport / 4,
    );
  }, [scrollToToday, todayVisible, todayOffset, dayWidth, labelWidth]);

  const vars = {
    '--gantt-day-width': `${dayWidth}px`,
    '--gantt-row-height': `${rowHeight}px`,
    '--gantt-sidebar-width': `${labelWidth}px`,
  } as CSSProperties;

  return (
    // One provider for the whole chart, so a consumer never has to add one.
    <TooltipProvider delayDuration={120}>
      <div
        data-slot="gantt"
        className={cn(
          'w-full min-w-0 overflow-hidden rounded-md border',
          className,
        )}
        style={vars}
      >
        <div
          ref={scroller}
          className="w-full overflow-auto"
          style={maxHeight ? { maxHeight } : undefined}
        >
          <div
            className="relative flex"
            style={{ width: labelWidth + gridWidth, minWidth: '100%' }}
          >
            {/* Sidebar */}
            <aside
              data-slot="gantt-sidebar"
              className="sticky left-0 z-30 shrink-0 border-r bg-background"
              style={{ width: 'var(--gantt-sidebar-width)' }}
            >
              <div
                className="sticky top-0 z-10 flex items-end gap-2 border-b bg-background/95 px-3 pt-2 pb-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm"
                style={{ height: RULER_HEIGHT }}
              >
                <span className="flex-1 truncate">{sidebarTitle}</span>
              </div>

              {layout.map(({ row, height }) => (
                <button
                  key={row.id}
                  type="button"
                  onClick={() => onRowClick?.(row)}
                  // Height comes from the lane, which grows when its tasks
                  // overlap — the two columns have to stay in step.
                  style={{ height }}
                  className={cn(
                    'flex w-full items-center gap-2 border-b px-3 text-left text-xs last:border-b-0',
                    onRowClick
                      ? 'cursor-pointer hover:bg-muted/50'
                      : 'cursor-default',
                  )}
                >
                  <span
                    aria-hidden
                    className="size-2 shrink-0 rounded-full bg-muted-foreground/40"
                    style={
                      row.items[0]?.color
                        ? { backgroundColor: row.items[0].color }
                        : undefined
                    }
                  />
                  <span className="flex-1 truncate font-medium">
                    {row.label}
                  </span>
                  <span className="shrink-0 tabular-nums text-muted-foreground">
                    {rowSpan(row, locale)}
                  </span>
                </button>
              ))}
            </aside>

            {/* Timeline. Sized to the grid rather than stretched: at month zoom
                a short range is narrower than the viewport, and stretching left
                lane borders running on past the last column. */}
            <div className="relative shrink-0" style={{ width: gridWidth }}>
              {/* Ruler */}
              <div
                data-slot="gantt-header"
                className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur-sm"
                style={{ height: RULER_HEIGHT }}
              >
                <div className="flex">
                  {topSegments.map((segment, index) => (
                    <div
                      key={segment.key}
                      className="shrink-0 truncate border-r border-border/50 px-2 py-1 text-xs font-medium text-muted-foreground"
                      style={{ width: segment.days * dayWidth }}
                    >
                      {/*
                        Deliberately not sticky. Pinning the label to the
                        viewport reads nicely until it meets `overflow-hidden`
                        or the sidebar, where the browser clamps it to the wrong
                        edge. A plain truncated label is always right.
                      */}
                      {topTierLabel(segment, topTier, index, locale)}
                    </div>
                  ))}
                </div>

                <div className="flex">
                  {segments.map((segment) => {
                    const weekend = unit === 'day' && isWeekend(segment.date);

                    return (
                      <div
                        key={segment.key}
                        className={cn(
                          // No horizontal padding: a day column is 40px and
                          // "10 T5" needs all of it.
                          'shrink-0 truncate border-r border-border/50 py-1 text-center text-[11px] tabular-nums',
                          weekend
                            ? 'text-muted-foreground/60'
                            : 'text-muted-foreground',
                        )}
                        style={{ width: segment.days * dayWidth }}
                      >
                        {segment.label}
                        {unit === 'day' && dayWidth >= 32 && (
                          <span className="ml-1 opacity-60">
                            {segment.date.toLocaleDateString(locale, {
                              weekday: 'narrow',
                            })}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Weekend bands and column rules, behind every lane */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0"
                style={{ top: RULER_HEIGHT }}
              >
                {weekends.map((index) => (
                  <div
                    key={index}
                    className="absolute inset-y-0 bg-muted/40"
                    style={{ left: index * dayWidth, width: dayWidth }}
                  />
                ))}

                {/*
                  Without these the lanes are a blank field: at week and month
                  zoom there is no weekend shading to imply the columns, so a
                  bar has nothing to be read against.
                */}
                {segments.map((segment) =>
                  segment.offset === 0 ? null : (
                    <div
                      key={segment.key}
                      className="absolute inset-y-0 w-px bg-border/50"
                      style={{ left: segment.offset * dayWidth }}
                    />
                  ),
                )}

                {topSegments.map((segment) =>
                  segment.offset === 0 ? null : (
                    <div
                      key={segment.key}
                      className="absolute inset-y-0 w-px bg-border"
                      style={{ left: segment.offset * dayWidth }}
                    />
                  ),
                )}
              </div>

              {/* Lanes */}
              {layout.map(({ row, items, height, barHeight, stacks }) => (
                <div
                  key={row.id}
                  data-slot="gantt-row"
                  className="relative border-b last:border-b-0"
                  style={{ height }}
                >
                  {items.map(({ item, offset, span, stack, nextOffset }) => {
                    const barWidth = Math.max(
                      span * dayWidth - 4,
                      MIN_BAR_WIDTH,
                    );
                    const top =
                      stacks === 1
                        ? (height - barHeight) / 2
                        : STACK_GAP + stack * (barHeight + STACK_GAP);

                    const gap =
                      nextOffset === null
                        ? Number.POSITIVE_INFINITY
                        : (nextOffset - (offset + span)) * dayWidth;

                    // At month zoom a task is a few pixels wide. Rather than
                    // clip the name to nothing, move it beside the bar — and
                    // drop it entirely when the neighbour is too close.
                    const labelFitsInside = barWidth >= LABEL_INSIDE_MIN;
                    const labelFitsOutside = gap >= LABEL_OUTSIDE_MIN;
                    const label = item.content ?? item.name;

                    return (
                      <TooltipRoot key={item.id}>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            aria-label={`${item.name}, ${formatRange(item, locale)}`}
                            onClick={() => onItemClick?.(item, row)}
                            style={{
                              left: offset * dayWidth,
                              width: barWidth,
                              top,
                              height: barHeight,
                              backgroundColor: item.color,
                            }}
                            className={cn(
                              'absolute flex items-center overflow-hidden rounded-md text-left text-xs shadow-xs ring-1 ring-black/5',
                              labelFitsInside && 'px-2',
                              // Lift above neighbours on hover so a bar that
                              // sits under another is still reachable.
                              'transition-[filter,box-shadow] hover:z-10 hover:shadow-md hover:brightness-110',
                              'focus-visible:z-10 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring',
                              onItemClick ? 'cursor-pointer' : 'cursor-default',
                              item.color
                                ? 'text-white'
                                : 'bg-primary text-primary-foreground',
                            )}
                          >
                            {labelFitsInside && (
                              <span className="truncate font-medium">
                                {label}
                              </span>
                            )}
                          </button>
                        </TooltipTrigger>

                        <TooltipContent side="top" className="max-w-xs">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-muted-foreground">
                            {formatRange(item, locale)} · {span} ngày
                          </p>
                        </TooltipContent>

                        {!labelFitsInside && labelFitsOutside && (
                          <span
                            // The button already carries the accessible name,
                            // so this repeat stays out of the a11y tree — but
                            // it is clickable, because a 12px bar is a
                            // miserable mouse target at month zoom.
                            aria-hidden
                            onClick={() => onItemClick?.(item, row)}
                            className={cn(
                              'absolute truncate text-xs text-muted-foreground',
                              onItemClick
                                ? 'cursor-pointer hover:text-foreground'
                                : 'pointer-events-none',
                            )}
                            style={{
                              left: offset * dayWidth + barWidth + 6,
                              top,
                              lineHeight: `${barHeight}px`,
                              // The last bar in a stack has no neighbour, so
                              // its gap is Infinity — which React rejects as a
                              // style value.
                              maxWidth: Number.isFinite(gap)
                                ? gap - 10
                                : undefined,
                            }}
                          >
                            {label}
                          </span>
                        )}
                      </TooltipRoot>
                    );
                  })}
                </div>
              ))}

              {/* Markers and today, drawn below the ruler so their flags never
                  cover the month or year labels. */}
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 z-20"
                style={{ top: RULER_HEIGHT }}
              >
                {markers.map((marker) => {
                  const offset = daysBetween(start, marker.date);
                  if (offset < 0 || offset >= totalDays) return null;

                  return (
                    <div
                      key={marker.id}
                      data-slot="gantt-marker"
                      className="absolute inset-y-0"
                      style={{ left: offset * dayWidth }}
                    >
                      <div
                        className="h-full w-px"
                        style={{
                          backgroundColor: marker.color ?? 'var(--primary)',
                        }}
                      />
                      <span
                        className="absolute top-0.5 left-0 rounded-sm px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap text-white"
                        style={{
                          backgroundColor: marker.color ?? 'var(--primary)',
                        }}
                      >
                        {marker.label}
                      </span>
                    </div>
                  );
                })}

                {todayVisible && (
                  <div
                    data-slot="gantt-today"
                    className="absolute inset-y-0"
                    style={{ left: todayOffset * dayWidth }}
                  >
                    <div className="h-full w-px bg-destructive" />
                    <span className="absolute top-0.5 left-0 rounded-sm bg-destructive px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap text-destructive-foreground">
                      {new Date().toLocaleDateString(locale, {
                        day: 'numeric',
                        month: 'numeric',
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
