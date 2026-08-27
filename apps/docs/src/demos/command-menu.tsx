import { useEffect, useState } from 'react';

import {
  Avatar,
  AvatarFallback,
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandMenu,
  CommandShortcut,
} from '@antkit/react';
import type { CommandMenuItem } from '@antkit/react';
import {
  CalendarIcon,
  FileTextIcon,
  MailIcon,
  PlusIcon,
  SettingsIcon,
  UserRoundIcon,
  UsersIcon,
} from 'lucide-react';
import { toast } from 'sonner';

import type { DemoMeta } from '../lib/types';

const ACTIONS: CommandMenuItem[] = [
  {
    key: 'new-student',
    label: 'Add student',
    icon: <PlusIcon />,
    shortcut: '⌘N',
  },
  {
    key: 'new-course',
    label: 'Open a new course',
    icon: <CalendarIcon />,
    keywords: ['class', 'intake'],
  },
  {
    key: 'campaign',
    label: 'Compose an email campaign',
    icon: <MailIcon />,
    shortcut: '⌘E',
  },
  {
    key: 'settings',
    label: 'System settings',
    icon: <SettingsIcon />,
    disabled: true,
  },
];

const PEOPLE = [
  {
    key: 'sarah',
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
  },
  { key: 'marcus', name: 'Marcus Alvarez', email: 'marcus.a@example.com' },
  {
    key: 'priya',
    name: 'Priya Raghunathan',
    email: 'priya.r@example.com',
  },
];

