import { useState } from 'react';
import type { ReactNode } from 'react';

import { cn } from '../../utils';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

import { useLocale } from '../../lib/config';
import { Button } from '../button';

export type PaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  onChange: (page: number, pageSize: number) => void;
  pageSizeOptions?: number[];
  showSizeChanger?: boolean;
  showQuickJumper?: boolean | { goButton?: ReactNode };
  /** Shorthand for `boundaries={1} siblings={0}` — a narrower strip. */
  showLessItems?: boolean;
  /** Pages kept at each end. */
  boundaries?: number;
  /** Pages kept either side of the current one. */
  siblings?: number;
  simple?: boolean;
  size?: 'default' | 'small';
  /**
   * How the numbers are drawn. `'outline'` gives every page a border,
   * `'light'` only the current one, `'flat'` fills the rest.
   */
  variant?: 'outline' | 'light' | 'flat';
  disabled?: boolean;
  hideOnSinglePage?: boolean;
  onShowSizeChange?: (page: number, pageSize: number) => void;
  /** Renders the "1-10 of 234" summary. */
  showTotal?: (total: number, range: [number, number]) => string;
  className?: string;
};

const run = (length: number, from: number) =>
  Array.from({ length }, (_, index) => from + index);

/**
 * Page numbers with `…` gaps, at a constant item count.
 *
 * Constant is the whole point. The obvious version — boundaries, then a
 * sibling window clamped to the ends — quietly shrinks near either end,
 * because the window collides with the boundary and one of the gaps drops
 * out. On 24 pages that walks the strip between five and nine buttons and
 * shoves everything beside it sideways on every click.
 *
 * So near an end the row that would have collapsed is extended instead: the
 * gap that survives keeps its place and the numbers grow into the space the
 * other gap left. Every page renders `boundaries * 2 + siblings * 2 + 3`
 * items, or all of them when there are fewer than that.
 */
const buildPages = (
  current: number,
  last: number,
  boundaries: number,
  siblings: number,
): (number | 'gap')[] => {
  const target = boundaries * 2 + siblings * 2 + 3;
  if (last <= target) return run(last, 1);

  const head = run(boundaries, 1);
  const tail = run(boundaries, last - boundaries + 1);
  // One gap instead of two leaves this much room for consecutive numbers.
  const edgeRun = target - boundaries - 1;

  if (current <= boundaries + siblings + 1) {
    return [...run(edgeRun, 1), 'gap', ...tail];
  }
  if (current >= last - boundaries - siblings) {
    return [...head, 'gap', ...run(edgeRun, last - edgeRun + 1)];
  }

  return [
    ...head,
    'gap',
    ...run(siblings * 2 + 1, current - siblings),
    'gap',
    ...tail,
  ];
};

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

/**
 * Page numbers, with an optional size changer and jump-to box. Controlled:
 * it holds no page of its own, so `page` is whatever you last stored.
 *
 * ```tsx
 * <Pagination
 *   page={page}
 *   pageSize={size}
 *   total={total}
 *   showSizeChanger
 *   showTotal={(count, [from, to]) => `${from}-${to} of ${count}`}
 *   onChange={(nextPage, nextSize) => {
 *     setPage(nextPage);
 *     setSize(nextSize);
 *   }}
 * />
 * ```
 *
 * `Table` renders one for you when you pass it a `pagination` prop — reach for
 * this directly when the paged thing is not a table: a card grid, a feed, a
 * list of search results.
 *
 * `onChange` carries both values because changing the page size also changes
 * the page: picking a new size sends you back to page 1 rather than guessing
 * which page your old rows moved to. Store both from the same call, or you
 * will render page 8 of a list that now has three pages.
 */
