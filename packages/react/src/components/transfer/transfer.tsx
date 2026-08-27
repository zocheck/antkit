import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import { cn } from '../../utils';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

import { useConfig } from '../../lib/config';
import { Button } from '../button';
import { Checkbox } from '../checkbox';
import { Empty } from '../empty';
import { Input } from '../input';

export type TransferItem = {
  key: string;
  title: string;
  description?: string;
  disabled?: boolean;
};

export type TransferProps = {
  dataSource: TransferItem[];
  /** Keys living in the right-hand panel. */
  targetKeys?: string[];
  onChange?: (targetKeys: string[]) => void;
  onBlur?: () => void;

  /** `[left, right]` panel headings. */
  titles?: [ReactNode, ReactNode];
  /** Filter box on both panels. */
  showSearch?: boolean;
  /** Replaces the default row. */
  render?: (item: TransferItem) => ReactNode;
  /** Height of each panel's list, in pixels. */
  listHeight?: number;
  disabled?: boolean;

  id?: string;
  className?: string;
};

type PanelProps = {
  items: TransferItem[];
  checked: string[];
  onCheckedChange: (keys: string[]) => void;
  title: ReactNode;
  showSearch: boolean;
  searchPlaceholder: string;
  emptyText: ReactNode;
  render?: (item: TransferItem) => ReactNode;
  listHeight: number;
  disabled: boolean;
};

/** `3/12` while picking, plain `12` when nothing in the panel is checked. */
const selectedLabel = (count: number, total: number) =>
  count > 0 ? `${count}/${total}` : String(total);

