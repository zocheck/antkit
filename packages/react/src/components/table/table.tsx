import { createElement, Fragment, useMemo, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';

import { cn } from '../../utils';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronRightIcon,
  ChevronsUpDownIcon,
} from 'lucide-react';

import { useConfig } from '../../lib/config';
import { Checkbox } from '../checkbox';
import { Empty } from '../empty';
import { Skeleton } from '../skeleton';
import { Pagination } from '../pagination';
import type { PaginationProps } from '../pagination';
import { useColumnWidths } from './use-column-widths';
import type { ColumnWidths } from './use-column-widths';

export type SortOrder = 'asc' | 'desc' | null;

export type TableSort = {
  key: string;
  order: SortOrder;
};

export type TableScroll = {
  /** Minimum content width before horizontal scrolling begins. */
  x?: number | string;
  /** Maximum viewport height before the body scrolls vertically. */
  y?: number | string;
};

type TableSlot =
  | 'root'
  | 'scrollArea'
  | 'table'
  | 'header'
  | 'headerCell'
  | 'body'
  | 'row'
  | 'cell'
  | 'expandedRow'
  | 'expandedCell';

export type TableClassNames = Partial<Record<TableSlot, string>>;
export type TableStyles = Partial<Record<TableSlot, CSSProperties>>;

export type ColumnType<TRecord> = {
  /** Defaults to `dataIndex`. Required when a column has no `dataIndex`. */
  key?: string;
  title: ReactNode;
  /** Small glyph before the title, the way a field type is shown in a grid. */
  icon?: ReactNode;
  dataIndex?: keyof TRecord & string;
  render?: (
    value: TRecord[keyof TRecord] | undefined,
    record: TRecord,
    index: number,
  ) => ReactNode;
  align?: 'left' | 'center' | 'right';
  /** Pixels. `table-fixed` needs a number to lay the grid out. */
  width?: number;
  /** Pins the column while the table scrolls sideways. */
  fixed?: 'left' | 'right';
  /** Truncate with a `title` tooltip. On by default. */
  ellipsis?: boolean;
  resizable?: boolean;
  /** `true` for a default comparator, or supply your own. */
  sorter?: boolean | ((a: TRecord, b: TRecord) => number);
  /** Header-only styling. `className` remains applied to both header and cells. */
  headerClassName?: string;
  headerStyle?: CSSProperties;
  /** Body-cell-only styling. */
  cellClassName?: string;
  cellStyle?: CSSProperties;
  className?: string;
};

export type RowSelection<TRecord> = {
  selectedRowKeys: string[];
  onChange: (keys: string[], rows: TRecord[]) => void;
  /** Rows that can't be picked — a locked record, say. */
  getCheckboxProps?: (record: TRecord) => { disabled?: boolean };
};

/** Controls the optional detail panel rendered directly below a table row. */
export type TableExpandable<TRecord> = {
  expandedRowRender: (
    record: TRecord,
    index: number,
    indent: number,
    expanded: boolean,
  ) => ReactNode;
  expandedRowKeys?: string[];
  defaultExpandedRowKeys?: string[];
  defaultExpandAllRows?: boolean;
  rowExpandable?: (record: TRecord) => boolean;
  expandRowByClick?: boolean;
  showExpandColumn?: boolean;
  columnTitle?: ReactNode;
  columnWidth?: number;
  /** The expand affordance stays visible while scrolling horizontally. */
  fixed?: boolean | 'left';
  onExpand?: (expanded: boolean, record: TRecord) => void;
  onExpandedRowsChange?: (expandedKeys: string[]) => void;
  expandedRowClassName?:
    | string
    | ((record: TRecord, index: number) => string | undefined);
};