export const Pagination = ({
  page,
  pageSize,
  total,
  onChange,
  pageSizeOptions,
  showSizeChanger,
  showQuickJumper = false,
  showLessItems = false,
  boundaries,
  siblings,
  simple = false,
  size = 'default',
  variant = 'outline',
  disabled = false,
  hideOnSinglePage = false,
  onShowSizeChange,
  showTotal,
  className,
}: PaginationProps) => {
  const locale = useLocale();
  const [quickPage, setQuickPage] = useState('');

  const lastPage = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(Math.max(1, page), lastPage);
  const from = total === 0 ? 0 : (current - 1) * pageSize + 1;
  const to = Math.min(current * pageSize, total);
  const showSizeChangerResolved =
    showSizeChanger ?? Boolean(pageSizeOptions?.length);
  const resolvedPageSizeOptions = pageSizeOptions ?? DEFAULT_PAGE_SIZE_OPTIONS;
  const controlSize = size === 'small' ? 'size-7 text-xs' : 'size-8';
  // `showLessItems` is the antd spelling of the same idea, so it only sets
  // defaults — an explicit `boundaries` or `siblings` still wins.
  const resolvedBoundaries = boundaries ?? (showLessItems ? 1 : 2);
  const resolvedSiblings = siblings ?? (showLessItems ? 0 : 1);
  const restVariant = variant === 'outline' ? 'outline' : 'ghost';

  const goTo = (next: number) => {
    if (disabled || next < 1 || next > lastPage || next === current) return;
    onChange(next, pageSize);
  };

  const changePageSize = (nextPageSize: number) => {
    if (disabled) return;
    onChange(1, nextPageSize);
    onShowSizeChange?.(1, nextPageSize);
  };

  const commitQuickJump = () => {
    const next = Number(quickPage);
    if (Number.isInteger(next)) goTo(next);
    setQuickPage('');
  };

  if (hideOnSinglePage && lastPage <= 1) return null;

  return (
    <div
      data-slot="pagination"
      className={cn(
        'flex flex-wrap items-center justify-between gap-x-4 gap-y-3 text-sm',
        className,
      )}
    >
      {!!showTotal && (
        <div className="mr-auto text-muted-foreground">
          {showTotal(total, [from, to])}
        </div>
      )}

      <div className="ml-auto flex flex-wrap items-center gap-1.5">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className={controlSize}
          aria-label={locale.pagination?.previousPage ?? 'Previous page'}
          disabled={disabled || current <= 1}
          onClick={() => goTo(current - 1)}
        >
          <ChevronLeftIcon className="size-4" />
        </Button>

        {simple ? (
          <div className="flex h-8 items-center gap-1 px-1 tabular-nums">
            <input
              type="number"
              min={1}
              max={lastPage}
              value={quickPage}
              placeholder={String(current)}
              disabled={disabled}
              aria-label={locale.pagination?.jumpToPage ?? 'Go to page'}
              onChange={(event) => setQuickPage(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') commitQuickJump();
              }}
              onBlur={commitQuickJump}
              className="h-7 w-10 rounded-md border bg-background px-1 text-center text-sm outline-hidden focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
            />
            <span className="text-muted-foreground">/ {lastPage}</span>
          </div>
        ) : (
          buildPages(
            current,
            lastPage,
            resolvedBoundaries,
            resolvedSiblings,
          ).map((entry, index) =>
            entry === 'gap' ? (
              <span
                key={`gap-${index}`}
                aria-hidden
                className="px-1 text-muted-foreground"
              >
                …
              </span>
            ) : (
              <Button
                key={entry}
                type="button"
                variant={entry === current ? 'default' : restVariant}
                size="icon"
                className={cn(
                  controlSize,
                  'tabular-nums',
                  variant === 'flat' &&
                    entry !== current &&
                    'bg-muted hover:bg-muted/70',
                )}
                aria-current={entry === current ? 'page' : undefined}
                disabled={disabled}
                onClick={() => goTo(entry)}
              >
                {entry}
              </Button>
            ),
          )
        )}

        <Button
          type="button"
          variant="outline"
          size="icon"
          className={controlSize}
          aria-label={locale.pagination?.nextPage ?? 'Next page'}
          disabled={disabled || current >= lastPage}
          onClick={() => goTo(current + 1)}
        >
          <ChevronRightIcon className="size-4" />
        </Button>

        {!!showQuickJumper && !simple && (
          <div className="ml-1 flex items-center gap-1.5">
            <span className="text-muted-foreground">
              {locale.pagination?.jumpToPage ?? 'Go to page'}
            </span>
            <input
              type="number"
              min={1}
              max={lastPage}
              value={quickPage}
              disabled={disabled}
              aria-label={locale.pagination?.jumpToPage ?? 'Go to page'}
              onChange={(event) => setQuickPage(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') commitQuickJump();
              }}
              onBlur={commitQuickJump}
              className={cn(
                'rounded-md border bg-background px-2 text-center outline-hidden focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50',
                size === 'small' ? 'h-7 w-12 text-xs' : 'h-8 w-14 text-sm',
              )}
            />
            {typeof showQuickJumper === 'object' && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={disabled}
                onClick={commitQuickJump}
              >
                {showQuickJumper.goButton ?? locale.pagination?.go ?? 'Go'}
              </Button>
            )}
          </div>
        )}

        {showSizeChangerResolved && (
          <select
            aria-label={locale.pagination?.rowsPerPage ?? 'Rows per page'}
            value={pageSize}
            disabled={disabled}
            onChange={(event) => changePageSize(Number(event.target.value))}
            className={cn(
              'cursor-pointer rounded-md border bg-background px-2 outline-hidden focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
              size === 'small' ? 'h-7 text-xs' : 'h-8 text-sm',
            )}
          >
            {resolvedPageSizeOptions.map((option) => (
              <option key={option} value={option}>
                {option} {locale.pagination?.perPage ?? '/ page'}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};
