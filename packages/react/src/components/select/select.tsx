import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import { cn } from '../../utils';
import { CheckIcon, ChevronDownIcon, Loader2Icon, XIcon } from 'lucide-react';

import { useConfig } from '../../lib/config';
import { Empty } from '../empty';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../command-menu/parts';

export type SelectOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

export type SelectOptionGroup = {
  label: string;
  options: SelectOption[];
};

export type SelectValue = string | string[] | undefined;

export type SelectProps = {
  options: (SelectOption | SelectOptionGroup)[];
  value?: SelectValue;
  /** Starting selection when the caller does not hold the value. */
  defaultValue?: SelectValue;
  /** Receives a `string` in single mode, `string[]` in multiple/tags. */
  onChange?: (value: SelectValue) => void;
  onBlur?: () => void;

  /**
   * - unset — pick one
   * - `'multiple'` — pick several, shown as removable tags
   * - `'tags'` — multiple, plus create values that aren't in the list
   */
  mode?: 'multiple' | 'tags';
  /** Defaults to on for multiple/tags, off for single. */
  showSearch?: boolean;
  allowClear?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  notFoundContent?: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  /** Collapses the overflow into "+N" once this many tags are shown. */
  maxTagCount?: number;

  id?: string;
  name?: string;
  className?: string;
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
};

const isGroup = (
  entry: SelectOption | SelectOptionGroup,
): entry is SelectOptionGroup => 'options' in entry;

/** Normalises the flat/grouped input into groups so rendering has one shape. */
const toGroups = (
  options: (SelectOption | SelectOptionGroup)[],
): SelectOptionGroup[] => {
  const groups: SelectOptionGroup[] = [];
  let loose: SelectOption[] | null = null;

  options.forEach((entry) => {
    if (isGroup(entry)) {
      loose = null;
      groups.push(entry);
      return;
    }
    if (!loose) {
      loose = [];
      groups.push({ label: '', options: loose });
    }
    loose.push(entry);
  });

  return groups;
};

/**
 * One select covering every variant other kits split across separate
 * components: single, `mode="multiple"`, `mode="tags"`, with or without
 * `showSearch`.
 *
 * ```tsx
 * <Select
 *   mode="multiple"
 *   allowClear
 *   placeholder={t('pickRoles')}
 *   options={[
 *     { label: 'Admin', value: 'admin' },
 *     { label: 'Editor', value: 'editor', disabled: true },
 *   ]}
 *   value={roles}
 *   onChange={setRoles}
 * />
 * ```
 *
 * It takes `value`/`onChange`/`onBlur` and the aria props, which is exactly what
 * `Form.Item` injects — so it drops into a form with no adapter.
 *
 * Filtering and the keyboard model come from cmdk; the list is a real listbox
 * with arrow keys, typeahead and Enter.
 */
