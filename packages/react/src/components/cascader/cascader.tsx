import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import { cn } from '../../utils';
import { ChevronDownIcon, ChevronRightIcon, XIcon } from 'lucide-react';

import { useUiConfig } from '../../lib/ui-config';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';

export type CascaderOption = {
  value: string;
  label: string;
  children?: CascaderOption[];
  disabled?: boolean;
};

export type CascaderProps = {
  options: CascaderOption[];
  /** The path from the root, e.g. `['hcm', 'q1', 'ben-nghe']`. */
  value?: string[];
  onChange?: (value: string[], options: CascaderOption[]) => void;
  onBlur?: () => void;

  /** Commit on every level, not just the leaf — useful for "whole province". */
  changeOnSelect?: boolean;
  /** Open the next column on hover instead of click. */
  expandTrigger?: 'click' | 'hover';
  /** Renders the closed field. Defaults to the labels joined by `/`. */
  displayRender?: (labels: string[], options: CascaderOption[]) => ReactNode;
  placeholder?: string;
  allowClear?: boolean;
  disabled?: boolean;

  id?: string;
  name?: string;
  className?: string;
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
};

/** Resolves a value path to the option objects along it, stopping if it breaks. */
const resolvePath = (
  options: CascaderOption[],
  path: string[],
): CascaderOption[] => {
  const trail: CascaderOption[] = [];
  let level = options;

  for (const key of path) {
    const found = level.find((option) => option.value === key);

    if (!found) break;

    trail.push(found);
    level = found.children ?? [];
  }

  return trail;
};

/**
 * Ant Design-shaped cascader: drill through a fixed-depth hierarchy one column
 * at a time. The classic case here is tỉnh / quận / phường.
 *
 * ```tsx
 * <Cascader
 *   options={regions}
 *   value={area}
 *   onChange={setArea}
 *   placeholder="Chọn khu vực"
 *   allowClear
 * />
 * ```
 *
 * By default only a leaf commits a value, so a half-finished path leaves the
 * field alone. `changeOnSelect` commits at every level instead, which is what
 * you want when "cả tỉnh" is a legitimate answer.
 *
 * It takes `value`/`onChange`/`onBlur` and the aria props, so it drops straight
 * into a `Form.Item`. For an arbitrary-depth hierarchy, use `TreeSelect`.
 */
export const Cascader = ({
  options,
  value,
  onChange,
  onBlur,
  changeOnSelect = false,
  expandTrigger = 'click',
  displayRender,
  placeholder,
  allowClear = false,
  disabled = false,
  id,
  name,
  className,
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedBy,
}: CascaderProps) => {
  const { translate } = useUiConfig();
  const [open, setOpen] = useState(false);
  // The path being browsed, which runs ahead of `value` until it commits.
  const [active, setActive] = useState<string[]>([]);

  const committed = useMemo(() => value ?? [], [value]);
  const committedOptions = useMemo(
    () => resolvePath(options, committed),
    [options, committed],
  );

  const browsing = open ? active : committed;

  /** One column per level reached, so `columns[0]` is always the root list. */
  const columns = useMemo(() => {
    const result: CascaderOption[][] = [options];
    let level = options;

    for (const key of browsing) {
      const found = level.find((option) => option.value === key);

      if (!found?.children?.length) break;

      result.push(found.children);
      level = found.children;
    }

    return result;
  }, [options, browsing]);

  const commit = (path: string[]) => {
    onChange?.(path, resolvePath(options, path));
  };

  const pick = (option: CascaderOption, depth: number) => {
    if (option.disabled) return;

    const path = [...browsing.slice(0, depth), option.value];
    const leaf = !option.children?.length;

    setActive(path);

    if (leaf) {
      commit(path);
      setOpen(false);
      return;
    }

    if (changeOnSelect) commit(path);
  };

  const labels = committedOptions.map((option) => option.label);

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        // Browsing state is scratch: reopening starts from what's committed.
        if (next) setActive(committed);
        else onBlur?.();
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          id={id}
          name={name}
          role="combobox"
          aria-expanded={open}
          aria-invalid={ariaInvalid}
          aria-describedby={ariaDescribedBy}
          disabled={disabled}
          className={cn(
            'flex h-9 w-full cursor-pointer items-center gap-2 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs transition-colors',
            'focus-visible:outline-hidden focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
            className,
          )}
        >
          <span className="min-w-0 flex-1 truncate text-left">
            {labels.length === 0 ? (
              <span className="text-muted-foreground">
                {placeholder ?? translate('selectPlaceholder')}
              </span>
            ) : (
              (displayRender?.(labels, committedOptions) ?? labels.join(' / '))
            )}
          </span>

          {allowClear && labels.length > 0 && (
            <span
              role="button"
              tabIndex={-1}
              aria-label={translate('clear')}
              onClick={(event) => {
                // The trigger would otherwise open the popover.
                event.stopPropagation();
                setActive([]);
                commit([]);
              }}
              className="shrink-0 cursor-pointer text-muted-foreground hover:text-foreground"
            >
              <XIcon className="size-4" />
            </span>
          )}

          <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground" />
        </button>
      </PopoverTrigger>

      <PopoverContent className="flex w-auto max-w-[min(90vw,42rem)] overflow-x-auto p-0">
        {columns.map((column, depth) => (
          <ul
            // The path prefix identifies the column: two levels can hold the
            // same option list without sharing state.
            key={browsing.slice(0, depth).join('/') || 'root'}
            role="listbox"
            className={cn(
              'max-h-64 min-w-40 overflow-y-auto p-1',
              depth > 0 && 'border-l',
            )}
          >
            {column.map((option) => {
              const chosen = browsing[depth] === option.value;
              const branch = !!option.children?.length;

              return (
                <li key={option.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={chosen}
                    disabled={option.disabled}
                    onClick={() => pick(option, depth)}
                    onMouseEnter={
                      expandTrigger === 'hover' && branch
                        ? () =>
                            setActive([
                              ...browsing.slice(0, depth),
                              option.value,
                            ])
                        : undefined
                    }
                    className={cn(
                      'flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm transition-colors',
                      'outline-hidden focus-visible:ring-2 focus-visible:ring-ring',
                      'disabled:cursor-not-allowed disabled:opacity-50',
                      chosen
                        ? 'bg-accent font-medium text-accent-foreground'
                        : 'hover:bg-accent hover:text-accent-foreground',
                    )}
                  >
                    <span className="min-w-0 flex-1 truncate">
                      {option.label}
                    </span>
                    {branch && (
                      <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        ))}
      </PopoverContent>
    </Popover>
  );
};