const Panel = ({
  items,
  checked,
  onCheckedChange,
  title,
  showSearch,
  searchPlaceholder,
  emptyText,
  render,
  listHeight,
  disabled,
}: PanelProps) => {
  const [query, setQuery] = useState('');

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();

    if (!needle) return items;

    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(needle) ||
        item.description?.toLowerCase().includes(needle),
    );
  }, [items, query]);

  // Only enabled rows can be moved, so they alone decide the header checkbox.
  const selectable = visible.filter((item) => !item.disabled);
  const selectedHere = selectable.filter((item) => checked.includes(item.key));

  const headerState =
    selectedHere.length === 0
      ? false
      : selectedHere.length === selectable.length
        ? true
        : 'indeterminate';

  const toggleAll = () => {
    const keys = selectable.map((item) => item.key);

    onCheckedChange(
      headerState === true
        ? checked.filter((key) => !keys.includes(key))
        : [...new Set([...checked, ...keys])],
    );
  };

  return (
    <div
      data-slot="transfer-panel"
      className="flex min-w-0 flex-1 flex-col rounded-md border"
    >
      <div className="flex items-center gap-2 border-b px-3 py-2">
        <Checkbox
          checked={headerState}
          onCheckedChange={toggleAll}
          disabled={disabled || selectable.length === 0}
          aria-label={String(title)}
        />
        <span className="min-w-0 flex-1 truncate text-sm font-medium">
          {title}
        </span>
        <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
          {selectedLabel(selectedHere.length, items.length)}
        </span>
      </div>

      {showSearch && (
        <div className="border-b p-2">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchPlaceholder}
            disabled={disabled}
            className="h-8"
          />
        </div>
      )}

      <ul
        className="overflow-y-auto p-1"
        style={{ height: listHeight }}
        role="listbox"
        aria-multiselectable="true"
      >
        {visible.length === 0 ? (
          // The panel has a fixed height, so the blank state centres in it
          // rather than clinging to the top edge.
          <li className="flex h-full items-center justify-center">
            {emptyText}
          </li>
        ) : (
          visible.map((item) => {
            const on = checked.includes(item.key);
            const off = disabled || item.disabled;

            return (
              <li key={item.key}>
                <label
                  role="option"
                  aria-selected={on}
                  className={cn(
                    'flex cursor-pointer items-start gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors',
                    off
                      ? 'cursor-not-allowed opacity-50'
                      : 'hover:bg-accent hover:text-accent-foreground',
                    // A checked row is tinted rather than left for the
                    // checkbox to carry alone — which half of a long list is
                    // about to move should be readable at a glance.
                    on && !off && 'bg-accent text-accent-foreground',
                  )}
                >
                  <Checkbox
                    checked={on}
                    disabled={off}
                    onCheckedChange={(next) =>
                      onCheckedChange(
                        next
                          ? [...checked, item.key]
                          : checked.filter((key) => key !== item.key),
                      )
                    }
                    className="mt-0.5"
                  />
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate">
                      {render ? render(item) : item.title}
                    </span>
                    {!!item.description && (
                      <span className="truncate text-xs text-muted-foreground">
                        {item.description}
                      </span>
                    )}
                  </span>
                </label>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
};

/**
 * A transfer: two panels and a pair of arrows, for splitting a
 * set into "not chosen" and "chosen".
 *
 * ```tsx
 * <Transfer
 *   showSearch
 *   dataSource={allPermissions}
 *   targetKeys={granted}
 *   onChange={setGranted}
 *   titles={['Available', 'Granted']}
 * />
 * ```
 *
 * Worth the space over a multi-`Select` when the user needs to *see* both sides
 * at once — assigning permissions, picking which columns a report includes.
 * For a short list, a `CheckboxGroup` is lighter.
 *
 * `targetKeys`/`onChange` match the `value`/`onChange` contract, so a
 * `Form.Item` can drive it with `valuePropName="targetKeys"`.
 */
export const Transfer = ({
  dataSource,
  targetKeys,
  onChange,
  onBlur,
  titles,
  showSearch = false,
  render,
  listHeight = 240,
  disabled = false,
  id,
  className,
}: TransferProps) => {
  const { locale, renderEmpty } = useConfig();
  // Checks are scratch state: they say what to move next, not what is chosen.
  const [checked, setChecked] = useState<string[]>([]);

  const target = useMemo(() => targetKeys ?? [], [targetKeys]);

  const [left, right] = useMemo(() => {
    const source: TransferItem[] = [];
    const chosen: TransferItem[] = [];

    dataSource.forEach((item) =>
      (target.includes(item.key) ? chosen : source).push(item),
    );

    return [source, chosen];
  }, [dataSource, target]);

  const move = (direction: 'right' | 'left') => {
    const panel = direction === 'right' ? left : right;
    const moving = panel
      .filter((item) => checked.includes(item.key) && !item.disabled)
      .map((item) => item.key);

    if (moving.length === 0) return;

    onChange?.(
      direction === 'right'
        ? [...target, ...moving]
        : target.filter((key) => !moving.includes(key)),
    );
    // Whatever moved is no longer where the user checked it.
    setChecked((current) => current.filter((key) => !moving.includes(key)));
    onBlur?.();
  };

  const canMove = (panel: TransferItem[]) =>
    panel.some((item) => checked.includes(item.key) && !item.disabled);

  return (
    <div
      data-slot="transfer"
      id={id}
      className={cn('flex w-full min-w-0 items-center gap-3', className)}
    >
      <Panel
        items={left}
        checked={checked}
        onCheckedChange={setChecked}
        title={titles?.[0] ?? locale.transfer?.source ?? 'Source'}
        showSearch={showSearch}
        searchPlaceholder={locale.common?.search ?? 'Search…'}
        emptyText={renderEmpty?.('transfer') ?? <Empty size="sm" />}
        render={render}
        listHeight={listHeight}
        disabled={disabled}
      />

      <div className="flex shrink-0 flex-col gap-2">
        <Button
          size="icon-sm"
          variant="outline"
          aria-label={locale.transfer?.toTarget ?? 'Move to target'}
          disabled={disabled || !canMove(left)}
          onClick={() => move('right')}
        >
          <ChevronRightIcon />
        </Button>
        <Button
          size="icon-sm"
          variant="outline"
          aria-label={locale.transfer?.toSource ?? 'Move to source'}
          disabled={disabled || !canMove(right)}
          onClick={() => move('left')}
        >
          <ChevronLeftIcon />
        </Button>
      </div>

      <Panel
        items={right}
        checked={checked}
        onCheckedChange={setChecked}
        title={titles?.[1] ?? locale.transfer?.target ?? 'Target'}
        showSearch={showSearch}
        searchPlaceholder={locale.common?.search ?? 'Search…'}
        emptyText={renderEmpty?.('transfer') ?? <Empty size="sm" />}
        render={render}
        listHeight={listHeight}
        disabled={disabled}
      />
    </div>
  );
};