const initials = (name: string) =>
  name
    .split(' ')
    .slice(-2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

const Kbd = ({ children }: { children: string }) => (
  <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-sans text-[10px] leading-none text-muted-foreground">
    {children}
  </kbd>
);

export const meta: DemoMeta = {
  imports: [
    'CommandMenu',
    'Command',
    'CommandInput',
    'CommandList',
    'CommandEmpty',
    'CommandGroup',
    'CommandItem',
    'CommandShortcut',
    'CommandFooter',
    'CommandDialog',
  ],
  extraImports: ["import type { CommandMenuItem } from '@antkit/react';"],
  api: [
    {
      title: 'CommandMenu',
      description:
        'A command palette built from data. Use `Select` when the result is a value in a form, and `DropdownMenu` when the list is short enough not to need searching.',
      props: [
        {
          name: 'items',
          type: '(CommandMenuItem | CommandMenuGroup)[]',
          description: 'Flat rows, grouped rows, or a mix of both. Required.',
        },
        {
          name: 'open / defaultOpen / onOpenChange',
          type: 'boolean | (open: boolean) => void',
          description:
            'Pass none of them and the menu holds its own state — `items` alone is enough to run.',
        },
        {
          name: 'shortcut',
          type: 'string | false',
          default: "'mod+k'",
          description:
            'The opening shortcut, as `"mod+k"` — `mod` is ⌘ on a Mac and Ctrl elsewhere. `false` binds nothing, and opening is yours to do.',
        },
        {
          name: 'onSelect',
          type: '(item: CommandMenuItem) => void',
          description:
            'Runs after the item’s own `onSelect`, and then the menu closes.',
        },
        {
          name: 'placeholder',
          type: 'string',
          description:
            'The greyed text in the search box. It defaults to `ConfigProvider`.',
        },
        {
          name: 'emptyText',
          type: 'ReactNode',
          description:
            'Replaces the empty block when nothing matches. Left out, it uses `Empty` — icon and all.',
        },
        {
          name: 'search / onSearchChange',
          type: 'string | (search: string) => void',
          description:
            'The controlled query, for a list fetched from a server.',
        },
        {
          name: 'filterOption',
          type: 'boolean | ((search: string, item: CommandMenuItem) => boolean)',
          default: 'true',
          description:
            '`false` shows `items` as they are — needed when the server already filtered, or the list gets filtered twice. Pass a function to score them yourself.',
        },
        {
          name: 'loading',
          type: 'boolean',
          default: 'false',
          description: 'A spinner in the search box, while the server answers.',
        },
        {
          name: 'footer',
          type: 'ReactNode',
          description:
            'The strip of key hints along the bottom. Built from `CommandShortcut`.',
        },
        {
          name: 'inline',
          type: 'boolean',
          default: 'false',
          description:
            'Drops the dialog and mounts the list straight into the page. `shortcut` no longer applies.',
        },
        {
          name: 'title / description',
          type: 'string',
          description:
            'The dialog’s name and description, read only by screen readers. They default to `ConfigProvider`.',
        },
      ],
    },
    {
      title: 'CommandMenuItem / CommandMenuGroup',
      props: [
        {
          name: 'key',
          type: 'string',
          description:
            'The row identifier, and also the value cmdk scores against.',
        },
        { name: 'label', type: 'ReactNode', description: 'The main line.' },
        {
          name: 'description',
          type: 'ReactNode',
          description: 'The line under the label.',
        },
        {
          name: 'icon',
          type: 'ReactNode',
          description: 'The glyph at the row head.',
        },
        {
          name: 'shortcut',
          type: 'string',
          description:
            'Printed at the right edge. Binding the real key is still the app’s job — the component only shows it.',
        },
        {
          name: 'keywords',
          type: 'string[]',
          description:
            'Extra terms for the search to catch, when the label does not contain them — or when the label is a node rather than a string.',
        },
        {
          name: 'disabled',
          type: 'boolean',
          description: 'Locks one row.',
        },
        {
          name: 'onSelect',
          type: '() => void',
          description: 'What this row alone does.',
        },
        {
          name: 'items',
          type: 'CommandMenuItem[]',
          description: 'With this field present, the entry is read as a group.',
        },
      ],
    },
    {
      title: 'The loose parts',
      description:
        'Wraps cmdk, which handles the filtering and the whole keyboard model (arrows, Home/End, Enter, type-ahead). Use these when a row needs a shape `CommandMenu` does not cover.',
      props: [
        {
          name: 'Command',
          type: 'ComponentProps<typeof CommandPrimitive>',
          description:
            'The outer frame. `shouldFilter` and `filter` live here.',
        },
        {
          name: 'CommandInput',
          type: 'CommandInputProps',
          description:
            'The search box, icon included. `suffix` for the trailing slot, `wrapperClassName` for the whole row.',
        },
        {
          name: 'CommandList / CommandEmpty / CommandGroup / CommandItem / CommandSeparator',
          type: 'ComponentProps<…>',
          description:
            'The list, the empty state, a group, a row and a divider.',
        },
        {
          name: 'CommandShortcut',
          type: "ComponentProps<'kbd'>",
          description: 'The key hint at the right edge of a row.',
        },
        {
          name: 'CommandFooter',
          type: "ComponentProps<'div'>",
          description: 'The hint strip along the bottom.',
        },
        {
          name: 'CommandDialog',
          type: 'CommandDialogProps',
          description:
            'The dialog holding the palette: it sits near the top rather than centred, because the list grows downwards and a centred box would drift upwards as the user types.',
        },
      ],
    },
  ],
};

/**
 * Basic
 *
 * No state needed: the menu holds its own and binds its own shortcut. The
 * default is `"mod+k"`, but this docs site already took ⌘K for its own search,
 * so the example moves to ⌘J — two things listening for one key both open.
 * Press ⌘J (or Ctrl+J) anywhere on the page.
 */
export const Basic = () => (
  <CommandMenu
    items={ACTIONS}
    shortcut="mod+j"
    onSelect={(item) => toast.success(String(item.label))}
  />
);

/**
 * Opened by a button
 *
 * `open` and `onOpenChange` let a button open it too. `shortcut={false}` here
 * because this page already has a palette on ⌘K — two listening for one key
 * both open, stacked on each other.
 */
export const WithTrigger = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open the palette
        <CommandShortcut>⌘K</CommandShortcut>
      </Button>

      <CommandMenu
        items={ACTIONS}
        open={open}
        onOpenChange={setOpen}
        shortcut={false}
        onSelect={(item) => toast.success(String(item.label))}
      />
    </>
  );
};

/**
 * Groups and the key hint strip
 *
 * An entry with `items` is a group; mixing them with flat rows is fine, and
 * the flat ones land in an unnamed group. `footer` is where you tell the
 * reader which key does what.
 */
