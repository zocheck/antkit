import { useState } from 'react';

import {
  Button,
  Input,
  Label,
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
  Slider,
} from '@antkit/react';
import { SettingsIcon } from 'lucide-react';

import type { DemoMeta } from '../lib/types';

export const meta: DemoMeta = {
  imports: ['Popover', 'PopoverTrigger', 'PopoverContent', 'PopoverAnchor'],
  api: [
    {
      title: 'Popover',
      description:
        'Wraps Radix Popover. Use `Tooltip` for a line of explanation, `Popconfirm` to ask for confirmation, and `DropdownMenu` for a list of actions.',
      props: [
        {
          name: 'open / defaultOpen / onOpenChange',
          type: 'boolean | (open: boolean) => void',
          description: 'Controls the open state.',
        },
        {
          name: 'modal',
          type: 'boolean',
          default: 'false',
          description:
            'true locks scrolling and traps focus inside — only needed when the popover is standing in for a small dialog.',
        },
      ],
    },
    {
      title: 'PopoverTrigger / PopoverContent / PopoverAnchor',
      props: [
        {
          name: 'asChild',
          type: 'boolean',
          description:
            'On Trigger: use the child element as the trigger, avoiding nested <button>s.',
        },
        {
          name: 'align',
          type: "'start' | 'center' | 'end'",
          default: "'start'",
          description: 'Aligns the content against the trigger.',
        },
        {
          name: 'side',
          type: "'top' | 'right' | 'bottom' | 'left'",
          default: "'bottom'",
          description: 'Which side it opens on.',
        },
        {
          name: 'sideOffset',
          type: 'number',
          default: '4',
          description: 'Distance from the trigger, in px.',
        },
        {
          name: 'PopoverAnchor',
          type: 'ReactNode',
          description:
            'Anchors the popover to something other than the trigger — opened by a button but aligned to a whole field, say.',
        },
      ],
    },
  ],
};

/**
 * Basic
 */
export const Basic = () => (
  <Popover>
    <PopoverTrigger asChild>
      <Button variant="secondary">Open popover</Button>
    </PopoverTrigger>
    <PopoverContent className="w-64 p-4 text-sm">
      Any content: text, an image, or a small form.
    </PopoverContent>
  </Popover>
);

/**
 * Holding controls
 *
 * This is where it differs from `Tooltip`: a popover takes focus, so it can
 * hold fields and buttons.
 */
export const WithForm = () => {
  const [width, setWidth] = useState(240);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" prefix={<SettingsIcon />}>
          Column settings
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-4">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="popover-name">Column name</Label>
            <Input id="popover-name" defaultValue="Full name" />
          </div>

          <div className="grid gap-2">
            <Label>Width: {width}px</Label>
            <Slider
              min={120}
              max={480}
              value={width}
              onChange={(value) => setWidth(value as number)}
            />
          </div>

          <Button size="sm">Apply</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

/**
 * Placement
 */
export const Placement = () => (
  <>
    {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
      <Popover key={side}>
        <PopoverTrigger asChild>
          <Button variant="secondary" size="sm">
            {side}
          </Button>
        </PopoverTrigger>
        <PopoverContent side={side} align="center" className="p-3 text-sm">
          side="{side}"
        </PopoverContent>
      </Popover>
    ))}
  </>
);

/**
 * Anchored elsewhere
 *
 * `PopoverAnchor` separates what opens it from what it aligns to: the button
 * is on the right, but the popover lines up with the whole field.
 */
export const Anchor = () => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div className="flex w-full max-w-sm gap-2">
          <Input placeholder="Enter a student ID" />
          <Button variant="secondary" onClick={() => setOpen(!open)}>
            Suggest
          </Button>
        </div>
      </PopoverAnchor>
      <PopoverContent className="w-full max-w-sm p-3 text-sm">
        The popover aligns to the whole row above, not to the button alone.
      </PopoverContent>
    </Popover>
  );
};

/**
 * Controlled
 */
export const Controlled = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center gap-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="secondary">Trigger</Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-3 text-sm">
          The button beside it can close this too.
        </PopoverContent>
      </Popover>

      <Button size="sm" variant="ghost" onClick={() => setOpen(!open)}>
        {open ? 'Close' : 'Open'} from outside
      </Button>
    </div>
  );
};
