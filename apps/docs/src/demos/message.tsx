import { Button, message } from '@antkit/react';

import type { DemoMeta } from '../lib/types';

export const meta: DemoMeta = {
  imports: ['message', 'MessageProvider'],
  api: [
    {
      title: 'message',
      description:
        'A module-level store, so `message.success()` works from anywhere — including a service with no component in scope. It needs a `<MessageProvider />` rendered somewhere in the app, or the call goes quiet.',
      props: [
        {
          name: 'message.success(content, duration?)',
          type: '(content: ReactNode, duration?: number) => () => void',
          description:
            'Returns a function that closes it by hand. `duration` is in seconds; `0` keeps it until closed.',
        },
        {
          name: 'message.info / warning / error / loading',
          type: 'as above',
          description: 'The other four types, differing in icon and colour.',
        },
        {
          name: 'message.open(config)',
          type: '(config: MessageConfig) => () => void',
          description:
            'The full form, which also takes `key`, `icon` and `onClose`.',
        },
        {
          name: 'message.destroy(key?)',
          type: '(key?: string) => void',
          description:
            'Closes one message by key, or all of them when called bare.',
        },
      ],
    },
    {
      title: 'MessageConfig',
      props: [
        {
          name: 'content',
          type: 'ReactNode',
          description: 'The content. Required.',
        },
        {
          name: 'type',
          type: "'success' | 'info' | 'warning' | 'error' | 'loading'",
          default: "'info'",
          description: 'The type, which decides the icon.',
        },
        {
          name: 'duration',
          type: 'number',
          default: '3',
          description: 'Seconds before it disappears. `0` keeps it up.',
        },
        {
          name: 'key',
          type: 'string',
          description:
            'Reusing a key replaces that message rather than stacking a second one.',
        },
        {
          name: 'icon',
          type: 'ReactNode',
          description: 'Replaces the icon for that `type`.',
        },
        {
          name: 'onClose',
          type: '() => void',
          description: 'Called when the message goes away.',
        },
      ],
    },
  ],
};

/**
 * Five types
 *
 * All four share a circle, so the row of icons keeps a single silhouette.
 */
export const Types = () => (
  <>
    <Button size="sm" onClick={() => message.success('Saved')}>
      success
    </Button>
    <Button
      size="sm"
      variant="secondary"
      onClick={() => message.info('An update is available')}
    >
      info
    </Button>
    <Button
      size="sm"
      variant="secondary"
      onClick={() => message.warning('Running low on storage')}
    >
      warning
    </Button>
    <Button
      size="sm"
      variant="destructive"
      onClick={() => message.error('Could not reach the server')}
    >
      error
    </Button>
    <Button
      size="sm"
      variant="outline"
      onClick={() => message.loading('Loading…')}
    >
      loading
    </Button>
  </>
);

/**
 * Duration
 *
 * The second argument is in seconds. `0` keeps the message up until you close
 * it — the returned function is what closes it.
 */
export const Duration = () => (
  <>
    <Button
      size="sm"
      variant="secondary"
      onClick={() => message.info('Gone after one second', 1)}
    >
      One second
    </Button>
    <Button
      size="sm"
      variant="secondary"
      onClick={() => {
        const hide = message.loading('Held for three seconds, then closed', 0);
        setTimeout(hide, 3000);
      }}
    >
      Close it by hand
    </Button>
  </>
);

/**
 * Replacing by key
 *
 * Reusing a `key` updates the message already on screen — a "syncing → done"
 * flow takes only one row.
 */
export const ByKey = () => (
  <Button
    size="sm"
    onClick={() => {
      message.open({
        key: 'sync',
        type: 'loading',
        content: 'Syncing…',
        duration: 0,
      });

      setTimeout(() => {
        message.open({
          key: 'sync',
          type: 'success',
          content: '128 records synced',
        });
      }, 1500);
    }}
  >
    Sync
  </Button>
);

/**
 * Closing them all
 */
export const Destroy = () => (
  <>
    <Button
      size="sm"
      variant="secondary"
      onClick={() => {
        message.info('One', 0);
        message.info('Two', 0);
        message.info('Three', 0);
      }}
    >
      Open three
    </Button>
    <Button size="sm" variant="ghost" onClick={() => message.destroy()}>
      Close all
    </Button>
  </>
);
