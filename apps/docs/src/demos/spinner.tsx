import { Button, Card, CardContent, Spinner } from '@antkit/react';

import type { DemoMeta } from '../lib/types';

export const meta: DemoMeta = {
  imports: ['Spinner'],
  api: [
    {
      title: 'Spinner',
      description:
        'Takes every prop an <svg> does. `Button` already has its own `loading` prop — never put a `Spinner` inside a button. `Skeleton` is better when the shape of what is coming is known, and `Progress` when the progress is.',
      props: [
        {
          name: 'className',
          type: 'string',
          description:
            'Size and colour, like any other icon: `size-6`, `text-muted-foreground`.',
        },
        {
          name: 'aria-label',
          type: 'string',
          default: "'Loading'",
          description:
            'The component carries `role="status"` and an English label; pass your own to translate it.',
        },
      ],
    },
  ],
};

/**
 * Size and colour
 */
export const Sizes = () => (
  <>
    <Spinner className="size-4" aria-label="Loading" />
    <Spinner className="size-6 text-primary" aria-label="Loading" />
    <Spinner className="size-8 text-muted-foreground" aria-label="Loading" />
  </>
);

/**
 * Covering a block
 *
 * The common shape: a translucent layer over the old content while it reloads.
 */
export const Overlay = () => (
  <Card className="relative w-full max-w-sm">
    <CardContent className="text-sm text-muted-foreground">
      This content is reloading. The previous data is still here, just dimmed.
    </CardContent>
    <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-background/60">
      <Spinner className="size-6 text-primary" aria-label="Loading" />
    </div>
  </Card>
);

/**
 * In an empty block
 */
export const Centered = () => (
  <div className="flex h-32 w-full max-w-sm items-center justify-center rounded-lg border border-border">
    <div className="grid justify-items-center gap-2">
      <Spinner className="size-5 text-muted-foreground" aria-label="Loading" />
      <p className="text-sm text-muted-foreground">Loading data…</p>
    </div>
  </div>
);

/**
 * Not inside a button
 *
 * `Button` handles both the spinner and the disabling — dropping a `Spinner`
 * in breaks the layout and the state at once.
 */
export const NotInButton = () => (
  <>
    <Button loading>Saving</Button>
    <Button loading variant="secondary" size="icon" aria-label="Loading" />
  </>
);
