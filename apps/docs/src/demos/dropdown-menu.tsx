import { useState } from 'react';

import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@antkit/react';
import {
  ChevronDownIcon,
  CopyIcon,
  MoreVerticalIcon,
  PencilIcon,
  TrashIcon,
  UserRoundIcon,
} from 'lucide-react';
import { toast } from 'sonner';

import type { DemoMeta } from '../lib/types';

export const meta: DemoMeta = {
  imports: [
    'DropdownMenu',
    'DropdownMenuTrigger',
    'DropdownMenuContent',
    'DropdownMenuItem',
    'DropdownMenuLabel',
    'DropdownMenuSeparator',
    'DropdownMenuGroup',
    'DropdownMenuShortcut',
    'DropdownMenuCheckboxItem',
    'DropdownMenuRadioGroup',
    'DropdownMenuRadioItem',
    'DropdownMenuSub',
    'DropdownMenuSubTrigger',
    'DropdownMenuSubContent',
  ],
  api: [
    {
      title: 'DropdownMenu / DropdownMenuTrigger / DropdownMenuContent',
      description:
        'Wraps Radix DropdownMenu and takes every prop the primitive does.',
      props: [
        {
          name: 'open',
          type: 'boolean',
          description: 'The controlled open state, set on DropdownMenu.',
        },
        {
          name: 'onOpenChange',
          type: '(open: boolean) => void',
          description: 'Called when the menu opens or closes.',
        },
        {
          name: 'modal',
          type: 'boolean',
          default: 'true',
          description:
            'true locks background scrolling while the menu is open. Set false when the menu sits in a scroll area that has to keep scrolling.',
        },
        {
          name: 'asChild',
          type: 'boolean',
          description:
            'On Trigger: use the child element as the trigger rather than nesting <button>s.',
        },
        {
          name: 'align',
          type: "'start' | 'center' | 'end'",
          default: "'center'",
          description: 'Aligns the menu against the trigger, set on Content.',
        },
        {
          name: 'side',
          type: "'top' | 'right' | 'bottom' | 'left'",
          default: "'bottom'",
          description: 'Which side it opens on, set on Content.',
        },
        {
          name: 'sideOffset',
          type: 'number',
          default: '4',
          description: 'Distance in px between the menu and the trigger.',
        },
      ],
    },
    {
      title: 'DropdownMenuItem',
      props: [
        {
          name: 'variant',
          type: "'default' | 'destructive'",
          default: "'default'",
          description: 'destructive paints the text and icon red.',
        },
        {
          name: 'inset',
          type: 'boolean',
          default: 'false',
          description:
            'Indents 32px so it lines up with items that carry a tick box or a radio dot.',
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Locks the item.',
        },
        {
          name: 'onSelect',
          type: '(event: Event) => void',
          description:
            'Runs on selection. Call `event.preventDefault()` to stop the menu closing.',
        },
      ],
    },
  ],
};

/**
 * Basic
 */
export const Basic = () => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="secondary" suffix={<ChevronDownIcon />}>
        Actions
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="start">
      <DropdownMenuItem onSelect={() => toast('View details')}>
        View details
      </DropdownMenuItem>
      <DropdownMenuItem>Duplicate</DropdownMenuItem>
      <DropdownMenuItem disabled>Archive (not available)</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

/**
 * Labels, groups and shortcuts
 *
 * `DropdownMenuShortcut` only prints the text — the real shortcut is still
 * yours to register.
 */
export const Grouped = () => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="secondary" prefix={<UserRoundIcon />}>
        Account
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="start" className="w-56">
      <DropdownMenuLabel>Dana Whitfield</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem>
          <PencilIcon />
          Edit profile
          <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CopyIcon />
          Copy ID
          <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem variant="destructive">
        <TrashIcon />
        Delete account
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

/**
 * Checkboxes in a menu
 *
 * `onSelect` blocks the close so several boxes can be ticked in a row.
 */
export const Checkboxes = () => {
  const [columns, setColumns] = useState(['email', 'phone']);

  const toggle = (key: string) =>
    setColumns((current) =>
      current.includes(key)
        ? current.filter((entry) => entry !== key)
        : [...current, key],
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" suffix={<ChevronDownIcon />}>
          Columns ({columns.length})
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuLabel>Show columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {[
          { key: 'email', label: 'Email' },
          { key: 'phone', label: 'Phone' },
          { key: 'advisor', label: 'Account manager' },
        ].map((column) => (
          <DropdownMenuCheckboxItem
            key={column.key}
            checked={columns.includes(column.key)}
            onSelect={(event) => event.preventDefault()}
            onCheckedChange={() => toggle(column.key)}
          >
            {column.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

/**
 * Radios in a menu
 */
export const Radios = () => {
  const [sort, setSort] = useState('newest');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" suffix={<ChevronDownIcon />}>
          Sort
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
          <DropdownMenuRadioItem value="newest">Newest</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="oldest">Oldest</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="name">By name</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

/**
 * Submenus
 */
export const Submenu = () => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon" aria-label="More actions">
        <MoreVerticalIcon />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="start" className="w-52">
      <DropdownMenuItem>View details</DropdownMenuItem>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>Move to class</DropdownMenuSubTrigger>
        <DropdownMenuSubContent>
          <DropdownMenuItem>IELTS 6.5+</DropdownMenuItem>
          <DropdownMenuItem>TOEIC 750</DropdownMenuItem>
          <DropdownMenuItem>Beginner conversation</DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuSub>
      <DropdownMenuSeparator />
      <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);
