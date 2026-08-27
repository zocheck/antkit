import { useState } from 'react';

import {
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@antkit/react';
import { ChevronDownIcon } from 'lucide-react';

import type { DemoMeta } from '../lib/types';

const FAQ = [
  {
    question: 'Can tuition be paid in instalments?',
    answer:
      'Yes. Two instalments: the first before the course starts, the second before session 12.',
  },
  {
    question: 'What happens if I miss a session?',
    answer:
      'Sit in on any class at the same level within four weeks, as many times as you need.',
  },
];

export const meta: DemoMeta = {
  imports: ['Collapsible', 'CollapsibleTrigger', 'CollapsibleContent'],
  api: [
    {
      title: 'Collapsible',
      description:
        'Wraps Radix Collapsible. Use `Tabs` for several panels where one is always open, and `Sheet` or `Modal` when the content should sit above the page rather than push it down.',
      props: [
        {
          name: 'open',
          type: 'boolean',
          description: 'The controlled open state.',
        },
        {
          name: 'defaultOpen',
          type: 'boolean',
          default: 'false',
          description: 'The starting state when uncontrolled.',
        },
        {
          name: 'onOpenChange',
          type: '(open: boolean) => void',
          description: 'Called when it opens or closes.',
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Locks it — it can no longer be opened or closed.',
        },
      ],
    },
    {
      title: 'CollapsibleTrigger / CollapsibleContent',
      props: [
        {
          name: 'asChild',
          type: 'boolean',
          description:
            'The trigger renders a <button> by default; `asChild` lets you supply your own element.',
        },
        {
          name: 'forceMount',
          type: 'boolean',
          description:
            'On Content: keeps it mounted while closed — needed when it holds an unsaved form.',
        },
      ],
    },
  ],
};

/**
 * Basic
 */
export const Basic = () => (
  <Collapsible className="w-full max-w-md rounded-md border p-3">
    <CollapsibleTrigger className="w-full cursor-pointer text-left text-sm font-medium">
      Order details (click to open)
    </CollapsibleTrigger>
    <CollapsibleContent className="pt-2 text-sm text-muted-foreground">
      Content that shows and hides. This is also what submenus in Tree and
      Sidebar are built on.
    </CollapsibleContent>
  </Collapsible>
);

/**
 * A trigger of your own
 *
 * `asChild` uses `Button` itself as the trigger, keeping its styling.
 */
export const CustomTrigger = () => {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="w-full max-w-md rounded-md border p-3"
    >
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-between"
          suffix={
            <ChevronDownIcon
              className={`transition-transform ${open ? 'rotate-180' : ''}`}
            />
          }
        >
          Advanced settings
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="px-2 pt-3 text-sm text-muted-foreground">
        The options most people never need to touch.
      </CollapsibleContent>
    </Collapsible>
  );
};

/**
 * A list of questions
 *
 * Several independent `Collapsible`s: opening one does not close another.
 */
export const Faq = () => (
  <div className="grid w-full max-w-md gap-2">
    {FAQ.map((item) => (
      <Collapsible key={item.question} className="rounded-md border p-3">
        <CollapsibleTrigger className="flex w-full cursor-pointer items-center justify-between gap-3 text-left text-sm font-medium">
          {item.question}
          <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 text-sm text-muted-foreground">
          {item.answer}
        </CollapsibleContent>
      </Collapsible>
    ))}
  </div>
);

/**
 * Open to start with
 */
export const DefaultOpen = () => (
  <Collapsible defaultOpen className="w-full max-w-md rounded-md border p-3">
    <CollapsibleTrigger className="w-full cursor-pointer text-left text-sm font-medium">
      Open already
    </CollapsibleTrigger>
    <CollapsibleContent className="pt-2 text-sm text-muted-foreground">
      Click the heading to fold it away.
    </CollapsibleContent>
  </Collapsible>
);
