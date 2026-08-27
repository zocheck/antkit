import { useState } from 'react';

import {
  Button,
  Input,
  Label,
  Select,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@antkit/react';
import { toast } from 'sonner';

import type { DemoMeta } from '../lib/types';

export const meta: DemoMeta = {
  imports: [
    'Sheet',
    'SheetTrigger',
    'SheetContent',
    'SheetHeader',
    'SheetTitle',
    'SheetDescription',
    'SheetFooter',
    'SheetClose',
  ],
  api: [
    {
      title: 'Sheet',
      description:
        'A panel sliding in from an edge of the screen, built on Radix Dialog. Use `Modal` for a dialog in the middle — it turns into a sheet on narrow screens anyway.',
      props: [
        {
          name: 'open / defaultOpen / onOpenChange',
          type: 'boolean | (open: boolean) => void',
          description: 'Controls the open state.',
        },
        {
          name: 'modal',
          type: 'boolean',
          default: 'true',
          description:
            'Locks interaction with the rest of the page while it is open.',
        },
      ],
    },
    {
      title: 'SheetContent',
      props: [
        {
          name: 'side',
          type: "'top' | 'right' | 'bottom' | 'left'",
          default: "'right'",
          description: 'The edge the panel slides in from.',
        },
        {
          name: 'showCloseButton',
          type: 'boolean',
          default: 'true',
          description: 'The X in the top right corner.',
        },
        {
          name: 'className',
          type: 'string',
          description:
            'Width and padding — three quarters of the screen by default, capped at sm.',
        },
      ],
    },
    {
      title:
        'SheetHeader / SheetTitle / SheetDescription / SheetFooter / SheetClose',
      props: [
        {
          name: 'SheetTitle',
          type: "ComponentProps<'h2'>",
          description:
            'The panel’s name. Screen readers need it — Radix warns when it is missing.',
        },
        {
          name: 'SheetDescription',
          type: "ComponentProps<'p'>",
          description: 'The description line, also read out.',
        },
        {
          name: 'SheetClose',
          type: 'ReactNode',
          description:
            'Closes the panel from inside. `asChild` to use a button of your own.',
        },
      ],
    },
  ],
};

/**
 * Basic
 */
export const Basic = () => (
  <Sheet>
    <SheetTrigger asChild>
      <Button variant="secondary">Open panel</Button>
    </SheetTrigger>
    <SheetContent className="p-6">
      <SheetHeader className="p-0">
        <SheetTitle>Filters</SheetTitle>
        <SheetDescription>
          Narrow the student list by class and status.
        </SheetDescription>
      </SheetHeader>
    </SheetContent>
  </Sheet>
);

/**
 * Four edges
 */
export const Sides = () => (
  <>
    {(['left', 'right', 'top', 'bottom'] as const).map((side) => (
      <Sheet key={side}>
        <SheetTrigger asChild>
          <Button variant="secondary" size="sm">
            {side}
          </Button>
        </SheetTrigger>
        <SheetContent side={side} className="p-6">
          <SheetHeader className="p-0">
            <SheetTitle>side="{side}"</SheetTitle>
            <SheetDescription>
              The panel slides in from the {side}.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    ))}
  </>
);

/**
 * Holding a form
 *
 * A sheet suits a secondary form where the context behind still matters —
 * filters, or a quick edit of one record.
 */
export const WithForm = () => (
  <Sheet>
    <SheetTrigger asChild>
      <Button>Edit student</Button>
    </SheetTrigger>
    <SheetContent className="flex flex-col gap-0 p-6">
      <SheetHeader className="p-0">
        <SheetTitle>Edit student</SheetTitle>
        <SheetDescription>
          Changes are saved as soon as you press Save.
        </SheetDescription>
      </SheetHeader>

      <div className="grid flex-1 content-start gap-4 py-6">
        <div className="grid gap-2">
          <Label htmlFor="sheet-name">Full name</Label>
          <Input id="sheet-name" defaultValue="Sarah Chen" />
        </div>
        <div className="grid gap-2">
          <Label>Course</Label>
          <Select
            options={[
              { label: 'IELTS 6.5+', value: 'ielts' },
              { label: 'TOEIC 750', value: 'toeic' },
            ]}
            defaultValue="ielts"
          />
        </div>
      </div>

      <SheetFooter className="flex-row justify-end gap-2 p-0">
        <SheetClose asChild>
          <Button variant="ghost">Cancel</Button>
        </SheetClose>
        <SheetClose asChild>
          <Button onClick={() => toast.success('Saved')}>Save</Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  </Sheet>
);

/**
 * Controlled
 */
export const Controlled = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center gap-3">
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open from code
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="p-6">
          <SheetHeader className="p-0">
            <SheetTitle>A controlled panel</SheetTitle>
            <SheetDescription>
              The state lives in the parent, so anything can open it.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
};

/**
 * A width of your own
 *
 * The panel is three quarters of the screen by default, capped at `sm`;
 * `className` overrides both.
 */
export const Width = () => (
  <Sheet>
    <SheetTrigger asChild>
      <Button variant="secondary">Wide panel</Button>
    </SheetTrigger>
    <SheetContent className="p-6 sm:max-w-xl">
      <SheetHeader className="p-0">
        <SheetTitle>A wider panel</SheetTitle>
        <SheetDescription>
          For when it holds a table or a multi-column form.
        </SheetDescription>
      </SheetHeader>
    </SheetContent>
  </Sheet>
);
