import { Button, notification } from '@antkit/react';
import { toast } from 'sonner';

import type { DemoMeta } from '../lib/types';

export const meta: DemoMeta = {
  imports: ['notification'],
  api: [
    {
      title: 'notification',
      description:
        'A 384px card in the corner of the screen, called imperatively like `message` but with room for a description and action buttons. When one transient line is all you need, `message` is tidier.',
      props: [
        {
          name: 'notification.success(config)',
          type: '(config: NotificationConfig) => void',
          description:
            'Plus `info`, `warning` and `error` — they differ in the icon.',
        },
        {
          name: 'notification.open(config)',
          type: '(config: NotificationConfig) => void',
          description: 'The full form, where you pick the `type`.',
        },
        {
          name: 'notification.destroy(key?)',
          type: '(key?: string) => void',
          description:
            'Closes one card by key, or all of them when called bare.',
        },
        {
          name: 'notification.config(defaults)',
          type: '(next: Partial<NotificationDefaults>) => void',
          description:
            'Changes the defaults for every later call — placement, duration and so on.',
        },
      ],
    },
    {
      title: 'NotificationConfig',
      props: [
        {
          name: 'message',
          type: 'ReactNode',
          description:
            'The heading line, named `message`, and not the body. Required.',
        },
        {
          name: 'description',
          type: 'ReactNode',
          description: 'The body.',
        },
        {
          name: 'type',
          type: "'success' | 'info' | 'warning' | 'error'",
          description: 'The icon and the colour.',
        },
        {
          name: 'duration',
          type: 'number',
          default: '4.5',
          description: 'Seconds before it closes itself. `0` keeps it up.',
        },
        {
          name: 'key',
          type: 'string',
          description:
            'Reusing a key replaces that card rather than stacking another.',
        },
        {
          name: 'icon',
          type: 'ReactNode | null',
          description: 'A glyph of your own, or `null` for a card with none.',
        },
        {
          name: 'placement',
          type: "'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'",
          default: "'topRight'",
          description: 'Which corner of the screen.',
        },
        {
          name: 'btn',
          type: 'ReactNode',
          description:
            'The action row under the description — usually one or two `Button`s.',
        },
        {
          name: 'showProgress',
          type: 'boolean',
          default: 'false',
          description:
            'Draws the time remaining as a bar along the bottom of the card.',
        },
        {
          name: 'pauseOnHover',
          type: 'boolean',
          default: 'true',
          description: 'Stops the timer while the pointer is over the card.',
        },
        {
          name: 'closable',
          type: 'boolean',
          default: 'true',
          description: 'The close button in the corner.',
        },
        {
          name: 'onClick / onClose',
          type: '() => void',
          description: 'A click on the card, and the moment it disappears.',
        },
      ],
    },
  ],
};

/**
 * Four types
 */
export const Types = () => (
  <>
    <Button
      size="sm"
      onClick={() =>
        notification.success({
          message: 'Campaign saved',
          description: 'Sending starts at 09:00 tomorrow.',
        })
      }
    >
      success
    </Button>
    <Button
      size="sm"
      variant="secondary"
      onClick={() =>
        notification.info({
          message: 'An update is available',
          description: 'Version 2.0 is ready to install.',
        })
      }
    >
      info
    </Button>
    <Button
      size="sm"
      variant="secondary"
      onClick={() =>
        notification.warning({
          message: 'Import incomplete',
          description: 'Three rows were skipped for a missing email.',
        })
      }
    >
      warning
    </Button>
    <Button
      size="sm"
      variant="destructive"
      onClick={() =>
        notification.error({
          message: 'Could not send',
          description:
            'The SMTP server refused the connection. Check the settings.',
        })
      }
    >
      error
    </Button>
  </>
);

/**
 * With an action button
 *
 * This is the big difference from `message`: the card has room for a button or
 * two.
 */
export const WithButton = () => (
  <Button
    size="sm"
    onClick={() =>
      notification.open({
        type: 'info',
        message: 'Three students deleted',
        description: 'You can undo this for the next 10 seconds.',
        duration: 10,
        showProgress: true,
        btn: (
          <Button size="sm" variant="secondary" onClick={() => toast('Undone')}>
            Undo
          </Button>
        ),
      })
    }
  >
    Delete with undo
  </Button>
);

/**
 * Duration and the progress bar
 *
 * `duration: 0` holds the card until it is closed; `showProgress` draws the
 * time remaining, and hovering stops the clock.
 */
export const Duration = () => (
  <>
    <Button
      size="sm"
      variant="secondary"
      onClick={() =>
        notification.warning({
          message: 'With a progress bar',
          description: 'Hover to stop the timer.',
          showProgress: true,
        })
      }
    >
      showProgress
    </Button>
    <Button
      size="sm"
      variant="destructive"
      onClick={() =>
        notification.error({
          message: 'Never closes itself',
          description: 'It has to be dismissed by hand.',
          duration: 0,
        })
      }
    >
      duration: 0
    </Button>
  </>
);

/**
 * Placement
 *
 * Set per card, or change the default for the whole app with
 * `notification.config`.
 */
export const Placement = () => (
  <>
    {(['topLeft', 'topRight', 'bottomLeft', 'bottomRight'] as const).map(
      (placement) => (
        <Button
          key={placement}
          size="sm"
          variant="secondary"
          onClick={() =>
            notification.info({
              message: placement,
              description: `placement="${placement}"`,
              placement,
            })
          }
        >
          {placement}
        </Button>
      ),
    )}
  </>
);

/**
 * Replacing by key
 */
export const ByKey = () => (
  <>
    <Button
      size="sm"
      onClick={() => {
        notification.open({
          key: 'import',
          type: 'info',
          message: 'Importing…',
          description: '0 / 128 records',
          duration: 0,
        });

        setTimeout(
          () =>
            notification.open({
              key: 'import',
              type: 'success',
              message: 'Import complete',
              description: '128 / 128 records',
            }),
          1800,
        );
      }}
    >
      Import data
    </Button>

    <Button size="sm" variant="ghost" onClick={() => notification.destroy()}>
      Close all
    </Button>
  </>
);
