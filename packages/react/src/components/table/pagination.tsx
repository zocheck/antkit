import { useState } from 'react';
import type { ReactNode } from 'react';

import { cn } from '../../utils';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

import { useUiConfig } from '../../lib/ui-config';
import { Button } from '../button';

export type PaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  onChange: (page: number, pageSize: number) => void;
  pageSizeOptions?: number[];
  showSizeChanger?: boolean;
  showQuickJumper?: boolean | { goButton?: ReactNode };
  showLessItems?: boolean;
  simple?: boolean;
  size?: 'default' | 'small';
  disabled?: boolean;
  hideOnSinglePage?: boolean;
  onShowSizeChange?: (page: number, pageSize: number) => void;
  /** Renders the "1-10 of 234" summary. */
  showTotal?: (total: number, range: [number, number]) => string;
  className?: string;
};

/** Page numbers with `…` gaps, keeping the list a fixed width. */
const buildPages = (
  current: number,
  last: number,
  showLessItems: boolean,
): (number | 'gap')[] => {
  const boundaryCount = showLessItems ? 1 : 2;
  const siblingCount = showLessItems ? 0 : 1;
  const maximumItems = boundaryCount * 2 + siblingCount * 2 + 1;

  if (last <= maximumItems) {
    return Array.from({ length: last }, (_, index) => index + 1);
  }

  const leftBoundary = Array.from(
    { length: boundaryCount },
    (_, index) => index + 1,
  );
  const rightBoundary = Array.from(
    { length: boundaryCount },
    (_, index) => last - boundaryCount + index + 1,
  );
  const start = Math.max(boundaryCount + 1, current - siblingCount);
  const end = Math.min(last - boundaryCount, current + siblingCount);
  const pages: (number | 'gap')[] = [...leftBoundary];

  if (start > boundaryCount + 1) pages.push('gap');
  for (let page = start; page <= end; page += 1) pages.push(page);
  if (end < last - boundaryCount) pages.push('gap');

  return [...pages, ...rightBoundary];
};

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export const Pagination = ({
  page,
  pageSize,
  total,
  onChange,
  pageSizeOptions,
  showSizeChanger,
  showQuickJumper = false,
  showLessItems = false,
  simple = false,
  size = 'default',
  disabled = false,
  hideOnSinglePage = false,
  onShowSizeChange,
  showTotal,
  className,
}: PaginationProps) => {
  const { translate } = useUiConfig();
  const [quickPage, setQuickPage] = useState('');

  const lastPage = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(Math.max(1, page), lastPage);
  const from = total === 0 ? 0 : (current - 1) * pageSize + 1;
  const to = Math.min(current * pageSize, total);
  const showSizeChangerResolved =
    showSizeChanger ?? Boolean(pageSizeOptions?.length);
  const resolvedPageSizeOptions = pageSizeOptions ?? DEFAULT_PAGE_SIZE_OPTIONS;
  const controlSize = size === 'small' ? 'size-7 text-xs' : 'size-8';

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
          aria-label={translate('previousPage')}
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
              aria-label={translate('jumpToPage')}
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
          buildPages(current, lastPage, showLessItems).map((entry, index) =>
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
                variant={entry === current ? 'default' : 'outline'}
                size="icon"
                className={cn(controlSize, 'tabular-nums')}
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
          aria-label={translate('nextPage')}
          disabled={disabled || current >= lastPage}
          onClick={() => goTo(current + 1)}
        >
          <ChevronRightIcon className="size-4" />
        </Button>

        {!!showQuickJumper && !simple && (
          <div className="ml-1 flex items-center gap-1.5">
            <span className="text-muted-foreground">
              {translate('jumpToPage')}
            </span>
            <input
              type="number"
              min={1}
              max={lastPage}
              value={quickPage}
              disabled={disabled}
              aria-label={translate('jumpToPage')}
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
                {showQuickJumper.goButton ?? translate('go')}
              </Button>
            )}
          </div>
        )}

        {showSizeChangerResolved && (
          <select
            aria-label={translate('rowsPerPage')}
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
                {option} {translate('perPage')}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};
