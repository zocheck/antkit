import { Alert, Button } from '@antkit/react';
import { RocketIcon } from 'lucide-react';
import { toast } from 'sonner';

import type { DemoMeta } from '../lib/types';

export const meta: DemoMeta = {
  imports: ['Alert'],
  api: [
    {
      title: 'Alert',
      description:
        'A notice that lives in the page. Use `message` for something transient, and `notification` for a card in the corner with actions on it. Takes every prop a <div> does except `title`.',
      props: [
        {
          name: 'message',
          type: 'ReactNode',
          description:
            'The heading line, named `message`; the body under it is `description`. Required.',
        },
        {
          name: 'description',
          type: 'ReactNode',
          description:
            'The second line. With it the alert switches to its taller layout.',
        },
        {
          name: 'type',
          type: "'success' | 'info' | 'warning' | 'error'",
          default: "'info'",
          description:
            'The state, which decides the background colour and the icon.',
        },
        {
          name: 'showIcon',
          type: 'boolean',
          default: 'false',
          description: 'Shows the icon that goes with `type`.',
        },
        {
          name: 'icon',
          type: 'ReactNode',
          description: 'Replaces the default icon for that `type`.',
        },
        {
          name: 'closable',
          type: 'boolean',
          default: 'false',
          description:
            'Adds the close button. The alert removes itself from the tree before calling back.',
        },
        {
          name: 'onClose',
          type: '() => void',
          description: 'Called when the close button is pressed.',
        },
        {
          name: 'afterClose',
          type: '() => void',
          description: 'Called once the alert has left the tree.',
        },
        {
          name: 'banner',
          type: 'boolean',
          default: 'false',
          description:
            'A full-width strip with no radius — for a notice at system level.',
        },
        {
          name: 'action',
          type: 'ReactNode',
          description: 'A button pinned to the right edge.',
        },
      ],
    },
  ],
};

/**
 * Four states
 */
export const Types = () => (
  <div className="grid w-full gap-3">
    <Alert type="info" message="The term start dates have been updated." />
    <Alert type="success" message="Your changes are saved." />
    <Alert type="warning" message="Three contracts expire this week." />
    <Alert type="error" message="Could not email 2 students." />
  </div>
);

/**
 * With an icon
 */
export const WithIcon = () => (
  <div className="grid w-full gap-3">
    <Alert showIcon type="info" message="An update is available." />
    <Alert showIcon type="success" message="128 records synced." />
    <Alert showIcon type="warning" message="Storage is below 10%." />
    <Alert showIcon type="error" message="Could not reach the server." />
  </div>
);

/**
 * With a description
 *
 * Adding `description` switches the alert to its taller two-line layout.
 */
export const WithDescription = () => (
  <Alert
    className="w-full"
    showIcon
    type="warning"
    message="Contracts expiring soon"
    description="Three contracts expire this week. Renew before 30 August to keep the current rate."
  />
);

/**
 * Closable, and with an action
 *
 * The alert removes itself from the tree before calling back. To drive it
 * yourself, leave `closable` off and unmount the component.
 */
export const Closable = () => (
  <div className="grid w-full gap-3">
    <Alert
      closable
      showIcon
      type="info"
      message="You have 2 things to deal with today."
      onClose={() => toast('Closed')}
    />

    <Alert
      showIcon
      type="warning"
      message="Contracts expiring soon"
      description="Three contracts expire this week."
      action={
        <Button size="sm" variant="ghost">
          View
        </Button>
      }
    />
  </div>
);

/**
 * A full-width banner
 *
 * `banner` drops the radius and fills the parent — its place is directly under
 * the navigation bar.
 */
export const Banner = () => (
  <div className="w-full overflow-hidden rounded-lg border">
    <Alert
      banner
      showIcon
      type="info"
      message="Scheduled maintenance tonight from 22:00 to 23:00."
    />
    <div className="p-4 text-sm text-muted-foreground">Page content.</div>
  </div>
);

/**
 * A custom icon
 */
export const CustomIcon = () => (
  <Alert
    className="w-full"
    showIcon
    icon={<RocketIcon />}
    type="success"
    message="Version 2.0 is live"
    description="See what changed in the release notes."
  />
);
