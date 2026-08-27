import { Button } from '@antkit/react';
import { toast } from 'sonner';

import type { DemoMeta } from '../lib/types';

export const meta: DemoMeta = {
  imports: ['Toaster'],
  extraImports: ["import { toast } from 'sonner';"],
  api: [
    {
      title: 'Toaster',
      description:
        'Sonner’s toast host, already wired to the kit’s tokens and icons. Render it once near the app root; `toast()` itself is imported straight from `sonner`. A toast renders outside the React tree that called it, so it cannot read context — translate the copy before passing it in.',
      props: [
        {
          name: 'position',
          type: "'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'",
          default: "'bottom-right'",
          description: 'Which corner of the screen.',
        },
        {
          name: 'richColors',
          type: 'boolean',
          default: 'false',
          description:
            'Fills the background by toast type rather than using the popover background.',
        },
        {
          name: 'expand',
          type: 'boolean',
          default: 'false',
          description: 'Fans the stack out instead of layering it.',
        },
        {
          name: 'closeButton',
          type: 'boolean',
          default: 'false',
          description: 'A close button on every toast.',
        },
        {
          name: '…ToasterProps',
          type: 'ToasterProps',
          description: 'Every other Sonner prop passes straight through.',
        },
      ],
    },
    {
      title: 'toast()',
      description:
        'Imported from `sonner`. These are the forms you will actually use.',
      props: [
        {
          name: 'toast(message, options?)',
          type: '(message: ReactNode, options?: ExternalToast) => string | number',
          description:
            'A neutral toast. Returns the id, so it can be closed later.',
        },
        {
          name: 'toast.success / error / warning / info',
          type: 'as above',
          description: 'The four variants, each with its own icon.',
        },
        {
          name: 'options.description',
          type: 'ReactNode',
          description: 'The second line.',
        },
        {
          name: 'options.action',
          type: '{ label: ReactNode; onClick: () => void }',
          description:
            'The button on the right — this is the reason to pick toast over `message`.',
        },
        {
          name: 'options.duration',
          type: 'number',
          default: '4000',
          description: 'Milliseconds. `Infinity` keeps it up.',
        },
        {
          name: 'toast.promise(promise, msgs)',
          type: '(promise, { loading, success, error }) => void',
          description: 'Moves through all three states as the promise settles.',
        },
        {
          name: 'toast.dismiss(id?)',
          type: '(id?: string | number) => void',
          description: 'Closes one toast, or all of them when called bare.',
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
    <Button size="sm" onClick={() => toast.success('Saved')}>
      success
    </Button>
    <Button size="sm" variant="secondary" onClick={() => toast('Noted')}>
      default
    </Button>
    <Button
      size="sm"
      variant="secondary"
      onClick={() => toast.warning('A contract expires soon')}
    >
      warning
    </Button>
    <Button
      size="sm"
      variant="destructive"
      onClick={() => toast.error('Could not reach the server')}
    >
      error
    </Button>
  </>
);

/**
 * With a description and an action
 *
 * When all you need is a line saying "done", `message.success()` is tidier —
 * it needs no host in the tree and carries no buttons.
 */
export const WithAction = () => (
  <>
    <Button
      size="sm"
      onClick={() =>
        toast('Student deleted', {
          description: 'Sarah Chen · IELTS 6.5+',
          action: {
            label: 'Undo',
            onClick: () => toast.success('Restored'),
          },
        })
      }
    >
      Delete with undo
    </Button>

    <Button
      size="sm"
      variant="secondary"
      onClick={() =>
        toast.success('128 emails sent', {
          description: 'The "September intake" campaign has finished.',
        })
      }
    >
      With a description
    </Button>
  </>
);

/**
 * Following a promise
 *
 * All three states of an API call in a single call.
 */
export const Promise = () => (
  <Button
    size="sm"
    onClick={() =>
      toast.promise(
        new globalThis.Promise((resolve) => setTimeout(resolve, 1600)),
        {
          loading: 'Saving…',
          success: 'Changes saved',
          error: 'Could not save',
        },
      )
    }
  >
    Save (faked 1.6 seconds)
  </Button>
);

/**
 * Duration
 */
export const Duration = () => (
  <>
    <Button
      size="sm"
      variant="secondary"
      onClick={() => toast('Gone after one second', { duration: 1000 })}
    >
      One second
    </Button>
    <Button
      size="sm"
      variant="secondary"
      onClick={() => toast.error('Stays until closed', { duration: Infinity })}
    >
      Keep it up
    </Button>
    <Button size="sm" variant="ghost" onClick={() => toast.dismiss()}>
      Close all
    </Button>
  </>
);