export type TableProps<TRecord> = {
  columns: ColumnType<TRecord>[];
  dataSource: TRecord[];
  rowKey: (keyof TRecord & string) | ((record: TRecord) => string);
  loading?: boolean;
  loadingRows?: number;
  empty?: ReactNode;
  onRowClick?: (record: TRecord, index: number) => void;
  rowClassName?: (record: TRecord, index: number) => string | undefined;
  rowSelection?: RowSelection<TRecord>;
  expandable?: TableExpandable<TRecord>;
  /** Pinned to the right edge, revealed per row. */
  rowActions?: (record: TRecord, index: number) => ReactNode;
  /** Width of the pinned action column. Defaults to 48 pixels. */
  actionsWidth?: number;
  /** Any CSS height. The header sticks while the body scrolls under it. */
  maxHeight?: number | string;
  /** Responsive scroll viewport. `maxHeight` is kept as the backwards-compatible y alias. */
  scroll?: TableScroll;
  /** Header row height. Defaults to 44 pixels. */
  headerHeight?: CSSProperties['height'];
  /** Per-slot class hooks for product-specific table skins. */
  classNames?: TableClassNames;
  /** Per-slot inline style hooks for dynamic product-specific table skins. */
  styles?: TableStyles;
  /** Disable when the parent owns the scroll container. */
  stickyHeader?: boolean;
  /** Controlled sorting, for example when sorting happens on the server. */
  sort?: TableSort;
  defaultSort?: TableSort;
  onSortChange?: (sort: TableSort) => void;
  /** Controlled column widths, suitable for persisting per-user preferences. */
  columnWidths?: ColumnWidths;
  defaultColumnWidths?: ColumnWidths;
  onColumnWidthsChange?: (widths: ColumnWidths) => void;
  minColumnWidth?: number;
  pagination?: PaginationProps | false;
  className?: string;
};

const ALIGN = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
} as const;

const DEFAULT_WIDTH = 150;
const SELECTION_WIDTH = 48;
const DEFAULT_EXPAND_WIDTH = 48;
const DEFAULT_ACTIONS_WIDTH = 48;

const keyOf = <TRecord,>(column: ColumnType<TRecord>, index: number) =>
  column.key ?? column.dataIndex ?? String(index);

const CELL =
  'px-3 align-middle overflow-hidden whitespace-nowrap border-b border-border';

/**
 * Data grid with the pieces an admin table actually needs: a sticky header over
 * a scrolling body, columns pinned left/right, resizing, sorting, row selection,
 * expandable detail rows and a pinned actions column.
 *
 * ```tsx
 * <Table
 *   rowKey="id"
 *   dataSource={rows}
 *   maxHeight="calc(100dvh - 14rem)"
 *   rowSelection={{ selectedRowKeys: selected, onChange: setSelected }}
 *   rowActions={(row) => <RowMenu row={row} />}
 *   columns={[
 *     { title: 'Name', dataIndex: 'name', width: 400, icon: <FileTextIcon />, resizable: true, sorter: true },
 *     { title: 'Date', dataIndex: 'date', width: 150, fixed: 'left' },
 *   ]}
 * />
 * ```
 *
 * Layout is `table-fixed`: columns have stable pixel widths, while the table
 * can still grow to fill a wide container and scroll naturally on narrow ones.
 */