export const Groups = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        See a grouped palette
      </Button>

      <CommandMenu
        open={open}
        onOpenChange={setOpen}
        shortcut={false}
        onSelect={(item) => toast(String(item.label))}
        items={[
          { label: 'Actions', items: ACTIONS.slice(0, 3) },
          {
            label: 'Go to',
            items: [
              { key: 'go-students', label: 'Students', icon: <UsersIcon /> },
              { key: 'go-courses', label: 'Courses', icon: <CalendarIcon /> },
              { key: 'go-reports', label: 'Reports', icon: <FileTextIcon /> },
            ],
          },
        ]}
        footer={
          <>
            <span className="flex items-center gap-1.5">
              <Kbd>↑</Kbd>
              <Kbd>↓</Kbd>
              navigate
            </span>
            <span className="flex items-center gap-1.5">
              <Kbd>↵</Kbd>
              select
            </span>
            <span className="ml-auto flex items-center gap-1.5">
              <Kbd>esc</Kbd>
              close
            </span>
          </>
        }
      />
    </>
  );
};

/**
 * Two-line rows
 *
 * `description` makes the row taller — for a list of people, where the name
 * alone is not enough to tell them apart.
 */
export const People = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Find someone
      </Button>

      <CommandMenu
        open={open}
        onOpenChange={setOpen}
        shortcut={false}
        placeholder="Search by name or email…"
        onSelect={(item) => toast(String(item.label))}
        items={PEOPLE.map((person) => ({
          key: person.key,
          label: person.name,
          description: person.email,
          icon: <UserRoundIcon />,
        }))}
      />
    </>
  );
};

/**
 * Mounted in the page
 *
 * `inline` drops the dialog. Use it for a search page, or a panel where the
 * palette is the content rather than something that pops up.
 */
export const Inline = () => (
  <div className="w-full max-w-md">
    <CommandMenu
      inline
      items={ACTIONS}
      placeholder="Type to filter commands…"
      onSelect={(item) => toast(String(item.label))}
    />
  </div>
);

/**
 * The empty state
 *
 * `emptyText` is what the reader gets when the search misses. Try typing
 * nonsense.
 */
export const Empty = () => (
  <div className="w-full max-w-md">
    <CommandMenu
      inline
      items={ACTIONS.slice(0, 2)}
      emptyText={
        <span className="grid gap-1">
          <span className="font-medium text-foreground">
            No matching command
          </span>
          <span>Try another term, or open the Help menu.</span>
        </span>
      }
    />
  </div>
);

/**
 * Fetching from a server
 *
 * `filterOption={false}` stops the server’s list being filtered again;
 * `search` and `onSearchChange` hold the query, and `loading` says it is
 * waiting. This example fakes a 400ms delay.
 */
export const Remote = () => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<CommandMenuItem[]>([]);
  const [loading, setLoading] = useState(false);

  const onSearchChange = (next: string) => {
    setSearch(next);
    setLoading(!!next);
  };

  useEffect(() => {
    if (!search) return;

    const timer = setTimeout(() => {
      setResults(
        PEOPLE.filter((person) =>
          `${person.name} ${person.email}`
            .toLowerCase()
            .includes(search.toLowerCase()),
        ).map((person) => ({
          key: person.key,
          label: person.name,
          description: person.email,
          icon: <UserRoundIcon />,
        })),
      );
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="w-full max-w-md">
      <CommandMenu
        inline
        items={search ? results : []}
        search={search}
        onSearchChange={onSearchChange}
        filterOption={false}
        loading={loading}
        placeholder="Type to search the server…"
        emptyText={search ? 'Nobody found' : 'Type to start searching'}
        onSelect={(item) => toast(String(item.label))}
      />
    </div>
  );
};

/**
 * Composing it yourself
 *
 * `CommandMenu` is only one way of assembling these. When a row needs its own
 * shape — an avatar, a badge, two columns — compose from `Command` directly,
 * and cmdk still handles all the filtering and the keyboard.
 */
export const Composed = () => (
  <Command className="w-full max-w-md rounded-lg border border-border">
    <CommandInput placeholder="Search members…" wrapperClassName="h-12 px-4" />

    <CommandList className="p-2">
      <CommandEmpty>Nobody matches.</CommandEmpty>

      <CommandGroup heading="Members">
        {PEOPLE.map((person) => (
          <CommandItem
            key={person.key}
            value={person.name}
            onSelect={() => toast(person.name)}
            className="gap-3 px-3 py-2"
          >
            <Avatar size="sm">
              <AvatarFallback>{initials(person.name)}</AvatarFallback>
            </Avatar>
            <span className="min-w-0 flex-1">
              <span className="block truncate">{person.name}</span>
              <span className="block truncate text-xs text-muted-foreground">
                {person.email}
              </span>
            </span>
            <CommandShortcut>↵</CommandShortcut>
          </CommandItem>
        ))}
      </CommandGroup>
    </CommandList>
  </Command>
);
