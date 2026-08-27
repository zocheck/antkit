import { useState } from 'react';

import { Button, Card, CardContent, Skeleton } from '@antkit/react';

import type { DemoMeta } from '../lib/types';

export const meta: DemoMeta = {
  imports: ['Skeleton'],
  api: [
    {
      title: 'Skeleton',
      description:
        'A pulsing block in the shape of the content still loading. It has no size of its own — `className` is what gives it one. Reach for `Spinner` when the shape is not known yet, and `Progress` when the progress is.',
      props: [
        {
          name: 'className',
          type: 'string',
          description:
            'Height, width, corner radius. That is the whole API of the component.',
        },
      ],
    },
  ],
};

/**
 * A few lines of text
 *
 * The last line is shorter — real text is too, and that detail is what makes
 * the placeholder read as prose.
 */
export const Lines = () => (
  <div className="grid w-full max-w-sm gap-2">
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-2/3" />
  </div>
);

/**
 * Other shapes
 */
export const Shapes = () => (
  <>
    <Skeleton className="size-10 rounded-full" />
    <Skeleton className="h-9 w-24 rounded-md" />
    <Skeleton className="h-24 w-40 rounded-lg" />
  </>
);

/**
 * A profile card
 *
 * The placeholder should match the layout about to replace it, so the page
 * does not jump when the data lands.
 */
export const ProfileCard = () => (
  <Card className="w-full max-w-sm">
    <CardContent className="flex items-center gap-3">
      <Skeleton className="size-11 rounded-full" />
      <div className="grid flex-1 gap-2">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-3 w-3/4" />
      </div>
    </CardContent>
  </Card>
);

/**
 * A list
 */
export const List = () => (
  <div className="grid w-full max-w-sm gap-3">
    {[0, 1, 2].map((row) => (
      <div key={row} className="flex items-center gap-3">
        <Skeleton className="size-9 rounded-md" />
        <div className="grid flex-1 gap-1.5">
          <Skeleton className="h-3.5 w-2/3" />
          <Skeleton className="h-3 w-1/3" />
        </div>
        <Skeleton className="h-6 w-14 rounded-full" />
      </div>
    ))}
  </div>
);

/**
 * Toggling between the two
 *
 * Compare the placeholder against the real content to see whether the two
 * layouts actually line up.
 */
export const Toggle = () => {
  const [loading, setLoading] = useState(true);

  return (
    <div className="grid w-full max-w-sm gap-3">
      <Button
        size="sm"
        variant="secondary"
        onClick={() => setLoading(!loading)}
      >
        {loading ? 'Show content' : 'Show skeleton'}
      </Button>

      <Card>
        <CardContent className="flex items-center gap-3">
          {loading ? (
            <>
              <Skeleton className="size-11 rounded-full" />
              <div className="grid flex-1 gap-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </>
          ) : (
            <>
              <div className="flex size-11 items-center justify-center rounded-full bg-accent text-sm font-medium text-accent-foreground">
                SC
              </div>
              <div className="min-w-0">
                <p className="font-medium">Sarah Chen</p>
                <p className="truncate text-sm text-muted-foreground">
                  sarah.chen@example.com
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