export const Table = <TRecord,>({
  columns,
  dataSource,
  rowKey,
  loading = false,
  loadingRows = 5,
  empty,
  onRowClick,
  rowClassName,
  rowSelection,
  expandable,
  rowActions,
  actionsWidth = DEFAULT_ACTIONS_WIDTH,
  maxHeight,
  scroll,
  headerHeight = 44,
  classNames,
  styles,
  stickyHeader = true,
  sort: controlledSort,
  defaultSort = { key: '', order: null },
  onSortChange,
  columnWidths,
  defaultColumnWidths,
  onColumnWidthsChange,
  minColumnWidth,
  pagination,
  className,
}: TableProps<TRecord>) => {
  const { locale, renderEmpty } = useConfig();
  const getRowKey = (record: TRecord) =>
    typeof rowKey === 'function' ? rowKey(record) : String(record[rowKey]);
  const hasExpandableRows = Boolean(expandable?.expandedRowRender);
  const showExpandColumn =
    hasExpandableRows && expandable?.showExpandColumn !== false;
  const expandWidth = expandable?.columnWidth ?? DEFAULT_EXPAND_WIDTH;
  const expandFixed =
    expandable?.fixed === true || expandable?.fixed === 'left';
  const { widths, startResize } = useColumnWidths({
    value: columnWidths,
    defaultValue: defaultColumnWidths,
    onChange: onColumnWidthsChange,
    minWidth: minColumnWidth,
  });
  const [uncontrolledSort, setUncontrolledSort] =
    useState<TableSort>(defaultSort);
  const [uncontrolledExpandedKeys, setUncontrolledExpandedKeys] = useState<
    string[]
  >(() =>
    expandable?.defaultExpandAllRows
      ? dataSource.map(getRowKey)
      : (expandable?.defaultExpandedRowKeys ?? []),
  );
  const sort = controlledSort ?? uncontrolledSort;
  const expandedKeys = expandable?.expandedRowKeys ?? uncontrolledExpandedKeys;
  const expandedKeySet = new Set(expandedKeys);

  const widthOf = (column: ColumnType<TRecord>, index: number) =>
    widths[keyOf(column, index)] ?? column.width ?? DEFAULT_WIDTH;

  /** Left offset for each pinned-left column, so they stack instead of overlap. */
  const leftOffsets = useMemo(() => {
    const offsets = new Map<string, number>();
    let running = rowSelection ? SELECTION_WIDTH : 0;
    if (showExpandColumn && expandFixed) running += expandWidth;

    columns.forEach((column, index) => {
      if (column.fixed !== 'left') return;
      offsets.set(keyOf(column, index), running);
      running += widthOf(column, index);
    });

    return offsets;
  }, [
    columns,
    expandFixed,
    expandWidth,
    rowSelection,
    showExpandColumn,
    widths,
  ]);

  /** Right offsets are cumulative too; otherwise multiple pinned columns overlap. */
  const rightOffsets = useMemo(() => {
    const offsets = new Map<string, number>();
    let running = rowActions ? actionsWidth : 0;

    for (let index = columns.length - 1; index >= 0; index -= 1) {
      const column = columns[index];
      if (column.fixed !== 'right') continue;
      offsets.set(keyOf(column, index), running);
      running += widthOf(column, index);
    }

    return offsets;
  }, [actionsWidth, columns, rowActions, widths]);

  const totalWidth =
    columns.reduce((sum, column, index) => sum + widthOf(column, index), 0) +
    (rowSelection ? SELECTION_WIDTH : 0) +
    (showExpandColumn ? expandWidth : 0) +
    (rowActions ? actionsWidth : 0);

  const sorted = useMemo(() => {
    if (!sort.order) return dataSource;

    const column = columns.find(
      (entry, index) => keyOf(entry, index) === sort.key,
    );
    if (!column?.sorter) return dataSource;

    const compare =
      typeof column.sorter === 'function'
        ? column.sorter
        : (a: TRecord, b: TRecord) => {
            const left = column.dataIndex ? a[column.dataIndex] : undefined;
            const right = column.dataIndex ? b[column.dataIndex] : undefined;
            return String(left ?? '').localeCompare(String(right ?? ''), 'vi', {
              numeric: true,
            });
          };

    // `toSorted` keeps the caller's array untouched, which matters when the
    // rows come straight from a query cache.
    return dataSource.toSorted((a, b) =>
      sort.order === 'asc' ? compare(a, b) : compare(b, a),
    );
  }, [dataSource, columns, sort]);

  const toggleSort = (key: string) => {
    const next: TableSort =
      sort.key !== key
        ? { key, order: 'asc' }
        : sort.order === 'asc'
          ? { key, order: 'desc' }
          : { key: '', order: null };

    if (controlledSort === undefined) {
      setUncontrolledSort(next);
    }

    onSortChange?.(next);
  };

  const selectableRows = rowSelection
    ? sorted.filter(
        (record) => !rowSelection.getCheckboxProps?.(record)?.disabled,
      )
    : [];
  const selectedKeys = rowSelection?.selectedRowKeys ?? [];
  const selectedKeySet = new Set(selectedKeys);
  const selectableKeySet = new Set(selectableRows.map(getRowKey));
  const allSelected =
    selectableRows.length > 0 &&
    selectableRows.every((record) => selectedKeySet.has(getRowKey(record)));
  const someSelected =
    !allSelected &&
    selectableRows.some((record) => selectedKeySet.has(getRowKey(record)));

  const toggleAll = () => {
    if (!rowSelection) return;
    const next = allSelected
      ? selectedKeys.filter((key) => !selectableKeySet.has(key))
      : [...new Set([...selectedKeys, ...selectableRows.map(getRowKey)])];

    rowSelection.onChange(
      next,
      selectableRows.filter((record) => next.includes(getRowKey(record))),
    );
  };

  const toggleRow = (record: TRecord) => {
    if (!rowSelection) return;
    const id = getRowKey(record);
    const next = selectedKeySet.has(id)
      ? selectedKeys.filter((entry) => entry !== id)
      : [...selectedKeys, id];

    rowSelection.onChange(
      next,
      sorted.filter((row) => next.includes(getRowKey(row))),
    );
  };

  const canExpandRow = (record: TRecord) =>
    hasExpandableRows && (expandable?.rowExpandable?.(record) ?? true);

  const toggleExpand = (record: TRecord) => {
    if (!canExpandRow(record)) return;

    const id = getRowKey(record);
    const expanded = expandedKeySet.has(id);
    const next = expanded
      ? expandedKeys.filter((key) => key !== id)
      : [...expandedKeys, id];

    if (expandable?.expandedRowKeys === undefined) {
      setUncontrolledExpandedKeys(next);
    }

    expandable?.onExpand?.(!expanded, record);
    expandable?.onExpandedRowsChange?.(next);
  };

  const showSkeleton = loading && dataSource.length === 0;
  const columnCount =
    columns.length +
    (rowSelection ? 1 : 0) +
    (showExpandColumn ? 1 : 0) +
    (rowActions ? 1 : 0);
  const scrollHeight = scroll?.y ?? maxHeight;
  // Every column keeps its minimum allocation. `scroll.x` can ask for more
  // room, but can never shrink a wide table and hide columns off-screen.
  const scrollWidth =
    typeof scroll?.x === 'number'
      ? Math.max(totalWidth, scroll.x)
      : (scroll?.x ?? totalWidth);

  const stickyStyle = (
    column: ColumnType<TRecord>,
    index: number,
  ): CSSProperties => {
    const width = widthOf(column, index);
    if (column.fixed === 'left') {
      return { width, left: leftOffsets.get(keyOf(column, index)) ?? 0 };
    }
    if (column.fixed === 'right') {
      return { width, right: rightOffsets.get(keyOf(column, index)) ?? 0 };
    }
    return { width };
  };

  return (
    <div
      className={cn(
        'grid min-w-0 max-w-full gap-4',
        classNames?.root,
        className,
      )}
      style={styles?.root}
    >
      <div
        data-slot="table-scroll-area"
        tabIndex={0}
        className={cn(
          'isolate w-full min-w-0 max-w-full overscroll-contain overflow-x-auto overflow-y-auto rounded-md border [scrollbar-gutter:stable] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-ring',
          classNames?.scrollArea,
        )}
        style={{ ...styles?.scrollArea, maxHeight: scrollHeight }}
      >
        <table
          data-slot="table"
          aria-busy={loading || undefined}
          className={cn(
            'w-full table-fixed border-separate border-spacing-0 text-sm',
            classNames?.table,
          )}
          style={{ ...styles?.table, minWidth: scrollWidth }}
        >
          <colgroup>
            {!!rowSelection && <col style={{ width: SELECTION_WIDTH }} />}
            {showExpandColumn && <col style={{ width: expandWidth }} />}
            {columns.map((column, index) => (
              <col
                key={keyOf(column, index)}
                style={{ width: widthOf(column, index) }}
              />
            ))}
            {!!rowActions && <col style={{ width: actionsWidth }} />}
          </colgroup>

          <thead
            data-slot="table-header"
            className={cn(
              stickyHeader && 'sticky top-0 z-20 bg-muted',
              classNames?.header,
            )}
            style={styles?.header}
          >
            <tr className="bg-muted">
              {!!rowSelection && (
                <th
                  data-slot="table-head"
                  className={cn(
                    CELL,
                    'sticky isolate left-0 z-30 bg-muted text-left',
                    classNames?.headerCell,
                  )}
                  style={{
                    ...styles?.headerCell,
                    width: SELECTION_WIDTH,
                    height: headerHeight,
                  }}
                >
                  <div className="flex items-center justify-center">
                    <Checkbox
                      checked={
                        allSelected
                          ? true
                          : someSelected
                            ? 'indeterminate'
                            : false
                      }
                      disabled={selectableRows.length === 0}
                      onCheckedChange={toggleAll}
                      aria-label={locale.table?.selectAll ?? 'Select all'}
                    />
                  </div>
                </th>
              )}

              {showExpandColumn && (
                <th
                  data-slot="table-head"
                  className={cn(
                    CELL,
                    'text-left',
                    expandFixed && 'sticky isolate z-30 bg-muted',
                    classNames?.headerCell,
                  )}
                  style={{
                    ...styles?.headerCell,
                    width: expandWidth,
                    height: headerHeight,
                    ...(expandFixed
                      ? { left: rowSelection ? SELECTION_WIDTH : 0 }
                      : {}),
                  }}
                >
                  {expandable?.columnTitle}
                </th>
              )}

              {columns.map((column, index) => {
                const key = keyOf(column, index);
                const width = widthOf(column, index);
                const sortable = !!column.sorter;
                const active = sort.key === key ? sort.order : null;

                return (
                  <th
                    key={key}
                    data-slot="table-head"
                    className={cn(
                      CELL,
                      'relative text-left text-[13px] font-semibold text-foreground/80',
                      column.fixed && 'sticky isolate z-30 bg-muted',
                      ALIGN[column.align ?? 'left'],
                      classNames?.headerCell,
                      column.headerClassName,
                      column.className,
                    )}
                    style={{
                      ...styles?.headerCell,
                      ...column.headerStyle,
                      ...stickyStyle(column, index),
                      height: headerHeight,
                    }}
                    aria-sort={
                      active === 'asc'
                        ? 'ascending'
                        : active === 'desc'
                          ? 'descending'
                          : undefined
                    }
                  >
                    <div className="flex select-none items-center justify-between gap-1">
                      {/*
                        Only a sortable header is a button. A plain one stays a
                        `div` so a `title` carrying its own control — a
                        select-all checkbox, say — is not nested inside one.
                      */}
                      {createElement(
                        sortable ? 'button' : 'div',
                        {
                          ...(sortable && {
                            type: 'button' as const,
                            onClick: () => toggleSort(key),
                          }),
                          className: cn(
                            'flex w-full min-w-0 items-center gap-1.5 rounded-md text-xs font-medium transition-colors',
                            'outline-hidden focus-visible:ring-2 focus-visible:ring-ring',
                            sortable &&
                              '-ml-2 h-8 cursor-pointer px-2 hover:bg-accent hover:text-accent-foreground',
                          ),
                        },
                        <>
                          {!!column.icon && (
                            <span className="flex size-3.5 shrink-0 items-center justify-center text-muted-foreground [&>svg]:size-3.5">
                              {column.icon}
                            </span>
                          )}
                          <span className="flex-1 truncate text-left">
                            {column.title}
                          </span>
                          {sortable &&
                            (active === 'asc' ? (
                              <ArrowUpIcon className="size-3 shrink-0" />
                            ) : active === 'desc' ? (
                              <ArrowDownIcon className="size-3 shrink-0" />
                            ) : (
                              <ChevronsUpDownIcon className="size-3 shrink-0 opacity-40" />
                            ))}
                        </>,
                      )}

                      {column.resizable && (
                        <span
                          role="separator"
                          aria-orientation="vertical"
                          aria-label={
                            locale.table?.resizeColumn ?? 'Resize column'
                          }
                          onPointerDown={(event) =>
                            startResize(key, event, width)
                          }
                          className="group/resize absolute right-0 top-0 flex h-full w-2 cursor-col-resize touch-none select-none items-center justify-center"
                        >
                          <span className="h-6 w-px bg-border/60 group-hover/resize:bg-border" />
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}

              {!!rowActions && (
                <th
                  data-slot="table-head"
                  className={cn(
                    CELL,
                    'sticky isolate right-0 z-30 bg-muted',
                    classNames?.headerCell,
                  )}
                  style={{
                    ...styles?.headerCell,
                    width: actionsWidth,
                    height: headerHeight,
                  }}
                />
              )}
            </tr>
          </thead>

          <tbody
            data-slot="table-body"
            className={classNames?.body}
            style={styles?.body}
          >
            {showSkeleton &&
              Array.from({ length: loadingRows }, (_, rowIndex) => (
                <tr key={`skeleton-${rowIndex}`}>
                  {Array.from({ length: columnCount }, (__, cellIndex) => (
                    <td
                      key={cellIndex}
                      className={cn(CELL, 'py-3', classNames?.cell)}
                      style={styles?.cell}
                    >
                      <Skeleton className="h-4 w-full" />
                    </td>
                  ))}
                </tr>
              ))}

            {!showSkeleton && sorted.length === 0 && (
              <tr>
                <td
                  colSpan={columnCount}
                  className={cn(
                    'border-b border-border text-center text-muted-foreground',
                    // `Empty` brings its own padding; a caller's node does not.
                    empty ? 'px-3 py-10' : 'p-0',
                    classNames?.cell,
                  )}
                  style={styles?.cell}
                >
                  {empty ?? renderEmpty?.('table') ?? <Empty />}
                </td>
              </tr>
            )}

            {!showSkeleton &&
              sorted.map((record, rowIndex) => {
                const id = getRowKey(record);
                const selected = selectedKeySet.has(id);
                const checkboxProps = rowSelection?.getCheckboxProps?.(record);
                const expandableRow = canExpandRow(record);
                const expanded = expandedKeySet.has(id);
                const expandedRowClassName =
                  typeof expandable?.expandedRowClassName === 'function'
                    ? expandable.expandedRowClassName(record, rowIndex)
                    : expandable?.expandedRowClassName;

                return (
                  <Fragment key={id}>
                    <tr
                      data-row-id={id}
                      data-state={selected ? 'selected' : undefined}
                      onClick={
                        onRowClick ||
                        (expandable?.expandRowByClick && expandableRow)
                          ? () => {
                              if (expandable?.expandRowByClick)
                                toggleExpand(record);
                              onRowClick?.(record, rowIndex);
                            }
                          : undefined
                      }
                      className={cn(
                        'group transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
                        (onRowClick ||
                          (expandable?.expandRowByClick && expandableRow)) &&
                          'cursor-pointer',
                        classNames?.row,
                        rowClassName?.(record, rowIndex),
                      )}
                      style={styles?.row}
                    >
                      {!!rowSelection && (
                        <td
                          className={cn(
                            CELL,
                            'sticky isolate left-0 z-10 bg-background py-3 group-hover:bg-muted group-data-[state=selected]:bg-muted',
                            classNames?.cell,
                          )}
                          style={{ ...styles?.cell, width: SELECTION_WIDTH }}
                          // Ticking a box must not also fire the row click.
                          onClick={(event) => event.stopPropagation()}
                        >
                          <div className="flex items-center justify-center">
                            <Checkbox
                              checked={selected}
                              disabled={checkboxProps?.disabled}
                              onCheckedChange={() => toggleRow(record)}
                              aria-label={
                                locale.table?.selectRow ?? 'Select row'
                              }
                            />
                          </div>
                        </td>
                      )}

                      {showExpandColumn && (
                        <td
                          className={cn(
                            CELL,
                            'py-3',
                            expandFixed &&
                              'sticky isolate z-10 bg-background group-hover:bg-muted group-data-[state=selected]:bg-muted',
                            classNames?.cell,
                          )}
                          style={{
                            ...styles?.cell,
                            width: expandWidth,
                            ...(expandFixed
                              ? { left: rowSelection ? SELECTION_WIDTH : 0 }
                              : {}),
                          }}
                          onClick={(event) => event.stopPropagation()}
                        >
                          <div className="flex items-center justify-center">
                            {expandableRow && (
                              <button
                                type="button"
                                aria-label={
                                  expanded
                                    ? (locale.table?.collapseRow ??
                                      'Collapse row')
                                    : (locale.table?.expandRow ?? 'Expand row')
                                }
                                aria-expanded={expanded}
                                onClick={() => toggleExpand(record)}
                                className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
                              >
                                <ChevronRightIcon
                                  className={cn(
                                    'size-4 transition-transform duration-150',
                                    expanded && 'rotate-90',
                                  )}
                                />
                              </button>
                            )}
                          </div>
                        </td>
                      )}

                      {columns.map((column, index) => {
                        const value = column.dataIndex
                          ? record[column.dataIndex]
                          : undefined;
                        const content = column.render
                          ? column.render(value, record, rowIndex)
                          : (value as ReactNode);
                        const ellipsis = column.ellipsis ?? true;
                        const isEmptyCell =
                          content === undefined ||
                          content === null ||
                          content === '';

                        return (
                          <td
                            key={keyOf(column, index)}
                            className={cn(
                              CELL,
                              'py-3',
                              column.fixed &&
                                'sticky isolate z-10 bg-background group-hover:bg-muted group-data-[state=selected]:bg-muted',
                              ALIGN[column.align ?? 'left'],
                              classNames?.cell,
                              column.cellClassName,
                              column.className,
                            )}
                            style={{
                              ...styles?.cell,
                              ...column.cellStyle,
                              ...stickyStyle(column, index),
                            }}
                          >
                            {isEmptyCell ? (
                              <span className="text-muted-foreground/50">
                                —
                              </span>
                            ) : ellipsis && typeof content === 'string' ? (
                              <span className="block truncate" title={content}>
                                {content}
                              </span>
                            ) : (
                              content
                            )}
                          </td>
                        );
                      })}

                      {!!rowActions && (
                        <td
                          className={cn(
                            CELL,
                            'sticky isolate right-0 z-10 bg-background py-3 group-hover:bg-muted group-data-[state=selected]:bg-muted',
                            classNames?.cell,
                          )}
                          style={{ ...styles?.cell, width: actionsWidth }}
                          onClick={(event) => event.stopPropagation()}
                        >
                          {rowActions(record, rowIndex)}
                        </td>
                      )}
                    </tr>

                    {expanded && expandableRow && (
                      <tr
                        data-slot="table-expanded-row"
                        className={cn(
                          classNames?.expandedRow,
                          expandedRowClassName,
                        )}
                      >
                        <td
                          data-slot="table-expanded-cell"
                          colSpan={columnCount}
                          className={cn(
                            'border-b border-border bg-muted/20 px-4 py-4',
                            classNames?.expandedCell,
                          )}
                          style={styles?.expandedCell}
                        >
                          {expandable?.expandedRowRender(
                            record,
                            rowIndex,
                            0,
                            expanded,
                          )}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
          </tbody>
        </table>
      </div>

      {!!pagination && <Pagination {...pagination} />}
    </div>
  );
};
