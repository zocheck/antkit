import { useState } from 'react';

import { Badge, Tabs, TabsContent, TabsList, TabsTrigger } from '@antkit/react';
import { BellIcon, CreditCardIcon, UserRoundIcon } from 'lucide-react';

import type { DemoMeta } from '../lib/types';

export const meta: DemoMeta = {
  imports: ['Tabs', 'TabsList', 'TabsTrigger', 'TabsContent'],
  api: [
    {
      title: 'Tabs',
      description: 'Wraps Radix Tabs and takes every prop the primitive does.',
      props: [
        {
          name: 'defaultValue',
          type: 'string',
          description: 'The tab that starts open when uncontrolled.',
        },
        {
          name: 'value',
          type: 'string',
          description: 'The open tab, when you hold the state yourself.',
        },
        {
          name: 'onValueChange',
          type: '(value: string) => void',
          description: 'Called when the tab changes.',
        },
        {
          name: 'orientation',
          type: "'horizontal' | 'vertical'",
          default: "'horizontal'",
          description:
            'vertical stacks the tab list into a column beside the content.',
        },
        {
          name: 'activationMode',
          type: "'automatic' | 'manual'",
          default: "'automatic'",
          description:
            'automatic switches as the arrow keys pass over a tab; manual waits for Enter or Space.',
        },
      ],
    },
    {
      title: 'TabsList',
      props: [
        {
          name: 'variant',
          type: "'default' | 'underline'",
          default: "'default'",
          description:
            'default is a rounded filled strip; underline rules the open tab instead.',
        },
      ],
    },
    {
      title: 'TabsTrigger / TabsContent',
      props: [
        {
          name: 'value',
          type: 'string',
          description:
            'The key tying a trigger to its content. Required on both.',
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Locks one tab (TabsTrigger only).',
        },
        {
          name: 'forceMount',
          type: 'boolean',
          description:
            'Keeps the content mounted while the tab is closed — needed when it holds an unsaved form (TabsContent only).',
        },
      ],
    },
  ],
};

/**
 * Basic
 */
export const Basic = () => (
  <Tabs defaultValue="overview" className="w-full max-w-lg">
    <TabsList>
      <TabsTrigger value="overview">Overview</TabsTrigger>
      <TabsTrigger value="activity">Activity</TabsTrigger>
      <TabsTrigger value="locked" disabled>
        Locked
      </TabsTrigger>
    </TabsList>
    <TabsContent value="overview" className="pt-3 text-sm">
      General details for this student.
    </TabsContent>
    <TabsContent value="activity" className="pt-3 text-sm">
      Attendance and assignment history.
    </TabsContent>
  </Tabs>
);

/**
 * variant="underline"
 *
 * Underlined tabs suit a detail page, where the default variant's filled strip
 * competes with the other blocks on the page.
 */
export const Underline = () => (
  <Tabs defaultValue="info" className="w-full max-w-lg">
    <TabsList variant="underline">
      <TabsTrigger value="info">Details</TabsTrigger>
      <TabsTrigger value="payment">Payment</TabsTrigger>
      <TabsTrigger value="notes">Notes</TabsTrigger>
    </TabsList>
    <TabsContent value="info" className="pt-3 text-sm">
      Name, contact details, account manager.
    </TabsContent>
    <TabsContent value="payment" className="pt-3 text-sm">
      Paid $12,500 of $15,000.
    </TabsContent>
    <TabsContent value="notes" className="pt-3 text-sm">
      Prefers evening calls.
    </TabsContent>
  </Tabs>
);

/**
 * With icons and a count
 */
export const WithIcons = () => (
  <Tabs defaultValue="profile" className="w-full max-w-lg">
    <TabsList variant="underline">
      <TabsTrigger value="profile">
        <UserRoundIcon />
        Profile
      </TabsTrigger>
      <TabsTrigger value="billing">
        <CreditCardIcon />
        Billing
      </TabsTrigger>
      <TabsTrigger value="alerts">
        <BellIcon />
        Reminders
        <Badge variant="muted">3</Badge>
      </TabsTrigger>
    </TabsList>
    <TabsContent value="profile" className="pt-3 text-sm">
      Profile.
    </TabsContent>
    <TabsContent value="billing" className="pt-3 text-sm">
      Billing.
    </TabsContent>
    <TabsContent value="alerts" className="pt-3 text-sm">
      Three reminders waiting.
    </TabsContent>
  </Tabs>
);

/**
 * Vertical
 *
 * `orientation="vertical"` stands the tab list beside the content, and the
 * up/down arrows navigate instead of left/right.
 */
export const Vertical = () => (
  <Tabs
    defaultValue="general"
    orientation="vertical"
    className="w-full max-w-lg"
  >
    <TabsList variant="underline" className="w-40">
      <TabsTrigger value="general">General</TabsTrigger>
      <TabsTrigger value="security">Security</TabsTrigger>
      <TabsTrigger value="team">Team</TabsTrigger>
    </TabsList>
    <TabsContent value="general" className="px-4 text-sm">
      Organisation name, time zone, language.
    </TabsContent>
    <TabsContent value="security" className="px-4 text-sm">
      Two-factor authentication, active sessions.
    </TabsContent>
    <TabsContent value="team" className="px-4 text-sm">
      12 members, 3 invitations pending.
    </TabsContent>
  </Tabs>
);

/**
 * Controlled
 *
 * Pass `value` and `onValueChange` when the tab has to stay in step with the
 * URL, or with a button somewhere else on the page.
 */
export const Controlled = () => {
  const [tab, setTab] = useState('one');

  return (
    <div className="grid w-full max-w-lg gap-3">
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="one">Step 1</TabsTrigger>
          <TabsTrigger value="two">Step 2</TabsTrigger>
        </TabsList>
        <TabsContent value="one" className="pt-3 text-sm">
          Step 1 content.
        </TabsContent>
        <TabsContent value="two" className="pt-3 text-sm">
          Step 2 content.
        </TabsContent>
      </Tabs>
      <p className="text-xs text-muted-foreground">Open: {tab}</p>
    </div>
  );
};