export const Select = ({
  options,
  value,
  defaultValue,
  onChange,
  onBlur,
  mode,
  showSearch,
  allowClear = false,
  placeholder,
  searchPlaceholder,
  notFoundContent,
  disabled = false,
  loading = false,
  maxTagCount,
  id,
  name,
  className,
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedBy,
}: SelectProps) => {
  const { locale, renderEmpty } = useConfig();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  // Only read while uncontrolled; `value` wins the moment it is supplied.
  const [inner, setInner] = useState<SelectValue>(defaultValue);

  const multiple = mode === 'multiple' || mode === 'tags';
  const searchable = showSearch ?? multiple;
  const controlled = value !== undefined;
  const current = controlled ? value : inner;

  // `Form.Item` seeds an empty field with '', which is not a valid multi value.
  const selected = useMemo<string[]>(() => {
    if (Array.isArray(current)) return current;
    if (current === undefined || current === null || current === '') return [];
    return [current];
  }, [current]);

  const groups = useMemo(() => toGroups(options), [options]);

  const labels = useMemo(() => {
    const map = new Map<string, string>();
    groups.forEach((group) =>
      group.options.forEach((option) => map.set(option.value, option.label)),
    );
    return map;
  }, [groups]);

  const emit = (next: string[]) => {
    const value = multiple ? next : next[0];

    if (!controlled) setInner(value);
    onChange?.(value);
  };

  const toggle = (optionValue: string) => {
    if (multiple) {
      emit(
        selected.includes(optionValue)
          ? selected.filter((entry) => entry !== optionValue)
          : [...selected, optionValue],
      );
      setSearch('');
      return;
    }

    emit([optionValue]);
    setOpen(false);
  };

  const clear = () => emit([]);

  // tags mode: offer whatever was typed when it isn't already an option
  const typedTag =
    mode === 'tags' && search.trim() && !labels.has(search.trim())
      ? search.trim()
      : null;

  const visibleTags = maxTagCount ? selected.slice(0, maxTagCount) : selected;
  const overflow = selected.length - visibleTags.length;

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setSearch('');
          onBlur?.();
        }
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
          disabled={disabled || loading}
          className={cn(
            'flex min-h-10 w-full cursor-pointer items-center gap-2 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors',
            'focus-visible:outline-hidden focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
            className,
          )}
        >
          <span className="flex min-w-0 flex-1 flex-wrap items-center gap-1 py-1 text-left">
            {selected.length === 0 && (
              <span className="text-muted-foreground">
                {placeholder ?? locale.common?.selectPlaceholder ?? 'Select…'}
              </span>
            )}

            {multiple
              ? visibleTags.map((entry) => (
                  <span
                    key={entry}
                    className="flex items-center gap-1 rounded-md bg-secondary px-1.5 py-0.5 text-xs text-secondary-foreground"
                  >
                    {labels.get(entry) ?? entry}
                    <span
                      role="button"
                      tabIndex={-1}
                      aria-label={locale.common?.remove ?? 'Remove'}
                      onClick={(event) => {
                        // The trigger would otherwise open the popover.
                        event.stopPropagation();
                        emit(selected.filter((item) => item !== entry));
                      }}
                      className="cursor-pointer text-muted-foreground hover:text-foreground"
                    >
                      <XIcon className="size-3" />
                    </span>
                  </span>
                ))
              : selected.length > 0 && (
                  <span className="truncate">
                    {labels.get(selected[0]) ?? selected[0]}
                  </span>
                )}

            {overflow > 0 && (
              <span className="rounded-md bg-secondary px-1.5 py-0.5 text-xs text-secondary-foreground">
                +{overflow}
              </span>
            )}
          </span>

          {loading && (
            <Loader2Icon className="size-4 shrink-0 animate-spin text-muted-foreground" />
          )}

          {allowClear && selected.length > 0 && !loading && (
            <span
              role="button"
              tabIndex={-1}
              aria-label={locale.common?.clear ?? 'Clear'}
              onClick={(event) => {
                event.stopPropagation();
                clear();
              }}
              className="shrink-0 cursor-pointer text-muted-foreground hover:text-foreground"
            >
              <XIcon className="size-4" />
            </span>
          )}

          <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground" />
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-(--radix-popover-trigger-width) min-w-56">
        <Command
          // In tags mode a typed value that matches nothing still has to be
          // offered, so filtering is handled through `typedTag` below.
          shouldFilter={!!searchable}
        >
          {searchable && (
            <CommandInput
              value={search}
              onValueChange={setSearch}
              placeholder={
                searchPlaceholder ?? locale.common?.search ?? 'Search…'
              }
            />
          )}

          <CommandList>
            <CommandEmpty className={notFoundContent ? undefined : 'py-0'}>
              {notFoundContent ?? renderEmpty?.('select') ?? (
                <Empty size="sm" />
              )}
            </CommandEmpty>

            {!!typedTag && (
              <CommandGroup>
                <CommandItem value={typedTag} onSelect={() => toggle(typedTag)}>
                  <span className="truncate">{typedTag}</span>
                </CommandItem>
              </CommandGroup>
            )}

            {groups.map((group, index) => (
              <CommandGroup
                key={group.label || `group-${index}`}
                heading={group.label || undefined}
              >
                {group.options.map((option) => {
                  const active = selected.includes(option.value);

                  return (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      disabled={option.disabled}
                      onSelect={() => toggle(option.value)}
                    >
                      <CheckIcon
                        className={cn(
                          'size-4 shrink-0',
                          active ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                      <span className="truncate">{option.label}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
