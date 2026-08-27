import { useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';

import { cn } from '../../utils';

import { useConfig } from '../../lib/config';
import { Empty } from '../empty';
import { Spinner } from '../spinner';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandFooter,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from './parts';

export type CommandMenuItem = {
  key: string;
  label: ReactNode;
  /** Second line under the label. */
  description?: ReactNode;
  icon?: ReactNode;
  /** Printed on the trailing edge. Binding the keys is still the app's job. */
  shortcut?: string;
  /** Extra words the search should match, for a label that doesn't say them. */
  keywords?: string[];
  disabled?: boolean;
  onSelect?: () => void;
};

export type CommandMenuGroup = {
  /** Only needed when two groups share a heading. */
  key?: string;
  label?: ReactNode;
  items: CommandMenuItem[];
};

export type CommandMenuProps = {
  /** Flat rows, groups, or a mix of the two. */
  items: (CommandMenuItem | CommandMenuGroup)[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /**
   * Keys that open it, in the shape `'mod+k'` — `mod` is ⌘ on a Mac and Ctrl
   * everywhere else. `false` binds nothing and leaves opening to you.
   */
  shortcut?: string | false;
  /** Runs after the item's own `onSelect`, then the menu closes. */
  onSelect?: (item: CommandMenuItem) => void;
  placeholder?: string;
  emptyText?: ReactNode;
  /** Controlled search text, for a list that comes from a server. */
  search?: string;
  onSearchChange?: (search: string) => void;
  /**
   * Client-side matching. `false` shows `items` untouched, which is what you
   * want when the list already arrives filtered from a server — otherwise it
   * gets filtered a second time here. A function replaces the scoring.
   */
  filterOption?: boolean | ((search: string, item: CommandMenuItem) => boolean);
  loading?: boolean;
  /** The hint bar along the bottom. Compose it from `CommandShortcut`. */
  footer?: ReactNode;
  /** Render in place instead of in a dialog — a palette inside a page. */
  inline?: boolean;
  /** Accessible name of the dialog, read out on open. */
  title?: string;
  description?: string;
  className?: string;
};

const isGroup = (
  entry: CommandMenuItem | CommandMenuGroup,
): entry is CommandMenuGroup => 'items' in entry;

/** Normalises the flat/grouped input into groups so rendering has one shape. */
const toGroups = (
  items: (CommandMenuItem | CommandMenuGroup)[],
): CommandMenuGroup[] => {
  const groups: CommandMenuGroup[] = [];
  let loose: CommandMenuItem[] | null = null;

  items.forEach((entry) => {
    if (isGroup(entry)) {
      loose = null;
      groups.push(entry);
      return;
    }
    if (!loose) {
      loose = [];
      groups.push({ items: loose });
    }
    loose.push(entry);
  });

  return groups;
};

/**
 * The words cmdk scores a row against. A `label` is usually a string, but it
 * is allowed to be a node, and a node has no text to match — which is what
 * `keywords` is for.
 */
const termsOf = (item: CommandMenuItem) =>
  [
    typeof item.label === 'string' ? item.label : '',
    typeof item.description === 'string' ? item.description : '',
    ...(item.keywords ?? []),
  ].filter(Boolean);

/** `'mod+k'` against a real keystroke. */
const matches = (shortcut: string, event: KeyboardEvent) => {
  const parts = shortcut.toLowerCase().split('+');
  const key = parts.at(-1);
  const wanted = new Set(parts.slice(0, -1));

  const mod = wanted.has('mod')
    ? event.metaKey || event.ctrlKey
    : wanted.has('meta') === event.metaKey &&
      wanted.has('ctrl') === event.ctrlKey;

  return (
    event.key.toLowerCase() === key &&
    mod &&
    wanted.has('shift') === event.shiftKey &&
    wanted.has('alt') === event.altKey
  );
};

/**
 * The ⌘K palette: a search box over a list of actions, in a dialog that opens
 * from anywhere.
 *
 * ```tsx
 * <CommandMenu
 *   items={[
 *     { key: 'new', label: 'New student', icon: <PlusIcon />, shortcut: '⌘N' },
 *     {
 *       label: 'Go to',
 *       items: [{ key: 'courses', label: 'Courses', onSelect: goToCourses }],
 *     },
 *   ]}
 *   onSelect={(item) => run(item.key)}
 * />
 * ```
 *
 * Uncontrolled and bound to ⌘K by default, so the snippet above is a working
 * palette. Pass `open` and `onOpenChange` to drive it from a button as well,
 * and `inline` to drop the dialog and mount the list in the page.
 *
 * Rows that need more than a label and an icon are better built from the parts
 * — `Command`, `CommandInput`, `CommandItem` — which is what this composes.
 *
 * Reach for `Select` when the result is a value in a form rather than an
 * action, and `DropdownMenu` when the list is short enough not to need search.
 */
export const CommandMenu = ({
  items,
  open,
  defaultOpen = false,
  onOpenChange,
  shortcut = 'mod+k',
  onSelect,
  placeholder,
  emptyText,
  search,
  onSearchChange,
  filterOption = true,
  loading = false,
  footer,
  inline = false,
  title,
  description,
  className,
}: CommandMenuProps) => {
  const { locale, renderEmpty } = useConfig();

  const [innerOpen, setInnerOpen] = useState(defaultOpen);
  const [innerSearch, setInnerSearch] = useState('');

  const controlled = open !== undefined;
  const isOpen = controlled ? open : innerOpen;
  const query = search ?? innerSearch;

  const groups = useMemo(() => toGroups(items), [items]);

  // cmdk scores by the row's `value`, which is the item's key; a custom
  // `filterOption` is handed the item itself, so the key has to buy it back.
  const byKey = useMemo(
    () =>
      new Map(
        groups.flatMap((group) => group.items.map((item) => [item.key, item])),
      ),
    [groups],
  );

  const setOpen = (next: boolean) => {
    if (!controlled) setInnerOpen(next);
    onOpenChange?.(next);
  };

  const setSearch = (next: string) => {
    if (search === undefined) setInnerSearch(next);
    onSearchChange?.(next);
  };

  // The listener is bound once per shortcut, so it must not close over `open`
  // or a stale `onOpenChange`. It reads the toggle through a ref instead.
  const toggle = useRef<() => void>(undefined);

  useEffect(() => {
    toggle.current = () => setOpen(!isOpen);
  });

  useEffect(() => {
    if (!shortcut || inline) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (!matches(shortcut, event)) return;

      event.preventDefault();
      toggle.current?.();
    };

    globalThis.addEventListener('keydown', onKeyDown);
    return () => globalThis.removeEventListener('keydown', onKeyDown);
  }, [shortcut, inline]);

  const select = (item: CommandMenuItem) => {
    item.onSelect?.();
    onSelect?.(item);

    if (!inline) setOpen(false);
    // A palette reopened on the last query would answer a question the user
    // asked a week ago.
    setSearch('');
  };

  const list = (
    <Command
      data-slot="command-menu"
      shouldFilter={filterOption !== false}
      filter={
        typeof filterOption === 'function'
          ? (value, text) => {
              const item = byKey.get(value);
              return item && filterOption(text, item) ? 1 : 0;
            }
          : undefined
      }
      className={cn(inline && 'rounded-lg border border-border', className)}
    >
      <CommandInput
        value={query}
        onValueChange={setSearch}
        placeholder={placeholder ?? locale.common?.search ?? 'Search…'}
        wrapperClassName="h-12 px-4"
        className="h-12"
        suffix={
          loading ? (
            <Spinner
              className="size-4 text-muted-foreground"
              aria-label={locale.common?.processing ?? 'Working…'}
            />
          ) : undefined
        }
      />

      <CommandList className="max-h-[min(24rem,60vh)] p-2">
        <CommandEmpty className={emptyText ? undefined : 'py-0'}>
          {emptyText ?? renderEmpty?.('command-menu') ?? <Empty size="sm" />}
        </CommandEmpty>

        {groups.map((group, index) => (
          <CommandGroup
            key={
              group.key ??
              (typeof group.label === 'string' ? group.label : index)
            }
            heading={group.label}
          >
            {group.items.map((item) => (
              <CommandItem
                key={item.key}
                value={item.key}
                keywords={termsOf(item)}
                disabled={item.disabled}
                onSelect={() => select(item)}
                className="gap-3 px-3 py-2"
              >
                {!!item.icon && (
                  <span
                    data-slot="command-item-icon"
                    className="flex size-4 shrink-0 items-center justify-center text-muted-foreground [&>svg]:size-4"
                  >
                    {item.icon}
                  </span>
                )}

                <span className="min-w-0 flex-1">
                  <span className="block truncate">{item.label}</span>
                  {!!item.description && (
                    <span className="block truncate text-xs text-muted-foreground">
                      {item.description}
                    </span>
                  )}
                </span>

                {!!item.shortcut && (
                  <CommandShortcut>{item.shortcut}</CommandShortcut>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>

      {!!footer && <CommandFooter>{footer}</CommandFooter>}
    </Command>
  );

  if (inline) return list;

  return (
    <CommandDialog
      open={isOpen}
      onOpenChange={setOpen}
      title={title}
      description={description}
    >
      {list}
    </CommandDialog>
  );
};
