import { useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';

import { cn } from '../../utils';
import { Loader2Icon, XIcon } from 'lucide-react';

import { useConfig } from '../../lib/config';
import { Empty } from '../empty';
import { Input } from '../input';
import { Popover, PopoverAnchor, PopoverContent } from '../popover';

export type AutoCompleteOption = {
  value: string;
  /** Defaults to `value`. Use it to show more than the text being completed. */
  label?: ReactNode;
  disabled?: boolean;
};

export type AutoCompleteProps = {
  options: AutoCompleteOption[];
  value?: string;
  /** Fires on every keystroke — the field is free text. */
  onChange?: (value: string) => void;
  /** Fires only when an option is taken from the list. */
  onSelect?: (value: string, option: AutoCompleteOption) => void;
  onBlur?: () => void;

  /**
   * Client-side matching. `false` shows `options` untouched, which is what you
   * want when the list already comes from a server query.
   */
  filterOption?:
    | boolean
    | ((input: string, option: AutoCompleteOption) => boolean);
  placeholder?: string;
  notFoundContent?: ReactNode;
  allowClear?: boolean;
  disabled?: boolean;
  loading?: boolean;

  id?: string;
  name?: string;
  className?: string;
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
};

const defaultFilter = (input: string, option: AutoCompleteOption) =>
  option.value.toLowerCase().includes(input.toLowerCase());

/**
 * An autocomplete: a text field that suggests, but never forces,
 * a value.
 *
 * ```tsx
 * <AutoComplete
 *   options={recentSearches}
 *   value={query}
 *   onChange={setQuery}
 *   placeholder="Search students"
 * />
 * ```
 *
 * The difference from `Select`: what the user types *is* the value. `Select`
 * with `mode="tags"` also accepts new entries, but it stores them as chips and
 * the field itself is not free text.
 *
 * With a server-side list, set `filterOption={false}` and refetch on `onChange`
 * — otherwise the results get filtered a second time on the client.
 */
export const AutoComplete = ({
  options,
  value,
  onChange,
  onSelect,
  onBlur,
  filterOption = true,
  placeholder,
  notFoundContent,
  allowClear = false,
  disabled = false,
  loading = false,
  id,
  name,
  className,
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedBy,
}: AutoCompleteProps) => {
  const { locale, renderEmpty } = useConfig();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const current = value ?? '';

  const matches = useMemo(() => {
    if (filterOption === false) return options;

    const match = filterOption === true ? defaultFilter : filterOption;

    return current
      ? options.filter((option) => match(current, option))
      : options;
  }, [options, current, filterOption]);

  const listId = id ? `${id}-listbox` : undefined;

  const pick = (option: AutoCompleteOption) => {
    if (option.disabled) return;

    onChange?.(option.value);
    onSelect?.(option.value, option);
    setOpen(false);
    setActive(-1);
  };

  /*
   * Open on matches, and on a query that found none — that second case is the
   * whole point of `notFoundContent`, and gating the popover on
   * `matches.length` alone made it unreachable. A field nobody has typed into
   * yet stays quiet: there is no question on screen for "no results" to answer.
   */
  const hasSomethingToShow = matches.length > 0 || current.length > 0;

  return (
    <Popover open={open && hasSomethingToShow} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div className={cn('relative w-full min-w-0', className)}>
          <Input
            ref={inputRef}
            id={id}
            name={name}
            role="combobox"
            aria-expanded={open}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={
              active >= 0 && listId ? `${listId}-${active}` : undefined
            }
            aria-invalid={ariaInvalid}
            aria-describedby={ariaDescribedBy}
            autoComplete="off"
            disabled={disabled}
            placeholder={placeholder}
            value={current}
            onChange={(event) => {
              onChange?.(event.target.value);
              setOpen(true);
              setActive(-1);
            }}
            onFocus={() => setOpen(true)}
            onBlur={onBlur}
            onKeyDown={(event) => {
              if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                event.preventDefault();
                setOpen(true);

                const step = event.key === 'ArrowDown' ? 1 : -1;
                const next = active + step;

                // Wraps, because a suggestion list is short and circling is
                // faster than arrowing back the other way.
                setActive(
                  next < 0
                    ? matches.length - 1
                    : next >= matches.length
                      ? 0
                      : next,
                );
                return;
              }

              if (event.key === 'Enter' && active >= 0 && matches[active]) {
                event.preventDefault();
                pick(matches[active]);
                return;
              }

              if (event.key === 'Escape') {
                setOpen(false);
                setActive(-1);
              }
            }}
            className={cn((loading || (allowClear && !!current)) && 'pr-9')}
          />

          {loading && (
            <Loader2Icon className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
          )}

          {allowClear && !!current && !loading && (
            <button
              type="button"
              aria-label={locale.common?.clear ?? 'Clear'}
              onClick={() => {
                onChange?.('');
                inputRef.current?.focus();
              }}
              className={cn(
                'absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-muted-foreground transition-colors hover:text-foreground',
                'outline-hidden focus-visible:ring-2 focus-visible:ring-ring',
              )}
            >
              <XIcon className="size-4" />
            </button>
          )}
        </div>
      </PopoverAnchor>

      <PopoverContent
        id={listId}
        role="listbox"
        // Focus must stay in the field: this is a text input with a hint list,
        // not a menu the user tabs into.
        onOpenAutoFocus={(event) => event.preventDefault()}
        className="max-h-64 w-(--radix-popover-trigger-width) min-w-48 overflow-y-auto p-1"
      >
        {matches.length === 0 ? (
          notFoundContent ? (
            <p className="px-2 py-3 text-center text-sm text-muted-foreground">
              {notFoundContent}
            </p>
          ) : (
            (renderEmpty?.('auto-complete') ?? <Empty size="sm" />)
          )
        ) : (
          matches.map((option, index) => (
            <div
              key={option.value}
              id={listId ? `${listId}-${index}` : undefined}
              role="option"
              aria-selected={index === active}
              aria-disabled={option.disabled}
              onMouseEnter={() => setActive(index)}
              // mousedown, not click: the input would blur first and close the
              // popover before a click ever landed.
              onMouseDown={(event) => {
                event.preventDefault();
                pick(option);
              }}
              className={cn(
                'cursor-pointer truncate rounded-sm px-2 py-1.5 text-sm',
                index === active && 'bg-accent text-accent-foreground',
                option.disabled && 'pointer-events-none opacity-50',
              )}
            >
              {option.label ?? option.value}
            </div>
          ))
        )}
      </PopoverContent>
    </Popover>
  );
};
